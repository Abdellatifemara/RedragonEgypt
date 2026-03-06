const fs = require('fs');

function extract(html) {
  const pat = /https:\/\/cdn\.shopify\.com\/s\/files\/[^\s"'<>)]+\.(exe|rar|zip|pdf)[^\s"'<>)]*/g;
  const found = new Set();
  let m;
  while ((m = pat.exec(html)) !== null) {
    found.add(m[0].replace(/[,;'"]+$/, ''));
  }
  return [...found];
}

const KEYWORDS = ['K50','K51','K52','K53','K54','K55','K56','K57','K58','K59',
                  'K60','K61','K62','K63','K64','K65','K66','K67','K68','K69',
                  'K70','K71','K72',
                  'M60','M61','M62','M63','M64','M65','M66','M67','M68','M69',
                  'M70','M71','M72','M73','M74','M75','M76','M77','M78','M79',
                  'M80','M81','M82','M83','M84','M85','M86','M87','M88','M89',
                  'M90','M91','M92','M93','M94','M95',
                  'S10','S11','S12','H2','H3','H5','GW','GCP','GS5'];

const html1 = fs.readFileSync('pages_software.html', 'utf8');
const html2 = fs.readFileSync('pages_software-download.html', 'utf8');

console.log('=== redragonshop.com/pages/software ===');
extract(html1).filter(u => KEYWORDS.some(k => u.includes(k))).forEach(u => {
  console.log(u);
});

console.log('\n=== redragon.com/pages/software-download ===');
extract(html2).filter(u => KEYWORDS.some(k => u.includes(k))).forEach(u => {
  console.log(u);
});
