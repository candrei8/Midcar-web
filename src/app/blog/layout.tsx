import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const metadata: Metadata = {
  title: {
    default: 'El Blog MIDCar - Noticias, guías y consejos de coches ocasión',
    template: '%s | Blog MID Car',
  },
  description: 'Lee nuestro blog y entérate de las últimas novedades sobre coches de segunda mano y de ocasión.',
  keywords: 'Coches, ocasión, venta, vehículos, Madrid, Torrejón de Ardoz, blog coches, consejos coches segunda mano',
  authors: [{ name: 'MID Car' }],
  openGraph: {
    title: 'El Blog MIDCar - Noticias, guías y consejos de coches ocasión',
    description: 'Lee nuestro blog y entérate de las últimas novedades sobre coches de segunda mano y de ocasión.',
    url: `${siteUrl}/blog`,
    siteName: 'MID Car',
    locale: 'es_ES',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Blog MIDCar - Noticias, guías y consejos de coches ocasión',
    description: 'Lee nuestro blog y entérate de las últimas novedades sobre coches de segunda mano y de ocasión.',
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
