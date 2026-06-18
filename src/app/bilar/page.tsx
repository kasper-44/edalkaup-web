'use client'

import { useState, useMemo, useEffect } from 'react'
import { supabase, type SupabaseCar } from '@/lib/supabase'
import CarCard from '@/components/CarCard'
import FilterSidebar from '@/components/FilterSidebar'

function adaptCar(row: SupabaseCar) {
  const priceMatch = row.description_is?.match(/Original price: (.+)/)?.[1] || ''
  const vinMatch = row.description_is?.match(/VIN: (.+)/)?.[1]?.split('\n')[0] || ''
  return {
    id: row.id,
    slug: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    trim: row.trim || '',
    price: row.price_isk,
    priceUSD: undefined,
    mileage: row.mileage_km || 0,
    color: row.exterior_colour || 'Ótilgreind',
    exteriorColor: row.exterior_colour || 'Ótilgreind',
    interiorColor: row.interior_colour || 'Ótilgreind',
    drivetrain: row.drivetrain || '4WD',
    engine: row.engine || '',
    transmission: row.transmission || 'Sjálfskiptur',
        fuelType: row.fuel_type || '',
    bodyType: row.body_type || 'SUV',
    doors: row.doors || 4,
    seats: row.seats || 5,
    vin: vinMatch,
    status: 'available' as const,
    featured: false,
    images: row.images || [],
    description: row.description_is || '',
    features: [],
    createdAt: new Date().toISOString(),
    availability: row.location_country === 'US' ? 'Í boði frá Bandaríkjunum' : '',
  }
}
export default function BilarPage() {
  const [cars, setCars] = useState<ReturnType<typeof adaptCar>[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    make: '',
    bodyType: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function fetchCars() {
            const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'live')
        .order('year', { ascending: false })
      if (!error && data) {
        setCars(data.map(adaptCar))
      }
      setLoading(false)
    }
    fetchCars()
  }, [])

  const makes = useMemo(() => [...new Set(cars.map((c) => c.make))].sort(), [cars])
  const bodyTypes = useMemo(() => [...new Set(cars.map((c) => c.bodyType))].sort(), [cars])
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
  }, [filters, cars])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
      }

  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-2">Birgðir</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Bílar til sölu</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2">
            {loading ? 'Hleð...' : `${filteredCars.length} bílar fundust`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden mb-6 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-navy-800 border border-black/10 dark:border-white/10 rounded-lg text-sm text-gray-900 dark:text-white"
                  >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          {showFilters ? 'Fela síu' : 'Sýna síu'}
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} makes={makes} bodyTypes={bodyTypes} />
          </div>
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                <p className="text-gray-500 dark:text-slate-400 mt-4">Hleð bílum...</p>
              </div>
            ) : filteredCars.length === 0 ? (
                    <div className="text-center py-20">
                <p className="text-xl text-gray-500 dark:text-slate-400">Engir bílar fundust með þessari síu.</p>
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
