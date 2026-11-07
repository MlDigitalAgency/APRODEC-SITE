/* Apparition au défilement + compteurs des chiffres clés */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target; return; }
    var duration = 1200, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var blocks = document.querySelectorAll('.reveal');
  var nums = document.querySelectorAll('[data-count]');

  if (!('IntersectionObserver' in window)) {
    blocks.forEach(function (b) { b.classList.add('is-visible'); });
    nums.forEach(function (n) { n.textContent = n.getAttribute('data-count'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  blocks.forEach(function (b) { io.observe(b); });
})();
