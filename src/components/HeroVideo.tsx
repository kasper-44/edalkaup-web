import Image from 'next/image'
import Link from 'next/link'
import CallLink from '@/components/CallLink'
import type { Car } from '@/data/cars'
import { getCarTitle } from '@/data/cars'
import { formatPrice } from '@/lib/formatIsk'

/**
 * Homepage hero. The stored hero film is a GMC Sierra EV, which is not for sale,
 * so the panel uses the newest live listing instead.
 */
export default function HeroVideo({ car }: { car: Car | null }) {
  const title = car ? getCarTitle(car) : ''
  const image = car?.images[0]
  const inTransit = car?.status === 'in-transit'

  return (
    <section className="dealer-hero pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
        <div className="px-5 sm:px-8 py-12 sm:py-16 lg:py-20 lg:pr-12">
          <p className="dealer-eyebrow mb-6">Eðalkaup · Yfir 25 ára reynsla</p>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-[-.055em] leading-[1.05]">Sérvaldir bílar, fluttir inn fyrir þig.</h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-md">Úrval sem við flytjum inn, með skýrum upplýsingum um hvern bíl.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/bilar" className="dealer-button">Skoða bíla til sölu <span aria-hidden="true">↗</span></Link>
            <Link href="/hafa-samband" className="dealer-button dealer-button-outline">Hafa samband</Link>
          </div>
          <p className="mt-7 text-sm text-gray-600 dark:text-slate-300">Persónuleg aðstoð í síma <CallLink placement="hero" className="font-semibold text-gray-900 dark:text-white underline underline-offset-4">699 2011</CallLink></p>
        </div>
        {image && car && (
          <Link href={`/bilar/${car.slug}`} aria-label={`Skoða ${title}`} className="relative block min-h-80 sm:min-h-[28rem] lg:min-h-full overflow-hidden bg-navy-800">
            <Image src={image} alt="" fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent" />
            {inTransit && (
              <span className="absolute top-5 left-5 rounded-full border border-amber-300 bg-amber-400 px-3 py-1 text-xs font-semibold text-amber-950">Á leiðinni</span>
            )}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 flex justify-between items-end gap-4 text-white">
              <div>
                <p className="text-[10px] uppercase tracking-[.2em] text-white/75 mb-2">Nýjast í úrvalinu</p>
                <p className="text-xl font-semibold leading-snug line-clamp-3">{title}</p>
                <p className="mt-1 text-sm text-white/85">{formatPrice(car.price)}</p>
              </div>
              <span aria-hidden="true" className="rounded-full border border-white/50 w-12 h-12 shrink-0 flex items-center justify-center text-xl">↗</span>
            </div>
          </Link>
        )}
      </div>
    </section>
  )
}
