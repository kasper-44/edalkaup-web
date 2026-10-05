import { track } from '@vercel/analytics'

export type CallPlacement = 'header' | 'sticky_bar' | 'hero' | 'home_cta' | 'footer' | 'car_detail' | 'contact' | 'about'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

/**
 * `click_to_call` for Vercel Analytics, plus a dataLayer/gtag signal.
 * If NEXT_PUBLIC_GA_ID is unset, MarketingTags does not load Google and this
 * installs a queue-only gtag stub. No measurement ID is invented here.
 */
export function trackClickToCall(placement: CallPlacement) {
  try {
    track('click_to_call', { placement })
  } catch {
    // `track` throws in non-browser dev/test. Clicks only happen in the browser.
  }

  if (typeof window === 'undefined') return

  const w = window as AnalyticsWindow
  w.dataLayer = w.dataLayer || []

  if (typeof w.gtag !== 'function') {
    // Queue-only stand-in. Matches the gtag snippet shape without loading Google.
    w.gtag = (...args: unknown[]) => {
      w.dataLayer?.push(args)
    }
  }

  w.dataLayer.push({ event: 'click_to_call', placement })
  w.gtag('event', 'click_to_call', { placement })
}
