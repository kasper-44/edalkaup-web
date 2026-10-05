'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import type { Car } from '@/data/cars'
import CarCard from '@/components/CarCard'
import FilterSidebar from '@/components/FilterSidebar'
import ComparisonDialog from '@/components/ComparisonDialog'
import { useSavedCars } from '@/components/useSavedCars'
import { EMPTY_FILTERS, filterCars, sortCars, fuelLabel, parseInventoryFilters, SORTS, INVENTORY_CATEGORIES } from '@/lib/inventory'
import type { InventoryFilters, InventorySort } from '@/lib/inventory'
import { vehicleTitle } from '@/lib/listingSeo'

export default function Inventory({ cars, initialFilters = EMPTY_FILTERS, initialSort = 'newest', title = 'Bílar til sölu', intro = 'Skoðaðu úrvalið okkar og finndu bíl sem hentar þér.' }: { cars: Car[]; initialFilters?: InventoryFilters; initialSort?: InventorySort; title?: string; intro?: string }) {
  const [filters, setFilters] = useState(initialFilters)
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
  const reset = () => { setFilters({ ...EMPTY_FILTERS }); setSavedOnly(false); setSort('newest') }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams()
      for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value)
      if (sort !== 'newest') params.set('sort', sort)
      const query = params.toString()
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${query ? `?${query}` : ''}`)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [filters, sort])
  useEffect(() => {
    const onBack = () => {
      const params = Object.fromEntries(new URLSearchParams(window.location.search))
      setFilters(parseInventoryFilters(params))
      setSort(SORTS.includes(params.sort as InventorySort) ? params.sort as InventorySort : 'newest')
    }
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [])

  return <div className="pt-20 lg:pt-24 bg-gray-50 dark:bg-navy-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
      <div className="mb-8"><p className="text-accent-dark dark:text-accent text-xs font-semibold uppercase tracking-[0.2em] mb-3">Eðalkaup · Bílar til sölu</p><h1 className="text-4xl sm:text-5xl font-semibold tracking-[-.045em]">{title}</h1><p className="text-gray-600 dark:text-slate-300 mt-3 max-w-3xl leading-relaxed">{intro}</p></div>
      <nav aria-label="Bílaflokkar" className="flex flex-wrap gap-2 mb-7">
        <Link href="/bilar" className="inventory-chip">Allir bílar</Link>
        {INVENTORY_CATEGORIES.map((category) => <Link key={category.slug} href={`/bilar/flokkur/${category.slug}`} className="inventory-chip">{category.short}</Link>)}
      </nav>
      <div className="flex flex-col sm:flex-row gap-3 mb-7">
        <div className="flex-1"><label htmlFor="inventory-search" className="sr-only">Leita að bíl</label><input id="inventory-search" maxLength={100} type="search" value={filters.q} onChange={(e) => change('q', e.target.value)} placeholder="Leita eftir framleiðanda, gerð eða árgerð…" className="w-full bg-white dark:bg-navy-800 border border-black/15 dark:border-white/15 rounded-xl px-4 py-3.5 text-base" /></div>
        <button aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)} className="px-5 py-3 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-navy-800 font-medium">{savedOnly ? 'Sýna alla bíla' : `Vistaðir bílar (${ready ? savedCount : 0})`}</button>
        <button aria-expanded={showFilters} aria-controls="inventory-filters" onClick={() => setShowFilters(!showFilters)} className="lg:hidden px-5 py-3 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-navy-800 font-medium">{showFilters ? 'Fela síur' : 'Sýna síur'}</button>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div id="inventory-filters" className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}><FilterSidebar filters={filters} onFilterChange={change} onReset={reset} makes={makes} bodyTypes={bodyTypes} fuels={fuels} /></div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5"><p role="status" className="text-sm text-gray-600 dark:text-slate-300">Bílar: {results.length}{savedOnly ? ' · Vistaðir' : ''}</p>
            <select aria-label="Raða bílum" value={sort} onChange={(e) => setSort(e.target.value as InventorySort)} className="rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-navy-800 px-3 py-2.5 text-sm"><option value="newest">Nýjast fyrst</option><option value="price-low">Lægsta verð fyrst</option><option value="price-high">Hæsta verð fyrst</option><option value="year">Nýjasta árgerð fyrst</option><option value="mileage">Minnsti akstur fyrst</option></select>
          </div>
          {savedOnly && <p className="text-sm text-gray-600 dark:text-slate-300 mb-5">Vistaðir bílar eru geymdir í þessum vafra. Hér sjást aðeins bílar sem eru enn til sölu.</p>}
          {results.length ? <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">{results.map((car, index) => <CarCard key={car.id} car={car} priority={index < 3} actions={<>
            <button aria-pressed={saved.includes(car.id)} aria-label={`${saved.includes(car.id) ? 'Fjarlægja úr vistuðum' : 'Vista'}: ${vehicleTitle(car)}`} onClick={() => toggle(car.id)} className="flex-1 text-sm px-3 py-3 hover:bg-accent/10">{saved.includes(car.id) ? '♥ Vistaður' : '♡ Vista'}</button>
            <button aria-pressed={selected.includes(car.id)} disabled={!selected.includes(car.id) && selected.length >= 3} aria-label={`Bera saman: ${vehicleTitle(car)}`} onClick={() => setSelected((prev) => prev.includes(car.id) ? prev.filter((id) => id !== car.id) : [...prev, car.id].slice(0, 3))} className="flex-1 text-sm px-3 py-3 border-l border-black/10 dark:border-white/10 hover:bg-accent/10 disabled:opacity-40">{selected.includes(car.id) ? '✓ Valinn' : 'Bera saman'}</button>
          </>} />)}</div> : <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-navy-800 p-8 sm:p-12 text-center"><h2 className="text-xl font-bold mb-3">{savedOnly ? 'Engir vistaðir bílar fundust' : 'Engir bílar passa við leitina'}</h2><p className="text-gray-600 dark:text-slate-300 mb-6">Prófaðu færri síur eða hafðu samband um framboð á gerðunum okkar.</p><div className="flex flex-wrap justify-center gap-3"><button onClick={reset} className="px-5 py-3 rounded-xl bg-accent text-navy-900 font-semibold">Hreinsa síur</button><Link href="/hafa-samband" className="px-5 py-3 border border-black/15 dark:border-white/15 rounded-xl">Spyrja um framboð</Link></div></div>}
          <div className="mt-10 rounded-2xl border border-black/10 dark:border-white/10 p-6"><h2 className="font-bold text-lg">Spurning um framboð?</h2><p className="text-gray-600 dark:text-slate-300 mt-2 mb-4">Við leggjum áherslu á EV pallbíla, Volvo, Ford Explorer, Maxus og Toyota Sequoia.</p><Link href="/bilainnflutningur" className="text-accent-dark dark:text-accent font-semibold underline underline-offset-4">Skoða gerðirnar okkar →</Link></div>
        </div>
      </div>
      {comparedCars.length > 0 && <div className="fixed bottom-24 lg:bottom-5 left-4 right-4 lg:left-auto z-30 flex flex-wrap gap-3 items-center justify-center bg-navy-900 text-white border border-white/20 rounded-xl shadow-xl px-5 py-3"><p role="status" className="text-sm">{comparedCars.length}/3 bílar valdir</p><button disabled={comparedCars.length < 2} onClick={() => setCompareOpen(true)} className="bg-accent text-navy-900 rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50">Samanburður</button><button onClick={() => setSelected([])} className="text-sm underline">Hreinsa</button></div>}
      <ComparisonDialog cars={comparedCars} open={compareOpen} onClose={() => setCompareOpen(false)} />
    </div>
  </div>
}
