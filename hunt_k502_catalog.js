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

// Scan king-tech-eg full keyboard catalog - we found K506 there so K502 may also be there
async function main() {
  const cols = ['gaming-keyboards', 'keyboards', 'redragon', 'redragon-keyboards', 'all'];
  for (const col of cols) {
    for (let page = 1; page <= 3; page++) {
      await sleep(3000);
      const url = `https://king-tech-eg.com/collections/${col}.json?limit=50&page=${page}`;
      const r = await fetch(url);
      if (r.status !== 200 || r.body.length < 50) { console.log(col, 'p'+page+':', r.status); break; }
      try {
        const d = JSON.parse(r.body);
        const prods = d.products || [];
        if (prods.length === 0) break;
        console.log(col, 'p'+page+':', prods.length, 'products');
        prods.forEach(p => {
          if (/k50[0-9]/i.test(p.handle+p.title) || /k502|k505|karura|yaksa/i.test(p.handle+p.title)) {
            console.log('  MATCH:', p.handle);
            (p.images||[]).slice(0,2).forEach(i => console.log('    IMG:', i.src.split('?')[0]));
          }
        });
        if (prods.length < 50) break;
      } catch(e) { break; }
    }
  }
}
main().catch(console.error);
