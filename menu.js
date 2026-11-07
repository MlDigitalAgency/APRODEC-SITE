/* Menu mobile + comportement du header au défilement */
(function () {
  document.documentElement.classList.add('js');

  var header = document.getElementById('header');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!header || !toggle || !nav) return;

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });

  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });

  // En repassant au format bureau, on referme le panneau
  window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  // Le header rétrécit après un peu de défilement
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-small', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
