const fs = require('fs');

function extract(html) {
  // More permissive pattern
  const pat = /https?:\/\/cdn\.shopify\.com\/s\/files\/[^"<>\s]+/g;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) {
    const url = m[0].split('"')[0].split("'")[0].split('<')[0].split('>')[0];
    if (/\.(exe|rar|zip|pdf)/i.test(url)) {
      found.add(url);
    }
  }
  return [...found];
}

const html1 = fs.readFileSync('pages_software.html', 'utf8');
const html2 = fs.readFileSync('pages_software-download.html', 'utf8');

// Write all URLs to files for inspection
const urls1 = extract(html1);
const urls2 = extract(html2);

console.log('redragonshop.com count:', urls1.length);
console.log('redragon.com count:', urls2.length);

// Filter for products we care about
const MODELS = ['K506','K539','K550','K551','K607','K615','K629','K661','K685','K599',
                'K509','K503','K502','K505','M601','M602','M607','M609','M617','M655',
                'M694','M701','M703','M723','M725','M814','M815','M816','M801','M901',
                'H270','H350','H386','S107','GW','GCP'];

console.log('\n=== redragonshop.com - relevant URLs ===');
urls1.filter(u => MODELS.some(m => u.toUpperCase().includes(m))).forEach(u => console.log(u));

console.log('\n=== redragon.com - relevant URLs ===');
urls2.filter(u => MODELS.some(m => u.toUpperCase().includes(m))).forEach(u => console.log(u));

// Also show full lists
fs.writeFileSync('all_sw_urls_redragonshop.txt', urls1.join('\n'));
fs.writeFileSync('all_sw_urls_redragon.txt', urls2.join('\n'));
console.log('\nFull lists saved to all_sw_urls_*.txt');
