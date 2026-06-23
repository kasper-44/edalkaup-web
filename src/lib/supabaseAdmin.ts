// Server-side Supabase admin client. Uses the SERVICE ROLE key, which bypasses
// RLS. This file must ONLY ever be imported by server code (API routes) — never
// by a client component. The service key is read from server env and is never
// shipped to the browser.
import { createClient } from '@supabase/supabase-js'

const url = 'https://fakjyfokweehxsonfbez.supabase.co'
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceKey) {
  // Surfaces a clear error in server logs rather than a silent failure.
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set — admin writes will fail.')
}

export const supabaseAdmin = createClient(url, serviceKey || '', {
  auth: { persistSession: false, autoRefreshToken: false },
})

// Simple shared-secret check for admin API routes.
export function isAuthorized(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const header = req.headers.get('x-admin-password')
  return header === expected
}
