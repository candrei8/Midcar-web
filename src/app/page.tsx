import { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { SearchSection } from '@/components/home/SearchSection'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { BenefitsSection } from '@/components/home/BenefitsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { BrandsSection } from '@/components/home/BrandsSection'
import { CTASection } from '@/components/home/CTASection'
import { TrustBadges } from '@/components/home/TrustBadges'
import { AboutSection } from '@/components/home/AboutSection'
import { WarrantySection } from '@/components/home/WarrantySection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const metadata: Metadata = {
  title: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
  description: 'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Más de 90 vehículos de ocasión certificados con 1 año de garantía. Financiación sin entrada y respuesta en 24h.',
  keywords: [
    'coches segunda mano madrid',
    'concesionario torrejón de ardoz',
    'coches ocasión garantizados',
    'vehículos usados madrid',
    'financiación coches madrid',
    'coches km0 madrid',
    'midcar',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'MID Car | Tu Concesionario de Confianza en Madrid',
    description: 'Más de 90 vehículos de ocasión certificados con garantía. Financiación sin entrada. Visítanos en Torrejón de Ardoz.',
    url: siteUrl,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'MID Car - Concesionario de coches de segunda mano',
      },
    ],
  },
}

// Datos estructurados de la página principal
const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/#webpage`,
  url: siteUrl,
  name: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
  description: 'Concesionario de coches de segunda mano en Torrejón de Ardoz, Madrid. Vehículos de ocasión certificados con garantía.',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
  about: {
    '@id': `${siteUrl}/#organization`,
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: `${siteUrl}/og-image.jpg`,
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
    ],
  },
}

export default function HomePage() {
  return (
    <>
      {/* Datos estructurados de la página */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />

      <HeroSection />
      <SearchSection />
      <TrustBadges />
      <FeaturedVehicles />
      <BenefitsSection />
      <AboutSection />
      <WarrantySection />
      <TestimonialsSection />
      <BrandsSection />
      <CTASection />
    </>
  )
}
