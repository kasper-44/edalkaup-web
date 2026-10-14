import assert from 'node:assert/strict'
import { publicCarSlug, shortIdFromSlug, slugifyListingTitle } from '@/lib/carPath'
import { expectedArrivalLabel } from '@/lib/transit'

assert.equal(
  publicCarSlug({
    id: '3fe233e6-b914-4cdf-868f-2acfa87884c4',
    title: 'Volvo XC60 T6 facelift Black Edition Ultra',
    make: 'Volvo',
    model: 'XC60',
  }),
  'volvo-xc60-t6-facelift-black-edition-ultra-3fe233',
)

assert.equal(
  slugifyListingTitle('2026 Toyota Sequoia TRD Pro'),
  'toyota-sequoia-trd-pro',
)
assert.equal(slugifyListingTitle('Þór Ægir ökutæki 1999'), 'thor-aegir-okutaeki')
assert.equal(slugifyListingTitle('Blár'), 'blar')
assert.equal(shortIdFromSlug('volvo-xc60-t6-facelift-black-edition-ultra-3fe233'), '3fe233')
assert.equal(shortIdFromSlug('3fe233e6-b914-4cdf-868f-2acfa87884c4'), null)

assert.equal(expectedArrivalLabel('nóv 2026'), 'Væntanlegur: nóv 2026')
assert.equal(expectedArrivalLabel('Væntanlegur: nóv 2026'), 'Væntanlegur: nóv 2026')
assert.equal(expectedArrivalLabel('  '), null)
assert.equal(expectedArrivalLabel(null), null)

console.log('car path and arrival label tests passed')
