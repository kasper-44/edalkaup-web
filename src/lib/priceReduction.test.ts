import assert from 'node:assert/strict'
import { adaptCar } from './adaptPublicCar'
import { listingRibbonKinds } from './listingRibbon'
import { comparePriceReducedFirst, priceReduction } from './priceReduction'
import { isInTransit } from './transit'

const EXPEDITION = '1b9200de-ce7e-4e23-9ac8-e3ae1c1312b5'
const TRANSIT = 'f3f4c0da-fec8-4d8b-9749-8eca50ffd153'
const HUMMER = '0079429b-bf08-4216-a170-432c95ddd8d6'

const expedition = priceReduction({ id: EXPEDITION })
assert.equal(expedition.reduced, true)
assert.equal(expedition.previousPrice, 3890000)
assert.equal(priceReduction({ id: TRANSIT }).previousPrice, 2890000)
assert.equal(priceReduction({ id: 'other' }).reduced, false)

assert.equal(priceReduction({ id: EXPEDITION, price_reduced: false, previous_price_isk: 3890000 }).reduced, false)
assert.equal(
  priceReduction({ id: EXPEDITION, price_reduced: true, previous_price_isk: 4000000 }).previousPrice,
  4000000,
)
assert.equal(priceReduction({ id: 'fresh', priceReduced: true, previousPrice: 10 }).reduced, true)

assert.equal(isInTransit({ id: HUMMER, status: 'live' }), true)
assert.equal(isInTransit({ id: HUMMER, in_transit: false, status: 'live' }), false)
assert.equal(isInTransit({ id: 'other', in_transit: true, status: 'live' }), true)
assert.equal(isInTransit({ id: 'other', status: 'live' }), false)

const adaptedExpedition = adaptCar({ id: EXPEDITION, make: 'Ford', model: 'Expedition', year: 2007, price_isk: 3790000 })
assert.equal(adaptedExpedition.priceReduced, true)
assert.equal(adaptedExpedition.previousPrice, 3890000)
assert.deepEqual(listingRibbonKinds(adaptedExpedition), ['reduced'])

const adaptedHummer = adaptCar({ id: HUMMER, make: 'GMC', model: 'HUMMER EV Pickup', year: 2026, price_isk: 16890000, status: 'live' })
assert.equal(adaptedHummer.status, 'in-transit')
assert.deepEqual(listingRibbonKinds(adaptedHummer), ['transit'])
assert.deepEqual(listingRibbonKinds({ ...adaptedHummer, priceReduced: true, previousPrice: 17000000 }), ['reduced', 'transit'])

const newest = { id: 'newest' }
const older = { id: 'older' }
const ordered = [newest, older, { id: EXPEDITION }].sort(comparePriceReducedFirst)
assert.deepEqual(ordered.map((row) => row.id), [EXPEDITION, 'newest', 'older'])

console.log('price reduction, transit ribbon and listing order passed')
