// Fetch product pages on redragonshop.com to find embedded download links
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 15000
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

function extractCDNLinks(html) {
  const pat = /https:\/\/cdn\.shopify\.com\/s\/files\/1\/0012\/4957\/4961\/files\/[^\s"'<>)]+/g;
  const found = [];
  let m;
  while ((m = pat.exec(html)) !== null) {
    // Remove trailing punctuation
    found.push(m[0].replace(/[,)>'"]+$/, ''));
  }
  return [...new Set(found)];
}

// Product pages that should have download links in description
const PRODUCTS = [
  { slug: 'centaur-k506', models: ['K506'] },
  { slug: 'anubis-k539-tkl-keyboard', models: ['K539'] },
  { slug: 'yama-k550', models: ['K550'] },
  { slug: 'pegasus-k502', models: ['k502'] },
  { slug: 'sphinx-k503', models: ['K503', 'K503 aw'] },
  { slug: 'griffon-k505-fr', models: ['K505'] },
  { slug: 'deimos-k599-wireless-keyboard', models: ['K599-WBS', 'K599-WRS'] },
  { slug: 'faye-k685', models: ['k685 PYG'] },
  { slug: 'dragonborn-k630', models: [] },
  { slug: 'rift-g710-gaming-controller', models: [] },
];

async function main() {
  const results = {};

  for (const entry of PRODUCTS) {
    const url = `https://redragonshop.com/products/${entry.slug}`;
    process.stdout.write(`Fetching ${entry.slug} ... `);
    try {
      const r = await fetch(url);
      if (r.status === 200) {
        const links = extractCDNLinks(r.body);
        const dlLinks = links.filter(l => /\.(exe|rar|zip|pdf)/i.test(l));
        if (dlLinks.length > 0) {
          console.log(`OK - Found ${dlLinks.length} download links:`);
          dlLinks.forEach(l => console.log('  ', l.split('/').pop().split('?')[0], '->', l.substring(0, 80)));
          results[entry.slug] = { models: entry.models, links: dlLinks };
        } else {
          console.log('OK but no download links');
        }
      } else {
        console.log(`HTTP ${r.status}`);
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    await sleep(3500);
  }

  fs.writeFileSync('product_page_results.json', JSON.stringify(results, null, 2));
  console.log('\nDone. Saved to product_page_results.json');
}

main().catch(console.error);
