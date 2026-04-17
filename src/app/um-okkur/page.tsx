import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Um okkur',
  description: 'Eðalkaup er hluti af Úranus ehf. — einum stærsta bílainnflytjanda Íslands í yfir 25 ár. Kynntu þér sögu okkar og þjónustu.',
}

export default function UmOkkurPage() {
  const steps = [
    { num: '01', title: 'Veldu bíl', desc: 'Skoðaðu úrvalið okkar eða segðu okkur hvaða bíl þú leitar að. Við leitum að besta boðinu.' },
    { num: '02', title: 'Við finnum hann', desc: 'Við notum tengslanet okkar í Bandaríkjunum, Kanada og Evrópu til að finna nákvæmlega rétta bílinn á rétta verðinu.' },
    { num: '03', title: 'Skoðun og kaup', desc: 'Bíllinn er skoðaður vandlega. Við sjáum um öll kaup, pappíra og skipulagningu á sendingu.' },
    { num: '04', title: 'Sending til Íslands', desc: 'Bíllinn er sendur til Íslands. Venjulegur afgreiðslutími er 4-6 vikur frá Ameríku og 2-4 vikur frá Evrópu.' },
    { num: '05', title: 'Tollafgreiðsla og skráning', desc: 'Við sjáum um alla tollafgreiðslu og aðstoðum við skráningu bílsins á Íslandi.' },
    { num: '06', title: 'Afhending', desc: 'Bíllinn þinn er tilbúinn! Við afhendum hann tilbúinn til notkunar á Íslandi.' },
  ]

  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Um okkur</p>
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Eðalkaup — hluti af Úranus, einum stærsta bílainnflytjanda Íslands
            </h1>
            <p className="text-lg text-gray-600 dark:text-slate-300 leading-relaxed">
              Úranus er einn stærsti innflutningsaðili á bílum til Íslands síðustu 25 árin. Við flytjum inn allar gerðir bíla og annarra ökutækja — mótorhjól, sendibíla, húsbíla, vinnuvélar og vörubíla.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Af hverju Eðalkaup?</h2>
            <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed">
              <p>
                Bandaríkin, Kanada og Evrópa bjóða upp á gríðarlegt úrval af bílum sem ekki eru fáanlegir á íslenskum markaði — allt frá öflugum Toyota Tundra og Sequoia jeppum til lúxus Lexus og evrópskra gerða.
              </p>
              <p>
                Verðlag á notuðum bílum erlendis er mun hagstæðara en á Íslandi, jafnvel að teknu tilliti til sendingar og gjalda. Þetta þýðir að þú getur fengið meira fyrir peningana þína.
              </p>
              <p>
                Við vinnum með traustu tengslaneti söluaðila og uppboðshúsa víðs vegar um Bandaríkin, Kanada og Evrópu, og getum fundið nánast hvaða bíl sem er.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Hvers vegna velja okkur?</h2>
            <div className="space-y-4">
              {[
                { title: 'Reynsla', desc: 'Yfir 25 ára reynsla af bílainnflutningi til Íslands' },
                { title: 'Tengslanet', desc: 'Víðtækt tengslanet í Bandaríkjunum, Kanada og Evrópu' },
                { title: 'Heildarþjónusta', desc: 'Frá leit að bíl til afhendingar — við sjáum um allt' },
                { title: 'Hagstætt verð', desc: 'Verð sem oftast eru ekki í boði annars staðar á Íslandi' },
                { title: 'Áreiðanleiki', desc: 'Allir bílar skoðaðir vandlega áður en þeir eru sendir' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-white dark:bg-navy-800 rounded-xl border border-black/5 dark:border-white/5">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Import Process */}
      <section className="bg-gray-50 dark:bg-navy-800/50 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Ferlið</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Hvernig innflutningurinn virkar</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="relative p-6 bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5">
                <span className="text-5xl font-black text-accent/10 absolute top-4 right-4">{step.num}</span>
                <div className="relative">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Úranus connection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-3xl border border-accent/20 p-10 sm:p-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Úranus ehf.</h2>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed mb-6">
              Eðalkaup er hluti af Úranus ehf., sem hefur verið einn stærsti bílainnflytjandi Íslands í yfir 25 ár. Úranus flytur inn nýja og notaða bíla frá Evrópu og Ameríku og býður verð sem eru oftast ekki í boði annars staðar.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
