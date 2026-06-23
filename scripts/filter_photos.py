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

PROMPT = (
    "You are auditing a used-car photo for a reseller who must hide the original "
    "selling dealer. Answer with a single word: BRANDED or CLEAN.\n"
    "Answer BRANDED if the image contains ANY of: a dealership name or logo, a "
    "banner/overlay with text, a website URL, a phone number, a street address, a "
    "license-plate frame with dealer text, a windshield/window dealer sticker, or "
    "clearly readable dealership building signage in the background.\n"
    "Answer CLEAN if it is just the car (studio shot, plain background, interior, "
    "or a generic lot with no readable dealer identifiers).\n"
    "Reply with ONLY the word BRANDED or CLEAN."
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
                {"type": "image_url", "image_url": {"url": url, "detail": "low"}},
            ],
        }],
    }
    r = requests.post(OPENAI_URL, headers={"Authorization": f"Bearer {OPENAI_KEY}"},
                     json=body, timeout=40)
    r.raise_for_status()
    ans = r.json()["choices"][0]["message"]["content"].strip().upper()
    return "BRANDED" if "BRAND" in ans else "CLEAN"


def process_car(car: dict, dry_run: bool) -> dict:
    original = car.get("images_original") or car.get("images") or []
    kept, dropped = [], []
    for url in original:
        try:
            verdict = classify_openai(url)
        except Exception as e:
            print(f"    ! error on {url[:60]}: {e}; keeping by default? NO -> skip-drop")
            # On error, be safe: drop it (never risk showing a branded one)
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

    if not OPENAI_KEY:
        print("No OPENAI_API_KEY / VISION_TOOLS_OPENAI_KEY in ~/.hermes/.env.")
        print("Add one to enable automated batch filtering (Option B).")
        sys.exit(1)

    if args.car:
        cars = supa_get({"select": "id,make,model,year,images,images_original", "id": f"eq.{args.car}"})
    else:
        # cars not yet filtered (no images_original) with auto.dev photos
        cars = supa_get({"select": "id,make,model,year,images,images_original,source_site"})
        cars = [c for c in cars if c.get("source_site") == "auto.dev"
                and c.get("images") and not c.get("images_original")][: args.limit]

    print(f"Filtering {len(cars)} cars {'(DRY RUN)' if args.dry_run else ''}...")
    tot_kept = tot_drop = 0
    flagged = []
    for c in cars:
        res = process_car(c, args.dry_run)
        tot_kept += res["kept"]
        tot_drop += res["dropped"]
        if res["kept"] == 0:
            flagged.append(c["id"])
        print(f"  {c['year']} {c['make']} {c['model']}: kept {res['kept']}/{res['total']}, dropped {res['dropped']}")

    print(f"\n=== TOTAL kept {tot_kept}, dropped {tot_drop} ===")
    if flagged:
        print(f"⚠️  {len(flagged)} cars left with 0 clean photos (review manually): {flagged}")


if __name__ == "__main__":
    main()
