import { NextRequest, NextResponse } from 'next/server'

/**
 * Exact own keys only. `host in DEALER_HOSTS` would also match prototype
 * names such as `constructor` and `toString`.
 */
const DEALER_HOSTS: Record<string, true> = {
  'volvo-ex60-diesel.vercel.app': true,
  'volvo-ex60-hofdabilar.vercel.app': true,
}

const EX60_EDALKAUP = 'https://www.edalkaup.is/volvo-ex60/edalkaup'

/** Indexed inventory URLs. A query string is a filter and stays noindex. */
const INVENTORY_PATH = /^\/bilar(?:\/(?:flokkur|framleidandi)\/[^/]+)?\/?$/

function isAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  )
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.split(':')[0]?.toLowerCase() || ''
  if (Object.hasOwn(DEALER_HOSTS, host)) {
    return NextResponse.redirect(EX60_EDALKAUP, 308)
  }

  const { pathname } = req.nextUrl
  if (isAsset(pathname)) return NextResponse.next()

  const res = NextResponse.next()
  if (INVENTORY_PATH.test(pathname) && [...req.nextUrl.searchParams.keys()].length > 0) {
    res.headers.set('X-Robots-Tag', 'noindex, follow')
  }
  return res
}

export const config = {
  matcher: [
    // Dealer hosts must redirect every path, including /_next static assets.
    // Dots are escaped because the host condition is compiled as a regexp.
    {
      source: '/(.*)',
      has: [{ type: 'host', value: 'volvo-ex60-diesel\\.vercel\\.app' }],
    },
    {
      source: '/(.*)',
      has: [{ type: 'host', value: 'volvo-ex60-hofdabilar\\.vercel\\.app' }],
    },
    '/((?!_next/static|_next/image).*)',
  ],
}
