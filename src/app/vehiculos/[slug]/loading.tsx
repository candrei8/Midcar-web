export default function VehicleDetailLoading() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Back link */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-custom px-4 md:px-6 py-4">
          <div className="h-5 w-36 bg-secondary-100 rounded animate-pulse" />
        </div>
      </div>

      <div className="container-custom px-4 md:px-6 py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image gallery skeleton */}
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-secondary-200 rounded-2xl animate-pulse" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-20 h-16 bg-secondary-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="space-y-6">
            <div>
              <div className="h-8 bg-secondary-200 rounded w-3/4 mb-3 animate-pulse" />
              <div className="h-10 bg-secondary-200 rounded w-1/3 mb-2 animate-pulse" />
              <div className="h-5 bg-secondary-100 rounded w-1/4 animate-pulse" />
            </div>

            {/* Specs grid skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-secondary-100 animate-pulse">
                  <div className="w-5 h-5 bg-secondary-200 rounded mb-2" />
                  <div className="h-3 bg-secondary-100 rounded w-2/3 mb-1" />
                  <div className="h-5 bg-secondary-200 rounded w-1/2" />
                </div>
              ))}
            </div>

            {/* CTA skeleton */}
            <div className="space-y-3">
              <div className="h-14 bg-primary-200 rounded-xl animate-pulse" />
              <div className="h-14 bg-green-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
