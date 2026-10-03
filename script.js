(function () {
  var root = document.documentElement;

  /* Theme: system -> light -> dark */
  var modes = ['system', 'light', 'dark'];
  var icons = { system: '🖥️', light: '☀️', dark: '🌙' };
  var btn = document.getElementById('themeBtn');
  function getMode() { try { return localStorage.getItem('theme') || 'system'; } catch (e) { return 'system'; } }
  function apply(m) {
    if (m === 'system') root.removeAttribute('data-theme'); else root.dataset.theme = m;
    if (btn) { btn.textContent = icons[m]; btn.setAttribute('aria-label', 'Theme: ' + m); }
  }
  apply(getMode());
  if (btn) btn.addEventListener('click', function () {
    var next = modes[(modes.indexOf(getMode()) + 1) % modes.length];
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  });

  /* Mobile menu */
  var mb = document.getElementById('menuBtn'), links = document.getElementById('links');
  if (mb && links) {
    mb.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      mb.setAttribute('aria-expanded', open);
    });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) links.classList.remove('open'); });
  }

  /* Scroll reveal */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* 3D tilt (desktop mouse only, off for reduced motion) */
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches &&
             !matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (fine) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(800px) rotateY(' + (x * 10) + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* Footer year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* Service worker */
  if ('serviceWorker' in navigator) {
    addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js').catch(function () {});
    });
  }
})();
