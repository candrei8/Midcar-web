/**
 * Vehicles Service - Uses static data from MongoDB export
 * Falls back to Supabase when configured, otherwise uses local data
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase-lazy'
import type { Vehicle as StaticVehicle } from '@/data/vehicles'

// Re-export the Vehicle type from data
export type Vehicle = StaticVehicle

// ---- Lazy-loaded static data (avoids bundling ~5MB in client) ----

let _staticVehicles: Vehicle[] | null = null
let _staticVehiclesById: Map<string, Vehicle> | null = null
let _staticVehiclesBySlug: Map<string, Vehicle> | null = null
let _vehicleImagesModule: { getAllVehicleImages: (id: string) => string[] } | null = null

async function getStaticVehiclesData(): Promise<Vehicle[]> {
  if (!_staticVehicles) {
    const { vehicles } = await import('@/data/vehicles')
    _staticVehicles = vehicles
  }
  return _staticVehicles
}

async function getStaticVehiclesById(): Promise<Map<string, Vehicle>> {
  if (!_staticVehiclesById) {
    const vehicles = await getStaticVehiclesData()
    _staticVehiclesById = new Map(vehicles.map(v => [v.id, v]))
  }
  return _staticVehiclesById
}

async function getStaticVehiclesBySlug(): Promise<Map<string, Vehicle>> {
  if (!_staticVehiclesBySlug) {
    const vehicles = await getStaticVehiclesData()
    _staticVehiclesBySlug = new Map(vehicles.map(v => [v.slug, v]))
  }
  return _staticVehiclesBySlug
}

async function getVehicleImagesModule() {
  if (!_vehicleImagesModule) {
    _vehicleImagesModule = await import('@/data/vehicleImages')
  }
  return _vehicleImagesModule
}

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
  imagenes?: Array<{ url: string; orden: number; es_principal?: boolean }>
  en_oferta: boolean
  descripcion?: string
}

// Transform database vehicle to web format
async function transformToWebFormat(dbVehicle: DBVehicle): Promise<Vehicle> {
  const vehiclesById = await getStaticVehiclesById()
  const imagesModule = await getVehicleImagesModule()

  // Try to find static vehicle by UUID id first, then by stock_id (MongoDB id)
  // Strip 'STK-' prefix for static lookup (static data uses raw IDs)
  const stockIdRaw = dbVehicle.stock_id?.replace(/^STK-/, '')
  const staticVehicle = vehiclesById.get(dbVehicle.id)
    || (stockIdRaw ? vehiclesById.get(stockIdRaw) : undefined)
    || (dbVehicle.stock_id ? vehiclesById.get(dbVehicle.stock_id) : undefined)
  const staticImages = staticVehicle?.images || []
  // Extract image URLs from the dashboard's 'imagenes' JSONB array, sorted by orden
  const dbImages = (dbVehicle.imagenes || [])
    .sort((a, b) => a.orden - b.orden)
    .map(img => img.url)
    .filter(Boolean)
  // Also try to get images directly from vehicleImages data by stock_id
  // Strip 'STK-' prefix if present (Supabase uses 'STK-' prefix, vehicleImages uses raw ID)
  const rawStockId = dbVehicle.stock_id?.replace(/^STK-/, '') || ''
  const mongoImages = rawStockId ? imagesModule.getAllVehicleImages(rawStockId) : []
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
    images: dbImages.length
      ? dbImages
      : staticImages.length
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

async function getStaticOnSale(): Promise<Vehicle[]> {
  if (!_cachedOnSale) {
    const vehicles = await getStaticVehiclesData()
    _cachedOnSale = vehicles.filter(v => v.onSale || v.status === 'disponible')
  }
  return _cachedOnSale
}

async function getStaticFeatured(): Promise<Vehicle[]> {
  const onSale = await getStaticOnSale()
  return onSale.filter(v => v.featured).slice(0, 8)
}

async function getStaticBrands(): Promise<string[]> {
  if (!_cachedBrands) {
    const onSale = await getStaticOnSale()
    _cachedBrands = Array.from(new Set(onSale.map(v => v.brand))).sort()
  }
  return _cachedBrands
}

async function getStaticFuelTypes(): Promise<string[]> {
  if (!_cachedFuelTypes) {
    const onSale = await getStaticOnSale()
    _cachedFuelTypes = Array.from(new Set(onSale.map(v => v.fuel))).sort()
  }
  return _cachedFuelTypes
}

// ---- Model extraction ----

/**
 * Extracts the base model name from a full model string containing specs.
 * E.g. "Fiorino 1.3Mjet E6+ 80Cv IVA..." → "Fiorino"
 *      "Transit Connect Van 1.5EcoBlue..." → "Transit Connect"
 *      "208 1.5 BlueHDi Allure..." → "208"
 */
