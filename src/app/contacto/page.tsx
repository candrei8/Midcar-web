import { Metadata } from 'next'
import { Phone, Mail, MapPin, Clock, ExternalLink, MessageCircle } from 'lucide-react'
import { getContactInfo } from '@/lib/content-service'
import { ContactForm } from '@/components/contact/ContactForm'

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
    <div className="min-h-screen bg-white">
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      {/* Hero Header */}
      <div className="relative bg-secondary-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-950 to-black" />
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

        <div className="relative container-custom px-4 md:px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-[2px] bg-primary-500" />
            <span className="text-primary-400 text-xs font-medium tracking-[0.25em] uppercase">Contacto</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-5">
            Hablemos de tu
            <span className="block text-primary-500">próximo coche</span>
          </h1>
          <p className="text-lg text-secondary-400 max-w-lg leading-relaxed">
            Estamos aquí para ayudarte. Visítanos, llámanos o escríbenos
            y encontraremos juntos el vehículo perfecto para ti.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="container-custom px-4 md:px-6 -mt-10 relative z-10 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Phone Card */}
          <a
            href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`}
            className="group bg-white rounded-2xl border border-secondary-100 p-6 shadow-lg shadow-secondary-900/5 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
              <Phone className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 text-sm mb-1">Llámanos</h3>
            <p className="text-primary-600 font-bold text-lg">{contactInfo.telefono}</p>
          </a>

          {/* WhatsApp Card */}
          <a
            href={`https://wa.me/34${contactInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-secondary-100 p-6 shadow-lg shadow-secondary-900/5 hover:shadow-xl hover:border-green-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 text-sm mb-1">WhatsApp</h3>
            <p className="text-green-600 font-bold text-lg">{contactInfo.whatsapp}</p>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${contactInfo.email}`}
            className="group bg-white rounded-2xl border border-secondary-100 p-6 shadow-lg shadow-secondary-900/5 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 text-sm mb-1">Email</h3>
            <p className="text-blue-600 font-medium truncate">{contactInfo.email}</p>
          </a>

          {/* Location Card */}
          <a
            href={contactInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-secondary-100 p-6 shadow-lg shadow-secondary-900/5 hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-semibold text-secondary-900 text-sm mb-1">Visítanos</h3>
            <p className="text-secondary-600 text-sm leading-snug">{contactInfo.direccion.calle}, {contactInfo.direccion.ciudad}</p>
          </a>
        </div>
      </div>

      {/* Main Content: Form + Info */}
      <div className="container-custom px-4 md:px-6 pb-20">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">

          {/* Contact Form - Wider */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <ContactForm />
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-8">
            {/* Address Block */}
            <div className="bg-secondary-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-secondary-900">Dirección</h3>
              </div>
              <address className="text-secondary-600 not-italic leading-relaxed mb-4">
                {contactInfo.direccion.calle}<br />
                {contactInfo.direccion.cp} {contactInfo.direccion.ciudad}<br />
                {contactInfo.direccion.provincia}
              </address>
              <a
                href={contactInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-semibold transition-colors"
              >
                Cómo llegar
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Hours Block */}
            <div className="bg-secondary-50 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-secondary-900">Horario</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Lunes - Jueves</span>
                  <span className="font-medium text-secondary-800">{contactInfo.horario.lunesJueves}</span>
                </div>
                <div className="h-px bg-secondary-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Viernes</span>
                  <span className="font-medium text-secondary-800">{contactInfo.horario.viernes}</span>
                </div>
                <div className="h-px bg-secondary-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Sábado</span>
                  <span className="font-medium text-secondary-800">{contactInfo.horario.sabado}</span>
                </div>
                <div className="h-px bg-secondary-200" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-secondary-500">Domingo</span>
                  <span className="font-medium text-secondary-800">{contactInfo.horario.domingo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Map */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
        <div className="h-[400px] md:h-[450px] w-full">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=-3.4855%2C40.4475%2C-3.4778%2C40.4514&amp;layer=mapnik&amp;marker=40.4494372%2C-3.481674"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Ubicación de MID Car en Torrejón de Ardoz"
          />
        </div>
      </div>
    </div>
  )
}
