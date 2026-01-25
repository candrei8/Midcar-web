import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { getContactInfo } from '@/lib/content-service'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const metadata: Metadata = {
  title: 'Contacto | Concesionario MID Car Torrejón de Ardoz',
  description: 'Contacta con MID Car, tu concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Teléfono 910 023 016. Visítanos en C/ Polo Sur 2.',
  keywords: [
    'contacto midcar',
    'concesionario torrejón de ardoz',
    'teléfono concesionario madrid',
    'dirección midcar',
    'horario concesionario madrid',
    'comprar coche torrejón',
  ],
  alternates: {
    canonical: `${siteUrl}/contacto`,
  },
  openGraph: {
    title: 'Contacto | MID Car Madrid',
    description: 'Visítanos en Torrejón de Ardoz. Teléfono: 910 023 016. Horario: L-J 9:00-14:00/16:00-20:30, V 9:00-17:00, D 11:00-14:00.',
    url: `${siteUrl}/contacto`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contacto MID Car',
      },
    ],
  },
}

// Datos estructurados de la página de contacto
const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': `${siteUrl}/contacto#webpage`,
  url: `${siteUrl}/contacto`,
  name: 'Contacto - MID Car Madrid',
  description: 'Página de contacto de MID Car, concesionario de coches de segunda mano en Madrid',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
  mainEntity: {
    '@id': `${siteUrl}/#organization`,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contacto',
        item: `${siteUrl}/contacto`,
      },
    ],
  },
}

export default async function ContactoPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white py-16">
        <div className="container-custom px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Contacto
          </h1>
          <p className="text-lg text-secondary-300 max-w-2xl">
            ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            Visítanos, llámanos o escríbenos.
          </p>
        </div>
      </div>

      <div className="container-custom px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Información de contacto
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Teléfono</h3>
                  <a href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`} className="text-primary-600 hover:text-primary-700 text-lg font-medium">
                    {contactInfo.telefono}
                  </a>
                  <p className="text-secondary-500 text-sm mt-1">
                    También WhatsApp: {contactInfo.whatsapp}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Email</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:text-primary-700">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Dirección</h3>
                  <address className="text-secondary-600 not-italic">
                    {contactInfo.direccion.calle}<br />
                    {contactInfo.direccion.cp} {contactInfo.direccion.ciudad}<br />
                    {contactInfo.direccion.provincia}
                  </address>
                  <a
                    href={contactInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">Horario</h3>
                  <div className="text-secondary-600 space-y-1">
                    <p>Lunes - Jueves: {contactInfo.horario.lunesJueves}</p>
                    <p>Viernes: {contactInfo.horario.viernes}</p>
                    <p>Sábado: {contactInfo.horario.sabado}</p>
                    <p>Domingo: {contactInfo.horario.domingo}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-8 aspect-video rounded-2xl overflow-hidden bg-secondary-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3034.8234567890123!2d-3.4890123456789!3d40.4567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDI3JzI0LjQiTiAzwrAyOScyMC40Ilc!5e0!3m2!1ses!2ses!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de MID Car en Google Maps"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl border border-secondary-100 p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                Envíanos un mensaje
              </h2>
              <p className="text-secondary-500 mb-8">
                Rellena el formulario y te responderemos lo antes posible.
              </p>

              <form className="space-y-6" action="/api/contact" method="POST">
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
                    className="input-modern"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="asunto" className="block text-sm font-medium text-secondary-700 mb-2">
                    Asunto
                  </label>
                  <select id="asunto" name="asunto" className="select-modern">
                    <option value="vehiculo">Información sobre un vehículo</option>
                    <option value="financiacion">Financiación</option>
                    <option value="carta">Coche a la carta</option>
                    <option value="tasacion">Tasación de mi vehículo</option>
                    <option value="otro">Otro</option>
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
                    className="mt-1"
                  />
                  <label htmlFor="privacy" className="text-sm text-secondary-600">
                    Acepto la <a href="/politica-privacidad" className="text-primary-600 hover:underline">política de privacidad</a> y
                    el tratamiento de mis datos para la gestión de mi consulta.
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-lg py-4">
                  <Send className="w-5 h-5" />
                  Enviar mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
