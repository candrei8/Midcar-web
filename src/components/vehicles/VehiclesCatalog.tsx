'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Fuel, Gauge, Calendar, Zap, SlidersHorizontal, X, ChevronDown, Grid, List } from 'lucide-react'
import { formatPrice, formatKilometers, cn } from '@/lib/utils'
import { vehicles, getBrands, getFuelTypes, getBodyTypes, type Vehicle } from '@/data/vehicles'

const brands = ['Todas', ...getBrands()]
const fuelTypes = ['Todos', ...getFuelTypes()]
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
const yearRanges = ['Sin límite', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']

export function VehiclesCatalog() {
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    brand: 'Todas',
    fuel: 'Todos',
    bodyType: 'todas',
    maxPrice: 'Sin límite',
    maxKm: 'Sin límite',
    minYear: 'Sin límite',
  })
  const [sortBy, setSortBy] = useState('relevancia')

  // Parse URL params on mount
  useEffect(() => {
    const marca = searchParams.get('marca')
    const carroceria = searchParams.get('carroceria')
    const precioMax = searchParams.get('precio_max')
    const kmMax = searchParams.get('km_max')

    const newFilters = { ...filters }

    if (marca) {
      // Find matching brand (case-insensitive)
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
  }, [searchParams])

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    // Start with only on-sale vehicles
    let result = vehicles.filter(v => v.onSale)

    // Filter by brand
    if (filters.brand !== 'Todas') {
      result = result.filter(v => v.brand === filters.brand)
    }

    // Filter by fuel
    if (filters.fuel !== 'Todos') {
      result = result.filter(v => v.fuel === filters.fuel)
    }

    // Filter by body type
    if (filters.bodyType !== 'todas') {
      result = result.filter(v => v.bodyType === filters.bodyType)
    }

    // Filter by max price
    if (filters.maxPrice !== 'Sin límite') {
      const maxPrice = parseInt(filters.maxPrice.replace(/[^0-9]/g, ''))
      result = result.filter(v => v.price <= maxPrice)
    }

    // Filter by max km
    if (filters.maxKm !== 'Sin límite') {
      const maxKm = parseInt(filters.maxKm.replace(/[^0-9]/g, ''))
      result = result.filter(v => v.km <= maxKm)
    }

    // Filter by min year
    if (filters.minYear !== 'Sin límite') {
      const minYear = parseInt(filters.minYear)
      result = result.filter(v => v.year >= minYear)
    }

    // Sort
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
        // relevancia - featured first, then by price
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return a.price - b.price
        })
    }

    return result
  }, [filters, sortBy])

  const resetFilters = () => {
    setFilters({
      brand: 'Todas',
      fuel: 'Todos',
      bodyType: 'todas',
      maxPrice: 'Sin límite',
      maxKm: 'Sin límite',
      minYear: 'Sin límite',
    })
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-secondary-100 p-6 sticky top-24">
            <h2 className="font-bold text-lg text-secondary-900 mb-6">Filtros</h2>

            {/* Body Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Carrocería
              </label>
              <div className="relative">
                <select
                  value={filters.bodyType}
                  onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                  className="select-modern pr-10"
                >
                  {bodyTypes.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Marca
              </label>
              <div className="relative">
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="select-modern pr-10"
                >
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* Fuel */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Combustible
              </label>
              <div className="relative">
                <select
                  value={filters.fuel}
                  onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                  className="select-modern pr-10"
                >
                  {fuelTypes.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Precio máximo
              </label>
              <div className="relative">
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="select-modern pr-10"
                >
                  {priceRanges.map((p) => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* KM */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Kilómetros máx.
              </label>
              <div className="relative">
                <select
                  value={filters.maxKm}
                  onChange={(e) => setFilters({ ...filters, maxKm: e.target.value })}
                  className="select-modern pr-10"
                >
                  {kmRanges.map((k) => (
                    <option key={k.label} value={k.label}>{k.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* Year */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Año desde
              </label>
              <div className="relative">
                <select
                  value={filters.minYear}
                  onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                  className="select-modern pr-10"
                >
                  {yearRanges.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={resetFilters}
              className="w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-secondary-600">
              <span className="font-semibold text-secondary-900">{filteredVehicles.length}</span> vehículos encontrados
            </p>

            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden btn-ghost"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="select-modern py-2 pr-10 text-sm"
                >
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="km-asc">Kilómetros: menor a mayor</option>
                  <option value="año-desc">Más recientes</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="hidden md:flex items-center border border-secondary-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  )}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-secondary-600 hover:bg-secondary-50'
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
          )}>
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
            ))}
          </div>

          {/* No results */}
          {filteredVehicles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-secondary-500 mb-4">No se encontraron vehículos</p>
              <button
                onClick={resetFilters}
                className="btn-primary"
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
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100">
              <h2 className="font-bold text-lg">Filtros</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100%-60px)]">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Carrocería</label>
                <select
                  value={filters.bodyType}
                  onChange={(e) => setFilters({ ...filters, bodyType: e.target.value })}
                  className="select-modern"
                >
                  {bodyTypes.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Marca</label>
                <select
                  value={filters.brand}
                  onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
                  className="select-modern"
                >
                  {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Combustible</label>
                <select
                  value={filters.fuel}
                  onChange={(e) => setFilters({ ...filters, fuel: e.target.value })}
                  className="select-modern"
                >
                  {fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Precio máximo</label>
                <select
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="select-modern"
                >
                  {priceRanges.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Kilómetros máx.</label>
                <select
                  value={filters.maxKm}
                  onChange={(e) => setFilters({ ...filters, maxKm: e.target.value })}
                  className="select-modern"
                >
                  {kmRanges.map((k) => <option key={k.label} value={k.label}>{k.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">Año desde</label>
                <select
                  value={filters.minYear}
                  onChange={(e) => setFilters({ ...filters, minYear: e.target.value })}
                  className="select-modern"
                >
                  {yearRanges.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary w-full justify-center"
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

function VehicleCard({ vehicle, viewMode }: { vehicle: Vehicle, viewMode: 'grid' | 'list' }) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const monthlyPayment = vehicle.monthlyPayment || Math.round(vehicle.price / 60)

  // Reset error state when vehicle changes
  useEffect(() => {
    setImageError(false)
    setImageLoaded(false)
  }, [vehicle.id])

  // Check if image is already loaded from cache
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
      setImageLoaded(true)
    }
  }, [vehicle.id])

  const labelColors: Record<string, string> = {
    'ECO': 'bg-green-500',
    'C': 'bg-emerald-500',
    'B': 'bg-yellow-500',
    '0': 'bg-blue-500',
  }

  const imageUrl = vehicle.images[0] || `https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80`

  if (viewMode === 'list') {
    return (
      <article className="bg-white rounded-2xl border border-secondary-100 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative w-full md:w-72 flex-shrink-0 aspect-[4/3] md:aspect-auto bg-secondary-100">
            {/* Fallback placeholder - always rendered behind the image */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-200 to-secondary-300">
              <span className="text-5xl opacity-50">🚗</span>
            </div>
            {!imageError && (
              <img
                src={imageUrl}
                alt={vehicle.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onError={() => setImageError(true)}
                onLoad={() => setImageLoaded(true)}
              />
            )}
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

          {/* Content */}
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
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary-100 overflow-hidden">
        {/* Fallback placeholder - always rendered behind the image */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-secondary-200 to-secondary-300">
          <span className="text-6xl opacity-50">🚗</span>
        </div>
        {!imageError && (
          <img
            ref={imgRef}
            src={imageUrl}
            alt={vehicle.title}
            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
        )}
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
        <button className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-5 h-5 text-secondary-600 hover:text-primary-500" />
        </button>
      </div>

      {/* Content */}
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
