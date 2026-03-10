import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getVehicleBySlug, getSimilarVehicles } from '@/lib/vehicles-service'
import { VehicleDetailClient } from './VehicleDetailClient'
import { formatPrice } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) return { title: 'Vehículo no encontrado' }

  const title = `${vehicle.title} - ${formatPrice(vehicle.price)}`
  const description = `${vehicle.title} | ${vehicle.year} | ${vehicle.fuel} | ${vehicle.cv} CV | ${new Intl.NumberFormat('es-ES').format(vehicle.km)} km | ${formatPrice(vehicle.price)}. Garantía 12 meses. Financiación sin entrada.`

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/vehiculos/${vehicle.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/vehiculos/${vehicle.slug}`,
      type: 'website',
      images: vehicle.images?.[0] ? [{ url: vehicle.images[0], width: 800, height: 600, alt: vehicle.title }] : [],
    },
  }
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const vehicle = await getVehicleBySlug(params.slug)
  if (!vehicle) notFound()

  const similarVehicles = await getSimilarVehicles(vehicle, 4)

  return <VehicleDetailClient vehicle={vehicle} similarVehicles={similarVehicles} />
}