export function extractBaseModel(fullModel: string): string {
  const words = fullModel.trim().split(/\s+/)

  // Patterns indicating engine/tech specs (stop collecting model name)
  const enginePattern = /^(BlueHD[Ii]|EcoBlue|TDCi|TSI|GDI|DSG|EAT\d|S&S|BMT?|TGI|SCe|ePower|EcoTGI|Mjet|HDi|CDTi|dCi|TFSI|CRDi|MPI|GLP|GNC)/i
  // Non-model descriptor words (body types, trims, marketing)
  const stopPattern = /^(Van|Furgón|Furgon|Combi|Kombi|Premium|Allure|Active|Essential|Profesional|Professional|Etiqueta|IVA|Nacional|Garantía|Garantia|Trend|Xcellence|Style|Tecno|DCT|Confort|Pack|Larga|Corta|del|con|Incl|Incluido|Incluida|Stepway|Automático|Automatico|Unico|Único|Historial|pocos|e-Golf|e-208|e-2008)$/i

  const modelParts: string[] = []

  for (const word of words) {
    // Stop at engine displacement like "1.3Mjet", "1.5", "2.0EcoBlue"
    if (/^\d+\.\d+/.test(word)) break
    // Stop at CV pattern like "80Cv", "100Cv"
    if (/^\d+[Cc][Vv]/.test(word)) break
    // Stop at kW pattern
    if (/^\d+kW/.test(word)) break
    // Stop at engine/tech keywords
    if (enginePattern.test(word)) break
    // Stop at descriptor words
    if (stopPattern.test(word)) break

    modelParts.push(word)
  }

  return modelParts.join(' ').trim() || words[0]
}

// ---- Public API ----

// Get all vehicles
export async function getVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return await getStaticVehiclesData()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return await getStaticVehiclesData()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles:', error)
    return await getStaticVehiclesData()
  }

  return await Promise.all((data || []).map(transformToWebFormat))
}

// Get vehicles on sale
export async function getVehiclesOnSale(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return await getStaticOnSale()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return await getStaticOnSale()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')
    .order('destacado', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vehicles on sale:', error)
    return await getStaticOnSale()
  }

  return await Promise.all((data || []).map(transformToWebFormat))
}

// Get featured vehicles
export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    return await getStaticFeatured()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return await getStaticFeatured()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('estado', 'disponible')
    .eq('destacado', true)
    .limit(8)

  if (error) {
    console.error('Error fetching featured vehicles:', error)
    return await getStaticFeatured()
  }

  return await Promise.all((data || []).map(transformToWebFormat))
}

// Get vehicle by ID
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === id) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === id) || null
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching vehicle by ID:', error)
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === id) || null
  }

  return data ? await transformToWebFormat(data) : null
}

// Get vehicle by stock_id (original web ID)
export async function getVehicleByStockId(stockId: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === stockId) || null
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === stockId) || null
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('stock_id', stockId)
    .single()

  if (error) {
    console.error('Error fetching vehicle by stock_id:', error)
    const vehicles = await getStaticVehiclesData()
    return vehicles.find(v => v.id === stockId) || null
  }

  return data ? await transformToWebFormat(data) : null
}

// Get vehicle by slug — O(1) lookup via pre-built index
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured) {
    const slugMap = await getStaticVehiclesBySlug()
    return slugMap.get(slug) || null
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
    return await getStaticBrands()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return await getStaticBrands()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('marca')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching brands:', error)
    return await getStaticBrands()
  }

  const brands = Array.from(new Set((data || []).map(v => v.marca)))
  return brands.sort()
}

