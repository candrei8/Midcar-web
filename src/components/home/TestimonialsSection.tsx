'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Carlos M.',
    date: 'Hace 2 meses',
    rating: 5,
    text: 'Compré un Ford Focus y todo fue perfecto. El coche estaba impecable y el trato fue inmejorable. Muy recomendable.',
  },
  {
    id: 2,
    name: 'María G.',
    date: 'Hace 3 meses',
    rating: 5,
    text: 'Después de buscar en varios concesionarios, encontré en MID Car el coche que buscaba al mejor precio. La financiación fue muy sencilla.',
  },
  {
    id: 3,
    name: 'Antonio R.',
    date: 'Hace 4 meses',
    rating: 5,
    text: 'Viajé desde Ávila para comprar un coche y valió la pena. Profesionales de verdad, te asesoran sin presiones.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const leftContentVariants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const testimonialVariants = {
  hidden: { opacity: 0, x: 60, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

const googleCardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4
    }
  }
}

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="py-20" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={leftContentVariants}
            initial={mounted ? "hidden" : false}
            animate={mounted ? (isInView ? "visible" : "hidden") : false}
          >
            <motion.h2
              className="section-title mb-4"
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Nuestros clientes nos avalan
            </motion.h2>
            <motion.p
              className="section-subtitle mb-8"
              initial={mounted ? { opacity: 0, y: 20 } : false}
              animate={mounted ? (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }) : false}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
              Lee lo que dicen sobre nosotros.
            </motion.p>

            {/* Google Rating Card */}
            <motion.div
              className="bg-white rounded-2xl p-6 border border-secondary-100 shadow-lg shadow-secondary-900/5 inline-flex items-center gap-6"
              variants={googleCardVariants}
              initial={mounted ? "hidden" : false}
              animate={mounted ? (isInView ? "visible" : "hidden") : false}
              whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <svg viewBox="0 0 24 24" className="w-10 h-10">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </motion.div>
              <div>
                <p className="text-sm text-secondary-500 mb-1">Valoración en Google</p>
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-3xl font-bold text-secondary-900"
                    initial={mounted ? { opacity: 0, scale: 0 } : false}
                    animate={mounted ? (isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }) : false}
                    transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                  >
                    4.5
                  </motion.span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={mounted ? { opacity: 0, scale: 0, rotate: -180 } : false}
                        animate={mounted ? (isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -180 }) : false}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.4, type: "spring" }}
                      >
                        <Star
                          className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : i < 5 ? 'text-yellow-400 fill-yellow-400/50' : 'text-secondary-300'}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
                <motion.p
                  className="text-sm text-secondary-500"
                  initial={mounted ? { opacity: 0 } : false}
                  animate={mounted ? (isInView ? { opacity: 1 } : { opacity: 0 }) : false}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Basado en 189 opiniones
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial={mounted ? "hidden" : false}
            animate={mounted ? (isInView ? "visible" : "hidden") : false}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white rounded-2xl p-6 border border-secondary-100 relative overflow-hidden"
                variants={testimonialVariants}
                whileHover={{ scale: 1.02, y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.div
                  initial={mounted ? { opacity: 0, scale: 0, rotate: -45 } : false}
                  animate={mounted ? (isInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -45 }) : false}
                  transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-primary-100" />
                </motion.div>
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <span className="text-lg font-bold text-primary-600">
                      {testimonial.name.charAt(0)}
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-secondary-900">{testimonial.name}</p>
                    <p className="text-sm text-secondary-500">{testimonial.date}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={mounted ? { opacity: 0, scale: 0 } : false}
                      animate={mounted ? (isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }) : false}
                      transition={{ delay: 0.6 + index * 0.2 + i * 0.05, duration: 0.3 }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-secondary-600">{testimonial.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
