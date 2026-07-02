import { getSupabaseClient, isSupabaseConfigured } from './supabase-lazy'

// Re-export types from shared file (avoids circular dependency with data file)
export type { BlogCategory, BlogPost, BlogPostsOptions, BlogPostsResult, PopularBrand, PopularModel } from './blog-types'
import type { BlogCategory, BlogPost, BlogPostsOptions, BlogPostsResult, PopularBrand, PopularModel } from './blog-types'

// ---- Lazy-loaded static data (avoids bundling ~15MB in client) ----

let _staticBlogPosts: BlogPost[] | null = null
let _staticBlogCategories: BlogCategory[] | null = null

async function getStaticBlogPosts(): Promise<BlogPost[]> {
  if (!_staticBlogPosts) {
    const { blogPosts } = await import('@/data/blog-posts')
    _staticBlogPosts = blogPosts as BlogPost[]
  }
  return _staticBlogPosts
}

async function getStaticBlogCategories(): Promise<BlogCategory[]> {
  if (!_staticBlogCategories) {
    const { blogCategories } = await import('@/data/blog-posts')
    _staticBlogCategories = blogCategories as BlogCategory[]
  }
  return _staticBlogCategories
}

// ---- Fusión BD + estático ----
// La BD (panel) es la fuente editable; el fichero estático conserva el archivo
// histórico (~205 guías migradas de MongoDB). La lógica anterior era "BD *o*
// estático": en cuanto la BD tuvo su primer post publicado, las guías
// estáticas desaparecieron del listado y del sitemap. Ambas fuentes deben
// FUSIONARSE siempre; si un slug existe en ambas, gana la BD.

async function getPublishedDbPosts(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) return []
  const supabase = await getSupabaseClient()
  if (!supabase) return []

  // Sin paginación: los posts gestionados desde el panel son pocas decenas;
  // la paginación se hace en memoria sobre el conjunto fusionado.
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `)
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false })

  if (error) {
    console.error('Error fetching published blog posts:', error)
    return []
  }
  return data || []
}

function mergeWithStatic(dbPosts: BlogPost[], staticPosts: BlogPost[]): BlogPost[] {
  const dbSlugs = new Set(dbPosts.map(p => p.slug))
  return [...dbPosts, ...staticPosts.filter(p => !dbSlugs.has(p.slug))].sort(
    (a, b) =>
      new Date(b.fecha_publicacion || b.created_at || 0).getTime() -
      new Date(a.fecha_publicacion || a.created_at || 0).getTime()
  )
}

async function getMergedPublishedPosts(): Promise<BlogPost[]> {
  const [dbPosts, staticPosts] = await Promise.all([getPublishedDbPosts(), getStaticBlogPosts()])
  return mergeWithStatic(dbPosts, staticPosts)
}

// ============================================================================
// CATEGORIAS
// ============================================================================

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured) {
    return await getStaticBlogCategories()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) return await getStaticBlogCategories()

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error || !data || data.length === 0) {
    if (error) console.error('Error fetching blog categories:', error)
    return await getStaticBlogCategories()
  }

  return data
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  if (!isSupabaseConfigured) {
    const cats = await getStaticBlogCategories()
    return cats.find(c => c.slug === slug) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const cats = await getStaticBlogCategories()
    return cats.find(c => c.slug === slug) || null
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error || !data) {
    if (error && error.code !== 'PGRST116') console.error('Error fetching blog category:', error)
    const cats = await getStaticBlogCategories()
    return cats.find(c => c.slug === slug) || null
  }

  return data
}

// ============================================================================
// POSTS
// ============================================================================

export async function getBlogPosts(options: BlogPostsOptions = {}): Promise<BlogPostsResult> {
  const {
    page = 1,
    limit = 12,
    categoria_id,
    categoria_slug,
    destacado,
    search,
  } = options

  // Conjunto fusionado BD + estático; filtros y paginación en memoria para
  // que ambas fuentes convivan (ver nota en mergeWithStatic).
  let filtered = await getMergedPublishedPosts()

  if (categoria_slug) {
    // Por slug cubre tanto categorías de BD (join) como estáticas (embebida)
    filtered = filtered.filter(p => p.categoria?.slug === categoria_slug)
  } else if (categoria_id) {
    filtered = filtered.filter(p => p.categoria_id === categoria_id)
  }

  if (destacado !== undefined) {
    filtered = filtered.filter(p => p.destacado === destacado)
  }

  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(p =>
      p.titulo.toLowerCase().includes(q) ||
      (p.extracto && p.extracto.toLowerCase().includes(q)) ||
      p.contenido.toLowerCase().includes(q)
    )
  }

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const posts = filtered.slice(offset, offset + limit)

  return { posts, total, page, totalPages }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) {
    const posts = await getStaticBlogPosts()
    return posts.find(p => p.slug === slug) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const posts = await getStaticBlogPosts()
    return posts.find(p => p.slug === slug) || null
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `)
    .eq('slug', slug)
    .eq('estado', 'publicado')
    .single()

  if (error || !data) {
    if (error && error.code !== 'PGRST116') console.error('Error fetching blog post by slug:', error)
    const posts = await getStaticBlogPosts()
    return posts.find(p => p.slug === slug) || null
  }

  return data
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const merged = await getMergedPublishedPosts()
  const featured = merged.filter(p => p.destacado)
  return featured.length > 0 ? featured.slice(0, limit) : merged.slice(0, limit)
}

