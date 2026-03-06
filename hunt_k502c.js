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

// Try authorized regional Redragon distributors
const TRIES = [
  // South Africa
  'https://www.redragonsa.co.za/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://www.redragonsa.co.za/products/redragon-k502.json',
  // Malaysia
  'https://redragon.com.my/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://redragon.com.my/products/redragon-k502.json',
  // Middle East / UAE
  'https://redragonme.com/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://redragonme.com/products/redragon-k502.json',
  // Turkey
  'https://redragontr.com/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://redragontr.com/products/redragon-k502.json',
  // Nigeria
  'https://redragonng.com/products/redragon-k502.json',
  // Egypt direct
  'https://redragonegypt.com/products/redragon-k502.json',
];

async function main() {
  for (const url of TRIES) {
    await sleep(3000);
    const r = await fetch(url);
    const store = url.replace('https://','').split('/')[0];
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log('\nFOUND K502 on', store);
          imgs.slice(0,4).forEach(i => console.log(' ', i));
          return;
        }
      } catch(e) {}
    }
    console.log(store, r.status);
  }
  console.log('\nK502: not found');
}
main().catch(console.error);
