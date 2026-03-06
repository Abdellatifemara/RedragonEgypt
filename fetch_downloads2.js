// Fetch software/manual download links for products that still need them
const https = require('https');
const fs = require('fs');

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
        'Accept': 'text/html,application/xhtml+xml,*/*',
      },
      timeout: 15000
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve({ status: res.statusCode, location: res.headers.location, body: '' });
        return;
      }
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
  });
}

// Extract CDN links from page HTML
function extractLinks(html) {
  const SW_PATTERNS = [/href="(https:\/\/cdn\.shopify\.com\/[^"]*\.(?:exe|rar|zip)[^"]*)"/gi];
  const MAN_PATTERNS = [/href="(https:\/\/cdn\.shopify\.com\/[^"]*\.pdf[^"]*)"/gi];
  const sw = [];
  const man = [];

  for (const pat of SW_PATTERNS) {
    let m;
    while ((m = pat.exec(html)) !== null) sw.push(m[1]);
  }
  for (const pat of MAN_PATTERNS) {
    let m;
    while ((m = pat.exec(html)) !== null) man.push(m[1]);
  }
  return { sw: [...new Set(sw)], man: [...new Set(man)] };
}

// Mapping: download blog slug → product model IDs in products.json
const DOWNLOAD_MAP = [
  // Keyboards
  { slug: 'centaur-k506',                  models: ['K506'] },
  { slug: 'anubis-k539-tkl-keyboard',      models: ['K539'] },
  { slug: 'yama-k550',                     models: ['K550'] },
  { slug: 'pegasus-k502',                  models: ['k502'] },
  { slug: 'sphinx-k503',                   models: ['K503', 'K503 aw'] },
  { slug: 'griffon-k505-fr',              models: ['K505'] },
  { slug: 'deimos-k599-wireless-keyboard', models: ['K599-WBS', 'K599-WRS'] },
  { slug: 'faye-k685',                     models: ['k685 PYG'] },
  { slug: 'pollux-k628-75-keyboard',       models: [] }, // K628 not in our list, but get the links
  // Try slugs for discontinued keyboards
  { slug: 'mitra-k551',                    models: ['k551'] },
  { slug: 'kumara-k552-rgb',               models: [] },
  { slug: 'deimos-k607',                   models: ['K607-RGB'] },
  { slug: 'lineage-k615p',                 models: ['K615P-KBS'] },
  { slug: 'jax-pro-k629-rgb',              models: ['k629-rgb'] },
  { slug: 'jax-k629',                      models: ['k629-rgb'] },
  { slug: 'dark-avenger-k661',             models: ['K661 WGY'] },
  { slug: 'deimos-k509p',                  models: ['K509P-KS', 'K509P-wS'] },
  { slug: 'k509p-rgb',                     models: ['K509P-KS', 'K509P-wS'] },
  { slug: 'kg010-mechanical-switch-tester',models: ['KG010-KN', 'KG010-WN'] },
  { slug: 'k535-apas-pro',                 models: ['K535'] },
  // Mice
  { slug: 'predator-m601-rgb',             models: ['M601-RGB'] },
  { slug: 'griffing-m602',                 models: ['M602-KS'] },
  { slug: 'griffin-m607',                  models: ['M607', 'M607-white'] },
  { slug: 's606-gaming-mouse',             models: ['M609'] },
  { slug: 'phaser-m617-lit',              models: ['m617-lit'] },
  { slug: 'nothosaur-m655',               models: ['m655-ks'] },
  { slug: 'm694-gaming-mouse',            models: ['M694'] },
  { slug: 'm694',                         models: ['M694'] },
  { slug: 'perdition-m701-pro',           models: ['m701-RGB'] },
  { slug: 'fireflies-m703',               models: ['M703'] },
  { slug: 'shark-m723',                   models: ['m723'] },
  { slug: 'nothosaur-m725-lit',           models: ['m725 lit'] },
  { slug: 'm815-pro',                     models: ['m815-pro'] },
  { slug: 'm814-rgb-pro',                 models: ['M814RGB-PRO'] },
  { slug: 'm816-lit',                     models: ['m816-lit'] },
  // Headsets
  { slug: 'lamia-h270',                   models: ['H270'] },
  { slug: 'pandora-h350',                 models: ['H350 RGB'] },
  { slug: 'diomedes-h386',                models: ['H386'] },
  // Accessories
  { slug: 'wum300-webcam',                models: [] },
  { slug: 'gw800-1080p-webcam',           models: ['GW900 APEX'] },
  // Combos
  { slug: 's107-combo',                   models: ['S107'] },
];

const BASE = 'https://redragonshop.com/blogs/product-download/';

async function main() {
  const results = {};

  for (const entry of DOWNLOAD_MAP) {
    const url = BASE + entry.slug;
    process.stdout.write(`Fetching: ${entry.slug} ... `);
    try {
      const r = await fetch(url);
      if (r.status === 200) {
        const links = extractLinks(r.body);
        if (links.sw.length > 0 || links.man.length > 0) {
          console.log(`OK - SW:${links.sw.length} MAN:${links.man.length}`);
          results[entry.slug] = { models: entry.models, sw: links.sw, man: links.man };
        } else {
          console.log('OK but no CDN links found');
        }
      } else {
        console.log(`HTTP ${r.status}`);
      }
    } catch (e) {
      console.log(`ERROR: ${e.message}`);
    }
    await sleep(3000);
  }

  fs.writeFileSync('download_results2.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to download_results2.json');
}

main().catch(console.error);
