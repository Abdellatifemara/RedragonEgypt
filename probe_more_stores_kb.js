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

// Stores that may carry K502/K505/K506 English/Arabic
const STORES = [
  { name: 'planetgate', base: 'https://planetgate.net' },
  { name: 'redragonadria', base: 'https://redragonadria.com' },
  { name: 'techno-eg', base: 'https://techno-eg.com' },
];

const SLUGS = {
  K502: ['redragon-k502-karura2-rgb-gaming-keyboard-english-arabic', 'redragon-k502-karura2', 'redragon-k502-rgb', 'keyboard-redragon-k502', 'redragon-k502'],
  K505: ['redragon-k505-yaksa-rgb-gaming-keyboard', 'redragon-k505-yaksa', 'keyboard-redragon-k505', 'redragon-k505'],
  K506: ['redragon-k506-centaur-rgb-gaming-keyboard', 'redragon-k506-centaur', 'keyboard-redragon-k506', 'redragon-k506'],
};

async function main() {
  for (const [model, slugs] of Object.entries(SLUGS)) {
    let found = false;
    for (const store of STORES) {
      if (found) break;
      for (const slug of slugs) {
        await sleep(3000);
        const url = `${store.base}/products/${slug}.json`;
        const r = await fetch(url);
        if (r.status === 200) {
          try {
            const data = JSON.parse(r.body);
            const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
            if (imgs.length > 0) {
              console.log(`FOUND ${model} on ${store.name} (${slug}):`);
              imgs.slice(0,3).forEach(i => console.log('  ', i));
              found = true; break;
            }
          } catch(e) {}
        }
      }
    }
    if (!found) console.log(`${model}: not found`);
  }
}
main().catch(console.error);
