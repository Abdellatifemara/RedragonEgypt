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
  // Check existing K515 RGB product to find CDN pattern
  const d = require('./data/products.json');
  const k515 = d.find(x => (x.model||x.id) === 'K515 RGB');
  console.log('Existing K515 RGB images:', k515?.images);

  // Try blog for K515 PRO
  await sleep(5000);
  const r = await fetch('https://redragonshop.com/blogs/product-download/redragon-k515-pro-gaming-keyboard');
  console.log('K515 PRO blog:', r.status, r.body.length);

  // Try redragonshop.com search
  await sleep(5000);
  const r2 = await fetch('https://redragonshop.com/products/k515-pro-shiva-rgb-3-mode-keyboard.json');
  console.log('k515-pro-shiva-rgb-3-mode-keyboard:', r2.status);
  if (r2.status === 200 && r2.body.length > 100) {
    const dd = JSON.parse(r2.body);
    console.log('FOUND:', dd.product.title, (dd.product.images||[]).slice(0,2).map(i=>i.src.split('?')[0]));
  }

  // Try with wired/wireless in the slug
  const slugs = [
    'k515-pro-shiva-rgb-wireless-gaming-keyboard',
    'k515-pro-shiva-rgb-3-mode-bluetooth-gaming-keyboard',
    'shiva-k515-pro-rgb-gaming-keyboard',
  ];
  for (const slug of slugs) {
    await sleep(5000);
    const r = await fetch(`https://redragonshop.com/products/${slug}.json`);
    console.log(slug + ':', r.status, r.body.length);
    if (r.status === 200 && r.body.length > 100) {
      const dd = JSON.parse(r.body);
      console.log('FOUND:', dd.product.title, (dd.product.images||[]).slice(0,2).map(i=>i.src.split('?')[0]));
    }
  }
}
main().catch(console.error);
