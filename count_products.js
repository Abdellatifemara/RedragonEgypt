const d = require('./data/products.json');
console.log('Total products:', d.length);
const seen = {};
const dups = [];
d.forEach(p => {
  const id = p.model || p.id;
  if (seen[id]) dups.push(id);
  seen[id] = true;
});
console.log('Duplicates:', dups.length > 0 ? dups.join(', ') : 'None');
const cats = {};
d.forEach(p => {
  const cat = p.category || 'Other';
  if (!cats[cat]) cats[cat] = [];
  cats[cat].push(p.model || p.id);
});
Object.entries(cats).forEach(([cat, items]) => console.log(cat + ' (' + items.length + '):', items.join(', ')));

// Check for bad images (non-CDN or suspicious)
const badImgs = d.filter(p => p.images && p.images.some(img => img && !img.startsWith('http')));
console.log('\nProducts with relative image paths:', badImgs.map(p => p.model || p.id).join(', ') || 'None');
