'use client'

import { useState } from 'react'
import { Calculator, Check, ArrowRight, Shield, Clock, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

// Datos estructurados para FAQs
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué documentación necesito para financiar un coche?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'DNI/NIE en vigor, última nómina o declaración de la renta, y justificante de domicilio. Si eres autónomo, necesitarás además los últimos recibos de autónomo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo financiar un coche sin entrada?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, ofrecemos financiación hasta el 100% del valor del vehículo, sin necesidad de entrada inicial.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tarda la aprobación de la financiación?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Normalmente la respuesta es en menos de 24 horas hábiles. En muchos casos, podemos darte una respuesta el mismo día.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo cancelar la financiación anticipadamente?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, puedes cancelar tu financiación en cualquier momento sin penalización.',
      },
    },
  ],
}

// Datos estructurados de la página
const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}/financiacion#webpage`,
  url: `${siteUrl}/financiacion`,
  name: 'Financiación de Coches - MID Car Madrid',
  description: 'Financiación de coches sin entrada, hasta 10 años y respuesta en 24 horas.',
  isPartOf: {
    '@id': `${siteUrl}/#website`,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Inicio',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Financiación',
        item: `${siteUrl}/financiacion`,
      },
    ],
  },
}

const benefits = [
  {
    icon: Shield,
    title: 'Sin entrada',
    description: 'Financia el 100% del valor del vehículo',
  },
  {
    icon: Clock,
    title: 'Hasta 10 años',
    description: 'Plazos flexibles adaptados a ti',
  },
  {
    icon: FileCheck,
    title: 'Respuesta rápida',
    description: 'Aprobación en menos de 24 horas',
  },
]

const faqs = [
  {
    question: '¿Qué documentación necesito?',
    answer: 'DNI/NIE en vigor, última nómina o declaración de la renta, y justificante de domicilio. Si eres autónomo, necesitarás además los últimos recibos de autónomo.',
  },
  {
    question: '¿Puedo financiar sin entrada?',
    answer: 'Sí, ofrecemos financiación hasta el 100% del valor del vehículo, sin necesidad de entrada inicial.',
  },
  {
    question: '¿Cuánto tarda la aprobación?',
    answer: 'Normalmente la respuesta es en menos de 24 horas hábiles. En muchos casos, podemos darte una respuesta el mismo día.',
  },
  {
    question: '¿Puedo cancelar anticipadamente?',
    answer: 'Sí, puedes cancelar tu financiación en cualquier momento sin penalización.',
  },
]

// Real financing coefficients from MidCar database
// Monthly payment = financed amount × coefficient
const financingCoefficients: Record<number, number> = {
  24: 0.047854,
  36: 0.033614,
  48: 0.026573,
  60: 0.022416,
  72: 0.019656,
  84: 0.017774,
  96: 0.016417,
  108: 0.015417,
  120: 0.014672,
}

const availableMonths = Object.keys(financingCoefficients).map(Number)

export default function FinanciacionPage() {
  const [vehiclePrice, setVehiclePrice] = useState(15000)
  const [downPayment, setDownPayment] = useState(0)
  const [months, setMonths] = useState(60)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const financedAmount = vehiclePrice - downPayment
  const coefficient = financingCoefficients[months] || 0.022416
  const monthlyPayment = financedAmount > 0
    ? financedAmount * coefficient
    : 0
  const totalCost = monthlyPayment * months

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Datos estructurados */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Financiación a tu medida
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Te ayudamos a financiar tu coche en las mejores condiciones.
            Sin entrada, hasta 10 años y con respuesta en 24 horas.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white rounded-2xl p-6 border border-secondary-100">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-lg text-secondary-900 mb-2">{benefit.title}</h3>
              <p className="text-secondary-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator */}
          <div>
            <div className="bg-white rounded-2xl border border-secondary-100 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900">
                    Calculadora de financiación
                  </h2>
                  <p className="text-secondary-500">Calcula tu cuota mensual</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Vehicle Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-secondary-700">
                      Precio del vehículo
                    </label>
                    <span className="text-sm font-bold text-secondary-900">
                      {formatPrice(vehiclePrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="500"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                             [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-secondary-400 mt-1">
                    <span>5.000€</span>
                    <span>50.000€</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-secondary-700">
                      Entrada inicial
                    </label>
                    <span className="text-sm font-bold text-secondary-900">
                      {formatPrice(downPayment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={vehiclePrice * 0.5}
                    step="500"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-secondary-200 rounded-full appearance-none cursor-pointer
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                             [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full
                             [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-secondary-400 mt-1">
                    <span>0€</span>
                    <span>{formatPrice(vehiclePrice * 0.5)}</span>
                  </div>
                </div>

                {/* Months */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-secondary-700">
                      Plazo de financiación
                    </label>
                    <span className="text-sm font-bold text-secondary-900">
                      {months} meses ({months >= 12 ? `${Math.floor(months / 12)} año${Math.floor(months / 12) > 1 ? 's' : ''}` : ''})
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                    {availableMonths.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                          months === m
                            ? 'bg-primary-600 text-white'
                            : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
                        }`}
                      >
                        {m} m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="mt-8 p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
                <p className="text-sm text-primary-700 mb-2">Tu cuota mensual</p>
                <p className="text-4xl font-bold text-primary-700">
                  {formatPrice(Math.round(monthlyPayment))}<span className="text-lg font-normal">/mes</span>
                </p>
                <div className="mt-4 pt-4 border-t border-primary-200 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-primary-600">Importe financiado</p>
                    <p className="font-semibold text-primary-800">{formatPrice(financedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-primary-600">Coste total</p>
                    <p className="font-semibold text-primary-800">{formatPrice(Math.round(totalCost))}</p>
                  </div>
                </div>
                <p className="text-xs text-primary-600 mt-4">
                  * Cálculo orientativo. La aprobación definitiva está sujeta a estudio financiero.
                </p>
              </div>

              <Link
                href="/contacto"
                className="btn-primary w-full justify-center mt-6"
              >
                Solicitar financiación
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Info & FAQs */}
          <div className="space-y-8">
            {/* Features List */}
            <div className="bg-white rounded-2xl border border-secondary-100 p-8">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                ¿Por qué financiar con nosotros?
              </h2>
              <ul className="space-y-4">
                {[
                  'Sin entrada: financia hasta el 100%',
                  'Plazos de hasta 10 años',
                  'Respuesta en menos de 24 horas',
                  'Sin comisiones de apertura ni cancelación',
                  'Colaboramos con las principales entidades',
                  'Asesoramiento personalizado',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-secondary-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl border border-secondary-100 p-8">
              <h2 className="text-xl font-bold text-secondary-900 mb-6">
                Preguntas frecuentes
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-secondary-100 last:border-0 pb-4 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full flex items-center justify-between text-left py-2"
                    >
                      <span className="font-medium text-secondary-900">{faq.question}</span>
                      <span className="text-primary-600">{openFaq === index ? '−' : '+'}</span>
                    </button>
                    {openFaq === index && (
                      <p className="text-secondary-600 text-sm pb-2 animate-fade-in">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
