const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 15000
    }, res => {
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
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';
const CDNPK = 'https://cdn.shopify.com/s/files/1/0706/5170/7667/files/';

async function probeAll() {
  // CDN2 probes for K502, K505, K503 white
  const cdn2Files = [
    'K502.png','K502_RGB.png','K505.png','K505_RGB.png',
    'K503_White.png','K503-W.png','K503W.png','K503_white.png',
    'KARURA2_K502.png','YAKSA_K505.png',
    'k502.png','k505.png','k503-white.png',
  ];
  console.log('=== CDN2 probes ===');
  for (const f of cdn2Files) {
    await sleep(700);
    const s = await head(CDN2 + f);
    if (s === 200) console.log('FOUND CDN2:', CDN2 + f);
    else process.stdout.write('.');
  }

  // redragon.com.pk catalog for K502/K505/K503 white
  console.log('\n=== redragon.com.pk slugs ===');
  const pkSlugs = [
    ['K502', 'redragon-k502-karura-gaming-keyboard'],
    ['K502', 'redragon-k502-karura2-rgb-gaming-keyboard'],
    ['K502', 'redragon-k502-karura-rgb-backlit-gaming-keyboard'],
    ['K505', 'redragon-k505-yaksa-rgb-gaming-keyboard'],
    ['K505', 'redragon-k505-gaming-keyboard'],
    ['K503W', 'redragon-k503-white-wired-gaming-keyboard'],
    ['K503W', 'redragon-k503-wired-gaming-keyboard-white'],
    ['K503W', 'redragon-k503-rgb-gaming-keyboard-white'],
  ];
  for (const [model, slug] of pkSlugs) {
    await sleep(3000);
    const r = await fetch(`https://www.redragon.com.pk/products/${slug}.json`);
    if (r.status === 200) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`FOUND ${model} on redragon.com.pk (${slug}):`);
          imgs.slice(0,3).forEach(i => console.log('  ', i));
        }
      } catch(e) {}
    } else process.stdout.write('.');
  }

  // redragonzone.pk
  console.log('\n=== redragonzone.pk slugs ===');
  const pzSlugs = [
    ['K502', 'redragon-k502-karura2-rgb-gaming-keyboard'],
    ['K502', 'redragon-k502-gaming-keyboard'],
    ['K505', 'redragon-k505-yaksa-rgb-gaming-keyboard'],
    ['K503W', 'redragon-k503-white-wired-gaming-keyboard'],
  ];
  for (const [model, slug] of pzSlugs) {
    await sleep(3000);
    const r = await fetch(`https://redragonzone.pk/products/${slug}.json`);
    if (r.status === 200) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`FOUND ${model} on redragonzone.pk (${slug}):`);
          imgs.slice(0,3).forEach(i => console.log('  ', i));
        }
      } catch(e) {}
    } else process.stdout.write('.');
  }

  // redragonadria.com
  console.log('\n=== redragonadria.com slugs ===');
  const adriaSlugs = [
    ['K502', 'k502-karura2-rgb-gaming-keyboard'],
    ['K502', 'redragon-k502-gaming-keyboard'],
    ['K505', 'k505-yaksa-rgb-gaming-keyboard'],
    ['K503W', 'k503-white-wired-gaming-keyboard'],
    ['K503W', 'k503-rgb-gaming-keyboard-white'],
  ];
  for (const [model, slug] of adriaSlugs) {
    await sleep(3000);
    const r = await fetch(`https://redragonadria.com/products/${slug}.json`);
    if (r.status === 200) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`FOUND ${model} on redragonadria.com (${slug}):`);
          imgs.slice(0,3).forEach(i => console.log('  ', i));
        }
      } catch(e) {}
    } else process.stdout.write('.');
  }

  console.log('\nDone.');
}
probeAll().catch(console.error);
