'use client'

import { useState } from 'react'

interface ContactFormProps {
  carTitle?: string
}

export default function ContactForm({ carTitle }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Nafn</label>
          <input
            type="text"
            required
            className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="Fullt nafn"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Sími</label>
          <input
            type="tel"
            className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
            placeholder="000 0000"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1.5">Netfang</label>
        <input
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
          rows={4}
          className="w-full bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/10 rounded-lg px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-accent transition-colors resize-none"
          placeholder="Hvað getum við aðstoðað þig með?"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-colors"
      >
        Senda fyrirspurn
      </button>
    </form>
  )
}
