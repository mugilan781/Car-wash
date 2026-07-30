(function () {
  'use strict';

  function generateBookingId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'GF-';
    for (let i = 0; i < 8; i++) {
      if (i === 4) id += '-';
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

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

  function showLoader(show) {
    let overlay = document.querySelector('.booking-loader-overlay');
    if (show) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'booking-loader-overlay';
        overlay.innerHTML = `
          <div class="booking-loader">
            <div class="booking-loader__ring"></div>
            <div class="booking-loader__ring-inner"></div>
            <div class="booking-loader__icon"><i class="fas fa-car"></i></div>
            <div class="booking-loader__text">Processing Your Booking</div>
            <div class="booking-loader__dots"><span></span><span></span><span></span></div>
          </div>`;
        document.body.appendChild(overlay);
      }
      overlay.classList.add('active');
    } else {
      if (overlay) overlay.classList.remove('active');
    }
  }

  function initBookingForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs = form.querySelectorAll('input, select, textarea');
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn?.innerHTML;

    inputs.forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

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

      // Collect form data
      const formData = {
        firstName: document.getElementById('b-fname')?.value.trim() || '',
        lastName: document.getElementById('b-lname')?.value.trim() || '',
        email: document.getElementById('b-email')?.value.trim() || '',
        phone: document.getElementById('b-phone')?.value.trim() || '',
        service: document.getElementById('b-service')?.value || '',
        date: document.getElementById('b-date')?.value || '',
        vehicle: document.getElementById('b-vehicle')?.value.trim() || '',
        notes: document.getElementById('b-notes')?.value.trim() || '',
        bookingId: generateBookingId(),
        timestamp: new Date().toISOString()
      };

      // Show full-page loader
      showLoader(true);

      // Simulate API call
      await new Promise(r => setTimeout(r, 2500));

      // Hide loader
      showLoader(false);

      // Save to localStorage
      localStorage.setItem('glossforge_booking', JSON.stringify(formData));

      // Show confirmation with booking ID + payment button
      form.innerHTML = `
        <div class="booking-success">
          <div class="booking-success__icon"><i class="fas fa-circle-check"></i></div>
          <h3 class="booking-success__title">Booking Confirmed!</h3>
          <div class="booking-success__id">
            <span class="booking-success__id-label">Reference Number</span>
            <span class="booking-success__id-value">${formData.bookingId}</span>
          </div>
          <div class="booking-success__details">
            <div class="booking-success__detail"><span>Service</span><span>${formData.service}</span></div>
            <div class="booking-success__detail"><span>Date</span><span>${new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div class="booking-success__detail"><span>Vehicle</span><span>${formData.vehicle || 'Not specified'}</span></div>
            <div class="booking-success__detail"><span>Name</span><span>${formData.firstName} ${formData.lastName}</span></div>
          </div>
          <p class="booking-success__msg">A confirmation email has been sent to <strong>${formData.email}</strong>. Please proceed to payment to secure your booking.</p>
          <div class="booking-success__actions">
            <a href="payment.html" class="btn btn-primary btn-lg"><i class="fas fa-credit-card"></i> Proceed to Payment</a>
            <a href="index.html" class="btn btn-dark"><i class="fas fa-arrow-left"></i> Back to Home</a>
          </div>
        </div>`;
      showToast(`Booking ${formData.bookingId} confirmed!`, 'success');
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

    inputs.forEach(input => {
      input.addEventListener('blur',  () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('is-invalid')) validateField(input);
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

  function showToast(msg, type) {
    if (window.showToast) window.showToast(msg, type);
  }

})();
