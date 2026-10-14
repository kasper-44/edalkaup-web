import type { ReactNode } from 'react'

type IconProps = { className?: string }

function stroke({ className = 'w-4 h-4', children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      {children}
    </svg>
  )
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return stroke({
    className,
    children: (
      <>
        <path d="M7 17 17 7" />
        <path d="M9 7h8v8" />
      </>
    ),
  })
}

export function ArrowRightIcon({ className }: IconProps) {
  return stroke({
    className,
    children: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
  })
}

export function ArrowLeftIcon({ className }: IconProps) {
  return stroke({
    className,
    children: (
      <>
        <path d="M19 12H5" />
        <path d="m11 18-6-6 6-6" />
      </>
    ),
  })
}

export function CheckIcon({ className }: IconProps) {
  return stroke({ className, children: <path d="m5 13 4 4L19 7" /> })
}

export function CloseIcon({ className }: IconProps) {
  return stroke({
    className,
    children: (
      <>
        <path d="M6 6 18 18" />
        <path d="M18 6 6 18" />
      </>
    ),
  })
}

export function WarningIcon({ className }: IconProps) {
  return stroke({
    className,
    children: (
      <>
        <path d="M12 4 3 19h18L12 4z" />
        <path d="M12 10v4" />
        <path d="M12 16.5h.01" />
      </>
    ),
  })
}

export function HeartIcon({ filled = false, className = 'w-4 h-4' }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
    >
      <path d="M12 20s-7-4.35-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.65-7 9-7 9z" />
    </svg>
  )
}

export function CircleIcon({ className }: IconProps) {
  return stroke({ className, children: <circle cx="12" cy="12" r="7" /> })
}
