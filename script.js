/* =============================================================
   CYBORG ONE — script.js
   Premium Futuristic Landing Page JavaScript
   Technologies: GSAP, Three.js, AOS, Custom Animations
   ============================================================= */

"use strict";

/* ===================== UTILS ===================== */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/* ===================== LOADER ===================== */
(function initLoader() {
  const loader = $('#loader');
  const bar = $('#loader-bar');
  const statusEl = $('#loader-status');

  const steps = [
    { pct: 20, msg: 'Initializing Neural Core...' },
    { pct: 45, msg: 'Loading Quantum Algorithms...' },
    { pct: 68, msg: 'Calibrating Vision Systems...' },
    { pct: 85, msg: 'Syncing AI Networks...' },
    { pct: 100, msg: 'CYBORG ONE Ready.' },
  ];

  let stepIdx = 0;
  const advance = () => {
    if (stepIdx >= steps.length) return;
    const { pct, msg } = steps[stepIdx++];
    bar.style.width = pct + '%';
    statusEl.textContent = msg;
    if (stepIdx < steps.length) setTimeout(advance, 420 + Math.random() * 280);
    else {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAllModules();
      }, 600);
    }
  };
  document.body.style.overflow = 'hidden';

  // Loader canvas particles
  initLoaderCanvas();
  setTimeout(advance, 300);

  function initLoaderCanvas() {
    const canvas = $('#loader-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const N = 60;
    for (let i = 0; i < N; i++) {
      particles.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 0.5,
        a: Math.random() * 0.5 + 0.1
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(13,148,136,${p.a})`;
        ctx.fill();
      });
      // Connect nearby particles
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(13,148,136,${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
})();

/* ===================== MAIN INIT ===================== */
function initAllModules() {
  AOS.init({ duration: 700, once: true, easing: 'ease-out-cubic', offset: 60 });
  initCursor();
  initNavbar();
  initHeroCanvas();
  initGSAP();
  initTestimonials();
  initFAQ();
  initCounters();
  initParallax();
  initContactForm();
  initModal();
  initBackToTop();
  initRipple();
  initMobileMenu();
}

/* ===================== CUSTOM CURSOR ===================== */
function initCursor() {
  const glow = $('#cursor-glow');
  const dot = $('#cursor-dot');
  if (!glow || !dot) return;

  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; dot.style.opacity = '1'; });

  const tick = () => {
    gx = lerp(gx, mx, 0.12);
    gy = lerp(gy, my, 0.12);
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    requestAnimationFrame(tick);
  };
  tick();

  // Scale cursor on interactive elements
  const interactives = $$('a, button, [role="button"], [tabindex="0"], input, textarea, select');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      glow.style.transform = 'translate(-50%,-50%) scale(1.8)';
      glow.style.borderColor = 'rgba(13,148,136,0.8)';
      glow.style.background = 'rgba(13,148,136,0.05)';
    });
    el.addEventListener('mouseleave', () => {
      glow.style.transform = 'translate(-50%,-50%) scale(1)';
      glow.style.borderColor = 'rgba(13,148,136,0.5)';
      glow.style.background = 'transparent';
    });
  });
}

/* ===================== NAVBAR ===================== */
function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Highlight active nav link
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach(sec => {
      const id = sec.getAttribute('id');
      const link = $(`.nav-link[href="#${id}"]`);
      if (!link) return;
      const top = sec.offsetTop, bottom = top + sec.offsetHeight;
      link.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===================== MOBILE MENU ===================== */
function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let open = false;
  const toggle = () => {
    open = !open;
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open.toString());
  };
  hamburger.addEventListener('click', toggle);
  $$('.mobile-link, .mobile-menu .btn-primary').forEach(link => {
    link.addEventListener('click', () => { if (open) toggle(); });
  });
  document.addEventListener('click', e => {
    if (open && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) toggle();
  });
}

/* ===================== HERO THREE.JS CANVAS ===================== */
function initHeroCanvas() {
  const canvas = $('#hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 200);
  camera.position.z = 50;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  /* ---- Particles ---- */
  const PARTICLE_COUNT = 180;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const velocities = [];

  const palette = [
    new THREE.Color('#0d9488'),
    new THREE.Color('#06b6d4'),
    new THREE.Color('#34d399'),
    new THREE.Color('#10b981'),
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 80;
    positions[i3 + 2] = (Math.random() - 0.5) * 60;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = c.r; colors[i3 + 1] = c.g; colors[i3 + 2] = c.b;
    velocities.push({
      x: (Math.random() - 0.5) * 0.04,
      y: (Math.random() - 0.5) * 0.04,
      z: (Math.random() - 0.5) * 0.02,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.8, vertexColors: true, transparent: true,
    opacity: 0.6, sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* ---- Line connections ---- */
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0d9488, transparent: true, opacity: 0.12 });
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lines);

  /* ---- Mouse parallax ---- */
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  document.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 6;
    targetY = -(e.clientY / window.innerHeight - 0.5) * 4;
  });

  /* ---- Animate ---- */
  const posArr = geo.attributes.position.array;
  const clock = new THREE.Clock();

  const animate = () => {
    if (loader && !loader.classList.contains('hidden') && !document.getElementById('loader').classList.contains('hidden')) {
      requestAnimationFrame(animate); return;
    }
    const t = clock.getElapsedTime();

    // Update particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArr[i3] += velocities[i].x;
      posArr[i3 + 1] += velocities[i].y + Math.sin(t * 0.5 + i * 0.3) * 0.008;
      posArr[i3 + 2] += velocities[i].z;

      // Bounce
      if (Math.abs(posArr[i3]) > 60) velocities[i].x *= -1;
      if (Math.abs(posArr[i3 + 1]) > 40) velocities[i].y *= -1;
      if (Math.abs(posArr[i3 + 2]) > 30) velocities[i].z *= -1;
    }
    geo.attributes.position.needsUpdate = true;

    // Update lines
    let lineIdx = 0;
    const thresh = 28;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const ax = posArr[i * 3], ay = posArr[i * 3 + 1], az = posArr[i * 3 + 2];
        const bx = posArr[j * 3], by = posArr[j * 3 + 1], bz = posArr[j * 3 + 2];
        const dist = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
        if (dist < thresh && lineIdx + 5 < linePositions.length) {
          linePositions[lineIdx++] = ax; linePositions[lineIdx++] = ay; linePositions[lineIdx++] = az;
          linePositions[lineIdx++] = bx; linePositions[lineIdx++] = by; linePositions[lineIdx++] = bz;
        }
      }
    }
    lines.geometry.attributes.position.needsUpdate = true;
    lines.geometry.setDrawRange(0, lineIdx / 3);

    // Camera parallax
    currentX = lerp(currentX, targetX, 0.06);
    currentY = lerp(currentY, targetY, 0.06);
    camera.position.x = currentX;
    camera.position.y = currentY;
    camera.lookAt(scene.position);

    // Rotate scene slightly
    points.rotation.y = t * 0.03;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };
  animate();
}

/* ===================== GSAP ANIMATIONS ===================== */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  gsap.fromTo('.hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  gsap.fromTo('.hero-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.4 });
  gsap.fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.6 });
  gsap.fromTo('.hero-actions', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.8 });
  gsap.fromTo('.hero-stats', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.0 });
  gsap.fromTo('.hero-visual', { opacity: 0, x: 60, scale: 0.92 }, { opacity: 1, x: 0, scale: 1, duration: 1.2, ease: 'power3.out', delay: 0.5 });

  // Floating cards entrance
  gsap.fromTo('.float-card', { opacity: 0, scale: 0.8 }, {
    opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.4)',
    stagger: 0.2, delay: 1.0
  });

  // Section headings
  $$('.section-title').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  // Feature cards stagger
  gsap.fromTo('.feature-card', { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    stagger: 0.08,
    scrollTrigger: { trigger: '.features-grid', start: 'top 80%', once: true }
  });

  // Innovation cards
  gsap.fromTo('.inno-card', { opacity: 0, scale: 0.85 }, {
    opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.3)',
    stagger: 0.06,
    scrollTrigger: { trigger: '.innovation-grid', start: 'top 80%', once: true }
  });

  // Product cards
  gsap.fromTo('.product-card', { opacity: 0, y: 50, rotateX: 8 }, {
    opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.products-grid', start: 'top 80%', once: true }
  });

  // Timeline items
  $$('.timeline-item').forEach((el, i) => {
    const dir = el.classList.contains('timeline-item-right') ? 60 : -60;
    gsap.fromTo(el, { opacity: 0, x: dir }, {
      opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true }
    });
  });

  // Stat cards
  gsap.fromTo('.stat-card', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
    stagger: 0.12,
    scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', once: true }
  });

  // Contact section
  gsap.fromTo('.contact-info', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-section', start: 'top 75%', once: true }
  });
  gsap.fromTo('.contact-form-wrap', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-section', start: 'top 75%', once: true }
  });

  // Scroll-triggered parallax on hero orbs
  $$('.hero-orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: i % 2 === 0 ? -80 : 60,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  });

  // Robot parallax on scroll
  gsap.to('#robot-image-wrap', {
    y: -60,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    }
  });
}

/* ===================== ANIMATED COUNTERS ===================== */
function initCounters() {
  const counters = $$('.stat-num[data-target]');
  const bars = $$('.stat-bar-fill');

  const animateNum = (el) => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNum(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));

  // Animate stat bars
  const barObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => barObserver.observe(bar));
}

/* ===================== PARALLAX ON MOUSE ===================== */
function initParallax() {
  const robot = $('#robot-image-wrap, #robot-fallback');
  if (!robot) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const robotEl = $('#robot-image-wrap');
    if (robotEl) {
      robotEl.style.transform = `translate(-50%, -50%) translateX(${dx * 12}px) translateY(${dy * 8}px)`;
    }
    $$('.hero-orb').forEach((orb, i) => {
      const factor = (i + 1) * 8;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px) scale(${1 + Math.abs(dx) * 0.02})`;
    });
    $$('.float-card').forEach((card, i) => {
      const f = (i + 1) * 4;
      card.style.transform = card.classList.contains('card-right')
        ? `translateY(-50%) translate(${dx * f}px, ${dy * f * 0.5}px)`
        : `translate(${dx * f}px, ${dy * f}px)`;
    });
  });
}

