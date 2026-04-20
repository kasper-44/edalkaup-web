'use client'

import Link from 'next/link'

export default function HeroVideo() {
  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-end justify-center overflow-hidden pb-32">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white dark:from-navy-900/70 dark:via-navy-900/40 dark:to-navy-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/5 dark:from-navy-900/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-[0.2em] uppercase text-accent border border-accent/30 rounded-full bg-accent/5">
          Yfir 25 ára reynsla
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
          Við finnum{' '}
          <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            bílinn þinn
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Eðalkaup flytur inn vandaða bíla frá Bandaríkjunum, Kanada og Evrópu. Einn stærsti bílainnflytjandi Íslands í yfir 25 ár.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/bilar"
            className="px-8 py-4 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-all hover:scale-105"
          >
            Skoða bíla
          </Link>
          <Link
            href="/hafa-samband"
            className="px-8 py-4 text-base font-semibold border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all"
          >
            Hafa samband
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400 dark:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
