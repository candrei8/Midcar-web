'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Fuel, Gauge, Calendar, Zap, Car } from 'lucide-react'
import { formatPrice, formatKilometers } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { getVehiclesOnSale, getFeaturedVehicles, getVehicleCount, type Vehicle } from '@/lib/vehicles-service'
import { ScrollAnimation, StaggerContainer, StaggerItem } from '@/components/ui/ScrollAnimation'

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)

  const labelColors: Record<string, string> = {
    'ECO': 'bg-green-500',
    'C': 'bg-emerald-500',
    'B': 'bg-yellow-500',
    '0': 'bg-blue-500',
  }

  return (
    <article className="card-vehicle group relative">
      {/* Placeholder sin imagen */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-2 bg-secondary-300 rounded-full flex items-center justify-center">
            <Fuel className="w-8 h-8 text-secondary-500" />
          </div>
          <p className="text-sm font-medium text-secondary-500">{vehicle.brand}</p>
        </div>

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadVehicles() {
      setIsLoading(true)
      try {
        // Get featured first, then fill with on-sale vehicles if needed
        const featured = await getFeaturedVehicles()
        const onSale = await getVehiclesOnSale()
        const count = await getVehicleCount()

        const featuredVehicles = featured.length >= 4
          ? featured.slice(0, 8)
          : [...featured, ...onSale.filter(v => !v.featured)].slice(0, 8)

        setVehicles(featuredVehicles)
        setTotalCount(count)
      } catch (error) {
        console.error('Error loading vehicles:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadVehicles()
  }, [])

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <div className="h-8 w-64 bg-secondary-200 rounded animate-pulse mb-2" />
              <div className="h-6 w-96 bg-secondary-100 rounded animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-secondary-200 rounded w-3/4" />
                  <div className="h-7 bg-secondary-200 rounded w-1/2" />
                  <div className="h-4 bg-secondary-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        {/* Header */}
        <ScrollAnimation variant="fadeUp">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-secondary-900 font-display mb-2">Ofertas destacadas</h2>
              <p className="text-base md:text-lg text-secondary-500 max-w-2xl">
                Los mejores vehículos a precios increíbles. ¡Solo este mes!
              </p>
            </div>
            <Link
              href="/vehiculos"
              className="btn-secondary self-start md:self-auto text-sm md:text-base"
            >
              Ver todas las ofertas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollAnimation>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {vehicles.slice(0, 4).map((vehicle) => (
            <StaggerItem key={vehicle.id}>
              <VehicleCard vehicle={vehicle} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <ScrollAnimation variant="fadeUp" delay={0.3}>
          <div className="mt-12 text-center">
            <Link href="/vehiculos" className="btn-primary text-lg px-8 py-4">
              Ver todos los vehículos ({totalCount})
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  )
}
