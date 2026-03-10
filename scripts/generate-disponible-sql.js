const fs = require('fs');
const mongoData = JSON.parse(fs.readFileSync('C:/Users/zetar/Downloads/db-midcar-extracted/vehicles-mongodb-compass.json', 'utf8'));

function normBrand(s) {
  return s.toLowerCase().replace(/citroën/g,'citroen').replace(/^vw$/,'volkswagen')
    .replace(/volkwagen/,'volkswagen').replace(/mercedes[- ]benz/,'mercedes benz').trim();
}
function getModel(title, brand) {
  const tl = title.toLowerCase();
  if (brand==='bmw') { if (/\b5[234][05]/.test(tl)) return 'serie 5'; if (/\b3[123][0568]/.test(tl)) return 'serie 3'; }
  if (brand==='ford') {
    if (tl.includes('transit')&&tl.includes('connect')) return 'transit connect';
    if (tl.includes('transit')&&tl.includes('courier')) return 'transit courier';
    if (tl.includes('transit')&&tl.includes('custom')) return 'transit custom';
    if ((tl.includes('grand')||tl.includes('grant'))&&tl.includes('connect')) return 'grant tourneo connect';
    if (tl.includes('custom')&&!tl.includes('connect')) return 'custom';
    if (tl.includes('transit')) return 'transit'; if (tl.includes('focus')) return 'focus'; if (tl.includes('mondeo')) return 'mondeo';
  }
  if (brand==='citroen') {
    if (tl.includes('berlingo')&&tl.includes('xl')) return 'berlingo xl';
    if (tl.includes('berlingo')) return 'berlingo'; if (tl.includes('jumpy')) return 'jumpy';
    if (tl.includes('jumper')) return 'jumper'; if (tl.includes('c4')) return 'c4'; if (tl.includes('c5')) return 'c5';
  }
  if (brand==='volkswagen') {
    if (tl.includes('caddy')) return 'caddy'; if (tl.includes('passat')) return 'passat';
    if (tl.includes('golf')||tl.includes('e-golf')) return 'golf'; if (tl.includes('transporter')) return 'transporter';
    if (tl.includes('crafter')) return 'crafter';
  }
  if (brand==='peugeot') {
    if (tl.includes('partner')) return 'partner'; if (tl.includes('expert')) return 'expert';
    if (tl.includes('5008')) return '5008'; if (tl.includes('3008')) return '3008';
    if (tl.includes('508')) return '508'; if (tl.includes('308')) return '308'; if (tl.includes('208')) return '208';
  }
  if (brand==='hyundai'&&(tl.includes('ioniq')||tl.includes('ionic'))) return 'ioniq';
  if (brand==='toyota') { if (tl.includes('proace')) return 'proace'; if (tl.includes('corolla')) return 'corolla'; if (tl.includes('c-hr')) return 'chr'; }
  if (brand==='dacia') { if (tl.includes('dokker')) return 'dokker'; if (tl.includes('sandero')) return 'sandero'; if (tl.includes('lodgy')) return 'lodgy'; if (tl.includes('logan')) return 'logan'; }
  if (brand==='fiat') { if (tl.includes('fiorino')) return 'fiorino'; if (tl.includes('doblo')) return 'doblo'; }
  if (brand==='renault') { if (tl.includes('clio')) return 'clio'; if (tl.includes('kangoo')) return 'kangoo'; if (tl.includes('master')) return 'master'; }
  if (brand==='seat'&&tl.includes('leon')) return 'leon';
  if (brand==='opel'&&tl.includes('corsa')) return 'corsa';
  if (brand==='skoda'&&tl.includes('octavia')) return 'octavia';
  if (brand==='volvo'&&tl.includes('xc40')) return 'xc40';
  if (brand==='kia') { if (tl.includes('niro')) return 'niro'; if (tl.includes('rio')) return 'rio'; }
  if (brand==='mazda'&&(tl.includes('mazda3')||tl.includes('mazda 3'))) return '3';
  if (brand==='mercedes benz'&&tl.includes('vito')) return 'vito';
  return null;
}

// Build best image per brand+model+year (from MongoDB)
const bestImages = new Map();
mongoData.forEach(v => {
  if (!v.FileDocuments || v.FileDocuments.length === 0) return;
  const title = v.Title || '';
  const brand = normBrand(title.split(/\s+/)[0]);
  const model = getModel(title, brand);
  if (!model) return;
  const year = parseInt((v.Year && v.Year['$numberInt']) || '0');
  const mainImg = v.FileDocuments.find(f => f.Main) || v.FileDocuments[0];

  for (let y = year - 1; y <= year + 1; y++) {
    const key = brand + '|' + model + '|' + y;
    if (!bestImages.has(key)) {
      bestImages.set(key, mainImg.Url);
    }
  }
});

// Generate VALUES for CTE
const values = [];
const seen = new Set();
for (const [key, url] of bestImages) {
  const [brand, model, yearStr] = key.split('|');
  const dedupKey = brand + '|' + model + '|' + yearStr;
  if (seen.has(dedupKey)) continue;
  seen.add(dedupKey);
  const escapedUrl = url.replace(/'/g, "''");
  values.push(`  ('${brand}', '${model}', ${yearStr}, '${escapedUrl}')`);
}

const sql = `WITH mongo_imgs(brand, model, year, img_url) AS (
  VALUES
${values.join(',\n')}
)
UPDATE vehicles v
SET imagen_principal = mi.img_url
FROM mongo_imgs mi
WHERE LOWER(v.marca) = mi.brand
  AND LOWER(v.modelo) = mi.model
  AND v."año_matriculacion" = mi.year
  AND (v.imagen_principal IS NULL OR v.imagen_principal = '');`;

fs.writeFileSync('scripts/update-disponible-images.sql', sql);
console.log('Total CTE values:', values.length);
console.log('File size:', fs.statSync('scripts/update-disponible-images.sql').size, 'bytes');
