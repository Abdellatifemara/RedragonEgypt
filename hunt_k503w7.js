const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 15000
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve);
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

// CDN1 probes for K503 white
async function head(url) {
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

async function main() {
  const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
  const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

  // Probe for K503 white variants on official CDNs
  const files = [
    'RedragonK503WiredGamingKeyboardWhite.png',
    'RedragonK503WhiteGamingKeyboard.png',
    'RedragonK503WhiteGamingKeyboard_1.png',
    'K503-W.png', 'K503W.png', 'K503_White.png',
    'RedragonK503White.png',
    'Redragon_K503_White.png',
    'K503-white-1.jpg', 'K503white.jpg',
  ];

  console.log('Probing CDN1:');
  for (const f of files) {
    await sleep(700);
    const s = await head(CDN1 + f);
    if (s === 200) console.log('FOUND CDN1:', CDN1 + f);
    else process.stdout.write('.');
  }

  console.log('\nProbing CDN2:');
  for (const f of files) {
    await sleep(700);
    const s = await head(CDN2 + f);
    if (s === 200) console.log('FOUND CDN2:', CDN2 + f);
    else process.stdout.write('.');
  }

  // Also probe hardwaremarket.net for K503 white images
  console.log('\nProbing hardwaremarket:');
  const base = 'https://hardwaremarket.net/wp-content/uploads/2021/07/Redragon-K503-';
  for (const suffix of ['White-Gaming-Keyboard-1.jpg','RGB-Gaming-Keyboard-White-1.jpg','White-1.jpg','White-Wired-1.jpg']) {
    await sleep(700);
    const s = await head(base + suffix);
    if (s === 200) console.log('FOUND HM:', base + suffix);
    else process.stdout.write('.');
  }
  console.log('\nDone.');
}
main().catch(console.error);
