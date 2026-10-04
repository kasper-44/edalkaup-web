// Server-side Supabase admin client. Uses the SERVICE ROLE key, which bypasses
// RLS. This file must ONLY ever be imported by server code (API routes) — never
// by a client component. The service key is read from server env and is never
// shipped to the browser.
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = 'https://fakjyfokweehxsonfbez.supabase.co'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialise only when an authorised admin operation actually needs the client.
// Public pages and build-time module discovery do not require admin credentials.
let client: SupabaseClient | undefined
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations.')
    client ??= createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const value = Reflect.get(client, property)
    return typeof value === 'function' ? value.bind(client) : value
  },
})

// Simple shared-secret check for admin API routes.
export function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const header = req.headers.get('x-admin-password')
  return header === expected
}
