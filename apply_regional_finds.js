const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

const CDNIN = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';

const UPDATES = [
  // M901: add manual + image (already has SW from CDN1)
  { model: 'M901', manualUrl: CDNIN + 'M901-K-2_User_Manual.pdf?v=1749018575' },
  { model: 'M901', image: CDNIN + 'M901_K-2.png' },

  // k551: SW + MAN + image
  { model: 'k551', softwareUrl: CDNIN + 'REDRAGON_K551RGB-1_28A_NEW_SOFTWARE_20211215_1.zip?v=1655183740' },
  { model: 'k551', manualUrl: CDNIN + 'K551RGB-1.pdf?v=1736413586' },
  { model: 'k551', image: CDNIN + 'K551_RGB.png' },

  // M601-RGB: manual
  { model: 'M601-RGB', manualUrl: CDNIN + 'M601_RGB.pdf?v=1736413583' },
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const a of UPDATES) {
    if (a.model !== id) continue;
    if (a.softwareUrl && !p.softwareUrl) {
      console.log('SW assigned', id, ':', a.softwareUrl.split('/').pop().split('?')[0]);
      p.softwareUrl = a.softwareUrl;
      updated++;
    }
    if (a.manualUrl && !p.manualUrl) {
      console.log('MAN assigned', id, ':', a.manualUrl.split('/').pop().split('?')[0]);
      p.manualUrl = a.manualUrl;
      updated++;
    }
    if (a.image) {
      if (!p.images) p.images = [];
      if (!p.images.includes(a.image)) {
        console.log('IMG added', id, ':', a.image.split('/').pop().split('?')[0]);
        p.images.push(a.image);
        updated++;
      }
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