// Get unique models (optionally filtered by brand)
export async function getModels(brand?: string): Promise<string[]> {
  if (!isSupabaseConfigured) {
    const onSale = await getStaticOnSale()
    let filtered = onSale
    if (brand) filtered = filtered.filter(v => v.brand === brand)
    const models = Array.from(new Set(filtered.map(v => extractBaseModel(v.model))))
    return models.sort()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const onSale = await getStaticOnSale()
    let filtered = onSale
    if (brand) filtered = filtered.filter(v => v.brand === brand)
    const models = Array.from(new Set(filtered.map(v => extractBaseModel(v.model))))
    return models.sort()
  }

  let query = supabase
    .from('vehicles')
    .select('modelo')
    .eq('estado', 'disponible')

  if (brand) query = query.ilike('marca', brand)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching models:', error)
    const onSale = await getStaticOnSale()
    let filtered = onSale
    if (brand) filtered = filtered.filter(v => v.brand === brand)
    const models = Array.from(new Set(filtered.map(v => extractBaseModel(v.model))))
    return models.sort()
  }

  const models = Array.from(new Set((data || []).map(v => extractBaseModel(v.modelo))))
  return models.sort()
}

// Get unique DGT labels
export async function getLabels(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    const onSale = await getStaticOnSale()
    const labels = Array.from(new Set(onSale.map(v => v.label).filter(Boolean) as string[]))
    return labels.sort()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const onSale = await getStaticOnSale()
    const labels = Array.from(new Set(onSale.map(v => v.label).filter(Boolean) as string[]))
    return labels.sort()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('etiqueta_dgt')
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error fetching labels:', error)
    const onSale = await getStaticOnSale()
    const labels = Array.from(new Set(onSale.map(v => v.label).filter(Boolean) as string[]))
    return labels.sort()
  }

  const labels = Array.from(new Set(
    (data || [])
      .map(v => v.etiqueta_dgt)
      .filter(Boolean)
      .map((l: string) => l.replace(/^Etiqueta\s+/i, '').replace(/\s+Emisiones$/i, '').trim())
      .filter(Boolean)
  ))
  return labels.sort()
}

// Get unique transmission types
export async function getTransmissionTypes(): Promise<string[]> {
  return ['Manual', 'Automático']
}

// Get unique fuel types
export async function getFuelTypes(): Promise<string[]> {
  if (!isSupabaseConfigured) {
    return await getStaticFuelTypes()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    return await getStaticFuelTypes()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('combustible')
    .eq('estado', 'disponible')

  if (error) {
    return await getStaticFuelTypes()
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
    const onSale = await getStaticOnSale()
    const types = Array.from(new Set(onSale.map(v => v.bodyType)))
    return types.sort()
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const onSale = await getStaticOnSale()
    const types = Array.from(new Set(onSale.map(v => v.bodyType)))
    return types.sort()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('tipo_carroceria')
    .eq('estado', 'disponible')

  if (error) {
    const onSale = await getStaticOnSale()
    const types = Array.from(new Set(onSale.map(v => v.bodyType)))
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
    let result = await getStaticOnSale()
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

  return await Promise.all((data || []).map(transformToWebFormat))
}

// Get price range
export async function getPriceRange(): Promise<{ min: number; max: number }> {
  if (!isSupabaseConfigured) {
    const onSale = await getStaticOnSale()
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
    const onSale = await getStaticOnSale()
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
    const onSale = await getStaticOnSale()
    return onSale.length
  }

  const supabase = await getSupabaseClient()
  if (!supabase) {
    const onSale = await getStaticOnSale()
    return onSale.length
  }

  const { count, error } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .eq('estado', 'disponible')

  if (error) {
    console.error('Error getting vehicle count:', error)
    const onSale = await getStaticOnSale()
    return onSale.length
  }

  return count || 0
}

// Get similar vehicles
export async function getSimilarVehicles(vehicle: Vehicle, limit: number = 4): Promise<Vehicle[]> {
  if (!isSupabaseConfigured) {
    const onSale = (await getStaticOnSale()).filter(v => v.id !== vehicle.id)
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

  return await Promise.all((data || []).slice(0, limit).map(transformToWebFormat))
}
