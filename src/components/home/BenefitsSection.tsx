'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Clock, Users, FileCheck, Car, CreditCard, LucideIcon } from 'lucide-react'
import { getBenefits, Benefit } from '@/lib/content-service'

const defaultBenefits: Benefit[] = [
  {
    id: '1',
    titulo: 'Vehículos de confianza',
    descripcion: 'Todos nuestros coches son certificados, garantizados, revisados y disponen gratis del informe CARFAX.',
    icono: 'shield-check',
  },
  {
    id: '2',
    titulo: '1 año de garantía',
    descripcion: 'Garantía sin límite de kilómetros. Colaboramos con CONCENTRA GARANTÍAS desde hace más de 11 años.',
    icono: 'clock',
  },
  {
    id: '3',
    titulo: 'Concesionario familiar',
    descripcion: 'Equipo pequeño pero ágil de profesionales altamente cualificados y dispuestos a guiarte.',
    icono: 'users',
  },
  {
    id: '4',
    titulo: 'Transparencia total',
    descripcion: 'Más de 10 años de experiencia. Sabemos que comprar un coche usado requiere confianza.',
    icono: 'file-check',
  },
  {
    id: '5',
    titulo: 'Tu coche como pago',
    descripcion: 'Si quieres cambiar tu coche actual por uno de ocasión, tasamos tu vehículo como parte de pago.',
    icono: 'car',
  },
  {
    id: '6',
    titulo: 'Gestiones rápidas',
    descripcion: 'Preparamos todos los papeles para que con una sola firma tengas todo listo.',
    icono: 'credit-card',
  },
]

// Map icon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  'shield': Shield,
  'shield-check': Shield,
  'clock': Clock,
  'users': Users,
  'file-check': FileCheck,
  'car': Car,
  'credit-card': CreditCard,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const headerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mounted, setMounted] = useState(false)
  const [benefits, setBenefits] = useState<Benefit[]>(defaultBenefits)

  useEffect(() => {
    setMounted(true)

    async function fetchBenefits() {
      try {
        const data = await getBenefits()
        if (data && data.length > 0) {
          setBenefits(data)
        }
      } catch (error) {
        console.error('Error fetching benefits:', error)
      }
    }

    fetchBenefits()
  }, [])

  const getIcon = (iconName?: string): LucideIcon => {
    if (!iconName) return Shield
    return iconMap[iconName.toLowerCase()] || Shield
  }

  return (
    <section className="py-12 md:py-20 bg-secondary-50" ref={ref}>
      <div className="container-custom px-4 md:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          <h2 className="section-title mb-4 text-2xl md:text-3xl lg:text-4xl">¿Por qué comprar en MID Car?</h2>
          <p className="section-subtitle mx-auto">
            Miles de clientes han confiado en nosotros para la compra de su vehículo.
            Descubre por qué somos diferentes.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          {benefits.map((benefit) => {
            const IconComponent = getIcon(benefit.icono)
            return (
              <motion.div
                key={benefit.id}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 border border-secondary-100 transition-colors duration-300 group h-full"
                  whileHover={{ boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}
                >
                  <motion.div
                    className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-600 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {benefit.titulo}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {benefit.descripcion}
                  </p>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
