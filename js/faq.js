/* ============================================================
   FAQ.JS — FAQ Accordion with smooth height animation
   ============================================================ */

(function () {
  'use strict';

  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer   = item.querySelector('.faq-answer');
      const inner    = item.querySelector('.faq-answer__inner');

      if (!question || !answer) return;

      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close all others (accordion mode)
        faqItems.forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            const otherAnswer = other.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = '0';
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('open');
          answer.style.maxHeight = '0';
        } else {
          item.classList.add('open');
          answer.style.maxHeight = (inner?.scrollHeight || 300) + 'px';
        }
      });

      // Keyboard accessibility
      question.setAttribute('tabindex', '0');
      question.setAttribute('role', 'button');
      question.setAttribute('aria-expanded', 'false');
      question.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
          question.setAttribute('aria-expanded', item.classList.contains('open').toString());
        }
      });
    });


  }

  /* ─── SEARCH FAQ (bonus feature) ─── */
  function initFAQSearch() {
    const searchInput = document.querySelector('.faq-search');
    const faqItems    = document.querySelectorAll('.faq-item');
    if (!searchInput) return;

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = !query || text.includes(query) ? '' : 'none';
      });
    });
  }

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
    initFAQSearch();
  });

})();

