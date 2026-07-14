/* ============================================================
   BOOKING.JS — Booking Form Validation
   ============================================================ */

(function () {
  'use strict';

  function validateField(input) {
    const value = input.value.trim();
    const type  = input.type;
    const name  = input.name || input.id;
    let   valid = true;
    let   msg   = '';

    if (input.hasAttribute('required') && !value) {
      valid = false; msg = 'This field is required.';
    } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      valid = false; msg = 'Please enter a valid email address.';
    } else if (type === 'tel' && value && !/^[\d\s\-\+\(\)]{7,15}$/.test(value)) {
      valid = false; msg = 'Please enter a valid phone number.';
    } else if (name === 'date' && value) {
      const d = new Date(value);
      if (d < new Date()) { valid = false; msg = 'Please select a future date.'; }
    }

    setFieldState(input, valid, msg);
    return valid;
  }

  function setFieldState(input, valid, msg) {
    input.classList.toggle('is-valid',   valid && input.value.trim() !== '');
    input.classList.toggle('is-invalid', !valid);
    const errEl = input.parentElement?.querySelector('.form-error');
    if (errEl) errEl.textContent = msg;
  }

  function initBookingForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    // Submit
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let allValid = true;
      inputs.forEach(input => {
        if (!validateField(input)) allValid = false;
      });

      if (!allValid) {
        const firstInvalid = form.querySelector('.is-invalid');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Please fix the errors above.', 'error');
        return;
      }

      // Loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Booking...';
      }

      // Simulate API call
      await new Promise(r => setTimeout(r, 2000));

      // Success
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:4rem;margin-bottom:1rem;color:#10B981;"><i class="fas fa-circle-check"></i></div>
          <h3 style="color:var(--white);margin-bottom:0.75rem;font-size:1.5rem;">Booking Confirmed!</h3>
          <p style="color:var(--gray-400);margin-bottom:1.5rem;">
            Your appointment has been booked successfully. A confirmation email has been sent to your registered email address.
          </p>
          <a href="index.html" class="btn btn-primary">← Back to Home</a>
        </div>`;
      showToast('Booking confirmed successfully!', 'success');
    });
  }

  /* ─── CONTACT FORM ─── */
  function initContactForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    const submitBtn = form.querySelector('[type="submit"]');

    inputs.forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let allValid = true;
      inputs.forEach(input => { if (!validateField(input)) allValid = false; });
      if (!allValid) { showToast('Please complete all required fields.', 'error'); return; }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="spinner"></span> Sending...'; }
      await new Promise(r => setTimeout(r, 1800));

      // Success
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:4rem;margin-bottom:1rem;color:#10B981;"><i class="fas fa-circle-check"></i></div>
          <h3 style="color:var(--white);margin-bottom:0.75rem;font-size:1.5rem;">Message Sent Successfully!</h3>
          <p style="color:var(--gray-400);margin-bottom:1.5rem;">
            Thank you for contacting GlossForge. Our team has received your message and will get back to you shortly.
          </p>
          <a href="index.html" class="btn btn-primary">← Back to Home</a>
        </div>`;
      showToast('Message sent successfully!', 'success');
    });
  }

  /* ─── AUTH FORMS ─── */
  function initAuthForm(formSelector, isLogin) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs    = form.querySelectorAll('input');
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn?.textContent;

    inputs.forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
        // Password match for signup
        if (!isLogin) {
          const pw1 = form.querySelector('[name="password"]');
          const pw2 = form.querySelector('[name="confirm_password"]');
          if (pw2 && pw1 && input === pw2) {
            if (pw2.value !== pw1.value) {
              setFieldState(pw2, false, 'Passwords do not match.');
            } else { setFieldState(pw2, true, ''); }
          }
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let allValid = true;
      inputs.forEach(input => { if (!validateField(input)) allValid = false; });
      if (!allValid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner" style="display:inline-block;width:18px;height:18px;border-width:2px;vertical-align:middle;margin-right:8px;"></span> ' + (isLogin ? 'Signing in...' : 'Creating account...');
      }
      
      await new Promise(r => setTimeout(r, 1500));

      if (isLogin) {
        window.location.href = 'index.html';
      } else {
        showToast('Account created successfully!', 'success');
        await new Promise(r => setTimeout(r, 1000));
        window.location.href = 'login.html';
      }
    });

    // Password toggle
    form.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        if (!input) return;
        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      });
    });
  }

  /* ─── INIT ─── */
  document.addEventListener('DOMContentLoaded', () => {
    initBookingForm('#booking-form, #booking-form-contact');
    initContactForm('#contact-form');
    initAuthForm('#login-form',  true);
    initAuthForm('#signup-form', false);
  });

  // Expose for toast
  function showToast(msg, type) {
    if (window.showToast) window.showToast(msg, type);
  }

})();

