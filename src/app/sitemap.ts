import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://edalkaup.is'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/bilar`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/afhent`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/um-okkur`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/hafa-samband`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  // Same visibility rule as /bilar and /bilar/[slug]: live + photo-filtered only.
  const { data } = await supabase
    .from('cars')
    .select('id,last_seen_at')
    .eq('status', 'live')
    .not('images_original', 'is', null)

  const carPages = (data || []).map((car) => ({
    url: `${baseUrl}/bilar/${car.id}`,
    lastModified: car.last_seen_at ? new Date(car.last_seen_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...carPages]
}
