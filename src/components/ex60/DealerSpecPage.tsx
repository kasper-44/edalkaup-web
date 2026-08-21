import type { ReactNode } from 'react'
import Image from 'next/image'

export type DealerSlug = 'diesel' | 'hofdabilar' | 'edalkaup'

const COLORS: {
  name: string
  hex: string
  src?: string
}[] = [
  { name: 'Onyx Black', hex: '#0c0c0d', src: '/images/ex60/onyx-black.jpg' },
  { name: 'Crystal White', hex: '#eceae4', src: '/images/ex60/crystal-white.jpg' },
  { name: 'Vapour Grey', hex: '#8b9296', src: '/images/ex60/vapour-grey.jpg' },
  { name: 'Aurora Silver', hex: '#b7b3bb', src: '/images/ex60/aurora-silver.jpg' },
  { name: 'Sand Dune', hex: '#c9bdaa', src: '/images/ex60/sand-dune.jpg' },
  { name: 'Forest Lake', hex: '#42504c', src: '/images/ex60/forest-green.jpg' },
  { name: 'Heather Bronze', hex: '#9c8482', src: '/images/ex60/heather-bronze.jpg' },
  { name: 'Denim Blue', hex: '#2b3a5c', src: '/images/ex60/denim-blue.jpg' },
]

const SPECS = [
  { num: '11.990.000 kr.', lbl: 'Verð' },
  { num: '3,9 sek', lbl: '0–100' },
  { num: '810 km', lbl: 'WLTP' },
  { num: 'TWIN Performance P12 AWD', lbl: 'Tvímótora, fjórhjóladrifið' },
  { num: '800 V', lbl: 'Rafkerfi' },
  { num: '5 sæti', lbl: 'Sæti' },
]

const EXTERIOR_PILLS = [
  'Litur: Onyx Black',
  '21" 6 pinna felgur, mattsvartar/glansvartar, demantsskurði',
  'Dark Exterior Design (innifalið)',
  'Dekkt hliðar- og afturrúður, frá B-súlu',
  'Fullrafdrifin samfellanleg dráttarkúla',
  'Grindarlausar hurðir, jafnfellt gler',
  'Rafstýrt litskiptiþak',
  'Virk loftflæðisstýring að framan',
  'Inndregnar hurðarhöldur',
]

const INTERIOR_PILLS = [
  'Nappa leður með loftræstingu, antrasít',
  'Innanrýmishönnun: Antrasít',
  'Weathered Grey Ash viður',
  'Þakhiminn í antrasít',
  'Stemmningslýsing',
  'Sérhannað stýri, rafstillanleg stýrissúla',
  'Miðjuarmpúðar að framan og aftan með geymslu',
]

const CARGO_PILLS = [
  'Frunk (geymsla undir vélarhlíf)',
  'Handfrjáls rafdrifinn afturhleri',
  'Rafdrifinn afturhleri',
  'Samanbrjótanlegt farangursgólf (60/40) með geymslu undir gólfi',
  'Samdregið farangurslok',
  'Farangursnet',
  'Festingar fyrir þakgrind',
]

const TECH_PILLS = [
  '22 kW innbyggt hleðslutæki',
  '400V DC/DC spennubreytir',
  '800V tækni',
  'Tvíátta hleðsla',
  'Breathe Charge hugbúnaður',
  'Plug & Charge',
  '11,4" mælaborðsskjár',
  '15,04" miðjuskjár (lárétt)',
  'NVIDIA DRIVE® örgjörvar',
  'Google Gemini, Maps og Play Store innbyggt',
  'Hágæða hljóðkerfi frá Bowers & Wilkins',
  'Þráðlaust Apple CarPlay og Android Auto',
]

const PACKAGES: { title: string; items: string[] }[] = [
  {
    title: 'Vetrarpakki',
    items: ['Upphitað stýri', 'Upphitun í ytri aftursætum', 'Upphitaðar rúðuþurrkur'],
  },
  {
    title: 'Pilot Assist pakki',
    items: ['Park Pilot Assist'],
  },
  {
    title: 'Aukabúnaður',
    items: [
      'Dekkt hliðar- og afturrúður (frá B-súlu)',
      'Fullrafdrifin samfellanleg dráttarkúla',
      'Type 2/Type 2 (Mode 3) hleðslukapall, 6 m, 3ja fasa, 32 A',
    ],
  },
  {
    title: 'Innifalið',
    items: ['Dark Exterior Design'],
  },
]

