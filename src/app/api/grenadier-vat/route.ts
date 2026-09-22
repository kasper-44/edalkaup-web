import { NextResponse } from 'next/server'
import { ensureGrenadierPriceExcludesVat } from '@/lib/ensureGrenadierVat'

export const dynamic = 'force-dynamic'

/** One-shot status for the Grenadier VAT column. SQL is fixed to that single row. */
export async function GET() {
  const result = await ensureGrenadierPriceExcludesVat('0678ccc0-da40-4524-9835-d6998911dd16')
  return NextResponse.json(result)
}
