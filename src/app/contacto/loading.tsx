export default function ContactoLoading() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 text-white py-16">
        <div className="container-custom px-4 md:px-6">
          <div className="h-10 w-48 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-6 w-80 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      <div className="container-custom px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 bg-secondary-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-secondary-200 rounded w-1/3" />
                  <div className="h-4 bg-secondary-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-secondary-200 rounded w-1/2 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-secondary-100 rounded-xl" />
              ))}
              <div className="h-14 bg-primary-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
