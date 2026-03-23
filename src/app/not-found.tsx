import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl font-black text-accent/20 mb-4">404</p>
        <h1 className="text-3xl font-bold text-white mb-4">Síða fannst ekki</h1>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Þessi síða er ekki til eða hefur verið fjarlægð. Farðu á forsíðu til að skoða bílana okkar.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 text-base font-semibold bg-accent text-navy-900 rounded-xl hover:bg-accent-light transition-colors"
        >
          Fara á forsíðu
        </Link>
      </div>
    </div>
  )
}
