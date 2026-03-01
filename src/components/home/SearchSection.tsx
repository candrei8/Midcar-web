'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, Car, Fuel, Gauge, Euro, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { vehicles } from '@/data/vehicles'

const vehicleCount = vehicles.filter(v => v.onSale || v.status === 'disponible').length

const bodyTypes = [
  { id: 'berlina', name: 'Berlina', icon: '🚗' },
  { id: 'familiar', name: 'Familiar', icon: '🚙' },
  { id: 'suv', name: 'SUV/4x4', icon: '🚜' },
  { id: 'monovolumen', name: 'Monovolumen', icon: '🚐' },
  { id: 'furgoneta', name: 'Furgoneta', icon: '🚚' },
  { id: 'industrial', name: 'Industrial', icon: '🏭' },
]

const brands = [
  'Todas las marcas', 'BMW', 'Citroën', 'Dacia', 'Fiat', 'Ford', 'Hyundai',
  'Kia', 'Mercedes-Benz', 'Opel', 'Peugeot'
]

const priceRanges = [
  'Sin límite', '5.000€', '10.000€', '15.000€', '20.000€', '25.000€', '30.000€', '40.000€', '50.000€'
]

const kmRanges = [
  'Sin límite', '25.000 km', '50.000 km', '75.000 km', '100.000 km', '125.000 km', '150.000 km'
]

const containerVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

const bodyTypeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
}

export function SearchSection() {
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null)
  const [brand, setBrand] = useState('Todas las marcas')
  const [maxPrice, setMaxPrice] = useState('Sin límite')
  const [maxKm, setMaxKm] = useState('Sin límite')
  const [mounted, setMounted] = useState(false)

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    setMounted(true)
  }, [])

  const buildSearchUrl = () => {
    const params = new URLSearchParams()
    if (selectedBodyType) params.set('carroceria', selectedBodyType)
    if (brand !== 'Todas las marcas') {
      // Normalize brand names for URL
      const brandSlug = brand.toLowerCase().replace(/\s+/g, '-')
      params.set('marca', brandSlug)
    }
    if (maxPrice !== 'Sin límite') params.set('precio_max', maxPrice.replace(/[^0-9]/g, ''))
    if (maxKm !== 'Sin límite') params.set('km_max', maxKm.replace(/[^0-9]/g, ''))
    return `/vehiculos${params.toString() ? '?' + params.toString() : ''}`
  }

  return (
    <section className="relative -mt-12 md:-mt-24 z-20 pb-8 md:pb-12 px-4 md:px-0" ref={ref}>
      <div className="container-custom">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl shadow-secondary-900/10 border border-secondary-100 overflow-hidden"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={isInView ? "visible" : (mounted ? "hidden" : false)}
        >
          {/* Header */}
          <motion.div
            className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 md:px-8 py-4 md:py-6"
            variants={itemVariants}
          >
            <h2 className="text-xl md:text-2xl font-bold text-white font-display">
              Encuentra tu coche ideal
            </h2>
            <p className="text-primary-100 mt-1 text-sm md:text-base">
              Busca entre {vehicleCount} vehículos certificados
            </p>
          </motion.div>

          <div className="p-4 md:p-8">
            {/* Body Type Selection */}
            <motion.div className="mb-8" variants={itemVariants}>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Tipo de carrocería
              </label>
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3"
                variants={containerVariants}
              >
                {bodyTypes.map((type, index) => (
                  <motion.button
                    key={type.id}
                    variants={bodyTypeVariants}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBodyType(selectedBodyType === type.id ? null : type.id)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors duration-200',
                      selectedBodyType === type.id
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-secondary-200 hover:border-secondary-300 text-secondary-600 hover:bg-secondary-50'
                    )}
                  >
                    <motion.span
                      className="text-2xl"
                      animate={selectedBodyType === type.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {type.icon}
                    </motion.span>
                    <span className="text-sm font-medium">{type.name}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>

            {/* Filters Grid */}
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              variants={containerVariants}
            >
              {/* Brand */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Car className="w-4 h-4 inline mr-1" />
                  Marca
                </label>
                <div className="relative">
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="select-modern pr-10"
                  >
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Model - placeholder for now */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Car className="w-4 h-4 inline mr-1" />
                  Modelo
                </label>
                <div className="relative">
                  <select className="select-modern pr-10">
                    <option>Todos los modelos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Max KM */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Gauge className="w-4 h-4 inline mr-1" />
                  Kilómetros hasta
                </label>
                <div className="relative">
                  <select
                    value={maxKm}
                    onChange={(e) => setMaxKm(e.target.value)}
                    className="select-modern pr-10"
                  >
                    {kmRanges.map((km) => (
                      <option key={km} value={km}>{km}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                </div>
              </motion.div>

              {/* Max Price */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Euro className="w-4 h-4 inline mr-1" />
                  Precio hasta
                </label>
                <div className="relative">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="select-modern pr-10"
                  >
                    {priceRanges.map((price) => (
                      <option key={price} value={price}>{price}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
                </div>
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link href={buildSearchUrl()} className="flex-1">
                <motion.div
                  className="btn-primary justify-center text-lg py-4 w-full"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Search className="w-5 h-5" />
                  Buscar coches
                </motion.div>
              </Link>
              <Link href="/vehiculos" className="flex-1">
                <motion.div
                  className="btn-secondary justify-center w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Ver todos los vehículos
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
