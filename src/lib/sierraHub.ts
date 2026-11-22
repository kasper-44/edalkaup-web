import { publicCarSlug } from '@/lib/carPath'
import { formatIsk, formatIskNumber } from '@/lib/formatIsk'
import { listingCopy } from '@/lib/listingCopy'
import {
  knownExteriorColour,
  listingColourPhrase,
  mileageKm,
  presentText,
  vehicleTitle,
} from '@/lib/listingSeo'
import { vatIncludedPriceSubtitle, withVatFlag } from '@/lib/priceVat'
import { DEALER_LEGAL_NAME, DEALER_PHONE_DISPLAY, SITE_ORIGIN } from '@/lib/site'
import { isInTransit } from '@/lib/transit'

/** The two live Sierra listings. Other inventory stays off this hub. */
const SIERRA_IDS = [
  'd3bc6ca2-bc0a-42b1-a5a6-f5a279cc8b90',
  '69995cc4-949e-4cd5-8b63-1cab20885634',
] as const

export const HUB_PATH = '/gmc-sierra-ev'
export const HUB_URL = `${SITE_ORIGIN}${HUB_PATH}`
export const HUB_TITLE = 'GMC Sierra EV Denali Max Range til sölu á Íslandi'

/** 1 mile = 1.60934 km. 2026 kilometres are this conversion, not a GMC figure. */
export const KM_PER_MILE = 1.60934
const RANGE_2025_MILES = 460
const RANGE_2025_KM = 740
const RANGE_2026_MILES = 478
const RANGE_2026_KM = Math.round(RANGE_2026_MILES * KM_PER_MILE)

/** Above this, the hub stops saying „lítið ekinn“. */
const LOW_KM_MAX = 50000

export const RANGE_SOURCE_2025 = {
  href: 'https://news.gmc.com/newsroom.detail.html/Pages/news/us/en/2024/oct/1014-sierraev.html',
  label: 'GMC fréttatilkynning, 14. október 2024',
}
export const RANGE_SOURCE_2026 = {
  href: 'https://www.gmc.com/electric/previous-year/sierra-ev',
  label: 'GMC, 2026 Sierra EV, FAQ',
}

export type SierraOffer = {
  id: string
  slug: string
  url: string
  year: number
  color: string
  km: number
  miles: number
  price: number
  vatLabel: string | null
  trim: string | null
  make: string
  model: string
  name: string
  unregistered: boolean
  grant: boolean
  states760: boolean
  inTransit: boolean
  image: string | null
}

export type SierraFaq = { question: string; answer: string }
export type SpecCell = { text: string; href?: string }
export type SpecRow = { label: string; cells: SpecCell[] }

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function text(value: unknown): string | null {
  return typeof value === 'string' ? presentText(value) : null
}

function colourPhrase(color: string): string {
  const lower = color.toLocaleLowerCase('is')
  if (lower === 'hvítur' || lower === 'hvitur') return 'hvítum lit'
  return color
}

function lowKm(offer: SierraOffer): boolean {
  return offer.km > 0 && offer.km <= LOW_KM_MAX
}

function prosePrice(offer: SierraOffer): string {
  const amount = `${formatIskNumber(offer.price)} kr.`
  if (offer.vatLabel === 'm/VSK') return `${amount} með VSK`
  if (offer.vatLabel === '+ VSK') return `${amount} + VSK`
  return amount
}

export function tablePrice(offer: SierraOffer): string {
  const amount = formatIsk(offer.price)
  return offer.vatLabel ? `${amount} ${offer.vatLabel}` : amount
}

export function columnLabel(offer: SierraOffer): string {
  const colour = listingColourPhrase({ exterior_colour: offer.color, colour: offer.color }) || offer.color
  return `${offer.year}, ${colour}`
}

export function rangeText(year: number): string | null {
  if (year === 2026) {
    return `GM-áætluð allt að ${RANGE_2026_MILES} mílur (um ${RANGE_2026_KM} km, umreiknað 1 míla = 1,60934 km). Ekki EPA-tala.`
  }
  if (year === 2025) return `GM-áætluð ${RANGE_2025_MILES} mílur (${RANGE_2025_KM} km). Ekki EPA-tala.`
  return null
}

function powerText(offer: SierraOffer): string | null {
  const maxRange = /max range/i.test(`${offer.trim || ''} ${offer.name}`)
  if (!maxRange && !offer.states760) return null
  return '760 hö, í Max Power ham samkvæmt GMC'
}

