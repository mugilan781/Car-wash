(function () {
  'use strict';

  const servicePrices = {
    'Express Wash — $29': 29,
    'Premium Detail — $89': 89,
    'Full Detail — $149': 149,
    'Ceramic Coating — $299+': 299,
    'Interior Clean — $99': 99
  };

  function getPrice(service) {
    for (const key in servicePrices) {
      if (key === service) return servicePrices[key];
    }
    const match = service.match(/\$(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  function formatCardNumber(val) {
    return val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19);
  }

  function formatExpiry(val) {
    const d = val.replace(/\D/g, '');
    if (d.length > 2) return d.substring(0, 2) + '/' + d.substring(2, 4);
    return d;
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
            <div class="booking-loader__icon"><i class="fas fa-lock"></i></div>
            <div class="booking-loader__text">Processing Payment</div>
            <div class="booking-loader__dots"><span></span><span></span><span></span></div>
          </div>`;
        document.body.appendChild(overlay);
      }
      overlay.classList.add('active');
    } else {
      if (overlay) overlay.classList.remove('active');
    }
  }

  function initPaymentPage() {
    const bookingData = JSON.parse(localStorage.getItem('glossforge_booking'));
    if (!bookingData) {
      const paySection = document.getElementById('payment-section');
      if (paySection) {
        paySection.innerHTML = `
          <div class="container" style="text-align:center;padding:4rem 0;">
            <div style="font-size:4rem;color:var(--th-text-muted2);margin-bottom:1rem;"><i class="fas fa-exclamation-triangle"></i></div>
            <h3 style="color:var(--th-heading);margin-bottom:1rem;">No Booking Found</h3>
            <p style="color:var(--th-text-muted);margin-bottom:2rem;">Please complete a booking first before proceeding to payment.</p>
            <a href="booking.html" class="btn btn-primary"><i class="fas fa-calendar-alt"></i> Book a Service</a>
          </div>`;
      }
      return;
    }

    // Fill order summary
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || '—'; };
    setText('os-id', bookingData.bookingId);
    setText('os-service', bookingData.service);
    setText('os-date', new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
    setText('os-vehicle', bookingData.vehicle || 'Not specified');
    setText('os-name', bookingData.firstName + ' ' + bookingData.lastName);

    const total = getPrice(bookingData.service);
    setText('os-total', '$' + total);
    document.getElementById('pay-amount').textContent = '$' + total;

    // Card input formatting
    const cardNum = document.getElementById('card-number');
    const cardExp = document.getElementById('card-expiry');
    if (cardNum) cardNum.addEventListener('input', function () { this.value = formatCardNumber(this.value); });
    if (cardExp) cardExp.addEventListener('input', function () { this.value = formatExpiry(this.value); });

    // Payment method toggle
    const radios = document.querySelectorAll('input[name="payment"]');
    const cardForm = document.getElementById('card-form');
    radios.forEach(r => {
      r.addEventListener('change', () => {
        if (cardForm) cardForm.style.display = r.value === 'card' ? 'block' : 'none';
      });
    });
    if (cardForm) cardForm.style.display = 'block';

    // Pay button
    const payBtn = document.getElementById('pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', async function () {
        this.disabled = true;
        this.innerHTML = '<span class="spinner"></span> Processing...';

        showLoader(true);
        await new Promise(r => setTimeout(r, 2500));
        showLoader(false);

        // Determine payment method
        const selected = document.querySelector('input[name="payment"]:checked');
        const method = selected ? selected.value : 'card';
        const methodLabels = { card: 'Credit Card', paypal: 'PayPal', applepay: 'Apple Pay', googlepay: 'Google Pay' };

        // Save payment data
        const paymentData = {
          ...bookingData,
          paymentMethod: methodLabels[method] || method,
          paymentTotal: '$' + total,
          paidAt: new Date().toISOString()
        };
        localStorage.setItem('glossforge_payment', JSON.stringify(paymentData));

        // Show success section
        const paySection = document.getElementById('payment-section');
        const successSection = document.getElementById('payment-success');
        if (paySection) paySection.style.display = 'none';
        if (successSection) {
          successSection.style.display = 'block';

          // Fill receipt
          setText('receipt-id', bookingData.bookingId);
          setText('receipt-service', bookingData.service);
          setText('receipt-date', new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }));
          setText('receipt-method', methodLabels[method] || method);
          setText('receipt-total', '$' + total);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Payment successful!', 'success');
        this.innerHTML = '<i class="fas fa-check"></i> Paid';
      });
    }

    // Star rating
    const stars = document.querySelectorAll('#star-rating i');
    const starLabel = document.getElementById('star-label');
    let selectedRating = 0;

    stars.forEach(star => {
      star.addEventListener('mouseenter', function () {
        const val = parseInt(this.dataset.star);
        highlightStars(val, false);
      });
      star.addEventListener('mouseleave', () => {
        highlightStars(selectedRating, true);
      });
      star.addEventListener('click', function () {
        selectedRating = parseInt(this.dataset.star);
        highlightStars(selectedRating, true);
        const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
        if (starLabel) starLabel.textContent = labels[selectedRating] || 'Selected';
      });
    });

    function highlightStars(count, permanent) {
      stars.forEach(s => {
        const val = parseInt(s.dataset.star);
        if (val <= count) {
          s.className = 'fas fa-star' + (permanent ? ' active' : ' hover');
        } else {
          s.className = 'fas fa-star' + (permanent ? '' : '');
        }
        if (permanent) s.classList.remove('hover');
      });
    }

    // Submit review
    const submitReview = document.getElementById('submit-review');
    if (submitReview) {
      submitReview.addEventListener('click', function () {
        if (selectedRating === 0) {
          showToast('Please select a star rating.', 'error');
          return;
        }

        const reviewText = document.getElementById('review-text')?.value?.trim() || '';
        const reviewData = {
          bookingId: bookingData.bookingId,
          rating: selectedRating,
          review: reviewText,
          name: bookingData.firstName + ' ' + bookingData.lastName,
          service: bookingData.service,
          date: new Date().toISOString()
        };

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('glossforge_reviews') || '[]');
        existing.push(reviewData);
        localStorage.setItem('glossforge_reviews', JSON.stringify(existing));

        // Show thanks
        document.getElementById('review-thanks').style.display = 'block';
        this.style.display = 'none';
        document.getElementById('star-rating').style.pointerEvents = 'none';
        document.getElementById('review-text').disabled = true;

        showToast('Thank you for your review!', 'success');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initPaymentPage);

  function showToast(msg, type) {
    if (window.showToast) window.showToast(msg, type);
  }
})();
