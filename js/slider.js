/* ============================================================
   SLIDER.JS — Hero Slider with auto-play, dots, arrows
   ============================================================ */

(function () {
  'use strict';

  class HeroSlider {
    constructor(el) {
      this.el      = el;
      this.slides  = [...el.querySelectorAll('.hero__slide')];
      this.dots    = [...el.querySelectorAll('.hero__dot')];
      this.prev    = el.querySelector('.hero__arrow--prev');
      this.next    = el.querySelector('.hero__arrow--next');
      this.current = 0;
      this.timer   = null;
      this.interval= 5000;
      this.isAnimating = false;

      if (this.slides.length < 1) return;
      this.init();
    }

    init() {
      this.goto(0, false);
      this.startAuto();

      if (this.prev) this.prev.addEventListener('click', () => this.navigate(-1));
      if (this.next) this.next.addEventListener('click', () => this.navigate(1));

      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => this.goto(i));
      });

      // Pause on hover
      this.el.addEventListener('mouseenter', () => this.stopAuto());
      this.el.addEventListener('mouseleave', () => this.startAuto());

      // Touch/swipe support
      let startX = 0;
      this.el.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
      this.el.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) this.navigate(diff > 0 ? 1 : -1);
      });

      // Keyboard
      document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  this.navigate(-1);
        if (e.key === 'ArrowRight') this.navigate(1);
      });
    }

    goto(index, animate = true) {
      if (this.isAnimating && animate) return;
      this.isAnimating = true;

      const prev = this.current;
      this.current = (index + this.slides.length) % this.slides.length;

      this.slides.forEach((s, i) => s.classList.toggle('active', i === this.current));
      this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));

      setTimeout(() => { this.isAnimating = false; }, 1200);
    }

    navigate(dir) {
      this.stopAuto();
      this.goto(this.current + dir);
      this.startAuto();
    }

    startAuto() {
      this.stopAuto();
      this.timer = setInterval(() => this.goto(this.current + 1), this.interval);
    }

    stopAuto() {
      clearInterval(this.timer);
    }
  }

  /* ─── TESTIMONIAL SLIDER ─── */
  class TestimonialSlider {
    constructor(el) {
      this.el      = el;
      this.track   = el.querySelector('.testimonial-track');
      this.cards   = [...el.querySelectorAll('.testimonial-card')];
      this.dots    = [...el.querySelectorAll('.testimonial-dot')];
      this.prevBtn = el.querySelector('.testi-prev');
      this.nextBtn = el.querySelector('.testi-next');
      this.current = 0;
      this.timer   = null;
      this.perView = 1;

      if (this.cards.length < 1) return;
      this.init();
    }

    init() {
      this.update();
      this.startAuto();

      if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.navigate(-1));
      if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.navigate(1));

      this.dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          this.stopAuto();
          this.goto(i);
          this.startAuto();
        });
      });

      this.el.addEventListener('mouseenter', () => this.stopAuto());
      this.el.addEventListener('mouseleave', () => this.startAuto());

      // Touch
      let sx = 0;
      this.el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      this.el.addEventListener('touchend', e => {
        const diff = sx - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) this.navigate(diff > 0 ? 1 : -1);
      });
    }

    goto(index) {
      this.current = (index + this.cards.length) % this.cards.length;
      this.update();
    }

    navigate(dir) {
      this.stopAuto();
      this.goto(this.current + dir);
      this.startAuto();
    }

    update() {
      if (this.track) {
        this.track.style.transform = `translateX(-${this.current * 100}%)`;
        this.track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      }
      this.dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
    }

    startAuto() {
      this.stopAuto();
      this.timer = setInterval(() => this.navigate(1), 4500);
    }
    stopAuto() { clearInterval(this.timer); }
  }

  /* ─── BEFORE/AFTER COMPARISON SLIDER ─── */
  class BeforeAfterSlider {
    constructor(el) {
      this.el     = el;
      this.after  = el.querySelector('.before-after-after');
      this.handle = el.querySelector('.before-after-handle');
      this.active = false;

      if (!this.after) return;
      this.init();
    }

    init() {
      const setPos = (clientX) => {
        const rect = this.el.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const pct = (x / rect.width) * 100;
        this.after.style.width = pct + '%';
        if (this.handle) this.handle.style.left = pct + '%';
      };

      this.el.addEventListener('mousedown', e => { this.active = true; setPos(e.clientX); });
      window.addEventListener('mouseup',   () => { this.active = false; });
      window.addEventListener('mousemove', e => { if (this.active) setPos(e.clientX); });

      this.el.addEventListener('touchstart', e => { this.active = true; setPos(e.touches[0].clientX); }, { passive: true });
      window.addEventListener('touchend',  () => { this.active = false; });
      window.addEventListener('touchmove', e => { if (this.active) setPos(e.touches[0].clientX); }, { passive: true });
    }
  }

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', () => {
    const heroEl = document.querySelector('.hero');
    if (heroEl) new HeroSlider(heroEl);

    const testiEl = document.querySelector('.testimonial-slider-wrap');
    if (testiEl) new TestimonialSlider(testiEl);

    document.querySelectorAll('.before-after-wrap').forEach(el => new BeforeAfterSlider(el));
  });

})();

