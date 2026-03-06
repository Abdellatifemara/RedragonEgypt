const https = require('https');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function head(url) {
  return new Promise(resolve => {
    const u = new URL(url);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'HEAD',
      headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 8000
    }, res => resolve(res.statusCode));
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

async function main() {
  const base = 'https://hardwaremarket.net/wp-content/uploads/2021/07/Redragon-K502-RGB-Gaming-Keyboard-';
  const found = [];
  for (let i = 1; i <= 10; i++) {
    await sleep(1000);
    const url = base + i + '.jpg';
    const s = await head(url);
    console.log(i + ':', s, url);
    if (s === 200) found.push(url);
  }
  console.log('\nFOUND:', found.join('\n'));
}
main().catch(console.error);
