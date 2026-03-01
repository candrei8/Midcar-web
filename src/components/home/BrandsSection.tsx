'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { vehicles } from '@/data/vehicles'

// Get unique brands from available vehicles
function getBrands(): string[] {
  const onSale = vehicles.filter(v => v.onSale || v.status === 'disponible')
  return Array.from(new Set(onSale.map(v => v.brand))).sort()
}

// Generate brand objects from actual stock
const generateSlug = (brand: string) =>
  brand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')

const stockBrands = getBrands()
const brands = stockBrands.map(brand => ({
  name: brand === 'Volkswagen' ? 'VW' : brand,
  slug: generateSlug(brand)
}))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2
    }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const brandVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export function BrandsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-12 md:py-20 bg-secondary-50" ref={ref}>
      <div className="container-custom px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={headerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          <h2 className="section-title mb-4 text-2xl md:text-3xl lg:text-4xl">Marcas más buscadas</h2>
          <p className="section-subtitle mx-auto">
            Encuentra tu marca favorita entre nuestra amplia selección de vehículos
          </p>
        </motion.div>

        {/* Brands Grid */}
        <motion.div
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          {brands.map((brand, index) => (
            <motion.div key={brand.slug} variants={brandVariants}>
              <Link
                href={`/vehiculos?marca=${brand.slug}`}
                className="block"
              >
                <motion.div
                  className="bg-white rounded-xl p-4 border border-secondary-100 text-center
                           hover:shadow-lg hover:border-primary-200
                           transition-colors duration-300 group"
                  whileHover={{ scale: 1.08, y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="w-12 h-12 mx-auto mb-2 bg-secondary-100 rounded-full flex items-center justify-center
                              group-hover:bg-primary-100 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-xl font-bold text-secondary-400 group-hover:text-primary-600 transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  </motion.div>
                  <p className="text-sm font-medium text-secondary-700 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
