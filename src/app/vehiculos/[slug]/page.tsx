'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Fuel,
  Gauge,
  Calendar,
  Zap,
  Settings,
  Phone,
  MessageCircle,
  Shield,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calculator,
} from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { getVehicleBySlug, getSimilarVehicles, type Vehicle } from '@/lib/vehicles-service'
import { ImageLightbox } from '@/components/ui/ImageLightbox'

export default function VehicleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set())

  useEffect(() => {
    async function loadVehicle() {
      if (slug) {
        setIsLoading(true)
        try {
          const v = await getVehicleBySlug(slug)
          if (v) {
            setVehicle(v)
            const similar = await getSimilarVehicles(v, 4)
            setSimilarVehicles(similar)
          }
        } catch (error) {
          console.error('Error loading vehicle:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    loadVehicle()
  }, [slug])

  if (isLoading || !vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary-600">Cargando...</p>
        </div>
      </div>
    )
  }

  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)
  const images = vehicle.images?.filter((_, i) => !imgErrors.has(i)) || []
  const hasImages = images.length > 0

  const labelColors: Record<string, { bg: string, text: string, name: string }> = {
    '0': { bg: 'bg-blue-500', text: 'text-white', name: 'CERO Emisiones' },
    'ECO': { bg: 'bg-green-500', text: 'text-white', name: 'ECO' },
    'C': { bg: 'bg-emerald-500', text: 'text-white', name: 'Etiqueta C' },
    'B': { bg: 'bg-yellow-500', text: 'text-black', name: 'Etiqueta B' },
  }

  const goToPrev = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      <div className="min-h-screen bg-secondary-50">
        {/* Header */}
        <div className="bg-white border-b border-secondary-100">
          <div className="container-custom px-4 md:px-6 py-4">
            <Link
              href="/vehiculos"
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al catálogo</span>
            </Link>
          </div>
        </div>

        <div className="container-custom px-4 md:px-6 py-6 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => hasImages && setLightboxOpen(true)}
              >
                {hasImages ? (
                  <>
                    <img
                      src={images[currentImageIndex]}
                      alt={`${vehicle.title} - Foto ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImgErrors(prev => new Set(prev).add(currentImageIndex))
                        if (currentImageIndex > 0) setCurrentImageIndex(0)
                      }}
                    />
                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToPrev() }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); goToNext() }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {/* Image counter */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
                      <Camera className="w-4 h-4" />
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Fuel className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
                      <p className="text-xl font-semibold text-secondary-500">{vehicle.brand}</p>
                      <p className="text-secondary-400">{vehicle.model}</p>
                    </div>
                  </div>
                )}

                {/* Labels */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {vehicle.featured && (
                    <span className="badge-primary text-xs">DESTACADO</span>
                  )}
                  {vehicle.ivaDeducible && (
                    <span className="badge bg-blue-100 text-blue-700 text-xs">IVA DEDUCIBLE</span>
                  )}
                </div>
              </div>

              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.slice(0, 20).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all',
                        currentImageIndex === idx
                          ? 'border-primary-600 ring-2 ring-primary-200'
                          : 'border-secondary-200 hover:border-secondary-400'
                      )}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                  {images.length > 20 && (
                    <button
                      onClick={() => setLightboxOpen(true)}
                      className="flex-shrink-0 w-20 h-16 rounded-lg bg-secondary-100 border-2 border-secondary-200 flex items-center justify-center text-secondary-600 text-xs font-medium hover:bg-secondary-200 transition-colors"
                    >
                      +{images.length - 20} más
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Vehicle Info */}
            <div className="space-y-6">
              {/* Title and price */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-2">
                  {vehicle.title}
                </h1>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl md:text-4xl font-bold text-primary-600">
                    {formatPrice(vehicle.price)}
                  </span>
                  {vehicle.originalPrice && (
                    <span className="text-lg text-secondary-400 line-through">
                      {formatPrice(vehicle.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-secondary-600">
                  Desde <span className="font-semibold text-secondary-800">{monthlyPayment}€/mes</span> con financiación
                </p>
              </div>

              {/* Environmental label */}
              {vehicle.label && labelColors[vehicle.label] && (
                <div className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-full",
                  labelColors[vehicle.label].bg,
                  labelColors[vehicle.label].text
                )}>
                  <span className="font-bold">{vehicle.label}</span>
                  <span className="text-sm opacity-90">{labelColors[vehicle.label].name}</span>
                </div>
              )}

              {/* Specs grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-secondary-100">
                  <Gauge className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-secondary-500">Kilómetros</p>
                  <p className="font-semibold text-secondary-900">{formatKilometers(vehicle.km)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-secondary-100">
                  <Calendar className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-secondary-500">Año</p>
                  <p className="font-semibold text-secondary-900">{vehicle.year}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-secondary-100">
                  <Fuel className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-secondary-500">Combustible</p>
                  <p className="font-semibold text-secondary-900">{vehicle.fuel}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-secondary-100">
                  <Zap className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-secondary-500">Potencia</p>
                  <p className="font-semibold text-secondary-900">{vehicle.cv} CV</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-secondary-100">
                  <Settings className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-secondary-500">Transmisión</p>
                  <p className="font-semibold text-secondary-900">{vehicle.transmission}</p>
                </div>
                {vehicle.color && (
                  <div className="bg-white rounded-xl p-4 border border-secondary-100">
                    <div className="w-5 h-5 rounded-full bg-secondary-300 mb-2" />
                    <p className="text-sm text-secondary-500">Color</p>
                    <p className="font-semibold text-secondary-900">{vehicle.color}</p>
                  </div>
                )}
              </div>

              {/* Features */}
              {vehicle.extras && vehicle.extras.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-secondary-100">
                  <h3 className="font-semibold text-secondary-900 mb-3">Equipamiento</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.extras.map((extra, i) => (
                      <span key={i} className="px-3 py-1 bg-secondary-50 text-secondary-700 text-sm rounded-full border border-secondary-200">
                        {extra}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {vehicle.description && (
                <div className="bg-white rounded-xl p-6 border border-secondary-100">
                  <h3 className="font-semibold text-secondary-900 mb-3">Descripción</h3>
                  <p className="text-secondary-700 whitespace-pre-line text-sm leading-relaxed">{vehicle.description}</p>
                </div>
              )}

              {/* Guarantees */}
              <div className="bg-white rounded-xl p-6 border border-secondary-100 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-secondary-900">1 año de garantía</p>
                    <p className="text-sm text-secondary-600">Sin límite de kilómetros</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-secondary-900">Informe CARFAX incluido</p>
                    <p className="text-sm text-secondary-600">Historial verificado del vehículo</p>
                  </div>
                </div>
              </div>

              {/* Financing Calculator */}
              <FinancingCalculator vehiclePrice={vehicle.price} vehicleTitle={vehicle.title} />

              {/* Contact buttons */}
              <div className="space-y-3">
                <a
                  href="tel:910023016"
                  className="btn-primary w-full justify-center text-lg py-4"
                >
                  <Phone className="w-5 h-5" />
                  Llamar: 910 023 016
                </a>
                <a
                  href={`https://wa.me/34695055555?text=Hola, estoy interesado en el ${encodeURIComponent(vehicle.title)} (${formatPrice(vehicle.price)})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full justify-center text-lg py-4 border-2 border-green-500 text-green-600 hover:bg-green-50"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp: 695 055 555
                </a>
              </div>
            </div>
          </div>

          {/* Similar Vehicles Section */}
          {similarVehicles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Vehículos similares
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarVehicles.map((v) => (
                  <SimilarVehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Lightbox */}
      {hasImages && (
        <ImageLightbox
          images={images}
          initialIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          alt={vehicle.title}
        />
      )}
    </>
  )
}

// Real financing coefficients from MidCar database
const financingCoefficients: Record<number, number> = {
  24: 0.047854,
  36: 0.033614,
  48: 0.026573,
  60: 0.022416,
  72: 0.019656,
  84: 0.017774,
  96: 0.016417,
  108: 0.015417,
  120: 0.014672,
}

const availableMonths = Object.keys(financingCoefficients).map(Number)

function FinancingCalculator({ vehiclePrice, vehicleTitle }: { vehiclePrice: number; vehicleTitle: string }) {
  const [downPayment, setDownPayment] = useState(0)
  const [months, setMonths] = useState(60)

  const financedAmount = vehiclePrice - downPayment
  const coefficient = financingCoefficients[months] || 0.022416
  const calcMonthlyPayment = financedAmount > 0 ? financedAmount * coefficient : 0
  const totalCost = calcMonthlyPayment * months

  return (
    <div className="bg-white rounded-xl border border-secondary-100 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-semibold text-secondary-900">Calcula tu financiación</h3>
          <p className="text-xs text-secondary-500">Para este vehículo de {formatPrice(vehiclePrice)}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Down Payment */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-secondary-700">Entrada inicial</label>
            <span className="text-sm font-bold text-secondary-900">{formatPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={vehiclePrice * 0.5}
            step="500"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full h-2 bg-secondary-200 rounded-full appearance-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                     [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary-400 mt-1">
            <span>0€</span>
            <span>{formatPrice(Math.round(vehiclePrice * 0.5))}</span>
          </div>
        </div>

        {/* Months */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">Plazo</label>
          <div className="grid grid-cols-3 gap-1.5">
            {availableMonths.map((m) => (
              <button
                key={m}
                onClick={() => setMonths(m)}
                className={cn(
                  'py-1.5 rounded-lg text-xs font-medium transition-colors',
                  months === m
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                )}
              >
                {m} meses
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
        <p className="text-xs text-primary-700 mb-1">Tu cuota mensual</p>
        <p className="text-3xl font-bold text-primary-700">
          {formatPrice(Math.round(calcMonthlyPayment))}<span className="text-sm font-normal">/mes</span>
        </p>
        <div className="mt-3 pt-3 border-t border-primary-200 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-primary-600">Importe financiado</p>
            <p className="font-semibold text-primary-800">{formatPrice(financedAmount)}</p>
          </div>
          <div>
            <p className="text-primary-600">Coste total</p>
            <p className="font-semibold text-primary-800">{formatPrice(Math.round(totalCost))}</p>
          </div>
        </div>
        <p className="text-[10px] text-primary-600 mt-3">
          * Cálculo orientativo. La aprobación definitiva está sujeta a estudio financiero.
        </p>
      </div>

      <Link
        href="/contacto"
        className="btn-primary w-full justify-center mt-4 text-sm"
      >
        Solicitar financiación
      </Link>
    </div>
  )
}

function SimilarVehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const [imgError, setImgError] = useState(false)
  const mainImage = vehicle.images?.[0]

  return (
    <Link
      href={`/vehiculos/${vehicle.slug}`}
      className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-lg transition-shadow group"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 relative overflow-hidden">
        {mainImage && !imgError ? (
          <img
            src={mainImage}
            alt={vehicle.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <Fuel className="w-10 h-10 text-secondary-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-secondary-500">{vehicle.brand}</p>
              <p className="text-xs text-secondary-400">{vehicle.model}</p>
            </div>
          </div>
        )}
        {vehicle.featured && (
          <span className="absolute top-2 left-2 badge-primary text-xs">DESTACADO</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-secondary-900 text-sm mb-1 line-clamp-1">
          {vehicle.title}
        </h3>
        <p className="text-lg font-bold text-primary-600 mb-2">
          {formatPrice(vehicle.price)}
        </p>
        <div className="flex items-center gap-3 text-xs text-secondary-500">
          <span>{formatKilometers(vehicle.km)}</span>
          <span>·</span>
          <span>{vehicle.year}</span>
          <span>·</span>
          <span>{vehicle.fuel}</span>
        </div>
      </div>
    </Link>
  )
}