/* ===================== TESTIMONIALS ===================== */
function initTestimonials() {
  const track = $('#testimonials-track');
  const dotsContainer = $('#test-dots');
  const prevBtn = $('#test-prev');
  const nextBtn = $('#test-next');
  if (!track || !dotsContainer) return;

  const cards = $$('.testimonial-card', track);
  const total = cards.length;
  let current = 0;
  let autoTimer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('test-dot');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const goTo = (idx) => {
    current = (idx + total) % total;
    const cardWidth = cards[0].offsetWidth + 24; // gap
    const visibleCount = getVisibleCount();
    const maxOffset = (total - visibleCount) * cardWidth;
    let offset = current * cardWidth;
    if (offset > maxOffset) offset = maxOffset;
    track.style.transform = `translateX(-${offset}px)`;
    $$('.test-dot', dotsContainer).forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
    resetAuto();
  };

  const getVisibleCount = () => {
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 640) return 2;
    return 1;
  };

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));

  const resetAuto = () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  };
  resetAuto();

  // Touch/swipe
  let touchStart = null;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    touchStart = null;
  });
  window.addEventListener('resize', () => goTo(current));
}

/* ===================== FAQ ACCORDION ===================== */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    const openItem = () => {
      const isOpen = item.getAttribute('aria-expanded') === 'true';
      // Close all
      $$('.faq-item').forEach(other => {
        other.setAttribute('aria-expanded', 'false');
        const ans = $('.faq-a', other);
        if (ans) ans.classList.remove('open');
      });
      if (!isOpen) {
        item.setAttribute('aria-expanded', 'true');
        const ans = $('.faq-a', item);
        if (ans) ans.classList.add('open');
      }
    };
    item.addEventListener('click', openItem);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(); }
    });
  });
}

