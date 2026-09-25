import { displayExteriorColour } from '@/lib/exteriorColour'
import { formatIskNumber, formatPrice } from '@/lib/formatIsk'
import {
  DEALER_LEGAL_NAME,
  DEALER_NAME,
  DEALER_PHONE_DISPLAY,
  DEALER_PHONE_SCHEMA,
  DEALER_SAME_AS,
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
  mileage_km?: number | null
  exterior_colour?: string | null
  colour?: string | null
  location_country?: string | null
  price_isk?: number | null
  fuel_type?: string | null
  body_type?: string | null
  images?: string[] | null
}

/** Year, make, model, trim. Never the stored `title` column — some rows embed a VIN there. */
export function vehicleTitle(car: Pick<ListingCar, 'year' | 'make' | 'model' | 'trim'>): string {
  return `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.replace(/\s+/g, ' ').trim()
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
  return km == null || km === 0
}

export function mileagePhrase(mileage: unknown): string {
  const km = mileageKm(mileage)
  if (km == null || km === 0) return 'nýr'
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
  return {
    '@type': 'AutoDealer' as const,
    name: DEALER_NAME,
    legalName: DEALER_LEGAL_NAME,
    telephone: DEALER_PHONE_SCHEMA,
    url: SITE_ORIGIN,
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
    '@type': 'Car',
    name: vehicleTitle(car),
    url,
    itemCondition: isListedAsNew(car.mileage_km)
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition',
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: car.year,
  }

  if (colour) jsonLd.color = colour
  // VIN stays off the public page (not in the spec list). Do not emit it here.
  if (km != null && km > 0) {
    jsonLd.mileageFromOdometer = { '@type': 'QuantitativeValue', value: km, unitCode: 'KMT' }
  }
  if (car.fuel_type) jsonLd.fuelType = car.fuel_type
  if (car.body_type) jsonLd.bodyType = car.body_type
  if (car.images && car.images.length > 0) jsonLd.image = car.images

  if (car.price_isk != null && car.price_isk > 0) {
    jsonLd.offers = {
      '@type': 'Offer',
      url,
      price: car.price_isk,
      priceCurrency: 'ISK',
      availability: 'https://schema.org/InStock',
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
