// Fetch CDN images and downloads for products on redragonshop.com
const https = require('https');
const fs = require('fs');

function fetch(url) {
  return new Promise((resolve, reject) => {
    const opts = {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      rejectUnauthorized: false
    };
    https.get(url, opts, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Map: redragonshop slug -> products.json model IDs that use this page
const PRODUCT_MAP = [
  { slug: 'k1ng-m724-1k-hz',                    models: ['m724', 'm724-white'] },
  { slug: 'hylas-h260',                          models: ['H260'] },
  { slug: 'rebellion-h315',                      models: ['h315'] },
  { slug: 'pandora-h350-gaming-headset',         models: ['H350 RGB'] },
  { slug: 'diomedes-h386-pc-gaming-headset',     models: ['H386'] },
  { slug: 'h510-zeus',                           models: ['H510-fb', 'H510RGB'] },
  { slug: 'deimos-k599-wireless-keyboard',       models: ['K599-WBS', 'K599-WRS'] },
  { slug: 'anvil-gs520-gaming-speaker',          models: ['GS520'] },
  { slug: 'gmk914-gmk915-monitor-mount-stand',  models: ['GMK914'] },
  { slug: 'gmk-913-universal-multi-monitor-extender', models: ['GMK-913'] },
  { slug: 'redragon-s101-combo',                 models: ['S101W', 'S101-BA'] },
  { slug: 'windseeker-gcp512-laptop-cooling-pad',models: ['GCP511'] },
  { slug: 'gw800-1080p-webcam',                  models: ['GW900 APEX'] },  // GW900 not on site, GW800 closest
  { slug: 'rift-g710-gaming-controller',         models: ['G711'] },
];

// Download blog slugs to try per product model
const DOWNLOAD_MAP = [
  { model: 'm724',      slugs: ['k1ng-m724-1k-hz', 'm724'] },
  { model: 'm724-white',slugs: ['k1ng-m724-1k-hz', 'm724'] },
  { model: 'M601-RGB',  slugs: ['m601-rgb', 'm601'] },
  { model: 'M602-KS',   slugs: ['m602-ks', 'm602'] },
  { model: 'M607',      slugs: ['m607', 'griffin-m607'] },
  { model: 'M607-white',slugs: ['m607-white', 'm607'] },
  { model: 'M609',      slugs: ['m609'] },
  { model: 'm617-lit',  slugs: ['m617-lit', 'm617'] },
  { model: 'm655-ks',   slugs: ['m655-ks', 'm655'] },
  { model: 'M694',      slugs: ['m694', 'trident-m694'] },
  { model: 'm701-RGB',  slugs: ['m701-rgb', 'm701'] },
  { model: 'M703',      slugs: ['m703', 'emp-m703'] },
  { model: 'm723',      slugs: ['m723', 'vampire-m723'] },
  { model: 'm725 lit',  slugs: ['m725-lit', 'm725'] },
  { model: 'M814RGB-PRO',slugs: ['m814-rgb-pro', 'm814'] },
  { model: 'm815-pro',  slugs: ['m815-pro', 'm815'] },
  { model: 'm816-lit',  slugs: ['m816-lit', 'm816'] },
  { model: 'K503',      slugs: ['sphinx-k503', 'k503'] },
  { model: 'K503 aw',   slugs: ['sphinx-k503', 'k503'] },
  { model: 'K505',      slugs: ['griffon-k505', 'k505'] },
  { model: 'K509P-KS',  slugs: ['k509p-ks', 'k509p'] },
  { model: 'K509P-wS',  slugs: ['k509p-ws', 'k509p'] },
  { model: 'k551',      slugs: ['k551', 'scarab-k551'] },
  { model: 'K552 RGB red sw', slugs: ['redragon-kumara-k552', 'k552'] },
  { model: 'K552 RGB browb sw', slugs: ['redragon-kumara-k552', 'k552'] },
  { model: 'k552-KB Blue Switch', slugs: ['redragon-kumara-k552', 'k552'] },
  { model: 'K607-RGB',  slugs: ['k607-rgb', 'k607'] },
  { model: 'K615P-KBS', slugs: ['k615p-kbs', 'k615p'] },
  { model: 'k629-rgb',  slugs: ['k629-rgb', 'k629'] },
  { model: 'K599-WBS',  slugs: ['deimos-k599-wireless-keyboard', 'k599'] },
  { model: 'K599-WRS',  slugs: ['deimos-k599-wireless-keyboard', 'k599'] },
  { model: 'K661 WGY',  slugs: ['k661-wgy', 'k661'] },
  { model: 'H260',      slugs: ['hylas-h260', 'h260'] },
  { model: 'H270',      slugs: ['h270', 'hylas-h270'] },
  { model: 'h315',      slugs: ['rebellion-h315', 'h315'] },
  { model: 'H350 RGB',  slugs: ['pandora-h350-gaming-headset', 'h350'] },
  { model: 'H386',      slugs: ['diomedes-h386-pc-gaming-headset', 'h386'] },
  { model: 'H510-fb',   slugs: ['h510-zeus', 'h510'] },
  { model: 'H510RGB',   slugs: ['h510-zeus', 'h510'] },
  { model: 'G711',      slugs: ['g711', 'rift-g710-gaming-controller'] },
  { model: 'G712',      slugs: ['g712', 'saturn-g712'] },
  { model: 'G713',      slugs: ['g713'] },
  { model: 'g808 pro',  slugs: ['g808-pro', 'g808'] },
  { model: 'GS520',     slugs: ['anvil-gs520-gaming-speaker', 'gs520'] },
  { model: 'GMK914',    slugs: ['gmk914-gmk915-monitor-mount-stand', 'gmk914'] },
  { model: 'GMK-913',   slugs: ['gmk-913-universal-multi-monitor-extender', 'gmk913'] },
  { model: 'P037',      slugs: ['p037', 'p012-mouse-pad'] },
  { model: 'S01-5',     slugs: ['s01-5', 'redragon-s101-combo'] },
  { model: 'S101W',     slugs: ['redragon-s101-combo', 's101w'] },
  { model: 'S101-BA',   slugs: ['redragon-s101-combo', 's101'] },
  { model: 'S107',      slugs: ['s107'] },
  { model: 'GCP500',    slugs: ['gcp500'] },
  { model: 'GCP511',    slugs: ['windseeker-gcp512-laptop-cooling-pad', 'gcp511', 'gcp512'] },
  { model: 'GW900 APEX',slugs: ['gw910-1080p-pc-webcam', 'gw900', 'gw800-1080p-webcam'] },
  { model: 'GM100',     slugs: ['gm100', 'seymour-gm100'] },
  { model: 'GM200',     slugs: ['gm200'] },
  { model: 'M601-RGB',  slugs: ['m601-rgb'] },
];

async function getProductImages(slug) {
  try {
    const data = await fetch(`https://redragonshop.com/products/${slug}.json`);
    const json = JSON.parse(data);
    const images = (json.product && json.product.images) || [];
    return images.slice(0, 4).map(i => i.src);
  } catch(e) {
    return [];
  }
}

async function getDownloads(slug) {
  try {
    const data = await fetch(`https://redragonshop.com/blogs/product-download/${slug}`);
    const exeMatches = data.match(/cdn\.shopify\.com\/s\/files\/1\/0012\/4957\/4961\/files\/[A-Za-z0-9_%.-]+\.(exe|rar|zip)\?v=[0-9]+/gi) || [];
    const pdfMatches = data.match(/cdn\.shopify\.com\/s\/files\/1\/0012\/4957\/4961\/files\/[A-Za-z0-9_%.-]+\.pdf\?v=[0-9]+/gi) || [];
    return {
      software: exeMatches.length > 0 ? 'https://' + exeMatches[0] : null,
      manual: pdfMatches.length > 0 ? 'https://' + pdfMatches[0] : null
    };
  } catch(e) {
    return { software: null, manual: null };
  }
}

async function main() {
  const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));
  const updates = {};

  console.log('=== FETCHING CDN IMAGES ===');
  for (const item of PRODUCT_MAP) {
    await sleep(3000);
    console.log(`Fetching images: ${item.slug}`);
    const images = await getProductImages(item.slug);
    if (images.length > 0) {
      console.log(`  Got ${images.length} images`);
      for (const model of item.models) {
        if (!updates[model]) updates[model] = {};
        updates[model].images = images;
      }
    } else {
      console.log(`  No images found`);
    }
  }

  console.log('\n=== FETCHING DOWNLOADS ===');
  const tried = new Set();
  for (const item of DOWNLOAD_MAP) {
    const modelUpdates = updates[item.model] || {};
    for (const slug of item.slugs) {
      if (tried.has(slug)) {
        // Still apply cached result if we have it
        continue;
      }
      await sleep(3000);
      console.log(`Fetching downloads: ${slug} (for ${item.model})`);
      const { software, manual } = await getDownloads(slug);
      tried.add(slug);
      if (software || manual) {
        console.log(`  SW: ${software ? software.split('/').pop().split('?')[0] : '-'}`);
        console.log(`  MAN: ${manual ? manual.split('/').pop().split('?')[0] : '-'}`);
        if (software && !modelUpdates.software) modelUpdates.software = software;
        if (manual && !modelUpdates.manual) modelUpdates.manual = manual;
        updates[item.model] = modelUpdates;
        break; // Found data, stop trying other slugs
      } else {
        console.log(`  No downloads found`);
      }
    }
  }

  console.log('\n=== APPLYING UPDATES ===');
  let updated = 0;
  d.forEach(p => {
    const id = p.model || p.id || '';
    const u = updates[id];
    if (u) {
      if (u.images && u.images.length > 0) {
        p.images = u.images;
        console.log(`  Images updated: ${id}`);
      }
      if (u.software && !p.softwareUrl) {
        p.softwareUrl = u.software;
        console.log(`  SW added: ${id}`);
      }
      if (u.manual && !p.manualUrl) {
        p.manualUrl = u.manual;
        console.log(`  MAN added: ${id}`);
      }
      updated++;
    }
  });

  fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
  console.log(`\nUpdated ${updated} product groups. Saved.`);
  fs.writeFileSync('fetch_updates.json', JSON.stringify(updates, null, 2));
  console.log('Updates saved to fetch_updates.json for review.');
}

main().catch(console.error);
