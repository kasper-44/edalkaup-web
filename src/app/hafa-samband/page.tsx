import { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Hafa samband',
  description: 'Hafðu samband við Eðalkaup — sími 699 2011, netfang sigurdur@edalkaup.is. Við svörum fyrirspurnum fljótt.',
}

export default function HafaSambandPage() {
  return (
    <div className="pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-[0.2em] mb-3">Samband</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Hafa samband</h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            Ertu með spurningu eða vilt fá tilboð í bíl? Ekki hika við að hafa samband.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                icon: '📞',
                title: 'Sími',
                value: '699 2011',
                href: 'tel:+3546992011',
                subtitle: 'Mán–Fös 09:00–17:00',
              },
              {
                icon: '✉️',
                title: 'Netfang',
                value: 'sigurdur@edalkaup.is',
                href: 'mailto:sigurdur@edalkaup.is',
                subtitle: 'Við svörum innan sólarhrings',
              },
              {
                icon: '🏢',
                title: 'Móðurfélag',
                value: 'Úranus ehf.',
                href: 'https://uranus.is',
                subtitle: '551 0205 • johannes@uranus.is',
              },
            ].map((item) => (
              <div key={item.title} className="bg-navy-800 rounded-2xl border border-white/5 p-6">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <a href={item.href} className="text-accent hover:text-accent-light transition-colors font-medium">
                  {item.value}
                </a>
                <p className="text-sm text-slate-400 mt-1">{item.subtitle}</p>
              </div>
            ))}

            {/* Map */}
            <div className="bg-navy-800 rounded-2xl border border-white/5 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1740.5!2d-21.9!3d64.14!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNjTCsDA4JzI0LjAiTiAyMcKwNTQnMDAuMCJX!5e0!3m2!1sis!2sis!4v1234567890"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
