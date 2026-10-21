import Link from 'next/link'
import CallLink from '@/components/CallLink'
import LiveDot from '@/components/LiveDot'
import type { TickerFact } from '@/lib/tickerFacts'

function TickerSequence({ facts, hidden = false }: { facts: TickerFact[]; hidden?: boolean }) {
  return (
    <ul className={`flex shrink-0 items-center ${hidden ? 'ticker-copy-dup' : ''}`} aria-hidden={hidden || undefined}>
      {facts.map((fact) => (
        <li key={fact.id} className="flex items-center whitespace-nowrap">
          {fact.live ? (
            <span className="mx-3.5 inline-flex"><LiveDot /></span>
          ) : (
            <span className="mx-3.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light" aria-hidden="true" />
          )}
          {fact.phone ? (
            <CallLink placement="header" className="text-[13px] font-semibold tracking-wide text-white hover:text-accent-light">
              {fact.text}
            </CallLink>
          ) : fact.href ? (
            <Link href={fact.href} className="text-[13px] font-semibold tracking-wide text-white hover:text-accent-light">
              {fact.text}
            </Link>
          ) : (
            <span className="text-[13px] font-semibold tracking-wide">{fact.text}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function TickerBar({ facts }: { facts: TickerFact[] }) {
  return (
    <div className="ticker-viewport h-9 overflow-hidden bg-navy-900 text-white" role="region" aria-label="Upplýsingar">
      <div className="ticker-track flex h-full w-max items-center">
        <TickerSequence facts={facts} />
        <TickerSequence facts={facts} hidden />
      </div>
    </div>
  )
}
