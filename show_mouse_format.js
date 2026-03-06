const d = require('./data/products.json');
const p = d.find(x => (x.model||x.id) === 'M690 PRO');
console.log(JSON.stringify(p, null, 2));
