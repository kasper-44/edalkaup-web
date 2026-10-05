'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import CallLink from '@/components/CallLink'

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => {
      if (!video) return
      if (preference.matches) video.pause()
      else void video.play().catch(() => {})
    }
    syncMotion()
    preference.addEventListener('change', syncMotion)
    return () => preference.removeEventListener('change', syncMotion)
  }, [])

  return (
    <section className="bg-navy-900 text-white pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr]">
        <div className="min-w-0 px-5 sm:px-8 py-12 sm:py-16 lg:py-20 lg:pr-14">
          <p className="text-accent text-xs font-semibold uppercase tracking-[0.22em] mb-6">Eðalkaup · Bílainnflutningur í yfir 25 ár</p>
          <h1 className="text-3xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] max-w-2xl">
            Bílainnflutningur.<br /><span className="text-accent">Við finnum bílinn þinn.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mt-6">
            Vandaðir bílar frá Bandaríkjunum, Kanada og Evrópu. Við aðstoðum þig frá leit og kaupum til afhendingar á Íslandi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link href="/bilar" className="inline-flex justify-center items-center gap-3 px-6 py-4 bg-accent text-navy-900 rounded-xl font-semibold hover:bg-accent-light transition-colors">Skoða bíla til sölu <span aria-hidden="true">→</span></Link>
            <Link href="/bilainnflutningur" className="inline-flex justify-center items-center px-6 py-4 border border-white/25 rounded-xl font-semibold text-white hover:bg-white/10 transition-colors">Finna bíl fyrir mig</Link>
          </div>
          <p className="mt-5 text-sm text-slate-400">
            Viltu ræða málið beint? <CallLink placement="hero" className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:text-accent">Hringdu í 699 2011</CallLink>
          </p>
          <div className="mt-9 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-6">
            <div><p className="text-2xl sm:text-3xl font-bold text-white">25+</p><p className="text-xs sm:text-sm text-slate-400 mt-1">ára reynsla</p></div>
            <div><p className="text-2xl sm:text-3xl font-bold text-white">500+</p><p className="text-xs sm:text-sm text-slate-400 mt-1">bílar afhentir</p></div>
            <div><p className="text-sm sm:text-base font-semibold text-white leading-tight">Frá leit til afhendingar</p><p className="text-xs sm:text-sm text-slate-400 mt-1">Við sjáum um ferlið</p></div>
          </div>
        </div>
        <div className="relative min-w-0 min-h-72 sm:min-h-96 lg:min-h-full overflow-hidden bg-navy-800">
          <video ref={videoRef} muted loop playsInline preload="metadata" poster="/images/cars/tundra-002/01.jpg" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} className="absolute inset-0 h-full w-full object-cover" aria-label="Bílar hjá Eðalkaup">
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
            <p className="text-sm font-medium text-white">Bandaríkin · Kanada · Evrópa</p>
            <button type="button" onClick={() => {
              const video = videoRef.current
              if (!video) return
              if (video.paused) void video.play().catch(() => {})
              else video.pause()
            }} className="shrink-0 rounded-full border border-white/35 bg-navy-900/60 px-4 py-2.5 text-xs font-semibold text-white hover:bg-navy-900" aria-label={playing ? 'Gera hlé á myndbandi' : 'Spila myndband'}>{playing ? 'Gera hlé' : 'Spila'}</button>
          </div>
        </div>
      </div>
    </section>
  )
}
