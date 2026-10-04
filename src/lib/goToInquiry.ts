export function openInquiryModal() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event('edalkaup:open-inquiry'))
}

/** Scroll to the on-page form when it exists; otherwise open the inquiry modal. */
export function goToInquiry() {
  const target = document.getElementById('fyrirspurn')
  if (target) {
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    target.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true })
    return
  }
  openInquiryModal()
}
