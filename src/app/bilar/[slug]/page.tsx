'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
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

export default function CarPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCar() {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', slug)
        .single()

      if (!error && data) {
        setCar(data)
      }
      setLoading(false)
    }
    if (slug) fetchCar()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="inline-block w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-slate-400 mt-4">Hleð...</p>
        </div>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <h1 className="text-4xl font-bold text-gray-300 dark:text-slate-600 mb-4">404</h1>
          <p className="text-xl text-gray-500 dark:text-slate-400 mb-6">Bíll fannst ekki</p>
          <a href="/bilar" className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors">
            Fara á bílasíðu
          </a>
        </div>
      </div>
    )
  }

  const title = `${car.year} ${car.make} ${car.model} ${car.trim || ''}`.trim()

  const specs = [
    { label: 'Árgerð', value: car.year?.toString() || '' },
    { label: 'Framleiðandi', value: car.make || '' },
    { label: 'Gerð', value: car.model || '' },
    { label: 'Útgáfa', value: car.trim || '' },
    { label: 'Akstur', value: formatMileage(car.mileage_km) },
    { label: 'Ytra litur', value: car.exterior_colour || 'Ótilgreint' },
    { label: 'Innra litur', value: car.interior_colour || 'Ótilgreint' },
    { label: 'Drifkerfi', value: car.drivetrain || '4WD' },
    { label: 'Vél', value: car.engine || '' },
    { label: 'Gírkassi', value: car.transmission || 'Sjálfskiptur' },
    { label: 'Eldsneyti', value: car.fuel_type || '' },
    { label: 'Tegund', value: car.body_type || 'SUV' },
  ].filter(s => s.value)

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
            {/* Gallery */}
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
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Price card */}
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

              {/* Quick specs */}
              <div className="space-y-3 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Akstur</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatMileage(car.mileage_km)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Árgerð</span>
                  <span className="font-medium text-gray-900 dark:text-white">{car.year}</span>
                </div>
                {car.exterior_colour && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Litur</span>
                    <span className="font-medium text-gray-900 dark:text-white">{car.exterior_colour}</span>
                  </div>
                )}
              </div>

              {/* Contact CTA */}
              <a
                href={`https://wa.me/3546992011?text=${encodeURIComponent(`Hæ, ég hef áhuga á ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors mb-3"
              >
                Hafa samband
              </a>
              <a
                href="tel:+3546992011"
                className="block w-full text-center px-6 py-3 border border-accent text-accent font-semibold rounded-xl hover:bg-accent/10 transition-colors"
              >
                Hringja: 699 2011
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
