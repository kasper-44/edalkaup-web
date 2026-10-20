'use client'

import { useEffect, useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)')
    const update = () => {
      setCanNativeShare(query.matches && typeof navigator.share === 'function')
    }
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400',
    )
  }

  const markCopied = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  // Copy while the click is still a user gesture. Awaiting the async clipboard
  // API first drops that gesture, so the fallback then fails in some browsers.
  const copyLink = () => {
    const field = document.createElement('textarea')
    field.value = url
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.top = '0'
    field.style.left = '0'
    field.style.width = '1px'
    field.style.height = '1px'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.focus()
    field.select()
    field.setSelectionRange(0, url.length)
    let copiedNow = false
    try {
      copiedNow = document.execCommand('copy')
    } catch {
      copiedNow = false
    }
    field.remove()
    if (copiedNow) {
      markCopied()
      return
    }
    if (!navigator.clipboard?.writeText) return
    void navigator.clipboard.writeText(url).then(markCopied).catch(() => {})
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      // The visitor dismissed the share sheet.
    }
  }

  const buttonClass =
    'flex min-h-12 w-full items-center justify-center gap-2 border border-black/15 px-4 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-accent hover:text-accent-dark dark:border-white/20 dark:text-white dark:hover:text-accent'

  return (
    <div className="grid grid-cols-1 gap-2">
      <button type="button" onClick={shareOnFacebook} className={buttonClass}>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07z" />
        </svg>
        Deila á Facebook
      </button>
      <button type="button" onClick={copyLink} className={buttonClass} aria-live="polite">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        {copied ? 'Afritað!' : 'Afrita hlekk'}
      </button>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} className={buttonClass}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Deila
        </button>
      )}
    </div>
  )
}
