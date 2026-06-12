#!/usr/bin/env python3
import json
import re
from datetime import datetime

with open('src/data/research/listings.json', 'r', encoding='utf-8') as f:
    research = json.load(f)

listings = research['listings']

color_map = {
    'black': 'Svartur', 'white': 'Hvítur', 'silver': 'Silfur', 'gray': 'Grár', 'grey': 'Grár',
    'blue': 'Blár', 'red': 'Rauður', 'green': 'Grænn', 'orange': 'Appelsínugulur',
    'yellow': 'Gulur', 'brown': 'Brúnn', 'bronze': 'Brúnn',
    'ice cap': 'Hvítur', 'meteor shower': 'Grár', 'solar octane': 'Appelsínugulur',
    'terra': 'Brúnn', 'trail dust': 'Brúnn', 'java': 'Brúnn', 'java leather': 'Brúnn',
    'magnetic': 'Grár', 'lunar': 'Grár', 'charcoal': 'Grár', 'boulder': 'Grár',
    'saddle': 'Brúnn', 'riptide blue metallic': 'Blár', 'celestial silver': 'Silfur',
    'wind chill pearl': 'Hvítur', 'blueprint': 'Blár', 'smoked mesquite': 'Brúnn',
    'midnight black metallic': 'Svartur', 'agate black metallic': 'Svartur',
    'shelter green': 'Grænn', 'army green': 'Hergrænn', 'pearl': 'Hvítur',
    'rapid red': 'Rauður', 'cherry red tintcoat': 'Rauður', 'oxford white': 'Hvítur',
    'iconic silver': 'Silfur', 'ford performance blue': 'Blár', 'onyx black': 'Svartur',
    'carbon black metallic': 'Svartur', 'cayenne red tintcoat': 'Rauður',
    'quicksilver metallic': 'Silfur', 'moonstone metallic': 'Silfur',
    'summit white': 'Hvítur', 'billet silver': 'Silfur', 'platinum white pearl': 'Hvítur',
    'classic silver metallic': 'Silfur', 'blizzard white pearl': 'Hvítur',
    'bronze age': 'Brúnn', 'sarge green': 'Grænn', 'hydro blue': 'Blár',
    'firecracker red': 'Rauður', 'bright white': 'Hvítur', 'sterling metallic': 'Silfur',
    'thunderstorm gray': 'Grár', 'special exterior color': 'Sérstakur',
}

def to_isk_color(c):
    if not c: return 'Ótilgreind'
    key = c.lower().strip()
    if '/' in key:
        parts = [p.strip() for p in key.split('/')]
        return '/'.join(color_map.get(p, p.title()) for p in parts)
    return color_map.get(key, c.title())

def parse_price_num(pr):
    if not pr: return 0
    m = re.search(r'[\d,]+', pr)
    return int(m.group().replace(',', '')) if m else 0

def currency_from_price(ps):
    return 'CAD' if 'CAD' in ps else 'USD'

def convert_to_isk(amount, currency):
    return int(amount * 100) if currency == 'CAD' else int(amount * 135)

