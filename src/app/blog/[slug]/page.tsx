import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  getBlogPostBySlug,
  getRelatedPosts,
  getAllPublishedSlugs,
  formatBlogDateShort,
  formatBlogDate,
  estimateReadingTime,
} from '@/lib/blog-service'
import RelatedPosts from '@/components/blog/RelatedPosts'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const revalidate = 3600 // Revalidate every hour

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: 'Artículo no encontrado',
    }
  }

  const title = post.seo_titulo || post.titulo
  const description = post.seo_descripcion || post.extracto || `Todo lo que debes saber y por qué elegir MID CAR`

  return {
    title,
    description,
    keywords: post.seo_keywords || 'Coches, ocasión, venta, vehículos, Madrid, Torrejón de Ardoz',
    authors: [{ name: 'MID Car' }],
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${post.slug}`,
      siteName: 'MID Car',
      locale: 'es_ES',
      type: 'article',
      publishedTime: post.fecha_publicacion || post.created_at,
      modifiedTime: post.updated_at,
      images: post.imagen_principal ? [
        {
          url: post.imagen_principal,
          width: 1200,
          height: 630,
          alt: post.titulo,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.imagen_principal ? [post.imagen_principal] : undefined,
    },
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post, 3)

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.titulo,
    description: post.extracto,
    image: post.imagen_principal,
    datePublished: post.fecha_publicacion || post.created_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'MID Car',
    },
    publisher: {
      '@type': 'Organization',
      name: 'MID Car',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    keywords: post.tags?.join(', '),
    wordCount: post.contenido.split(/\s+/).length,
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
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.titulo,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section with Title */}
        <section className="relative">
          {/* Title bar */}
          <div className="bg-gray-100 py-6 border-b border-gray-200">
            <div className="container mx-auto px-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
                {post.titulo}
              </h1>
            </div>
          </div>

          {/* Hero Image */}
          {post.imagen_principal && (
            <div className="relative h-[300px] md:h-[400px] w-full bg-gray-200">
              <Image
                src={post.imagen_principal}
                alt={post.titulo}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            </div>
          )}
        </section>

        {/* Content Section */}
        <article className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-[#dc2626] transition-colors">Inicio</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-[#dc2626] transition-colors">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">{post.titulo}</span>
            </nav>

            {/* Post metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-sm mb-8 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#dc2626]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span>{formatBlogDate(post.fecha_publicacion || post.created_at)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{estimateReadingTime(post.contenido)} min de lectura</span>
              </div>
              {post.categoria && (
                <Link
                  href={`/blog/categoria/${post.categoria.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#135bec]/10 text-[#135bec] text-xs font-semibold rounded hover:bg-[#135bec] hover:text-white transition-colors"
                >
                  {post.categoria.nombre}
                </Link>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900">
              <MarkdownRenderer content={post.contenido} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Link
                      key={tag}
                      href={`/blog?q=${encodeURIComponent(tag)}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-[#dc2626] hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Compartir</h3>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#1877f2] text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Compartir en Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.titulo)}&url=${encodeURIComponent(`${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Compartir en X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.titulo} - ${siteUrl}/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-[#25d366] text-white rounded-full hover:opacity-90 transition-opacity"
                  aria-label="Compartir en WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-gray-100 rounded-lg text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">¿Buscas tu próximo coche?</h3>
              <p className="text-gray-600 mb-6">
                Explora nuestro catálogo de vehículos de segunda mano con garantía incluida
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/vehiculos"
                  className="inline-block bg-[#dc2626] text-white font-semibold px-6 py-3 rounded hover:bg-[#b91c1c] transition-colors"
                >
                  Ver Vehículos
                </Link>
                <Link
                  href="/contacto"
                  className="inline-block bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded hover:bg-gray-50 transition-colors"
                >
                  Contactar
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <RelatedPosts posts={relatedPosts} />
            )}
          </div>
        </article>
      </main>
    </>
  )
}
