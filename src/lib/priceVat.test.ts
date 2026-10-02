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

console.log('priceVat tests passed')
