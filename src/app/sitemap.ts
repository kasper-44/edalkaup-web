import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.edalkaup.is'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/bilar`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/afhent`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/um-okkur`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/hafa-samband`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const { data } = await supabase
    .from('cars')
    .select('id,last_seen_at,images,images_original')
    .eq('status', 'live')

  const carPages = (data || [])
    .filter((car) => {
      const live = Array.isArray(car.images) ? car.images.length : 0
      const orig = Array.isArray(car.images_original) ? car.images_original.length : 0
      return live + orig > 0
    })
    .map((car) => ({
      url: `${baseUrl}/bilar/${car.id}`,
      lastModified: car.last_seen_at ? new Date(car.last_seen_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...carPages]
}
