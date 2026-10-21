import { formatPrice } from '@/lib/formatIsk'
import type { ListingRibbonKind } from '@/lib/listingRibbon'

const RIBBONS: Record<ListingRibbonKind, { label: string; plate: string; dot: string }> = {
  reduced: {
    label: 'VERÐ LÆKKAÐ',
    plate: 'bg-[#FFD400] text-black',
    dot: 'bg-black',
  },
  transit: {
    label: 'Á LEIÐINNI',
    plate: 'bg-[#0057FF] text-white',
    dot: 'bg-white',
  },
}

export default function ListingRibbons({
  kinds,
  size = 'card',
}: {
  kinds: ListingRibbonKind[]
  size?: 'card' | 'hero'
}) {
  if (kinds.length === 0) return null
  const text =
    size === 'hero'
      ? 'px-3 py-1.5 text-xs sm:text-sm'
      : 'px-2.5 py-1 text-[11px] sm:text-xs'

  return (
    <div className="pointer-events-none absolute left-2 top-3 z-10 flex flex-col items-start gap-2 sm:left-3">
      {kinds.map((kind) => {
        const style = RIBBONS[kind]
        return (
          <span
            key={kind}
            className={`inline-flex -rotate-6 items-center gap-1.5 rounded-md font-black uppercase leading-none tracking-wide shadow-[0_8px_18px_rgba(0,0,0,0.28)] ${text} ${style.plate}`}
          >
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className={`listing-ribbon-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${style.dot}`} />
            </span>
            {style.label}
          </span>
        )
      })}
    </div>
  )
}

export function StruckPrice({
  current,
  previous,
  reduced,
  className,
  previousClassName = 'text-sm font-semibold text-gray-500 line-through decoration-2 dark:text-slate-400',
  emptyLabel,
}: {
  current: number | null | undefined
  previous?: number | null
  reduced: boolean
  className: string
  previousClassName?: string
  emptyLabel?: string
}) {
  const showPrevious =
    reduced &&
    typeof previous === 'number' &&
    previous > 0 &&
    typeof current === 'number' &&
    current > 0 &&
    previous > current

  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <p className={className}>{formatPrice(current, emptyLabel)}</p>
      {showPrevious && <p className={previousClassName}>{formatPrice(previous)}</p>}
    </div>
  )
}
