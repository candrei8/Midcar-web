/**
 * Generate efficient batch SQL for imagen_principal updates.
 * Instead of individual UPDATEs, generates a single UPDATE ... FROM VALUES
 * approach that can be run in Supabase.
 *
 * Outputs a DRY-RUN count query first, then the actual UPDATE.
 */

const fs = require('fs');

// Reuse the matching logic from match-images.js
// (inline the brand/model parsing to keep it self-contained)

const mongoData = JSON.parse(
  fs.readFileSync('C:/Users/zetar/Downloads/db-midcar-extracted/vehicles-mongodb-compass.json', 'utf8')
);

const brandMap = {
  'audi': 'Audi', 'bmw': 'Bmw', 'citroen': 'Citroen', 'citro\u00ebn': 'Citroen',
  'dacia': 'Dacia', 'fiat': 'Fiat', 'ford': 'Ford', 'honda': 'Honda',
  'hyundai': 'Hyundai', 'kia': 'Kia', 'kawasaki': 'Kawasaki',
  'land': 'Land Rover', 'lexus': 'Lexus', 'mazda': 'Mazda', 'mazda3': 'Mazda',
  'mercedes': 'Mercedes Benz', 'mini': 'MINI', 'mitsubishi': 'Mitsubishi',
  'nissan': 'Nissan', 'opel': 'Opel', 'peugeot': 'Peugeot', 'renault': 'Renault',
  'seat': 'Seat', 'skoda': 'Skoda', 'ssangyong': 'Ssangyong', 'suzuki': 'Suzuki',
  'toyota': 'Toyota', 'volkswagen': 'Volkswagen', 'vw': 'Volkswagen',
  'volkwagen': 'Volkswagen', 'volvo': 'Volvo', 'chrysler': 'Chrysler',
  'chevrolet': 'Chevrolet', 'astondoa': 'Astondoa',
};