function toOffer(raw: unknown): SierraOffer | null {
  const row = asRecord(raw)
  if (!row) return null
  const id = text(row.id)?.toLowerCase()
  if (!id || !SIERRA_IDS.includes(id as (typeof SIERRA_IDS)[number])) return null
  if (typeof row.status === 'string' && row.status !== 'live') return null
  const year = mileageKm(row.year)
  const price = mileageKm(row.price_isk)
  const km = mileageKm(row.mileage_km)
  const make = text(row.make)
  const model = text(row.model)
  const color = knownExteriorColour({
    exterior_colour: text(row.exterior_colour),
    colour: text(row.colour),
  })
  if (year == null || !Number.isInteger(year) || price == null || price <= 0 || km == null || km < 0) return null
  if (!make || !model || !color) return null
  const description = listingCopy(row.description_is) || ''
  const title = text(row.title)
  const trim = text(row.trim)
  const vin = text(row.vin)
  const slug = publicCarSlug({ id, title, make, model, trim, vin })
  const images = Array.isArray(row.images) ? row.images : []
  const image = images.find((item): item is string => typeof item === 'string' && item.startsWith('https://')) ?? null
  return {
    id,
    slug,
    url: `${SITE_ORIGIN}/bilar/${slug}`,
    year,
    color,
    km,
    miles: Math.round(km / KM_PER_MILE),
    price,
    vatLabel: vatIncludedPriceSubtitle(withVatFlag({
      id,
      body_type: text(row.body_type),
      price_includes_vat: typeof row.price_includes_vat === 'boolean' ? row.price_includes_vat : null,
      vat_included: typeof row.vat_included === 'boolean' ? row.vat_included : null,
    })),
    trim,
    make,
    model,
    name: vehicleTitle({ make, model, trim, title, vin }),
    unregistered: /óskráð/i.test(description),
    grant: /orkusjóð/i.test(description),
    states760: /760/.test(description),
    inTransit: isInTransit({ id, in_transit: typeof row.in_transit === 'boolean' ? row.in_transit : null, status: text(row.status) }),
    image,
  }
}

/** Live rows only. A sold or incomplete car is omitted so the hub does not render a broken card. */
export function sierraOffersFromRows(rows: readonly unknown[]): SierraOffer[] {
  const byId = new Map<string, SierraOffer>()
  for (const row of rows) {
    const offer = toOffer(row)
    if (offer) byId.set(offer.id, offer)
  }
  return SIERRA_IDS.flatMap((id) => {
    const offer = byId.get(id)
    return offer ? [offer] : []
  })
}

export function leadLine(offers: SierraOffer[]): string | null {
  if (offers.length > 0 && offers.every((offer) => offer.unregistered && lowKm(offer))) {
    return 'Lítið ekinn, óskráður á Íslandi.'
  }
  return null
}

export function directAnswer(offers: SierraOffer[]): string {
  const phone = `Hringdu í ${DEALER_PHONE_DISPLAY}.`
  if (offers.length === 0) {
    return `GMC Sierra EV Denali Max Range er ekki í auglýstri sölu hjá Eðalkaup í augnablikinu. ${phone}`
  }
  const allLow = offers.every((offer) => offer.unregistered && lowKm(offer))
  const frame = allLow
    ? offers.length === 2
      ? 'Í boði eru tveir lítið eknir bílar, báðir óskráðir á Íslandi: '
      : 'Í boði er lítið ekinn bíll, óskráður á Íslandi: '
    : 'Í boði: '
  const joined = offers
    .map((offer) => `${offer.year} í ${colourPhrase(offer.color)}, ekinn ${formatIskNumber(offer.km)} km, á ${prosePrice(offer)}`)
    .join(', og ')
  const grant = offers.every((offer) => offer.grant) ? ' Kaupandi tekur fullan styrk frá orkusjóði.' : ''
  return `Já, GMC Sierra EV Denali Max Range er til sölu hjá Eðalkaup. ${frame}${joined}.${grant} ${phone}`
}

function availabilityAnswer(offers: SierraOffer[]): string {
  const phone = `Hringdu í ${DEALER_PHONE_DISPLAY}, eða opnaðu auglýsinguna á edalkaup.is.`
  if (offers.length === 2 && offers.every((offer) => offer.unregistered && lowKm(offer))) {
    const clause = (offer: SierraOffer) => {
      const white = offer.color.toLocaleLowerCase('is') === 'hvítur' || offer.color.toLocaleLowerCase('is') === 'hvitur'
      return white ? `árgerð ${offer.year} og hvítur` : `árgerð ${offer.year} í ${offer.color}`
    }
    return `Já. Eðalkaup hefur tvo slíka bíla til sölu, báða lítið ekna og óskráða á Íslandi. Annar er ${clause(offers[0])}, hinn er ${clause(offers[1])}. ${phone}`
  }
  if (offers.length === 1) {
    const offer = offers[0]
    const frame = offer.unregistered && lowKm(offer) ? 'lítið ekinn og óskráður á Íslandi' : 'til sölu'
    return `Já. Eðalkaup hefur einn slíkan bíl til sölu, ${frame}. Hann er árgerð ${offer.year} í ${colourPhrase(offer.color)}. ${phone}`
  }
  if (offers.length > 1) {
    return `Já. Eðalkaup hefur ${offers.length} slíka bíla til sölu. ${phone}`
  }
  return `Eðalkaup er ekki með GMC Sierra EV Denali Max Range í auglýstri sölu í augnablikinu. Hringdu í ${DEALER_PHONE_DISPLAY}.`
}

