'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronDown, Shield, Check, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getWarrantyContent, WarrantyContent } from '@/lib/content-service'

const defaultContent: WarrantyContent = {
  titulo: '1 año de garantía sin límite de km',
  subtitulo: 'Colaboramos con CONCENTRA GARANTÍAS desde hace más de 11 años.',
  cubierto: [
    'Motor y sus componentes internos',
    'Caja de cambios manual y automática',
    'Sistema de dirección',
    'Sistema de frenos (ABS, servofreno)',
    'Sistema de refrigeración',
    'Sistema eléctrico del motor',
    'Embrague y volante bimasa',
    'Turbocompresor',
    'Sistema de inyección',
    'Diferencial y transmisión',
  ],
  noCubierto: [
    'Elementos de desgaste (pastillas, discos, neumáticos)',
    'Mantenimiento periódico (aceite, filtros)',
    'Carrocería y pintura',
    'Tapicería e interior',
    'Cristales y lunas',
    'Daños por accidente o mal uso',
  ],
}

export function WarrantySection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [mounted, setMounted] = useState(false)
  const [content, setContent] = useState<WarrantyContent>(defaultContent)

  useEffect(() => {
    setMounted(true)

    async function fetchContent() {
      try {
        const warrantyContent = await getWarrantyContent()
        setContent(warrantyContent)
      } catch (error) {
        console.error('Error fetching warranty content:', error)
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

  return (
    <section className="py-12 md:py-20 bg-secondary-50" ref={ref} id="garantia">
      <div className="container-custom px-4 md:px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={headerVariants}
          initial={mounted ? "hidden" : false}
          animate={mounted ? (isInView ? "visible" : "hidden") : false}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {content.titulo}
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              {content.subtitulo} Los seguros que nos ofrecen cubren, a nivel europeo, el <strong className="text-secondary-900">doble
              de elementos mecánicos</strong> que nuestra competencia. Además, la garantía cubre hasta
              <strong className="text-secondary-900"> 2.500€ por avería</strong>, 4 veces más que la garantía usual.
            </p>
          </div>

          {/* Main card */}
          <div className="bg-white rounded-2xl border border-secondary-100 overflow-hidden">
            {/* Summary */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold text-primary-600">12</p>
                  <p className="text-secondary-600">meses de cobertura</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary-600">0</p>
                  <p className="text-secondary-600">límite de kilómetros</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary-600">2x</p>
                  <p className="text-secondary-600">cobertura vs competencia</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-primary-600">2.500€</p>
                  <p className="text-secondary-600">máximo por avería</p>
                </div>
              </div>
            </div>

            {/* Expandable content */}
            <div
              className={cn(
                "overflow-hidden transition-all duration-500 border-t border-secondary-100",
                isExpanded ? "max-h-[2000px]" : "max-h-0 border-t-0"
              )}
            >
              <div className="p-6 md:p-8 space-y-8">
                {/* What's covered */}
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    ¿Qué cubre la garantía?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.cubierto.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <span className="text-secondary-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* What's not covered */}
                <div>
                  <h3 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-500" />
                    ¿Qué NO cubre la garantía?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {content.noCubierto.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-secondary-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How it works */}
                <div className="bg-secondary-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-secondary-900 mb-4">
                    ¿Cómo funciona?
                  </h3>
                  <div className="space-y-4 text-secondary-600">
                    <p>
                      <strong className="text-secondary-900">1. Avería cubierta:</strong> Si tu
                      vehículo sufre una avería cubierta por la garantía, contacta con nosotros
                      o directamente con CONCENTRA GARANTÍAS.
                    </p>
                    <p>
                      <strong className="text-secondary-900">2. Diagnóstico:</strong> Un técnico
                      autorizado diagnosticará la avería y confirmará si está cubierta.
                    </p>
                    <p>
                      <strong className="text-secondary-900">3. Reparación:</strong> La reparación
                      se realiza en un taller autorizado. Tú solo pagas una pequeña franquicia
                      (consultar condiciones).
                    </p>
                    <p>
                      <strong className="text-secondary-900">4. Sin sorpresas:</strong> No hay
                      letra pequeña. Si la avería está cubierta, se repara.
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                  <p className="text-secondary-600 mb-4">
                    ¿Tienes dudas sobre la garantía? Contáctanos y te lo explicamos todo.
                  </p>
                  <a
                    href="tel:910023016"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Llamar: 910 023 016
                  </a>
                </div>
              </div>
            </div>

            {/* Read more button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full p-4 flex items-center justify-center gap-2 text-primary-600 font-semibold hover:bg-secondary-50 transition-colors border-t border-secondary-100"
            >
              <span>{isExpanded ? 'Ver menos' : 'Ver qué cubre la garantía'}</span>
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform duration-300",
                  isExpanded ? "rotate-180" : ""
                )}
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
