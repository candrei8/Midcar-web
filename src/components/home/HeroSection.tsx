'use client'

import { ArrowRight, Shield, Award, Clock, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getHeroContent, HeroContent } from '@/lib/content-service'

const defaultStats = [
  { icon: Shield, label: '15+ años', sublabel: 'de experiencia' },
  { icon: Award, label: '1 año', sublabel: 'de garantía' },
  { icon: Clock, label: '80+', sublabel: 'vehículos en stock' },
]

// Default content (fallback)
const defaultContent: HeroContent = {
  badge: 'Concesionario de confianza en Madrid',
  titulo1: 'Tu próximo coche',
  titulo2: 'está aquí',
  subtitulo: 'Más de 15 años ofreciendo vehículos de ocasión certificados, garantizados y al mejor precio en Torrejón de Ardoz, Madrid.',
  ctaPrimario: 'Ver vehículos',
  ctaSecundario: 'Contactar',
  stats: [
    { valor: '15+', label: 'años de experiencia' },
    { valor: '1 año', label: 'de garantía' },
    { valor: '80+', label: 'vehículos en stock' },
  ],
  precioDesde: '7.900€',
  garantiaBadge: 'Garantía 12 meses',
  imagenUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
}

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<HeroContent>(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Fetch content from Supabase
    async function fetchContent() {
      try {
        const heroContent = await getHeroContent()
        setContent(heroContent)
      } catch (error) {
        console.error('Error fetching hero content:', error)
        // Keep default content on error
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const statsWithIcons = [
    { icon: Shield, label: content.stats[0]?.valor || '15+', sublabel: content.stats[0]?.label || 'años de experiencia' },
    { icon: Award, label: content.stats[1]?.valor || '1 año', sublabel: content.stats[1]?.label || 'de garantía' },
    { icon: Clock, label: content.stats[2]?.valor || '80+', sublabel: content.stats[2]?.label || 'vehículos en stock' },
  ]

  return (
    <section className="relative min-h-[90vh] md:min-h-[100vh] flex items-center overflow-hidden">
      {/* Static Background - NO blur, NO animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        {/* Static gradient orbs - using opacity and gradients instead of blur */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 60%)'
            }}
          />
        </div>

        {/* Grid Pattern - static */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div
            className={`text-white space-y-8 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{content.badge}</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.1]">
              {content.titulo1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">
                {content.titulo2}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-secondary-300 max-w-lg">
              {content.subtitulo}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/vehiculos" className="btn-primary text-lg px-8 py-4 hover:scale-105 transition-transform">
                {content.ctaPrimario}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/contacto" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white hover:text-secondary-900 text-lg px-8 py-4 hover:scale-105 transition-transform">
                {content.ctaSecundario}
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`flex flex-wrap gap-8 pt-8 border-t border-white/10 transition-all duration-700 ease-out delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {statsWithIcons.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 hover:scale-105 transition-transform cursor-default"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.label}</p>
                    <p className="text-sm text-secondary-400">{stat.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Visual */}
          <div
            className={`relative transition-all duration-700 ease-out delay-200 ${
              mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="relative z-10">
              {/* Main Car Image */}
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-secondary-700 to-secondary-800 border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img
                  src={content.imagenUrl}
                  alt="Coche de ocasión en MID Car - Concesionario de coches de segunda mano en Madrid"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/70 via-transparent to-secondary-900/20" />

                {/* Floating price tag */}
                <div
                  className={`absolute bottom-6 left-6 bg-white/95 rounded-2xl px-5 py-3 shadow-xl transition-all duration-500 delay-500 hover:scale-105 ${
                    mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                >
                  <p className="text-sm text-secondary-500">Desde</p>
                  <p className="text-2xl font-bold text-secondary-900">{content.precioDesde}</p>
                </div>

                {/* Floating guarantee badge */}
                <div
                  className={`absolute top-6 right-6 bg-green-500 text-white rounded-full px-4 py-2 shadow-xl flex items-center gap-2 transition-all duration-500 delay-700 hover:scale-110 ${
                    mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-semibold">{content.garantiaBadge}</span>
                </div>
              </div>

              {/* Decorative elements - static gradients instead of animated blur */}
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full opacity-30"
                style={{
                  background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
                }}
              />
              <div
                className="absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-40"
                style={{
                  background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 delay-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <button
          className="flex flex-col items-center gap-2 cursor-pointer animate-bounce"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
            }
          }}
        >
          <span className="text-white/50 text-sm">Descubre más</span>
          <ChevronDown className="w-6 h-6 text-white/50" />
        </button>
      </div>
    </section>
  )
}
