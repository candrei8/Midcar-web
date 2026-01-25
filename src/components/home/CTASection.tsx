'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { Phone, Search, MapPin, ArrowRight } from 'lucide-react'
import { getCTAContent, CTAContent } from '@/lib/content-service'

const defaultContent: CTAContent = {
  financiacion: {
    badge: 'Financiación flexible',
    titulo: 'Financiación a tu medida',
    descripcion: 'Te ayudamos a financiar el 100% del valor de tu coche, sin entrada y hasta en 10 años. Calculamos tu cuota en minutos.',
    boton: 'Calcular mi financiación',
  },
  cocheCarta: {
    badge: 'Coche a la carta',
    titulo: '¿No encuentras lo que buscas?',
    descripcion: 'Nosotros te lo encontramos al mejor precio. Dinos qué coche necesitas y lo buscaremos por ti.',
    boton: 'Solicitar coche',
  },
  contacto: {
    titulo: '¿Tienes alguna duda?',
    subtitulo: 'Estamos aquí para ayudarte. Contáctanos sin compromiso.',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const contactBarVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4
    }
  }
}

const decorativeVariants = {
  initial: { scale: 0.8, opacity: 0.1 },
  animate: {
    scale: [0.8, 1.2, 0.8],
    opacity: [0.1, 0.3, 0.1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<CTAContent>(defaultContent)

  useEffect(() => {
    setMounted(true)

    async function fetchContent() {
      try {
        const ctaContent = await getCTAContent()
        setContent(ctaContent)
      } catch (error) {
        console.error('Error fetching CTA content:', error)
      }
    }

    fetchContent()
  }, [])

  return (
    <section className="py-12 md:py-20" ref={ref}>
      <div className="container-custom px-4 md:px-6">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
          variants={containerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          {/* Financing CTA */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 lg:p-12"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6"
                initial={mounted ? { opacity: 0, x: -20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }) : false}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <motion.span
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {content.financiacion.badge}
              </motion.div>
              <motion.h3
                className="text-3xl font-bold text-white mb-4 font-display"
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                {content.financiacion.titulo}
              </motion.h3>
              <motion.p
                className="text-primary-100 mb-8 max-w-md"
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                {content.financiacion.descripcion}
              </motion.p>
              <Link href="/financiacion">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-700 font-semibold rounded-xl
                           hover:bg-primary-50 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {content.financiacion.boton}
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
            {/* Decorative */}
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              variants={decorativeVariants}
              initial="initial"
              animate="animate"
            />
            <motion.div
              className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </motion.div>

          {/* Car Search CTA */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-800 to-secondary-900 p-8 lg:p-12"
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative z-10">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium mb-6"
                initial={mounted ? { opacity: 0, x: -20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }) : false}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Search className="w-4 h-4" />
                {content.cocheCarta.badge}
              </motion.div>
              <motion.h3
                className="text-3xl font-bold text-white mb-4 font-display"
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {content.cocheCarta.titulo}
              </motion.h3>
              <motion.p
                className="text-secondary-300 mb-8 max-w-md"
                initial={mounted ? { opacity: 0, y: 20 } : false}
                animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {content.cocheCarta.descripcion}
              </motion.p>
              <Link href="/coche-a-la-carta">
                <motion.div
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl
                           hover:bg-primary-700 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {content.cocheCarta.boton}
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
            {/* Decorative */}
            <motion.div
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary-600/20 rounded-full blur-3xl"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Contact Bar */}
        <motion.div
          className="mt-8 bg-white rounded-2xl border border-secondary-100 p-6 lg:p-8"
          variants={contactBarVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <motion.div
              className="text-center lg:text-left"
              initial={mounted ? { opacity: 0, x: -20 } : false}
              animate={mounted ? (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }) : false}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-xl font-bold text-secondary-900 mb-1">
                {content.contacto.titulo}
              </h3>
              <p className="text-secondary-500">
                {content.contacto.subtitulo}
              </p>
            </motion.div>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={mounted ? { opacity: 0, x: 20 } : false}
              animate={mounted ? (isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }) : false}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.a
                href="tel:910023016"
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Phone className="w-5 h-5" />
                910 023 016
              </motion.a>
              <motion.a
                href="https://goo.gl/maps/QBEDPvLewMC1NdZ68"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <MapPin className="w-5 h-5" />
                Cómo llegar
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
