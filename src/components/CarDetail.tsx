'use client'

import Link from 'next/link'
import { useSavedCars } from '@/components/useSavedCars'
import { fuelLabel } from '@/lib/inventory'
import CarGallery from '@/components/CarGallery'
import ContactForm from '@/components/ContactForm'
import CallLink from '@/components/CallLink'
import { displayExteriorColour } from '@/lib/exteriorColour'
import { listingCopy } from '@/lib/listingCopy'
import { publicCarSlug } from '@/lib/carPath'
import { vehicleTitle } from '@/lib/listingSeo'
import { vatIncludedPriceSubtitle } from '@/lib/priceVat'
import { formatIskNumber, formatPrice } from '@/lib/formatIsk'
import { SITE_ORIGIN } from '@/lib/site'
import { expectedArrivalLabel } from '@/lib/transit'
import ShareButtons from '@/components/ShareButtons'
import { HeartIcon } from '@/components/Icons'
import ListingDescription from '@/components/ListingDescription'

function formatMileage(km: number | null) {
  if (km == null) return 'Ótilgreint'
  return formatIskNumber(km) + ' km'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CarDetail({ car }: { car: any }) {
  const { saved, toggle } = useSavedCars()
  const title = vehicleTitle(car)
  const inTransit = car.in_transit === true
  const arrival = inTransit ? expectedArrivalLabel(car.expected_arrival) : null
  const listingUrl = `${SITE_ORIGIN}/bilar/${publicCarSlug(car)}`
  const vatSubtitle = car.price_isk > 0 ? vatIncludedPriceSubtitle(car) : null
  const description = listingCopy(car.description_is)

  const specs = [
    { label: 'Árgerð', value: car.year?.toString() || '' },
    { label: 'Framleiðandi', value: car.make || '' },
    { label: 'Gerð', value: car.model || '' },
    { label: 'Útgáfa', value: car.trim || '' },
    { label: 'Akstur', value: formatMileage(car.mileage_km) },
    { label: 'Ytri litur', value: displayExteriorColour(car) },
    { label: 'Innri litur', value: car.interior_colour || 'Ótilgreint' },
    { label: 'Drifkerfi', value: car.drivetrain || 'Ótilgreint' },
    { label: 'Vél', value: car.engine || '' },
    { label: 'Rafhlaða', value: car.battery_kwh ? `${car.battery_kwh} kWh` : '' },
    { label: 'Afl', value: car.horsepower_hp ? `${car.horsepower_hp} hö` : '' },
    { label: 'Drægni', value: car.range_km ? `${car.range_km} km` : '' },
    { label: 'Dráttargeta', value: car.towing_kg ? `${car.towing_kg} kg` : '' },
    { label: 'Gírkassi', value: car.transmission || 'Ótilgreint' },
    { label: 'Eldsneyti', value: fuelLabel(car.fuel_type || '') },
    { label: 'Tegund', value: car.body_type || 'Ótilgreint' },
  ].filter((s) => s.value)

  return (
    <div className="pt-20 lg:pt-24 bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav aria-label="Slóð" className="text-sm text-gray-600 dark:text-slate-300 mb-6">
          <Link href="/bilar" className="hover:text-accent transition-colors">Bílar</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600 dark:text-slate-300">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
            {car.images && car.images.length > 0 ? (
              <CarGallery images={car.images} alt={title} />
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-navy-800 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">Engar myndir</p>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6 lg:col-start-3 lg:row-span-2 lg:row-start-1">
            <div className="order-1 rounded-2xl border border-black/10 bg-white p-6 dark:border-white/5 dark:bg-navy-800 lg:order-1">
              <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-4 ${inTransit ? 'bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-300' : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700'}`}>
                {inTransit ? 'Á leiðinni' : 'Til sölu'}
              </div>
              {arrival && (
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300 -mt-2 mb-4">{arrival}</p>
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h1>
              <div className="mt-4 mb-6">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(car.price_isk, 'Verð óákveðið')}</p>
                {vatSubtitle && (
                  <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{vatSubtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                <div className="rounded-xl bg-gray-50 dark:bg-navy-700/60 p-3"><span className="block text-xs text-gray-500 dark:text-slate-400">Árgerð</span><span className="block mt-1 font-semibold">{car.year}</span></div>
                <div className="rounded-xl bg-gray-50 dark:bg-navy-700/60 p-3"><span className="block text-xs text-gray-500 dark:text-slate-400">Akstur</span><span className="block mt-1 font-semibold">{formatMileage(car.mileage_km)}</span></div>
                <div className="rounded-xl bg-gray-50 dark:bg-navy-700/60 p-3"><span className="block text-xs text-gray-500 dark:text-slate-400">Drif</span><span className="block mt-1 font-semibold">{car.drivetrain || '—'}</span></div>
              </div>
              <div className="space-y-3 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-slate-400">Akstur</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatMileage(car.mileage_km)}</span>
                </div>

                {displayExteriorColour(car) !== 'Ótilgreint' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">Litur</span>
                    <span className="font-medium text-gray-900 dark:text-white">{displayExteriorColour(car)}</span>
                  </div>
                )}
              </div>

              <a href="#fyrirspurn" className="block w-full text-center px-5 py-3.5 bg-accent text-navy-900 font-semibold rounded-xl hover:bg-accent-light mb-3">Fá nánari upplýsingar</a>
              <CallLink placement="car_detail" className="block w-full text-center px-5 py-3.5 border border-black/15 dark:border-white/20 font-semibold rounded-xl hover:border-accent hover:text-accent transition-colors mb-3">Hringja í 699 2011</CallLink>
              <button type="button" aria-pressed={saved.includes(car.id)} onClick={() => toggle(car.id)} className="w-full inline-flex items-center justify-center gap-2 text-center px-5 py-3 border border-black/15 dark:border-white/15 rounded-xl font-medium mb-4">{saved.includes(car.id) ? <><HeartIcon filled /> Bíll vistaður</> : <><HeartIcon /> Vista þennan bíl</>}</button>
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-5">Hafðu samband til að staðfesta framboð, staðsetningu og möguleika á að skoða bílinn. Við aðstoðum með ferlið frá fyrstu fyrirspurn til afhendingar.</p>
              <a
                href={`https://wa.me/3546992011?text=${encodeURIComponent(`Hæ, ég hef áhuga á ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-3 border border-accent-dark dark:border-accent text-accent-dark dark:text-accent font-semibold rounded-xl hover:bg-accent/10 transition-colors mb-3"
              >
                WhatsApp
              </a>
              <ShareButtons url={listingUrl} title={title} />
            </div>

            <div id="fyrirspurn" className="order-2 scroll-mt-28">
              <ContactForm
                carTitle={title}
                carUrl={listingUrl}
                carVin={car.vin || undefined}
                source="bilur"
              />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2 lg:col-start-1 lg:row-start-2">
            {description && <ListingDescription text={description} />}

            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tæknilegar upplýsingar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1 py-3 border-b border-black/5 dark:border-white/5">
                    <span className="text-sm text-gray-500 dark:text-slate-400">{spec.label}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
