import Link from 'next/link'
import ContactForm from '@/components/ContactForm'
import { pageMetadata } from '@/lib/pageSeo'
export const metadata = pageMetadata('Bílainnflutningur frá Bandaríkjunum, Kanada og Evrópu', 'Eðalkaup aðstoðar við leit, kaup og innflutning bíla til Íslands. Kynntu þér ferlið og sendu fyrirspurn um bílinn sem þú leitar að.', '/bilainnflutningur')
const steps = [
  ['Segðu okkur hvað þú leitar að', 'Sendu okkur gerð, árgerð, óskir um búnað og áætlað kaupverð. Því skýrari óskir, þeim mun auðveldara er að finna rétta bílinn.'],
  ['Við leitum og förum yfir upplýsingarnar', 'Við skoðum möguleika í Bandaríkjunum, Kanada og Evrópu. Farið er yfir upplýsingar um bíl, ástand og búnað áður en ákvörðun er tekin.'],
  ['Tilboð og næstu skref', 'Hafðu samband til að fá tilboð og fara yfir kostnaðarliði, greiðslufyrirkomulag og áætlaðan afhendingartíma áður en gengið er frá kaupum.'],
  ['Flutningur og afhending', 'Við sjáum um skipulagningu flutnings og tollafgreiðslu og aðstoðum við skráningu. Afhending er skipulögð í samráði við þig.'],
]
const questions = [
  ['Get ég óskað eftir bíl sem er ekki á síðunni?', 'Já. Sendu okkur upplýsingar um bílinn sem þú leitar að. Við skoðum möguleika í Bandaríkjunum, Kanada og Evrópu.'],
  ['Hvað kostar að flytja inn bíl?', 'Kostnaður fer eftir bílnum og upprunalandi. Biddu um tilboð sem greinir kaupverð, flutning, gjöld og þjónustu svo þú getir metið heildarkostnað áður en þú ákveður þig.'],
  ['Hversu langan tíma tekur innflutningur?', 'Tíminn fer eftir staðsetningu bílsins, flutningi og skráningu. Við förum yfir áætlaðan afhendingartíma fyrir þann bíl sem þú hefur áhuga á.'],
  ['Eru allir auglýstir bílar á Íslandi?', 'Ekki endilega. Hafðu samband til að staðfesta staðsetningu, framboð og hvenær hægt er að skoða eða fá tiltekinn bíl afhentan.'],
  ['Er verð með virðisaukaskatti?', 'Athugaðu merkingu við verð hvers bíls. „m/VSK“ merkir að VSK er innifalinn og „+ VSK“ að hann bætist við. Ef merking vantar skaltu fá staðfestingu áður en þú berð saman tilboð.'],
]
export default function ImportPage() {
  return <div className="pt-20 lg:pt-24"><section className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
    <p className="text-accent-dark dark:text-accent text-xs uppercase tracking-[.2em] font-semibold mb-4">Frá hugmynd til afhendingar</p>
    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight max-w-4xl">Bílainnflutningur frá Bandaríkjunum, Kanada og Evrópu</h1>
    <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mt-6 leading-relaxed">Eðalkaup hefur yfir 25 ára reynslu af bílainnflutningi. Við hjálpum þér að finna bílinn sem þú leitar að og aðstoðum þig í gegnum ferlið.</p>
    <div className="flex flex-wrap gap-3 mt-7"><Link href="#fyrirspurn" className="rounded-xl px-6 py-3 bg-accent text-navy-900 font-semibold">Óska eftir tilboði</Link><Link href="/bilar" className="rounded-xl px-6 py-3 border border-black/15 dark:border-white/15 font-medium">Skoða bíla til sölu</Link></div>
    <h2 className="text-2xl sm:text-3xl font-bold mt-16 mb-7">Hvernig virkar ferlið?</h2>
    <ol className="grid md:grid-cols-2 gap-5">{steps.map(([title, description], index) => <li key={title} className="p-6 border border-black/10 dark:border-white/10 rounded-2xl"><p className="text-accent-dark dark:text-accent font-semibold text-sm mb-4">0{index + 1}</p><h3 className="font-bold text-xl mb-3">{title}</h3><p className="text-gray-600 dark:text-slate-300 leading-relaxed">{description}</p></li>)}</ol>
    <section className="mt-16 max-w-3xl"><h2 className="text-2xl sm:text-3xl font-bold mb-6">Algengar spurningar um bílainnflutning</h2>{questions.map(([question, answer]) => <details key={question} className="border-b border-black/10 dark:border-white/10 py-5"><summary className="font-semibold cursor-pointer">{question}</summary><p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">{answer}</p></details>)}</section>
    <div id="fyrirspurn" className="scroll-mt-24 mt-16 grid lg:grid-cols-2 gap-10 items-start"><div><h2 className="text-3xl font-bold mb-4">Hvaða bíl leitarðu að?</h2><p className="text-gray-600 dark:text-slate-300 leading-relaxed">Segðu okkur frá óskunum þínum. Við höfum samband og förum yfir möguleikana.</p><p className="mt-5"><a href="tel:+3546992011" className="font-semibold underline underline-offset-4">Hringdu í 699 2011</a></p></div><ContactForm variant="compact" source="forsida" /></div>
  </section></div>
}
