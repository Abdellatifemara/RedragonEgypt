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

async function main() {
  // hardwaremarket WP REST API for products with K503
  await sleep(3000);
  const r = await fetch('https://hardwaremarket.net/wp-json/wc/v3/products?search=k503&per_page=10');
  console.log('hardwaremarket REST API:', r.status, r.body.length);
  if (r.status === 200) {
    try {
      const prods = JSON.parse(r.body);
      prods.forEach(p => {
        console.log(p.name, '|', p.permalink);
        (p.images||[]).slice(0,2).forEach(i => console.log('  img:', i.src));
      });
    } catch(e) {}
  } else {
    // Try fetching hardwaremarket K503 product page
    await sleep(3000);
    const r2 = await fetch('https://hardwaremarket.net/product/redragon-k503-gaming-keyboard/');
    console.log('hardwaremarket K503 direct:', r2.status, r2.body.length);
    if (r2.status === 200) {
      const og = r2.body.match(/property="og:image"\s+content="([^"]+)"/);
      if (og) console.log('og:image:', og[1]);
    }
  }

  // Try redragon.in for K503 white
  await sleep(3000);
  const r3 = await fetch('https://www.redragon.in/products/redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-white.json');
  console.log('redragon.in K503 white:', r3.status);
  if (r3.status === 200) {
    const d = JSON.parse(r3.body);
    const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('redragon.in K503 white imgs:', imgs.slice(0,3));
  }
}
main().catch(console.error);
