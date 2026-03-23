import { MetadataRoute } from 'next'
import { cars, deliveredCars } from '@/data/cars'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://edalkaup.is'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/bilar`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/afhent`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.7 },
    { url: `${baseUrl}/um-okkur`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/hafa-samband`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  const carPages = cars.map((car) => ({
    url: `${baseUrl}/bilar/${car.slug}`,
    lastModified: new Date(car.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...carPages]
}
