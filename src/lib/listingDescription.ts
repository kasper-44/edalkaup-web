export type ListingBlock =
  | { type: 'chips'; items: string[] }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string }

/** `Verð: 10.590.000 kr` repeats the price already shown beside the listing. */
const PRICE_LINE = /^verð\s*:/i
/** `Helstu staðreyndir:` / `Búnaður:` — a label with nothing after the colon. */
const HEADING_LINE = /^([^•*].{0,100}?):\s*$/
const BULLET_LINE = /^(?:[•·])\s*(.*)$|^[-*]\s+(.*)$/
/** `+FACELIFT+` style markers. Ordinary “+ VSK” text has no closing plus. */
const CHIP = /\+([A-ZÁÉÍÓÚÝÞÆÖÐ0-9][A-ZÁÉÍÓÚÝÞÆÖÐ0-9 /&.-]{0,40})\+/g

/**
 * Turn free-text listing copy into headings, lists, paragraphs and highlight chips.
 * Price lines that only repeat the displayed price are omitted.
 */
export function parseListingDescription(value: string | null | undefined): ListingBlock[] {
  if (!value?.trim()) return []
  const blocks: ListingBlock[] = []
  let list: string[] | null = null

  const flush = () => {
    if (list?.length) blocks.push({ type: 'list', items: list })
    list = null
  }

  for (const raw of value.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || PRICE_LINE.test(line)) {
      if (!line) flush()
      continue
    }

    const chips: string[] = []
    const rest = line.replace(CHIP, (_match, label: string) => {
      const text = label.trim()
      if (text) chips.push(text)
      return ''
    }).trim()

    if (chips.length) {
      flush()
      const last = blocks[blocks.length - 1]
      if (last?.type === 'chips') last.items.push(...chips)
      else blocks.push({ type: 'chips', items: chips })
    }
    if (!rest) continue

    if (HEADING_LINE.test(rest)) {
      flush()
      blocks.push({ type: 'heading', text: rest.replace(/:\s*$/, '').trim() })
      continue
    }

    const bullet = rest.match(BULLET_LINE)
    if (bullet) {
      const item = (bullet[1] ?? bullet[2] ?? '').trim()
      if (!item) continue
      list ??= []
      list.push(item)
      continue
    }

    flush()
    blocks.push({ type: 'paragraph', text: rest })
  }

  flush()
  return blocks
}
