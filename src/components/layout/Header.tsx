'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone, MapPin, Clock, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getContactInfo, ContactInfo } from '@/lib/content-service'

const defaultContactInfo: ContactInfo = {
  telefono: '910 023 016',
  whatsapp: '695055555',
  email: 'ventas@midcar.net',
  direccion: {
    calle: 'C/ Polo Sur 2',
    cp: '28850',
    ciudad: 'Torrejón de Ardoz',
    provincia: 'Madrid',
  },
  horario: {
    lunesJueves: '9:00-14:00 / 16:00-20:30',
    viernes: '9:00-17:00',
    sabado: 'Cerrado',
    domingo: '11:00-14:00',
  },
  googleMapsUrl: 'https://goo.gl/maps/QBEDPvLewMC1NdZ68',
  redes: {
    facebook: '',
    instagram: '',
    youtube: '',
    twitter: '',
  },
}

const navigation = [
  { name: 'Coches de segunda mano', href: '/vehiculos' },
  { name: 'Coche a la carta', href: '/coche-a-la-carta' },
  { name: 'Financiación', href: '/financiacion' },
  {
    name: 'Sobre Nosotros',
    href: '/#sobre-nosotros',
    children: [
      { name: 'Quiénes Somos', href: '/#sobre-nosotros' },
      { name: 'Noticias y consejos', href: '/blog' },
    ]
  },
  { name: 'Contacto', href: '/contacto' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    // Fetch contact info from Supabase
    async function fetchContactInfo() {
      try {
        const info = await getContactInfo()
        setContactInfo(info)
      } catch (error) {
        console.error('Error fetching contact info:', error)
      }
    }
    fetchContactInfo()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary-900 text-white py-2 hidden lg:block">
        <div className="container-custom flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <Phone className="w-4 h-4" />
              <span>{contactInfo.telefono}</span>
            </a>
            <a
              href={contactInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary-400 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>{contactInfo.direccion.calle}, {contactInfo.direccion.ciudad}</span>
            </a>
            <div className="flex items-center gap-2 text-secondary-400">
              <Clock className="w-4 h-4" />
              <span>L-J: {contactInfo.horario.lunesJueves} | V: {contactInfo.horario.viernes} | D: {contactInfo.horario.domingo}</span>
            </div>
          </div>
  {/* Favoritos - deshabilitado temporalmente hasta implementar la página */}
          {/* <div className="flex items-center gap-4">
            <Link href="/favoritos" className="flex items-center gap-2 hover:text-primary-400 transition-colors">
              <Heart className="w-4 h-4" />
              <span>Mis favoritos</span>
            </Link>
          </div> */}
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-secondary-900/5'
            : 'bg-white'
        )}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30">
                  <span className="text-white font-bold text-lg">MC</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-secondary-900 font-display">MID Car</h1>
                <p className="text-xs text-secondary-500">Vehículos de confianza</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
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
                      'flex items-center gap-1 px-4 py-2 text-secondary-600 font-medium rounded-lg',
                      'hover:bg-secondary-50 hover:text-secondary-900 transition-all duration-200'
                    )}
                  >
                    {item.name}
                    {item.children && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown */}
                  {item.children && openDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 animate-slide-down">
                      <div className="bg-white rounded-xl shadow-xl shadow-secondary-900/10 border border-secondary-100 py-2 min-w-[200px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-secondary-600 hover:bg-secondary-50 hover:text-primary-600 transition-colors"
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

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <a href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`} className="btn-primary">
                <Phone className="w-4 h-4" />
                Llámanos
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-secondary-100 bg-white animate-slide-down">
            <div className="container-custom py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-secondary-700 font-medium hover:bg-secondary-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-secondary-500 hover:text-primary-600 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-secondary-100">
                <a href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`} className="btn-primary w-full justify-center">
                  <Phone className="w-4 h-4" />
                  Llámanos
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
