import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { normalizeSearch, EMPTY_FILTERS, filterCars, sortCars } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'
type Props = { params: Promise<{ brand: string }> }
export async function generateStaticParams() {
  const cars = await getPublicCars()
  return [...new Set(cars.map((car) => normalizeSearch(car.make).replace(/\s+/g, '-')))].map((brand) => ({ brand }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand } = await params
  const cars = (await getPublicCars()).filter((car) => normalizeSearch(car.make).replace(/\s+/g, '-') === brand)
  if (!cars.length) return { title: 'Framleiðandi fannst ekki', robots: { index: false } }
  return pageMetadata(`${cars[0].make} bílar til sölu`, `Skoðaðu ${cars[0].make} bíla til sölu hjá Eðalkaup. Berðu saman verð, árgerð og akstur og skoðaðu myndir og búnað.`, `/bilar/framleidandi/${brand}`)
}
export default async function BrandPage({ params }: Props) {
  const { brand } = await params
  const cars = (await getPublicCars()).filter((car) => normalizeSearch(car.make).replace(/\s+/g, '-') === brand)
  if (!cars.length) notFound()
  const title = `${cars[0].make} bílar til sölu`
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, EMPTY_FILTERS), 'newest'), `/bilar/framleidandi/${brand}`, title)) }} /><Inventory cars={cars} title={title} intro={`Skoðaðu ${cars[0].make} bíla hjá Eðalkaup. Opnaðu auglýsingu til að sjá myndir, búnað og tæknilegar upplýsingar.`} /></>
}
