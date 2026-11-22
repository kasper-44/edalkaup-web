import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { formatIskNumber } from '@/lib/formatIsk'
import { jsonLdScript } from '@/lib/listingSeo'
import { pageMetadata } from '@/lib/pageSeo'
import { getPublicRows } from '@/lib/publicInventory'
import type { SpecCell } from '@/lib/sierraHub'
import {
  columnLabel,
  directAnswer,
  faqItems,
  hubJsonLd,
  HUB_PATH,
  HUB_TITLE,
  leadLine,
  RANGE_SOURCE_2025,
  RANGE_SOURCE_2026,
  sierraOffersFromRows,
  type SierraOffer,
  specRows,
  tablePrice,
} from '@/lib/sierraHub'
import { DEALER_PHONE_DISPLAY, DEALER_PHONE_TEL, SITE_ORIGIN } from '@/lib/site'

export const revalidate = 300

async function loadOffers(): Promise<SierraOffer[]> {
  try {
    return sierraOffersFromRows(await getPublicRows())
  } catch {
    return []
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const offers = await loadOffers()
  return pageMetadata(HUB_TITLE, directAnswer(offers), HUB_PATH)
}

function specCell(cell: SpecCell) {
  if (!cell.href) return cell.text
  const href = cell.href.startsWith(SITE_ORIGIN) ? cell.href.slice(SITE_ORIGIN.length) : cell.href
  return (
    <Link href={href} className="underline underline-offset-4 font-semibold">
      {cell.text}
    </Link>
  )
}

function PhoneText({ text }: { text: string }) {
  const parts = text.split(DEALER_PHONE_DISPLAY)
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${index}-${part.slice(0, 12)}`}>
          {part}
          {index < parts.length - 1 && (
            <a href={DEALER_PHONE_TEL} className="font-semibold underline underline-offset-4">
              {DEALER_PHONE_DISPLAY}
            </a>
          )}
        </span>
      ))}
    </>
  )
}

export default async function GmcSierraEvPage() {
  const offers = await loadOffers()
  const lead = leadLine(offers)
  const answer = directAnswer(offers)
  const faq = faqItems(offers)
  const rows = specRows(offers)
  const years = new Set(offers.map((offer) => offer.year))

  return (
    <div className="site-offset dealer-import">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(hubJsonLd(offers, faq)) }} />
      <article className="dealer-container py-12 sm:py-16">
        <p className="dealer-eyebrow mb-4">Eðalkaup</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.05em] leading-[1.08] max-w-4xl text-gray-900 dark:text-white">
          {HUB_TITLE}
        </h1>
        {lead && <p className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">{lead}</p>}
        <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mt-4 leading-relaxed">
          <PhoneText text={answer} />
        </p>

        {offers.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {offers.map((offer) => {
              const line = leadLine([offer])
              return (
              <Link key={offer.id} href={`/bilar/${offer.slug}`} className="dealer-card overflow-hidden flex flex-col hover:border-accent/30">
                {offer.image && (
                  <div className="relative aspect-[16/10]">
                    <Image src={offer.image} alt={`${offer.name}, ${offer.color}, ${offer.year}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1 gap-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{columnLabel(offer)}</h2>
                  <p className="text-gray-600 dark:text-slate-300">{offer.color}</p>
                  {line && <p className="text-sm font-semibold text-gray-900 dark:text-white">{line}</p>}
                  <p className="text-gray-600 dark:text-slate-300">
                    {formatIskNumber(offer.km)} km ({formatIskNumber(offer.miles)} mílur)
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-2">{tablePrice(offer)}</p>
                  <span className="mt-auto pt-4 text-accent-dark dark:text-accent font-semibold">Opna auglýsingu</span>
                </div>
              </Link>
              )
            })}
          </div>
        )}

        {rows.length > 0 && (
          <section className="mt-16" aria-labelledby="sierra-spec-heading">
            <h2 id="sierra-spec-heading" className="dealer-heading mb-6">Samanburður</h2>
            <div className="md:hidden space-y-6">
              {offers.map((offer, index) => (
                <section key={offer.id} className="border border-black/10 dark:border-white/10 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{columnLabel(offer)}</h3>
                  <dl className="space-y-3">
                    {rows.map((row) => (
                      <div key={row.label}>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">{row.label}</dt>
                        <dd className="text-gray-700 dark:text-slate-200 mt-1">{specCell(row.cells[index])}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto border border-black/10 dark:border-white/10 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-white dark:bg-navy-800">
                  <tr>
                    <th scope="col" className="p-4 font-semibold"><span className="sr-only">Atriði</span></th>
                    {offers.map((offer) => (
                      <th key={offer.id} scope="col" className="p-4 font-semibold text-gray-900 dark:text-white">{columnLabel(offer)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-black/10 dark:border-white/10">
                      <th scope="row" className="p-4 align-top font-semibold text-gray-900 dark:text-white whitespace-nowrap">{row.label}</th>
                      {row.cells.map((cell, index) => (
                        <td key={`${row.label}-${index}`} className="p-4 align-top text-gray-600 dark:text-slate-300">
                          {specCell(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-slate-400 leading-relaxed max-w-3xl">
              Drægni er GM-áætluð og stendur ekki í auglýsingunum. 2025 og 2026 eru aðskildar tölur, ekki EPA-tölur.
              {years.has(2025) && <> 2025: <a className="underline underline-offset-4" href={RANGE_SOURCE_2025.href} target="_blank" rel="noopener noreferrer">{RANGE_SOURCE_2025.label}</a>.</>}
              {years.has(2026) && <> 2026: <a className="underline underline-offset-4" href={RANGE_SOURCE_2026.href} target="_blank" rel="noopener noreferrer">{RANGE_SOURCE_2026.label}</a>. Kílómetratolan fyrir 2026 er umreikningur, 1 míla = 1,60934 km, ekki tala frá GMC.</>}
              {' '}760 hö er GM-áætlað í Max Power ham fyrir Max Range. Stærð rafhlöðunnar í kWst er ekki staðfest hér.
            </p>
          </section>
        )}

        <section className="mt-16 max-w-3xl" aria-labelledby="sierra-faq-heading">
          <h2 id="sierra-faq-heading" className="dealer-heading mb-6">Algengar spurningar</h2>
          {faq.map((item) => (
            <details key={item.question} className="border-b border-black/10 dark:border-white/10 py-5">
              <summary className="font-semibold cursor-pointer text-gray-900 dark:text-white">{item.question}</summary>
              <p className="mt-4 text-gray-600 dark:text-slate-300 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </section>
      </article>
    </div>
  )
}
