import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-navy-800 border-t border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-navy-900 font-bold text-xl">
                E
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">EÐALKAUP</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Hluti af Úranus — einum stærsta bílainnflytjanda Íslands í yfir 25 ár. Við finnum bílinn þinn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Valmynd</h3>
            <ul className="space-y-3">
              {[
                { href: '/bilar', label: 'Bílar til sölu' },
                { href: '/um-okkur', label: 'Um okkur' },
                { href: '/hafa-samband', label: 'Hafa samband' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 dark:text-slate-400 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Samband</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-slate-400">
              <li>
                <a href="tel:+3546992011" className="hover:text-accent transition-colors">📞 699 2011</a>
              </li>
              <li>
                <a href="mailto:sigurdur@edalkaup.is" className="hover:text-accent transition-colors">✉️ sigurdur@edalkaup.is</a>
              </li>
              <li>🕐 Mán–Fös 09:00–17:00</li>
            </ul>
          </div>

          {/* Parent company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Úranus ehf.</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
              Móðurfélag Eðalkaups. Einn stærsti bílainnflytjandi Íslands síðustu 25 árin.
            </p>
            <a
              href="https://uranus.is"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 text-sm text-accent hover:text-accent-light transition-colors"
            >
              uranus.is →
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center text-xs text-gray-400 dark:text-slate-500">
          © {new Date().getFullYear()} Eðalkaup / Úranus ehf. Allur réttur áskilinn.
        </div>
      </div>
    </footer>
  )
}
