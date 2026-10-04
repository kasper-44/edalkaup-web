import type { Metadata } from 'next'
import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { EMPTY_FILTERS, parseInventoryFilters, SORTS, filterCars, sortCars } from '@/lib/inventory'
import type { InventorySort } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'

export const dynamic = 'force-dynamic'
type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }
const title = 'Bílar til sölu á Íslandi'
const description = 'Skoðaðu bíla til sölu hjá Eðalkaup. Leitaðu eftir gerð, eldsneyti og verði, vistaðu uppáhaldsbíla og berðu saman allt að þrjá bíla.'
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams
  return pageMetadata(title, description, '/bilar', Object.keys(params).length === 0)
}
export default async function BilarPage({ searchParams }: Props) {
  const params = await searchParams
  const filters = parseInventoryFilters(params)
  const sort: InventorySort = typeof params.sort === 'string' && SORTS.includes(params.sort as InventorySort) ? params.sort as InventorySort : 'newest'
  const cars = await getPublicCars()
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, filters), sort), '/bilar', title)) }} />
    <Inventory cars={cars} initialFilters={{ ...EMPTY_FILTERS, ...filters }} initialSort={sort} />
  </>
}
