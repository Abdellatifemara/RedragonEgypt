// Assign generic Redragon drivers to products without specific software
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

// Generic mouse software (works for all Redragon wired gaming mice)
const GENERIC_MOUSE_SW = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/REDRAGON_Gaming_Mouse_20220728_V1058.rar?v=1659077702';

// Mice that should get generic software (no specific software found)
const MICE_FOR_GENERIC_SW = [
  'M601-RGB', 'M602-KS', 'M607', 'M607-white', 'M609',
  'm655-ks', 'm701-RGB', 'M703', 'm723', 'm725 lit',
  'M814RGB-PRO', 'm815-pro', 'm816-lit',
  'M694'  // also a Redragon mouse
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  if (MICE_FOR_GENERIC_SW.includes(id) && !p.softwareUrl) {
    p.softwareUrl = GENERIC_MOUSE_SW;
    console.log('Generic SW assigned to', id);
    updated++;
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'products with generic driver. Saved.');
