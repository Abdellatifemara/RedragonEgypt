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

// Scan redragonadria.com full catalog for K502
async function scanCatalog(base, col) {
  for (let page = 1; page <= 5; page++) {
    await sleep(3500);
    const url = `${base}/collections/${col}.json?limit=50&page=${page}`;
    const r = await fetch(url);
    if (r.status !== 200 || r.body.length < 50) { console.log(base, col, 'page', page, ':', r.status); break; }
    try {
      const d = JSON.parse(r.body);
      const prods = d.products || [];
      if (prods.length === 0) break;
      prods.forEach(p => {
        if (/k50[0-9]/i.test(p.handle) || /k50[0-9]/i.test(p.title)) {
          console.log('MATCH on', base, ':', p.handle, '|', p.title);
          (p.images||[]).slice(0,2).forEach(i => console.log('  IMG:', i.src.split('?')[0]));
        }
      });
      console.log(base, col, 'page', page, ':', prods.length, 'products');
      if (prods.length < 50) break;
    } catch(e) { break; }
  }
}

async function main() {
  await scanCatalog('https://redragonadria.com', 'gaming-keyboards');
  await scanCatalog('https://redragonadria.com', 'keyboards');
  await scanCatalog('https://redragonadria.com', 'all');
}
main().catch(console.error);
