/* Bouton retour en haut, année du footer */
(function () {
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var btn = document.getElementById('toTop');
  if (!btn) return;
  btn.hidden = false;

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 2);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
