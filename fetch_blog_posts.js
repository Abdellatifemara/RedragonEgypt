// Fetch specific download blog posts found in the blog index
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

// Exact slugs found in the blog index for products we need
const BLOG_POSTS = [
  { slug: 'redragon-m617-lit-gaming-mice',    models: ['m617-lit'] },
  { slug: 'redragon-m694-gaming-mice',        models: ['M694'] },
  { slug: 'redragon-m725-lit-gaming-mice',    models: ['m725 lit'] },
  { slug: 'redragon-m815-pro-gaming-mice',    models: ['m815-pro'] },
  { slug: 'redragon-m816-pro-gaming-mice',    models: ['m816-lit'] },
  { slug: 'redragon-m814rgb-pro-gaming-mice', models: ['M814RGB-PRO'] },
  { slug: 'redragon-m602ks-gaming-mice',      models: ['M602-KS'] },
  { slug: 'redragon-m901p-ks-gaming-mice',    models: ['M901P-KS', 'M901P-WS'] },
  { slug: 'redragon-m801-gaming-mice',        models: ['M801'] },
  { slug: 'redragon-k503-gaming-keyboard',    models: ['K503', 'K503 aw'] },
  { slug: 'redragon-k629-gaming-keyboard',    models: ['k629-rgb'] },
  { slug: 'redragon-k629-rgb-gaming-keyboard',models: ['k629-rgb'] },
  { slug: 'redragon-k599-krs-gaming-keyboard',models: ['K599-WBS', 'K599-WRS'] },
  { slug: 'redragon-k684-gaming-keyboard',    models: ['k685 PYG'] },
  { slug: 'redragon-k671-gaming-keyboard',    models: ['K661 WGY'] },
  { slug: 'redragon-k671-gaming-keyboard-1',  models: ['K661 WGY'] },
  { slug: 'redragon-m602a-rgb-gaming-mice',   models: [] },
  { slug: 'redragon-m602w-gaming-mice',       models: [] },
  { slug: 'redragon-k552-kr-gaming-keyboard', models: [] },
  { slug: 'redragon-k671-ks-gaming-keyboard', models: [] },
  { slug: 'redragon-k503-gaming-keyboard',    models: ['K503', 'K503 aw'] },
  { slug: 'redragon-k565-rgb-104-key-gaming-keyboard', models: [] },
  { slug: 'redragon-s107-ks-gaming-combo',    models: ['S107'] },
  { slug: 'redragon-s101-ba-3-gaming-combo-mice',    models: ['S101-BA'] },
  { slug: 'redragon-s101-ba-3-gaming-combo-keyboard',models: ['S101-BA', 'S101W'] },
  { slug: 'redragon-s107-rgb-ba-gaming-combo',models: ['S107'] },
];

const BASE = 'https://redragonshop.com/blogs/product-download/';

async function main() {
  const results = {};

  for (const entry of BLOG_POSTS) {
    // Skip duplicates
    if (results[entry.slug]) continue;

    const url = BASE + entry.slug;
    process.stdout.write(`Fetching ${entry.slug} ... `);
    await sleep(3000);

    try {
      const r = await fetch(url);
      if (r.status === 200) {
        const links = extractCDN(r.body);
        if (links.length > 0) {
          console.log(`OK - ${links.length} CDN links:`);
          links.forEach(l => console.log('  ', l.split('/').pop().split('?')[0].substring(0, 60)));
          results[entry.slug] = { models: entry.models, links };
        } else {
          console.log('OK but no CDN links (JS-loaded)');
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
  console.log('\n=== PAGES WITH CDN LINKS ===', withLinks.length);
  withLinks.forEach(([slug, v]) => {
    console.log(slug, '→', v.models.join(', '));
    v.links.forEach(l => console.log('  ', l));
  });

  fs.writeFileSync('blog_posts_results.json', JSON.stringify(results, null, 2));
  console.log('Saved to blog_posts_results.json');
}

main().catch(console.error);
