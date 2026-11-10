import type { Metadata } from 'next'
import { DEALER_HOSTS, type HostedDealerSlug } from '@/lib/dealerHosts'
import { SITE_ORIGIN } from '@/lib/site'

export const DEALER_SLUGS = ['diesel', 'hofdabilar', 'edalkaup'] as const
export type DealerSlug = (typeof DEALER_SLUGS)[number]

/**
 * Names taken from the text on each dealer page.
 * The edalkaup logo alt is omitted here: these tags must not say Eðalkaup.
 */
const DEALER_NAMES: Record<HostedDealerSlug, string> = {
  diesel: 'Diesel.is',
  hofdabilar: 'Höfðabílar',
}

/** Spec line already on the page. No price and no extra claims. */
const SPEC =
  'Volvo EX60 Ultra, TWIN Performance (tvímótora P12 AWD), árgerð 2027, Onyx Black að utan.'

const HERO_PATH = '/images/ex60/hero.jpg'
const HERO_ALT = 'Volvo EX60 Ultra, Onyx Black, þriggja fjórðu framhorn'
const HERO_WIDTH = 1600
const HERO_HEIGHT = 900

export function isDealerSlug(value: string): value is DealerSlug {
  return (DEALER_SLUGS as readonly string[]).includes(value)
}

/**
 * Diesel and Höfðabílar are published on their own hosts: the middleware
 * rewrites those hosts to the dealer page, so the host root is the public URL.
 * edalkaup has no host in that map, so it stays on the site path.
 */
export function dealerCanonicalUrl(dealer: DealerSlug): string {
  for (const [host, slug] of Object.entries(DEALER_HOSTS)) {
    if (slug === dealer) return `https://${host}`
  }
  return `${SITE_ORIGIN}/volvo-ex60/${dealer}`
}

function dealerOrigin(dealer: DealerSlug): string {
  for (const [host, slug] of Object.entries(DEALER_HOSTS)) {
    if (slug === dealer) return `https://${host}`
  }
  return SITE_ORIGIN
}

export function dealerPageMetadata(dealer: DealerSlug): Metadata {
  const name = dealer in DEALER_NAMES ? DEALER_NAMES[dealer as HostedDealerSlug] : null
  const title = name
    ? `Volvo EX60 Ultra — TWIN Performance | ${name}`
    : 'Volvo EX60 Ultra — TWIN Performance'
  const description = name ? `${name} — ${SPEC}` : SPEC
  const siteName = name ?? 'Volvo EX60'
  const url = dealerCanonicalUrl(dealer)
  const image = {
    url: `${dealerOrigin(dealer)}${HERO_PATH}`,
    secureUrl: `${dealerOrigin(dealer)}${HERO_PATH}`,
    alt: HERO_ALT,
    type: 'image/jpeg',
    width: HERO_WIDTH,
    height: HERO_HEIGHT,
  }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'is_IS',
      url,
      siteName,
      title: { absolute: title },
      description,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: { absolute: title },
      description,
      images: [image],
    },
    other: {
      'twitter:url': url,
      'twitter:site_name': siteName,
    },
  }
}
