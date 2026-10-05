import { ImageResponse } from 'next/og'
export const alt = 'Eðalkaup — Bílar til sölu'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', background: '#0a0f1c', color: 'white', display: 'flex', flexDirection: 'column', padding: '70px', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}><div style={{ display: 'flex', background: '#c9a84c', color: '#0a0f1c', width: 78, height: 78, borderRadius: 14, alignItems: 'center', justifyContent: 'center', fontSize: 50, fontWeight: 700 }}>E</div><span style={{ fontSize: 38, fontWeight: 700 }}>EÐALKAUP</span></div>
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 66, fontWeight: 700, lineHeight: 1.1 }}><span>Bílar til sölu.</span><span style={{ color: '#c9a84c' }}>Persónuleg þjónusta.</span></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, color: '#cbd5e1' }}><span>Yfir 25 ára reynsla</span><span>edalkaup.is</span></div>
  </div>, { ...size })
}
