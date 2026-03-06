// Check regional Redragon sites for missing SW/MAN/images
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      timeout: 20000
    }, res => {
      let body = '';
      res.on('data', c => { if (body.length < 500000) body += c; });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractAll(html) {
  const cdnPat = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\]+\.(exe|rar|zip|pdf)[^\s"'<>\\]*/gi;
  const imgPat = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\]+\.(jpg|jpeg|png|webp)[^\s"'<>\\]*/gi;
  const found = { sw: new Set(), img: new Set() };
  let m;
  while ((m = cdnPat.exec(html)) !== null) found.sw.add(m[0].replace(/[,;'")\]>]+$/, ''));
  while ((m = imgPat.exec(html)) !== null) found.img.add(m[0].replace(/[,;'")\]>]+$/, '').split('?')[0]);
  return { sw: [...found.sw], img: [...found.img] };
}

const MODELS = ['K506','K509','K551','K607','K615','k551','k607','k615','k509','k506',
                'M901','M903','KG010','K535','m901','m903','kg010','k535'];

const PAGES = [
  'https://www.redragonzone.com/software.html',
  'https://www.redragon.in/pages/software-download',
  'https://www.redragon.in/pages/downloads-software-and-manuals',
  'https://www.originshop.co.in/pages/redragon-software-user-manual-download',
  'https://redragonadria.com/drivers/',
];

async function main() {
  const found = {};

  for (const url of PAGES) {
    console.log(`\n=== Fetching: ${url}`);
    await sleep(2000);
    const r = await fetch(url);
    console.log('Status:', r.status, 'Body:', r.body.length, 'bytes');

    if (r.status !== 200) continue;

    const extracted = extractAll(r.body);
    const relevantSW = extracted.sw.filter(u => MODELS.some(m => u.toUpperCase().includes(m.toUpperCase())));
    const relevantImg = extracted.img.filter(u => MODELS.some(m => u.toUpperCase().includes(m.toUpperCase())));

    if (relevantSW.length > 0) {
      console.log('SW/MAN links:');
      relevantSW.forEach(u => console.log(' ', u));
      found[url] = { sw: relevantSW };
    }
    if (relevantImg.length > 0) {
      console.log('Images:');
      relevantImg.forEach(u => console.log(' ', u.substring(0,80)));
      if (!found[url]) found[url] = {};
      found[url].img = relevantImg;
    }

    // Also save full SW list
    if (extracted.sw.length > 0) {
      const domain = url.replace('https://', '').split('/')[0].replace(/\./g, '_');
      fs.writeFileSync(`cdn_${domain}.txt`, extracted.sw.join('\n'));
      console.log(`Saved ${extracted.sw.length} SW links to cdn_${domain}.txt`);
    }
  }

  // Also look for images via Shopify product API on regional stores
  const SHOPIFY_STORES = [
    { base: 'https://www.redragon.in', name: 'redragon_in' },
  ];
  const TARGET_SLUGS = ['m901', 'm901p', 'm901p-ks', 'm903p', 'kg010', 'k535-apas-pro', 'k535'];

  for (const store of SHOPIFY_STORES) {
    for (const slug of TARGET_SLUGS) {
      const url = `${store.base}/products/${slug}.json`;
      process.stdout.write(`${store.name}/${slug}: `);
      await sleep(1500);
      const r = await fetch(url);
      if (r.status === 200) {
        try {
          const data = JSON.parse(r.body);
          const imgs = (data.product.images || []).map(i => i.src.split('?')[0]);
          if (imgs.length > 0) {
            console.log(`FOUND ${imgs.length} images!`);
            imgs.forEach(u => console.log(' ', u.substring(0,80)));
            found[slug] = { images: imgs };
          } else console.log('OK, no images');
        } catch(e) { console.log('parse err'); }
      } else {
        console.log(`HTTP ${r.status}`);
      }
    }
  }

  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(found, null, 2));
  fs.writeFileSync('regional_results.json', JSON.stringify(found, null, 2));
}

main().catch(console.error);