export async function getLatestPosts(limit: number = 5): Promise<BlogPost[]> {
  const merged = await getMergedPublishedPosts()
  return merged.slice(0, limit)
}

export async function getRelatedPosts(post: BlogPost, limit: number = 4): Promise<BlogPost[]> {
  const merged = await getMergedPublishedPosts()
  const pool = merged.filter(p => p.slug !== post.slug)

  // Primero de la misma categoría (por id o por slug, cubre BD y estático)
  const sameCat = pool.filter(p =>
    (post.categoria_id && p.categoria_id === post.categoria_id) ||
    (post.categoria?.slug && p.categoria?.slug === post.categoria.slug)
  )
  const rest = pool.filter(p => !sameCat.includes(p))
  return [...sameCat, ...rest].slice(0, limit)
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  // Unión BD + estático: el sitemap debe listar TODAS las guías publicadas
  const merged = await getMergedPublishedPosts()
  return merged.map(p => p.slug)
}

export async function getAllActiveCategorySlugs(): Promise<string[]> {
  // Unión BD + estático (las categorías del archivo histórico también tienen
  // página propia y deben seguir en el sitemap)
  const staticSlugs = (await getStaticBlogCategories()).map(c => c.slug)

  if (!isSupabaseConfigured) return staticSlugs
  const supabase = await getSupabaseClient()
  if (!supabase) return staticSlugs

  const { data, error } = await supabase
    .from('blog_categories')
    .select('slug')
    .eq('activo', true)

  if (error) {
    console.error('Error fetching category slugs:', error)
    return staticSlugs
  }

  const dbSlugs = (data || []).map(c => c.slug)
  return Array.from(new Set([...dbSlugs, ...staticSlugs]))
}

// ============================================================================
// TAGS
// ============================================================================

export async function getPopularTags(limit: number = 10): Promise<string[]> {
  // Sobre el conjunto fusionado BD + estático
  const merged = await getMergedPublishedPosts()
  const tagCounts: Record<string, number> = {}
  merged.forEach(post => {
    (post.tags || []).forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag)
}

// ============================================================================
// SIDEBAR DATA - Dynamic from vehicles
// ============================================================================

export async function getPopularBrands(limit: number = 8): Promise<PopularBrand[]> {
  if (!isSupabaseConfigured) {
    const { vehicles } = await import('@/data/vehicles')
    const disponible = vehicles.filter(v => v.onSale || v.status === 'disponible')
    const brandCounts: Record<string, number> = {}
    disponible.forEach(v => {
      brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1
    })
    return Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([marca, count]) => ({ marca, count }))
  }

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('vehicles')
    .select('marca')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching popular brands:', error)
    return []
  }

  // Count brands
  const brandCounts: Record<string, number> = {}
  data?.forEach(v => {
    brandCounts[v.marca] = (brandCounts[v.marca] || 0) + 1
  })

  return Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([marca, count]) => ({ marca, count }))
}

export async function getPopularModels(limit: number = 6): Promise<PopularModel[]> {
  if (!isSupabaseConfigured) {
    const { vehicles } = await import('@/data/vehicles')
    const disponible = vehicles.filter(v => v.onSale || v.status === 'disponible')
    const modelCounts: Record<string, { marca: string; modelo: string; count: number }> = {}
    disponible.forEach(v => {
      const key = `${v.brand}|${v.model}`
      if (!modelCounts[key]) {
        modelCounts[key] = { marca: v.brand, modelo: v.model, count: 0 }
      }
      modelCounts[key].count++
    })
    return Object.values(modelCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('vehicles')
    .select('marca, modelo')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching popular models:', error)
    return []
  }

  // Count models
  const modelCounts: Record<string, { marca: string; modelo: string; count: number }> = {}
  data?.forEach(v => {
    const key = `${v.marca}|${v.modelo}`
    if (!modelCounts[key]) {
      modelCounts[key] = { marca: v.marca, modelo: v.modelo, count: 0 }
    }
    modelCounts[key].count++
  })

  return Object.values(modelCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export async function getVehicleBodyTypes(): Promise<{ tipo: string; count: number }[]> {
  if (!isSupabaseConfigured) {
    const { vehicles } = await import('@/data/vehicles')
    const disponible = vehicles.filter(v => v.onSale || v.status === 'disponible')
    const typeCounts: Record<string, number> = {}
    disponible.forEach(v => {
      if (v.bodyType) {
        typeCounts[v.bodyType] = (typeCounts[v.bodyType] || 0) + 1
      }
    })
    return Object.entries(typeCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tipo, count]) => ({ tipo, count }))
  }

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('vehicles')
    .select('carroceria')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching body types:', error)
    return []
  }

  const typeCounts: Record<string, number> = {}
  data?.forEach(v => {
    if (v.carroceria) {
      typeCounts[v.carroceria] = (typeCounts[v.carroceria] || 0) + 1
    }
  })

  return Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([tipo, count]) => ({ tipo, count }))
}

// ============================================================================
// HELPERS
// ============================================================================

export function formatBlogDate(dateString: string | null): string {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatBlogDateShort(dateString: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
