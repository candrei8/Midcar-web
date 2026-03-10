'use client'

import { useState } from 'react'
import { Send, Check, AlertCircle } from 'lucide-react'

const asuntoOptions = [
  { value: 'vehiculo', label: 'Información sobre un vehículo' },
  { value: 'financiacion', label: 'Financiación' },
  { value: 'carta', label: 'Coche a la carta' },
  { value: 'tasacion', label: 'Tasación de mi vehículo' },
  { value: 'otro', label: 'Otro' },
]

const inputClasses = 'w-full rounded-xl border border-secondary-200 bg-white px-4 py-3.5 text-secondary-900 text-sm placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200'

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
    <div>
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 font-display mb-2">
          Envíanos un mensaje
        </h2>
        <p className="text-secondary-500">
          Rellena el formulario y te responderemos lo antes posible.
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-8 p-5 bg-green-50 border border-green-100 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Mensaje enviado correctamente</p>
              <p className="text-green-600 text-sm mt-1">
                Nos pondremos en contacto contigo lo antes posible.
              </p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-800">Error al enviar</p>
              <p className="text-red-600 text-sm mt-1">
                Ha ocurrido un error. Por favor, inténtalo de nuevo o contáctanos por teléfono.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-secondary-700 mb-2">
              Nombre <span className="text-primary-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              autoComplete="name"
              value={formData.nombre}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-secondary-700 mb-2">
              Teléfono <span className="text-primary-500">*</span>
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              autoComplete="tel"
              value={formData.telefono}
              onChange={handleChange}
              className={inputClasses}
              placeholder="Tu teléfono"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Email <span className="text-primary-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClasses}
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
            className={inputClasses + ' appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10'}
          >
            {asuntoOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-secondary-700 mb-2">
            Mensaje <span className="text-primary-500">*</span>
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={5}
            value={formData.mensaje}
            onChange={handleChange}
            className={inputClasses + ' resize-none'}
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
            className="mt-0.5 h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="privacy" className="text-sm text-secondary-500 leading-relaxed">
            Acepto la{' '}
            <a href="/politica-privacidad" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
              política de privacidad
            </a>{' '}
            y el tratamiento de mis datos para la gestión de mi consulta.
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full bg-secondary-900 text-white rounded-xl px-8 py-4 text-sm font-semibold tracking-wide uppercase overflow-hidden hover:bg-secondary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  )
}
