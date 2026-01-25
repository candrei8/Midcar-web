'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronDown, Car, Star, Award, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAboutContent, AboutContent } from '@/lib/content-service'

const defaultContent: AboutContent = {
  label: 'Sobre nosotros',
  titulo: 'Tu concesionario de confianza en Madrid',
  parrafoPrincipal: 'En MID Car contamos con una amplia experiencia de más de 10 años en la venta de vehículos de ocasión. Sabemos que comprar un coche es una inversión importante y trabajamos con la única intención de conseguir que cada cliente esté al 100% satisfecho con su compra.',
  parrafosExtendidos: [
    'Somos un concesionario de compraventa de vehículos de ocasión certificados. En nuestras instalaciones podrá encontrar una variedad de coches de las mejores marcas del mercado. Contamos con un equipo de profesionales altamente cualificados y dispuestos a colaborar en todo momento en la compraventa de su vehículo.',
    'Nuestros vehículos están garantizados y revisados. La gran mayoría son nacionales de único dueño, servicio particular. Nuestro stock conlleva más de 80 vehículos de ocasión en constante rotación: berlinas, deportivos, familiares, todoterrenos, monovolúmenes y vehículos industriales.',
    'Somos miembros de GANVAM desde 2010 y Concesionario Avanzado CARFAX. Todos nuestros vehículos incluyen el informe CARFAX de forma gratuita que certifica el historial completo del coche.',
    'Llevamos en Torrejón de Ardoz ejerciendo nuestra actividad desde el año 2009. Disponemos de dos instalaciones: C/ Polo Sur 2, Torrejón de Ardoz (Madrid) y Avenida Francisco de Aguirre 312, Talavera de la Reina (Toledo).',
  ],
  stats: [
    { valor: '+80', label: 'Vehículos en stock' },
    { valor: '4.5', label: 'Estrellas en Google' },
    { valor: '2009', label: 'Desde' },
    { valor: '2', label: 'Ubicaciones' },
  ],
  imagenUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
}

const statIcons = [Car, Star, Award, MapPin]

export function AboutSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<AboutContent>(defaultContent)

  useEffect(() => {
    setMounted(true)

    async function fetchContent() {
      try {
        const aboutContent = await getAboutContent()
        // Validar que la imagen sea una URL válida de Unsplash, sino usar default
        if (!aboutContent.imagenUrl || !aboutContent.imagenUrl.includes('unsplash.com')) {
          aboutContent.imagenUrl = defaultContent.imagenUrl
        }
        setContent(aboutContent)
      } catch (error) {
        console.error('Error fetching about content:', error)
      }
    }

    fetchContent()
  }, [])

  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  }

  const statsWithIcons = content.stats.map((stat, index) => ({
    icon: statIcons[index] || Car,
    value: stat.valor,
    label: stat.label,
  }))

  return (
    <section className="py-12 md:py-20 bg-white" ref={ref} id="sobre-nosotros">
      <div className="container-custom px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <motion.div
            className="relative"
            variants={headerVariants}
            initial={mounted ? "hidden" : false}
            animate={mounted ? (isInView ? "visible" : "hidden") : false}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src={content.imagenUrl}
                alt="Concesionario MID Car"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-xl font-bold">MID Car</p>
                <p className="text-white/80 text-sm">Torrejón de Ardoz, Madrid</p>
              </div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white rounded-2xl p-6 shadow-xl hidden md:block">
              <p className="text-4xl font-bold">+15</p>
              <p className="text-sm opacity-90">años cuidando de ti</p>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            className="space-y-6"
            variants={headerVariants}
            initial={mounted ? "hidden" : false}
            animate={mounted ? (isInView ? "visible" : "hidden") : false}
            transition={{ delay: 0.2 }}
          >
            <div>
              <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">
                {content.label}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2">
                {content.titulo}
              </h2>
            </div>

            <div className="space-y-4 text-secondary-600">
              <p className="text-lg leading-relaxed">
                {content.parrafoPrincipal}
              </p>

              {/* Expandable content */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-500",
                  isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="space-y-4 pt-2">
                  {content.parrafosExtendidos.map((parrafo, index) => (
                    <p key={index} className="leading-relaxed">
                      {parrafo}
                    </p>
                  ))}
                </div>
              </div>

              {/* Read more button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors group"
              >
                <span>{isExpanded ? 'Leer menos' : 'Leer más sobre nosotros'}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 transition-transform duration-300",
                    isExpanded ? "rotate-180" : ""
                  )}
                />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              {statsWithIcons.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary-50 rounded-xl">
                  <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                  <p className="text-xs text-secondary-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
