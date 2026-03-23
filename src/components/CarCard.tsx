import Image from 'next/image'
import Link from 'next/link'
import { Car, formatPrice, formatMileage } from '@/data/cars'

interface CarCardProps {
  car: Car
  priority?: boolean
}

export default function CarCard({ car, priority = false }: CarCardProps) {
  const statusColors = {
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'in-transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sold: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const statusLabels = {
    available: 'Til sölu',
    'in-transit': 'Á leiðinni',
    sold: 'Selt',
  }

  return (
    <Link href={`/bilar/${car.slug}`} className="group block">
      <article className="bg-navy-800 rounded-2xl overflow-hidden border border-white/5 hover:border-accent/20 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/5">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={car.images[0]}
            alt={`${car.year} ${car.make} ${car.model} ${car.trim}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent" />

          {/* Status badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[car.status]}`}>
            {statusLabels[car.status]}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <p className="text-xs font-medium text-accent uppercase tracking-wider">{car.make}</p>
              <h3 className="text-lg font-bold text-white group-hover:text-accent transition-colors">
                {car.year} {car.model} {car.trim}
              </h3>
            </div>
          </div>

          {/* Quick specs */}
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {car.engine}
            </span>
            <span>•</span>
            <span>{car.drivetrain}</span>
            <span>•</span>
            <span>{formatMileage(car.mileage)}</span>
          </div>

          {/* Price */}
          <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-white">{formatPrice(car.price)}</p>
              {car.priceUSD && (
                <p className="text-xs text-slate-500">${car.priceUSD.toLocaleString()} USD</p>
              )}
            </div>
            <span className="text-accent text-sm font-medium group-hover:translate-x-1 transition-transform">
              Sjá meira →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
