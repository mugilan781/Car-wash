/* ============================================================
   RTL.JS — Right-to-Left / Left-to-Right Direction Toggle
   Reads from localStorage, applies dir attribute immediately
   before first paint (no flash). Persists user preference.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'website-direction';
  var LTR = 'ltr';
  var RTL = 'rtl';

  /* ─── Apply direction to <html> ─── */
  function applyDirection(dir) {
    document.documentElement.dir = (dir === RTL) ? RTL : LTR;
  }

  /* ─── Get saved or default ─── */
  function getSavedDirection() {
    return localStorage.getItem(STORAGE_KEY) || LTR;
  }

  /* ─── Save & apply ─── */
  function setDirection(dir) {
    localStorage.setItem(STORAGE_KEY, dir);
    applyDirection(dir);
    updateToggleLabels(dir);
  }

  /* ─── Toggle ─── */
  function toggleDirection() {
    var current = localStorage.getItem(STORAGE_KEY) || LTR;
    setDirection(current === LTR ? RTL : LTR);
  }

  /* ─── Update toggle button labels to show current state ─── */
  function updateToggleLabels(dir) {
    document.querySelectorAll('.rtl-toggle .rtl-toggle__label').forEach(function (el) {
      el.textContent = (dir === RTL) ? 'LTR' : 'RTL';
    });
  }

  /* ─── Attach all .rtl-toggle buttons ─── */
  function attachToggles() {
    document.querySelectorAll('.rtl-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDirection();
      });
    });
    /* Set initial label text */
    updateToggleLabels(getSavedDirection());
  }

  /* ─── Apply direction immediately (before paint) ─── */
  applyDirection(getSavedDirection());

  /* ─── Attach after DOM ready ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggles);
  } else {
    attachToggles();
  }

})();