/* ===================== CONTACT FORM ===================== */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = $('#form-submit');
    const submitText = $('#submit-text');
    const submitIcon = $('#submit-icon');
    if (!submitBtn) return;

    // Simulate sending
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.8';
    submitText.textContent = 'Sending...';
    if (submitIcon) submitIcon.innerHTML = '<circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.8" stroke-dasharray="44" stroke-dashoffset="44" style="animation: spin 1s linear infinite; transform-origin: center;"/>';

    setTimeout(() => {
      submitText.textContent = 'Message Sent! ✓';
      submitBtn.style.opacity = '1';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #0d9488)';
      form.reset();
      setTimeout(() => {
        submitText.textContent = 'Send Message';
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        if (submitIcon) submitIcon.innerHTML = '<path d="M3.75 9h10.5M10.5 5.25L14.25 9 10.5 12.75" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>';
      }, 3000);
    }, 2000);
  });
}

/* ===================== MODAL ===================== */
function initModal() {
  const overlay = $('#modal-overlay');
  const closeBtn = $('#modal-close');
  const watchBtn = $('#watch-demo-btn');
  if (!overlay) return;

  const open = () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  };
  const close = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    watchBtn && watchBtn.focus();
  };

  watchBtn && watchBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
}

/* ===================== BACK TO TOP ===================== */
function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ===================== RIPPLE EFFECT ===================== */
function initRipple() {
  $$('.btn-primary').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      ripple.style.left = (e.clientX - rect.left - 10) + 'px';
      ripple.style.top = (e.clientY - rect.top - 10) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
}

