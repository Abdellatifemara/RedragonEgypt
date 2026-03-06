const fs = require('fs');
const FILE = 'C:/Users/pc/Desktop/G/Redragon/clean_deploy/data/products.json';
const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));

const p = d.find(x => (x.model||x.id).toLowerCase() === 'k502');
if (p) {
  p.images = [
    'https://hardwaremarket.net/wp-content/uploads/2021/07/Redragon-K502-RGB-Gaming-Keyboard-1.jpg',
    'https://hardwaremarket.net/wp-content/uploads/2021/07/Redragon-K502-RGB-Gaming-Keyboard-2.jpg',
    'https://hardwaremarket.net/wp-content/uploads/2021/07/Redragon-K502-RGB-Gaming-Keyboard-3.jpg',
  ];
  console.log('k502 images updated');
} else {
  console.log('k502 not found');
}

fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
console.log('Saved.');
