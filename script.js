/* ═══════════════════════════════════════════════════════════
   MEERA & ARJUN — Full Redesign | Interactive JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Global variables for falling petals (Module Scope) ── */
let petalCanvas = null;
let petalCtx = null;
const petalColors = ['#e8c55a', '#4761f5ff', '#fd42deff', '#b02a2a', '#e67e22', '#f39c12']; // Luxury marigold, saffron, rose pink, and deep wedding red palette
let activePetals = [];

/* ──────────────────────────────────────────────────────────
   1. LOADER, RING ANIMATION & SPARKLES
────────────────────────────────────────────────────────── */

/* Canvas-based gold sparkle dust generator for loader background */
function initLoaderSparkles() {
  const canvas = document.getElementById('loader-sparkles');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const particleCount = 65;

  class Sparkle {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + 10;
      this.size = 1 + Math.random() * 2.5;
      this.speedY = -(0.25 + Math.random() * 0.85);
      this.speedX = (Math.random() - 0.5) * 0.35;
      this.opacity = 0.15 + Math.random() * 0.65;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.01 + Math.random() * 0.015;
    }
    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.sway) * 0.15;

      // Floating upwards, reset if off-screen top
      if (this.y < -15) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      // Golden gradient glow
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
      grad.addColorStop(0, '#fff3cc');
      grad.addColorStop(0.3, '#e8c55a');
      grad.addColorStop(1, 'rgba(196, 154, 48, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Sparkle());
  }

  let active = true;
  function animate() {
    if (!active) return;
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();

  return {
    stop: () => { active = false; }
  };
}

/* Loader progression & unveil triggers */
function initLoader() {
  const loader = document.getElementById('loader');
  const diya = document.getElementById('interactive-diya');
  const shockwave = document.getElementById('diya-shockwave');

  if (!loader) { initPageReveal(); return; }

  // Fire up the ambient gold sparkles
  const sparklesController = initLoaderSparkles();

  // If there's an interactive Diya, wait for user interaction
  if (diya) {
    diya.addEventListener('click', () => {
      // 1. Ignite the Diya: Add class to loader to trigger flame growth, pulsing halo, and gate glow
      loader.classList.add('is-lit');

      // 2. Trigger expanding golden shockwave
      if (shockwave) {
        shockwave.style.opacity = '1';
        shockwave.style.transform = 'scale(0.8)';
        // Force reflow to ensure the scale and opacity transition starts from initial state
        shockwave.offsetHeight;
        shockwave.classList.add('trigger');
      }

      // 3. Temporarily expand custom cursor for interactive micro-feedback
      const cursor = document.getElementById('cursor');
      if (cursor) {
        cursor.classList.add('expanded');
        setTimeout(() => cursor.classList.remove('expanded'), 600);
      }

      // 4. Wait for the shockwave to expand and gates to glow, then proceed to unveil
      setTimeout(unveil, 850);
    }, { once: true }); // Ensure it can only be triggered once
  } else {
    // Fallback if Diya element is missing
    unveil();
  }

  function unveil() {
    // Start parting the left and right temple gates down the middle
    loader.classList.add('hidden-loader');

    // Trigger the majestic marigold and rose petal canvas shower
    triggerCelebrationPetals();

    // Wait for the slide-out doors transition to finish (~2.0s total encompassing 1.6s slide + delay)
    setTimeout(() => {
      initPageReveal();
      if (sparklesController) sparklesController.stop();
    }, 2000);
  }
}

/* Celebratory flower burst when curtains open */
function triggerCelebrationPetals() {
  if (!petalCanvas) return;

  // Create ~90 extra heavy rose/marigold petals cascading with higher velocity
  const burstCount = 95;
  for (let i = 0; i < burstCount; i++) {
    const p = new Petal();
    p.y = -Math.random() * 200; // start scattered above screen
    p.x = Math.random() * petalCanvas.width;
    p.speedY = 1.4 + Math.random() * 2.6; // slightly faster falling speed for impact
    p.speedX = (Math.random() - 0.5) * 2.2;
    activePetals.push(p);
  }

  // Gradually trim back the petal count to default levels (28) over 7 seconds
  setTimeout(() => {
    const interval = setInterval(() => {
      if (activePetals.length > 28) {
        activePetals.splice(28, activePetals.length - 28);
      } else {
        clearInterval(interval);
      }
    }, 120);
  }, 7000);
}

