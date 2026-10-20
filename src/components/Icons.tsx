import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { className?: string }

function Svg({ className = 'h-4 w-4', children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconArrowRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M4 12h15" />
      <path d="M13 6.5 18.5 12 13 17.5" />
    </Svg>
  )
}

export function IconArrowUpRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </Svg>
  )
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M14.5 5.5 8 12l6.5 6.5" />
    </Svg>
  )
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M9.5 5.5 16 12l-6.5 6.5" />
    </Svg>
  )
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M5 12.5 9.2 16.7 19 7" />
    </Svg>
  )
}

export function IconClose(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Svg>
  )
}

export function IconHeart({ filled = false, className = 'h-4 w-4', ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={1.75}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7-4.4-9.2-8.4C1.3 9.2 2.6 5.8 6 5.2c1.9-.3 3.6.6 4.5 2.1C11.4 5.8 13.1 4.9 15 5.2c3.4.6 4.7 4 3.2 6.9-2.2 4-6.2 8.4-6.2 8.4z"
      />
    </svg>
  )
}
