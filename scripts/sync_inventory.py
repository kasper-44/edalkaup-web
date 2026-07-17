#!/usr/bin/env python3
"""
Edalkaup daily inventory sync.

  1. FETCH  target models from Auto.dev (year >= MIN_YEAR, mileage <= MAX_MILES).
  2. INSERT new cars into Supabase as status='draft' (hidden until you review &
            publish them in /stjorn). Original USD/CAD price is stored in
            price_original / price_currency; price_isk is pre-filled by the
            mileage-tier auto-pricing below, but nothing goes live automatically.
  3. SOLD   re-check every existing draft/live car's VIN on Auto.dev; if it no
            longer appears, mark status='sold' (hidden, reversible).

Secrets come from ~/.hermes/.env (AUTO_DEV_API_KEY, SUPABASE_SERVICE_ROLE_KEY).

Usage:
  python3 scripts/sync_inventory.py            # full run
  python3 scripts/sync_inventory.py --dry-run  # no writes, just report
  python3 scripts/sync_inventory.py --limit 5  # cap new inserts (testing)
"""
import argparse
import re
import sys
import time
from datetime import datetime, timezone

import requests

sys.path.insert(0, str(__import__("pathlib").Path(__file__).parent))
from _supa import (  # noqa: E402
    autodev_headers, supa_get, supa_insert, supa_patch, SUPABASE_URL, supa_headers,
)
from transform_maps import to_isk_color, meta_for  # noqa: E402

AUTODEV_BASE = "https://auto.dev/api/listings"

# --- Search targets (your 7 models) ---
# Search targets. `trims` = keyword allowlist (case-insensitive substring match
# against the listing trim). Empty list = accept all trims for that model.
TARGETS = [
    {"make": "GMC", "model": "Sierra EV", "trims": ["Denali"]},
]

MIN_YEAR = 2025
MAX_MILES = 35000
MAX_PAGES_PER_MODEL = 5   # up to 100 candidates/day
REQ_PAUSE = 0.4           # be gentle on the API

# --- Auto-pricing (miles → ISK) ---
# Cars are pre-priced automatically based on mileage, as a starting point for
# the owner to adjust in /stjorn — they still land as status='draft'.
PRICE_TIERS = [
    (10000, 16890000),    # under 10,000 miles → 16.890.000 kr.
    (25000, 16590000),    # 10,000–25,000 miles → 16.590.000 kr.
    (35000, 16290000),    # 25,000–35,000 miles → 16.290.000 kr.
]

def price_for_miles(miles: int) -> int:
    """Return ISK price based on mileage bracket."""
    for threshold, price in PRICE_TIERS:
        if miles < threshold:
            return price
    return PRICE_TIERS[-1][1]  # fallback: lowest tier


def fetch_model(make: str, model: str, trims: list) -> list:
    """Fetch listings for one model across a few pages, filtered server-side.

    `trims` is a case-insensitive keyword allowlist; empty = accept all.
    """
    out, seen = [], set()
    trims_lc = [t.lower() for t in (trims or [])]
    for page in range(1, MAX_PAGES_PER_MODEL + 1):
        params = {
            "make": make, "model": model,
            "year_min": str(MIN_YEAR), "mileage_max": str(MAX_MILES),
            "page": str(page),
        }
        try:
            r = requests.get(AUTODEV_BASE, headers=autodev_headers(), params=params, timeout=30)
            r.raise_for_status()
            recs = r.json().get("records", [])
        except Exception as e:
            print(f"   ! fetch error {make} {model} p{page}: {e}")
            break
        if not recs:
            break
        for rec in recs:
            vin = rec.get("vin")
            if not vin or vin in seen:
                continue
            # trim allowlist
            if trims_lc:
                rec_trim = (rec.get("trim") or "").lower()
                if not any(t in rec_trim for t in trims_lc):
                    continue
            seen.add(vin)
            out.append(rec)
        time.sleep(REQ_PAUSE)
    return out


def vin_active(vin: str) -> bool:
    """True if the VIN still appears on Auto.dev (i.e. not sold)."""
    try:
        r = requests.get(AUTODEV_BASE, headers=autodev_headers(),
                         params={"vin": vin}, timeout=30)
        r.raise_for_status()
        return r.json().get("totalCount", 0) > 0
    except Exception as e:
        print(f"   ! vin check error {vin}: {e}")
        return True  # fail-safe: don't delete on a transient error


