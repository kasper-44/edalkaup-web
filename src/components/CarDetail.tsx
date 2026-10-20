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
import { IconHeart } from '@/components/Icons'

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
  const isSaved = saved.includes(car.id)
  const colour = displayExteriorColour(car)

  const specs = [
    { label: 'Árgerð', value: car.year?.toString() || '' },
    { label: 'Framleiðandi', value: car.make || '' },
    { label: 'Gerð', value: car.model || '' },
    { label: 'Útgáfa', value: car.trim || '' },
    { label: 'Akstur', value: formatMileage(car.mileage_km) },
    { label: 'Ytri litur', value: colour },
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

  const highlights = [
    { label: 'Árgerð', value: car.year },
    { label: 'Akstur', value: formatMileage(car.mileage_km) },
    { label: 'Drif', value: car.drivetrain || '—' },
    { label: 'Eldsneyti', value: fuelLabel(car.fuel_type || '') },
  ]

  return (
    <div className="pt-16 lg:pt-20">
      <div className="dealer-container py-8 sm:py-14">
        <nav aria-label="Slóð" className="mb-8 text-sm text-[#5c564c] dark:text-slate-300">
          <Link href="/bilar" className="underline decoration-transparent underline-offset-4 transition-colors hover:text-accent-dark hover:decoration-accent dark:hover:text-accent">Bílar</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-navy-900 dark:text-white">{title}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(19.5rem,0.72fr)] lg:items-start lg:gap-x-14">
          <div className="contents lg:col-start-2 lg:row-start-1 lg:block lg:space-y-8">
            <header className="order-1 lg:order-none">
              <div className={`mb-4 inline-block border px-3 py-1 text-xs font-semibold tracking-wide ${inTransit ? 'border-amber-400 bg-amber-100 text-amber-950 dark:border-amber-300 dark:bg-amber-400/15 dark:text-amber-200' : 'border-emerald-700/20 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                {inTransit ? 'Á leiðinni' : 'Til sölu'}
              </div>
              {arrival && (
                <p className="mb-3 text-sm font-medium text-amber-800 dark:text-amber-300">{arrival}</p>
              )}
              <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
              <p className="dealer-price mt-5 text-4xl sm:text-5xl">{formatPrice(car.price_isk, 'Verð óákveðið')}</p>
              {vatSubtitle && (
                <p className="mt-2 text-base text-[#5c564c] dark:text-slate-300">{vatSubtitle}</p>
              )}
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div key={item.label} className="border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-navy-800">
                    <dt className="text-xs tracking-wide text-[#5c564c] uppercase dark:text-slate-400">{item.label}</dt>
                    <dd className="mt-1 text-lg text-navy-900 dark:text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </header>

            <aside className="order-3 flex flex-col gap-6 lg:order-none">
              <div className="border border-black/10 bg-white p-6 sm:p-7 dark:border-white/10 dark:bg-navy-800">
                <a href="#fyrirspurn" className="dealer-button mb-3 w-full">Fá nánari upplýsingar</a>
                <CallLink placement="car_detail" className="mb-3 block w-full border border-black/15 px-5 py-3.5 text-center font-semibold transition-colors hover:border-accent hover:text-accent-dark dark:border-white/20 dark:hover:text-accent">Hringja í 699 2011</CallLink>
                <button type="button" aria-pressed={isSaved} onClick={() => toggle(car.id)} className="mb-5 inline-flex w-full items-center justify-center gap-2 border border-black/15 px-5 py-3 font-medium transition-colors hover:border-accent-dark dark:border-white/15">
                  <IconHeart filled={isSaved} />
                  {isSaved ? 'Bíll vistaður' : 'Vista þennan bíl'}
                </button>
                {colour !== 'Ótilgreint' && (
                  <p className="mb-4 flex justify-between gap-4 border-t border-black/10 pt-4 text-sm dark:border-white/10">
                    <span className="text-[#5c564c] dark:text-slate-400">Litur</span>
                    <span className="font-medium text-navy-900 dark:text-white">{colour}</span>
                  </p>
                )}
                <p className="mb-5 text-sm leading-relaxed text-[#5c564c] dark:text-slate-300">Hafðu samband til að staðfesta framboð, staðsetningu og möguleika á að skoða bílinn. Við aðstoðum með ferlið frá fyrstu fyrirspurn til afhendingar.</p>
                <a
                  href={`https://wa.me/3546992011?text=${encodeURIComponent(`Hæ, ég hef áhuga á ${title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-3 block w-full border border-accent-dark px-6 py-3 text-center font-semibold text-accent-dark transition-colors hover:bg-accent/10 dark:border-accent dark:text-accent"
                >
                  WhatsApp
                </a>
                <ShareButtons url={listingUrl} title={title} />
              </div>
              <div id="fyrirspurn" className="scroll-mt-28">
                <ContactForm
                  carTitle={title}
                  carUrl={listingUrl}
                  carVin={car.vin || undefined}
                  source="bilur"
                />
              </div>
            </aside>
          </div>

          <div className="contents lg:col-start-1 lg:row-start-1 lg:block lg:space-y-10">
            <div className="order-2 lg:order-none">
              {car.images && car.images.length > 0 ? (
                <CarGallery images={car.images} alt={title} />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-[#ece7de] dark:bg-navy-800">
                  <p className="text-[#5c564c]">Engar myndir</p>
                </div>
              )}
            </div>
            {description && (
              <div className="order-4 border border-black/10 bg-white p-6 sm:p-8 lg:order-none dark:border-white/10 dark:bg-navy-800">
                <h2 className="mb-4 text-3xl text-navy-900 dark:text-white">Lýsing</h2>
                <div className="leading-relaxed whitespace-pre-wrap text-[#3f3a33] dark:text-slate-300">
                  {description}
                </div>
              </div>
            )}
            <div className="order-5 border border-black/10 bg-white p-6 sm:p-8 lg:order-none dark:border-white/10 dark:bg-navy-800">
              <h2 className="mb-6 text-3xl text-navy-900 dark:text-white">Tæknilegar upplýsingar</h2>
              <dl className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1 border-b border-black/10 py-3.5 dark:border-white/10">
                    <dt className="text-sm text-[#5c564c] dark:text-slate-400">{spec.label}</dt>
                    <dd className="text-base text-navy-900 dark:text-white">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
