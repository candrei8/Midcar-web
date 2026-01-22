// Vehicle data from MidCar.net - Real inventory
// Updated: January 19, 2026
// Auto-generated from midcar.net scraping - 92 vehicles total
// Includes: 77 available + 15 reserved

import { getMainVehicleImage } from './vehicleImages'

export interface Vehicle {
  id: string
  slug: string
  title: string
  brand: string
  model: string
  price: number
  originalPrice?: number
  km: number
  year: number
  cv: number
  fuel: 'Diesel' | 'Gasolina' | 'Híbrido' | 'Gas' | string
  transmission: 'Manual' | 'Automático' | string
  bodyType: 'berlina' | 'familiar' | 'suv' | 'monovolumen' | 'furgoneta' | 'industrial' | 'barco' | string
  ivaDeducible: boolean
  onSale: boolean
  label?: 'ECO' | 'C' | 'B' | '0' | string
  images: string[]
  featured?: boolean
  monthlyPayment?: number
}

// Helper to generate image URL - uses the actual image URL from vehicleImages.ts
const getImageUrl = (id: string) => getMainVehicleImage(id)

export const vehicles: Vehicle[] = [
  // Astondoa (Boat)
  {
    id: "2705094259148",
    slug: "astondoa-40-fly-13-metros-2004",
    title: "Astondoa 40 Fly 13 metros",
    brand: "Astondoa",
    model: "40 Fly",
    price: 90000,
    km: 1020,
    year: 2004,
    cv: 720,
    fuel: "Gasolina",
    transmission: "Automático",
    bodyType: "barco",
    ivaDeducible: false,
    onSale: true,
    label: "C",
    images: [getImageUrl("2705094259148")]
  },

  // BMW
  {
    id: "1410144949506",
    slug: "bmw-530da-265cv-luxury-line-2018",
    title: "BMW 530dA 265Cv Luxury Line Etiqueta C Nacional 1Dueño",
    brand: "BMW",
    model: "530dA Luxury Line",
    price: 31950,
    originalPrice: 32950,
    km: 159000,
    year: 2018,
    cv: 265,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    featured: true,
    images: [getImageUrl("1410144949506")]
  },

  // Citroën Berlingo
  {
    id: "2711105256099",
    slug: "citroen-berlingo-15bluehdi-100cv-2022",
    title: "Citroën Berlingo 1.5BlueHDi 100Cv 3 Plazas",
    brand: "Citroën",
    model: "Berlingo 1.5 BlueHDi 100Cv",
    price: 16600,
    km: 81000,
    year: 2022,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2711105256099")]
  },
  {
    id: "2711103440670",
    slug: "citroen-berlingo-15bluehdi-130cv-2021",
    title: "Citroën Berlingo 1.5BlueHDi 130Cv con pantalla",
    brand: "Citroën",
    model: "Berlingo 1.5 BlueHDi 130Cv",
    price: 14950,
    km: 116000,
    year: 2021,
    cv: 130,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2711103440670")]
  },
  {
    id: "0608144136697",
    slug: "citroen-berlingo-talla-m-15bluehdi-100cv-2020",
    title: "Citroën Berlingo Talla M 1.5 BlueHDi 100 S&S FEEL",
    brand: "Citroën",
    model: "Berlingo Talla M",
    price: 17950,
    km: 72000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "monovolumen",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0608144136697")]
  },

  // Citroën C5
  {
    id: "2803163035250",
    slug: "citroen-c5-exclusive-30hdi-240cv-2010",
    title: "Citroën C5 Exclusive 3.0 HDI 240CV AT6",
    brand: "Citroën",
    model: "C5 Exclusive 3.0 HDI",
    price: 13950,
    km: 149000,
    year: 2010,
    cv: 240,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2803163035250")]
  },

  // Citroën Jumpy
  {
    id: "2611185859603",
    slug: "citroen-jumpy-20bluehdi-150cv-2021",
    title: "Citroën Jumpy 2.0BlueHDi 150Cv 6/9 Plazas",
    brand: "Citroën",
    model: "Jumpy 2.0 BlueHDi",
    price: 22950,
    km: 142000,
    year: 2021,
    cv: 150,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2611185859603")]
  },

  // Dacia Dokker
  {
    id: "0607084143944",
    slug: "dacia-dokker-ambiance-15dci-90cv-2018",
    title: "Dacia Dokker Ambiance 1.5 DCI 90CV",
    brand: "Dacia",
    model: "Dokker Ambiance 1.5 DCI",
    price: 9950,
    km: 91000,
    year: 2018,
    cv: 90,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0607084143944")]
  },
  {
    id: "2310193748143",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2021",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 12950,
    km: 118000,
    year: 2021,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2310193748143")]
  },
  {
    id: "1401154844202",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2020",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 12900,
    km: 114000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("1401154844202")]
  },

  // Dacia Lodgy
  {
    id: "1308091003359",
    slug: "dacia-lodgy-16sce-lpg-stepway-7plazas-2019",
    title: "Dacia Lodgy 1.6 SCe Gasolina/LPG Stepway 7 Plazas",
    brand: "Dacia",
    model: "Lodgy Stepway GLP",
    price: 15950,
    km: 102000,
    year: 2019,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "monovolumen",
    ivaDeducible: false,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("1308091003359")]
  },

  // Fiat Fiorino
  {
    id: "1210214831834",
    slug: "fiat-fiorino-13multijet-2019",
    title: "Fiat Fiorino 1.3Multijet Etiqueta C IVA y Garantía Incl",
    brand: "Fiat",
    model: "Fiorino 1.3 Multijet",
    price: 8900,
    km: 106000,
    year: 2019,
    cv: 80,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1210214831834")]
  },
  {
    id: "0412175725166",
    slug: "fiat-fiorino-13mjet-80cv-2018",
    title: "Fiat Fiorino 1.3Mjet E6+ 80Cv IVA y garantía Incl",
    brand: "Fiat",
    model: "Fiorino 1.3 Mjet",
    price: 7900,
    km: 98000,
    year: 2018,
    cv: 80,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0412175725166")]
  },

  // Ford Focus
  {
    id: "1607165900588",
    slug: "ford-focus-20ecoblue-150cv-automatico-2020",
    title: "Ford Focus 2.0EcoBlue 150Cv Automático Nacional IVA Incl",
    brand: "Ford",
    model: "Focus 2.0 EcoBlue",
    price: 13950,
    km: 246000,
    year: 2020,
    cv: 150,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1607165900588")]
  },
  {
    id: "2603171952561",
    slug: "ford-focus-sb-titanium-15ecoblue-120cv-2021",
    title: "Ford Focus SB Titanium 1.5EcoBlue 120Cv 6Velocidades",
    brand: "Ford",
    model: "Focus Sportbreak Titanium",
    price: 14950,
    km: 110000,
    year: 2021,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2603171952561")]
  },
  {
    id: "2602175401805",
    slug: "ford-focus-sb-15ecoblue-120cv-2020",
    title: "Ford Focus SB 1.5EcoBlue 120Cv 5 Puertas",
    brand: "Ford",
    model: "Focus Sportbreak",
    price: 12950,
    km: 129000,
    year: 2020,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2602175401805")]
  },

  // Ford Grand Tourneo Connect
  {
    id: "0412182038327",
    slug: "ford-grand-tourneo-connect-7plazas-2019",
    title: "Ford Grand Tourneo Connect 5/7 Plazas Turismo IVA Incl",
    brand: "Ford",
    model: "Grand Tourneo Connect",
    price: 17600,
    km: 147000,
    year: 2019,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "monovolumen",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0412182038327")]
  },

  // Ford Transit
  {
    id: "2910121406627",
    slug: "ford-transit-350-20tdci-l3h2-trail-2021",
    title: "Ford Transit 350 2.0TDCi L3H2 Van Trail 130Cv",
    brand: "Ford",
    model: "Transit 350 L3H2 Trail",
    price: 32500,
    km: 97000,
    year: 2021,
    cv: 130,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "industrial",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2910121406627")]
  },
  {
    id: "1310173908369",
    slug: "ford-transit-l4h3-van-trend-rwd-170cv-2024",
    title: "Ford Transit L4H3 Van Trend RWD 170Cv Nacional IVA Incl",
    brand: "Ford",
    model: "Transit L4H3 Trend",
    price: 27950,
    km: 170000,
    year: 2024,
    cv: 170,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "industrial",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1310173908369")]
  },

  // Ford Transit Connect
  {
    id: "0611151202018",
    slug: "ford-transit-connect-15tdci-2017",
    title: "Ford Transit Connect 1.5TDCi",
    brand: "Ford",
    model: "Transit Connect",
    price: 11950,
    originalPrice: 12450,
    km: 130000,
    year: 2017,
    cv: 75,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0611151202018")]
  },
  {
    id: "2010090600150",
    slug: "ford-transit-connect-l2-210-15ecoblue-2020",
    title: "Ford Transit Connect L2 210 1.5EcoBlue Trend Automático 120Cv",
    brand: "Ford",
    model: "Transit Connect L2 Trend",
    price: 17950,
    km: 132000,
    year: 2020,
    cv: 120,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2010090600150")]
  },
  {
    id: "0712191648012",
    slug: "ford-transit-connect-van-15ecoblue-trend-210-2021",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 210 L2",
    brand: "Ford",
    model: "Transit Connect Van Trend",
    price: 12950,
    km: 150000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0712191648012")]
  },
  {
    id: "1207211827018",
    slug: "ford-transit-connect-van-15ecoblue-trend-240-2020",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 240",
    brand: "Ford",
    model: "Transit Connect Van Trend 240",
    price: 15500,
    km: 109000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1207211827018")]
  },
  {
    id: "2905090824063",
    slug: "ford-transit-connect-van-15ecoblue-trend-240-2019",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 240 L2",
    brand: "Ford",
    model: "Transit Connect Van Trend 240",
    price: 15950,
    km: 145000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2905090824063")]
  },
  {
    id: "3005093435508",
    slug: "ford-transit-connect-van-15ecoblue-trend-210-2019-a",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 210 100Cv",
    brand: "Ford",
    model: "Transit Connect Van Trend",
    price: 15950,
    km: 155000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("3005093435508")]
  },
  {
    id: "2412102803492",
    slug: "ford-transit-connect-van-15ecoblue-trend-210-2019-b",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 210",
    brand: "Ford",
    model: "Transit Connect Van Trend",
    price: 16950,
    km: 129000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2412102803492")]
  },
  {
    id: "1308080841866",
    slug: "ford-transit-connect-van-15ecoblue-trend-240-2020-b",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 240 100Cv",
    brand: "Ford",
    model: "Transit Connect Van Trend 240",
    price: 15500,
    originalPrice: 15950,
    km: 145000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1308080841866")]
  },
  {
    id: "1408180357360",
    slug: "ford-transit-connect-van-15ecoblue-trend-240-2021",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 240 120Cv",
    brand: "Ford",
    model: "Transit Connect Van Trend 240",
    price: 16950,
    km: 133000,
    year: 2021,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1408180357360")]
  },

  // Ford Transit Courier
  {
    id: "2903214946252",
    slug: "ford-transit-courier-van-15tdci-trend-210-2021",
    title: "Ford Transit Courier Van 1.5 TDCi Trend 210",
    brand: "Ford",
    model: "Transit Courier Trend",
    price: 10950,
    originalPrice: 11950,
    km: 136000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2903214946252")]
  },
  {
    id: "1111173450030",
    slug: "ford-transit-courier-van-15tdci-trend-2021",
    title: "Ford Transit Courier Van 1.5 TDCi Trend",
    brand: "Ford",
    model: "Transit Courier Trend",
    price: 11950,
    km: 120000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1111173450030")]
  },

  // Hyundai IONIQ
  {
    id: "0801211634398",
    slug: "hyundai-ioniq-16gdi-hev-style-2020",
    title: "Hyundai IONIQ 1.6 GDI HEV Style DT Híbrido Techo corredizo",
    brand: "Hyundai",
    model: "IONIQ HEV Style",
    price: 13950,
    km: 189000,
    year: 2020,
    cv: 140,
    fuel: "Híbrido",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("0801211634398")]
  },
  {
    id: "2611184400149",
    slug: "hyundai-ioniq-16gdi-hev-tecno-2021",
    title: "Hyundai IONIQ 1.6 GDI HEV Tecno DCT Híbrido",
    brand: "Hyundai",
    model: "IONIQ HEV Tecno",
    price: 15950,
    km: 160000,
    year: 2021,
    cv: 141,
    fuel: "Híbrido",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2611184400149")]
  },

  // Kia Niro
  {
    id: "1504143933268",
    slug: "kia-niro-16gdi-hibrido-141cv-2019",
    title: "Kia Niro 1.6 GDi Híbrido 141Cv Etiqueta ECO",
    brand: "Kia",
    model: "Niro Híbrido",
    price: 15950,
    km: 114000,
    year: 2019,
    cv: 141,
    fuel: "Híbrido",
    transmission: "Automático",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("1504143933268")]
  },

  // Mercedes Vito
  {
    id: "0612221522671",
    slug: "mercedes-vito-114-20cdi-at-136cv-2020",
    title: "Mercedes Vito 114 2.0CDI AT 136Cv Furgón",
    brand: "Mercedes-Benz",
    model: "Vito 114 CDI",
    price: 24950,
    km: 157000,
    year: 2020,
    cv: 136,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0612221522671")]
  },

  // Opel Corsa
  {
    id: "2103085530402",
    slug: "opel-corsa-14-selective-glp-2018",
    title: "Opel Corsa 1.4 Selective GLP Etiqueta ECO",
    brand: "Opel",
    model: "Corsa Selective GLP",
    price: 10450,
    km: 89000,
    year: 2018,
    cv: 90,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2103085530402")]
  },

  // Peugeot 208
  {
    id: "2310170952008",
    slug: "peugeot-208-15bluehdi-allure-2020",
    title: "Peugeot 208 1.5 BlueHDi Allure Nacional",
    brand: "Peugeot",
    model: "208 Allure",
    price: 13950,
    km: 137000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2310170952008")]
  },
  {
    id: "2309204646271",
    slug: "peugeot-208-15bluehdi-100cv-2021",
    title: "Peugeot 208 1.5 BlueHDi 100Cv",
    brand: "Peugeot",
    model: "208 BlueHDi",
    price: 13450,
    km: 90000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2309204646271")]
  },
  {
    id: "1601205117727",
    slug: "peugeot-208-active-16bluehdi-100cv-2019",
    title: "Peugeot 208 Active 1.6 BlueHDi 100Cv",
    brand: "Peugeot",
    model: "208 Active",
    price: 11950,
    km: 86000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1601205117727")]
  },
  {
    id: "0702165249659",
    slug: "peugeot-208-signature-15bluehdi-100cv-2019",
    title: "Peugeot 208 Signature 1.5 BlueHDi 100Cv",
    brand: "Peugeot",
    model: "208 Signature",
    price: 11950,
    km: 90000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0702165249659")]
  },

  // Toyota Proace
  {
    id: "0709102810099",
    slug: "toyota-proace-van-media-15d-business-2021",
    title: "Toyota Proace Van Media 1.5D Business",
    brand: "Toyota",
    model: "Proace Van Business",
    price: 16950,
    km: 100000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0709102810099")]
  },

  // Volkswagen Caddy
  {
    id: "3006164538644",
    slug: "volkswagen-caddy-profesional-14tgi-gnc-2017",
    title: "Volkswagen Caddy Profesional 1.4 TGI GNC",
    brand: "Volkswagen",
    model: "Caddy Profesional TGI",
    price: 10950,
    km: 70000,
    year: 2017,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("3006164538644")]
  },
  {
    id: "2412120339759",
    slug: "volkswagen-caddy-profesional-furgon-14tgi-2020",
    title: "Volkswagen Caddy Profesional Furgón 1.4 TGI 81kW",
    brand: "Volkswagen",
    model: "Caddy Profesional Furgón TGI",
    price: 12950,
    km: 89000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2412120339759")]
  },
  {
    id: "3108085742568",
    slug: "volkswagen-caddy-profesional-kombi-20tdi-2020",
    title: "Volkswagen Caddy Profesional Kombi 2.0TDi BMT 4P",
    brand: "Volkswagen",
    model: "Caddy Profesional Kombi TDI",
    price: 14950,
    km: 199000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("3108085742568")]
  },
  {
    id: "2209175601848",
    slug: "volkswagen-caddy-profesional-maxi-furgon-14tgi-2020-a",
    title: "Volkswagen Caddy Profesional Maxi Furgón 1.4 TGI",
    brand: "Volkswagen",
    model: "Caddy Profesional Maxi Furgón TGI",
    price: 17950,
    km: 70000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2209175601848")]
  },
  {
    id: "0709095822962",
    slug: "volkswagen-caddy-profesional-maxi-furgon-14tgi-2020-b",
    title: "Volkswagen Caddy Profesional Maxi Furgón 1.4 TGI",
    brand: "Volkswagen",
    model: "Caddy Profesional Maxi Furgón TGI",
    price: 16950,
    km: 80000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("0709095822962")]
  },

  // Volkswagen Transporter
  {
    id: "0911211710024",
    slug: "volkswagen-transporter-20tdi-150cv-dsg-2021",
    title: "Volkswagen Transporter 2.0TDI 150Cv DSG Largo",
    brand: "Volkswagen",
    model: "Transporter Largo DSG",
    price: 29950,
    km: 117000,
    year: 2021,
    cv: 150,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0911211710024")]
  },
  {
    id: "0607112959325",
    slug: "volkswagen-transporter-kombi-20tdi-102cv-2020",
    title: "Volkswagen Transporter Kombi 2.0TDI 102Cv",
    brand: "Volkswagen",
    model: "Transporter Kombi",
    price: 22950,
    km: 138000,
    year: 2020,
    cv: 102,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0607112959325")]
  },

  // Volkswagen Crafter
  {
    id: "0707091515235",
    slug: "volkswagen-crafter-20tdi-140cv-l3h3-2021",
    title: "Volkswagen Crafter 2.0TDI 140Cv L3H3",
    brand: "Volkswagen",
    model: "Crafter L3H3",
    price: 27500,
    km: 120000,
    year: 2021,
    cv: 140,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "industrial",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0707091515235")]
  },

  // Volkswagen T-Cross
  {
    id: "2810212147798",
    slug: "volkswagen-t-cross-10tsi-110cv-2020",
    title: "Volkswagen T-Cross 1.0TSI 110Cv Life",
    brand: "Volkswagen",
    model: "T-Cross Life",
    price: 17950,
    km: 62000,
    year: 2020,
    cv: 110,
    fuel: "Gasolina",
    transmission: "Manual",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: []
  },

  // Volvo XC40
  {
    id: "1811165157199",
    slug: "volvo-xc40-t3-156cv-2018",
    title: "Volvo XC40 T3 156Cv",
    brand: "Volvo",
    model: "XC40 T3",
    price: 17950,
    km: 170000,
    year: 2018,
    cv: 156,
    fuel: "Gasolina",
    transmission: "Manual",
    bodyType: "suv",
    ivaDeducible: false,
    onSale: true,
    label: "C",
    images: [getImageUrl("1811165157199")]
  },

  // Volkswagen Passat
  {
    id: "2405103403241",
    slug: "vw-passat-20tdi-dsg7-2018",
    title: "VW Passat 2.0TDi DSG7 Nacional",
    brand: "Volkswagen",
    model: "Passat 2.0 TDI DSG",
    price: 18950,
    km: 137000,
    year: 2018,
    cv: 150,
    fuel: "Diesel",
    transmission: "Automático",
    bodyType: "berlina",
    ivaDeducible: false,
    onSale: true,
    label: "C",
    images: [getImageUrl("2405103403241")]
  },

  // Dacia Dokker RESERVADO
  {
    id: "0610142948687",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2020-reservado",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP RESERVADO",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 12950,
    km: 103000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("0610142948687")]
  },
  {
    id: "0610144625509",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2020-reservado-2",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP RESERVADO",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 12950,
    km: 105000,
    year: 2020,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("0610144625509")]
  },

  // ============================================
  // NEW VEHICLES - January 2026 Scraping
  // ============================================

  // Peugeot 3008
  {
    id: "1012180451228",
    slug: "peugeot-3008-15bluehdi-130cv-allure-2020",
    title: "Peugeot 3008 1.5 BlueHDi 130CV S&S Allure",
    brand: "Peugeot",
    model: "3008 Allure",
    price: 17500,
    km: 126000,
    year: 2020,
    cv: 130,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1012180451228")]
  },

  // Peugeot 308
  {
    id: "2705145300282",
    slug: "peugeot-308-15bluehdi-style-130cv-2019",
    title: "Peugeot 308 1.5BlueHDi Style 130Cv",
    brand: "Peugeot",
    model: "308 Style",
    price: 12500,
    originalPrice: 12950,
    km: 120000,
    year: 2019,
    cv: 130,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: false,
    onSale: true,
    label: "C",
    images: [getImageUrl("2705145300282")]
  },
  {
    id: "1904165332774",
    slug: "peugeot-308-15bluehdi-style-130cv-2019-b",
    title: "Peugeot 308 1.5BlueHDi Style 130Cv",
    brand: "Peugeot",
    model: "308 Style",
    price: 12950,
    km: 124000,
    year: 2019,
    cv: 130,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1904165332774")]
  },
  {
    id: "2412104143698",
    slug: "peugeot-308-allure-bluehdi-auto-eat8-130cv-2021",
    title: "Peugeot 308 Allure BlueHDi Auto S&S EAT8 130Cv",
    brand: "Peugeot",
    model: "308 Allure Auto",
    price: 14800,
    km: 155000,
    year: 2021,
    cv: 130,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2412104143698")]
  },
  {
    id: "0512154342644",
    slug: "peugeot-308-allure-bluehdi-auto-eat8-130cv-2021-b",
    title: "Peugeot 308 Allure BlueHDi Auto S&S EAT8 130Cv",
    brand: "Peugeot",
    model: "308 Allure Auto",
    price: 13950,
    km: 161000,
    year: 2021,
    cv: 130,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0512154342644")]
  },

  // Peugeot 308SW
  {
    id: "1306110847484",
    slug: "peugeot-308sw-bluehdi-2016",
    title: "Peugeot 308SW BlueHDi",
    brand: "Peugeot",
    model: "308SW",
    price: 9950,
    originalPrice: 10950,
    km: 123000,
    year: 2016,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1306110847484")]
  },
  {
    id: "2706222633017",
    slug: "peugeot-308sw-active-pack-bluehdi-130-eat8-2021",
    title: "Peugeot 308SW Active Pack BlueHDi 130 S&S EAT8",
    brand: "Peugeot",
    model: "308SW Active Pack",
    price: 13500,
    originalPrice: 13950,
    km: 154000,
    year: 2021,
    cv: 130,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2706222633017")]
  },
  {
    id: "2706223137043",
    slug: "peugeot-308sw-style-15bluehdi-130cv-auto-2019",
    title: "Peugeot 308SW Style 1.5 BlueHDi 96KW (130CV) Auto",
    brand: "Peugeot",
    model: "308SW Style Auto",
    price: 11500,
    originalPrice: 11950,
    km: 179000,
    year: 2019,
    cv: 130,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2706223137043")]
  },

  // Peugeot 5008
  {
    id: "0607085200332",
    slug: "peugeot-5008-20bluehdi-180cv-allure-eat8-7plazas-2021",
    title: "Peugeot 5008 2.0 BlueHDi 180Cv Allure S&S EAT8 7 Plazas",
    brand: "Peugeot",
    model: "5008 Allure",
    price: 29950,
    km: 73000,
    year: 2021,
    cv: 180,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0607085200332")]
  },
  {
    id: "1303181344902",
    slug: "peugeot-5008-20bluehdi-180cv-gtline-eat8-7plazas-2020",
    title: "Peugeot 5008 2.0 BlueHDi 180Cv GT Line S&S EAT8 7 Plazas",
    brand: "Peugeot",
    model: "5008 GT Line",
    price: 24950,
    km: 118000,
    year: 2020,
    cv: 180,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1303181344902")]
  },

  // Peugeot 508
  {
    id: "2611183144600",
    slug: "peugeot-508-allure-bluehdi-160cv-eat8-2020",
    title: "Peugeot 508 Allure BlueHDi 160Cv S&S EAT8",
    brand: "Peugeot",
    model: "508 Allure",
    price: 18950,
    km: 104000,
    year: 2020,
    cv: 160,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2611183144600")]
  },

  // Peugeot Partner
  {
    id: "3108093817304",
    slug: "peugeot-partner-16bluehdi-l2-100cv-2018",
    title: "Peugeot Partner 1.6BlueHDi L2 100Cv",
    brand: "Peugeot",
    model: "Partner L2",
    price: 12950,
    originalPrice: 14950,
    km: 137000,
    year: 2018,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("3108093817304")]
  },
  {
    id: "1208102017874",
    slug: "peugeot-partner-16bluehdi-l2-100cv-2019",
    title: "Peugeot Partner 1.6BlueHDi L2 100Cv 3 Plazas",
    brand: "Peugeot",
    model: "Partner L2",
    price: 14950,
    km: 103000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1208102017874")]
  },
  {
    id: "0506105541733",
    slug: "peugeot-partner-furgon-confort-l2-16bluehdi-100cv-2018",
    title: "Peugeot Partner Furgon Confort L2 1.6BlueHDI 100Cv",
    brand: "Peugeot",
    model: "Partner Furgon Confort",
    price: 10950,
    originalPrice: 11950,
    km: 120000,
    year: 2018,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0506105541733")]
  },
  {
    id: "1111180056441",
    slug: "peugeot-partner-premium-16bluehdi-100cv-2020",
    title: "Peugeot Partner Premium 1.6 BlueHDi 100Cv 3 Plazas",
    brand: "Peugeot",
    model: "Partner Premium",
    price: 14950,
    km: 88000,
    year: 2020,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1111180056441")]
  },
  {
    id: "0911164040851",
    slug: "peugeot-partner-premium-16bluehdi-75cv-2019",
    title: "Peugeot Partner Premium 1.6 BlueHDi 75Cv",
    brand: "Peugeot",
    model: "Partner Premium",
    price: 11450,
    km: 67000,
    year: 2019,
    cv: 75,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0911164040851")]
  },
  {
    id: "0406173434878",
    slug: "peugeot-partner-premium-16bluehdi-100cv-2019",
    title: "Peugeot Partner Premium 1.6BlueHDI 100Cv 3 Plazas",
    brand: "Peugeot",
    model: "Partner Premium",
    price: 15950,
    km: 91000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0406173434878")]
  },
  {
    id: "0709104842102",
    slug: "peugeot-partner-premium-16bluehdi-100cv-2019-b",
    title: "Peugeot Partner Premium 1.6BlueHDI 100Cv IVA Incl",
    brand: "Peugeot",
    model: "Partner Premium",
    price: 10500,
    km: 129000,
    year: 2019,
    cv: 100,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("0709104842102")]
  },

  // Renault Master
  {
    id: "2412110426152",
    slug: "renault-master-23dci-combi-9plazas-140cv-2019",
    title: "Renault Master 2.3dCi Combi 9 Plazas S&S Energy L2h2 140cv",
    brand: "Renault",
    model: "Master Combi 9 Plazas",
    price: 23900,
    km: 93000,
    year: 2019,
    cv: 140,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2412110426152")]
  },

  // Seat Leon
  {
    id: "2907175802023",
    slug: "seat-leon-st-15ecotgi-110kw-dsg7-xcellence-2020",
    title: "Seat Leon ST 1.5 EcoTGI 110kW DSG-7 S&S Xcellence",
    brand: "Seat",
    model: "Leon ST Xcellence",
    price: 16950,
    km: 52000,
    year: 2020,
    cv: 130,
    fuel: "Gas",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2907175802023")]
  },
  {
    id: "2408091713093",
    slug: "seat-leon-st-15ecotgi-110kw-dsg7-xcellence-eco-2020",
    title: "Seat Leon ST 1.5 EcoTGI 110kW DSG-7 S&S Xcellence ECO",
    brand: "Seat",
    model: "Leon ST Xcellence ECO",
    price: 15950,
    km: 81000,
    year: 2020,
    cv: 130,
    fuel: "Hibrido",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("2408091713093")]
  },
  {
    id: "1604114017231",
    slug: "seat-leon-st-15ecotsi-110kw-dsg7-xcellence-2020",
    title: "Seat Leon ST 1.5 EcoTSI 110kW DSG-7 S&S Xcellence",
    brand: "Seat",
    model: "Leon ST Xcellence",
    price: 14950,
    km: 153000,
    year: 2020,
    cv: 150,
    fuel: "Gasolina",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("1604114017231")]
  },
  {
    id: "0412183540172",
    slug: "seat-leon-14tgi-gnc-style-110cv-2019",
    title: "Seat Leon 1.4 TGI GNC Style 110Cv 5 Puertas",
    brand: "Seat",
    model: "Leon TGI GNC Style",
    price: 12800,
    km: 98000,
    year: 2019,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("0412183540172")]
  },

  // Skoda Octavia
  {
    id: "2008105548330",
    slug: "skoda-octavia-14tsi-dsg-nacional-2015",
    title: "Skoda Octavia 1.4 TSI DSG Nacional con Xenon",
    brand: "Skoda",
    model: "Octavia TSI DSG",
    price: 14950,
    km: 70000,
    year: 2015,
    cv: 140,
    fuel: "Gasolina",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2008105548330")]
  },

  // Toyota Corolla
  {
    id: "1210141445156",
    slug: "toyota-corolla-18-125h-hybrid-business-tech-2020-b",
    title: "Toyota Corolla 1.8 125H Hybrid Business TECH E-CVT",
    brand: "Toyota",
    model: "Corolla Hybrid",
    price: 19950,
    km: 24000,
    year: 2020,
    cv: 140,
    fuel: "Hibrido",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "ECO",
    images: [getImageUrl("1210141445156")]
  },

  // Volkswagen Passat Advance
  {
    id: "2810212147797",
    slug: "volkswagen-passat-advance-20tdi-150cv-dsg-2018",
    title: "Volkswagen Passat Advance 2.0 TDI 110kW (150CV) DSG",
    brand: "Volkswagen",
    model: "Passat Advance DSG",
    price: 15950,
    km: 230000,
    year: 2018,
    cv: 150,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: true,
    label: "C",
    images: [getImageUrl("2810212147797")]
  },

  // ============================================
  // RESERVED VEHICLES - January 2026
  // ============================================

  // Dacia Dokker Reserved
  {
    id: "3010213432692",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2019-reservado",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP RESERVADO",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 13850,
    km: 91000,
    year: 2019,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("3010213432692")]
  },
  {
    id: "1912142155612",
    slug: "dacia-dokker-van-essential-16-110cv-glp-2021-reservado",
    title: "Dacia Dokker Van Essential 1.6 110Cv GLP RESERVADO",
    brand: "Dacia",
    model: "Dokker Van Essential GLP",
    price: 14450,
    km: 72000,
    year: 2021,
    cv: 110,
    fuel: "Hibrido",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("1912142155612")]
  },
  {
    id: "0612215601211",
    slug: "dacia-sandero-gasolina-glp-eco-2019-reservado",
    title: "Dacia Sandero Gasolina y GLP RESERVADO",
    brand: "Dacia",
    model: "Sandero GLP",
    price: 9950,
    km: 115000,
    year: 2019,
    cv: 90,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("0612215601211")]
  },

  // Fiat Reserved
  {
    id: "2508093149143",
    slug: "fiat-doblo-16jtdm-trekking-120cv-2018-reservado",
    title: "Fiat Doblo 1.6 JTDM Trekking 120Cv RESERVADO",
    brand: "Fiat",
    model: "Doblo Trekking",
    price: 15950,
    km: 107000,
    year: 2018,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "monovolumen",
    ivaDeducible: false,
    onSale: false,
    label: "C",
    images: [getImageUrl("2508093149143")]
  },
  {
    id: "2102155238363",
    slug: "fiat-doblo-cargo-14tjet-gnc-120cv-2019-reservado",
    title: "Fiat Doblo Cargo 1.4TJet GNC 120Cv RESERVADO",
    brand: "Fiat",
    model: "Doblo Cargo GNC",
    price: 10950,
    originalPrice: 12950,
    km: 93000,
    year: 2019,
    cv: 120,
    fuel: "Hibrido",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("2102155238363")]
  },

  // Ford Reserved
  {
    id: "2612144413405",
    slug: "ford-mondeo-20-hibrido-138kw-stline-hev-2021-reservado",
    title: "Ford Mondeo 2.0 Hibrido 138kW ST-Line HEV RESERVADO",
    brand: "Ford",
    model: "Mondeo Hybrid ST-Line",
    price: 18950,
    km: 120000,
    year: 2021,
    cv: 187,
    fuel: "Hibrido",
    transmission: "Automatico",
    bodyType: "familiar",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("2612144413405")]
  },
  {
    id: "3110153927915",
    slug: "ford-transit-connect-furgon-van-trend-200-l1-auto-2021-reservado",
    title: "Ford Transit Connect Furgon Van Trend 200 L1 Auto RESERVADO",
    brand: "Ford",
    model: "Transit Connect Van Auto",
    price: 15950,
    km: 88000,
    year: 2021,
    cv: 100,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "C",
    images: [getImageUrl("3110153927915")]
  },
  {
    id: "2609114704450",
    slug: "ford-transit-connect-furgon-van-15ecoblue-trend-220-l1-auto-2019-reservado",
    title: "Ford Transit Connect Furgon Van 1.5 EcoBlue Trend 220 L1 Auto RESERVADO",
    brand: "Ford",
    model: "Transit Connect Van Auto",
    price: 15450,
    km: 90000,
    year: 2019,
    cv: 120,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "C",
    images: [getImageUrl("2609114704450")]
  },
  {
    id: "2010171956109",
    slug: "ford-transit-connect-van-15ecoblue-trend-240-l2-120cv-2021-reservado",
    title: "Ford Transit Connect Van 1.5EcoBlue Trend 240 L2 120Cv RESERVADO",
    brand: "Ford",
    model: "Transit Connect Van Trend",
    price: 16950,
    km: 126000,
    year: 2021,
    cv: 120,
    fuel: "Diesel",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "C",
    images: [getImageUrl("2010171956109")]
  },

  // Peugeot 5008 Reserved
  {
    id: "1107172458550",
    slug: "peugeot-5008-20bluehdi-180cv-gtline-eat8-7plazas-2020-reservado",
    title: "Peugeot 5008 2.0 BlueHDi 180Cv GT Line S&S EAT8 7 Plazas RESERVADO",
    brand: "Peugeot",
    model: "5008 GT Line",
    price: 29950,
    km: 87000,
    year: 2020,
    cv: 180,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "suv",
    ivaDeducible: true,
    onSale: false,
    label: "C",
    images: [getImageUrl("1107172458550")]
  },

  // Volkswagen Reserved
  {
    id: "1206170327832",
    slug: "volkswagen-caddy-profesional-kombi-14tgi-gnc-110cv-2019-reservado",
    title: "Volkswagen Caddy Profesional Kombi 1.4 TGI/GNC 110Cv RESERVADO",
    brand: "Volkswagen",
    model: "Caddy Kombi TGI",
    price: 16950,
    km: 102000,
    year: 2019,
    cv: 110,
    fuel: "Gas",
    transmission: "Manual",
    bodyType: "furgoneta",
    ivaDeducible: true,
    onSale: false,
    label: "ECO",
    images: [getImageUrl("1206170327832")]
  },
  {
    id: "0411183216032",
    slug: "volkswagen-passat-executive-20tdi-150cv-dsg-2021-reservado",
    title: "Volkswagen Passat Executive 2.0Tdi 150Cv DSG RESERVADO",
    brand: "Volkswagen",
    model: "Passat Executive DSG",
    price: 17950,
    originalPrice: 18950,
    km: 184000,
    year: 2021,
    cv: 150,
    fuel: "Diesel",
    transmission: "Automatico",
    bodyType: "berlina",
    ivaDeducible: true,
    onSale: false,
    label: "C",
    images: [getImageUrl("0411183216032")]
  }
]

