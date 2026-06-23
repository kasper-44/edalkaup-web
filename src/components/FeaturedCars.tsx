'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import CarCard from '@/components/CarCard'

// Adapt a Supabase row into the shape CarCard expects (same mapping as /bilar).
function adaptCar(row: any) {
  return {
    id: row.id,
    slug: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    trim: row.trim || '',
    price: row.price_isk,
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
    status: 'available' as const,
    featured: false,
    images: row.images || [],
    description: '',
    features: [],
    createdAt: new Date().toISOString(),
  }
}

export default function FeaturedCars() {
  const [cars, setCars] = useState<ReturnType<typeof adaptCar>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCars() {
      // Newest live cars with a real price and at least one image.
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('status', 'live')
        .gt('price_isk', 0)
        .order('year', { ascending: false })
        .limit(6)
      if (!error && data) {
        setCars(data.filter((r: any) => r.images && r.images.length > 0).map(adaptCar))
      }
      setLoading(false)
    }
    fetchCars()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (cars.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-slate-400 py-6">
        Engir bílar til sýnis í augnablikinu.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car, i) => (
        <CarCard key={car.id} car={car} priority={i < 3} />
      ))}
    </div>
  )
}
