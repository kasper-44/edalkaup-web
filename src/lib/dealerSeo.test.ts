import assert from 'node:assert/strict'
import { dealerCanonicalUrl, dealerPageMetadata, DEALER_SLUGS } from '@/lib/dealerSeo'
import { SITE_ORIGIN } from '@/lib/site'

const SITE_DESCRIPTION =
  'Eðalkaup sérhæfir sig í bílainnflutningi til Íslands. Skoðaðu auglýsta bíla, myndir, verð og búnað. Yfir 25 ára reynsla af bílainnflutningi.'

assert.equal(dealerCanonicalUrl('diesel'), 'https://volvo-ex60-diesel.vercel.app')
assert.equal(dealerCanonicalUrl('hofdabilar'), 'https://volvo-ex60-hofdabilar.vercel.app')
assert.equal(dealerCanonicalUrl('edalkaup'), `${SITE_ORIGIN}/volvo-ex60/edalkaup`)

for (const dealer of DEALER_SLUGS) {
  const metadata = dealerPageMetadata(dealer)
  const title = metadata.title
  const absolute = title && typeof title === 'object' && 'absolute' in title ? title.absolute : ''
  const description = typeof metadata.description === 'string' ? metadata.description : ''
  const og = metadata.openGraph
  const twitter = metadata.twitter
  const image = og && 'images' in og && Array.isArray(og.images) ? og.images[0] : null
  const imageUrl = image && typeof image === 'object' && 'url' in image ? String(image.url) : ''
  const blob = JSON.stringify(metadata)

  assert.equal(absolute?.includes('Volvo EX60'), true, dealer)
  assert.equal(absolute?.endsWith('| Eðalkaup'), false, dealer)
  assert.equal(description.includes('Volvo EX60'), true, dealer)
  assert.notEqual(description, SITE_DESCRIPTION, dealer)
  assert.equal(blob.includes('Eðalkaup'), false, dealer)
  assert.equal(blob.includes('Klaki'), false, dealer)
  assert.equal(blob.includes('Laugavegur'), false, dealer)
  assert.equal(blob.includes('opengraph-image'), false, dealer)
  assert.equal(imageUrl.endsWith('/images/ex60/hero.jpg'), true, dealer)
  assert.equal(og && 'url' in og ? og.url : null, dealerCanonicalUrl(dealer))
  assert.equal(metadata.alternates?.canonical, dealerCanonicalUrl(dealer))
  assert.equal(twitter && 'description' in twitter ? twitter.description : null, description)
  assert.equal(metadata.other?.['twitter:url'], dealerCanonicalUrl(dealer))
}

const diesel = dealerPageMetadata('diesel')
const hofdabilar = dealerPageMetadata('hofdabilar')
assert.equal(
  diesel.title && typeof diesel.title === 'object' && 'absolute' in diesel.title ? diesel.title.absolute : '',
  'Volvo EX60 Ultra — TWIN Performance | Diesel.is',
)
assert.equal(
  hofdabilar.title && typeof hofdabilar.title === 'object' && 'absolute' in hofdabilar.title
    ? hofdabilar.title.absolute
    : '',
  'Volvo EX60 Ultra — TWIN Performance | Höfðabílar',
)
assert.equal(diesel.openGraph && 'siteName' in diesel.openGraph ? diesel.openGraph.siteName : null, 'Diesel.is')
assert.equal(
  hofdabilar.openGraph && 'siteName' in hofdabilar.openGraph ? hofdabilar.openGraph.siteName : null,
  'Höfðabílar',
)

const edalkaup = dealerPageMetadata('edalkaup')
assert.equal(
  edalkaup.openGraph && 'siteName' in edalkaup.openGraph ? edalkaup.openGraph.siteName : null,
  'Volvo EX60',
)

console.log('dealer seo tests passed')
