import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car, formatPrice, formatMileage } from '@/data/cars'
import { fuelLabel } from '@/lib/inventory'
import { vehicleTitle } from '@/lib/listingSeo'
import { vatIncludedPriceSubtitle, withVatFlag } from '@/lib/priceVat'
import { expectedArrivalLabel } from '@/lib/transit'
import { IconArrowRight } from '@/components/Icons'

interface CarCardProps {
  car: Car
  priority?: boolean
  actions?: ReactNode
}

export default function CarCard({ car, priority = false, actions }: CarCardProps) {
  const statusColors = {
    available: 'bg-white/95 text-navy-900 border-white',
    'in-transit': 'bg-amber-400 text-amber-950 border-amber-300',
    sold: 'bg-white/95 text-red-900 border-white',
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
    <article className="dealer-card group flex h-full flex-col overflow-hidden">
    <Link href={`/bilar/${car.slug}`} className="flex flex-1 flex-col" aria-label={title}>
      <div className="flex flex-1 flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#14120e]">
          {car.images[0] ? <Image
            src={car.images[0]}
            alt={title}
            fill
            quality={80}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          /> : <div className="absolute inset-0 flex items-center justify-center bg-[#ece7de] text-[#5c564c] dark:bg-navy-700 dark:text-slate-300">Mynd væntanleg</div>}

          <div className={`absolute top-4 left-4 border px-3 py-1 text-xs font-semibold tracking-wide ${statusColors[car.status]}`}>
            {statusLabels[car.status]}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="dealer-eyebrow">{car.make}</p>
          <h3 className="mt-2 text-[1.65rem] leading-snug text-navy-900 transition-colors group-hover:text-accent-dark dark:text-white dark:group-hover:text-accent">
            {title}
          </h3>
          {arrival && (
            <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-300">{arrival}</p>
          )}

          <dl className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#5c564c] dark:text-slate-300">
            <div><dt className="sr-only">Árgerð</dt><dd>{car.year}</dd></div>
            <span aria-hidden="true">·</span>
            <div><dt className="sr-only">Eldsneyti</dt><dd>{fuelLabel(car.fuelType)}</dd></div>
            <span aria-hidden="true">·</span>
            <div><dt className="sr-only">Akstur</dt><dd>{formatMileage(car.mileage)}</dd></div>
          </dl>

          <div className="mt-auto border-t border-black/10 pt-5 dark:border-white/10">
            <p className="dealer-price text-[1.85rem]">{formatPrice(car.price)}</p>
            {vatSubtitle && (
              <p className="mt-1.5 text-sm text-[#5c564c] dark:text-slate-300">{vatSubtitle}</p>
            )}
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent-dark transition-colors group-hover:text-navy-900 dark:text-accent dark:group-hover:text-accent-light">
              Skoða bíl <IconArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
    {actions && <div className="flex border-t border-black/10 dark:border-white/10">{actions}</div>}
    </article>
  )
}
