// Re-fetch software pages and extract ALL CDN download URLs
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 30000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractCDN(html) {
  const pat = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\]+\.(exe|rar|zip|pdf)[^\s"'<>\\]*/gi;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) {
    let url = m[0];
    // Clean trailing chars
    url = url.replace(/[,;'")\]]+$/, '');
    found.add(url);
  }
  return [...found];
}

const TARGETS = [
  'https://redragonshop.com/pages/software',
  'https://redragon.com/pages/software-download',
];

const MODELS = ['K506','K539','K550','K551','K607','K615','K629','K661','K685','K599',
                'K509','K503','K502','K505','M601','M602','M607','M609','M617','M655',
                'M694','M701','M703','M723','M725','M814','M815','M816','M801','M901',
                'H270','H350','H386','S107','GW','GCP'];

async function main() {
  const allFound = {};

  for (const url of TARGETS) {
    console.log('Fetching:', url);
    await sleep(2000);
    try {
      const r = await fetch(url);
      console.log('Status:', r.status, 'Size:', r.body.length);
      const links = extractCDN(r.body);
      console.log('Total CDN links:', links.length);

      const relevant = links.filter(l => MODELS.some(m => l.toUpperCase().includes(m)));
      console.log('Relevant links:', relevant.length);
      relevant.forEach(l => {
        const fn = l.split('/').pop().split('?')[0];
        console.log(' ', fn);
        allFound[fn] = l;
      });

      // Save all links
      const domain = url.includes('redragonshop') ? 'redragonshop' : 'redragon';
      fs.writeFileSync(`all_cdn_${domain}.txt`, links.join('\n'));
      console.log(`Full list saved to all_cdn_${domain}.txt\n`);
    } catch(e) {
      console.log('Error:', e.message);
    }
  }

  console.log('\n=== ALL RELEVANT FOUND ===');
  Object.entries(allFound).forEach(([fn, url]) => {
    console.log(fn, '->', url.substring(0, 80));
  });

  fs.writeFileSync('relevant_downloads.json', JSON.stringify(allFound, null, 2));
  console.log('\nSaved to relevant_downloads.json');
}

main().catch(console.error);
