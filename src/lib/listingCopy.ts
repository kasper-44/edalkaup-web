/** Buyer-facing listing copy from `description_is`. Empty/whitespace-only is omitted. */
export function listingCopy(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  return text || null
}
