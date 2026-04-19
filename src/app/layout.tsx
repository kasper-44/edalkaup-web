import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ThemeProvider from '@/components/ThemeProvider'
import MessengerButton from '@/components/MessengerButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://edalkaup.is'),
  title: {
    default: 'Eðalkaup — Innflutningur á bílum frá Ameríku og Evrópu',
    template: '%s | Eðalkaup',
  },
  description: 'Eðalkaup flytur inn vandaða bíla frá Bandaríkjunum, Kanada og Evrópu til Íslands. Hluti af Úranus — einum stærsta bílainnflytjanda Íslands í yfir 25 ár.',
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    url: 'https://edalkaup.is',
    siteName: 'Eðalkaup',
    title: 'Eðalkaup — Innflutningur á bílum frá Ameríku og Evrópu',
    description: 'Vandaðir bílar frá Bandaríkjunum, Kanada og Evrópu. Yfir 25 ára reynsla.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <MessengerButton />
        </ThemeProvider>
      </body>
    </html>
  )
}
