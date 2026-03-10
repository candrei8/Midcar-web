/**
 * MongoDB -> Supabase Vehicle Image Matcher
 *
 * Reads MongoDB vehicle data and generates SQL UPDATE statements
 * to populate imagen_principal for Supabase vehicles.
 *
 * Matching strategy (run in order, each only updates NULL rows):
 * 1. Exact: brand + model + year + km + cv + fuel
 * 2. Year flex: brand + model + year(+/-1) + km + cv
 * 3. Close km: brand + model + year(+/-1) + km(within 5%) + cv
 * 4. CV match: brand + model + year(+/-1) + cv
 * 5. Loose: brand + model + year(+/-1)
 */

const fs = require('fs');

// ---- Load MongoDB data ----
const mongoData = JSON.parse(
  fs.readFileSync('C:/Users/zetar/Downloads/db-midcar-extracted/vehicles-mongodb-compass.json', 'utf8')
);

// ---- Brand normalization map ----
const brandMap = {
  'audi': 'Audi',
  'bmw': 'Bmw',
  'citroen': 'Citroen',
  'citro\u00ebn': 'Citroen',
  'dacia': 'Dacia',
  'fiat': 'Fiat',
  'ford': 'Ford',
  'honda': 'Honda',
  'hyundai': 'Hyundai',
  'kia': 'Kia',
  'kawasaki': 'Kawasaki',
  'land rover': 'Land Rover',
  'land': 'Land Rover',
  'lexus': 'Lexus',
  'mazda': 'Mazda',
  'mazda3': 'Mazda',
  'mercedes benz': 'Mercedes Benz',
  'mercedes-benz': 'Mercedes Benz',
  'mercedes': 'Mercedes Benz',
  'mini': 'MINI',
  'mitsubishi': 'Mitsubishi',
  'nissan': 'Nissan',
  'opel': 'Opel',
  'peugeot': 'Peugeot',
  'renault': 'Renault',
  'seat': 'Seat',
  'skoda': 'Skoda',
  'ssangyong': 'Ssangyong',
  'suzuki': 'Suzuki',
  'toyota': 'Toyota',
  'volkswagen': 'Volkswagen',
  'vw': 'Volkswagen',
  'volkwagen': 'Volkswagen',
  'volvo': 'Volvo',
  'chrysler': 'Chrysler',
  'chevrolet': 'Chevrolet',
  'astondoa': 'Astondoa',
};

