(function () {
  // Mobile nav
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('menu-links');
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('is-open', !open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    }
  });

  // Nav border on scroll
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu tabs
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.menu-tabs [role="tab"]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab); });
    tab.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var next = tabs[(i + d + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // Photos that fail to load fall back to the colour block
  document.querySelectorAll('.photo img').forEach(function (img) {
    if (img.complete && !img.naturalWidth) img.remove();
    else img.addEventListener('error', function () { img.remove(); });
  });

  // Today's hours + open now (Vancouver time)
  var parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Vancouver', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
  }).formatToParts(new Date());
  var get = function (type) { return (parts.find(function (p) { return p.type === type; }) || {}).value; };
  var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  var mins = Number(get('hour')) * 60 + Number(get('minute'));
  var row = document.querySelector('.hours tr[data-day="' + day + '"]');
  if (row) row.classList.add('is-today');
  var status = document.getElementById('open-now');
  var isOpen = day >= 1 && day <= 6 && mins >= 480 && mins < 1050;
  status.textContent = isOpen ? 'Open now · until 5:30 pm' : 'Closed now · opens ' + (day === 6 && mins >= 1050 || day === 0 ? 'Monday' : mins < 480 ? 'today' : 'tomorrow') + ' at 8:00 am';
  status.classList.add(isOpen ? 'is-open' : 'is-closed');

  // Scroll reveal
  var targets = document.querySelectorAll('.section__head, .card, .menu-list li, .story__copy, .story__photo, .themes div, .visit__info, .visit__map');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
