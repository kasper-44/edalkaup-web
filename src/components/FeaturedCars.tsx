import CarCard from '@/components/CarCard'
import { getPublicCars } from '@/lib/publicInventory'

export default async function FeaturedCars() {
  const cars = (await getPublicCars()).filter((car) => car.price > 0).slice(0, 6)
  if (!cars.length) return <p className="text-gray-600 dark:text-slate-300 py-6">Engir bílar til sýnis í augnablikinu. Skoðaðu síðuna aftur síðar eða hafðu samband um auglýstan bíl.</p>
  // These cards sit below the hero on a phone. Preloading them competes with the
  // hero paragraph, which is the LCP element, so they stay lazy.
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{cars.map((car) => <CarCard key={car.id} car={car} />)}</div>
}
