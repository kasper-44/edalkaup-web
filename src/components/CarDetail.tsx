'use client'

import Link from 'next/link'
import { useSavedCars } from '@/components/useSavedCars'
import { fuelLabel } from '@/lib/inventory'
import CarGallery from '@/components/CarGallery'
import ContactForm from '@/components/ContactForm'
import CallLink from '@/components/CallLink'
import ListingRibbons, { StruckPrice } from '@/components/ListingRibbon'
import { displayExteriorColour } from '@/lib/exteriorColour'
import { listingCopy } from '@/lib/listingCopy'
import { listingRibbonKinds } from '@/lib/listingRibbon'
import { publicCarSlug } from '@/lib/carPath'
import { vehicleTitle } from '@/lib/listingSeo'
import { priceReduction } from '@/lib/priceReduction'
import { vatIncludedPriceSubtitle } from '@/lib/priceVat'
import { formatIskNumber } from '@/lib/formatIsk'
import { DEALER_SAME_AS, SITE_ORIGIN } from '@/lib/site'
import { expectedArrivalLabel, isInTransit } from '@/lib/transit'
import type { CallPlacement } from '@/lib/analytics'
import ShareButtons from '@/components/ShareButtons'
import { goToInquiry } from '@/lib/goToInquiry'

function CarContactActions({ placement, className }: { placement: CallPlacement; className: string }) {
  const button = 'inline-flex min-h-14 flex-1 items-center justify-center rounded-xl px-2 text-center text-base font-semibold leading-tight'
  return (
    <div className={className}>
      <CallLink placement={placement} className={`${button} bg-accent text-navy-900 hover:bg-accent-light`}>
        Hringja
      </CallLink>
      <a
        href={DEALER_SAME_AS[0]}
        target="_blank"
        rel="noopener noreferrer"
        className={`${button} border border-accent bg-navy-900 text-accent hover:bg-navy-800`}
      >
        Senda skilaboð
      </a>
    </div>
  )
}

function formatMileage(km: number | null) {
  if (km == null) return 'Ótilgreint'
  return formatIskNumber(km) + ' km'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CarDetail({ car }: { car: any }) {
  const { saved, toggle } = useSavedCars()
  const title = vehicleTitle(car)
  const inTransit = isInTransit(car)
  const ribbons = listingRibbonKinds(car)
  const reduction = priceReduction(car)
  const arrival = inTransit ? expectedArrivalLabel(car.expected_arrival) : null
  const listingUrl = `${SITE_ORIGIN}/bilar/${publicCarSlug(car)}`
  const vatSubtitle = car.price_isk > 0 ? vatIncludedPriceSubtitle(car) : null
  const description = listingCopy(car.description_is)
  const savedThis = saved.includes(car.id)

  const facts = [
    { label: 'Árgerð', value: car.year?.toString() || 'Ótilgreint' },
    { label: 'Km', value: formatMileage(car.mileage_km) },
    { label: 'Eldsneyti', value: fuelLabel(car.fuel_type || '') },
    { label: 'Gírkassi', value: car.transmission || 'Ótilgreint' },
  ]

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
    <div className="bg-gray-50 dark:bg-navy-900">
      <div className="site-offset">
        <div className="relative">
          {car.images && car.images.length > 0 ? (
            <CarGallery images={car.images} alt={title} overlay={<ListingRibbons kinds={ribbons} size="hero" />} />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center bg-gray-100 lg:h-[min(38vh,400px)] lg:aspect-auto dark:bg-navy-800">
              <p className="text-gray-400">Engar myndir</p>
            </div>
          )}
        </div>

        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6 lg:max-w-4xl lg:py-8">
          <nav aria-label="Slóð" className="mb-3 text-sm text-gray-600 dark:text-slate-300">
            <Link href="/bilar" className="hover:text-accent">Bílar</Link>
            <span className="mx-2" aria-hidden="true">/</span>
            <span className="text-gray-900 dark:text-white">{title}</span>
          </nav>

          <h1 className="display-headline display-headline-lg text-gray-900 dark:text-white">{title}</h1>
          {arrival && <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-300">{arrival}</p>}

          <div className="mt-4">
            <StruckPrice
              current={car.price_isk}
              previous={reduction.previousPrice}
              reduced={reduction.reduced}
              className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white"
              previousClassName="text-lg font-semibold text-gray-500 line-through decoration-2 dark:text-slate-400"
              emptyLabel="Verð óákveðið"
            />
            {vatSubtitle && <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">{vatSubtitle}</p>}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="rounded-xl border border-black/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-navy-800">
                <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">{fact.label}</dt>
                <dd className="mt-0.5 text-sm font-black tracking-tight text-gray-900 dark:text-white">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <CallLink placement="car_detail" className="inline-flex min-h-12 items-center justify-center rounded-xl bg-accent px-3 text-base font-semibold text-navy-900 hover:bg-accent-light">
              Hringja
            </CallLink>
            <button type="button" onClick={goToInquiry} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-navy-900 bg-navy-900 px-3 text-base font-semibold text-white hover:bg-navy-800 dark:border-white/15">
              Senda fyrirspurn
            </button>
          </div>

          {description && (
            <section className="dealer-card mt-8 p-6 sm:p-8">
              <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Lýsing</h2>
              <div className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-slate-300">{description}</div>
            </section>
          )}

          <section className="dealer-card mt-8 p-6 sm:p-8">
            <h2 className="mb-6 text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Tæknilegar upplýsingar</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {specs.map((spec) => (
                <div key={spec.label} className="flex flex-col gap-1 border-b border-black/5 py-3 dark:border-white/5">
                  <span className="text-sm text-gray-500 dark:text-slate-400">{spec.label}</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" aria-pressed={savedThis} onClick={() => toggle(car.id)} className="rounded-xl border border-black/15 px-4 py-2.5 text-sm font-semibold dark:border-white/15">
              {savedThis ? 'Bíll vistaður' : 'Vista bíl'}
            </button>
            <a
              href={`https://wa.me/3546992011?text=${encodeURIComponent(`Hæ, ég hef áhuga á ${title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-accent-dark px-4 py-2.5 text-sm font-semibold text-accent-dark hover:bg-accent/10 dark:border-accent dark:text-accent"
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-3">
            <ShareButtons url={listingUrl} title={title} />
          </div>

          <div id="fyrirspurn" className="mt-8 scroll-mt-[calc(var(--site-header-offset)+0.5rem)] max-lg:pb-28">
            <ContactForm
              carTitle={title}
              carUrl={listingUrl}
              carVin={car.vin || undefined}
              source="bilur"
            />
          </div>
        </div>
      </div>
      <CarContactActions
        placement="sticky_bar"
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-accent/50 bg-navy-900/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
      />
    </div>
  )
}
