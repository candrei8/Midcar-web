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

export function VehiclesHeader({ vehicleCount }: VehiclesHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#07080c] text-white">
      {/* Halo rojo sutil + textura, como el hero de la home */}
      <div
        className="pointer-events-none absolute -right-40 -top-52 h-[460px] w-[460px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: 'radial-gradient(circle, #dc2626 0%, transparent 65%)' }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] bg-[url('/noise.svg')]" />

      <div className="container-custom relative py-12 md:py-16">
        {/* Breadcrumb */}
        <nav className="mb-7 flex items-center gap-2 text-[13px] font-light text-white/40">
          <Link href="/" className="transition-colors hover:text-white">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-white/80">Vehículos</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
              <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/60">
                Stock completo{vehicleCount ? ` · ${vehicleCount} vehículos` : ''}
              </span>
            </div>
            <h1 className="font-display text-4xl leading-[1.06] tracking-tight md:text-5xl">
              <span className="font-light">Coches de segunda mano</span>
              <br />
              <span className="font-bold">con garantía incluida</span>
            </h1>
          </div>

          {/* Confianza compacta, alineada abajo a la derecha */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {trustItems.map((item, i) => (
              <div
                key={item.label}
                className={
                  'flex items-center gap-2.5' +
                  (i < trustItems.length - 1 ? ' lg:mr-0 lg:border-r lg:border-white/10 lg:pr-7' : '')
                }
              >
                <item.icon className="h-[17px] w-[17px] shrink-0 text-primary-400" strokeWidth={1.5} />
                <span className="text-[13px] font-light text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
