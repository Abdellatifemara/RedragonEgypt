const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', Accept: 'text/html' },
      timeout: 15000
    }, res => {
      // Follow redirect
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

async function getWPImages(url) {
  await sleep(3000);
  const r = await fetch(url);
  console.log(url.split('/')[2], r.status, r.body.length + 'B');
  if (r.status === 200 && r.body.length > 500) {
    // WooCommerce: look for og:image or product gallery images
    const og = r.body.match(/property="og:image"\s+content="([^"]+)"/);
    if (og) console.log('  og:image:', og[1]);
    // WP product images
    const wpImgs = [...new Set(r.body.match(/https?:\/\/[^"'\s]+\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|jpeg|webp)/gi) || [])];
    wpImgs.filter(u => !u.match(/\d+x\d+\.(jpg|png|jpeg|webp)$/)).slice(0, 5).forEach(i => console.log('  wp-img:', i));
  }
}

async function main() {
  await getWPImages('https://hardwaremarket.net/product/redragon-k502-karura2-rgb-gaming-keyboard-english-arabic-layout-black/');
  await getWPImages('https://shiftstore-eg.com/shop/gaming/gaming-keyboard/redragon-k502-karura2-7-color-backlight-gaming-keyboard/');
  await getWPImages('https://softlink-eg.com/product/redragon-k502/');
}
main().catch(console.error);
