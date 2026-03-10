import Link from 'next/link'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube, Twitter, LucideIcon } from 'lucide-react'
import type { ContactInfo } from '@/lib/contact-info'

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

interface SocialLink {
  name: string
  icon: LucideIcon
  href: string
}

interface FooterProps {
  contactInfo: ContactInfo
}

export function Footer({ contactInfo }: FooterProps) {
  const socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: Facebook, href: contactInfo.redes.facebook },
    { name: 'Instagram', icon: Instagram, href: contactInfo.redes.instagram },
    { name: 'YouTube', icon: Youtube, href: contactInfo.redes.youtube },
    { name: 'Twitter', icon: Twitter, href: contactInfo.redes.twitter },
  ]

  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container-custom py-10 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
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

            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

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

      <div className="border-t border-secondary-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-400">
            <p>&copy; 2009-{new Date().getFullYear()} MID Car - Todos los derechos reservados</p>
            <p>Financiado por la Unión Europea - Next Generation EU</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
