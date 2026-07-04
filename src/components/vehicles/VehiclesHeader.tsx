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

// Cabecera compacta: identifica la página y cede el protagonismo al stock.
export function VehiclesHeader({ vehicleCount }: VehiclesHeaderProps) {
  return (
    <div className="border-b border-secondary-200/60 bg-white">
      <div className="container-custom py-6 md:py-8">
        <nav className="mb-2.5 flex items-center gap-1.5 text-[12px] font-light text-secondary-400">
          <Link href="/" className="transition-colors hover:text-secondary-900">
            Inicio
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-secondary-600">Vehículos</span>
        </nav>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-secondary-950 md:text-[28px]">
              Coches de segunda mano{' '}
              <span className="font-light text-secondary-400">con garantía incluida</span>
            </h1>
            {vehicleCount ? (
              <span className="rounded-full bg-primary-50 px-3 py-1 text-[12px] font-semibold text-primary-700">
                {vehicleCount} disponibles
              </span>
            ) : null}
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {trustItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <item.icon className="h-4 w-4 shrink-0 text-primary-500" strokeWidth={1.5} />
                <span className="text-[12.5px] font-light text-secondary-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
