import { vehicleTitle } from '@/lib/listingSeo'

const ICELANDIC: [string, string][] = [
  ['æ', 'ae'],
  ['Æ', 'ae'],
  ['þ', 'th'],
  ['Þ', 'th'],
  ['á', 'a'],
  ['Á', 'a'],
  ['ð', 'd'],
  ['Ð', 'd'],
  ['é', 'e'],
  ['É', 'e'],
  ['í', 'i'],
  ['Í', 'i'],
  ['ó', 'o'],
  ['Ó', 'o'],
  ['ú', 'u'],
  ['Ú', 'u'],
  ['ý', 'y'],
  ['Ý', 'y'],
  ['ö', 'o'],
  ['Ö', 'o'],
]

/** UUID path used by the original listings and by live Facebook ads. */
export const CAR_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function transliterateIcelandic(value: string): string {
  let out = value
  for (const [from, to] of ICELANDIC) out = out.split(from).join(to)
  return out.normalize('NFKD').replace(/\p{M}/gu, '')
}

/** Drop a model year so public paths stay stable and omit the year. */
export function withoutModelYear(title: string): string {
  return title.replace(/\b(?:19|20)\d{2}\b/g, ' ')
}

export function slugifyListingTitle(title: string): string {
  const ascii = transliterateIcelandic(withoutModelYear(title)).toLowerCase()
  const slug = ascii
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
  return slug || 'bil'
}

/** First 6 hex characters of the car id, e.g. 3fe233e6-… becomes 3fe233. */
export function shortCarId(id: string): string {
  return id.slice(0, 6).toLowerCase()
}

export function publicCarSlug(car: {
  id: string
  title?: string | null
  make?: string | null
  model?: string | null
  trim?: string | null
  vin?: string | null
}): string {
  const title = vehicleTitle({
    make: car.make || '',
    model: car.model || '',
    trim: car.trim,
    title: car.title,
    vin: car.vin,
  })
  return `${slugifyListingTitle(title)}-${shortCarId(car.id)}`
}

/** Trailing 6 hex chars of a pretty path. UUIDs do not match. */
export function shortIdFromSlug(param: string): string | null {
  const match = param.toLowerCase().match(/-([0-9a-f]{6})$/)
  return match?.[1] ?? null
}
