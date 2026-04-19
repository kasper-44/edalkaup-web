'use client'

import { useState } from 'react'

export default function MessengerButton() {
  const [hovered, setHovered] = useState(false)

  // Replace with your Facebook Page username or ID
  const messengerLink = 'https://m.me/edalkaup'

  return (
    <a
      href={messengerLink}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0084FF] hover:bg-[#0073E6] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      style={{ padding: hovered ? '14px 20px 14px 16px' : '16px' }}
    >
      {/* Messenger icon */}
      <svg className="w-7 h-7 shrink-0" viewBox="0 0 36 36" fill="currentColor">
        <path d="M18 2.1C9.2 2.1 2.1 8.6 2.1 16.8c0 4.6 2.2 8.7 5.8 11.4v5.6l5.3-2.9c1.4.4 2.9.6 4.5.6 8.8 0 15.9-6.5 15.9-14.7S26.8 2.1 18 2.1zm1.7 19.8l-4.1-4.3-7.9 4.3 8.7-9.2 4.2 4.3 7.8-4.3-8.7 9.2z"/>
      </svg>

      {/* Expandable text */}
      <span
        className={`whitespace-nowrap font-semibold text-sm overflow-hidden transition-all duration-300 ${
          hovered ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Sendu okkur skilaboð
      </span>

      {/* Pulse ring animation */}
      <span className="absolute inset-0 rounded-full bg-[#0084FF] animate-ping opacity-20 pointer-events-none" />
    </a>
  )
}
