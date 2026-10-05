import assert from 'node:assert/strict'
import { adaptCar } from './adaptPublicCar'
import { isDealerRangeCar } from './dealerRange'
import { INVENTORY_CATEGORIES } from './inventory'

const car = (make: string, model: string, fuel = 'Gasoline', body = 'SUV') => adaptCar({ id: `${make}-${model}`, make, model, year: 2025, fuel_type: fuel, body_type: body })
const evPickup = car('GMC', 'Sierra EV', 'Electric', 'Pickup')
const hybridPickup = car('Ford', 'F-150', 'Hybrid', 'Pickup')
const electricSuv = car('Toyota', 'bZ4X', 'Electric', 'SUV')
for (const supported of [evPickup, car('Volvo', 'XC90'), car('Ford', 'Explorer'), car('Maxus', 'T90'), car('Toyota', 'Sequoia')]) {
  assert.equal(isDealerRangeCar(supported), true, `${supported.make} ${supported.model} is in the dealer range`)
}
for (const other of [hybridPickup, electricSuv, car('Jeep', 'Wrangler'), car('Ford', 'Transit'), car('Toyota', 'Land Cruiser')]) {
  assert.equal(isDealerRangeCar(other), false, `${other.make} ${other.model} is outside the advertised range`)
}
const evCategory = INVENTORY_CATEGORIES.find(category => category.slug === 'rafmagnspallbilar')!
assert.equal(evCategory.matches(evPickup), true)
assert.equal(evCategory.matches(car('GMC', 'Sierra EV', 'Rafmagn', 'Pallbíll')), true)
assert.equal(evCategory.matches(hybridPickup), false)
assert.equal(evCategory.matches(electricSuv), false)
console.log('Dealer range and EV pickup category include supported vehicles and exclude unrelated stock')
