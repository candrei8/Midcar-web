/**
 * Convert MongoDB blog data export to static TypeScript data file
 *
 * Usage: node scripts/convert-blog-data.mjs <path-to-extracted-db-folder>
 * Example: node scripts/convert-blog-data.mjs C:/Users/zetar/tmp/midcar-db
 */

import fs from 'fs'
import path from 'path'

const dbPath = process.argv[2] || 'C:/Users/zetar/tmp/midcar-db'

// Read blog data
const blogRaw = JSON.parse(fs.readFileSync(path.join(dbPath, 'blog-mongodb-compass.json'), 'utf-8'))

console.log(`Read ${blogRaw.length} blog posts from MongoDB export`)

// Helper to extract date from MongoDB extended JSON
function getDate(val) {
  if (!val) return null
  if (val['$date']) {
    const d = val['$date']
    if (d['$numberLong']) return new Date(parseInt(d['$numberLong']))
    if (typeof d === 'string') return new Date(d)
    if (typeof d === 'number') return new Date(d)
  }
  if (typeof val === 'string') return new Date(val)
  return null
}

// Helper to strip HTML tags for extracto
function stripHtml(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&iacute;/g, 'í')
    .replace(/&aacute;/g, 'á')
    .replace(/&eacute;/g, 'é')
    .replace(/&oacute;/g, 'ó')
    .replace(/&uacute;/g, 'ú')
    .replace(/&ntilde;/g, 'ñ')
    .replace(/&uuml;/g, 'ü')
    .replace(/&iquest;/g, '¿')
    .replace(/&iexcl;/g, '¡')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&#\d+;/g, '')
    .replace(/&\w+;/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Clean HTML content: strip CMS data-* attributes
function cleanHtml(html) {
  if (!html) return ''
  return html
    .replace(/\s+data-start="[^"]*"/g, '')
    .replace(/\s+data-end="[^"]*"/g, '')
    .replace(/\s+data-pm-slice="[^"]*"/g, '')
}

// Encode image URLs (replace spaces with %20)
function encodeImageUrl(url) {
  if (!url) return ''
  return url.replace(/ /g, '%20')
}

// Auto-categorize based on title and content keywords
function autoCategorizate(title, content) {
  const t = (title || '').toLowerCase()
  const c = (content || '').toLowerCase().substring(0, 2000)

  if (t.includes('itv') || c.includes('inspección técnica'))
    return { id: 'itv', nombre: 'ITV', slug: 'itv' }
  if (t.includes('seguro') || t.includes('asegurar') || t.includes('póliza'))
    return { id: 'seguros', nombre: 'Seguros', slug: 'seguros' }
  if (t.includes('financ') || t.includes('crédito') || t.includes('préstamo'))
    return { id: 'financiacion', nombre: 'Financiación', slug: 'financiacion' }
  if (t.includes('eléctric') || t.includes('electric') || t.includes('híbrido') || t.includes('hibrido') || t.includes('emisiones') || t.includes('co2') || t.includes('etiqueta medioambiental'))
    return { id: 'movilidad-sostenible', nombre: 'Movilidad Sostenible', slug: 'movilidad-sostenible' }
  if (t.includes('tráfico') || t.includes('trafico') || t.includes('multa') || t.includes('dgt') || t.includes('carnet') || t.includes('velocidad') || t.includes('radar'))
    return { id: 'trafico-normativa', nombre: 'Tráfico y Normativa', slug: 'trafico-normativa' }
  if (t.includes('mantenimiento') || t.includes('revisión') || t.includes('revision') || t.includes('taller') || t.includes('avería') || t.includes('averia'))
    return { id: 'mantenimiento', nombre: 'Mantenimiento', slug: 'mantenimiento' }
  if (t.includes('neumátic') || t.includes('neumatic') || t.includes('freno') || t.includes('aceite') || t.includes('batería') || t.includes('bateria') || t.includes('motor'))
    return { id: 'mecanica', nombre: 'Mecánica', slug: 'mecanica' }
  if (t.includes('compra') || t.includes('venta') || t.includes('comprar') || t.includes('segunda mano') || t.includes('ocasión') || t.includes('ocasion'))
    return { id: 'compraventa', nombre: 'Compraventa', slug: 'compraventa' }
  if (t.includes('verano') || t.includes('invierno') || t.includes('viaje') || t.includes('vacacion') || t.includes('ruta'))
    return { id: 'viajes', nombre: 'Viajes y Rutas', slug: 'viajes-rutas' }
  if (t.includes('consejo') || t.includes('trucos') || t.includes('ahorr') || t.includes('tips') || t.includes('cómo') || t.includes('como'))
    return { id: 'consejos', nombre: 'Consejos', slug: 'consejos' }

  return { id: 'noticias', nombre: 'Noticias', slug: 'noticias' }
}

// Auto-generate tags from title
function autoGenerateTags(title) {
  const t = (title || '').toLowerCase()
  const tags = []

  if (t.includes('itv')) tags.push('ITV')
  if (t.includes('seguro')) tags.push('seguros')
  if (t.includes('financ')) tags.push('financiación')
  if (t.includes('eléctric') || t.includes('electric')) tags.push('coches eléctricos')
  if (t.includes('híbrido') || t.includes('hibrido')) tags.push('híbridos')
  if (t.includes('diesel')) tags.push('diesel')
  if (t.includes('gasolina')) tags.push('gasolina')
  if (t.includes('dgt')) tags.push('DGT')
  if (t.includes('multa')) tags.push('multas')
  if (t.includes('neumátic') || t.includes('neumatic')) tags.push('neumáticos')
  if (t.includes('freno')) tags.push('frenos')
  if (t.includes('aceite')) tags.push('aceite')
  if (t.includes('madrid')) tags.push('Madrid')
  if (t.includes('verano')) tags.push('verano')
  if (t.includes('invierno')) tags.push('invierno')
  if (t.includes('segunda mano') || t.includes('ocasión') || t.includes('ocasion')) tags.push('segunda mano')
  if (t.includes('comprar')) tags.push('comprar coche')
  if (t.includes('ahorro') || t.includes('ahorr')) tags.push('ahorro')
  if (t.includes('seguridad')) tags.push('seguridad vial')
  if (t.includes('mantenimiento')) tags.push('mantenimiento')
  if (t.includes('conducir') || t.includes('conducción')) tags.push('conducción')

  return tags
}

// Process blog posts
const processedPosts = []
const categoriesMap = {}

for (const post of blogRaw) {
  const id = post._id
  const title = post.Title || ''
  const uri = post.Uri || ''
  const rawContent = post.Content || ''
  const content = cleanHtml(rawContent)
  const metaTitle = post.MetaTitle || ''
  const metaDescription = post.MetaDescription || ''

  // Skip posts without title or content
  if (!title || !content) {
    console.log(`  Skipping post without title/content: ${id}`)
    continue
  }

  // Date
  const dateObj = getDate(post.Date)
  const dateStr = dateObj ? dateObj.toISOString() : new Date().toISOString()

  // Images
  const fileDocuments = post.FileDocuments || []
  const thumbnailDocs = post.ThumbnailFileDocuments || []
  const mainDoc = fileDocuments.find(f => f.Main) || fileDocuments[0] || thumbnailDocs[0]
  const mainImage = mainDoc ? encodeImageUrl(mainDoc.Url) : ''

  // Generate extracto (plain text, ~200 chars)
  const plainText = stripHtml(content)
  const extracto = plainText.length > 200
    ? plainText.substring(0, 200).replace(/\s+\S*$/, '') + '...'
    : plainText

  // Fix SEO metadata - use proper fallbacks for garbage data
  const isGarbageMeta = (val) => !val || val.length < 15 || ['b', 'blog', 'Blog', 'ITV'].includes(val.trim())
  const seoTitulo = isGarbageMeta(metaTitle) ? `${title} | Blog MID Car` : metaTitle
  const seoDescripcion = isGarbageMeta(metaDescription)
    ? (extracto.length > 50 ? extracto : `${title}. Lee más en el blog de MID Car, tu concesionario de coches de ocasión en Madrid.`)
    : metaDescription

  // Slug
  const slug = uri || title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Auto-categorize
  const category = autoCategorizate(title, content)
  categoriesMap[category.id] = category

  // Auto-generate tags
  const tags = autoGenerateTags(title)

  const blogPost = {
    id,
    slug,
    titulo: title,
    extracto,
    contenido: content,
    imagen_principal: mainImage,
    categoria_id: category.id,
    autor: 'MID Car',
    tags,
    seo_titulo: seoTitulo,
    seo_descripcion: seoDescripcion,
    seo_keywords: null,
    estado: 'publicado',
    destacado: false,
    orden: 0,
    fecha_publicacion: dateStr,
    created_at: dateStr,
    updated_at: dateStr,
    categoria: category,
  }

  processedPosts.push(blogPost)
}

// Sort by date descending (newest first)
processedPosts.sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))

