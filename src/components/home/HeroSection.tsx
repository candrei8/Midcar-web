import Image from 'next/image'
import Link from 'next/link'
import type { HeroContent } from '@/lib/content-service'

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#000000]">
      {/* Fondo */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'radial-gradient(circle at 62% 48%, rgba(26,26,30,1) 0%, rgba(3,3,3,1) 70%)' }}
      />
      <div className="absolute inset-0 opacity-[0.04] bg-[url('/noise.svg')] z-10 pointer-events-none" />

      {/* Coche — foto profesional recortada (sin fondo) */}
      <div className="absolute inset-y-0 right-0 w-[72%] sm:w-[60%] lg:w-[56%] z-20 pointer-events-none">
        <Image
          src="/hero-coche-front.png"
          alt="Coche de ocasión premium en MID Car"
          fill
          priority
          sizes="(max-width: 1024px) 72vw, 56vw"
          className="object-contain object-center"
        />
      </div>

      {/* Scrim: oscurece la izquierda para que el texto blanco se lea sobre el coche */}
      <div className="absolute inset-0 z-[25] bg-gradient-to-r from-black via-black/75 to-transparent pointer-events-none" />

      {/* Contenido */}
      <div className="absolute inset-0 z-30 flex flex-col justify-center px-8 md:px-16 lg:px-[8%]">
        <div className="max-w-4xl w-full mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-4 mb-8 md:mb-10">
            <div className="w-12 h-[1px] bg-white/50"></div>
            <span className="text-white/70 font-light tracking-[0.5em] text-[10px] uppercase">
              Calidad y Confianza
            </span>
          </div>

          <h1 className="text-[14vw] md:text-7xl lg:text-[100px] font-bold text-white tracking-tight uppercase leading-[0.9]">
            {content.titulo1 || 'TU PRÓXIMO'}
          </h1>
          <h1 className="text-[14vw] md:text-7xl lg:text-[100px] font-light text-white/30 tracking-tight uppercase leading-[0.9] mb-10 md:mb-12 text-outline">
            {content.titulo2 || 'COCHE'}
          </h1>

          <p className="text-white/50 text-[14px] font-light leading-relaxed max-w-sm mb-12 md:mb-14 border-l border-white/10 pl-6">
            {content.subtitulo || 'Vehículos de ocasión revisados en nuestro taller propio. Calidad y transparencia en tu próxima compra.'}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-8">
            <Link
              href="/vehiculos"
              className="group relative bg-white text-black px-12 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-center overflow-hidden"
            >
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">Ver Inventario</span>
              <div className="absolute inset-0 bg-black translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)]"></div>
            </Link>

            <Link
              href="/contacto"
              className="group flex items-center justify-center gap-4 text-white/40 hover:text-white transition-colors"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Contactar</span>
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-all">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
