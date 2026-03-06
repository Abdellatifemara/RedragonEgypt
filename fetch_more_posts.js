// Fetch more blog posts for remaining missing products
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

function extractCDN(html) {
  const pat = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\]+\.(exe|rar|zip|pdf)[^\s"'<>\\]*/gi;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) {
    found.add(m[0].replace(/[,;'")\]>]+$/, ''));
  }
  return [...found];
}

const BASE = 'https://redragonshop.com/blogs/product-download/';

// More blog slugs to try
const POSTS = [
  // M915WL-RGB
  { slug: 'redragon-m915rgb-wl-gaming-mice',  models: ['M915WL-RGB'] },
  { slug: 'redragon-m915-gaming-mice',        models: ['M915WL-RGB'] },
  // M901 and M903P
  { slug: 'redragon-m901k-gaming-mice',       models: ['M901'] },
  // M694 (had JS-loaded in first pass)
  { slug: 'redragon-m694-gaming-mice',        models: ['M694'] },
  // M725 LIT
  { slug: 'redragon-m725-lit-gaming-mice',    models: ['m725 lit'] },
  // Combos
  { slug: 's101-pc-gaming-keyboard-and-mouse-combo', models: ['S01-5'] },
  { slug: 'redragon-s101-3-gaming-combo',     models: ['S01-5'] },
  { slug: 'redragon-s101-4-gaming-combo',     models: ['S01-5'] },
  // More keyboards
  { slug: 'redragon-k503-gaming-keyboard',    models: ['K503', 'K503 aw'] }, // for manual
  { slug: 'kumara-k552-rgb-keyboard',         models: [] },
  { slug: 'devarajas-k556',                   models: [] },
  { slug: 'shiva-k516',                       models: [] },
  // Headsets from blog slugs
  { slug: 'scream-h231',                      models: ['H231-RGB'] },
  { slug: 'hylas-h260',                       models: ['H260'] },
  { slug: 'rebellion-h315',                   models: ['h315'] },
  { slug: 'aurora-h376',                      models: [] },
  { slug: 'diomedes-h386',                    models: ['H386'] },
  { slug: 'h510-zeus',                        models: ['H510-fb', 'H510RGB'] },
];

async function main() {
  const results = {};

  for (const entry of POSTS) {
    const url = BASE + entry.slug;
    process.stdout.write(`${entry.slug} ... `);
    await sleep(3000);

    try {
      const r = await fetch(url);
      if (r.status === 200) {
        const links = extractCDN(r.body);
        if (links.length > 0) {
          console.log(`${links.length} CDN links:`);
          links.forEach(l => console.log('  ', l));
          results[entry.slug] = { models: entry.models, links };
        } else {
          console.log('OK (JS-loaded, no static links)');
          results[entry.slug] = { models: entry.models, links: [] };
        }
      } else {
        console.log(`HTTP ${r.status}`);
      }
    } catch(e) {
      console.log(`Error: ${e.message}`);
    }
  }

  const withLinks = Object.entries(results).filter(([, v]) => v.links && v.links.length > 0);
  console.log('\n=== FOUND', withLinks.length, 'pages with CDN links ===');
  withLinks.forEach(([slug, v]) => {
    console.log(slug, '→', v.models.join(', ') || '(no model)');
    v.links.forEach(l => console.log('  ', l));
  });

  fs.writeFileSync('more_posts_results.json', JSON.stringify(results, null, 2));
  console.log('Saved to more_posts_results.json');
}

main().catch(console.error);
