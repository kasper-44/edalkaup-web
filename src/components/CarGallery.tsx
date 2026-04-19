'use client'

import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'

interface CarGalleryProps {
  images: string[]
  alt: string
}

export default function CarGallery({ images, alt }: CarGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only swipe if horizontal movement > vertical (avoid scroll conflict)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <>
      {/* Main image with swipe + arrows */}
      <div
        className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[selectedIndex]}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />

        {/* Tap to open lightbox overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={() => setLightboxOpen(true)}
        >
          <svg className="w-12 h-12 text-white/0 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>

        {/* Left/Right arrows (visible on hover desktop, always on mobile) */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/80 hover:text-white transition-all sm:opacity-0 sm:group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); goPrev() }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white/80 hover:text-white transition-all sm:opacity-0 sm:group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); goNext() }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(i) }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Photo counter */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                i === selectedIndex ? 'border-accent' : 'border-transparent hover:border-white/20'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="lightbox-overlay cursor-pointer"
          onClick={() => setLightboxOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white z-50"
                onClick={(e) => { e.stopPropagation(); goPrev() }}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white z-50"
                onClick={(e) => { e.stopPropagation(); goNext() }}
              >
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}

          {/* Dot indicators in lightbox */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(i) }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === selectedIndex ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <div className="relative max-w-5xl max-h-[85vh] w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[selectedIndex]}
              alt={alt}
              width={1200}
              height={800}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
