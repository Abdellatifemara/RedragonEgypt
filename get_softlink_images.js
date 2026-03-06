const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetchHtml(url) {
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
  const r = await fetchHtml('https://softlink-eg.com/product/redragon-k502/');
  // Get all WP uploads images
  const imgs = [...new Set(r.body.match(/https?:\/\/softlink-eg\.com\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|webp)/gi) || [])];
  console.log('K502 images on softlink-eg.com:');
  imgs.forEach(i => console.log(' ', i));

  await sleep(4000);
  // Try K505 page
  const r2 = await fetchHtml('https://softlink-eg.com/product/redragon-k505-yaksa-gaming-keyboard/');
  const imgs2 = [...new Set(r2.body.match(/https?:\/\/softlink-eg\.com\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|webp)/gi) || [])];
  console.log('\nK505 HTTP', r2.status, 'images:');
  imgs2.forEach(i => console.log(' ', i));

  await sleep(4000);
  // Try other K505 slug
  const r3 = await fetchHtml('https://softlink-eg.com/product/redragon-k505/');
  const imgs3 = [...new Set(r3.body.match(/https?:\/\/softlink-eg\.com\/wp-content\/uploads\/[^"'\s?]+\.(jpg|png|webp)/gi) || [])];
  console.log('\nK505 (alt slug) HTTP', r3.status, 'images:');
  imgs3.forEach(i => console.log(' ', i));
}
main().catch(console.error);
