/**
 * Manual IndexNow ping for www.edalkaup.is.
 * Dry-run unless `--send`. Always exits 0. Not part of build or CI.
 *
 *   node scripts/indexnow-ping.mjs
 *   node scripts/indexnow-ping.mjs --send
 */
import fs from 'node:fs'

const HOST = 'www.edalkaup.is'
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const SITEMAP = `https://${HOST}/sitemap.xml`

function fail(message) {
  console.error(message)
}

function readKey() {
  const source = fs.readFileSync(new URL('../src/lib/indexnow.ts', import.meta.url), 'utf8')
  const match = source.match(/export const INDEXNOW_KEY = '([0-9a-zA-Z-]{8,128})'/)
  if (!match) throw new Error('INDEXNOW_KEY is missing from src/lib/indexnow.ts')
  const key = match[1]
  const body = fs.readFileSync(new URL(`../public/${key}.txt`, import.meta.url), 'utf8')
  if (body !== key) throw new Error(`public/${key}.txt must contain exactly the key`)
  return key
}

function urlsFromSitemap(xml) {
  const origin = `https://${HOST}`
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/gi)]
    .map((match) => match[1].trim())
    .filter((url) => url === origin || url.startsWith(`${origin}/`))
}

async function main() {
  const send = process.argv.includes('--send')
  const key = readKey()
  const response = await fetch(SITEMAP, { signal: AbortSignal.timeout(20000) })
  if (!response.ok) throw new Error(`sitemap responded ${response.status}`)
  const urlList = urlsFromSitemap(await response.text())
  const payload = {
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  }
  console.log(JSON.stringify({ mode: send ? 'send' : 'dry-run', urlCount: urlList.length, payload }, null, 2))
  if (!send) return
  const posted = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  })
  console.log(JSON.stringify({ status: posted.status, body: await posted.text() }))
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error))).finally(() => {
  process.exit(0)
})
