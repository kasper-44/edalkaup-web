'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const PLAY_RETRY_DELAYS_MS = [150, 350, 700, 1200]

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function isVideoPlaying(video: HTMLVideoElement) {
  return !video.paused && !video.ended
}

function muteForAutoplay(video: HTMLVideoElement) {
  video.defaultMuted = true
  video.muted = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const soundOnRef = useRef(false)
  const cancelledRef = useRef(false)
  const playInFlightRef = useRef<Promise<void> | null>(null)
  const [soundOn, setSoundOn] = useState(false)

  const playWithRetries = useCallback(async (video: HTMLVideoElement) => {
    const attempt = async () => {
      if (!soundOnRef.current) {
        muteForAutoplay(video)
      }
      await video.play()
    }

    try {
      await attempt()
      return
    } catch {
      // First play() often rejects before the first frame is ready.
    }

    for (const delay of PLAY_RETRY_DELAYS_MS) {
      await sleep(delay)
      if (cancelledRef.current) return
      if (isVideoPlaying(video)) return
      try {
        await attempt()
        return
      } catch {
        // Keep retrying while the element is still mounted.
      }
    }
  }, [])

  const requestPlay = useCallback(() => {
    const video = videoRef.current
    if (!video || cancelledRef.current) return
    if (isVideoPlaying(video) || playInFlightRef.current) return

    const run = playWithRetries(video).finally(() => {
      if (playInFlightRef.current === run) {
        playInFlightRef.current = null
      }
    })
    playInFlightRef.current = run
  }, [playWithRetries])

  const toggleSound = () => {
    const video = videoRef.current
    const next = !soundOnRef.current
    soundOnRef.current = next
    setSoundOn(next)

    if (!video) return

    if (next) {
      video.muted = false
      video.volume = 1
    } else {
      muteForAutoplay(video)
    }

    void video.play().catch(() => {
      if (!next) return
      // Unmuted play can still fail on some browsers; keep the clip running muted.
      soundOnRef.current = false
      setSoundOn(false)
      muteForAutoplay(video)
      void video.play().catch(() => {})
    })
  }

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video) return

    cancelledRef.current = false
    muteForAutoplay(video)
    requestPlay()

    const onReady = () => requestPlay()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') requestPlay()
    }
    const onPageShow = () => requestPlay()

    video.addEventListener('loadeddata', onReady)
    video.addEventListener('canplay', onReady)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pageshow', onPageShow)

    let observer: IntersectionObserver | undefined
    if (section && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) requestPlay()
        },
        { threshold: 0.2 },
      )
      observer.observe(section)
    }

    return () => {
      cancelledRef.current = true
      playInFlightRef.current = null
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('canplay', onReady)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pageshow', onPageShow)
      observer?.disconnect()
    }
  }, [requestPlay])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[600px] max-h-[900px] flex items-end justify-center overflow-hidden bg-navy-900 pb-32"
    >
      {/* Video background — cover on mobile, full 16:9 scene on desktop */}
      <video
        ref={videoRef}
        autoPlay
        muted={!soundOn}
        defaultMuted={true}
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover md:object-contain"
        {...{ 'webkit-playsinline': 'true' }}
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

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Slökkva á hljóði' : 'Kveikja á hljóði'}
        className="absolute bottom-8 left-4 sm:left-8 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-navy-900/75 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition-all hover:border-accent/50 hover:bg-navy-900/90 hover:text-accent"
      >
        {soundOn ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11 5L6 9H3v6h3l5 4V5zM15.54 8.46a5 5 0 010 7.07M18.07 5.93a9 9 0 010 12.73"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M11 5L6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{soundOn ? 'Hljóð af' : 'Hljóð á'}</span>
      </button>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-400 dark:text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
