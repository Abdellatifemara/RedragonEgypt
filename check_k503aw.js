const d = require('./data/products.json');
const p = d.find(x => (x.model||x.id) === 'K503 aw');
console.log(JSON.stringify(p, null, 2));
