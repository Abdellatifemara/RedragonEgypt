const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9',
      },
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
  // Amazon K503 white - B07MKLLZVQ
  await sleep(3000);
  const r = await fetch('https://www.amazon.eg/-/en/Redragon-Gaming-Keyboard-Backlit-Windows/dp/B07MNTTK16');
  console.log('Amazon.eg K503 white:', r.status, r.body.length);
  if (r.status === 200) {
    // Amazon images pattern: https://m.media-amazon.com/images/I/...
    const imgs = [...new Set(r.body.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.jpg/gi)||[])];
    imgs.filter(u => !u.includes('_S') && !u.includes('_T') && !u.includes('_UL')).slice(0,5).forEach(i => console.log('amz:', i));
    
    // Also look for data-a-dynamic-image
    const dynImg = r.body.match(/data-a-dynamic-image="([^"]+)"/);
    if (dynImg) {
      const decoded = dynImg[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const keys = decoded.match(/https:\/\/m\.media-amazon\.com\/[^"]+/g);
      if (keys) keys.slice(0,3).forEach(i => console.log('dyn:', i));
    }
  }
}
main().catch(console.error);
