import Image from 'next/image'
import Link from 'next/link'
import { pageMetadata } from '@/lib/pageSeo'
import { getPublicCars } from '@/lib/publicInventory'
import { INVENTORY_CATEGORIES, normalizeSearch } from '@/lib/inventory'
import HeroVideo from '@/components/HeroVideo'
import FeaturedCars from '@/components/FeaturedCars'
import ContactForm from '@/components/ContactForm'
import CallLink from '@/components/CallLink'
import { IconArrowRight, IconArrowUpRight, IconCheck } from '@/components/Icons'
import { SHOW_NEW_VOLVO } from '@/lib/features'
import { formatIsk } from '@/lib/formatIsk'

export const dynamic = 'force-dynamic'
export const metadata = pageMetadata('Bílar til sölu', 'Skoðaðu bíla til sölu hjá Eðalkaup. Verð, myndir og upplýsingar um búnað. Yfir 25 ára reynsla og persónuleg þjónusta.', '/')

export default async function Home() {
  const cars = await getPublicCars()
  const makes = [...new Set(cars.map((car) => car.make))].sort()
  return <>
    <HeroVideo />
    <div className="border-y border-black/10 dark:border-white/10">
      <div className="dealer-container grid grid-cols-1 gap-x-8 gap-y-4 py-8 text-sm sm:grid-cols-2 sm:py-10 lg:grid-cols-4">
        {['Yfir 25 ára reynsla', 'Skýrar upplýsingar um bílana', 'Bandaríkin · Kanada · Evrópa', 'Persónuleg þjónusta'].map((text) => <p key={text} className="flex items-start gap-3"><IconCheck className="mt-0.5 text-accent-dark dark:text-accent" /><span className="min-w-0">{text}</span></p>)}
      </div>
    </div>
    <section className="dealer-container py-14 sm:py-20" aria-labelledby="search-heading">
      <div className="mb-7 flex items-baseline justify-between gap-4"><h2 id="search-heading" className="text-3xl sm:text-4xl">Finndu bíl sem hentar þér</h2><span className="text-sm text-[#5c564c] dark:text-slate-300">{cars.length} bílar til sölu</span></div>
      <form action="/bilar" method="get" className="dealer-search grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <div><label htmlFor="home-query" className="mb-2 block text-xs font-semibold tracking-wide uppercase">Gerð eða árgerð</label><input id="home-query" name="q" type="search" maxLength={100} placeholder="T.d. Ford Explorer" className="dealer-input" /></div>
        <div><label htmlFor="home-make" className="mb-2 block text-xs font-semibold tracking-wide uppercase">Framleiðandi</label><select id="home-make" name="make" className="dealer-input"><option value="">Allir framleiðendur</option>{makes.map((make) => <option key={make}>{make}</option>)}</select></div>
        <button type="submit" className="dealer-button sm:self-end">Leita að bíl <IconArrowRight /></button>
      </form>
      <nav aria-label="Skoða eftir bílaflokki" className="mt-6 flex flex-wrap gap-2">{INVENTORY_CATEGORIES.filter((category) => category.slug !== 'rafmagnspallbilar').map((category) => <Link key={category.slug} href={`/bilar/flokkur/${category.slug}`} className="inventory-chip">{category.short}</Link>)}</nav>
    </section>
    {SHOW_NEW_VOLVO && <section className="dealer-container py-8"><p className="dealer-eyebrow mb-3">Volvo</p><h2 className="dealer-heading mb-8">Pantaðu nýjan Volvo í gegnum okkur</h2><div className="grid md:grid-cols-3 gap-6">{[
      { href: '/volvo-xc90', name: 'XC90 T8 Ultra', price: formatIsk(15990000), image: '/images/xc90/crystal-white.jpg' },
      { href: '/volvo-ex40', name: 'EX40', price: `Frá ${formatIsk(7690000)}`, image: '/images/ex40/crystal-white.jpg' },
      { href: '/volvo-ex60', name: 'EX60 P12 Long Range', price: `Frá ${formatIsk(12390000)}`, image: '/images/ex60/crystal-white.jpg' },
    ].map((model) => <Link href={model.href} key={model.href} className="dealer-card overflow-hidden"><div className="relative aspect-[16/10]"><Image src={model.image} alt={`Volvo ${model.name}`} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover" /></div><div className="p-5"><h3 className="text-2xl">{model.name}</h3><p className="dealer-price mt-3 text-2xl">{model.price}</p></div></Link>)}</div></section>}
    <section className="dealer-stock py-16 sm:py-24">
      <div className="dealer-container"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p className="dealer-eyebrow mb-3">Úrvalið okkar</p><h2 className="dealer-heading">Bílar til sölu</h2></div><Link href="/bilar" className="inline-flex items-center gap-2 text-sm font-semibold underline decoration-accent/70 underline-offset-4">Sjá alla bíla <IconArrowUpRight /></Link></div><FeaturedCars />
      {makes.length > 0 && <nav aria-label="Leita eftir framleiðanda" className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-black/10 pt-8 dark:border-white/10"><span className="text-xs tracking-[0.18em] text-[#5c564c] uppercase dark:text-slate-400">Framleiðendur</span>{makes.map((make) => <Link key={make} href={`/bilar/framleidandi/${normalizeSearch(make).replace(/\s+/g, '-')}`} className="font-semibold transition-colors hover:text-accent-dark dark:hover:text-accent">{make}</Link>)}</nav>}
      </div>
    </section>
    <section className="dealer-container grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy-900"><Image src="/images/cars/sierra-ev-002/01.jpg" alt="GMC Sierra EV — dæmi um bílainnflutning Eðalkaupa" fill sizes="(max-width: 1023px) 100vw, 50vw" className="object-cover" /><span className="absolute bottom-5 left-5 bg-white px-4 py-3 text-xs font-semibold tracking-wide text-navy-900">Bandaríkin · Kanada · Evrópa</span></div>
      <div><p className="dealer-eyebrow mb-4">Kaup hjá Eðalkaup</p><h2 className="dealer-heading">Frá fyrsta samtali.<br />Til afhendingar.</h2><p className="mt-6 max-w-xl leading-relaxed text-[#5c564c] dark:text-slate-300">Kynntu þér bílana sem eru auglýstir hjá okkur. Við förum yfir upplýsingar um bílinn, kaup og afhendingu og hjálpum þér að taka upplýsta ákvörðun.</p><ol className="mt-8 space-y-6">{[
        ['Veldu úr úrvalinu', 'Skoðaðu myndir, verð og upplýsingar í auglýsingunum.'],
        ['Fáðu upplýsingar', 'Við förum yfir búnað, verð og framboð á þeim bíl sem þú hefur áhuga á.'],
        ['Kaup og afhending', 'Við ræðum næstu skref og staðfestum áætlaða afhendingu.'],
      ].map(([title, description], i) => <li key={title} className="flex gap-4"><span className="pt-1 text-sm font-semibold tracking-wide text-accent-dark dark:text-accent">0{i+1}</span><div><h3 className="text-2xl">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[#5c564c] dark:text-slate-400">{description}</p></div></li>)}</ol><Link href="/bilainnflutningur" className="dealer-button mt-9">Kaup og afhending <IconArrowUpRight /></Link></div>
    </section>
    <section className="bg-navy-900 text-white"><div className="dealer-container grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-[1.5fr_1fr]"><div><p className="dealer-eyebrow mb-4 !text-accent">Eðalkaup</p><h2 className="dealer-heading">Reynsla sem skiptir máli.</h2><p className="mt-6 max-w-xl leading-relaxed text-slate-300">Við höfum flutt inn bíla í yfir 25 ár. Hjá okkur færðu beint samband við fólkið sem þekkir bílana og fylgir kaupunum eftir.</p><Link href="/um-okkur" className="mt-8 inline-flex items-center gap-2 font-semibold text-accent underline decoration-accent/50 underline-offset-4">Kynnstu okkur <IconArrowRight /></Link></div><div className="flex items-center gap-6 border-l border-white/20 pl-6 sm:pl-10"><span className="text-6xl tracking-tighter text-accent sm:text-8xl">25+</span><p className="text-sm leading-relaxed text-slate-300">ára reynsla af<br />bílainnflutningi</p></div></div></section>
    <section id="fyrirspurn" className="scroll-mt-24 border-t border-black/10 dark:border-white/10"><div className="dealer-container grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-20"><div><p className="dealer-eyebrow mb-4">Tökum næsta skref</p><h2 className="dealer-heading">Spurning um<br />bíl hjá okkur?</h2><p className="mt-6 max-w-md leading-relaxed text-[#5c564c] dark:text-slate-300">Hafðu samband um bíl sem þú hefur séð hjá okkur. Við svörum spurningum um búnað, verð, framboð og skoðun.</p><CallLink placement="home_cta" className="mt-8 inline-block text-3xl underline decoration-accent underline-offset-8">699 2011</CallLink><p className="mt-3 text-sm text-[#5c564c] dark:text-slate-400">Mán–Fös 09:00–17:00</p></div><ContactForm variant="compact" source="forsida" heading="Sendu okkur fyrirspurn" /></div></section>
  </>
}
