const d = require('./data/products.json');
const toCheck = ['M806','M908','M990','M691','H210','H312','H720','H991','G710','G812','G815'];
toCheck.forEach(m => {
  const found = d.find(x => (x.model||x.id) === m);
  console.log(m + ':', found ? 'EXISTS' : 'MISSING');
});
