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
    .order('created_at', { ascending: false, nullsFirst: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ cars: data })
}

// PATCH /api/admin/cars  -> update one car's price_isk, verification flags, and/or status
// body: { id, price_isk?, specs_verified?, status? }
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const { id, price_isk, specs_verified, status } = body
  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (price_isk !== undefined) {
    update.price_isk = Number(price_isk) || 0
    // Saving a price through the admin UI IS the verification act — a human
    // just looked at this number and confirmed it, as opposed to the flat
    // mileage-tier placeholder the sync script fills in automatically.
    update.price_verified = true
  }
  if (specs_verified !== undefined) update.specs_verified = Boolean(specs_verified)
  if (status !== undefined) {
    if (!['draft', 'live', 'sold'].includes(status)) {
      return NextResponse.json({ error: 'Ógild staða' }, { status: 400 })
    }
    update.status = status
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Ekkert til að uppfæra' }, { status: 400 })
  }

  // Publish safeguard: block status -> 'live' unless price and specs have
  // both been explicitly verified by a human, using the effective post-update
  // state (values in this same request take priority over what's in the DB).
  if (update.status === 'live') {
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('cars')
      .select('price_isk,price_verified,specs_verified')
      .eq('id', id)
      .single()
    if (fetchError || !current) {
      return NextResponse.json({ error: 'Bíll fannst ekki' }, { status: 404 })
    }
    const effectivePrice = update.price_isk !== undefined ? (update.price_isk as number) : current.price_isk
    const effectivePriceVerified = update.price_verified !== undefined ? true : current.price_verified
    const effectiveSpecsVerified = update.specs_verified !== undefined ? (update.specs_verified as boolean) : current.specs_verified

    const problems: string[] = []
    if (!effectivePrice || effectivePrice <= 0) problems.push('Verð er ekki sett')
    else if (!effectivePriceVerified) problems.push('Verð er ekki staðfest')
    if (!effectiveSpecsVerified) problems.push('Tæknilegar upplýsingar eru ekki staðfestar')

    if (problems.length > 0) {
      return NextResponse.json(
        { error: `Ekki hægt að birta: ${problems.join(', ')}.` },
        { status: 400 },
      )
    }
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

// DELETE /api/admin/cars  -> permanently delete one car
// body: { id }
export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const { id } = body
  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('cars').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
