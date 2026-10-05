import assert from 'node:assert/strict'
import { contactInbox, parseContactPayload } from '@/lib/contactRequest'
import { clickToCallHref, DEALER_PHONE_TEL } from '@/lib/site'

const previousTo = process.env.CONTACT_EMAIL_TO
const previousTel = process.env.NEXT_PUBLIC_CALL_TRACKING_TEL

delete process.env.CONTACT_EMAIL_TO
delete process.env.NEXT_PUBLIC_CALL_TRACKING_TEL

assert.equal(contactInbox(), 'sigurdur@edalkaup.is')
assert.equal(clickToCallHref(), DEALER_PHONE_TEL)

process.env.CONTACT_EMAIL_TO = '  sigurdur@edalkaup.is  '
assert.equal(contactInbox(), 'sigurdur@edalkaup.is')

process.env.NEXT_PUBLIC_CALL_TRACKING_TEL = 'tel:+3545550000'
assert.equal(clickToCallHref(), 'tel:+3545550000')

process.env.NEXT_PUBLIC_CALL_TRACKING_TEL = 'not-a-tel'
assert.equal(clickToCallHref(), DEALER_PHONE_TEL)

const compact = parseContactPayload({
  name: 'Anna',
  phone: '5551234',
  message: 'Er Grenadierinn enn laus?',
  source: 'forsida',
})
assert.equal(compact.ok, true)
if (compact.ok) {
  assert.equal(compact.value.email, '')
  assert.equal(compact.value.sourceLabel, 'forsíða')
}

const importInquiry = parseContactPayload({ name: 'Anna', phone: '5551234', message: 'Leita að bíl', source: 'innflutningur' })
assert.equal(importInquiry.ok, true)
if (importInquiry.ok) assert.equal(importInquiry.value.sourceLabel, 'bílainnflutningur')

assert.equal(parseContactPayload({ name: 'Anna', message: 'Halló' }).ok, false)
assert.equal(parseContactPayload({ name: 'Anna', email: 'ekki-netfang', message: 'Halló' }).ok, false)

const full = parseContactPayload({
  name: 'Anna',
  email: 'anna@example.com',
  message: 'Halló',
  source: 'samband',
})
assert.equal(full.ok, true)
if (full.ok) assert.equal(full.value.sourceLabel, 'hafa samband')

if (previousTo === undefined) delete process.env.CONTACT_EMAIL_TO
else process.env.CONTACT_EMAIL_TO = previousTo

if (previousTel === undefined) delete process.env.NEXT_PUBLIC_CALL_TRACKING_TEL
else process.env.NEXT_PUBLIC_CALL_TRACKING_TEL = previousTel

console.log('contactRequest tests passed')
