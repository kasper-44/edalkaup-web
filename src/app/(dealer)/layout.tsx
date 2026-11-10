/** Volvo EX60 dealer hosts and /volvo-ex60/(diesel|hofdabilar|edalkaup). No Eðalkaup chrome. */
export default function DealerLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main-content" className="min-h-screen" tabIndex={-1}>{children}</main>
  )
}
