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
  // Try different slugs on redragonshop
  const slugs = [
    'm691-mist-wireless-gaming-mouse',
    'redragon-m691-mist-wireless-gaming-mouse',
    'm691',
    'm691-mist',
  ];
  for (const slug of slugs) {
    await sleep(5000);
    const r = await fetch(`https://redragonshop.com/products/${slug}.json`);
    console.log(slug + ':', r.status, r.body.length);
    if (r.status === 200 && r.body.length > 100) {
      const d = JSON.parse(r.body);
      const p = d.product;
      console.log('FOUND:', p.title);
      console.log('Images:', (p.images||[]).slice(0,3).map(i => i.src.split('?')[0]).join('\n  '));
      return;
    }
  }

  // Try blog download page for M691
  await sleep(5000);
  const r = await fetch('https://redragonshop.com/blogs/product-download/redragon-m691-gaming-mice');
  console.log('\nblog m691:', r.status, r.body.length);

  // Try redragon.com for M691
  await sleep(5000);
  const r2 = await fetch('https://www.redragon.com/products/m691-mist-wireless-gaming-mouse.json');
  console.log('redragon.com m691:', r2.status, r2.body.length);
  if (r2.status === 200 && r2.body.length > 100) {
    const d = JSON.parse(r2.body);
    console.log('FOUND on redragon.com:', d.product.title);
    console.log('Images:', (d.product.images||[]).slice(0,3).map(i => i.src.split('?')[0]));
  }
}
main().catch(console.error);
