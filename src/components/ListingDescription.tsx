import { parseListingDescription } from '@/lib/listingDescription'

export default function ListingDescription({ text }: { text: string }) {
  const blocks = parseListingDescription(text)
  if (blocks.length === 0) return null

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Lýsing</h2>
      <div className="space-y-4 text-gray-700 dark:text-slate-300 leading-relaxed">
        {blocks.map((block, index) => {
          if (block.type === 'chips') {
            return (
              <div key={`chips-${index}`} className="flex flex-wrap gap-2">
                {block.items.map((item, itemIndex) => (
                  <span
                    key={`${item}-${itemIndex}`}
                    className="inline-flex items-center rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-dark dark:text-accent"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )
          }
          if (block.type === 'heading') {
            return (
              <h3 key={`heading-${index}`} className="pt-2 text-sm font-semibold tracking-wide text-gray-900 dark:text-white">
                {block.text}
              </h3>
            )
          }
          if (block.type === 'list') {
            return (
              <ul key={`list-${index}`} className="space-y-1.5 pl-5 list-disc marker:text-accent-dark dark:marker:text-accent">
                {block.items.map((item, itemIndex) => (
                  <li key={`${itemIndex}-${item}`}>{item}</li>
                ))}
              </ul>
            )
          }
          return <p key={`paragraph-${index}`}>{block.text}</p>
        })}
      </div>
    </div>
  )
}