const modelPatterns = {
  'Bmw': [
    { regex: /\bX5\b/i, m: 'X5' }, { regex: /\bX3\b/i, m: 'X3' }, { regex: /\bX1\b/i, m: 'X1' },
    { regex: /\b(?:BMW|Bmw)\s+7\d{2}/i, m: 'Serie 7' },
    { regex: /\b(?:BMW|Bmw)\s+5\d{2}/i, m: 'Serie 5' },
    { regex: /\b(?:BMW|Bmw)\s+3\d{2}/i, m: 'Serie 3' },
    { regex: /\b(?:BMW|Bmw)\s+2\d{2}/i, m: 'Serie 2' },
  ],
  'Citroen': [
    { regex: /\bBerlingo\s+XL\b/i, m: 'Berlingo XL' },
    { regex: /\bBerlingo\b/i, m: 'Berlingo' },
    { regex: /\bC3\b/i, m: 'C3' },
    { regex: /\bGrand\s+C4\s+Picasso\b/i, m: 'Grand C4 Picasso Spacetourer' },
    { regex: /\bC4\s+Grand\s+Picasso\b/i, m: 'C4 Grand Picasso' },
    { regex: /\bC4\s+Picasso\b/i, m: 'C4 Picasso' },
    { regex: /\bC4\b/i, m: 'C4' }, { regex: /\bC5\b/i, m: 'C5' },
    { regex: /\bJumper\b/i, m: 'Jumper' }, { regex: /\bJumpy\b/i, m: 'Jumpy' },
    { regex: /\bNemo/i, m: 'Nemo' },
  ],
  'Ford': [
    { regex: /\bGrand\s+(?:Tourneo\s+)?Connect\b/i, m: 'Grant Tourneo Connect' },
    { regex: /\bTourneo\s+Connect\b/i, m: 'Tourneo Connect' },
    { regex: /\bTourneo\b/i, m: 'Tourneo' },
    { regex: /\bTransit\s+Custom\b/i, m: 'Transit Custom' },
    { regex: /\bTransit\s+Connect\b/i, m: 'Transit Connect' },
    { regex: /\bTransit\s+Courier\b/i, m: 'Transit Courier' },
    { regex: /\bTransit\b/i, m: 'Transit' },
    { regex: /\bS-?[Mm]ax\b/i, m: 'S-Max' },
    { regex: /\bMondeo\b/i, m: 'Mondeo' }, { regex: /\bFocus\b/i, m: 'Focus' },
    { regex: /\bFiesta\b/i, m: 'Fiesta' }, { regex: /\bKuga\b/i, m: 'Kuga' },
    { regex: /\bKa\b/i, m: 'Ka' }, { regex: /\bCustom\b/i, m: 'Custom' },
  ],
  'Mercedes Benz': [
    { regex: /\bSprinter\b/i, m: 'Sprinter' }, { regex: /\bVito\b/i, m: 'Vito' },
    { regex: /\bClase\s+R\b/i, m: 'Clase R' }, { regex: /\bR\s*350\b/i, m: 'Clase R' },
    { regex: /\bClase\s+S\b/i, m: 'Clase S' }, { regex: /\bS\s*[35]\d{2}\b/i, m: 'Clase S' },
    { regex: /\bCLA\b/, m: 'CLA' }, { regex: /\bCLS\b/, m: 'Cls' },
    { regex: /\bB\s*200\b/i, m: 'B 200' }, { regex: /\bC\s*270\b/i, m: 'C270' },
  ],
  'Volkswagen': [
    { regex: /\bCaddy\s+Kombi\b/i, m: 'Caddy Kombi' },
    { regex: /\bCaddy\s+Maxi\b/i, m: 'Caddy Kombi' },
    { regex: /\bCaddy\b/i, m: 'Caddy' },
    { regex: /\bPassat\s+CC\b/i, m: 'Passat CC' },
    { regex: /\bCC\b/, m: 'CC' }, { regex: /\bCrafter\b/i, m: 'Crafter' },
    { regex: /\bGolf\b/i, m: 'Golf' }, { regex: /\bPassat\b/i, m: 'Passat' },
    { regex: /\bPolo\b/i, m: 'Polo' }, { regex: /\bSharan\b/i, m: 'Sharan' },
    { regex: /\bTiguan\b/i, m: 'Tiguan' }, { regex: /\bTransporter\b/i, m: 'Transporter' },
    { regex: /\bT5\b/i, m: 'Transporter' }, { regex: /\bT6\b/i, m: 'Transporter' },
  ],
  'Toyota': [
    { regex: /\bYaris\s+Hybrid\b/i, m: 'Yaris Hybrid' },
    { regex: /\bYaris\b/i, m: 'Yaris' }, { regex: /\bAuris\b/i, m: 'Auris' },
    { regex: /\bAvensis\b/i, m: 'Avensis' }, { regex: /\bAygo\b/i, m: 'Aygo' },
    { regex: /\bC-?HR\b/i, m: 'CHR' }, { regex: /\bCorolla\b/i, m: 'Corolla' },
    { regex: /\bProace\b/i, m: 'Proace' },
  ],
  'Renault': [
    { regex: /\bClio\b/i, m: 'Clio' }, { regex: /\bEspace\b/i, m: 'Espace' },
    { regex: /\bKangoo\b/i, m: 'Kangoo' }, { regex: /\bLaguna\b/i, m: 'Laguna' },
    { regex: /\bMaster\b/i, m: 'Master' }, { regex: /\bM[e\u00e9]gane\b/i, m: 'Megane' },
    { regex: /\bTalisman\b/i, m: 'Talisman' }, { regex: /\bTrafic\b/i, m: 'Trafic' },
  ],
  'Peugeot': [
    { regex: /\b208/i, m: '208' }, { regex: /\b3008/i, m: '3008' },
    { regex: /\b307/i, m: '307' }, { regex: /\b308/i, m: '308' },
    { regex: /\b5008/i, m: '5008' }, { regex: /\b508/i, m: '508' },
    { regex: /\b807/i, m: '807' }, { regex: /\bBipper\b/i, m: 'Bipper' },
    { regex: /\bBoxer\b/i, m: 'Boxer' }, { regex: /\bExpert\b/i, m: 'Expert' },
    { regex: /\bPartner\b/i, m: 'Partner' }, { regex: /\bRifter\b/i, m: 'Rifter' },
  ],
  'Opel': [
    { regex: /\bAstra\b/i, m: 'Astra' }, { regex: /\bCombo\b/i, m: 'Combo' },
    { regex: /\bCorsa\b/i, m: 'Corsa' }, { regex: /\bInsignia\b/i, m: 'Insignia' },
    { regex: /\bSt\b/i, m: 'Insignia' }, { regex: /\bMovano\b/i, m: 'Movano' },
  ],
  'Seat': [
    { regex: /\bExeo\b/i, m: 'Exeo' }, { regex: /\bLe[o\u00f3]n\b/i, m: 'Leon' },
  ],
  'Hyundai': [
    { regex: /\bGrand\s+Santa\s+Fe\b/i, m: 'Grand Santa Fe' },
    { regex: /\bSanta\s+Fe\b/i, m: 'Santa Fe' },
    { regex: /\bi30\b/i, m: 'I30' }, { regex: /\bi40\b/i, m: 'I40' },
    { regex: /\bIoniq\b/i, m: 'Ioniq' },
  ],
  'Dacia': [
    { regex: /\bDokker\b/i, m: 'Dokker' }, { regex: /\bDuster\b/i, m: 'Duster' },
    { regex: /\bLodgy\b/i, m: 'Lodgy' }, { regex: /\bLogan\b/i, m: 'Logan' },
    { regex: /\bSandero\b/i, m: 'Sandero' },
  ],
  'Fiat': [
    { regex: /\b500\b/, m: '500' }, { regex: /\bDobl[o\u00f2]\b/i, m: 'Doblo' },
    { regex: /\bFiorino\b/i, m: 'Fiorino' }, { regex: /\bFreemont\b/i, m: 'Freemont' },
    { regex: /\bScudo\b/i, m: 'Scudo' }, { regex: /\bTalento\b/i, m: 'Talento' },
  ],
  'Nissan': [{ regex: /\bQashqai\b/i, m: 'Qashqai' }],
  'Volvo': [
    { regex: /\bS60\b/i, m: 'S60' }, { regex: /\bV40\b/i, m: 'V40' },
    { regex: /\bXC40\b/i, m: 'XC40' },
  ],
  'Kia': [{ regex: /\bNiro\b/i, m: 'Niro' }, { regex: /\bRio\b/i, m: 'Rio' }],
  'Skoda': [{ regex: /\bOctavia\b/i, m: 'Octavia' }, { regex: /\bSuperb\b/i, m: 'Superb' }],
  'Mazda': [
    { regex: /Mazda\s*3/i, m: '3' }, { regex: /Mazda\s*5/i, m: '5' },
    { regex: /Mazda\s*6/i, m: '6' },
  ],
  'Lexus': [
    { regex: /\bCT\b/, m: 'CT' }, { regex: /\bIS\s*250\b/i, m: 'IS 250' },
    { regex: /\bUX\s*250/i, m: 'UX 250h' },
  ],
  'Honda': [{ regex: /\bCR-?V\b/i, m: 'Cr-v' }],
  'Mitsubishi': [{ regex: /\bOutlander\b/i, m: 'Outlander' }],
  'MINI': [{ regex: /\bCountryman\b/i, m: 'Countryman' }, { regex: /./, m: 'Countryman' }],
  'Ssangyong': [{ regex: /\bTivoli\b/i, m: 'Tivoli' }],
  'Suzuki': [{ regex: /\bS[\.\s-]?Cross\b/i, m: 'S.Cross' }, { regex: /\bSwift\b/i, m: 'swift' }],
  'Land Rover': [{ regex: /\bFreelander\b/i, m: 'Freelander' }],
  'Audi': [
    { regex: /\bA4\b/i, m: 'A4' }, { regex: /\bAvant\b/i, m: 'A4' },
    { regex: /\bA6\b/i, m: 'A6' }, { regex: /\bQ7\b/i, m: 'Q7' },
  ],
  'Chrysler': [{ regex: /\bVoyager\b/i, m: 'Voyager' }],
  'Astondoa': [{ regex: /\b40\s*Fly\b/i, m: '40 Fly' }],
  'Chevrolet': [{ regex: /\bExpress\b/i, m: 'Express' }],
  'Kawasaki': [{ regex: /\bZ[R]?\d*/i, m: 'Z' }],
};

