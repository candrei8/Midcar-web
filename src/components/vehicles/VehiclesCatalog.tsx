'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Fuel, Gauge, Calendar, Zap, SlidersHorizontal, X, ChevronDown, Grid, List, Search } from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { getVehiclesOnSale, getBrands, getFuelTypes, getModels, getLabels, extractBaseModel, type Vehicle } from '@/lib/vehicles-service'

const VEHICLES_PER_PAGE = 24

const bodyTypes = [
  { id: 'todas', name: 'Todas' },
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

export function VehiclesCatalog() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(VEHICLES_PER_PAGE)

  // Dynamic data
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [brands, setBrands] = useState<string[]>(['Todas'])
  const [fuelTypes, setFuelTypes] = useState<string[]>(['Todos'])
  const [models, setModels] = useState<string[]>(['Todos'])
  const [labels, setLabels] = useState<string[]>(['Todas'])

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

  // Load data on mount
  useEffect(() => {
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
  }, [])

  // Load models when brand changes
  useEffect(() => {
    async function loadModels() {
      const brand = filters.brand !== 'Todas' ? filters.brand : undefined
      const modelsData = await getModels(brand)
      setModels(['Todos', ...modelsData])
    }
    loadModels()
  }, [filters.brand])

  // Reset model when brand changes
  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({ ...prev, brand, model: 'Todos' }))
  }

  // Parse URL params on mount
  useEffect(() => {
    const marca = searchParams.get('marca')
    const carroceria = searchParams.get('carroceria')
    const precioMax = searchParams.get('precio_max')
    const kmMax = searchParams.get('km_max')

    const newFilters = { ...filters }

    if (marca) {
      const matchedBrand = brands.find(b =>
        b.toLowerCase().replace(/\s+/g, '-') === marca.toLowerCase() ||
        b.toLowerCase() === marca.toLowerCase()
      )
      if (matchedBrand) newFilters.brand = matchedBrand
    }

    if (carroceria) {
      const matchedBody = bodyTypes.find(b => b.id === carroceria.toLowerCase())
      if (matchedBody) newFilters.bodyType = matchedBody.id
    }

    if (precioMax) {
      const price = parseInt(precioMax)
      const matchedPrice = priceRanges.find(p => p.value === price)
      if (matchedPrice) newFilters.maxPrice = matchedPrice.label
    }

    if (kmMax) {
      const km = parseInt(kmMax)
      const matchedKm = kmRanges.find(k => k.value === km)
      if (matchedKm) newFilters.maxKm = matchedKm.label
    }

    setFilters(newFilters)
  }, [searchParams, brands])

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
      result = result.filter(v => v.bodyType === filters.bodyType)
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
  }, [vehicles, filters, sortBy, searchQuery])

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(VEHICLES_PER_PAGE)
  }, [filters, sortBy, searchQuery])

  const visibleVehicles = filteredVehicles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredVehicles.length

  const resetFilters = () => {
    setSearchQuery('')
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
      <label className="block text-sm font-medium text-secondary-700 mb-2">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="select-modern pr-10"
        >
          {options.map((opt) => {
            const id = typeof opt === 'string' ? opt : opt.id
            const name = typeof opt === 'string' ? opt : opt.name
            return <option key={id} value={id}>{name}</option>
          })}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
      </div>
    </div>
  )

  const labelDisplayName = (l: string) => l === '0' ? '0 Emisiones' : l

  const renderFilters = () => (
    <>
      <div className="mb-6">
        <label className="block text-sm font-medium text-secondary-700 mb-2">Buscar</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre..."
            className="select-modern pl-10 pr-3"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-secondary-400 hover:text-secondary-600" />
            </button>
          )}
        </div>
      </div>

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
        <label className="block text-sm font-medium text-secondary-700 mb-2">Etiqueta DGT</label>
        <div className="relative">
          <select
            value={filters.label}
            onChange={(e) => setFilters({ ...filters, label: e.target.value })}
            className="select-modern pr-10"
          >
            {labels.map((l) => (
              <option key={l} value={l}>{labelDisplayName(l)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
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
          <div className="bg-white rounded-2xl border border-secondary-100 p-6 sticky top-24">
            <h2 className="font-bold text-lg text-secondary-900 mb-6">Filtros</h2>
            {renderFilters()}
            <button onClick={resetFilters} className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar vehículo por nombre, marca o modelo..."
              className="w-full pl-12 pr-10 py-3 rounded-xl border border-secondary-200 bg-white text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-5 h-5 text-secondary-400 hover:text-secondary-600" />
              </button>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-secondary-600">
              <span className="font-semibold text-secondary-900">{filteredVehicles.length}</span> vehículos encontrados
            </p>

            <div className="flex items-center gap-4">
              <button onClick={() => setShowFilters(true)} className="lg:hidden btn-ghost">
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>

              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select-modern py-2 pr-10 text-sm">
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="km-asc">Kilómetros: menor a mayor</option>
                  <option value="año-desc">Más recientes</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
              </div>

              <div className="hidden md:flex items-center border border-secondary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-2 transition-colors', viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50')}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-2 transition-colors', viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50')}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className={cn('grid gap-6', viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
            {visibleVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
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
                  className="btn-primary"
                >
                  Ver más vehículos
                </button>
              )}
            </div>
          )}

          {/* No results */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-secondary-500 mb-4">No se encontraron vehículos</p>
              <button onClick={resetFilters} className="btn-primary">
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
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100">
              <h2 className="font-bold text-lg">Filtros</h2>
              <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
              {renderFilters()}
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full justify-center">
                Ver {filteredVehicles.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const MAX_IMAGE_RETRIES = 3

function VehicleCard({ vehicle, viewMode }: { vehicle: Vehicle, viewMode: 'grid' | 'list' }) {
  const [imgError, setImgError] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)
  const images = vehicle.images || []
  const mainImage = images[imageIndex]

  const labelColors: Record<string, string> = {
    'ECO': 'bg-green-500',
    'C': 'bg-emerald-500',
    'B': 'bg-yellow-500',
    '0': 'bg-blue-500',
  }

  const ImageContent = () => {
    if (mainImage && !imgError) {
      return (
        <Image
          src={mainImage}
          alt={vehicle.title}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => {
            if (imageIndex < images.length - 1 && imageIndex < MAX_IMAGE_RETRIES - 1) {
              setImageIndex((prev) => prev + 1)
              return
            }
            setImgError(true)
          }}
        />
      )
    }
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Fuel className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-secondary-500">{vehicle.brand}</p>
        </div>
      </div>
    )
  }

  if (viewMode === 'list') {
    return (
      <article className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-72 flex-shrink-0 aspect-[4/3] md:aspect-auto bg-gradient-to-br from-secondary-100 to-secondary-200 overflow-hidden min-h-[150px]">
            <ImageContent />
            {vehicle.featured && (
              <span className="absolute top-3 left-3 badge-primary text-xs">DESTACADO</span>
            )}
            {vehicle.label && (
              <span className={cn(
                'absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-bold',
                labelColors[vehicle.label] || 'bg-gray-500'
              )}>
                {vehicle.label}
              </span>
            )}
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-xl text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {vehicle.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
                  <span className="flex items-center gap-1"><Gauge className="w-4 h-4" />{formatKilometers(vehicle.km)}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{vehicle.year}</span>
                  <span className="flex items-center gap-1"><Fuel className="w-4 h-4" />{vehicle.fuel}</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4" />{vehicle.cv}cv</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(vehicle.price)}</span>
                  {vehicle.originalPrice && (
                    <span className="text-sm text-secondary-400 line-through">{formatPrice(vehicle.originalPrice)}</span>
                  )}
                </div>
                <p className="text-sm text-secondary-500">Desde {monthlyPayment}€/mes</p>
              </div>
            </div>
          </div>
        </div>
        <Link href={`/vehiculos/${vehicle.slug}`} className="absolute inset-0" prefetch={false}>
          <span className="sr-only">Ver {vehicle.title}</span>
        </Link>
      </article>
    )
  }

  return (
    <article className="card-vehicle group relative">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-secondary-100 to-secondary-200 overflow-hidden">
        <ImageContent />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {vehicle.featured && <span className="badge-primary text-xs">DESTACADO</span>}
          {vehicle.ivaDeducible && <span className="badge bg-blue-100 text-blue-700 text-xs">IVA DEDUCIBLE</span>}
        </div>
        {vehicle.label && (
          <span className={cn(
            'absolute top-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-xs font-bold shadow-lg',
            labelColors[vehicle.label] || 'bg-gray-500'
          )}>
            {vehicle.label}
          </span>
        )}
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {images.length} fotos
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {vehicle.title}
        </h3>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold text-primary-600">{formatPrice(vehicle.price)}</span>
          {vehicle.originalPrice && (
            <span className="text-sm text-secondary-400 line-through">{formatPrice(vehicle.originalPrice)}</span>
          )}
        </div>
        <p className="text-sm text-secondary-500 mb-4">Desde <span className="font-semibold text-secondary-700">{monthlyPayment}€/mes</span></p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-secondary-600"><Gauge className="w-4 h-4" /><span>{formatKilometers(vehicle.km)}</span></div>
          <div className="flex items-center gap-2 text-secondary-600"><Calendar className="w-4 h-4" /><span>{vehicle.year}</span></div>
          <div className="flex items-center gap-2 text-secondary-600"><Fuel className="w-4 h-4" /><span>{vehicle.fuel}</span></div>
          <div className="flex items-center gap-2 text-secondary-600"><Zap className="w-4 h-4" /><span>{vehicle.cv}cv</span></div>
        </div>
      </div>
      <Link href={`/vehiculos/${vehicle.slug}`} className="absolute inset-0" prefetch={false}>
        <span className="sr-only">Ver {vehicle.title}</span>
      </Link>
    </article>
  )
}
