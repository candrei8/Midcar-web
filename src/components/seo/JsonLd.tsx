// Componente para inyectar datos estructurados JSON-LD
// Se usa en páginas específicas para añadir schema.org markup

interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Generadores de datos estructurados para diferentes tipos

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

// Schema para un vehículo
export function generateVehicleSchema(vehicle: {
  id: string
  title: string
  brand: string
  model: string
  price: number
  year: number
  km: number
  fuel: string
  transmission: string
  images: string[]
  slug: string
  description?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': `${siteUrl}/vehiculos/${vehicle.slug}#vehicle`,
    name: vehicle.title,
    brand: {
      '@type': 'Brand',
      name: vehicle.brand,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year.toString(),
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.km,
      unitCode: 'KMT',
    },
    fuelType: vehicle.fuel,
    vehicleTransmission: vehicle.transmission,
    image: vehicle.images[0] || `${siteUrl}/og-image.jpg`,
    description: vehicle.description || `${vehicle.title} - ${vehicle.year} - ${vehicle.km} km - ${vehicle.fuel}`,
    offers: {
      '@type': 'Offer',
      price: vehicle.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/vehiculos/${vehicle.slug}`,
      seller: {
        '@id': `${siteUrl}/#organization`,
      },
      itemCondition: 'https://schema.org/UsedCondition',
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: {
          '@type': 'QuantitativeValue',
          value: 12,
          unitCode: 'MON',
        },
      },
    },
  }
}

// Schema para la lista de vehículos (ItemList)
export function generateVehicleListSchema(vehicles: Array<{
  id: string
  title: string
  price: number
  slug: string
  images: string[]
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vehículos de ocasión en MID Car',
    description: 'Catálogo de coches de segunda mano disponibles en MID Car Madrid',
    numberOfItems: vehicles.length,
    itemListElement: vehicles.map((vehicle, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Car',
        '@id': `${siteUrl}/vehiculos/${vehicle.slug}`,
        name: vehicle.title,
        image: vehicle.images[0],
        offers: {
          '@type': 'Offer',
          price: vehicle.price,
          priceCurrency: 'EUR',
        },
      },
    })),
  }
}

// Schema para FAQs
export function generateFAQSchema(faqs: Array<{
  question: string
  answer: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Schema para LocalBusiness / ContactPage
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contacto - MID Car',
    description: 'Página de contacto de MID Car, concesionario de coches de segunda mano en Madrid',
    url: `${siteUrl}/contacto`,
    mainEntity: {
      '@id': `${siteUrl}/#organization`,
    },
  }
}

// Schema para BreadcrumbList
export function generateBreadcrumbSchema(items: Array<{
  name: string
  url: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// Schema para servicio de financiación
export function generateFinancingServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Financiación de vehículos - MID Car',
    description: 'Servicio de financiación de coches sin entrada, hasta 10 años y respuesta en 24 horas',
    url: `${siteUrl}/financiacion`,
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    areaServed: {
      '@type': 'Place',
      name: 'Madrid, España',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Opciones de financiación',
      itemListElement: [
        {
          '@type': 'Offer',
          name: 'Financiación sin entrada',
          description: 'Financia hasta el 100% del vehículo',
        },
        {
          '@type': 'Offer',
          name: 'Plazos flexibles',
          description: 'Hasta 10 años de plazo',
        },
      ],
    },
  }
}
