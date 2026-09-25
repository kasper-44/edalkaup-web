import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
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

/**
 * Listed price does not include a VSK line. Until `price_includes_vat` exists
 * on the row, the page still omits the subtitle. A stored boolean wins.
 */
const PRICE_EXCLUDES_VAT_IDS = new Set(['0678ccc0-da40-4524-9835-d6998911dd16'])

function withVatFlag<T extends { id?: string; price_includes_vat?: boolean | null; vat_included?: boolean | null }>(
  car: T,
): T {
  if (!car?.id || !PRICE_EXCLUDES_VAT_IDS.has(car.id)) return car
  if (typeof car.price_includes_vat === 'boolean' || typeof car.vat_included === 'boolean') return car
  return { ...car, price_includes_vat: false }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCar(slug: string): Promise<any | null> {
  const { data, error } = await supabase
    .from('cars')
    .select('*')
    .eq('id', slug)
    .eq('status', 'live')
    .not('images_original', 'is', null)
    .single()
  if (error || !data) return null
  return withVatFlag(data)
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
    </>
  )
}
