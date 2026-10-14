import { ImageResponse } from 'next/og'
export const alt = 'Eðalkaup — Bílar til sölu'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{ width: '100%', height: '100%', background: '#0a0f1c', color: 'white', display: 'flex', flexDirection: 'column', padding: '70px', justifyContent: 'space-between' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 42, fontWeight: 600, letterSpacing: 6 }}>EÐALKAUP</span><div style={{ width: 72, height: 3, background: '#c9a84c', marginTop: 12 }} /><span style={{ marginTop: 10, fontSize: 16, letterSpacing: 4, color: '#cbd5e1' }}>BÍLAINNFLUTNINGUR</span></div>
    <div style={{ display: 'flex', flexDirection: 'column', fontSize: 58, fontWeight: 600, lineHeight: 1.08 }}><span>Sérvaldir bílar,</span><span>fluttir inn fyrir þig.</span></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 23, color: '#cbd5e1' }}><span>Yfir 25 ára reynsla</span><span>edalkaup.is</span></div>
  </div>, { ...size })
}
