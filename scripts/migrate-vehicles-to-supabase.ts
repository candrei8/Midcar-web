/**
 * Migration Script: Migrate vehicles from MidCar-Web to Supabase
 * Run with: npx ts-node scripts/migrate-vehicles-to-supabase.ts
 *
 * This script migrates all 92 vehicles from the hardcoded data to Supabase,
 * making them available in both the dashboard and the website.
 */

import { createClient } from '@supabase/supabase-js'

// Supabase credentials (same as dashboard)
const supabaseUrl = 'https://cvwxgzwremuijxinrvxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3hnendyZW11aWp4aW5ydnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDM1MjQsImV4cCI6MjA4MzI3OTUyNH0.MWF_dUmSWRXhtPpQUZFxpUiLTwMpuLl0hpm8YboI-ec'

const supabase = createClient(supabaseUrl, supabaseKey)

// Import vehicle data
import { vehicles } from '../src/data/vehicles'
import { getMainVehicleImage } from '../src/data/vehicleImages'

// Fuel type mapping
function mapFuel(webFuel: string): string {
  const fuelMap: Record<string, string> = {
    'Diesel': 'diesel',
    'Gasolina': 'gasolina',
    'Híbrido': 'hibrido',
    'Hibrido': 'hibrido',
    'Gas': 'glp',
  }
  return fuelMap[webFuel] || webFuel.toLowerCase()
}

// Transmission mapping
function mapTransmission(webTransmission: string): string {
  const transmissionMap: Record<string, string> = {
    'Manual': 'manual',
    'Automático': 'automatico',
    'Automatico': 'automatico',
  }
  return transmissionMap[webTransmission] || webTransmission.toLowerCase()
}

// Estado mapping
function mapEstado(onSale: boolean): string {
  return onSale ? 'disponible' : 'reservado'
}

// Transform web vehicle to dashboard format
function transformVehicle(webVehicle: typeof vehicles[0]) {
  const firstImage = getMainVehicleImage(webVehicle.id)

  return {
    // Use existing ID to maintain consistency
    id: webVehicle.id,

    // Basic info
    marca: webVehicle.brand,
    modelo: webVehicle.model,
    version: '',

    // Years
    año_fabricacion: webVehicle.year,
    año_matriculacion: webVehicle.year,

    // Technical
    potencia_cv: webVehicle.cv,
    potencia_kw: Math.round(webVehicle.cv * 0.7355),
    combustible: mapFuel(webVehicle.fuel),
    transmision: mapTransmission(webVehicle.transmission),
    tipo_carroceria: webVehicle.bodyType,
    etiqueta_dgt: webVehicle.label || null,

    // Mileage and status
    kilometraje: webVehicle.km,
    estado: mapEstado(webVehicle.onSale),
    destacado: webVehicle.featured || false,

    // Pricing
    precio_venta: webVehicle.price,
    descuento: webVehicle.originalPrice ? (webVehicle.originalPrice - webVehicle.price) : 0,

    // Image - only the first one
    imagen_principal: firstImage,

    // Defaults for required fields
    vin: '',
    matricula: '',
    stock_id: webVehicle.id,
    en_oferta: webVehicle.originalPrice ? true : false,

    // Technical defaults
    cilindrada: 0,
    consumo_mixto: 0,
    emisiones_co2: 0,
    num_marchas: 0,
    traccion: '',
    num_puertas: 0,
    num_plazas: 5,
    color_exterior: '',
    color_interior: '',

    // History defaults
    num_propietarios: 1,
    es_nacional: true,
    primera_mano: false,

    // Financial defaults
    precio_compra: 0,
    gastos_compra: 0,
    coste_reparaciones: 0,

    // Warranty
    garantia_meses: 12,
    tipo_garantia: 'CONCENTRA',

    // Tracking
    fecha_entrada_stock: new Date().toISOString().split('T')[0],
    origen_datos: 'web_migracion',

    // Sync status
    datos_sincronizados: true,
    ultima_sincronizacion: new Date().toISOString(),
  }
}

async function migrateVehicles() {
  console.log('Starting vehicle migration...')
  console.log(`Total vehicles to migrate: ${vehicles.length}`)

  let successCount = 0
  let errorCount = 0
  const errors: string[] = []

  for (const vehicle of vehicles) {
    try {
      const transformedVehicle = transformVehicle(vehicle)

      // Upsert to handle existing records
      const { error } = await supabase
        .from('vehicles')
        .upsert(transformedVehicle, {
          onConflict: 'id',
          ignoreDuplicates: false
        })

      if (error) {
        console.error(`Error migrating ${vehicle.id} (${vehicle.title}):`, error.message)
        errors.push(`${vehicle.id}: ${error.message}`)
        errorCount++
      } else {
        console.log(`✓ Migrated: ${vehicle.brand} ${vehicle.model} (${vehicle.id})`)
        successCount++
      }
    } catch (err) {
      console.error(`Exception migrating ${vehicle.id}:`, err)
      errors.push(`${vehicle.id}: ${err}`)
      errorCount++
    }
  }

  console.log('\n========================================')
  console.log('Migration Summary:')
  console.log(`  Total: ${vehicles.length}`)
  console.log(`  Success: ${successCount}`)
  console.log(`  Errors: ${errorCount}`)

  if (errors.length > 0) {
    console.log('\nErrors:')
    errors.forEach(e => console.log(`  - ${e}`))
  }

  console.log('========================================\n')
}

// Run migration
migrateVehicles()
  .then(() => {
    console.log('Migration completed!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
