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

// PATCH /api/admin/cars  -> update one car's price_isk, verification flags, images, and/or status
// body: { id, price_isk?, specs_verified?, status?, images? }
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const { id, price_isk, specs_verified, status, images, title, trim, description_is, seats } = body
  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (title !== undefined) update.title = String(title).trim()
  if (trim !== undefined) update.trim = String(trim)
  if (description_is !== undefined) update.description_is = description_is
  if (seats !== undefined) update.seats = seats === null || seats === '' ? null : Number(seats)
  if (price_isk !== undefined) {
    update.price_isk = Number(price_isk) || 0
    // Saving a price through the admin UI IS the verification act — a human
    // just looked at this number and confirmed it, as opposed to the flat
    // mileage-tier placeholder the sync script fills in automatically.
    update.price_verified = true
  }
  if (specs_verified !== undefined) update.specs_verified = Boolean(specs_verified)
  if (images !== undefined) {
    if (!Array.isArray(images) || !images.every((u) => typeof u === 'string')) {
      return NextResponse.json({ error: 'Ógildar myndir' }, { status: 400 })
    }
    update.images = images
  }
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

// POST /api/admin/cars  -> create a new listing
export async function POST(req: Request) {
  const body = await req.json()
  const headerOk = isAuthorized(req)
  const bodyOk = Boolean(process.env.ADMIN_PASSWORD) && body?.admin_password === process.env.ADMIN_PASSWORD
  if (!headerOk && !bodyOk) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  delete body.admin_password

  const title = String(body.title || '').trim()
  const make = String(body.make || '').trim()
  const model = String(body.model || '').trim()
  const year = Number(body.year)
  if (!title || !make || !model || !year) {
    return NextResponse.json({ error: 'Vantar titil, framleiðanda, gerð eða árgerð' }, { status: 400 })
  }

  const status = body.status || 'draft'
  if (!['draft', 'live', 'sold'].includes(status)) {
    return NextResponse.json({ error: 'Ógild staða' }, { status: 400 })
  }

  const images = Array.isArray(body.images) ? body.images.filter((u: unknown) => typeof u === 'string') : []
  const price_isk = Number(body.price_isk) || 0
  const specs_verified = Boolean(body.specs_verified)
  const price_verified = Boolean(body.price_verified) || price_isk > 0

  if (status === 'live') {
    const problems: string[] = []
    if (!price_isk || !price_verified) problems.push('Verð er ekki staðfest')
    if (!specs_verified) problems.push('Tæknilegar upplýsingar eru ekki staðfestar')
    if (problems.length) {
      return NextResponse.json({ error: `Ekki hægt að birta: ${problems.join(', ')}.` }, { status: 400 })
    }
  }

  const row: Record<string, unknown> = {
    title,
    make,
    model,
    year,
    trim: body.trim || '',
    price_isk,
    price_original: body.price_original ?? null,
    price_currency: body.price_currency ?? null,
    mileage_km: body.mileage_km === '' || body.mileage_km == null ? null : Number(body.mileage_km),
    colour: body.colour || null,
    exterior_colour: body.exterior_colour || body.colour || null,
    engine: body.engine || null,
    fuel_type: body.fuel_type || null,
    body_type: body.body_type || null,
    transmission: body.transmission || null,
    drivetrain: body.drivetrain || null,
    doors: body.doors ? Number(body.doors) : null,
    seats: body.seats ? Number(body.seats) : null,
    battery_kwh: body.battery_kwh ? Number(body.battery_kwh) : null,
    horsepower_hp: body.horsepower_hp ? Number(body.horsepower_hp) : null,
    range_km: body.range_km ? Number(body.range_km) : null,
    towing_kg: body.towing_kg ? Number(body.towing_kg) : null,
    images,
    images_original: images,
    description_is: body.description_is || null,
    source_url: null,
    vin: body.vin || null,
    last_seen_at: new Date().toISOString(),
    status,
    location_country: body.location_country || null,
    price_verified,
    specs_verified,
  }

  const { data, error } = await supabaseAdmin.from('cars').insert(row).select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ car: data?.[0] }, { status: 201 })
}
