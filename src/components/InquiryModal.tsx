'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import ContactForm from '@/components/ContactForm'

const HIDE_CHROME = /^\/volvo-ex60\/(diesel|hofdabilar|edalkaup)$/

export default function InquiryModal() {
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('edalkaup:open-inquiry', onOpen)
    return () => window.removeEventListener('edalkaup:open-inquiry', onOpen)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

  if (HIDE_CHROME.test(pathname) || pathname.startsWith('/stjorn')) return null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="m-auto w-[95vw] max-w-lg rounded-2xl border-0 max-h-[calc(100svh-2rem)] overflow-y-auto bg-transparent p-0 text-inherit backdrop:bg-black/60"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        const dialog = dialogRef.current
        if (!dialog) return
        const rect = dialog.getBoundingClientRect()
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom
        if (!inside) setOpen(false)
      }}
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Loka glugga"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-black/5 dark:text-slate-300 dark:hover:bg-white/10"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <ContactForm
          variant="compact"
          source="gluggi"
          heading="Sendu okkur fyrirspurn"
          headingId={titleId}
          reserveCorner
        />
      </div>
    </dialog>
  )
}
