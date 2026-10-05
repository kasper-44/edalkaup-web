import Image from 'next/image'
import Link from 'next/link'
import { pageMetadata } from '@/lib/pageSeo'
import { getPublicCars } from '@/lib/publicInventory'
import { INVENTORY_CATEGORIES, normalizeSearch } from '@/lib/inventory'
import HeroVideo from '@/components/HeroVideo'
import FeaturedCars from '@/components/FeaturedCars'
import ContactForm from '@/components/ContactForm'
import CallLink from '@/components/CallLink'
import { SHOW_NEW_VOLVO } from '@/lib/features'
import { formatIsk } from '@/lib/formatIsk'

export const dynamic = 'force-dynamic'
export const metadata = pageMetadata('Bílar til sölu', 'Skoðaðu bíla til sölu hjá Eðalkaup. Verð, myndir og upplýsingar um búnað. Yfir 25 ára reynsla og persónuleg þjónusta.', '/')

export default async function Home() {
  const cars = await getPublicCars()
  const makes = [...new Set(cars.map((car) => car.make))].sort()
  return <>
    <HeroVideo />
    <div className="border-b border-black/10 dark:border-white/10">
      <div className="dealer-container grid grid-cols-2 lg:grid-cols-4 gap-5 py-6 text-sm">
        {['Yfir 25 ára reynsla', 'Skýrar upplýsingar um bílana', 'Bandaríkin · Kanada · Evrópa', 'Persónuleg þjónusta'].map((text) => <p key={text} className="flex gap-3 items-center"><span className="text-accent-dark dark:text-accent" aria-hidden="true">✓</span>{text}</p>)}
      </div>
    </div>
    <section className="dealer-container py-10 sm:py-12" aria-labelledby="search-heading">
      <div className="flex justify-between items-baseline gap-4 mb-5"><h2 id="search-heading" className="text-xl font-semibold tracking-tight">Finndu bíl sem hentar þér</h2><span className="text-sm text-gray-500 dark:text-slate-400">{cars.length} bílar til sölu</span></div>
      <form action="/bilar" method="get" className="dealer-search grid sm:grid-cols-[1fr_1fr_auto] gap-4">
        <div><label htmlFor="home-query" className="block text-xs font-semibold mb-2">Gerð eða árgerð</label><input id="home-query" name="q" type="search" maxLength={100} placeholder="T.d. Ford Explorer" className="dealer-input" /></div>
        <div><label htmlFor="home-make" className="block text-xs font-semibold mb-2">Framleiðandi</label><select id="home-make" name="make" className="dealer-input"><option value="">Allir framleiðendur</option>{makes.map((make) => <option key={make}>{make}</option>)}</select></div>
        <button type="submit" className="dealer-button sm:self-end">Leita að bíl <span aria-hidden="true">→</span></button>
      </form>
      <nav aria-label="Skoða eftir bílaflokki" className="flex flex-wrap gap-2 mt-5">{INVENTORY_CATEGORIES.filter((category) => category.slug !== 'rafmagnspallbilar').map((category) => <Link key={category.slug} href={`/bilar/flokkur/${category.slug}`} className="inventory-chip">{category.short}</Link>)}</nav>
    </section>
    {SHOW_NEW_VOLVO && <section className="dealer-container py-8"><p className="dealer-eyebrow mb-3">Volvo</p><h2 className="dealer-heading mb-8">Pantaðu nýjan Volvo í gegnum okkur</h2><div className="grid md:grid-cols-3 gap-6">{[
      { href: '/volvo-xc90', name: 'XC90 T8 Ultra', price: formatIsk(15990000), image: '/images/xc90/crystal-white.jpg' },
      { href: '/volvo-ex40', name: 'EX40', price: `Frá ${formatIsk(7690000)}`, image: '/images/ex40/crystal-white.jpg' },
      { href: '/volvo-ex60', name: 'EX60 P12 Long Range', price: `Frá ${formatIsk(12390000)}`, image: '/images/ex60/crystal-white.jpg' },
    ].map((model) => <Link href={model.href} key={model.href} className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden"><div className="relative aspect-[16/10]"><Image src={model.image} alt={`Volvo ${model.name}`} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div><div className="p-5"><h3 className="text-xl font-semibold">{model.name}</h3><p className="mt-2">{model.price}</p></div></Link>)}</div></section>}
    <section className="dealer-stock py-12 sm:py-16">
      <div className="dealer-container"><div className="flex flex-wrap items-end justify-between gap-5 mb-8"><div><p className="dealer-eyebrow mb-3">Úrvalið okkar</p><h2 className="dealer-heading">Bílar til sölu</h2></div><Link href="/bilar" className="font-semibold text-sm underline underline-offset-4">Sjá alla bíla <span aria-hidden="true">↗</span></Link></div><FeaturedCars />
      {makes.length > 0 && <nav aria-label="Leita eftir framleiðanda" className="mt-10 pt-8 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center gap-x-7 gap-y-4"><span className="text-xs uppercase tracking-widest text-gray-500 dark:text-slate-400">Framleiðendur</span>{makes.map((make) => <Link key={make} href={`/bilar/framleidandi/${normalizeSearch(make).replace(/\s+/g, '-')}`} className="font-semibold hover:text-accent-dark dark:hover:text-accent">{make}</Link>)}</nav>}
      </div>
    </section>
    <section className="dealer-container py-16 sm:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src="/images/cars/sierra-ev-002/01.jpg" alt="GMC Sierra EV — dæmi um bílainnflutning Eðalkaupa" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /><span className="absolute bottom-5 left-5 bg-white text-navy-900 rounded-lg px-4 py-3 text-xs font-semibold">Bandaríkin · Kanada · Evrópa</span></div>
      <div><p className="dealer-eyebrow mb-4">Kaup hjá Eðalkaup</p><h2 className="dealer-heading">Frá fyrsta samtali.<br />Til afhendingar.</h2><p className="mt-5 text-gray-600 dark:text-slate-300 leading-relaxed">Kynntu þér bílana sem eru auglýstir hjá okkur. Við förum yfir upplýsingar um bílinn, kaup og afhendingu og hjálpum þér að taka upplýsta ákvörðun.</p><ol className="mt-7 space-y-5">{[
        ['Veldu úr úrvalinu', 'Skoðaðu myndir, verð og upplýsingar í auglýsingunum.'],
        ['Fáðu upplýsingar', 'Við förum yfir búnað, verð og framboð á þeim bíl sem þú hefur áhuga á.'],
        ['Kaup og afhending', 'Við ræðum næstu skref og staðfestum áætlaða afhendingu.'],
      ].map(([title, description], i) => <li key={title} className="flex gap-4"><span className="text-accent-dark dark:text-accent text-sm font-semibold pt-1">0{i+1}</span><div><h3 className="font-semibold">{title}</h3><p className="text-sm text-gray-600 dark:text-slate-400 mt-1 leading-relaxed">{description}</p></div></li>)}</ol><Link href="/bilainnflutningur" className="dealer-button mt-8">Kaup og afhending <span aria-hidden="true">↗</span></Link></div>
    </section>
    <section className="bg-navy-900 text-white"><div className="dealer-container py-14 sm:py-20 grid lg:grid-cols-[1.5fr_1fr] gap-10 items-center"><div><p className="dealer-eyebrow !text-accent mb-4">Eðalkaup</p><h2 className="dealer-heading">Reynsla sem skiptir máli.</h2><p className="text-slate-300 max-w-xl mt-5 leading-relaxed">Við höfum flutt inn bíla í yfir 25 ár. Hjá okkur færðu beint samband við fólkið sem þekkir bílana og fylgir kaupunum eftir.</p><Link href="/um-okkur" className="inline-block mt-7 text-accent font-semibold underline underline-offset-4">Kynnstu okkur →</Link></div><div className="flex items-center gap-6 border-l border-white/20 pl-6 sm:pl-10"><span className="text-6xl sm:text-8xl font-semibold tracking-tighter text-accent">25+</span><p className="text-sm text-slate-300 leading-relaxed">ára reynsla af<br />bílainnflutningi</p></div></div></section>
    <section id="fyrirspurn" className="dealer-hero scroll-mt-24"><div className="dealer-container py-16 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"><div><p className="dealer-eyebrow mb-4">Tökum næsta skref</p><h2 className="dealer-heading">Spurning um<br />bíl hjá okkur?</h2><p className="mt-5 text-gray-600 dark:text-slate-300 leading-relaxed max-w-md">Hafðu samband um bíl sem þú hefur séð hjá okkur. Við svörum spurningum um búnað, verð, framboð og skoðun.</p><CallLink placement="home_cta" className="inline-block text-2xl font-semibold mt-7 underline underline-offset-8">699 2011</CallLink><p className="text-sm text-gray-500 dark:text-slate-400 mt-3">Mán–Fös 09:00–17:00</p></div><ContactForm variant="compact" source="forsida" heading="Sendu okkur fyrirspurn" /></div></section>
  </>
}
