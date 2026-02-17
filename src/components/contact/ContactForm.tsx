'use client'

import { useState } from 'react'
import { Send, Check } from 'lucide-react'

const asuntoOptions = [
  { value: 'vehiculo', label: 'Información sobre un vehículo' },
  { value: 'financiacion', label: 'Financiación' },
  { value: 'carta', label: 'Coche a la carta' },
  { value: 'tasacion', label: 'Tasación de mi vehículo' },
  { value: 'otro', label: 'Otro' },
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    asunto: 'vehiculo',
    mensaje: '',
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
          tipo: 'contacto',
          ...formData,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          nombre: '',
          telefono: '',
          email: '',
          asunto: 'vehiculo',
          mensaje: '',
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

  return (
    <div className="bg-white rounded-2xl border border-secondary-100 p-8">
      <h2 className="text-2xl font-bold text-secondary-900 mb-2">
        Envíanos un mensaje
      </h2>
      <p className="text-secondary-500 mb-8">
        Rellena el formulario y te responderemos lo antes posible.
      </p>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Mensaje enviado</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
              Nombre *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              autoComplete="name"
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
              autoComplete="tel"
              value={formData.telefono}
              onChange={handleChange}
              className="input-modern"
              placeholder="Tu teléfono"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="input-modern"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <label htmlFor="asunto" className="block text-sm font-medium text-secondary-700 mb-2">
            Asunto
          </label>
          <select
            id="asunto"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            className="select-modern"
          >
            {asuntoOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-secondary-700 mb-2">
            Mensaje *
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={5}
            value={formData.mensaje}
            onChange={handleChange}
            className="input-modern resize-none"
            placeholder="¿En qué podemos ayudarte?"
          />
        </div>

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
            el tratamiento de mis datos para la gestión de mi consulta.
          </label>
        </div>

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
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  )
}
