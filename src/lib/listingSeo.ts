import { listingCopy } from '@/lib/listingCopy'
import { displayExteriorColour } from '@/lib/exteriorColour'
import { formatIskNumber, formatPrice } from '@/lib/formatIsk'
import {
  DEALER_COUNTRY,
  DEALER_GEO,
  DEALER_LEGAL_NAME,
  DEALER_LOCALITY,
  DEALER_LOGO_PATH,
  DEALER_NAME,
  DEALER_PHONE_DISPLAY,
  DEALER_PHONE_SCHEMA,
  DEALER_POSTAL_CODE,
  DEALER_SAME_AS,
  DEALER_STREET,
  SITE_ORIGIN,
} from '@/lib/site'

const NORTH_AMERICA = new Set([
  'us',
  'usa',
  'united states',
  'united states of america',
  'bandaríkin',
  'bandarikin',
  'ca',
  'can',
  'canada',
  'kanada',
])

/** Icelandic colour words that have no accented letter (so "Svartur" still lowercases). */
const PLAIN_COLOUR_WORDS = new Set([
  'svartur',
  'hvítur',
  'hvitur',
  'grár',
  'grar',
  'rauður',
  'raudur',
  'blár',
  'blar',
  'grænn',
  'graenn',
  'brúnn',
  'brunn',
  'gulur',
  'silfur',
  'gylltur',
  'beige',
  'appelsínugulur',
])

export type ListingCar = {
  year: number
  make: string
  model: string
  trim?: string | null
  /** Stored display name. Shown as-is; a leading year is kept and not repeated. */
  title?: string | null
  vin?: string | null
  mileage_km?: number | null
  exterior_colour?: string | null
  colour?: string | null
  location_country?: string | null
  price_isk?: number | null
  fuel_type?: string | null
  body_type?: string | null
  images?: string[] | null
  description_is?: string | null
}

function collapseSpace(value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

/**
 * Some stored titles append the VIN in brackets. Public copy must not show it.
 * The title field itself is left unchanged in the database.
 */
function withoutEmbeddedVin(title: string, vin?: string | null): string {
  let out = title
  const token = typeof vin === 'string' ? vin.trim() : ''
  if (token.length >= 8) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`\\s*\\[\\s*${escaped}\\s*\\]\\s*`, 'gi'), ' ')
    out = out.replace(new RegExp(escaped, 'gi'), ' ')
  }
  out = out.replace(/\s*\[[A-HJ-NPR-Z0-9]{17}\]\s*/gi, ' ')
  return collapseSpace(out)
}

/**
 * Visible listing name. Prefers the stored `title` exactly, including a
 * leading model year when that title already starts with one. Does not
 * prepend `year` (so a title that already begins with YYYY is not doubled).
 * Falls back to make, model, and trim when title is empty.
 */
export function vehicleTitle(
  car: Pick<ListingCar, 'make' | 'model' | 'trim'> & { title?: string | null; vin?: string | null },
): string {
  const stored = typeof car.title === 'string' ? collapseSpace(car.title) : ''
  if (stored) {
    const cleaned = withoutEmbeddedVin(stored, car.vin)
    if (cleaned) return cleaned
  }
  return collapseSpace(`${car.make} ${car.model} ${car.trim || ''}`)
}

export function mileageKm(value: unknown): number | null {
  if (value == null || value === '') return null
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return null
  return n
}

/** Public copy already calls 0 / missing mileage "nýr" in the meta description. */
export function isListedAsNew(mileage: unknown): boolean {
  const km = mileageKm(mileage)
  return km === 0
}

export function mileagePhrase(mileage: unknown): string {
  const km = mileageKm(mileage)
  if (km == null) return 'akstur ótilgreindur'
  if (km === 0) return '0 km'
  return `${formatIskNumber(km)} km`
}

/**
 * North-American origin claim only when the row's location says US or CA.
 * `IS`, blank, UK, and EU values do not get the claim.
 */
export function isNorthAmericanOrigin(locationCountry: unknown): boolean {
  if (typeof locationCountry !== 'string') return false
  const key = locationCountry.trim().toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ')
  return NORTH_AMERICA.has(key)
}

function isIcelandicColourPhrase(value: string): boolean {
  if (!/^[A-Za-zÁÉÍÓÚÝÞÆÖÐáéíóúýþæöð]+(?:[ -][A-Za-zÁÉÍÓÚÝÞÆÖÐáéíóúýþæöð]+)*$/.test(value)) {
    return false
  }
  if (/[ÁÉÍÓÚÝÞÆÖÐáéíóúýþæöð]/.test(value)) return true
  return value.split(/[\s-]+/).every((word) => PLAIN_COLOUR_WORDS.has(word.toLocaleLowerCase('is')))
}

/**
 * Colour we can actually name. Drops "Ótilgreint" and the English half of
 * bilingual values such as "Dökkgrár / charcoal metallic".
 */
