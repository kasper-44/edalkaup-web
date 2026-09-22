import { NextResponse } from 'next/server'
import { ensureGrenadierPriceExcludesVat } from '@/lib/ensureGrenadierVat'

export const dynamic = 'force-dynamic'

const SQL = `
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS price_includes_vat boolean;
UPDATE public.cars
SET price_includes_vat = false
WHERE id = '0678ccc0-da40-4524-9835-d6998911dd16'
  AND price_includes_vat IS NULL;
NOTIFY pgrst, 'reload schema';
`

/** One-shot status for the Grenadier VAT column. SQL is fixed to that single row. */
export async function GET() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  const management = await tryManagementQuery(key)
  const result = await ensureGrenadierPriceExcludesVat('0678ccc0-da40-4524-9835-d6998911dd16')
  return NextResponse.json({ management, result })
}

async function tryManagementQuery(key: string | undefined) {
  if (!key) return { ok: false, detail: 'service-role key unset' }
  try {
    const res = await fetch(
      'https://api.supabase.com/v1/projects/fakjyfokweehxsonfbez/database/query',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          apikey: key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: SQL }),
      },
    )
    const text = await res.text()
    return { ok: res.ok, status: res.status, detail: text.slice(0, 400) }
  } catch (err) {
    const message = err instanceof Error ? err.message.split('\n')[0] : 'request failed'
    return { ok: false, detail: message }
  }
}
