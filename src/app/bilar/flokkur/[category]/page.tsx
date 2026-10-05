import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { INVENTORY_CATEGORIES, parseInventoryFilters, SORTS, filterCars, sortCars } from '@/lib/inventory'
import type { InventorySort } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ category: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const found = INVENTORY_CATEGORIES.find((item) => item.slug === slug)
  if (!found) return { robots: { index: false }, title: 'Flokkur fannst ekki' }
  const count = (await getPublicCars()).filter(found.matches).length
  return pageMetadata(found.title, found.description, `/bilar/flokkur/${slug}`, count > 0 && Object.keys(await searchParams).length === 0)
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const category = INVENTORY_CATEGORIES.find((item) => item.slug === slug)
  if (!category) notFound()
  const paramsValue = await searchParams
  const cars = (await getPublicCars()).filter(category.matches)
  const sort = typeof paramsValue.sort === 'string' && SORTS.includes(paramsValue.sort as InventorySort) ? paramsValue.sort as InventorySort : 'newest'
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, parseInventoryFilters(paramsValue)), sort), `/bilar/flokkur/${slug}`, category.title)) }} />
    <Inventory key={slug} cars={cars} title={category.title} intro={category.intro} initialFilters={parseInventoryFilters(paramsValue)} initialSort={sort} />
    <section className="max-w-7xl mx-auto px-5 pb-16"><h2 className="text-2xl font-bold mb-4">Spurningar um gerðirnar okkar?</h2><p className="text-gray-600 dark:text-slate-300 max-w-3xl mb-4">Við leggjum áherslu á EV pallbíla, Volvo, Ford Explorer, Maxus og Toyota Sequoia. Hafðu samband um búnað, verð og framboð á þessum gerðum.</p><Link href="/bilainnflutningur" className="font-semibold underline underline-offset-4">Skoða gerðirnar okkar →</Link></section>
  </>
}