// Model extraction patterns per brand
const modelPatterns = {
  'Bmw': [
    { regex: /\bX5\b/i, supabaseModel: 'X5' },
    { regex: /\bX3\b/i, supabaseModel: 'X3' },
    { regex: /\bX1\b/i, supabaseModel: 'X1' },
    { regex: /\b(?:BMW|Bmw)\s+7\d{2}/i, supabaseModel: 'Serie 7' },
    { regex: /\b(?:BMW|Bmw)\s+5\d{2}/i, supabaseModel: 'Serie 5' },
    { regex: /\b(?:BMW|Bmw)\s+3\d{2}/i, supabaseModel: 'Serie 3' },
    { regex: /\b(?:BMW|Bmw)\s+2\d{2}/i, supabaseModel: 'Serie 2' },
  ],
  'Citroen': [
    { regex: /\bBerlingo\s+XL\b/i, supabaseModel: 'Berlingo XL' },
    { regex: /\bBerlingo\b/i, supabaseModel: 'Berlingo' },
    { regex: /\bC3\b/i, supabaseModel: 'C3' },
    { regex: /\bGrand\s+C4\s+Picasso\b/i, supabaseModel: 'Grand C4 Picasso Spacetourer' },
    { regex: /\bC4\s+Grand\s+Picasso\b/i, supabaseModel: 'C4 Grand Picasso' },
    { regex: /\bC4\s+Picasso\b/i, supabaseModel: 'C4 Picasso' },
    { regex: /\bC4\b/i, supabaseModel: 'C4' },
    { regex: /\bC5\b/i, supabaseModel: 'C5' },
    { regex: /\bJumper\b/i, supabaseModel: 'Jumper' },
    { regex: /\bJumpy\b/i, supabaseModel: 'Jumpy' },
    { regex: /\bNemo/i, supabaseModel: 'Nemo' },
  ],
  'Ford': [
    { regex: /\bGrand\s+(?:Tourneo\s+)?Connect\b/i, supabaseModel: 'Grant Tourneo Connect' },
    { regex: /\bTourneo\s+Connect\b/i, supabaseModel: 'Tourneo Connect' },
    { regex: /\bTourneo\b/i, supabaseModel: 'Tourneo' },
    { regex: /\bTransit\s+Custom\b/i, supabaseModel: 'Transit Custom' },
    { regex: /\bTransit\s+Connect\b/i, supabaseModel: 'Transit Connect' },
    { regex: /\bTransit\s+Courier\b/i, supabaseModel: 'Transit Courier' },
    { regex: /\bTransit\b/i, supabaseModel: 'Transit' },
    { regex: /\bS-?[Mm]ax\b/i, supabaseModel: 'S-Max' },
    { regex: /\bMondeo\b/i, supabaseModel: 'Mondeo' },
    { regex: /\bFocus\b/i, supabaseModel: 'Focus' },
    { regex: /\bFiesta\b/i, supabaseModel: 'Fiesta' },
    { regex: /\bKuga\b/i, supabaseModel: 'Kuga' },
    { regex: /\bKa\b/i, supabaseModel: 'Ka' },
    { regex: /\bCustom\b/i, supabaseModel: 'Custom' },
  ],
  'Mercedes Benz': [
    { regex: /\bSprinter\b/i, supabaseModel: 'Sprinter' },
    { regex: /\bVito\b/i, supabaseModel: 'Vito' },
    { regex: /\bClase\s+R\b/i, supabaseModel: 'Clase R' },
    { regex: /\bR\s*350\b/i, supabaseModel: 'Clase R' },
    { regex: /\bClase\s+S\b/i, supabaseModel: 'Clase S' },
    { regex: /\bS\s*[35]\d{2}\b/i, supabaseModel: 'Clase S' },
    { regex: /\bCLA\b/, supabaseModel: 'CLA' },
    { regex: /\bCLS\b/, supabaseModel: 'Cls' },
    { regex: /\bB\s*200\b/i, supabaseModel: 'B 200' },
    { regex: /\bC\s*270\b/i, supabaseModel: 'C270' },
  ],
  'Volkswagen': [
    { regex: /\bCaddy\s+Kombi\b/i, supabaseModel: 'Caddy Kombi' },
    { regex: /\bCaddy\s+Maxi\b/i, supabaseModel: 'Caddy Kombi' },
    { regex: /\bCaddy\b/i, supabaseModel: 'Caddy' },
    { regex: /\bPassat\s+CC\b/i, supabaseModel: 'Passat CC' },
    { regex: /\bCC\b/, supabaseModel: 'CC' },
    { regex: /\bCrafter\b/i, supabaseModel: 'Crafter' },
    { regex: /\bGolf\b/i, supabaseModel: 'Golf' },
    { regex: /\bPassat\b/i, supabaseModel: 'Passat' },
    { regex: /\bPolo\b/i, supabaseModel: 'Polo' },
    { regex: /\bSharan\b/i, supabaseModel: 'Sharan' },
    { regex: /\bTiguan\b/i, supabaseModel: 'Tiguan' },
    { regex: /\bTransporter\b/i, supabaseModel: 'Transporter' },
    { regex: /\bT5\b/i, supabaseModel: 'Transporter' },
    { regex: /\bT6\b/i, supabaseModel: 'Transporter' },
  ],
  'Toyota': [
    { regex: /\bYaris\s+Hybrid\b/i, supabaseModel: 'Yaris Hybrid' },
    { regex: /\bYaris\b/i, supabaseModel: 'Yaris' },
    { regex: /\bAuris\b/i, supabaseModel: 'Auris' },
    { regex: /\bAvensis\b/i, supabaseModel: 'Avensis' },
    { regex: /\bAygo\b/i, supabaseModel: 'Aygo' },
    { regex: /\bC-?HR\b/i, supabaseModel: 'CHR' },
    { regex: /\bCorolla\b/i, supabaseModel: 'Corolla' },
    { regex: /\bProace\b/i, supabaseModel: 'Proace' },
  ],
  'Renault': [
    { regex: /\bClio\b/i, supabaseModel: 'Clio' },
    { regex: /\bEspace\b/i, supabaseModel: 'Espace' },
    { regex: /\bKangoo\b/i, supabaseModel: 'Kangoo' },
    { regex: /\bLaguna\b/i, supabaseModel: 'Laguna' },
    { regex: /\bMaster\b/i, supabaseModel: 'Master' },
    { regex: /\bM[e\u00e9]gane\b/i, supabaseModel: 'Megane' },
    { regex: /\bTalisman\b/i, supabaseModel: 'Talisman' },
    { regex: /\bTrafic\b/i, supabaseModel: 'Trafic' },
  ],
  'Peugeot': [
    { regex: /\b208/i, supabaseModel: '208' },
    { regex: /\b3008/i, supabaseModel: '3008' },
    { regex: /\b307/i, supabaseModel: '307' },
    { regex: /\b308/i, supabaseModel: '308' },
    { regex: /\b5008/i, supabaseModel: '5008' },
    { regex: /\b508/i, supabaseModel: '508' },
    { regex: /\b807/i, supabaseModel: '807' },
    { regex: /\bBipper\b/i, supabaseModel: 'Bipper' },
    { regex: /\bBoxer\b/i, supabaseModel: 'Boxer' },
    { regex: /\bExpert\b/i, supabaseModel: 'Expert' },
    { regex: /\bPartner\b/i, supabaseModel: 'Partner' },
    { regex: /\bRifter\b/i, supabaseModel: 'Rifter' },
  ],
  'Opel': [
    { regex: /\bAstra\b/i, supabaseModel: 'Astra' },
    { regex: /\bCombo\b/i, supabaseModel: 'Combo' },
    { regex: /\bCorsa\b/i, supabaseModel: 'Corsa' },
    { regex: /\bInsignia\b/i, supabaseModel: 'Insignia' },
    { regex: /\bSt\b/i, supabaseModel: 'Insignia' },
    { regex: /\bMovano\b/i, supabaseModel: 'Movano' },
  ],
  'Seat': [
    { regex: /\bExeo\b/i, supabaseModel: 'Exeo' },
    { regex: /\bLe[o\u00f3]n\b/i, supabaseModel: 'Leon' },
  ],
  'Hyundai': [
    { regex: /\bGrand\s+Santa\s+Fe\b/i, supabaseModel: 'Grand Santa Fe' },
    { regex: /\bSanta\s+Fe\b/i, supabaseModel: 'Santa Fe' },
    { regex: /\bi30\b/i, supabaseModel: 'I30' },
    { regex: /\bi40\b/i, supabaseModel: 'I40' },
    { regex: /\bIoniq\b/i, supabaseModel: 'Ioniq' },
  ],
  'Dacia': [
    { regex: /\bDokker\b/i, supabaseModel: 'Dokker' },
    { regex: /\bDuster\b/i, supabaseModel: 'Duster' },
    { regex: /\bLodgy\b/i, supabaseModel: 'Lodgy' },
    { regex: /\bLogan\b/i, supabaseModel: 'Logan' },
    { regex: /\bSandero\b/i, supabaseModel: 'Sandero' },
  ],
  'Fiat': [
    { regex: /\b500\b/, supabaseModel: '500' },
    { regex: /\bDobl[o\u00f2]\b/i, supabaseModel: 'Doblo' },
    { regex: /\bFiorino\b/i, supabaseModel: 'Fiorino' },
    { regex: /\bFreemont\b/i, supabaseModel: 'Freemont' },
    { regex: /\bScudo\b/i, supabaseModel: 'Scudo' },
    { regex: /\bTalento\b/i, supabaseModel: 'Talento' },
  ],
  'Nissan': [
    { regex: /\bQashqai\b/i, supabaseModel: 'Qashqai' },
  ],
  'Volvo': [
    { regex: /\bS60\b/i, supabaseModel: 'S60' },
    { regex: /\bV40\b/i, supabaseModel: 'V40' },
    { regex: /\bXC40\b/i, supabaseModel: 'XC40' },
  ],
  'Kia': [
    { regex: /\bNiro\b/i, supabaseModel: 'Niro' },
    { regex: /\bRio\b/i, supabaseModel: 'Rio' },
  ],
  'Skoda': [
    { regex: /\bOctavia\b/i, supabaseModel: 'Octavia' },
    { regex: /\bSuperb\b/i, supabaseModel: 'Superb' },
  ],
  'Mazda': [
    { regex: /Mazda\s*3/i, supabaseModel: '3' },
    { regex: /Mazda\s*5/i, supabaseModel: '5' },
    { regex: /Mazda\s*6/i, supabaseModel: '6' },
  ],
  'Lexus': [
    { regex: /\bCT\b/, supabaseModel: 'CT' },
    { regex: /\bIS\s*250\b/i, supabaseModel: 'IS 250' },
    { regex: /\bUX\s*250/i, supabaseModel: 'UX 250h' },
  ],
  'Honda': [
    { regex: /\bCR-?V\b/i, supabaseModel: 'Cr-v' },
  ],
  'Mitsubishi': [
    { regex: /\bOutlander\b/i, supabaseModel: 'Outlander' },
  ],
  'MINI': [
    { regex: /\bCountryman\b/i, supabaseModel: 'Countryman' },
    { regex: /./, supabaseModel: 'Countryman' },
  ],
  'Ssangyong': [
    { regex: /\bTivoli\b/i, supabaseModel: 'Tivoli' },
  ],
  'Suzuki': [
    { regex: /\bS[\.\s-]?Cross\b/i, supabaseModel: 'S.Cross' },
    { regex: /\bSwift\b/i, supabaseModel: 'swift' },
  ],
  'Land Rover': [
    { regex: /\bFreelander\b/i, supabaseModel: 'Freelander' },
  ],
  'Audi': [
    { regex: /\bA4\b/i, supabaseModel: 'A4' },
    { regex: /\bAvant\b/i, supabaseModel: 'A4' },
    { regex: /\bA6\b/i, supabaseModel: 'A6' },
    { regex: /\bQ7\b/i, supabaseModel: 'Q7' },
  ],
  'Chrysler': [
    { regex: /\bVoyager\b/i, supabaseModel: 'Voyager' },
  ],
  'Astondoa': [
    { regex: /\b40\s*Fly\b/i, supabaseModel: '40 Fly' },
  ],
  'Chevrolet': [
    { regex: /\bExpress\b/i, supabaseModel: 'Express' },
  ],
  'Kawasaki': [
    { regex: /\bZ[R]?\d*/i, supabaseModel: 'Z' },
  ],
};

