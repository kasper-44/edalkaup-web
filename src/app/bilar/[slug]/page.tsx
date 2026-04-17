import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cars, getCarTitle, formatPrice, formatMileage } from '@/data/cars'
import { generateCarJsonLd } from '@/lib/utils'
import CarGallery from '@/components/CarGallery'
import ShareButtons from '@/components/ShareButtons'
import ContactForm from '@/components/ContactForm'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return cars.map((car) => ({ slug: car.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const car = cars.find((c) => c.slug === slug)
  if (!car) return {}

  const title = getCarTitle(car)
  const url = `https://edalkaup.is/bilar/${car.slug}`

  return {
    title,
    description: car.description,
    openGraph: {
      title: `${title} — ${formatPrice(car.price)}`,
      description: car.description,
      url,
      images: car.images.map((img) => ({ url: img, width: 1200, height: 630 })),
      type: 'website',
      locale: 'is_IS',
      siteName: 'Eðalkaup',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — ${formatPrice(car.price)}`,
      description: car.description,
      images: car.images[0],
    },
  }
}

export default async function CarPage({ params }: PageProps) {
  const { slug } = await params
  const car = cars.find((c) => c.slug === slug)
  if (!car) notFound()

  const title = getCarTitle(car)
  const url = `https://edalkaup.is/bilar/${car.slug}`
  const jsonLd = generateCarJsonLd(car)

  const specs = [
    { label: 'Árgerð', value: car.year.toString() },
    { label: 'Framleiðandi', value: car.make },
    { label: 'Gerð', value: car.model },
    { label: 'Útgáfa', value: car.trim },
    { label: 'Akstur', value: formatMileage(car.mileage) },
    { label: 'Litur', value: `${car.color} (${car.exteriorColor})` },
    { label: 'Innrétting', value: car.interiorColor },
    { label: 'Drifkerfi', value: car.drivetrain },
    { label: 'Vél', value: car.engine },
    { label: 'Gírkassi', value: car.transmission },
    { label: 'Eldsneyti', value: car.fuelType },
    { label: 'Tegund', value: car.bodyType },
    { label: 'Hurðir', value: car.doors.toString() },
    { label: 'Sæti', value: car.seats.toString() },
  ]

  const statusColors = {
    available: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'in-transit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    sold: 'bg-red-500/20 text-red-400 border-red-500/30',
  }
  const statusLabels = {
    available: 'Til sölu',
    'in-transit': 'Á leiðinni til Íslands',
    sold: 'Selt',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 dark:text-slate-500 mb-6">
            <a href="/bilar" className="hover:text-accent transition-colors">Bílar</a>
            <span className="mx-2">/</span>
            <span className="text-gray-600 dark:text-slate-300">{title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left — Gallery + Specs */}
            <div className="lg:col-span-2 space-y-8">
              <CarGallery images={car.images} alt={title} />

              {/* Video embed */}
              {car.videoUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden">
                  <iframe
                    src={car.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Specs */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tæknilegar upplýsingar</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between py-3 border-b border-black/5 dark:border-white/5">
                      <span className="text-sm text-gray-500 dark:text-slate-400">{spec.label}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              {car.features.length > 0 && (
                <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Aukahlutir og eiginleikar</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lýsing</h2>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed">{car.description}</p>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Price card */}
              <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6 sticky top-24">
                <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mb-4 ${statusColors[car.status]}`}>
                  {statusLabels[car.status]}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{title}</h1>
                <div className="mt-4 mb-6">
                  <p className="text-3xl font-bold text-accent">{formatPrice(car.price)}</p>
                  {car.priceUSD && (
                    <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">${car.priceUSD.toLocaleString()} USD</p>
                  )}
                </div>

                <ShareButtons url={url} title={title} />

                <div className="mt-6">
                  <ContactForm carTitle={title} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
