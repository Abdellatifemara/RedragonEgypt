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
  await sleep(3000);
  const r = await fetch('https://planetgate.net/products/redragon-k502-karura2-rgb-gaming-keyboard-english-arabic-layout-black.json');
  console.log('planetgate K502:', r.status, r.body.length + 'B');
  if (r.status === 200) {
    const data = JSON.parse(r.body);
    const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('Images:');
    imgs.forEach(i => console.log(' ', i));
  }
}
main().catch(console.error);
