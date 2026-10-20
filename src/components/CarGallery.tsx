'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type TouchEvent } from 'react'
import { IconChevronLeft, IconChevronRight } from '@/components/Icons'

export default function CarGallery({ images, alt }: { images: string[]; alt: string }) {
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
  const key = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); next(1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); next(-1) }
  }
  const touchStart = (event: TouchEvent<HTMLElement>) => { start.current = { x: event.touches[0].clientX, y: event.touches[0].clientY } }
  const touchEnd = (event: TouchEvent<HTMLElement>) => {
    if (!start.current) return
    const dx = event.changedTouches[0].clientX - start.current.x
    const dy = event.changedTouches[0].clientY - start.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) next(dx < 0 ? 1 : -1)
    start.current = null
  }
  const arrowClass = 'absolute top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-navy-900 shadow-sm transition-colors hover:bg-white'
  return <div onKeyDown={key}>
    <div className="dealer-stage relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <button onClick={() => setOpen(true)} className="absolute inset-0 h-full w-full" aria-label={`Stækka mynd ${selected + 1} af ${images.length}: ${alt}`}>
        <Image key={images[selected]} src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="(max-width: 1024px) 100vw, 62vw" priority quality={85} className="dealer-fade object-contain" />
      </button>
      {images.length > 1 && <><button aria-label="Fyrri mynd" onClick={() => next(-1)} className={`${arrowClass} left-3`}><IconChevronLeft className="h-5 w-5" /></button><button aria-label="Næsta mynd" onClick={() => next(1)} className={`${arrowClass} right-3`}><IconChevronRight className="h-5 w-5" /></button></>}
      <span className="pointer-events-none absolute bottom-3 right-3 bg-navy-900/80 px-3 py-1.5 text-xs tracking-wide text-white" aria-live="polite">{selected + 1} / {images.length}</span>
    </div>
    {images.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto py-1" aria-label="Velja mynd">{images.map((image, index) => <button key={`${image}-${index}`} aria-label={`Sýna mynd ${index + 1}`} aria-pressed={index === selected} onClick={() => setSelected(index)} className={`relative h-16 w-24 shrink-0 overflow-hidden border sm:h-[4.5rem] sm:w-28 ${index === selected ? 'border-accent-dark dark:border-accent' : 'border-transparent opacity-80 hover:opacity-100'}`}><Image src={image} alt="" fill sizes="112px" className="object-cover" /></button>)}</div>}
    <dialog ref={dialog} aria-label={`Myndir af ${alt}`} onClose={() => setOpen(false)} className="m-auto h-[90svh] w-[95vw] max-w-6xl rounded-none border-0 bg-[#0c0b09] p-0 text-white backdrop:bg-black/85" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <div className="relative h-full w-full">
        <div className="absolute top-4 right-4 left-5 z-10 flex items-center justify-between gap-3"><p className="text-sm tracking-wide">Mynd {selected + 1} / {images.length}</p><button autoFocus onClick={() => setOpen(false)} className="bg-white px-4 py-3 font-semibold text-navy-900">Loka</button></div>
        <Image key={`open-${images[selected]}`} src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="95vw" quality={85} className="dealer-fade object-contain px-4 py-20 sm:px-16" />
        {images.length > 1 && <><button aria-label="Fyrri mynd í stækkuðum glugga" onClick={() => next(-1)} className={`${arrowClass} left-3`}><IconChevronLeft className="h-5 w-5" /></button><button aria-label="Næsta mynd í stækkuðum glugga" onClick={() => next(1)} className={`${arrowClass} right-3`}><IconChevronRight className="h-5 w-5" /></button></>}
      </div>
    </dialog>
  </div>
}
