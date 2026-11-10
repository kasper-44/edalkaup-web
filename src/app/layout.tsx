import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import { Analytics } from '@vercel/analytics/react'
import MarketingTags from '@/components/MarketingTags'
import { SITE_ORIGIN } from '@/lib/site'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-[var(--site-header-offset)] focus:left-2 focus:z-50 focus:bg-white focus:text-navy-900 focus:p-3 focus:rounded-lg">Fara í efni síðunnar</a>
        <MarketingTags />
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
