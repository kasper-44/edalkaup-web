/**
 * Public price cuts.
 *
 * `price_reduced` and `previous_price_isk` are the stored flags (see
 * scripts/schema_update_7.sql). Until that column exists on a row, the two
 * listings below still show the ribbon and the struck previous price.
 * A stored boolean always wins, so /stjorn can turn the ribbon off.
 */

export const PRICE_REDUCED_PREVIOUS: Record<string, number> = {
  '1b9200de-ce7e-4e23-9ac8-e3ae1c1312b5': 3890000,
  'f3f4c0da-fec8-4d8b-9749-8eca50ffd153': 2890000,
}

export type PriceReductionInput = {
  id?: string | null
  price_reduced?: boolean | null
  priceReduced?: boolean | null
  previous_price_isk?: number | null
  previousPrice?: number | null
}

export type PriceReduction = {
  reduced: boolean
  previousPrice: number | null
}

function positivePrice(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return null
  return value
}

export function priceReduction(car: PriceReductionInput): PriceReduction {
  const stored =
    typeof car.price_reduced === 'boolean'
      ? car.price_reduced
      : typeof car.priceReduced === 'boolean'
        ? car.priceReduced
        : null

  if (stored !== null) {
    const previous = positivePrice(car.previous_price_isk ?? car.previousPrice)
    return { reduced: stored, previousPrice: stored ? previous : null }
  }

  const fallback = PRICE_REDUCED_PREVIOUS[String(car.id || '')]
  if (fallback) return { reduced: true, previousPrice: fallback }
  return { reduced: false, previousPrice: null }
}

/** Price-reduced listings first. Equal ranks keep the incoming newest-first order. */
export function comparePriceReducedFirst(a: PriceReductionInput, b: PriceReductionInput): number {
  return Number(priceReduction(b).reduced) - Number(priceReduction(a).reduced)
}
