const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

const CDN2F = 'https://cdn.shopify.com/s/files/1/0655/1289/8735/files/';
const CDN_IGABIBA = 'https://cdn.shopify.com/s/files/1/0516/3873/0931/files/';
const CDN_COMP = 'https://cdn.shopify.com/s/files/1/0622/7050/5109/files/';
const CDN_ELY = 'https://cdn.shopify.com/s/files/1/0718/8001/6103/files/';

// Image URLs (all verified 200)
const IMAGES = {
  'M901P-KS': CDN2F + 'M901P-KS.png?v=1730344158',
  'M901P-WS': CDN2F + 'M901P-KS.png?v=1730344158', // Same product, white variant - use KS image
  'M903P':    CDN_COMP + 'Redragon-M903-Origin-4000-Dpi-Gaming-Mous_02.jpg?v=1695294344',
  'KG010-KN': CDN_ELY + 'REDRAGON-KG010-Mechanical-Gaming-Keyboard-Brown-Switch-White-Led-White-Black-Elyamama-37319311720679.jpg?v=1764074745',
  'KG010-WN': CDN_ELY + 'REDRAGON-KG010-Mechanical-Gaming-Keyboard-Brown-Switch-White-Led-White-Black-Elyamama-37346561622247.jpg?v=1764074745',
  'K535':     CDN_IGABIBA + 'redragon-k535-apas-pro-rgb-wireless-wired-mechanical-keyboard-6950376705358-1207885494.jpg',
};

let updated = 0;
d.forEach(p => {
  const id = p.model || p.id || '';
  const imgUrl = IMAGES[id];
  if (imgUrl) {
    if (!p.images) p.images = [];
    if (p.images.length === 0 || (p.images.length === 1 && !p.images[0].startsWith('http'))) {
      p.images = [imgUrl];
      console.log('IMG set', id, ':', imgUrl.split('/').pop().split('?')[0].substring(0, 50));
      updated++;
    } else {
      // Already has images, just add if not present
      if (!p.images.includes(imgUrl)) {
        p.images.unshift(imgUrl);
        console.log('IMG prepended', id, ':', imgUrl.split('/').pop().split('?')[0].substring(0, 50));
        updated++;
      } else {
        console.log('IMG already present', id);
      }
    }
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log('Updated', updated, 'entries. Saved.');
