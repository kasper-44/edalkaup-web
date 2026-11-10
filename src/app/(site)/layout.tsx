import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MessengerButton from '@/components/MessengerButton'
import StickyCallBar from '@/components/StickyCallBar'
import InquiryModal from '@/components/InquiryModal'
import { jsonLdScript, siteDealerJsonLd } from '@/lib/listingSeo'
import { getPublicCars } from '@/lib/publicInventory'

async function liveCarCount(): Promise<number | null> {
  try {
    return (await getPublicCars()).length
  } catch {
    return null
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const carCount = await liveCarCount()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(siteDealerJsonLd()) }}
      />
      <Header liveCarCount={carCount} />
      <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
      <Footer />
      <StickyCallBar />
      <InquiryModal />
      <MessengerButton />
    </>
  )
}
