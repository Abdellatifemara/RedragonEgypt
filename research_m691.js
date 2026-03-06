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
  // 1. Product JSON from redragonshop.com
  await sleep(5000);
  let r = await fetch('https://redragonshop.com/products/m691-mist-wireless-gaming-mouse.json');
  console.log('redragonshop m691:', r.status, r.body.length);
  if (r.status === 200 && r.body.length > 100) {
    const d = JSON.parse(r.body);
    const p = d.product;
    console.log('Title:', p.title);
    console.log('Description snippet:', p.body_html?.replace(/<[^>]+>/g,'').slice(0,300));
    console.log('Images:', (p.images||[]).slice(0,3).map(i => i.src.split('?')[0]).join('\n  '));
  }

  // 2. CDN probes for SW/MAN
  const CDN1 = 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/';
  const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';
  const CDNin = 'https://cdn.shopify.com/s/files/1/0309/3679/3226/files/';

  const files = [
    'REDRAGON_M691_Software.exe', 'Redragon_M691_Software.exe',
    'M691_Software.exe', 'M691.exe',
    'REDRAGON_M691_User_Manual.pdf', 'M691_User_Manual.pdf', 'M691.pdf',
  ];
  console.log('\n--- CDN1 probes ---');
  for (const f of files) {
    await sleep(700);
    const s = await head(CDN1 + f);
    if (s === 200) console.log('FOUND CDN1:', CDN1 + f);
  }
  console.log('--- CDN2 probes ---');
  for (const f of files) {
    await sleep(700);
    const s = await head(CDN2 + f);
    if (s === 200) console.log('FOUND CDN2:', CDN2 + f);
  }
  console.log('--- CDNin probes ---');
  for (const f of files) {
    await sleep(700);
    const s = await head(CDNin + f);
    if (s === 200) console.log('FOUND CDNin:', CDNin + f);
  }
  console.log('Done.');
}
main().catch(console.error);
