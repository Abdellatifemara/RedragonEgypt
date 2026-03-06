// Find images + SW/MAN for all remaining products
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve) => {
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

function extractCDN(html) {
  const pat = /https?:\/\/[^\s"'<>\\]+\.(exe|rar|zip|pdf)[^\s"'<>\\]*/gi;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) found.add(m[0].replace(/[,;'")\]>]+$/, ''));
  return [...found];
}

// Try redragon.com for products missing images
const REDRAGON_COM_SLUGS = [
  { slug: 'perdition-pro-m901',        models: ['M901'] },
  { slug: 'm901-perdition-pro',        models: ['M901'] },
  { slug: 'perdition-m901',            models: ['M901'] },
  { slug: 'm901',                      models: ['M901'] },
  { slug: 'perdition-4-m901p-ks',      models: ['M901P-KS', 'M901P-WS'] },
  { slug: 'm901p-ks',                  models: ['M901P-KS', 'M901P-WS'] },
  { slug: 'm901p',                     models: ['M901P-KS', 'M901P-WS'] },
  { slug: 'm903p',                     models: ['M903P'] },
  { slug: 'redragon-m903p',            models: ['M903P'] },
  { slug: 'kg010',                     models: ['KG010-KN', 'KG010-WN'] },
  { slug: 'kg010-mechanical-switch-tester', models: ['KG010-KN', 'KG010-WN'] },
  { slug: 'apas-pro-k535',             models: ['K535'] },
  { slug: 'k535',                      models: ['K535'] },
  { slug: 'k535-apas-pro',             models: ['K535'] },
  // Also look for keyboard SW
  { slug: 'k506',                      models: ['K506'] },
  { slug: 'centaur-k506',              models: ['K506'] },
  { slug: 'k551',                      models: ['k551'] },
  { slug: 'mitra-k551',                models: ['k551'] },
  { slug: 'k607',                      models: ['K607-RGB'] },
  { slug: 'k615p',                     models: ['K615P-KBS'] },
];

async function main() {
  const results = {};

  // Try redragon.com product JSON API
  console.log('=== Trying redragon.com product JSON API ===');
  for (const entry of REDRAGON_COM_SLUGS) {
    const url = `https://redragon.com/products/${entry.slug}.json`;
    process.stdout.write(`${entry.slug} ... `);
    await sleep(1500);
    const r = await fetch(url);
    if (r.status === 200) {
      try {
        const data = JSON.parse(r.body);
        const imgs = (data.product.images || []).map(i => i.src.split('?')[0]);
        if (imgs.length > 0) {
          console.log(`FOUND ${imgs.length} images!`);
          results[entry.slug] = { models: entry.models, images: imgs };
          // Print first image
          console.log('  First:', imgs[0].substring(0, 80));
        } else {
          console.log('OK, no images');
        }
      } catch(e) {
        console.log('Parse err');
      }
    } else {
      console.log(`HTTP ${r.status}`);
    }
  }

  // Now fetch redragon.com sitemap to find real slugs
  console.log('\n=== Fetching redragon.com sitemap ===');
  await sleep(2000);
  const sitemap = await fetch('https://redragon.com/sitemap_products_1.xml');
  if (sitemap.status === 200) {
    const slugPat = /\/products\/([a-z0-9-]+)/g;
    const slugs = new Set();
    let m;
    while ((m = slugPat.exec(sitemap.body)) !== null) slugs.add(m[1]);

    const KEYWORDS = ['m901','m903','kg010','k535','k506','k551','k607','k615'];
    const relevant = [...slugs].filter(s => KEYWORDS.some(k => s.includes(k)));
    console.log('Relevant slugs found:', relevant);
    fs.writeFileSync('redragon_com_slugs.txt', [...slugs].join('\n'));
    console.log('Full sitemap saved to redragon_com_slugs.txt');
  } else {
    console.log('Sitemap status:', sitemap.status);
  }

  // Try redragon.com blogs for SW downloads
  console.log('\n=== Trying redragon.com blog for SW/MAN ===');
  const BLOG_SLUGS = [
    { slug: 'k506',        models: ['K506'] },
    { slug: 'k551',        models: ['k551'] },
    { slug: 'k607',        models: ['K607-RGB'] },
    { slug: 'k615p',       models: ['K615P-KBS'] },
    { slug: 'k509p',       models: ['K509P-KS', 'K509P-wS'] },
  ];
  for (const entry of BLOG_SLUGS) {
    for (const blogBase of [
      'https://redragon.com/blogs/product-download/',
      'https://redragon.com/blogs/downloads/',
    ]) {
      const url = blogBase + entry.slug;
      process.stdout.write(`${url.split('//')[1].substring(0,50)} ... `);
      await sleep(1500);
      const r = await fetch(url);
      if (r.status === 200) {
        const links = extractCDN(r.body);
        if (links.length > 0) {
          console.log(`FOUND ${links.length} CDN links!`);
          links.forEach(l => console.log('  ', l));
          results[entry.slug + '_blog'] = { models: entry.models, links };
        } else {
          console.log('OK (no CDN links)');
        }
      } else {
        console.log(`HTTP ${r.status}`);
      }
    }
  }

  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('missing_all_results.json', JSON.stringify(results, null, 2));
}

main().catch(console.error);
