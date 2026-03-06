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
  for (let page = 1; page <= 5; page++) {
    await sleep(5000);
    const url = `https://redragonshop.com/collections/keyboards.json?limit=50&page=${page}`;
    const r = await fetch(url);
    console.log(`Page ${page}: HTTP ${r.status} (${r.body.length}B)`);
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const prods = data.products || [];
        prods.forEach(p => {
          console.log(' ', p.handle.substring(0, 60));
        });
        console.log('Total:', prods.length);
        if (prods.length < 50) break;
      } catch(e) { break; }
    } else {
      console.log('Body:', r.body.substring(0,300));
      break;
    }
  }
}
main().catch(console.error);
