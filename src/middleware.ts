import { NextRequest, NextResponse } from 'next/server'

const HOST_TO_DEALER: Record<string, string> = {
  'volvo-ex60-diesel.vercel.app': 'diesel',
  'volvo-ex60-hofdabilar.vercel.app': 'hofdabilar',
}

const DEALER_PATH = /^\/volvo-ex60\/(diesel|hofdabilar|edalkaup)\/?$/

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
  const dealer = HOST_TO_DEALER[host]
  const { pathname } = req.nextUrl

  if (isAsset(pathname)) return NextResponse.next()

  const hideChrome = Boolean(dealer) || DEALER_PATH.test(pathname)
  const requestHeaders = new Headers(req.headers)
  if (hideChrome) requestHeaders.set('x-hide-site-chrome', '1')

  if (dealer) {
    const url = req.nextUrl.clone()
    url.pathname = `/volvo-ex60/${dealer}`
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } })
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
