/**
 * home.js — homepage product grid (6 featured) + Three.js hero canvas
 */

import * as THREE from 'three';
import { loadProducts, buildCard, initModal, openModal } from './products.js';

const IMG_BASE = '/site-assets/images/products/';
const FALLBACK  = '/site-assets/images/logo_redragon.png';

/* ── Three.js hero canvas ─────────────────────────────────── */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 4;

  // Circle sprite texture for circular particles
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = 64; spriteCanvas.height = 64;
  const ctx = spriteCanvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0,   'rgba(255,60,60,1)');
  grad.addColorStop(0.4, 'rgba(204,0,0,0.8)');
  grad.addColorStop(1,   'rgba(120,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  const spriteTex = new THREE.CanvasTexture(spriteCanvas);

  // Particle field — red only, circular
  const count = 600;
  const positions = new Float32Array(count * 3);
  const sizes     = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    sizes[i] = Math.random() * 0.06 + 0.015;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const mat = new THREE.PointsMaterial({
    size:           0.06,
    map:            spriteTex,
    color:          0xCC0000,
    transparent:    true,
    opacity:        0.75,
    blending:       THREE.AdditiveBlending,
    depthWrite:     false,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Mouse-reactive point light (red)
  const light = new THREE.PointLight(0xCC0000, 3, 9);
  light.position.set(0, 0, 2);
  scene.add(light);

  // Second red fill light (no gold)
  const light2 = new THREE.PointLight(0x880000, 1.5, 7);
  light2.position.set(-2, 1, 1);
  scene.add(light2);

  // Mouse tracking
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 6;
    my = -(e.clientY / window.innerHeight - 0.5) * 6;
  });

  // Resize
  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  // Animation loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.015;

    // Light follows mouse
    light.position.x += (mx - light.position.x) * 0.06;
    light.position.y += (my - light.position.y) * 0.06;
    light2.position.x = Math.sin(t * 0.35) * 4;
    light2.position.y = Math.cos(t * 0.25) * 3;

    renderer.render(scene, camera);
  }
  animate();
}

/* ── Featured products (6 picks) ─────────────────────────── */
async function initHomeFeatured() {
  const grid = document.getElementById('home-products-grid');
  if (!grid) return;

  initModal();

  let products;
  try {
    products = await loadProducts();
  } catch (e) {
    grid.innerHTML = '<p class="grid-error">Could not load products.</p>';
    return;
  }

  // Pick 1 from each category
  const cats = ['Mouse', 'Keyboard', 'Headset', 'Gamepad', 'Combo', 'Accessories'];
  const featured = cats.map(cat => products.find(p => p.category === cat)).filter(Boolean);

  grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  featured.forEach(p => frag.appendChild(buildCard(p)));
  grid.appendChild(frag);
}

/* ── Boot ────────────────────────────────────────────────── */
function init() {
  initHeroCanvas();
  initHomeFeatured();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
