'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { SlidersHorizontal, X, ChevronDown, Grid, List, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { VehicleCard } from '@/components/vehicles/VehicleCard'
import { getVehiclesOnSale, getBrands, getFuelTypes, getLabels, extractBaseModel, type Vehicle } from '@/lib/vehicles-service'

const VEHICLES_PER_PAGE = 24

const TURISMO_TYPES = ['berlina', 'familiar', 'suv', 'monovolumen']

const bodyTypes = [
  { id: 'todas', name: 'Todas' },
  { id: 'turismo', name: 'Turismo (todos)' },
  { id: 'berlina', name: 'Berlina' },
  { id: 'familiar', name: 'Familiar' },
  { id: 'suv', name: 'SUV/4x4' },
  { id: 'monovolumen', name: 'Monovolumen' },
  { id: 'furgoneta', name: 'Furgoneta' },
  { id: 'industrial', name: 'Industrial' },
]
const priceRanges = [
  { label: 'Sin límite', value: Infinity },
  { label: '5.000€', value: 5000 },
  { label: '10.000€', value: 10000 },
  { label: '15.000€', value: 15000 },
  { label: '20.000€', value: 20000 },
  { label: '25.000€', value: 25000 },
  { label: '30.000€', value: 30000 },
  { label: '40.000€', value: 40000 },
  { label: '50.000€', value: 50000 },
  { label: '60.000€', value: 60000 },
]
const kmRanges = [
  { label: 'Sin límite', value: Infinity },
  { label: '25.000 km', value: 25000 },
  { label: '50.000 km', value: 50000 },
  { label: '75.000 km', value: 75000 },
  { label: '100.000 km', value: 100000 },
  { label: '125.000 km', value: 125000 },
  { label: '150.000 km', value: 150000 },
  { label: '200.000 km', value: 200000 },
]
const yearRanges = ['Sin límite', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
const transmissionOptions = ['Todas', 'Manual', 'Automático']

interface VehiclesCatalogProps {
  initialVehicles?: Vehicle[]
  initialBrands?: string[]
  initialFuelTypes?: string[]
  initialLabels?: string[]
}

export function VehiclesCatalog({ initialVehicles, initialBrands, initialFuelTypes, initialLabels }: VehiclesCatalogProps = {}) {
  const searchParams = useSearchParams()
  const hasServerData = Boolean(initialVehicles && initialVehicles.length > 0)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(!hasServerData)
  const [visibleCount, setVisibleCount] = useState(VEHICLES_PER_PAGE)

  // Datos: llegan renderizados del servidor (rápido); el fetch en cliente queda como fallback
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles || [])
  const [brands, setBrands] = useState<string[]>(['Todas', ...(initialBrands || [])])
  const [fuelTypes, setFuelTypes] = useState<string[]>(['Todos', ...(initialFuelTypes || [])])
  const [labels, setLabels] = useState<string[]>(['Todas', ...(initialLabels || [])])

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    brand: 'Todas',
    model: 'Todos',
    fuel: 'Todos',
    bodyType: 'todas',
    transmission: 'Todas',
    label: 'Todas',
    maxPrice: 'Sin límite',
    maxKm: 'Sin límite',
    minYear: 'Sin límite',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('relevancia')
  // Rangos numéricos que solo llegan por URL (slider de precio y años de la home)
  const [urlRange, setUrlRange] = useState<{ minPrice?: number; maxPrice?: number; minYear?: number; maxYear?: number }>({})

  // Load data on mount (solo si el servidor no aportó datos)
  useEffect(() => {
    if (hasServerData) return
    async function loadData() {
      setIsLoading(true)
      try {
        const [vehiclesData, brandsData, fuelTypesData, labelsData] = await Promise.all([
          getVehiclesOnSale(),
          getBrands(),
          getFuelTypes(),
          getLabels(),
        ])
        setVehicles(vehiclesData)
        setBrands(['Todas', ...brandsData])
        setFuelTypes(['Todos', ...fuelTypesData])
        setLabels(['Todas', ...labelsData])
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [hasServerData])

  // Contadores reales para los filtros rápidos
  const quickCounts = useMemo(() => ({
    todos: vehicles.length,
    turismo: vehicles.filter(v => TURISMO_TYPES.includes(v.bodyType)).length,
    furgoneta: vehicles.filter(v => v.bodyType === 'furgoneta').length,
    industrial: vehicles.filter(v => v.bodyType === 'industrial').length,
    monovolumen: vehicles.filter(v => v.bodyType === 'monovolumen').length,
    auto: vehicles.filter(v => v.transmission === 'Automático').length,
    eco: vehicles.filter(v => v.label === 'ECO').length,
  }), [vehicles])

  // Modelos derivados en local del stock ya cargado
  const models = useMemo(() => {
    const source = filters.brand !== 'Todas' ? vehicles.filter(v => v.brand === filters.brand) : vehicles
    return ['Todos', ...Array.from(new Set(source.map(v => extractBaseModel(v.model)))).sort()]
  }, [vehicles, filters.brand])

  // Reset model when brand changes
  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({ ...prev, brand, model: 'Todos' }))
  }

  // Parse URL params on mount
  useEffect(() => {
    const marca = searchParams.get('marca')
    const carroceria = searchParams.get('carroceria')
    const tipo = searchParams.get('tipo')
    const combustible = searchParams.get('combustible')
    const cambio = searchParams.get('cambio')
    const etiqueta = searchParams.get('etiqueta')
    const precioMax = searchParams.get('precio_max')
    const precioMin = searchParams.get('precio_min')
    const kmMax = searchParams.get('km_max')
    const anoMin = searchParams.get('ano_min')
    const anoMax = searchParams.get('ano_max')

    const newFilters = { ...filters }
    const newRange: typeof urlRange = {}

    if (marca) {
      const matchedBrand = brands.find(b =>
        b.toLowerCase().replace(/\s+/g, '-') === marca.toLowerCase() ||
        b.toLowerCase() === marca.toLowerCase()
      )
      if (matchedBrand) newFilters.brand = matchedBrand
    }

    if (tipo === 'turismo') {
      newFilters.bodyType = 'turismo'
    } else if (carroceria) {
      const matchedBody = bodyTypes.find(b => b.id === carroceria.toLowerCase())
      if (matchedBody) newFilters.bodyType = matchedBody.id
    }

    if (combustible) {
      const matchedFuel = fuelTypes.find(f => f.toLowerCase() === combustible.toLowerCase())
      if (matchedFuel && matchedFuel !== 'Todos') newFilters.fuel = matchedFuel
    }

    if (cambio) {
      const transMap: Record<string, string> = { automatico: 'Automático', manual: 'Manual' }
      const matched = transMap[cambio.toLowerCase()]
      if (matched) newFilters.transmission = matched
    }

    if (etiqueta) {
      newFilters.label = etiqueta.toUpperCase() === 'ECO' ? 'ECO' : etiqueta
    }

    if (precioMax) {
      const price = parseInt(precioMax)
      const matchedPrice = priceRanges.find(p => p.value === price)
      if (matchedPrice) newFilters.maxPrice = matchedPrice.label
      else if (!isNaN(price)) newRange.maxPrice = price
    }

    if (precioMin) {
      const price = parseInt(precioMin)
      if (!isNaN(price) && price > 0) newRange.minPrice = price
    }

    if (kmMax) {
      const km = parseInt(kmMax)
      const matchedKm = kmRanges.find(k => k.value === km)
      if (matchedKm) newFilters.maxKm = matchedKm.label
    }

    if (anoMin) {
      const y = parseInt(anoMin)
      if (!isNaN(y)) newRange.minYear = y
    }

    if (anoMax) {
      const y = parseInt(anoMax)
      if (!isNaN(y)) newRange.maxYear = y
    }

    setFilters(newFilters)
    setUrlRange(newRange)
  }, [searchParams, brands, fuelTypes])

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles]

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(v =>
        v.title.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q)
      )
    }

    if (filters.brand !== 'Todas') {
      result = result.filter(v => v.brand === filters.brand)
    }
    if (filters.model !== 'Todos') {
      result = result.filter(v => extractBaseModel(v.model) === filters.model)
    }
    if (filters.fuel !== 'Todos') {
      result = result.filter(v => v.fuel === filters.fuel)
    }
    if (filters.bodyType !== 'todas') {
      if (filters.bodyType === 'turismo') {
        result = result.filter(v => TURISMO_TYPES.includes(v.bodyType))
      } else {
        result = result.filter(v => v.bodyType === filters.bodyType)
      }
    }
    if (filters.transmission !== 'Todas') {
      result = result.filter(v => v.transmission === filters.transmission)
    }
    if (filters.label !== 'Todas') {
      result = result.filter(v => v.label === filters.label)
    }
    if (filters.maxPrice !== 'Sin límite') {
      const maxPrice = parseInt(filters.maxPrice.replace(/[^0-9]/g, ''))
      result = result.filter(v => v.price <= maxPrice)
    }
    if (filters.maxKm !== 'Sin límite') {
      const maxKm = parseInt(filters.maxKm.replace(/[^0-9]/g, ''))
      result = result.filter(v => v.km <= maxKm)
    }
    if (filters.minYear !== 'Sin límite') {
      const minYear = parseInt(filters.minYear)
      result = result.filter(v => v.year >= minYear)
    }
    if (urlRange.minPrice) result = result.filter(v => v.price >= urlRange.minPrice!)
    if (urlRange.maxPrice) result = result.filter(v => v.price <= urlRange.maxPrice!)
    if (urlRange.minYear) result = result.filter(v => v.year >= urlRange.minYear!)
    if (urlRange.maxYear) result = result.filter(v => v.year <= urlRange.maxYear!)

    switch (sortBy) {
      case 'precio-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'precio-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'km-asc':
        result.sort((a, b) => a.km - b.km)
        break
      case 'año-desc':
        result.sort((a, b) => b.year - a.year)
        break
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.price - b.price
        })
    }

    return result
  }, [vehicles, filters, sortBy, searchQuery, urlRange])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(VEHICLES_PER_PAGE)
  }, [filters, sortBy, searchQuery])

  const visibleVehicles = filteredVehicles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVehicles.length

  const resetFilters = () => {
    setSearchQuery('')
    setUrlRange({})
    setFilters({
      brand: 'Todas',
      model: 'Todos',
      fuel: 'Todos',
      bodyType: 'todas',
      transmission: 'Todas',
      label: 'Todas',
      maxPrice: 'Sin límite',
      maxKm: 'Sin límite',
      minYear: 'Sin límite',
    })
  }

  // Shared filter dropdowns (used in both desktop and mobile)
  const FilterDropdown = ({ label, value, onChange, options, className }: {
    label: string
    value: string
    onChange: (val: string) => void
    options: string[] | { id: string; name: string }[]
    className?: string
  }) => (
    <div className={className}>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl bg-secondary-50 px-4 py-3 pr-9 text-sm font-medium text-secondary-800 ring-1 ring-transparent transition-all duration-200 hover:bg-secondary-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/60"
        >
          {options.map((opt) => {
            const id = typeof opt === 'string' ? opt : opt.id
            const name = typeof opt === 'string' ? opt : opt.name
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
      </div>
    </div>
  )

  const labelDisplayName = (l: string) => l === '0' ? '0 Emisiones' : l

  const renderFilters = () => (
    <>
      <FilterDropdown
        label="Carrocería"
        value={filters.bodyType}
        onChange={(val) => setFilters({ ...filters, bodyType: val })}
        options={bodyTypes}
        className="mb-6"
      />

      <FilterDropdown
        label="Marca"
        value={filters.brand}
        onChange={handleBrandChange}
        options={brands}
        className="mb-6"
      />

      <FilterDropdown
        label="Modelo"
        value={filters.model}
        onChange={(val) => setFilters({ ...filters, model: val })}
        options={models}
        className="mb-6"
      />

      <FilterDropdown
        label="Combustible"
        value={filters.fuel}
        onChange={(val) => setFilters({ ...filters, fuel: val })}
        options={fuelTypes}
        className="mb-6"
      />

      <FilterDropdown
        label="Transmisión"
        value={filters.transmission}
        onChange={(val) => setFilters({ ...filters, transmission: val })}
        options={transmissionOptions}
        className="mb-6"
      />

      <div className="mb-6">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-secondary-400">Etiqueta DGT</label>
        <div className="relative">
          <select
            value={filters.label}
            onChange={(e) => setFilters({ ...filters, label: e.target.value })}
            className="w-full cursor-pointer appearance-none rounded-xl bg-secondary-50 px-4 py-3 pr-9 text-sm font-medium text-secondary-800 ring-1 ring-transparent transition-all duration-200 hover:bg-secondary-100/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/60"
          >
            {labels.map((l) => (
              <option key={l} value={l}>{labelDisplayName(l)}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        </div>
      </div>

      <FilterDropdown
        label="Precio máximo"
        value={filters.maxPrice}
        onChange={(val) => setFilters({ ...filters, maxPrice: val })}
        options={priceRanges.map(p => p.label)}
        className="mb-6"
      />

      <FilterDropdown
        label="Kilómetros máx."
        value={filters.maxKm}
        onChange={(val) => setFilters({ ...filters, maxKm: val })}
        options={kmRanges.map(k => k.label)}
        className="mb-6"
      />

      <FilterDropdown
        label="Año desde"
        value={filters.minYear}
        onChange={(val) => setFilters({ ...filters, minYear: val })}
        options={yearRanges}
        className="mb-6"
      />
    </>
  )

  if (isLoading) {
    return (
      <div className="container-custom py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-secondary-100 p-6">
              <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <div key={i} className="h-12 bg-secondary-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <div className="h-8 bg-secondary-100 rounded w-48 mb-6 animate-pulse" />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-secondary-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-secondary-200 rounded w-3/4" />
                    <div className="h-7 bg-secondary-200 rounded w-1/2" />
                    <div className="h-4 bg-secondary-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-6 md:py-8 px-4 md:px-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="sticky top-24 rounded-[22px] bg-white p-6 shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.06]">
            <div className="mb-6 flex items-center gap-2.5">
              <span className="h-px w-6 bg-primary-600" />
              <h2 className="text-[11px] font-medium uppercase tracking-[0.35em] text-secondary-500">Filtros</h2>
            </div>
            {renderFilters()}
            <button
              onClick={resetFilters}
              className="w-full rounded-full border border-secondary-200 py-2.5 text-[13px] font-medium text-secondary-600 transition-colors hover:border-primary-300 hover:text-primary-600"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Filtros rápidos: un tap, stock real */}
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {([
              { key: 'todos', name: 'Todos', count: quickCounts.todos, active: filters.bodyType === 'todas' && filters.transmission === 'Todas' && filters.label === 'Todas' },
              { key: 'turismo', name: 'Turismos', count: quickCounts.turismo, active: filters.bodyType === 'turismo' },
              { key: 'furgoneta', name: 'Furgonetas', count: quickCounts.furgoneta, active: filters.bodyType === 'furgoneta' },
              { key: 'industrial', name: 'Industriales', count: quickCounts.industrial, active: filters.bodyType === 'industrial' },
              { key: 'monovolumen', name: '7 plazas', count: quickCounts.monovolumen, active: filters.bodyType === 'monovolumen' },
              { key: 'auto', name: 'Automáticos', count: quickCounts.auto, active: filters.transmission === 'Automático' },
              { key: 'eco', name: 'Etiqueta ECO', count: quickCounts.eco, active: filters.label === 'ECO' },
            ]).map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => {
                  if (chip.key === 'todos') setFilters({ ...filters, bodyType: 'todas', transmission: 'Todas', label: 'Todas' })
                  else if (chip.key === 'auto') setFilters({ ...filters, transmission: chip.active ? 'Todas' : 'Automático' })
                  else if (chip.key === 'eco') setFilters({ ...filters, label: chip.active ? 'Todas' : 'ECO' })
                  else setFilters({ ...filters, bodyType: chip.active ? 'todas' : chip.key })
                }}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200',
                  chip.active
                    ? 'bg-secondary-950 text-white shadow-sm'
                    : 'bg-white text-secondary-600 ring-1 ring-secondary-900/[0.08] hover:text-secondary-950 hover:ring-secondary-900/20'
                )}
              >
                {chip.name}
                <span className={cn('text-[11.5px] font-light', chip.active ? 'text-white/60' : 'text-secondary-400')}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vehículo por nombre, marca o modelo..."
              className="w-full rounded-full bg-white py-3.5 pl-12 pr-10 text-[15px] text-secondary-900 shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.08] placeholder:font-light placeholder:text-secondary-400 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-secondary-400 hover:text-secondary-600" />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-[15px] font-light text-secondary-500">
              <span className="font-display text-lg font-bold text-secondary-950">{filteredVehicles.length}</span> vehículos encontrados
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 rounded-full bg-secondary-950 px-4 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-secondary-800 lg:hidden"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cursor-pointer appearance-none rounded-full bg-white py-2.5 pl-4 pr-9 text-[13px] font-medium text-secondary-700 shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.08] transition-all hover:ring-secondary-900/[0.15] focus:outline-none focus:ring-2 focus:ring-primary-500/60">
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="km-asc">Kilómetros: menor a mayor</option>
                  <option value="año-desc">Más recientes</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
              </div>

              <div className="hidden items-center gap-1 rounded-full bg-white p-1 shadow-[0_1px_3px_rgba(2,6,23,0.06)] ring-1 ring-secondary-900/[0.08] md:flex">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Vista en cuadrícula"
                  className={cn('rounded-full p-2 transition-colors', viewMode === 'grid' ? 'bg-secondary-950 text-white' : 'text-secondary-500 hover:text-secondary-900')}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="Vista en lista"
                  className={cn('rounded-full p-2 transition-colors', viewMode === 'list' ? 'bg-secondary-950 text-white' : 'text-secondary-500 hover:text-secondary-900')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className={cn('grid gap-5', viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
            {visibleVehicles.map((vehicle, i) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} eager={i < 6} />
            ))}
          </div>

          {/* Load More / Counter */}
          {filteredVehicles.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-sm text-secondary-500 mb-4">
                Mostrando {Math.min(visibleCount, filteredVehicles.length)} de {filteredVehicles.length} vehículos
              </p>
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + VEHICLES_PER_PAGE)}
                  className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-3.5 text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-primary-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_0_0_6px_rgba(220,38,38,0.14)] active:scale-[0.98]"
                >
                  Ver más vehículos
                </button>
              )}
            </div>
          )}

          {/* No results */}
          {filteredVehicles.length === 0 && (
            <div className="py-20 text-center">
              <p className="mb-2 font-display text-2xl font-bold text-secondary-900">Sin resultados</p>
              <p className="mb-6 font-light text-secondary-500">Prueba a ajustar o limpiar los filtros.</p>
              <button
                onClick={resetFilters}
                className="inline-flex items-center justify-center rounded-full bg-secondary-950 px-7 py-3 text-[14px] font-medium text-white transition-colors hover:bg-primary-600"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-secondary-100 px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-6 bg-primary-600" />
                <h2 className="text-[11px] font-medium uppercase tracking-[0.35em] text-secondary-500">Filtros</h2>
              </div>
              <button onClick={() => setShowFilters(false)} aria-label="Cerrar filtros" className="rounded-full p-1.5 text-secondary-500 transition-colors hover:bg-secondary-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-y-auto p-5">
              {renderFilters()}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full rounded-full bg-primary-600 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary-500"
              >
                Ver {filteredVehicles.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
