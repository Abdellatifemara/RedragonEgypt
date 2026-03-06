const https = require('https');
const http = require('http');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetchHtml(url) {
  return new Promise(resolve => {
    const mod = url.startsWith('https') ? https : http;
    try {
      const req = mod.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120', Accept: 'text/html' },
        timeout: 15000
      }, res => {
        let body = '';
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchHtml(res.headers.location).then(resolve);
        }
        res.on('data', c => body += c);
        res.on('end', () => resolve({ status: res.statusCode, body }));
      });
      req.on('error', () => resolve({ status: 0, body: '' }));
      req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
    } catch(e) { resolve({ status: 0, body: '' }); }
  });
}

async function findImages(url, model) {
  await sleep(3000);
  const r = await fetchHtml(url);
  console.log(`${model} ${url.replace('https://','').split('/')[0]}: HTTP ${r.status} (${r.body.length}B)`);
  if (r.status === 200 && r.body.length > 500) {
    const cdnImgs = (r.body.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(jpg|png|webp)/gi) || []);
    const unique = [...new Set(cdnImgs)].filter(u => !u.includes('/thumb') && !u.includes('_thumb'));
    if (unique.length > 0) {
      console.log('  CDN imgs:', unique.slice(0,3).join('\n    '));
      return unique;
    }
    // Try other image patterns
    const imgs = (r.body.match(/https?:\/\/[^"'\s]+\.(jpg|png|webp)/gi) || []).filter(u =>
      u.includes('k502') || u.includes('k505') || u.includes('K502') || u.includes('K505') || u.includes('karura') || u.includes('yaksa')
    );
    if (imgs.length > 0) {
      console.log('  Product imgs:', imgs.slice(0,3).join('\n    '));
    } else {
      console.log('  No product images found');
    }
  }
  return [];
}

async function main() {
  await findImages('https://softlink-eg.com/product/redragon-k502/', 'K502');
  await findImages('https://nextmarteg.com/product/redragon-k502-karura2-rgb-gaming-keyboard/', 'K502');
  await findImages('https://nextmarteg.com/product/redragon-k505-yaksa-rgb-gaming-keyboard/', 'K505');
  await findImages('https://redragonzone.com/products/redragon-k502-karura2-rgb-gaming-keyboard', 'K502');
  await findImages('https://redragonzone.com/products/redragon-k505-yaksa-rgb-gaming-keyboard', 'K505');
  await findImages('https://redragonzone.com/products/redragon-k506-centaur-2-rainbow-membrane-gaming-keyboard', 'K506');
}
main().catch(console.error);
