// Revert wrong image assignments from fetch_products.js
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));
let fixed = 0;

d.forEach(p => {
  const id = p.model || p.id || '';

  // G711 (Forge controller) got G710 (Rift) images - WRONG
  if (id === 'G711' && p.images && p.images.some(i => i.includes('G710'))) {
    console.log('Reverting G711 to local images (had wrong G710 images)');
    p.images = ['G711.jpg', 'G711_2.jpg'];
    fixed++;
  }

  // m724-white should show white variant, not black m724
  if (id === 'm724-white' && p.images && p.images.some(i => i.includes('cdn.shopify'))) {
    console.log('Reverting m724-white to local image (has wrong black m724 CDN images)');
    p.images = ['m724-white.jpeg'];
    fixed++;
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Fixed', fixed, 'entries. Saved.');
