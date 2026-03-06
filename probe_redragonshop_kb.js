const https = require('https');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetchJson(url) {
  return new Promise(resolve => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body, len: body.length }));
    });
    req.on('error', e => resolve({ status: 0, body: '', len: 0 }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '', len: 0 }); });
  });
}

const SLUGS = {
  K502: ['k502-karura2-rgb-gaming-keyboard', 'k502-rgb-gaming-keyboard', 'k502-gaming-keyboard', 'k502-karura2'],
  K505: ['k505-yaksa-rgb-gaming-keyboard', 'k505-gaming-keyboard', 'k505-yaksa', 'k505'],
  K506: ['k506-centaur-rgb-gaming-keyboard', 'k506-gaming-keyboard', 'k506-centaur', 'k506'],
};

async function main() {
  for (const [model, slugs] of Object.entries(SLUGS)) {
    let found = false;
    for (const slug of slugs) {
      await sleep(5000);
      const url = `https://redragonshop.com/products/${slug}.json`;
      const r = await fetchJson(url);
      console.log(`${model} ${slug}: HTTP ${r.status} (${r.len} bytes)`);
      if (r.status === 200 && r.len > 100) {
        try {
          const data = JSON.parse(r.body);
          const imgs = (data.product?.images || []).map(i => i.src.split('?')[0]);
          console.log('  Images:', imgs.slice(0,3).join('\n    '));
          found = true; break;
        } catch(e) { console.log('  Parse error'); }
      } else if (r.len > 0) {
        console.log('  Body preview:', r.body.substring(0, 100));
      }
    }
    if (!found) console.log(`${model}: NOT FOUND\n`);
  }
}
main().catch(console.error);
