const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 15000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

// shiftstore-eg.com has K502 - check if Shopify
const slugs = [
  'redragon-k502-karura2-7-color-backlight-gaming-keyboard',
  'redragon-k502-karura2-rgb-gaming-keyboard',
  'redragon-k502',
];

async function tryStore(base, slugs) {
  for (const slug of slugs) {
    await sleep(3000);
    const r = await fetch(`${base}/products/${slug}.json`);
    console.log(base.split('//')[1], slug + ':', r.status, r.body.length);
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) { console.log('FOUND:', imgs.join('\n  ')); return true; }
      } catch(e) {}
    }
  }
  return false;
}

async function main() {
  // Try shiftstore-eg (Egyptian gaming store)
  await tryStore('https://shiftstore-eg.com', slugs);
  // Try hardwaremarket.net
  await tryStore('https://hardwaremarket.net', slugs);
}
main().catch(console.error);
