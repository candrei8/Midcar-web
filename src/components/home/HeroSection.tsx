import Image from 'next/image'
import Link from 'next/link'
import { Gauge, ShieldCheck, Wrench, Percent, ArrowRight, Phone } from 'lucide-react'
import type { HeroContent } from '@/lib/content-service'

interface HeroSectionProps {
  content: HeroContent
  vehicleCount: number
  telefono: string
}

const trustItems = [
  { icon: Gauge, label: 'Kilómetros certificados' },
  { icon: ShieldCheck, label: 'Garantía 12 meses' },
  { icon: Wrench, label: 'Revisados en taller propio' },
  { icon: Percent, label: 'Financiación a tu medida' },
]

export function HeroSection({ content, vehicleCount, telefono }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#07080c]">
      {/* Fondo — editable desde el CRM; por defecto, foto premium local (Unsplash, licencia libre) */}
      <Image
        src={content.imagenUrl || '/hero-premium.jpg'}
        alt="Vehículo premium de ocasión en MID Car"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[70%_center] opacity-80"
      />

      {/* Escenografía: viñeta izquierda para lectura + halo rojo sutil + vignette inferior */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/80 to-[#07080c]/10" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[#07080c] via-[#07080c]/60 to-transparent" />
      <div
        className="absolute -left-40 -bottom-40 h-[480px] w-[480px] rounded-full opacity-[0.22] blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 65%)' }}
      />
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/noise.svg')] pointer-events-none" />

      <div className="relative z-10 container-custom px-4 md:px-6 lg:px-8 pt-20 md:pt-28 pb-32 md:pb-44">
        <div className="max-w-3xl">
          {/* Eyebrow minimalista */}
          <div className="flex items-center gap-3 mb-7">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            <span className="text-white/60 text-[11px] font-medium uppercase tracking-[0.4em]">
              {content.badge}
            </span>
          </div>

          <h1 className="font-display text-white text-[42px] sm:text-6xl lg:text-[72px] leading-[1.04] tracking-tight mb-6">
            <span className="font-light">{content.titulo1}</span>
            <br />
            <span className="font-bold">{content.titulo2}</span>
          </h1>

          <p className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-xl mb-10">
            {content.subtitulo}
          </p>

          {/* CTAs: una acción principal clara + llamada directa */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-12">
            <Link
              href="/vehiculos"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-b from-primary-500 to-primary-700 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(220,38,38,0.35)] transition-all duration-300 hover:shadow-[0_12px_40px_rgba(220,38,38,0.5)] hover:brightness-110"
            >
              Ver los {vehicleCount} vehículos
              <ArrowRight className="h-4.5 w-4.5 h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${telefono.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-7 py-4 text-[15px] font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/[0.12] hover:border-white/30"
            >
              <Phone className="h-[17px] w-[17px] text-primary-400" />
              {telefono}
            </a>
          </div>

          {/* Confianza: chips de cristal, discretos */}
          <div className="flex flex-wrap gap-2.5">
            {trustItems.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-[13px] font-light text-white/75 backdrop-blur-md"
              >
                <item.icon className="h-3.5 w-3.5 text-primary-400" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
