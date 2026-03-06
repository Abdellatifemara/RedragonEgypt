// Try many variations of blog slug patterns to find download pages
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function head(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 8000, headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'
    }}, res => {
      resolve(res.statusCode);
    });
    req.on('error', () => resolve(0));
    req.on('timeout', () => { req.destroy(); resolve(0); });
    req.end();
  });
}

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 12000, headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'
    }}, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractCDN(html) {
  const pat = /https:\/\/cdn\.shopify\.com\/s\/files\/1\/0012\/4957\/4961\/files\/[^\s"'<>)]+/g;
  const found = [];
  let m;
  while ((m = pat.exec(html)) !== null) found.push(m[0].replace(/[,)>'"]+$/, ''));
  return [...new Set(found)].filter(l => /\.(exe|rar|zip|pdf)/i.test(l));
}

const BASE = 'https://redragonshop.com/blogs/product-download/';

const SLUGS = [
  // K506
  'centaur-k506', 'k506-centaur', 'k506', 'centaur-k506-keyboard',
  'k506-software', 'redragon-k506',
  // K539
  'anubis-k539', 'k539-anubis', 'k539', 'anubis-k539-tkl',
  'k539-software', 'k539-tkl',
  // K550
  'yama-k550', 'k550-yama', 'k550', 'k550-rgb',
  'k550-software',
  // K551
  'mitra-k551', 'k551-mitra', 'k551', 'k551-rgb',
  // K607
  'k607-rgb', 'k607', 'k607-deimos',
  // K615P
  'lineage-k615p', 'k615p', 'k615p-kbs', 'k615-lineage',
  // K629
  'jax-pro-k629', 'k629-rgb', 'k629', 'jax-k629-rgb',
  // K661
  'k661', 'k661-wgy', 'dark-avenger-k661', 'k661-rgb',
  // K503
  'sphinx-k503', 'k503', 'k503-rgb',
  // K502
  'pegasus-k502', 'k502', 'k502-pegasus',
  // K505
  'griffon-k505', 'k505', 'k505-griffon',
  // K509P
  'k509p', 'k509p-wired', 'k509p-rgb',
  // K685
  'faye-k685', 'k685', 'k685-faye', 'k684-k685',
  // K599
  'deimos-k599', 'k599', 'k599-wireless',
  // Mice
  'm601-rgb', 'predator-m601', 'm601',
  'm607', 'griffin-m607',
  'm609', 'm617-lit', 'm617',
  'm655', 'm655-ks', 'm694', 'm701-rgb', 'm703',
  'm723', 'm725-lit', 'm815-pro', 'm815',
  // Headsets
  'h270', 'lamia-h270', 'h270-wired',
  'h350-rgb', 'pandora-h350', 'h350',
  'h386', 'diomedes-h386',
  // Accessories
  's107', 's-107',
];

async function main() {
  const found200 = [];

  for (const slug of SLUGS) {
    const url = BASE + slug;
    await sleep(200);
    const status = await head(url);
    if (status === 200) {
      console.log(`FOUND: ${slug}`);
      found200.push(slug);
    } else {
      process.stdout.write('.');
    }
  }

  console.log('\n\nFound pages:', found200);

  // Now fetch the found pages to extract links
  const results = {};
  for (const slug of found200) {
    await sleep(3000);
    const r = await get(BASE + slug);
    if (r.status === 200) {
      const links = extractCDN(r.body);
      console.log(`${slug}: ${links.length} CDN links`);
      links.forEach(l => console.log('  ', l.split('/').pop()));
      results[slug] = links;
    }
  }

  fs.writeFileSync('blog_slug_results.json', JSON.stringify(results, null, 2));
  console.log('\nSaved to blog_slug_results.json');
}

main().catch(console.error);
