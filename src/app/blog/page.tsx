import { Metadata } from 'next'
import { getBlogPosts } from '@/lib/blog-service'
import BlogCard from '@/components/blog/BlogCard'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'El Blog MIDCar - Noticias, guías y consejos de coches ocasión',
    description: 'Lee nuestro blog y entérate de las últimas novedades sobre coches de segunda mano y de ocasión.',
    keywords: 'Coches, ocasión, venta, vehículos, Madrid, Torrejón de Ardoz',
    openGraph: {
      title: 'El Blog MIDCar - Noticias, guías y consejos de coches ocasión',
      description: 'Lee nuestro blog y entérate de las últimas novedades sobre coches de segunda mano y de ocasión.',
      url: `${siteUrl}/blog`,
      siteName: 'MID Car',
      locale: 'es_ES',
      type: 'article',
    },
  }
}

export default async function BlogPage() {
  // Fetch all posts (no pagination in old site)
  const { posts } = await getBlogPosts({
    page: 1,
    limit: 100, // Get all posts like old site
  })

  // JSON-LD for Blog
  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'El Blog MIDCar',
    description: 'Noticias, guías y consejos de coches de ocasión',
    url: `${siteUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'MID Car',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    blogPost: posts.slice(0, 10).map(post => ({
      '@type': 'BlogPosting',
      headline: post.titulo,
      description: post.extracto,
      url: `${siteUrl}/blog/${post.slug}`,
      datePublished: post.fecha_publicacion,
      author: {
        '@type': 'Organization',
        name: post.autor || 'MID Car',
      },
    })),
  }

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
        name: 'Noticias y consejos',
        item: `${siteUrl}/blog`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section - Matching old MidCar style */}
        <section className="relative bg-gray-100 py-12 md:py-16 overflow-hidden">
          {/* Background pattern with faded text */}
          <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap items-center justify-center text-[120px] font-black text-gray-900 leading-none tracking-tighter whitespace-nowrap">
              TRADICIONAL PROFESIONAL CALIDAD OCASIÓN MADRID TRADICIONAL PROFESIONAL CALIDAD OCASIÓN MADRID
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <a href="/" className="hover:text-[#dc2626] transition-colors">Inicio</a>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Noticias y consejos</span>
            </nav>

            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Noticias y consejos
              </h1>
              <p className="text-lg md:text-xl text-[#dc2626] max-w-3xl mx-auto">
                Últimas novedades del sector automovilístico y de vehículos de ocasión
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {posts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay artículos</h3>
                <p className="text-gray-500">
                  Pronto publicaremos contenido interesante. ¡Vuelve pronto!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}
