import Inventory from '@/components/Inventory'
import { getPublicCars } from '@/lib/publicInventory'
import { EMPTY_FILTERS, filterCars, sortCars } from '@/lib/inventory'
import { pageMetadata, inventoryListJsonLd } from '@/lib/pageSeo'
import { jsonLdScript } from '@/lib/listingSeo'

const title = 'Bílar til sölu á Íslandi'
const description = 'Skoðaðu bíla til sölu hjá Eðalkaup. Leitaðu eftir gerð, eldsneyti og verði, vistaðu uppáhaldsbíla og berðu saman allt að þrjá bíla.'
export const metadata = pageMetadata(title, description, '/bilar')
export default async function BilarPage() {
  const cars = await getPublicCars()
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(inventoryListJsonLd(sortCars(filterCars(cars, EMPTY_FILTERS), 'newest'), '/bilar', title)) }} />
    <Inventory cars={cars} />
  </>
}
