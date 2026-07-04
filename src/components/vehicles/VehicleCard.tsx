'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import type { Vehicle } from '@/lib/vehicles-service'

const MAX_IMAGE_RETRIES = 3

// Una sola insignia por tarjeta: la más relevante, en cristal oscuro discreto
function vehicleBadge(vehicle: Vehicle): string | null {
  if (vehicle.originalPrice) return 'Oferta'
  if (vehicle.transmission === 'Automático') return 'Automático'
  if (vehicle.label === 'ECO' || vehicle.label === '0') return 'Etiqueta ECO'
  if (vehicle.bodyType === 'monovolumen') return '7 plazas'
  return null
}

const dgtColors: Record<string, string> = {
  'ECO': 'bg-emerald-500/90',
  '0': 'bg-sky-500/90',
  'B': 'bg-amber-400/90',
  'C': 'bg-emerald-600/80',
}

interface VehicleCardProps {
  vehicle: Vehicle
  viewMode?: 'grid' | 'list'
  /** Carga prioritaria (tarjetas above-the-fold) */
  eager?: boolean
}

export function VehicleCard({ vehicle, viewMode = 'grid', eager = false }: VehicleCardProps) {
  const router = useRouter()
  const warmed = useRef(false)
  const [imgError, setImgError] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)
  const images = vehicle.images || []
  const mainImage = images[imageIndex]
  const badge = vehicleBadge(vehicle)
  const specs = [vehicle.year, formatKilometers(vehicle.km), vehicle.fuel, vehicle.transmission]

  const href = `/vehiculos/${vehicle.stock_id || vehicle.slug}`

  // Calentamiento predictivo: al primer hover/touch precargamos en background
  // la ruta de la ficha y su foto principal en grande — el click abre al instante.
  const warmDetail = () => {
    if (warmed.current) return
    warmed.current = true
    router.prefetch(href)
    const first = images[0]
    if (first && typeof window !== 'undefined') {
      for (const w of [750, 1080]) {
        const img = new window.Image()
        img.src = `/_next/image?url=${encodeURIComponent(first)}&w=${w}&q=75`
      }
    }
  }

  const handleError = () => {
    if (imageIndex < images.length - 1 && imageIndex < MAX_IMAGE_RETRIES - 1) {
      setImageIndex((prev) => prev + 1)
      return
    }
    setImgError(true)
  }

  const photo = mainImage && !imgError ? (
    <Image
      src={mainImage}
      alt={vehicle.title}
      fill
      sizes={
        viewMode === 'list'
          ? '(max-width: 768px) 100vw, 320px'
          : '(max-width: 640px) 92vw, (max-width: 1280px) 46vw, 340px'
      }
      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      loading={eager ? 'eager' : 'lazy'}
      onError={handleError}
    />
  ) : (
    <div className="flex h-full items-center justify-center">
      <p className="font-display text-2xl font-light tracking-wide text-secondary-400">{vehicle.brand}</p>
    </div>
  )

  const overlays = (
    <>
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
            dgtColors[vehicle.label] || 'bg-secondary-500/80'
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
    </>
  )

  if (viewMode === 'list') {
    return (
      <article
        onPointerEnter={warmDetail}
        onTouchStart={warmDetail}
        className="group relative overflow-hidden rounded-[22px] bg-white shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.06] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-20px_rgba(2,6,23,0.25)]">
        <div className="flex flex-col md:flex-row">
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200 md:w-80 md:aspect-auto md:min-h-[190px]">
            {photo}
            {overlays}
          </div>
          <div className="flex flex-1 flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[17px] font-semibold text-secondary-900 transition-colors group-hover:text-primary-600">
                {vehicle.title}
              </h3>
              <p className="mt-1.5 text-[13px] font-light tracking-wide text-secondary-500">
                {specs.join('  ·  ')}{vehicle.cv ? `  ·  ${vehicle.cv} CV` : ''}
              </p>
            </div>
            <div className="flex shrink-0 flex-col md:items-end">
              <span className="font-display text-[24px] font-bold leading-none tracking-tight text-secondary-950">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.originalPrice && (
                <span className="mt-1 text-xs font-light text-secondary-400 line-through">
                  antes {formatPrice(vehicle.originalPrice)}
                </span>
              )}
              <span className="mt-1.5 text-[13px] font-light text-secondary-500">
                o <span className="font-medium text-secondary-600">{monthlyPayment} €/mes</span>
              </span>
            </div>
          </div>
        </div>
        <Link href={href} className="absolute inset-0" prefetch={false}>
          <span className="sr-only">Ver {vehicle.title}</span>
        </Link>
      </article>
    )
  }

  return (
    <article
      onPointerEnter={warmDetail}
      onTouchStart={warmDetail}
      className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.06] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(2,6,23,0.3)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-secondary-100 to-secondary-200">
        {photo}
        {overlays}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3 className="line-clamp-1 text-[15px] font-semibold text-secondary-900">
          {vehicle.title}
        </h3>
        <p className="mt-1 text-[13px] font-light tracking-wide text-secondary-500">
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
          <span className="text-[13px] font-light text-secondary-500">
            o <span className="font-medium text-secondary-600">{monthlyPayment} €/mes</span>
          </span>
        </div>
      </div>

      <Link href={href} className="absolute inset-0" prefetch={false}>
        <span className="sr-only">Ver {vehicle.title}</span>
      </Link>
    </article>
  )
}
