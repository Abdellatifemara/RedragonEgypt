// Apply all newly found download URLs to products.json
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

const ASSIGNMENTS = [
  // K539 software (from redragonshop.com)
  {
    model: 'K539',
    softwareUrl: CDN1 + 'Redragon_K539_Setup_V1.6.6_2.zip?v=1635818026',
  },
  // K550 software (from redragonshop.com)
  {
    model: 'K550',
    softwareUrl: CDN1 + 'Redragon_K550_Software.zip?v=1725416755',
  },
  // K685 PYG manual (from redragonshop.com)
  {
    model: 'k685 PYG',
    manualUrl: CDN1 + 'FAYE_K685_Wired_User_Manual.pdf?v=1727173443',
  },
  // K599 manual (from redragonshop.com)
  {
    model: 'K599-WBS',
    manualUrl: CDN1 + 'Redragon_K599_Keyboard.pdf?v=1620378091',
  },
  {
    model: 'K599-WRS',
    manualUrl: CDN1 + 'Redragon_K599_Keyboard.pdf?v=1620378091',
  },
  // GW900 APEX manual (from redragonshop.com)
  {
    model: 'GW900 APEX',
    manualUrl: CDN1 + 'Webcam_User_Manual_for_GW900_GW600_GW800.pdf?v=1597740126',
  },
  // M801 software (from redragon.com CDN — publicly accessible)
  {
    model: 'M801',
    softwareUrl: CDN2 + 'REDRAGON_M801-RGB_Gaming_Mouse_20190712_1.rar?v=1726113698',
  },
  // M901P-KS software (from redragon.com CDN)
  {
    model: 'M901P-KS',
    softwareUrl: CDN2 + 'M901P-KS_Redragon_Setup_v3.1_20200706.exe?v=1730965093',
  },
  {
    model: 'M901P-WS',
    softwareUrl: CDN2 + 'M901P-KS_Redragon_Setup_v3.1_20200706.exe?v=1730965093',
  },
  // M607 - upgrade from generic driver to specific driver
  {
    model: 'M607',
    softwareUrl: CDN2 + 'Redragon_M607___M602A-RGB___M602AW-RGB_Griffin_7200_DPI_RGB_Gaming_Mouse_20220728_V1058_2097c2e3-fa88-4e3e-95b1-8f750246623c.rar?v=1720768601',
    overwrite: true,
  },
  {
    model: 'M607-white',
    softwareUrl: CDN2 + 'Redragon_M607___M602A-RGB___M602AW-RGB_Griffin_7200_DPI_RGB_Gaming_Mouse_20220728_V1058_2097c2e3-fa88-4e3e-95b1-8f750246623c.rar?v=1720768601',
    overwrite: true,
  },
  // M602-KS — keep existing which seems more targeted (Redragon_M602KS_Software.exe)
  // m617-lit — keep existing (Redragon_M617-LIT_Software.exe)
  // m815-pro — keep existing (Redragon_M815-PRO_Software.exe)
];

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  for (const a of ASSIGNMENTS) {
    if (a.model !== id) continue;
    if (a.softwareUrl && (a.overwrite || !p.softwareUrl)) {
      console.log('SW', a.overwrite ? 'UPDATED' : 'assigned', 'for', id, ':', a.softwareUrl.split('/').pop().split('?')[0].substring(0, 50));
      p.softwareUrl = a.softwareUrl;
      updated++;
    }
    if (a.manualUrl && !p.manualUrl) {
      console.log('MAN assigned for', id, ':', a.manualUrl.split('/').pop().split('?')[0]);
      p.manualUrl = a.manualUrl;
      updated++;
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
