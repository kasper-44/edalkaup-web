'use client'

import { useLayoutEffect, useRef, type TextareaHTMLAttributes } from 'react'

type AutoGrowTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

function fitHeight(el: HTMLTextAreaElement | null) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

export default function AutoGrowTextarea({
  value,
  onChange,
  className,
  rows = 4,
  ...props
}: AutoGrowTextareaProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    fitHeight(ref.current)
  }, [value])

  return (
    <textarea
      {...props}
      ref={ref}
      rows={rows}
      value={value}
      onChange={(e) => {
        fitHeight(e.currentTarget)
        onChange?.(e)
      }}
      className={`overflow-hidden resize-none ${className ?? ''}`}
    />
  )
}
