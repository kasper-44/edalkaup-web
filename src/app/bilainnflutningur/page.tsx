import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { pageMetadata } from '@/lib/pageSeo'

export const metadata = pageMetadata('Kaup og afhending', 'Kynntu þér bílakaup hjá Eðalkaup. Upplýsingar um auglýsta bíla, búnað, verð, skoðun og afhendingu.', '/bilainnflutningur')
const steps = [
  ['Skoðaðu bíla til sölu', 'Kynntu þér myndir, verð og búnað í auglýsingunum. Framboðið breytist eftir því sem bílar bætast við og seljast.'],
  ['Fáðu nánari upplýsingar', 'Hafðu samband um bílinn sem þú hefur áhuga á. Við förum yfir búnað, ástand, verð og hvort hægt sé að bóka skoðun.'],
  ['Tilboð og næstu skref', 'Við förum yfir verð, greiðslufyrirkomulag og áætlaðan afhendingartíma áður en gengið er frá kaupum.'],
  ['Afhending', 'Við staðfestum staðsetningu bílsins og skipuleggjum afhendingu í samráði við þig.'],
]
const questions = [
  ['Hvar sé ég bíla sem eru til sölu?', 'Allar núverandi auglýsingar eru undir „Bílar til sölu“. Þar má skoða myndir og upplýsingar og sía eftir verði, árgerð og öðrum eiginleikum. Hafðu samband til að staðfesta framboð.'],
  ['Hvernig bóka ég skoðun?', 'Hringdu í 699 2011 eða sendu fyrirspurn úr auglýsingu bílsins. Við staðfestum staðsetningu og finnum tíma til að skoða bílinn.'],
  ['Eru allir auglýstir bílar á Íslandi?', 'Ekki endilega. Hafðu samband til að staðfesta staðsetningu, framboð og hvenær hægt er að skoða eða fá tiltekinn bíl afhentan.'],
  ['Hvað þarf að skoða áður en ég kaupi?', 'Farðu yfir búnað, ástand, akstur og viðhaldssögu. Fyrir rafmagnsbíla skiptir einnig máli að skoða rafhlöðu, drægni og hleðslu. Við svörum spurningum um tiltekinn auglýstan bíl.'],
  ['Er verð með virðisaukaskatti?', 'Athugaðu merkingu við verð hvers bíls. „m/VSK“ merkir að VSK er innifalinn og „+ VSK“ að hann bætist við. Hafðu samband ef þú þarft nánari upplýsingar um verð.'],
]
export default function ImportPage() {
  return <div className="pt-16 lg:pt-20 dealer-import"><section className="dealer-container py-12 sm:py-16">
    <p className="dealer-eyebrow mb-4">Kaup hjá Eðalkaup</p>
    <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-.05em] leading-[1.08] max-w-4xl">Frá fyrsta samtali.<br /><span className="text-accent-dark dark:text-accent">Til afhendingar.</span></h1>
    <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mt-6 leading-relaxed">Skýrar upplýsingar og persónuleg þjónusta við bílakaup. Kynntu þér auglýsta bíla og hafðu samband um búnað, verð, skoðun og afhendingu.</p>
    <div className="flex flex-wrap gap-3 mt-7"><Link href="/bilar" className="dealer-button">Skoða bíla til sölu ↗</Link><Link href="#fyrirspurn" className="dealer-button dealer-button-outline">Spyrja um auglýstan bíl</Link></div>
    <h2 className="dealer-heading mt-16 mb-7">Næstu skref í bílakaupunum</h2>
    <ol className="grid md:grid-cols-2 gap-5">{steps.map(([title, description], index) => <li key={title} className="p-6 sm:p-8 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-navy-800"><p className="dealer-eyebrow mb-4">0{index + 1}</p><h3 className="font-semibold text-xl mb-3">{title}</h3><p className="text-gray-600 dark:text-slate-300 leading-relaxed">{description}</p></li>)}</ol>
    <section className="mt-16 max-w-3xl"><h2 className="dealer-heading mb-6">Algengar spurningar</h2>{questions.map(([question, answer]) => <details key={question} className="border-b border-black/10 dark:border-white/10 py-5"><summary className="font-semibold cursor-pointer">{question}</summary><p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">{answer}</p></details>)}</section>
    <div id="fyrirspurn" className="scroll-mt-24 mt-16 grid lg:grid-cols-2 gap-10 items-start"><div><h2 className="dealer-heading mb-4">Spurning um bíl?</h2><p className="text-gray-600 dark:text-slate-300 leading-relaxed">Láttu fylgja heiti bílsins eða hlekk á auglýsinguna. Við svörum spurningum um búnað, verð og framboð.</p><p className="mt-5"><a href="tel:+3546992011" className="font-semibold underline underline-offset-4">Hringdu í 699 2011</a></p></div><ContactForm variant="compact" source="innflutningur" heading="Fyrirspurn um auglýstan bíl" /></div>
  </section></div>
}
