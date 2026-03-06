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

const tries = [
  'https://shamystores.com/products/redragon-k503-white-gaming-keyboard.json',
  'https://shamystores.com/products/redragon-k503-wired-gaming-keyboard-white.json',
  'https://shamystores.com/products/redragon-k503-gaming-keyboard-white.json',
  'https://redragonzone.pk/products/redragon-k503-rgb-wired-gaming-keyboard-white.json',
  'https://redragonzone.pk/products/redragon-k503-gaming-keyboard-white.json',
  'https://www.redragon.com.pk/products/redragon-k503-rgb-gaming-keyboard-white.json',
  'https://www.redragon.com.pk/products/redragon-k503-wired-gaming-keyboard-white.json',
];

async function main() {
  for (const url of tries) {
    await sleep(3000);
    const r = await fetch(url);
    const store = url.split('/')[2];
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log('FOUND K503-white on', store);
          imgs.slice(0,4).forEach(i => console.log(' ', i));
          return;
        }
      } catch(e) {}
    }
    console.log(store, r.status);
  }
}
main().catch(console.error);
