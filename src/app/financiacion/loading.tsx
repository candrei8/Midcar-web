export default function FinanciacionLoading() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 py-16">
        <div className="container-custom px-4 md:px-6">
          <div className="h-10 w-64 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-6 w-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      <div className="container-custom px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
              <div className="h-6 bg-secondary-200 rounded w-1/3 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-secondary-100 rounded w-full" />
                <div className="h-4 bg-secondary-100 rounded w-5/6" />
                <div className="h-4 bg-secondary-100 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
