'use client'
import type { InventoryFilters } from '@/lib/inventory'

interface Props {
  filters: InventoryFilters
  onFilterChange: (key: keyof InventoryFilters, value: string) => void
  onReset: () => void
  makes: string[]
  bodyTypes: string[]
  fuels: string[]
}
const control = 'w-full min-w-0 bg-gray-50 dark:bg-navy-700 border border-black/10 dark:border-white/15 rounded-lg px-3 py-2.5 text-base sm:text-sm text-gray-900 dark:text-white'
export default function FilterSidebar({ filters, onFilterChange, onReset, makes, bodyTypes, fuels }: Props) {
  const options = [{ key: 'make', label: 'Framleiðandi', values: makes }, { key: 'bodyType', label: 'Tegund', values: bodyTypes }, { key: 'fuel', label: 'Eldsneyti', values: fuels }] as const
  const ranges = [{ label: 'Árgerð', min: 'minYear', max: 'maxYear' }, { label: 'Verð (kr.)', min: 'minPrice', max: 'maxPrice' }] as const
  return <aside className="bg-white dark:bg-navy-800 rounded-2xl border border-black/10 dark:border-white/10 p-5 space-y-5 lg:sticky lg:top-24">
    <h2 className="text-lg font-bold">Sía niðurstöður</h2>
    {options.map(({ key, label, values }) => <div key={key}><label htmlFor={`filter-${key}`} className="block text-sm font-medium mb-2">{label}</label>
      <select id={`filter-${key}`} value={filters[key]} onChange={(e) => onFilterChange(key, e.target.value)} className={control}><option value="">Allt</option>{values.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    </div>)}
    {ranges.map(({ label, min, max }) => <fieldset key={label}><legend className="text-sm font-medium mb-2">{label}</legend><div className="grid grid-cols-2 gap-2">
      <input type="number" min="0" aria-label={`${label} frá`} placeholder="Frá" value={filters[min]} onChange={(e) => onFilterChange(min, e.target.value)} className={control} />
      <input type="number" min="0" aria-label={`${label} til`} placeholder="Til" value={filters[max]} onChange={(e) => onFilterChange(max, e.target.value)} className={control} />
    </div></fieldset>)}
    <div><label htmlFor="filter-mileage" className="block text-sm font-medium mb-2">Hámarksakstur (km)</label><input id="filter-mileage" type="number" min="0" step="1000" placeholder="T.d. 50.000" value={filters.maxMileage} onChange={(e) => onFilterChange('maxMileage', e.target.value)} className={control} /></div>
    <button type="button" onClick={onReset} className="w-full py-2.5 text-sm font-medium border border-black/15 dark:border-white/15 rounded-lg hover:bg-gray-50 dark:hover:bg-navy-700">Hreinsa allar síur</button>
  </aside>
}
