export interface ContactInfo {
  telefono: string
  whatsapp: string
  email: string
  direccion: {
    calle: string
    cp: string
    ciudad: string
    provincia: string
  }
  horario: {
    lunesJueves: string
    viernes: string
    sabado: string
    domingo: string
  }
  googleMapsUrl: string
  redes: {
    facebook: string
    instagram: string
    youtube: string
    twitter: string
  }
}

export const defaultContactInfo: ContactInfo = {
  telefono: '617 728 087',
  whatsapp: '695055555',
  email: 'ventas@midcar.net',
  direccion: {
    calle: 'C/ Polo Sur 2',
    cp: '28850',
    ciudad: 'Torrejón de Ardoz',
    provincia: 'Madrid',
  },
  horario: {
    lunesJueves: '9:00-14:00 / 15:30-20:00',
    viernes: '9:00-14:00 / 15:30-17:30',
    sabado: 'Cerrado',
    domingo: '11:00-14:00 (con cita previa)',
  },
  googleMapsUrl: 'https://goo.gl/maps/QBEDPvLewMC1NdZ68',
  redes: {
    facebook: 'https://www.facebook.com/midcar.midcar/',
    instagram: 'https://www.instagram.com/midcarmidcar/',
    youtube: 'https://www.youtube.com/@mid7473',
    twitter: 'https://twitter.com/MidcarVehiculos',
  },
}
