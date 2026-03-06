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

async function main() {
  // Try collections endpoint
  await sleep(3000);
  const r = await fetch('https://www.redragon.in/collections/keyboards.json?limit=50');
  console.log('Status:', r.status, 'Len:', r.body.length);
  if (r.status === 200 && r.body.length > 100) {
    const data = JSON.parse(r.body);
    (data.products || []).forEach(p => {
      console.log(p.handle, '|', p.title);
    });
  } else {
    console.log('Preview:', r.body.substring(0, 200));
  }
}
main().catch(console.error);