model_meta = {
    'Toyota Land Cruiser': {
        'engine': '2.4L Twin-Turbo Hybrid (326 HP)', 'fuelType': 'Hybrid', 'bodyType': 'SUV',
        'doors': 4, 'seats': 7, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['KDSS Suspension', 'Multi-Terrain Monitor', 'Apple CarPlay', 'Heated Seats', 'JBL Premium Audio', '14" Touchscreen'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2024_Toyota_Land_Cruiser_250_VX_in_Platinum_White_Pearl_Mica%2C_front_left.jpg',
    },
    'Toyota Sequoia': {
        'engine': 'i-FORCE MAX Twin-Turbo V6 Hybrid (437 HP)', 'fuelType': 'Hybrid', 'bodyType': 'SUV',
        'doors': 4, 'seats': 7, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['FOX Internal Bypass Shocks', 'CRAWL Control', 'Multi-Terrain Select', 'JBL Premium Audio', 'Panoramic Moonroof', 'Apple CarPlay'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/a/ac/24_Toyota_Sequoia_TRD_Pro.jpg',
    },
    'Toyota Tundra': {
        'engine': 'i-FORCE MAX Twin-Turbo V6 Hybrid (437 HP)', 'fuelType': 'Hybrid', 'bodyType': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['i-FORCE MAX Hybrid', 'FOX Internal Bypass Shocks', 'CRAWL Control', 'Multi-Terrain Select', 'JBL Premium Audio', 'Apple CarPlay'],
        'image': 'https://delivery.tcom.assetscs.toyota.com/adobe/assets/urn:aaid:aem:a69579d8-6d8f-48cc-81cb-460bd904c14b/as/MY26_Tundra_US_TRD-PRO-Hybrid-4WD-CM-5.5ft_8424_0796_002_DS-Front-3-4_6K_v2.png?format=webp&quality=90',
    },
    'Toyota 4Runner': {
        'engine': '2.4L Turbo-Hybrid (326 HP)', 'fuelType': 'Hybrid', 'bodyType': 'SUV',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['GR-S Sport Suspension', '33" Falken Wildpeak Tires', 'CRAWL Control', 'Multi-Terrain Select', 'JBL Premium Audio', 'Apple CarPlay'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/2/23/22_Toyota_4Runner_TRD_Pro.jpg',
    },
    'Chevrolet Silverado': {
        'engine': 'Rafmagn — Dual Motor (664 HP)', 'fuelType': 'Rafbíll', 'bodyType': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': 'AWD', 'transmission': 'Sjálfskiptur',
        'features': ['664 HP Dual Motor', '640 km Range', 'Multi-Flex Midgate', 'Super Cruise', 'Bose Premium Audio', 'DC Fast Charging'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/09/2024_Chevrolet_Silverado_EV_4WT_AWD_in_Summit_White%2C_front_left%2C_2024-06-30.jpg',
    },
    'GMC Sierra': {
        'engine': '6.2L V8 (420 HP)', 'fuelType': 'Bensín', 'bodyType': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['Multimatic DSSV Shocks', 'Locking Front/Rear Diff', '33" All-Terrain Tires', 'Super Cruise', 'Heated Seats'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/2025_GMC_Sierra_AT4X_au_SIAM_2025.jpg',
    },
    'Ford F-150': {
        'engine': '3.5L EcoBoost V6 (450 HP)', 'fuelType': 'Bensín', 'bodyType': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['FOX Live Valve Shocks', '37" BF Goodrich Tires', 'Terrain Management System', 'Trail Control', 'B&O Sound System', 'Apple CarPlay'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Ford_F-150_V6_Raptor_2025.jpg',
    },
}

engine_overrides = {
    'GMC Sierra': {
        'EV Denali Crew Cab Max Range': 'Rafmagn — Dual Motor (754 HP)',
        'AT4X Crew Cab 4WD': '6.2L V8 (420 HP)',
    },
    'Chevrolet Silverado': {
        'LT Crew Cab e4WD': 'Rafmagn — Dual Motor (510 HP)',
        'LT Crew Cab Standard Range': 'Rafmagn — Single Motor (510 HP)',
        'RST e4WD': 'Rafmagn — Dual Motor (664 HP)',
    },
    'Ford F-150': {'Raptor R': '5.2L Supercharged V8 (700 HP)'},
    'Toyota Tundra': {
        'SR5 CrewMax': '3.4L Twin-Turbo V6 (389 HP)',
        'Limited CrewMax': 'i-FORCE MAX Twin-Turbo V6 Hybrid (437 HP)',
    },
}

fuel_overrides = {
    'GMC Sierra': {'EV Denali Crew Cab Max Range': 'Rafbíll'},
    'Chevrolet Silverado': {
        'LT Crew Cab e4WD': 'Rafbíll', 'LT Crew Cab Standard Range': 'Rafbíll', 'RST e4WD': 'Rafbíll',
    },
}

drivetrain_overrides = {
    'GMC Sierra': {'EV Denali Crew Cab Max Range': 'e4WD'},
    'Chevrolet Silverado': {
        'LT Crew Cab e4WD': 'e4WD', 'LT Crew Cab Standard Range': 'e4WD', 'RST e4WD': 'e4WD',
    },
}

def slugify(t): return re.sub(r'[^a-z0-9]+', '-', t.lower()).strip('-')

def make_id(l, i):
    parts = [str(l['year']), slugify(l['make']), slugify(l['model'])]
    if l.get('trim'): parts.append(slugify(l['trim']))
    if l.get('color'): parts.append(slugify(l['color']))
    parts.append(str(i))
    return '-'.join(parts)

new_cars = []
featured_models = set()

for i, l in enumerate(listings):
    model_key = f"{l['make']} {l['model']}"
    meta = model_meta.get(model_key, {
        'engine': 'Ótilgreind', 'fuelType': 'Bensín', 'bodyType': 'SUV', 'doors': 4, 'seats': 5,
        'drivetrain': '4WD', 'transmission': 'Sjálfskiptur', 'features': [], 'image': '',
    })
    trim = l.get('trim', '')
    engine = engine_overrides.get(model_key, {}).get(trim, meta['engine'])
    fuel = fuel_overrides.get(model_key, {}).get(trim, meta['fuelType'])
    dt = drivetrain_overrides.get(model_key, {}).get(trim, meta['drivetrain'])

    price_num = parse_price_num(l.get('price_raw', ''))
    currency = currency_from_price(l.get('price', ''))
    isk_price = convert_to_isk(price_num, currency)
    mileage_km = int(l.get('mileage_miles', 0) * 1.60934)
    color_is = to_isk_color(l.get('color', ''))

    model_sig = f"{l['make']}-{l['model']}"
    is_featured = model_sig not in featured_models
    if is_featured: featured_models.add(model_sig)

    desc = f"{l['year']} {l['make']} {l['model']} {trim} — {l.get('mileage', 'Nýr')} á {l.get('location', 'ótilgreindum stað')}. Verð: {l.get('price', '')}."

    car = {
        'id': make_id(l, i), 'slug': make_id(l, i), 'make': l['make'], 'model': l['model'],
        'year': l['year'], 'trim': trim or 'Standard', 'price': isk_price,
        'priceUSD': price_num if currency == 'USD' else None, 'mileage': mileage_km,
        'color': color_is, 'exteriorColor': l.get('color', '') or 'Ótilgreind',
        'interiorColor': l.get('interior_color', '') or 'Black', 'drivetrain': dt,
        'engine': engine, 'transmission': meta['transmission'], 'fuelType': fuel,
        'bodyType': meta['bodyType'], 'doors': meta['doors'], 'seats': meta['seats'],
        'vin': l.get('vin', ''), 'status': 'available', 'featured': is_featured,
        'images': [meta['image']] if meta['image'] else [], 'description': desc,
        'features': meta['features'][:], 'createdAt': l.get('extracted_at', datetime.now().isoformat())[:10],
        'availability': 'Laus á nokkrum vikum',
    }
    new_cars.append(car)

print(f"Transformed {len(new_cars)} cars, featured: {len(featured_models)}")

# Build TypeScript
lines = [
    "export interface Car {",
    "  id: string", "  slug: string", "  make: string", "  model: string", "  year: number",
    "  trim: string", "  price: number // ISK", "  priceUSD?: number", "  mileage: number // km",
    "  color: string", "  exteriorColor: string", "  interiorColor: string", "  drivetrain: string",
    "  engine: string", "  transmission: string", "  fuelType: string", "  bodyType: string",
    "  doors: number", "  seats: number", "  vin?: string",
    "  status: 'available' | 'sold' | 'in-transit'", "  featured: boolean", "  images: string[]",
    "  videoUrl?: string", "  description: string", "  features: string[]", "  createdAt: string",
    "  availability?: string", "}", "", "// @ts-ignore", "export const cars: Car[] = [",
]

for car in new_cars:
    lines.append("  {")
    for k, v in car.items():
        if isinstance(v, str):
            lines.append(f"    {k}: '{v.replace(chr(39), chr(92)+chr(39))}',")
        elif isinstance(v, bool):
            lines.append(f"    {k}: {'true' if v else 'false'},")
        elif isinstance(v, list):
            if not v:
                lines.append(f"    {k}: [],")
            else:
                items = ', '.join(f"'{x.replace(chr(39), chr(92)+chr(39))}'" for x in v)
                lines.append(f"    {k}: [{items}],")
        elif v is None:
            lines.append(f"    {k}: undefined,")
        else:
            lines.append(f"    {k}: {v},")
    lines.append("  },")

lines.extend([
    "]", "", "export const deliveredCars: Car[] = [", "  {",
    "    id: 'del-001',", "    slug: '2022-toyota-land-cruiser-300-del001',", "    make: 'Toyota',",
    "    model: 'Land Cruiser 300',", "    year: 2022,", "    trim: 'GR Sport',",
    "    price: 16500000,", "    mileage: 35000,", "    color: 'Hvítur',",
    "    exteriorColor: 'White Pearl',", "    interiorColor: 'Black',",
    "    drivetrain: '4WD',", "    engine: '3.3L Twin-Turbo V6 Diesel',",
    "    transmission: 'Sjálfskiptur',", "    fuelType: 'Dísel',", "    bodyType: 'SUV',",
    "    doors: 4,", "    seats: 7,", "    status: 'sold',", "    featured: false,",
    "    images: ['/images/cars/land-cruiser-300/lc_01.jpg'],",
    "    description: 'Toyota Land Cruiser 300 GR Sport 2022 — afhent.',",
    "    features: [],", "    createdAt: '2022-10-01',", "  },", "]", "",
    "export function formatPrice(price: number): string {",
    "  if (price === 0) return 'Verð við fyrirspurn'",
    "  return new Intl.NumberFormat('is-IS').format(price) + ' kr.'", "}", "",
    "export function formatMileage(km: number): string {",
    "  if (km === 0) return 'Nýr'", "  return new Intl.NumberFormat('is-IS').format(km) + ' km'", "}", "",
    "export function getCarTitle(car: Car): string {",
    "  return `${car.year} ${car.make} ${car.model} ${car.trim}`", "}",
])

with open('src/data/cars.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Done! Wrote src/data/cars.ts")