const FEATURE_CATS: { title: string; items: string[] }[] = [
  {
    title: 'Farangursrými og geymsla',
    items: [
      'Samdregið farangurslok',
      'Festingar fyrir þakgrind',
      'Handfrjáls rafdrifinn afturhleri',
      'Farangursnet',
      'Rafdrifinn afturhleri',
      'Samanbrjótanlegt farangursgólf (60/40) með aukageymslu undir gólfi',
      'Frunk (geymsla undir vélarhlíf)',
    ],
  },
  {
    title: 'Ytra byrði',
    items: [
      '21" 6 pinna felgur, mattsvartar/glansvartar, demantsskurði',
      'Virk loftflæðisstýring að framan',
      'Dark Exterior Design',
      'Rafstýrt litskiptiþak',
      'Grindarlausar hurðir og jafnfellt gler',
      'Dekkt hliðar- og afturrúður (frá B-súlu)',
      'Inndregnar hurðarhöldur',
    ],
  },
  {
    title: 'Ökuumhverfi og skynjaratækni',
    items: [
      '11,4" mælaborðsskjár',
      '15,04" miðjuskjár (lárétt)',
      'Virk fjöðrun',
      'BLIS™ (blindpunktskerfi)',
      'Viðvörun vegna þvertumferðar (CTA)',
      'Connected Safety (tengt öryggi)',
      'Viðvörun við hurðaropnun',
      'Vöktun á ástandi ökumanns',
      'Rafstillanleg stýrissúla',
      'Aksturstillingar (afköst)',
      'Fyrirbyggjandi vörn gegn aftanákeyrslu',
      'Háskerpu pixla-framljós',
      'Sjálfdeyfandi speglar (inni og úti)',
      'Skynjun á farþegum',
      'Virk stýriaðstoð til varnar gangandi og hjólandi vegfarendum',
      'Neyðarhemlunaraðstoð og sjálfvirkt neyðarsímtal',
      'Vörn gegn árekstri við umferð úr gagnstæðri átt',
      'One Pedal Drive',
      'Park Pilot Assist',
      'Bakkmyndavél með 360° hringsýn',
      'Pilot Assist',
      'Regnskynjari',
      'Drægnisaðstoð',
      'Dekkjaþrýstingsvöktun (viðvörun fyrir hvert hjól)',
      'Skiltalestur / umferðarskiltagreining',
      'Vörn gegn útafakstri',
      'Þvottakerfi fyrir framljós',
      'Akreinavari',
      'Árekstravörn og skaðaminnkun',
      'Volvo Assistance Services',
      'NVIDIA DRIVE® örgjörvar',
    ],
  },
  {
    title: 'Innanrými',
    items: [
      'Stemmningslýsing (víðtæk innanrýmislýsing)',
      'Klæðning á mælaborði og hljóðstöng (soundbar)',
      'Þakhiminn í antrasít',
      'Sérhannað stýri',
      'Aftari miðjuarmpúði með geymslu og glasahaldi',
      'Fremri miðjuarmpúði með útdraganlegri geymslu / 2+1 glasahöldum',
      'Loftræst Nappa leður',
      'Vandaðar gólfmottur úr taui',
      'Geymsluhólf í hurðum',
      'Símahaldarar að framan og aftan',
      'Weathered Grey Ash viður',
      'Geymsla í gólfi milli sæta',
      'Þýska sem valmyndarmál í mælaborði og útvarpi',
    ],
  },
  {
    title: 'Loftræsting og hitastýring',
    items: [
      'Rakaskynjari',
      'Aukið lofthreinsikerfi',
      'Fjarstýrð forhitun/forkæling innanrýmis',
      'Sjálfvirk loftræsting, þrískipt',
      'Upphitað stýri',
      'Þægindastilling í kyrrstöðu',
      'Grindarlausir, upphitaðir hliðarspeglar',
      'Aukahitari með tímastilli (rafmagns)',
      'Varmadæla',
      'Rúðuþurrkur með innbyggðri hitun',
    ],
  },
  {
    title: 'Öryggis- og aðstoðarkerfi',
    items: [
      'Afvirkjun á framsætis-farþegapúða',
      'Loftpúðar',
      'Hljóðeinangrandi gler í hliðarrúðum',
      'Þjófavarnarkerfi',
      'Undirbúningur fyrir áfengislæsingu',
      'Stafrænn lykill',
      'Sjúkrakassi',
      'ISOFIX-festingar í ytri aftursætum',
      'Rafdrifnar barnalæsingar á afturhurðum',
      'Höfuð-/axlapúðar fyrir alla farþega',
      'Aðlögunarhæf öryggisbelti að framan með fjölþrepa álagstakmörkun',
      'NFC-snjallkort sem lykill',
      'Dekkjaþéttiefni með 12V loftdælu (hám. 80 km/klst.)',
      'Vörn gegn hálshnykk',
      'Hliðarpúðar fyrir ökumann og framsætisfarþega',
      'Viðvörunarþríhyrningur',
    ],
  },
  {
    title: 'Sæti',
    items: [
      '5 sæti',
      'Stillanleg fótskör fyrir ökumann og framsætisfarþega',
      'Loftræst framsæti',
      'Rafstillanleg ökumanns- og farþegasæti, minni fyrir ökumannssæti',
      'Vinnuvistfræðilega hönnuð framsæti',
      'Rafdrifnir samfellanlegir höfuðpúðar í annarri sætaröð',
      '4-átta mjóbaksstuðningur í framsætum',
      'Rafstillanleg bök á aftursætum',
      'Rafdrifin samfellanleg aftursæti með einum takka',
      'Upphitun í ytri aftursætum',
      'Upphitun í framsætum',
    ],
  },
  {
    title: 'Tækni og hljóð',
    items: [
      'Stýrishnappar',
      'Bluetooth® handfrjáls búnaður með streymi',
      'Stafrænar útvarpsviðtökur (DAB+)',
      'Google Gemini, Google Maps og Google Play Store',
      'Hágæða hljóðkerfi frá Bowers & Wilkins',
      'Þráðlaus hleðsla fyrir snjallsíma',
      'Samskipti innan bílsins (kallkerfi)',
      'Hugbúnaðaruppfærslur þráðlaust (OTA)',
      'USB-C tengi',
      'Volvo On Call',
      'Þráðlaust Apple CarPlay og Android Auto',
    ],
  },
  {
    title: 'Rafhlaða, hleðsla og aflrás',
    items: [
      '22 kW innbyggt hleðslutæki (OBC)',
      '400 volta DC/DC spennubreytir',
      '800V tækni',
      'Tvíátta hleðsla',
      'Breathe Charge hugbúnaður',
      'Type 2/Type 2 (Mode 3) hleðslukapall, 6 m, 3ja fasa, 32 A',
      'Plug & Charge',
      'Einþrepa rafræn gírstýring (shift-by-wire)',
    ],
  },
]

