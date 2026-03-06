// Add new products from the PDF (not yet in products.json)
const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data/products.json','utf8'));

const NEW_PRODUCTS = [

  // === NEW MICE ===
  {
    id: 'M990',
    model: 'M990',
    category: 'Mouse',
    specs: 'Redragon M990 Legend Chroma MMO Gaming Mouse, 32000 DPI, 23 Programmable Buttons, 16 Side Macro Keys',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/LegendChromaM990-RGBGamingMouse_2.png?v=1762460712',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonM990MMOGamingMouse_3.png?v=1687156732',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonM990MMOGamingMouse_7.jpg?v=1687156732',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonM990MMOGamingMouse_1.jpg?v=1687156732'
    ],
    has_image: true,
    features: [
      '32000 DPI optical sensor with 5 redefinable DPI levels (1000/2000/4000/8000/16000)',
      '23 programmable buttons with 16 side macro keys for full MMO customization',
      'Ergonomic design with 8-piece weight tuning set for personalized feel',
      'Full RGB lighting with 16.8M color customization',
      'Software configurable DPI range 100-32000',
      'Gold-plated USB connector for optimal signal transfer',
      '1.8m braided cable for durability and reliability'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '100 - 32000',
      'Buttons': '23 Programmable',
      'Polling Rate': '1000Hz',
      'Side Macro Keys': '16',
      'Weight Tuning': '8-piece set',
      'RGB Lighting': '16.8M Colors',
      'Cable Length': '1.8m Braided',
      'Connectivity': 'USB Wired'
    },
    softwareUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/M990-RGB-1_REDRAGON_Gaming_Mouse_20220323_V1052.rar?v=1684910078',
    manualUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/LEGEND_CHROMA_M990_User_Manual.pdf?v=1711443396'
  },

  {
    id: 'M801',
    model: 'M801',
    category: 'Mouse',
    specs: 'Redragon M801 Mammoth MMO Gaming Mouse, 16000 DPI, 9 Programmable Buttons, RGB LED Backlit',
    price: 0,
    images: ['M801.jpg'],
    has_image: true,
    features: [
      '16000 DPI adjustable optical sensor with 5 DPI settings',
      '9 programmable buttons with on-board memory for up to 5 profiles',
      'Full RGB backlit with 16.8M color options',
      '500 IPS tracking speed, 30G acceleration',
      'Ergonomic right-handed design for comfort during extended sessions',
      '1.8m braided USB cable with gold-plated connector'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '1000 / 2000 / 4000 / 7200 / 16000',
      'Buttons': '9 Programmable',
      'Polling Rate': '125/250/500/1000Hz',
      'IPS': '500',
      'Acceleration': '30G',
      'Cable Length': '1.8m Braided',
      'RGB Lighting': '16.8M Colors',
      'Connectivity': 'USB Wired'
    }
  },

  {
    id: 'M901',
    model: 'M901',
    category: 'Mouse',
    specs: 'Redragon M901 Perdition V2 MMO Gaming Mouse, 24000 DPI, 19 Programmable Buttons, Weight Tuning',
    price: 0,
    images: ['M901.jpg'],
    has_image: true,
    features: [
      '24000 DPI high-precision laser sensor',
      '19 programmable buttons for full MMO control',
      'On-board memory for up to 5 gaming profiles',
      '8-piece weight tuning system for personalized feel',
      'Full RGB LED with 16.8M colors and multiple lighting modes',
      'Ergonomic design with textured grip for comfort during long sessions'
    ],
    specifications: {
      'Sensor': 'Laser',
      'DPI Range': '200 - 24000',
      'Buttons': '19 Programmable',
      'Polling Rate': '1000Hz',
      'Weight Tuning': '8-piece set',
      'RGB Lighting': '16.8M Colors',
      'Cable Length': '1.8m Braided',
      'Connectivity': 'USB Wired'
    }
  },

  {
    id: 'M901P-KS',
    model: 'M901P-KS',
    category: 'Mouse',
    specs: 'Redragon M901P-KS Perdition Pro Gaming Mouse, 32000 DPI, 19 Programmable Buttons, Red Switch',
    price: 0,
    images: ['M901P-KS.jpg'],
    has_image: true,
    features: [
      '32000 DPI optical sensor with adjustable DPI settings',
      '19 programmable buttons for complete customization',
      'Red mechanical switches for satisfying click feedback',
      '8-piece weight tuning set for personalized balance',
      'Full RGB LED backlit with 16.8M colors',
      'On-board memory stores up to 5 gaming profiles'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '200 - 32000',
      'Buttons': '19 Programmable',
      'Switches': 'Red Mechanical',
      'Polling Rate': '1000Hz',
      'Weight Tuning': '8-piece set',
      'RGB Lighting': '16.8M Colors',
      'Cable Length': '1.8m Braided',
      'Connectivity': 'USB Wired'
    }
  },

  {
    id: 'M901P-WS',
    model: 'M901P-WS',
    category: 'Mouse',
    specs: 'Redragon M901P-WS Perdition Pro Gaming Mouse, 32000 DPI, 19 Programmable Buttons, White Switch',
    price: 0,
    images: ['M901P-WS.jpg'],
    has_image: true,
    features: [
      '32000 DPI optical sensor with adjustable DPI settings',
      '19 programmable buttons for complete customization',
      'White mechanical switches for smooth, quiet clicks',
      '8-piece weight tuning set for personalized balance',
      'Full RGB LED backlit with 16.8M colors',
      'On-board memory stores up to 5 gaming profiles'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '200 - 32000',
      'Buttons': '19 Programmable',
      'Switches': 'White Mechanical',
      'Polling Rate': '1000Hz',
      'Weight Tuning': '8-piece set',
      'RGB Lighting': '16.8M Colors',
      'Cable Length': '1.8m Braided',
      'Connectivity': 'USB Wired'
    }
  },

  {
    id: 'M903P',
    model: 'M903P',
    category: 'Mouse',
    specs: 'Redragon M903P Gaming Mouse, 32000 DPI, RGB LED, Ergonomic Wired Gaming Mouse',
    price: 0,
    images: ['M903P.jpg'],
    has_image: true,
    features: [
      '32000 DPI high-precision optical sensor',
      'Programmable buttons with on-board profile memory',
      'Full RGB LED backlit with 16.8M color customization',
      'Ergonomic right-handed design for extended comfort',
      'Smooth PTFE feet pads for frictionless gliding',
      '1.8m braided USB cable'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '200 - 32000',
      'Polling Rate': '1000Hz',
      'RGB Lighting': '16.8M Colors',
      'Cable Length': '1.8m Braided',
      'Connectivity': 'USB Wired'
    }
  },

  {
    id: 'M915WL-RGB',
    model: 'M915WL-RGB',
    category: 'Mouse',
    specs: 'Redragon M915WL-RGB Wireless Gaming Mouse, 32000 DPI, 6 Programmable Buttons, RGB Backlit',
    price: 0,
    images: ['M915WL-RGB.jpg'],
    has_image: true,
    features: [
      '32000 DPI optical sensor with adjustable settings',
      '6 programmable buttons for quick in-game actions',
      'Wireless 2.4GHz connection with up to 40 hour battery life',
      'USB-C fast charging — 10 min charge for 2 hours of play',
      'Full RGB LED with 16.8M colors',
      'Ergonomic design for comfort during long sessions'
    ],
    specifications: {
      'Sensor': 'Optical',
      'DPI Range': '200 - 32000',
      'Buttons': '6 Programmable',
      'Polling Rate': '1000Hz',
      'Connectivity': '2.4GHz Wireless / USB-C Wired',
      'Battery Life': '40 hours',
      'Charging': 'USB-C Fast Charge',
      'RGB Lighting': '16.8M Colors'
    }
  },

  // === NEW KEYBOARDS ===
  {
    id: 'K506',
    model: 'K506',
    category: 'Keyboard',
    specs: 'Redragon K506 Centaur Membrane Wired Gaming Keyboard, RGB Backlit, Multimedia Keys',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK506Claviergamingfilaireamembrane_1.png?v=1758853004',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK506Claviergamingfilaireamembrane_2.png?v=1758853066',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK506Claviergamingfilaireamembrane_2.jpg?v=1758853066',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK506Claviergamingfilaireamembrane_3.jpg?v=1758853004'
    ],
    has_image: true,
    features: [
      'Full-size 104-key membrane gaming keyboard with tactile feedback',
      'Customizable RGB backlit with multiple lighting modes and quick-key shortcuts',
      'Durable metal top plate for stability and long-term use',
      'Multimedia hotkeys for easy media control',
      'Anti-ghosting and conflict-free for precise input',
      'USB passthrough port for convenient device connection'
    ],
    specifications: {
      'Type': 'Membrane',
      'Keys': '104',
      'Backlit': 'RGB 16.8M Colors',
      'Anti-Ghosting': 'Yes',
      'Interface': 'USB Wired',
      'Cable Length': '1.8m'
    }
  },

  {
    id: 'K515 RGB',
    model: 'K515 RGB',
    category: 'Keyboard',
    specs: 'Redragon K515 Shiva RGB Membrane Gaming Keyboard, Full-Size 104 Keys, 4 Macro Keys',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/SHIVAK515MembraneGamingKeyboard_2_ef94fa2a-efca-446e-8e36-a812e69eea8f.png?v=1762464358',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/SHIVAK515MembraneGamingKeyboard_1.jpg?v=1720579290',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/SHIVAK515MembraneGamingKeyboard_8.jpg?v=1720579290',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/SHIVAK515MembraneGamingKeyboard_6.jpg?v=1720579290'
    ],
    has_image: true,
    features: [
      '4 onboard macro keys (G1-G4) programmable without additional software',
      'Full dynamic RGB backlighting with 7 pre-set lighting modes + 6 custom slots',
      'Durable aluminum metal top plate for stability',
      'Full-size 104-key layout with multimedia hotkeys',
      'Anti-ghosting for precise gaming input',
      'Floating key design with dramatic RGB illumination'
    ],
    specifications: {
      'Type': 'Membrane',
      'Keys': '104 + 4 Macro',
      'Backlit': 'Full RGB 16.8M Colors',
      'Anti-Ghosting': 'Yes',
      'Top Plate': 'Aluminum',
      'Interface': 'USB Wired',
      'Cable Length': '1.8m'
    }
  },

  {
    id: 'K516',
    model: 'K516',
    category: 'Keyboard',
    specs: 'Redragon K516 Shiva TKL RGB Membrane Wired Gaming Keyboard, 80% Layout, 4 Macro Keys',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516ShivaTKLWiredRGBMembraneGamingKeyboard_1.png?v=1762467410',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516ShivaTKLWiredRGBMembraneGamingKeyboard_1.jpg?v=1744361752',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516ShivaTKLWiredRGBMembraneGamingKeyboard_2.jpg?v=1744361752',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516ShivaTKLWiredRGBMembraneGamingKeyboard_5.jpg?v=1744361752'
    ],
    has_image: true,
    features: [
      '4 onboard macro keys (G1-G4) programmable on the fly',
      '80% TKL compact layout — saves desk space for wider mouse movement',
      'Full dynamic RGB backlighting with multiple lighting modes',
      'Durable aluminum top plate for a premium feel',
      'Anti-ghosting for conflict-free gaming input',
      'USB-C wired connection for reliable performance'
    ],
    specifications: {
      'Type': 'Membrane',
      'Layout': '80% TKL',
      'Keys': '87 + 4 Macro',
      'Backlit': 'Full RGB 16.8M Colors',
      'Anti-Ghosting': 'Yes',
      'Top Plate': 'Aluminum',
      'Interface': 'USB-C Wired',
      'Cable Length': '1.8m'
    },
    softwareUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/Redragon_K516-RGB_setup_1.0.4.2.exe?v=1744361634',
    manualUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/K516_User_Manual.pdf?v=1744361631'
  },

  {
    id: 'K516 PRO',
    model: 'K516 PRO',
    category: 'Keyboard',
    specs: 'Redragon K516 PRO Shiva TKL RGB Wireless Membrane Gaming Keyboard, Tri-Mode, 80% Layout',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516PROShivaTKLRGBWirelessMembraneGamingKeyboard_1.png?v=1762467408',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516PROShivaTKLRGBWirelessMembraneGamingKeyboard_2.png?v=1744357715',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516PROShivaTKLRGBWirelessMembraneGamingKeyboard_3.jpg?v=1744357715',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK516PROShivaTKLRGBWirelessMembraneGamingKeyboard_4.jpg?v=1744357715'
    ],
    has_image: true,
    features: [
      '3-mode connection: USB-C wired, Bluetooth 3.0/5.0, and 2.4GHz wireless',
      '4 onboard macro keys (G1-G4) programmable without software',
      '80% TKL compact layout — more desk space for mouse movement',
      'Full dynamic RGB backlighting with multiple lighting modes',
      'Durable aluminum top plate for a premium, sturdy feel',
      'Long-lasting battery for extended wireless gaming sessions'
    ],
    specifications: {
      'Type': 'Membrane',
      'Layout': '80% TKL',
      'Keys': '87 + 4 Macro',
      'Backlit': 'Full RGB 16.8M Colors',
      'Connectivity': 'USB-C / Bluetooth 3.0/5.0 / 2.4GHz Tri-Mode',
      'Anti-Ghosting': 'Yes',
      'Top Plate': 'Aluminum',
      'Compatibility': 'Windows / macOS / Android / iOS'
    },
    softwareUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/Redragon_K516RGB-PRO_setup_1.0.4.3.exe?v=1744360366',
    manualUrl: 'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/Redragon_K516_PRO_User_Manual.pdf?v=1744360363'
  },

  {
    id: 'K539',
    model: 'K539',
    category: 'Keyboard',
    specs: 'Redragon K539 Anubis TKL Tri-Mode Wireless Mechanical Gaming Keyboard, Bluetooth/2.4GHz/USB-C',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/products/K539TKLMechanicalKeyboard_7.png?v=1762457859',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/products/K539TKLMechanicalKeyboard_10.png?v=1635820460',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/products/K539TKLMechanicalKeyboard_6.png?v=1635820461',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/products/K539TKLMechanicalKeyboard_5.png?v=1635820458'
    ],
    has_image: true,
    features: [
      'Tri-mode connection: USB-C wired, Bluetooth 3.0/5.0 & 2.4GHz wireless',
      'True mechanical switches for responsive tactile feedback',
      'TKL 87-key compact layout for wider mouse space',
      'Full per-key RGB LED backlighting with dynamic effects',
      'Low-profile compact design perfect for home, office, and gaming',
      'N-key rollover for conflict-free simultaneous keypresses'
    ],
    specifications: {
      'Type': 'Mechanical',
      'Layout': 'TKL 87-Key',
      'Connectivity': 'USB-C / Bluetooth 3.0/5.0 / 2.4GHz',
      'Backlit': 'Per-Key RGB',
      'N-Key Rollover': 'Yes',
      'Compatibility': 'Windows / macOS / Android / iOS'
    }
  },

  {
    id: 'K550',
    model: 'K550',
    category: 'Keyboard',
    specs: 'Redragon K550 Yama Full-Size Wired RGB Mechanical Gaming Keyboard, 12 Macro Keys, Aluminum Top Plate',
    price: 0,
    images: [
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonYAMAK550WiredAluminumRGBGamingKeyboard_2.png?v=1762464298',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonYAMAK550WiredAluminumRGBGamingKeyboard_4.png?v=1719905415',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK550RGBGamingKeyboard_7.jpg?v=1719905415',
      'https://cdn.shopify.com/s/files/1/0012/4957/4961/files/RedragonK550RGBGamingKeyboard_2.jpg?v=1719905415'
    ],
    has_image: true,
    features: [
      '12 dedicated onboard macro keys (G1-G12) for instant macro execution',
      'Solid aluminum metal top plate with brushed surface for premium durability',
      'Full RGB backlit with dynamic lighting effects',
      'Full-size 104-key layout with multimedia hotkeys',
      'Mechanical switches for satisfying tactile feedback',
      'Anti-ghosting and N-key rollover for conflict-free gaming'
    ],
    specifications: {
      'Type': 'Mechanical',
      'Layout': 'Full-Size 104-Key',
      'Macro Keys': '12 Dedicated (G1-G12)',
      'Top Plate': 'Brushed Aluminum',
      'Backlit': 'Full RGB 16.8M Colors',
      'N-Key Rollover': 'Yes',
      'Interface': 'USB Wired',
      'Cable Length': '1.8m'
    }
  },

  {
    id: 'KG010-KN',
    model: 'KG010-KN',
    category: 'Keyboard',
    specs: 'Redragon KG010 Keyboard Gaming, Single-Hand Gaming Keypad, RGB Backlit, Black',
    price: 0,
    images: ['KG010-KN.jpg'],
    has_image: true,
    features: [
      'Compact single-hand gaming keypad for FPS and MOBA gaming',
      'RGB backlit with multiple color effect settings',
      'Ergonomic design with adjustable wrist rest',
      'Programmable keys with macro recording support',
      'Compatible with Windows/Mac, plug-and-play USB connection'
    ],
    specifications: {
      'Type': 'Gaming Keypad',
      'Color': 'Black',
      'Backlit': 'RGB 16.8M Colors',
      'Interface': 'USB Wired',
      'Compatibility': 'Windows / macOS'
    }
  },

  {
    id: 'KG010-WN',
    model: 'KG010-WN',
    category: 'Keyboard',
    specs: 'Redragon KG010 Keyboard Gaming, Single-Hand Gaming Keypad, RGB Backlit, White',
    price: 0,
    images: ['KG010-WN.jpg'],
    has_image: true,
    features: [
      'Compact single-hand gaming keypad for FPS and MOBA gaming',
      'RGB backlit with multiple color effect settings',
      'Ergonomic design with adjustable wrist rest',
      'White color variant for aesthetic setups',
      'Programmable keys with macro recording support'
    ],
    specifications: {
      'Type': 'Gaming Keypad',
      'Color': 'White',
      'Backlit': 'RGB 16.8M Colors',
      'Interface': 'USB Wired',
      'Compatibility': 'Windows / macOS'
    }
  },

  {
    id: 'K535',
    model: 'K535',
    category: 'Keyboard',
    specs: 'Redragon K535 Apas TKL Wired RGB Mechanical Gaming Keyboard, Linear Red Switches',
    price: 0,
    images: ['K535.jpg'],
    has_image: true,
    features: [
      'TKL 87-key compact layout for wider mouse movement',
      'Linear red mechanical switches for smooth, fast keystrokes',
      'Full per-key RGB LED backlighting with dynamic lighting effects',
      'USB-C detachable cable for easy portability',
      'N-key rollover and anti-ghosting for conflict-free gaming',
      'Durable aluminum top plate for stability'
    ],
    specifications: {
      'Type': 'Mechanical',
      'Switches': 'Linear Red',
      'Layout': 'TKL 87-Key',
      'Backlit': 'Per-Key RGB 16.8M Colors',
      'N-Key Rollover': 'Yes',
      'Interface': 'USB-C Wired',
      'Top Plate': 'Aluminum'
    }
  }

];

// Check for duplicates before adding
let added = 0;
let skipped = 0;
NEW_PRODUCTS.forEach(np => {
  const exists = d.find(p => (p.model||p.id) === np.model);
  if (exists) {
    console.log('SKIP (already exists):', np.model);
    skipped++;
  } else {
    d.push(np);
    console.log('ADDED:', np.model);
    added++;
  }
});

fs.writeFileSync('data/products.json', JSON.stringify(d, null, 2));
console.log(`\nAdded ${added} new products, skipped ${skipped} duplicates. Total: ${d.length}`);
