const d = require('./data/products.json');
console.log('=== Products with LOCAL (non-CDN) images ===');
d.forEach(p => {
  const imgs = (p.images || []).filter(i => i && !i.startsWith('http'));
  if (imgs.length > 0) {
    console.log((p.model || p.id) + ' [' + p.category + ']:', imgs.join(', '));
  }
});

console.log('\n=== Products with NO images at all ===');
d.forEach(p => {
  if (!p.images || p.images.length === 0) {
    console.log((p.model || p.id) + ' [' + p.category + ']');
  }
});
