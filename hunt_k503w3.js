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

// Scan shamystores collection for K503
async function main() {
  for (let page = 1; page <= 3; page++) {
    await sleep(3000);
    const r = await fetch(`https://shamystores.com/collections/all.json?limit=100&page=${page}`);
    if (r.status !== 200) { console.log('page', page, ':', r.status); break; }
    const data = JSON.parse(r.body);
    const prods = data.products || [];
    if (prods.length === 0) break;
    const k503s = prods.filter(p => /k503/i.test(p.handle + p.title));
    k503s.forEach(p => {
      console.log('K503 on shamystores:', p.handle, '|', p.title);
      (p.images||[]).slice(0,3).forEach(i => console.log('  IMG:', i.src.split('?')[0]));
    });
    console.log('Page', page + ':', prods.length, 'products');
    if (prods.length < 100) break;
  }
}
main().catch(console.error);
