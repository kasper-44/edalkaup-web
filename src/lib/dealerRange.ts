import type { Car } from '@/data/cars'
import { fuelLabel, normalizeSearch } from '@/lib/inventory'

/** The current sales range confirmed by the dealer. */
export const DEALER_RANGE = [
  { label: 'EV pallbílar', href: '/bilar/flokkur/rafmagnspallbilar', description: 'Rafmagnspallbílar eru í aðalhlutverki hjá okkur. Kynntu þér búnað, rafhlöðu og dráttargetu í hverri auglýsingu.' },
  { label: 'Volvo', href: '/bilainnflutningur#volvo', description: 'Hafðu samband um Volvo-gerðirnar okkar, búnað og framboð.' },
  { label: 'Ford Explorer', href: '/bilar?q=Ford+Explorer', description: 'Skoðaðu Ford Explorer hjá Eðalkaup og kynntu þér hverja útfærslu.' },
  { label: 'Maxus', href: '/bilar?make=Maxus', description: 'Skoðaðu Maxus-bílana okkar og upplýsingar um búnað og verð.' },
  { label: 'Toyota Sequoia', href: '/bilar?q=Toyota+Sequoia', description: 'Hafðu samband um Toyota Sequoia, útfærslur og framboð.' },
] as const
export const DEALER_RANGE_DESCRIPTION = 'EV pallbílar, Volvo, Ford Explorer, Maxus og Toyota Sequoia.'

export function isDealerRangeCar(car: Car): boolean {
  const make = normalizeSearch(car.make)
  const model = normalizeSearch(car.model)
  return (fuelLabel(car.fuelType) === 'Rafmagn' && /pick.?up|pall/i.test(car.bodyType))
    || make === 'volvo' || make === 'maxus'
    || (make === 'ford' && /explorer/.test(model))
    || (make === 'toyota' && /sequoia/.test(model))
}
