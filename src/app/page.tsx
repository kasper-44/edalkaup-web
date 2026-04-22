import HeroVideo from '@/components/HeroVideo'
import CarCard from '@/components/CarCard'
import Link from 'next/link'
import { cars } from '@/data/cars'

export default function Home() {
  const featuredCars = cars.filter((c) => c.featured).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <>
      <HeroVideo />

      {/* Volvo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
        <div className="text-center mb-8">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Volvo</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Pantaðu nýjan Volvo í gegnum okkur</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { href: '/volvo-xc90', name: 'XC90 T8 Recharge', desc: 'Tengiltvinnbíll', price: 'Frá 14.990.000 kr.', delivery: 'Ágúst 2026', image: '/images/xc90/crystal-white.jpg' },
            { href: '/volvo-ex40', name: 'EX40', desc: 'Rafmagnsbíll', price: 'Frá 7.690.000 kr.', delivery: 'Ágúst 2026', image: '/images/ex40/crystal-white.jpg' },
            { href: '/volvo-ex60', name: 'EX60 P12 Long Range', desc: 'Rafmagnsbíll · 800+ km', price: 'Frá 12.390.000 kr.', delivery: 'Apríl 2027', image: '/images/ex60/crystal-white.jpg' },
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

      {/* Featured Cars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Nýjast á lager</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Bílar til sölu</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car, i) => (
            <CarCard key={car.id} car={car} priority={i < 3} />
          ))}
        </div>
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
                { number: '25+', label: 'Ára reynsla' },
                { number: '5000+', label: 'Bílar afhentir' },
                { number: '100%', label: 'Ánægja viðskiptavina' },
                { number: '3-6', label: 'Vikur afgreiðslutími' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 text-center">
                  <p className="text-3xl font-bold text-accent mb-1">{stat.number}</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl border border-accent/20 p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,168,76,0.1),transparent_70%)]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Finndu draumabílinn þinn
            </h2>
            <p className="text-gray-600 dark:text-slate-300 max-w-xl mx-auto mb-8">
              Ertu að leita að ákveðinni bíltegund sem ekki er fáanleg á Íslandi? Við getum fundið hana fyrir þig.
            </p>
            <Link
              href="/hafa-samband"
              className="inline-block px-8 py-4 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-all hover:scale-105"
            >
              Fá ókeypis tilboð
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
