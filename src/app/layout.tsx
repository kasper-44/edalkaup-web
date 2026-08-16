import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import MessengerButton from '@/components/MessengerButton'
import { Analytics } from '@vercel/analytics/react'
import MarketingTags from '@/components/MarketingTags'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://edalkaup.is'),
  title: {
    default: 'Eðalkaup — Innflutningur á bílum frá Ameríku og Evrópu',
    template: '%s | Eðalkaup',
  },
  description: 'Eðalkaup er dótturfyrirtæki Úranus, sem er einn stærsti bílainnflytjandi Íslands í yfir 25 ár. Við sérhæfum okkur í innflutningi vandaðra bíla frá Bandaríkjunum, Kanada og Evrópu — ökutæki sem ekki eru fáanleg á íslenskum markaði.',
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    url: 'https://edalkaup.is',
    siteName: 'Eðalkaup',
    title: 'Eðalkaup — Innflutningur á bílum frá Ameríku og Evrópu',
    description: 'Eðalkaup er dótturfyrirtæki Úranus, sem er einn stærsti bílainnflytjandi Íslands í yfir 25 ár. Við sérhæfum okkur í innflutningi vandaðra bíla frá Bandaríkjunum, Kanada og Evrópu — ökutæki sem ekki eru fáanleg á íslenskum markaði.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <MarketingTags />
        <ThemeProvider>
          {!hideChrome && <Header />}
          <main className="min-h-screen">{children}</main>
          {!hideChrome && <Footer />}
          {!hideChrome && <MessengerButton />}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
