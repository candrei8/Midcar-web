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
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-400">
        {label}
      </label>
      <div className="relative">
        <select
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl bg-secondary-50 px-4 py-3 pr-9 text-sm font-medium text-secondary-800 ring-1 ring-transparent transition-all duration-200 hover:bg-secondary-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/60"
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
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
    <section className="relative z-30 -mt-20 md:-mt-28 px-4 md:px-0 pb-8">
      <div className="container-custom">
        <div className="rounded-[28px] bg-white/95 backdrop-blur-xl p-6 md:p-8 shadow-[0_24px_80px_-16px_rgba(2,6,23,0.35)] ring-1 ring-secondary-900/5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr_1.5fr_0.8fr_0.8fr_auto] gap-4 lg:gap-5 items-end">
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

            {/* Precio: slider doble refinado */}
            <div className="col-span-2 md:col-span-1">
              <label className="mb-2 flex items-baseline justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-400">
                Precio
                <span className="text-[11px] font-semibold normal-case tracking-normal text-secondary-700">
                  {formatEuro(precioMin)} — {precioMax >= priceCap ? `${formatEuro(priceCap)}+` : formatEuro(precioMax)}
                </span>
              </label>
              <div className="rounded-xl bg-secondary-50 px-4 pt-[18px] pb-[18px]">
                <div className="dual-range relative h-3.5">
                  <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-secondary-200" />
                  <div
                    className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-primary-500 to-primary-600"
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
              className="group col-span-2 md:col-span-3 lg:col-span-1 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary-600 px-7 py-[15px] text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-200 hover:-translate-y-px hover:bg-primary-700 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_8px_24px_-8px_rgba(220,38,38,0.55)] active:translate-y-0 active:bg-primary-800 active:shadow-none"
            >
              <Search className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              Buscar
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-secondary-100 pt-4">
            <span className="text-[13px] font-light text-secondary-500">
              <span className="font-semibold text-secondary-800">{vehicleCount}</span> vehículos disponibles hoy
            </span>
            <a
              href="/vehiculos"
              className="text-[13px] font-medium text-secondary-500 transition-colors hover:text-primary-600"
            >
              Búsqueda avanzada →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
