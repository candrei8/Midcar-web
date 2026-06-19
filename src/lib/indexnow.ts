// IndexNow — notifica a Bing (y Yandex/Naver/Seznam) al publicar o actualizar
// contenido, para acelerar su indexación. Beneficia indirectamente a ChatGPT Search,
// que bebe del índice de Bing. Google NO soporta IndexNow (usa sitemap + Search Console).

const INDEXNOW_KEY = '4397b637b2a7438b854cbd51d6587334'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://midcar.es'
const host = new URL(siteUrl).host // p. ej. midcar.es

export interface IndexNowResult {
  ok: boolean
  status: number
  submitted: number
}

/**
 * Envía una o varias URLs a IndexNow. Solo se envían las URLs que pertenecen a `host`
 * (IndexNow rechaza URLs de otros dominios). No lanza: registra y devuelve el estado.
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const urlList = urls.filter((u) => {
    try {
      return new URL(u).host === host
    } catch {
      return false
    }
  })
  if (urlList.length === 0) return { ok: false, status: 0, submitted: 0 }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteUrl}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    })
    return { ok: res.ok, status: res.status, submitted: urlList.length }
  } catch (err) {
    console.error('IndexNow submit failed:', err)
    return { ok: false, status: 0, submitted: 0 }
  }
}