export function knownExteriorColour(car: Pick<ListingCar, 'exterior_colour' | 'colour'>): string | null {
  let raw = displayExteriorColour(car).trim()
  if (!raw || raw === 'Ótilgreint') return null
  if (raw.includes('/')) {
    const left = raw.split('/')[0]?.trim()
    if (left) raw = left
  }
  return raw
}

/** Mid-sentence Icelandic colour ("Hvítur" → "hvítur"). Paint names stay as stored. */
export function listingColourPhrase(car: Pick<ListingCar, 'exterior_colour' | 'colour'>): string | null {
  const raw = knownExteriorColour(car)
  if (!raw) return null
  return isIcelandicColourPhrase(raw) ? raw.toLocaleLowerCase('is') : raw
}

/**
 * Unique document title. Colour and kilometres separate otherwise identical
 * model lines; the country phrase targets model + place queries in Iceland.
 * Uniqueness wins over the ~60 character guideline.
 */
export function listingDocumentTitle(car: ListingCar): string {
  const parts = [vehicleTitle(car), listingColourPhrase(car), mileagePhrase(car.mileage_km)].filter(Boolean)
  return `${parts.join(', ')} | Til sölu á Íslandi`
}

export function listingMetaDescription(car: ListingCar): string {
  const detail = [listingColourPhrase(car), mileagePhrase(car.mileage_km), formatPrice(car.price_isk)]
    .filter(Boolean)
    .join(', ')
  const detailSentence = /[.!?]$/.test(detail) ? detail : `${detail}.`
  const origin = isNorthAmericanOrigin(car.location_country) ? ' Innfluttur frá Norður-Ameríku.' : ''
  return `${vehicleTitle(car)} til sölu hjá Eðalkaup — ${detailSentence}${origin} Hringdu í ${DEALER_PHONE_DISPLAY}.`
}

export function listingCanonical(slug: string): string {
  return `${SITE_ORIGIN}/bilar/${slug}`
}

export function listingSeller() {
  const logo = `${SITE_ORIGIN}${DEALER_LOGO_PATH}`
  return {
    '@type': 'AutoDealer' as const,
    name: DEALER_NAME,
    legalName: DEALER_LEGAL_NAME,
    telephone: DEALER_PHONE_SCHEMA,
    url: SITE_ORIGIN,
    image: logo,
    logo,
    address: {
      '@type': 'PostalAddress' as const,
      streetAddress: DEALER_STREET,
      addressLocality: DEALER_LOCALITY,
      postalCode: DEALER_POSTAL_CODE,
      addressCountry: DEALER_COUNTRY,
    },
    geo: {
      '@type': 'GeoCoordinates' as const,
      latitude: DEALER_GEO.latitude,
      longitude: DEALER_GEO.longitude,
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification' as const,
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00',
    },
    areaServed: 'Iceland',
  }
}

export function siteDealerJsonLd() {
  return {
    '@context': 'https://schema.org',
    ...listingSeller(),
    sameAs: [...DEALER_SAME_AS],
  }
}

export function carJsonLd(car: ListingCar, slug: string) {
  const url = listingCanonical(slug)
  const colour = knownExteriorColour(car)
  const km = mileageKm(car.mileage_km)
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Car'],
    '@id': `${url}#vehicle`,
    sku: slug,
    name: vehicleTitle(car),
    url,
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: car.year,
  }

  if (km != null && km > 0) jsonLd.itemCondition = 'https://schema.org/UsedCondition'
  if (colour) jsonLd.color = colour
  // VIN stays off the public page (not in the spec list). Do not emit it here.
  if (km != null && km > 0) {
    jsonLd.mileageFromOdometer = { '@type': 'QuantitativeValue', value: km, unitCode: 'KMT' }
  }
  const description = listingCopy(car.description_is)
  if (description) jsonLd.description = withoutEmbeddedVin(description, car.vin).slice(0, 1000)
  if (car.fuel_type) jsonLd.fuelType = car.fuel_type
  if (car.body_type) jsonLd.bodyType = car.body_type
  if (car.images && car.images.length > 0) jsonLd.image = car.images

  if (car.price_isk != null && car.price_isk > 0) {
    jsonLd.offers = {
      '@type': 'Offer',
      url,
      price: car.price_isk,
      priceCurrency: 'ISK',
      availability: 'https://schema.org/LimitedAvailability',
      seller: listingSeller(),
    }
  }

  return jsonLd
}

export function breadcrumbJsonLd(car: ListingCar, slug: string) {
  const url = listingCanonical(slug)
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Forsíða', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Bílar til sölu', item: `${SITE_ORIGIN}/bilar` },
      { '@type': 'ListItem', position: 3, name: vehicleTitle(car), item: url },
    ],
  }
}

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