// Fuel normalization: MongoDB -> Supabase
const fuelMap = {
  'diesel': 'diesel',
  'gasolina': 'gasolina',
  'hibrido': 'hibrido',
  'hybrid': 'hibrido',
  'electrico': 'electrico',
  'glp': 'glp',
  'gnc': 'gnc',
  'gas': 'glp',
};

// ---- Helper functions ----
function parseBrand(title) {
  const lower = title.toLowerCase();
  if (lower.startsWith('mercedes benz') || lower.startsWith('mercedes-benz')) return 'Mercedes Benz';
  if (lower.startsWith('land rover')) return 'Land Rover';
  const firstWord = lower.split(/\s+/)[0];
  return brandMap[firstWord] || null;
}

function parseModel(brand, title) {
  const patterns = modelPatterns[brand];
  if (!patterns) return null;
  for (const p of patterns) {
    if (p.regex.test(title)) {
      return p.supabaseModel;
    }
  }
  return null;
}

function getMainImage(fileDocuments) {
  if (!fileDocuments || fileDocuments.length === 0) return null;
  const main = fileDocuments.find(function(f) { return f.Main === true; });
  if (main) return main.Url;
  return fileDocuments[0].Url;
}

function getVal(field) {
  if (field === null || field === undefined) return null;
  if (typeof field === 'object') {
    if (field.$numberInt) return parseInt(field.$numberInt);
    if (field.$numberDecimal) return parseFloat(field.$numberDecimal);
    if (field.$numberLong) return parseInt(field.$numberLong);
  }
  if (typeof field === 'number') return field;
  if (typeof field === 'string') return parseFloat(field) || null;
  return null;
}

