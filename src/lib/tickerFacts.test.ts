import assert from 'node:assert/strict'
import { tickerFacts } from './tickerFacts'

const facts = tickerFacts(12)
assert.deepEqual(
  facts.map((fact) => fact.text),
  [
    'Hringdu í 699 2011',
    'Bílar í sölu · 12',
    'Mán–Fös 09:00–17:00',
  ],
)
assert.equal(facts.some((fact) => /Laugavegur|Reykjavík/.test(fact.text)), false)
assert.equal(facts.find((fact) => fact.id === 'stock')?.live, true)
assert.equal(facts.find((fact) => fact.id === 'phone')?.phone, true)
assert.equal(facts.find((fact) => fact.id === 'stock')?.href, '/bilar')

const withoutCount = tickerFacts(null)
assert.equal(withoutCount.some((fact) => fact.id === 'stock'), false)
assert.equal(withoutCount[0]?.text, 'Hringdu í 699 2011')

assert.equal(tickerFacts(0).find((fact) => fact.id === 'stock')?.text, 'Bílar í sölu · 0')
assert.equal(tickerFacts(Number.NaN).some((fact) => fact.id === 'stock'), false)

const banned = /sýnis|uppboð|beinni|orkusjóð|ókeypis|besti|ábyrgð/i
for (const fact of tickerFacts(4)) {
  assert.equal(banned.test(fact.text), false, fact.text)
}
