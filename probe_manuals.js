const https = require('https');

function head(url) {
  return new Promise(resolve => {
    const req = https.request(url, { method: 'HEAD', timeout: 8000,
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
const CDNIN = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';
const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

// Guess manual filenames for each missing product
const PROBES = [
  // Mouse manuals
  { model: 'M602-KS',   files: ['M602_User_Manual.pdf', 'M602-KS_User_Manual.pdf', 'M602.pdf', 'M602-KS.pdf'] },
  { model: 'M607',      files: ['M607_User_Manual.pdf', 'M607.pdf', 'M607RGB_User_Manual.pdf'] },
  { model: 'M609',      files: ['M609_User_Manual.pdf', 'M609.pdf'] },
  { model: 'm617-lit',  files: ['M617-LIT_User_Manual.pdf', 'M617LIT_User_Manual.pdf', 'M617.pdf', 'M617-LIT.pdf'] },
  { model: 'm655-ks',   files: ['M655-KS_User_Manual.pdf', 'M655_User_Manual.pdf', 'M655.pdf', 'M655-KS.pdf'] },
  { model: 'M694',      files: ['M694_User_Manual.pdf', 'M694.pdf'] },
  { model: 'm701-RGB',  files: ['M701_User_Manual.pdf', 'M701RGB_User_Manual.pdf', 'M701.pdf', 'M701-RGB.pdf'] },
  { model: 'M703',      files: ['M703_User_Manual.pdf', 'M703.pdf'] },
  { model: 'm723',      files: ['M723_User_Manual.pdf', 'M723.pdf'] },
  { model: 'm725 lit',  files: ['M725-LIT_User_Manual.pdf', 'M725_LIT_User_Manual.pdf', 'M725.pdf', 'M725LIT.pdf'] },
  { model: 'm815-pro',  files: ['M815-PRO_User_Manual.pdf', 'M815PRO_User_Manual.pdf', 'M815.pdf', 'M815_PRO_User_Manual.pdf'] },
  { model: 'M801',      files: ['M801_User_Manual.pdf', 'M801.pdf', 'M801-RGB_User_Manual.pdf'] },
  { model: 'M901P-KS',  files: ['M901P-KS_User_Manual.pdf', 'M901P_User_Manual.pdf', 'M901P.pdf'] },
  { model: 'M901P-WS',  files: ['M901P-WS_User_Manual.pdf'] },
  { model: 'M903P',     files: ['M903P_User_Manual.pdf', 'M903P.pdf', 'M903_User_Manual.pdf'] },
  { model: 'M915WL-RGB',files: ['M915WL-RGB_User_Manual.pdf', 'M915WL_User_Manual.pdf', 'M915.pdf'] },
  // Keyboard manuals
  { model: 'k502',      files: ['K502_User_Manual.pdf', 'K502.pdf'] },
  { model: 'K503',      files: ['K503_User_Manual.pdf', 'K503.pdf'] },
  { model: 'K505',      files: ['K505_User_Manual.pdf', 'K505.pdf'] },
  { model: 'K509P-KS',  files: ['K509P-KS_User_Manual.pdf', 'K509P_User_Manual.pdf', 'K509P.pdf'] },
  { model: 'K506',      files: ['K506_User_Manual.pdf', 'K506.pdf'] },
  { model: 'K607-RGB',  files: ['K607-RGB_User_Manual.pdf', 'K607_User_Manual.pdf', 'K607.pdf'] },
  { model: 'K615P-KBS', files: ['K615P-KBS_User_Manual.pdf', 'K615P_User_Manual.pdf', 'K615.pdf'] },
  { model: 'k629-rgb',  files: ['K629-RGB_User_Manual.pdf', 'K629_User_Manual.pdf', 'K629.pdf'] },
  { model: 'K661 WGY',  files: ['K661_WGY_User_Manual.pdf', 'K661_User_Manual.pdf', 'K661.pdf'] },
  { model: 'KG010-KN',  files: ['KG010_User_Manual.pdf', 'KG010-KN_User_Manual.pdf', 'KG010.pdf'] },
  { model: 'K535',      files: ['K535_User_Manual.pdf', 'K535.pdf', 'K535-APAS_User_Manual.pdf'] },
  // Headset manuals
  { model: 'H270',      files: ['H270_User_Manual.pdf', 'H270.pdf'] },
  { model: 'H350 RGB',  files: ['H350-RGB_User_Manual.pdf', 'H350_User_Manual.pdf', 'H350.pdf', 'H350RGB.pdf'] },
  { model: 'H386',      files: ['H386_User_Manual.pdf', 'H386.pdf', 'Diomedes_H386_User_Manual.pdf'] },
  // Gamepad manuals
  { model: 'G711',      files: ['G711_User_Manual.pdf', 'G711.pdf'] },
  { model: 'G712',      files: ['G712_User_Manual.pdf', 'G712.pdf'] },
  { model: 'G713',      files: ['G713_User_Manual.pdf', 'G713.pdf'] },
  { model: 'g808 pro',  files: ['G808_User_Manual.pdf', 'G808PRO_User_Manual.pdf', 'G808.pdf'] },
  // Accessories manuals
  { model: 'GS520',     files: ['GS520_User_Manual.pdf', 'GS520.pdf'] },
];

const CDNS = [CDN1, CDNIN, CDN2];

async function main() {
  const found = {};
  for (const probe of PROBES) {
    for (const file of probe.files) {
      let foundUrl = null;
      for (const cdn of CDNS) {
        await sleep(800);
        const url = cdn + file;
        const status = await head(url);
        if (status === 200) {
          foundUrl = url;
          break;
        }
      }
      if (foundUrl) {
        console.log('FOUND', probe.model, ':', file, '->', foundUrl.split('/')[2]);
        found[probe.model] = foundUrl;
        break;
      }
    }
    if (!found[probe.model]) {
      process.stdout.write('.');
    }
  }

  console.log('\n\n=== FOUND MANUALS ===');
  Object.entries(found).forEach(([m, url]) => console.log(m, ':', url));

  require('fs').writeFileSync('probe_manuals_result.json', JSON.stringify(found, null, 2));
}

main().catch(console.error);
