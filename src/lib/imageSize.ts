import { cache } from 'react'

export type ImageSize = { width: number; height: number }

function u16(buf: Uint8Array, offset: number): number {
  return (buf[offset] << 8) | buf[offset + 1]
}

function u32(buf: Uint8Array, offset: number): number {
  return (buf[offset] * 0x1000000 + (buf[offset + 1] << 16) + (buf[offset + 2] << 8) + buf[offset + 3]) >>> 0
}

function valid(width: number, height: number): ImageSize | null {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null
  if (width > 20000 || height > 20000) return null
  return { width, height }
}

function webpSize(buf: Uint8Array): ImageSize | null {
  if (buf.length < 30) return null
  if (buf[0] !== 0x52 || buf[1] !== 0x49 || buf[2] !== 0x46 || buf[3] !== 0x46) return null
  if (buf[8] !== 0x57 || buf[9] !== 0x45 || buf[10] !== 0x42 || buf[11] !== 0x50) return null
  const format = String.fromCharCode(buf[12], buf[13], buf[14], buf[15])
  if (format === 'VP8X' && buf.length >= 30) {
    const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16))
    const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))
    return valid(width, height)
  }
  if (format === 'VP8 ' && buf.length >= 30) {
    return valid(buf[26] | (buf[27] << 8), buf[28] | (buf[29] << 8))
  }
  if (format === 'VP8L' && buf.length >= 25) {
    const bits = buf[21] | (buf[22] << 8) | (buf[23] << 16) | (buf[24] << 24)
    return valid((bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1)
  }
  return null
}

function jpegSize(buf: Uint8Array): ImageSize | null {
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return null
  let i = 2
  while (i + 8 < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1
      continue
    }
    const marker = buf[i + 1]
    if (marker === 0xd8 || marker === 0xd9) {
      i += 2
      continue
    }
    if (i + 3 >= buf.length) break
    const length = u16(buf, i + 2)
    if (length < 2) break
    if (marker >= 0xc0 && marker <= 0xc2 && i + 8 < buf.length) {
      return valid(u16(buf, i + 7), u16(buf, i + 5))
    }
    i += 2 + length
  }
  return null
}

/** Read width and height from the start of a PNG, GIF, WEBP, or JPEG. */
export function parseImageSize(buf: Uint8Array): ImageSize | null {
  if (buf.length >= 24 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return valid(u32(buf, 16), u32(buf, 20))
  }
  if (buf.length >= 10 && buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
    return valid(buf[6] | (buf[7] << 8), buf[8] | (buf[9] << 8))
  }
  return webpSize(buf) || jpegSize(buf)
}

export const fetchImageSize = cache(async (url: string): Promise<ImageSize | null> => {
  try {
    const response = await fetch(url, {
      headers: { Range: 'bytes=0-262143' },
      signal: AbortSignal.timeout(4000),
    })
    if (!response.ok && response.status !== 206) return null
    const bytes = new Uint8Array(await response.arrayBuffer())
    return parseImageSize(bytes)
  } catch {
    return null
  }
})
