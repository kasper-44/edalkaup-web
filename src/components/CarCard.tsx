import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car, formatPrice, formatMileage } from '@/data/cars'
import { vehicleTitle } from '@/lib/listingSeo'
import { vatIncludedPriceSubtitle, withVatFlag } from '@/lib/priceVat'

interface CarCardProps {
  car: Car
  priority?: boolean
  actions?: ReactNode
}

export default function CarCard({ car, priority = false, actions }: CarCardProps) {
  const statusColors = {
    available: 'bg-white text-emerald-800 border-white/80',
    'in-transit': 'bg-white text-blue-800 border-white/80',
    sold: 'bg-white text-red-800 border-white/80',
  }

  const statusLabels = {
    available: 'Til sölu',
    'in-transit': 'Á leiðinni',
    sold: 'Selt',
  }

  const title = vehicleTitle(car)
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
    <article className="h-full flex flex-col rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-navy-800">
    <Link href={`/bilar/${car.slug}`} className="group flex flex-col flex-1" aria-label={title}>
      <div className="flex flex-col flex-1 hover:bg-accent/5 transition-colors">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {car.images[0] ? <Image
            src={car.images[0]}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          /> : <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-navy-700 text-gray-500 dark:text-slate-300">Mynd væntanleg</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-navy-900/60 to-transparent" />

          {/* Status badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[car.status]}`}>
            {statusLabels[car.status]}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-xs font-medium text-accent-dark dark:text-accent uppercase tracking-wider">{car.make}</p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                {title}
              </h3>
            </div>
          </div>

          {/* Quick specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 mb-4 text-sm text-gray-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              {car.year}
            </span>
            <span>•</span>
            <span>{car.drivetrain}</span>
            <span>•</span>
            <span>{formatMileage(car.mileage)}</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex flex-col items-start gap-3">
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">{formatPrice(car.price)}</p>
              {vatSubtitle && (
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">{vatSubtitle}</p>
              )}
            </div>
            <span className="self-end text-accent-dark dark:text-accent text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Sjá meira →
            </span>
          </div>
        </div>
      </div>
    </Link>
    {actions && <div className="flex border-t border-black/10 dark:border-white/10">{actions}</div>}
    </article>
  )
}
