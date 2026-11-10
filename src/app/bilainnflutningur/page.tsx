import Link from 'next/link'
import ArrowIcon from '@/components/ArrowIcon'
import ContactForm from '@/components/ContactForm'
import { jsonLdScript } from '@/lib/listingSeo'
import { pageMetadata } from '@/lib/pageSeo'

export const metadata = pageMetadata(
  'Bílainnflutningur og afhending',
  'Eðalkaup flytur inn bíla til Íslands. Kynntu þér vörugjald af rafbílum, styrk fyrir N2-vörubifreiðar og skráningu frá forskráningu til númera, auk auglýstra bíla og afhendingar.',
  '/bilainnflutningur',
)

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
  ['Eru rafbílar undanþegnir vörugjaldi?', 'Skatturinn segir að engin vörugjöld séu á ökutækjum sem ganga eingöngu fyrir rafmagni, metani eða vetni, og tilgreinir vörugjald þeirra 0%. Undanþágan nær ekki yfir virðisaukaskatt eða úrvinnslugjald. Tengiltvinnbílar falla ekki undir setninguna um ökutæki sem ganga eingöngu fyrir rafmagni.'],
  ['Er styrkur fyrir stóra rafmagnspallbíla?', 'Loftslags- og orkusjóður styrkir litlar vörubifreiðar í flokki N2, ekki venjulega fólksbíla. Stór rafknúinn pallbíll fellur aðeins þar undir ef Samgöngustofa skráir hann í flokki N2. Fyrir umsókn sem er samþykkt 2026 er hámarkið 2.500.000 kr. á bilinu 3,5–7 tonn og 5.000.000 kr. á bilinu 7–12 tonn, og styrkurinn er aðeins fyrir lögaðila eða einstaklinga í virkum atvinnurekstri. Sjá nánar í textanum hér að ofan og á umsóknarsíðu sjóðsins.'],
  ['Hvað líður frá pöntun þar til bíllinn fær númer?', 'Samgöngustofa og Skatturinn birta ekki hversu langan tíma sjóflutningur tekur. Eftir að farmbréf er til staðar er forskráning með CoC-vottorði yfirleitt afgreidd á 3–4 virkum dögum, aðrar forskráningar taka að lágmarki 10 virka daga, framleiðsla númeraplatna tekur 3 virka daga og tollafgreiðsla tekur almennt 3–5 virka daga. Þetta eru aðskilin skref, ekki ein heildartala.'],
]

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
}

function SourceLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} className="underline underline-offset-4 hover:text-accent" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export default function ImportPage() {
  return <div className="site-offset dealer-import"><section className="dealer-container py-12 sm:py-16">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqLd) }} />
    <p className="dealer-eyebrow mb-4">Bílainnflutningur hjá Eðalkaup</p>
    <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-.05em] leading-[1.08] max-w-4xl">Frá fyrsta samtali.<br /><span className="text-accent-dark dark:text-accent">Til afhendingar.</span></h1>
    <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mt-6 leading-relaxed">Við flytjum inn bíla til Íslands og auglýsum þá bíla sem við bjóðum til sölu. Sumir eru þegar á landinu, aðrir á leiðinni. Kynntu þér framboðið og hafðu samband um verð, búnað og afhendingu.</p>
    <div className="flex flex-wrap gap-3 mt-7"><Link href="/bilar" className="dealer-button">Skoða bíla til sölu <ArrowIcon /></Link><Link href="#fyrirspurn" className="dealer-button dealer-button-outline">Spyrja um auglýstan bíl</Link></div>
    <h2 className="dealer-heading mt-16 mb-7">Frá vali bíls til afhendingar</h2>
    <ol className="grid md:grid-cols-2 gap-5">{steps.map(([title, description], index) => <li key={title} className="p-6 sm:p-8 border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-navy-800"><p className="dealer-eyebrow mb-4">0{index + 1}</p><h3 className="font-semibold text-xl mb-3">{title}</h3><p className="text-gray-600 dark:text-slate-300 leading-relaxed">{description}</p></li>)}</ol>

    <section className="mt-16 max-w-3xl" aria-labelledby="vorugjald-heading">
      <h2 id="vorugjald-heading" className="dealer-heading mb-4">Vörugjald og rafbílar</h2>
      <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>Vörugjald er lagt á skráningarskyld ökutæki sem eru flutt inn eða framleidd á Íslandi, ný jafnt sem notuð. Skatturinn segir að engin vörugjöld séu á ökutækjum sem ganga eingöngu fyrir rafmagni, metani eða vetni. Í töflu um umhverfisvæn ökutæki er vörugjald ökutækja sem eru eingöngu knúin metani, rafmagni eða vetni 0%.</p>
        <p>Undanþágan er bundin við ökutæki sem ganga eingöngu fyrir þessum orkugjöfum. Hún fellir ekki niður önnur aðflutningsgjöld. Við innflutning skráningarskylds ökutækis þarf enn að greiða virðisaukaskatt og úrvinnslugjald af rafgeymum og hjólbörðum sem fylgja ökutækinu. Gjöldin reiknast af tollverði, sem er innkaupsverð, flutningsgjald og flutningstrygging.</p>
        <p>Nánar á síðum Skattsins: <SourceLink href="https://island.is/s/skatturinn/utreikningur-vorugjalds-af-innfluttum-okutaekjum">útreikningur vörugjalds</SourceLink> og <SourceLink href="https://island.is/innflutningur-a-nyju-eda-notudu-okutaeki">innflutningur á nýju eða notuðu ökutæki</SourceLink>.</p>
      </div>
    </section>

    <section className="mt-16 max-w-3xl" aria-labelledby="n2-heading">
      <h2 id="n2-heading" className="dealer-heading mb-4">Styrkur fyrir stórar rafknúnar vörubifreiðar</h2>
      <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>Loftslags- og orkusjóður veitir styrki vegna kaupa á ökutækjum sem hafa engan útblástur, eru hreinorkutæki eða losunarfrí. Reglugerð nr. 1090/2026 um sjóðinn tók gildi 1. nóvember 2026. Hún tilgreinir litlar vörubifreiðar í flokki N2 á tveimur þyngdarbilum. Stór rafknúinn pallbíll fellur aðeins hér undir ef Samgöngustofa skráir hann í flokki N2. Fólksbílar og minni sendibílar eru í öðru umsóknarferli.</p>
        <p>Styrkir til þessara vörubifreiða eru aðeins fyrir lögaðila eða einstaklinga í virkum atvinnurekstri, og ökutækin þurfa að vera notuð í atvinnuskyni. Þegar umsókn er samþykkt 2026 er hámarkið:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Lítil vörubifreið (N2), 3,5–7 tonn: 2.500.000 kr.</li>
          <li>Lítil vörubifreið (N2), 7–12 tonn: 5.000.000 kr.</li>
        </ul>
        <p>Á umsóknarsíðu sjóðsins er styrkur til nýs ökutækis, með fyrstu skráningu á Íslandi, að hámarki 33% af kaupverði án virðisaukaskatts. Ökutæki sem var fyrst skráð erlendis en er nýskráð á Íslandi innan 12 mánaða frá þeirri skráningu getur fengið að hámarki 80% af styrkupphæð og styrkhlutfalli. Sama síða tilgreinir það hlutfall sem 26,4%. Ökutæki sem er nýskráð hér meira en 12 mánuðum eftir fyrstu skráningu erlendis er ekki styrkhæft.</p>
        <p>Umsókn þarf að berast innan 12 mánaða frá nýskráningu á Íslandi og ökutækið þarf að vera nýskráð hjá Samgöngustofu. Styrkir miðast við ökutæki sem eru nýskráð eftir 1. janúar 2025. Hvert ökutæki er aðeins styrkt einu sinni. Fyrir N2 miðast árið í töflunni við það hvenær umsóknin er samþykkt að lokinni nýskráningu. Umsóknir fyrir N2 fara í gegnum umsóknarferli Loftslags- og orkusjóðs. Frá 1. janúar 2027 fara umsóknir fyrir N2 undir 7 tonn einnig fram á Ísland.is.</p>
        <p>Óheimilt er að selja styrkt ökutæki úr landi innan þriggja ára frá veittum styrk. Sjóðurinn getur þá krafist endurgreiðslu. Hann getur einnig lokað fyrir umsóknir ef fjárheimild ársins dugar ekki, svo styrkur er háður því að úthlutun sé opin.</p>
        <p>Heimildir: <SourceLink href="https://island.is/reglugerdir/nr/1090-2026">reglugerð nr. 1090/2026</SourceLink> og <SourceLink href="https://island.is/styrkir-til-kaupa-a-hreinorku-eda-losunarfrium-voeru-og-hopferdaoekutaekjum">umsókn um styrk fyrir N2- og M2-ökutæki</SourceLink>.</p>
      </div>
    </section>

    <section className="mt-16 max-w-3xl" aria-labelledby="tid-heading">
      <h2 id="tid-heading" className="dealer-heading mb-4">Frá pöntun að númeraplötum</h2>
      <div className="space-y-4 text-gray-600 dark:text-slate-300 leading-relaxed">
        <p>Samgöngustofa og Skatturinn birta ekki hversu langan tíma sjóflutningur tekur frá pöntun þar til ökutæki kemur í höfn. Tímarnir hér að neðan eru því aðeins þeir sem þessar stofnanir tilgreina fyrir forskráningu, númeraplötur og tollafgreiðslu. Þeir leggjast ekki sjálfkrafa saman í eina heildartölu, því næsta skref hefst ekki fyrr en það á undan er búið.</p>
        <ol className="list-decimal pl-5 space-y-3">
          <li>Áður en ökutækið er flutt inn þarf að athuga hvort það megi skrá á Íslandi. Ökutæki sem eru leyfileg í EES-ríkjum eru almennt leyfileg hér. Frá landi utan EES þarf að sýna fram á að það uppfylli EES-kröfur. Sækja má um forskráningu áður en ökutækið er flutt, sérstaklega ef vafi leikur á skráningarhæfi. Almenna reglan er að umsókn sé skilað eftir að farmbréf hefur verið gefið út.</li>
          <li>Öll ökutæki sem flutt eru til landsins, ný og notuð, þarf að forskrá hjá Samgöngustofu. Umsókn með CoC-vottorði er yfirleitt afgreidd á 3–4 virkum dögum, en biðin getur verið lengri á álagstímum. Afgreiðsla annarra umsókna tekur að lágmarki 10 virka daga. Að forskráningu lokinni fær ökutækið fastanúmer.</li>
          <li>Samgöngustofa pantar númeraplötur og sendir þær á skoðunarstöð. Framleiðslutími platna er 3 virkir dagar.</li>
          <li>Tollskýrsla er unnin með tollmiðlara. Tollafgreiðsla tekur almennt 3–5 virka daga. Afhendingarheimild fæst þegar ökutækið hefur verið tollafgreitt og aðflutningsgjöldin greidd.</li>
          <li>Tryggja þarf ökutækið til að fá skammtímamerki og færa það á þá skoðunarstöð sem númeraplöturnar voru sendar á. Skoðunarstöðin nýskráir ökutækið.</li>
        </ol>
        <p>Samgöngustofa birtir þessi gjöld með forskráningu: 5.043 krónur fyrir flestar fólksbifreiðar frá Evrópu og 14.422 krónur fyrir ökutæki sem koma annars staðar frá, vörubifreiðar, hópbifreiðar og fleiri. Ein númeraplata kostar 6.736 krónur. Skammtímamerki fyrir einn dag kostar 1.193 krónur hjá Samgöngustofu. Nýskráning og skráningarskoðun fer eftir gjaldskrá þeirrar skoðunarstöðvar sem valin er.</p>
        <p>Heimildir: <SourceLink href="https://island.is/forskra-okutaeki-i-umferd">forskráning ökutækis</SourceLink> hjá Samgöngustofu og <SourceLink href="https://island.is/innflutningur-a-nyju-eda-notudu-okutaeki">innflutningur ökutækis</SourceLink> hjá Skattinum.</p>
      </div>
    </section>

    <section className="mt-16 max-w-3xl"><h2 className="dealer-heading mb-6">Algengar spurningar</h2>{questions.map(([question, answer]) => <details key={question} className="border-b border-black/10 dark:border-white/10 py-5"><summary className="font-semibold cursor-pointer">{question}</summary><p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">{answer}</p></details>)}</section>
    <div id="fyrirspurn" className="scroll-mt-[calc(var(--site-header-offset)+0.5rem)] mt-16 grid lg:grid-cols-2 gap-10 items-start"><div><h2 className="dealer-heading mb-4">Spurning um bíl?</h2><p className="text-gray-600 dark:text-slate-300 leading-relaxed">Láttu fylgja heiti bílsins eða hlekk á auglýsinguna. Við svörum spurningum um búnað, verð og framboð.</p><p className="mt-5"><a href="tel:+3546992011" className="font-semibold underline underline-offset-4">Hringdu í 699 2011</a></p></div><ContactForm variant="compact" source="innflutningur" heading="Fyrirspurn um auglýstan bíl" /></div>
  </section></div>
}
