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

const SLUGS = {
  K502: [
    'keyboard-redragon-k502-rgb-gaming-keyboard',
    'keyboard-redragon-k502-karura2-rgb',
    'redragon-k502-karura2-rgb-gaming-keyboard-english',
    'keyboard-redragon-k502',
    'redragon-k502-karura-rgb',
    'redragon-k502',
    'k502-karura2',
    'k502',
  ],
  K505: [
    'keyboard-redragon-k505-yaksa-rgb',
    'redragon-k505-yaksa-rgb-gaming-keyboard',
    'redragon-k505-gaming-keyboard',
    'redragon-k505',
    'k505',
  ],
  K506: [
    'keyboard-redragon-k506-centaur',
    'redragon-k506-centaur-rgb-gaming-keyboard',
    'redragon-k506-gaming-keyboard',
    'redragon-k506',
    'k506',
  ],
};

async function main() {
  for (const [model, slugs] of Object.entries(SLUGS)) {
    let found = false;
    for (const slug of slugs) {
      await sleep(3000);
      const url = `https://igabiba.com/products/${slug}.json`;
      const r = await fetch(url);
      if (r.status === 200) {
        try {
          const data = JSON.parse(r.body);
          const imgs = (data.product?.images||[]).map(i => i.src.split('?')[0]);
          if (imgs.length > 0) {
            console.log(`FOUND ${model} on igabiba (${slug}):`);
            imgs.slice(0,3).forEach(i => console.log('  ', i));
            found = true; break;
          }
        } catch(e) {}
      }
    }
    if (!found) console.log(`${model}: not found on igabiba`);
  }
}
main().catch(console.error);
