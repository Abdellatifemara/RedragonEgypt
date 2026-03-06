// Verify that software/manual URLs roughly match the product model
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

const SHARED_OK = [
  // Models that legitimately share software (same chip/platform)
  'M711C', // same as M711
  'm724-white', // same as m724
  'K503 aw', // same as K503
  'K552 RGB browb sw', // K552 family
  'k552-KB Blue Switch', // K552 family
  'k552-KR Red Switch', // K552 family
  'k552L-KR NO LIGHT Red Switch', // K552 family
  'K599-WRS', // same platform as K599-WBS
  'H510RGB', // same as H510-fb (both H510 Zeus)
  'M711C', 'M711',
  'm724', 'm724-white',
];

let ok = 0, suspect = 0;
d.forEach(p => {
  const modelKey = (p.model || p.id || '').toLowerCase().replace(/[^a-z0-9]/g,'');

  if (p.softwareUrl) {
    const filename = p.softwareUrl.split('/').pop().split('?')[0].toLowerCase().replace(/[^a-z0-9]/g,'');
    // Check if model is in filename OR it's a known shared product
    const match = filename.includes(modelKey.slice(0,4)) ||
                  filename.includes('redragonmouse') || // generic mouse software
                  filename.includes('redragonkeyboard') || // generic KB
                  filename.includes('redragon_gaming_mouse') || // generic
                  SHARED_OK.includes(p.model);
    if (!match) {
      console.log('SUSPECT SW:', p.model, '→', p.softwareUrl.split('/').pop().split('?')[0]);
      suspect++;
    } else {
      ok++;
    }
  }

  if (p.manualUrl) {
    const filename = p.manualUrl.split('/').pop().split('?')[0].toLowerCase().replace(/[^a-z0-9]/g,'');
    const match = filename.includes(modelKey.slice(0,4)) ||
                  filename.includes('s101') || // S101 combos share manual
                  filename.includes('k552') || // K552 family
                  filename.includes('h510') || // H510 family
                  SHARED_OK.includes(p.model);
    if (!match) {
      console.log('SUSPECT MAN:', p.model, '→', p.manualUrl.split('/').pop().split('?')[0]);
      suspect++;
    } else {
      ok++;
    }
  }
});

console.log('\nOK:', ok, '| SUSPECT:', suspect);
