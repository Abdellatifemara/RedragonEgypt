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
  // Scan redragon.com.pk keyboard collection for K502 and K505
  for (let page = 1; page <= 5; page++) {
    await sleep(3000);
    const url = `https://www.redragon.com.pk/collections/keyboards.json?limit=50&page=${page}`;
    const r = await fetch(url);
    if (r.status !== 200 || !r.body) { console.log('Page', page, ':', r.status); break; }
    try {
      const data = JSON.parse(r.body);
      const prods = data.products || [];
      if (prods.length === 0) break;
      prods.forEach(p => {
        if (/k50[0-9]/i.test(p.handle) || /k50[0-9]/i.test(p.title)) {
          console.log('MATCH:', p.handle, '|', p.title);
          (p.images||[]).slice(0,2).forEach(i => console.log('  IMG:', i.src.split('?')[0]));
        }
      });
      console.log(`Page ${page}: ${prods.length} products`);
      if (prods.length < 50) break;
    } catch(e) { console.log('Parse error'); break; }
  }
}
main().catch(console.error);
