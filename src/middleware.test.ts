import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { middleware } from './middleware'

const DESTINATION = 'https://www.edalkaup.is/volvo-ex60/edalkaup'

function respond(host: string, path: string) {
  const req = new NextRequest(new URL(path, 'https://example.test'), {
    headers: { host },
  })
  return middleware(req)
}

const dealerHosts = ['volvo-ex60-diesel.vercel.app', 'volvo-ex60-hofdabilar.vercel.app']
const dealerPaths = [
  '/',
  '/some/path?x=1',
  '/_next/static/x.js',
  '/_next/image',
  '/images/logo.png',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/volvo-ex60/diesel',
  '/volvo-ex60/hofdabilar',
  '/volvo-ex60/edalkaup',
  '/contact',
  '/some/path/',
]

for (const host of dealerHosts) {
  for (const path of dealerPaths) {
    const res = respond(host, path)
    assert.equal(res.status, 308, `${host} ${path} status`)
    assert.equal(res.headers.get('location'), DESTINATION, `${host} ${path} location`)
  }

  const cased = respond(host.toUpperCase(), '/some/path?x=1')
  assert.equal(cased.status, 308, `${host} case`)
  assert.equal(cased.headers.get('location'), DESTINATION)

  const withPort = respond(`${host}:443`, '/')
  assert.equal(withPort.status, 308, `${host} port`)
  assert.equal(withPort.headers.get('location'), DESTINATION)
}

const unaffected: Array<[string, string]> = [
  ['www.edalkaup.is', '/'],
  ['www.edalkaup.is', '/volvo-ex60/edalkaup'],
  ['www.edalkaup.is', '/bilainnflutningur'],
  ['www.edalkaup.is', '/_next/static/x.js'],
  ['edalkaup.is', '/'],
  ['constructor', '/'],
  ['toString', '/'],
  ['__proto__', '/'],
  ['volvo-ex60-diesel.vercel.app.evil.example', '/'],
  ['prefix-volvo-ex60-diesel.vercel.app', '/'],
]

for (const [host, path] of unaffected) {
  const res = respond(host, path)
  assert.equal(res.headers.get('location'), null, `${host} ${path} location`)
  assert.equal(res.status, 200, `${host} ${path} status`)
}

const filtered = respond('www.edalkaup.is', '/bilar?q=1')
assert.equal(filtered.status, 200)
assert.equal(filtered.headers.get('location'), null)
assert.equal(filtered.headers.get('x-robots-tag'), 'noindex, follow')

const plainInventory = respond('www.edalkaup.is', '/bilar')
assert.equal(plainInventory.headers.get('x-robots-tag'), null)
assert.equal(plainInventory.headers.get('location'), null)

console.log('dealer host redirect tests passed')
