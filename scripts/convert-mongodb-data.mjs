/**
 * Convert MongoDB vehicle data export to static TypeScript data files
 *
 * Usage: node scripts/convert-mongodb-data.mjs <path-to-extracted-db-folder>
 * Example: node scripts/convert-mongodb-data.mjs C:/Users/zetar/tmp/midcar-db
 */

import fs from 'fs'
import path from 'path'

const dbPath = process.argv[2] || 'C:/Users/zetar/tmp/midcar-db'

// Read data files
const vehicles = JSON.parse(fs.readFileSync(path.join(dbPath, 'vehicles-mongodb-compass.json'), 'utf-8'))
const makes = JSON.parse(fs.readFileSync(path.join(dbPath, 'makes-mongodb-compass.json'), 'utf-8'))
const extras = JSON.parse(fs.readFileSync(path.join(dbPath, 'vehicleExtras-mongodb-compass.json'), 'utf-8'))

// Build lookup maps
const makeMap = {}
makes.forEach(m => { makeMap[m._id] = m.Name || m.name })

const extraMap = {}
extras.forEach(e => { extraMap[e._id] = e.Name || e.name })

// VehicleType mapping (determined from data analysis)
const vehicleTypeMap = {
  '0': 'berlina',
  '1': 'berlina',     // coupes/sedans (CLS, Passat CC, Fiat 500)
  '2': 'familiar',    // station wagons (Mondeo SB, Insignia ST, 307 SW)
  '3': 'suv',         // SUV/4x4 (Duster, Kuga, CRV, Freelander)
  '4': 'monovolumen', // MPVs (S-Max, 5008 7 plazas)
  '5': 'furgoneta',   // vans/industrial (Berlingo, Transit, Jumper)
}

// Helper to extract numeric value from MongoDB extended JSON
function getNum(val) {
  if (val === null || val === undefined) return 0
  if (typeof val === 'number') return val
  if (val['$numberInt']) return parseInt(val['$numberInt'])
  if (val['$numberDecimal']) return parseFloat(val['$numberDecimal'])
  if (val['$numberLong']) return parseInt(val['$numberLong'])
  return parseInt(val) || 0
}

