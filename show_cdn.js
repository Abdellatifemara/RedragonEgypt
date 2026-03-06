const d = JSON.parse(require('fs').readFileSync('data/products.json','utf8'));
const hasCDN = d.filter(p => p.images && p.images.length > 0 && p.images.every(i => i.startsWith('http')));
console.log('Products WITH CDN images:', hasCDN.length);
hasCDN.forEach(p => {
  console.log((p.model||p.id), ':', p.images[0].split('?')[0].split('/').pop());
});
