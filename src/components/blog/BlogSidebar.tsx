import Link from 'next/link'
import {
  BlogCategory,
  BlogPost,
  PopularBrand,
  PopularModel,
  formatBlogDate,
  slugify
} from '@/lib/blog-service'

interface BlogSidebarProps {
  categories: BlogCategory[]
  latestPosts: BlogPost[]
  popularTags: string[]
  popularBrands?: PopularBrand[]
  popularModels?: PopularModel[]
  currentCategorySlug?: string
}

export default function BlogSidebar({
  categories,
  latestPosts,
  popularTags,
  popularBrands = [],
  popularModels = [],
  currentCategorySlug
}: BlogSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Search */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">Buscar</h3>
        <form action="/blog" method="get">
          <div className="relative">
            <input
              type="text"
              name="q"
              placeholder="Buscar artículos..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#135bec] focus:border-transparent"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Categorías</h3>
          <ul className="space-y-1">
            <li>
              <Link
                href="/blog"
                className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                  !currentCategorySlug
                    ? 'bg-[#135bec] text-white'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>Todos los artículos</span>
              </Link>
            </li>
            {categories.map(category => (
              <li key={category.id}>
                <Link
                  href={`/blog/categoria/${category.slug}`}
                  className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
                    currentCategorySlug === category.slug
                      ? 'bg-[#135bec] text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span>{category.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Latest Posts */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Últimos Artículos</h3>
          <ul className="space-y-4">
            {latestPosts.map(post => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group flex gap-3">
                  {post.imagen_principal ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={post.imagen_principal}
                        alt={post.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#135bec] transition-colors line-clamp-2">
                      {post.titulo}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatBlogDate(post.fecha_publicacion || post.created_at)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Etiquetas</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Link
                key={tag}
                href={`/blog?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[#135bec] hover:text-white transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Brands - Dynamic from inventory */}
      {popularBrands.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Marcas en Stock</h3>
          <div className="flex flex-wrap gap-2">
            {popularBrands.map(({ marca, count }) => (
              <Link
                key={marca}
                href={`/vehiculos?marca=${slugify(marca)}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#135bec] text-sm rounded-full hover:bg-[#135bec] hover:text-white transition-colors"
              >
                <span>{marca}</span>
                <span className="text-xs opacity-75">({count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Models - Dynamic from inventory */}
      {popularModels.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Modelos Populares</h3>
          <ul className="space-y-2">
            {popularModels.map(({ marca, modelo, count }) => (
              <li key={`${marca}-${modelo}`}>
                <Link
                  href={`/vehiculos?marca=${slugify(marca)}`}
                  className="flex items-center justify-between text-gray-700 hover:text-[#135bec] text-sm transition-colors py-1"
                >
                  <span>{marca} {modelo}</span>
                  <span className="text-xs text-gray-400">({count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-br from-[#135bec] to-[#0d47a1] rounded-2xl p-6 text-white">
        <h3 className="font-bold text-xl mb-2">¿Buscas un coche?</h3>
        <p className="text-blue-100 text-sm mb-4">
          Explora nuestro catálogo con garantía de 12 meses incluida.
        </p>
        <Link
          href="/vehiculos"
          className="block w-full text-center bg-white text-[#135bec] font-semibold py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Ver Vehículos
        </Link>
      </div>

      {/* Contact CTA */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-2">¿No encuentras lo que buscas?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Te ayudamos a encontrar el coche perfecto para ti.
        </p>
        <Link
          href="/coche-a-la-carta"
          className="block w-full text-center bg-[#ff6b35] text-white font-semibold py-2.5 rounded-lg hover:bg-[#e55a2b] transition-colors"
        >
          Coche a la Carta
        </Link>
      </div>
    </aside>
  )
}
