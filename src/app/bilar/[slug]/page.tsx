import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicCar, getPublicCars } from '@/lib/publicInventory'
import { adaptCar } from '@/lib/adaptPublicCar'
import CarCard from '@/components/CarCard'
import CarDetail from '@/components/CarDetail'
import { fetchImageSize } from '@/lib/imageSize'
import { publicCarSlug } from '@/lib/carPath'
import {
  breadcrumbJsonLd,
  carJsonLd,
  jsonLdScript,
  listingCanonical,
  listingDocumentTitle,
  listingMetaDescription,
  vehicleTitle,
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
  const canonical = listingCanonical(publicCarSlug(car))
  const size = image ? await fetchImageSize(image) : null

  return {
    title: { absolute: title },
    description,
    openGraph: {
      locale: 'is_IS',
      siteName: 'Eðalkaup',
      title,
      description,
      url: canonical,
      images: image
        ? [{ url: image, alt: vehicleTitle(car), ...(size ? { width: size.width, height: size.height } : {}) }]
        : undefined,
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
  const path = publicCarSlug(car)
  const price = Number(car.price_isk)
  const publicCar = adaptCar(car)
  const related = (await getPublicCars()).filter((candidate) => candidate.id !== car.id)
    .sort((a, b) => Number(b.make === car.make) - Number(a.make === car.make) || Number(b.bodyType === publicCar.bodyType) - Number(a.bodyType === publicCar.bodyType)).slice(0, 3)

  return (
    <>
      <meta property="og:type" content="product" />
      {Number.isFinite(price) && price > 0 && (
        <>
          <meta property="product:price:amount" content={String(price)} />
          <meta property="product:price:currency" content="ISK" />
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(carJsonLd(car, path)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd(car, path)) }}
      />
      <CarDetail car={car} />
      {related.length > 0 && <section className="dealer-container pb-20">
        <h2 className="dealer-heading mb-8 text-4xl">Skoðaðu líka</h2>
        <div className="grid gap-8 md:grid-cols-3">{related.map((candidate) => <CarCard key={candidate.id} car={candidate} />)}</div>
      </section>}
    </>
  )
}
