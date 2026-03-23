export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function generateCarJsonLd(car: {
  make: string
  model: string
  year: number
  mileage: number
  color: string
  price: number
  images: string[]
  description: string
  slug: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.year} ${car.make} ${car.model}`,
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: car.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: car.mileage,
      unitCode: 'KMT',
    },
    color: car.color,
    image: car.images[0],
    description: car.description,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'ISK',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Eðalkaup',
        url: 'https://edalkaup.is',
      },
    },
    url: `https://edalkaup.is/bilar/${car.slug}`,
  }
}
