/** Canonical production host. The apex 308s here; sitemap already uses www. */
export const SITE_ORIGIN = 'https://www.edalkaup.is'

/** Public dealer line. Visible labels stay "699 2011". */
export const DEALER_PHONE_TEL = 'tel:+3546992011'

/** schema.org telephone, with the spacing used on the site. */
export const DEALER_PHONE_SCHEMA = '+354 699 2011'

export const DEALER_PHONE_DISPLAY = '699 2011'

export const DEALER_NAME = 'Eðalkaup'
export const DEALER_LEGAL_NAME = 'Úranus ehf.'

/** Public dealer inbox. Also the fallback for CONTACT_EMAIL_TO. */
export const DEALER_EMAIL = 'sigurdur@edalkaup.is'

/** Quiet vendor credit in the footer. Not a sales line for the dealer. */
export const KLAKI_EMAIL = 'hello@klaki.ai'

export const DEALER_STREET = 'Laugavegur 44'
export const DEALER_POSTAL_CODE = '101'
export const DEALER_LOCALITY = 'Reykjavík'
export const DEALER_COUNTRY = 'IS'

/**
 * Building centroid for Laugavegur 44, 101 Reykjavík.
 * OpenStreetMap way 118706426 via Nominatim (2026-09-29).
 */
export const DEALER_GEO = {
  latitude: 64.1446994,
  longitude: -21.9248892,
} as const

/** Wordmark used in JSON-LD. Matches the gold “E” in the header. */
export const DEALER_LOGO_PATH = '/logo.svg'

/** Messenger profile already linked from the site (Messenger button and Volvo pages). */
export const DEALER_SAME_AS = ['https://m.me/Edalkaup'] as const

/**
 * TODO(call-tracking): When a dedicated tracking line exists, set
 * NEXT_PUBLIC_CALL_TRACKING_TEL in Vercel to a tel URI such as `tel:+3540000000`.
 * Until that variable is set, every click-to-call href stays `tel:+3546992011`
 * and the visible number stays 699 2011. Do not invent a tracking number here.
 * Schema.org telephone stays the public NAP line, not the tracking href.
 */
export function clickToCallHref(): string {
  const tracking = process.env.NEXT_PUBLIC_CALL_TRACKING_TEL?.trim() ?? ''
  if (/^tel:\+\d{7,15}$/.test(tracking)) return tracking
  return DEALER_PHONE_TEL
}
