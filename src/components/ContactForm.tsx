'use client'

import { useState } from 'react'

interface ContactFormProps {
  carTitle?: string
}

export default function ContactForm({ carTitle }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

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
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          car: carTitle || '',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Villa við sendingu')
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

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8 space-y-5">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {carTitle ? `Fyrirspurn um ${carTitle}` : 'Sendu okkur fyrirspurn'}
      </h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Nafn</label>
          <input
            name="name"
            type="text"
            required
            className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="Fullt nafn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Sími</label>
          <input
            name="phone"
            type="tel"
            className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="000 0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Netfang</label>
        <input
          name="email"
          type="email"
          required
          className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
          placeholder="netfang@dæmi.is"
        />
      </div>

      {carTitle && (
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Bíll</label>
          <input
            type="text"
            readOnly
            value={carTitle}
            className="w-full bg-gray-100 dark:bg-navy-700/50 border border-black/5 dark:border-white/5 rounded-lg px-4 py-3 text-sm text-gray-600 dark:text-slate-300"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Skilaboð</label>
        <textarea
          name="message"
          rows={4}
          required
          className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors resize-none"
          placeholder="Hvað getum við aðstoðað þig með?"
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full py-3.5 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? 'Sendi...' : 'Senda fyrirspurn'}
      </button>
    </form>
  )
}
