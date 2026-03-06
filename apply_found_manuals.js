// Apply the 3 manuals found via CDN probe
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const CDN = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

const ASSIGNMENTS = [
  { model: 'K515 RGB', manualUrl: CDN + 'K515_User_Manual.pdf' },
  { model: 'K539',     manualUrl: CDN + 'K539_User_Manual.pdf' },
  { model: 'K550',     manualUrl: CDN + 'K550_User_Manual.pdf' },
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const a of ASSIGNMENTS) {
    if (a.model === id && !p.manualUrl) {
      p.manualUrl = a.manualUrl;
      console.log('Manual assigned to', id);
      updated++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'products. Saved.');
