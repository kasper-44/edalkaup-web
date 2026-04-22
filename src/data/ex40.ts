export interface EX40Car {
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

export function formatEX40Price(price: number): string {
  return price.toLocaleString('de-DE') + ' kr.'
}

export const colorHex: Record<string, string> = {
  'Crystal White': '#f0eff0',
  'Onyx Black': '#1a1a1a',
  'Vapour Grey': '#d4d2cc',
  'Sage Green': '#7a8a6e',
  'Fjord Blue': '#3a5a7c',
  'Cloud Blue': '#b8c8d8',
  'Fusion Red': '#8b2020',
}

export const ex40Cars: EX40Car[] = [
  { id: 'ex40-001', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Crystal White', interiorColor: 'Charcoal Wool Blend', packages: ['Climate Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/crystal-white.jpg' },
  { id: 'ex40-002', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Onyx Black', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/onyx-black.jpg' },
  { id: 'ex40-003', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Vapour Grey', interiorColor: 'Blond Wool Blend', packages: ['Park Assist Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/vapour-grey.jpg' },
  { id: 'ex40-004', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Sage Green', interiorColor: 'Charcoal Wool Blend', packages: ['Climate Pack', 'Lounge Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/sage-green.jpg' },
  { id: 'ex40-005', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Fjord Blue', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/fjord-blue.jpg' },
  { id: 'ex40-006', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Cloud Blue', interiorColor: 'Blond Wool Blend', packages: ['Lounge Pack', 'Bowers & Wilkins'], status: 'reserved', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/cloud-blue.jpg' },
  { id: 'ex40-007', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Fusion Red', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/fusion-red.jpg' },
  { id: 'ex40-008', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Crystal White', interiorColor: 'Blond Nappa Leather', packages: ['Lounge Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/crystal-white.jpg' },
  { id: 'ex40-009', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Onyx Black', interiorColor: 'Charcoal Wool Blend', packages: ['Climate Pack'], status: 'reserved', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/onyx-black.jpg' },
  { id: 'ex40-010', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Vapour Grey', interiorColor: 'Charcoal Nappa Leather', packages: ['Park Assist Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/vapour-grey.jpg' },
  { id: 'ex40-011', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Sage Green', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/sage-green.jpg' },
  { id: 'ex40-012', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Fjord Blue', interiorColor: 'Charcoal Wool Blend', packages: ['Lounge Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/fjord-blue.jpg' },
  { id: 'ex40-013', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Cloud Blue', interiorColor: 'Blond Nappa Leather', packages: ['Climate Pack', 'Bowers & Wilkins'], status: 'reserved', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/cloud-blue.jpg' },
  { id: 'ex40-014', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Fusion Red', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack', 'Harman Kardon'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/fusion-red.jpg' },
  { id: 'ex40-015', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Crystal White', interiorColor: 'Charcoal Wool Blend', packages: ['Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/crystal-white.jpg' },
  { id: 'ex40-016', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Onyx Black', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Lounge Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/onyx-black.jpg' },
  { id: 'ex40-017', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Vapour Grey', interiorColor: 'Blond Nappa Leather', packages: ['Harman Kardon'], status: 'reserved', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/vapour-grey.jpg' },
  { id: 'ex40-018', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Sage Green', interiorColor: 'Charcoal Nappa Leather', packages: ['Climate Pack', 'Park Assist Pack'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/sage-green.jpg' },
  { id: 'ex40-019', config: 'Single Motor Extended Range', price: 7690000, exteriorColor: 'Fjord Blue', interiorColor: 'Charcoal Wool Blend', packages: ['Lounge Pack', 'Bowers & Wilkins'], status: 'available', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/fjord-blue.jpg' },
  { id: 'ex40-020', config: 'Twin Motor Performance', price: 7690000, exteriorColor: 'Cloud Blue', interiorColor: 'Blond Wool Blend', packages: ['Climate Pack', 'Harman Kardon', 'Park Assist Pack'], status: 'reserved', deliveryEstimate: 'Ágúst 2026', image: '/images/ex40/cloud-blue.jpg' },
]
