const fs = require('fs');
const sql = fs.readFileSync('scripts/update-disponible-images.sql', 'utf8');

// Extract all VALUES entries
const valuesMatch = sql.match(/VALUES\n([\s\S]+?)\n\)/);
if (!valuesMatch) { console.error('No VALUES found'); process.exit(1); }

const entries = valuesMatch[1].split('\n').map(l => l.trim()).filter(l => l.startsWith('('));

// Split into batches of 50
const batchSize = 50;
const batches = [];
for (let i = 0; i < entries.length; i += batchSize) {
  const batch = entries.slice(i, i + batchSize);
  // Remove trailing comma from last entry
  const lastIdx = batch.length - 1;
  batch[lastIdx] = batch[lastIdx].replace(/,\s*$/, '');

  const batchSql = `WITH mongo_imgs(brand, model, year, img_url) AS (
  VALUES
  ${batch.join('\n  ')}
)
UPDATE vehicles v
SET imagen_principal = mi.img_url
FROM mongo_imgs mi
WHERE LOWER(v.marca) = mi.brand
  AND LOWER(v.modelo) = mi.model
  AND v."año_matriculacion" = mi.year
  AND (v.imagen_principal IS NULL OR v.imagen_principal = '');`;

  fs.writeFileSync(`scripts/batch-${String(i/batchSize).padStart(2,'0')}.sql`, batchSql);
  batches.push(i/batchSize);
}

console.log(`Split into ${batches.length} batches of ~${batchSize} entries each`);
console.log(`Total entries: ${entries.length}`);
