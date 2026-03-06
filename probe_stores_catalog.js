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
  'https://alarabiya-computer.com',
  'https://elyamamastore.com',
  'https://www.compumarts.com',
  'https://igabiba.com',
];

async function main() {
  for (const base of STORES) {
    await sleep(3000);
    const url = base + '/collections/keyboards.json?limit=50';
    const r = await fetch(url);
    console.log(base, r.status, r.body.length + 'B');
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const kbProducts = (data.products || []).filter(p =>
          p.handle.toLowerCase().includes('k50') ||
          p.handle.toLowerCase().includes('k502') ||
          p.handle.toLowerCase().includes('k505') ||
          p.handle.toLowerCase().includes('k506') ||
          p.title.toLowerCase().includes('k502') ||
          p.title.toLowerCase().includes('k505') ||
          p.title.toLowerCase().includes('k506')
        );
        kbProducts.forEach(p => console.log(' ', p.handle, '|', p.title));
        if (kbProducts.length === 0) {
          // List all to find any K502/K505/K506
          (data.products || []).slice(0, 20).forEach(p => console.log(' ', p.handle));
        }
      } catch(e) { console.log('  Parse error:', e.message); }
    }
  }
}
main().catch(console.error);
