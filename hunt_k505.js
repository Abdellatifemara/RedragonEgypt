const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', Accept: 'text/html,application/json' },
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

async function main() {
  // shamystores.com - Shopify?
  await sleep(3000);
  let r = await fetch('https://shamystores.com/products/redragon-yaksa-k505-keyboard-41010003058447.json');
  console.log('shamystores K505 JSON:', r.status, r.body.length);
  if (r.status === 200 && r.body.length > 100) {
    const data = JSON.parse(r.body);
    const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('FOUND shamystores:', imgs.join('\n  '));
    return;
  }

  // ahw.store - Shopify?
  await sleep(3000);
  r = await fetch('https://ahw.store/products/redragon-k505-yaksa-gaming-keyboard-black.json');
  console.log('ahw.store K505 JSON:', r.status, r.body.length);
  if (r.status === 200 && r.body.length > 100) {
    const data = JSON.parse(r.body);
    const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('FOUND ahw.store:', imgs.join('\n  '));
    return;
  }

  // highendtec.com - WordPress, try HTML
  await sleep(3000);
  r = await fetch('https://highendtec.com/product/redragon-k505-yaksa-multi-led-color-backlit-gaming-keyboard-memrane/');
  console.log('highendtec K505 HTML:', r.status, r.body.length);
  if (r.status === 200) {
    const og = r.body.match(/property="og:image"\s+content="([^"]+)"/);
    if (og) console.log('  og:image:', og[1]);
    const wpImgs = [...new Set(r.body.match(/https?:\/\/[^"'\s]+\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|jpeg)/gi)||[])];
    wpImgs.filter(u => !u.match(/\d+x\d+\.(jpg|png|jpeg)$/)).slice(0,5).forEach(i => console.log('  wp-img:', i));
  }
}
main().catch(console.error);
