#!/usr/bin/env python3
"""
Photo privacy filter + cleaner for Edalkaup.

For each raw Auto.dev photo, asks a vision model to classify it:
  CLEAN    - no dealership branding anywhere. Kept as-is.
  FIXABLE  - branding is confined to a small area (a dealer-branded plate/
             plate frame, a text/logo banner overlay, a small dealer decal)
             that can be blurred out without ruining the photo. We blur just
             that region (Pillow, local — no generative AI) and re-upload the
             result to Supabase Storage (`car-images` bucket).
  UNUSABLE - branding is too pervasive to fix with a small blur (dealership
             building/lot fills the frame, other cars for sale visible,
             etc). Dropped.

The vehicle manufacturer's own badge (e.g. a cast "GMC" nameplate on the
tailgate) is explicitly never treated as branding — it's part of the car.

From the CLEAN + FIXABLE results, keeps the 10 cleanest photos (CLEAN ones
ranked ahead of blurred FIXABLE ones), preserving original order within each
group.

Reversibility: before modifying, the original image list is saved to
`images_original` (added if missing). Re-running is safe (idempotent-ish): it
always re-filters from `images_original` when present.

Two vision backends:
  - OpenAI (set OPENAI_API_KEY or VISION_TOOLS_OPENAI_KEY in ~/.hermes/.env) — fast batch.
  - Otherwise Gemini (GEMINI_API_KEY / GOOGLE_API_KEY).

Usage:
  python3 scripts/filter_photos.py --limit 20         # process up to 20 unfiltered cars
  python3 scripts/filter_photos.py --car <uuid>       # one car
  python3 scripts/filter_photos.py --dry-run          # classify, don't write
"""
from __future__ import annotations

import argparse
import io
import json
import sys
import time
from pathlib import Path

import requests
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).parent))
from _supa import supa_get, supa_patch, _ENV, SUPABASE_URL, SERVICE_KEY  # noqa: E402

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

MAX_PHOTOS = 10
STORAGE_BUCKET = "car-images"
BLUR_RADIUS = 18
REGION_PAD_FRACTION = 0.12       # pad each region by 12% so edges are fully covered
MAX_REGION_FRACTION = 0.35       # a "FIXABLE" region bigger than this is actually UNUSABLE
MIN_REGION_PX = 8                # reject degenerate/near-zero boxes (e.g. a model that
                                  # replies with 0-1 fractional coords instead of 0-1000 —
                                  # a zero-size crop segfaults Pillow's C blur, not a
                                  # catchable Python exception, so this must be checked
                                  # *before* any PIL call, not just handled with try/except)

PROMPT = (
    "You audit a used-car photo for a reseller who must hide where the car came from "
    "(a US dealership) before the photo is used in a listing.\n\n"
    "Respond with STRICT JSON only — no markdown, no prose, no code fences:\n"
    '{"verdict": "CLEAN" | "FIXABLE" | "UNUSABLE", "regions": [{"x_min": 0-1000, '
    '"y_min": 0-1000, "x_max": 0-1000, "y_max": 0-1000}, ...]}\n\n'
    "Coordinates are normalized 0-1000 over the image width/height (top-left origin).\n\n"
    "CLEAN = no dealership branding visible anywhere: no dealer name, logo, banner, "
    "phone number, website, address, window/windshield sticker, dealer-branded plate "
    "or plate frame, dealership building or signage. The VEHICLE MANUFACTURER'S OWN "
    "badge or nameplate (e.g. a \"GMC\", \"Chevrolet\", \"Toyota\" emblem cast into the "
    "body) is NOT branding — never flag it, never include it in a region.\n\n"
    "FIXABLE = the ONLY branding present is confined to one or more small areas — a "
    "dealer-branded license plate or plate frame, a text/logo banner overlay burned "
    "into the photo, or a small dealer decal or sign — and blurring just those areas "
    "would leave a natural-looking, still-usable photo of the car. List one region per "
    "distinct branded area. Each region must tightly bound ONLY the branded element "
    "itself — never the vehicle body, wheels, glass, or manufacturer badge.\n\n"
    "UNUSABLE = branding can't be removed with a small blur without ruining the photo: "
    "a dealership building or lot fills a large part of the frame, other cars for sale "
    "are visible, showroom interior is the background, or branding is spread across "
    "too much of the image to box out.\n\n"
    "When unsure between FIXABLE and UNUSABLE, choose UNUSABLE — a dropped photo is "
    "safer than a bad blur. When a photo is CLEAN, return an empty regions array."
)


