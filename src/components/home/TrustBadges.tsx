'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Shield, Award, Heart } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    title: 'Concesionario CARFAX',
    description: 'Informes de historial verificados',
  },
  {
    icon: Award,
    title: 'Socio GANVAM',
    description: 'Desde 2010',
  },
  {
    icon: Heart,
    title: 'Patrocinador EFS Torrejón',
    description: 'Comprometidos con la comunidad',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

export function TrustBadges() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-8 md:py-12 bg-secondary-50" ref={ref}>
      <div className="container-custom px-4 md:px-6">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={isInView ? "visible" : (mounted ? "hidden" : false)}
        >
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              className="flex items-center gap-4"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center"
                whileHover={{
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  backgroundColor: "rgba(239, 68, 68, 0.1)"
                }}
              >
                <badge.icon className="w-7 h-7 text-primary-600" />
              </motion.div>
              <div>
                <p className="font-semibold text-secondary-900">{badge.title}</p>
                <p className="text-sm text-secondary-500">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
