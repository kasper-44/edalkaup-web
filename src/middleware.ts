import { NextRequest, NextResponse } from 'next/server'
import { publicCarSlug } from '@/lib/carPath'
import { getPublicCar } from '@/lib/publicInventory'

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

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host')?.split(':')[0]?.toLowerCase() || ''
  const dealer = HOST_TO_DEALER[host]
  const { pathname } = req.nextUrl

  if (isAsset(pathname)) return NextResponse.next()

  const carMatch = pathname.match(/^\/bilar\/([^/]+)\/?$/)
  if (carMatch) {
    const requested = decodeURIComponent(carMatch[1])
    try {
      const car = await getPublicCar(requested)
      if (car) {
        const canonical = publicCarSlug(car)
        if (requested !== canonical) {
          const url = req.nextUrl.clone()
          url.pathname = `/bilar/${canonical}`
          return NextResponse.redirect(url, 301)
        }
      }
    } catch {
      // The page reports the inventory error. A failed lookup must not 500 the redirect.
    }
  }

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
