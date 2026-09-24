export interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  trim: string
  price_isk: number
  price_includes_vat?: boolean | null
  price_original: number | null
  price_currency: string | null
  mileage_km: number | null
  colour: string | null
  exterior_colour: string | null
  interior_colour: string | null
  engine: string | null
  fuel_type: string | null
  body_type: string | null
  transmission: string | null
  drivetrain: string | null
  doors: number | null
  seats: number | null
  battery_kwh: number | null
  horsepower_hp: number | null
  range_km: number | null
  towing_kg: number | null
  images: string[] | null
  images_original: string[] | null
  description_is: string | null
  source_url: string | null
  vin: string | null
  last_seen_at: string | null
  status: string
  location_country: string | null
  price_verified: boolean
  specs_verified: boolean
}

export type VatChoice = '' | 'true' | 'false'

export interface ListingDraft {
  title: string
  make: string
  model: string
  trim: string
  price_isk: string
  price_includes_vat: VatChoice
  mileage_km: string
  colour: string
  exterior_colour: string
  interior_colour: string
  year: string
  transmission: string
  drivetrain: string
  fuel_type: string
  body_type: string
  engine: string
  doors: string
  seats: string
  battery_kwh: string
  horsepower_hp: string
  range_km: string
  towing_kg: string
  vin: string
  status: string
}

export type ListingTextKey = {
  [K in keyof ListingDraft]: ListingDraft[K] extends string ? K : never
}[keyof ListingDraft]

export const LISTING_FIELDS: { key: ListingTextKey; label: string; numeric?: 'int' | 'decimal' }[] = [
  { key: 'title', label: 'Titill' },
  { key: 'make', label: 'Framleiðandi' },
  { key: 'model', label: 'Gerð' },
  { key: 'trim', label: 'Útgáfa' },
  { key: 'year', label: 'Árgerð', numeric: 'int' },
  { key: 'price_isk', label: 'Verð (ISK)', numeric: 'int' },
  { key: 'mileage_km', label: 'Akstur (km)', numeric: 'int' },
  { key: 'colour', label: 'Litur' },
  { key: 'exterior_colour', label: 'Ytri litur' },
  { key: 'interior_colour', label: 'Innri litur' },
  { key: 'transmission', label: 'Skipting' },
  { key: 'drivetrain', label: 'Drif' },
  { key: 'fuel_type', label: 'Eldsneyti' },
  { key: 'body_type', label: 'Yfirbygging' },
  { key: 'engine', label: 'Vél' },
  { key: 'doors', label: 'Hurðir', numeric: 'int' },
  { key: 'seats', label: 'Sæti', numeric: 'int' },
  { key: 'battery_kwh', label: 'Rafhlaða (kWh)', numeric: 'decimal' },
  { key: 'horsepower_hp', label: 'Afl (hö)', numeric: 'int' },
  { key: 'range_km', label: 'Drægni (km)', numeric: 'int' },
  { key: 'towing_kg', label: 'Dráttargeta (kg)', numeric: 'int' },
  { key: 'vin', label: 'VIN' },
]

export function draftFromCar(car: Car): ListingDraft {
  const text = (value: string | null | undefined) => value ?? ''
  const num = (value: number | null | undefined) => (value == null ? '' : String(value))
  const vat: VatChoice =
    car.price_includes_vat === true ? 'true' : car.price_includes_vat === false ? 'false' : ''
  return {
    title: text(car.title),
    make: text(car.make),
    model: text(car.model),
    trim: text(car.trim),
    price_isk: car.price_isk ? String(car.price_isk) : '',
    price_includes_vat: vat,
    mileage_km: num(car.mileage_km),
    colour: text(car.colour),
    exterior_colour: text(car.exterior_colour),
    interior_colour: text(car.interior_colour),
    year: num(car.year),
    transmission: text(car.transmission),
    drivetrain: text(car.drivetrain),
    fuel_type: text(car.fuel_type),
    body_type: text(car.body_type),
    engine: text(car.engine),
    doors: num(car.doors),
    seats: num(car.seats),
    battery_kwh: num(car.battery_kwh),
    horsepower_hp: num(car.horsepower_hp),
    range_km: num(car.range_km),
    towing_kg: num(car.towing_kg),
    vin: text(car.vin),
    status: car.status,
  }
}

export function listingChanges(
  car: Car,
  draft: ListingDraft,
): { error?: string; payload: Record<string, unknown> } {
  const payload: Record<string, unknown> = {}
  const saved = draftFromCar(car)
  const changed = (key: keyof ListingDraft) => draft[key] !== saved[key]

  if (changed('title')) payload.title = draft.title.trim()
  const nextTrim = draft.trim
  if (nextTrim !== saved.trim) payload.trim = nextTrim.trim()

  if (changed('make')) {
    const make = draft.make.trim()
    if (!make) return { error: 'Vantar framleiðanda', payload: {} }
    payload.make = make
  }
  if (changed('model')) {
    const model = draft.model.trim()
    if (!model) return { error: 'Vantar gerð', payload: {} }
    payload.model = model
  }

  const nullableKeys = [
    'colour',
    'exterior_colour',
    'interior_colour',
    'transmission',
    'drivetrain',
    'fuel_type',
    'body_type',
    'engine',
    'vin',
  ] as const
  for (const key of nullableKeys) {
    if (!changed(key)) continue
    payload[key] = draft[key].trim() || null
  }

  if (changed('price_isk')) {
    const raw = draft.price_isk.trim()
    const n = raw === '' ? 0 : Number(raw)
    if (!Number.isFinite(n)) return { error: 'Ógilt verð', payload: {} }
    if (n !== (car.price_isk || 0)) payload.price_isk = n
  }

  if (changed('price_includes_vat')) {
    payload.price_includes_vat =
      draft.price_includes_vat === 'true' ? true : draft.price_includes_vat === 'false' ? false : null
  }

  const numbers: {
    key: 'year' | 'mileage_km' | 'doors' | 'seats' | 'battery_kwh' | 'horsepower_hp' | 'range_km' | 'towing_kg'
    label: string
    integer: boolean
    required?: boolean
  }[] = [
    { key: 'year', label: 'Árgerð', integer: true, required: true },
    { key: 'mileage_km', label: 'Akstur', integer: true },
    { key: 'doors', label: 'Hurðir', integer: true },
    { key: 'seats', label: 'Sæti', integer: true },
    { key: 'battery_kwh', label: 'Rafhlaða', integer: false },
    { key: 'horsepower_hp', label: 'Afl', integer: true },
    { key: 'range_km', label: 'Drægni', integer: true },
    { key: 'towing_kg', label: 'Dráttargeta', integer: true },
  ]

  for (const field of numbers) {
    if (!changed(field.key)) continue
    const raw = draft[field.key].trim()
    if (raw === '') {
      if (field.required) return { error: 'Ógilt ár', payload: {} }
      payload[field.key] = null
      continue
    }
    const n = Number(raw)
    if (!Number.isFinite(n) || n < 0 || (field.integer && !Number.isInteger(n))) {
      return { error: `Ógild tala: ${field.label}`, payload: {} }
    }
    if (field.key === 'year' && (n < 1990 || n > 2035)) return { error: 'Ógilt ár', payload: {} }
    payload[field.key] = n
  }

  if (changed('status')) {
    if (!['draft', 'live', 'sold'].includes(draft.status)) {
      return { error: 'Ógild staða', payload: {} }
    }
    payload.status = draft.status
  }

  return { payload }
}
