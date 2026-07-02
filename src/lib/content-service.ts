/**
 * Content Service - Fetches website content from Supabase
 * Allows content to be edited from the dashboard
 */

import { getSupabaseClient, isSupabaseConfigured } from './supabase-lazy'
import type { ContactInfo } from './contact-info'

// ============================================
// Types
// ============================================

export interface WebContent {
  id: string
  seccion: string
  clave: string
  valor: string
  tipo: string
  orden: number
  activo: boolean
}

export interface Testimonial {
  id: string
  nombre: string
  fecha: string
  rating: number
  texto: string
  imagen_url?: string
}

export interface FAQ {
  id: string
  seccion: string
  pregunta: string
  respuesta: string
}

export interface Benefit {
  id: string
  titulo: string
  descripcion: string
  icono?: string
}

// ============================================
// Generic Content Functions
// ============================================

// Get all content for a section
export async function getSectionContent(seccion: string): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {}

  const supabase = await getSupabaseClient()
  if (!supabase) return {}

  const { data, error } = await supabase
    .from('web_content')
    .select('*')
    .eq('seccion', seccion)
    .eq('activo', true)
    .order('orden')

  if (error) {
    console.error(`Error fetching ${seccion} content:`, error)
    return {}
  }

  const content: Record<string, string> = {}
  ;(data || []).forEach(item => {
    content[item.clave] = item.valor
  })

  return content
}

// Get a specific config value
export async function getConfig(clave: string): Promise<string | null> {
  if (!isSupabaseConfigured) return null

  const supabase = await getSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('web_config')
    .select('valor')
    .eq('clave', clave)
    .single()

  if (error) {
    console.error(`Error fetching config ${clave}:`, error)
    return null
  }

  return data?.valor || null
}

// Get multiple config values
export async function getConfigs(claves: string[]): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {}

  const supabase = await getSupabaseClient()
  if (!supabase) return {}

  const { data, error } = await supabase
    .from('web_config')
    .select('clave, valor')
    .in('clave', claves)

  if (error) {
    console.error('Error fetching configs:', error)
    return {}
  }

  const configs: Record<string, string> = {}
  ;(data || []).forEach(item => {
    configs[item.clave] = item.valor
  })

  return configs
}

// Get all config values
export async function getAllConfigs(): Promise<Record<string, string>> {
  if (!isSupabaseConfigured) return {}

  const supabase = await getSupabaseClient()
  if (!supabase) return {}

  const { data, error } = await supabase
    .from('web_config')
    .select('clave, valor')

  if (error) {
    console.error('Error fetching all configs:', error)
    return {}
  }

  const configs: Record<string, string> = {}
  ;(data || []).forEach(item => {
    configs[item.clave] = item.valor
  })

  return configs
}

// ============================================
// Hero Section
// ============================================

export interface HeroContent {
  badge: string
  titulo1: string
  titulo2: string
  subtitulo: string
  ctaPrimario: string
  ctaSecundario: string
  stats: Array<{ valor: string; label: string }>
  precioDesde: string
  garantiaBadge: string
  imagenUrl: string
}

export async function getHeroContent(): Promise<HeroContent> {
  const content = await getSectionContent('hero')

  return {
    badge: content['badge'] || 'Más de 15 años de experiencia',
    titulo1: content['titulo_1'] || 'Vehículos de confianza',
    titulo2: content['titulo_2'] || 'con garantía incluida',
    subtitulo: content['subtitulo'] || 'Desde 2007 ofreciendo vehículos de ocasión certificados, garantizados y al mejor precio.',
    ctaPrimario: content['cta_primario'] || 'Ver vehículos',
    ctaSecundario: content['cta_secundario'] || 'Contactar',
    stats: [
      { valor: content['stat_1_valor'] || '2007', label: content['stat_1_label'] || 'en activo desde' },
      { valor: content['stat_2_valor'] || '1 año', label: content['stat_2_label'] || 'de garantía' },
      { valor: content['stat_3_valor'] || '80+', label: content['stat_3_label'] || 'vehículos en stock' },
    ],
    precioDesde: content['precio_desde'] || '7.900€',
    garantiaBadge: content['garantia_badge'] || 'Garantía 12 meses',
    imagenUrl: content['imagen_url'] || '',
  }
}

// ============================================
// About Section
// ============================================

export interface AboutContent {
  label: string
  titulo: string
  parrafoPrincipal: string
  parrafosExtendidos: string[]
  stats: Array<{ valor: string; label: string }>
  imagenUrl: string
}

export async function getAboutContent(): Promise<AboutContent> {
  const content = await getSectionContent('about')

  const parrafosExtendidos = [
    content['parrafo_2'],
    content['parrafo_3'],
    content['parrafo_4'],
    content['parrafo_5'],
  ].filter(Boolean)

  return {
    label: content['label'] || 'Sobre nosotros',
    titulo: content['titulo'] || 'Tu concesionario de confianza en Madrid',
    parrafoPrincipal: content['parrafo_principal'] || 'En MID Car llevamos desde 2007 vendiendo vehículos de ocasión: unos 230 turismos y vehículos industriales al año, todos con informe CARFAX y garantía de 12 meses.',
    parrafosExtendidos,
    stats: [
      { valor: content['stat_1_valor'] || '+80', label: content['stat_1_label'] || 'Vehículos en stock' },
      { valor: content['stat_2_valor'] || '4.5', label: content['stat_2_label'] || 'Estrellas en Google' },
      { valor: content['stat_3_valor'] || '2007', label: content['stat_3_label'] || 'Desde' },
      { valor: content['stat_4_valor'] || '2', label: content['stat_4_label'] || 'Ubicaciones' },
    ],
    imagenUrl: content['imagen_url'] || '',
  }
}