/* ──────────────────────────────────────────────────────────
   2. SCROLL REVEAL (IntersectionObserver)
────────────────────────────────────────────────────────── */
function initScrollReveal() {
  const options = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0);
      if (delay > 0) {
        el.style.transitionDelay = `${delay}s`;
      }
      // Use requestAnimationFrame to ensure the delay is applied before the class is added
      requestAnimationFrame(() => {
        el.classList.add('revealed');
      });
      observer.unobserve(el);
    });
  }, options);

  document.querySelectorAll(
    '.anim-fade-up, .anim-slide-left, .anim-slide-right, .anim-spin-in'
  ).forEach(el => observer.observe(el));
}

/* Hero elements that animate immediately after loader */
function initPageReveal() {
  const heroEls = document.querySelectorAll('.hero-section .anim-fade-up');
  heroEls.forEach((el, i) => {
    const delay = parseFloat(el.dataset.delay || i * 0.2);
    if (delay > 0) el.style.transitionDelay = `${delay}s`;

    requestAnimationFrame(() => {
      el.classList.add('revealed');
    });
  });
  initScrollReveal();
}

/* ──────────────────────────────────────────────────────────
   3. CUSTOM CURSOR
────────────────────────────────────────────────────────── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let tx = mx, ty = my;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  // Trail follows with lerp
  function animateTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    raf = requestAnimationFrame(animateTrail);
  }
  raf = requestAnimationFrame(animateTrail);

  // Expand cursor on interactive elements
  const hoverEls = document.querySelectorAll(
    'a, button, .flip-card-scene, .gm-item, .event-card-new, .portrait-frame, #interactive-diya'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    trail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    trail.style.opacity = '0.5';
  });
}

/* ──────────────────────────────────────────────────────────
   4. FALLING PETALS CANVAS
────────────────────────────────────────────────────────── */
class Petal {
  constructor() { this.reset(true); }

  reset(init = false) {
    if (!petalCanvas) return;
    this.x = Math.random() * petalCanvas.width;
    this.y = init ? Math.random() * petalCanvas.height : -20;
    this.size = 4 + Math.random() * 6;
    this.speedY = 0.5 + Math.random() * 1.2;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.04;
    this.opacity = 0.4 + Math.random() * 0.5;
    this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
    this.type = Math.floor(Math.random() * 3);

    this.sway = Math.random() * Math.PI * 2; // phase for sine sway
  }

  update() {
    if (!petalCanvas) return;
    this.sway += 0.02;
    this.x += this.speedX + Math.sin(this.sway) * 0.5;
    this.y += this.speedY;
    this.rot += this.rotSpeed;
    if (this.y > petalCanvas.height + 30) this.reset();
  }

  draw() {
    if (!petalCtx) return;
    petalCtx.save();
    petalCtx.translate(this.x, this.y);
    petalCtx.rotate(this.rot);
    petalCtx.globalAlpha = this.opacity;

    if (this.type === 0) {
      // 🌸 Sakura / Rose Petal
      petalCtx.fillStyle = this.color;
      petalCtx.beginPath();
      petalCtx.moveTo(0, -this.size);
      petalCtx.bezierCurveTo(this.size * 0.9, -this.size * 0.8, this.size * 1.2, this.size * 0.3, 0, this.size);
      petalCtx.bezierCurveTo(-this.size * 1.2, this.size * 0.3, -this.size * 0.9, -this.size * 0.8, 0, -this.size);
      petalCtx.closePath();
      petalCtx.fill();

      petalCtx.strokeStyle = "rgba(255,255,255,0.2)";
      petalCtx.lineWidth = 0.8;
      petalCtx.stroke();
    }

    else if (this.type === 1) {
      // 🌹 Rose Petal (teardrop)
      petalCtx.fillStyle = this.color;
      petalCtx.beginPath();
      petalCtx.moveTo(0, -this.size);
      petalCtx.quadraticCurveTo(this.size * 1.2, 0, 0, this.size * 1.4);
      petalCtx.quadraticCurveTo(-this.size * 1.2, 0, 0, -this.size);
      petalCtx.closePath();
      petalCtx.fill();

      petalCtx.strokeStyle = "rgba(255,255,255,0.18)";
      petalCtx.lineWidth = 0.7;
      petalCtx.stroke();
    }

    else {
      // 🌼 Marigold Leaf / Oval Petal
      petalCtx.fillStyle = this.color;
      petalCtx.beginPath();
      petalCtx.ellipse(0, 0, this.size * 0.9, this.size * 0.45, 0, 0, Math.PI * 2);
      petalCtx.fill();

      petalCtx.strokeStyle = "rgba(255,255,255,0.15)";
      petalCtx.lineWidth = 0.6;
      petalCtx.stroke();
    }

    petalCtx.restore();
  }
}

