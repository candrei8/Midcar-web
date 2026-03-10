#!/usr/bin/env node
/**
 * Generate SQL UPDATE statements to populate imagen_principal
 * for Supabase vehicles that match MongoDB vehicles.
 *
 * Matching strategy: brand + model (flexible) + year (±1) + km + cv
 */

const fs = require('fs');
const path = require('path');

const mongoPath = path.join('C:', 'Users', 'zetar', 'Downloads', 'db-midcar-extracted', 'vehicles-mongodb-compass.json');
const data = fs.readFileSync(mongoPath, 'utf8');
const vehicles = JSON.parse(data);

function normBrand(s) {
  return s.toLowerCase()
    .replace(/citroën/g, 'citroen')
    .replace(/^vw$/, 'volkswagen')
    .replace(/volkwagen/, 'volkswagen')
    .replace(/mercedes[- ]benz/, 'mercedes benz')
    .trim();
}

function getFuel(v) {
  const fuel = (v.Fuel || '').toLowerCase();
  if (fuel.includes('diesel') || fuel.includes('diésel')) return 'diesel';
  if (fuel.includes('gasolina') && !fuel.includes('gas')) return 'gasolina';
  if (fuel.includes('glp') || fuel === 'gas' || fuel.includes('gas natural') || fuel.includes('gnc') || fuel.includes('tgi')) return 'glp';
  if (fuel.includes('híbrido') || fuel.includes('hibrido') || fuel.includes('hybrid')) return 'hibrido';
  if (fuel.includes('eléctrico') || fuel.includes('electrico') || fuel.includes('electric')) return 'electrico';
  return fuel;
}

// Build index: for each vehicle, extract normalized brand, model, year, km, cv
const mongoEntries = [];
vehicles.forEach(v => {
  if (!v.FileDocuments || v.FileDocuments.length === 0) return;
  const title = v.Title || '';
  const words = title.split(/\s+/);
  const rawBrand = words[0] || '';
  const brand = normBrand(rawBrand);
  const mainImg = v.FileDocuments.find(f => f.Main) || v.FileDocuments[0];
  const year = parseInt((v.Year && v.Year['$numberInt']) || '0');
  const km = parseInt((v.Mileage && v.Mileage['$numberInt']) || '0');
  const cv = parseInt((v.Power && v.Power['$numberInt']) || '0');
  const fuel = getFuel(v);
  const tl = title.toLowerCase();

  // Determine supabase-compatible model name
  let model = '';
  if (brand === 'bmw') {
    if (/\b5[234][05]/.test(tl) || tl.includes('530')) model = 'serie 5';
    else if (/\b3[123][0568]/.test(tl)) model = 'serie 3';
    else if (/\b7[345][05]/.test(tl)) model = 'serie 7';
  } else if (brand === 'ford') {
    if (tl.includes('transit') && tl.includes('connect')) model = 'transit connect';
    else if (tl.includes('transit') && tl.includes('courier')) model = 'transit courier';
    else if (tl.includes('transit') && tl.includes('custom')) model = 'transit custom';
    else if ((tl.includes('grand') || tl.includes('grant')) && tl.includes('connect')) model = 'grant tourneo connect';
    else if (tl.includes('custom') && !tl.includes('connect')) model = 'custom';
    else if (tl.includes('transit') && !tl.includes('connect') && !tl.includes('courier') && !tl.includes('custom')) model = 'transit';
    else if (tl.includes('focus')) model = 'focus';
    else if (tl.includes('mondeo')) model = 'mondeo';
  } else if (brand === 'citroen') {
    if (tl.includes('berlingo') && (tl.includes('xl') || tl.includes('talla xl'))) model = 'berlingo xl';
    else if (tl.includes('berlingo')) model = 'berlingo';
    else if (tl.includes('jumpy')) model = 'jumpy';
    else if (tl.includes('jumper')) model = 'jumper';
    else if (tl.includes('c4')) model = 'c4';
    else if (tl.includes('c5')) model = 'c5';
  } else if (brand === 'volkswagen') {
    if (tl.includes('caddy')) model = 'caddy';
    else if (tl.includes('passat')) model = 'passat';
    else if (tl.includes('golf') || tl.includes('e-golf')) model = 'golf';
    else if (tl.includes('transporter')) model = 'transporter';
    else if (tl.includes('crafter')) model = 'crafter';
    else if (tl.includes('t-cross')) model = 't-cross';
  } else if (brand === 'peugeot') {
    if (tl.includes('partner')) model = 'partner';
    else if (tl.includes('expert')) model = 'expert';
    else if (tl.includes('308sw') || tl.includes('308 sw')) model = '308';
    else if (tl.includes('508sw') || tl.includes('508 sw') || tl.includes('508')) model = '508';
    else if (tl.includes('3008')) model = '3008';
    else if (tl.includes('5008')) model = '5008';
    else if (tl.includes('308')) model = '308';
    else if (tl.includes('208')) model = '208';
  } else if (brand === 'hyundai') {
    if (tl.includes('ioniq') || tl.includes('ionic')) model = 'ioniq';
  } else if (brand === 'toyota') {
    if (tl.includes('proace')) model = 'proace';
    else if (tl.includes('corolla')) model = 'corolla';
    else if (tl.includes('c-hr')) model = 'chr';
  } else {
    // Generic: extract model from second word of title
    const modelWords = [];
    for (let i = 1; i < words.length; i++) {
      const w = words[i].toLowerCase();
      // Stop at version/spec words
      if (/^\d+\.?\d*(tdi|hdi|bluehdi|ecoblue|mjet|cv|kw)/i.test(w)) break;
      if (/^(van|furgon|furgón|combi|xl|l[12]|sedan|sw|sb|st-line|active|style)/i.test(w)) break;
      modelWords.push(w);
      if (modelWords.length >= 2) break;
    }
    model = modelWords.join(' ');
  }

  if (!model || !brand) return;

  mongoEntries.push({ brand, model, year, km, cv, fuel, url: mainImg.Url });
});

