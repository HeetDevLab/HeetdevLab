(() => {
  document.documentElement.classList.add('js');

  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const navBackdrop = document.getElementById('navBackdrop');
  const progress = document.getElementById('pageProgress');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  const setMenu = (open) => {
    if (!menuToggle || !mobileNav || !navBackdrop) return;
    body.classList.toggle('menu-open', open);
    menuToggle.classList.toggle('active', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.setAttribute('aria-hidden', String(!open));
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(!body.classList.contains('menu-open'));
  });
  navBackdrop?.addEventListener('click', () => setMenu(false));
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 760) setMenu(false);
  }, { passive: true });

  const updateProgress = () => {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, amount))}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const sectionLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = sectionLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  const portrait = document.querySelector('.portrait-frame img');
  portrait?.addEventListener('error', () => {
    portrait.closest('.portrait-frame')?.classList.add('portrait-missing');
  }, { once: true });
  if (portrait && portrait.complete && portrait.naturalWidth === 0) {
    portrait.closest('.portrait-frame')?.classList.add('portrait-missing');
  }
})();
