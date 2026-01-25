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
  FileCheck
} from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { getVehicleBySlug, type Vehicle } from '@/lib/vehicles-service'

export default function VehicleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    async function loadVehicle() {
      if (slug) {
        setIsLoading(true)
        try {
          const v = await getVehicleBySlug(slug)
          if (v) {
            setVehicle(v)
            // Use the vehicle images (from Supabase, currently only 1 image)
            setImages(v.images.length > 0 ? v.images : [])
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

  const labelColors: Record<string, { bg: string, text: string, name: string }> = {
    '0': { bg: 'bg-blue-500', text: 'text-white', name: 'CERO Emisiones' },
    'ECO': { bg: 'bg-green-500', text: 'text-white', name: 'ECO' },
    'C': { bg: 'bg-emerald-500', text: 'text-white', name: 'Etiqueta C' },
    'B': { bg: 'bg-yellow-500', text: 'text-black', name: 'Etiqueta B' },
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
            {/* Placeholder sin imagen */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <Fuel className="w-20 h-20 text-secondary-400 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-secondary-500">{vehicle.brand}</p>
                  <p className="text-secondary-400">{vehicle.model}</p>
                </div>

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
              </div>

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
                <Link
                  href="/financiacion"
                  className="btn-ghost w-full justify-center py-4 border-2"
                >
                  Calcular financiación
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
