import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VoiceflowChat } from '@/components/ui/VoiceflowChat'
import { getContactInfo } from '@/lib/content-service'
import { defaultContactInfo } from '@/lib/contact-info'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://midcar.es'

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
  description: 'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Vehículos de ocasión certificados con 1 año de garantía. Financiación sin entrada. En activo desde 2007.',

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
    description: 'Vehículos de ocasión certificados con 1 año de garantía. Financiación sin entrada. En activo desde 2007 en Torrejón de Ardoz.',
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
    google: 'JpMezKzQhVcl4osFh-Cv7DnFE201h6R8r6S4YL5yirI',
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
    'geo.position': '40.4494379;-3.4821735',
    'ICBM': '40.4494379, -3.4821735',
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
  alternateName: ['MID Car Vehículos de Confianza', 'MID Car Madrid', 'MidCar'],
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/og-image.jpg`,
  description:
    'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid, en activo desde 2007. Turismos y vehículos industriales de ocasión con informe CARFAX, Garantía Plus de 12 meses (cobertura hasta 2.500 € por avería) o Garantía Premium para vehículos con menos de 120.000 km (cobertura hasta 6.000 € por avería). Unos 230 vehículos vendidos al año. Domingos con cita previa.',
  foundingDate: '2007',
  slogan: 'Tu concesionario de confianza',
  telephone: '+34617728087',
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+34617728087',
      contactType: 'sales',
      areaServed: 'ES',
      availableLanguage: ['es'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+34695055555',
      contactType: 'customer service',
      areaServed: 'ES',
      availableLanguage: ['es'],
    },
  ],
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
    latitude: 40.4494379,
    longitude: -3.4821735,
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
      opens: '15:30',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '09:00',
      closes: '14:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Friday',
      opens: '15:30',
      closes: '17:30',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '11:00',
      closes: '14:00',
    },
  ],
  sameAs: [
    'https://www.midcar.net',
    'https://www.facebook.com/midcarmidcar',
    'https://www.instagram.com/midcarmidcar/',
    'https://www.youtube.com/@mid7473',
    'https://x.com/MidcarVehiculos',
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Credit Card, Financing',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 40.4494379,
      longitude: -3.4821735,
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactInfo = await getContactInfo().catch(() => defaultContactInfo)

  return (
    <html lang="es" dir="ltr" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        {/* Vehicle images are proxied through /_next/image, so no preconnect to azureedge.net.
           Analytics may fire after interaction — use dns-prefetch (cheap) instead of preconnect. */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* JSON-LD Estructurado */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Header contactInfo={contactInfo} />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <Footer contactInfo={contactInfo} />
        <VoiceflowChat />
      </body>
    </html>
  )
}
