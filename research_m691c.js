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
  const stores = [
    ['shamystores', 'https://shamystores.com/products/redragon-m691-mist-wireless-gaming-mouse.json'],
    ['shamystores', 'https://shamystores.com/products/redragon-m691-mist.json'],
    ['shamystores', 'https://shamystores.com/products/redragon-m691.json'],
    ['hardwaremarket', 'https://hardwaremarket.net/product/redragon-m691-mist-wireless-gaming-mouse/'],
    ['compumarts', 'https://www.compumarts.com/products/redragon-m691-mist-wireless-gaming-mouse.json'],
    ['compumarts', 'https://www.compumarts.com/products/redragon-m691.json'],
    ['redragonzone.pk', 'https://redragonzone.pk/products/redragon-m691-mist-wireless-gaming-mouse.json'],
    ['redragon.com.pk', 'https://www.redragon.com.pk/products/redragon-m691-mist-wireless-gaming-mouse.json'],
    ['redragon.in', 'https://www.redragon.in/products/redragon-m691-mist-wireless-gaming-mouse.json'],
    ['redragon.in', 'https://www.redragon.in/products/m691.json'],
  ];

  for (const [name, url] of stores) {
    await sleep(3000);
    const r = await fetch(url);
    const isJson = url.endsWith('.json');
    console.log(name, url.split('/').pop() + ':', r.status, r.body.length + 'B');
    if (r.status === 200 && r.body.length > 100) {
      if (isJson) {
        try {
          const d = JSON.parse(r.body);
          const p = d.product;
          if (p && (p.images||[]).length > 0) {
            console.log('FOUND JSON:', p.title);
            (p.images||[]).slice(0,3).forEach(i => console.log('  IMG:', i.src.split('?')[0]));
            return;
          }
        } catch(e) {}
      } else {
        // HTML
        const og = r.body.match(/og:image[^>]+content="([^"]+)"/);
        if (og) { console.log('  og:image:', og[1]); return; }
      }
    }
  }
  console.log('M691: not found on any store');
}
main().catch(console.error);
