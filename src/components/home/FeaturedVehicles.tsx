'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { getVehiclesOnSale, getFeaturedVehicles, getVehicleCount, type Vehicle } from '@/lib/vehicles-service'

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
            className="btn-sheen group inline-flex items-center gap-2.5 rounded-full bg-primary-600 px-8 py-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-primary-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_0_6px_rgba(220,38,38,0.14)] active:scale-[0.98]"
          >
            Explorar los {totalCount} vehículos
            <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
