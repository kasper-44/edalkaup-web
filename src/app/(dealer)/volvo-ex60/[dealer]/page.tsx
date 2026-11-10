import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DealerSpecPage from '@/components/ex60/DealerSpecPage'
import { dealerPageMetadata, DEALER_SLUGS, isDealerSlug } from '@/lib/dealerSeo'

export const dynamicParams = false

export function generateStaticParams() {
  return DEALER_SLUGS.map((dealer) => ({ dealer }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dealer: string }>
}): Promise<Metadata> {
  const { dealer } = await params
  if (!isDealerSlug(dealer)) notFound()
  return dealerPageMetadata(dealer)
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealer: string }>
}) {
  const { dealer } = await params
  if (!isDealerSlug(dealer)) notFound()
  return <DealerSpecPage dealer={dealer} />
}