var fuelMap = {
  'diesel': 'diesel', 'gasolina': 'gasolina', 'hibrido': 'hibrido',
  'hybrid': 'hibrido', 'electrico': 'electrico', 'glp': 'glp', 'gnc': 'gnc', 'gas': 'glp',
};

function parseBrand(title) {
  var lower = title.toLowerCase();
  if (lower.startsWith('mercedes benz') || lower.startsWith('mercedes-benz')) return 'Mercedes Benz';
  if (lower.startsWith('land rover')) return 'Land Rover';
  var firstWord = lower.split(/\s+/)[0];
  return brandMap[firstWord] || null;
}

function parseModel(brand, title) {
  var patterns = modelPatterns[brand];
  if (!patterns) return null;
  for (var i = 0; i < patterns.length; i++) {
    if (patterns[i].regex.test(title)) return patterns[i].m;
  }
  return null;
}

function getMainImage(docs) {
  if (!docs || docs.length === 0) return null;
  var main = docs.find(function(f) { return f.Main === true; });
  return main ? main.Url : docs[0].Url;
}

function getVal(f) {
  if (f === null || f === undefined) return null;
  if (typeof f === 'object') {
    if (f.$numberInt) return parseInt(f.$numberInt);
    if (f.$numberDecimal) return parseFloat(f.$numberDecimal);
    if (f.$numberLong) return parseInt(f.$numberLong);
  }
  return typeof f === 'number' ? f : (typeof f === 'string' ? (parseFloat(f) || null) : null);
}

