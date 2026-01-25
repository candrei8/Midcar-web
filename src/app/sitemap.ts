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
      url: `${siteUrl}/financiacion`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
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

  if (isSupabaseConfigured) {
    try {
      const { data: vehicles, error } = await supabase
        .from('vehicles')
        .select('id, stock_id, marca, modelo, updated_at')
        .eq('estado', 'disponible')
        .order('updated_at', { ascending: false })

      if (!error && vehicles) {
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
    } catch (error) {
      console.error('Error fetching vehicles for sitemap:', error)
    }
  }

  return [...staticPages, ...vehiclePages]
}
