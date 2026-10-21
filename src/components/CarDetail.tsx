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
import LiveDot from '@/components/LiveDot'

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
    <div className="site-offset bg-gray-50 dark:bg-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Slóð" className="text-sm text-gray-600 dark:text-slate-300 mb-4 lg:mb-6">
          <Link href="/bilar" className="hover:text-accent transition-colors">Bílar</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-600 dark:text-slate-300">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          <div className="relative order-2 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-1">
            {car.images && car.images.length > 0 ? (
              <CarGallery images={car.images} alt={title} />
            ) : (
              <div className="aspect-video bg-gray-100 dark:bg-navy-800 rounded-[1.75rem] shadow-[0_16px_40px_rgba(10,15,28,0.12)] flex items-center justify-center">
                <p className="text-gray-400">Engar myndir</p>
              </div>
            )}
            <ListingRibbons kinds={ribbons} size="hero" />
          </div>

          {/* Right Sidebar. On mobile the price card is the first block so price and the sticky contact bar share the first screen. */}
          <div className="contents lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-6">
            <div className="dealer-card order-1 p-6 sm:p-7 lg:order-none">
              <div className={`mb-5 inline-flex -rotate-2 items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide shadow-md ${inTransit ? 'bg-amber-400 text-amber-950' : 'bg-accent text-navy-900'}`}>
                {!inTransit && <LiveDot tone="ink" />}
                {inTransit ? 'Á leiðinni' : 'Til sölu'}
              </div>
              {arrival && (
                <p className="mb-4 text-sm font-medium text-amber-800 dark:text-amber-300">{arrival}</p>
              )}
              <h1 className="display-headline display-headline-lg mb-1 text-gray-900 dark:text-white">{title}</h1>
              <div className="mt-4 mb-6">
                <StruckPrice
                  current={car.price_isk}
                  previous={reduction.previousPrice}
                  reduced={reduction.reduced}
                  className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl dark:text-white"
                  previousClassName="text-lg font-semibold text-gray-500 line-through decoration-2 dark:text-slate-400"
                  emptyLabel="Verð óákveðið"
                />
                {vatSubtitle && (
                  <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">{vatSubtitle}</p>
                )}
              </div>
              <CarContactActions placement="car_detail" className="mb-6 hidden gap-2 lg:flex" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                <div className="rounded-2xl bg-gray-50 p-3 shadow-sm dark:bg-navy-700/60"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">Árgerð</span><span className="mt-1 block font-black tracking-tight">{car.year}</span></div>
                <div className="rounded-2xl bg-gray-50 p-3 shadow-sm dark:bg-navy-700/60"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">Akstur</span><span className="mt-1 block font-black tracking-tight">{formatMileage(car.mileage_km)}</span></div>
                <div className="rounded-2xl bg-gray-50 p-3 shadow-sm dark:bg-navy-700/60"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-slate-400">Drif</span><span className="mt-1 block font-black tracking-tight">{car.drivetrain || '—'}</span></div>
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
              <button type="button" aria-pressed={saved.includes(car.id)} onClick={() => toggle(car.id)} className="w-full text-center px-5 py-3 border border-black/15 dark:border-white/15 rounded-xl font-medium mb-4">{saved.includes(car.id) ? '♥ Bíll vistaður' : '♡ Vista þennan bíl'}</button>
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

            <div id="fyrirspurn" className="order-3 scroll-mt-[calc(var(--site-header-offset)+0.5rem)] max-lg:pb-28 lg:order-none">
              <ContactForm
                carTitle={title}
                carUrl={listingUrl}
                carVin={car.vin || undefined}
                source="bilur"
              />
            </div>
          </div>

          <div className="order-4 space-y-8 lg:order-none lg:col-span-2 lg:col-start-1 lg:row-start-2">
            {description && (
              <div className="dealer-card p-6 sm:p-8">
                <h2 className="mb-4 text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Lýsing</h2>
                <div className="text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {description}
                </div>
              </div>
            )}

            <div className="dealer-card p-6 sm:p-8">
              <h2 className="mb-6 text-lg font-black uppercase tracking-tight text-gray-900 dark:text-white">Tæknilegar upplýsingar</h2>
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
      <CarContactActions
        placement="sticky_bar"
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-accent/50 bg-navy-900/95 px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:hidden"
      />
    </div>
  )
}
