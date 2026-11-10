import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Drop the cached public inventory and the prerendered pages that embed it.
 * Called from the car admin route after a publish, edit, sale, or delete.
 * `{ expire: 0 }` makes the next request rebuild instead of serving the stale page.
 */
export function revalidatePublicCatalog() {
  revalidateTag('public-cars', { expire: 0 })
  revalidatePath('/', 'layout')
  revalidatePath('/sitemap.xml')
}
