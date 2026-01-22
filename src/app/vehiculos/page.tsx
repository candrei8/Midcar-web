import { Suspense } from 'react'
import { VehiclesCatalog } from '@/components/vehicles/VehiclesCatalog'
import { VehiclesHeader } from '@/components/vehicles/VehiclesHeader'

export const metadata = {
  title: 'Coches de Segunda Mano | MID Car Madrid',
  description: 'Explora nuestra selección de coches de ocasión certificados y garantizados en Madrid. Berlinas, SUV, furgonetas y más.',
}

export default function VehiculosPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <VehiclesHeader />
      <Suspense fallback={<VehiclesCatalogSkeleton />}>
        <VehiclesCatalog />
      </Suspense>
    </div>
  )
}

function VehiclesCatalogSkeleton() {
  return (
    <div className="container-custom py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 h-96 animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-secondary-100 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
        {/* Grid Skeleton */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary-200" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-secondary-200 rounded w-3/4" />
                  <div className="h-7 bg-secondary-200 rounded w-1/2" />
                  <div className="h-4 bg-secondary-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
