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
function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

async function main() {
  // Blog slug variations
  const blogSlugs = [
    'redragon-m691-gaming-mice',
    'redragon-m691-mist-gaming-mice',
    'redragon-m691-mist-wireless-gaming-mice',
    'm691-mist',
  ];
  for (const slug of blogSlugs) {
    await sleep(5000);
    const r = await fetch('https://redragonshop.com/blogs/product-download/' + slug);
    console.log('blog', slug + ':', r.status, r.body.length);
    if (r.status === 200 && r.body.length > 10000) {
      // Look for CDN links
      const cdnLinks = [...new Set(r.body.match(/https:\/\/cdn\.shopify\.com\/[^"'\s]+\.(exe|zip|rar|pdf)/gi)||[])];
      cdnLinks.forEach(l => console.log('  LINK:', l));
    }
  }

  // Also try redragon.in for M691 manual
  await sleep(4000);
  const r = await fetch('https://www.redragon.in/products/redragon-m691-mist-wireless-gaming-mouse.json');
  console.log('redragon.in m691:', r.status);
  if (r.status === 200) {
    const d = JSON.parse(r.body);
    console.log('Body:', d.product?.body_html?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,500));
    // Look for PDF/download links in body
    const pdfLinks = d.product?.body_html?.match(/https?:\/\/[^\s"'<>]+\.(pdf|exe|zip|rar)/gi)||[];
    pdfLinks.forEach(l => console.log('  PDF/EXE:', l));
  }

  console.log('Done');
}
main().catch(console.error);
