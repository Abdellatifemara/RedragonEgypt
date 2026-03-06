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

const TRIES = [
  'https://redragonadria.com/products/k502-karura2-rgb-gaming-keyboard.json',
  'https://redragonadria.com/products/redragon-k502-karura2.json',
  'https://redragonadria.com/products/redragon-k502.json',
  'https://redragonadria.com/products/k502.json',
  'https://redragonzone.com/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://redragonzone.com/products/redragon-k502.json',
  'https://www.redragon.lk/products/redragon-k502-karura-7-color-backlight-gaming-keyboard.json',
  'https://www.redragon.lk/products/redragon-k502-karura2-gaming-keyboard.json',
  'https://www.redragon.lk/products/redragon-k502.json',
  'https://redragon.com.au/products/redragon-k502-karura2-rgb-gaming-keyboard.json',
  'https://redragon.com.au/products/redragon-k502.json',
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
  console.log('\nK502: not found on any store');
}
main().catch(console.error);
