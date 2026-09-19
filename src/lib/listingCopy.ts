/** Lines written by `scripts/sync_inventory.py` — sourcing data, not buyer copy. */
const PIPELINE_LINE =
  /^(VIN:|Original price:|Mileage:|Dealer:|Styrkhæfur frá Orkusjóði)(?:\s|$)/i

function isPipelineSourcingDump(text: string): boolean {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  return lines.length > 0 && lines.every((line) => PIPELINE_LINE.test(line))
}

/**
 * Buyer-facing listing copy from `description_is`.
 * Empty / whitespace-only is omitted. Auto.dev sync dumps (VIN / original
 * price / dealer only) stay hidden — that sourcing box was removed from
 * public pages in June 2026.
 */
export function listingCopy(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const text = value.trim()
  if (!text) return null
  if (isPipelineSourcingDump(text)) return null
  return text
}
