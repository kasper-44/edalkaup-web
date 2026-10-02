'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { orderByNewestListing } from '@/lib/publicCarOrder'
import CarCard from '@/components/CarCard'
import { withVatFlag } from '@/lib/priceVat'

// Adapt a Supabase row into the shape CarCard expects (same mapping as /bilar).
function adaptCar(row: any) {
  const car = withVatFlag(row)
  return {
    id: car.id,
    slug: car.id,
    title: car.title || '',
    vin: car.vin || '',
    make: car.make,
    model: car.model,
    year: car.year,
    trim: car.trim || '',
    price: car.price_isk,
    priceIncludesVat:
      typeof car.price_includes_vat === 'boolean'
        ? car.price_includes_vat
        : typeof car.vat_included === 'boolean'
          ? car.vat_included
          : null,
    mileage: car.mileage_km || 0,
    color: car.exterior_colour || 'Ótilgreind',
    exteriorColor: car.exterior_colour || 'Ótilgreind',
    interiorColor: car.interior_colour || 'Ótilgreind',
    drivetrain: car.drivetrain || '4WD',
    engine: car.engine || '',
    transmission: car.transmission || 'Sjálfskiptur',
    fuelType: car.fuel_type || '',
    bodyType: car.body_type || 'SUV',
    doors: car.doors || 4,
    seats: car.seats || 5,
    status: 'available' as const,
    featured: false,
    images: car.images || [],
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
      const { data, error } = await orderByNewestListing(
        supabase
          .from('cars')
          .select('*')
          .eq('status', 'live')
          .not('images_original', 'is', null)
          .gt('price_isk', 0),
      ).limit(6)
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
