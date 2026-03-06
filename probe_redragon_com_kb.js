const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 20000
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
  // Try redragon.com keyboard collection pages
  for (let page = 1; page <= 3; page++) {
    await sleep(4000);
    const url = `https://www.redragon.com/collections/keyboards.json?limit=50&page=${page}`;
    const r = await fetch(url);
    console.log(`Page ${page}: HTTP ${r.status} (${r.body.length}B)`);
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const prods = data.products || [];
        prods.forEach(p => {
          if (/k50[0-9]/i.test(p.handle) || /k50[0-9]/i.test(p.title)) {
            console.log(' MATCH:', p.handle, '|', p.title);
            (p.images||[]).slice(0,2).forEach(i => console.log('   img:', i.src.split('?')[0]));
          }
        });
        console.log('  Total products this page:', prods.length);
        if (prods.length < 50) break;
      } catch(e) { console.log('Parse error:', e.message); break; }
    } else {
      console.log('  Body:', r.body.substring(0, 200));
      break;
    }
  }
}
main().catch(console.error);
