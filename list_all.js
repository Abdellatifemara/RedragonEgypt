const d = require('./data/products.json');
const byCategory = {};
d.forEach(p => {
  const cat = p.category || 'Unknown';
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(p.model || p.id);
});
Object.entries(byCategory).forEach(([cat, models]) => {
  console.log(`\n${cat} (${models.length}):`);
  models.forEach(m => console.log(' ', m));
});
