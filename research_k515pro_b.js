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
  const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
  const CDNin = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';

  // Try shamystores and other Egyptian stores for K515 PRO
  const stores = [
    'https://shamystores.com/products/redragon-k515-pro-shiva-rgb-gaming-keyboard.json',
    'https://shamystores.com/products/redragon-k515-pro.json',
    'https://www.compumarts.com/products/redragon-k515-pro-shiva-rgb-3-mode-gaming-keyboard.json',
    'https://www.compumarts.com/products/redragon-k515-pro.json',
    'https://king-tech-eg.com/products/redragon-k515-pro-shiva-rgb-gaming-keyboard.json',
    'https://redragonzone.pk/products/redragon-k515-pro-shiva-rgb-gaming-keyboard.json',
    'https://www.redragon.com.pk/products/redragon-k515-pro-shiva-rgb-3-mode-gaming-keyboard.json',
  ];
  for (const url of stores) {
    await sleep(3000);
    const r = await fetch(url);
    const store = url.split('/')[2];
    if (r.status === 200 && r.body.length > 100) {
      try {
        const d = JSON.parse(r.body);
        const p = d.product;
        if (p) {
          console.log('FOUND on', store + ':', p.title);
          (p.images||[]).slice(0,3).forEach(i => console.log('  IMG:', i.src.split('?')[0]));
          // Check for DL links in body
          const dlLinks = p.body_html?.match(/https?:\/\/[^\s"'<>]+\.(pdf|exe|zip|rar)/gi)||[];
          dlLinks.forEach(l => console.log('  DL:', l));
          return;
        }
      } catch(e) {}
    }
    console.log(store, r.status);
  }

  // CDN probe for K515 PRO images
  const imgFiles = ['K515-PRO.png','K515PRO.png','K515_PRO.png','Redragon_K515_PRO.png','K515-Pro.png'];
  const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';
  for (const cdn of [CDN1, CDN2, CDNin]) {
    for (const f of imgFiles) {
      await sleep(600);
      const s = await head(cdn + f);
      if (s === 200) console.log('IMG FOUND:', cdn + f);
    }
  }
  console.log('Done.');
}
main().catch(console.error);
