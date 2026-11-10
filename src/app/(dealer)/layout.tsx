import type { Metadata } from 'next'

/** Volvo EX60 dealer hosts and /volvo-ex60/(diesel|hofdabilar|edalkaup). No Eðalkaup chrome. */
export const metadata: Metadata = {
  title: {
    absolute: 'Volvo EX60 Ultra — TWIN Performance',
    template: '%s',
  },
  description:
    'Volvo EX60 Ultra, TWIN Performance (tvímótora P12 AWD), árgerð 2027, Onyx Black að utan.',
}

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
  )
}
