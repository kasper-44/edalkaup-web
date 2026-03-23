'use client'

import Link from 'next/link'
import { useState } from 'react'

const navItems = [
  { href: '/', label: 'Forsíða' },
  { href: '/bilar', label: 'Bílar' },
  { href: '/afhent', label: 'Afhent' },
  { href: '/um-okkur', label: 'Um okkur' },
  { href: '/hafa-samband', label: 'Hafa samband' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-navy-900 font-bold text-xl">
              E
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
                EÐALKAUP
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.3em] text-slate-400">
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
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-accent transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/hafa-samband"
              className="ml-4 px-5 py-2.5 text-sm font-semibold bg-accent text-navy-900 rounded-lg hover:bg-accent-light transition-colors"
            >
              Fá tilboð
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
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

        {/* Mobile Nav */}
        {isOpen && (
          <nav className="lg:hidden pb-4 border-t border-white/5 pt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-slate-300 hover:text-accent hover:bg-white/5 rounded-lg transition-colors"
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
