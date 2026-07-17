'use client'

import { useState } from 'react'
import CarGallery from '@/components/CarGallery'
import ContactForm from '@/components/ContactForm'

function formatPrice(price: number) {
  if (!price || price === 0) return 'Verð óákveðið'
  return new Intl.NumberFormat('is-IS').format(price) + ' kr.'
}

function formatMileage(km: number) {
  if (!km) return 'Ótilgreint'
  return new Intl.NumberFormat('is-IS').format(km) + ' km'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CarDetail({ car }: { car: any }) {
  const [showInquiry, setShowInquiry] = useState(false)
  const title = `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.trim()

  const specs = [
    { label: 'Árgerð', value: car.year?.toString() || '' },
    { label: 'Framleiðandi', value: car.make || '' },
    { label: 'Gerð', value: car.model || '' },
    { label: 'Útgáfa', value: car.trim || '' },
    { label: 'Akstur', value: formatMileage(car.mileage_km) },
    { label: 'Ytra litur', value: car.exterior_colour || car.colour || 'Ótilgreint' },
    { label: 'Innra litur', value: car.interior_colour || 'Ótilgreint' },
    { label: 'Drifkerfi', value: car.drivetrain || '4WD' },
    { label: 'Vél', value: car.engine || '' },
    { label: 'Rafhlaða', value: car.battery_kwh ? `${car.battery_kwh} kWh` : '' },
    { label: 'Afl', value: car.horsepower_hp ? `${car.horsepower_hp} hö` : '' },
    { label: 'Drægni', value: car.range_km ? `${car.range_km} km` : '' },
    { label: 'Dráttargeta', value: car.towing_kg ? `${car.towing_kg} kg` : '' },
    { label: 'Gírkassi', value: car.transmission || 'Sjálfskiptur' },
    { label: 'Eldsneyti', value: car.fuel_type || '' },
    { label: 'Tegund', value: car.body_type || 'SUV' },
  ].filter((s) => s.value)

  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 dark:text-slate-500 mb-6">
          <a href="/bilar" className="hover:text-accent transition-colors">Bílar</a>
          <span className="mx-2">/</span>
          <span className="text-gray-600 dark:text-slate-300">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left — Gallery + Specs */}
          <div className="lg:col-span-2 space-y-8">
            {car.images && car.images.length > 0 ? (
              <CarGallery images={car.images} alt={title} />
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-navy-800 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">Engar myndir</p>
              </div>
            )}

            {/* Specs */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tæknilegar upplýsingar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm text-gray-500 dark:text-slate-400">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inquiry form (expands inline) */}
            {showInquiry && (
              <div id="fyrirspurn">
                <ContactForm
                  carTitle={title}
                  carUrl={`https://edalkaup.is/bilar/${car.id}`}
                  carVin={car.vin || undefined}
                />
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sticky top-24">
              <div className="inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-4 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Til sölu
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h1>
              <div className="mt-4 mb-6">
                <p className="text-3xl font-bold text-accent">{formatPrice(car.price_isk)}</p>
                {car.price_isk > 0 && (
                  <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">m/VSK</p>
                )}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Akstur</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatMileage(car.mileage_km)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Árgerð</span>
                  <span className="font-medium text-gray-900 dark:text-white">{car.year}</span>
                </div>
                {(car.exterior_colour || car.colour) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Litur</span>
                    <span className="font-medium text-gray-900 dark:text-white">{car.exterior_colour || car.colour}</span>
                  </div>
                )}
              </div>

              {/* Primary CTA: inquiry form for this specific car */}
              <button
                onClick={() => {
                  setShowInquiry(true)
                  setTimeout(() => document.getElementById('fyrirspurn')?.scrollIntoView({ behavior: 'smooth' }), 50)
                }}
                className="block w-full text-center px-6 py-3 bg-accent text-navy-900 font-semibold rounded-xl hover:bg-accent-light transition-colors mb-3"
              >
                Senda fyrirspurn um þennan bíl
              </button>
              <a
                href={`https://wa.me/3546992011?text=${encodeURIComponent(`Hæ, ég hef áhuga á ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 border border-accent text-accent font-semibold rounded-xl hover:bg-accent/10 transition-colors mb-3"
              >
                WhatsApp
              </a>
              <a
                href="tel:+354****2011"
                className="block w-full text-center px-6 py-3 border border-black/10 dark:border-white/10 text-gray-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors mb-3"
              >
                Hringja: 699 2011
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://edalkaup.is/bilar/${car.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-center px-6 py-3 bg-[#1877F2] text-white font-semibold rounded-xl hover:bg-[#1466d4] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07z"/></svg>
                Deila á Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
