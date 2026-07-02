'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ContactInfo } from '@/lib/contact-info'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Turismos', href: '/vehiculos?tipo=turismo' },
  { name: 'Furgonetas', href: '/vehiculos?carroceria=furgoneta' },
  { name: 'Industriales', href: '/vehiculos?carroceria=industrial' },
  { name: 'Financiación', href: '/financiacion' },
  {
    name: 'Nosotros',
    href: '/#sobre-nosotros',
    children: [
      { name: 'Quiénes somos', href: '/#sobre-nosotros' },
      { name: 'Coche a la carta', href: '/coche-a-la-carta' },
      { name: 'Noticias y consejos', href: '/blog' },
    ],
  },
  { name: 'Contacto', href: '/contacto' },
]

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.064 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

interface HeaderProps {
  contactInfo: ContactInfo
}

export function Header({ contactInfo }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    let lastScrolled = window.scrollY > 20
    setIsScrolled(lastScrolled)
    let ticking = false

    const handleScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        const next = window.scrollY > 20
        if (next !== lastScrolled) {
          lastScrolled = next
          setIsScrolled(next)
        }
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const telHref = `tel:${contactInfo.telefono.replace(/\s/g, '')}`
  const waHref = `https://wa.me/34${contactInfo.whatsapp.replace(/\D/g, '').replace(/^34/, '')}`

  const isActive = (href: string) => href === '/' && pathname === '/'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-300',
        isScrolled ? 'shadow-md shadow-secondary-900/5' : 'border-b border-secondary-100'
      )}
      style={{ contain: 'layout paint' }}
    >
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none shrink-0">
            <span className="font-display text-[26px] font-extrabold tracking-tight">
              <span className="text-secondary-950">MID</span>
              <span className="text-primary-600">CAR</span>
            </span>
            <span className="text-[8.5px] font-semibold uppercase tracking-[0.28em] text-secondary-500">
              Vehículos de confianza
            </span>
          </Link>

          {/* Navegación escritorio */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1 px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors rounded-md',
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                  )}
                >
                  {item.name}
                  {item.children && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>

                {item.children && openDropdown === item.name && (
                  <div className="absolute left-0 top-full pt-2 animate-slide-down">
                    <div className="min-w-[210px] rounded-xl border border-secondary-100 bg-white py-2 shadow-xl shadow-secondary-900/10">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-secondary-600 transition-colors hover:bg-secondary-50 hover:text-primary-600"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Teléfono + WhatsApp */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <a href={telHref} className="flex flex-col items-end leading-tight group">
              <span className="flex items-center gap-1.5 text-[15px] font-extrabold text-secondary-900 group-hover:text-primary-600 transition-colors">
                <Phone className="h-4 w-4 text-primary-600" />
                {contactInfo.telefono}
              </span>
              <span className="text-[10.5px] text-secondary-500">
                L-J: {contactInfo.horario.lunesJueves} · V: {contactInfo.horario.viernes}
              </span>
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-secondary-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-secondary-800"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              WhatsApp
            </a>
          </div>

          {/* Botón menú móvil */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="xl:hidden rounded-lg p-2 text-secondary-600 transition-colors hover:bg-secondary-100 lg:ml-2"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="xl:hidden animate-slide-down border-t border-secondary-100 bg-white">
          <div className="container-custom space-y-1 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 font-bold uppercase tracking-wide text-sm text-secondary-700 transition-colors hover:bg-secondary-50"
                >
                  {item.name}
                </Link>
                {item.children && (
                  <div className="space-y-1 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-secondary-500 transition-colors hover:text-primary-600"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex gap-3 border-t border-secondary-100 pt-4">
              <a href={telHref} className="btn-primary flex-1 justify-center">
                <Phone className="h-4 w-4" />
                {contactInfo.telefono}
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary-950 px-4 py-3 font-semibold text-white"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
