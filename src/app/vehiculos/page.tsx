import { Metadata } from 'next'
import { Suspense } from 'react'
import { VehiclesCatalog } from '@/components/vehicles/VehiclesCatalog'
import { VehiclesHeader } from '@/components/vehicles/VehiclesHeader'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const metadata: Metadata = {
  title: 'Coches de Segunda Mano en Madrid | Catálogo de Vehículos',
  description: 'Descubre nuestro catálogo de coches de segunda mano en Madrid. Más de 90 vehículos de ocasión certificados con 1 año de garantía. Berlinas, SUVs, familiares y furgonetas.',
  keywords: [
    'coches segunda mano madrid',
    'coches ocasión torrejón',
    'comprar coche usado madrid',
    'coches garantizados madrid',
    'suv segunda mano madrid',
    'berlina ocasión madrid',
    'familiar segunda mano',
    'furgonetas ocasión madrid',
    'coches diesel madrid',
    'coches gasolina usados',
    'híbridos segunda mano',
  ],
  alternates: {
    canonical: `${siteUrl}/vehiculos`,
  },
  openGraph: {
    title: 'Catálogo de Coches de Segunda Mano | MID Car Madrid',
    description: 'Más de 90 vehículos de ocasión certificados. Berlinas, SUVs, familiares, furgonetas. Todos con garantía.',
    url: `${siteUrl}/vehiculos`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Catálogo de vehículos MID Car',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo de Coches de Segunda Mano | MID Car',
    description: 'Más de 90 vehículos de ocasión certificados con garantía.',
  },
}

// Datos estructurados de la página de catálogo
const catalogPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': `${siteUrl}/vehiculos#webpage`,
  url: `${siteUrl}/vehiculos`,
  name: 'Catálogo de Coches de Segunda Mano - MID Car Madrid',
  description: 'Catálogo completo de vehículos de ocasión disponibles en MID Car.',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
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
        name: 'Vehículos',
        item: `${siteUrl}/vehiculos`,
      },
    ],
  },
}

export default function VehiculosPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogPageSchema) }}
      />

      <VehiclesHeader />
      <Suspense fallback={<VehiclesCatalogSkeleton />}>
        <VehiclesCatalog />
      </Suspense>

      {/* SEO Content Section */}
      <section className="bg-white border-t border-secondary-100 py-12">
        <div className="container-custom px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Coches de Segunda Mano en Madrid con Garantía
            </h2>
            <p className="text-secondary-600 mb-4">
              En <strong>MID Car</strong> encontrarás la mejor selección de coches de segunda mano en Madrid.
              Nuestro concesionario, ubicado en <strong>Torrejón de Ardoz</strong>, ofrece más de 90 vehículos
              de ocasión certificados, todos revisados exhaustivamente y con <strong>1 año de garantía</strong> incluida.
            </p>
            <p className="text-secondary-600 mb-4">
              Disponemos de todo tipo de carrocerías: berlinas, familiares, SUV/4x4, monovolúmenes y furgonetas.
              También contamos con diferentes tipos de combustible: diésel, gasolina, híbridos y vehículos con etiqueta ECO.
            </p>
            <p className="text-secondary-600">
              Ofrecemos <strong>financiación sin entrada</strong> con plazos de hasta 10 años y respuesta en 24 horas.
              Visítanos y encuentra el vehículo que mejor se adapta a tus necesidades.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function VehiclesCatalogSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 h-96 animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-secondary-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-secondary-200 rounded w-3/4" />
                  <div className="h-7 bg-secondary-200 rounded w-1/2" />
                  <div className="h-4 bg-secondary-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
