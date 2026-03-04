#!/usr/bin/env node
/**
 * Script to regenerate vehicleImages.ts from MongoDB export
 * Uses the correct blob storage URLs
 */

const fs = require('fs')
const path = require('path')

const MONGO_FILE = '/Users/andreich/Downloads/db-midcar/vehicles-mongodb-compass.json'
const OUTPUT_FILE = path.join(__dirname, '../src/data/vehicleImages.ts')

console.log('Reading MongoDB export...')
const rawData = fs.readFileSync(MONGO_FILE, 'utf8')
const vehicles = JSON.parse(rawData)

console.log(`Found ${vehicles.length} vehicles`)

const vehicleImageCounts = {}
const customFirstImages = {}
const vehicleAllImages = {}

let totalImages = 0

vehicles.forEach(vehicle => {
  const id = vehicle._id
  const files = vehicle.FileDocuments || []

  if (files.length === 0) return

  vehicleImageCounts[id] = files.length
  totalImages += files.length

  // Find main image (or use first one)
  const mainImage = files.find(f => f.Main === true) || files[0]
  if (mainImage && mainImage.Url) {
    customFirstImages[id] = mainImage.Url
  }

  // All images
  const allUrls = files.map(f => f.Url).filter(Boolean)
  if (allUrls.length > 0) {
    vehicleAllImages[id] = allUrls
  }
})

console.log(`Total images: ${totalImages}`)
console.log(`Vehicles with images: ${Object.keys(vehicleImageCounts).length}`)

// Generate TypeScript file
let output = `// Vehicle image data from MongoDB export
// Generated: ${new Date().toISOString().split('T')[0]}
// Total vehicles with images: ${Object.keys(vehicleImageCounts).length}
// Total images: ${totalImages}

// Image counts for each vehicle
export const vehicleImageCounts: Record<string, number> = ${JSON.stringify(vehicleImageCounts, null, 2)}

// Main/first image for each vehicle (for quick access)
export const customFirstImages: Record<string, string> = ${JSON.stringify(customFirstImages, null, 2)}

// All images for each vehicle
export const vehicleAllImages: Record<string, string[]> = ${JSON.stringify(vehicleAllImages, null, 2)}

// Helper function to get main image URL for a vehicle
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

fs.writeFileSync(OUTPUT_FILE, output)
console.log(`\nGenerated: ${OUTPUT_FILE}`)
console.log('Done!')
