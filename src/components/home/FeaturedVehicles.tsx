'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Fuel, Gauge, Calendar, Zap } from 'lucide-react'
import { formatPrice, formatKilometers } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { vehicles, getFeaturedVehicles, getVehiclesOnSale, type Vehicle } from '@/data/vehicles'
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation'

// Get featured vehicles first, then fill with on-sale vehicles if needed
const featured = getFeaturedVehicles()
const onSale = getVehiclesOnSale()
const featuredVehicles = featured.length >= 4
  ? featured.slice(0, 8)
  : [...featured, ...onSale.filter(v => !v.featured)].slice(0, 8)

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imageError, setImageError] = useState(false)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)

  const labelColors: Record<string, string> = {
    'ECO': 'bg-green-500',
    'C': 'bg-emerald-500',
    'B': 'bg-yellow-500',
    '0': 'bg-blue-500',
  }

  // Use placeholder images based on vehicle type when no images available
  const placeholderImages: Record<string, string> = {
    berlina: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
    familiar: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
    suv: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
    monovolumen: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80',
    furgoneta: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    industrial: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  }
  const imageUrl = vehicle.images[0] || placeholderImages[vehicle.bodyType] || placeholderImages.berlina

  return (
    <article className="card-vehicle group relative">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary-100 overflow-hidden">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-200 to-secondary-300">
            <span className="text-6xl opacity-50">🚗</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.onSale && (
            <span className="badge-primary text-xs">
              ¡OFERTA!
            </span>
          )}
          {vehicle.ivaDeducible && (
            <span className="badge bg-blue-100 text-blue-700 text-xs">
              IVA DEDUCIBLE
            </span>
          )}
        </div>

        {/* Environmental Label */}
        {vehicle.label && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              'inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-bold shadow-lg',
              labelColors[vehicle.label] || 'bg-gray-500'
            )}>
              {vehicle.label}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-5 h-5 text-secondary-600 hover:text-primary-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {vehicle.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(vehicle.price)}
          </span>
          {vehicle.originalPrice && (
            <span className="text-sm text-secondary-400 line-through">
              {formatPrice(vehicle.originalPrice)}
            </span>
          )}
        </div>

        {/* Monthly Payment */}
        <p className="text-sm text-secondary-500 mb-4">
          Desde <span className="font-semibold text-secondary-700">{monthlyPayment}€/mes</span>
        </p>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-secondary-600">
            <Gauge className="w-4 h-4" />
            <span>{formatKilometers(vehicle.km)}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-600">
            <Calendar className="w-4 h-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-600">
            <Fuel className="w-4 h-4" />
            <span>{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-600">
            <Zap className="w-4 h-4" />
            <span>{vehicle.cv}cv</span>
          </div>
        </div>
      </div>

      {/* Link overlay */}
      <Link href={`/vehiculos/${vehicle.slug}`} className="absolute inset-0" prefetch={false}>
        <span className="sr-only">Ver {vehicle.title}</span>
      </Link>
    </article>
  )
}

export function FeaturedVehicles() {
  return (
    <section className="py-20">
      <div className="container-custom">
        {/* Header */}
        <ScrollAnimation variant="fadeUp">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="section-title mb-2">Ofertas destacadas</h2>
              <p className="section-subtitle">
                Los mejores vehículos a precios increíbles. ¡Solo este mes!
              </p>
            </div>
            <Link
              href="/vehiculos"
              className="btn-secondary self-start md:self-auto"
            >
              Ver todas las ofertas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollAnimation>

        {/* Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.slice(0, 4).map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <ScrollAnimation variant="fadeUp" delay={0.3}>
          <div className="mt-12 text-center">
            <Link href="/vehiculos" className="btn-primary text-lg px-8 py-4">
              Ver todos los vehículos ({onSale.length})
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
