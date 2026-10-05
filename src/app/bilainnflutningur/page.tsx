import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { pageMetadata } from '@/lib/pageSeo'
import { DEALER_RANGE } from '@/lib/dealerRange'

export const metadata = pageMetadata('EV pallbílar og gerðirnar okkar', 'Eðalkaup leggur áherslu á EV pallbíla, Volvo, Ford Explorer, Maxus og Toyota Sequoia. Kynntu þér úrvalið og hafðu samband um framboð, búnað og verð.', '/bilainnflutningur')
const steps = [
  ['Skoðaðu gerðirnar okkar', 'Veldu úr auglýstum bílum eða kynntu þér gerðirnar sem við bjóðum: EV pallbíla, Volvo, Ford Explorer, Maxus og Toyota Sequoia.'],
  ['Búnaður og framboð', 'Við svörum spurningum um útfærslur, verð og framboð innan þessa úrvals. Upplýsingar um hvern auglýstan bíl eru á síðu hans.'],
  ['Tilboð og næstu skref', 'Við förum yfir verð, greiðslufyrirkomulag og áætlaðan afhendingartíma áður en gengið er frá kaupum.'],
  ['Afhending', 'Við staðfestum staðsetningu bílsins og skipuleggjum afhendingu í samráði við þig.'],
]
const questions = [
  ['Hvaða bíla býður Eðalkaup?', 'Áherslan okkar er á EV pallbíla. Við bjóðum einnig Volvo, Ford Explorer, Maxus og Toyota Sequoia. Fyrirspurnir okkar snúast um þetta úrval og bíla sem við auglýsum.'],
  ['Get ég spurt um gerð sem er ekki á lager?', 'Hafðu samband um framboð á EV pallbílum, Volvo, Ford Explorer, Maxus eða Toyota Sequoia. Við staðfestum hvað er í boði og hvaða útfærslur eru fáanlegar hjá okkur.'],
  ['Eru allir auglýstir bílar á Íslandi?', 'Ekki endilega. Hafðu samband til að staðfesta staðsetningu, framboð og hvenær hægt er að skoða eða fá tiltekinn bíl afhentan.'],
  ['Hvað þarf að skoða við val á EV pallbíl?', 'Skoðaðu rafhlöðu, drægni, hleðslu, dráttargetu og búnað í auglýsingunni. Þessar upplýsingar eru mismunandi eftir gerð og útfærslu. Hafðu samband til að fara yfir tiltekinn bíl.'],
  ['Er verð með virðisaukaskatti?', 'Athugaðu merkingu við verð hvers bíls. „m/VSK“ merkir að VSK er innifalinn og „+ VSK“ að hann bætist við. Hafðu samband ef þú þarft nánari upplýsingar um verð.'],
]
export default function ImportPage() {
  return <div className="pt-16 lg:pt-20 dealer-import"><section className="dealer-container py-12 sm:py-16">
    <p className="dealer-eyebrow mb-4">Sérhæfing Eðalkaupa</p>
    <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-.05em] leading-[1.08] max-w-4xl">EV pallbílar.<br /><span className="text-accent-dark dark:text-accent">Og valdar gerðir.</span></h1>
    <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mt-6 leading-relaxed">Við leggjum áherslu á rafmagnspallbíla og afmarkað úrval bíla sem við þekkjum: Volvo, Ford Explorer, Maxus og Toyota Sequoia.</p>
    <div className="flex flex-wrap gap-3 mt-7"><Link href="/bilar" className="dealer-button">Skoða bíla til sölu ↗</Link><Link href="#fyrirspurn" className="dealer-button dealer-button-outline">Spyrja um framboð</Link></div>
    <div className="grid md:grid-cols-2 gap-5 mt-14">{DEALER_RANGE.map((range, index) => <section id={range.label === 'Volvo' ? 'volvo' : undefined} key={range.label} className={`scroll-mt-28 p-6 sm:p-8 rounded-xl border border-black/10 dark:border-white/10 ${index === 0 ? 'bg-navy-900 text-white md:col-span-2' : 'bg-white dark:bg-navy-800'}`}><p className={`text-xs uppercase tracking-widest mb-4 ${index === 0 ? 'text-accent' : 'text-accent-dark dark:text-accent'}`}>{index === 0 ? 'Í aðalhlutverki' : 'Í úrvalinu okkar'}</p><h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{range.label}</h2><p className={`mt-4 leading-relaxed max-w-2xl ${index === 0 ? 'text-slate-300' : 'text-gray-600 dark:text-slate-300'}`}>{range.description}</p><Link href={range.label === 'Volvo' ? '#fyrirspurn' : range.href} className={`inline-block mt-6 font-semibold underline underline-offset-4 ${index === 0 ? 'text-accent' : ''}`}>{range.label === 'Volvo' ? 'Spyrja um Volvo' : `Skoða ${range.label}`} →</Link></section>)}</div>
    <h2 className="dealer-heading mt-16 mb-7">Frá fyrirspurn til afhendingar</h2>
    <ol className="grid md:grid-cols-2 gap-5">{steps.map(([title, description], index) => <li key={title} className="p-6 sm:p-8 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-navy-800"><p className="dealer-eyebrow mb-4">0{index + 1}</p><h3 className="font-semibold text-xl mb-3">{title}</h3><p className="text-gray-600 dark:text-slate-300 leading-relaxed">{description}</p></li>)}</ol>
    <section className="mt-16 max-w-3xl"><h2 className="dealer-heading mb-6">Algengar spurningar</h2>{questions.map(([question, answer]) => <details key={question} className="border-b border-black/10 dark:border-white/10 py-5"><summary className="font-semibold cursor-pointer">{question}</summary><p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">{answer}</p></details>)}</section>
    <div id="fyrirspurn" className="scroll-mt-24 mt-16 grid lg:grid-cols-2 gap-10 items-start"><div><h2 className="dealer-heading mb-4">Spyrðu um gerðirnar okkar</h2><p className="text-gray-600 dark:text-slate-300 leading-relaxed">EV pallbílar, Volvo, Ford Explorer, Maxus og Toyota Sequoia. Hafðu samband um búnað, verð og framboð.</p><p className="mt-5"><a href="tel:+3546992011" className="font-semibold underline underline-offset-4">Hringdu í 699 2011</a></p></div><ContactForm variant="compact" source="innflutningur" heading="Fyrirspurn um framboð" /></div>
  </section></div>
}
