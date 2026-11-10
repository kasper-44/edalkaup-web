import type { Metadata } from 'next'
export const metadata: Metadata = { robots: { index: false, follow: false }, title: 'Stjórnborð' }
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children }
