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
  // Full product data from shamystores
  await sleep(3000);
  const r = await fetch('https://shamystores.com/products/redragon-m691-mist-wireless-gaming-mouse.json');
  const d = JSON.parse(r.body);
  const p = d.product;
  console.log('=== M691 PRODUCT DATA ===');
  console.log('Title:', p.title);
  console.log('Body HTML (cleaned):');
  console.log(p.body_html?.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0, 1000));
  console.log('\nImages:');
  (p.images||[]).forEach(i => console.log(' ', i.src.split('?')[0]));
  console.log('\nVariants:', (p.variants||[]).map(v => v.title + ' - ' + v.price).join(', '));

  // SW/MAN probes
  const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
  const CDNin = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';
  const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

  const swFiles = ['REDRAGON_M691_Software.exe','Redragon_M691_Software.exe','M691_Software.exe','M691.exe','M691_MIST.exe','redragon-m691.exe'];
  const manFiles = ['M691_User_Manual.pdf','M691.pdf','M691_MIST.pdf','Redragon_M691.pdf','REDRAGON_M691.pdf','M691-User-Manual.pdf'];

  console.log('\n--- SW probes ---');
  for (const cdn of [CDN1, CDN2, CDNin]) {
    for (const f of swFiles) {
      await sleep(600);
      const s = await head(cdn + f);
      if (s === 200) console.log('SW FOUND:', cdn + f);
    }
  }

  console.log('--- MAN probes ---');
  for (const cdn of [CDN1, CDN2, CDNin]) {
    for (const f of manFiles) {
      await sleep(600);
      const s = await head(cdn + f);
      if (s === 200) console.log('MAN FOUND:', cdn + f);
    }
  }
  console.log('Done.');
}
main().catch(console.error);
