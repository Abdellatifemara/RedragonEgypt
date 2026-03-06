const d = JSON.parse(require('fs').readFileSync('data/products.json','utf8'));
const needCDN = d.filter(p => {
  const imgs = p.images || [];
  return imgs.length === 0 || !imgs.every(i => i.startsWith('http'));
});
console.log('Products needing CDN images:', needCDN.length);
needCDN.forEach(p => {
  console.log((p.model||p.id), ':', JSON.stringify(p.images||[]).slice(0,120));
});
