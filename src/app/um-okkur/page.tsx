import Image from 'next/image'
import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
import CallLink from '@/components/CallLink'
import { pageMetadata } from '@/lib/pageSeo'

export const metadata = pageMetadata('Um Eðalkaup — reynsla af bílainnflutningi', 'Kynntu þér Eðalkaup. Yfir 25 ára reynsla af bílainnflutningi og persónuleg þjónusta við bílakaup.', '/um-okkur')

export default function UmOkkurPage() {
  return <div className="site-offset">
    <section className="dealer-hero"><div className="dealer-container py-16 sm:py-24 grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center"><div><p className="dealer-eyebrow mb-5">Um Eðalkaup</p><h1 className="text-4xl sm:text-6xl font-semibold tracking-[-.05em] leading-[1.08]">Bílaáhugi.<br />Reynsla.<br /><span className="text-accent-dark dark:text-accent">Persónuleg þjónusta.</span></h1><p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed max-w-xl mt-7">Í yfir 25 ár höfum við aðstoðað við innflutning bíla til Íslands. Við leggjum metnað í skýrar upplýsingar og persónulega þjónustu við bílakaup.</p></div><div className="border-l border-black/15 dark:border-white/20 pl-8"><p className="text-8xl font-semibold tracking-tighter text-accent-dark dark:text-accent">25+</p><p className="mt-4 text-gray-600 dark:text-slate-300">ára reynsla af bílainnflutningi</p></div></div></section>
    <section className="dealer-container py-16 sm:py-24">
      <p className="dealer-eyebrow mb-4">Fólkið á bak við bílana</p>
      <h2 className="dealer-heading">Beint samband.<br />Frá fyrsta degi.</h2>
      <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-8 lg:gap-12 items-start">
        <article>
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100">
            <Image src="/images/siggi.jpg" alt="Sigurður Róbertsson, framkvæmdastjóri Eðalkaupa" fill sizes="(max-width: 767px) 100vw, 40vw" className="object-cover object-center" />
          </div>
          <h3 className="font-semibold mt-5">Sigurður Róbertsson</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Framkvæmdastjóri Eðalkaupa</p>
          <p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">Sigurður Róbertsson er framkvæmdastjóri Eðalkaupa. Hafðu samband um auglýsta bíla. Við svörum spurningum um búnað, verð og framboð.</p>
          <CallLink placement="about" className="dealer-button mt-6">Hringja í 699 2011 <ArrowIcon /></CallLink>
        </article>
        <article>
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-100">
            <Image src="/images/ylfa.jpg" alt="Ylfa Sigurðardóttir, stafrænn markaðsstjóri Eðalkaupa" fill sizes="(max-width: 767px) 100vw, 40vw" className="object-cover object-center" />
          </div>
          <h3 className="font-semibold mt-5">Ylfa Sigurðardóttir</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Stafrænn markaðsstjóri</p>
        </article>
      </div>
    </section>
    <section className="dealer-stock"><div className="dealer-container py-16"><p className="dealer-eyebrow mb-4">Þjónustan okkar</p><h2 className="dealer-heading mb-10">Við hjálpum þér að velja.</h2><div className="grid md:grid-cols-3 gap-8">{[
      ['Upplýst val', 'Við förum yfir búnað, ástand og verð á bílnum sem þú hefur áhuga á.'],
      ['Skýr næstu skref', 'Við förum yfir upplýsingar um bílinn, kostnaðarliði og áætlaða afhendingu áður en gengið er frá kaupum.'],
      ['Aðstoð í gegnum ferlið', 'Við förum yfir kaupin og skipuleggjum afhendingu í samráði við þig.'],
    ].map(([title, description], index) => <div key={title} className="border-t border-black/15 dark:border-white/20 pt-6"><p className="dealer-eyebrow mb-4">0{index + 1}</p><h3 className="text-xl font-semibold mb-3">{title}</h3><p className="text-gray-600 dark:text-slate-300 leading-relaxed">{description}</p></div>)}</div><Link href="/bilainnflutningur" className="mt-10 inline-flex items-center gap-1 font-semibold underline underline-offset-4">Kaup og afhending <ArrowIcon direction="right" /></Link></div></section>
    <section className="dealer-container py-16 flex flex-col sm:flex-row justify-between gap-8"><div><h2 className="text-xl font-semibold mb-4">Viðskipti við Eðalkaup</h2><p className="text-gray-600 dark:text-slate-300">Öll viðskipti eru við Úranus ehf., kt. 5010963189.</p></div><Link href="/hafa-samband" className="dealer-button self-start">Hafa samband <ArrowIcon /></Link></section>
  </div>
}
