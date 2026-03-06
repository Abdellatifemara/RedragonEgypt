// Try to find images for new products not on redragonshop.com
// Try EU Redragon store and other regional CDNs
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 12000
    }, res => {
      let body = '';
      res.on('data', c => { if (body.length < 200000) body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractImages(html, model) {
  // Look for CDN image URLs
  const patterns = [
    /https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp)[^"'\s<>]*/gi,
    /https:\/\/[^"'\s<>]+\/products\/[^"'\s<>]+\.(?:jpg|jpeg|png|webp)[^"'\s<>]*/gi,
  ];
  const found = new Set();
  for (const pat of patterns) {
    let m;
    while ((m = pat.exec(html)) !== null) {
      const url = m[0].replace(/[,"']+$/, '');
      if (!url.includes('svg') && !url.includes('icon') && !url.includes('logo')) {
        found.add(url.split('?')[0]); // strip query params
      }
    }
  }
  return [...found];
}

// Try EU Redragon store for newer products
const EU_PRODUCTS = [
  { slug: 'm801', models: ['M801'] },
  { slug: 'm901', models: ['M901'] },
  { slug: 'm901p', models: ['M901P-KS', 'M901P-WS'] },
  { slug: 'm903p', models: ['M903P'] },
  { slug: 'm915wl-rgb', models: ['M915WL-RGB'] },
  { slug: 'kg010', models: ['KG010-KN', 'KG010-WN'] },
  { slug: 'k535', models: ['K535'] },
  // Also try direct model number slugs
  { slug: 'redragon-m801', models: ['M801'] },
  { slug: 'redragon-m901', models: ['M901'] },
  { slug: 'redragon-m915wl-rgb', models: ['M915WL-RGB'] },
];

const STORES = [
  'https://redragon.eu/products/',
  'https://redragon.es/products/',
  'https://shop.redragonzone.com/products/',
];

async function main() {
  const results = {};

  // Try redragonshop.com first with various slug patterns for missing products
  const REDRAGONSHOP_SLUGS = [
    { slug: 'm801-perdition-pro', models: ['M801'] },
    { slug: 'perdition-pro-m801', models: ['M801'] },
    { slug: 'm901-perdition-pro', models: ['M901'] },
    { slug: 'perdition-4-m901p', models: ['M901P-KS', 'M901P-WS'] },
    { slug: 'm901p-perdition-pro', models: ['M901P-KS', 'M901P-WS'] },
    { slug: 'm903p', models: ['M903P'] },
    { slug: 'm915wl-rgb', models: ['M915WL-RGB'] },
    { slug: 'm915wl', models: ['M915WL-RGB'] },
    { slug: 'kg010-mechanical-switch-tester', models: ['KG010-KN', 'KG010-WN'] },
    { slug: 'kg010', models: ['KG010-KN', 'KG010-WN'] },
    { slug: 'apas-pro-k535', models: ['K535'] },
    { slug: 'k535-apas-pro', models: ['K535'] },
    { slug: 'k535', models: ['K535'] },
  ];

  for (const entry of REDRAGONSHOP_SLUGS) {
    const url = `https://redragonshop.com/products/${entry.slug}.json`;
    process.stdout.write(`Trying redragonshop: ${entry.slug} ... `);
    await sleep(2000);
    const r = await fetch(url);
    if (r.status === 200) {
      try {
        const data = JSON.parse(r.body);
        const imgs = data.product.images.map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`FOUND ${imgs.length} images!`);
          for (const m of entry.models) {
            if (!results[m]) results[m] = imgs;
          }
        } else {
          console.log('OK but no images');
        }
      } catch(e) {
        console.log('Parse error');
      }
    } else {
      console.log(`HTTP ${r.status}`);
    }
  }

  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('new_product_images.json', JSON.stringify(results, null, 2));
  console.log('Saved to new_product_images.json');
}

main().catch(console.error);
