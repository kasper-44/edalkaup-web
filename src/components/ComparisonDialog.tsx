'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Car } from '@/data/cars'
import { formatMileage, formatPrice } from '@/data/cars'
import { vehicleTitle } from '@/lib/listingSeo'
import { fuelLabel } from '@/lib/inventory'
import { vatIncludedPriceSubtitle } from '@/lib/priceVat'

export default function ComparisonDialog({ cars, open, onClose }: { cars: Car[]; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (open && !ref.current?.open) ref.current?.showModal()
    else if (!open && ref.current?.open) ref.current.close()
  }, [open])
  const rows: { label: string; value: (car: Car) => string }[] = [
    { label: 'Verð', value: (car) => formatPrice(car.price) },
    { label: 'Virðisaukaskattur', value: (car) => car.price > 0 ? vatIncludedPriceSubtitle(car) || 'Ótilgreint' : 'Ótilgreint' },
    { label: 'Árgerð', value: (car) => String(car.year) },
    { label: 'Akstur', value: (car) => formatMileage(car.mileage) },
    { label: 'Eldsneyti', value: (car) => fuelLabel(car.fuelType) },
    { label: 'Drif', value: (car) => car.drivetrain },
    { label: 'Gírkassi', value: (car) => car.transmission },
    { label: 'Tegund', value: (car) => car.bodyType },
  ]
  return <dialog ref={ref} onClose={onClose} aria-labelledby="compare-title" className="m-auto w-[min(95vw,70rem)] max-h-[90svh] rounded-2xl bg-white dark:bg-navy-800 p-0 text-gray-900 dark:text-white backdrop:bg-black/60">
    <div className="sticky top-0 z-10 bg-white dark:bg-navy-800 px-5 py-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center">
      <h2 id="compare-title" className="text-xl font-bold">Samanburður bíla</h2><button autoFocus onClick={onClose} className="px-4 py-2 rounded-lg border border-black/10 dark:border-white/15">Loka</button>
    </div>
    <div className="p-5"><p className="text-sm text-gray-600 dark:text-slate-300 mb-5">Berðu saman allt að þrjá bíla. Athugaðu hvort verð sé með eða án VSK.</p>
      <div className="overflow-x-auto"><table className="w-full text-sm border-collapse"><caption className="sr-only">Verð og helstu upplýsingar um valda bíla</caption>
        <thead><tr><th className="min-w-28 text-left p-3">Upplýsingar</th>{cars.map((car) => <th key={car.id} className="min-w-48 max-w-72 p-3 text-left align-top">
          {car.images[0] && <div className="relative aspect-[16/10] mb-3"><Image src={car.images[0]} alt={vehicleTitle(car)} fill sizes="240px" className="rounded-lg object-cover" /></div>}
          <Link href={`/bilar/${car.slug}`} className="underline underline-offset-4">{vehicleTitle(car)}</Link>
        </th>)}</tr></thead>
        <tbody>{rows.map((row) => <tr key={row.label} className="border-t border-black/10 dark:border-white/10"><th scope="row" className="p-3 text-left font-medium text-gray-600 dark:text-slate-300">{row.label}</th>{cars.map((car) => <td key={car.id} className="p-3">{row.value(car)}</td>)}</tr>)}</tbody>
      </table></div>
    </div>
  </dialog>
}