console.error(`Parsed ${mongoEntries.length} MongoDB entries with images`);

// Generate SQL UPDATE statements
// Strategy: UPDATE vehicles SET imagen_principal = 'url' WHERE LOWER(marca)='brand' AND LOWER(modelo)='model' AND year BETWEEN y-1 AND y+1 AND km = km AND cv = cv
const statements = [];
const seen = new Set();

mongoEntries.forEach(e => {
  const key = `${e.brand}|${e.model}|${e.year}|${e.km}|${e.cv}`;
  if (seen.has(key)) return;
  seen.add(key);

  const escapedUrl = e.url.replace(/'/g, "''");
  // High confidence: brand + model + year(±1) + km + cv
  statements.push(
    `UPDATE vehicles SET imagen_principal = '${escapedUrl}' ` +
    `WHERE LOWER(marca) = '${e.brand}' AND LOWER(modelo) = '${e.model}' ` +
    `AND "año_matriculacion" BETWEEN ${e.year - 1} AND ${e.year + 1} ` +
    `AND kilometraje = ${e.km} AND potencia_cv = ${e.cv} ` +
    `AND (imagen_principal IS NULL OR imagen_principal = '');`
  );
});

// Also add looser matches: brand + model + year(±1) + cv (no km)
const seen2 = new Set();
mongoEntries.forEach(e => {
  const key = `${e.brand}|${e.model}|${e.year}|${e.cv}`;
  if (seen2.has(key)) return;
  seen2.add(key);

  const escapedUrl = e.url.replace(/'/g, "''");
  statements.push(
    `UPDATE vehicles SET imagen_principal = '${escapedUrl}' ` +
    `WHERE LOWER(marca) = '${e.brand}' AND LOWER(modelo) = '${e.model}' ` +
    `AND "año_matriculacion" BETWEEN ${e.year - 1} AND ${e.year + 1} ` +
    `AND potencia_cv = ${e.cv} ` +
    `AND (imagen_principal IS NULL OR imagen_principal = '');`
  );
});

// Loosest: brand + model + year(±1)
const seen3 = new Set();
mongoEntries.forEach(e => {
  const key = `${e.brand}|${e.model}|${e.year}`;
  if (seen3.has(key)) return;
  seen3.add(key);

  const escapedUrl = e.url.replace(/'/g, "''");
  statements.push(
    `UPDATE vehicles SET imagen_principal = '${escapedUrl}' ` +
    `WHERE LOWER(marca) = '${e.brand}' AND LOWER(modelo) = '${e.model}' ` +
    `AND "año_matriculacion" BETWEEN ${e.year - 1} AND ${e.year + 1} ` +
    `AND (imagen_principal IS NULL OR imagen_principal = '');`
  );
});

console.log('-- Auto-generated image updates from MongoDB data');
console.log('-- Total statements: ' + statements.length);
console.log('BEGIN;');
statements.forEach(s => console.log(s));
console.log('COMMIT;');

console.error(`Generated ${statements.length} UPDATE statements`);
