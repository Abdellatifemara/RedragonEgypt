const data = JSON.parse(require('fs').readFileSync('data/products.json','utf8'));
const needCDN = [], noSW = [], noMan = [];
data.forEach(p => {
  const allCDN = p.images && p.images.length > 0 && p.images.every(i => i.startsWith('http'));
  if (!allCDN) needCDN.push(p.model);
  if (!p.softwareUrl) noSW.push(p.model);
  if (!p.manualUrl) noMan.push(p.model);
});
console.log('TOTAL:', data.length);
console.log('NEED_CDN(' + needCDN.length + '): ' + needCDN.join(' | '));
console.log('NO_SW(' + noSW.length + '): ' + noSW.join(' | '));
console.log('NO_MAN(' + noMan.length + '): ' + noMan.join(' | '));