// Mark the 6 newest posts as featured
for (let i = 0; i < Math.min(6, processedPosts.length); i++) {
  processedPosts[i].destacado = true
}

// Stats
const catCounts = {}
processedPosts.forEach(p => {
  catCounts[p.categoria.nombre] = (catCounts[p.categoria.nombre] || 0) + 1
})

console.log(`Processed ${processedPosts.length} blog posts`)
console.log(`  With images: ${processedPosts.filter(p => p.imagen_principal).length}`)
console.log(`  Featured: ${processedPosts.filter(p => p.destacado).length}`)
console.log(`  With tags: ${processedPosts.filter(p => p.tags.length > 0).length}`)
console.log(`  Date range: ${processedPosts[processedPosts.length - 1]?.fecha_publicacion?.split('T')[0]} to ${processedPosts[0]?.fecha_publicacion?.split('T')[0]}`)
console.log(`  Categories:`)
Object.entries(catCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`    ${cat}: ${count}`)
})

// ============================================================
// Generate blog-posts.ts
// ============================================================

const allCategories = Object.values(categoriesMap).sort((a, b) => a.nombre.localeCompare(b.nombre))

let blogTs = `// Blog post data from MongoDB export - MidCar database
// Generated: ${new Date().toISOString().split('T')[0]}
// Total: ${processedPosts.length} blog posts (${processedPosts.filter(p => p.destacado).length} featured)
// Categories: ${allCategories.map(c => c.nombre).join(', ')}

// Auto-generated categories from content analysis
export const blogCategories = [
${allCategories.map(c => `  {
    id: ${JSON.stringify(c.id)},
    nombre: ${JSON.stringify(c.nombre)},
    slug: ${JSON.stringify(c.slug)},
    descripcion: ${JSON.stringify(`Artículos sobre ${c.nombre.toLowerCase()} en el blog de MID Car`)},
    imagen_url: null,
    orden: 0,
    activo: true,
    created_at: '2020-01-01T00:00:00.000Z',
    updated_at: '2020-01-01T00:00:00.000Z',
  }`).join(',\n')}
]

export const blogPosts = [
`

