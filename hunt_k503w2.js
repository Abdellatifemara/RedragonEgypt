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

// Try CDN2 official redragon.com for K503 white
const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';
const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';

async function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

async function main() {
  // Try CDN2 filenames for K503 white
  const files = ['K503W.png','K503-W.png','K503_White.png','K503_W.png','K503-white.png','K503White.png'];
  for (const f of files) {
    await sleep(800);
    const s = await head(CDN2 + f);
    if (s === 200) { console.log('FOUND CDN2:', CDN2 + f); return; }
    console.log(f + ':', s);
  }

  // redragonepal.com Shopify
  await sleep(3000);
  let r = await fetch('https://redragonepal.com/products/redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-for-windows-pc-games-rgb-led-backlit-with-marco-recording.json');
  console.log('redragonepal:', r.status);
  if (r.status === 200) {
    const data = JSON.parse(r.body);
    const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('imgs:', imgs.slice(0,3));
  }

  // Try HTML from redragonepal
  await sleep(3000);
  r = await fetch('https://redragonepal.com/product/redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-for-windows-pc-games-rgb-led-backlit-with-marco-recording/');
  console.log('redragonepal HTML:', r.status, r.body.length);
  if (r.status === 200) {
    const og = r.body.match(/property="og:image"\s+content="([^"]+)"/);
    if (og) console.log('  og:image:', og[1]);
  }
}
main().catch(console.error);
