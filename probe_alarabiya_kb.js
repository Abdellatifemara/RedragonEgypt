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

async function main() {
  // Get all keyboards from alarabiya
  let allProducts = [];
  for (let page = 1; page <= 5; page++) {
    await sleep(3000);
    const url = `https://alarabiya-computer.com/collections/keyboards.json?limit=50&page=${page}`;
    const r = await fetch(url);
    if (r.status !== 200 || !r.body) break;
    try {
      const data = JSON.parse(r.body);
      const prods = data.products || [];
      if (prods.length === 0) break;
      allProducts = allProducts.concat(prods);
    } catch(e) { break; }
  }
  console.log('Total keyboards on alarabiya:', allProducts.length);
  allProducts.forEach(p => {
    if (p.handle.includes('redragon') || p.title.toLowerCase().includes('redragon')) {
      console.log(' ', p.handle, '|', p.title);
    }
  });
}
main().catch(console.error);
