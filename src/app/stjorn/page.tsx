'use client'

import { useState, useEffect, useCallback } from 'react'

interface Car {
  id: string
  title: string
  make: string
  model: string
  year: number
  trim: string
  price_isk: number
  price_original: number | null
  price_currency: string | null
  mileage_km: number | null
  colour: string | null
  exterior_colour: string | null
  engine: string | null
  fuel_type: string | null
  body_type: string | null
  transmission: string | null
  drivetrain: string | null
  doors: number | null
  seats: number | null
  images: string[] | null
  images_original: string[] | null
  description_is: string | null
  source_url: string | null
  vin: string | null
  last_seen_at: string | null
  status: string
  location_country: string | null
  price_verified: boolean
  specs_verified: boolean
}

const fmt = (n: number) => new Intl.NumberFormat('is-IS').format(n)

// "37m ago", "2klst ago", "3 dögum síðan" style relative time.
function timeAgo(iso: string | null): string {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'í gær'
  if (m < 60) return `${m}m síðan`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}klst síðan`
  const d = Math.floor(h / 24)
  return `${d} ${d === 1 ? 'degi' : 'dögum'} síðan`
}

// Build ready-to-paste Icelandic post text for Facebook / groups / bland.is.
function buildPostText(car: Car): string {
  const title = `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.trim()
  const lines: string[] = [title, '']
  if (car.price_isk) lines.push(`Verð: ${fmt(car.price_isk)} kr.`)
  else lines.push('Verð: við fyrirspurn')
  if (car.mileage_km) lines.push(`Akstur: ${fmt(car.mileage_km)} km`)
  if (car.fuel_type) lines.push(`Eldsneyti: ${car.fuel_type}`)
  if (car.engine) lines.push(`Vél: ${car.engine}`)
  if (car.colour) lines.push(`Litur: ${car.colour}`)
  lines.push('')
  lines.push('Innfluttur frá Norður-Ameríku af Eðalkaup — yfir 25 ára reynsla.')
  lines.push('Hafðu samband fyrir nánari upplýsingar.')
  lines.push('')
  lines.push(`https://edalkaup.is/bilar/${car.id}`)
  return lines.join('\n')
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<'draft' | 'live' | 'sold'>('draft')
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [preview, setPreview] = useState<Car | null>(null)

  // Restore a previous session (survives back/forward navigation + refresh).
  useEffect(() => {
    const saved = localStorage.getItem('edalkaup_admin_pw')
    if (saved) {
      setPassword(saved)
      setAuthed(true)
    }
  }, [])

  const load = useCallback(async (status: string, pw: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/cars?status=${status}`, {
        headers: { 'x-admin-password': pw },
      })
      if (res.status === 401) {
        setError('Rangt lykilorð')
        setAuthed(false)
        localStorage.removeItem('edalkaup_admin_pw')
        return
      }
      const json = await res.json()
      setCars(json.cars || [])
      setAuthed(true)
      localStorage.setItem('edalkaup_admin_pw', pw)
    } catch {
      setError('Villa við að sækja bíla')
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('edalkaup_admin_pw')
    setPassword('')
    setAuthed(false)
    setCars([])
  }

  useEffect(() => {
    if (authed) load(tab, password)
  }, [tab, authed, load, password])

  const patch = async (id: string, payload: Record<string, unknown>) => {
    setSaving(id)
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id, ...payload }),
      })
      if (!res.ok) {
        const j = await res.json()
        alert('Villa: ' + (j.error || res.status))
        return
      }
      // Remove from current list if status changed away from current tab
      if (payload.status && payload.status !== tab) {
        setCars((prev) => prev.filter((c) => c.id !== id))
      } else {
        const j = await res.json()
        setCars((prev) => prev.map((c) => (c.id === id ? { ...c, ...j.car } : c)))
      }
    } finally {
      setSaving(null)
    }
  }

  const savePrice = (id: string) => {
    const val = edits[id]
    if (val === undefined) return
    patch(id, { price_isk: Number(val) || 0 })
  }

  const deleteCar = async (id: string) => {
    if (!confirm('Ertu viss um að þú viljir eyða þessum bíl? Þetta er endanlegt og ekki hægt að afturkalla.')) {
      return
    }
    setSaving(id)
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const j = await res.json()
        alert('Villa: ' + (j.error || res.status))
        return
      }
      setCars((prev) => prev.filter((c) => c.id !== id))
    } finally {
      setSaving(null)
    }
  }

  const deleteAllDrafts = async () => {
    if (
      !confirm(
        `Ertu viss um að þú viljir eyða ÖLLUM drögum (${cars.length} bílar)? ` +
          'Þetta er endanlegt og ekki hægt að afturkalla.',
      )
    ) {
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ all: true, status: 'draft' }),
      })
      if (!res.ok) {
        const j = await res.json()
        alert('Villa: ' + (j.error || res.status))
        return
      }
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  // --- Login screen ---
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Eðalkaup — Stjórn</h1>
          <p className="text-slate-400 text-sm mb-6">Sláðu inn lykilorð til að halda áfram.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(tab, password)}
            placeholder="Lykilorð"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-white/10 focus:border-amber-400 outline-none mb-3"
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            onClick={() => load(tab, password)}
            className="w-full py-3 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300"
          >
            Innskrá
          </button>
        </div>
      </div>
    )
  }

  // --- Admin dashboard ---
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Eðalkaup — Bílastjórn</h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{cars.length} bílar</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm hover:bg-slate-700"
            >
              Útskrá
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(['draft', 'live', 'sold'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                tab === t ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {t === 'draft' ? 'Drög' : t === 'live' ? 'Í sölu' : 'Seldir'}
            </button>
          ))}
          {tab === 'draft' && cars.length > 0 && (
            <button
              onClick={deleteAllDrafts}
              className="ml-auto px-4 py-2 rounded-lg bg-red-900/40 text-red-300 text-sm font-semibold hover:bg-red-900/60"
              title="Eyða öllum drögum endanlega"
            >
              Eyða öllum drögum
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-400">Hleð...</p>
        ) : cars.length === 0 ? (
          <p className="text-slate-400">Engir bílar í þessum flokki.</p>
        ) : (
          <div className="space-y-3">
            {cars.map((car) => {
              const orig = car.price_original
                ? `${car.price_currency === 'CAD' ? 'CAD $' : '$'}${fmt(car.price_original)}`
                : '—'
              return (
                <div
                  key={car.id}
                  className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-white/10 rounded-xl p-4"
                >
                  {car.images?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={car.images[0]}
                      alt={car.title}
                      className="w-full sm:w-40 h-28 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">
                          {car.year} {car.make} {car.model} {car.trim}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {car.colour} · {car.mileage_km ? fmt(car.mileage_km) + ' km' : 'Nýr'} ·{' '}
                          {car.location_country}
                          {car.last_seen_at && (
                            <span className="text-slate-500"> · {timeAgo(car.last_seen_at)}</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {!car.images_original && (
                            <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ⚠ Myndir ósíaðar — skoðaðu í forskoðun fyrst
                            </span>
                          )}
                          {car.specs_verified ? (
                            <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              ✓ Tæknilegar upplýsingar staðfestar
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ⚠ Tæknilegar upplýsingar óstaðfestar — opnaðu forskoðun til að staðfesta
                            </span>
                          )}
                          {!car.price_verified && (
                            <span className="inline-block px-2 py-0.5 text-[11px] rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              ⚠ Verð ekki staðfest{car.price_isk > 0 ? '' : ' (og ekki sett)'}
                            </span>
                          )}
                        </div>
                      </div>
                      {car.vin && (
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(car.vin)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Leita að VIN á Google til að finna upprunalegu auglýsinguna"
                          className="text-amber-400 text-xs hover:underline whitespace-nowrap"
                        >
                          Leita að VIN ↗
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="text-sm text-slate-400">
                        Upphaflegt verð: <span className="text-white font-medium">{orig}</span>
                      </span>

                      <div className="flex items-center gap-2 ml-auto">
                        <label className="text-sm text-slate-400">Verð (ISK):</label>
                        <input
                          type="number"
                          defaultValue={car.price_isk || ''}
                          onChange={(e) => setEdits((p) => ({ ...p, [car.id]: e.target.value }))}
                          placeholder="0"
                          className="w-32 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-white text-sm outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => savePrice(car.id)}
                          disabled={saving === car.id}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 text-sm hover:bg-slate-600 disabled:opacity-50"
                        >
                          Vista verð
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setPreview(car)}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-500"
                      >
                        Forskoða
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(buildPostText(car))
                          alert('Texti afritaður! Opnaðu Eðalkaup síðuna á Facebook, búðu til færslu og límdu textann inn.')
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 text-white text-sm font-semibold hover:bg-slate-600"
                      >
                        Afrita texta fyrir Facebook
                      </button>
                      {car.status !== 'live' && (() => {
                        const missing: string[] = []
                        if (!(car.price_isk > 0)) missing.push('verð er ekki sett')
                        else if (!car.price_verified) missing.push('verð er ekki staðfest')
                        if (!car.specs_verified) missing.push('tæknilegar upplýsingar eru ekki staðfestar')

                        if (missing.length > 0) {
                          return (
                            <span
                              title={`Vantar: ${missing.join(', ')}`}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-500 text-sm font-semibold cursor-not-allowed select-none"
                            >
                              Birta (í sölu) — vantar: {missing.join(', ')}
                            </span>
                          )
                        }
                        return (
                          <button
                            onClick={() => {
                              if (
                                !car.images_original &&
                                !confirm(
                                  'Myndir hafa ekki verið síaðar sjálfvirkt. ' +
                                    'Hefur þú skoðað myndirnar í forskoðun og staðfest að engin þeirra sýni upprunalega söluaðilann?\n\n' +
                                    'Ýttu á OK til að birta, eða Hætta við til að skoða fyrst.',
                                )
                              ) {
                                return
                              }
                              patch(car.id, { status: 'live' })
                            }}
                            disabled={saving === car.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold hover:bg-emerald-400 disabled:opacity-50"
                          >
                            Birta (í sölu)
                          </button>
                        )
                      })()}
                      {car.status !== 'draft' && (
                        <button
                          onClick={() => patch(car.id, { status: 'draft' })}
                          disabled={saving === car.id}
                          className="px-3 py-1.5 rounded-lg bg-slate-700 text-sm hover:bg-slate-600 disabled:opacity-50"
                        >
                          Fela (drög)
                        </button>
                      )}
                      {car.status !== 'sold' && (
                        <button
                          onClick={() => patch(car.id, { status: 'sold' })}
                          disabled={saving === car.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/80 text-sm font-semibold hover:bg-red-500 disabled:opacity-50"
                        >
                          Merkja seldan
                        </button>
                      )}
                      {car.status === 'draft' && (
                        <button
                          onClick={() => deleteCar(car.id)}
                          disabled={saving === car.id}
                          className="px-3 py-1.5 rounded-lg bg-red-900/40 text-red-300 text-sm hover:bg-red-900/60 disabled:opacity-50 ml-auto"
                          title="Eyða bíl endanlega"
                        >
                          Eyða
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Preview modal — shows the listing as customers will see it */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4 sm:p-8"
          onClick={() => setPreview(null)}
        >
          <div
            className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 bg-slate-900 text-white">
              <span className="text-sm font-semibold">
                Forskoðun — svona sjá viðskiptavinir bílinn
              </span>
              <button
                onClick={() => setPreview(null)}
                className="px-3 py-1 rounded-lg bg-slate-700 text-sm hover:bg-slate-600"
              >
                Loka ✕
              </button>
            </div>

            {/* Photo gallery */}
            <div className="p-5">
              <h2 className="text-2xl font-bold mb-1">
                {preview.year} {preview.make} {preview.model} {preview.trim}
              </h2>
              <p className="text-3xl font-bold text-amber-600 mb-4">
                {preview.price_isk
                  ? fmt(preview.price_isk) + ' kr.'
                  : 'Verð við fyrirspurn'}
              </p>

              {preview.images && preview.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                  {preview.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`mynd ${i + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 mb-6">Engar myndir.</p>
              )}

              {/* Spec table — customer-facing only (no VIN / original price / dealer) */}
              <h3 className="text-lg font-bold mb-3">Tæknilegar upplýsingar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  ['Árgerð', preview.year?.toString()],
                  ['Framleiðandi', preview.make],
                  ['Gerð', preview.model],
                  ['Útgáfa', preview.trim],
                  ['Akstur', preview.mileage_km ? fmt(preview.mileage_km) + ' km' : 'Nýr'],
                  ['Litur', preview.colour],
                  ['Vél', preview.engine],
                  ['Skipting', preview.transmission],
                  ['Eldsneyti', preview.fuel_type],
                  ['Yfirbygging', preview.body_type],
                  ['Drif', preview.drivetrain],
                  ['Hurðir', preview.doors?.toString()],
                  ['Sæti', preview.seats?.toString()],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div
                      key={label as string}
                      className="flex justify-between border-b border-black/5 py-1.5"
                    >
                      <span className="text-slate-500">{label}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>

              {/* Specs verification — required before this car can go live.
                  "Vél"/"Eldsneyti"/"Drifkerfi" etc. above are auto-filled from a
                  per-model default table, NOT decoded from this specific car —
                  check them against the real vehicle before confirming. */}
              <div className="mt-5 px-3 py-3 rounded-lg bg-slate-100 border border-black/5">
                {preview.specs_verified ? (
                  <p className="text-emerald-700 text-sm font-medium">
                    ✓ Tæknilegar upplýsingar staðfestar
                  </p>
                ) : (
                  <>
                    <p className="text-amber-800 text-sm mb-2">
                      ⚠ Upplýsingarnar hér að ofan (vél, eldsneyti, drifkerfi o.fl.) eru
                      sjálfvirkt útfylltar sjálfgefin gildi fyrir gerðina — EKKI staðfest
                      fyrir þennan tiltekna bíl. Farðu yfir þær áður en þú staðfestir.
                    </p>
                    <button
                      onClick={async () => {
                        await patch(preview.id, { specs_verified: true })
                        setPreview((p) => (p ? { ...p, specs_verified: true } : p))
                      }}
                      disabled={saving === preview.id}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 disabled:opacity-50"
                    >
                      Ég hef yfirfarið og staðfesti þessar upplýsingar
                    </button>
                  </>
                )}
              </div>

              {!preview.images_original && (
                <p className="mt-5 px-3 py-2 rounded-lg bg-amber-100 text-amber-800 text-sm">
                  ⚠ Myndir hafa ekki verið síaðar sjálfvirkt enn — gakktu úr skugga
                  um að engin mynd hér að ofan sýni upprunalega söluaðilann áður en þú birtir.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
