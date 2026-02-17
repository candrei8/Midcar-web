import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.midcar.es'

export const metadata: Metadata = {
  title: 'Coche a la Carta | Te Buscamos Tu Coche Ideal - MID Car Madrid',
  description: '¿No encuentras el coche que buscas? En MID Car te lo encontramos al mejor precio. Servicio personalizado de búsqueda de vehículos de ocasión en Madrid.',
  keywords: [
    'coche a la carta',
    'buscar coche segunda mano',
    'encontrar coche ocasión',
    'coche personalizado madrid',
    'busqueda vehiculos',
    'concesionario madrid',
    'midcar coche a medida',
  ],
  alternates: {
    canonical: `${siteUrl}/coche-a-la-carta`,
  },
  openGraph: {
    title: 'Coche a la Carta | Te Buscamos Tu Coche Ideal',
    description: '¿No encuentras el coche que buscas? En MID Car te lo encontramos al mejor precio. Servicio personalizado de búsqueda de vehículos.',
    url: `${siteUrl}/coche-a-la-carta`,
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Coche a la Carta - MID Car',
      },
    ],
  },
}

export default function CocheCartaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
