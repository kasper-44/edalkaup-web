import { priceReduction, type PriceReductionInput } from '@/lib/priceReduction'
import { isInTransit, type TransitInput } from '@/lib/transit'

export type ListingRibbonKind = 'reduced' | 'transit'

export function listingRibbonKinds(car: PriceReductionInput & TransitInput): ListingRibbonKind[] {
  const kinds: ListingRibbonKind[] = []
  if (priceReduction(car).reduced) kinds.push('reduced')
  if (isInTransit(car)) kinds.push('transit')
  return kinds
}