// Parse all MongoDB vehicles
var vehicles = mongoData.map(function(v) {
  var brand = parseBrand(v.Title || '');
  var model = brand ? parseModel(brand, v.Title || '') : null;
  var rawFuel = (v.Fuel || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return {
    brand: brand, model: model,
    year: getVal(v.Year), km: getVal(v.Mileage), cv: getVal(v.Power),
    price: getVal(v.Price), fuel: fuelMap[rawFuel] || rawFuel,
    imageUrl: getMainImage(v.FileDocuments), title: v.Title,
  };
}).filter(function(v) { return v.brand && v.model && v.imageUrl; });

console.error('Parsed ' + vehicles.length + ' matchable MongoDB vehicles');

// Build a lookup: for each (brand, model, year+/-1) -> best image
// Priority: exact year > year+/-1, and prefer vehicles with more images
// For each target (brand, model, targetYear, km, cv) find the best image

// Strategy: build a comprehensive mapping table as SQL VALUES
// Then do a single UPDATE with JOIN

// Deduplicate: one entry per unique (brand, model, year, km, cv, fuel)
var seen = new Set();
var entries = [];
for (var i = 0; i < vehicles.length; i++) {
  var v = vehicles[i];
  if (!v.year || !v.km || !v.cv || !v.fuel) continue;
  // For exact year and year+/-1
  for (var dy = -1; dy <= 1; dy++) {
    var targetYear = v.year + dy;
    var key = [v.brand.toLowerCase(), v.model.toLowerCase(), targetYear, v.km, v.cv, v.fuel].join('|');
    if (!seen.has(key)) {
      seen.add(key);
      entries.push({
        brand: v.brand.toLowerCase(),
        model: v.model.toLowerCase(),
        year: targetYear,
        km: v.km,
        cv: v.cv,
        fuel: v.fuel,
        imageUrl: v.imageUrl,
      });
    }
  }
}

console.error('Generated ' + entries.length + ' lookup entries (with year +/-1)');

// Output a dry-run count query using the first 50 entries as a sample
var sampleSize = Math.min(50, entries.length);
var out = [];

out.push('-- ============================================');
out.push('-- DRY RUN: Count how many vehicles would match');
out.push('-- ============================================');
out.push('');

// For the dry run, output a query that creates a temp table from VALUES and joins
out.push('WITH mongo_images(brand, model, year, km, cv, fuel, img_url) AS (');
out.push('  VALUES');
var valueLines = entries.map(function(e) {
  var url = e.imageUrl.replace(/'/g, "''");
  var mod = e.model.replace(/'/g, "''");
  return "    ('" + e.brand + "', '" + mod + "', " + e.year + ", " + e.km + ", " + e.cv + ", '" + e.fuel + "', '" + url + "')";
});
out.push(valueLines.join(',\n'));
out.push(')');
out.push('SELECT COUNT(*) as would_be_updated');
out.push('FROM vehicles v');
out.push('JOIN mongo_images mi');
out.push('  ON LOWER(v.marca) = mi.brand');
out.push('  AND LOWER(v.modelo) = mi.model');
out.push('  AND v.a\u00f1o_matriculacion = mi.year');
out.push('  AND v.kilometraje = mi.km');
out.push('  AND v.potencia_cv = mi.cv');
out.push('  AND v.combustible = mi.fuel');
out.push("WHERE v.imagen_principal IS NULL OR v.imagen_principal = '';");

// Write to file
fs.writeFileSync('C:/Users/zetar/Documents/CEO/midcar-web/scripts/dry-run-count.sql', out.join('\n'));
console.error('Wrote dry-run count SQL to scripts/dry-run-count.sql');
console.error('Entries in VALUES: ' + entries.length);

// Also output the actual UPDATE statement
var updateOut = [];
updateOut.push('-- ============================================');
updateOut.push('-- ACTUAL UPDATE: Set imagen_principal from MongoDB data');
updateOut.push('-- Level: brand+model+year(+/-1)+km+cv+fuel (highest confidence)');
updateOut.push('-- ============================================');
updateOut.push('');
updateOut.push('WITH mongo_images(brand, model, year, km, cv, fuel, img_url) AS (');
updateOut.push('  VALUES');
updateOut.push(valueLines.join(',\n'));
updateOut.push(')');
updateOut.push('UPDATE vehicles v');
updateOut.push("SET imagen_principal = mi.img_url");
updateOut.push('FROM mongo_images mi');
updateOut.push('WHERE LOWER(v.marca) = mi.brand');
updateOut.push('  AND LOWER(v.modelo) = mi.model');
updateOut.push('  AND v.a\u00f1o_matriculacion = mi.year');
updateOut.push('  AND v.kilometraje = mi.km');
updateOut.push('  AND v.potencia_cv = mi.cv');
updateOut.push('  AND v.combustible = mi.fuel');
updateOut.push("  AND (v.imagen_principal IS NULL OR v.imagen_principal = '');");

fs.writeFileSync('C:/Users/zetar/Documents/CEO/midcar-web/scripts/update-images.sql', updateOut.join('\n'));
console.error('Wrote UPDATE SQL to scripts/update-images.sql');

// Also output a looser UPDATE (brand+model+year+/-1+cv only, no km/fuel) for remaining nulls
var seenLoose = new Set();
var looseEntries = [];
for (var j = 0; j < vehicles.length; j++) {
  var vl = vehicles[j];
  if (!vl.year || !vl.cv) continue;
  for (var dy2 = -1; dy2 <= 1; dy2++) {
    var ty = vl.year + dy2;
    var lkey = [vl.brand.toLowerCase(), vl.model.toLowerCase(), ty, vl.cv].join('|');
    if (!seenLoose.has(lkey)) {
      seenLoose.add(lkey);
      looseEntries.push({
        brand: vl.brand.toLowerCase(), model: vl.model.toLowerCase(),
        year: ty, cv: vl.cv, imageUrl: vl.imageUrl,
      });
    }
  }
}

var looseValueLines = looseEntries.map(function(e) {
  var url = e.imageUrl.replace(/'/g, "''");
  var mod = e.model.replace(/'/g, "''");
  return "    ('" + e.brand + "', '" + mod + "', " + e.year + ", " + e.cv + ", '" + url + "')";
});

var looseOut = [];
looseOut.push('-- ============================================');
looseOut.push('-- LOOSE UPDATE: brand+model+year(+/-1)+cv');
looseOut.push('-- Run AFTER the exact update above');
looseOut.push('-- ============================================');
looseOut.push('');
looseOut.push('WITH mongo_images(brand, model, year, cv, img_url) AS (');
looseOut.push('  VALUES');
looseOut.push(looseValueLines.join(',\n'));
looseOut.push(')');
looseOut.push('UPDATE vehicles v');
looseOut.push("SET imagen_principal = mi.img_url");
looseOut.push('FROM mongo_images mi');
looseOut.push('WHERE LOWER(v.marca) = mi.brand');
looseOut.push('  AND LOWER(v.modelo) = mi.model');
looseOut.push('  AND v.a\u00f1o_matriculacion = mi.year');
looseOut.push('  AND v.potencia_cv = mi.cv');
looseOut.push("  AND (v.imagen_principal IS NULL OR v.imagen_principal = '');");

fs.writeFileSync('C:/Users/zetar/Documents/CEO/midcar-web/scripts/update-images-loose.sql', looseOut.join('\n'));
console.error('Wrote loose UPDATE SQL to scripts/update-images-loose.sql');
console.error('Loose entries: ' + looseEntries.length);

// Loosest: brand+model+year+/-1
var seenLoosest = new Set();
var loosestEntries = [];
for (var k = 0; k < vehicles.length; k++) {
  var vk = vehicles[k];
  if (!vk.year) continue;
  for (var dy3 = -1; dy3 <= 1; dy3++) {
    var ty3 = vk.year + dy3;
    var kkey = [vk.brand.toLowerCase(), vk.model.toLowerCase(), ty3].join('|');
    if (!seenLoosest.has(kkey)) {
      seenLoosest.add(kkey);
      loosestEntries.push({
        brand: vk.brand.toLowerCase(), model: vk.model.toLowerCase(),
        year: ty3, imageUrl: vk.imageUrl,
      });
    }
  }
}

var loosestValueLines = loosestEntries.map(function(e) {
  var url = e.imageUrl.replace(/'/g, "''");
  var mod = e.model.replace(/'/g, "''");
  return "    ('" + e.brand + "', '" + mod + "', " + e.year + ", '" + url + "')";
});

var loosestOut = [];
loosestOut.push('-- ============================================');
loosestOut.push('-- LOOSEST UPDATE: brand+model+year(+/-1) only');
loosestOut.push('-- Run AFTER both updates above');
loosestOut.push('-- ============================================');
loosestOut.push('');
loosestOut.push('WITH mongo_images(brand, model, year, img_url) AS (');
loosestOut.push('  VALUES');
loosestOut.push(loosestValueLines.join(',\n'));
loosestOut.push(')');
loosestOut.push('UPDATE vehicles v');
loosestOut.push("SET imagen_principal = mi.img_url");
loosestOut.push('FROM mongo_images mi');
loosestOut.push('WHERE LOWER(v.marca) = mi.brand');
loosestOut.push('  AND LOWER(v.modelo) = mi.model');
loosestOut.push('  AND v.a\u00f1o_matriculacion = mi.year');
loosestOut.push("  AND (v.imagen_principal IS NULL OR v.imagen_principal = '');");

fs.writeFileSync('C:/Users/zetar/Documents/CEO/midcar-web/scripts/update-images-loosest.sql', loosestOut.join('\n'));
console.error('Wrote loosest UPDATE SQL to scripts/update-images-loosest.sql');
console.error('Loosest entries: ' + loosestEntries.length);