// Helper functions
export const getVehiclesByBrand = (brand: string) =>
  vehicles.filter(v => v.brand.toLowerCase() === brand.toLowerCase() && v.onSale)

export const getVehiclesOnSale = () =>
  vehicles.filter(v => v.onSale)

export const getFeaturedVehicles = () =>
  vehicles.filter(v => v.featured && v.onSale)

export const getVehiclesByFuel = (fuel: string) =>
  vehicles.filter(v => v.fuel.toLowerCase() === fuel.toLowerCase() && v.onSale)

export const getVehiclesByBodyType = (bodyType: string) =>
  vehicles.filter(v => v.bodyType.toLowerCase() === bodyType.toLowerCase() && v.onSale)

export const getVehiclesByPriceRange = (min: number, max: number) =>
  vehicles.filter(v => v.price >= min && v.price <= max && v.onSale)

export const getVehiclesByKmRange = (maxKm: number) =>
  vehicles.filter(v => v.km <= maxKm && v.onSale)

export const getVehicleById = (id: string) =>
  vehicles.find(v => v.id === id)

export const getVehicleBySlug = (slug: string) =>
  vehicles.find(v => v.slug === slug)

// Get unique brands
export const getBrands = () =>
  Array.from(new Set(vehicles.filter(v => v.onSale).map(v => v.brand))).sort()

