'use client'

import { usePathname } from 'next/navigation'
import CallLink from '@/components/CallLink'
import { goToInquiry } from '@/lib/goToInquiry'

const HIDE_CHROME = /^\/volvo-ex60\/(diesel|hofdabilar|edalkaup)$/

export default function StickyCallBar() {
  const pathname = usePathname()
  if (HIDE_CHROME.test(pathname) || pathname.startsWith('/stjorn')) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] dark:border-white/10 dark:bg-navy-900/95 lg:hidden">
      <div className="flex gap-2 px-3 py-2.5">
        <CallLink
          placement="sticky_bar"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 py-3 text-sm font-semibold text-navy-900 hover:bg-accent-light"
        >
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Hringja 699 2011
        </CallLink>
        <button
          type="button"
          onClick={goToInquiry}
          className="flex-1 rounded-xl border border-black/10 px-3 py-3 text-sm font-semibold text-gray-900 hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/5"
        >
          Senda fyrirspurn
        </button>
      </div>
    </div>
  )
}
