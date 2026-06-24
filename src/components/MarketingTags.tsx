'use client'

import Script from 'next/script'

/**
 * Marketing tracking: Meta (Facebook) Pixel + Google tag (gtag).
 *
 * IDs are read from public env vars so nothing is hard-coded:
 *   NEXT_PUBLIC_META_PIXEL_ID   e.g. "123456789012345"
 *   NEXT_PUBLIC_GA_ID           e.g. "G-XXXXXXX" (GA4) or "AW-XXXXXXX" (Google Ads)
 *
 * Each block only renders when its ID is present, so the site works with
 * neither, one, or both configured. Add the IDs in Vercel → Settings →
 * Environment Variables, then redeploy.
 */
export default function Analytics() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <>
      {/* Meta (Facebook) Pixel — retargeting + conversion tracking */}
      {pixelId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {/* Google tag (GA4 / Google Ads) */}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="google-tag" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}
    </>
  )
}
