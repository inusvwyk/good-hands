// ── GOOGLE REVIEWS (static) ───────────────────────────────────
(function() {
  var reviews = [
    { name: 'Dewald van Wyk', rating: 5, date: 'Jan 2026', text: 'Easy to book over WhatsApp. They explained what they were doing and kept me updated.' },
    { name: 'Johnny',         rating: 5, date: 'Jan 2026', text: 'Amazing service, a mechanic was dispatched quickly and efficiently to solve the problem. Highly recommended!' },
    { name: 'Nerusha Appalraju', rating: 5, date: 'Jan 2026', text: 'Easy to deal with, used good parts and was thorough with the service. Happy with the work!' },
    { name: 'Craig Bennett',  rating: 5, date: 'Mar 2026', text: 'Great service from the guys at Goodhands. Was stranded at work and needed my car seen to urgently. Problem was sorted out in under 5 minutes. Very professional and efficient! Highly recommended!' },
    { name: 'Silas Kruger',   rating: 5, date: 'Mar 2026', text: 'Great service. They came out quickly and diagnosed the alternator problem straight away. The repair was done efficiently.' },
  ];

  var loading  = document.getElementById('reviews-loading');
  var grid     = document.getElementById('reviews-grid');
  var ratingEl = document.getElementById('reviews-rating');
  var countEl  = document.getElementById('reviews-count');

  if (loading) loading.classList.add('hidden');
  if (ratingEl) ratingEl.textContent = '4.3 stars';
  if (countEl)  countEl.textContent  = '(6 Google reviews)';

  if (!grid) return;

  grid.innerHTML = reviews.map(function(r) {
    var stars    = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
    var initials = r.name.split(' ').map(function(w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
    return [
      '<div class="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">',
      '  <div class="flex items-center justify-between mb-3">',
      '    <span class="text-amber-400 text-lg" aria-label="' + r.rating + ' stars">' + stars + '</span>',
      '    <span class="text-xs text-gray-400">' + r.date + '</span>',
      '  </div>',
      '  <p class="text-gray-700 text-sm leading-relaxed italic mb-4">"' + r.text + '"</p>',
      '  <div class="flex items-center gap-3">',
      '    <div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0" aria-hidden="true">' + initials + '</div>',
      '    <div>',
      '      <div class="font-semibold text-sm text-gray-900">' + r.name + '</div>',
      '      <div class="text-xs text-gray-400">Google review</div>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('');
  }).join('');

  grid.classList.remove('hidden');

  if (reviews.length === 1) grid.className = grid.className.replace('md:grid-cols-3', 'md:grid-cols-1 max-w-md mx-auto');
  if (reviews.length === 2) grid.className = grid.className.replace('md:grid-cols-3', 'md:grid-cols-2 max-w-2xl mx-auto');
})();

// ── UTILITIES ─────────────────────────────────────────────────
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function trackEvent(eventName, label) {
  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, event_label: label });
  }
}

// ── CALL TRACKING ────────────────────────────────────────────
var lastWaClick = 0;
function fireWaConversion(label) {
  var now = Date.now();
  if (now - lastWaClick < 1000) return; // deduplicate — ignore if fired within 1s
  lastWaClick = now;
  trackEvent('phone_call_click', label);
  if (window.gtag) {
    gtag('event', 'conversion', { send_to: 'AW-17948840298/uDWQCLzt3oMcEOqi1u5C' });
  }
}

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function(link) {
  link.addEventListener('click', function() {
    fireWaConversion(this.dataset.gtm || 'call-unknown');
  });
});

// ── FORM HANDLING ─────────────────────────────────────────────
var form       = document.getElementById('bookingForm');
var successMsg = document.getElementById('formSuccess');
var submitBtn  = document.getElementById('submitBtn');
var formError  = document.getElementById('form-error');

var fields = [
  { id: 'name',  errorId: 'name-error' },
  { id: 'phone', errorId: 'phone-error' },
  { id: 'area',  errorId: 'area-error' },
  { id: 'car',   errorId: 'car-error'  },
  { id: 'issue', errorId: 'issue-error' },
];

function clearErrors() {
  fields.forEach(function(f) {
    var el  = document.getElementById(f.id);
    var err = document.getElementById(f.errorId);
    if (el)  el.classList.remove('error');
    if (err) err.classList.add('hidden');
  });
  if (formError) formError.classList.add('hidden');
}

