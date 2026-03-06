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
  await sleep(5000);
  const r = await fetch('https://redragonshop.com/blogs/product-download/redragon-k503-gaming-keyboard');
  if (r.status === 200) {
    // Get ALL CDN images from the page
    const imgs = [...new Set(r.body.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(jpg|png|jpeg)/gi)||[])];
    console.log('All CDN imgs on K503 blog:');
    imgs.slice(0, 20).forEach(i => console.log(' ', i));
  }
}
main().catch(console.error);
