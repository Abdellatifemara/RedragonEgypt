const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120' },
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

// More stores to try
const STORES = [
  { name: 'igabiba', base: 'https://igabiba.com' },
  { name: 'softlink', base: 'https://softlink-eg.com' },
  { name: 'compumarts2', base: 'https://www.compumarts.com' },
];

const PRODUCTS = [
  { model: 'K502', slugs: [
    'keyboard-redragon-k502-karura2-rgb-gaming-keyboard-english-arabic',
    'keyboard-redragon-k502-rgb',
    'redragon-k502-karura2-rgb-gaming-keyboard',
    'redragon-k502-gaming-keyboard',
    'redragon-k502-karura',
    'redragon-k502',
  ]},
  { model: 'K505', slugs: [
    'keyboard-redragon-k505-yaksa-rgb',
    'redragon-k505-yaksa-gaming-keyboard',
    'redragon-k505',
  ]},
  { model: 'K506', slugs: [
    'keyboard-redragon-k506-centaur',
    'redragon-k506-centaur-gaming-keyboard',
    'redragon-k506',
  ]},
  { model: 'K609', slugs: [
    'redragon-k609-sargas-gaming-keyboard',
    'redragon-k609',
  ]},
];

async function main() {
  const found = {};

  for (const prod of PRODUCTS) {
    process.stdout.write('\n' + prod.model + ': ');
    let foundAny = false;
    for (const store of STORES) {
      if (foundAny) break;
      for (const slug of prod.slugs) {
        await sleep(2500);
        const url = `${store.base}/products/${slug}.json`;
        const r = await fetch(url);
        if (r.status === 200) {
          try {
            const data = JSON.parse(r.body);
            const imgs = (data.product.images || []).map(i => i.src.split('?')[0]);
            if (imgs.length > 0) {
              console.log(`FOUND on ${store.name} (${slug}): ${imgs[0].substring(0, 80)}`);
              found[prod.model] = { store: store.name, images: imgs.slice(0, 3) };
              foundAny = true;
              break;
            }
          } catch(e) { /* skip */ }
        }
      }
    }
    if (!foundAny) process.stdout.write('not found\n');
  }

  console.log('\n=== FOUND ===');
  console.log(JSON.stringify(found, null, 2));
  fs.writeFileSync('kb_images_result2.json', JSON.stringify(found, null, 2));
}

main().catch(console.error);
