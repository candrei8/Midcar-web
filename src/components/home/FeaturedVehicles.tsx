'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, Camera } from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { getVehiclesOnSale, getFeaturedVehicles, getVehicleCount, type Vehicle } from '@/lib/vehicles-service'

const MAX_IMAGE_RETRIES = 3

// Una sola insignia por tarjeta: la más relevante, en cristal oscuro discreto
function vehicleBadge(vehicle: Vehicle): string | null {
  if (vehicle.originalPrice) return 'Oferta'
  if (vehicle.transmission === 'Automático') return 'Automático'
  if (vehicle.label === 'ECO' || vehicle.label === '0') return 'Etiqueta ECO'
  if (vehicle.bodyType === 'monovolumen') return '7 plazas'
  return null
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)
  const images = vehicle.images || []
  const mainImage = images[imageIndex]
  const badge = vehicleBadge(vehicle)

  const specs = [vehicle.year, formatKilometers(vehicle.km), vehicle.fuel, vehicle.transmission]

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.06] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(2,6,23,0.3)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
        {mainImage && !imgError ? (
          <Image
            src={mainImage}
            alt={vehicle.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 320px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
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
            <p className="font-display text-2xl font-light tracking-wide text-secondary-400">{vehicle.brand}</p>
          </div>
        )}

        {/* Velo inferior para que los elementos sobre la foto respiren */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-secondary-950/65 px-3.5 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md">
            {badge}
          </span>
        )}

        {vehicle.label && (
          <span
            className={cn(
              'absolute right-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm backdrop-blur-sm',
              vehicle.label === 'ECO' ? 'bg-emerald-500/90'
                : vehicle.label === '0' ? 'bg-sky-500/90'
                : vehicle.label === 'B' ? 'bg-amber-400/90'
                : 'bg-emerald-600/80'
            )}
            title={`Etiqueta DGT ${vehicle.label}`}
          >
            {vehicle.label}
          </span>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-3.5 right-4 flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-light text-white backdrop-blur-sm">
            <Camera className="h-3 w-3" />
            {images.length}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-secondary-900">
          {vehicle.title}
        </h3>
        <p className="mt-1 text-[13px] font-light tracking-wide text-secondary-400">
          {specs.join('  ·  ')}
        </p>
        <div className="mt-4 flex items-end justify-between border-t border-secondary-100/80 pt-4">
          <div className="flex flex-col">
            <span className="font-display text-[22px] font-bold leading-none tracking-tight text-secondary-950">
              {formatPrice(vehicle.price)}
            </span>
            {vehicle.originalPrice && (
              <span className="mt-1 text-xs font-light text-secondary-400 line-through">
                antes {formatPrice(vehicle.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[13px] font-light text-secondary-400">
            o <span className="font-medium text-secondary-600">{monthlyPayment} €/mes</span>
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
    scrollerRef.current?.scrollBy({ left: dir * 680, behavior: 'smooth' })
  }

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container-custom px-4 md:px-6 lg:px-8">
          <div className="mb-10 h-9 w-72 animate-pulse rounded-full bg-secondary-100" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-[22px] bg-white ring-1 ring-secondary-900/[0.06] animate-pulse">
                <div className="aspect-[16/10] bg-secondary-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 rounded-full bg-secondary-100" />
                  <div className="h-6 w-1/2 rounded-full bg-secondary-100" />
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
        {/* Cabecera elegante: eyebrow + título, controles a la derecha */}
        <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <div>
            <p className="mb-2.5 flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.35em] text-primary-600">
              <span className="h-px w-8 bg-primary-600" />
              Selección
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-secondary-950 md:text-4xl">
              Vehículos destacados
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            {vehicles.length > 4 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  aria-label="Anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary-600 ring-1 ring-secondary-200 transition-all duration-300 hover:bg-secondary-950 hover:text-white hover:ring-secondary-950"
                >
                  <ChevronLeft className="h-[18px] w-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  aria-label="Siguiente"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-secondary-600 ring-1 ring-secondary-200 transition-all duration-300 hover:bg-secondary-950 hover:text-white hover:ring-secondary-950"
                >
                  <ChevronRight className="h-[18px] w-[18px]" />
                </button>
              </div>
            )}
            <Link
              href="/vehiculos"
              className="group hidden sm:inline-flex items-center gap-2 rounded-full bg-secondary-950 px-5 py-2.5 text-[13px] font-medium text-white transition-all duration-300 hover:bg-primary-600"
            >
              Ver todo el stock
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Carrusel */}
        <div
          ref={scrollerRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 scrollbar-hide"
        >
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <VehicleCard vehicle={vehicle} />
            </div>
          ))}
        </div>

        {/* CTA de cierre */}
        <div className="mt-10 text-center">
          <Link
            href="/vehiculos"
            className="group inline-flex items-center gap-2.5 rounded-full bg-primary-600 px-8 py-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_1px_2px_rgba(2,6,23,0.2)] transition-colors duration-200 hover:bg-primary-700 active:bg-primary-800"
          >
            Explorar los {totalCount} vehículos
            <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
