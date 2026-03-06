// Assign software/manual to variants that share the same platform
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

const ASSIGNMENTS = [
  // K552 family - all variants share the same software platform
  {
    models: ['K552 RGB browb sw', 'k552-KB Blue Switch'],
    softwareUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/Redragon_K552P-K_Software.exe?v=1748476019'
  },
  // K503 aw shares same platform as K503 (same keyboard, different color)
  // already handled by fetch script

  // S01-5 is the S101 combo - shares K503 keyboard software
  // The keyboard in S01-5 is K503 but the combo itself doesn't have separate software

  // H510RGB and H510-fb share the same base H510 Zeus headset
  // Both already have manuals from fetch script

  // k502 is missing a manual - check what we know
  // k502 = Pegasus K502 wired keyboard - no software needed (membrane, no RGB driver)
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const assign of ASSIGNMENTS) {
    if (assign.models.includes(id)) {
      if (assign.softwareUrl && !p.softwareUrl) {
        p.softwareUrl = assign.softwareUrl;
        console.log('SW assigned to', id, ':', assign.softwareUrl.split('/').pop().split('?')[0]);
        updated++;
      }
      if (assign.manualUrl && !p.manualUrl) {
        p.manualUrl = assign.manualUrl;
        console.log('MAN assigned to', id, ':', assign.manualUrl.split('/').pop().split('?')[0]);
        updated++;
      }
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
