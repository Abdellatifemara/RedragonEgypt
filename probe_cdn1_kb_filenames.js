const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 Chrome/120' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

// Common English filename patterns for K502 (KARURA2), K505 (YAKSA), K506 (CENTAUR)
const PROBES = [
  // K502
  'RedragonK502GamingKeyboard.png',
  'RedragonK502RGBGamingKeyboard.png',
  'RedragonK502KARURAGamingKeyboard.png',
  'RedragonK502KARURA2GamingKeyboard.png',
  'Redragon_K502_Gaming_Keyboard.png',
  'Redragon_K502_RGB_Gaming_Keyboard.png',
  'K502_RGB.png',
  'K502.png',
  'K502_1.png',
  // K505
  'RedragonK505GamingKeyboard.png',
  'RedragonK505RGBGamingKeyboard.png',
  'RedragonK505YAKSAGamingKeyboard.png',
  'Redragon_K505_Gaming_Keyboard.png',
  'K505_RGB.png',
  'K505.png',
  'K505_1.png',
  // K506
  'RedragonK506GamingKeyboard.png',
  'RedragonK506RGBGamingKeyboard.png',
  'RedragonK506CENTAURGamingKeyboard.png',
  'Redragon_K506_Gaming_Keyboard.png',
  'K506_RGB.png',
  'K506.png',
  'K506_1.png',
];

async function main() {
  for (const file of PROBES) {
    await sleep(800);
    const url = CDN1 + file;
    const status = await head(url);
    if (status === 200) {
      console.log('FOUND:', url);
    } else {
      process.stdout.write('.');
    }
  }
  console.log('\nDone.');
}
main().catch(console.error);
