const fs = require('fs');
const FILE = 'C:/Users/pc/Desktop/G/Redragon/clean_deploy/data/products.json';
const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const p = d.find(x => (x.model||x.id) === 'K503 aw');
if (p) {
  // Use official CDN2 K503.png - correct keyboard, no French layout
  // White variant - same design as black, pending better white-specific image
  p.images = ['https://cdn.shopify.com/s/files/1/0655/1289/8735/files/K503.png?v=1750760697'];
  console.log('K503 aw updated (CDN2 - correct keyboard, pending white-specific image)');
}

fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
console.log('Saved.');