def to_row(rec: dict) -> dict:
    """Map an Auto.dev record -> Supabase cars row (auto-priced, published live)."""
    make = rec.get("make", "")
    model = rec.get("model", "")
    year = rec.get("year")
    trim = rec.get("trim") or ""
    vin = rec.get("vin") or ""
    meta = meta_for(make, model, trim)

    price_num = rec.get("priceUnformatted") or 0
    currency = "CAD" if "CAD" in str(rec.get("price", "")) else "USD"

    miles = rec.get("mileageUnformatted") or 0
    mileage_km = int(miles * 1.60934)
    isk_price = price_for_miles(miles)

    ext_color_en = rec.get("displayColor") or ""
    photos = [p.split("?")[0] for p in (rec.get("photoUrls") or []) if p][:20]
    if not photos and rec.get("primaryPhotoUrl"):
        photos = [rec["primaryPhotoUrl"].split("?")[0]]

    city = rec.get("city") or ""
    state = rec.get("state") or ""
    loc = ", ".join([x for x in (city, state) if x])
    dealer = rec.get("dealerName") or ""
    cur_sym = "$" if currency == "USD" else "CAD $"

    # Detect electric vehicles — adds the Orkusjóði subsidy note (label only, no price math).
    is_ev = "EV" in model.upper() or "el" in model.lower() or meta["fuel_type"] == "Rafbíll"
    orkusjodi = "Styrkhæfur frá Orkusjóði\n" if is_ev else ""

    desc = (
        f"{orkusjodi}"
        f"VIN: {vin}\n"
        f"Original price: {cur_sym}{price_num:,}\n"
        f"Mileage: {miles:,} miles\n"
        f"Dealer: {dealer}, {loc}"
    )

    return {
        "title": f"{year} {make} {model} {trim}".strip() + f" [{vin}]",
        "make": make, "model": model, "year": year, "trim": trim,
        "vin": vin,
        "price_isk": isk_price,                # auto-priced by mileage
        "price_original": price_num,
        "price_currency": currency,
        "mileage_km": mileage_km,
        "fuel_type": meta["fuel_type"], "transmission": meta["transmission"],
        "body_type": meta["body_type"], "drivetrain": meta["drivetrain"],
        "engine": meta["engine"], "doors": meta["doors"], "seats": meta["seats"],
        "battery_kwh": meta.get("battery_kwh"), "horsepower_hp": meta.get("horsepower_hp"),
        "range_km": meta.get("range_km"), "towing_kg": meta.get("towing_kg"),
        "exterior_colour": ext_color_en or None,
        "colour": to_isk_color(ext_color_en),
        "interior_colour": None,
        "description_is": desc,
        "images": photos,
        "status": "draft",                     # never auto-published — owner reviews & flips to live in /stjorn
        "location_country": "CA" if currency == "CAD" else "US",
        "source_site": "auto.dev",
        "source_url": None,
        "last_seen_at": datetime.now(timezone.utc).isoformat(),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="no DB writes")
    ap.add_argument("--limit", type=int, default=0, help="cap new inserts (0=all)")
    ap.add_argument("--skip-sold", action="store_true", help="skip sold-detection pass")
    args = ap.parse_args()

    print(f"=== Edalkaup sync {datetime.now().isoformat(timespec='seconds')} "
          f"{'(DRY RUN)' if args.dry_run else ''} ===")

    # Existing VINs in DB so we only insert genuinely new cars.
    # Backfill the vin column from description_is for legacy rows that lack it.
    existing = supa_get({"select": "id,vin,status,description_is"})
    backfilled = 0
    for r in existing:
        if not r.get("vin"):
            m = re.search(r'VIN:\s*([A-HJ-NPR-Z0-9]{11,17})', r.get("description_is") or "")
            if m:
                r["vin"] = m.group(1)
                if not args.dry_run:
                    supa_patch(r["id"], {"vin": m.group(1)})
                backfilled += 1
    existing_vins = {r["vin"] for r in existing if r.get("vin")}
    print(f"DB currently has {len(existing)} cars ({len(existing_vins)} with VIN; "
          f"backfilled {backfilled}).")

    # --- 1+2: fetch + insert new ---
    added, candidates = 0, 0
    new_rows = []
    for t in TARGETS:
        recs = fetch_model(t["make"], t["model"], t.get("trims", []))
        candidates += len(recs)
        fresh = [r for r in recs if r.get("vin") and r["vin"] not in existing_vins]
        print(f" {t['make']} {t['model']}: {len(recs)} candidates, {len(fresh)} new")
        for rec in fresh:
            # Skip listings with no usable price (noise for manual pricing).
            if not (rec.get("priceUnformatted") or 0):
                continue
            new_rows.append(to_row(rec))
            existing_vins.add(rec["vin"])

    if args.limit:
        new_rows = new_rows[: args.limit]

    if new_rows and not args.dry_run:
        # insert in chunks of 50
        for i in range(0, len(new_rows), 50):
            inserted = supa_insert(new_rows[i:i + 50])
            added += len(inserted)
    elif args.dry_run:
        added = len(new_rows)

    # --- 3: sold-detection ---
    sold = 0
    if not args.skip_sold:
        active = [r for r in existing if r.get("status") in ("draft", "live") and r.get("vin")]
        print(f"\nChecking {len(active)} active listings for sold status...")
        for r in active:
            if not vin_active(r["vin"]):
                print(f"   SOLD: {r['vin']}")
                if not args.dry_run:
                    supa_patch(r["id"], {"status": "sold"})
                sold += 1
            time.sleep(REQ_PAUSE)

    print(f"\n=== SUMMARY ===")
    print(f"Candidates scanned : {candidates}")
    print(f"New cars added     : {added} (status=draft)")
    print(f"Marked sold        : {sold}")
    print(f"{'(dry run — no writes made)' if args.dry_run else 'Done.'}")


if __name__ == "__main__":
    main()
