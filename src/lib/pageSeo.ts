import type { Metadata } from 'next'
import type { Car } from '@/data/cars'
import { SITE_ORIGIN } from '@/lib/site'
import { vehicleTitle } from '@/lib/listingSeo'

export function pageMetadata(title: string, description: string, path: string, index = true): Metadata {
  return {
    title: { absolute: `${title} | Eðalkaup` }, description, alternates: { canonical: path }, robots: { index, follow: true },
    openGraph: { type: 'website', locale: 'is_IS', siteName: 'Eðalkaup', title: `${title} | Eðalkaup`, description, url: path, images: [{ url: '/opengraph-image', width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title: `${title} | Eðalkaup`, description, images: ['/opengraph-image'] },
  }
}
export function inventoryListJsonLd(cars: Car[], path: string, title: string) {
  return {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, url: `${SITE_ORIGIN}${path}`,
    mainEntity: { '@type': 'ItemList', numberOfItems: cars.length, itemListElement: cars.map((car, index) => ({ '@type': 'ListItem', position: index + 1, name: vehicleTitle(car), url: `${SITE_ORIGIN}/bilar/${car.slug}` })) },
  }
}
