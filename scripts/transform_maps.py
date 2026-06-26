#!/usr/bin/env python3
"""Icelandic transform maps + helpers for Edalkaup.

Ported from the original transform_cars.py so the pipeline produces the same
Icelandic colours / specs. Imported by sync_inventory.py.
"""

# --- Colour translation (English -> Icelandic) ---
COLOR_MAP = {
    'black': 'Svartur', 'white': 'Hvítur', 'silver': 'Silfur', 'gray': 'Grár', 'grey': 'Grár',
    'blue': 'Blár', 'red': 'Rauður', 'green': 'Grænn', 'orange': 'Appelsínugulur',
    'yellow': 'Gulur', 'brown': 'Brúnn', 'bronze': 'Brúnn', 'tan': 'Drapplitur',
    'gold': 'Gylltur', 'beige': 'Drapplitur', 'maroon': 'Vínrauður',
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


def to_isk_color(c: str) -> str:
    if not c:
        return 'Ótilgreind'
    key = c.lower().strip()
    if '/' in key:
        parts = [p.strip() for p in key.split('/')]
        return '/'.join(COLOR_MAP.get(p, p.title()) for p in parts)
    return COLOR_MAP.get(key, c.title())


# --- Per-model spec metadata (engine/fuel/body/etc.) ---
MODEL_META = {
    'Toyota Land Cruiser': {
        'engine': '2.4L Twin-Turbo Hybrid (326 HP)', 'fuel_type': 'Hybrid', 'body_type': 'SUV',
        'doors': 4, 'seats': 7, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
    },
    'Toyota Sequoia': {
        'engine': 'i-FORCE MAX Twin-Turbo V6 Hybrid (437 HP)', 'fuel_type': 'Hybrid', 'body_type': 'SUV',
        'doors': 4, 'seats': 7, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
    },
    'Toyota Tundra': {
        'engine': 'i-FORCE MAX Twin-Turbo V6 Hybrid (437 HP)', 'fuel_type': 'Hybrid', 'body_type': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
    },
    'Toyota 4Runner': {
        'engine': '2.4L Turbo-Hybrid (326 HP)', 'fuel_type': 'Hybrid', 'body_type': 'SUV',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
    },
    'Chevrolet Silverado': {
        'engine': 'Rafmagn — Dual Motor (664 HP)', 'fuel_type': 'Rafbíll', 'body_type': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': 'AWD', 'transmission': 'Sjálfskiptur',
    },
    'GMC Sierra': {
        'engine': '6.2L V8 (420 HP)', 'fuel_type': 'Bensín', 'body_type': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
        'features': ['Multimatic DSSV Shocks', 'Locking Front/Rear Diff', '33" All-Terrain Tires', 'Super Cruise', 'Heated Seats'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/2025_GMC_Sierra_AT4X_au_SIAM_2025.jpg',
    },
    'GMC Sierra EV': {
        'engine': 'Rafmagn — Dual Motor (754 HP)', 'fuel_type': 'Rafbíll', 'body_type': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': 'e4WD', 'transmission': 'Sjálfskiptur',
        'features': ['754 HP Dual Motor', 'Super Cruise', 'Carbon Fiber Bed', 'Power Tailgate', 'Heated/Ventilated Seats'],
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d7/2025_GMC_Sierra_AT4X_au_SIAM_2025.jpg',
    },
    'Ford F-150': {
        'engine': '3.5L EcoBoost V6 (450 HP)', 'fuel_type': 'Bensín', 'body_type': 'Pickup',
        'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
    },
}

DEFAULT_META = {
    'engine': 'Ótilgreind', 'fuel_type': 'Bensín', 'body_type': 'SUV',
    'doors': 4, 'seats': 5, 'drivetrain': '4WD', 'transmission': 'Sjálfskiptur',
}


def meta_for(make: str, model: str) -> dict:
    return MODEL_META.get(f"{make} {model}", DEFAULT_META)
