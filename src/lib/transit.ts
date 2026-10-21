/**
 * Shown as the Á LEIÐINNI ribbon until `in_transit` exists on the row.
 * A stored boolean wins, so the /stjorn checkbox can clear it after the column lands.
 */
const IN_TRANSIT_UNTIL_COLUMN = new Set(['0079429b-bf08-4216-a170-432c95ddd8d6'])

export type TransitInput = {
  id?: string | null
  in_transit?: boolean | null
  status?: string | null
}

export function isInTransit(car: TransitInput): boolean {
  if (car.status === 'in-transit') return true
  if (typeof car.in_transit === 'boolean') return car.in_transit
  return IN_TRANSIT_UNTIL_COLUMN.has(String(car.id || ''))
}

/** Buyer-facing arrival line. Stored value is the date phrase, e.g. «nóv 2026». */
export function expectedArrivalLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text) return null
  if (/^væntanleg/i.test(text)) return text
  return `Væntanlegur: ${text}`
}
