/**
 * Migration Script: Migrate vehicles from MidCar-Web to Supabase
 * Run with: node scripts/migrate-vehicles.mjs
 */

import { createClient } from '@supabase/supabase-js'

// Supabase credentials (same as dashboard)
const supabaseUrl = 'https://cvwxgzwremuijxinrvxw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3hnendyZW11aWp4aW5ydnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MDM1MjQsImV4cCI6MjA4MzI3OTUyNH0.MWF_dUmSWRXhtPpQUZFxpUiLTwMpuLl0hpm8YboI-ec'

const supabase = createClient(supabaseUrl, supabaseKey)

// Vehicle image URLs - First image only
const customFirstImages = {
  "0406173434878": "https://midcar.azureedge.net/vehiculos/0406173434878/PXL_20251031_083029250%20Peugeot%20Partner%20Premium%203%20Plazas%20100Cv-02112025214143751-450px.jpg",
  "0411183216032": "https://midcar.azureedge.net/vehiculos/0411183216032/(FILEminimizer)%20PXL_20241119_164143781.PORTRAIT.ORIGINAL~2-19112024185722602-1500px.jpg",
  "0412175725166": "https://midcar.azureedge.net/vehiculos/0412175725166/(FILEminimizer)%20PXL_20251204_090757391.Fiat%20Fiorino%201.3Mjet%20E6+%2080Cv%20IVA%20y%20garant%C3%ADa%20Incl-04122025175726155-450px.jpg",
  "0412182038327": "https://midcar.azureedge.net/vehiculos/0412182038327/(FILEminimizer)%20PXL_20251204_151607738.%20Ford%20Grand%20Tourneo%20Connect%205%20%207%20Plazas%20Turismo%20IVA%20y%20Garant%C3%ADa%20Incl%20Nacional%20Etiqueta%20C-04122025182038328-1500px.jpg",
  "0412183540172": "https://midcar.azureedge.net/vehiculos/0412183540172/(FILEminimizer)%20PXL_20251204_150136827.Seat%20Leon%201.4%20TGI%20GNC%20%20Style%20110Cv,%205%20Puertas,%20Etiqueta%20medioambiental%20ECO-04122025183540173-1500px.jpg",
  "1410144949506": "https://midcar.azureedge.net/vehiculos/1410144949506/1%20BMW%20530dA%20Luxury%20Line%20265Cv-02122024123029101-1500px.jpg",
  "2705094259148": "https://midcar.azureedge.net/vehiculos/2705094259148/01-27052022094306990-450px.JPG",
  "1012180451228": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80"
}

const getMainVehicleImage = (id) => {
  return customFirstImages[id] || `https://midcar.azureedge.net/vehiculos/${id}/1-1500px.jpg`
}

