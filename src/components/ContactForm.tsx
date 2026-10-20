'use client'

import { useId, useState } from 'react'
import { DEALER_EMAIL, DEALER_PHONE_TEL } from '@/lib/site'

interface ContactFormProps {
  carTitle?: string
  carUrl?: string
  carVin?: string
  /** Compact homepage/modal form: name, phone, email and message. Email is always required. */
  variant?: 'full' | 'compact'
  source?: 'forsida' | 'gluggi' | 'bilur' | 'samband' | 'innflutningur'
  heading?: string
  headingId?: string
  reserveCorner?: boolean
}

function applyEmailValidity(input: HTMLInputElement) {
  input.setCustomValidity('')
  if (input.validity.valueMissing) {
    input.setCustomValidity('Vinsamlegast sláðu inn netfang.')
  } else if (input.validity.typeMismatch || input.validity.patternMismatch) {
    input.setCustomValidity('Netfang er ekki gilt.')
  }
}

export default function ContactForm({
  carTitle,
  carUrl,
  carVin,
  variant = 'full',
  source,
  heading,
  headingId,
  reserveCorner = false,
}: ContactFormProps) {
  const formId = useId()
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const compact = variant === 'compact'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)
    const inquiryCar = carTitle || ''

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email') || '',
          phone: formData.get('phone') || '',
          message: formData.get('message'),
          car: inquiryCar,
          carUrl: carUrl || '',
          carVin: carVin || '',
          source: source || '',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Villa við sendingu')
      }

      // Fire conversion events so ad platforms can optimise + retarget.
      // (no-ops when the pixel/tag isn't configured)
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any
        if (typeof w.fbq === 'function') {
          w.fbq('track', 'Lead', { content_name: inquiryCar || 'Almenn fyrirspurn' })
        }
        if (typeof w.gtag === 'function') {
          w.gtag('event', 'generate_lead', { item_name: inquiryCar || 'Almenn fyrirspurn' })
        }
      } catch {
        /* ignore tracking errors */
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Villa við sendingu')
    } finally {
      setSending(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-accent/30 bg-white p-8 text-center dark:bg-navy-800">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Takk fyrir!</h3>
        <p role="status" className="text-gray-500 dark:text-slate-400">Fyrirspurnin hefur verið send. Við höfum samband á opnunartíma.</p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-5 font-semibold underline underline-offset-4">Senda aðra fyrirspurn</button>
      </div>
    )
  }

  const title = heading || (carTitle ? `Fyrirspurn um ${carTitle}` : 'Sendu okkur fyrirspurn')

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={sending}
      className={`border border-black/10 bg-white dark:border-white/10 dark:bg-navy-800 ${
        compact ? 'space-y-3 p-5 sm:p-6' : 'space-y-5 p-6 sm:p-8'
      }`}
    >
      <h3
        id={headingId}
        className={`text-navy-900 dark:text-white ${compact ? 'text-2xl' : 'text-3xl'} ${reserveCorner ? 'pr-10' : ''}`}
      >
        {title}
      </h3>
      {compact && (
        <p className="hidden text-sm text-gray-500 dark:text-slate-400 sm:block">
          Láttu fylgja netfang og stutt skilaboð. Við svörum á opnunartíma.
        </p>
      )}

      {error && (
        <div role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
          <p>{error}</p>
          <p className="mt-2"><a href={DEALER_PHONE_TEL} className="font-semibold underline underline-offset-4">Hringja í 699 2011</a><span aria-hidden="true"> · </span><a href={`mailto:${DEALER_EMAIL}`} className="font-semibold underline underline-offset-4">Senda tölvupóst</a></p>
        </div>
      )}

      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 gap-4 sm:grid-cols-2'}`}>
        <div>
          <label htmlFor={`${formId}-name`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Nafn</label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            maxLength={120}
            className={`w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-3 text-base sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-accent transition-colors ${compact ? 'py-2.5' : 'px-4 py-3'}`}
            placeholder="Fullt nafn"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Sími</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            className={`w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-3 text-base sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-accent transition-colors ${compact ? 'py-2.5' : 'px-4 py-3'}`}
            placeholder="000 0000"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Netfang</label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          maxLength={200}
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          className={`w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-3 text-base sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-accent transition-colors ${compact ? 'py-2.5' : 'px-4 py-3'}`}
          placeholder="netfang@dæmi.is"
          onInvalid={(event) => applyEmailValidity(event.currentTarget)}
          onInput={(event) => applyEmailValidity(event.currentTarget)}
        />
      </div>

      {carTitle && (
        <div>
          <label htmlFor={`${formId}-car`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Bíll</label>
          <input
            type="text"
            id={`${formId}-car`}
            readOnly
            value={carTitle}
            className="w-full bg-gray-100 dark:bg-navy-700/50 border border-black/5 dark:border-white/5 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-slate-300"
          />
        </div>
      )}

      <div>
        <label htmlFor={`${formId}-message`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Skilaboð</label>
        <textarea
          id={`${formId}-message`}
          name="message"
          maxLength={4000}
          rows={compact ? 2 : 4}
          required
          className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-base sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:border-accent transition-colors resize-y min-h-20"
          placeholder={carTitle ? 'Spurning um búnað, verð eða framboð á þessum bíl?' : 'Hvaða auglýsta bíl viltu fá upplýsingar um?'}
        />
      </div>

      <p className="text-xs text-gray-600 dark:text-slate-300">Við notum upplýsingarnar til að svara fyrirspurninni þinni.</p>
      <button
        type="submit"
        disabled={sending}
        className={`w-full font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${compact ? 'py-2.5 text-sm' : 'py-3.5 text-base'}`}
      >
        {sending ? 'Sendi...' : 'Senda fyrirspurn'}
      </button>
    </form>
  )
}
