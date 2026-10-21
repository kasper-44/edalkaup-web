'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react'

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {direction === 'left' ? <path d="m15 18-6-6 6-6" /> : <path d="m9 18 6-6-6-6" />}
    </svg>
  )
}

export default function CarGallery({ images, alt, overlay }: { images: string[]; alt: string; overlay?: ReactNode }) {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const start = useRef<{ x: number; y: number } | null>(null)
  const next = useCallback((direction: number) => setSelected((index) => (index + direction + images.length) % images.length), [images.length])
  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal()
    else if (!open && dialog.current?.open) dialog.current.close()
    if (!open) return
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = old }
  }, [open])
  const key = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); next(1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); next(-1) }
  }
  const touchStart = (event: React.TouchEvent) => { start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }
  const touchEnd = (event: React.TouchEvent) => {
    if (!start.current) return
    const dx = event.changedTouches[0].clientX - start.current.x
    const dy = event.changedTouches[0].clientY - start.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) next(dx < 0 ? 1 : -1)
    start.current = null
  }
  const arrowClass = 'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/80 text-white hover:bg-navy-900 md:flex'
  const counter = `${selected + 1}/${images.length}`
  return <div onKeyDown={key}>
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 lg:aspect-auto lg:h-[min(38vh,400px)] dark:bg-navy-800" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      {overlay}
      <button onClick={() => setOpen(true)} className="absolute inset-0 h-full w-full" aria-label={`Stækka mynd ${selected + 1} af ${images.length}: ${alt}`}>
        <Image src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="100vw" priority className="object-contain" />
      </button>
      {images.length > 1 && <><button type="button" aria-label="Fyrri mynd" onClick={() => next(-1)} className={`${arrowClass} left-3`}><Chevron direction="left" /></button><button type="button" aria-label="Næsta mynd" onClick={() => next(1)} className={`${arrowClass} right-3`}><Chevron direction="right" /></button></>}
      <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-navy-900/80 px-3 py-1.5 text-xs font-semibold text-white" aria-live="polite">{counter}</span>
    </div>
    {images.length > 1 && <div className="mx-auto mt-3 hidden max-w-7xl gap-2 overflow-x-auto px-4 py-2 lg:flex lg:px-8" aria-label="Velja mynd">{images.map((image, index) => <button type="button" key={`${image}-${index}`} aria-label={`Sýna mynd ${index + 1}`} aria-pressed={index === selected} onClick={() => setSelected(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${index === selected ? 'border-accent-dark dark:border-accent' : 'border-transparent'}`}><Image src={image} alt="" fill sizes="96px" className="object-cover" /></button>)}</div>}
    <dialog ref={dialog} aria-label={`Myndir af ${alt}`} onClose={() => setOpen(false)} className="m-auto h-[90svh] w-[95vw] max-w-6xl rounded-xl border-0 bg-navy-900 p-0 text-white backdrop:bg-black/85" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <div className="relative h-full w-full">
        <div className="absolute top-4 right-4 left-5 z-10 flex items-center justify-between gap-3"><p className="text-sm">Mynd {counter}</p><button type="button" autoFocus onClick={() => setOpen(false)} className="rounded-lg bg-navy-800 px-4 py-3 font-semibold">Loka</button></div>
        <Image src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="95vw" className="object-contain px-4 py-20 md:px-12" />
        {images.length > 1 && <><button type="button" aria-label="Fyrri mynd í stækkuðum glugga" onClick={() => next(-1)} className={`${arrowClass} left-2 !flex`}><Chevron direction="left" /></button><button type="button" aria-label="Næsta mynd í stækkuðum glugga" onClick={() => next(1)} className={`${arrowClass} right-2 !flex`}><Chevron direction="right" /></button></>}
      </div>
    </dialog>
  </div>
}