// ---- Parse MongoDB vehicles ----
const mongoVehicles = mongoData.map(function(v) {
  var brand = parseBrand(v.Title || '');
  var model = brand ? parseModel(brand, v.Title || '') : null;
  var year = getVal(v.Year);
  var km = getVal(v.Mileage);
  var cv = getVal(v.Power);
  var price = getVal(v.Price);
  var rawFuel = (v.Fuel || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  var fuel = fuelMap[rawFuel] || rawFuel;
  var imageUrl = getMainImage(v.FileDocuments);

  return { id: v._id, title: v.Title, brand: brand, model: model, year: year, km: km, cv: cv, price: price, fuel: fuel, imageUrl: imageUrl };
});

// ---- Stats ----
var withBrand = mongoVehicles.filter(function(v) { return v.brand; });
var withModel = mongoVehicles.filter(function(v) { return v.model; });
var withImage = mongoVehicles.filter(function(v) { return v.imageUrl; });
var noBrand = mongoVehicles.filter(function(v) { return !v.brand; });
var noModel = mongoVehicles.filter(function(v) { return v.brand && !v.model; });

console.error('=== MongoDB Parsing Stats ===');
console.error('Total MongoDB vehicles: ' + mongoVehicles.length);
console.error('Parsed brand: ' + withBrand.length);
console.error('Parsed model: ' + withModel.length);
console.error('Has image URL: ' + withImage.length);
console.error('No brand parsed: ' + noBrand.length);
if (noBrand.length > 0) {
  console.error('  Unmatched titles:');
  noBrand.forEach(function(v) { console.error('    - ' + v.title); });
}
console.error('Brand but no model: ' + noModel.length);
if (noModel.length > 0) {
  console.error('  Unmatched:');
  noModel.forEach(function(v) { console.error('    - ' + v.brand + ': "' + v.title + '"'); });
}

// ---- Build matching indexes (deduplicated) ----
// Use multiple indexes with different key strategies
// All indexes map key -> { imageUrl, title, ... }

function normalizeKey() {
  return Array.prototype.slice.call(arguments).map(function(p) { return String(p).toLowerCase().trim(); }).join('|');
}

// Level 1: brand + model + year + km + cv + fuel (exact)
var exactIndex = new Map();
// Level 2: brand + model + year(+/-1) + km + cv (year-flexible)
var yearFlexIndex = new Map();
// Level 3: brand + model + year(+/-1) + km(5%) + cv
// (handled in SQL with BETWEEN)
var closeKmIndex = new Map();
// Level 4: brand + model + year(+/-1) + cv
var cvIndex = new Map();
// Level 5: brand + model + year(+/-1)
var looseIndex = new Map();

for (var i = 0; i < mongoVehicles.length; i++) {
  var v = mongoVehicles[i];
  if (!v.brand || !v.model || !v.imageUrl) continue;

  // Exact
  if (v.year && v.km && v.cv && v.fuel) {
    var key1 = normalizeKey(v.brand, v.model, v.year, v.km, v.cv, v.fuel);
    if (!exactIndex.has(key1)) exactIndex.set(key1, v);
  }
  // Year flex: store for year-1, year, year+1
  if (v.year && v.km && v.cv) {
    for (var dy = -1; dy <= 1; dy++) {
      var key2 = normalizeKey(v.brand, v.model, v.year + dy, v.km, v.cv);
      if (!yearFlexIndex.has(key2)) yearFlexIndex.set(key2, v);
    }
  }
  // Close km: store for year-1, year, year+1
  if (v.year && v.km && v.cv) {
    for (var dy2 = -1; dy2 <= 1; dy2++) {
      var key3 = normalizeKey(v.brand, v.model, v.year + dy2, v.cv);
      // We store km range info for SQL generation
      if (!closeKmIndex.has(key3)) closeKmIndex.set(key3, v);
    }
  }
  // CV match
  if (v.year && v.cv) {
    for (var dy3 = -1; dy3 <= 1; dy3++) {
      var key4 = normalizeKey(v.brand, v.model, v.year + dy3, v.cv);
      if (!cvIndex.has(key4)) cvIndex.set(key4, v);
    }
  }
  // Loose
  if (v.year) {
    for (var dy4 = -1; dy4 <= 1; dy4++) {
      var key5 = normalizeKey(v.brand, v.model, v.year + dy4);
      if (!looseIndex.has(key5)) looseIndex.set(key5, v);
    }
  }
}

console.error('');
console.error('=== Index Sizes ===');
console.error('Exact (brand+model+year+km+cv+fuel): ' + exactIndex.size);
console.error('Year-flex (brand+model+year+-1+km+cv): ' + yearFlexIndex.size);
console.error('CV    (brand+model+year+-1+cv): ' + cvIndex.size);
console.error('Loose (brand+model+year+-1): ' + looseIndex.size);

// ---- Generate SQL ----
function esc(s) { return s.replace(/'/g, "''"); }

var out = [];
function emit(line) { out.push(line); }

emit('-- ============================================');
emit('-- Vehicle imagen_principal UPDATE statements');
emit('-- Generated from MongoDB image data');
emit('-- Run levels in order (1->5). Each level only');
emit('-- updates rows where imagen_principal is still NULL.');
emit('-- ============================================');
emit('');

var counts = { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 };

// Level 1: Exact match
emit('-- === LEVEL 1: Exact match (brand+model+year+km+cv+fuel) ===');
exactIndex.forEach(function(v) {
  emit("UPDATE vehicles SET imagen_principal = '" + esc(v.imageUrl) + "'");
  emit("WHERE (imagen_principal IS NULL OR imagen_principal = '')");
  emit("  AND LOWER(marca) = LOWER('" + esc(v.brand) + "')");
  emit("  AND LOWER(modelo) = LOWER('" + esc(v.model) + "')");
  emit("  AND a\u00f1o_matriculacion = " + v.year);
  emit("  AND kilometraje = " + v.km);
  emit("  AND potencia_cv = " + v.cv);
  emit("  AND combustible = '" + v.fuel + "';");
  emit('');
  counts.l1++;
});

// Level 2: Year-flexible match (brand+model+year(+/-1)+km+cv)
emit('-- === LEVEL 2: Year-flexible match (brand+model+year+/-1+km+cv) ===');
yearFlexIndex.forEach(function(v, key) {
  var parts = key.split('|');
  var targetYear = parseInt(parts[2]);
  emit("UPDATE vehicles SET imagen_principal = '" + esc(v.imageUrl) + "'");
  emit("WHERE (imagen_principal IS NULL OR imagen_principal = '')");
  emit("  AND LOWER(marca) = LOWER('" + esc(v.brand) + "')");
  emit("  AND LOWER(modelo) = LOWER('" + esc(v.model) + "')");
  emit("  AND a\u00f1o_matriculacion = " + targetYear);
  emit("  AND kilometraje = " + v.km);
  emit("  AND potencia_cv = " + v.cv + ";");
  emit('');
  counts.l2++;
});

// Level 3: Close km match (brand+model+year(+/-1)+km(5%)+cv)
emit('-- === LEVEL 3: Close km match (brand+model+year+/-1+km within 5%+cv) ===');
closeKmIndex.forEach(function(v, key) {
  var parts = key.split('|');
  var targetYear = parseInt(parts[2]);
  var kmLow = Math.floor(v.km * 0.95);
  var kmHigh = Math.ceil(v.km * 1.05);
  emit("UPDATE vehicles SET imagen_principal = '" + esc(v.imageUrl) + "'");
  emit("WHERE (imagen_principal IS NULL OR imagen_principal = '')");
  emit("  AND LOWER(marca) = LOWER('" + esc(v.brand) + "')");
  emit("  AND LOWER(modelo) = LOWER('" + esc(v.model) + "')");
  emit("  AND a\u00f1o_matriculacion = " + targetYear);
  emit("  AND kilometraje BETWEEN " + kmLow + " AND " + kmHigh);
  emit("  AND potencia_cv = " + v.cv + ";");
  emit('');
  counts.l3++;
});

// Level 4: CV match (brand+model+year(+/-1)+cv)
emit('-- === LEVEL 4: CV match (brand+model+year+/-1+cv) ===');
cvIndex.forEach(function(v, key) {
  var parts = key.split('|');
  var targetYear = parseInt(parts[2]);
  emit("UPDATE vehicles SET imagen_principal = '" + esc(v.imageUrl) + "'");
  emit("WHERE (imagen_principal IS NULL OR imagen_principal = '')");
  emit("  AND LOWER(marca) = LOWER('" + esc(v.brand) + "')");
  emit("  AND LOWER(modelo) = LOWER('" + esc(v.model) + "')");
  emit("  AND a\u00f1o_matriculacion = " + targetYear);
  emit("  AND potencia_cv = " + v.cv + ";");
  emit('');
  counts.l4++;
});

// Level 5: Loose match (brand+model+year(+/-1))
emit('-- === LEVEL 5: Loose match (brand+model+year+/-1) ===');
looseIndex.forEach(function(v, key) {
  var parts = key.split('|');
  var targetYear = parseInt(parts[2]);
  emit("UPDATE vehicles SET imagen_principal = '" + esc(v.imageUrl) + "'");
  emit("WHERE (imagen_principal IS NULL OR imagen_principal = '')");
  emit("  AND LOWER(marca) = LOWER('" + esc(v.brand) + "')");
  emit("  AND LOWER(modelo) = LOWER('" + esc(v.model) + "')");
  emit("  AND a\u00f1o_matriculacion = " + targetYear + ";");
  emit('');
  counts.l5++;
});

emit('-- === SUMMARY ===');
emit('-- Level 1 (exact):       ' + counts.l1 + ' statements');
emit('-- Level 2 (year-flex):   ' + counts.l2 + ' statements');
emit('-- Level 3 (close km):    ' + counts.l3 + ' statements');
emit('-- Level 4 (year+cv):     ' + counts.l4 + ' statements');
emit('-- Level 5 (year only):   ' + counts.l5 + ' statements');
emit('-- Total: ' + (counts.l1 + counts.l2 + counts.l3 + counts.l4 + counts.l5));

process.stdout.write(out.join('\n'));
