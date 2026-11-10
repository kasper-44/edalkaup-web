import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
import { getPublicCars } from '@/lib/publicInventory'

const inter = Inter({ subsets: ['latin'] })

// Same window as PUBLIC_CATALOG_REVALIDATE. Must stay a literal so Next can prerender.
export const revalidate = 300

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: 'Eðalkaup — Bílainnflutningur og bílar til sölu',
    template: '%s | Eðalkaup',
  },
  description: 'Eðalkaup sérhæfir sig í bílainnflutningi til Íslands. Skoðaðu auglýsta bíla, myndir, verð og búnað. Yfir 25 ára reynsla af bílainnflutningi.',
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    url: SITE_ORIGIN,
    siteName: 'Eðalkaup',
    title: 'Eðalkaup — Bílainnflutningur og bílar til sölu',
    description: 'Eðalkaup sérhæfir sig í bílainnflutningi til Íslands. Skoðaðu auglýsta bíla, myndir, verð og búnað. Yfir 25 ára reynsla af bílainnflutningi.',
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

async function liveCarCount(): Promise<number | null> {
  try {
    return (await getPublicCars()).length
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const carCount = await liveCarCount()

  return (
    <html lang="is" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdScript(siteDealerJsonLd()) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--site-header-offset)] focus:left-2 focus:z-50 focus:bg-white focus:text-navy-900 focus:p-3 focus:rounded-lg">Fara í efni síðunnar</a>
        <MarketingTags />
        <ThemeProvider>
          <Header liveCarCount={carCount} />
          <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
          <Footer />
          <StickyCallBar />
          <InquiryModal />
          <MessengerButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
