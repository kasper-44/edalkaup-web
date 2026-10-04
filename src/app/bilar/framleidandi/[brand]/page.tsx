import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { normalizeSearch, parseInventoryFilters, SORTS, filterCars, sortCars } from '@/lib/inventory'
import type { InventorySort } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'
export const dynamic = 'force-dynamic'
type Props = { params: Promise<{ brand: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { brand } = await params
  const cars = (await getPublicCars()).filter((car) => normalizeSearch(car.make).replace(/\s+/g, '-') === brand)
  if (!cars.length) return { title: 'Framleiðandi fannst ekki', robots: { index: false } }
  return pageMetadata(`${cars[0].make} bílar til sölu`, `Skoðaðu ${cars[0].make} bíla til sölu hjá Eðalkaup. Berðu saman verð, árgerð og akstur og skoðaðu myndir og búnað.`, `/bilar/framleidandi/${brand}`, Object.keys(await searchParams).length === 0)
}
export default async function BrandPage({ params, searchParams }: Props) {
  const { brand } = await params
  const cars = (await getPublicCars()).filter((car) => normalizeSearch(car.make).replace(/\s+/g, '-') === brand)
  if (!cars.length) notFound()
  const title = `${cars[0].make} bílar til sölu`
  const query = await searchParams
  const sort = typeof query.sort === 'string' && SORTS.includes(query.sort as InventorySort) ? query.sort as InventorySort : 'newest'
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, parseInventoryFilters(query)), sort), `/bilar/framleidandi/${brand}`, title)) }} /><Inventory key={brand} cars={cars} title={title} intro={`Skoðaðu ${cars[0].make} bíla hjá Eðalkaup. Opnaðu auglýsingu til að sjá myndir, búnað og tæknilegar upplýsingar.`} initialFilters={parseInventoryFilters(query)} initialSort={sort} /></>
}
