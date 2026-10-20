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

const phoneOnly = parseContactPayload({
  name: 'Anna',
  phone: '5551234',
  message: 'Er Grenadierinn enn laus?',
  source: 'forsida',
})
assert.equal(phoneOnly.ok, false)
if (!phoneOnly.ok) assert.equal(phoneOnly.error, 'Vantar netfang. Sláðu inn netfangið þitt svo við getum svarað þér.')

const compact = parseContactPayload({
  name: 'Anna',
  email: 'anna@example.com',
  phone: '5551234',
  message: 'Er Grenadierinn enn laus?',
  source: 'forsida',
})
assert.equal(compact.ok, true)
if (compact.ok) {
  assert.equal(compact.value.email, 'anna@example.com')
  assert.equal(compact.value.phone, '5551234')
  assert.equal(compact.value.sourceLabel, 'forsíða')
}

const importInquiry = parseContactPayload({ name: 'Anna', email: 'anna@example.com', message: 'Leita að bíl', source: 'innflutningur' })
assert.equal(importInquiry.ok, true)
if (importInquiry.ok) {
  assert.equal(importInquiry.value.phone, '')
  assert.equal(importInquiry.value.sourceLabel, 'bílainnflutningur')
}

const missingContact = parseContactPayload({ name: 'Anna', message: 'Halló' })
assert.equal(missingContact.ok, false)
if (!missingContact.ok) assert.equal(missingContact.error, 'Vantar netfang. Sláðu inn netfangið þitt svo við getum svarað þér.')

const badEmail = parseContactPayload({ name: 'Anna', email: 'ekki-netfang', message: 'Halló' })
assert.equal(badEmail.ok, false)
if (!badEmail.ok) assert.equal(badEmail.error, 'Netfang er ekki gilt. Athugaðu að það sé t.d. nafn@dæmi.is')

const trimmed = parseContactPayload({ name: 'Anna', email: '  anna@example.com  ', message: 'Halló' })
assert.equal(trimmed.ok, true)
if (trimmed.ok) assert.equal(trimmed.value.email, 'anna@example.com')

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
