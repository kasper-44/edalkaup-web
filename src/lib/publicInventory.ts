import { cache } from 'react'
import type { Car } from '@/data/cars'
import { supabase } from '@/lib/supabase'
import { orderByNewestListing } from '@/lib/publicCarOrder'
import { adaptCar } from '@/lib/adaptPublicCar'
import { withVatFlag } from '@/lib/priceVat'

export function publicImages(row: { images?: unknown; images_original?: unknown }): string[] {
  const images = Array.isArray(row.images) && row.images.length ? row.images : row.images_original
  return Array.isArray(images) ? images.filter((image): image is string => typeof image === 'string' && /^https?:\/\//.test(image)) : []
}
// React cache deduplicates reads within a request; inventory stays fresh across requests.
export const getPublicRows = cache(async (): Promise<any[]> => {
  const { data, error } = await orderByNewestListing(supabase.from('cars').select('*').eq('status', 'live'))
  if (error) throw new Error('Ekki tókst að sækja bíla til sölu.')
  return (data || []).map((row: any) => ({ ...withVatFlag(row), images: publicImages(row) })).filter((row: any) => row.images.length > 0)
})
export const getPublicCars = cache(async (): Promise<Car[]> => (await getPublicRows()).map(adaptCar))
export const getPublicCar = cache(async (id: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  const { data, error } = await supabase.from('cars').select('*').eq('id', id).eq('status', 'live').maybeSingle()
  if (error) throw new Error('Ekki tókst að sækja upplýsingar um bílinn.')
  if (!data) return null
  const images = publicImages(data)
  return images.length ? { ...withVatFlag(data), images } : null
})
