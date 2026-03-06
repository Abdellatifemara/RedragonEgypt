// For new products with placeholder filenames that don't exist,
// set images to [] so the Redragon logo placeholder is shown
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

// Products that have placeholder filenames but no actual image files
const NO_REAL_IMAGE = [
  'M801', 'M901', 'M901P-KS', 'M901P-WS', 'M903P', 'M915WL-RGB',
  'K535', 'KG010-KN', 'KG010-WN'
];

let fixed = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  if (NO_REAL_IMAGE.includes(id)) {
    if (p.images && p.images.length > 0) {
      console.log('Clearing placeholder images for:', id, '->', JSON.stringify(p.images));
      p.images = [];
      p.has_image = false;
      fixed++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Cleared', fixed, 'products with placeholder images. Saved.');
