'use client'

import type { ReactNode } from 'react'
import { trackClickToCall, type CallPlacement } from '@/lib/analytics'
import { clickToCallHref } from '@/lib/site'

export default function CallLink({
  placement,
  className,
  children,
}: {
  placement: CallPlacement
  className?: string
  children: ReactNode
}) {
  return (
    <a
      href={clickToCallHref()}
      className={className}
      data-event="click_to_call"
      data-placement={placement}
      onClick={() => trackClickToCall(placement)}
    >
      {children}
    </a>
  )
}
