'use client'

interface FilterSidebarProps {
  filters: {
    make: string
    bodyType: string
    minPrice: string
    maxPrice: string
    minYear: string
    maxYear: string
  }
  onFilterChange: (key: string, value: string) => void
  makes: string[]
  bodyTypes: string[]
}

export default function FilterSidebar({ filters, onFilterChange, makes, bodyTypes }: FilterSidebarProps) {
  return (
    <aside className="bg-navy-800 rounded-2xl border border-white/5 p-6 space-y-6">
      <h2 className="text-lg font-bold text-white">Sía niðurstöður</h2>

      {/* Make */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Framleiðandi</label>
        <select
          value={filters.make}
          onChange={(e) => onFilterChange('make', e.target.value)}
          className="w-full bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
        >
          <option value="">Allir</option>
          {makes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Tegund</label>
        <select
          value={filters.bodyType}
          onChange={(e) => onFilterChange('bodyType', e.target.value)}
          className="w-full bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
        >
          <option value="">Allar</option>
          {bodyTypes.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Árgerð</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Frá"
            value={filters.minYear}
            onChange={(e) => onFilterChange('minYear', e.target.value)}
            className="bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Til"
            value={filters.maxYear}
            onChange={(e) => onFilterChange('maxYear', e.target.value)}
            className="bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Verð (kr.)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Frá"
            value={filters.minPrice}
            onChange={(e) => onFilterChange('minPrice', e.target.value)}
            className="bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
          />
          <input
            type="number"
            placeholder="Til"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            className="bg-navy-700 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          onFilterChange('make', '')
          onFilterChange('bodyType', '')
          onFilterChange('minPrice', '')
          onFilterChange('maxPrice', '')
          onFilterChange('minYear', '')
          onFilterChange('maxYear', '')
        }}
        className="w-full py-2.5 text-sm font-medium text-slate-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-colors"
      >
        Hreinsa síu
      </button>
    </aside>
  )
}
