import { NextResponse } from 'next/server'
import { supabaseAdmin, isAuthorized } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

// GET /api/admin/cars?status=draft  -> list cars for the admin view
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'draft'

  const { data, error } = await supabaseAdmin
    .from('cars')
    .select('*')
    .eq('status', status)
    .order('last_seen_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ cars: data })
}

// PATCH /api/admin/cars  -> update one car's price_isk and/or status
// body: { id, price_isk?, status? }
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const { id, price_isk, status } = body
  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (price_isk !== undefined) update.price_isk = Number(price_isk) || 0
  if (status !== undefined) {
    if (!['draft', 'live', 'sold'].includes(status)) {
      return NextResponse.json({ error: 'Ógild staða' }, { status: 400 })
    }
    update.status = status
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Ekkert til að uppfæra' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('cars')
    .update(update)
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ car: data?.[0] })
}

// DELETE /api/admin/cars  -> permanently delete cars
// body: { id }                       -> delete one car by id
// body: { all: true, status: 'draft' } -> delete every car with that status
export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const { id, all, status } = body

  // Bulk delete: every car with the given status.
  if (all === true) {
    if (!['draft', 'live', 'sold'].includes(status)) {
      return NextResponse.json({ error: 'Ógild staða' }, { status: 400 })
    }
    const { error, count } = await supabaseAdmin
      .from('cars')
      .delete({ count: 'exact' })
      .eq('status', status)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, deleted: count ?? 0 })
  }

  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('cars').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
