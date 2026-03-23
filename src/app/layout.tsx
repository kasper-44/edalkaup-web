import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://edalkaup.is'),
  title: {
    default: 'Eðalkaup — Innflutningur á bílum frá Ameríku',
    template: '%s | Eðalkaup',
  },
  description: 'Eðalkaup flytur inn vandaða bíla frá Bandaríkjunum og Kanada til Íslands. Hluti af Úranus — einum stærsta bílainnflytjanda Íslands í yfir 25 ár.',
  openGraph: {
    type: 'website',
    locale: 'is_IS',
    url: 'https://edalkaup.is',
    siteName: 'Eðalkaup',
    title: 'Eðalkaup — Innflutningur á bílum frá Ameríku',
    description: 'Vandaðir bílar frá Bandaríkjunum og Kanada. Yfir 25 ára reynsla.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
