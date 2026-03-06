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
  const urls = [
    'https://redragonshop.com/pages/software',
    'https://redragonshop.com/blogs/product-download',
    'https://redragon.com/pages/software-download',
  ];

  for (const url of urls) {
    console.log('\n=== Fetching:', url);
    const r = await fetch(url);
    console.log('Status:', r.status, 'Body length:', r.body.length);

    // Extract all CDN file links
    const cdnPat = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>)]+\.(exe|rar|zip|pdf)[^\s"'<>)]*/gi;
    let m;
    const found = new Set();
    while ((m = cdnPat.exec(r.body)) !== null) {
      found.add(m[0].replace(/[,;'"]+$/, ''));
    }
    if (found.size > 0) {
      console.log('CDN links found:', found.size);
      [...found].forEach(l => console.log(' ', l.split('/').pop().substring(0, 60)));
    }

    // Also find any links or hrefs to download posts
    const dlPat = /\/blogs\/product-download\/([a-z0-9-]+)/g;
    const dlSlugs = new Set();
    while ((m = dlPat.exec(r.body)) !== null) dlSlugs.add(m[1]);
    if (dlSlugs.size > 0) {
      console.log('Download post slugs found:', dlSlugs.size);
      [...dlSlugs].forEach(s => console.log(' ', s));
    }

    // Write body to file for inspection
    require('fs').writeFileSync(url.replace(/https?:\/\/[^/]+\//, '').replace(/\//g, '_') + '.html', r.body.substring(0, 50000));
  }
}

main().catch(console.error);
