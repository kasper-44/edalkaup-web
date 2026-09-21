/**
 * Icelandic-style number grouping that does not depend on ICU locale data.
 *
 * Node on Vercel often ships small-icu, so `Intl.NumberFormat('is-IS')` and
 * `toLocaleString('de-DE')` silently fall back to en-US and render
 * `14,990,000` instead of `14.990.000`.
 */

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Group a number with `.` as the thousands separator.
 * Whole ISK amounts have no decimals. If `fractionDigits` is set, decimals
 * use `,` (Icelandic decimal comma): `14990.5` → `"14.990,50"`.
 */
export function formatIskNumber(value: number, fractionDigits = 0): string {
  if (!isFiniteNumber(value)) return '0'

  const negative = value < 0
  const abs = Math.abs(value)

  let intStr: string
  let fracStr = ''

  if (fractionDigits > 0) {
    const [intPart, fracPart = ''] = abs.toFixed(fractionDigits).split('.')
    intStr = intPart
    fracStr = fracPart
  } else {
    intStr = String(Math.round(abs))
  }

  const grouped = intStr.replace(THOUSANDS, '.')
  const body = fracStr ? `${grouped},${fracStr}` : grouped
  return negative ? `-${body}` : body
}

/** Format an ISK amount for display: `14990000` → `"14.990.000 kr."` */
export function formatIsk(value: number): string {
  return `${formatIskNumber(value)} kr.`
}

/**
 * Listing / card price. Zero or missing amounts use `emptyLabel`
 * instead of `"0 kr."`.
 */
export function formatPrice(
  price: number | null | undefined,
  emptyLabel = 'Verð við fyrirspurn',
): string {
  if (!isFiniteNumber(price) || price === 0) return emptyLabel
  return formatIsk(price)
}
