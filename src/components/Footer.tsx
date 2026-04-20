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
              Einn stærsti bílainnflytjandi Íslands í yfir 25 ár. Við finnum bílinn þinn.
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
                <a href="tel:+3546992011" className="hover:text-accent transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  699 2011
                </a>
              </li>
              <li>
                <a href="mailto:sigurdur@edalkaup.is" className="hover:text-accent transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  sigurdur@edalkaup.is
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Mán–Fös 09:00–17:00
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/5 text-center space-y-2">
          <p className="text-xs text-gray-400 dark:text-slate-500">
            © {new Date().getFullYear()} Eðalkaup. Allur réttur áskilinn.
          </p>
          <p className="text-[11px] text-gray-400/70 dark:text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engin ábyrgð er veitt gagnvart skaða sem hljótast kann af völdum skorts á upplýsingum eða rangra upplýsinga á vefnum. Með notkun á vefnum samþykkir notandi notkunarskilmála hans.
          </p>
        </div>
      </div>
    </footer>
  )
}
