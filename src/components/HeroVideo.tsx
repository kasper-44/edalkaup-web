import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
import CallLink from '@/components/CallLink'

/** Editorial homepage hero; no unavailable vehicles or decorative placeholder images. */
export default function HeroVideo({ carCount }: { carCount: number | null }) {
  return (
    <section className="dealer-hero site-offset relative overflow-hidden">
      <div className="pointer-events-none absolute right-[-10%] top-[-30%] h-[40rem] w-[40rem] rounded-full border border-black/[0.035] dark:border-white/[0.035]" aria-hidden="true" />
      <div className="dealer-container relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-5xl">
          <p className="dealer-eyebrow mb-7">Eðalkaup / Bílasala á Íslandi</p>
          <h1 className="display-headline text-[clamp(3.6rem,9vw,8.5rem)] leading-[0.88] tracking-[-0.065em] text-gray-900 dark:text-white">
            Næsti bíll<br /><span className="text-accent-dark dark:text-accent">bíður þín.</span>
          </h1>
          <p className="mt-9 max-w-xl text-lg leading-relaxed text-gray-600 sm:text-xl dark:text-slate-300">
            Vandað úrval bíla til sölu. Skoðaðu myndir, búnað og verð — og hafðu beint samband um bílinn sem vekur áhuga.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/bilar" className="dealer-button">Skoða bíla <ArrowIcon /></Link>
            <Link href="/hafa-samband" className="dealer-button dealer-button-outline">Hafa samband</Link>
          </div>
          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-black/10 pt-5 text-sm text-gray-600 dark:border-white/10 dark:text-slate-300">
            <span><strong className="text-gray-900 dark:text-white">{carCount ?? '—'}</strong> bílar til sölu</span>
            <span>Yfir 25 ára reynsla</span>
            <CallLink placement="hero" className="font-semibold text-gray-900 underline underline-offset-4 dark:text-white">699 2011</CallLink>
          </div>
        </div>
      </div>
    </section>
  )
}