// Generate slug from title and year
function generateSlug(brand, title, year, id) {
  const base = `${title}-${year}-${id}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base
}

// Process vehicles
const processedVehicles = []
const imageData = {}  // id -> { mainImage, count, allUrls }

for (const v of vehicles) {
  const id = v._id
  const brand = makeMap[v.MakeId] || 'Desconocido'
  const title = v.Title || `${brand} ${v.ModelId || ''}`
  const year = getNum(v.Year)
  const price = getNum(v.Price)
  const originalPrice = getNum(v.OriginalPrice)
  const mileage = getNum(v.Mileage)
  const power = getNum(v.Power)
  const seats = getNum(v.Seats)
  const doors = getNum(v.Doors)
  const vehicleTypeNum = v.VehicleType && v.VehicleType['$numberInt'] ? v.VehicleType['$numberInt'] : String(v.VehicleType || '0')
  const bodyType = vehicleTypeMap[vehicleTypeNum] || 'berlina'
  const vehicleStatus = v.VehicleStatus && v.VehicleStatus['$numberInt'] ? parseInt(v.VehicleStatus['$numberInt']) : (typeof v.VehicleStatus === 'number' ? v.VehicleStatus : 2)

  // VehicleStatus: 0 = disponible, 1 = reservado, 2 = vendido
  let status = 'vendido'
  if (vehicleStatus === 0) status = 'disponible'
  else if (vehicleStatus === 1) status = 'reservado'

  // Skip invisible vehicles
  if (!v.Visible) continue

  // Fuel mapping
  const fuelMap = {
    'Diesel': 'Diesel',
    'Gasolina': 'Gasolina',
    'Híbrido': 'Híbrido',
    'Hibrido': 'Híbrido',
    'Eléctrico': 'Eléctrico',
    'Electrico': 'Eléctrico',
    'Gas': 'Gas',
    'GLP': 'Gas',
  }
  const fuel = fuelMap[v.Fuel] || v.Fuel || 'Diesel'
  const transmission = v.Gearbox || 'Manual'

  // Process images - encode URLs with spaces
  const encodeImageUrl = (url) => {
    if (!url) return ''
    // Only encode spaces, leave already-encoded parts intact
    return url.replace(/ /g, '%20')
  }
  const fileDocuments = v.FileDocuments || []
  const mainDoc = fileDocuments.find(f => f.Main) || fileDocuments[0]
  const mainImage = mainDoc ? encodeImageUrl(mainDoc.Url) : ''
  const allImages = fileDocuments.map(f => encodeImageUrl(f.Url))

  if (allImages.length > 0) {
    imageData[id] = {
      mainImage,
      count: allImages.length,
      allUrls: allImages,
    }
  }

  // Features/extras
  const features = v.Features || []
  const extraNames = (v.ExtraIds || []).map(eid => extraMap[eid]).filter(Boolean)

  // Generate slug
  const slug = v.Uri || generateSlug(brand, title, year, id)

  // Determine onSale
  const onSale = status === 'disponible'

  const vehicle = {
    id,
    slug,
    title,
    brand,
    model: title.replace(new RegExp(`^${brand}\\s*`, 'i'), ''),
    price,
    originalPrice: originalPrice > 0 ? originalPrice : undefined,
    km: mileage,
    year,
    cv: power,
    fuel,
    transmission,
    bodyType,
    ivaDeducible: v.VatDeducible === true,
    onSale,
    label: v.EmissionTag || undefined,
    featured: v.Featured === true,
    description: v.Description || undefined,
    color: v.Color || undefined,
    seats,
    doors,
    features,
    extras: extraNames,
    status,
    monthlyPayment: price > 0 ? Math.round(price / 60) : 0,
  }

  processedVehicles.push(vehicle)
}

// Sort: disponible first, then reservado, then vendido; within each group by featured then price
processedVehicles.sort((a, b) => {
  const statusOrder = { disponible: 0, reservado: 1, vendido: 2 }
  if (statusOrder[a.status] !== statusOrder[b.status]) {
    return statusOrder[a.status] - statusOrder[b.status]
  }
  if (a.featured && !b.featured) return -1
  if (!a.featured && b.featured) return 1
  return a.price - b.price
})

console.log(`Processed ${processedVehicles.length} vehicles`)
console.log(`  Disponible: ${processedVehicles.filter(v => v.status === 'disponible').length}`)
console.log(`  Reservado: ${processedVehicles.filter(v => v.status === 'reservado').length}`)
console.log(`  Vendido: ${processedVehicles.filter(v => v.status === 'vendido').length}`)
console.log(`  With images: ${Object.keys(imageData).length}`)

// ============================================================
// Generate vehicles.ts
// ============================================================

let vehiclesTs = `// Vehicle data from MongoDB export - MidCar database
// Generated: ${new Date().toISOString().split('T')[0]}
// Total: ${processedVehicles.length} vehicles (${processedVehicles.filter(v => v.status === 'disponible').length} disponible, ${processedVehicles.filter(v => v.status === 'reservado').length} reservado, ${processedVehicles.filter(v => v.status === 'vendido').length} vendido)

import { getMainVehicleImage, getAllVehicleImages } from './vehicleImages'

export interface Vehicle {
  id: string
  slug: string
  title: string
  brand: string
  model: string
  price: number
  originalPrice?: number
  km: number
  year: number
  cv: number
  fuel: 'Diesel' | 'Gasolina' | 'Híbrido' | 'Eléctrico' | 'Gas' | string
  transmission: 'Manual' | 'Automático' | string
  bodyType: 'berlina' | 'familiar' | 'suv' | 'monovolumen' | 'furgoneta' | 'industrial' | 'barco' | string
  ivaDeducible: boolean
  onSale: boolean
  label?: 'ECO' | 'C' | 'B' | '0' | string
  images: string[]
  featured?: boolean
  monthlyPayment?: number
  description?: string
  color?: string
  seats?: number
  doors?: number
  features?: string[]
  extras?: string[]
  status?: 'disponible' | 'reservado' | 'vendido'
}

// Helper to generate image URL
const getImageUrl = (id: string) => getMainVehicleImage(id)
const getImages = (id: string) => getAllVehicleImages(id)

export const vehicles: Vehicle[] = [
`

for (const v of processedVehicles) {
  vehiclesTs += `  {\n`
  vehiclesTs += `    id: ${JSON.stringify(v.id)},\n`
  vehiclesTs += `    slug: ${JSON.stringify(v.slug)},\n`
  vehiclesTs += `    title: ${JSON.stringify(v.title)},\n`
  vehiclesTs += `    brand: ${JSON.stringify(v.brand)},\n`
  vehiclesTs += `    model: ${JSON.stringify(v.model)},\n`
  vehiclesTs += `    price: ${v.price},\n`
  if (v.originalPrice) vehiclesTs += `    originalPrice: ${v.originalPrice},\n`
  vehiclesTs += `    km: ${v.km},\n`
  vehiclesTs += `    year: ${v.year},\n`
  vehiclesTs += `    cv: ${v.cv},\n`
  vehiclesTs += `    fuel: ${JSON.stringify(v.fuel)},\n`
  vehiclesTs += `    transmission: ${JSON.stringify(v.transmission)},\n`
  vehiclesTs += `    bodyType: ${JSON.stringify(v.bodyType)},\n`
  vehiclesTs += `    ivaDeducible: ${v.ivaDeducible},\n`
  vehiclesTs += `    onSale: ${v.onSale},\n`
  if (v.label) vehiclesTs += `    label: ${JSON.stringify(v.label)},\n`
  vehiclesTs += `    images: getImages(${JSON.stringify(v.id)}),\n`
  if (v.featured) vehiclesTs += `    featured: true,\n`
  vehiclesTs += `    monthlyPayment: ${v.monthlyPayment},\n`
  if (v.description) vehiclesTs += `    description: ${JSON.stringify(v.description)},\n`
  if (v.color) vehiclesTs += `    color: ${JSON.stringify(v.color)},\n`
  if (v.seats) vehiclesTs += `    seats: ${v.seats},\n`
  if (v.doors) vehiclesTs += `    doors: ${v.doors},\n`
  if (v.features && v.features.length > 0) vehiclesTs += `    features: ${JSON.stringify(v.features)},\n`
  if (v.extras && v.extras.length > 0) vehiclesTs += `    extras: ${JSON.stringify(v.extras)},\n`
  vehiclesTs += `    status: ${JSON.stringify(v.status)},\n`
  vehiclesTs += `  },\n`
}

vehiclesTs += `]\n`

// ============================================================
// Generate vehicleImages.ts
// ============================================================

let vehicleImagesTs = `// Vehicle image data from MongoDB export
// Generated: ${new Date().toISOString().split('T')[0]}
// Total vehicles with images: ${Object.keys(imageData).length}

// Image counts for each vehicle
export const vehicleImageCounts: Record<string, number> = {\n`

for (const [id, data] of Object.entries(imageData).sort((a, b) => a[0].localeCompare(b[0]))) {
  vehicleImagesTs += `  "${id}": ${data.count},\n`
}
vehicleImagesTs += `}\n\n`

// Main image URLs
vehicleImagesTs += `// Main/first image URL for each vehicle\nexport const customFirstImages: Record<string, string> = {\n`

for (const [id, data] of Object.entries(imageData).sort((a, b) => a[0].localeCompare(b[0]))) {
  if (data.mainImage) {
    vehicleImagesTs += `  "${id}": ${JSON.stringify(data.mainImage)},\n`
  }
}
vehicleImagesTs += `}\n\n`

// All image URLs per vehicle
vehicleImagesTs += `// All image URLs for each vehicle\nexport const vehicleAllImages: Record<string, string[]> = {\n`

for (const [id, data] of Object.entries(imageData).sort((a, b) => a[0].localeCompare(b[0]))) {
  if (data.allUrls && data.allUrls.length > 0) {
    vehicleImagesTs += `  "${id}": ${JSON.stringify(data.allUrls)},\n`
  }
}
vehicleImagesTs += `}\n\n`

// Helper functions
vehicleImagesTs += `// Helper function to get the first/main image for a vehicle
export const getMainVehicleImage = (id: string): string => {
  return customFirstImages[id] || ''
}

// Helper function to get image count for a vehicle
export const getVehicleImageCount = (id: string): number => {
  return vehicleImageCounts[id] || 0
}

// Helper to check if vehicle has multiple images
export const hasMultipleImages = (id: string): boolean => {
  return (vehicleImageCounts[id] || 0) > 1
}

// Helper to get all image URLs for a vehicle (from MongoDB data)
export const getAllVehicleImages = (id: string): string[] => {
  return vehicleAllImages[id] || (customFirstImages[id] ? [customFirstImages[id]] : [])
}
`

// Write files
const outputDir = path.resolve('src/data')
fs.writeFileSync(path.join(outputDir, 'vehicles.ts'), vehiclesTs, 'utf-8')
fs.writeFileSync(path.join(outputDir, 'vehicleImages.ts'), vehicleImagesTs, 'utf-8')

console.log(`\nFiles written:`)
console.log(`  src/data/vehicles.ts (${(vehiclesTs.length / 1024).toFixed(0)} KB)`)
console.log(`  src/data/vehicleImages.ts (${(vehicleImagesTs.length / 1024).toFixed(0)} KB)`)
