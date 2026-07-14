/* ============================================================
   GALLERY.JS — Gallery Filter + Lightbox
   ============================================================ */

(function () {
  'use strict';

  /* ─── GALLERY FILTER ─── */
  function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items      = document.querySelectorAll('.gallery-item');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach(item => {
          const cat = item.dataset.category || '';
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden');
            item.style.animation = 'fadeInUp 0.4s ease both';
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ─── LIGHTBOX ─── */
  function initLightbox() {
    const items    = document.querySelectorAll('.gallery-item[data-lightbox]');
    const lightbox = document.querySelector('.lightbox');
    const lbImg    = lightbox?.querySelector('img');
    const lbClose  = lightbox?.querySelector('.lightbox__close');
    const lbCaption = lightbox?.querySelector('.lightbox__caption');
    if (!lightbox) return;

    let currentItems = [];
    let currentIndex = 0;

    function open(index) {
      currentIndex = index;
      const item = currentItems[index];
      if (!item) return;
      const src   = item.dataset.lightbox;
      const title = item.dataset.title || '';
      if (lbImg) { lbImg.src = src; lbImg.alt = title; }
      if (lbCaption) lbCaption.textContent = title;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }

    function navigate(dir) {
      open((currentIndex + dir + currentItems.length) % currentItems.length);
    }

    // Gather visible items
    function getVisible() {
      return [...document.querySelectorAll('.gallery-item[data-lightbox]:not(.hidden)')];
    }

    items.forEach(item => {
      item.addEventListener('click', () => {
        currentItems = getVisible();
        const idx = currentItems.indexOf(item);
        open(idx < 0 ? 0 : idx);
      });
    });

    if (lbClose) lbClose.addEventListener('click', close);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft')  navigate(-1);
    });

    // Lightbox arrows
    const lbPrev = lightbox.querySelector('.lightbox__prev');
    const lbNext = lightbox.querySelector('.lightbox__next');
    if (lbPrev) lbPrev.addEventListener('click', () => navigate(-1));
    if (lbNext) lbNext.addEventListener('click', () => navigate(1));
  }

  /* ─── MASONRY (simple CSS-grid-based) ─── */
  function initMasonry() {
    // CSS handles the masonry via grid auto-rows. Nothing needed.
  }

  /* ─── VIDEO PLAY BUTTON ─── */
  function initVideoCards() {
    document.querySelectorAll('.video-play-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const card = this.closest('.video-card');
        if (!card) return;
        const url = card.dataset.videoUrl;
        if (url) window.open(url, '_blank');
        else {
          const placeholder = card.querySelector('.video-placeholder');
          if (placeholder) {
            placeholder.style.display = 'none';
            const iframe = document.createElement('iframe');
            iframe.src = card.dataset.embed || '';
            iframe.allow = 'autoplay; fullscreen';
            iframe.style.cssText = 'width:100%;height:100%;border:none;';
            card.appendChild(iframe);
          }
        }
      });
    });
  }

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilter();
    initLightbox();
    initMasonry();
    initVideoCards();
  });

})();

