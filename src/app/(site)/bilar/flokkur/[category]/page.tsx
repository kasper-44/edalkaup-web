import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { INVENTORY_CATEGORIES, EMPTY_FILTERS, filterCars, sortCars } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'
import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
type Props = { params: Promise<{ category: string }> }
export function generateStaticParams() {
  return INVENTORY_CATEGORIES.map((category) => ({ category: category.slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const found = INVENTORY_CATEGORIES.find((item) => item.slug === slug)
  if (!found) return { robots: { index: false }, title: 'Flokkur fannst ekki' }
  const count = (await getPublicCars()).filter(found.matches).length
  return pageMetadata(found.title, found.description, `/bilar/flokkur/${slug}`, count > 0)
}
export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const category = INVENTORY_CATEGORIES.find((item) => item.slug === slug)
  if (!category) notFound()
  const cars = (await getPublicCars()).filter(category.matches)
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, EMPTY_FILTERS), 'newest'), `/bilar/flokkur/${slug}`, category.title)) }} />
    <Inventory cars={cars} title={category.title} intro={category.intro} />
    <section className="max-w-7xl mx-auto px-5 pb-16"><h2 className="text-2xl font-bold mb-4">Spurning um auglýstan bíl?</h2><p className="text-gray-600 dark:text-slate-300 max-w-3xl mb-4">Hafðu samband um auglýstan bíl til að fá nánari upplýsingar um búnað, verð og framboð.</p><Link href="/hafa-samband" className="inline-flex items-center gap-1 font-semibold underline underline-offset-4">Hafa samband <ArrowIcon direction="right" /></Link></section>
  </>
}
