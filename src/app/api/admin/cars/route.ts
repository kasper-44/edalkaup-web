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
    .order('make', { ascending: true })
    .order('model', { ascending: true })
    .order('year', { ascending: false })

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

  // Safeguard: do not allow publishing (status=live) a car whose photos have
  // not yet been privacy-filtered. The filter sets `images_original` once it
  // has processed a car; if it's null, branded/dealer photos may still be in
  // `images` and must not go public.
  if (update.status === 'live') {
    const { data: existing, error: checkErr } = await supabaseAdmin
      .from('cars')
      .select('images_original')
      .eq('id', id)
      .single()
    if (checkErr) {
      return NextResponse.json({ error: checkErr.message }, { status: 500 })
    }
    if (!existing?.images_original) {
      return NextResponse.json(
        {
          error:
            'Ekki hægt að birta: myndir hafa ekki verið síaðar enn (bíð eftir myndasíun). ' +
            'Reyndu aftur þegar myndasíunin hefur keyrt.',
          code: 'photos_unfiltered',
        },
        { status: 409 },
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
