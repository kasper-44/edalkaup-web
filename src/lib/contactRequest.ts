import { DEALER_EMAIL } from '@/lib/site'

const SOURCES: Record<string, string> = {
  forsida: 'forsíða',
  innflutningur: 'bílainnflutningur',
  gluggi: 'gluggi',
  bilur: 'bílur',
  samband: 'hafa samband',
}

export type ContactPayload = {
  name: string
  email: string
  phone: string
  message: string
  car: string
  carUrl: string
  carVin: string
  sourceLabel: string
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function text(value: unknown, max: number): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

export function contactInbox(): string {
  const configured = process.env.CONTACT_EMAIL_TO?.trim()
  return configured || DEALER_EMAIL
}

export function parseContactPayload(
  body: unknown,
): { ok: true; value: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Ógild fyrirspurn' }
  }

  const raw = body as Record<string, unknown>
  const name = text(raw.name, 120)
  const email = text(raw.email, 200)
  const phone = text(raw.phone, 40)
  const message = text(raw.message, 4000)
  const car = text(raw.car, 160)
  const carUrl = text(raw.carUrl, 300)
  const carVin = text(raw.carVin, 32)
  const sourceKey = text(raw.source, 40)
  const sourceLabel = SOURCES[sourceKey] ?? ''

  if (!name || !message) {
    return { ok: false, error: 'Vantar nafn eða skilaboð' }
  }
  if (!email) {
    return { ok: false, error: 'Vantar netfang. Sláðu inn netfangið þitt svo við getum svarað þér.' }
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'Netfang er ekki gilt. Athugaðu að það sé t.d. nafn@dæmi.is' }
  }

  return {
    ok: true,
    value: { name, email, phone, message, car, carUrl, carVin, sourceLabel },
  }
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
