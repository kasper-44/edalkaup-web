#!/usr/bin/env python3
"""
Research script for Edalkaup car imports.
Searches autotrader.com, autotrader.ca, cars.com, cargurus.com, cargurus.ca, edmunds.com
for specific car models and extracts listing data.

Target cars (2024+ only):
- Toyota Land Cruiser
- Toyota Sequoia TRD Pro
- Toyota Tundra (any trim)
- Toyota 4Runner TRD Pro
- GMC Sierra EV
- GMC Sierra AT4X
- Chevrolet Silverado EV
- Ford F-150 Raptor

Filters:
- Year: 2024 or newer
- Mileage: under 35,000 miles (or ~56,000 km for Canadian sites)
- No duplicate VINs
- Collect: make/model/trim/year, original price as listed, mileage + unit, exterior/interior color, VIN, dealer name + city, source site + listing URL

Output: JSON file with all matching listings.
"""

import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path

# --- Configuration ---

SITES = {
    "autotrader_com": {
        "domain": "autotrader.com",
        "currency": "USD",
        "distance_unit": "miles",
        "search_url_template": "https://www.autotrader.com/cars-for-sale/used-cars/{year}/{make}/{model}",
    },
    "autotrader_ca": {
        "domain": "autotrader.ca",
        "currency": "CAD",
        "distance_unit": "km",
        "search_url_template": "https://www.autotrader.ca/cars/{make}/{model}/",
    },
    "cars_com": {
        "domain": "cars.com",
        "currency": "USD",
        "distance_unit": "miles",
        "search_url_template": "https://www.cars.com/shopping/{make}-{model}-{year}/",
    },
    "cargurus_com": {
        "domain": "cargurus.com",
        "currency": "USD",
        "distance_unit": "miles",
        "search_url_template": "https://www.cargurus.com/Cars/l-Used-{year}-{make}-{model}-cXXXX",
    },
    "cargurus_ca": {
        "domain": "cargurus.ca",
        "currency": "CAD",
        "distance_unit": "km",
        "search_url_template": "https://www.cargurus.ca/Cars/l-Used-{year}-{make}-{model}-cXXXX",
    },
    "edmunds_com": {
        "domain": "edmunds.com",
        "currency": "USD",
        "distance_unit": "miles",
        "search_url_template": "https://www.edmunds.com/{make}/{model}/{year}/for-sale/",
    },
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
MAX_KM = 56000  # ~35,000 miles

OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data" / "research"
OUTPUT_FILE = OUTPUT_DIR / "listings.json"

# Ensure output dir exists
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# --- Helpers ---

def clean_price(price_str: str) -> str:
    """Keep price exactly as shown, just clean whitespace."""
    if not price_str:
        return ""
    return price_str.strip()

def parse_mileage(mileage_str: str) -> tuple[float, str]:
    """Extract numeric mileage and unit from string."""
    if not mileage_str:
        return 0.0, ""
    # Remove commas
    s = mileage_str.replace(",", "").replace(" ", "")
    # Find number
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

# --- Data Extraction from Extracted Text ---

def extract_cargurus_listings(text: str, site_key: str) -> list[dict]:
    """Extract listings from CarGurus extracted text."""
    listings = []
    currency = SITES[site_key]["currency"]
    distance_unit = SITES[site_key]["distance_unit"]

    # CarGurus listings are often in tables or have structured blocks
    # Pattern for price lines: | **2024** | **$52,969** | 30,865 | Massapequa, NY |
    table_rows = re.findall(
        r'\|\s*\*\*(\d{4})\*\*\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|',
        text
    )

    for row in table_rows:
        year_str, price_part, mileage_part, location, dist_deal, extra = row
        year = int(year_str)
        if year < MIN_YEAR:
            continue

        price_match = re.search(r'\$([\d,]+)', price_part)
        price = f"${price_match.group(1)} {currency}" if price_match else ""

        mileage_val, mileage_unit = parse_mileage(mileage_part)
        if mileage_unit == "km":
            mileage_miles = km_to_miles(mileage_val)
        else:
            mileage_miles = mileage_val

        if mileage_miles > MAX_MILES:
            continue

        # Extract color from extra if available
        color_match = re.search(r'(Black|White|Silver|Gray|Blue|Red|Green|Orange|Yellow|Brown|Pearl|Meteor|Ice|Magnetic|Lunar|Charcoal|Boulder|Saddle|Trail|Dust|Java|Agate|Antimatter|Shelter)', extra, re.IGNORECASE)
        color = color_match.group(0) if color_match else ""

        # Extract VIN from extra
        vin_match = re.search(r'`([A-HJ-NPR-Z0-9]{17})`', extra)
        vin = vin_match.group(1) if vin_match else ""

        # Extract stock #
        stock_match = re.search(r'Stock\s*#?:?\s*([A-Z0-9\-]+)', extra, re.IGNORECASE)
        stock = stock_match.group(1) if stock_match else ""

        listings.append({
            "year": year,
            "price": price,
            "price_raw": price_match.group(0) if price_match else "",
            "mileage": f"{int(mileage_val):,} {mileage_unit}" if mileage_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": location.strip(),
            "color": color,
            "vin": vin,
            "stock": stock,
            "source_site": SITES[site_key]["domain"],
            "source_url": "",  # Will be filled from search results
            "interior_color": "",
            "dealer": "",
            "trim": "",
            "make": "",
            "model": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings

def extract_edmunds_listings(text: str) -> list[dict]:
    """Extract listings from Edmunds extracted text."""
    listings = []

    # Edmunds has structured blocks like:
    # | **$50,638** | Miami, FL | 57,693 | **Lowest price overall**; Black; 1 owner; clean CARFAX; **$8,226 below market** |
    # | **$54,940** | Newnan, GA | 21,565 | **$4,041 below market** |

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

        # Extract color from notes
        color_match = re.search(r'(Black|White|Silver|Gray|Grey|Blue|Red|Green|Orange|Yellow|Brown|Pearl|Ice|Meteor|Trail|Dust|Java)', notes, re.IGNORECASE)
        color = color_match.group(0) if color_match else ""

        # Extract VIN from notes
        vin_match = re.search(r'`([A-HJ-NPR-Z0-9]{17})`', notes)
        vin = vin_match.group(1) if vin_match else ""

        listings.append({
            "year": 0,  # Will be inferred from search context
            "price": price,
            "price_raw": f"${price_part}",
            "mileage": f"{int(mileage_val):,} miles" if mileage_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": location.strip(),
            "color": color,
            "vin": vin,
            "stock": "",
            "source_site": "edmunds.com",
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "trim": "",
            "make": "",
            "model": "",
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings

def extract_autotrader_ca_listings(text: str) -> list[dict]:
    """Extract listings from AutoTrader.ca extracted text."""
    listings = []

    # AutoTrader.ca listings appear as:
    # ## 2023 GMC Sierra 1500 Elevation 4x4 | Remote Start | Lane Keep | SXM
    # $ 45,696
    # Certified pre-owned 74,245 km Automatic Gas

    listing_blocks = re.findall(
        r'##\s+(\d{4})\s+([^\n]+)\n\s*\$\s*([\d,\s]+)\n\s*([^\n]+)',
        text
    )

    for block in listing_blocks:
        year_str, title, price_part, details = block
        year = int(year_str)
        if year < MIN_YEAR:
            continue

        price = f"${price_part.strip().replace(',', '').replace(' ', '')} CAD"

        # Extract km from details
        km_match = re.search(r'(\d[\d,]*)\s*km', details, re.IGNORECASE)
        km_val = int(km_match.group(1).replace(',', '')) if km_match else 0
        mileage_miles = km_to_miles(km_val)

        if mileage_miles > MAX_MILES:
            continue

        # Parse title for make/model/trim
        words = title.split()
        make = words[1] if len(words) > 1 else ""
        model = words[2] if len(words) > 2 else ""
        trim = " ".join(words[3:]) if len(words) > 3 else ""

        listings.append({
            "year": year,
            "price": price,
            "price_raw": f"${price_part.strip()}",
            "mileage": f"{km_val:,} km" if km_val > 0 else "",
            "mileage_miles": mileage_miles,
            "location": "",
            "color": "",
            "vin": "",
            "stock": "",
            "source_site": "autotrader.ca",
            "source_url": "",
            "interior_color": "",
            "dealer": "",
            "trim": trim,
            "make": make,
            "model": model,
            "images": [],
            "extracted_at": datetime.now().isoformat(),
        })

    return listings

# --- Web Search / Extract Interface (stub for standalone use) ---
# When run inside Hermes, these are replaced by actual tool calls.
# When run standalone, they read cached results.

RESEARCH_QUERIES = []

def add_research_query(site: str, make: str, model: str, year: int):
    """Build search queries for a given model across sites."""
    queries = []

    if site == "autotrader_com":
        queries.append(f'site:autotrader.com "{make} {model}" {year}')
    elif site == "autotrader_ca":
        queries.append(f'site:autotrader.ca "{make} {model}" {year}')
    elif site == "cars_com":
        queries.append(f'site:cars.com "{make} {model}" {year}')
    elif site == "cargurus_com":
        queries.append(f'site:cargurus.com "{make} {model}" {year}')
    elif site == "cargurus_ca":
        queries.append(f'site:cargurus.ca "{make} {model}" {year}')
    elif site == "edmunds_com":
        queries.append(f'site:edmunds.com "{make} {model}" {year}')

    return queries

def deduplicate_listings(listings: list[dict]) -> list[dict]:
    """Remove duplicate listings by VIN, or by price+mileage+location if no VIN."""
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

        # Fallback signature: year + price + mileage_miles + location
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

def load_results() -> dict:
    """Load previously saved results."""
    if OUTPUT_FILE.exists():
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"listings": []}

def print_summary(listings: list[dict]):
    """Print a summary of findings."""
    print(f"\n{'='*60}")
    print(f"RESEARCH SUMMARY — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
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

# --- Main (designed to be called from Hermes with tool results) ---

def process_extracted_text(site_key: str, url: str, text: str, make: str, model: str, year: int) -> list[dict]:
    """Process extracted text from a specific site."""
    if "cargurus" in site_key:
        listings = extract_cargurus_listings(text, site_key)
    elif "edmunds" in site_key:
        listings = extract_edmunds_listings(text)
    elif "autotrader_ca" in site_key:
        listings = extract_autotrader_ca_listings(text)
    else:
        listings = []

    # Enrich with context
    for listing in listings:
        listing["source_url"] = url
        if not listing.get("make"):
            listing["make"] = make
        if not listing.get("model"):
            listing["model"] = model
        if listing.get("year") == 0:
            listing["year"] = year

    return listings

def generate_search_plan() -> list[dict]:
    """Generate all search queries needed."""
    plan = []
    years = [2024, 2025, 2026]

    for model_info in TARGET_MODELS:
        make = model_info["make"]
        model = model_info["model"]
        trims = model_info["trims"]

        for year in years:
            for site_key, site_info in SITES.items():
                # For models with specific trims, search with trim
                if trims:
                    for trim in trims:
                        query = f'site:{site_info["domain"]} "{make} {model} {trim}" {year}'
                        plan.append({
                            "site": site_key,
                            "query": query,
                            "make": make,
                            "model": model,
                            "trim": trim,
                            "year": year,
                        })
                else:
                    query = f'site:{site_info["domain"]} "{make} {model}" {year}'
                    plan.append({
                        "site": site_key,
                        "query": query,
                        "make": make,
                        "model": model,
                        "trim": "",
                        "year": year,
                    })

    return plan

if __name__ == "__main__":
    print("Edalkaup Car Research Script")
    print("This script is designed to be run via Hermes with web_search/web_extract tools.")
    print("Generate a search plan with: python research_cars.py --plan")
    print("Process results with: python research_cars.py --process <results.json>")
