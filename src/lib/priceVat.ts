/** Commercial vans list the price without VAT, so the subtitle is «+ VSK». */
const COMMERCIAL_VAN_BODY_TYPES = new Set(['sendibill', 'van', 'commercial van'])

/**
 * Listed price has no VSK line. Until `price_includes_vat` exists on the row,
 * this listing still omits the subtitle. A stored boolean wins.
 */
const PRICE_EXCLUDES_VAT_IDS = new Set(['0678ccc0-da40-4524-9835-d6998911dd16'])

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

/** Apply the Grenadier-style exclusion when the row has no stored VAT flag. */
export function withVatFlag<T extends VatPriceFields & { id?: string | null }>(car: T): T {
  if (!car?.id || !PRICE_EXCLUDES_VAT_IDS.has(car.id)) return car
  if (vatIncludedFlag(car) !== null) return car
  return { ...car, price_includes_vat: false }
}

/**
 * Passenger cars keep «m/VSK». Sendibíll / vans show «+ VSK» (VAT on top of
 * the listed price). An explicit false flag hides the line for every body type.
 * An explicit true flag forces «m/VSK», including on a van.
 */
export function vatIncludedPriceSubtitle(car: VatPriceFields): string | null {
  const flag = vatIncludedFlag(car)
  if (flag === true) return 'm/VSK'
  if (flag === false) return null

  const body = foldIcelandic(car.body_type || car.bodyType || '')
  if (COMMERCIAL_VAN_BODY_TYPES.has(body)) return '+ VSK'
  return 'm/VSK'
}
