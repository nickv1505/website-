(function () {
  'use strict';

  var toast = document.querySelector('.toast');
  var timer;
  function say(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove('is-on'); }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy') ? resolve() : reject(new Error('copy failed'));
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(ta);
      }
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (btn) {
      copyText(btn.getAttribute('data-copy')).then(
        function () {
          if (btn.classList.contains('copy')) {
            btn.classList.add('is-done');
            btn.textContent = 'Copied';
            setTimeout(function () { btn.classList.remove('is-done'); btn.textContent = 'Copy'; }, 1600);
          }
          say('Copied to clipboard');
        },
        function () { say('Copy failed. Select the text instead.'); }
      );
      return;
    }
    if (e.target.closest('[data-print]')) window.print();
  });

  // Reveal sections
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
