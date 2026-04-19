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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Hafa samband</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-3 max-w-xl mx-auto">
            Ertu með spurningu eða vilt fá tilboð í bíl? Ekki hika við að hafa samband.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
                title: 'Sími',
                value: '699 2011',
                href: 'tel:+3546992011',
                subtitle: 'Mán–Fös 09:00–17:00',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
                title: 'Netfang',
                value: 'sigurdur@edalkaup.is',
                href: 'mailto:sigurdur@edalkaup.is',
                subtitle: 'Við svörum innan sólarhrings',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 p-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-3">{item.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <a href={item.href} className="text-accent hover:text-accent-light transition-colors font-medium">
                  {item.value}
                </a>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{item.subtitle}</p>
              </div>
            ))}

            {/* Map */}
            <div className="bg-white dark:bg-navy-800 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Laugavegur+44,+101+Reykjavík,+Iceland&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