def _parse_verdict(raw: str) -> dict:
    """Parse the model's JSON reply; fail safe to UNUSABLE on any parse problem."""
    try:
        text = raw.strip()
        if text.startswith("```"):
            text = text.strip("`")
            if text.lower().startswith("json"):
                text = text[4:]
        data = json.loads(text)
        verdict = str(data.get("verdict", "UNUSABLE")).upper()
        if verdict not in ("CLEAN", "FIXABLE", "UNUSABLE"):
            verdict = "UNUSABLE"
        regions = data.get("regions") or []
        if not isinstance(regions, list):
            regions = []
        return {"verdict": verdict, "regions": regions}
    except Exception:
        return {"verdict": "UNUSABLE", "regions": []}


def classify_openai(url: str) -> dict:
    """Return {"verdict": ..., "regions": [...]} for one image URL via OpenAI vision."""
    body = {
        "model": VISION_MODEL,
        "max_tokens": 500,
        "response_format": {"type": "json_object"},
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
    content = r.json()["choices"][0]["message"]["content"]
    return _parse_verdict(content)


def classify_gemini(url: str) -> dict:
    """Return {"verdict": ..., "regions": [...]} for one image URL via Google Gemini."""
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
        "generationConfig": {"maxOutputTokens": 500, "temperature": 0,
                              "responseMimeType": "application/json"},
    }
    r = requests.post(GEMINI_URL, params={"key": GEMINI_KEY}, json=body, timeout=60)
    r.raise_for_status()
    content = r.json()["candidates"][0]["content"]["parts"][0]["text"]
    return _parse_verdict(content)


def classify(url: str) -> dict:
    return classify_gemini(url) if BACKEND == "gemini" else classify_openai(url)


class RateLimited(Exception):
    """Raised when the vision API daily/again-later quota is hit."""


def blur_regions(img_bytes: bytes, regions: list) -> bytes | None:
    """Blur the given normalized (0-1000) regions in-place. Returns None if any
    region is implausibly large (treat as UNUSABLE rather than risk a bad edit)."""
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    w, h = im.size
    img_area = w * h
    touched = False
    for r in regions:
        try:
            x0 = float(r["x_min"]) / 1000 * w
            y0 = float(r["y_min"]) / 1000 * h
            x1 = float(r["x_max"]) / 1000 * w
            y1 = float(r["y_max"]) / 1000 * h
        except (KeyError, TypeError, ValueError):
            continue
        x0, x1 = sorted((max(0, x0), min(w, x1)))
        y0, y1 = sorted((max(0, y0), min(h, y1)))
        if x1 - x0 < MIN_REGION_PX or y1 - y0 < MIN_REGION_PX:
            continue  # degenerate box (e.g. model used a 0-1 scale, not 0-1000) — skip it
        if (x1 - x0) * (y1 - y0) > MAX_REGION_FRACTION * img_area:
            return None  # bbox implausibly large — caller treats photo as UNUSABLE
        pad_x, pad_y = (x1 - x0) * REGION_PAD_FRACTION, (y1 - y0) * REGION_PAD_FRACTION
        x0, y0 = max(0, x0 - pad_x), max(0, y0 - pad_y)
        x1, y1 = min(w, x1 + pad_x), min(h, y1 + pad_y)
        box = (int(x0), int(y0), int(x1), int(y1))
        if box[2] - box[0] < MIN_REGION_PX or box[3] - box[1] < MIN_REGION_PX:
            continue  # padding/clamping/rounding still left it degenerate — skip it
        crop = im.crop(box).filter(ImageFilter.GaussianBlur(radius=BLUR_RADIUS))
        im.paste(crop, box)
        touched = True
    if not touched:
        return None
    out = io.BytesIO()
    im.save(out, format="JPEG", quality=90)
    return out.getvalue()


