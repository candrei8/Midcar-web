'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function VehiclesHeader() {
  return (
    <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white py-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-secondary-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white">Vehículos</span>
        </nav>

        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
          Coches de segunda mano
        </h1>
        <p className="text-lg text-secondary-300 max-w-2xl">
          Explora nuestra selección de vehículos de ocasión certificados.
          Todos con garantía de 12 meses e informe CARFAX gratuito.
        </p>
      </div>
    </div>
  )
}
