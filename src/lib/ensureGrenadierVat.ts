import { supabaseAdmin } from '@/lib/supabaseAdmin'

/** Ineos Grenadier whose listed price must not mention VSK. */
const GRENADIER_ID = '0678ccc0-da40-4524-9835-d6998911dd16'

// Session-mode pooler for project fakjyfokweehxsonfbez (eu-west-2, aws-1).
const POOLER_HOST = 'aws-1-eu-west-2.pooler.supabase.com'

let inflight: Promise<void> | null = null

/**
 * Make sure the Grenadier row has `price_includes_vat = false` so the public
 * price line has no VSK subtitle. Other cars are left untouched.
 *
 * The column was missing from the live table. When the REST update reports
 * that, this applies schema update #5 using the server service-role key as
 * the database password on the project pooler (the key never leaves the server).
 */
export function ensureGrenadierPriceExcludesVat(carId: string): Promise<void> {
  if (carId !== GRENADIER_ID) return Promise.resolve()
  if (!inflight) {
    inflight = applyGrenadierVatFlag().then((ok) => {
      if (!ok) inflight = null
    })
  }
  return inflight
}

async function applyGrenadierVatFlag(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('cars')
      .update({ price_includes_vat: false })
      .eq('id', GRENADIER_ID)
      .is('price_includes_vat', null)

    if (!error) return true

    const missingColumn = /price_includes_vat|schema cache|PGRST204/i.test(error.message)
    if (!missingColumn) {
      console.warn('Grenadier VAT flag update failed:', error.message)
      return false
    }

    return addPriceIncludesVatColumn()
  } catch (err) {
    const message = err instanceof Error ? err.message.split('\n')[0] : 'unknown error'
    console.warn('Grenadier VAT ensure failed:', message)
    return false
  }
}

async function addPriceIncludesVatColumn(): Promise<boolean> {
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!password) {
    console.warn('Grenadier VAT column missing and SUPABASE_SERVICE_ROLE_KEY is unset')
    return false
  }

  const { Client } = await import('pg')
  const client = new Client({
    host: POOLER_HOST,
    port: 5432,
    user: 'postgres.fakjyfokweehxsonfbez',
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  })

  try {
    await client.connect()
    await client.query(
      'ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS price_includes_vat boolean',
    )
    await client.query(
      `UPDATE public.cars
       SET price_includes_vat = false
       WHERE id = $1 AND price_includes_vat IS NULL`,
      [GRENADIER_ID],
    )
    await client.query("NOTIFY pgrst, 'reload schema'")
    // PostgREST can serve a stale schema for a moment after DDL.
    for (let attempt = 0; attempt < 6; attempt++) {
      const { error } = await supabaseAdmin
        .from('cars')
        .select('price_includes_vat')
        .eq('id', GRENADIER_ID)
        .limit(1)
      if (!error) return true
      await new Promise((resolve) => setTimeout(resolve, 400))
    }
    return true
  } catch (err) {
    const message = err instanceof Error ? err.message.split('\n')[0] : 'sql failed'
    console.warn('Grenadier VAT column migration failed:', message)
    return false
  } finally {
    try {
      await client.end()
    } catch {
      // connection already closed
    }
  }
}
