import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import MessengerButton from '@/components/MessengerButton'
import StickyCallBar from '@/components/StickyCallBar'
import InquiryModal from '@/components/InquiryModal'
import { Analytics } from '@vercel/analytics/react'
import MarketingTags from '@/components/MarketingTags'
import { jsonLdScript, siteDealerJsonLd } from '@/lib/listingSeo'
import { SITE_ORIGIN } from '@/lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Eðalkaup — Bílar til sölu',
    template: '%s | Eðalkaup',
  },
  description: 'Bílar til sölu hjá Eðalkaup. Skoðaðu myndir, verð og búnað og hafðu samband um auglýsta bíla. Yfir 25 ára reynsla og persónuleg þjónusta.',
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    url: SITE_ORIGIN,
    siteName: 'Eðalkaup',
    title: 'Eðalkaup — Bílar til sölu',
    description: 'Bílar til sölu hjá Eðalkaup. Skoðaðu myndir, verð og búnað og hafðu samband um auglýsta bíla. Yfir 25 ára reynsla og persónuleg þjónusta.',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  icons: { icon: { url: '/logo.svg', type: 'image/svg+xml' } },
}

const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch(e){}
})();
`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hideChrome = (await headers()).get('x-hide-site-chrome') === '1'

  return (
    <html lang="is" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {!hideChrome && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLdScript(siteDealerJsonLd()) }}
          />
        )}
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-navy-900 focus:p-3 focus:rounded-lg">Fara í efni síðunnar</a>
        <MarketingTags />
        <ThemeProvider>
          {!hideChrome && <Header />}
          <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
          {!hideChrome && <Footer />}
          {!hideChrome && <StickyCallBar />}
          {!hideChrome && <InquiryModal />}
          {!hideChrome && <MessengerButton />}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
