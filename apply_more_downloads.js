const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));
const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

const UPDATES = [
  // M915WL-RGB software (new)
  { model: 'M915WL-RGB', softwareUrl: CDN1 + 'Redragon_M915RGB_Software.exe?v=1768205230' },
  // M901 software (wired version)
  { model: 'M901',       softwareUrl: CDN1 + 'Redragon_M901K_Software.exe?v=1767925787' },
  // S01-5 combo - specific S101-3 software
  { model: 'S01-5',      softwareUrl: CDN1 + 'Redragon_S101-3_Software.exe?v=1768359346', overwrite: true },
  { model: 'S01-5',      manualUrl:   CDN1 + 'S101_User_Manual.pdf?v=1619770096' },
  // H510 manuals (confirm/add)
  { model: 'H510-fb',    manualUrl:   CDN1 + 'H510_User_Manual.pdf?v=1737531920' },
  { model: 'H510RGB',    manualUrl:   CDN1 + 'H510_User_Manual.pdf?v=1737531920' },
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const a of UPDATES) {
    if (a.model !== id) continue;
    if (a.softwareUrl && (a.overwrite || !p.softwareUrl)) {
      console.log('SW', p.softwareUrl ? 'UPDATED' : 'assigned', id, ':', a.softwareUrl.split('/').pop().split('?')[0]);
      p.softwareUrl = a.softwareUrl;
      updated++;
    }
    if (a.manualUrl && !p.manualUrl) {
      console.log('MAN assigned', id, ':', a.manualUrl.split('/').pop().split('?')[0]);
      p.manualUrl = a.manualUrl;
      updated++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
