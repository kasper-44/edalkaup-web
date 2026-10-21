export default function LiveDot({ tone = 'gold', className = '' }: { tone?: 'gold' | 'ink'; className?: string }) {
  const color = tone === 'ink' ? 'bg-navy-900' : 'bg-accent'
  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`} aria-hidden="true">
      <span className={`live-dot-ping absolute inline-flex h-full w-full rounded-full ${color}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  )
}
