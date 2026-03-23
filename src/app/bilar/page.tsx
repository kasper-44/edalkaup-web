'use client'

import { useState, useMemo } from 'react'
import { cars } from '@/data/cars'
import CarCard from '@/components/CarCard'
import FilterSidebar from '@/components/FilterSidebar'

export default function BilarPage() {
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
  })

  const [showFilters, setShowFilters] = useState(false)

  const makes = useMemo(() => [...new Set(cars.map((c) => c.make))].sort(), [])
  const bodyTypes = useMemo(() => [...new Set(cars.map((c) => c.bodyType))].sort(), [])

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (filters.make && car.make !== filters.make) return false
      if (filters.bodyType && car.bodyType !== filters.bodyType) return false
      if (filters.minPrice && car.price < Number(filters.minPrice)) return false
      if (filters.maxPrice && car.price > Number(filters.maxPrice)) return false
      if (filters.minYear && car.year < Number(filters.minYear)) return false
      if (filters.maxYear && car.year > Number(filters.maxYear)) return false
      return true
    })
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-2">Birgðir</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Bílar til sölu</h1>
          <p className="text-slate-400 mt-2">{filteredCars.length} bílar fundust</p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2.5 bg-navy-800 border border-white/10 rounded-lg text-sm text-white"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {showFilters ? 'Fela síu' : 'Sýna síu'}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              makes={makes}
              bodyTypes={bodyTypes}
            />
          </div>

          {/* Grid */}
          <div className="flex-1">
            {filteredCars.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-slate-400">Engir bílar fundust með þessari síu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
