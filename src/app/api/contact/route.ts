import { escapeHtml, contactInbox, parseContactPayload } from '@/lib/contactRequest'
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const parsed = parseContactPayload(await req.json())
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 })
    }

    const { name, email, phone, message, car, carUrl, carVin, sourceLabel } = parsed.value
    const where = sourceLabel ? ` (${sourceLabel})` : ''
    const subject = car
      ? `Fyrirspurn um ${car} — ${name}${where}`
      : `Ný fyrirspurn frá ${name}${where}`

    if (!process.env.RESEND_API_KEY) {
      console.error('Contact form error: RESEND_API_KEY is not set')
      return NextResponse.json({ error: 'Villa við sendingu' }, { status: 500 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const safeUrl = /^https:\/\/(www\.)?edalkaup\.is\//.test(carUrl) ? carUrl : ''

    await resend.emails.send({
      from: 'Eðalkaup Vefur <fyrirspurn@edalkaup.is>',
      to: contactInbox(),
      ...(email ? { replyTo: email } : {}),
      subject,
      html: `
        <h2>${escapeHtml(subject)}</h2>
        <p><strong>Nafn:</strong> ${escapeHtml(name)}</p>
        ${email ? `<p><strong>Netfang:</strong> ${escapeHtml(email)}</p>` : ''}
        ${phone ? `<p><strong>Sími:</strong> ${escapeHtml(phone)}</p>` : ''}
        ${car ? `<p><strong>Bíll:</strong> ${escapeHtml(car)}${carVin ? ` (VIN: ${escapeHtml(carVin)})` : ''}${safeUrl ? ` — <a href="${escapeHtml(safeUrl)}">Skoða auglýsingu</a>` : ''}</p>` : ''}
        <hr/>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Villa við sendingu' }, { status: 500 })
  }
}
