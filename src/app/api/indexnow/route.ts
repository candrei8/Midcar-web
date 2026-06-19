import { NextRequest, NextResponse } from 'next/server'
import { submitToIndexNow } from '@/lib/indexnow'

// Endpoint para que el CRM/automatización avise a IndexNow al publicar/actualizar
// contenido (coche nuevo, guía nueva). DESACTIVADO por defecto: solo responde si
// existe INDEXNOW_TRIGGER_SECRET en el entorno (safe-by-default).
//
// Uso:
//   POST /api/indexnow
//   Header: Authorization: Bearer <INDEXNOW_TRIGGER_SECRET>
//   Body:   { "urls": ["https://midcar.es/vehiculos/STK-1234", "https://midcar.es/blog/mi-guia"] }

export async function POST(request: NextRequest) {
  const secret = process.env.INDEXNOW_TRIGGER_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'IndexNow trigger desactivado (define INDEXNOW_TRIGGER_SECRET en Netlify)' },
      { status: 503 },
    )
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const urls = (body as { urls?: unknown })?.urls
  if (!Array.isArray(urls) || urls.some((u) => typeof u !== 'string')) {
    return NextResponse.json({ error: 'El cuerpo debe ser { urls: string[] }' }, { status: 400 })
  }

  const result = await submitToIndexNow(urls as string[])
  return NextResponse.json(result, { status: result.ok ? 200 : 502 })
}
