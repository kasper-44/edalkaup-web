import type { MetadataRoute } from 'next'
import { getPublicRows } from '@/lib/publicInventory'
import { SITE_ORIGIN } from '@/lib/site'
import { INVENTORY_CATEGORIES, normalizeSearch } from '@/lib/inventory'
import { adaptCar } from '@/lib/adaptPublicCar'
import { deliveredCars } from '@/data/cars'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rows = await getPublicRows()
  const cars = rows.map(adaptCar)
  const staticPaths = ['/', '/bilar', '/bilainnflutningur', '/um-okkur', '/hafa-samband']
  if (deliveredCars.length) staticPaths.push('/afhent')
  const categories = INVENTORY_CATEGORIES.filter((category) => cars.some(category.matches)).map((category) => `/bilar/flokkur/${category.slug}`)
  const brands = [...new Set(cars.map((car) => `/bilar/framleidandi/${normalizeSearch(car.make).replace(/\s+/g, '-')}`))]
  return [
    ...[...staticPaths, ...categories, ...brands].map((path) => ({ url: `${SITE_ORIGIN}${path === '/' ? '' : path}` })),
    ...rows.map((row: any) => {
      const updated = row.last_seen_at || row.created_at
      const date = updated ? new Date(updated) : null
      return { url: `${SITE_ORIGIN}/bilar/${row.id}`, ...(date && Number.isFinite(date.getTime()) ? { lastModified: date } : {}) }
    }),
  ]
}
