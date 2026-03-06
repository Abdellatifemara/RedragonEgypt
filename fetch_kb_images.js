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

const STORES = [
  { name: 'alarabiya', base: 'https://alarabiya-computer.com' },
  { name: 'elyamamastore', base: 'https://elyamamastore.com' },
  { name: 'compumarts', base: 'https://www.compumarts.com' },
];

const PRODUCTS = [
  // K502 English/Arabic
  { model: 'K502', slugs: ['redragon-k502-karura2-rgb-gaming-keyboard-english-arabic-layout-black', 'redragon-k502-karura2-rgb-gaming-keyboard', 'redragon-k502-rgb-gaming-keyboard', 'redragon-k502'] },
  // K503 English
  { model: 'K503', slugs: ['redragon-k503-gaming-keyboard', 'redragon-k503-rgb-gaming-keyboard', 'redragon-k503'] },
  // K505 English/Arabic
  { model: 'K505', slugs: ['redragon-k505-yaksa-gaming-keyboard', 'redragon-k505-gaming-keyboard', 'redragon-k505-rgb-keyboard', 'redragon-k505'] },
  // K506 English
  { model: 'K506', slugs: ['redragon-k506-gaming-keyboard', 'redragon-k506-centaur-keyboard', 'redragon-k506-rgb-gaming-keyboard', 'redragon-k506'] },
  // K507 and other missing
  { model: 'K609', slugs: ['redragon-k609-gaming-keyboard'] },
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
              console.log(`FOUND on ${store.name}: ${imgs[0].substring(0, 80)}`);
              found[prod.model] = { store: store.name, images: imgs };
              foundAny = true;
              break;
            }
          } catch(e) { /* not JSON */ }
        }
      }
    }
    if (!foundAny) process.stdout.write('not found\n');
  }

  console.log('\n=== FOUND ===');
  console.log(JSON.stringify(found, null, 2));
  fs.writeFileSync('kb_images_result.json', JSON.stringify(found, null, 2));
}

main().catch(console.error);
