import { NextResponse } from 'next/server'
import { supabaseAdmin, isAuthorized } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

/** `true` / `false` / `null`. Anything else is rejected so a typo cannot flip VAT. */
function parsePriceIncludesVat(
  value: unknown,
): { ok: true; value: boolean | null } | { ok: false } {
  if (value === null || typeof value === 'boolean') return { ok: true, value }
  return { ok: false }
}

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

function parseOptionalNumber(
  value: unknown,
): { ok: true; value: number | null } | { ok: false } {
  if (value === null || value === '') return { ok: true, value: null }
  const n = Number(value)
  if (!Number.isFinite(n)) return { ok: false }
  return { ok: true, value: n }
}

// PATCH /api/admin/cars  -> update listing fields without recreating the row
// body: { id, price_isk?, price_includes_vat?, specs_verified?, status?, images?, title?, make?, model?, trim?,
//         description_is?, seats?, doors?, colour?, exterior_colour?, interior_colour?,
//         year?, range_km?, mileage_km?, battery_kwh?, horsepower_hp?, towing_kg?,
//         drivetrain?, transmission?, fuel_type?, body_type?, engine?, vin? }
export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }
  const body = await req.json()
  const {
    id,
    price_isk,
    price_includes_vat,
    specs_verified,
    status,
    images,
    title,
    make,
    model,
    trim,
    description_is,
    seats,
    doors,
    colour,
    exterior_colour,
    interior_colour,
    year,
    range_km,
    mileage_km,
    battery_kwh,
    horsepower_hp,
    towing_kg,
    drivetrain,
    transmission,
    fuel_type,
    body_type,
    engine,
    vin,
  } = body
  if (!id) {
    return NextResponse.json({ error: 'Vantar id' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}
  if (colour !== undefined) update.colour = colour === null || colour === '' ? null : String(colour).trim()
  if (exterior_colour !== undefined) update.exterior_colour = exterior_colour === null || exterior_colour === '' ? null : String(exterior_colour).trim()
  if (interior_colour !== undefined) update.interior_colour = interior_colour === null || interior_colour === '' ? null : String(interior_colour).trim()
  if (title !== undefined) update.title = String(title).trim()
  if (make !== undefined) {
    const next = String(make).trim()
    if (!next) return NextResponse.json({ error: 'Vantar framleiðanda' }, { status: 400 })
    update.make = next
  }
  if (model !== undefined) {
    const next = String(model).trim()
    if (!next) return NextResponse.json({ error: 'Vantar gerð' }, { status: 400 })
    update.model = next
  }
  if (trim !== undefined) update.trim = String(trim)
  if (description_is !== undefined) update.description_is = description_is
  if (seats !== undefined) update.seats = seats === null || seats === '' ? null : Number(seats)
  if (doors !== undefined) {
    const parsed = parseOptionalNumber(doors)
    if (!parsed.ok) return NextResponse.json({ error: 'Ógildar hurðir' }, { status: 400 })
    update.doors = parsed.value
  }
  if (year !== undefined) {
    const y = Number(year)
    if (!Number.isInteger(y) || y < 1990 || y > 2035) {
      return NextResponse.json({ error: 'Ógilt ár' }, { status: 400 })
    }
    update.year = y
  }
  if (range_km !== undefined) update.range_km = range_km === null || range_km === '' ? null : Number(range_km)
  if (mileage_km !== undefined) update.mileage_km = mileage_km === null || mileage_km === '' ? null : Number(mileage_km)
  if (battery_kwh !== undefined) update.battery_kwh = battery_kwh === null || battery_kwh === '' ? null : Number(battery_kwh)
  if (horsepower_hp !== undefined) update.horsepower_hp = horsepower_hp === null || horsepower_hp === '' ? null : Number(horsepower_hp)
  if (drivetrain !== undefined) update.drivetrain = drivetrain === null || drivetrain === '' ? null : String(drivetrain).trim()
  if (transmission !== undefined) update.transmission = transmission === null || transmission === '' ? null : String(transmission).trim()
  if (fuel_type !== undefined) update.fuel_type = fuel_type === null || fuel_type === '' ? null : String(fuel_type).trim()
  if (body_type !== undefined) update.body_type = body_type === null || body_type === '' ? null : String(body_type).trim()
  if (engine !== undefined) update.engine = engine === null || engine === '' ? null : String(engine).trim()
  if (towing_kg !== undefined) {
    const parsed = parseOptionalNumber(towing_kg)
    if (!parsed.ok) return NextResponse.json({ error: 'Ógild dráttargeta' }, { status: 400 })
    update.towing_kg = parsed.value
  }
  if (vin !== undefined) update.vin = vin === null || vin === '' ? null : String(vin).trim()

  if (price_isk !== undefined) {
    update.price_isk = Number(price_isk) || 0
    // Saving a price through the admin UI IS the verification act — a human
    // just looked at this number and confirmed it, as opposed to the flat
    // mileage-tier placeholder the sync script fills in automatically.
    update.price_verified = true
  }
  if (price_includes_vat !== undefined) {
    const parsed = parsePriceIncludesVat(price_includes_vat)
    if (!parsed.ok) {
      return NextResponse.json({ error: 'Ógilt price_includes_vat' }, { status: 400 })
    }
    // null restores the body-type default (passenger cars show «m/VSK»).
    update.price_includes_vat = parsed.value
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
      .select('price_isk,price_verified,specs_verified,status')
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

    // First time this car is actually listed. created_at is what the public
    // grids sort on, so a draft published today outranks cars imported earlier.
    // Editing a car that is already live must not move it.
    if (current.status !== 'live') {
      update.created_at = new Date().toISOString()
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

  const listedAt = new Date().toISOString()
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
    // created_at is the public newest-first key. last_seen_at stays the
    // sighting stamp the admin list already sorts and displays.
    created_at: listedAt,
    last_seen_at: listedAt,
    status,
    location_country: body.location_country || null,
    price_verified,
    specs_verified,
  }

  if ('price_includes_vat' in body) {
    const parsed = parsePriceIncludesVat(body.price_includes_vat)
    if (!parsed.ok) {
      return NextResponse.json({ error: 'Ógilt price_includes_vat' }, { status: 400 })
    }
    row.price_includes_vat = parsed.value
  }

  const { data, error } = await supabaseAdmin.from('cars').insert(row).select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ car: data?.[0] }, { status: 201 })
}