function DealerBar({ dealer }: { dealer: DealerSlug }) {
  if (dealer === 'diesel') {
    return (
      <div className="flex items-center justify-center px-4 py-3.5" style={{ background: '#0a0a0c' }}>
        <Image
          src="/images/logos/diesel.jpg"
          alt="Diesel.is"
          width={220}
          height={48}
          className="h-12 w-auto object-contain"
        />
      </div>
    )
  }

  if (dealer === 'hofdabilar') {
    return (
      <div className="flex items-center justify-start gap-3 px-4 sm:px-6 py-3" style={{ background: '#136c85' }}>
        <Image
          src="/images/logos/hofdabilar.png"
          alt="Höfðabílar merki"
          width={42}
          height={42}
          className="rounded-full object-cover shrink-0"
          style={{ width: 42, height: 42 }}
        />
        <span className="text-white font-bold tracking-[0.18em] text-sm sm:text-base">HÖFÐABÍLAR</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-start px-4 sm:px-6 py-3.5" style={{ background: '#0b1220' }}>
      <Image
        src="/images/logos/edalkaup.png"
        alt="Eðalkaup"
        width={180}
        height={40}
        className="h-10 w-auto object-contain"
      />
    </div>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#c9a84c]/25 bg-white/[0.04] px-3.5 py-1.5 text-[13px] text-[#e8e4dc]">
      {children}
    </span>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f4f1ea] mb-3">
      {children}
      <span className="mt-3 block h-px w-16 bg-[#c9a84c]" />
    </h2>
  )
}

