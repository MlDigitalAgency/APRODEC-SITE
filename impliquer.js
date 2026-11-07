/* APRODEC - page S'impliquer
   L'apparition des cartes est gérée en CSS (voir .sp-rise) : ce script n'a plus aucun effet
   sur la visibilité. Il met seulement en évidence la voie choisie et la garde synchronisée
   avec la liste déroulante du formulaire. */
(function () {
  'use strict';
  var cards = [].slice.call(document.querySelectorAll('.sp-way'));
  var sel = document.getElementById('voie');
  function mark(v) {
    cards.forEach(function (c) { c.classList.toggle('is-chosen', !!v && c.dataset.way === v); });
  }
  document.querySelectorAll('[data-voie]').forEach(function (a) {
    a.addEventListener('click', function () { mark(a.dataset.voie); });
  });
  if (sel) { sel.addEventListener('change', function () { mark(sel.value); }); mark(sel.value); }
})();