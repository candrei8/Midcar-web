export default function VehiculosLoading() {
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header skeleton */}
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 py-12">
        <div className="container-custom px-4 md:px-6">
          <div className="h-8 w-64 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-5 w-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>

      <div className="container-custom py-6 md:py-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-secondary-100 p-6">
              <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6 animate-pulse" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-12 bg-secondary-100 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </aside>
          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="h-8 bg-secondary-100 rounded w-48 mb-6 animate-pulse" />
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
    </div>
  )
}
