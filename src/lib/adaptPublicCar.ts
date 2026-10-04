import { withVatFlag } from '@/lib/priceVat'

export function adaptCar(row: any) {
  const car = withVatFlag(row)
  const vinMatch = car.description_is?.match(/VIN: (.+)/)?.[1]?.split('\n')[0] || ''
  return {
    id: car.id,
    slug: car.id,
    title: car.title || '',
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
    priceUSD: undefined,
    mileage: car.mileage_km ?? null,
    color: car.exterior_colour || 'Ótilgreind',
    exteriorColor: car.exterior_colour || 'Ótilgreind',
    interiorColor: car.interior_colour || 'Ótilgreind',
    drivetrain: car.drivetrain || 'Ótilgreint',
    engine: car.engine || '',
    transmission: car.transmission || 'Ótilgreint',
    fuelType: car.fuel_type || '',
    bodyType: car.body_type || 'Ótilgreint',
    doors: car.doors || 0,
    seats: car.seats || 0,
    vin: car.vin || vinMatch,
    status: 'available' as const,
    featured: false,
    images: car.images || [],
    description: car.description_is || '',
    features: [],
    createdAt: car.created_at || '',
    availability: car.location_country === 'US' ? 'Í boði frá Bandaríkjunum' : '',
  }
}
