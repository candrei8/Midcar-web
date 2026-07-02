import Link from 'next/link'
import { Car, Bus, Forklift, Cog, Users, Leaf, ArrowRight } from 'lucide-react'

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
    { name: 'Turismos', count: counts.turismos, href: '/vehiculos?tipo=turismo', icon: Car, iconCls: 'bg-secondary-50 text-secondary-700' },
    { name: 'Furgonetas', count: counts.furgonetas, href: '/vehiculos?carroceria=furgoneta', icon: Bus, iconCls: 'bg-secondary-50 text-secondary-700' },
    { name: 'Industriales', count: counts.industriales, href: '/vehiculos?carroceria=industrial', icon: Forklift, iconCls: 'bg-secondary-50 text-secondary-700' },
    { name: 'Automáticos', count: counts.automaticos, href: '/vehiculos?cambio=automatico', icon: Cog, iconCls: 'bg-secondary-50 text-secondary-700' },
    { name: '7 plazas', count: counts.sietePlazas, href: '/vehiculos?carroceria=monovolumen', icon: Users, iconCls: 'bg-secondary-50 text-secondary-700' },
    { name: 'Etiqueta ECO', count: counts.eco, href: '/vehiculos?etiqueta=ECO', icon: Leaf, iconCls: 'bg-green-50 text-green-600' },
  ].filter((c) => c.count > 0)

  if (categories.length === 0) return null

  return (
    <section className="pb-8 pt-2">
      <div className="container-custom px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex items-center gap-3 rounded-xl border border-secondary-200 bg-white p-4 transition-all hover:border-primary-300 hover:shadow-lg hover:shadow-secondary-900/5"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${cat.iconCls}`}>
                <cat.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] leading-tight font-bold uppercase text-secondary-900">
                  {cat.name}
                </p>
                <p className="flex items-center gap-1 text-xs text-secondary-500">
                  {cat.count} en stock
                  <ArrowRight className="h-3 w-3 text-primary-600 transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
