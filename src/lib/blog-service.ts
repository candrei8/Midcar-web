import { supabase, isSupabaseConfigured } from './supabase'
import { blogPosts as _staticBlogPosts, blogCategories as _staticBlogCategories } from '@/data/blog-posts'

// Re-export types from shared file (avoids circular dependency with data file)
export type { BlogCategory, BlogPost, BlogPostsOptions, BlogPostsResult, PopularBrand, PopularModel } from './blog-types'
import type { BlogCategory, BlogPost, BlogPostsOptions, BlogPostsResult, PopularBrand, PopularModel } from './blog-types'

// Cast untyped data imports
const staticBlogPosts = _staticBlogPosts as BlogPost[]
const staticBlogCategories = _staticBlogCategories as BlogCategory[]

// ============================================================================
// CATEGORÍAS
// ============================================================================

export async function getBlogCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseConfigured) {
    return staticBlogCategories
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error fetching blog categories:', error)
    return staticBlogCategories
  }

  return data || []
}

export async function getBlogCategoryBySlug(slug: string): Promise<BlogCategory | null> {
  if (!isSupabaseConfigured) {
    return staticBlogCategories.find(c => c.slug === slug) || null
  }

  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .eq('activo', true)
    .single()

  if (error) {
    console.error('Error fetching blog category:', error)
    return staticBlogCategories.find(c => c.slug === slug) || null
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

  if (!isSupabaseConfigured) {
    let filtered = [...staticBlogPosts]

    // Category filtering
    let categoryId = categoria_id
    if (categoria_slug && !categoryId) {
      const cat = staticBlogCategories.find(c => c.slug === categoria_slug)
      categoryId = cat?.id
      if (!categoryId) {
        return { posts: [], total: 0, page, totalPages: 0 }
      }
    }
    if (categoryId) {
      filtered = filtered.filter(p => p.categoria_id === categoryId)
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

  const offset = (page - 1) * limit

  // First get the category id if we have a slug
  let categoryId = categoria_id
  if (categoria_slug && !categoryId) {
    const category = await getBlogCategoryBySlug(categoria_slug)
    categoryId = category?.id
    if (!categoryId) {
      return { posts: [], total: 0, page, totalPages: 0 }
    }
  }

  // Build query
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `, { count: 'exact' })
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false })

  if (categoryId) {
    query = query.eq('categoria_id', categoryId)
  }

  if (destacado !== undefined) {
    query = query.eq('destacado', destacado)
  }

  if (search) {
    query = query.or(`titulo.ilike.%${search}%,extracto.ilike.%${search}%,contenido.ilike.%${search}%`)
  }

  // Paginate
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching blog posts:', error)
    // Fallback to static data
    const total = staticBlogPosts.length
    const totalPages = Math.ceil(total / limit)
    const posts = staticBlogPosts.slice(offset, offset + limit)
    return { posts, total, page, totalPages }
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    posts: data || [],
    total,
    page,
    totalPages,
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured) {
    return staticBlogPosts.find(p => p.slug === slug) || null
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

  if (error) {
    console.error('Error fetching blog post by slug:', error)
    // Fallback to static data
    return staticBlogPosts.find(p => p.slug === slug) || null
  }

  return data
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    // No featured posts in MongoDB data, return latest
    return staticBlogPosts.slice(0, limit)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `)
    .eq('estado', 'publicado')
    .eq('destacado', true)
    .order('fecha_publicacion', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured posts:', error)
    return staticBlogPosts.slice(0, limit)
  }

  return data || []
}

export async function getLatestPosts(limit: number = 5): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    return staticBlogPosts.slice(0, limit)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `)
    .eq('estado', 'publicado')
    .order('fecha_publicacion', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest posts:', error)
    return staticBlogPosts.slice(0, limit)
  }

  return data || []
}

export async function getRelatedPosts(post: BlogPost, limit: number = 4): Promise<BlogPost[]> {
  if (!isSupabaseConfigured) {
    // First try same category
    if (post.categoria_id) {
      const sameCat = staticBlogPosts
        .filter(p => p.id !== post.id && p.categoria_id === post.categoria_id)
        .slice(0, limit)
      if (sameCat.length >= limit) return sameCat
    }
    // Fallback to latest posts excluding current
    return staticBlogPosts
      .filter(p => p.id !== post.id)
      .slice(0, limit)
  }

  // Try to get posts from the same category first
  if (post.categoria_id) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        categoria:blog_categories(*)
      `)
      .eq('estado', 'publicado')
      .eq('categoria_id', post.categoria_id)
      .neq('id', post.id)
      .order('fecha_publicacion', { ascending: false })
      .limit(limit)

    if (!error && data && data.length > 0) {
      return data
    }
  }

  // If no category posts found, get latest posts excluding current
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      categoria:blog_categories(*)
    `)
    .eq('estado', 'publicado')
    .neq('id', post.id)
    .order('fecha_publicacion', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching related posts:', error)
    return staticBlogPosts.filter(p => p.id !== post.id).slice(0, limit)
  }

  return data || []
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return staticBlogPosts.map(p => p.slug)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('estado', 'publicado')

  if (error) {
    console.error('Error fetching blog slugs:', error)
    return staticBlogPosts.map(p => p.slug)
  }

  return data?.map(p => p.slug) || []
}

export async function getAllActiveCategorySlugs(): Promise<string[]> {
  if (!isSupabaseConfigured) return staticBlogCategories.map(c => c.slug)

  const { data, error } = await supabase
    .from('blog_categories')
    .select('slug')
    .eq('activo', true)

  if (error) {
    console.error('Error fetching category slugs:', error)
    return []
  }

  return data?.map(c => c.slug) || []
}

// ============================================================================
// TAGS
// ============================================================================

export async function getPopularTags(limit: number = 10): Promise<string[]> {
  if (!isSupabaseConfigured) {
    const tagCounts: Record<string, number> = {}
    staticBlogPosts.forEach(post => {
      (post.tags || []).forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([tag]) => tag)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select('tags')
    .eq('estado', 'publicado')

  if (error) {
    console.error('Error fetching tags:', error)
    return []
  }

  // Flatten all tags and count them
  const tagCounts: Record<string, number> = {}
  data?.forEach(post => {
    const tags = post.tags || []
    tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // Sort by count and return top tags
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
    // Use static vehicle data
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
