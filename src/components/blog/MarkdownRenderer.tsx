'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import Image from 'next/image'
import Link from 'next/link'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2">{children}</h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
        ),

        // Links
        a: ({ href, children }) => {
          const isExternal = href?.startsWith('http')
          if (isExternal) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#135bec] hover:text-[#0d47a1] underline underline-offset-2"
              >
                {children}
              </a>
            )
          }
          return (
            <Link href={href || '/'} className="text-[#135bec] hover:text-[#0d47a1] underline underline-offset-2">
              {children}
            </Link>
          )
        },

        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-gray-700">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-relaxed">{children}</li>
        ),

        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#135bec] pl-4 py-2 my-4 bg-blue-50 rounded-r-lg italic text-gray-700">
            {children}
          </blockquote>
        ),

        // Code
        code: ({ className, children }) => {
          const isCodeBlock = className?.includes('language-')
          if (isCodeBlock) {
            return (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {children}
              </code>
            )
          }
          return (
            <code className="bg-gray-100 text-[#e53e3e] px-1.5 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          )
        },
        pre: ({ children }) => (
          <pre className="mb-4">{children}</pre>
        ),

        // Images
        img: ({ src, alt }) => (
          <figure className="my-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
              {src && (
                <Image
                  src={src}
                  alt={alt || ''}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              )}
            </div>
            {alt && (
              <figcaption className="text-center text-sm text-gray-500 mt-2 italic">
                {alt}
              </figcaption>
            )}
          </figure>
        ),

        // Horizontal rule
        hr: () => (
          <hr className="my-8 border-gray-200" />
        ),

        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto my-6">
            <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-4 py-2 text-gray-700">{children}</td>
        ),

        // Strong & emphasis
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),

        // Strikethrough
        del: ({ children }) => (
          <del className="line-through text-gray-500">{children}</del>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
