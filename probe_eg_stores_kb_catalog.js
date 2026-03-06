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

const STORES = [
  { name: 'igabiba', base: 'https://igabiba.com', cols: ['gaming-keyboards', 'keyboards', 'gaming-keyboard', 'redragon-keyboards'] },
  { name: 'softlink', base: 'https://softlink-eg.com', cols: ['gaming-keyboards', 'keyboards', 'keyboard', 'gaming-keyboard'] },
  { name: 'compumarts', base: 'https://www.compumarts.com', cols: ['gaming-keyboards', 'keyboards', 'keyboard', 'redragon'] },
  { name: 'elyamamastore', base: 'https://elyamamastore.com', cols: ['keyboards', 'gaming-keyboards', 'keyboard', 'redragon'] },
];

async function main() {
  for (const store of STORES) {
    let found = false;
    for (const col of store.cols) {
      if (found) break;
      await sleep(3000);
      const url = `${store.base}/collections/${col}.json?limit=50`;
      const r = await fetch(url);
      if (r.status === 200 && r.body.length > 100) {
        try {
          const data = JSON.parse(r.body);
          const prods = data.products || [];
          console.log(`${store.name} /${col}: ${prods.length} products`);
          prods.forEach(p => {
            if (/k50[0-9]/i.test(p.handle) || /k50[0-9]/i.test(p.title)) {
              console.log('  K50x MATCH:', p.handle, '|', p.title);
              const imgs = (p.images||[]).slice(0,2).map(i => i.src.split('?')[0]);
              imgs.forEach(i => console.log('    IMG:', i));
            }
          });
          found = true;
        } catch(e) {}
      }
    }
    if (!found) console.log(`${store.name}: no keyboard collection found`);
  }
}
main().catch(console.error);