export default function DealerSpecPage({ dealer }: { dealer: DealerSlug }) {
  return (
    <div className="min-h-screen text-[#f4f1ea]" style={{ background: '#07080a' }}>
      <DealerBar dealer={dealer} />

      {/* Hero */}
      <header className="relative isolate overflow-hidden">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9] w-full">
          <Image
            src="/images/ex60/hero.jpg"
            alt="Volvo EX60 Ultra, Onyx Black, þriggja fjórðu framhorn"
            fill
            priority
            className="object-cover object-[center_55%] brightness-[1.22] saturate-[1.06]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080a] via-[#07080a]/25 to-transparent" />
        </div>
        <div className="relative -mt-40 sm:-mt-48 lg:-mt-56 z-10 mx-auto max-w-6xl px-4 sm:px-6 pb-10">
          <p className="text-[#c9a84c] text-xs sm:text-sm font-semibold uppercase tracking-[0.28em] mb-3">
            Volvo · Ultra · 2027
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#f7f4ee] max-w-4xl">
            Bíll framtíðarinnar er að koma
          </h1>
          <p className="mt-4 text-lg sm:text-2xl text-[#d8d2c6] font-medium">
            Rafmagnskvíðinn hverfur með honum
          </p>
          <p className="mt-5 text-base sm:text-lg text-[#f4f1ea] max-w-3xl leading-relaxed">
            Bjóðum upp á gríðarlega vel búna útfærslu af þessum frábæra bíl
          </p>
          <p className="mt-3 text-sm sm:text-base text-[#c9a84c] font-semibold tracking-wide">
            TWIN Performance (tvímótora P12 AWD)
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
            {SPECS.map((s) => (
              <div key={s.lbl} className="bg-[#0c0d10] px-3 py-4 sm:px-4 sm:py-5">
                <div className="text-[13px] sm:text-sm font-semibold text-[#f4f1ea] leading-snug">{s.num}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[#9a958b]">{s.lbl}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[#c8c2b6] max-w-3xl">
            P12 AWD Electric — aflmesta útgáfan, tvímótora og fjórhjóladrifin. Onyx Black, Ultra, Dark Exterior
            Design, Vetrarpakki og Pilot Assist.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6 space-y-16 sm:space-y-20 pb-20">
        {/* Ytra byrði */}
        <section>
          <SectionTitle>Ytra byrði</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            Í Onyx Black lit með Dark Exterior Design pakkanum og 21&quot; 6 pinna felgum, mattsvörtum/glansvörtum
            með demantsskurði.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <figure className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/ex60/hero.jpg"
                alt="EX60 Ultra, þriggja fjórðu framhorn, Onyx Black"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </figure>
            <figure className="relative aspect-[16/10] overflow-hidden rounded-xl">
              <Image
                src="/images/ex60/onyx-black.jpg"
                alt="EX60 Ultra hliðarmynd, Onyx Black"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </figure>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXTERIOR_PILLS.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </section>

        {/* Litir */}
        <section>
          <SectionTitle>Litir</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            EX60 Ultra fæst í eftirfarandi litum. Bíllinn sem sýndur er hér að ofan er í Onyx Black.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {COLORS.map((c) => (
              <div
                key={c.name}
                className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
              >
                {c.src ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={c.src}
                      alt={`EX60 í ${c.name} lit`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] w-full" style={{ backgroundColor: c.hex }} />
                )}
                <div className="flex items-center gap-2.5 px-3 py-3">
                  <span
                    className="h-4 w-4 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: c.hex }}
                  />
                  <h4 className="text-sm font-medium text-[#f4f1ea]">{c.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Kynningarmyndband */}
        <section>
          <SectionTitle>Kynningarmyndband</SectionTitle>
          <p className="text-[#c8c2b6] mb-6">Volvo EX60: A new beginning.</p>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/fBo4I4c0How"
              title="Volvo EX60: A new beginning"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </section>

        {/* Innanrými */}
        <section>
          <SectionTitle>Innanrými</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            Nappa leður með virkri loftræstingu í antrasít lit, ásamt antrasít-þema á innanrými, Weathered Grey Ash
            viðarinnleggi og 5 sæta fyrirkomulagi.
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERIOR_PILLS.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </section>

        {/* Áklæði */}
        <section>
          <SectionTitle>Áklæði</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            Þessi bíll er sérpantaður með loftræstu Nappa leðri — æðsta áklæðisefninu sem er í boði fyrir EX60 Ultra.
          </p>
          <div className="max-w-xl rounded-xl border border-[#c9a84c]/20 bg-white/[0.03] p-6">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9a84c] mb-2">
              Í þessum bíl
            </span>
            <h3 className="text-xl font-semibold text-[#f4f1ea] mb-3">Nappa leður, með loftræstingu</h3>
            <p className="text-sm leading-relaxed text-[#c8c2b6]">
              Fyrsta flokks áklæðið okkar, smíðað úr einstöku, krómlausu Nappa leðri. Mjúk áferð og fáguð áferð
              skapa lúxus andrúmsloft. Rof gerir innbyggðum viftum kleift að loftræsta sæti.
            </p>
          </div>
        </section>

        {/* Pakkar */}
        <section>
          <SectionTitle>Pakkar</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PACKAGES.map((pkg) => (
              <div key={pkg.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-[#c9a84c] mb-3">{pkg.title}</h3>
                <ul className="space-y-1.5 text-sm text-[#e8e4dc]">
                  {pkg.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-[#c9a84c] mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Farangursrými */}
        <section>
          <SectionTitle>Farangursrými</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            Rafdrifinn afturhleri og fullrafdrifin vélarhlíf opna inn í 1.647 lítra farangursrými og „frunk“ að
            framan — með samanbrjótanlegu farangursgólfi (60/40) og aukageymslu undir gólfi.
          </p>
          <div className="flex flex-wrap gap-2">
            {CARGO_PILLS.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </section>

        {/* Hleðsla og tækni */}
        <section>
          <SectionTitle>Hleðsla og tækni</SectionTitle>
          <p className="text-[#c8c2b6] mb-6 max-w-3xl leading-relaxed">
            800 volta rafkerfi með 22 kW innbyggðu hleðslutæki, tvíátta hleðslu og Plug &amp; Charge, ásamt 15,04&quot;
            miðjuskjá (lárétt) og NVIDIA DRIVE® örgjörvum.
          </p>
          <div className="flex flex-wrap gap-2">
            {TECH_PILLS.map((p) => (
              <Pill key={p}>{p}</Pill>
            ))}
          </div>
        </section>

        {/* Allur staðalbúnaður */}
        <section>
          <SectionTitle>Allur staðalbúnaður</SectionTitle>
          <p className="text-[#c8c2b6] mb-8 max-w-3xl leading-relaxed">
            Fullkomin tæknilýsing á EX60 Ultra, P12 AWD Electric.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURE_CATS.map((cat) => (
              <div key={cat.title}>
                <h3 className="text-base font-semibold text-[#c9a84c] mb-3">{cat.title}</h3>
                <ul className="space-y-1.5 text-sm text-[#d8d2c6]">
                  {cat.items.map((item) => (
                    <li key={item} className="flex gap-2 border-b border-white/5 py-1.5 last:border-0">
                      <span className="text-[#c9a84c]/80">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-3 text-sm text-[#9a958b] leading-relaxed">
          <p>
            Tæknilýsing sýnd: Volvo EX60 Ultra, P12 AWD Electric, árgerð 2027 — Onyx Black að utan, Nappa leður
            (loftræst, antrasít) að innan, Vetrarpakki, Pilot Assist pakki. Búnaður, aukahlutir og framboð geta
            verið breytileg eftir mörkuðum og framleiðslulotum.
          </p>
          <p>Ábyrgð frá fyrstu skráningu er 3 ár.</p>
        </div>
      </footer>
    </div>
  )
}
