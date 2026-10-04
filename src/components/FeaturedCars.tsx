import CarCard from '@/components/CarCard'
import { getPublicCars } from '@/lib/publicInventory'

export default async function FeaturedCars() {
  const cars = (await getPublicCars()).filter((car) => car.price > 0).slice(0, 6)
  if (!cars.length) return <p className="text-gray-600 dark:text-slate-300 py-6">Engir bílar til sýnis í augnablikinu. Hafðu samband og við leitum fyrir þig.</p>
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{cars.map((car, i) => <CarCard key={car.id} car={car} priority={i < 3} />)}</div>
}
