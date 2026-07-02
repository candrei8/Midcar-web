import Link from 'next/link'
import { Car, Bus, Forklift, Cog, Users, Leaf, ArrowUpRight } from 'lucide-react'

export interface CategoryCounts {
  turismos: number
  furgonetas: number
  industriales: number
  automaticos: number
  sietePlazas: number
  eco: number
}

interface QuickCategoriesProps {
  counts: CategoryCounts
}

export function QuickCategories({ counts }: QuickCategoriesProps) {
  const categories = [
    { name: 'Turismos', count: counts.turismos, href: '/vehiculos?tipo=turismo', icon: Car },
    { name: 'Furgonetas', count: counts.furgonetas, href: '/vehiculos?carroceria=furgoneta', icon: Bus },
    { name: 'Industriales', count: counts.industriales, href: '/vehiculos?carroceria=industrial', icon: Forklift },
    { name: 'Automáticos', count: counts.automaticos, href: '/vehiculos?cambio=automatico', icon: Cog },
    { name: '7 plazas', count: counts.sietePlazas, href: '/vehiculos?carroceria=monovolumen', icon: Users },
    { name: 'Etiqueta ECO', count: counts.eco, href: '/vehiculos?etiqueta=ECO', icon: Leaf },
  ].filter((c) => c.count > 0)

  if (categories.length === 0) return null

  return (
    <section className="pb-10 pt-2">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.06] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(2,6,23,0.18)] hover:ring-primary-200"
            >
              <div className="flex items-start justify-between">
                <cat.icon className="h-6 w-6 text-secondary-400 transition-colors duration-300 group-hover:text-primary-600" strokeWidth={1.5} />
                <ArrowUpRight className="h-4 w-4 text-secondary-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-600" />
              </div>
              <div>
                <p className="text-[15px] font-semibold leading-tight text-secondary-900">
                  {cat.name}
                </p>
                <p className="mt-0.5 text-[13px] font-light text-secondary-400">
                  {cat.count} en stock
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
