import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getBlogPosts,
  getBlogCategories,
  getBlogCategoryBySlug,
  getLatestPosts,
  getPopularTags,
  getPopularBrands,
  getPopularModels,
  getAllActiveCategorySlugs
} from '@/lib/blog-service'
import BlogCard from '@/components/blog/BlogCard'
import BlogSidebar from '@/components/blog/BlogSidebar'
import Pagination from '@/components/blog/Pagination'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const revalidate = 3600

interface CategoryPageProps {
  params: Promise<{ cat: string }>
  searchParams: Promise<{ pagina?: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllActiveCategorySlugs()
  return slugs.map(cat => ({ cat }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { cat } = await params
  const category = await getBlogCategoryBySlug(cat)

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    }
  }

  return {
    title: `${category.nombre} - Blog MID Car`,
    description: category.descripcion || `Artículos sobre ${category.nombre} en el blog de MID Car. Consejos, guías y noticias.`,
    openGraph: {
      title: `${category.nombre} - Blog MID Car`,
      description: category.descripcion || `Artículos sobre ${category.nombre}`,
      url: `${siteUrl}/blog/categoria/${category.slug}`,
      siteName: 'MID Car',
      locale: 'es_ES',
      type: 'website',
    },
    alternates: {
      canonical: `${siteUrl}/blog/categoria/${category.slug}`,
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { cat } = await params
  const { pagina } = await searchParams
  const currentPage = Number(pagina) || 1

  const category = await getBlogCategoryBySlug(cat)

  if (!category) {
    notFound()
  }

  // Fetch data in parallel
  const [postsResult, categories, latestPosts, popularTags, popularBrands, popularModels] = await Promise.all([
    getBlogPosts({
      page: currentPage,
      limit: 9,
      categoria_slug: cat,
    }),
    getBlogCategories(),
    getLatestPosts(5),
    getPopularTags(8),
    getPopularBrands(8),
    getPopularModels(6),
  ])

  const { posts, total, totalPages } = postsResult

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
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
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.nombre,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-[#135bec] to-[#0d47a1] text-white py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <nav className="text-blue-200 text-sm mb-4">
                <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                <span className="mx-2">/</span>
                <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                <span className="mx-2">/</span>
                <span className="text-white">{category.nombre}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {category.nombre}
              </h1>
              {category.descripcion && (
                <p className="text-xl text-blue-100">
                  {category.descripcion}
                </p>
              )}
              <p className="text-blue-200 mt-4">
                {total} {total === 1 ? 'artículo' : 'artículos'}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {posts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl={`/blog/categoria/${cat}`}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay artículos</h3>
                  <p className="text-gray-500 mb-4">
                    Todavía no hay artículos en esta categoría
                  </p>
                  <Link
                    href="/blog"
                    className="inline-block text-[#135bec] hover:underline font-medium"
                  >
                    ← Ver todos los artículos
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar
                categories={categories}
                latestPosts={latestPosts}
                popularTags={popularTags}
                popularBrands={popularBrands}
                popularModels={popularModels}
                currentCategorySlug={cat}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
