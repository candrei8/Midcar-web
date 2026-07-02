'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Fuel, Camera } from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { getVehiclesOnSale, getFeaturedVehicles, getVehicleCount, type Vehicle } from '@/lib/vehicles-service'

const MAX_IMAGE_RETRIES = 3

function vehicleBadge(vehicle: Vehicle): { text: string; cls: string } {
  if (vehicle.originalPrice) return { text: 'Oferta', cls: 'bg-primary-600' }
  if (vehicle.transmission === 'Automático') return { text: 'Automático', cls: 'bg-secondary-900' }
  if (vehicle.label === 'ECO' || vehicle.label === '0') return { text: 'Etiqueta ECO', cls: 'bg-green-600' }
  if (vehicle.bodyType === 'monovolumen') return { text: '7 plazas', cls: 'bg-teal-600' }
  return { text: 'IVA deducible', cls: 'bg-blue-600' }
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)
  const images = vehicle.images || []
  const mainImage = images[imageIndex]
  const badge = vehicleBadge(vehicle)

  const labelColors: Record<string, string> = {
    'ECO': 'bg-green-500',
    'C': 'bg-emerald-500',
    'B': 'bg-yellow-500',
    '0': 'bg-blue-500',
  }

  const specs = [vehicle.year, formatKilometers(vehicle.km), vehicle.fuel, vehicle.transmission]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-secondary-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary-900/10">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={vehicle.title}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 280px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => {
              if (imageIndex < images.length - 1 && imageIndex < MAX_IMAGE_RETRIES - 1) {
                setImageIndex((prev) => prev + 1)
                return
              }
              setImgError(true)
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-300">
                <Fuel className="h-8 w-8 text-secondary-500" />
              </div>
              <p className="text-sm font-medium text-secondary-500">{vehicle.brand}</p>
            </div>
          </div>
        )}

        <span className={cn('absolute left-3 top-3 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white', badge.cls)}>
          {badge.text}
        </span>

        {vehicle.label && (
          <span className={cn(
            'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-lg',
            labelColors[vehicle.label] || 'bg-gray-500'
          )}>
            {vehicle.label}
          </span>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
            <Camera className="h-3 w-3" />
            {images.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-1 line-clamp-1 text-[15px] font-bold text-secondary-900 transition-colors group-hover:text-primary-600">
          {vehicle.title}
        </h3>
        <p className="mb-3 text-xs text-secondary-500">
          {specs.join(' · ')}
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-secondary-100 pt-3">
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-extrabold text-secondary-900">
              {formatPrice(vehicle.price)}
            </span>
            {vehicle.originalPrice && (
              <span className="text-xs text-secondary-400 line-through">
                {formatPrice(vehicle.originalPrice)}
              </span>
            )}
          </div>
          <span className="rounded-md bg-primary-50 px-2 py-1 text-xs font-semibold text-primary-700">
            Desde {monthlyPayment}€/mes
          </span>
        </div>
      </div>

      <Link href={`/vehiculos/${vehicle.stock_id || vehicle.slug}`} className="absolute inset-0" prefetch={false}>
        <span className="sr-only">Ver {vehicle.title}</span>
      </Link>
    </article>
  )
}

interface FeaturedVehiclesProps {
  initialVehicles?: Vehicle[]
  initialCount?: number
}

export function FeaturedVehicles({ initialVehicles, initialCount }: FeaturedVehiclesProps = {}) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || [])
  const [totalCount, setTotalCount] = useState(initialCount || 0)
  const [isLoading, setIsLoading] = useState(!initialVehicles)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Skip fetch if server already provided data
    if (initialVehicles && initialVehicles.length > 0) return

    async function loadVehicles() {
      setIsLoading(true)
      try {
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
  }, [initialVehicles])

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 600, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <section className="py-10 md:py-16">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="mb-8 h-8 w-72 animate-pulse rounded bg-secondary-200" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl bg-white animate-pulse">
                <div className="aspect-[4/3] bg-secondary-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-3/4 rounded bg-secondary-200" />
                  <div className="h-7 w-1/2 rounded bg-secondary-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-16">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-secondary-900 md:text-3xl">
            Vehículos destacados
          </h2>
          <Link
            href="/vehiculos"
            className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-secondary-600 transition-colors hover:text-primary-600 md:text-sm"
          >
            Ver todo el stock
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carrusel */}
        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scrollbar-hide md:gap-5"
          >
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>

          {vehicles.length > 4 && (
            <>
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Anterior"
                className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-secondary-900 shadow-lg ring-1 ring-secondary-200 transition-colors hover:bg-secondary-900 hover:text-white md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Siguiente"
                className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-secondary-900 text-white shadow-lg transition-colors hover:bg-primary-600 md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/vehiculos" className="btn-primary px-8 py-4 text-lg">
            Ver todos los vehículos ({totalCount})
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
