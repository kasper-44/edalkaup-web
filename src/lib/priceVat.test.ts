import assert from 'node:assert/strict'
import { vatIncludedPriceSubtitle, withVatFlag, type VatPriceFields } from './priceVat'

const GRENADIER_ID = '0678ccc0-da40-4524-9835-d6998911dd16'

assert.equal(vatIncludedPriceSubtitle({ body_type: 'Sendibíll' }), '+ VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: 'sendibíll' }), '+ VSK')
assert.equal(vatIncludedPriceSubtitle({ bodyType: 'Van' }), '+ VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: 'commercial van' }), '+ VSK')

assert.equal(vatIncludedPriceSubtitle({ body_type: 'SUV' }), 'm/VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: 'Jeppi' }), 'm/VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: 'Pick-up' }), 'm/VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: null }), 'm/VSK')
assert.equal(vatIncludedPriceSubtitle({}), 'm/VSK')

assert.equal(vatIncludedPriceSubtitle({ body_type: 'Sendibíll', price_includes_vat: false }), null)
assert.equal(vatIncludedPriceSubtitle({ body_type: 'SUV', price_includes_vat: false }), null)
assert.equal(vatIncludedPriceSubtitle({ body_type: 'Jeppi', vatIncluded: false }), null)

assert.equal(vatIncludedPriceSubtitle({ body_type: 'Sendibíll', price_includes_vat: true }), 'm/VSK')
assert.equal(vatIncludedPriceSubtitle({ body_type: 'SUV', priceIncludesVat: true }), 'm/VSK')

const grenadier: VatPriceFields = withVatFlag({ id: GRENADIER_ID, body_type: 'Jeppi' })
assert.equal(grenadier.price_includes_vat, false)
assert.equal(vatIncludedPriceSubtitle(grenadier), null)

const grenadierExplicit: VatPriceFields = withVatFlag({
  id: GRENADIER_ID,
  body_type: 'Jeppi',
  price_includes_vat: true,
})
assert.equal(grenadierExplicit.price_includes_vat, true)
assert.equal(vatIncludedPriceSubtitle(grenadierExplicit), 'm/VSK')

const van: VatPriceFields = withVatFlag({ id: 'not-the-grenadier', body_type: 'Sendibíll' })
assert.equal(van.price_includes_vat, undefined)
assert.equal(vatIncludedPriceSubtitle(van), '+ VSK')

const HIDDEN_VSK: ReadonlyArray<readonly [string, string, number | null]> = [
  ['1b9200de-ce7e-4e23-9ac8-e3ae1c1312b5', 'SUV', 3790000],
  ['f3f4c0da-fec8-4d8b-9749-8eca50ffd153', 'Sendibíll', 2490000],
  ['bdcdc40a-423f-40c3-848a-ce7e7ac5468a', 'SUV', 8990000],
  ['bb6f7c44-2505-4149-acda-d9812988a623', 'SUV', 8890000],
  ['4811327a-7a7b-4f98-82c3-538a319c14f1', 'SUV', 7990000],
  ['ad089135-52d8-4af6-8f8a-1d9de8e96242', 'Pick-up', null],
]

for (const [id, body, price] of HIDDEN_VSK) {
  const row = { id, body_type: body, price_isk: price }
  const detail = withVatFlag(row)
  assert.equal(detail.price_isk, price)
  assert.equal(row.price_isk, price)
  assert.equal(vatIncludedPriceSubtitle(detail), null)

  const card = withVatFlag({ id, bodyType: body, priceIncludesVat: null })
  assert.equal(vatIncludedPriceSubtitle(card), null)
}

const hiluxPallbill = withVatFlag({
  id: 'ad089135-52d8-4af6-8f8a-1d9de8e96242',
  body_type: 'Pallbíll',
})
assert.equal(vatIncludedPriceSubtitle(hiluxPallbill), null)

const hiluxExplicit: VatPriceFields = withVatFlag({
  id: 'ad089135-52d8-4af6-8f8a-1d9de8e96242',
  body_type: 'Pick-up',
  price_includes_vat: true,
})
assert.equal(hiluxExplicit.price_includes_vat, true)
assert.equal(vatIncludedPriceSubtitle(hiluxExplicit), 'm/VSK')

const KEEP_VSK: ReadonlyArray<readonly [string, string, string]> = [
  ['c4267e29-e227-4dbc-9d50-2c4485f4c4bb', 'Pallbíll', 'm/VSK'],
  ['0079429b-bf08-4216-a170-432c95ddd8d6', 'Pallbíll', 'm/VSK'],
  ['d297d652-2063-48fc-8932-e98fde4f2c17', 'Pick-up', 'm/VSK'],
  ['a5e9830e-0b6c-4776-a56a-727964c807f8', 'Sendibíll', '+ VSK'],
]

for (const [id, body, subtitle] of KEEP_VSK) {
  const detail = withVatFlag({ id, body_type: body, price_isk: 16590000 })
  assert.equal(detail.price_includes_vat, undefined)
  assert.equal(detail.price_isk, 16590000)
  assert.equal(vatIncludedPriceSubtitle(detail), subtitle)
  assert.equal(
    vatIncludedPriceSubtitle(withVatFlag({ id, bodyType: body, priceIncludesVat: null })),
    subtitle,
  )
}

console.log('priceVat tests passed')