// All 92 vehicles data
const vehicles = [
  { id: "2705094259148", brand: "Astondoa", model: "40 Fly", price: 90000, km: 1020, year: 2004, cv: 720, fuel: "Gasolina", transmission: "Automático", bodyType: "barco", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1410144949506", brand: "BMW", model: "530dA Luxury Line", price: 31950, km: 159000, year: 2018, cv: 265, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: true, originalPrice: 32950 },
  { id: "2711105256099", brand: "Citroën", model: "Berlingo 1.5 BlueHDi 100Cv", price: 16600, km: 81000, year: 2022, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2711103440670", brand: "Citroën", model: "Berlingo 1.5 BlueHDi 130Cv", price: 14950, km: 116000, year: 2021, cv: 130, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0608144136697", brand: "Citroën", model: "Berlingo Talla M", price: 17950, km: 72000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "monovolumen", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2803163035250", brand: "Citroën", model: "C5 Exclusive 3.0 HDI", price: 13950, km: 149000, year: 2010, cv: 240, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2611185859603", brand: "Citroën", model: "Jumpy 2.0 BlueHDi", price: 22950, km: 142000, year: 2021, cv: 150, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0607084143944", brand: "Dacia", model: "Dokker Ambiance 1.5 DCI", price: 9950, km: 91000, year: 2018, cv: 90, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2310193748143", brand: "Dacia", model: "Dokker Van Essential GLP", price: 12950, km: 118000, year: 2021, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "1401154844202", brand: "Dacia", model: "Dokker Van Essential GLP", price: 12900, km: 114000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "1308091003359", brand: "Dacia", model: "Lodgy Stepway GLP", price: 15950, km: 102000, year: 2019, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "monovolumen", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "1210214831834", brand: "Fiat", model: "Fiorino 1.3 Multijet", price: 8900, km: 106000, year: 2019, cv: 80, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0412175725166", brand: "Fiat", model: "Fiorino 1.3 Mjet", price: 7900, km: 98000, year: 2018, cv: 80, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1607165900588", brand: "Ford", model: "Focus 2.0 EcoBlue", price: 13950, km: 246000, year: 2020, cv: 150, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2603171952561", brand: "Ford", model: "Focus Sportbreak Titanium", price: 14950, km: 110000, year: 2021, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2602175401805", brand: "Ford", model: "Focus Sportbreak", price: 12950, km: 129000, year: 2020, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0412182038327", brand: "Ford", model: "Grand Tourneo Connect", price: 17600, km: 147000, year: 2019, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "monovolumen", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2910121406627", brand: "Ford", model: "Transit 350 L3H2 Trail", price: 32500, km: 97000, year: 2021, cv: 130, fuel: "Diesel", transmission: "Manual", bodyType: "industrial", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1310173908369", brand: "Ford", model: "Transit L4H3 Trend", price: 27950, km: 170000, year: 2024, cv: 170, fuel: "Diesel", transmission: "Manual", bodyType: "industrial", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0611151202018", brand: "Ford", model: "Transit Connect", price: 11950, km: 130000, year: 2017, cv: 75, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: 12450 },
  { id: "2010090600150", brand: "Ford", model: "Transit Connect L2 Trend", price: 17950, km: 132000, year: 2020, cv: 120, fuel: "Diesel", transmission: "Automático", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0712191648012", brand: "Ford", model: "Transit Connect Van Trend", price: 12950, km: 150000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1207211827018", brand: "Ford", model: "Transit Connect Van Trend 240", price: 15500, km: 109000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2905090824063", brand: "Ford", model: "Transit Connect Van Trend 240", price: 15950, km: 145000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "3005093435508", brand: "Ford", model: "Transit Connect Van Trend", price: 15950, km: 155000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2412102803492", brand: "Ford", model: "Transit Connect Van Trend", price: 16950, km: 129000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1308080841866", brand: "Ford", model: "Transit Connect Van Trend 240", price: 15500, km: 145000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: 15950 },
  { id: "1408180357360", brand: "Ford", model: "Transit Connect Van Trend 240", price: 16950, km: 133000, year: 2021, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2903214946252", brand: "Ford", model: "Transit Courier Trend", price: 10950, km: 136000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: 11950 },
  { id: "1111173450030", brand: "Ford", model: "Transit Courier Trend", price: 11950, km: 120000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0801211634398", brand: "Hyundai", model: "IONIQ HEV Style", price: 13950, km: 189000, year: 2020, cv: 140, fuel: "Híbrido", transmission: "Automático", bodyType: "berlina", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2611184400149", brand: "Hyundai", model: "IONIQ HEV Tecno", price: 15950, km: 160000, year: 2021, cv: 141, fuel: "Híbrido", transmission: "Automático", bodyType: "berlina", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "1504143933268", brand: "Kia", model: "Niro Híbrido", price: 15950, km: 114000, year: 2019, cv: 141, fuel: "Híbrido", transmission: "Automático", bodyType: "suv", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "0612221522671", brand: "Mercedes-Benz", model: "Vito 114 CDI", price: 24950, km: 157000, year: 2020, cv: 136, fuel: "Diesel", transmission: "Automático", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2103085530402", brand: "Opel", model: "Corsa Selective GLP", price: 10450, km: 89000, year: 2018, cv: 90, fuel: "Gas", transmission: "Manual", bodyType: "berlina", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2310170952008", brand: "Peugeot", model: "208 Allure", price: 13950, km: 137000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2309204646271", brand: "Peugeot", model: "208 BlueHDi", price: 13450, km: 90000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1601205117727", brand: "Peugeot", model: "208 Active", price: 11950, km: 86000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0702165249659", brand: "Peugeot", model: "208 Signature", price: 11950, km: 90000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0709102810099", brand: "Toyota", model: "Proace Van Business", price: 16950, km: 100000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "3006164538644", brand: "Volkswagen", model: "Caddy Profesional TGI", price: 10950, km: 70000, year: 2017, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2412120339759", brand: "Volkswagen", model: "Caddy Profesional Furgón TGI", price: 12950, km: 89000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "3108085742568", brand: "Volkswagen", model: "Caddy Profesional Kombi TDI", price: 14950, km: 199000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2209175601848", brand: "Volkswagen", model: "Caddy Profesional Maxi Furgón TGI", price: 17950, km: 70000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "0709095822962", brand: "Volkswagen", model: "Caddy Profesional Maxi Furgón TGI", price: 16950, km: 80000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "0911211710024", brand: "Volkswagen", model: "Transporter Largo DSG", price: 29950, km: 117000, year: 2021, cv: 150, fuel: "Diesel", transmission: "Automático", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0607112959325", brand: "Volkswagen", model: "Transporter Kombi", price: 22950, km: 138000, year: 2020, cv: 102, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0707091515235", brand: "Volkswagen", model: "Crafter L3H3", price: 27500, km: 120000, year: 2021, cv: 140, fuel: "Diesel", transmission: "Manual", bodyType: "industrial", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2810212147798", brand: "Volkswagen", model: "T-Cross Life", price: 17950, km: 62000, year: 2020, cv: 110, fuel: "Gasolina", transmission: "Manual", bodyType: "suv", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1811165157199", brand: "Volvo", model: "XC40 T3", price: 17950, km: 170000, year: 2018, cv: 156, fuel: "Gasolina", transmission: "Manual", bodyType: "suv", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2405103403241", brand: "Volkswagen", model: "Passat 2.0 TDI DSG", price: 18950, km: 137000, year: 2018, cv: 150, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1012180451228", brand: "Peugeot", model: "3008 Allure", price: 17500, km: 126000, year: 2020, cv: 130, fuel: "Diesel", transmission: "Manual", bodyType: "suv", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2705145300282", brand: "Peugeot", model: "308 Style", price: 12500, km: 120000, year: 2019, cv: 130, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: 12950 },
  { id: "1904165332774", brand: "Peugeot", model: "308 Style", price: 12950, km: 124000, year: 2019, cv: 130, fuel: "Diesel", transmission: "Manual", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2412104143698", brand: "Peugeot", model: "308 Allure Auto", price: 14800, km: 155000, year: 2021, cv: 130, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0512154342644", brand: "Peugeot", model: "308 Allure Auto", price: 13950, km: 161000, year: 2021, cv: 130, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1306110847484", brand: "Peugeot", model: "308SW", price: 9950, km: 123000, year: 2016, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: 10950 },
  { id: "2706222633017", brand: "Peugeot", model: "308SW Active Pack", price: 13500, km: 154000, year: 2021, cv: 130, fuel: "Diesel", transmission: "Automático", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: 13950 },
  { id: "2706223137043", brand: "Peugeot", model: "308SW Style Auto", price: 11500, km: 179000, year: 2019, cv: 130, fuel: "Diesel", transmission: "Automático", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: 11950 },
  { id: "0607085200332", brand: "Peugeot", model: "5008 Allure", price: 29950, km: 73000, year: 2021, cv: 180, fuel: "Diesel", transmission: "Automático", bodyType: "suv", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1303181344902", brand: "Peugeot", model: "5008 GT Line", price: 24950, km: 118000, year: 2020, cv: 180, fuel: "Diesel", transmission: "Automático", bodyType: "suv", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2611183144600", brand: "Peugeot", model: "508 Allure", price: 18950, km: 104000, year: 2020, cv: 160, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "3108093817304", brand: "Peugeot", model: "Partner L2", price: 12950, km: 137000, year: 2018, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: 14950 },
  { id: "1208102017874", brand: "Peugeot", model: "Partner L2", price: 14950, km: 103000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0506105541733", brand: "Peugeot", model: "Partner Furgon Confort", price: 10950, km: 120000, year: 2018, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: 11950 },
  { id: "1111180056441", brand: "Peugeot", model: "Partner Premium", price: 14950, km: 88000, year: 2020, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0911164040851", brand: "Peugeot", model: "Partner Premium", price: 11450, km: 67000, year: 2019, cv: 75, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0406173434878", brand: "Peugeot", model: "Partner Premium", price: 15950, km: 91000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0709104842102", brand: "Peugeot", model: "Partner Premium", price: 10500, km: 129000, year: 2019, cv: 100, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2412110426152", brand: "Renault", model: "Master Combi 9 Plazas", price: 23900, km: 93000, year: 2019, cv: 140, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "2907175802023", brand: "Seat", model: "Leon ST Xcellence", price: 16950, km: 52000, year: 2020, cv: 130, fuel: "Gas", transmission: "Automático", bodyType: "familiar", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2408091713093", brand: "Seat", model: "Leon ST Xcellence ECO", price: 15950, km: 81000, year: 2020, cv: 130, fuel: "Híbrido", transmission: "Automático", bodyType: "familiar", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "1604114017231", brand: "Seat", model: "Leon ST Xcellence", price: 14950, km: 153000, year: 2020, cv: 150, fuel: "Gasolina", transmission: "Automático", bodyType: "familiar", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "0412183540172", brand: "Seat", model: "Leon TGI GNC Style", price: 12800, km: 98000, year: 2019, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "berlina", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2008105548330", brand: "Skoda", model: "Octavia TSI DSG", price: 14950, km: 70000, year: 2015, cv: 140, fuel: "Gasolina", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  { id: "1210141445156", brand: "Toyota", model: "Corolla Hybrid", price: 19950, km: 24000, year: 2020, cv: 140, fuel: "Híbrido", transmission: "Automático", bodyType: "berlina", onSale: true, label: "ECO", featured: false, originalPrice: null },
  { id: "2810212147797", brand: "Volkswagen", model: "Passat Advance DSG", price: 15950, km: 230000, year: 2018, cv: 150, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: true, label: "C", featured: false, originalPrice: null },
  // Reserved vehicles
  { id: "0610142948687", brand: "Dacia", model: "Dokker Van Essential GLP", price: 12950, km: 103000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "0610144625509", brand: "Dacia", model: "Dokker Van Essential GLP", price: 12950, km: 105000, year: 2020, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "3010213432692", brand: "Dacia", model: "Dokker Van Essential GLP", price: 13850, km: 91000, year: 2019, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "1912142155612", brand: "Dacia", model: "Dokker Van Essential GLP", price: 14450, km: 72000, year: 2021, cv: 110, fuel: "Híbrido", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "0612215601211", brand: "Dacia", model: "Sandero GLP", price: 9950, km: 115000, year: 2019, cv: 90, fuel: "Gas", transmission: "Manual", bodyType: "berlina", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "2508093149143", brand: "Fiat", model: "Doblo Trekking", price: 15950, km: 107000, year: 2018, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "monovolumen", onSale: false, label: "C", featured: false, originalPrice: null },
  { id: "2102155238363", brand: "Fiat", model: "Doblo Cargo GNC", price: 10950, km: 93000, year: 2019, cv: 120, fuel: "Híbrido", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: 12950 },
  { id: "2612144413405", brand: "Ford", model: "Mondeo Hybrid ST-Line", price: 18950, km: 120000, year: 2021, cv: 187, fuel: "Híbrido", transmission: "Automático", bodyType: "familiar", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "3110153927915", brand: "Ford", model: "Transit Connect Van Auto", price: 15950, km: 88000, year: 2021, cv: 100, fuel: "Diesel", transmission: "Automático", bodyType: "furgoneta", onSale: false, label: "C", featured: false, originalPrice: null },
  { id: "2609114704450", brand: "Ford", model: "Transit Connect Van Auto", price: 15450, km: 90000, year: 2019, cv: 120, fuel: "Diesel", transmission: "Automático", bodyType: "furgoneta", onSale: false, label: "C", featured: false, originalPrice: null },
  { id: "2010171956109", brand: "Ford", model: "Transit Connect Van Trend", price: 16950, km: 126000, year: 2021, cv: 120, fuel: "Diesel", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "C", featured: false, originalPrice: null },
  { id: "1107172458550", brand: "Peugeot", model: "5008 GT Line", price: 29950, km: 87000, year: 2020, cv: 180, fuel: "Diesel", transmission: "Automático", bodyType: "suv", onSale: false, label: "C", featured: false, originalPrice: null },
  { id: "1206170327832", brand: "Volkswagen", model: "Caddy Kombi TGI", price: 16950, km: 102000, year: 2019, cv: 110, fuel: "Gas", transmission: "Manual", bodyType: "furgoneta", onSale: false, label: "ECO", featured: false, originalPrice: null },
  { id: "0411183216032", brand: "Volkswagen", model: "Passat Executive DSG", price: 17950, km: 184000, year: 2021, cv: 150, fuel: "Diesel", transmission: "Automático", bodyType: "berlina", onSale: false, label: "C", featured: false, originalPrice: 18950 },
]

// Fuel type mapping
function mapFuel(webFuel) {
  const fuelMap = {
    'Diesel': 'diesel',
    'Gasolina': 'gasolina',
    'Híbrido': 'hibrido',
    'Hibrido': 'hibrido',
    'Gas': 'glp',
  }
  return fuelMap[webFuel] || webFuel.toLowerCase()
}

// Transmission mapping
function mapTransmission(webTransmission) {
  const transmissionMap = {
    'Manual': 'manual',
    'Automático': 'automatico',
    'Automatico': 'automatico',
  }
  return transmissionMap[webTransmission] || webTransmission.toLowerCase()
}

// Transform vehicle
function transformVehicle(v) {
  const firstImage = getMainVehicleImage(v.id)

  return {
    // id is auto-generated as UUID by Supabase
    marca: v.brand,
    modelo: v.model,
    version: '',
    año_fabricacion: v.year,
    año_matriculacion: v.year,
    potencia_cv: v.cv,
    potencia_kw: Math.round(v.cv * 0.7355),
    combustible: mapFuel(v.fuel),
    transmision: mapTransmission(v.transmission),
    tipo_carroceria: v.bodyType,
    etiqueta_dgt: v.label || null,
    kilometraje: v.km,
    estado: v.onSale ? 'disponible' : 'reservado',
    destacado: v.featured || false,
    precio_venta: v.price,
    descuento: v.originalPrice ? (v.originalPrice - v.price) : 0,
    imagen_principal: firstImage,
    vin: '',
    matricula: '',
    stock_id: v.id,
    en_oferta: v.originalPrice ? true : false,
    cilindrada: 0,
    consumo_mixto: 0,
    emisiones_co2: 0,
    num_marchas: 0,
    traccion: '',
    num_puertas: 0,
    num_plazas: 5,
    color_exterior: '',
    color_interior: '',
    num_propietarios: 1,
    es_nacional: true,
    primera_mano: false,
    precio_compra: 0,
    gastos_compra: 0,
    coste_reparaciones: 0,
    garantia_meses: 12,
    tipo_garantia: 'CONCENTRA',
    fecha_entrada_stock: new Date().toISOString().split('T')[0],
    datos_sincronizados: true,
    ultima_sincronizacion: new Date().toISOString(),
  }
}

async function migrateVehicles() {
  console.log('🚗 Starting vehicle migration to Supabase...')
  console.log(`📊 Total vehicles to migrate: ${vehicles.length}`)
  console.log('')

  let successCount = 0
  let errorCount = 0

  for (const vehicle of vehicles) {
    try {
      const transformed = transformVehicle(vehicle)

      const { error } = await supabase
        .from('vehicles')
        .upsert(transformed, { onConflict: 'stock_id' })

      if (error) {
        console.error(`❌ Error: ${vehicle.brand} ${vehicle.model} - ${error.message}`)
        errorCount++
      } else {
        console.log(`✓ ${vehicle.brand} ${vehicle.model}`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Exception: ${vehicle.id} - ${err.message}`)
      errorCount++
    }
  }

  console.log('')
  console.log('========================================')
  console.log(`✅ Migrated: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log('========================================')
}

migrateVehicles()
