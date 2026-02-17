import Link from 'next/link'
import Image from 'next/image'
import { BlogPost, formatBlogDateShort } from '@/lib/blog-service'

interface RelatedPostsProps {
  posts: BlogPost[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Artículos Relacionados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <article key={post.id} className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="relative h-48 bg-gray-200">
                {post.imagen_principal ? (
                  <Image
                    src={post.imagen_principal}
                    alt={`MID Car coches ocasión Madrid ${post.titulo}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {/* Date Badge */}
                <div className="absolute bottom-0 left-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#00b4d8] opacity-60"></div>
                    <div className="relative z-10 px-3 py-2 flex items-center gap-2 text-white text-xs font-bold">
                      <svg className="w-4 h-4 text-[#dc2626]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{formatBlogDateShort(post.fecha_publicacion || post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <h3 className="font-normal text-gray-800 group-hover:text-[#135bec] transition-colors line-clamp-2 text-sm">
                  {post.titulo}
                </h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
