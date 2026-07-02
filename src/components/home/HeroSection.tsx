import Image from 'next/image'
import Link from 'next/link'
import { Gauge, ShieldCheck, Wrench, Percent, Star } from 'lucide-react'
import type { HeroContent } from '@/lib/content-service'

interface HeroSectionProps {
  content: HeroContent
  google: {
    rating: string
    reviews: string
    url: string
  }
}

const trustItems = [
  { icon: Gauge, line1: 'Kilómetros', line2: 'certificados' },
  { icon: ShieldCheck, line1: 'Garantía', line2: '12 meses' },
  { icon: Wrench, line1: 'Revisados en', line2: 'nuestro taller' },
  { icon: Percent, line1: 'Financiación', line2: 'a tu medida' },
]

const heroCtas = [
  { label: 'Ver stock', href: '/vehiculos', primary: true },
  { label: 'Turismos', href: '/vehiculos?tipo=turismo', primary: false },
  { label: 'Furgonetas', href: '/vehiculos?carroceria=furgoneta', primary: false },
  { label: 'Financiación', href: '/financiacion', primary: false },
]

export function HeroSection({ content, google }: HeroSectionProps) {
  const ratingValue = parseFloat(google.rating.replace(',', '.')) || 4.5

  return (
    <section className="relative isolate w-full overflow-hidden bg-secondary-950">
      {/* Fondo: imagen gestionada desde el CRM (gestion-web/hero) */}
      {content.imagenUrl ? (
        <Image
          src={content.imagenUrl}
          alt="Concesionario MID Car en Torrejón de Ardoz"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 65% 45%, #1e293b 0%, #020617 75%)' }}
        />
      )}

      {/* Scrim para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary-950/95 via-secondary-950/75 to-secondary-950/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-secondary-950/70 to-transparent" />

      <div className="relative z-10 container-custom px-4 md:px-6 lg:px-8 pt-14 md:pt-20 pb-28 md:pb-36">
        <div className="max-w-3xl">
          <span className="inline-block bg-primary-600 text-white text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-sm mb-5 md:mb-6">
            {content.badge}
          </span>

          <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] leading-[1.06] tracking-tight mb-8 md:mb-10">
            {content.titulo1}
            <br />
            {content.titulo2}
          </h1>

          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-9 md:mb-11">
            {trustItems.map((item) => (
              <div key={item.line2} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-white/30 bg-white/5 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-white text-sm leading-snug">
                  <span className="font-semibold">{item.line1}</span>
                  <br />
                  <span className="text-white/80">{item.line2}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {heroCtas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={
                  cta.primary
                    ? 'bg-primary-600 hover:bg-primary-700 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-colors shadow-lg shadow-primary-600/30'
                    : 'border border-white/40 hover:bg-white hover:text-secondary-900 text-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-colors'
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Reseñas reales de Google — flotante inferior izquierda */}
      <a
        href={google.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${google.rating} estrellas en Google, ${google.reviews} reseñas`}
        className="fixed left-4 bottom-4 z-40 hidden md:flex items-center gap-2.5 bg-white rounded-full shadow-xl border border-secondary-100 pl-2.5 pr-4 py-2 hover:shadow-2xl transition-shadow"
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.97 10.97 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <div className="flex flex-col leading-none">
          <span className="flex items-center gap-1 text-sm font-bold text-secondary-900">
            {google.rating}
            <span className="flex" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i <= Math.round(ratingValue) ? 'fill-amber-400 text-amber-400' : 'fill-secondary-200 text-secondary-200'}`}
                />
              ))}
            </span>
          </span>
          <span className="text-[11px] text-secondary-500 mt-1">+{google.reviews} reseñas en Google</span>
        </div>
      </a>
    </section>
  )
}
