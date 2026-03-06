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

// Try hardwaremarket for K503 white - search for all K503 products
async function main() {
  // WP REST API products search
  await sleep(3000);
  let r = await fetch('https://hardwaremarket.net/?s=k503+white&post_type=product');
  console.log('hardwaremarket search:', r.status, r.body.length);
  if (r.status === 200) {
    const og = r.body.match(/property="og:image"\s+content="([^"]+)"/);
    if (og) console.log('og:', og[1]);
    // Find product links
    const links = [...new Set(r.body.match(/https?:\/\/hardwaremarket\.net\/product\/[^"'\s]+/g)||[])];
    links.forEach(l => console.log('link:', l));
  }

  // Also try ahw.store for K503 white
  await sleep(3000);
  r = await fetch('https://ahw.store/products/redragon-k503-rgb-led-backlit-membrane-gaming-keyboard-english-arabic-white.json');
  console.log('ahw.store K503 white:', r.status, r.body.length);
  if (r.status === 200 && r.body.length > 100) {
    const d = JSON.parse(r.body);
    const imgs = (d.product?.images||[]).map(i => i.src.split('?')[0]);
    console.log('FOUND ahw:', imgs.slice(0,3));
  }

  // redragonepal - get more K503 images
  await sleep(3000);
  r = await fetch('https://redragonepal.com/product/redragon-k503-pc-gaming-keyboard-wired-multimedia-keys-silent-usb-keyboard-with-wrist-rest-for-windows-pc-games-rgb-led-backlit-with-marco-recording/');
  if (r.status === 200) {
    const wpImgs = [...new Set(r.body.match(/https?:\/\/redragonepal\.com\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|jpeg)/gi)||[])];
    const clean = wpImgs.filter(u => !u.match(/\d+x\d+\.(jpg|png|jpeg)$/));
    console.log('redragonepal K503 imgs:', clean.slice(0,5));
  }
}
main().catch(console.error);
