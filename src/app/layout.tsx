import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // Títulos
  title: {
    default: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
    template: '%s | MID Car Madrid',
  },

  // Descripción principal
  description: 'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Vehículos de ocasión certificados con 1 año de garantía. Financiación sin entrada. Más de 15 años de experiencia.',

  // Keywords
  keywords: [
    'coches segunda mano madrid',
    'coches ocasión torrejón de ardoz',
    'concesionario coches usados madrid',
    'vehículos garantizados madrid',
    'coches seminuevos madrid',
    'comprar coche usado madrid',
    'financiación coches madrid',
    'coches km0 madrid',
    'furgonetas segunda mano madrid',
    'coches híbridos ocasión madrid',
    'coches con garantía madrid',
    'midcar',
    'mid car',
  ],

  // Autor y propietario
  authors: [{ name: 'MID Car', url: siteUrl }],
  creator: 'MID Car',
  publisher: 'MID Car',

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Iconos
  icons: {
    icon: '/favicon.svg',
  },

  // Manifest PWA
  manifest: '/manifest.json',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: siteUrl,
    siteName: 'MID Car',
    title: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
    description: 'Vehículos de ocasión certificados con 1 año de garantía. Financiación sin entrada. Más de 15 años de experiencia en Torrejón de Ardoz.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'MID Car - Concesionario de coches de segunda mano en Madrid',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@midcar_es',
    creator: '@midcar_es',
    title: 'MID Car | Coches de Segunda Mano en Madrid',
    description: 'Vehículos de ocasión certificados con garantía. Financiación sin entrada.',
    images: [`${siteUrl}/og-image.jpg`],
  },

  // Verificación
  verification: {
    google: 'tu-codigo-de-verificacion-google',
    // yandex: 'tu-codigo-yandex',
    // bing: 'tu-codigo-bing',
  },

  // Alternates
  alternates: {
    canonical: siteUrl,
    languages: {
      'es-ES': siteUrl,
    },
  },

  // Formato de detección
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },

  // Categoría
  category: 'automotive',

  // Otros
  other: {
    'geo.region': 'ES-MD',
    'geo.placename': 'Torrejón de Ardoz',
    'geo.position': '40.4567;-3.4890',
    'ICBM': '40.4567, -3.4890',
    'revisit-after': '7 days',
    'rating': 'general',
    'distribution': 'global',
  },
}

// Datos estructurados de la organización
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': `${siteUrl}/#organization`,
  name: 'MID Car',
  alternateName: 'MID Car Madrid',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  description: 'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Vehículos de ocasión certificados con garantía.',
  foundingDate: '2008',
  slogan: 'Tu concesionario de confianza',
  telephone: '+34910023016',
  email: 'ventas@midcar.net',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'C/ Polo Sur 2',
    addressLocality: 'Torrejón de Ardoz',
    addressRegion: 'Madrid',
    postalCode: '28850',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.4567,
    longitude: -3.4890,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '14:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '16:00',
      closes: '20:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '09:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '11:00',
      closes: '14:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/midcar.es',
    'https://www.instagram.com/midcar_es',
    'https://www.youtube.com/@midcar',
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card, Financing',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 40.4567,
      longitude: -3.4890,
    },
    geoRadius: '50000',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Vehículos de ocasión',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Coches de segunda mano',
      },
      {
        '@type': 'OfferCatalog',
        name: 'Furgonetas de ocasión',
      },
    ],
  },
}

// Datos estructurados del sitio web
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'MID Car',
  description: 'Concesionario de coches de segunda mano en Madrid',
  publisher: {
    '@id': `${siteUrl}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/vehiculos?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'es-ES',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" dir="ltr">
      <head>
        {/* Preconexiones para mejorar rendimiento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://midcar.azureedge.net" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD Estructurado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
