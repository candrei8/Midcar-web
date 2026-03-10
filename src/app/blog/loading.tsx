export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-gradient-to-br from-secondary-900 to-secondary-800 py-12">
        <div className="container-custom px-4 md:px-6">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-3" />
          <div className="h-5 w-96 bg-white/5 rounded animate-pulse" />
        </div>
      </div>
      <div className="container-custom px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[16/9] bg-secondary-200" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-secondary-100 rounded w-1/4" />
                <div className="h-6 bg-secondary-200 rounded w-3/4" />
                <div className="h-4 bg-secondary-100 rounded w-full" />
                <div className="h-4 bg-secondary-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
