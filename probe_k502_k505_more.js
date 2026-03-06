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

const QUERIES = [
  // K502 - more stores
  { model: 'K502', url: 'https://nextmarteg.com/products/redragon-k502.json' },
  { model: 'K502', url: 'https://www.redragon.lk/products/redragon-k502-karura-7-color-backlight-gaming-keyboard.json' },
  { model: 'K502', url: 'https://www.redragon.lk/products/redragon-k502.json' },
  { model: 'K502', url: 'https://king-tech-eg.com/products/redragon-k502-karura2-rgb-gaming-keyboard.json' },
  { model: 'K502', url: 'https://king-tech-eg.com/products/keyboard-redragon-k502.json' },
  { model: 'K502', url: 'https://redragonzone.pk/products/redragon-k502-karura2-rgb-gaming-keyboard.json' },
  { model: 'K502', url: 'https://redragonzone.pk/products/redragon-k502.json' },
  { model: 'K502', url: 'https://www.redragon.com.pk/products/redragon-k502-karura-rgb-gaming-keyboard.json' },
  { model: 'K502', url: 'https://www.redragon.com.pk/products/redragon-k502-karura2-rgb-gaming-keyboard.json' },
  // K505 - more stores
  { model: 'K505', url: 'https://nextmarteg.com/products/redragon-k505.json' },
  { model: 'K505', url: 'https://king-tech-eg.com/products/redragon-k505-yaksa-rgb-gaming-keyboard.json' },
  { model: 'K505', url: 'https://redragonzone.pk/products/redragon-k505-yaksa-rgb-gaming-keyboard.json' },
  { model: 'K505', url: 'https://www.redragon.com.pk/products/redragon-k505-yaksa-rgb-gaming-keyboard.json' },
  { model: 'K505', url: 'https://www.redragon.lk/products/redragon-k505.json' },
];

async function main() {
  for (const q of QUERIES) {
    await sleep(3000);
    const r = await fetch(q.url);
    if (r.status === 200 && r.body.length > 100) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`\nFOUND ${q.model}: ${q.url.replace('https://','').split('/')[0]}`);
          imgs.slice(0,3).forEach(i => console.log('  ', i));
        } else {
          process.stdout.write('~');
        }
      } catch(e) { process.stdout.write('!'); }
    } else {
      process.stdout.write('.');
    }
  }
  console.log('\nDone.');
}
main().catch(console.error);
