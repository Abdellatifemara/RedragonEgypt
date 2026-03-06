const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));
let fixed = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  // m701-RGB has M808 files - WRONG
  if (id === 'm701-RGB' && p.softwareUrl && p.softwareUrl.includes('M808')) {
    console.log('REMOVING m701-RGB SW (M808):', p.softwareUrl.split('/').pop().split('?')[0]);
    delete p.softwareUrl; fixed++;
  }
  if (id === 'm701-RGB' && p.manualUrl && p.manualUrl.includes('M808')) {
    console.log('REMOVING m701-RGB MAN (M808):', p.manualUrl.split('/').pop().split('?')[0]);
    delete p.manualUrl; fixed++;
  }
  // M703 has K525 software + S151 manual - WRONG
  if (id === 'M703' && p.softwareUrl && p.softwareUrl.includes('K525')) {
    console.log('REMOVING M703 SW (K525):', p.softwareUrl.split('/').pop().split('?')[0]);
    delete p.softwareUrl; fixed++;
  }
  if (id === 'M703' && p.manualUrl && p.manualUrl.includes('S151')) {
    console.log('REMOVING M703 MAN (S151):', p.manualUrl.split('/').pop().split('?')[0]);
    delete p.manualUrl; fixed++;
  }
  // m723 has K525 software + S151 manual - WRONG
  if (id === 'm723' && p.softwareUrl && p.softwareUrl.includes('K525')) {
    console.log('REMOVING m723 SW (K525):', p.softwareUrl.split('/').pop().split('?')[0]);
    delete p.softwareUrl; fixed++;
  }
  if (id === 'm723' && p.manualUrl && p.manualUrl.includes('S151')) {
    console.log('REMOVING m723 MAN (S151):', p.manualUrl.split('/').pop().split('?')[0]);
    delete p.manualUrl; fixed++;
  }
  // Add back m617-lit correct software (was over-removed by fix_corrupted.js)
  if (id === 'm617-lit' && !p.softwareUrl) {
    p.softwareUrl = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/Redragon_M617-LIT_Software.exe?v=1768205229';
    console.log('ADDED m617-lit SW back');
    fixed++;
  }
});
fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Fixed', fixed, 'fields. Saved.');
