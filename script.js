(function () {
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Theme toggle
  $('#themeToggle').addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Mobile menu
  var menuBtn = $('#menuBtn'), links = $('#navLinks');
  function setMenu(open) {
    links.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('is-open')); });
  $$('a', links).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Timeline filter
  var items = $$('.log__item');
  $$('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var f = chip.dataset.filter;
      items.forEach(function (it) { it.hidden = f !== 'all' && it.dataset.phase !== f; });
    });
  });

  // One entrance: the lead figure counts up once. The real number is already in the HTML.
  var fig = $('#heroFigure');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fig && !reduce) {
    var target = parseInt(fig.dataset.count, 10), start = performance.now(), dur = 700;
    (function tick(now) {
      var p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      fig.textContent = Math.round(target * e).toLocaleString('id-ID');
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  // Active nav link + back-to-top
  var sections = $$('main section[id], header.hero'), toTop = $('#toTop'), navAs = $$('.nav__links a');
  function onScroll() {
    var y = window.scrollY + 120, cur = '';
    sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
    navAs.forEach(function (a) {
      if (a.getAttribute('href') === '#' + cur) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
})();
