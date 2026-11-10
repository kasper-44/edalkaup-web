import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { getPublicCar, getPublicCars, getPublicRows } from '@/lib/publicInventory'
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

export const dynamicParams = true

export async function generateStaticParams() {
  const rows = await getPublicRows()
  return rows.flatMap((row) => [
    { slug: publicCarSlug(row) },
    { slug: String(row.id) },
  ])
}

function canonicalSlug(slug: string, car: Parameters<typeof publicCarSlug>[0]) {
  const path = publicCarSlug(car)
  if (slug !== path) permanentRedirect(`/bilar/${path}`)
  return path
}

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
  canonicalSlug(slug, car)
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
  const path = canonicalSlug(slug, car)
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
      {related.length > 0 && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 max-lg:pb-28">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Skoðaðu líka</h2>
        <div className="grid md:grid-cols-3 gap-6">{related.map((candidate) => <CarCard key={candidate.id} car={candidate} />)}</div>
      </section>}
    </>
  )
}