// Get unique fuel types
export const getFuelTypes = () =>
  Array.from(new Set(vehicles.filter(v => v.onSale).map(v => v.fuel))).sort()

// Get unique body types
export const getBodyTypes = () =>
  Array.from(new Set(vehicles.filter(v => v.onSale).map(v => v.bodyType))).sort()

// Get price range
export const getPriceRange = () => {
  const prices = vehicles.filter(v => v.onSale).map(v => v.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}

// Get year range
export const getYearRange = () => {
  const years = vehicles.filter(v => v.onSale).map(v => v.year)
  return {
    min: Math.min(...years),
    max: Math.max(...years)
  }
}

// Search vehicles with filters
export const searchVehicles = (filters: {
  brand?: string
  bodyType?: string
  maxPrice?: number
  maxKm?: number
  fuel?: string
  transmission?: string
}) => {
  return vehicles.filter(v => {
    if (!v.onSale) return false
    if (filters.brand && v.brand.toLowerCase() !== filters.brand.toLowerCase()) return false
    if (filters.bodyType && v.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) return false
    if (filters.maxPrice && v.price > filters.maxPrice) return false
    if (filters.maxKm && v.km > filters.maxKm) return false
    if (filters.fuel && v.fuel.toLowerCase() !== filters.fuel.toLowerCase()) return false
    if (filters.transmission && v.transmission.toLowerCase() !== filters.transmission.toLowerCase()) return false
    return true
  })
}
