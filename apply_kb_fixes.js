const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, 'data/products.json');
const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// K503 - official redragon.com CDN (English layout)
const k503 = d.find(p => (p.model||p.id) === 'K503');
if (k503) {
  k503.images = ['https://cdn.shopify.com/s/files/1/0655/1289/8735/files/K503.png?v=1750760697'];
  console.log('K503 updated');
}

// K506 - redragon.com.pk CDN (English layout, clean filenames)
const k506 = d.find(p => (p.model||p.id) === 'K506');
if (k506) {
  k506.images = [
    'https://cdn.shopify.com/s/files/1/0706/5170/7667/files/k506_centaur_2-01.jpg',
    'https://cdn.shopify.com/s/files/1/0706/5170/7667/files/k506_centaur_2-03.jpg',
    'https://cdn.shopify.com/s/files/1/0706/5170/7667/files/k506_centaur_2-05.jpg',
  ];
  console.log('K506 updated');
}

fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
console.log('Saved.');
