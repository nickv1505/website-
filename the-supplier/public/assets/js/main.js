(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  doc.classList.remove('no-js');

  // ---- Page entrance -------------------------------------------------------
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      body.classList.remove('is-loading');
      body.classList.add('is-ready');
    });
  });

  // ---- Nav state -----------------------------------------------------------
  var nav = document.querySelector('[data-nav]');
  function onScroll() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ---------------------------------------------------------
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    body.style.overflow = open ? 'hidden' : '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && !menu.hidden) setMenu(false);
    });
  }

  // ---- Checkout buttons: loading state ------------------------------------
  document.querySelectorAll('form[data-checkout]').forEach(function (form) {
    form.addEventListener('submit', function () {
      var btn = form.querySelector('button');
      if (!btn) return;
      btn.classList.add('is-busy');
      btn.setAttribute('aria-busy', 'true');
    });
  });
  // Restore buttons when returning with the back button (bfcache).
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.btn.is-busy').forEach(function (b) {
      b.classList.remove('is-busy');
      b.removeAttribute('aria-busy');
    });
  });

  // ---- Checkout status notices --------------------------------------------
  var notices = {
    cancelled: 'Checkout cancelled. No payment was taken. Your access is still one click away.',
    unavailable: 'Checkout is being set up and will be available shortly. Please check back soon.',
    error: "We couldn't start checkout. Please try again in a moment.",
    busy: 'Too many attempts. Please wait a few minutes and try again.',
  };
  var status = new URLSearchParams(window.location.search).get('checkout');
  var notice = document.querySelector('[data-notice]');
  if (status && notices[status] && notice) {
    notice.textContent = notices[status];
    notice.hidden = false;
    if (window.history.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    }
  }

  // ---- Scroll reveals ------------------------------------------------------
  var revealEls = document.querySelectorAll('.reveal, .reveal-line');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---- Card spotlight ------------------------------------------------------
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', e.clientX - r.left + 'px');
      card.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  // ---- Hero pass tilt (fine pointers only) ---------------------------------
  var pass = document.querySelector('[data-tilt]');
  if (pass && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('pointermove', function (e) {
      var r = pass.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      var y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      pass.style.setProperty('--ry', (x * 18).toFixed(2) + 'deg');
      pass.style.setProperty('--rx', (-y * 14).toFixed(2) + 'deg');
    });
    hero.addEventListener('pointerleave', function () {
      pass.style.setProperty('--ry', '0deg');
      pass.style.setProperty('--rx', '0deg');
    });
  }

  // ---- Editorial drift -----------------------------------------------------
  var drifters = document.querySelectorAll('[data-drift]');
  var editorial = document.querySelector('.editorial');
  var ticking = false;
  function drift() {
    ticking = false;
    var r = editorial.getBoundingClientRect();
    var progress = Math.max(-0.5, Math.min(0.5, (window.innerHeight - r.top) / (window.innerHeight + r.height) - 0.5));
    if (window.innerWidth < 640) progress = 0;
    drifters.forEach(function (el) {
      var dir = Number(el.getAttribute('data-drift'));
      el.style.transform = 'translate3d(' + (progress * dir * 40).toFixed(1) + 'px,0,0)';
    });
  }
  if (editorial && drifters.length && !reduceMotion) {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(drift);
      }
    }, { passive: true });
    drift();
  }

  // ---- Mobile buy bar ------------------------------------------------------
  var buybar = document.querySelector('[data-buybar]');
  var heroEl = document.querySelector('.hero');
  var finalEl = document.getElementById('buy');
  if (buybar && heroEl && finalEl && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var finalVisible = false;
    var buyBtn = buybar.querySelector('button');
    var update = function () {
      var show = !heroVisible && !finalVisible;
      buybar.classList.toggle('is-visible', show);
      buybar.setAttribute('aria-hidden', String(!show));
      if (buyBtn) buyBtn.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; update(); }).observe(heroEl);
    new IntersectionObserver(function (e) { finalVisible = e[0].isIntersecting; update(); }).observe(finalEl);
  }

  // ---- Smooth FAQ open/close ----------------------------------------------
  document.querySelectorAll('.qa').forEach(function (qa) {
    var summary = qa.querySelector('summary');
    var answer = qa.querySelector('.qa__a');
    if (!summary || !answer || reduceMotion || !answer.animate) return;
    summary.addEventListener('click', function (e) {
      e.preventDefault();
      if (qa.open) {
        var h = answer.offsetHeight;
        var closing = answer.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 300, easing: 'ease', fill: 'forwards' });
        closing.onfinish = function () { qa.open = false; closing.cancel(); };
      } else {
        qa.open = true;
        var full = answer.offsetHeight;
        answer.animate([{ height: '0px', opacity: 0 }, { height: full + 'px', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.2,.7,.1,1)' });
      }
    });
  });
})();
