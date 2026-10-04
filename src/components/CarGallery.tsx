'use client'
import Image from 'next/image'
import { useState, useRef, useEffect, useCallback } from 'react'

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
  const arrowClass = 'absolute top-1/2 -translate-y-1/2 bg-navy-900/80 text-white rounded-full w-11 h-11 flex items-center justify-center text-2xl hover:bg-navy-900'
  return <div onKeyDown={key}>
    <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100 dark:bg-navy-800" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <button onClick={() => setOpen(true)} className="absolute inset-0 w-full h-full" aria-label={`Stækka mynd ${selected + 1} af ${images.length}: ${alt}`}>
        <Image src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="(max-width: 1024px) 100vw, 66vw" priority className="object-contain" />
      </button>
      {images.length > 1 && <><button aria-label="Fyrri mynd" onClick={() => next(-1)} className={`${arrowClass} left-3`}>‹</button><button aria-label="Næsta mynd" onClick={() => next(1)} className={`${arrowClass} right-3`}>›</button></>}
      <span className="absolute bottom-3 right-3 bg-navy-900/80 text-white text-xs px-3 py-2 rounded-full pointer-events-none" aria-live="polite">{selected + 1} / {images.length}</span>
    </div>
    {images.length > 1 && <div className="flex gap-2 mt-3 overflow-x-auto py-2" aria-label="Velja mynd">{images.map((image, index) => <button key={`${image}-${index}`} aria-label={`Sýna mynd ${index + 1}`} aria-pressed={index === selected} onClick={() => setSelected(index)} className={`relative w-20 h-14 sm:w-24 sm:h-16 shrink-0 rounded-lg overflow-hidden border-2 ${index === selected ? 'border-accent-dark dark:border-accent' : 'border-transparent'}`}><Image src={image} alt="" fill sizes="96px" className="object-cover" /></button>)}</div>}
    <dialog ref={dialog} aria-label={`Myndir af ${alt}`} onClose={() => setOpen(false)} className="m-auto w-[95vw] max-w-6xl h-[90svh] p-0 border-0 rounded-xl bg-navy-900 text-white backdrop:bg-black/85" onTouchStart={touchStart} onTouchEnd={touchEnd}>
      <div className="relative w-full h-full">
        <div className="absolute top-4 left-5 right-4 z-10 flex justify-between items-center gap-3"><p className="text-sm">Mynd {selected + 1} / {images.length}</p><button autoFocus onClick={() => setOpen(false)} className="rounded-lg bg-navy-800 px-4 py-3 font-semibold">Loka</button></div>
        <Image src={images[selected]} alt={`${alt} — mynd ${selected + 1}`} fill sizes="95vw" className="object-contain px-12 py-20" />
        {images.length > 1 && <><button aria-label="Fyrri mynd í stækkuðum glugga" onClick={() => next(-1)} className={`${arrowClass} left-2`}>‹</button><button aria-label="Næsta mynd í stækkuðum glugga" onClick={() => next(1)} className={`${arrowClass} right-2`}>›</button></>}
      </div>
    </dialog>
  </div>
}
