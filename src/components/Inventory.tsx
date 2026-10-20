'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Car } from '@/data/cars'
import CarCard from '@/components/CarCard'
import FilterSidebar from '@/components/FilterSidebar'
import ComparisonDialog from '@/components/ComparisonDialog'
import { useSavedCars } from '@/components/useSavedCars'
import { EMPTY_FILTERS, filterCars, sortCars, fuelLabel, parseInventoryFilters, SORTS, INVENTORY_CATEGORIES, activeInventoryFilters } from '@/lib/inventory'
import type { InventoryFilters, InventorySort } from '@/lib/inventory'
import { vehicleTitle } from '@/lib/listingSeo'
import { IconArrowRight, IconCheck, IconClose, IconHeart } from '@/components/Icons'

export default function Inventory({ cars, initialFilters = EMPTY_FILTERS, initialSort = 'newest', title = 'Bílar til sölu', intro = 'Skoðaðu úrvalið okkar og finndu bíl sem hentar þér.' }: { cars: Car[]; initialFilters?: InventoryFilters; initialSort?: InventorySort; title?: string; intro?: string }) {
  const pathname = usePathname()
  const [filters, setFilters] = useState(initialFilters)
  const [urlReady, setUrlReady] = useState(false)
  const [sort, setSort] = useState<InventorySort>(initialSort)
  const [showFilters, setShowFilters] = useState(false)
  const [savedOnly, setSavedOnly] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const { saved, ready, toggle } = useSavedCars()
  const makes = useMemo(() => [...new Set(cars.map((car) => car.make))].sort(), [cars])
  const bodyTypes = useMemo(() => [...new Set(cars.map((car) => car.bodyType))].sort(), [cars])
  const fuels = useMemo(() => [...new Set(cars.map((car) => fuelLabel(car.fuelType)))].sort(), [cars])
  const results = useMemo(() => sortCars(filterCars(cars, filters).filter((car) => !savedOnly || saved.includes(car.id)), sort), [cars, filters, sort, savedOnly, saved])
  const comparedCars = cars.filter((car) => selected.includes(car.id))
  const savedCount = cars.filter((car) => saved.includes(car.id)).length
  const change = (key: keyof InventoryFilters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }))
  const activeFilters = activeInventoryFilters(filters)
  const reset = () => { setFilters({ ...EMPTY_FILTERS }); setSavedOnly(false); setSort('newest') }

  useEffect(() => {
    if (!urlReady) return
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value)
      if (sort !== 'newest') params.set('sort', sort)
      const query = params.toString()
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [filters, sort, urlReady])
  useEffect(() => {
    const onBack = () => {
      const params = Object.fromEntries(new URLSearchParams(window.location.search))
      setFilters(parseInventoryFilters(params))
      setSort(SORTS.includes(params.sort as InventorySort) ? params.sort as InventorySort : 'newest')
    }
    // A cached page may mount with older server props after browser Back.
    // Restore its current URL before any filter effect can overwrite it.
    onBack()
    setUrlReady(true)
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [])

  return <div className="pt-16 lg:pt-20">
    <div className="dealer-container py-12 pb-32 sm:py-16">
      <div className="mb-10"><p className="dealer-eyebrow mb-4">Eðalkaup · Bílar til sölu</p><h1 className="text-4xl sm:text-6xl">{title}</h1><p className="mt-4 max-w-3xl leading-relaxed text-[#5c564c] dark:text-slate-300">{intro}</p></div>
      <nav aria-label="Bílaflokkar" className="flex flex-wrap gap-2 mb-7">
        <Link href="/bilar" onClick={reset} aria-current={pathname === '/bilar' ? 'page' : undefined} className="inventory-chip aria-[current=page]:border-accent-dark aria-[current=page]:bg-accent/10">Allir bílar</Link>
        {INVENTORY_CATEGORIES.map((category) => <Link key={category.slug} href={`/bilar/flokkur/${category.slug}`} onClick={reset} aria-current={pathname === `/bilar/flokkur/${category.slug}` ? 'page' : undefined} className="inventory-chip aria-[current=page]:border-accent-dark aria-[current=page]:bg-accent/10">{category.short}</Link>)}
      </nav>
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="flex-1"><label htmlFor="inventory-search" className="sr-only">Leita að bíl</label><input id="inventory-search" maxLength={100} type="search" value={filters.q} onChange={(e) => change('q', e.target.value)} placeholder="Leita eftir framleiðanda, gerð eða árgerð…" className="dealer-input" /></div>
        <button aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)} className="min-h-[3.25rem] border border-black/15 bg-white px-5 py-3 font-medium dark:border-white/15 dark:bg-navy-800">{savedOnly ? 'Sýna alla bíla' : `Vistaðir bílar (${ready ? savedCount : 0})`}</button>
        <button aria-expanded={showFilters} aria-controls="inventory-filters" onClick={() => setShowFilters(!showFilters)} className="min-h-[3.25rem] border border-black/15 bg-white px-5 py-3 font-medium lg:hidden dark:border-white/15 dark:bg-navy-800">{showFilters ? 'Fela síur' : 'Sýna síur'}</button>
      </div>
      {activeFilters.length > 0 && <div aria-label="Virkar síur" className="flex flex-wrap items-center gap-2 mb-6">
        {activeFilters.map(({ key, label }) => <button key={key} type="button" onClick={() => change(key, '')} aria-label={`Fjarlægja síu: ${label}`} className="inline-flex min-h-11 items-center gap-2 border border-accent-dark/30 bg-accent/10 px-3 py-2 text-sm dark:border-accent/40">{label}<IconClose className="h-3.5 w-3.5" /></button>)}
        <button type="button" onClick={reset} className="px-3 py-2 text-sm font-semibold underline underline-offset-4">Hreinsa síur</button>
      </div>}
      <div className="flex flex-col lg:flex-row gap-8">
        <div id="inventory-filters" className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}><FilterSidebar filters={filters} onFilterChange={change} onReset={reset} makes={makes} bodyTypes={bodyTypes} fuels={fuels} /></div>
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-[#5c564c] dark:text-slate-300">Bílar: {results.length}{savedOnly ? ' · Vistaðir' : ''}</p>
            <select aria-label="Raða bílum" value={sort} onChange={(e) => setSort(e.target.value as InventorySort)} className="min-h-12 border border-black/15 bg-white px-3 py-2.5 text-sm dark:border-white/15 dark:bg-navy-800"><option value="newest">Nýjast fyrst</option><option value="price-low">Lægsta verð fyrst</option><option value="price-high">Hæsta verð fyrst</option><option value="year">Nýjasta árgerð fyrst</option><option value="mileage">Minnsti akstur fyrst</option></select>
          </div>
          {savedOnly && <p className="text-sm text-gray-600 dark:text-slate-300 mb-5">Vistaðir bílar eru geymdir í þessum vafra. Hér sjást aðeins bílar sem eru enn til sölu.</p>}
          {results.length ? <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">{results.map((car, index) => <CarCard key={car.id} car={car} priority={index < 3} actions={<>
            <button aria-pressed={saved.includes(car.id)} aria-label={`${saved.includes(car.id) ? 'Fjarlægja úr vistuðum' : 'Vista'}: ${vehicleTitle(car)}`} onClick={() => toggle(car.id)} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 px-3 py-3 text-sm hover:bg-accent/10">{saved.includes(car.id) ? <><IconHeart filled /> Vistaður</> : <><IconHeart /> Vista</>}</button>
            <button aria-pressed={selected.includes(car.id)} disabled={!selected.includes(car.id) && selected.length >= 3} aria-label={`Bera saman: ${vehicleTitle(car)}`} onClick={() => setSelected((prev) => prev.includes(car.id) ? prev.filter((id) => id !== car.id) : [...prev, car.id].slice(0, 3))} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border-l border-black/10 px-3 py-3 text-sm hover:bg-accent/10 disabled:opacity-40 dark:border-white/10">{selected.includes(car.id) ? <><IconCheck /> Valinn</> : 'Bera saman'}</button>
          </>} />)}</div> : <div className="border border-black/10 bg-white p-8 text-center sm:p-12 dark:border-white/10 dark:bg-navy-800"><h2 className="mb-3 text-3xl">{savedOnly ? 'Engir vistaðir bílar fundust' : 'Engir bílar passa við leitina'}</h2><p className="mb-6 text-[#5c564c] dark:text-slate-300">{savedOnly ? 'Vistaðu bíla með hjartatákninu. Ef þú hefur þegar vistað bíla, prófaðu að hreinsa síurnar.' : 'Prófaðu að fjarlægja síur eða breyta leitarorðinu. Hér birtast aðeins bílar sem við auglýsum núna.'}</p><div className="flex flex-wrap justify-center gap-3"><button onClick={reset} className="bg-accent px-5 py-3 font-semibold text-navy-900">Hreinsa síur</button><Link href="/hafa-samband" className="border border-black/15 px-5 py-3 dark:border-white/15">Spyrja um framboð</Link></div></div>}
          <div className="mt-12 border border-black/10 bg-white p-6 sm:p-8 dark:border-white/10 dark:bg-navy-800"><h2 className="text-3xl">Spurning um framboð?</h2><p className="mt-3 mb-5 text-[#5c564c] dark:text-slate-300">Hafðu samband um auglýstan bíl til að staðfesta framboð og bóka skoðun.</p><Link href="/hafa-samband" className="inline-flex items-center gap-2 font-semibold text-accent-dark underline decoration-accent/60 underline-offset-4 dark:text-accent">Hafa samband <IconArrowRight /></Link></div>
        </div>
      </div>
      {comparedCars.length > 0 && <div className="fixed bottom-24 lg:bottom-5 left-4 right-4 lg:left-auto z-30 flex flex-wrap gap-3 items-center justify-center bg-navy-900 text-white border border-white/20 rounded-xl shadow-xl px-5 py-3"><p role="status" className="text-sm">{comparedCars.length}/3 bílar valdir</p><button disabled={comparedCars.length < 2} onClick={() => setCompareOpen(true)} className="bg-accent text-navy-900 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50">Samanburður</button><button onClick={() => setSelected([])} className="text-sm underline">Hreinsa</button></div>}
      <ComparisonDialog cars={comparedCars} open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  </div>
}