function notNewAnswer(offers: SierraOffer[]): string {
  if (offers.length === 2 && offers.every((offer) => offer.unregistered && lowKm(offer))) {
    const newer = offers[0].year >= offers[1].year ? offers[0] : offers[1]
    const other = newer === offers[0] ? offers[1] : offers[0]
    const compared = newer.year === other.year
      ? `Annar er ekinn ${formatIskNumber(newer.km)} km, hinn ${formatIskNumber(other.km)} km.`
      : `Sá nýrri er ekinn ${formatIskNumber(newer.km)} km, hinn ${formatIskNumber(other.km)} km.`
    return `Nei. Þetta eru notaðir, lítið eknir bílar, ekki nýir núll-kílómetra bílar. ${compared} Báðir eru merktir óskráðir, sem þýðir að þeir eru ekki komnir á íslenskar skráningarplötur.`
  }
  if (offers.length === 1 && offers[0].km > 0) {
    const offer = offers[0]
    const little = lowKm(offer) ? 'lítið ekinn bíll' : 'notaður bíll'
    const plate = offer.unregistered
      ? ' Hann er merktur óskráður, sem þýðir að hann er ekki kominn á íslenskar skráningarplötur.'
      : ''
    return `Nei. Þetta er ${little}, ekki nýr núll-kílómetra bíll. Hann er ekinn ${formatIskNumber(offer.km)} km.${plate}`
  }
  return 'Nei. Eðalkaup merkir þessa bíla ekki sem nýja núll-kílómetra bíla.'
}

function priceAnswer(offers: SierraOffer[]): string {
  const lines = offers.map((offer) => `${offer.year} í ${colourPhrase(offer.color)} er á ${prosePrice(offer)}.`)
  const grant = offers.every((offer) => offer.grant)
    ? offers.length === 2
      ? ' Í báðum auglýsingum stendur að kaupandi taki fullan styrk frá orkusjóði.'
      : ' Í auglýsingunni stendur að kaupandi taki fullan styrk frá orkusjóði.'
    : ''
  return `${lines.join(' ')} Þetta er auglýst verð á síðunni.${grant}`
}

function vatAnswer(offers: SierraOffer[]): string {
  const withVat = offers.every((offer) => offer.vatLabel === 'm/VSK')
  const unregistered = offers.every((offer) => offer.unregistered)
  if (offers.length === 2 && withVat && unregistered) {
    return 'Já, auglýst verð er með VSK. Bílarnir eru merktir óskráðir, svo íslensk skráning er ekki lokið. Upphæð skráningargjalda er ekki sett fram hér.'
  }
  if (offers.length === 1 && withVat && unregistered) {
    return 'Já, auglýst verð er með VSK. Bíllinn er merktur óskráður, svo íslensk skráning er ekki lokið. Upphæð skráningargjalda er ekki sett fram hér.'
  }
  if (withVat) return 'Já, auglýst verð er með VSK. Upphæð skráningargjalda er ekki sett fram hér.'
  if (unregistered) return 'Bílarnir eru merktir óskráðir, svo íslensk skráning er ekki lokið. Upphæð skráningargjalda er ekki sett fram hér.'
  return 'Upphæð skráningargjalda er ekki sett fram hér.'
}

function rangeAnswer(): string {
  return `Samkvæmt GMC er drægni 2026 Denali Max Range GM-áætluð allt að ${RANGE_2026_MILES} mílur, eða um ${RANGE_2026_KM} km umreiknað. Fyrir 2025 er GM-áætluð drægni ${RANGE_2025_MILES} mílur (${RANGE_2025_KM} km). Þetta eru GM-tölur, ekki EPA-tölur, og raundrægni fer eftir aðstæðum. Stærð rafhlöðunnar í kWst er ekki staðfest hér.`
}

