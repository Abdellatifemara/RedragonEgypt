// Second probe pass - more filename variations for keyboard software
const https = require('https');
const fs = require('fs');

const BASE = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function head(filename) {
  const url = BASE + encodeURIComponent(filename).replace(/%2F/g, '/');
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 8000, headers: {
      'User-Agent': 'Mozilla/5.0'
    }}, res => {
      resolve({ url: BASE + filename, status: res.statusCode });
    });
    req.on('error', () => resolve({ url: BASE + filename, status: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ url: BASE + filename, status: 0 }); });
    req.end();
  });
}

const PROBES = {
  'K506_SW': [
    'Redragon_K506_Software.exe', 'Redragon_K506-RGB_Software.exe',
    'Redragon_Centaur_K506_Software.exe', 'K506_RGB_Software.exe',
    'Redragon_K506_Setup.exe', 'Redragon_K506_V1.exe',
    'Redragon_K506RGB_Software.exe', 'K506_Driver.exe',
    'Centaur_K506_Software.exe', 'Redragon_K506RK_Software.exe',
    'K506.exe', 'Redragon_K506.exe',
    'Redragon_K506-RGB_setup_1.0.0.1.exe',
  ],
  'K539_SW': [
    'Redragon_K539_Software.exe', 'Redragon_K539-RGB_Software.exe',
    'Redragon_Anubis_K539_Software.exe', 'K539_RGB_Software.exe',
    'Redragon_K539_Setup.exe', 'K539_Driver.exe',
    'K539_Software.exe', 'Redragon_K539RK_Software.exe',
    'Anubis_K539_Software.exe', 'Redragon_K539TKL_Software.exe',
  ],
  'K550_SW': [
    'Redragon_K550_Software.exe', 'Redragon_K550-RGB_Software.exe',
    'Redragon_Yama_K550_Software.exe', 'K550_RGB_Software.exe',
    'K550_Software.exe', 'Redragon_K550RK_Software.exe',
    'Yama_K550_Software.exe', 'Redragon_K550_Setup.exe',
  ],
  'k551_SW': [
    'Redragon_K551_Software.exe', 'Redragon_K551-RGB_Software.exe',
    'K551_Software.exe', 'Redragon_MITRA_K551_Software.exe',
    'Redragon_K551RK_Software.exe', 'Redragon_K551_V1.exe',
    'K551_Driver.exe',
  ],
  'K607_SW': [
    'Redragon_K607_Software.exe', 'Redragon_K607-RGB_Software.exe',
    'K607_Software.exe', 'Redragon_K607_Setup.exe',
    'Redragon_K607RK_Software.exe',
  ],
  'K615P_SW': [
    'Redragon_K615P_Software.exe', 'Redragon_K615_Software.exe',
    'K615P_Software.exe', 'Redragon_K615P-KBS_Software.exe',
    'Redragon_Lineage_K615P_Software.exe', 'K615_Software.exe',
  ],
  'K509P_SW': [
    'Redragon_K509P_Software.exe', 'Redragon_K509_Software.exe',
    'K509P_Software.exe', 'Redragon_K509P-RGB_Software.exe',
    'Redragon_K509P-KS_Software.exe', 'Redragon_K509P-WS_Software.exe',
  ],
  'K502_SW': [
    'Redragon_K502_Software.exe', 'K502_Software.exe',
    'Redragon_Pegasus_K502_Software.exe',
  ],
  'K505_SW': [
    'Redragon_K505_Software.exe', 'K505_Software.exe',
    'Redragon_Griffon_K505_Software.exe',
  ],
  // Gamepad software
  'G711_SW': [
    'Redragon_G711_Software.exe', 'G711_Driver.exe', 'Forge_G711_Software.exe',
    'Redragon_G711_Setup.exe',
  ],
  'G712_SW': [
    'Redragon_G712_Software.exe', 'G712_Driver.exe',
    'Redragon_G712_Setup.exe',
  ],
  'G713_SW': [
    'Redragon_G713_Software.exe', 'G713_Driver.exe',
    'Redragon_G713_Setup.exe',
  ],
  'g808pro_SW': [
    'Redragon_G808_PRO_Software.exe', 'G808_PRO_Software.exe',
    'Redragon_G808Pro_Software.exe', 'G808-PRO_Software.exe',
    'Redragon_Seymur_G808_PRO_Software.exe',
  ],
  // More mouse manuals
  'M692_MAN': [
    'M692_User_Manual.pdf', 'M692-RGB_User_Manual.pdf',
  ],
  'M690_MAN': [
    'M690_User_Manual.pdf',
  ],
  // Keyboard manuals (more patterns)
  'k551_MAN': [
    'K551_User_Manual.pdf', 'MITRA_K551_User_Manual.pdf',
    'Redragon_K551_User_Manual.pdf', 'K551_Manual.pdf',
    'K551RGB_User_Manual.pdf',
  ],
  'K607_MAN': [
    'K607_User_Manual.pdf', 'K607-RGB_User_Manual.pdf',
    'Redragon_K607_User_Manual.pdf', 'DEIMOS_K607_User_Manual.pdf',
  ],
  'K615P_MAN': [
    'K615P_User_Manual.pdf', 'K615_User_Manual.pdf',
    'Redragon_K615P_User_Manual.pdf', 'K615P-KBS_User_Manual.pdf',
    'Lineage_K615P_User_Manual.pdf',
  ],
  'K599_MAN': [
    'K599_User_Manual.pdf', 'K599-KRS_User_Manual.pdf',
    'Redragon_K599_User_Manual.pdf', 'K599-WBS_User_Manual.pdf',
    'Deimos_K599_User_Manual.pdf',
  ],
  'K661_MAN': [
    'K661_User_Manual.pdf', 'K671_User_Manual.pdf',
    'K661-WGY_User_Manual.pdf', 'Redragon_K661_User_Manual.pdf',
  ],
  'K629_MAN': [
    'K629_User_Manual.pdf', 'K629-RGB_User_Manual.pdf',
    'Redragon_K629_User_Manual.pdf',
  ],
  'K685_MAN': [
    'K685_User_Manual.pdf', 'K684_User_Manual.pdf',
    'K684-WB_User_Manual.pdf', 'Redragon_K685_User_Manual.pdf',
    'Faye_K685_User_Manual.pdf',
  ],
  'K509P_MAN': [
    'K509P_User_Manual.pdf', 'K509_User_Manual.pdf',
    'Redragon_K509P_User_Manual.pdf',
  ],
  'K503_MAN': [
    'K503_User_Manual.pdf', 'Redragon_K503_User_Manual.pdf',
    'Sphinx_K503_User_Manual.pdf', 'K503RGB_User_Manual.pdf',
  ],
  'K502_MAN': [
    'K502_User_Manual.pdf', 'Pegasus_K502_User_Manual.pdf',
    'Redragon_K502_User_Manual.pdf',
  ],
  'K505_MAN': [
    'K505_User_Manual.pdf', 'Redragon_K505_User_Manual.pdf',
  ],
  // Headset manuals
  'H270_MAN': [
    'H270_User_Manual.pdf', 'Redragon_H270_User_Manual.pdf',
    'Lamia_H270_User_Manual.pdf', 'Redragon_H270_User_Guide.pdf',
    'H270_Manual.pdf', 'H270_User_Guide.pdf',
  ],
  'H350_MAN': [
    'H350_User_Manual.pdf', 'H350-RGB_User_Manual.pdf',
    'Redragon_H350_User_Manual.pdf', 'Pandora_H350_User_Manual.pdf',
    'H350RGB_User_Manual.pdf', 'H350_User_Guide.pdf',
  ],
  'H386_MAN': [
    'H386_User_Manual.pdf', 'Redragon_H386_User_Manual.pdf',
    'Diomedes_H386_User_Manual.pdf', 'H386_User_Guide.pdf',
    'Redragon_H386_User_Guide.pdf',
  ],
  // S107 manual
  'S107_MAN': [
    'S107_User_Manual.pdf', 'Redragon_S107_User_Manual.pdf',
  ],
};

async function main() {
  const found = {};

  for (const [product, filenames] of Object.entries(PROBES)) {
    process.stdout.write(`Checking ${product}: `);
    for (const fn of filenames) {
      await sleep(100);
      const r = await head(fn);
      if (r.status === 200) {
        console.log(`FOUND: ${fn}`);
        if (!found[product]) found[product] = [];
        found[product].push(r.url);
      } else {
        process.stdout.write('.');
      }
    }
    console.log('');
  }

  console.log('\n=== FOUND RESULTS ===');
  console.log(JSON.stringify(found, null, 2));
  fs.writeFileSync('cdn_probe_results2.json', JSON.stringify(found, null, 2));
  console.log('Saved to cdn_probe_results2.json');
}

main().catch(console.error);
