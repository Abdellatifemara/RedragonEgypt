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
  // hardwaremarket.net has K502 RGB images - check if they have K503 white too
  // Try common patterns
  const base = 'https://hardwaremarket.net/wp-content/uploads/';
  const patterns = [
    '2021/07/Redragon-K503-RGB-Gaming-Keyboard-White-1.jpg',
    '2021/07/Redragon-K503-White-Gaming-Keyboard-1.jpg',
    '2021/07/Redragon-K503-White-1.jpg',
    '2021/08/Redragon-K503-White-Gaming-Keyboard-1.jpg',
    '2021/09/Redragon-K503-White-Gaming-Keyboard-1.jpg',
    '2022/01/Redragon-K503-White-Gaming-Keyboard-1.jpg',
    '2022/06/Redragon-K503-White-Gaming-Keyboard-1.jpg',
    '2023/01/Redragon-K503-White-Gaming-Keyboard-1.jpg',
  ];
  for (const p of patterns) {
    await sleep(700);
    const s = await head(base + p);
    if (s === 200) { console.log('FOUND:', base + p); }
    else process.stdout.write('.');
  }

  // Fetch hardwaremarket K503 white product page directly
  await sleep(3000);
  const r = await fetch('https://hardwaremarket.net/product/redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-white/');
  console.log('\nhardwaremarket K503 white page:', r.status, r.body.length);
  if (r.status === 200) {
    const og = r.body.match(/og:image[^>]+content="([^"]+)"/);
    if (og) console.log('og:image:', og[1]);
    const wpImgs = [...new Set(r.body.match(/https?:\/\/hardwaremarket\.net\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|jpeg)/gi)||[])];
    wpImgs.filter(u => !u.match(/\d+x\d+\.(jpg|png|jpeg)$/)).slice(0,5).forEach(i => console.log('img:', i));
  }
  console.log('Done');
}
main().catch(console.error);
