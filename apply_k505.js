const fs = require('fs');
const FILE = 'C:/Users/pc/Desktop/G/Redragon/clean_deploy/data/products.json';
const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const p = d.find(x => (x.model||x.id) === 'K505');
if (p) {
  p.images = [
    'https://cdn.shopify.com/s/files/1/0858/8878/products/redragon-yaksa-k505-keyboard-199.jpg',
    'https://cdn.shopify.com/s/files/1/0858/8878/products/redragon-yaksa-k505-keyboard-266.jpg',
  ];
  console.log('K505 images updated');
} else {
  console.log('K505 not found');
}

fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
console.log('Saved.');
