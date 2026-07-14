/* ============================================================
   THEME.JS — Dark / Light Theme Toggle
   Saves preference in localStorage. Dark = default.
   ============================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'glossforge-theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  /* ─── Apply theme to <html> ─── */
  function applyTheme(theme) {
    if (theme === LIGHT) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /* ─── Get saved or default ─── */
  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY) || DARK;
  }

  /* ─── Save & apply ─── */
  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  /* ─── Toggle ─── */
  function toggleTheme() {
    const current = localStorage.getItem(STORAGE_KEY) || DARK;
    setTheme(current === DARK ? LIGHT : DARK);
  }

  /* ─── Attach all .theme-toggle buttons ─── */
  function attachToggles() {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleTheme();
      });
    });
  }

  /* ─── Apply theme immediately (before paint) ─── */
  applyTheme(getSavedTheme());

  /* ─── Attach after DOM ready ─── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToggles);
  } else {
    attachToggles();
  }

})();
