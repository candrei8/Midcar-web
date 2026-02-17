'use client'

import { useState } from 'react'
import { Search, Check, Send, Car, Euro, Calendar, Palette, Fuel, Settings } from 'lucide-react'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

const benefits = [
  'Sin compromiso: te buscamos el coche que necesitas',
  'Ahorro garantizado: negociamos el mejor precio',
  'Vehículos revisados y con garantía',
  'Financiación disponible si la necesitas',
  'Te acompañamos en todo el proceso',
  'Entrega en nuestras instalaciones o a domicilio',
]

const carTypes = [
  'Berlina',
  'SUV / Todoterreno',
  'Compacto',
  'Familiar',
  'Deportivo',
  'Monovolumen',
  'Coupé',
  'Cabrio',
  'Otro',
]

const fuelTypes = [
  'Gasolina',
  'Diésel',
  'Híbrido',
  'Eléctrico',
  'GLP / Gas',
  'Indiferente',
]

const transmissionTypes = [
  'Manual',
  'Automático',
  'Indiferente',
]

export default function CocheCartaPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    marca: '',
    modelo: '',
    tipoCarroceria: '',
    combustible: '',
    transmision: '',
    añoDesde: '',
    añoHasta: '',
    presupuestoMax: '',
    kmMax: '',
    color: '',
    extras: '',
    comentarios: '',
    privacy: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'coche-carta',
          ...formData,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          marca: '',
          modelo: '',
          tipoCarroceria: '',
          combustible: '',
          transmision: '',
          añoDesde: '',
          añoHasta: '',
          presupuestoMax: '',
          kmMax: '',
          color: '',
          extras: '',
          comentarios: '',
          privacy: false,
        })
      } else {
        setSubmitStatus('error')
      }
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 text-white py-16">
        <div className="container-custom px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="px-4 py-1 bg-primary-600/20 text-primary-300 rounded-full text-sm font-medium">
              Coche a la carta
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            ¿No encuentras lo que buscas?
          </h1>
          <p className="text-lg text-secondary-300 max-w-2xl">
            Nosotros te lo encontramos al mejor precio. Cuéntanos qué coche necesitas
            y nos encargaremos de buscarlo para ti.
          </p>
        </div>
      </div>

      <div className="container-custom px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-secondary-100 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                Solicita tu coche
              </h2>
              <p className="text-secondary-500 mb-8">
                Rellena el formulario con las características del coche que buscas.
                Cuantos más detalles nos des, mejor podremos ayudarte.
              </p>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Solicitud enviada</p>
                      <p className="text-green-600 text-sm">
                        Nos pondremos en contacto contigo lo antes posible.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-semibold text-red-800">Error al enviar</p>
                  <p className="text-red-600 text-sm">
                    Ha ocurrido un error. Por favor, inténtalo de nuevo o contáctanos por teléfono.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Datos personales */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">1</span>
                    Tus datos de contacto
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        required
                        value={formData.nombre}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-secondary-700 mb-2">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        required
                        value={formData.telefono}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Tu teléfono"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del vehículo */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">2</span>
                    Características del vehículo
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="marca" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Car className="w-4 h-4 inline mr-1" />
                        Marca preferida
                      </label>
                      <input
                        type="text"
                        id="marca"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: Volkswagen, Audi, BMW..."
                      />
                    </div>
                    <div>
                      <label htmlFor="modelo" className="block text-sm font-medium text-secondary-700 mb-2">
                        Modelo preferido
                      </label>
                      <input
                        type="text"
                        id="modelo"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: Golf, A3, Serie 3..."
                      />
                    </div>
                    <div>
                      <label htmlFor="tipoCarroceria" className="block text-sm font-medium text-secondary-700 mb-2">
                        Tipo de carrocería
                      </label>
                      <select
                        id="tipoCarroceria"
                        name="tipoCarroceria"
                        value={formData.tipoCarroceria}
                        onChange={handleChange}
                        className="select-modern"
                      >
                        <option value="">Selecciona...</option>
                        {carTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="combustible" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Fuel className="w-4 h-4 inline mr-1" />
                        Combustible
                      </label>
                      <select
                        id="combustible"
                        name="combustible"
                        value={formData.combustible}
                        onChange={handleChange}
                        className="select-modern"
                      >
                        <option value="">Selecciona...</option>
                        {fuelTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="transmision" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Settings className="w-4 h-4 inline mr-1" />
                        Transmisión
                      </label>
                      <select
                        id="transmision"
                        name="transmision"
                        value={formData.transmision}
                        onChange={handleChange}
                        className="select-modern"
                      >
                        <option value="">Selecciona...</option>
                        {transmissionTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="color" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Palette className="w-4 h-4 inline mr-1" />
                        Color preferido
                      </label>
                      <input
                        type="text"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: Blanco, Negro, Gris..."
                      />
                    </div>
                  </div>
                </div>

                {/* Año y presupuesto */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">3</span>
                    Año y presupuesto
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="añoDesde" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Año desde
                      </label>
                      <select
                        id="añoDesde"
                        name="añoDesde"
                        value={formData.añoDesde}
                        onChange={handleChange}
                        className="select-modern"
                      >
                        <option value="">Selecciona...</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="añoHasta" className="block text-sm font-medium text-secondary-700 mb-2">
                        Año hasta
                      </label>
                      <select
                        id="añoHasta"
                        name="añoHasta"
                        value={formData.añoHasta}
                        onChange={handleChange}
                        className="select-modern"
                      >
                        <option value="">Selecciona...</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="presupuestoMax" className="block text-sm font-medium text-secondary-700 mb-2">
                        <Euro className="w-4 h-4 inline mr-1" />
                        Presupuesto máximo
                      </label>
                      <input
                        type="text"
                        id="presupuestoMax"
                        name="presupuestoMax"
                        value={formData.presupuestoMax}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: 20.000€"
                      />
                    </div>
                    <div>
                      <label htmlFor="kmMax" className="block text-sm font-medium text-secondary-700 mb-2">
                        Kilómetros máximos
                      </label>
                      <input
                        type="text"
                        id="kmMax"
                        name="kmMax"
                        value={formData.kmMax}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: 100.000 km"
                      />
                    </div>
                  </div>
                </div>

                {/* Extras y comentarios */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-sm font-bold">4</span>
                    Información adicional
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="extras" className="block text-sm font-medium text-secondary-700 mb-2">
                        Extras deseados
                      </label>
                      <input
                        type="text"
                        id="extras"
                        name="extras"
                        value={formData.extras}
                        onChange={handleChange}
                        className="input-modern"
                        placeholder="Ej: Navegador, sensores aparcamiento, techo solar..."
                      />
                    </div>
                    <div>
                      <label htmlFor="comentarios" className="block text-sm font-medium text-secondary-700 mb-2">
                        Comentarios adicionales
                      </label>
                      <textarea
                        id="comentarios"
                        name="comentarios"
                        rows={4}
                        value={formData.comentarios}
                        onChange={handleChange}
                        className="input-modern resize-none"
                        placeholder="¿Hay algo más que quieras contarnos sobre el coche que buscas?"
                      />
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    required
                    checked={formData.privacy}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-secondary-600">
                    Acepto la <a href="/politica-privacidad" className="text-primary-600 hover:underline">política de privacidad</a> y
                    el tratamiento de mis datos para la gestión de mi solicitud.
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full justify-center text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar solicitud
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-secondary-100 p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                ¿Por qué elegirnos?
              </h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-secondary-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How it works */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-primary-900 mb-4">
                ¿Cómo funciona?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Cuéntanos qué buscas</p>
                    <p className="text-sm text-primary-700">Rellena el formulario con tus preferencias</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Buscamos tu coche</p>
                    <p className="text-sm text-primary-700">Rastreamos el mercado para encontrar las mejores opciones</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Te presentamos opciones</p>
                    <p className="text-sm text-primary-700">Te mostramos las mejores alternativas con nuestro análisis</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-primary-900">Tú decides</p>
                    <p className="text-sm text-primary-700">Elige el que más te guste, sin compromiso</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-secondary-900 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-2">
                ¿Prefieres llamarnos?
              </h3>
              <p className="text-secondary-300 text-sm mb-4">
                Estamos disponibles para ayudarte
              </p>
              <a
                href="tel:910023016"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
              >
                910 023 016
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
