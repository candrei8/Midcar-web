import { MetadataRoute } from 'next'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

// Función para generar slug de vehículo
function generateSlug(marca: string, modelo: string, id: string): string {
  const baseSlug = `${marca}-${modelo}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${baseSlug}-${id.slice(0, 8)}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Páginas estáticas
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/vehiculos`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/financiacion`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/coche-a-la-carta`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Vehículos dinámicos desde Supabase
  let vehiclePages: MetadataRoute.Sitemap = []
  let blogPages: MetadataRoute.Sitemap = []
  let categoryPages: MetadataRoute.Sitemap = []

  if (isSupabaseConfigured) {
    try {
      // Fetch vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicles')
        .select('id, stock_id, marca, modelo, updated_at')
        .eq('estado', 'disponible')
        .order('updated_at', { ascending: false })

      if (!vehiclesError && vehicles) {
        vehiclePages = vehicles.map((vehicle) => {
          const slug = vehicle.stock_id || generateSlug(vehicle.marca, vehicle.modelo, vehicle.id)
          return {
            url: `${siteUrl}/vehiculos/${slug}`,
            lastModified: vehicle.updated_at ? new Date(vehicle.updated_at) : new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
          }
        })
      }

      // Fetch blog posts
      const { data: posts, error: postsError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('estado', 'publicado')
        .order('fecha_publicacion', { ascending: false })

      if (!postsError && posts) {
        blogPages = posts.map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }))
      }

      // Fetch blog categories
      const { data: categories, error: categoriesError } = await supabase
        .from('blog_categories')
        .select('slug, updated_at')
        .eq('activo', true)
        .order('orden', { ascending: true })

      if (!categoriesError && categories) {
        categoryPages = categories.map((category) => ({
          url: `${siteUrl}/blog/categoria/${category.slug}`,
          lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }))
      }
    } catch (error) {
      console.error('Error fetching data for sitemap:', error)
    }
  }

  return [...staticPages, ...vehiclePages, ...blogPages, ...categoryPages]
}
