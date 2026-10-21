import assert from 'node:assert/strict'
import { draftFromCar, listingChanges, type Car } from '@/lib/adminListingDraft'

const car = {
  id: '3fe233e6-b914-4cdf-868f-2acfa87884c4',
  title: 'Volvo XC60 T6 facelift Black Edition Ultra',
  make: 'Volvo',
  model: 'XC60',
  year: 2025,
  trim: '',
  price_isk: 100,
  price_original: null,
  price_currency: null,
  mileage_km: 10,
  colour: null,
  exterior_colour: null,
  interior_colour: null,
  engine: null,
  fuel_type: null,
  body_type: null,
  transmission: null,
  drivetrain: null,
  doors: null,
  seats: null,
  battery_kwh: null,
  horsepower_hp: null,
  range_km: null,
  towing_kg: null,
  images: null,
  images_original: null,
  description_is: null,
  source_url: null,
  vin: null,
  last_seen_at: null,
  status: 'live',
  location_country: null,
  price_verified: true,
  specs_verified: true,
} satisfies Car

const draft = draftFromCar(car)
assert.equal(draft.in_transit, false)
assert.equal(draft.expected_arrival, '')
assert.deepEqual(listingChanges(car, { ...draft, in_transit: true, expected_arrival: 'nóv 2026' }).payload, {
  in_transit: true,
  expected_arrival: 'nóv 2026',
})
assert.equal(listingChanges(car, { ...draft, expected_arrival: 'x'.repeat(81) }).error, 'Væntanleg komu er of löng')
assert.deepEqual(listingChanges({ ...car, in_transit: true }, { ...draft, in_transit: false }).payload, {
  in_transit: false,
})
assert.deepEqual(listingChanges(car, { ...draft, price_reduced: true, previous_price_isk: '3890000' }).payload, {
  price_reduced: true,
  previous_price_isk: 3890000,
})
assert.equal(listingChanges(car, { ...draft, previous_price_isk: '12.5' }).error, 'Ógilt fyrra verð')
assert.deepEqual(listingChanges({ ...car, price_reduced: true }, { ...draft, price_reduced: false }).payload, {
  price_reduced: false,
})

console.log('admin listing draft transit tests passed')
