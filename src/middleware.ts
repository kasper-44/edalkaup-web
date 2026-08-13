import { NextRequest, NextResponse } from 'next/server'

const HOST_TO_DEALER: Record<string, string> = {
  'volvo-ex60-diesel.vercel.app': 'diesel',
  'volvo-ex60-hofdabilar.vercel.app': 'hofdabilar',
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.split(':')[0]?.toLowerCase() || ''
  const dealer = HOST_TO_DEALER[host]
  if (!dealer) return NextResponse.next()

  const { pathname } = req.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next()
  }

  const url = req.nextUrl.clone()
  url.pathname = `/volvo-ex60/${dealer}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
