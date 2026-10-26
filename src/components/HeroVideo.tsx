import Image from 'next/image'
import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
import CallLink from '@/components/CallLink'
import LiveDot from '@/components/LiveDot'

const HERO_FACTS = [
  'Yfir 25 ára reynsla',
  'Skýrar upplýsingar um bílana',
  'Bandaríkin · Kanada · Evrópa',
  'Persónuleg þjónusta',
] as const

/** Homepage hero. Copy is the existing headline, intro, trust lines, hours and address. */
export default function HeroVideo({ carCount, heroCar }: { carCount: number | null; heroCar?: { image: string; title: string } }) {
  const countLabel = carCount == null ? 'Bílar til sölu' : `${carCount} bílar til sölu`

  return (
    <section className="dealer-hero site-offset">
      <div className="dealer-container grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14 lg:py-20">
        <div>
          <p className="mb-6 inline-flex -rotate-2 items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-navy-900 shadow-[0_8px_20px_rgba(10,15,28,0.08)] dark:bg-navy-800 dark:text-white">
            <LiveDot />
            {countLabel}
          </p>
          <h1 className="display-headline display-headline-xl text-gray-900 dark:text-white">
            Bílar
            <br />
            til sölu
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg dark:text-slate-300">
            Skoðaðu bíla til sölu hjá Eðalkaup. Við hjálpum þér að fara yfir búnað, verð og framboð og svörum spurningum um bílinn sem þú hefur áhuga á.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {HERO_FACTS.map((text) => (
              <div key={text} className="rounded-2xl bg-white px-4 py-4 shadow-[0_8px_24px_rgba(10,15,28,0.06)] dark:bg-navy-800 dark:shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
                <p className="text-sm font-black leading-snug tracking-tight text-gray-900 sm:text-base dark:text-white">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm font-bold text-accent-dark sm:text-base dark:text-accent">
            Mán–Fös 09:00–17:00
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/bilar" className="dealer-button">Skoða bíla til sölu <ArrowIcon /></Link>
            <Link href="/hafa-samband" className="dealer-button dealer-button-outline">Hafa samband</Link>
          </div>
          <p className="mt-6 text-sm text-gray-600 dark:text-slate-300">
            Persónuleg aðstoð í síma{' '}
            <CallLink placement="hero" className="font-black text-gray-900 underline underline-offset-4 dark:text-white">
              699 2011
            </CallLink>
          </p>
        </div>

        <div className="relative pt-4">
          <CallLink
            placement="hero"
            className="absolute top-0 right-6 z-10 inline-flex rotate-[8deg] items-center rounded-full bg-accent px-3.5 py-1.5 text-xs font-black uppercase tracking-wide text-navy-900 shadow-[0_10px_24px_rgba(10,15,28,0.2)]"
          >
            699 2011
          </CallLink>
          <div className="overflow-hidden rounded-[1.75rem] bg-navy-900 p-3 text-white shadow-[0_22px_50px_rgba(10,15,28,0.22)] sm:p-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-navy-800">
              {heroCar ? <Image
                src={heroCar.image}
                alt={heroCar.title}
                fill
                priority
                sizes="(max-width: 1023px) 100vw, 46vw"
                className="object-cover"
              /> : <div className="flex h-full items-center justify-center px-8 text-center text-3xl font-black">Skoðaðu úrvalið okkar</div>}
            </div>
            <div className="flex items-end justify-between gap-4 px-2 pt-4 pb-1">
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Kynntu þér bílana</p>
                <p className="text-2xl font-black tracking-tight">{heroCar?.title ?? "Bílar til sölu"}</p>
              </div>
              <Link href="/bilar" aria-label="Skoða bíla til sölu" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/10">
                <ArrowIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
