export interface Car {
  id: string
  slug: string
  make: string
  model: string
  year: number
  trim: string
  price: number // ISK
  priceUSD?: number
  mileage: number // km
  color: string
  exteriorColor: string
  interiorColor: string
  drivetrain: string
  engine: string
  transmission: string
  fuelType: string
  bodyType: string
  doors: number
  seats: number
  vin?: string
  status: 'available' | 'sold' | 'in-transit'
  featured: boolean
  images: string[]
  videoUrl?: string
  description: string
  features: string[]
  createdAt: string
  availability?: string
}

// @ts-ignore
export const cars: Car[] = []

export const deliveredCars: Car[] = []

export function formatPrice(price: number): string {
  if (price === 0) return 'Verð við fyrirspurn'
  return new Intl.NumberFormat('is-IS').format(price) + ' kr.'
}

export function formatMileage(km: number): string {
  if (km === 0) return 'Nýr'
  return new Intl.NumberFormat('is-IS').format(km) + ' km'
}

export function getCarTitle(car: Car): string {
  return `${car.year} ${car.make} ${car.model} ${car.trim}`
}
