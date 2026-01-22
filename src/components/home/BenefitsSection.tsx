'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Clock, Users, FileCheck, Car, CreditCard } from 'lucide-react'

const benefits = [
  {
    icon: Shield,
    title: 'Vehículos de confianza',
    description: 'Todos nuestros coches son certificados, garantizados, revisados y disponen gratis del informe CARFAX.',
  },
  {
    icon: Clock,
    title: '1 año de garantía',
    description: 'Garantía sin límite de kilómetros. Colaboramos con CONCENTRA GARANTÍAS desde hace más de 11 años.',
  },
  {
    icon: Users,
    title: 'Concesionario familiar',
    description: 'Equipo pequeño pero ágil de profesionales altamente cualificados y dispuestos a guiarte.',
  },
  {
    icon: FileCheck,
    title: 'Transparencia total',
    description: 'Más de 10 años de experiencia. Sabemos que comprar un coche usado requiere confianza.',
  },
  {
    icon: Car,
    title: 'Tu coche como pago',
    description: 'Si quieres cambiar tu coche actual por uno de ocasión, tasamos tu vehículo como parte de pago.',
  },
  {
    icon: CreditCard,
    title: 'Gestiones rápidas',
    description: 'Preparamos todos los papeles para que con una sola firma tengas todo listo.',
  },
]

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

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-20 bg-secondary-50" ref={ref}>
      <div className="container-custom">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={headerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          <h2 className="section-title mb-4">¿Por qué comprar en MID Car?</h2>
          <p className="section-subtitle mx-auto">
            Miles de clientes han confiado en nosotros para la compra de su vehículo.
            Descubre por qué somos diferentes.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
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
                  <benefit.icon className="w-7 h-7 text-primary-600 group-hover:text-white transition-colors" />
                </motion.div>
                <h3 className="text-xl font-bold text-secondary-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
