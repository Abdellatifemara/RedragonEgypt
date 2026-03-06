// Apply downloads found from blog posts
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

const SW_ASSIGNMENTS = [
  // M801 - upgrade to CDN1 specific software
  { model: 'M801',       url: CDN1 + 'Redragon_M801-RGB_Software.exe?v=1767925752',    overwrite: true },
  // M901P-KS/WS - upgrade to CDN1
  { model: 'M901P-KS',  url: CDN1 + 'Redragon_M901P-KS_Software.exe?v=1767939928',   overwrite: true },
  { model: 'M901P-WS',  url: CDN1 + 'Redragon_M901P-KS_Software.exe?v=1767939928',   overwrite: true },
  // m816-lit - update to M816-PRO specific software
  { model: 'm816-lit',  url: CDN1 + 'Redragon_M816-PRO_Software.exe?v=1768205237',   overwrite: true },
  // S107 combo software
  { model: 'S107',      url: CDN1 + 'Redragon_S107-KS_Software.exe?v=1768359347',    overwrite: false },
  // S101-BA combo keyboard software
  { model: 'S101-BA',   url: CDN1 + 'Redragon_S101-BA-3_K503A_Software.exe?v=1768359354', overwrite: false },
  // S101W - same keyboard as S101-BA (K503)
  { model: 'S101W',     url: CDN1 + 'Redragon_S101-BA-3_K503A_Software.exe?v=1768359354', overwrite: false },
  // S01-5 - same combo family
  { model: 'S01-5',     url: CDN1 + 'Redragon_S101-BA-3_K503A_Software.exe?v=1768359354', overwrite: false },
  // k629-rgb - better URL from blog
  { model: 'k629-rgb',  url: CDN1 + 'Redragon_K629-RGB_Software.zip?v=1768212020',   overwrite: true },
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const a of SW_ASSIGNMENTS) {
    if (a.model !== id) continue;
    if (a.overwrite || !p.softwareUrl) {
      const action = p.softwareUrl ? 'UPDATED' : 'assigned';
      console.log('SW', action, id, ':', a.url.split('/').pop().split('?')[0].substring(0, 50));
      p.softwareUrl = a.url;
      updated++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
