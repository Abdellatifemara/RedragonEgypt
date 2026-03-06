// Probe Shopify CDN for possible manual/software URLs using known filename patterns
const https = require('https');
const fs = require('fs');

const BASE = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function head(filename) {
  const url = BASE + filename;
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 8000, headers: {
      'User-Agent': 'Mozilla/5.0'
    }}, res => {
      resolve({ url, status: res.statusCode });
    });
    req.on('error', () => resolve({ url, status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0 }); });
    req.end();
  });
}

const PROBES = {
  // ===== MOUSE MANUALS =====
  'M601-RGB': [
    'M601-RGB_User_Manual.pdf', 'M601_User_Manual.pdf', 'REDRAGON_M601_User_Manual.pdf',
    'Predator_M601_User_Manual.pdf', 'M601_Manual.pdf',
  ],
  'M602-KS': [
    'M602KS_User_Manual.pdf', 'M602-KS_User_Manual.pdf', 'M602_User_Manual.pdf',
    'Griffing_M602_User_Manual.pdf',
  ],
  'M607': [
    'M607_User_Manual.pdf', 'REDRAGON_M607_User_Manual.pdf', 'Griffin_M607_User_Manual.pdf',
    'M607_Manual.pdf',
  ],
  'M609': [
    'M609_User_Manual.pdf', 'REDRAGON_M609_User_Manual.pdf', 'S606_User_Manual.pdf',
    'M609_Manual.pdf',
  ],
  'm617-lit': [
    'M617-LIT_User_Manual.pdf', 'M617_User_Manual.pdf', 'Phaser_M617_User_Manual.pdf',
    'Redragon_M617_User_Manual.pdf', 'REDRAGON_M617-LIT_User_Manual.pdf',
  ],
  'm655-ks': [
    'M655-KS_User_Manual.pdf', 'M655_User_Manual.pdf', 'Nothosaur_M655_User_Manual.pdf',
    'Redragon_M655_User_Manual.pdf',
  ],
  'M694': [
    'M694_User_Manual.pdf', 'M694-RGB_User_Manual.pdf', 'Redragon_M694_User_Manual.pdf',
    'REDRAGON_M694_User_Manual.pdf',
  ],
  'm701-RGB': [
    'M701_User_Manual.pdf', 'M701-RGB_User_Manual.pdf', 'Perdition_M701_User_Manual.pdf',
    'Redragon_M701_User_Manual.pdf',
  ],
  'M703': [
    'M703_User_Manual.pdf', 'Fireflies_M703_User_Manual.pdf', 'Redragon_M703_User_Manual.pdf',
  ],
  'm723': [
    'M723_User_Manual.pdf', 'Shark_M723_User_Manual.pdf', 'Redragon_M723_User_Manual.pdf',
    'REDRAGON_M723_User_Manual.pdf',
  ],
  'm725 lit': [
    'M725-LIT_User_Manual.pdf', 'M725_User_Manual.pdf', 'Nothosaur_M725_User_Manual.pdf',
    'Redragon_M725_User_Manual.pdf', 'M725LIT_User_Manual.pdf',
  ],
  'm815-pro': [
    'M815-PRO_User_Manual.pdf', 'M815_User_Manual.pdf', 'Redragon_M815-PRO_User_Manual.pdf',
    'Redragon_M815_User_Guide.pdf',
  ],

  // ===== KEYBOARD MANUALS =====
  'K503': [
    'K503_User_Manual.pdf', 'Redragon_K503_User_Manual.pdf', 'Sphinx_K503_User_Manual.pdf',
    'K503_Manual.pdf', 'REDRAGON_K503_User_Manual.pdf',
  ],
  'k502': [
    'K502_User_Manual.pdf', 'Redragon_K502_User_Manual.pdf', 'Pegasus_K502_User_Manual.pdf',
    'K502_Manual.pdf',
  ],
  'K505': [
    'K505_User_Manual.pdf', 'Redragon_K505_User_Manual.pdf', 'Griffon_K505_User_Manual.pdf',
  ],
  'k551': [
    'K551_User_Manual.pdf', 'Redragon_K551_User_Manual.pdf', 'Mitra_K551_User_Manual.pdf',
    'K551_Manual.pdf', 'Redragon_K551_User_Guide.pdf',
  ],
  'K607-RGB': [
    'K607_User_Manual.pdf', 'K607-RGB_User_Manual.pdf', 'Redragon_K607_User_Manual.pdf',
    'Deimos_K607_User_Manual.pdf',
  ],
  'K615P-KBS': [
    'K615P_User_Manual.pdf', 'K615_User_Manual.pdf', 'Redragon_K615P_User_Manual.pdf',
    'Lineage_K615P_User_Manual.pdf', 'K615P-KBS_User_Manual.pdf',
  ],
  'k629-rgb': [
    'K629_User_Manual.pdf', 'K629-RGB_User_Manual.pdf', 'Redragon_K629_User_Manual.pdf',
    'Jax_K629_User_Manual.pdf',
  ],
  'k685 PYG': [
    'K685_User_Manual.pdf', 'K684_User_Manual.pdf', 'Faye_K685_User_Manual.pdf',
    'Redragon_K685_User_Manual.pdf', 'K684-WB_User_Manual.pdf',
  ],
  'K599-WBS': [
    'K599_User_Manual.pdf', 'K599-WBS_User_Manual.pdf', 'Deimos_K599_User_Manual.pdf',
    'Redragon_K599_User_Manual.pdf', 'K599-KRS_User_Manual.pdf',
  ],
  'K661 WGY': [
    'K661_User_Manual.pdf', 'K671_User_Manual.pdf', 'Redragon_K661_User_Manual.pdf',
    'Redragon_K671_User_Manual.pdf', 'K661-WGY_User_Manual.pdf',
  ],
  'K509P-wS': [
    'K509P_User_Manual.pdf', 'K509_User_Manual.pdf', 'Redragon_K509P_User_Manual.pdf',
    'Deimos_K509P_User_Manual.pdf',
  ],
  'K515 RGB': [
    'K515_User_Manual.pdf', 'K515-RGB_User_Manual.pdf', 'Redragon_K515_User_Manual.pdf',
    'Redragon_K515-RGB_User_Manual.pdf',
  ],

  // ===== KEYBOARD SOFTWARE =====
  'K506': [
    'Redragon_K506_Software.exe', 'Redragon_K506-RGB_Software.exe', 'Redragon_K506_Setup.exe',
    'K506_Software.exe', 'Redragon_Centaur_K506_Software.exe',
    'Redragon_K506_setup.exe', 'K506_setup.exe',
  ],
  'K539': [
    'Redragon_K539_Software.exe', 'Redragon_K539-RGB_Software.exe', 'Redragon_K539_Setup.exe',
    'K539_Software.exe', 'Redragon_Anubis_K539_Software.exe',
    'Redragon_K539_setup.exe',
  ],
  'K550': [
    'Redragon_K550_Software.exe', 'Redragon_K550-RGB_Software.exe', 'Redragon_K550_Setup.exe',
    'K550_Software.exe', 'Redragon_Yama_K550_Software.exe',
  ],
  'k551': [
    'Redragon_K551_Software.exe', 'Redragon_K551-RGB_Software.exe', 'K551_Software.exe',
    'Redragon_K551_Setup.exe', 'Redragon_MITRA_K551_Software.exe',
  ],
  'K607-RGB': [
    'Redragon_K607_Software.exe', 'Redragon_K607-RGB_Software.exe', 'K607_Software.exe',
    'Redragon_K607_Setup.exe',
  ],
  'K615P-KBS': [
    'Redragon_K615P_Software.exe', 'Redragon_K615_Software.exe', 'K615P_Software.exe',
    'Redragon_K615P-KBS_Software.exe', 'Redragon_K615_Setup.exe',
  ],
  'K509P-wS': [
    'Redragon_K509P_Software.exe', 'Redragon_K509_Software.exe', 'K509P_Software.exe',
    'Redragon_K509P-RGB_Software.exe',
  ],
  'K506_MAN': [
    'K506_User_Manual.pdf', 'Redragon_K506_User_Manual.pdf', 'K506_Manual.pdf',
    'Centaur_K506_User_Manual.pdf',
  ],
  'K539_MAN': [
    'K539_User_Manual.pdf', 'Redragon_K539_User_Manual.pdf', 'Anubis_K539_User_Manual.pdf',
  ],
  'K550_MAN': [
    'K550_User_Manual.pdf', 'Redragon_K550_User_Manual.pdf', 'Yama_K550_User_Manual.pdf',
  ],

  // ===== HEADSET MANUALS =====
  'H270': [
    'H270_User_Manual.pdf', 'Redragon_H270_User_Manual.pdf', 'Lamia_H270_User_Manual.pdf',
    'Redragon_H270_User_Guide.pdf', 'H270_User_Guide.pdf',
  ],
  'H350 RGB': [
    'H350_User_Manual.pdf', 'H350-RGB_User_Manual.pdf', 'Redragon_H350_User_Manual.pdf',
    'Pandora_H350_User_Manual.pdf', 'H350RGB_User_Manual.pdf',
  ],
  'H386': [
    'H386_User_Manual.pdf', 'Redragon_H386_User_Manual.pdf', 'Diomedes_H386_User_Manual.pdf',
    'H386_User_Guide.pdf', 'Redragon_H386_User_Guide.pdf',
  ],
  'H231-RGB': [
    'H231_User_Manual.pdf', 'H231-RGB_User_Manual.pdf', 'Redragon_H231_User_Manual.pdf',
  ],

  // ===== ACCESSORY MANUALS =====
  'GW900 APEX': [
    'GW900_User_Manual.pdf', 'GW800_User_Manual.pdf', 'Redragon_GW900_User_Manual.pdf',
  ],
};

async function main() {
  const found = {};
  const CDN = BASE;

  for (const [product, filenames] of Object.entries(PROBES)) {
    process.stdout.write(`\nChecking ${product}:`);
    for (const fn of filenames) {
      await sleep(200);
      const r = await head(fn);
      if (r.status === 200) {
        console.log(`\n  FOUND: ${fn}`);
        if (!found[product]) found[product] = [];
        found[product].push(CDN + fn);
      } else {
        process.stdout.write('.');
      }
    }
  }

  console.log('\n\n=== FOUND RESULTS ===');
  console.log(JSON.stringify(found, null, 2));
  fs.writeFileSync('cdn_probe_results.json', JSON.stringify(found, null, 2));
  console.log('Saved to cdn_probe_results.json');
}

main().catch(console.error);
