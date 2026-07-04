import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, ShieldCheck, FileCheck, Percent } from 'lucide-react'

interface VehiclesHeaderProps {
  vehicleCount?: number
}

const trustItems = [
  { icon: ShieldCheck, label: 'Garantía 12 meses' },
  { icon: FileCheck, label: 'Informe CARFAX gratuito' },
  { icon: Percent, label: 'Financiación 100%' },
]

// Cinta cinematográfica compacta: la misma fotografía del hero de la home
// (continuidad de marca), densa en contenido — nada de bloques vacíos.
export function VehiclesHeader({ vehicleCount }: VehiclesHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#07080c] text-white">
      <Image
        src="/hero-premium.jpg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[72%_42%] opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080c] via-[#07080c]/80 to-[#07080c]/15" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#07080c]/80 to-transparent" />
      <div
        className="pointer-events-none absolute -left-24 -bottom-32 h-[300px] w-[300px] rounded-full opacity-[0.25] blur-3xl"
        style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 65%)' }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[url('/noise.svg')]" />

      <div className="container-custom relative py-8 md:py-10">
        <nav className="mb-4 flex items-center gap-1.5 text-[12px] font-light text-white/40">
          <Link href="/" className="transition-colors hover:text-white">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white/75">Vehículos</span>
        </nav>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1 className="font-display text-[26px] leading-tight tracking-tight md:text-[32px]">
              <span className="font-light">Coches de segunda mano</span>{' '}
              <span className="font-bold">con garantía incluida</span>
            </h1>
            {vehicleCount ? (
              <span className="rounded-full bg-primary-600 px-3 py-1 text-[12px] font-semibold text-white shadow-[0_2px_10px_rgba(220,38,38,0.4)]">
                {vehicleCount} disponibles
              </span>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-x-0 gap-y-2.5">
            {trustItems.map((item, i) => (
              <div
                key={item.label}
                className={
                  'flex items-center gap-2 pr-6' +
                  (i < trustItems.length - 1 ? ' mr-6 border-r border-white/15' : ' pr-0')
                }
              >
                <item.icon className="h-4 w-4 shrink-0 text-primary-400" strokeWidth={1.5} />
                <span className="whitespace-nowrap text-[12.5px] font-light text-white/75">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
