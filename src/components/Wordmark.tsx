/**
 * Premium EÐALKAUP wordmark. Text uses the page serif and currentColor,
 * so the same mark reads dark on light surfaces and light on dark surfaces.
 */
export default function Wordmark({
  subtitle = true,
  className = '',
}: {
  subtitle?: boolean
  className?: string
}) {
  const label = subtitle ? 'Eðalkaup, bílainnflutningur' : 'Eðalkaup'
  return (
    <svg
      viewBox={subtitle ? '0 0 440 86' : '0 0 228 46'}
      role="img"
      aria-label={label}
      className={`w-auto text-navy-900 dark:text-[#f6f1e6] ${subtitle ? 'h-11' : 'h-7'} ${className}`}
    >
      <text
        x="0"
        y={subtitle ? 36 : 32}
        fill="currentColor"
        fontSize={subtitle ? 38 : 32}
        fontWeight="600"
        letterSpacing={subtitle ? 5 : 1.5}
        style={{ fontFamily: 'var(--font-wordmark), Georgia, "Times New Roman", serif' }}
      >
        EÐALKAUP
      </text>
      <rect x="1" y={subtitle ? 46 : 39} width={subtitle ? 52 : 36} height="2" fill="#c9a84c" />
      {subtitle && (
        <text
          x="1"
          y="72"
          fill="currentColor"
          opacity="0.62"
          fontSize="13"
          fontWeight="500"
          letterSpacing="3.4"
          style={{ fontFamily: 'var(--font-wordmark), Georgia, "Times New Roman", serif' }}
        >
          BÍLAINNFLUTNINGUR
        </text>
      )}
    </svg>
  )
}