for (const post of processedPosts) {
  blogTs += `  {\n`
  blogTs += `    id: ${JSON.stringify(post.id)},\n`
  blogTs += `    slug: ${JSON.stringify(post.slug)},\n`
  blogTs += `    titulo: ${JSON.stringify(post.titulo)},\n`
  blogTs += `    extracto: ${JSON.stringify(post.extracto)},\n`
  blogTs += `    contenido: ${JSON.stringify(post.contenido)},\n`
  blogTs += `    imagen_principal: ${JSON.stringify(post.imagen_principal || null)},\n`
  blogTs += `    categoria_id: ${JSON.stringify(post.categoria_id)},\n`
  blogTs += `    autor: 'MID Car',\n`
  blogTs += `    tags: ${JSON.stringify(post.tags)},\n`
  blogTs += `    seo_titulo: ${JSON.stringify(post.seo_titulo)},\n`
  blogTs += `    seo_descripcion: ${JSON.stringify(post.seo_descripcion)},\n`
  blogTs += `    seo_keywords: null,\n`
  blogTs += `    estado: 'publicado',\n`
  blogTs += `    destacado: ${post.destacado},\n`
  blogTs += `    orden: 0,\n`
  blogTs += `    fecha_publicacion: ${JSON.stringify(post.fecha_publicacion)},\n`
  blogTs += `    created_at: ${JSON.stringify(post.created_at)},\n`
  blogTs += `    updated_at: ${JSON.stringify(post.updated_at)},\n`
  if (post.categoria) {
    blogTs += `    categoria: ${JSON.stringify(post.categoria)},\n`
  }
  blogTs += `  },\n`
}

blogTs += `]\n`

// Write file
const outputDir = path.resolve('src/data')
fs.writeFileSync(path.join(outputDir, 'blog-posts.ts'), blogTs, 'utf-8')

console.log(`\nFile written:`)
console.log(`  src/data/blog-posts.ts (${(blogTs.length / 1024).toFixed(0)} KB)`)
