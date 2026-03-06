const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

async function main() {
  // Based on existing K515 pattern: SHIVAK515MembraneGamingKeyboard_{n}
  // K515 PRO might follow: SHIVAK515PROGamingKeyboard or K515PROGamingKeyboard
  const files = [
    'SHIVAK515PROMembraneGamingKeyboard_1.png',
    'SHIVAK515PROMembraneGamingKeyboard_1.jpg',
    'SHIVAK515PROGamingKeyboard_1.png',
    'SHIVAK515PROGamingKeyboard_1.jpg',
    'K515PROGamingKeyboard_1.png',
    'K515PROGamingKeyboard_1.jpg',
    'RedragonK515PRO_1.png',
    'RedragonK515PRO_1.jpg',
    'K515-PRO_1.jpg',
    'K515_PRO_1.jpg',
    'K515PRO_1.jpg',
    'SHIVA_K515_PRO_1.jpg',
    'K515PRO.png',
    'K515-PRO.jpg',
  ];
  for (const f of files) {
    await sleep(600);
    const s1 = await head(CDN1 + f);
    const s2 = await head(CDN2 + f);
    if (s1 === 200) console.log('CDN1 FOUND:', CDN1 + f);
    if (s2 === 200) console.log('CDN2 FOUND:', CDN2 + f);
    if (s1 !== 200 && s2 !== 200) process.stdout.write('.');
  }
  console.log('\nDone.');
}
main().catch(console.error);
