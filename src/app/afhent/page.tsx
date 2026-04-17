import { Metadata } from 'next'
import Image from 'next/image'
import { deliveredCars, getCarTitle, formatPrice, formatMileage } from '@/data/cars'

export const metadata: Metadata = {
  title: 'Afhentir bílar',
  description: 'Bílar sem Eðalkaup hefur flutt inn og afhent viðskiptavinum á Íslandi. Yfir 500 bílar afhentir.',
}

export default function AfhentPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Afrekaskrá</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Afhentir bílar</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Hér má sjá úrval af bílum sem við höfum flutt inn og afhent ánægðum viðskiptavinum á Íslandi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deliveredCars.map((car) => (
            <article key={car.id} className="bg-white dark:bg-navy-800 rounded-2xl overflow-hidden border border-black/5 dark:border-white/5">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={car.images[0]}
                  alt={getCarTitle(car)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-navy-900/60 to-transparent" />
                <div className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  Afhent ✓
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs font-medium text-accent uppercase tracking-wider">{car.make}</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{getCarTitle(car)}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-slate-400">
                  <span>{car.engine}</span>
                  <span>•</span>
                  <span>{car.drivetrain}</span>
                  <span>•</span>
                  <span>{formatMileage(car.mileage)}</span>
                </div>
                <p className="mt-3 text-lg font-bold text-gray-400 dark:text-white/60 line-through">{formatPrice(car.price)}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center bg-gray-50 dark:bg-navy-800/50 rounded-3xl border border-black/5 dark:border-white/5 p-10 sm:p-16">
          <p className="text-5xl font-bold text-accent mb-4">500+</p>
          <p className="text-xl text-gray-900 dark:text-white font-semibold mb-2">Bílar afhentir til viðskiptavina</p>
          <p className="text-gray-500 dark:text-slate-400 max-w-lg mx-auto">
            Við höfum yfir 25 ára reynslu af bílainnflutningi og höfum afhent hundruð bíla til ánægðra viðskiptavina um allt land.
          </p>
        </div>
      </div>
    </div>
  )
}
