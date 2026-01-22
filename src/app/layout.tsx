import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppButton } from '@/components/ui/WhatsAppButton'

export const metadata: Metadata = {
  title: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
  description: 'Tu concesionario de confianza en Torrejón de Ardoz, Madrid. Vehículos de ocasión certificados, garantizados y al mejor precio. Más de 15 años de experiencia.',
  keywords: 'coches segunda mano madrid, coches ocasión torrejón de ardoz, concesionario coches usados, vehículos garantizados',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'MID Car | Concesionario de Coches de Segunda Mano en Madrid',
    description: 'Vehículos de ocasión certificados, garantizados y al mejor precio.',
    type: 'website',
    locale: 'es_ES',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  )
}
