/* =========================================================
   APRODEC : filtre des activités par rubrique (js/activites.js)
   Boutons : .chip[data-filter]  |  Cartes : .news[data-cat]
   Valeurs : all, solidarite, rencontres, micro
   ========================================================= */
(function () {
  'use strict';

  var grid = document.getElementById('actGrid');
  if (!grid) return;

  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = grid.querySelectorAll('.news[data-cat]');
  var empty = document.getElementById('filterEmpty');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function apply(filter) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = filter === 'all' || card.getAttribute('data-cat') === filter;
      card.hidden = !match;
      card.classList.remove('act-pop');
      if (match) {
        shown++;
        if (!reduce) {
          void card.offsetWidth; // relance l'animation
          card.classList.add('act-pop');
        }
      }
    });

    chips.forEach(function (chip) {
      var on = chip.getAttribute('data-filter') === filter;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (empty) empty.hidden = shown !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      apply(chip.getAttribute('data-filter'));
    });
  });

  apply('all');
})();