/* ===================== SMOOTH SCROLL ===================== */
document.addEventListener('click', e => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = $(anchor.getAttribute('href'));
  if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});

/* ===================== LAZY LOADING ===================== */
if ('loading' in HTMLImageElement.prototype) {
  $$('img[loading="lazy"]').forEach(img => { if (img.dataset.src) img.src = img.dataset.src; });
} else {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  $$('img[data-src]').forEach(img => lazyObserver.observe(img));
}

/* ===================== 3D TILT HOVER ===================== */
function init3DTilt() {
  $$('.product-card, .feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 4}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ===================== NEWSLETTER FORM ===================== */
document.addEventListener('DOMContentLoaded', () => {
  const nlForm = $('.newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = nlForm.querySelector('input');
      const btn = nlForm.querySelector('button');
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9l4.5 4.5L15 4.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      input.value = '';
      input.placeholder = 'Subscribed! Thank you.';
      setTimeout(() => {
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.75 9h10.5M10.5 5.25L14.25 9 10.5 12.75" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        input.placeholder = 'your@email.com';
      }, 3000);
    });
  }
});

/* ===================== HERO ROBOT FALLBACK ===================== */
(function checkRobotImage() {
  const img = $('#robot-img');
  if (!img) return;
  if (img.complete && (img.naturalWidth === 0 || img.src.includes('hero-robot.png'))) {
    img.style.display = 'none';
    const fb = $('#robot-fallback');
    if (fb) fb.style.display = 'flex';
  }
  img.addEventListener('error', () => {
    img.style.display = 'none';
    const fb = $('#robot-fallback');
    if (fb) fb.style.display = 'flex';
  });
})();

/* ===================== WINDOW LOAD ===================== */
window.addEventListener('load', () => {
  init3DTilt();
  // Trigger stat bar animation for visible bars
  $$('.stat-bar-fill').forEach(bar => {
    const rect = bar.getBoundingClientRect();
    if (rect.top < window.innerHeight) bar.classList.add('animate');
  });
});

/* ===================== KEYBOARD ACCESSIBILITY ===================== */
document.addEventListener('keydown', e => {
  if (e.key === 'Tab') document.body.classList.add('using-keyboard');
});
document.addEventListener('mousedown', () => {
  document.body.classList.remove('using-keyboard');
});
