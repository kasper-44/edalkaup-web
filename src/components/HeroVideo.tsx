import Image from 'next/image'
import Link from 'next/link'
import CallLink from '@/components/CallLink'

/** Static photography keeps the first viewport fast and reliable on mobile. */
export default function HeroVideo() {
  return (
    <section className="dealer-hero pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
        <div className="px-5 sm:px-8 py-12 sm:py-16 lg:py-20 lg:pr-12">
          <p className="dealer-eyebrow mb-6">Eðalkaup · Yfir 25 ára reynsla</p>
          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold tracking-[-.055em] leading-[1.03]">EV pallbílar.<br /><span className="text-accent-dark dark:text-accent">Valdar gerðir.</span></h1>
          <p className="mt-6 text-base sm:text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-md">Við leggjum áherslu á rafmagnspallbíla, Volvo, Ford Explorer, Maxus og Toyota Sequoia. Skoðaðu úrvalið okkar og ræddu við okkur um búnað, verð og framboð.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/bilar" className="dealer-button">Skoða bíla til sölu <span aria-hidden="true">↗</span></Link>
            <Link href="/bilainnflutningur" className="dealer-button dealer-button-outline">Skoða gerðirnar okkar</Link>
          </div>
          <p className="mt-7 text-sm text-gray-600 dark:text-slate-300">Persónuleg aðstoð í síma <CallLink placement="hero" className="font-semibold text-gray-900 dark:text-white underline underline-offset-4">699 2011</CallLink></p>
        </div>
        <div className="relative min-h-72 sm:min-h-96 lg:min-h-full overflow-hidden bg-navy-800">
          <Image src="/images/cars/sierra-ev-002/01.jpg" alt="GMC Sierra EV rafmagnspallbíll — dæmi um gerðir hjá Eðalkaup" fill priority sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 flex justify-between items-end gap-4 text-white">
            <div><p className="text-[10px] uppercase tracking-[.2em] text-white/75 mb-2">Rafmagnspallbílar hjá Eðalkaup</p><p className="text-xl font-semibold">GMC Sierra EV</p></div>
            <Link href="/bilainnflutningur" aria-label="Skoðaðu gerðirnar okkar" className="rounded-full border border-white/50 w-12 h-12 shrink-0 flex items-center justify-center hover:bg-white/20 text-xl">↗</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
