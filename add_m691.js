const fs = require('fs');
const FILE = 'C:/Users/pc/Desktop/G/Redragon/clean_deploy/data/products.json';
const d = JSON.parse(fs.readFileSync(FILE, 'utf8'));

// Check not already present
if (d.find(x => (x.model||x.id) === 'M691')) {
  console.log('M691 already exists!'); process.exit(1);
}

// Find index to insert after M690 PRO
const idx = d.findIndex(x => (x.model||x.id) === 'M690 PRO');

const m691 = {
  "id": "M691",
  "model": "M691",
  "category": "Mouse",
  "specs": "Redragon M691 MIST Wireless Gaming Mouse, 4800 DPI Optical Sensor, Ergonomic Design with Thumb Rest, 9 Programmable Buttons, 5 Memory Modes, 2.4G Wireless",
  "price": 649,
  "images": [
    "https://cdn.shopify.com/s/files/1/0858/8878/files/redragon-m691-mist-wireless-gaming-mouse-955.jpg",
    "https://cdn.shopify.com/s/files/1/0858/8878/files/redragon-m691-mist-wireless-gaming-mouse-298.jpg",
    "https://cdn.shopify.com/s/files/1/0858/8878/files/redragon-m691-mist-wireless-gaming-mouse-770.jpg"
  ],
  "has_image": true,
  "features": [
    "4800 DPI optical sensor with 6 adjustable levels (800/1200/1600/2400/3200/4800)",
    "9 programmable buttons with 5 onboard memory modes",
    "2.4GHz wireless connectivity with up to 10m range",
    "Ergonomic right-handed design with dedicated thumb rest",
    "Rapid fire button for competitive gaming",
    "500Hz polling rate for responsive tracking",
    "30 IPS tracking speed",
    "Compatible with Windows PC"
  ],
  "specifications": {
    "Sensor": "Optical",
    "DPI Range": "800 / 1200 / 1600 / 2400 / 3200 / 4800",
    "Buttons": "9 Programmable",
    "Polling Rate": "500Hz",
    "Memory Modes": "5",
    "Connectivity": "2.4GHz Wireless",
    "Wireless Range": "Up to 10m",
    "Tracking Speed": "30 IPS"
  }
};

// Insert after M690 PRO
d.splice(idx + 1, 0, m691);
fs.writeFileSync(FILE, JSON.stringify(d, null, 2));
console.log('M691 added at index', idx + 1);
console.log('Total products:', d.length);
