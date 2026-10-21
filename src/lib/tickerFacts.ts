import { DEALER_LOCALITY, DEALER_PHONE_DISPLAY, DEALER_PHONE_TEL, DEALER_POSTAL_CODE, DEALER_STREET } from '@/lib/site'

/** Opening hours already printed in the footer and on the contact page. */
export const DEALER_HOURS_SHORT = 'Mán–Fös 09:00–17:00'

export type TickerFact = {
  id: string
  text: string
  href?: string
  /** Pulsing dot. Used for the live inventory count only. */
  live?: boolean
  phone?: boolean
}

/**
 * Short facts for the top marquee. Every string is existing site copy:
 * the public phone line, opening hours, the street address, and
 * “Bílar í sölu” plus the count of cars already shown as til sölu.
 * No showroom or auction claims.
 */
export function tickerFacts(liveCount: number | null): TickerFact[] {
  const facts: TickerFact[] = [
    { id: 'phone', text: `Hringdu í ${DEALER_PHONE_DISPLAY}`, href: DEALER_PHONE_TEL, phone: true },
  ]
  if (typeof liveCount === 'number' && Number.isFinite(liveCount) && liveCount >= 0) {
    facts.push({
      id: 'stock',
      text: `Bílar í sölu · ${liveCount}`,
      href: '/bilar',
      live: true,
    })
  }
  facts.push(
    { id: 'hours', text: DEALER_HOURS_SHORT },
    { id: 'address', text: `${DEALER_STREET}, ${DEALER_POSTAL_CODE} ${DEALER_LOCALITY}` },
  )
  return facts
}
