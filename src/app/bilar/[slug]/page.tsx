import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicCar, getPublicCars } from '@/lib/publicInventory'
import { adaptCar } from '@/lib/adaptPublicCar'
import CarCard from '@/components/CarCard'
import CarDetail from '@/components/CarDetail'
import {
  breadcrumbJsonLd,
  carJsonLd,
  jsonLdScript,
  listingCanonical,
  listingDocumentTitle,
  listingMetaDescription,
} from '@/lib/listingSeo'

export const dynamic = 'force-dynamic'

// --- Per-car SEO metadata (server-rendered) ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const car = await getPublicCar(slug)
  if (!car) {
    notFound()
  }
  const title = listingDocumentTitle(car)
  const description = listingMetaDescription(car)
  const image = car.images?.[0]
  const canonical = listingCanonical(slug)

  return {
    title: { absolute: title },
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      url: canonical,
    },
    alternates: { canonical },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  }
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const car = await getPublicCar(slug)

  if (!car) notFound()
  const publicCar = adaptCar(car)
  const related = (await getPublicCars()).filter((candidate) => candidate.id !== car.id)
    .sort((a, b) => Number(b.make === car.make) - Number(a.make === car.make) || Number(b.bodyType === publicCar.bodyType) - Number(a.bodyType === publicCar.bodyType)).slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(carJsonLd(car, slug)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(car, slug)) }}
      />
      <CarDetail car={car} />
      {related.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skoðaðu líka</h2>
        <div className="grid md:grid-cols-3 gap-6">{related.map((candidate) => <CarCard key={candidate.id} car={candidate} />)}</div>
      </section>}
    </>
  )
}
