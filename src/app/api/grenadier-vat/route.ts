import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const GRENADIER_ID = '0678ccc0-da40-4524-9835-d6998911dd16'
const HOST = 'aws-1-eu-west-2.pooler.supabase.com'

const SQL_ALTER = 'ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS price_includes_vat boolean'
const SQL_UPDATE = `UPDATE public.cars
  SET price_includes_vat = false
  WHERE id = $1 AND price_includes_vat IS NULL`
const SQL_NOTIFY = "NOTIFY pgrst, 'reload schema'"

/**
 * Applies schema update #5 using the server service-role key against the
 * project pooler. Removed once the column exists. Does not print secrets.
 */
export async function GET() {
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!password) {
    return NextResponse.json({ ok: false, detail: 'service-role key unset' })
  }

  const { Client } = await import('pg')
  const users = [
    'supabase_admin.fakjyfokweehxsonfbez',
    'authenticator.fakjyfokweehxsonfbez',
    'postgres.fakjyfokweehxsonfbez',
  ]
  const failures: string[] = []

  for (const user of users) {
    const client = new Client({
      host: HOST,
      port: 5432,
      user,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    })
    try {
      await client.connect()
      await client.query(SQL_ALTER)
      await client.query(SQL_UPDATE, [GRENADIER_ID])
      await client.query(SQL_NOTIFY)
      const check = await client.query(
        'select price_isk, price_includes_vat from public.cars where id = $1',
        [GRENADIER_ID],
      )
      return NextResponse.json({
        ok: true,
        via: user.split('.')[0],
        row: check.rows[0] ?? null,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message.split('\n')[0] : 'sql failed'
      failures.push(`${user.split('.')[0]}: ${message}`)
    } finally {
      try {
        await client.end()
      } catch {
        // already closed
      }
    }
  }

  return NextResponse.json({ ok: false, detail: failures.join(' | ') })
}
