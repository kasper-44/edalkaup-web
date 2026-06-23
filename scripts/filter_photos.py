#!/usr/bin/env python3
"""
Photo privacy filter for Edalkaup.

Classifies each car photo as CLEAN or BRANDED (dealer name/logo/banner/website/
phone/address/plate frame/window sticker/dealership signage) and keeps only the
CLEAN ones in the car's `images` array — so nothing traceable to the source US
dealer is ever shown publicly.

Reversibility: before modifying, the original image list is saved to
`images_original` (added if missing). Re-running is safe (idempotent-ish): it
always re-filters from `images_original` when present.

Two vision backends:
  - OpenAI (set OPENAI_API_KEY or VISION_TOOLS_OPENAI_KEY in ~/.hermes/.env) — fast batch.
  - Otherwise prints the photos needing classification for manual/session handling.

Usage:
  python3 scripts/filter_photos.py --limit 20         # process up to 20 unfiltered cars
  python3 scripts/filter_photos.py --car <uuid>       # one car
  python3 scripts/filter_photos.py --dry-run          # classify, don't write
"""
import argparse
import base64
import json
import sys
import time
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from _supa import supa_get, supa_patch, _ENV  # noqa: E402

OPENAI_KEY = _ENV.get("OPENAI_API_KEY") or _ENV.get("VISION_TOOLS_OPENAI_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"
VISION_MODEL = "gpt-4o-mini"

GEMINI_KEY = _ENV.get("GEMINI_API_KEY") or _ENV.get("GOOGLE_API_KEY")
GEMINI_MODEL = "gemini-2.0-flash"
GEMINI_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)
# Prefer OpenAI (already funded); fall back to Gemini if only that key is present.
BACKEND = "openai" if OPENAI_KEY else ("gemini" if GEMINI_KEY else None)

PROMPT = (
    "You audit a used-car photo for a reseller who must hide where the car came from. "
    "Reply with ONE word: BRANDED or CLEAN.\n\n"
    "BRANDED = the photo shows it was taken at a dealership / sales lot in ANY way: "
    "a dealership building or signage (even a generic brand sign like 'CHEVROLET' / "
    "'TOYOTA' on a building), a banner or text overlay, a website, phone number, "
    "address, a license-plate frame with any text, a window/windshield sticker, rows "
    "of other cars for sale, or showroom interior background.\n\n"
    "CLEAN = the photo is ONLY the car with no dealership context: a studio shot "
    "(plain white/grey background), the vehicle interior (dashboard, seats, screen), "
    "or a tight exterior detail (wheel, headlight, badge, grille) with no building, "
    "no signage, no other cars, no lot visible.\n\n"
    "When unsure, and the photo is a plain studio/interior/detail close-up with no "
    "background scenery, choose CLEAN. If any outdoor lot, building, or sign is "
    "visible, choose BRANDED. Reply ONLY BRANDED or CLEAN."
)


def classify_openai(url: str) -> str:
    """Return 'CLEAN' or 'BRANDED' for one image URL via OpenAI vision."""
    body = {
        "model": VISION_MODEL,
        "max_tokens": 3,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "text", "text": PROMPT},
                {"type": "image_url", "image_url": {"url": url, "detail": "high"}},
            ],
        }],
    }
    r = requests.post(OPENAI_URL, headers={"Authorization": f"Bearer {OPENAI_KEY}"},
                     json=body, timeout=40)
    r.raise_for_status()
    ans = r.json()["choices"][0]["message"]["content"].strip().upper()
    return "BRANDED" if "BRAND" in ans else "CLEAN"


def classify_gemini(url: str) -> str:
    """Return 'CLEAN' or 'BRANDED' for one image URL via Google Gemini."""
    # Fetch the image bytes and inline as base64 (Gemini needs inline data).
    img = requests.get(url, timeout=40)
    img.raise_for_status()
    import base64 as _b64
    b64 = _b64.b64encode(img.content).decode()
    mime = img.headers.get("Content-Type", "image/jpeg").split(";")[0]
    body = {
        "contents": [{
            "parts": [
                {"text": PROMPT},
                {"inline_data": {"mime_type": mime, "data": b64}},
            ]
        }],
        "generationConfig": {"maxOutputTokens": 5, "temperature": 0},
    }
    r = requests.post(GEMINI_URL, params={"key": GEMINI_KEY}, json=body, timeout=60)
    r.raise_for_status()
    ans = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip().upper()
    return "BRANDED" if "BRAND" in ans else "CLEAN"


def classify(url: str) -> str:
    return classify_gemini(url) if BACKEND == "gemini" else classify_openai(url)


class RateLimited(Exception):
    """Raised when the vision API daily/again-later quota is hit."""


def process_car(car: dict, dry_run: bool) -> dict:
    original = car.get("images_original") or car.get("images") or []
    kept, dropped = [], []
    for url in original:
        try:
            verdict = classify(url)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                # Quota/rate limit — abort cleanly so we never mis-drop photos.
                raise RateLimited() from e
            print(f"    ! error on {url[:60]}: {e}; dropping (fail-safe)")
            dropped.append(url)
            continue
        except Exception as e:
            print(f"    ! error on {url[:60]}: {e}; dropping (fail-safe)")
            dropped.append(url)
            continue
        (kept if verdict == "CLEAN" else dropped).append(url)
        time.sleep(0.15)

    result = {"kept": len(kept), "dropped": len(dropped), "total": len(original)}
    if not dry_run:
        update = {"images": kept}
        if not car.get("images_original"):
            update["images_original"] = original  # preserve once
        supa_patch(car["id"], update)
    return result


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=20)
    ap.add_argument("--car", type=str, default="")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not BACKEND:
        print("No vision key in ~/.hermes/.env (need GEMINI_API_KEY/GOOGLE_API_KEY or OPENAI_API_KEY).")
        sys.exit(1)
    print(f"Vision backend: {BACKEND}")

    if args.car:
        cars = supa_get({"select": "id,make,model,year,images,images_original", "id": f"eq.{args.car}"})
    else:
        # cars not yet filtered (no images_original) with auto.dev photos
        cars = supa_get({"select": "id,make,model,year,images,images_original,source_site"})
        cars = [c for c in cars if c.get("source_site") == "auto.dev"
                and c.get("images") and not c.get("images_original")][: args.limit]

    print(f"Filtering {len(cars)} cars {'(DRY RUN)' if args.dry_run else ''}...")
    tot_kept = tot_drop = done = 0
    flagged = []
    stopped_early = False
    for c in cars:
        try:
            res = process_car(c, args.dry_run)
        except RateLimited:
            print("\n⏳ Vision API daily/rate quota reached — stopping cleanly. "
                  "Remaining cars keep their original photos and will be processed next run.")
            stopped_early = True
            break
        done += 1
        tot_kept += res["kept"]
        tot_drop += res["dropped"]
        if res["kept"] == 0:
            flagged.append(c["id"])
        print(f"  {c['year']} {c['make']} {c['model']}: kept {res['kept']}/{res['total']}, dropped {res['dropped']}")

    print(f"\n=== Cars filtered this run: {done}/{len(cars)} | kept {tot_kept}, dropped {tot_drop} ===")
    if stopped_early:
        print("Run again later (or wait for the nightly cron) to finish the rest.")
    if flagged:
        print(f"⚠️  {len(flagged)} cars left with 0 clean photos (review manually): {flagged}")


if __name__ == "__main__":
    main()
