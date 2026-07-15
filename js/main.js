/* ============================================================
   MAIN.JS — Core site features
   Navbar · Back to Top · Scroll Reveal · Counter Animation · Smooth Scroll
   ============================================================ */

(function () {
  'use strict';

  /* ─── NAVBAR ─── */
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const mobileMenu = document.querySelector('.navbar__mobile');
  const mobileClose = document.querySelector('.navbar__mobile-close');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
      navbar.classList.remove('navbar--transparent');
    } else {
      navbar.classList.remove('navbar--scrolled');
      navbar.classList.add('navbar--transparent');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      if (mobileMenu) {
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when link clicked
  document.querySelectorAll('.navbar__mobile .navbar__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  function closeMobileMenu() {
    if (toggle) toggle.classList.remove('open');
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Track current breakpoint to reset mobile menu state automatically when it changes
  let currentBreakpoint = getBreakpoint();

  function getBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1024) return 'desktop';
    if (width >= 768) return 'tablet';
    return 'mobile';
  }

  function resetHeaderState() {
    if (toggle) toggle.classList.remove('open', 'active', 'show', 'is-open', 'menu-open', 'drawer-open', 'nav-open');
    if (mobileMenu) mobileMenu.classList.remove('open', 'active', 'show', 'is-open', 'menu-open', 'drawer-open', 'nav-open');
    
    document.querySelectorAll('.navbar__toggle, .navbar__mobile, .navbar').forEach(el => {
      el.classList.remove('open', 'active', 'show', 'is-open', 'menu-open', 'drawer-open', 'nav-open');
    });

    document.body.style.overflow = '';
  }

  window.addEventListener('resize', () => {
    const newBreakpoint = getBreakpoint();
    if (newBreakpoint !== currentBreakpoint) {
      currentBreakpoint = newBreakpoint;
      resetHeaderState();
    }
  });

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Profile dropdown toggle
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.profile-trigger');
    const allMenus = document.querySelectorAll('.profile-dropdown-menu');
    const allTriggers = document.querySelectorAll('.profile-trigger');
    
    if (trigger) {
      e.preventDefault();
      e.stopPropagation();
      const menu = trigger.nextElementSibling;
      const isOpen = menu.classList.contains('show');
      
      // Close all other menus first
      allMenus.forEach(m => m.classList.remove('show'));
      allTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      
      if (!isOpen) {
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
      }
    } else {
      // Close all when clicking outside
      const inDropdown = e.target.closest('.profile-dropdown-wrapper');
      if (!inDropdown) {
        allMenus.forEach(m => m.classList.remove('show'));
        allTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
      }
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const allMenus = document.querySelectorAll('.profile-dropdown-menu');
      const allTriggers = document.querySelectorAll('.profile-trigger');
      allMenus.forEach(m => m.classList.remove('show'));
      allTriggers.forEach(t => t.setAttribute('aria-expanded', 'false'));
    }
  });

  /* ─── BACK TO TOP ─── */
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── SCROLL REVEAL ─── */
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ─── STAGGER GROUPS ─── */
  function initStaggerGroups() {
    const groups = document.querySelectorAll('.stagger-group');
    if (!groups.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    groups.forEach(g => observer.observe(g));
  }

  /* ─── COUNTER ANIMATION ─── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = parseInt(el.dataset.duration || '2000');
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  function initCounters() {
    const counterEls = document.querySelectorAll('[data-counter]');
    if (!counterEls.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => observer.observe(el));
  }

  /* ─── PROGRESS BARS ─── */
  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.dataset.width || '0%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  }

  /* ─── TOAST NOTIFICATION ─── */
  window.showToast = function (message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '<i class="fas fa-circle-check" style="color:#10B981;"></i>' : '<i class="fas fa-circle-xmark" style="color:#EF4444;"></i>'}</span>
      <span>${message}</span>`;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  /* ─── PARTICLE CANVAS (decorative background) ─── */
  function initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        speed: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '#2563EB' : '#06B6D4'
      };
    }

    for (let i = 0; i < 80; i++) particles.push(createParticle());

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.y -= p.speed;
        if (p.y < -5) { Object.assign(p, createParticle()); p.y = H + 5; }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ─── INIT ALL ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initStaggerGroups();
    initCounters();
    initProgressBars();
    initParticles('particleCanvas');
  });

  /* ─── CURSOR GLOW EFFECT ─── */
  const cursorGlow = document.createElement('div');
  cursorGlow.style.cssText = `
    position:fixed;width:280px;height:280px;border-radius:50%;
    background:radial-gradient(circle,rgba(37,99,235,0.07) 0%,transparent 70%);
    pointer-events:none;z-index:0;transition:transform 0.15s ease;top:0;left:0;
    transform:translate(-50%,-50%);`;
  document.body.appendChild(cursorGlow);
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.transform = `translate(${e.clientX - 140}px,${e.clientY - 140}px)`;
  });

})();

