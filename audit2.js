const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));
console.log('Total:', d.length);

const noSW = d.filter(p => !p.softwareUrl);
const noMAN = d.filter(p => !p.manualUrl);
const noIMG = d.filter(p => !p.images || p.images.length === 0);

console.log('No SW:', noSW.length, '| No MAN:', noMAN.length, '| No IMG:', noIMG.length);

console.log('\n=== NO SOFTWARE ===');
noSW.forEach(p => console.log(' ', p.model||p.id, '-', p.category));

console.log('\n=== NO MANUAL ===');
noMAN.forEach(p => console.log(' ', p.model||p.id, '-', p.category));

console.log('\n=== NO IMAGE ===');
noIMG.forEach(p => console.log(' ', p.model||p.id, '-', p.category));
