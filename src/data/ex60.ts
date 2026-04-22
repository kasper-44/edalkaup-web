export interface EX60Car {
  id: string
  config: string
  price: number
  exteriorColor: string
  interiorColor: string
  packages: string[]
  status: 'available' | 'reserved' | 'sold'
  deliveryEstimate: string
  image: string
}

export function formatEX60Price(price: number): string {
  return price.toLocaleString('de-DE') + ' kr.'
}

export const colorHex: Record<string, string> = {
  'Crystal White': '#f0eff0',
  'Onyx Black': '#1a1a1a',
  'Vapour Grey': '#d4d2cc',
  'Aurora Silver': '#c0c0c8',
  'Denim Blue': '#2b3a5c',
  'Mulberry Red': '#5e1a2a',
  'Bright Dusk': '#4a4e6a',
}

export const ex60Cars: EX60Car[] = [
  { id: 'ex60-001', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Crystal White', interiorColor: 'Charcoal / Blond Wool Blend', packages: ['Climate Pack', 'Park Assist Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/crystal-white.jpg' },
  { id: 'ex60-002', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Onyx Black', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Lounge Pack', '7 Seat Comfort'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/onyx-black.jpg' },
  { id: 'ex60-003', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Denim Blue', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/denim-blue.jpg' },
  { id: 'ex60-004', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Vapour Grey', interiorColor: 'Charcoal Wool Blend', packages: ['Lounge Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/vapour-grey.jpg' },
  { id: 'ex60-005', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Aurora Silver', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Bowers & Wilkins', '7 Seat Comfort'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/aurora-silver.jpg' },
  { id: 'ex60-006', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Bright Dusk', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Lounge Pack', 'Harman Kardon'], status: 'reserved', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/bright-dusk.jpg' },
  { id: 'ex60-007', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Mulberry Red', interiorColor: 'Blond Nappa Leather', packages: ['Park Assist Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/mulberry-red.jpg' },
  { id: 'ex60-008', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Crystal White', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Lounge Pack', 'Park Assist Pack'], status: 'reserved', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/crystal-white.jpg' },
  { id: 'ex60-009', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Onyx Black', interiorColor: 'Charcoal Wool Blend', packages: ['Climate Pack', '7 Seat Comfort'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/onyx-black.jpg' },
  { id: 'ex60-010', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Denim Blue', interiorColor: 'Blond Nappa Leather', packages: ['Lounge Pack', 'Bowers & Wilkins', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/denim-blue.jpg' },
  { id: 'ex60-011', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Vapour Grey', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Harman Kardon', '7 Seat Comfort'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/vapour-grey.jpg' },
  { id: 'ex60-012', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Aurora Silver', interiorColor: 'Charcoal Wool Blend', packages: ['Park Assist Pack', 'Lounge Pack'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/aurora-silver.jpg' },
  { id: 'ex60-013', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Bright Dusk', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/bright-dusk.jpg' },
  { id: 'ex60-014', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Mulberry Red', interiorColor: 'Blond Nappa Leather', packages: ['Lounge Pack', 'Park Assist Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/mulberry-red.jpg' },
  { id: 'ex60-015', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Crystal White', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', '7 Seat Comfort', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/crystal-white.jpg' },
  { id: 'ex60-016', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Onyx Black', interiorColor: 'Charcoal Wool Blend', packages: ['Lounge Pack', 'Park Assist Pack'], status: 'reserved', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/onyx-black.jpg' },
  { id: 'ex60-017', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Denim Blue', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Harman Kardon', '7 Seat Comfort'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/denim-blue.jpg' },
  { id: 'ex60-018', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Aurora Silver', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/aurora-silver.jpg' },
  { id: 'ex60-019', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Bright Dusk', interiorColor: 'Charcoal Nappa Leather', packages: ['Lounge Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/bright-dusk.jpg' },
  { id: 'ex60-020', config: 'P12 Long Range AWD', price: 12390000, exteriorColor: 'Vapour Grey', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack', 'Bowers & Wilkins', '7 Seat Comfort'], status: 'reserved', deliveryEstimate: 'Apríl 2027', image: '/images/ex60/vapour-grey.jpg' },
]
