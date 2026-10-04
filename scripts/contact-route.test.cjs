const assert = require('node:assert/strict')
const Module = require('node:module')
let delivery = { data: null, error: { name: 'provider_failure' } }
let calls = 0
let sent
const load = Module._load
Module._load = function(name, ...args) {
  if (name === 'resend') return { Resend: class { constructor() { this.emails = { send: async (payload) => { calls++; sent = payload; return delivery } } } } }
  return load.call(this, name, ...args)
}
process.env.RESEND_API_KEY = 'local-mocked-test-key'
const { POST } = require('../src/app/api/contact/route.ts')
const request = (body) => new Request('http://localhost/api/contact', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(body) })
;(async () => {
  const invalid = await POST(request({ name:'Test' }))
  assert.equal(invalid.status, 400)
  assert.equal(calls, 0)
  const rejected = await POST(request({ name:'Test <script>', phone:'0000000', message:'Test & question' }))
  assert.equal(rejected.status, 502)
  assert.equal((await rejected.json()).ok, undefined)
  assert.equal(sent.html.includes('&lt;script&gt;'), true)
  assert.equal(sent.html.includes('Test &amp; question'), true)
  delivery = { data:{id:'fake'}, error:null }
  const accepted = await POST(request({ name:'Test', phone:'0000000', message:'Mocked only' }))
  assert.equal(accepted.status, 200)
  assert.equal((await accepted.json()).ok, true)
  console.log('Contact route validation, provider failure and mocked success passed; no email sent')
})().catch(error => { console.error(error); process.exitCode = 1 })
