import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import CarDetail from '@/components/CarDetail'

export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCar(slug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', slug)
    .eq('status', 'live')
    .single()
  if (error || !data) return null
  return data
}

function carTitle(car: { year: number; make: string; model: string; trim?: string }) {
  return `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.trim()
}

// --- Per-car SEO metadata (server-rendered) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const car = await getCar(slug)
  if (!car) {
    return { title: 'Bíll fannst ekki' }
  }
  const title = carTitle(car)
  const priceText =
    car.price_isk > 0
      ? new Intl.NumberFormat('is-IS').format(car.price_isk) + ' kr.'
      : 'Verð við fyrirspurn'
  const km = car.mileage_km
    ? new Intl.NumberFormat('is-IS').format(car.mileage_km) + ' km'
    : 'nýr'
  const description = `${title} til sölu hjá Eðalkaup — ${km}, ${priceText}. Innfluttur frá Norður-Ameríku. Hafðu samband fyrir nánari upplýsingar.`
  const image = car.images?.[0]

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title: `${title} | Eðalkaup`,
      description,
      images: image ? [{ url: image }] : undefined,
      url: `https://edalkaup.is/bilar/${slug}`,
    },
    alternates: { canonical: `https://edalkaup.is/bilar/${slug}` },
  }
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const car = await getCar(slug)

  if (!car) {
    return (
      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-4xl font-bold text-gray-300 dark:text-slate-600 mb-4">404</h1>
          <p className="text-xl text-gray-500 dark:text-slate-400 mb-6">Bíll fannst ekki</p>
          <a href="/bilar" className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Fara á bílasíðu
          </a>
        </div>
      </div>
    )
  }

  const title = carTitle(car)

  // JSON-LD structured data (schema.org/Car) for rich Google results.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: title,
    brand: { '@type': 'Brand', name: car.make },
    model: car.model,
    vehicleModelDate: car.year,
    ...(car.mileage_km
      ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: car.mileage_km, unitCode: 'KMT' } }
      : {}),
    ...(car.fuel_type ? { fuelType: car.fuel_type } : {}),
    ...(car.body_type ? { bodyType: car.body_type } : {}),
    image: car.images || undefined,
    ...(car.price_isk > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: car.price_isk,
            priceCurrency: 'ISK',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'AutoDealer', name: 'Eðalkaup' },
          },
        }
      : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CarDetail car={car} />
    </>
  )
}
