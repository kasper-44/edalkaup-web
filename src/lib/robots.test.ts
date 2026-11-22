import assert from 'node:assert/strict'
import robots from '@/app/robots'

const file = robots()
const rules = file.rules as { userAgent: string; allow: string; disallow: string[] }[]
assert.deepEqual(
  rules.map((rule) => rule.userAgent),
  ['*', 'Bingbot', 'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Applebot', 'ClaudeBot'],
)
for (const rule of rules) {
  assert.equal(rule.allow, '/')
  assert.deepEqual(rule.disallow, ['/api/'])
}
assert.equal(file.sitemap, 'https://www.edalkaup.is/sitemap.xml')
assert.equal(JSON.stringify(file).includes('msvalidate'), false)
assert.equal(JSON.stringify(file).includes('BingSiteAuth'), false)

console.log('robots tests passed')
