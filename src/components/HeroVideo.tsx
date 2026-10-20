import Image from 'next/image'
import Link from 'next/link'
import CallLink from '@/components/CallLink'
import { IconArrowUpRight } from '@/components/Icons'

/** Static photography keeps the first viewport fast and reliable on mobile. */
export default function HeroVideo() {
  return (
    <section className="dealer-hero pt-16 lg:pt-20">
      <div className="dealer-container grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 lg:py-24">
        <div>
          <p className="dealer-eyebrow mb-6">Eðalkaup · Yfir 25 ára reynsla</p>
          <h1 className="dealer-display">Vandaðir bílar, tilbúnir til afhendingar.</h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-[#5c564c] sm:text-lg dark:text-slate-300">Skoðaðu bíla til sölu hjá Eðalkaup. Við hjálpum þér að fara yfir búnað, verð og framboð og svörum spurningum um bílinn sem þú hefur áhuga á.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/bilar" className="dealer-button">Skoða bíla til sölu <IconArrowUpRight /></Link>
            <Link href="/hafa-samband" className="dealer-button dealer-button-outline">Hafa samband</Link>
          </div>
          <p className="mt-8 text-sm text-[#5c564c] dark:text-slate-300">Persónuleg aðstoð í síma <CallLink placement="hero" className="font-semibold text-navy-900 underline decoration-accent/70 underline-offset-4 dark:text-white">699 2011</CallLink></p>
        </div>
        <div className="relative min-h-80 overflow-hidden bg-navy-900 sm:min-h-[28rem] lg:min-h-[36rem]">
          <Image src="/images/cars/sierra-ev-002/01.jpg" alt="GMC Sierra EV — bílamynd frá Eðalkaup" fill priority sizes="(max-width: 1023px) 100vw, 54vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/75 via-navy-900/5 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 text-white sm:inset-x-8 sm:bottom-8">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[.22em] text-white/80">Kynntu þér bílana</p>
              <p className="text-2xl">GMC Sierra EV</p>
            </div>
            <Link href="/bilar" aria-label="Skoða bíla til sölu" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/60 transition-colors hover:bg-white/15">
              <IconArrowUpRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
