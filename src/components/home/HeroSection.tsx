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
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-14">
            <Link
              href="/vehiculos"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-primary-600 px-8 py-4 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-px hover:bg-primary-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(220,38,38,0.55)] active:translate-y-0 active:bg-primary-800 active:shadow-none"
            >
              Ver los {vehicleCount} vehículos
              <ArrowRight className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={`tel:${telefono.replace(/\s/g, '')}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/20 px-7 py-4 text-[15px] font-medium text-white backdrop-blur-md transition-colors duration-200 hover:border-white/50 hover:bg-white/[0.06]"
            >
              <Phone className="h-[17px] w-[17px] text-primary-400" />
              {telefono}
            </a>
          </div>
        </div>

        {/* Confianza: una línea a lo ancho con separadores finos, sin cajas */}
        <div className="mt-14 grid grid-cols-2 gap-y-5 border-t border-white/10 pt-7 lg:flex lg:items-center">
          {trustItems.map((item, i) => (
            <div
              key={item.label}
              className={
                'flex items-center gap-2.5' +
                (i < trustItems.length - 1 ? ' lg:mr-9 lg:border-r lg:border-white/10 lg:pr-9' : '')
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 text-primary-400" strokeWidth={1.5} />
              <span className="text-[13.5px] font-light leading-tight text-white/70 lg:whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
