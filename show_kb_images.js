const d = require('./data/products.json');
const keyboards = d.filter(p => p.category === 'Keyboard');
keyboards.forEach(p => {
  console.log((p.model || p.id) + ':', JSON.stringify(p.images || []));
});
