/* APRODEC - page À propos : photos de secours et agrandissement du plan */
(function () {
  'use strict';
  /* tant qu'un fichier photo manque, la silhouette reste affichée */
  document.querySelectorAll('.ap-photo img').forEach(function (img) {
    img.addEventListener('error', function () { img.remove(); });
  });
  var box = document.getElementById('apLightbox');
  if (box && box.showModal) {
    var big = document.getElementById('apLightboxImg');
    document.querySelectorAll('.ap-zoom').forEach(function (b) {
      b.addEventListener('click', function () {
        big.src = b.getAttribute('data-full');
        big.alt = b.getAttribute('data-alt') || '';
        box.showModal();
      });
    });
    document.getElementById('apLightboxClose').addEventListener('click', function () { box.close(); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  }
})();