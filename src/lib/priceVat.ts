/** Commercial vans sold without VAT in the listed price. */
const COMMERCIAL_VAN_BODY_TYPES = new Set(['sendibill', 'van', 'commercial van'])

function foldIcelandic(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export type VatPriceFields = {
  body_type?: string | null
  bodyType?: string | null
  price_includes_vat?: boolean | null
  priceIncludesVat?: boolean | null
  vat_included?: boolean | null
  vatIncluded?: boolean | null
}

function vatIncludedFlag(car: VatPriceFields): boolean | null {
  for (const value of [car.price_includes_vat, car.priceIncludesVat, car.vat_included, car.vatIncluded]) {
    if (typeof value === 'boolean') return value
  }
  return null
}

/** Passenger cars keep «m/VSK». Sendibíll / vans omit any VSK line under the price. */
export function vatIncludedPriceSubtitle(car: VatPriceFields): string | null {
  const flag = vatIncludedFlag(car)
  if (flag === true) return 'm/VSK'
  if (flag === false) return null

  const body = foldIcelandic(car.body_type || car.bodyType || '')
  if (COMMERCIAL_VAN_BODY_TYPES.has(body)) return null
  return 'm/VSK'
}
