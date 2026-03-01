// ============================================================================
// BLOG TYPES - Shared between blog-service.ts and blog-posts.ts data
// ============================================================================

export interface BlogCategory {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  imagen_url: string | null
  orden: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  slug: string
  titulo: string
  extracto: string | null
  contenido: string
  imagen_principal: string | null
  categoria_id: string | null
  autor: string
  tags: string[]
  seo_titulo: string | null
  seo_descripcion: string | null
  seo_keywords: string | null
  estado: 'borrador' | 'publicado' | 'archivado'
  destacado: boolean
  orden: number
  fecha_publicacion: string | null
  created_at: string
  updated_at: string
  categoria?: BlogCategory
}

export interface BlogPostsOptions {
  page?: number
  limit?: number
  categoria_id?: string
  categoria_slug?: string
  destacado?: boolean
  search?: string
}

export interface BlogPostsResult {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
}

export interface PopularBrand {
  marca: string
  count: number
}

export interface PopularModel {
  marca: string
  modelo: string
  count: number
}