function initPetals() {
  petalCanvas = document.getElementById('petal-canvas');
  if (!petalCanvas) return;
  petalCtx = petalCanvas.getContext('2d');

  function resize() {
    if (petalCanvas) {
      petalCanvas.width = window.innerWidth;
      petalCanvas.height = window.innerHeight;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  const PETAL_COUNT = 28;
  activePetals = [];

  for (let i = 0; i < PETAL_COUNT; i++) {
    activePetals.push(new Petal());
  }

  function loop() {
    if (!petalCtx || !petalCanvas) return;
    petalCtx.clearRect(0, 0, petalCanvas.width, petalCanvas.height);
    activePetals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ──────────────────────────────────────────────────────────
   5. COUNTDOWN TIMER (to 14 Feb 2026)
────────────────────────────────────────────────────────── */
function initCountdown() {
  const target = new Date('2026-02-14T09:00:00+05:30').getTime();
  const els = {
    days: document.getElementById('cd-days'),
    hrs: document.getElementById('cd-hrs'),
    min: document.getElementById('cd-min'),
    sec: document.getElementById('cd-sec'),
  };

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      // Wedding day!
      Object.values(els).forEach(el => { if (el) el.textContent = '00'; });
      const wrap = document.getElementById('countdown');
      if (wrap) wrap.innerHTML = `<p class="cd-celebrate">✦ Today is the Day! ✦</p>`;
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (els.days) els.days.textContent = pad(d);
    if (els.hrs) els.hrs.textContent = pad(h);
    if (els.min) els.min.textContent = pad(m);
    if (els.sec) {
      // Flip animation on seconds change
      const prev = els.sec.textContent;
      const next = pad(s);
      if (prev !== next) {
        els.sec.style.transform = 'translateY(-10px)';
        els.sec.style.opacity = '0';
        setTimeout(() => {
          els.sec.textContent = next;
          els.sec.style.transform = 'translateY(0)';
          els.sec.style.opacity = '1';
        }, 200);
      }
    }
  }

  if (els.sec) {
    els.sec.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  }
  tick();
  setInterval(tick, 1000);
}

/* ──────────────────────────────────────────────────────────
   6. INVITATION FLIP CARD
────────────────────────────────────────────────────────── */
function initFlipCard() {
  const card = document.getElementById('flip-card');
  if (!card) return;

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    card.querySelector('.flip-card-inner').style.transform = '';
  });

  // Tilt on mouse move (only front face visible)
  card.addEventListener('mousemove', (e) => {
    if (card.classList.contains('flipped')) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.querySelector('.flip-card-inner').style.transform =
      `rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    if (card.classList.contains('flipped')) return;
    card.querySelector('.flip-card-inner').style.transform = '';
  });
}

/* ──────────────────────────────────────────────────────────
   7. SCROLL-DRIVEN PARALLAX
────────────────────────────────────────────────────────── */
function initParallax() {
  const heroBg = document.getElementById('hero-bg-img');
  const storyBg = document.getElementById('story-bg');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;

    requestAnimationFrame(() => {
      const sy = window.scrollY;

      // ✅ Only move background-position instead of transform
      if (heroBg) {
        heroBg.style.backgroundPosition = `center calc(13% + ${sy * 0.12}px)`;
      }

      if (storyBg) {
        const rect = storyBg.parentElement.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (window.innerHeight - rect.top) * 0.15;
          storyBg.style.transform = `translateY(${offset}px)`;
        }
      }

      ticking = false;
    });

    ticking = true;
  }, { passive: true });
}

/* ────────────────────────────────────────────────────────── 
   8. NAV SCROLL STATE
────────────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', update, { passive: true });
  update();

  // Smooth-scroll nav links
  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────────────────
   9. EVENT CARD SPARKLE ON HOVER
────────────────────────────────────────────────────────── */
function initSparkle() {
  document.querySelectorAll('.event-card-new').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });
}

/* ──────────────────────────────────────────────────────────
   10. GALLERY — reveal stagger on hover
────────────────────────────────────────────────────────── */
function initGallery() {
  document.querySelectorAll('.gm-item').forEach((item, i) => {
    item.style.transitionDelay = `${i * 0.06}s`;
  });
}

/* ──────────────────────────────────────────────────────────
   11. MOUSE-MOVED HERO NAMES PARALLAX (subtle depth)
────────────────────────────────────────────────────────── */
function initHeroMouseDepth() {
  const heroSection = document.querySelector('.hero-section');
  const namesWrap = document.querySelector('.hero-names-wrap');
  const florals = document.querySelectorAll('.floral-corner');
  if (!heroSection || !namesWrap) return;

  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (e.clientX - rect.left - cx) / cx;
    const dy = (e.clientY - rect.top - cy) / cy;

    namesWrap.style.transform = `translate(${dx * 10}px, ${dy * 6}px)`;

    florals.forEach((fl, i) => {
      const factor = i % 2 === 0 ? -1 : 1;
      fl.style.transform = `translate(${dx * 15 * factor}px, ${dy * 10 * factor}px)`;
    });
  });

  heroSection.addEventListener('mouseleave', () => {
    namesWrap.style.transform = '';
    florals.forEach(fl => fl.style.transform = '');
  });
}

/* ──────────────────────────────────────────────────────────
   12. CLICK HEART BURST
────────────────────────────────────────────────────────── */
function initHeartBurst() {
  document.addEventListener('click', (e) => {
    // Only burst outside interactive elements
    if (e.target.closest('a, button, iframe, .flip-card-scene')) return;

    for (let i = 0; i < 7; i++) {
      const heart = document.createElement('div');
      heart.innerHTML = i % 3 === 0 ? '♥' : i % 3 === 1 ? '✦' : '💕';
      heart.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: ${18 + Math.random() * 22}px;
        color: ${Math.random() > 0.5 ? '#ec13abff' : '#ee1414ff'};
        pointer-events: none;
        z-index: 99997;
        transform: translate(-50%, -50%);
        animation: heartBurst 0.9s ease forwards;
        --vx: ${(Math.random() - 0.5) * 190}px;
        --vy: ${-60 - Math.random() * 140}px;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 900);
    }
  });

  // Inject burst keyframes once
  if (!document.getElementById('heartBurstStyle')) {
    const s = document.createElement('style');
    s.id = 'heartBurstStyle';
    s.textContent = `
      @keyframes heartBurst {
        0%   { opacity: 1; transform: translate(-50%,-50%) scale(0.5); }
        80%  { opacity: 0.6; transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(1.2); }
        100% { opacity: 0;   transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0.8); }
      }
    `;
    document.head.appendChild(s);
  }
}

/* ──────────────────────────────────────────────────────────
   13. SECTION TITLE LETTER SPLIT ANIMATION
────────────────────────────────────────────────────────── */
function initLetterSplit() {
  document.querySelectorAll('.sec-title').forEach(title => {
    const text = title.textContent;
    title.innerHTML = text
      .split('')
      .map((ch, i) =>
        ch === ' '
          ? ' '
          : `<span class="split-char" style="display:inline-block; transition-delay:${i * 0.03}s">${ch}</span>`
      )
      .join('');
  });

  // Animate on reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.split-char').forEach(ch => {
        ch.style.opacity = '1';
        ch.style.transform = 'translateY(0)';
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.sec-title').forEach(title => {
    // Set initial state
    title.querySelectorAll('.split-char').forEach(ch => {
      ch.style.opacity = '0';
      ch.style.transform = 'translateY(20px)';
      ch.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    obs.observe(title);
  });
}

/* ──────────────────────────────────────────────────────────
   14. RIBBON PAUSE ON HOVER
────────────────────────────────────────────────────────── */
function initRibbon() {
  const track = document.querySelector('.ribbon-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}

/* ──────────────────────────────────────────────────────────
   15. ADD COUNTDOWN CSS IF MISSING
────────────────────────────────────────────────────────── */
function injectExtraStyles() {
  const s = document.createElement('style');
  s.textContent = `
    .cd-celebrate {
      font-family: 'Great Vibes', cursive;
      font-size: 2rem;
      color: #c49a30;
      letter-spacing: 0.1em;
    }
    #cd-sec {
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    /* Sparkle gradient on event cards */
    .event-card-new::after {
      content: '';
      position: absolute;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(196,154,48,0.18), transparent 70%);
      transform: translate(-50%, -50%);
      top: var(--my, 50%);
      left: var(--mx, 50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .event-card-new:hover::after { opacity: 1; }

    /* Floral corner transition on hero mouse depth */
    .floral-corner { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
    .hero-names-wrap { transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
  `;
  document.head.appendChild(s);
}

/* ──────────────────────────────────────────────────────────
   BOOTSTRAP — DOMContentLoaded
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectExtraStyles();
  initLoader();
  initCursor();
  initPetals();
  initCountdown();
  initParallax();
  initNav();
  initFlipCard();
  initSparkle();
  initGallery();
  initHeroMouseDepth();
  initHeartBurst();
  initLetterSplit();
  initRibbon();
});
