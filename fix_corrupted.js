// Remove URLs that were wrongly assigned by the bad script
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

const WRONG_SW = [
  'Redragon_M801-RGB_Software.exe',   // assigned to M601-RGB (wrong)
  'Redragon_K525-RGB_setup_1.0.4.3.exe', // assigned to M607/M609 (wrong)
  'Redragon_M617-LIT_Software.exe',   // assigned to M607-white/M609-white (wrong)
];
const WRONG_MAN = [
  'Redragon_S151_Wired_Combo_User_Manual.pdf', // assigned to M607 (wrong)
];

let fixed = 0;
d.forEach(p => {
  if (p.softwareUrl && WRONG_SW.some(w => p.softwareUrl.includes(w))) {
    console.log('REMOVING wrong softwareUrl from', p.model, ':', p.softwareUrl);
    delete p.softwareUrl;
    fixed++;
  }
  if (p.manualUrl && WRONG_MAN.some(w => p.manualUrl.includes(w))) {
    console.log('REMOVING wrong manualUrl from', p.model, ':', p.manualUrl);
    delete p.manualUrl;
    fixed++;
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Fixed', fixed, 'corrupted fields. JSON saved.');
