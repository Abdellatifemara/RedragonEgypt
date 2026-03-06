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

async function main() {
  // compumarts K503 white
  const slugs = [
    'redragon-k503-pc-gaming-keyboard-rgb-led-backlit-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-for-windows-pc-games-white',
    'redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-white',
    'redragon-k503-white',
    'redragon-k503-gaming-keyboard-white',
  ];
  for (const slug of slugs) {
    await sleep(3000);
    const r = await fetch(`https://www.compumarts.com/products/${slug}.json`);
    console.log('compumarts', slug.slice(-20) + ':', r.status);
    if (r.status === 200 && r.body.length > 100) {
      const d = JSON.parse(r.body);
      const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
      if (imgs.length > 0) { console.log('FOUND:', imgs.slice(0,3).join('\n')); return; }
    }
  }

  // Check CDN from compumarts which we have saved
  // CDN-compumarts: https://cdn.shopify.com/s/files/1/0622/7050/5109/
  const CDNC = 'https://cdn.shopify.com/s/files/1/0622/7050/5109/files/';
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

  const files = ['K503-White.jpg','K503_White.jpg','Redragon-K503-White.jpg','Redragon-K503-White.png','K503White.png'];
  for (const f of files) {
    await sleep(700);
    const s = await head(CDNC + f);
    if (s === 200) console.log('FOUND compumarts CDN:', CDNC + f);
    else process.stdout.write('.');
  }
  console.log('\nDone');
}
main().catch(console.error);
