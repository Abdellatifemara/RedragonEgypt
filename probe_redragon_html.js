const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetchHtml(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', 'Accept': 'text/html' },
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

async function probeHtml(url, model) {
  await sleep(4000);
  const r = await fetchHtml(url);
  console.log(`${model} ${url.replace('https://','').split('/')[0]}: HTTP ${r.status} (${r.body.length}B)`);
  if (r.status === 200 && r.body.length > 1000) {
    // Extract CDN image URLs
    const cdnMatches = r.body.match(/https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s]+\.(jpg|png|webp)/gi) || [];
    const unique = [...new Set(cdnMatches)].filter(u => !u.includes('thumb'));
    if (unique.length > 0) {
      console.log('  CDN images:');
      unique.slice(0, 5).forEach(u => console.log('   ', u));
      return unique;
    } else {
      console.log('  No CDN images found');
    }
  }
  return [];
}

async function main() {
  const urls = [
    ['K502', 'https://www.redragon.in/products/k502-karura2-rgb-gaming-keyboard'],
    ['K502', 'https://www.redragon.in/products/k502-gaming-keyboard'],
    ['K502', 'https://www.originshop.co.in/products/k502'],
    ['K505', 'https://www.redragon.in/products/k505-yaksa-rgb-gaming-keyboard'],
    ['K505', 'https://www.redragon.in/products/k505-gaming-keyboard'],
    ['K506', 'https://www.redragon.in/products/k506-centaur-rgb-gaming-keyboard'],
    ['K506', 'https://www.redragon.in/products/k506-gaming-keyboard'],
  ];
  for (const [model, url] of urls) {
    await probeHtml(url, model);
  }
}
main().catch(console.error);
