'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'

interface SearchSectionProps {
  vehicleCount: number
  brands: string[]
  fuelTypes: string[]
  maxPrice: number
  minYear: number
  maxYear: number
}

const vehicleTypes = [
  { id: 'todos', name: 'Todos' },
  { id: 'turismo', name: 'Turismo' },
  { id: 'furgoneta', name: 'Furgoneta' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'berlina', name: 'Berlina' },
  { id: 'familiar', name: 'Familiar' },
  { id: 'suv', name: 'SUV / 4x4' },
  { id: 'monovolumen', name: 'Monovolumen' },
]

const PRICE_STEP = 1000

function formatEuro(n: number) {
  return `${n.toLocaleString('es-ES')} €`
}

function SelectField({ label, value, onChange, children }: {
  label: string
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary-500 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none cursor-pointer rounded-lg border border-secondary-200 bg-white px-3 py-2.5 pr-8 text-sm font-medium text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
      </div>
    </div>
  )
}

export function SearchSection({ vehicleCount, brands, fuelTypes, maxPrice, minYear, maxYear }: SearchSectionProps) {
  const router = useRouter()
  const priceCap = Math.max(10000, Math.ceil(maxPrice / 5000) * 5000)

  const [tipo, setTipo] = useState('todos')
  const [marca, setMarca] = useState('Todas')
  const [combustible, setCombustible] = useState('Todos')
  const [precioMin, setPrecioMin] = useState(0)
  const [precioMax, setPrecioMax] = useState(priceCap)
  const [anoDesde, setAnoDesde] = useState('')
  const [anoHasta, setAnoHasta] = useState('')

  const years = useMemo(() => {
    const list: number[] = []
    for (let y = maxYear; y >= minYear; y--) list.push(y)
    return list
  }, [minYear, maxYear])

  const search = () => {
    const params = new URLSearchParams()
    if (tipo === 'turismo') params.set('tipo', 'turismo')
    else if (tipo !== 'todos') params.set('carroceria', tipo)
    if (marca !== 'Todas') params.set('marca', marca.toLowerCase().replace(/\s+/g, '-'))
    if (combustible !== 'Todos') params.set('combustible', combustible.toLowerCase())
    if (precioMin > 0) params.set('precio_min', String(precioMin))
    if (precioMax < priceCap) params.set('precio_max', String(precioMax))
    if (anoDesde) params.set('ano_min', anoDesde)
    if (anoHasta) params.set('ano_max', anoHasta)
    router.push(`/vehiculos${params.toString() ? '?' + params.toString() : ''}`)
  }

  const minPct = (precioMin / priceCap) * 100
  const maxPct = (precioMax / priceCap) * 100

  return (
    <section className="relative z-30 -mt-14 md:-mt-20 px-4 md:px-0 pb-6">
      <div className="container-custom">
        <div className="rounded-2xl bg-white p-5 md:p-6 shadow-2xl shadow-secondary-950/20 border border-secondary-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.5fr_0.8fr_0.8fr_auto] gap-4 items-end">
            <SelectField label="Tipo de vehículo" value={tipo} onChange={setTipo}>
              {vehicleTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </SelectField>

            <SelectField label="Marca" value={marca} onChange={setMarca}>
              <option value="Todas">Todas</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </SelectField>

            <SelectField label="Combustible" value={combustible} onChange={setCombustible}>
              <option value="Todos">Todos</option>
              {fuelTypes.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </SelectField>

            {/* Precio: slider doble */}
            <div className="col-span-2 md:col-span-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-secondary-500 mb-1.5">
                Precio
              </label>
              <div className="rounded-lg border border-secondary-200 px-3 pt-2 pb-3">
                <div className="flex justify-between text-xs font-semibold text-secondary-700 mb-2">
                  <span>{formatEuro(precioMin)}</span>
                  <span>{precioMax >= priceCap ? `${formatEuro(priceCap)}+` : formatEuro(precioMax)}</span>
                </div>
                <div className="dual-range relative h-5">
                  <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded-full bg-secondary-200" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary-600"
                    style={{ left: `${minPct}%`, width: `${Math.max(0, maxPct - minPct)}%` }}
                  />
                  <input
                    type="range"
                    aria-label="Precio mínimo"
                    min={0}
                    max={priceCap}
                    step={PRICE_STEP}
                    value={precioMin}
                    onChange={(e) => setPrecioMin(Math.min(Number(e.target.value), precioMax - PRICE_STEP))}
                  />
                  <input
                    type="range"
                    aria-label="Precio máximo"
                    min={0}
                    max={priceCap}
                    step={PRICE_STEP}
                    value={precioMax}
                    onChange={(e) => setPrecioMax(Math.max(Number(e.target.value), precioMin + PRICE_STEP))}
                  />
                </div>
              </div>
            </div>

            <SelectField label="Año desde" value={anoDesde} onChange={setAnoDesde}>
              <option value="">Todos</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </SelectField>

            <SelectField label="Año hasta" value={anoHasta} onChange={setAnoHasta}>
              <option value="">Todos</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </SelectField>

            <button
              type="button"
              onClick={search}
              className="col-span-2 md:col-span-3 lg:col-span-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors shadow-lg shadow-primary-600/25 whitespace-nowrap"
            >
              <Search className="h-4 w-4" />
              Buscar vehículos
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-secondary-100 pt-3">
            <span className="text-xs text-secondary-500">
              {vehicleCount} vehículos disponibles
            </span>
            <a
              href="/vehiculos"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-secondary-500 hover:text-primary-600 transition-colors"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              Búsqueda avanzada
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
