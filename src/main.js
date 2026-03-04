/**
 * Website 2 — main.js
 * Design system: ui-ux-pro-max repo output
 * Pattern: Horizontal Scroll Journey (GSAP ScrollTrigger pin)
 * Style: Liquid Glass
 * Animations: 400-600ms fluid curves (repo spec)
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ── Lenis smooth scroll ─────────────────────────────────── */
const lenis = new Lenis({
  duration: 1.8,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ── Custom cursor — disabled (performance) ──────────────── */
function initCursor() { /* disabled */ }

/* ── Nav scroll ──────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  lenis.on('scroll', ({ scroll }) => nav.classList.toggle('scrolled', scroll > 40));

  const hamburger = document.querySelector('.hamburger');
  const drawer    = document.querySelector('.drawer');
  const overlay   = document.querySelector('.drawer-overlay');
  if (!hamburger || !drawer) return;

  let open = false;
  const toggle = s => {
    open = s;
    hamburger.classList.toggle('open', open);
    drawer.classList.toggle('open', open);
    overlay?.classList.toggle('open', open);
    lenis[open ? 'stop' : 'start']();
  };
  hamburger.addEventListener('click',   () => toggle(!open));
  overlay?.addEventListener('click',    () => toggle(false));
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => e.key === 'Escape' && open && toggle(false));
}

/* ── Hero entrance — fluid 400-600ms (repo spec) ─────────── */
function initHeroAnimation() {
  const tl = gsap.timeline({ delay: 0.2 });
  const ease = 'power3.out';

  tl.to('.intro-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease })
    .to('.intro-title',   { opacity: 1, y: 0, duration: 0.8, ease }, '-=0.3')
    .to('.intro-sub',     { opacity: 1, y: 0, duration: 0.6, ease }, '-=0.4')
    .to('.intro-actions', { opacity: 1, y: 0, duration: 0.5, ease }, '-=0.3');
}

/* ── HORIZONTAL SCROLL JOURNEY (core repo pattern) ──────── */
function initHorizontalJourney() {
  const wrapper = document.querySelector('.journey-wrapper');
  const track   = document.querySelector('.journey-track');
  const panels  = gsap.utils.toArray('.cat-panel');
  const progress = document.querySelector('.journey-progress');
  const progressBar = document.querySelector('.journey-progress-bar');
  const counter  = document.querySelector('.journey-counter');
  const dots     = gsap.utils.toArray('.counter-dot');

  if (!wrapper || !track || panels.length === 0) return;

  // Total horizontal distance
  const totalW = panels.length * window.innerWidth;
  track.style.width = totalW + 'px';

  // GSAP ScrollTrigger — pin the wrapper, drive horizontal scroll
  const trigger = ScrollTrigger.create({
    trigger: wrapper,
    start:   'top top',
    end:     () => '+=' + (totalW - window.innerWidth),
    pin:     true,
    scrub:   1,
    anticipatePin: 1,
    onEnter:  () => { progress?.classList.add('visible'); counter?.classList.add('visible'); },
    onLeave:  () => { progress?.classList.remove('visible'); counter?.classList.remove('visible'); },
    onEnterBack: () => { progress?.classList.add('visible'); counter?.classList.add('visible'); },
    onLeaveBack: () => { progress?.classList.remove('visible'); counter?.classList.remove('visible'); },
    onUpdate: self => {
      // Move track horizontally
      gsap.set(track, { x: -self.progress * (totalW - window.innerWidth) });

      // Update progress bar
      if (progressBar) progressBar.style.width = (self.progress * 100) + '%';

      // Update counter dots + panel animations
      const activeIdx = Math.round(self.progress * (panels.length - 1));
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
      activatePanel(activeIdx);
    },
  });

  // Panel entrance animations — driven by active panel index changes
  let lastActiveIdx = -1;
  panels.forEach(panel => {
    const info = panel.querySelector('.cat-panel-info');
    if (info) gsap.set(info, { opacity: 0, y: 40 });
  });

  function activatePanel(idx) {
    if (idx === lastActiveIdx) return;
    lastActiveIdx = idx;
    panels.forEach((panel, i) => {
      const info = panel.querySelector('.cat-panel-info');
      if (!info) return;
      if (i === idx) {
        gsap.to(info, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' });
      } else {
        gsap.to(info, { opacity: 0, y: 40, duration: 0.3, ease: 'power2.in' });
      }
    });
  }
  activatePanel(0);

  window.addEventListener('resize', () => {
    const newW = panels.length * window.innerWidth;
    track.style.width = newW + 'px';
    ScrollTrigger.refresh();
  });
}

/* ── Scroll reveals ──────────────────────────────────────── */
function initReveals() {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
    });
  });
}

/* ── Glass card spotlight (mouse → CSS var) ──────────────── */
function initSpotlights() {
  document.addEventListener('mousemove', e => {
    document.querySelectorAll('.prod-card').forEach(card => {
      const r  = card.getBoundingClientRect();
      const sx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const sy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      const sp = card.querySelector('.prod-spotlight');
      if (sp) { sp.style.setProperty('--sx', sx); sp.style.setProperty('--sy', sy); }
    });
  });
}

/* ── Copyright year ──────────────────────────────────────── */
function updateYear() {
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());
}

/* ── Boot ────────────────────────────────────────────────── */
function init() {
  updateYear();
  initCursor();
  initNav();
  initHeroAnimation();
  initHorizontalJourney();
  initReveals();
  initSpotlights();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
