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
  // Scan hardwaremarket redragon page for K503
  for (let page = 1; page <= 5; page++) {
    await sleep(3000);
    const r = await fetch(`https://hardwaremarket.net/brand/redragon/page/${page}/`);
    console.log('page', page + ':', r.status, r.body.length);
    if (r.status !== 200) break;
    // Find K503 product links
    const k503Links = [...new Set(r.body.match(/https?:\/\/hardwaremarket\.net\/product\/[^"'\s]*k503[^"'\s]*/gi)||[])];
    k503Links.forEach(l => console.log('K503 link:', l));
    if (r.body.includes('k503') || r.body.toLowerCase().includes('k503')) {
      console.log('Page', page, 'mentions K503');
    }
    if (r.body.includes('Next page') === false && !r.body.includes('next-page')) break;
  }
}
main().catch(console.error);
