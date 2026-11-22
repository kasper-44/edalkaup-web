import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { INDEXNOW_HOST, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION } from '@/lib/indexnow'

const body = fs.readFileSync(path.join(process.cwd(), 'public', `${INDEXNOW_KEY}.txt`), 'utf8')
assert.equal(body, INDEXNOW_KEY)
assert.match(INDEXNOW_KEY, /^[0-9a-f-]{36}$/)
assert.equal(INDEXNOW_HOST, 'www.edalkaup.is')
assert.equal(INDEXNOW_KEY_LOCATION, `https://www.edalkaup.is/${INDEXNOW_KEY}.txt`)
const script = fs.readFileSync(path.join(process.cwd(), 'scripts', 'indexnow-ping.mjs'), 'utf8')
assert.equal(script.includes('https://api.indexnow.org/indexnow'), true)
assert.equal(script.includes('url === origin'), true)
assert.equal(script.includes("host: HOST"), true)
assert.equal(script.includes('process.exit(0)'), true)

console.log('indexnow tests passed')
