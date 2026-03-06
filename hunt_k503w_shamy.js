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
  // shamystores - try K503 white slugs
  const slugs = [
    'redragon-k503-keyboard-white',
    'redragon-k503aw-keyboard',
    'redragon-k503-white-gaming-keyboard',
    'redragon-k503-pc-gaming-keyboard-white',
  ];
  for (const slug of slugs) {
    await sleep(3000);
    const r = await fetch(`https://shamystores.com/products/${slug}.json`);
    console.log('shamystores', slug + ':', r.status);
    if (r.status === 200 && r.body.length > 100) {
      const d = JSON.parse(r.body);
      const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
      if (imgs.length > 0) { console.log('FOUND:', imgs.slice(0,3).join('\n')); return; }
    }
  }

  // Scan shamystores for all K503 products
  await sleep(3000);
  for (let page = 1; page <= 3; page++) {
    const r = await fetch(`https://shamystores.com/collections/keyboards.json?limit=50&page=${page}`);
    if (r.status !== 200 || r.body.length < 50) { console.log('keyboards p'+page+':', r.status); break; }
    const d = JSON.parse(r.body);
    const prods = d.products || [];
    prods.filter(p => /k503/i.test(p.handle+p.title)).forEach(p => {
      console.log('K503:', p.handle, '|', p.title);
      (p.images||[]).slice(0,2).forEach(i => console.log('  img:', i.src.split('?')[0]));
    });
    console.log('page', page + ':', prods.length, 'products');
    if (prods.length < 50) break;
    await sleep(3000);
  }
}
main().catch(console.error);
