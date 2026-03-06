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
  // btech.com - major Egyptian retailer, likely has CDN images
  await sleep(3000);
  const r = await fetch('https://btech.com/en/redragon-harpe-gaming-keyboard-k503-white.html');
  console.log('btech K503 white:', r.status, r.body.length);
  if (r.status === 200) {
    // Extract og:image
    const og = r.body.match(/og:image[^>]+content="([^"]+)"/);
    if (og) console.log('og:image:', og[1]);
    // Extract any CDN images
    const cdnImgs = [...new Set(r.body.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi)||[])].filter(u =>
      u.includes('k503') || u.includes('K503') || u.includes('harpe') || u.includes('keyboard')
    );
    cdnImgs.slice(0,5).forEach(i => console.log('img:', i));
  }

  // Also try redragonshop.com blog for K503 white - might have white images
  await sleep(5000);
  const r2 = await fetch('https://redragonshop.com/blogs/product-download/redragon-k503-gaming-keyboard');
  console.log('redragonshop K503 blog:', r2.status, r2.body.length);
  if (r2.status === 200) {
    const imgs = [...new Set(r2.body.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(jpg|png|jpeg)/gi)||[])];
    imgs.filter(u => u.includes('K503') || u.includes('k503')).slice(0,5).forEach(i => console.log('blog img:', i));
  }
}
main().catch(console.error);
