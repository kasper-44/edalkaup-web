import assert from 'node:assert/strict'
import { parseListingDescription } from './listingDescription'

const xc60 = `+FACELIFT+
Á leiðinni til landsins.

VOLVO XC60 T6 PLUG-IN HYBRID AWD — Black Edition / Ultra

Verð: 10.590.000 kr

Helstu staðreyndir:
• Facelift / ný uppfærð útgáfa
• Litur: Svartur

Búnaður:
• Loftpúðafjöðrun
• Panorama glerþak`

const blocks = parseListingDescription(xc60)
assert.deepEqual(blocks[0], { type: 'chips', items: ['FACELIFT'] })
assert.equal(blocks.some((block) => block.type === 'paragraph' && block.text.startsWith('Verð:')), false)
assert.deepEqual(
  blocks.filter((block) => block.type === 'heading').map((block) => block.text),
  ['Helstu staðreyndir', 'Búnaður'],
)
assert.deepEqual(blocks.find((block) => block.type === 'list'), {
  type: 'list',
  items: ['Facelift / ný uppfærð útgáfa', 'Litur: Svartur'],
})
assert.equal(blocks.filter((block) => block.type === 'list').length, 2)
assert.equal(JSON.stringify(blocks).includes('+FACELIFT+'), false)

assert.deepEqual(parseListingDescription('Verð: 2.890.000 kr + VSK'), [])
assert.deepEqual(parseListingDescription('Verð: 590.000 kr.'), [])
assert.deepEqual(parseListingDescription('Verð: 4.990.000 kr. + VSK\n\nTilbúinn til notkunar.'), [
  { type: 'paragraph', text: 'Tilbúinn til notkunar.' },
])

const mixed = parseListingDescription('Búnaður / sérkenni:\n• Dráttarkrókur\nÞetta er stuttur texti.\n+FACELIFT+ í setningu.')
assert.equal(mixed[0]?.type, 'heading')
assert.equal(mixed[1]?.type, 'list')
assert.equal(mixed.some((block) => block.type === 'chips' && block.items.includes('FACELIFT')), true)
assert.equal(mixed.some((block) => block.type === 'paragraph' && block.text.includes('í setningu')), true)
assert.equal(mixed.some((block) => block.type === 'paragraph' && block.text.includes('+')), false)

assert.deepEqual(parseListingDescription('   '), [])
assert.deepEqual(parseListingDescription(null), [])

console.log('Listing description formatting passed')
