'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const empty = {
  title: '',
  make: '',
  model: '',
  year: String(new Date().getFullYear()),
  trim: '',
  price_isk: '',
  mileage_km: '',
  colour: '',
  engine: '',
  fuel_type: 'Rafmagn',
  body_type: 'Sendibíll',
  transmission: 'Sjálfskipting',
  drivetrain: '',
  doors: '',
  seats: '',
  battery_kwh: '',
  horsepower_hp: '',
  range_km: '',
  towing_kg: '',
  description_is: '',
  goLive: true,
}

export default function NewCarPage() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [ready, setReady] = useState(false)
  const [form, setForm] = useState(empty)
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('edalkaup_admin_pw')
    if (saved) {
      setPw(saved)
      setReady(true)
    }
  }, [])

  const set = (k: keyof typeof empty, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const login = () => {
    if (!pw.trim()) return
    localStorage.setItem('edalkaup_admin_pw', pw)
    setReady(true)
  }

  const submit = async () => {
    setError('')
    setBusy(true)
    try {
      let images: string[] = []
      if (files.length) {
        const folder = `${form.make}-${form.model}-${form.trim}`.replace(/\s+/g, '-')
        for (let i = 0; i < files.length; i += 3) {
          const chunk = files.slice(i, i + 3)
          const fd = new FormData()
          fd.set('folder', folder)
          chunk.forEach((f) => fd.append('files', f))
          const up = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'x-admin-password': pw },
            body: fd,
          })
          const uj = await up.json()
          if (!up.ok) throw new Error(uj.error || 'Myndaupphleðsla mistókst')
          images = images.concat(uj.urls || [])
        }
      }

      const payload = {
        ...form,
        year: Number(form.year),
        price_isk: Number(form.price_isk) || 0,
        mileage_km: form.mileage_km === '' ? null : Number(form.mileage_km),
        doors: form.doors === '' ? null : Number(form.doors),
        seats: form.seats === '' ? null : Number(form.seats),
        battery_kwh: form.battery_kwh === '' ? null : Number(form.battery_kwh),
        horsepower_hp: form.horsepower_hp === '' ? null : Number(form.horsepower_hp),
        range_km: form.range_km === '' ? null : Number(form.range_km),
        towing_kg: form.towing_kg === '' ? null : Number(form.towing_kg),
        images,
        price_verified: true,
        specs_verified: true,
        status: form.goLive ? 'live' : 'draft',
      }

      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
        body: JSON.stringify(payload),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || res.status)
      router.push('/stjorn')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Villa')
    } finally {
      setBusy(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-4">Stjórn — lykilorð</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="Lykilorð"
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-white/10 mb-3"
          />
          <button onClick={login} className="w-full py-3 rounded-lg bg-amber-400 text-slate-950 font-semibold">
            Innskrá
          </button>
        </div>
      </div>
    )
  }

  const field = (label: string, k: keyof typeof empty, extra?: string) => (
    <label className="block text-sm">
      <span className="text-slate-400">{label}</span>
      <input
        value={String(form[k])}
        onChange={(e) => set(k, e.target.value)}
        className={`mt-1 w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10 ${extra || ''}`}
      />
    </label>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Bæta við bíl</h1>
          <a href="/stjorn" className="text-sm text-slate-400 hover:text-white">
            Til baka
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {field('Titill', 'title')}
          {field('Framleiðandi', 'make')}
          {field('Gerð', 'model')}
          {field('Útgáfa / trim', 'trim')}
          {field('Árgerð', 'year')}
          {field('Verð (ISK, án VSK)', 'price_isk')}
          {field('Akstur (km)', 'mileage_km')}
          {field('Litur', 'colour')}
          {field('Vél', 'engine')}
          {field('Eldsneyti', 'fuel_type')}
          {field('Yfirbygging', 'body_type')}
          {field('Skipting', 'transmission')}
          {field('Drif', 'drivetrain')}
          {field('Hurðir', 'doors')}
          {field('Sæti', 'seats')}
          {field('Rafhlaða (kWh)', 'battery_kwh')}
          {field('Afl (hö)', 'horsepower_hp')}
          {field('Drægni (km)', 'range_km')}
          {field('Dráttargeta (kg)', 'towing_kg')}
        </div>

        <label className="block text-sm mb-4">
          <span className="text-slate-400">Lýsing (íslenska)</span>
          <textarea
            value={form.description_is}
            onChange={(e) => set('description_is', e.target.value)}
            rows={10}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-slate-800 text-white border border-white/10"
          />
        </label>

        <label className="block text-sm mb-4">
          <span className="text-slate-400">Myndir (engar merkingar / erlend merki)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="mt-1 block w-full text-sm text-slate-300"
          />
          {files.length > 0 && (
            <p className="text-slate-500 text-xs mt-1">{files.length} myndir valdar</p>
          )}
        </label>

        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={form.goLive}
            onChange={(e) => set('goLive', e.target.checked)}
          />
          Birta strax (í sölu)
        </label>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={submit}
          disabled={busy || !form.title || !form.make || !form.model}
          className="px-5 py-3 rounded-lg bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 disabled:opacity-50"
        >
          {busy ? 'Vista...' : 'Vista bíl'}
        </button>
      </div>
    </div>
  )
}
