#!/usr/bin/env python3
"""
Edalkaup Car Research Pipeline
Searches 6 automotive sites for 8 target models, extracts listings,
filters by year/mileage, deduplicates by VIN, and saves to JSON.

To run inside Hermes environment, this script uses requests directly
since web_search/web_extract are not available outside agent context.
For production use, integrate with agent tool calls or use a headless browser.
"""

import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional

# Add project root to path
SCRIPT_DIR = Path(__file__).parent.resolve()
PROJECT_ROOT = SCRIPT_DIR.parent
sys.path.insert(0, str(PROJECT_ROOT))

OUTPUT_DIR = PROJECT_ROOT / "src" / "data" / "research"
OUTPUT_FILE = OUTPUT_DIR / "listings.json"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Configuration ---

SITES = {
    "cargurus_com": {"domain": "cargurus.com", "currency": "USD", "unit": "miles"},
    "cargurus_ca": {"domain": "cargurus.ca", "currency": "CAD", "unit": "km"},
    "edmunds_com": {"domain": "edmunds.com", "currency": "USD", "unit": "miles"},
    "autotrader_com": {"domain": "autotrader.com", "currency": "USD", "unit": "miles"},
    "autotrader_ca": {"domain": "autotrader.ca", "currency": "CAD", "unit": "km"},
    "cars_com": {"domain": "cars.com", "currency": "USD", "unit": "miles"},
}

TARGET_MODELS = [
    {"make": "Toyota", "model": "Land Cruiser", "trims": []},
    {"make": "Toyota", "model": "Sequoia", "trims": ["TRD Pro"]},
    {"make": "Toyota", "model": "Tundra", "trims": []},
    {"make": "Toyota", "model": "4Runner", "trims": ["TRD Pro"]},
    {"make": "GMC", "model": "Sierra", "trims": ["EV", "AT4X"]},
    {"make": "Chevrolet", "model": "Silverado", "trims": ["EV"]},
    {"make": "Ford", "model": "F-150", "trims": ["Raptor"]},
]

MIN_YEAR = 2024
MAX_MILES = 35000
MAX_KM = 56000


def parse_price(price_str: str, currency: str) -> str:
    """Extract price exactly as shown."""
    if not price_str:
        return ""
    price_str = price_str.strip()
    # Look for $XX,XXX pattern
    match = re.search(r'\$[\d,]+', price_str)
    if match:
        return f"{match.group(0)} {currency}"
    return price_str


def parse_mileage(mileage_str: str) -> tuple[float, str]:
    """Extract numeric mileage and unit."""
    if not mileage_str:
        return 0.0, ""
    s = mileage_str.replace(",", "").replace(" ", "")
    match = re.search(r'(\d+(?:\.\d+)?)', s)
    if not match:
        return 0.0, ""
    val = float(match.group(1))
    unit = "km" if "km" in s.lower() or "kilomet" in s.lower() else "miles"
    return val, unit


def km_to_miles(km: float) -> float:
    return km * 0.621371


def miles_to_km(miles: float) -> float:
    return miles / 0.621371


def slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


# --- Extraction Parsers ---

