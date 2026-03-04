/**
 * products.js — shared product logic for website2
 * Handles: fetch, render cards, filter, modal
 */

const IMG_BASE = '/site-assets/images/products/';
const FALLBACK = '/site-assets/images/logo_redragon.png';

/* ── Fetch products ──────────────────────────────────────── */
async function loadProducts() {
  const r = await fetch('/data/products.json');
  if (!r.ok) throw new Error('Failed to load products.json');
  return r.json();
}

/* ── Build a single product card ─────────────────────────── */
function buildCard(product) {
  const img = product.images && product.images.length
    ? IMG_BASE + product.images[0]
    : FALLBACK;

  const card = document.createElement('article');
  card.className = 'prod-card glass-card';
  card.dataset.category = product.category;
  card.innerHTML = `
    <div class="prod-img-wrap">
      <div class="prod-spotlight"></div>
      <img
        class="prod-img"
        src="${img}"
        alt="${product.name || product.model}"
        loading="lazy"
        onerror="this.src='${FALLBACK}'"
      />
      <div class="prod-img-glow"></div>
    </div>
    <div class="prod-info">
      <p class="prod-cat">${product.category}</p>
      <h3 class="prod-name">${product.name || product.model}</h3>
      <p class="prod-model">${product.model}</p>
      <button class="prod-details-btn btn-ghost btn-sm">View Details</button>
    </div>
  `;

  card.querySelector('.prod-details-btn').addEventListener('click', () => openModal(product));
  card.addEventListener('click', e => {
    if (!e.target.closest('.prod-details-btn')) openModal(product);
  });

  return card;
}

/* ── Modal ───────────────────────────────────────────────── */
let currentProduct = null;

function openModal(product) {
  currentProduct = product;
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;

  const img = product.images && product.images.length
    ? IMG_BASE + product.images[0]
    : FALLBACK;

  overlay.querySelector('#modal-img').src = img;
  overlay.querySelector('#modal-img').alt = product.name || product.model;
  overlay.querySelector('#modal-img').onerror = function() { this.src = FALLBACK; };
  overlay.querySelector('#modal-category').textContent = product.category;
  overlay.querySelector('#modal-title').textContent = product.name || product.model;
  overlay.querySelector('#modal-model').textContent = `Model: ${product.model}`;

  const priceEl = overlay.querySelector('#modal-price');
  if (priceEl) priceEl.textContent = '';

  // Features
  const featList = overlay.querySelector('#modal-features-list');
  featList.innerHTML = '';
  if (product.features && product.features.length) {
    product.features.forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      featList.appendChild(li);
    });
    overlay.querySelector('#modal-features').style.display = '';
  } else {
    overlay.querySelector('#modal-features').style.display = 'none';
  }

  // Specs table
  const specsTable = overlay.querySelector('#modal-specs-table');
  specsTable.innerHTML = '';
  if (product.specifications && Object.keys(product.specifications).length) {
    Object.entries(product.specifications).forEach(([k, v]) => {
      if (v) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="spec-key">${k}</td><td class="spec-val">${v}</td>`;
        specsTable.appendChild(tr);
      }
    });
    overlay.querySelector('#modal-specs').style.display = '';
  } else {
    overlay.querySelector('#modal-specs').style.display = 'none';
  }

  overlay.setAttribute('aria-hidden', 'false');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  currentProduct = null;
}

function initModal() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && currentProduct) closeModal();
  });
}

/* ── Products page init ───────────────────────────────────── */
async function initProductsPage() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  initModal();

  let products;
  try {
    products = await loadProducts();
  } catch (e) {
    grid.innerHTML = '<p class="grid-error">Could not load products. Please refresh.</p>';
    return;
  }

  // Render all cards
  grid.innerHTML = '';
  const fragment = document.createDocumentFragment();
  products.forEach(p => fragment.appendChild(buildCard(p)));
  grid.appendChild(fragment);

  // Read ?cat= from URL and pre-activate filter
  const urlCat = new URLSearchParams(window.location.search).get('cat');
  if (urlCat) {
    const btn = document.querySelector(`.filter-btn[data-filter="${urlCat}"]`);
    if (btn) btn.click();
  }

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      grid.querySelectorAll('.prod-card').forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductsPage);
} else {
  initProductsPage();
}

export { loadProducts, buildCard, openModal, closeModal, initModal };
