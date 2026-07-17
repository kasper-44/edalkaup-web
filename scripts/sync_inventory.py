#!/usr/bin/env python3
"""
Edalkaup daily inventory sync.

  1. FETCH  target models from Auto.dev, per the selected --job's own
            year/mileage/trim/condition filters (see JOBS below).
  2. INSERT new cars into Supabase as status='draft' (hidden until you review &
            publish them in /stjorn). Original USD/CAD price is stored in
            price_original / price_currency; price_isk is pre-filled by the
            mileage-tier auto-pricing below, but nothing goes live automatically.
  3. SOLD   re-check every existing draft/live car's VIN on Auto.dev; if it no
            longer appears, mark status='sold' (hidden, reversible).

Secrets come from ~/.hermes/.env (AUTO_DEV_API_KEY, SUPABASE_SERVICE_ROLE_KEY).

Usage:
  python3 scripts/sync_inventory.py --job sierra-denali-max-range
  python3 scripts/sync_inventory.py --job weekly-watchlist
  python3 scripts/sync_inventory.py --job weekly-watchlist --dry-run  # no writes, just report
  python3 scripts/sync_inventory.py --job weekly-watchlist --limit 5  # cap new inserts (testing)

`--job` selects which named target set (JOBS, below) this run searches — each
job has its own models/trims/year/mileage/condition/per-target result cap, so
different cron schedules can run different searches without touching code.
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

# --- Search targets, grouped into named jobs so different cron schedules can
# run different searches. Per-target fields (all optional):
#   trims          keyword allowlist checked client-side against the listing's
#                  trim string. A plain string matches if that one keyword is
#                  a substring (case-insensitive); a tuple requires ALL its
#                  keywords present (any order) — e.g. ("Denali", "Max Range")
#                  won't match "Extended Range Denali" or "Elevation Extended
#                  Range". Omitted/empty = accept all trims. This is the
#                  authoritative filter — real trim strings vary in word
#                  order and add suffixes Auto.dev's own exact-match `trim`
#                  param would miss (confirmed empirically: GMC lists the
#                  same Denali/Max Range car under both "Denali Max Range"
#                  AND "Max Range Denali" depending on the dealer feed).
#   trim_query     optional list of exact trim strings to ALSO pass
#                  server-side (Auto.dev's `trim` param is an exact match,
#                  not substring). Pure performance: without it, a target on
#                  a huge model (e.g. Ford F-150, ~120k total listings across
#                  all trims) can page through MAX_PAGES_PER_MODEL pages of
#                  mostly-irrelevant trims and never reach a Raptor — with
#                  it, each query is pre-narrowed to ~thousands. `trims`
#                  above still applies afterward as the real filter. Omit
#                  for models small enough to scan directly (confirmed fine
#                  for GMC Sierra EV and Cadillac LYRIQ without it).
#   year_min/year_max     inclusive year bounds. Omitted = no bound.
#   mileage_min/mileage_max   inclusive mile bounds (Auto.dev's API is in
#                  miles even for CAD listings). Omitted = no bound.
#   exclude_new    if True, drop condition == "new" listings client-side
#                  (kept "used"/"certified pre-owned" — Auto.dev's own
#                  condition=used query param excludes CPO too, which isn't
#                  what "no brand new" means, so this filters after fetch).
#   limit          max new (not-already-in-DB) rows to insert for this
#                  target this run. Omitted/0 = unlimited.
JOBS = {
    # Job 1 (Mon/Thu 11:00): Sierra EV Denali Max Range only — Extended Range
    # has a different battery/motor and isn't wanted here. Used/CPO only,
    # 2025-2026, no mileage cap, take everything available.
    "sierra-denali-max-range": [
        {
            "make": "GMC", "model": "Sierra EV",
            "trims": [("Denali", "Max Range")],
            "year_min": 2025, "year_max": 2026,
            "exclude_new": True,
        },
    ],
    # Job 2 (Mon 11:30): weekly watchlist, 3 cars each. Year floors instead of
    # ceilings (2022+ for the petrol trucks) per 2026-07-17 correction; LYRIQ
    # AWD can't be filtered server-side (Auto.dev exposes no drivetrain field)
    # so it's fetched by trim=Luxury only and must be confirmed manually in
    # /stjorn before publishing, same as every other spec field.
    "weekly-watchlist": [
        {"make": "Toyota", "model": "Sequoia", "trims": ["TRD Pro"], "trim_query": ["TRD Pro"],
         "year_min": 2022, "mileage_max": 37282, "limit": 3},
        # Tundra TRD Pro has been hybrid-only since its MY2022 redesign — Auto.dev
        # lists that generation as trim "TRD Pro HV" (vs. plain "TRD Pro" for the
        # pre-2022 gas V8, which year_min=2022 excludes anyway). Both trim_query
        # strings are queried so the exact-match server filter doesn't miss the HV one.
        {"make": "Toyota", "model": "Tundra", "trims": ["TRD Pro"], "trim_query": ["TRD Pro", "TRD Pro HV"],
         "year_min": 2022, "mileage_max": 37282, "limit": 3},
        {"make": "Ford", "model": "F-150", "trims": ["Raptor"], "trim_query": ["Raptor"],
         "year_min": 2022, "mileage_max": 37282, "limit": 3},
        {"make": "Ford", "model": "Bronco", "trims": ["Raptor"], "trim_query": ["Raptor"],
         "year_min": 2022, "mileage_max": 37282, "limit": 3},
        {"make": "Cadillac", "model": "LYRIQ", "trims": ["Luxury"],
         "year_min": 2024, "limit": 3},
    ],
}

MAX_PAGES_PER_MODEL = 15  # up to 300 candidates scanned per target per run
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


def trim_matches(trim_text: str, groups: list) -> bool:
    """True if `trim_text` satisfies any group. A group is either a single
    keyword (matches if present) or a tuple of keywords (matches only if ALL
    are present, any order). Case-insensitive substring match throughout.
    """
    if not groups:
        return True
    trim_lc = (trim_text or "").lower()
    for group in groups:
        keywords = group if isinstance(group, tuple) else (group,)
        if all(kw.lower() in trim_lc for kw in keywords):
            return True
    return False


def fetch_model(target: dict) -> list:
    """Fetch listings for one target's model, filtered by year/mileage/trim
    server-side where possible (Auto.dev supports year_min/year_max/
    mileage_min/mileage_max/trim — the last is an EXACT match) and always by
    `trims`/condition client-side as the authoritative check (see JOBS docs
    above for why: real trim strings vary in word order and suffixes).

    Runs one paginated pass per `trim_query` value if given (each narrowed
    server-side), or a single unfiltered-by-trim pass otherwise.
    """
    make, model = target["make"], target["model"]
    out, seen = [], set()
    base_params = {"make": make, "model": model}
    for key in ("year_min", "year_max", "mileage_min", "mileage_max"):
        if target.get(key) is not None:
            base_params[key] = str(target[key])

    trim_query = target.get("trim_query") or [None]
    for exact_trim in trim_query:
        pass_params = dict(base_params)
        if exact_trim:
            pass_params["trim"] = exact_trim
        for page in range(1, MAX_PAGES_PER_MODEL + 1):
            params = {**pass_params, "page": str(page)}
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
                if target.get("exclude_new") and rec.get("condition") == "new":
                    continue
                if not trim_matches(rec.get("trim") or "", target.get("trims") or []):
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
    ap.add_argument("--job", required=True, choices=sorted(JOBS.keys()),
                     help="named target set to search (see JOBS)")
    ap.add_argument("--dry-run", action="store_true", help="no DB writes")
    ap.add_argument("--limit", type=int, default=0,
                     help="cap new inserts across the whole run (0=all; each "
                          "target's own `limit` still applies per-target)")
    ap.add_argument("--skip-sold", action="store_true", help="skip sold-detection pass")
    args = ap.parse_args()
    targets = JOBS[args.job]

    print(f"=== Edalkaup sync [{args.job}] {datetime.now().isoformat(timespec='seconds')} "
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
    for t in targets:
        recs = fetch_model(t)
        candidates += len(recs)
        fresh = [r for r in recs if r.get("vin") and r["vin"] not in existing_vins]
        # Skip listings with no usable price (noise for manual pricing).
        fresh = [r for r in fresh if r.get("priceUnformatted")]
        target_limit = t.get("limit")
        if target_limit:
            fresh = fresh[:target_limit]
        print(f" {t['make']} {t['model']} {t.get('trims', '')}: "
              f"{len(recs)} candidates, {len(fresh)} new"
              + (f" (capped at {target_limit})" if target_limit else ""))
        for rec in fresh:
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