def upload_to_storage(vin: str, idx: int, img_bytes: bytes) -> str:
    """Upload a blurred photo to the public `car-images` bucket, return its public URL."""
    path = f"{vin}/photo_{idx:02d}.jpg"
    r = requests.post(
        f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{path}",
        headers={
            "apikey": SERVICE_KEY,
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "image/jpeg",
            "x-upsert": "true",
        },
        data=img_bytes,
        timeout=40,
    )
    r.raise_for_status()
    return f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/{path}"


def process_car(car: dict, dry_run: bool) -> dict:
    original = car.get("images_original") or car.get("images") or []
    vin = car.get("vin") or car["id"]

    clean_urls, fixed_urls = [], []
    dropped = 0
    fixed_idx = 0

    for url in original:
        try:
            verdict = classify(url)
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429:
                raise RateLimited() from e
            print(f"    ! error on {url[:60]}: {e}; dropping (fail-safe)")
            dropped += 1
            continue
        except Exception as e:
            print(f"    ! error on {url[:60]}: {e}; dropping (fail-safe)")
            dropped += 1
            continue

        v = verdict["verdict"]
        if v == "CLEAN":
            clean_urls.append(url)
        elif v == "FIXABLE" and verdict["regions"]:
            try:
                img_bytes = requests.get(url, timeout=30).content
                blurred = blur_regions(img_bytes, verdict["regions"])
                if blurred is None:
                    dropped += 1
                else:
                    if not dry_run:
                        fixed_urls.append(upload_to_storage(vin, fixed_idx, blurred))
                    else:
                        fixed_urls.append(f"{url}  [would blur+upload]")
                    fixed_idx += 1
            except Exception as e:
                print(f"    ! blur/upload error on {url[:60]}: {e}; dropping (fail-safe)")
                dropped += 1
        else:
            dropped += 1
        time.sleep(0.15)

    # Cleanest-first: untouched CLEAN photos ranked ahead of blurred FIXABLE ones.
    ranked = clean_urls + fixed_urls
    final = ranked[:MAX_PHOTOS]
    dropped += max(0, len(ranked) - MAX_PHOTOS)

    result = {
        "kept": len(final), "dropped": dropped, "total": len(original),
        "clean": len(clean_urls), "fixed": len(fixed_urls),
    }
    if not dry_run:
        update = {"images": final}
        if not car.get("images_original"):
            update["images_original"] = original
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
    print(f"Vision backend: {BACKEND} | target photos per car: {MAX_PHOTOS}")

    if args.car:
        cars = supa_get({"select": "id,make,model,year,vin,images,images_original", "id": f"eq.{args.car}"})
    else:
        # cars not yet filtered (no images_original) with auto.dev photos
        cars = supa_get({"select": "id,make,model,year,vin,images,images_original,source_site"})
        cars = [c for c in cars if c.get("source_site") == "auto.dev"
                and c.get("images") and not c.get("images_original")][: args.limit]

    print(f"Filtering {len(cars)} cars {'(DRY RUN)' if args.dry_run else ''}...")
    tot_kept = tot_clean = tot_fixed = tot_drop = done = 0
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
        tot_clean += res["clean"]
        tot_fixed += res["fixed"]
        tot_drop += res["dropped"]
        if res["kept"] == 0:
            flagged.append(c["id"])
        print(f"  {c['year']} {c['make']} {c['model']}: kept {res['kept']}/{res['total']} "
              f"(clean {res['clean']}, blurred {res['fixed']}), dropped {res['dropped']}")

    print(f"\n=== Cars filtered this run: {done}/{len(cars)} | "
          f"kept {tot_kept} (clean {tot_clean}, blurred {tot_fixed}), dropped {tot_drop} ===")
    if stopped_early:
        print("Run again later (or wait for the nightly cron) to finish the rest.")
    if flagged:
        print(f"⚠️  {len(flagged)} cars left with 0 usable photos (review manually): {flagged}")


if __name__ == "__main__":
    main()
