import assert from 'node:assert/strict'
import { EMPTY_FILTERS, filterCars, sortCars, parseInventoryFilters, fuelLabel } from './inventory'
import { adaptCar } from './adaptPublicCar'
import { carJsonLd, listingMetaDescription } from './listingSeo'
import { listingCopy } from './listingCopy'

const electric = adaptCar({ id: 'electric', make: 'Toyota', model: 'bZ4X', year: 2025, price_isk: 4000000, mileage_km: 20000, fuel_type: 'Electric', body_type: 'SUV', images: ['https://example.com/car.jpg'] })
const cheap = adaptCar({ id: 'cheap', make: 'Ford', model: 'Transit', year: 2020, price_isk: 2000000, mileage_km: 120000, fuel_type: 'Diesel', body_type: 'Sendibíll' })
const unknown = adaptCar({ id: 'unknown', make: 'Ford', model: 'Explorer', year: 2022, price_isk: null, mileage_km: null })
assert.equal(unknown.mileage, null)
assert.equal(unknown.drivetrain, 'Ótilgreint')
assert.equal(unknown.bodyType, 'Ótilgreint')
assert.equal(fuelLabel('Plug-in Hybrid'), 'Tengiltvinn')
assert.equal(fuelLabel('Electric'), 'Rafmagn')
assert.equal(fuelLabel('Dísel'), 'Dísil')
assert.equal(fuelLabel('Gasoline / Electric'), 'Tvinn')
assert.deepEqual(filterCars([electric, cheap, unknown], { ...EMPTY_FILTERS, maxPrice: '3000000' }).map(car => car.id), ['cheap'])
assert.deepEqual(filterCars([electric, cheap, unknown], { ...EMPTY_FILTERS, maxMileage: '50000' }).map(car => car.id), ['electric'])
assert.deepEqual(filterCars([electric, cheap], { ...EMPTY_FILTERS, q: 'toyota 2025' }).map(car => car.id), ['electric'])
assert.equal(filterCars([electric], { ...EMPTY_FILTERS, q: 'not-a-model' }).length, 0)
assert.equal(filterCars([electric], { ...EMPTY_FILTERS, minPrice: '5000000', maxPrice: '2000000' }).length, 0)
assert.deepEqual(sortCars([unknown, cheap, electric], 'price-high').map(car => car.id), ['electric', 'cheap', 'unknown'])
assert.deepEqual(sortCars([unknown, electric, cheap], 'price-low').map(car => car.id), ['cheap', 'electric', 'unknown'])
assert.deepEqual(sortCars([unknown, cheap, electric], 'mileage').map(car => car.id), ['electric', 'cheap', 'unknown'])
assert.deepEqual(sortCars([cheap, electric], 'newest').map(car => car.id), ['cheap', 'electric'])
assert.equal(parseInventoryFilters({ minPrice: '-1', maxYear: ['2025'], maxMileage: 'garbage' }).minPrice, '')
assert.equal(parseInventoryFilters({ q: 'Toyota', maxPrice: '2000000' }).maxPrice, '2000000')
assert.equal(listingMetaDescription({ make: 'Ford', model: 'Explorer', year: 2022, mileage_km: null }).includes('akstur ótilgreindur'), true)
assert.equal('itemCondition' in carJsonLd({ make: 'Ford', model: 'Explorer', year: 2022, mileage_km: null }, 'id'), false)
assert.equal(listingCopy('Lýsing á bíl\nVIN: PRIVATE\nOriginal price: $100'), 'Lýsing á bíl')
console.log('Inventory filters, unknown data, sorting and listing copy passed')
