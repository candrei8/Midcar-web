'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, LucideIcon } from 'lucide-react'
import { getContactInfo, ContactInfo } from '@/lib/content-service'

const footerLinks = {
  vehiculos: [
    { name: 'Todos los coches', href: '/vehiculos' },
    { name: 'SUV y 4x4', href: '/vehiculos?tipo=suv' },
    { name: 'Berlinas', href: '/vehiculos?tipo=berlina' },
    { name: 'Furgonetas', href: '/vehiculos?tipo=furgoneta' },
    { name: 'Híbridos y eléctricos', href: '/vehiculos?combustible=hibrido' },
  ],
  servicios: [
    { name: 'Coches de segunda mano', href: '/vehiculos' },
    { name: 'Financiar coches ocasión', href: '/financiacion' },
    { name: 'Noticias y consejos', href: '/blog' },
    { name: 'Quiénes Somos', href: '/#sobre-nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ],
}

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
    facebook: 'https://www.facebook.com/midcar.midcar/',
    instagram: 'https://www.instagram.com/midcarmidcar/',
    youtube: 'https://www.youtube.com/@mid7473',
    twitter: 'https://twitter.com/MidcarVehiculos',
  },
}

interface SocialLink {
  name: string
  icon: LucideIcon
  href: string
}

export function Footer() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo)

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        const data = await getContactInfo()
        setContactInfo(data)
      } catch (error) {
        console.error('Error fetching contact info:', error)
      }
    }

    fetchContactInfo()
  }, [])

  const socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: Facebook, href: contactInfo.redes.facebook },
    { name: 'Instagram', icon: Instagram, href: contactInfo.redes.instagram },
    { name: 'YouTube', icon: Youtube, href: contactInfo.redes.youtube },
    { name: 'Twitter', icon: Twitter, href: contactInfo.redes.twitter },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-10 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">MC</span>
              </div>
              <div>
                <h2 className="text-xl font-bold font-display">MID Car</h2>
                <p className="text-sm text-secondary-400">Vehículos de confianza</p>
              </div>
            </Link>
            <p className="text-secondary-400 mb-6 max-w-sm">
              Más de 15 años siendo el concesionario de segunda mano de confianza en Madrid.
              Vehículos certificados, garantizados y al mejor precio.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href={`tel:${contactInfo.telefono.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>{contactInfo.telefono}</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>{contactInfo.email}</span>
              </a>
              <a
                href={contactInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{contactInfo.direccion.calle}, {contactInfo.direccion.cp}<br />{contactInfo.direccion.ciudad}, {contactInfo.direccion.provincia}</span>
              </a>
              <div className="flex items-start gap-3 text-secondary-300">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>L-J: {contactInfo.horario.lunesJueves}</p>
                  <p>V: {contactInfo.horario.viernes} | D: {contactInfo.horario.domingo}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center
                           hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Vehículos</h3>
            <ul className="space-y-2">
              {footerLinks.vehiculos.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-white">Servicios</h3>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-400 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-400">
            <p>&copy; 2009-{new Date().getFullYear()} MID Car - Todos los derechos reservados</p>
            <p>
              Financiado por la Unión Europea - Next Generation EU
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
