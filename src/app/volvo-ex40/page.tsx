import Image from 'next/image'
import Link from 'next/link'
import { ex40Cars, formatEX40Price, colorHex } from '@/data/ex40'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Volvo EX40 | Eðalkaup',
  description:
    'Splitter nýir Volvo EX40 rafmagnsbílar — pantaðir frá Evrópu. Skoðaðu úrvalið og pantaðu þinn.',
}

function StatusBadge({ status }: { status: 'available' | 'reserved' | 'sold' }) {
  const styles = {
    available: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25',
    reserved: 'bg-accent/15 text-accent-dark dark:text-accent border-accent/25',
    sold: 'bg-red-500/15 text-red-500 dark:text-red-400 border-red-500/25',
  }
  const labels = { available: 'Laus', reserved: 'Frátekinn', sold: 'Selt' }
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}

function ColorDot({ color }: { color: string }) {
  const hex = colorHex[color] ?? '#999'
  return (
    <span
      className="inline-block w-4 h-4 rounded-full border border-black/10 dark:border-white/20 shrink-0"
      style={{ backgroundColor: hex }}
      title={color}
    />
  )
}

export default function VolvoEX40Page() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-navy-900 dark:to-navy-800" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,168,76,0.08),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Nýtt á boðstólum</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                Volvo EX40
              </h1>
              <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed mb-6 max-w-lg">
                Rafmagnsbíll frá Volvo — frá 7.690.000 kr. Hreinn rafmagnsdráttur með allt að 480 km drægni.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white dark:bg-navy-700/60 rounded-xl border border-black/5 dark:border-white/5 px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-accent">Rafmagn</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Hreinn rafmagn</p>
                </div>
                <div className="bg-white dark:bg-navy-700/60 rounded-xl border border-black/5 dark:border-white/5 px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-accent">~480 km</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Drægni</p>
                </div>
                <div className="bg-white dark:bg-navy-700/60 rounded-xl border border-black/5 dark:border-white/5 px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-accent">5 sæti</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400">Staðalbúnaður</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">Frá {formatEX40Price(7690000)}</p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
              <Image
                src="/images/ex40/crystal-white-1.jpg"
                alt="Volvo EX40 — Crystal White"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Car Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Veldu þinn</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{ex40Cars.length} bílar í boði</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ex40Cars.map((car) => (
            <article
              key={car.id}
              className={`group bg-white dark:bg-navy-800 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5 flex flex-col ${car.status === 'sold' ? 'opacity-60' : ''}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={car.image} alt={`Volvo EX40 — ${car.exteriorColor}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute top-3 right-3"><StatusBadge status={car.status} /></div>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-medium text-accent uppercase tracking-wider">Volvo</p>
                <h3 className="text-base font-bold text-gray-900 dark:text-white mt-0.5 mb-1">EX40</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{car.config}</p>
                <div className="flex items-center gap-2 mb-3">
                  <ColorDot color={car.exteriorColor} />
                  <span className="text-sm text-gray-600 dark:text-slate-300">{car.exteriorColor}</span>
                </div>
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">Sjálfskiptur · Rafmagn · 5 sæti</p>
                {car.packages.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {car.packages.map((pkg) => (
                      <span key={pkg} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-slate-400 border border-black/5 dark:border-white/5">{pkg}</span>
                    ))}
                  </div>
                )}
                <div className="mt-auto" />
                <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">
                  Áætluð afhending: <span className="text-gray-600 dark:text-slate-300 font-medium">{car.deliveryEstimate}</span>
                </p>
                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-end justify-between">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatEX40Price(car.price)}</p>
                  {car.status !== 'sold' && (
                    <Link href="/hafa-samband" className="text-accent text-sm font-medium hover:text-accent-light transition-colors">Skoða nánar →</Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl border border-accent/20 p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Hefur þú áhuga?</h2>
            <p className="text-gray-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
              Hafðu samband og við aðstoðum þig við að velja réttan EX40. Einnig hægt að panta sérsniðna útgáfu.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/hafa-samband" className="inline-block px-8 py-4 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-all hover:scale-105">Hafa samband</Link>
              <a href="https://m.me/edalkaup" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold border border-accent/30 text-accent rounded-xl hover:bg-accent/10 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.907 1.45 5.499 3.716 7.19V22l3.427-1.88A11.26 11.26 0 0012 20.485c5.523 0 10-4.144 10-9.242C22 6.145 17.523 2 12 2zm1.07 12.448l-2.545-2.714-4.97 2.714 5.467-5.8 2.609 2.714 4.905-2.714-5.466 5.8z" /></svg>
                Messenger
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
