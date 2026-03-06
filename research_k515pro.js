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
  // redragonshop.com product JSON
  const shopSlugs = [
    'k515-pro-shiva-rgb-3-mode-gaming-keyboard',
    'k515-pro-shiva-rgb-gaming-keyboard',
    'k515-pro-gaming-keyboard',
    'k515-pro',
  ];
  for (const slug of shopSlugs) {
    await sleep(5000);
    const r = await fetch(`https://redragonshop.com/products/${slug}.json`);
    console.log(slug + ':', r.status, r.body.length);
    if (r.status === 200 && r.body.length > 100) {
      const d = JSON.parse(r.body);
      const p = d.product;
      console.log('FOUND:', p.title);
      console.log('Desc:', p.body_html?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,400));
      console.log('Images:', (p.images||[]).slice(0,3).map(i=>i.src.split('?')[0]).join('\n  '));
      break;
    }
  }

  // CDN probes for SW/MAN
  const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
  const CDNin = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';
  const swFiles = ['REDRAGON_K515PRO_Software.zip','Redragon_K515Pro_Software.zip','K515-PRO_Software.zip','K515PRO_Software.zip','K515PRO.zip','K515_PRO_Software.exe'];
  const manFiles = ['K515PRO_User_Manual.pdf','K515-PRO_User_Manual.pdf','K515_PRO.pdf','K515PRO.pdf','Redragon_K515PRO.pdf'];

  console.log('\n--- SW CDN1 ---');
  for (const f of swFiles) {
    await sleep(600);
    const s = await head(CDN1 + f);
    if (s === 200) console.log('SW FOUND CDN1:', CDN1 + f);
  }
  console.log('--- SW CDNin ---');
  for (const f of swFiles) {
    await sleep(600);
    const s = await head(CDNin + f);
    if (s === 200) console.log('SW FOUND CDNin:', CDNin + f);
  }
  console.log('--- MAN CDN1 ---');
  for (const f of manFiles) {
    await sleep(600);
    const s = await head(CDN1 + f);
    if (s === 200) console.log('MAN FOUND CDN1:', CDN1 + f);
  }
  console.log('Done.');
}
main().catch(console.error);
