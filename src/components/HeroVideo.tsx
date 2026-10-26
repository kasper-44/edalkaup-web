import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
import CallLink from '@/components/CallLink'

/** Clean, text-led homepage hero with no placeholder vehicle image. */
export default function HeroVideo({ carCount }: { carCount: number | null }) {
  return (
    <section className="dealer-hero site-offset">
      <div className="dealer-container py-14 sm:py-20 lg:py-24">
        <div className="max-w-4xl">
          <p className="dealer-eyebrow mb-5">Eðalkaup · Yfir 25 ára reynsla</p>
          <h1 className="display-headline display-headline-xl text-gray-900 dark:text-white">
            Bílar til sölu
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-slate-300">
            Skoðaðu bíla til sölu hjá Eðalkaup. Upplýsingar um búnað, verð og framboð á einum stað.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/bilar" className="dealer-button">Skoða bíla til sölu <ArrowIcon /></Link>
            <Link href="/hafa-samband" className="dealer-button dealer-button-outline">Hafa samband</Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-black/10 pt-6 text-sm text-gray-600 dark:border-white/10 dark:text-slate-300">
            <span>{carCount == null ? 'Skoða úrvalið' : `${carCount} bílar til sölu`}</span>
            <span>Mán–Fös 09:00–17:00</span>
            <CallLink placement="hero" className="font-semibold text-gray-900 underline underline-offset-4 dark:text-white">699 2011</CallLink>
          </div>
        </div>
      </div>
    </section>
  )
}
