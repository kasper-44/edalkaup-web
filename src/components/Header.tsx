'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from './ThemeProvider'

const navItems = [
  { href: '/', label: 'Forsíða' },
  { href: '/bilar', label: 'Bílar' },
  { href: '/volvo-xc90', label: 'Volvo XC90' },
  { href: '/um-okkur', label: 'Um okkur' },
  { href: '/hafa-samband', label: 'Hafa samband' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-navy-900 font-bold text-xl">
              E
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                EÐALKAUP
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-gray-500 dark:text-slate-400">
                Bílainnflutningur
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-slate-300 hover:text-accent transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="ml-2 p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-accent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Skipta um þema"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <Link
              href="/hafa-samband"
              className="ml-2 px-5 py-2.5 text-sm font-semibold bg-accent text-navy-900 rounded-lg hover:bg-accent-light transition-colors"
            >
              Fá tilboð
            </Link>
          </nav>

          {/* Mobile: toggle + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-300 hover:text-accent transition-colors"
              aria-label="Skipta um þema"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-black/5 dark:border-white/5 pt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-600 dark:text-slate-300 hover:text-accent hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
