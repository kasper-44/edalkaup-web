'use client'

import { useId, useState } from 'react'

interface ContactFormProps {
  carTitle?: string
  carUrl?: string
  carVin?: string
  /** Compact homepage/modal form: name, phone, and message. Email stays on the full form. */
  variant?: 'full' | 'compact'
  source?: 'forsida' | 'gluggi' | 'bilur' | 'samband'
  heading?: string
  headingId?: string
  reserveCorner?: boolean
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

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email') || '',
          phone: formData.get('phone') || '',
          message: formData.get('message'),
          car: carTitle || '',
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
          w.fbq('track', 'Lead', { content_name: carTitle || 'Almenn fyrirspurn' })
        }
        if (typeof w.gtag === 'function') {
          w.gtag('event', 'generate_lead', { item_name: carTitle || 'Almenn fyrirspurn' })
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
      <div className="bg-white dark:bg-navy-800 rounded-2xl border border-accent/20 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Takk fyrir!</h3>
        <p className="text-gray-500 dark:text-slate-400">Við verðum í sambandi fljótlega.</p>
      </div>
    )
  }

  const title = heading || (carTitle ? `Fyrirspurn um ${carTitle}` : 'Sendu okkur fyrirspurn')

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={sending}
      className={`bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl shadow-black/10 ${
        compact ? 'p-4 sm:p-5 space-y-3' : 'p-6 sm:p-8 space-y-5'
      }`}
    >
      <h3
        id={headingId}
        className={`font-bold text-gray-900 dark:text-white ${compact ? 'text-lg' : 'text-xl'} ${reserveCorner ? 'pr-10' : ''}`}
      >
        {title}
      </h3>
      {compact && (
        <p className="hidden text-sm text-gray-500 dark:text-slate-400 sm:block">
          Nafn og sími nægja. Við svörum á opnunartíma.
        </p>
      )}

      {error && (
        <div role="alert" className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
          {error}
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
            className={`w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors ${compact ? 'py-2.5' : 'px-4 py-3'}`}
            placeholder="Fullt nafn"
          />
        </div>
        <div>
          <label htmlFor={`${formId}-phone`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Sími</label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            required={compact}
            autoComplete="tel"
            maxLength={40}
            className={`w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors ${compact ? 'py-2.5' : 'px-4 py-3'}`}
            placeholder="000 0000"
          />
        </div>
      </div>

      {!compact && (
        <div>
          <label htmlFor={`${formId}-email`} className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Netfang</label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="netfang@dæmi.is"
          />
        </div>
      )}

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
          className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors resize-y min-h-20"
          placeholder={compact ? 'Hvaða bíl leitarðu að?' : 'Hvað getum við aðstoðað þig með?'}
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
