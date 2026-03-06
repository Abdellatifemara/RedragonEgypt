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

const slugs = [
  'redragon-k502-karura2-rgb-gaming-keyboard-english-arabic-layout-black',
  'redragon-k502-karura2-rgb-gaming-keyboard',
  'redragon-k502-karura2',
  'redragon-k502',
  'k502-karura2-rgb-gaming-keyboard',
];

async function main() {
  for (const slug of slugs) {
    await sleep(3000);
    const r = await fetch(`https://planetgate.net/products/${slug}.json`);
    console.log(slug + ':', r.status);
    if (r.status === 200 && r.body.length > 100) {
      const data = JSON.parse(r.body);
      const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
      console.log('Images:', imgs.join('\n  '));
      break;
    }
  }
}
main().catch(console.error);
