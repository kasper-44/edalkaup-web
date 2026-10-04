import { pageMetadata } from '@/lib/pageSeo'
import { getPublicCars } from '@/lib/publicInventory'
import { INVENTORY_CATEGORIES, normalizeSearch } from '@/lib/inventory'
import HeroVideo from '@/components/HeroVideo'
import FeaturedCars from '@/components/FeaturedCars'
import ContactForm from '@/components/ContactForm'
import CallLink from '@/components/CallLink'
import Link from 'next/link'
import { SHOW_NEW_VOLVO } from '@/lib/features'
import { formatIsk } from '@/lib/formatIsk'

export const dynamic = 'force-dynamic'

export const metadata = pageMetadata('Bílar til sölu og bílainnflutningur', 'Finndu næsta bíl hjá Eðalkaup. Skoðaðu bíla til sölu eða fáðu aðstoð við innflutning frá Bandaríkjunum, Kanada og Evrópu.', '/')

export default async function Home() {
  const cars = await getPublicCars()
  const makes = [...new Set(cars.map((car) => car.make))].sort()
  return (
    <>
      <HeroVideo />

      {SHOW_NEW_VOLVO && (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="text-center mb-8">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Volvo</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Pantaðu nýjan Volvo í gegnum okkur</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/volvo-xc90', name: 'XC90 T8 Ultra', desc: 'Tengiltvinnbíll', price: `Verð: ${formatIsk(15990000)}`, delivery: 'Ágúst 2026', image: '/images/xc90/crystal-white.jpg' },
            { href: '/volvo-ex40', name: 'EX40', desc: 'Rafmagnsbíll', price: `Frá ${formatIsk(7690000)}`, delivery: 'Ágúst 2026', image: '/images/ex40/crystal-white.jpg' },
            { href: '/volvo-ex60', name: 'EX60 P12 Long Range', desc: 'Rafmagnsbíll · 800+ km', price: `Frá ${formatIsk(12390000)}`, delivery: 'Apríl 2027', image: '/images/ex60/crystal-white.jpg' },
          ].map((model) => (
            <Link
              key={model.href}
              href={model.href}
              className="group block relative bg-gradient-to-b from-gray-50 to-white dark:from-navy-800 dark:to-navy-800/60 rounded-2xl border border-accent/20 hover:border-accent/40 overflow-hidden transition-all hover:shadow-xl hover:shadow-accent/5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={model.image} alt={model.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-5">
                <p className="text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-1">Volvo</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{model.name}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{model.desc}</p>
                <p className="text-lg font-bold text-accent mb-1">{model.price}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">Áætluð afhending: {model.delivery}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-10">
        <h2 className="text-xl font-bold mb-4">Hvernig bíl leitarðu að?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{INVENTORY_CATEGORIES.map((category) => <Link key={category.slug} href={`/bilar/flokkur/${category.slug}`} className="rounded-xl border border-black/10 dark:border-white/15 p-5 hover:border-accent transition-colors"><span className="block font-semibold">{category.short} <span aria-hidden="true">↗</span></span><span className="block text-sm text-gray-600 dark:text-slate-300 mt-2">Bílar: {cars.filter(category.matches).length}</span></Link>)}</div>
      </section>
      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-left mb-8">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Nýjast á lager</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Bílar til sölu</h2>
        </div>
        <FeaturedCars />
        <div className="text-center mt-10">
          <Link
            href="/bilar"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold border border-accent/30 text-accent rounded-xl hover:bg-accent/10 transition-colors"
          >
            Sjá alla bíla
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Link>
        </div>
      </section>

      {makes.length > 0 && <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-14"><h2 className="text-xl font-bold mb-4">Leita eftir framleiðanda</h2><nav aria-label="Framleiðendur" className="flex flex-wrap gap-2">{makes.map((make) => <Link key={make} href={`/bilar/framleidandi/${normalizeSearch(make).replace(/\s+/g, '-')}`} className="inventory-chip">{make}</Link>)}</nav></section>}
      {/* About Section */}
      <section className="bg-gray-50 dark:bg-navy-800/50 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Um okkur</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Yfir 25 ára reynsla af bílainnflutningi
              </h2>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-4">
                Eðalkaup er einn stærsti bílainnflytjandi Íslands í yfir 25 ár. Við sérhæfum okkur í innflutningi vandaðra bíla frá Bandaríkjunum, Kanada og Evrópu — ökutæki sem ekki eru fáanleg á íslenskum markaði.
              </p>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-8">
                Við finnum bílinn sem þú leitar að, hvort sem það er Toyota, Lexus, Ford, GMC, Chevrolet eða Jeep. Traust, áreiðanleiki og fagmennska er grunnurinn að þjónustu okkar.
              </p>
              <Link
                href="/um-okkur"
                className="text-accent font-semibold hover:text-accent-light transition-colors"
              >
                Lesa meira um okkur →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { kicker: '25+', label: 'Ára reynsla af innflutningi' },
                { kicker: 'Frá A–Ö', label: 'Leit, kaup og flutningur' },
                { kicker: 'Um allt land', label: 'Við afhendum bíla' },
                { kicker: 'Eftirfylgni', label: 'Við svörum hverri fyrirspurn' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 text-center">
                  <p className={`font-bold text-accent mb-1 ${stat.kicker.length > 4 ? 'text-2xl' : 'text-3xl'}`}>{stat.kicker}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="fyrirspurn" className="scroll-mt-24 bg-gray-50 dark:bg-navy-800/50 border-b border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <p className="text-accent-dark dark:text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-4">Leitum fyrir þig</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Ertu með ákveðinn bíl í huga?</h2>
            <p className="mt-5 text-gray-600 dark:text-slate-300 leading-relaxed max-w-lg">Segðu okkur hvaða bíl þú leitar að. Við skoðum möguleikana í Bandaríkjunum, Kanada og Evrópu og höfum samband við þig.</p>
            <p className="mt-6 text-sm text-gray-600 dark:text-slate-400">Viltu frekar tala við okkur? <CallLink placement="home_cta" className="font-semibold text-gray-900 dark:text-white underline underline-offset-4">699 2011</CallLink></p>
          </div>
          <ContactForm variant="compact" source="forsida" heading="Sendu okkur fyrirspurn" />
        </div>
      </section>

    </>
  )
}
