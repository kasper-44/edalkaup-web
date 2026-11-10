import { NextRequest, NextResponse } from 'next/server'
import { dealerSlugForHost } from '@/lib/dealerHosts'

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
  const dealer = dealerSlugForHost(host)
  const { pathname } = req.nextUrl

  if (isAsset(pathname)) return NextResponse.next()

  if (dealer) {
    const url = req.nextUrl.clone()
    url.pathname = `/volvo-ex60/${dealer}`
    return NextResponse.rewrite(url)
  }

  const res = NextResponse.next()
  if (INVENTORY_PATH.test(pathname) && [...req.nextUrl.searchParams.keys()].length > 0) {
    res.headers.set('X-Robots-Tag', 'noindex, follow')
  }
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
