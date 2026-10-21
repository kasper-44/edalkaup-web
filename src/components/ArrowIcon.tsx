/** Line arrow. Unicode arrows render as color emoji on iOS, so buttons use this instead. */
export default function ArrowIcon({
  direction = 'up-right',
  className = '',
}: {
  direction?: 'up-right' | 'right'
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      width="1.05em"
      height="1.05em"
      className={`inline-block shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === 'right' ? (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      ) : (
        <>
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </>
      )}
    </svg>
  )
}
