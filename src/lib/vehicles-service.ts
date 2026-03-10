/**
 * Vehicles Service - Uses static data from MongoDB export
 * Falls back to Supabase when configured, otherwise uses local data
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase-lazy'
import { vehicles as staticVehicles, type Vehicle as StaticVehicle } from '@/data/vehicles'
import { getAllVehicleImages } from '@/data/vehicleImages'

// Re-export the Vehicle type from data
export type Vehicle = StaticVehicle

const staticVehiclesById = new Map(staticVehicles.map((vehicle) => [vehicle.id, vehicle]))

// Pre-built slug index for O(1) lookups (instead of O(n) array.find)
const staticVehiclesBySlug = new Map(staticVehicles.map((vehicle) => [vehicle.slug, vehicle]))

// Cached filtered results (computed once, reused)
let _cachedOnSale: Vehicle[] | null = null
let _cachedBrands: string[] | null = null
let _cachedFuelTypes: string[] | null = null

// Database vehicle format (Supabase)
interface DBVehicle {
  id: string
  stock_id?: string
  marca: string
  modelo: string
  version: string
  año_matriculacion: number
  potencia_cv: number
  combustible: string
  transmision: string
  tipo_carroceria: string
  etiqueta_dgt: string | null
  kilometraje: number
  estado: string
  destacado: boolean
  precio_venta: number
  descuento: number
  imagen_principal: string
  en_oferta: boolean
  descripcion?: string
}

// Transform database vehicle to web format
function transformToWebFormat(dbVehicle: DBVehicle): Vehicle {
  // Try to find static vehicle by UUID id first, then by stock_id (MongoDB id)
  const staticVehicle = staticVehiclesById.get(dbVehicle.id)
    || (dbVehicle.stock_id ? staticVehiclesById.get(dbVehicle.stock_id) : undefined)
  const staticImages = staticVehicle?.images || []
  // Also try to get images directly from vehicleImages data by stock_id
  const mongoImages = dbVehicle.stock_id ? getAllVehicleImages(dbVehicle.stock_id) : []
  const fuelMap: Record<string, string> = {
    'diesel': 'Diesel',
    'gasolina': 'Gasolina',
    'hibrido': 'Híbrido',
    'electrico': 'Eléctrico',
    'glp': 'Gas',
    'gnc': 'Gas',
  }

  const transmissionMap: Record<string, string> = {
    'manual': 'Manual',
    'automatico': 'Automático',
    'semiautomatico': 'Automático',
  }

  const slug = `${dbVehicle.marca}-${dbVehicle.modelo}-${dbVehicle.año_matriculacion}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  // Clean version string: remove embedded "Etiqueta X" patterns (they're shown as badges instead)
  const cleanVersion = dbVehicle.version
    ? dbVehicle.version
        .replace(/\bEtiqueta\s+(C|B|ECO|CERO|0)(\s+Emisiones)?\b/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim()
    : ''
  const title = `${dbVehicle.marca} ${dbVehicle.modelo}${cleanVersion ? ' ' + cleanVersion : ''}`

  const originalPrice = dbVehicle.descuento > 0
    ? dbVehicle.precio_venta + dbVehicle.descuento
    : undefined

  const monthlyPayment = Math.round(dbVehicle.precio_venta / 60)

  return {
    id: dbVehicle.id,
    slug,
    title,
    brand: dbVehicle.marca,
    model: dbVehicle.modelo,
    price: dbVehicle.precio_venta,
    originalPrice,
    km: dbVehicle.kilometraje,
    year: dbVehicle.año_matriculacion,
    cv: dbVehicle.potencia_cv,
    fuel: fuelMap[dbVehicle.combustible] || dbVehicle.combustible,
    transmission: transmissionMap[dbVehicle.transmision] || dbVehicle.transmision,
    bodyType: dbVehicle.tipo_carroceria,
    ivaDeducible: true,
    onSale: dbVehicle.estado === 'disponible',
    label: dbVehicle.etiqueta_dgt
      ? dbVehicle.etiqueta_dgt.replace(/^Etiqueta\s+/i, '').replace(/\s+Emisiones$/i, '').trim() || undefined
      : undefined,
    images: staticImages.length
      ? staticImages
      : mongoImages.length
        ? mongoImages
        : dbVehicle.imagen_principal
          ? [dbVehicle.imagen_principal]
          : [],
    featured: dbVehicle.destacado,
    monthlyPayment,
    description: dbVehicle.descripcion || staticVehicle?.description || undefined,
    color: staticVehicle?.color,
    seats: staticVehicle?.seats,
    doors: staticVehicle?.doors,
    features: staticVehicle?.features,
    extras: staticVehicle?.extras,
  }
}

// ---- Static data helpers ----

function getStaticOnSale(): Vehicle[] {
  if (!_cachedOnSale) {
    _cachedOnSale = staticVehicles.filter(v => v.onSale || v.status === 'disponible')
  }
  return _cachedOnSale
}

function getStaticFeatured(): Vehicle[] {
  return getStaticOnSale().filter(v => v.featured).slice(0, 8)
}

function getStaticBrands(): string[] {
  if (!_cachedBrands) {
    _cachedBrands = Array.from(new Set(getStaticOnSale().map(v => v.brand))).sort()
  }
  return _cachedBrands
}

function getStaticFuelTypes(): string[] {
  if (!_cachedFuelTypes) {
    _cachedFuelTypes = Array.from(new Set(getStaticOnSale().map(v => v.fuel))).sort()
  }
  return _cachedFuelTypes
}

// ---- Public API ----

// Get all vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return staticVehicles
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return staticVehicles
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles:', error)
    return staticVehicles
  }

  return (data || []).map(transformToWebFormat)
}

// Get vehicles on sale
export async function getVehiclesOnSale(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return getStaticOnSale()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return getStaticOnSale()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles on sale:', error)
    return getStaticOnSale()
  }

  return (data || []).map(transformToWebFormat)
}

// Get featured vehicles
export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return getStaticFeatured()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return getStaticFeatured()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')
    .eq('destacado', true)
    .limit(8)

  if (error) {
    console.error('Error fetching featured vehicles:', error)
    return getStaticFeatured()
  }

  return (data || []).map(transformToWebFormat)
}

// Get vehicle by ID
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    return staticVehicles.find(v => v.id === id) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return staticVehicles.find(v => v.id === id) || null
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching vehicle by ID:', error)
    return staticVehicles.find(v => v.id === id) || null
  }

  return data ? transformToWebFormat(data) : null
}

// Get vehicle by stock_id (original web ID)
export async function getVehicleByStockId(stockId: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    return staticVehicles.find(v => v.id === stockId) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return staticVehicles.find(v => v.id === stockId) || null
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('stock_id', stockId)
    .single()

  if (error) {
    console.error('Error fetching vehicle by stock_id:', error)
    return staticVehicles.find(v => v.id === stockId) || null
  }

  return data ? transformToWebFormat(data) : null
}

// Get vehicle by slug — O(1) lookup via pre-built index
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    // O(1) lookup via slug index instead of O(n) array.find
    return staticVehiclesBySlug.get(slug) || null
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (uuidRegex.test(slug)) {
    const byId = await getVehicleById(slug)
    if (byId) return byId
  }

  const vehicles = await getVehicles()
  return vehicles.find(v => v.slug === slug) || null
}

// Get unique brands
export async function getBrands(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return getStaticBrands()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return getStaticBrands()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('marca')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching brands:', error)
    return getStaticBrands()
  }

  const brands = Array.from(new Set((data || []).map(v => v.marca)))
  return brands.sort()
}

// Get unique fuel types
export async function getFuelTypes(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return getStaticFuelTypes()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return getStaticFuelTypes()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('combustible')
    .eq('estado', 'disponible')

  if (error) {
    return getStaticFuelTypes()
  }

  const fuelMap: Record<string, string> = {
    'diesel': 'Diesel',
    'gasolina': 'Gasolina',
    'hibrido': 'Híbrido',
    'electrico': 'Eléctrico',
    'glp': 'Gas',
    'gnc': 'Gas',
  }

  const fuels = Array.from(new Set((data || []).map(v => fuelMap[v.combustible] || v.combustible)))
  return fuels.sort()
}

// Get unique body types
export async function getBodyTypes(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    const types = Array.from(new Set(getStaticOnSale().map(v => v.bodyType)))
    return types.sort()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const types = Array.from(new Set(getStaticOnSale().map(v => v.bodyType)))
    return types.sort()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('tipo_carroceria')
    .eq('estado', 'disponible')

  if (error) {
    const types = Array.from(new Set(getStaticOnSale().map(v => v.bodyType)))
    return types.sort()
  }

  const types = Array.from(new Set((data || []).map(v => v.tipo_carroceria)))
  return types.sort()
}

// Search vehicles with filters
export async function searchVehicles(filters: {
  brand?: string
  bodyType?: string
  maxPrice?: number
  minPrice?: number
  maxKm?: number
  fuel?: string
  transmission?: string
  minYear?: number
  maxYear?: number
}): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    let result = getStaticOnSale()
    if (filters.brand) result = result.filter(v => v.brand.toLowerCase() === filters.brand!.toLowerCase())
    if (filters.bodyType) result = result.filter(v => v.bodyType === filters.bodyType!.toLowerCase())
    if (filters.maxPrice) result = result.filter(v => v.price <= filters.maxPrice!)
    if (filters.minPrice) result = result.filter(v => v.price >= filters.minPrice!)
    if (filters.maxKm) result = result.filter(v => v.km <= filters.maxKm!)
    if (filters.fuel) result = result.filter(v => v.fuel === filters.fuel)
    if (filters.transmission) result = result.filter(v => v.transmission === filters.transmission)
    if (filters.minYear) result = result.filter(v => v.year >= filters.minYear!)
    if (filters.maxYear) result = result.filter(v => v.year <= filters.maxYear!)
    return result
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return []
  }

  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')

  if (filters.brand) query = query.ilike('marca', filters.brand)
  if (filters.bodyType) query = query.eq('tipo_carroceria', filters.bodyType.toLowerCase())
  if (filters.maxPrice) query = query.lte('precio_venta', filters.maxPrice)
  if (filters.minPrice) query = query.gte('precio_venta', filters.minPrice)
  if (filters.maxKm) query = query.lte('kilometraje', filters.maxKm)

  if (filters.fuel) {
    const fuelMap: Record<string, string> = {
      'Diesel': 'diesel', 'Gasolina': 'gasolina', 'Híbrido': 'hibrido',
      'Eléctrico': 'electrico', 'Gas': 'glp',
    }
    query = query.eq('combustible', fuelMap[filters.fuel] || filters.fuel.toLowerCase())
  }

  if (filters.transmission) {
    const transMap: Record<string, string> = { 'Manual': 'manual', 'Automático': 'automatico' }
    query = query.eq('transmision', transMap[filters.transmission] || filters.transmission.toLowerCase())
  }

  if (filters.minYear) query = query.gte('año_matriculacion', filters.minYear)
  if (filters.maxYear) query = query.lte('año_matriculacion', filters.maxYear)

  query = query.order('destacado', { ascending: false }).order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error searching vehicles:', error)
    return []
  }

  return (data || []).map(transformToWebFormat)
}

// Get price range
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  if (!isSupabaseConfigured) {
    const onSale = getStaticOnSale()
    if (onSale.length === 0) return { min: 0, max: 100000 }
    const prices = onSale.map(v => v.price)
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return { min: 0, max: 100000 }
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('precio_venta')
    .eq('estado', 'disponible')

  if (error || !data || data.length === 0) return { min: 0, max: 100000 }

  const prices = data.map(v => v.precio_venta)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

// Get year range
export async function getYearRange(): Promise<{ min: number; max: number }> {
  if (!isSupabaseConfigured) {
    const onSale = getStaticOnSale()
    if (onSale.length === 0) return { min: 2010, max: new Date().getFullYear() }
    const years = onSale.map(v => v.year)
    return { min: Math.min(...years), max: Math.max(...years) }
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return { min: 2010, max: new Date().getFullYear() }
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('año_matriculacion')
    .eq('estado', 'disponible')

  if (error || !data || data.length === 0) return { min: 2010, max: new Date().getFullYear() }

  const years = data.map(v => (v as any).año_matriculacion as number)
  return { min: Math.min(...years), max: Math.max(...years) }
}

// Get vehicle count
export async function getVehicleCount(): Promise<number> {
  if (!isSupabaseConfigured) {
    return getStaticOnSale().length
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return getStaticOnSale().length
  }

  const { count, error } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error getting vehicle count:', error)
    return getStaticOnSale().length
  }

  return count || 0
}

// Get similar vehicles
export async function getSimilarVehicles(vehicle: Vehicle, limit: number = 4): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    const onSale = getStaticOnSale().filter(v => v.id !== vehicle.id)
    const minPrice = Math.round(vehicle.price * 0.7)
    const maxPrice = Math.round(vehicle.price * 1.3)

    // Same body type, similar price
    let similar = onSale.filter(v =>
      v.bodyType === vehicle.bodyType &&
      v.price >= minPrice && v.price <= maxPrice
    )

    // Fill with same fuel type
    if (similar.length < limit) {
      const ids = new Set(similar.map(v => v.id))
      const byFuel = onSale.filter(v => v.fuel === vehicle.fuel && !ids.has(v.id))
      similar = [...similar, ...byFuel]
    }

    // Fill with any
    if (similar.length < limit) {
      const ids = new Set(similar.map(v => v.id))
      const any = onSale.filter(v => !ids.has(v.id))
      similar = [...similar, ...any]
    }

    return similar.slice(0, limit)
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return []
  }

  const minPrice = Math.round(vehicle.price * 0.7)
  const maxPrice = Math.round(vehicle.price * 1.3)

  let { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')
    .eq('tipo_carroceria', vehicle.bodyType.toLowerCase())
    .gte('precio_venta', minPrice)
    .lte('precio_venta', maxPrice)
    .neq('id', vehicle.id)
    .limit(limit)

  if (error) {
    console.error('Error fetching similar vehicles:', error)
    return []
  }

  if (!data || data.length < limit) {
    const fuelMap: Record<string, string> = {
      'Diesel': 'diesel', 'Gasolina': 'gasolina', 'Híbrido': 'hibrido',
      'Eléctrico': 'electrico', 'Gas': 'glp',
    }
    const existingIds = (data || []).map(v => v.id)
    const { data: fuelData, error: fuelError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('estado', 'disponible')
      .eq('combustible', fuelMap[vehicle.fuel] || vehicle.fuel.toLowerCase())
      .neq('id', vehicle.id)
      .not('id', 'in', `(${existingIds.join(',')})`)
      .limit(limit - (data?.length || 0))
    if (!fuelError && fuelData) data = [...(data || []), ...fuelData]
  }

  if (!data || data.length < limit) {
    const existingIds = (data || []).map(v => v.id)
    const { data: anyData, error: anyError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('estado', 'disponible')
      .neq('id', vehicle.id)
      .not('id', 'in', `(${existingIds.length > 0 ? existingIds.join(',') : "''"})`)
      .order('destacado', { ascending: false })
      .limit(limit - (data?.length || 0))
    if (!anyError && anyData) data = [...(data || []), ...anyData]
  }

  return (data || []).slice(0, limit).map(transformToWebFormat)
}
