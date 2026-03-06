// Remove clearly wrong download assignments
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));
let fixed = 0;

const REMOVALS = [
  // g808 pro (gamepad) incorrectly has M808 (mouse) files
  { model: 'g808 pro', removeSW: 'M808', removeMAN: 'M808' },
  // K515 RGB has wrong S141 combo manual
  { model: 'K515 RGB', removeMAN: 'S141' },
  // H270 incorrectly has H260 manual
  { model: 'H270', removeMAN: 'H260' },
  // H350 RGB incorrectly has H231 manual
  { model: 'H350 RGB', removeMAN: 'H231' },
  // K509P-wS incorrectly has K728 files
  { model: 'K509P-wS', removeSW: 'K728', removeMAN: 'K728' },
  // K509P-KS - check if it has wrong files too
  { model: 'K509P-KS', removeSW: 'K728', removeMAN: 'K728' },
  // k502 incorrectly has K503 software
  { model: 'k502', removeSW: 'K503' },
  // K505 incorrectly has K503 software
  { model: 'K505', removeSW: 'K503' },
  // K607-RGB incorrectly has K629 DE layout software
  { model: 'K607-RGB', removeSW: 'K629' },
];

d.forEach(p => {
  const id = p.model || p.id || '';
  for (const r of REMOVALS) {
    if (r.model !== id) continue;
    if (r.removeSW && p.softwareUrl && p.softwareUrl.includes(r.removeSW)) {
      console.log('REMOVING SW from', id, ':', p.softwareUrl.split('/').pop().split('?')[0]);
      delete p.softwareUrl;
      fixed++;
    }
    if (r.removeMAN && p.manualUrl && p.manualUrl.includes(r.removeMAN)) {
      console.log('REMOVING MAN from', id, ':', p.manualUrl.split('/').pop().split('?')[0]);
      delete p.manualUrl;
      fixed++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Fixed', fixed, 'wrong download entries. Saved.');
