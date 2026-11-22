import assert from 'node:assert/strict'
import {
  directAnswer,
  faqItems,
  hubJsonLd,
  leadLine,
  sierraOffersFromRows,
  specRows,
} from '@/lib/sierraHub'

const deepOcean = {
  id: 'd3bc6ca2-bc0a-42b1-a5a6-f5a279cc8b90',
  status: 'live',
  title: 'GMC Sierra EV Denali Max Range',
  make: 'GMC',
  model: 'Sierra EV',
  year: 2026,
  trim: 'Denali Max Range',
  price_isk: 16890000,
  mileage_km: 18248,
  exterior_colour: 'Deep Ocean Metallic',
  colour: 'Blár',
  body_type: 'Pallbíll',
  description_is: 'Árgerð 2026 – óskráður\n760 hö\nKaupandi tekur fullan styrk frá orkusjóði',
  vin: '1GT4EYEL8TU408344',
  battery_kwh: 205,
  range_km: 769,
}

const white = {
  id: '69995cc4-949e-4cd5-8b63-1cab20885634',
  status: 'live',
  title: 'GMC Sierra EV Denali Max Range',
  make: 'GMC',
  model: 'Sierra EV',
  year: 2025,
  trim: 'Denali Max Range',
  price_isk: 16590000,
  mileage_km: 16444,
  exterior_colour: 'Hvítur',
  colour: 'Hvítur',
  body_type: 'Pallbíll',
  description_is: 'Árgerð 2025 – óskráður\n760 hö\nKaupandi tekur fullan styrk frá orkusjóði',
  vin: '1GT40LEL0SU413859',
  battery_kwh: 205,
}

const offers = sierraOffersFromRows([white, { id: 'other', price_isk: 1, year: 2024 }, deepOcean])
assert.deepEqual(offers.map((offer) => offer.id), [deepOcean.id, white.id])
assert.equal(offers[0].color, 'Deep Ocean Metallic')
assert.equal(offers[1].color, 'Hvítur')
assert.equal(offers[0].url, 'https://www.edalkaup.is/bilar/gmc-sierra-ev-denali-max-range-d3bc6c')
assert.equal(offers[1].url, 'https://www.edalkaup.is/bilar/gmc-sierra-ev-denali-max-range-69995c')
assert.equal(offers[0].miles, 11339)
assert.equal(offers[1].miles, 10218)
assert.equal(leadLine(offers), 'Lítið ekinn, óskráður á Íslandi.')
assert.equal(
  directAnswer(offers),
  'Já, GMC Sierra EV Denali Max Range er til sölu hjá Eðalkaup. Í boði eru tveir lítið eknir bílar, báðir óskráðir á Íslandi: 2026 í Deep Ocean Metallic, ekinn 18.248 km, á 16.890.000 kr. með VSK, og 2025 í hvítum lit, ekinn 16.444 km, á 16.590.000 kr. með VSK. Kaupandi tekur fullan styrk frá orkusjóði. Hringdu í 699 2011.',
)
assert.equal(/ný/i.test(directAnswer(offers)), false)

const faq = faqItems(offers)
assert.deepEqual(faq.map((item) => item.question), [
  'Er GMC Sierra EV Denali Max Range til sölu á Íslandi?',
  'Eru bílarnir nýir?',
  'Hvað kosta þeir?',
  'Hvaða drægni hefur Max Range?',
  'Er verðið með VSK, og hvað með skráningu?',
  'Hvernig skoða ég bílinn eða fæ nánari upplýsingar?',
])
assert.equal(
  faq[1].answer,
  'Nei. Þetta eru notaðir, lítið eknir bílar, ekki nýir núll-kílómetra bílar. Sá nýrri er ekinn 18.248 km, hinn 16.444 km. Báðir eru merktir óskráðir, sem þýðir að þeir eru ekki komnir á íslenskar skráningarplötur.',
)
assert.equal(
  faq[2].answer,
  '2026 í Deep Ocean Metallic er á 16.890.000 kr. með VSK. 2025 í hvítum lit er á 16.590.000 kr. með VSK. Þetta er auglýst verð á síðunni. Í báðum auglýsingum stendur að kaupandi taki fullan styrk frá orkusjóði.',
)
assert.equal(faq[3].answer.includes('478 mílur'), true)
assert.equal(faq[3].answer.includes('769 km'), true)
assert.equal(faq[3].answer.includes('460 mílur (740 km)'), true)
assert.equal(faq[3].answer.includes('ekki staðfest'), true)
assert.equal(/205|kWh/i.test(faq[3].answer), false)

const labels = specRows(offers).map((row) => row.label)
assert.deepEqual(labels, [
  'Útgáfa',
  'Árgerð',
  'Litur',
  'Akstur',
  'Verð',
  'Skráning',
  'VSK / orkusjóður',
  'Drægni, Max Range',
  'Afl',
  'Tenglar',
])
const spec = JSON.stringify(specRows(offers))
assert.equal(spec.includes('16.890.000 kr. m/VSK'), true)
assert.equal(spec.includes('16.590.000 kr. m/VSK'), true)
assert.equal(spec.includes('18.248 km (11.339 mílur)'), true)
assert.equal(spec.includes('16.444 km (10.218 mílur)'), true)
assert.equal(spec.includes('Summit White'), false)
assert.equal(spec.includes('205'), false)
assert.equal(spec.includes('Blár'), false)

const ld = hubJsonLd(offers, faq)
const list = ld['@graph'][1] as { numberOfItems: number; itemListElement: { item: Record<string, unknown> }[] }
assert.equal(list.numberOfItems, 2)
assert.equal(list.itemListElement[0].item.vehicleConfiguration, 'Denali Max Range')
assert.equal(list.itemListElement[0].item.itemCondition, 'https://schema.org/UsedCondition')
assert.deepEqual(list.itemListElement[0].item.mileageFromOdometer, { '@type': 'QuantitativeValue', value: 18248, unitCode: 'KMT' })
assert.equal((list.itemListElement[0].item.offers as { price: number }).price, 16890000)
assert.equal((list.itemListElement[1].item.offers as { price: number }).price, 16590000)
assert.equal(list.itemListElement[1].item.color, 'Hvítur')
const cars = JSON.stringify(list.itemListElement)
assert.equal(cars.includes('NewCondition'), false)
assert.equal(cars.includes('205'), false)
assert.equal(cars.includes('478'), false)
assert.equal(cars.includes('battery'), false)
assert.equal(JSON.stringify(ld).includes(faq[0].answer), true)
assert.equal(
  faq[5].answer,
  'Hringdu í 699 2011, eða sendu fyrirspurn af auglýsingunni. Viðskipti á edalkaup.is eru við Úranus ehf.',
)
assert.equal(faq[5].answer.includes('ehf..'), false)

const one = sierraOffersFromRows([deepOcean])
assert.equal(one.length, 1)
assert.equal(directAnswer(one).includes('16.590.000'), false)
assert.equal(directAnswer(one).includes('16.890.000'), true)
assert.equal(hubJsonLd(one, faqItems(one))['@graph'][1].numberOfItems, 1)

const gone = sierraOffersFromRows([{ ...deepOcean, status: 'sold' }, { ...white, price_isk: null }])
assert.equal(gone.length, 0)
assert.equal(directAnswer(gone).includes('16.890.000'), false)
assert.equal(directAnswer(gone).includes('til sölu hjá'), false)
assert.equal(specRows(gone).length, 0)
assert.equal(leadLine(gone), null)

console.log('sierraHub tests passed')
