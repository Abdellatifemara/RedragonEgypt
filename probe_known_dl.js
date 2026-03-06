// Fetch a known product page with downloads to see how they're structured
const https = require('https');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 15000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

async function main() {
  // K552 has known software - let's see how the product page contains it
  const r = await fetch('https://redragonshop.com/products/redragon-kumara-k552');
  console.log('Status:', r.status);

  // Find any CDN file references
  const cdnPat = /cdn\.shopify\.com[^"'\s<>]+\.(exe|rar|zip|pdf)[^"'\s<>]*/gi;
  let m;
  while ((m = cdnPat.exec(r.body)) !== null) {
    console.log('CDN:', m[0].replace(/['"]+$/, ''));
  }

  // Find download-related sections
  const dlPat = /download[^<]{0,200}/gi;
  while ((m = dlPat.exec(r.body)) !== null) {
    const s = m[0].replace(/\s+/g, ' ').substring(0, 100);
    if (s.includes('cdn') || s.includes('http')) console.log('DL section:', s);
  }

  // Find metafields or JSON data
  const jsonPat = /"(software|manual|download)[^"]*":\s*"([^"]+)"/gi;
  while ((m = jsonPat.exec(r.body)) !== null) {
    console.log('JSON field:', m[1], '->', m[2].substring(0, 80));
  }
}

main().catch(console.error);
