const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' }, timeout: 10000
    }, res => { resolve(res.statusCode); });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

function fetchJson(url) {
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

const CDN2 = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';

// Try common filename patterns for each keyboard
const PROBES = [
  // K502
  { model: 'K502', url: CDN2 + 'K502.png' },
  { model: 'K502', url: CDN2 + 'K502_RGB.png' },
  { model: 'K502', url: CDN2 + 'KARURA_K502.png' },
  { model: 'K502', url: CDN2 + 'Redragon_K502.png' },
  { model: 'K502', url: CDN2 + 'K502KARURA2.png' },
  // K505
  { model: 'K505', url: CDN2 + 'K505.png' },
  { model: 'K505', url: CDN2 + 'K505_RGB.png' },
  { model: 'K505', url: CDN2 + 'YAKSA_K505.png' },
  { model: 'K505', url: CDN2 + 'Redragon_K505.png' },
  // K506
  { model: 'K506', url: CDN2 + 'K506.png' },
  { model: 'K506', url: CDN2 + 'K506_RGB.png' },
  { model: 'K506', url: CDN2 + 'CENTAUR_K506.png' },
  { model: 'K506', url: CDN2 + 'Redragon_K506.png' },
  // K503 English (non-AZERTY)
  { model: 'K503-EN', url: CDN2 + 'K503.png' }, // already verified 200 last session
];

// Also try alarabiya and elyamamastore Shopify JSON
const STORES = [
  { name: 'alarabiya', base: 'https://alarabiya-computer.com' },
  { name: 'elyamamastore', base: 'https://elyamamastore.com' },
];
const KB_SLUGS = {
  K502: ['redragon-k502-karura2-rgb-gaming-keyboard-english-arabic-layout-black', 'redragon-k502-karura2-rgb-gaming-keyboard', 'redragon-k502-rgb-gaming-keyboard', 'redragon-k502'],
  K505: ['redragon-k505-yaksa-gaming-keyboard', 'redragon-k505-rgb-gaming-keyboard', 'redragon-k505-gaming-keyboard', 'redragon-k505'],
  K506: ['redragon-k506-centaur-gaming-keyboard', 'redragon-k506-rgb-gaming-keyboard', 'redragon-k506-gaming-keyboard', 'redragon-k506'],
};

async function main() {
  console.log('=== CDN2 probe ===');
  for (const p of PROBES) {
    await sleep(1000);
    const status = await head(p.url);
    if (status === 200) console.log('FOUND', p.model, p.url);
    else process.stdout.write('.');
  }
  console.log('\n=== Store JSON probe ===');
  for (const [model, slugs] of Object.entries(KB_SLUGS)) {
    let found = false;
    for (const store of STORES) {
      if (found) break;
      for (const slug of slugs) {
        await sleep(2500);
        const url = `${store.base}/products/${slug}.json`;
        const r = await fetchJson(url);
        if (r.status === 200) {
          try {
            const data = JSON.parse(r.body);
            const imgs = (data.product?.images || []).map(i => i.src.split('?')[0]);
            if (imgs.length > 0) {
              console.log(`FOUND ${model} on ${store.name} (${slug}):`);
              imgs.slice(0,3).forEach(i => console.log('  ', i));
              found = true; break;
            }
          } catch(e) {}
        }
      }
    }
    if (!found) console.log(model + ': not found on stores');
  }
}

main().catch(console.error);
