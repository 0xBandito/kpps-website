/* ============================================
   Kraska Psychology & Performance
   Main JavaScript — shared across all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ── Footer year ────────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Header scroll ───────────────────────────────────────────────
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Mobile nav toggle ───────────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // ── Active nav link ─────────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── Scroll-triggered fade-ups ───────────────────────────────────
  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // ── Count-up animation ──────────────────────────────────────────
  function animateCount(el) {
    var target = parseInt(el.dataset.target);
    var duration = 1400;
    var start = performance.now();
    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count-up').forEach(function (el) {
      countObserver.observe(el);
    });
  }

  // ── Hero line reveal (homepage) ─────────────────────────────────
  var lineInners = document.querySelectorAll('.hero h1 .line-inner');
  if (lineInners.length) {
    lineInners.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('revealed'); }, 150 + i * 180);
    });
    var delay = 150 + lineInners.length * 180 + 100;
    setTimeout(function () {
      var sub = document.querySelector('.hero-sub');
      var actions = document.querySelector('.hero-actions');
      var stats = document.querySelector('.hero-stats');
      if (sub) sub.classList.add('revealed');
      if (actions) actions.classList.add('revealed');
      if (stats) stats.classList.add('revealed');
    }, delay);
  }

  // ── Article filter (articles.html) ─────────────────────────────
  var filterBtns = document.querySelectorAll('.filter-btn');
  var articleCards = document.querySelectorAll('.article-card[data-category]');
  if (filterBtns.length && articleCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var filter = btn.dataset.filter;
        articleCards.forEach(function (card) {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
        });
      });
    });
  }

  // ── Contact form validation ─────────────────────────────────────
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      contactForm.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
      contactForm.querySelectorAll('.form-error').forEach(function (el) { el.classList.remove('visible'); });

      contactForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
          var errEl = field.parentNode.querySelector('.form-error');
          if (errEl) errEl.classList.add('visible');
        }
      });

      var emailField = contactForm.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailField.value)) {
          valid = false;
          emailField.classList.add('error');
          var errEl = emailField.parentNode.querySelector('.form-error');
          if (errEl) { errEl.textContent = 'Please enter a valid email address.'; errEl.classList.add('visible'); }
        }
      }

      if (valid) {
        var formData = new FormData(contactForm);
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.success) {
            contactForm.reset();
            contactForm.style.display = 'none';
            var success = document.querySelector('.form-success');
            if (success) success.classList.add('visible');
            window.scrollTo({ top: success.offsetTop - 100, behavior: 'smooth' });
          } else {
            alert('Something went wrong. Please email dr.k@kraskapsychologyandperformance.com directly.');
          }
        })
        .catch(function() {
          alert('Something went wrong. Please email dr.k@kraskapsychologyandperformance.com directly.');
        });
      }
    });

    contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('error');
        var errEl = field.parentNode.querySelector('.form-error');
        if (errEl) errEl.classList.remove('visible');
      });
    });
  }

});