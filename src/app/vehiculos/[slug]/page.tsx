import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVehicleBySlug, getSimilarVehicles, getVehiclesOnSale } from '@/lib/vehicles-service'
import { VehicleDetailClient } from './VehicleDetailClient'
import { JsonLd, generateVehicleSchema, generateBreadcrumbSchema } from '@/components/seo/JsonLd'
import { formatPrice } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://midcar.es'

// Fichas pre-renderizadas en build y refrescadas cada 10 min (ISR):
// se sirven desde CDN en vez de consultar Supabase en cada visita.
export const revalidate = 600

export async function generateStaticParams() {
  const vehicles = await getVehiclesOnSale()
  return vehicles.map((v) => ({ slug: v.stock_id || v.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) return { title: 'Vehículo no encontrado' }

  const title = `${vehicle.title} - ${formatPrice(vehicle.price)}`
  const description = `${vehicle.title} | ${vehicle.year} | ${vehicle.fuel} | ${vehicle.cv} CV | ${new Intl.NumberFormat('es-ES').format(vehicle.km)} km | ${formatPrice(vehicle.price)}. Garantía 12 meses. Financiación sin entrada.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/vehiculos/${vehicle.stock_id || vehicle.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/vehiculos/${vehicle.stock_id || vehicle.slug}`,
      type: 'website',
      images: vehicle.images?.[0] ? [{ url: vehicle.images[0], width: 800, height: 600, alt: vehicle.title }] : [],
    },
  }
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) notFound()

  const similarVehicles = await getSimilarVehicles(vehicle, 4)

  const breadcrumb = generateBreadcrumbSchema([
    { name: 'Inicio', url: `${siteUrl}/` },
    { name: 'Vehículos', url: `${siteUrl}/vehiculos` },
    { name: vehicle.title, url: `${siteUrl}/vehiculos/${vehicle.stock_id || vehicle.slug}` },
  ])

  return (
    <>
      <JsonLd data={generateVehicleSchema(vehicle)} />
      <JsonLd data={breadcrumb} />
      <VehicleDetailClient vehicle={vehicle} similarVehicles={similarVehicles} />
    </>
  )
}
