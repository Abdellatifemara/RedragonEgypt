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
  // Try all products collection
  for (const col of ['all', 'keyboards', 'gaming-keyboards', 'keyboard', 'all-products']) {
    await sleep(2000);
    const r = await fetch(`https://alarabiya-computer.com/collections/${col}.json?limit=10`);
    console.log(col + ':', r.status, r.body.length + 'B');
    if (r.status === 200 && r.body.length > 100) {
      try {
        const d = JSON.parse(r.body);
        console.log('  Products:', (d.products||[]).length);
        (d.products||[]).slice(0,3).forEach(p => console.log('   ', p.handle));
      } catch(e) {}
    }
  }

  // Also try direct K502/K505/K506 slugs
  for (const slug of ['redragon-k502', 'redragon-k505', 'redragon-k506', 'keyboard-redragon-k502', 'k502-karura', 'k505-yaksa', 'k506-centaur']) {
    await sleep(2000);
    const r = await fetch(`https://alarabiya-computer.com/products/${slug}.json`);
    console.log(slug + ':', r.status, r.body.length + 'B');
    if (r.status === 200 && r.body.length > 100) {
      try {
        const d = JSON.parse(r.body);
        const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
        console.log('  FOUND! Images:', imgs.slice(0,2).join(', '));
      } catch(e) {}
    }
  }
}
main().catch(console.error);
