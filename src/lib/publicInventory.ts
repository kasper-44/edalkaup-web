import { unstable_cache } from 'next/cache'
import { cache } from 'react'
import type { Car } from '@/data/cars'
import { CAR_UUID_RE, publicCarSlug, shortIdFromSlug } from '@/lib/carPath'
import { supabase } from '@/lib/supabase'
import { orderByNewestListing } from '@/lib/publicCarOrder'
import { adaptCar } from '@/lib/adaptPublicCar'
import { comparePriceReducedFirst } from '@/lib/priceReduction'
import { withVatFlag } from '@/lib/priceVat'

export function publicImages(row: { images?: unknown; images_original?: unknown }): string[] {
  const images = Array.isArray(row.images) && row.images.length ? row.images : row.images_original
  return Array.isArray(images) ? images.filter((image): image is string => typeof image === 'string' && /^https?:\/\//.test(image)) : []
}
/**
 * How long a prerendered public page may serve this inventory before regenerating.
 * Keep the literal in `src/app/layout.tsx` (`export const revalidate`) the same.
 * The admin car route also expires the `public-cars` tag on publish, sale, and delete.
 */
export const PUBLIC_CATALOG_REVALIDATE = 300

async function loadPublicRows(): Promise<any[]> {
  const { data, error } = await orderByNewestListing(supabase.from('cars').select('*').eq('status', 'live'))
  if (error) throw new Error('Ekki tókst að sækja bíla til sölu.')
  return (data || [])
    .map((row: any) => ({ ...withVatFlag(row), images: publicImages(row) }))
    .filter((row: any) => row.images.length > 0)
    .sort(comparePriceReducedFirst)
}

const loadPublicRowsCached = unstable_cache(loadPublicRows, ['public-live-cars'], {
  revalidate: PUBLIC_CATALOG_REVALIDATE,
  tags: ['public-cars'],
})

// React cache deduplicates reads within a request. unstable_cache keeps them across requests.
export const getPublicRows = cache(async (): Promise<any[]> => loadPublicRowsCached())
export const getPublicCars = cache(async (): Promise<Car[]> => (await getPublicRows()).map(adaptCar))

/**
 * Resolve a public listing from either the legacy UUID or the pretty slug.
 * UUID columns cannot use a prefix filter, and the live inventory is small,
 * so the match is done in memory against the same rows the grids already load.
 */
export const getPublicCar = cache(async (param: string) => {
  const rows = await getPublicRows()
  if (CAR_UUID_RE.test(param)) {
    return rows.find((row) => String(row.id).toLowerCase() === param.toLowerCase()) ?? null
  }
  const short = shortIdFromSlug(param)
  if (!short) return null
  const matches = rows.filter((row) => String(row.id).toLowerCase().startsWith(short))
  return (
    matches.find((row) => publicCarSlug(row) === param.toLowerCase()) ??
    (matches.length === 1 ? matches[0] : null)
  )
})
