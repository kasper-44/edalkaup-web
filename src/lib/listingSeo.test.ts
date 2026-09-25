import assert from 'node:assert/strict'
import { formatPrice } from '@/lib/formatIsk'
import {
  breadcrumbJsonLd,
  carJsonLd,
  isNorthAmericanOrigin,
  jsonLdScript,
  listingCanonical,
  listingDocumentTitle,
  listingMetaDescription,
  siteDealerJsonLd,
} from '@/lib/listingSeo'
import { DEALER_PHONE_TEL } from '@/lib/site'
import type { ListingCar } from '@/lib/listingSeo'

const sierraWhite: ListingCar = {
  year: 2026,
  make: 'GMC',
  model: 'Sierra',
  trim: 'Denali MAX RANGE',
  exterior_colour: 'Hvítur',
  colour: 'Hvítur',
  mileage_km: 5000,
  location_country: 'US',
  price_isk: 1,
}

const sierraRed: ListingCar = {
  ...sierraWhite,
  exterior_colour: 'Dökkrautt',
  colour: 'Dökkrautt',
  mileage_km: 44000,
  price_isk: 1,
}

const grenadier: ListingCar = {
  year: 2023,
  make: 'Ineos',
  model: 'Grenadier',
  trim: 'Off-Road pakki',
  exterior_colour: 'Ljósbrúnn',
  colour: 'Ljósbrúnn',
  mileage_km: 36000,
  location_country: null,
  price_isk: 14990000,
  fuel_type: 'Dísel',
  body_type: 'Jeppi',
}

const transit: ListingCar = {
  year: 2020,
  make: 'Ford',
  model: 'Transit Custom',
  trim: 'L1H1',
  exterior_colour: 'Dökkgrár / charcoal metallic',
  colour: 'Dökkgrár',
  mileage_km: 182000,
  location_country: 'IS',
  price_isk: 2890000,
  fuel_type: 'Dísel',
  body_type: 'Sendibíll',
}

const sequoia: ListingCar = {
  year: 2026,
  make: 'Toyota',
  model: 'Sequoia',
  trim: 'TRD Pro',
  exterior_colour: 'Magnetic Gray Metallic',
  colour: 'Magnetic Gray Metallic',
  mileage_km: 9,
  location_country: 'US',
  price_isk: 25490000,
  fuel_type: 'Hybrid',
  body_type: 'SUV',
}

assert.equal(
  listingDocumentTitle(sierraWhite),
  '2026 GMC Sierra Denali MAX RANGE, hvítur, 5.000 km | Til sölu á Íslandi',
)
assert.equal(
  listingDocumentTitle(sierraRed),
  '2026 GMC Sierra Denali MAX RANGE, dökkrautt, 44.000 km | Til sölu á Íslandi',
)
assert.notEqual(listingDocumentTitle(sierraWhite), listingDocumentTitle(sierraRed))

assert.equal(
  listingDocumentTitle(grenadier),
  '2023 Ineos Grenadier Off-Road pakki, ljósbrúnn, 36.000 km | Til sölu á Íslandi',
)
assert.equal(
  listingMetaDescription(grenadier),
  `2023 Ineos Grenadier Off-Road pakki til sölu hjá Eðalkaup — ljósbrúnn, 36.000 km, ${formatPrice(14990000)} Hringdu í 699 2011.`,
)
assert.equal(listingMetaDescription(grenadier).includes('Norður-Ameríku'), false)
assert.equal(listingMetaDescription(grenadier).includes(formatPrice(grenadier.price_isk)), true)

assert.equal(
  listingDocumentTitle(transit),
  '2020 Ford Transit Custom L1H1, dökkgrár, 182.000 km | Til sölu á Íslandi',
)
assert.equal(listingMetaDescription(transit).includes('Norður-Ameríku'), false)
assert.equal(listingMetaDescription(transit).includes('2.890.000 kr.'), true)
assert.equal(listingMetaDescription(transit).includes('kr..'), false)

assert.equal(listingMetaDescription(sequoia).includes('Innfluttur frá Norður-Ameríku.'), true)
assert.equal(listingMetaDescription(sequoia).includes('25.490.000 kr.'), true)
assert.equal(isNorthAmericanOrigin('US'), true)
assert.equal(isNorthAmericanOrigin('CA'), true)
assert.equal(isNorthAmericanOrigin('Canada'), true)
assert.equal(isNorthAmericanOrigin('IS'), false)
assert.equal(isNorthAmericanOrigin(null), false)
assert.equal(isNorthAmericanOrigin('UK'), false)

assert.equal(listingDocumentTitle({ ...grenadier, mileage_km: 0 }).endsWith('nýr | Til sölu á Íslandi'), true)
assert.equal(listingDocumentTitle({ ...grenadier, mileage_km: null }).includes('nýr'), true)

const slug = '0678ccc0-da40-4524-9835-d6998911dd16'
const poisoned = {
  ...grenadier,
  title: '2023 Ineos Grenadier [SHOULDNOTAPPEARVIN123]',
  vin: 'SHOULDNOTAPPEARVIN123',
  price_isk: 14990000,
}
const carLd = carJsonLd(poisoned, slug)
const serialized = jsonLdScript(carLd)
assert.equal(serialized.includes('SHOULDNOTAPPEARVIN123'), false)
assert.equal(serialized.includes('vehicleIdentificationNumber'), false)
assert.equal(carLd.url, 'https://www.edalkaup.is/bilar/' + slug)
assert.equal(carLd.itemCondition, 'https://schema.org/UsedCondition')
assert.equal(carLd.color, 'Ljósbrúnn')
const offer = carLd.offers as { price: number; seller: Record<string, string> }
assert.equal(offer.price, 14990000)
assert.equal(offer.seller.name, 'Eðalkaup')
assert.equal(offer.seller.legalName, 'Úranus ehf.')
assert.equal(offer.seller.telephone, '+354 699 2011')
assert.equal(offer.seller.url, 'https://www.edalkaup.is')
assert.equal(offer.seller.areaServed, 'Iceland')

const fresh = carJsonLd({ ...grenadier, mileage_km: null, price_isk: 14990000 }, slug)
assert.equal(fresh.itemCondition, 'https://schema.org/NewCondition')
assert.equal('mileageFromOdometer' in fresh, false)
assert.equal((fresh.offers as { price: number }).price, 14990000)

const crumbs = breadcrumbJsonLd(grenadier, slug)
assert.deepEqual(
  crumbs.itemListElement.map((item) => item.name),
  ['Forsíða', 'Bílar til sölu', '2023 Ineos Grenadier Off-Road pakki'],
)
assert.equal(listingCanonical(slug).startsWith('https://www.edalkaup.is/bilar/'), true)

const dealer = siteDealerJsonLd()
assert.equal(dealer['@type'], 'AutoDealer')
assert.deepEqual(dealer.sameAs, ['https://m.me/Edalkaup'])
assert.equal('address' in dealer, false)
assert.equal('openingHours' in dealer, false)
assert.equal('aggregateRating' in dealer, false)
assert.equal(JSON.parse(jsonLdScript(dealer))['@type'], 'AutoDealer')
assert.equal(DEALER_PHONE_TEL, 'tel:+3546992011')

const zeroOffer = carJsonLd({ ...grenadier, price_isk: 0 }, slug)
assert.equal('offers' in zeroOffer, false)

console.log('listingSeo tests passed')
