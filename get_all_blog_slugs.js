// Fetch the full blog index and extract ALL download post slugs
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
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
  });
}

function extractCDN(html) {
  const pat = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>\\]+\.(exe|rar|zip|pdf)[^\s"'<>\\]*/gi;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) found.add(m[0].replace(/[,;'")\]>]+$/, ''));
  return [...found];
}

async function main() {
  // Fetch multiple pages of the blog index to get all 270 slugs
  const allSlugs = new Set();

  for (let page = 1; page <= 10; page++) {
    const url = `https://redragonshop.com/blogs/product-download?page=${page}`;
    process.stdout.write(`Page ${page}: `);
    await sleep(3000);
    const r = await fetch(url);
    if (r.status !== 200) { console.log(`HTTP ${r.status} - done`); break; }

    const slugPat = /\/blogs\/product-download\/([a-z0-9][a-z0-9-]+)/g;
    let m;
    let count = 0;
    while ((m = slugPat.exec(r.body)) !== null) {
      if (!m[1].includes('tagged') && !m[1].includes('page')) {
        allSlugs.add(m[1]);
        count++;
      }
    }
    console.log(`found ${count} slugs (total: ${allSlugs.size})`);
    if (count === 0) break;
  }

  console.log('\nAll slugs (', allSlugs.size, '):');
  const all = [...allSlugs].sort();
  fs.writeFileSync('all_blog_slugs.txt', all.join('\n'));

  // Filter for keyboards we need
  const MODELS = ['k50','k51','k52','k60','k61','k509','k551','k607','k615','k506'];
  const relevant = all.filter(s => MODELS.some(m => s.includes(m)));
  console.log('\nRelevant keyboard slugs:', relevant);

  // Also filter for mice we still need
  const MICE = ['m60','m61','m62','m65','m69','m70','m72','m73','m81','m82','m83','m84'];
  const relevantMice = all.filter(s => MICE.some(m => s.includes(m)));
  console.log('\nRelevant mouse slugs:', relevantMice);

  // Now fetch the relevant ones to find downloads
  const toFetch = [...new Set([...relevant, ...relevantMice])];
  const results = {};

  for (const slug of toFetch) {
    const url = `https://redragonshop.com/blogs/product-download/${slug}`;
    process.stdout.write(`\n${slug}: `);
    await sleep(3000);
    const r = await fetch(url);
    if (r.status === 200) {
      const links = extractCDN(r.body);
      if (links.length > 0) {
        console.log(`${links.length} CDN links:`);
        links.forEach(l => console.log(' ', l));
        results[slug] = links;
      } else {
        console.log('JS-loaded');
      }
    } else {
      console.log(`HTTP ${r.status}`);
    }
  }

  if (Object.keys(results).length > 0) {
    console.log('\n=== RESULTS WITH LINKS ===');
    console.log(JSON.stringify(results, null, 2));
    fs.writeFileSync('blog_slugs_results2.json', JSON.stringify(results, null, 2));
  } else {
    console.log('\nNo new CDN links found in relevant blog posts');
  }
}

main().catch(console.error);