// ============================================
// Warranty Section
// ============================================

export interface WarrantyContent {
  titulo: string
  subtitulo: string
  cubierto: string[]
  noCubierto: string[]
}

export async function getWarrantyContent(): Promise<WarrantyContent> {
  const content = await getSectionContent('warranty')

  const cubierto: string[] = []
  const noCubierto: string[] = []

  for (let i = 1; i <= 10; i++) {
    if (content[`cubierto_${i}`]) cubierto.push(content[`cubierto_${i}`])
  }

  for (let i = 1; i <= 6; i++) {
    if (content[`no_cubierto_${i}`]) noCubierto.push(content[`no_cubierto_${i}`])
  }

  return {
    titulo: content['titulo'] || '12 meses de garantía en todos nuestros vehículos',
    subtitulo: content['subtitulo'] || 'Garantía Plus: 12 meses con cobertura de hasta 2.500 € por avería. Garantía Premium (vehículos con menos de 120.000 km): cobertura de hasta 6.000 € por avería, similar a la del fabricante. Colaboramos con CONCENTRA GARANTÍAS desde hace más de 11 años.',
    cubierto: cubierto.length > 0 ? cubierto : [
      'Motor y sus componentes internos',
      'Caja de cambios manual y automática',
      'Sistema de dirección',
      'Sistema de frenos',
    ],
    noCubierto: noCubierto.length > 0 ? noCubierto : [
      'Elementos de desgaste',
      'Mantenimiento periódico',
      'Carrocería y pintura',
    ],
  }
}

// ============================================
// CTA Section
// ============================================

export interface CTAContent {
  financiacion: {
    badge: string
    titulo: string
    descripcion: string
    boton: string
  }
  cocheCarta: {
    badge: string
    titulo: string
    descripcion: string
    boton: string
  }
  contacto: {
    titulo: string
    subtitulo: string
  }
}

export async function getCTAContent(): Promise<CTAContent> {
  const content = await getSectionContent('cta')

  return {
    financiacion: {
      badge: content['financiacion_badge'] || 'Financiación flexible',
      titulo: content['financiacion_titulo'] || 'Financiación a tu medida',
      descripcion: content['financiacion_descripcion'] || 'Te ayudamos a financiar el 100% del valor de tu coche.',
      boton: content['financiacion_boton'] || 'Calcular mi financiación',
    },
    cocheCarta: {
      badge: content['coche_carta_badge'] || 'Coche a la carta',
      titulo: content['coche_carta_titulo'] || '¿No encuentras lo que buscas?',
      descripcion: content['coche_carta_descripcion'] || 'Nosotros te lo encontramos al mejor precio.',
      boton: content['coche_carta_boton'] || 'Solicitar coche',
    },
    contacto: {
      titulo: content['contacto_titulo'] || '¿Tienes alguna duda?',
      subtitulo: content['contacto_subtitulo'] || 'Estamos aquí para ayudarte.',
    },
  }
}

// ============================================
// Benefits
// ============================================

export async function getBenefits(): Promise<Benefit[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('web_benefits')
      .select('*')
      .eq('activo', true)
      .order('orden')

    if (error || !data || data.length === 0) return []
    return data
  } catch {
    return []
  }
}

// ============================================
// Testimonials
// ============================================

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  try {
    const { data, error } = await supabase
      .from('web_testimonials')
      .select('*')
      .eq('activo', true)
      .order('orden')

    if (error || !data || data.length === 0) return []
    return data
  } catch {
    return []
  }
}

// ============================================
// FAQs
// ============================================

export async function getFAQs(seccion: string = 'general'): Promise<FAQ[]> {
  if (!isSupabaseConfigured) return []

  const supabase = await getSupabaseClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('web_faqs')
    .select('*')
    .eq('seccion', seccion)
    .eq('activo', true)
    .order('orden')

  if (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }

  return data || []
}

// ============================================
// Contact Info
// ============================================

export async function getContactInfo(): Promise<ContactInfo> {
  const configs = await getAllConfigs()

  return {
    telefono: configs['telefono'] || '617 728 087',
    whatsapp: configs['whatsapp'] || '695055555',
    email: configs['email'] || 'ventas@midcar.net',
    direccion: {
      calle: configs['direccion_calle'] || 'C/ Polo Sur 2',
      cp: configs['direccion_cp'] || '28850',
      ciudad: configs['direccion_ciudad'] || 'Torrejón de Ardoz',
      provincia: configs['direccion_provincia'] || 'Madrid',
    },
    horario: {
      lunesJueves: configs['horario_lunes_jueves'] || '9:00-14:00 / 15:30-20:00',
      viernes: configs['horario_viernes'] || '9:00-14:00 / 15:30-17:30',
      sabado: configs['horario_sabado'] || 'Cerrado',
      domingo: configs['horario_domingo'] || '11:00-14:00 (con cita previa)',
    },
    googleMapsUrl: configs['google_maps_url'] || 'https://goo.gl/maps/QBEDPvLewMC1NdZ68',
    redes: {
      facebook: configs['facebook_url'] || 'https://www.facebook.com/midcar.midcar/',
      instagram: configs['instagram_url'] || 'https://www.instagram.com/midcarmidcar/',
      youtube: configs['youtube_url'] || 'https://www.youtube.com/@mid7473',
      twitter: configs['twitter_url'] || 'https://twitter.com/MidcarVehiculos',
    },
  }
}