def extract_cargurus_listings(text: str, site_key: str, make: str, model: str, year: int) -> list[dict]:
    """Parse CarGurus extracted text for listings."""
    listings = []
    currency = SITES[site_key]["currency"]
    unit = SITES[site_key]["unit"]

    # Try table format: | Year | Trim | ... | Price |
    table_rows = re.findall(
        r'\|\s*\*\*(\d{4})\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|',
        text
    )

    for row in table_rows:
        year_str, trim, extra1, mileage_loc, dist_deal, price_notes = row
        listing_year = int(year_str)
        if listing_year < MIN_YEAR:
            continue

        price_match = re.search(r'\$([\d,]+)', price_notes)
        price = f"${price_match.group(1)} {currency}" if price_match else ""

        mileage_val, mileage_unit = parse_mileage(mileage_loc)
        if mileage_unit == "km":
            mileage_miles = km_to_miles(mileage_val)
        else:
            mileage_miles = mileage_val

        if mileage_miles > MAX_MILES:
            continue

        # Extract location from mileage_loc or dist_deal
        location = mileage_loc.strip() if mileage_loc.strip() else dist_deal.strip()
        loc_clean = re.sub(r'\d+\s*mi', '', location).strip()

        color_match = re.search(
            r'(Black|White|Silver|Gray|Blue|Red|Green|Orange|Yellow|Brown|Pearl|Meteor|Ice|Magnetic|Lunar|Charcoal|Boulder|Saddle|Trail|Dust|Java|Agate|Antimatter|Shelter|Riptide|Celestial|Smoked|Mesquite|Blueprint|Wind|Chill)',
            extra1 + price_notes, re.IGNORECASE
        )
        color = color_match.group(0) if color_match else ""

        vin_match = re.search(r'`([A-HJ-NPR-Z0-9]{17})`', text)
        vin = vin_match.group(1) if vin_match else ""

        listings.append({
            "year": listing_year,
            "make": make,
            "model": model,
            "trim": trim.strip(),
            "price": price,
            "price_raw": price_match.group(0) if price_match else "",
            "mileage": f"{int(mileage_val):,} {mileage_unit}" if mileage_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": loc_clean,
            "color": color,
            "vin": vin,
            "source_site": SITES[site_key]["domain"],
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    # Also try structured listing blocks from cargurus
    # Pattern: #### $49,795 | Great Deal | $789/mo est. | Blainville, QC
    block_pattern = re.findall(
        r'####\s*\$?([\d,]+)\s*(?:Great Deal|Good Deal|Fair Deal|High Priced)?\s*(?:\$?([\d,]+)/mo est\.)?\s*([^\n]+)',
        text
    )

    # Extract inline listing details from CarGurus description blocks
    inline_listings = re.findall(
        r'Year:\s*(\d{4})\s*Make:\s*([^\n]+)Model:\s*([^\n]+)(?:Trim:\s*([^\n]+))?.*?'
        r'Exterior colour:\s*([^\n]+).*?Mileage:\s*([\d,]+).*?'
        r'Stock #:\s*([^\n]+).*?VIN:\s*([A-HJ-NPR-Z0-9]{17})',
        text, re.DOTALL | re.IGNORECASE
    )

    for inline in inline_listings:
        yr, mk, md, tr, ext_color, mileage_str, stock, vin = inline
        yr = int(yr.strip())
        if yr < MIN_YEAR:
            continue

        mileage_val = int(mileage_str.replace(",", ""))
        if unit == "km":
            mileage_miles = km_to_miles(mileage_val)
            mileage_display = f"{mileage_val:,} km"
        else:
            mileage_miles = mileage_val
            mileage_display = f"{mileage_val:,} miles"

        if mileage_miles > MAX_MILES:
            continue

        # Find price near this listing
        price_near = re.search(r'####\s*\$?([\d,]+)', text)
        price = f"${price_near.group(1)} {currency}" if price_near else ""

        listings.append({
            "year": yr,
            "make": mk.strip(),
            "model": md.strip(),
            "trim": tr.strip() if tr else "",
            "price": price,
            "price_raw": price_near.group(0) if price_near else "",
            "mileage": mileage_display,
            "mileage_miles": mileage_miles,
            "location": "",
            "color": ext_color.strip(),
            "vin": vin,
            "stock": stock.strip(),
            "source_site": SITES[site_key]["domain"],
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings


def extract_edmunds_listings(text: str, make: str, model: str, year: int) -> list[dict]:
    """Parse Edmunds extracted text for listings."""
    listings = []

    # Edmunds table format: | Price | Location | Miles | Notes |
    table_rows = re.findall(
        r'\|\s*\*\*\$?([\d,]+)\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|',
        text
    )

    for row in table_rows:
        price_part, location, mileage_part, notes = row
        price = f"${price_part} USD"

        mileage_val, mileage_unit = parse_mileage(mileage_part)
        mileage_miles = mileage_val  # Edmunds is always miles

        if mileage_miles > MAX_MILES:
            continue

        color_match = re.search(
            r'(Black|White|Silver|Gray|Grey|Blue|Red|Green|Orange|Yellow|Brown|Pearl|Ice|Meteor|Trail|Dust|Java)',
            notes, re.IGNORECASE
        )
        color = color_match.group(0) if color_match else ""

        vin_match = re.search(r'`([A-HJ-NPR-Z0-9]{17})`', notes)
        vin = vin_match.group(1) if vin_match else ""

        trim_match = re.search(r'(SR5|Limited|Platinum|Capstone|TRD Pro|1794 Edition|1958|Base)', notes, re.IGNORECASE)
        trim = trim_match.group(0) if trim_match else ""

        listings.append({
            "year": year,
            "make": make,
            "model": model,
            "trim": trim,
            "price": price,
            "price_raw": f"${price_part}",
            "mileage": f"{int(mileage_val):,} miles" if mileage_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": location.strip(),
            "color": color,
            "vin": vin,
            "source_site": "edmunds.com",
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings


def extract_autotrader_ca_listings(text: str, make: str, model: str, year: int) -> list[dict]:
    """Parse AutoTrader.ca extracted text."""
    listings = []

    listing_blocks = re.findall(
        r'##\s+(\d{4})\s+([^\n]+)\n\s*\$\s*([\d,\s]+)\n\s*([^\n]+)',
        text
    )

    for block in listing_blocks:
        year_str, title, price_part, details = block
        listing_year = int(year_str)
        if listing_year < MIN_YEAR:
            continue

        price = f"${price_part.strip().replace(',', '').replace(' ', '')} CAD"

        km_match = re.search(r'(\d[\d,]*)\s*km', details, re.IGNORECASE)
        km_val = int(km_match.group(1).replace(',', '')) if km_match else 0
        mileage_miles = km_to_miles(km_val)

        if mileage_miles > MAX_MILES:
            continue

        words = title.split()
        trim = " ".join(words[2:]) if len(words) > 2 else ""

        listings.append({
            "year": listing_year,
            "make": make,
            "model": model,
            "trim": trim,
            "price": price,
            "price_raw": f"${price_part.strip()}",
            "mileage": f"{km_val:,} km" if km_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": "",
            "color": "",
            "vin": "",
            "source_site": "autotrader.ca",
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings


def deduplicate_listings(listings: list[dict]) -> list[dict]:
    """Remove duplicates by VIN, or by price+mileage+location if no VIN."""
    seen_vins = set()
    seen_signatures = set()
    deduped = []

    for listing in listings:
        vin = listing.get("vin", "")
        if vin:
            if vin in seen_vins:
                continue
            seen_vins.add(vin)
            deduped.append(listing)
            continue

        sig = (listing.get("year"), listing.get("price"), listing.get("mileage_miles"), listing.get("location"))
        if sig in seen_signatures:
            continue
        seen_signatures.add(sig)
        deduped.append(listing)

    return deduped


def save_results(listings: list[dict]):
    """Save listings to JSON file."""
    data = {
        "generated_at": datetime.now().isoformat(),
        "total_listings": len(listings),
        "filters": {
            "min_year": MIN_YEAR,
            "max_miles": MAX_MILES,
        },
        "listings": listings,
    }

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Saved {len(listings)} listings to {OUTPUT_FILE}")


def print_summary(listings: list[dict]):
    """Print a summary of findings."""
    print(f"\n{'='*60}")
    print(f"RESEARCH SUMMARY - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"{'='*60}")
    print(f"Total unique listings found: {len(listings)}")

    by_site = {}
    by_model = {}
    for listing in listings:
        site = listing.get("source_site", "unknown")
        model = f"{listing.get('make', '')} {listing.get('model', '')}".strip()
        by_site[site] = by_site.get(site, 0) + 1
        by_model[model] = by_model.get(model, 0) + 1

    print(f"\nBy site:")
    for site, count in sorted(by_site.items(), key=lambda x: -x[1]):
        print(f"  {site}: {count}")

    print(f"\nBy model:")
    for model, count in sorted(by_model.items(), key=lambda x: -x[1]):
        print(f"  {model}: {count}")

    print(f"\n{'='*60}\n")


# --- Agent Integration Interface ---
# These functions are called from the Hermes agent with actual tool results

RESEARCH_QUEUE = []

def queue_searches() -> list[dict]:
    """Generate all search queries to be executed by the agent."""
    global RESEARCH_QUEUE
    RESEARCH_QUEUE = []
    years = [2024, 2025, 2026]

    for model_info in TARGET_MODELS:
        make = model_info["make"]
        model = model_info["model"]
        trims = model_info["trims"]

        for year in years:
            for site_key, site_info in SITES.items():
                if trims:
                    for trim in trims:
                        query = f'site:{site_info["domain"]} "{make} {model} {trim}" {year}'
                        RESEARCH_QUEUE.append({
                            "site": site_key,
                            "query": query,
                            "make": make,
                            "model": model,
                            "trim": trim,
                            "year": year,
                        })
                else:
                    query = f'site:{site_info["domain"]} "{make} {model}" {year}'
                    RESEARCH_QUEUE.append({
                        "site": site_key,
                        "query": query,
                        "make": make,
                        "model": model,
                        "trim": "",
                        "year": year,
                    })

    return RESEARCH_QUEUE


def process_search_results(results: list[dict]) -> list[dict]:
    """Process raw search+extract results from the agent."""
    all_listings = []

    for result in results:
        site = result.get("site", "")
        text = result.get("extracted_text", "")
        url = result.get("url", "")
        make = result.get("make", "")
        model = result.get("model", "")
        year = result.get("year", 0)

        if not text:
            continue

        if "cargurus" in site:
            listings = extract_cargurus_listings(text, site, make, model, year)
        elif "edmunds" in site:
            listings = extract_edmunds_listings(text, make, model, year)
        elif "autotrader_ca" in site:
            listings = extract_autotrader_ca_listings(text, make, model, year)
        else:
            listings = []

        for listing in listings:
            listing["source_url"] = url
            all_listings.append(listing)

    deduped = deduplicate_listings(all_listings)
    save_results(deduped)
    print_summary(deduped)
    return deduped


# --- Manual data entry from agent research ---

def load_manual_research() -> list[dict]:
    """Load manually compiled research data (from agent web searches)."""
    manual_file = OUTPUT_DIR / "manual_input.json"
    if manual_file.exists():
        with open(manual_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []


if __name__ == "__main__":
    print("Edalkaup Car Research Pipeline")
    print("=" * 60)
    print("\nThis script is designed to be run via Hermes agent.")
    print("Generate search plan with:")
    print("  python research_pipeline.py --plan")
    print("\nProcess results with:")
    print("  python research_pipeline.py --process <results.json>")
    print()

    if len(sys.argv) > 1 and sys.argv[1] == "--plan":
        plan = queue_searches()
        plan_file = OUTPUT_DIR / "search_plan.json"
        with open(plan_file, 'w', encoding='utf-8') as f:
            json.dump(plan, f, indent=2)
        print(f"Generated {len(plan)} search queries")
        print(f"Saved plan to {plan_file}")

    elif len(sys.argv) > 1 and sys.argv[1] == "--process" and len(sys.argv) > 2:
        with open(sys.argv[2], 'r', encoding='utf-8') as f:
            results = json.load(f)
        process_search_results(results)

    else:
        # Try to load existing manual input and save
        listings = load_manual_research()
        if listings:
            deduped = deduplicate_listings(listings)
            save_results(deduped)
            print_summary(deduped)
        else:
            print("No manual input found. Run with --plan to generate search queries.")
