import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DealerSpecPage, { type DealerSlug } from '@/components/ex60/DealerSpecPage'

const DEALERS: DealerSlug[] = ['diesel', 'hofdabilar', 'edalkaup']

const DEALER_NAMES: Record<DealerSlug, string> = {
  diesel: 'Diesel',
  hofdabilar: 'Höfðabílar',
  edalkaup: 'Eðalkaup',
}

function isDealer(value: string): value is DealerSlug {
  return (DEALERS as string[]).includes(value)
}

export function generateStaticParams() {
  return DEALERS.map((dealer) => ({ dealer }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ dealer: string }>
}): Promise<Metadata> {
  const { dealer } = await params
  if (!isDealer(dealer)) {
    return { title: 'Volvo EX60 Ultra — TWIN Performance' }
  }
  return {
    title: { absolute: `Volvo EX60 Ultra — TWIN Performance | ${DEALER_NAMES[dealer]}` },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ dealer: string }>
}) {
  const { dealer } = await params
  if (!isDealer(dealer)) notFound()
  return <DealerSpecPage dealer={dealer} />
}
