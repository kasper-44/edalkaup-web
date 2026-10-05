import type { Car } from '@/data/cars'

export const EMPTY_FILTERS = {
  q: '', make: '', bodyType: '', fuel: '', minPrice: '', maxPrice: '',
  minYear: '', maxYear: '', maxMileage: '',
}
export type InventoryFilters = typeof EMPTY_FILTERS
export type InventorySort = 'newest' | 'price-low' | 'price-high' | 'year' | 'mileage'
export const SORTS: InventorySort[] = ['newest', 'price-low', 'price-high', 'year', 'mileage']

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th')
}
export function fuelLabel(value: string): string {
  const fuel = normalizeSearch(value)
  if (/plug|phev|tengil/.test(fuel)) return 'Tengiltvinn'
  if (/hybrid|tvinn/.test(fuel) || (/electric|rafmagn/.test(fuel) && /gas|petrol|bensin/.test(fuel))) return 'Tvinn'
  if (/electric|rafmagn|^ev$/.test(fuel)) return 'Rafmagn'
  if (/diesel|dis[ei]l/.test(fuel)) return 'Dísil'
  if (/gas|petrol|bensin/.test(fuel)) return 'Bensín'
  return value || 'Ótilgreint'
}
export function parseInventoryFilters(params: Record<string, string | string[] | undefined>): InventoryFilters {
  const filters = { ...EMPTY_FILTERS }
  for (const key of Object.keys(filters) as (keyof InventoryFilters)[]) {
    const value = params[key]
    if (typeof value !== 'string') continue
    if (['minPrice', 'maxPrice', 'minYear', 'maxYear', 'maxMileage'].includes(key)) {
      if (value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0) filters[key] = value.slice(0, 12)
    } else filters[key] = value.slice(0, 100)
  }
  return filters
}
export function filterCars(cars: Car[], filters: InventoryFilters): Car[] {
  const terms = normalizeSearch(filters.q).split(/\s+/).filter(Boolean)
  return cars.filter((car) => {
    const haystack = normalizeSearch(`${car.title || ''} ${car.make} ${car.model} ${car.trim} ${car.year}`)
    if (!terms.every((term) => haystack.includes(term))) return false
    if (filters.make && car.make !== filters.make) return false
    if (filters.bodyType && car.bodyType !== filters.bodyType) return false
    if (filters.fuel && fuelLabel(car.fuelType) !== filters.fuel) return false
    // Unknown prices and mileage must not masquerade as cheap or low-mileage cars.
    if ((filters.minPrice || filters.maxPrice) && !(car.price > 0)) return false
    if (filters.minPrice && car.price < Number(filters.minPrice)) return false
    if (filters.maxPrice && car.price > Number(filters.maxPrice)) return false
    if (filters.minYear && car.year < Number(filters.minYear)) return false
    if (filters.maxYear && car.year > Number(filters.maxYear)) return false
    if (filters.maxMileage && (car.mileage == null || car.mileage > Number(filters.maxMileage))) return false
    return true
  })
}
export function sortCars(cars: Car[], sort: InventorySort): Car[] {
  return [...cars].sort((a, b) => {
    if (sort === 'price-low' || sort === 'price-high') {
      if (!(a.price > 0)) return b.price > 0 ? 1 : 0
      if (!(b.price > 0)) return -1
      return sort === 'price-low' ? a.price - b.price : b.price - a.price
    }
    if (sort === 'year') return b.year - a.year
    if (sort === 'mileage') return (a.mileage ?? Infinity) - (b.mileage ?? Infinity)
    return 0 // The server supplies the authoritative listing order.
  })
}
export const INVENTORY_CATEGORIES = [
  { slug: 'rafmagnspallbilar', title: 'EV pallbílar til sölu á Íslandi', short: 'EV pallbílar', description: 'EV pallbílar til sölu hjá Eðalkaup. Skoðaðu verð, myndir, rafhlöðu, drægni og dráttargetu í auglýsingum rafmagnspallbílanna okkar.', intro: 'Rafmagnspallbílar eru í aðalhlutverki hjá Eðalkaup. Berðu saman útfærslur og skoðaðu upplýsingar um rafhlöðu, hleðslu og dráttargetu þar sem þær liggja fyrir.', matches: (car: Car) => fuelLabel(car.fuelType) === 'Rafmagn' && /pick.?up|pall/i.test(car.bodyType) },
  { slug: 'rafmagnsbilar', title: 'Rafmagnsbílar til sölu', short: 'Rafmagnsbílar', description: 'Skoðaðu rafmagnsbíla til sölu hjá Eðalkaup. Berðu saman verð, árgerð og akstur og kynntu þér rafhlöðu og drægni á síðu hvers bíls.', intro: 'Berðu saman rafmagnsbílana okkar og skoðaðu upplýsingar um rafhlöðu, drægni og hleðslu þar sem þær liggja fyrir.', matches: (car: Car) => fuelLabel(car.fuelType) === 'Rafmagn' },
  { slug: 'jeppar', title: 'Jeppar og SUV til sölu', short: 'Jeppar og SUV', description: 'Jeppar og SUV til sölu hjá Eðalkaup. Skoðaðu myndir, akstur, verð og búnað og finndu bíl sem hentar þínum þörfum.', intro: 'Skoðaðu jeppa og SUV fyrir fjölskylduna, ferðalög eða daglegan akstur. Upplýsingar um drif, sætafjölda og búnað fylgja hverri auglýsingu eftir því sem þær liggja fyrir.', matches: (car: Car) => /suv|jeppi|jeppar/i.test(car.bodyType) },
  { slug: 'pallbilar', title: 'Pallbílar til sölu á Íslandi', short: 'Pallbílar', description: 'Skoðaðu pallbíla til sölu hjá Eðalkaup. Berðu saman árgerð, verð og akstur og skoðaðu upplýsingar um dráttargetu og búnað.', intro: 'Finndu pallbíl fyrir vinnu eða ferðalög. Skoðaðu dráttargetu, drif og búnað í auglýsingunni og hafðu samband til að staðfesta að bíllinn henti verkefninu.', matches: (car: Car) => /pick.?up|pall/i.test(car.bodyType) },
  { slug: 'sendibilar', title: 'Sendibílar til sölu', short: 'Sendibílar', description: 'Sendibílar til sölu hjá Eðalkaup. Skoðaðu verð, akstur, árgerð og gerðir fyrir reksturinn þinn.', intro: 'Skoðaðu sendibíla fyrir reksturinn. Berðu saman gerðir, akstur og eldsneyti og athugaðu sérstaklega hvort verð sé með eða án virðisaukaskatts.', matches: (car: Car) => /van|sendibil|sendibíl/i.test(car.bodyType) },
]
