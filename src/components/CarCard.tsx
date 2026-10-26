import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car, formatMileage } from '@/data/cars'
import { fuelLabel } from '@/lib/inventory'
import { vehicleTitle } from '@/lib/listingSeo'
import { listingRibbonKinds } from '@/lib/listingRibbon'
import { vatIncludedPriceSubtitle, withVatFlag } from '@/lib/priceVat'
import { expectedArrivalLabel } from '@/lib/transit'
import ArrowIcon from '@/components/ArrowIcon'
import ListingRibbons, { StruckPrice } from '@/components/ListingRibbon'
import LiveDot from '@/components/LiveDot'

interface CarCardProps {
  car: Car
  priority?: boolean
  actions?: ReactNode
}

export default function CarCard({ car, priority = false, actions }: CarCardProps) {
  const statusColors = {
    available: 'bg-accent text-navy-900',
    'in-transit': 'bg-amber-400 text-amber-950',
    sold: 'bg-navy-900 text-white',
  }

  const statusLabels = {
    available: 'Til sölu',
    'in-transit': 'Á leiðinni',
    sold: 'Selt',
  }

  const title = vehicleTitle(car)
  const arrival = car.status === 'in-transit' ? expectedArrivalLabel(car.expectedArrival) : null
  const vatSubtitle =
    car.price > 0
      ? vatIncludedPriceSubtitle(
          withVatFlag({
            id: car.id,
            bodyType: car.bodyType,
            priceIncludesVat: car.priceIncludesVat,
          }),
        )
      : null

  return (
    <article className="dealer-card h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_44px_rgba(10,15,28,0.12)]">
    <Link href={`/bilar/${car.slug}`} className="group flex flex-col flex-1" aria-label={title}>
      <div className="flex flex-col flex-1 hover:bg-accent/5 transition-colors">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {car.images[0] ? <Image
            src={car.images[0]}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.035] transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          /> : <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-slate-300">Mynd væntanleg</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-navy-900/60 to-transparent" />

          {/* Status badge */}
          <ListingRibbons kinds={listingRibbonKinds(car)} />
          <div className={`absolute top-3 right-3 z-10 -rotate-6 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide shadow-sm ${statusColors[car.status]}`}>
            {car.status === 'available' && <LiveDot tone="ink" />}
            {statusLabels[car.status]}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-[11px] font-bold text-accent-dark dark:text-accent uppercase tracking-[0.16em]">{car.make}</p>
              <h3 className="mt-1 text-xl font-semibold leading-[1.12] tracking-[-0.03em] text-gray-900 dark:text-white group-hover:text-accent-dark dark:group-hover:text-accent transition-colors">
                {title}
              </h3>
              {arrival && (
                <p className="mt-1 text-sm font-medium text-amber-800 dark:text-amber-300">{arrival}</p>
              )}
            </div>
          </div>

          {/* Quick specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 mb-4 text-sm text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              {car.year}
            </span>
            <span>•</span>
            <span>{fuelLabel(car.fuelType)}</span>
            <span>•</span>
            <span>{formatMileage(car.mileage)}</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex flex-col items-start gap-3">
            <div>
              <StruckPrice
                current={car.price}
                previous={car.previousPrice}
                reduced={car.priceReduced === true}
                className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white whitespace-nowrap"
              />
              {vatSubtitle && (
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{vatSubtitle}</p>
              )}
            </div>
            <span className="self-end inline-flex items-center gap-1 text-accent-dark dark:text-accent text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Skoða bíl <ArrowIcon direction="right" />
            </span>
          </div>
        </div>
      </div>
    </Link>
    {actions && <div className="flex border-t border-black/10 dark:border-white/10">{actions}</div>}
    </article>
  )
}