export function faqItems(offers: SierraOffer[]): SierraFaq[] {
  const items: SierraFaq[] = [
    {
      question: 'Er GMC Sierra EV Denali Max Range til sölu á Íslandi?',
      answer: availabilityAnswer(offers),
    },
  ]
  if (offers.length > 0) {
    items.push(
      { question: 'Eru bílarnir nýir?', answer: notNewAnswer(offers) },
      { question: 'Hvað kosta þeir?', answer: priceAnswer(offers) },
    )
  }
  items.push({ question: 'Hvaða drægni hefur Max Range?', answer: rangeAnswer() })
  if (offers.length > 0) {
    items.push({ question: 'Er verðið með VSK, og hvað með skráningu?', answer: vatAnswer(offers) })
  }
  items.push({
    question: 'Hvernig skoða ég bílinn eða fæ nánari upplýsingar?',
    answer: `Hringdu í ${DEALER_PHONE_DISPLAY}, eða sendu fyrirspurn af auglýsingunni. Viðskipti á edalkaup.is eru við ${DEALER_LEGAL_NAME}.`,
  })
  return items
}

export function specRows(offers: SierraOffer[]): SpecRow[] {
  if (offers.length === 0) return []
  const rows: SpecRow[] = []
  const push = (label: string, cells: (SpecCell | null)[]) => {
    if (cells.every((cell) => !cell?.text)) return
    rows.push({ label, cells: cells.map((cell) => cell ?? { text: '' }) })
  }
  push('Útgáfa', offers.map((offer) => ({ text: offer.name })))
  push('Árgerð', offers.map((offer) => ({ text: String(offer.year) })))
  push('Litur', offers.map((offer) => ({ text: offer.color })))
  push('Akstur', offers.map((offer) => ({ text: `${formatIskNumber(offer.km)} km (${formatIskNumber(offer.miles)} mílur)` })))
  push('Verð', offers.map((offer) => ({ text: tablePrice(offer) })))
  push('Skráning', offers.map((offer) => {
    if (!offer.unregistered || offer.km <= 0) return null
    const little = lowKm(offer) ? ' (lítið ekinn, ekki nýr)' : ''
    return { text: `Óskráður á Íslandi${little}` }
  }))
  push('VSK / orkusjóður', offers.map((offer) => {
    const parts: string[] = []
    if (offer.vatLabel === 'm/VSK') parts.push('Auglýst með VSK.')
    else if (offer.vatLabel === '+ VSK') parts.push('Auglýst + VSK.')
    if (offer.grant) parts.push('“Kaupandi tekur fullan styrk frá orkusjóði.”')
    return parts.length ? { text: parts.join(' ') } : null
  }))
  push('Drægni, Max Range', offers.map((offer) => {
    const textValue = rangeText(offer.year)
    return textValue ? { text: textValue } : null
  }))
  push('Afl', offers.map((offer) => {
    const textValue = powerText(offer)
    return textValue ? { text: textValue } : null
  }))
  push('Tenglar', offers.map((offer) => ({ text: 'Opna auglýsingu', href: offer.url })))
  return rows
}

function carNode(offer: SierraOffer): Record<string, unknown> {
  const node: Record<string, unknown> = {
    '@type': ['Product', 'Car'],
    '@id': `${offer.url}#vehicle`,
    name: offer.name,
    brand: { '@type': 'Brand', name: offer.make },
    model: offer.model,
    vehicleModelDate: offer.year,
    color: offer.color,
  }
  if (offer.trim) node.vehicleConfiguration = offer.trim
  if (offer.km > 0) {
    node.itemCondition = 'https://schema.org/UsedCondition'
    node.mileageFromOdometer = { '@type': 'QuantitativeValue', value: offer.km, unitCode: 'KMT' }
  }
  node.offers = {
    '@type': 'Offer',
    url: offer.url,
    price: offer.price,
    priceCurrency: 'ISK',
    availability: offer.inTransit ? 'https://schema.org/PreOrder' : 'https://schema.org/LimitedAvailability',
  }
  return node
}

export function hubJsonLd(offers: SierraOffer[], faq: SierraFaq[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${HUB_URL}#webpage`,
        url: HUB_URL,
        name: HUB_TITLE,
        inLanguage: 'is',
        isPartOf: { '@id': `${SITE_ORIGIN}#website` },
        about: { '@id': `${HUB_URL}#itemlist` },
        mainEntity: { '@id': `${HUB_URL}#itemlist` },
      },
      {
        '@type': 'ItemList',
        '@id': `${HUB_URL}#itemlist`,
        name: 'GMC Sierra EV Denali Max Range til sölu hjá Eðalkaup',
        itemListOrder: 'https://schema.org/ItemListUnordered',
        numberOfItems: offers.length,
        itemListElement: offers.map((offer, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: offer.url,
          item: carNode(offer),
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${HUB_URL}#faq`,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  }
}
