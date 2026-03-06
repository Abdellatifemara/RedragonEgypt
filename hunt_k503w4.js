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

const slugs = [
  'redragon-k503-white-pc-gaming-keyboard',
  'redragon-k503-wired-gaming-keyboard-white',
  'redragon-k503-rgb-gaming-keyboard-white',
  'redragon-k503-gaming-keyboard-white',
  'redragon-k503-white',
];

async function main() {
  for (const slug of slugs) {
    await sleep(3000);
    const r = await fetch(`https://shamystores.com/products/${slug}.json`);
    console.log(slug + ':', r.status);
    if (r.status === 200 && r.body.length > 100) {
      const d = JSON.parse(r.body);
      const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
      if (imgs.length > 0) { console.log('FOUND:', imgs.slice(0,3).join('\n')); return; }
    }
  }

  // Get the full hardwaremarket product page for K503 white specifically
  await sleep(3000);
  const r = await fetch('https://hardwaremarket.net/product/redragon-k503-rgb-gaming-keyboard-wired-with-wrist-rest-rgb-backlit-white/');
  console.log('hardwaremarket K503 white:', r.status, r.body.length);
  if (r.status === 200) {
    const og = r.body.match(/property="og:image"\s+content="([^"]+)"/);
    if (og) console.log('og:image:', og[1]);
  }
}
main().catch(console.error);
