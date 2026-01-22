'use client'

import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter } from 'lucide-react'

const footerLinks = {
  vehiculos: [
    { name: 'Todos los coches', href: '/vehiculos' },
    { name: 'SUV y 4x4', href: '/vehiculos?tipo=suv' },
    { name: 'Berlinas', href: '/vehiculos?tipo=berlina' },
    { name: 'Furgonetas', href: '/vehiculos?tipo=furgoneta' },
    { name: 'Híbridos y eléctricos', href: '/vehiculos?combustible=hibrido' },
  ],
  servicios: [
    { name: 'Financiación', href: '/financiacion' },
    { name: 'Contacto', href: '/contacto' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/midcar.midcar/' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/midcarmidcar/' },
  { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/@mid7473' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/MidcarVehiculos' },
]

export function Footer() {
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
                href="tel:910023016"
                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>910 023 016</span>
              </a>
              <a
                href="mailto:ventas@midcar.net"
                className="flex items-center gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>ventas@midcar.net</span>
              </a>
              <a
                href="https://goo.gl/maps/QBEDPvLewMC1NdZ68"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-secondary-300 hover:text-primary-400 transition-colors"
              >
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>C/ Polo Sur 2, 28850<br />Torrejón de Ardoz, Madrid</span>
              </a>
              <div className="flex items-start gap-3 text-secondary-300">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p>L-J: 9:00-14:00 / 16:00-20:30</p>
                  <p>V: 9:00-17:00 | D: 11:00-14:00</p>
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
