/** Buyer-facing arrival line. Stored value is the date phrase, e.g. «nóv 2026». */
export function expectedArrivalLabel(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text) return null
  if (/^væntanleg/i.test(text)) return text
  return `Væntanlegur: ${text}`
}
