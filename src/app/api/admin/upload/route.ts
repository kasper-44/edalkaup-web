import { NextResponse } from 'next/server'
import { supabaseAdmin, isAuthorized } from '@/lib/supabaseAdmin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const BUCKET = 'car-images'
const MAX_BYTES = 8 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])

function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40) || 'car'
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Óheimilt' }, { status: 401 })
  }

  const form = await req.formData()
  const folder = slug(String(form.get('folder') || 'manual'))
  const files = form.getAll('files').filter((f): f is File => f instanceof File)

  if (!files.length) {
    return NextResponse.json({ error: 'Engar myndir' }, { status: 400 })
  }

  const urls: string[] = []
  const stamp = Date.now()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ error: `Ógild skráargerð: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `Mynd of stór: ${file.name}` }, { status: 400 })
    }
    const ext = file.type.includes('png') ? 'png' : file.type.includes('webp') ? 'webp' : 'jpg'
    const path = `${folder}/${stamp}-${String(i + 1).padStart(2, '0')}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    const { error } = await supabaseAdmin.storage.from(BUCKET).upload(path, buf, {
      contentType: file.type,
      upsert: false,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)
    urls.push(data.publicUrl)
  }

  return NextResponse.json({ urls })
}
