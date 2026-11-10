/**
 * Public hosts that rewrite to a Volvo EX60 dealer page.
 * Middleware sends every non-asset request on these hosts to `/volvo-ex60/{slug}`.
 */
export const DEALER_HOSTS = {
  'volvo-ex60-diesel.vercel.app': 'diesel',
  'volvo-ex60-hofdabilar.vercel.app': 'hofdabilar',
} as const

export type DealerHost = keyof typeof DEALER_HOSTS
export type HostedDealerSlug = (typeof DEALER_HOSTS)[DealerHost]

export function dealerSlugForHost(host: string): HostedDealerSlug | undefined {
  if (host in DEALER_HOSTS) return DEALER_HOSTS[host as DealerHost]
  return undefined
}
