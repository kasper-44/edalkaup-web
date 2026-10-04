'use client'
import Link from 'next/link'
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="pt-28 pb-20 max-w-xl mx-auto px-5 text-center"><h1 className="text-3xl font-bold mb-4">Ekki tókst að hlaða síðuna</h1><p className="text-gray-600 dark:text-slate-300 mb-7">Reyndu aftur eða hafðu samband við okkur í síma 699 2011.</p><div className="flex flex-wrap gap-3 justify-center"><button onClick={reset} className="rounded-xl px-5 py-3 bg-accent text-navy-900 font-semibold">Reyna aftur</button><Link href="/hafa-samband" className="rounded-xl px-5 py-3 border border-black/15 dark:border-white/15">Hafa samband</Link></div></div>
}