function showFieldError(fieldId, errorId) {
  var el  = document.getElementById(fieldId);
  var err = document.getElementById(errorId);
  if (el)  el.classList.add('error');
  if (err) err.classList.remove('hidden');
}

function showFormError(message) {
  if (formError) {
    formError.textContent = message;
    formError.classList.remove('hidden');
  }
}

function showSuccess() {
  if (form)       form.hidden = true;
  if (successMsg) successMsg.hidden = false;

  var card = document.getElementById('book');
  if (card) card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });

  trackEvent('form_success', 'booking-complete');
  if (window.gtag) {
    gtag('event', 'form_success', { event_category: 'lead', event_label: 'booking-complete' });
  }
}

function resetSubmitBtn() {
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Get My Free Quote';
  }
}

if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrors();

    var valid = true;
    var firstError = null;

    fields.forEach(function(f) {
      var el = document.getElementById(f.id);
      if (el && !el.value.trim()) {
        showFieldError(f.id, f.errorId);
        if (!firstError) firstError = el;
        valid = false;
      }
    });

    if (!valid) {
      if (firstError) firstError.focus();
      return;
    }

    var areaVal = document.getElementById('area').value;
    if (areaVal === 'Other') {
      var otherVal = document.getElementById('otherArea').value.trim();
      areaVal = otherVal ? 'Other: ' + otherVal : 'Other';
    }

    var data = {
      name:  document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      area:  areaVal,
      car:   document.getElementById('car').value.trim(),
      issue: document.getElementById('issue').value.trim(),
      page:  window.location.href,
      time:  new Date().toISOString(),
    };

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    trackEvent('form_submit', 'booking-form');
    if (window.gtag) {
      gtag('event', 'conversion', { send_to: 'AW-17948840298/ciVoCIC8m_cbEOqi1u5C' });
    }

    // TODO: Replace the URL below with your Formspree endpoint.
    // Sign up at https://formspree.io, create a form, and paste your endpoint here.
    // Example: 'https://formspree.io/f/abcd1234'
    fetch('https://formspree.io/f/mwvyvkkk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function(res) {
        if (res.ok) {
          showSuccess();
        } else {
          resetSubmitBtn();
          showFormError('Something went wrong. Please call us on 069 874 0252 to book.');
        }
      })
      .catch(function() {
        resetSubmitBtn();
        showFormError('Network error. Please call us on 069 874 0252 to book.');
      });
  });
}

// ── OTHER AREA TOGGLE ─────────────────────────────────────────
var areaSelect = document.getElementById('area');
var otherAreaInput = document.getElementById('otherArea');
if (areaSelect && otherAreaInput) {
  areaSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
      otherAreaInput.classList.remove('hidden');
      otherAreaInput.required = true;
    } else {
      otherAreaInput.classList.add('hidden');
      otherAreaInput.required = false;
      otherAreaInput.value = '';
    }
  });
}

// ── SMOOTH SCROLL for #book anchor ───────────────────────────
document.querySelectorAll('a[href="#book"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.getElementById('book');
    if (target) target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

// ── STICKY CALL BAR (mobile) ──────────────────────────────────
(function() {
  var hero = document.getElementById('hero');
  if (!hero) return;

  var bar = document.createElement('div');
  bar.id = 'stickyCta';
  bar.setAttribute('aria-hidden', 'true');

  var phoneIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';

  bar.innerHTML = '<a href="https://wa.me/27698740252" target="_blank" rel="noopener noreferrer" data-gtm="call-sticky" style="color:#fff;text-decoration:none;display:flex;align-items:center;justify-content:center;gap:8px;">' + phoneIcon + ' WhatsApp Us — 069 874 0252</a>';
  bar.style.cssText = [
    'position:fixed', 'bottom:0', 'left:0', 'right:0',
    'background:#16a34a', 'color:#fff',
    'text-align:center', 'padding:14px',
    'font-weight:700', 'font-size:1rem',
    'z-index:999', 'display:none',
    'box-shadow:0 -2px 12px rgba(0,0,0,0.15)',
  ].join(';');
  document.body.appendChild(bar);

  function checkScroll() {
    var heroBottom = hero.offsetTop + hero.offsetHeight;
    if (window.innerWidth <= 768 && window.scrollY > heroBottom) {
      bar.style.display = 'block';
    } else {
      bar.style.display = 'none';
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  window.addEventListener('resize', checkScroll, { passive: true });

  bar.querySelector('a').addEventListener('click', function() {
    fireWaConversion('call-sticky');
  });
})();
