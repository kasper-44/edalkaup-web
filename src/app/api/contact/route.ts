import { Resend } from 'resend'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { name, email, phone, message, car } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Vantar nafn, netfang eða skilaboð' }, { status: 400 })
    }

    const subject = car
      ? `Fyrirspurn um ${car} — ${name}`
      : `Ný fyrirspurn frá ${name}`

    await resend.emails.send({
      from: 'Eðalkaup Vefur <fyrirspurn@edalkaup.is>',
      to: 'sigurdur@edalkaup.is',
      replyTo: email,
      subject,
      html: `
        <h2>${subject}</h2>
        <p><strong>Nafn:</strong> ${name}</p>
        <p><strong>Netfang:</strong> ${email}</p>
        ${phone ? `<p><strong>Sími:</strong> ${phone}</p>` : ''}
        ${car ? `<p><strong>Bíll:</strong> ${car}</p>` : ''}
        <hr/>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Villa við sendingu' }, { status: 500 })
  }
}
