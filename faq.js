/* APRODEC - FAQ (PRD 6.3)
   L'accordéon utilise <details>/<summary> : il fonctionne même si ce script ne charge pas.
   Ce script ajoute : un seul panneau ouvert à la fois (anciens navigateurs)
   et la mise en évidence du thème visible dans le menu latéral. */
(function () {
  'use strict';
  var items = [].slice.call(document.querySelectorAll('.fq-item'));
  var groups = [].slice.call(document.querySelectorAll('.fq-group'));

  /* un seul panneau ouvert : natif via l'attribut name ; repli pour les anciens navigateurs */
  if (!('name' in HTMLDetailsElement.prototype)) {
    items.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* menu latéral : le thème à l'écran est mis en évidence */
  var links = [].slice.call(document.querySelectorAll('.fq-nav a'));
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    groups.forEach(function (g) { io.observe(g); });
  }
})();