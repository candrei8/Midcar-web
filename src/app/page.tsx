import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { SearchSection } from '@/components/home/SearchSection'
import { FeaturedVehicles } from '@/components/home/FeaturedVehicles'
import { HeroSection } from '@/components/home/HeroSection'
import { QuickCategories } from '@/components/home/QuickCategories'
import { TrustBadges } from '@/components/home/TrustBadges'
import { getFeaturedVehicles, getVehiclesOnSale, getVehicleCount, getBrands, getFuelTypes } from '@/lib/vehicles-service'
import {
  getHeroContent,
  getAboutContent,
  getBenefits,
  getWarrantyContent,
  getTestimonials,
  getCTAContent,
  getConfigs,
} from '@/lib/content-service'

// Below-fold sections — split into separate chunks so they don't bloat the initial JS payload
const BenefitsSection = dynamic(() => import('@/components/home/BenefitsSection').then(m => ({ default: m.BenefitsSection })))
const AboutSection = dynamic(() => import('@/components/home/AboutSection').then(m => ({ default: m.AboutSection })))
const WarrantySection = dynamic(() => import('@/components/home/WarrantySection').then(m => ({ default: m.WarrantySection })))
const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })))
const BrandsSection = dynamic(() => import('@/components/home/BrandsSection').then(m => ({ default: m.BrandsSection })))
const CTASection = dynamic(() => import('@/components/home/CTASection').then(m => ({ default: m.CTASection })))

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://midcar.es'

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

export default async function HomePage() {
  // Fetch everything server-side so the client bundle never needs to reach Supabase
  // (this eliminates the 196 KB @supabase/supabase-js chunk that was loading on the home).
  const [
    featured,
    onSale,
    count,
    brands,
    fuelTypes,
    heroContent,
    aboutContent,
    benefits,
    warrantyContent,
    testimonials,
    ctaContent,
    configs,
  ] = await Promise.all([
    getFeaturedVehicles(),
    getVehiclesOnSale(),
    getVehicleCount(),
    getBrands(),
    getFuelTypes(),
    getHeroContent(),
    getAboutContent(),
    getBenefits(),
    getWarrantyContent(),
    getTestimonials(),
    getCTAContent(),
    getConfigs(['google_rating', 'google_reviews_count', 'google_maps_url']),
  ])

  const featuredVehicles = featured.length >= 4
    ? featured.slice(0, 8)
    : [...featured, ...onSale.filter(v => !v.featured)].slice(0, 8)

  // Rangos y contadores reales calculados sobre el stock disponible
  const currentYear = new Date().getFullYear()
  const validYears = onSale.map(v => v.year).filter(y => y >= 1990 && y <= currentYear + 1)
  const yearMin = validYears.length ? Math.min(...validYears) : 2010
  const yearMax = validYears.length ? Math.max(...validYears) : currentYear
  const priceMax = onSale.length ? Math.max(...onSale.map(v => v.price)) : 50000

  const TURISMO_TYPES = ['berlina', 'familiar', 'suv', 'monovolumen']
  const categoryCounts = {
    turismos: onSale.filter(v => TURISMO_TYPES.includes(v.bodyType)).length,
    furgonetas: onSale.filter(v => v.bodyType === 'furgoneta').length,
    industriales: onSale.filter(v => v.bodyType === 'industrial').length,
    automaticos: onSale.filter(v => v.transmission === 'Automático').length,
    sietePlazas: onSale.filter(v => v.bodyType === 'monovolumen').length,
    eco: onSale.filter(v => v.label === 'ECO').length,
  }

  const google = {
    rating: (configs['google_rating'] || '4.5').replace('.', ','),
    reviews: configs['google_reviews_count'] || '189',
    url: configs['google_maps_url'] || 'https://goo.gl/maps/QBEDPvLewMC1NdZ68',
  }

  return (
    <>
      {/* Datos estructurados de la página */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />

      <HeroSection content={heroContent} google={google} />
      <SearchSection
        vehicleCount={count}
        brands={brands}
        fuelTypes={fuelTypes}
        maxPrice={priceMax}
        minYear={yearMin}
        maxYear={yearMax}
      />
      <QuickCategories counts={categoryCounts} />
      <FeaturedVehicles initialVehicles={featuredVehicles} initialCount={count} />
      <TrustBadges />
      <BenefitsSection benefits={benefits} />
      <AboutSection content={aboutContent} />
      <WarrantySection content={warrantyContent} />
      <TestimonialsSection testimonials={testimonials} />
      <BrandsSection brands={brands} />
      <CTASection content={ctaContent} />
    </>
  )
}
