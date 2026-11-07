/* =========================================================
   Pages légales : sommaire qui suit la lecture, barre de progression,
   impression, panneau de choix des cookies
   Tout reste lisible si ce script ne se charge pas.
   ========================================================= */
(function () {
  /* ----- sommaire : ouvert sur ordinateur, replié sur téléphone ----- */
  var toc = document.getElementById('lgToc');
  var wide = window.matchMedia('(min-width: 1000px)');
  function syncToc() { if (toc) toc.open = wide.matches; }
  syncToc();
  if (wide.addEventListener) wide.addEventListener('change', syncToc);

  /* un clic sur le sommaire referme la liste sur téléphone */
  var links = document.querySelectorAll('.lg-toc a');
  links.forEach(function (a) {
    a.addEventListener('click', function () { if (!wide.matches && toc) toc.open = false; });
  });

  /* ----- section en cours de lecture ----- */
  var secs = document.querySelectorAll('.lg-sec');
  function setCurrent(id) {
    links.forEach(function (a) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  if ('IntersectionObserver' in window && secs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    secs.forEach(function (s) { io.observe(s); });
  }
  if (secs.length) setCurrent(secs[0].id);

  /* ----- barre de progression de lecture ----- */
  var bar = document.getElementById('lgBar');
  var ticking = false;
  function progress() {
    ticking = false;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? Math.min(100, Math.max(0, (h.scrollTop || document.body.scrollTop) / max * 100)) : 0;
    if (bar) bar.style.width = pct + '%';
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(progress); }
  }, { passive: true });
  progress();

  /* ----- impression ----- */
  var pr = document.getElementById('lgPrint');
  if (pr) pr.addEventListener('click', function () { window.print(); });

  /* ----- panneau de choix des cookies (page cookies) ----- */
  var box = document.getElementById('lgConsent');
  if (!box) return;
  var KEY = 'aprodec_cookie_consent';
  var label = document.getElementById('lgStateText');
  var buttons = box.querySelectorAll('[data-consent]');

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (Date.now() - d.date > 1000 * 60 * 60 * 24 * 180) return null;
      return d.choice;
    } catch (e) { return null; }
  }
  function save(c) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: c, date: Date.now() })); return true; }
    catch (e) { return false; }
  }
  function render() {
    var c = read();
    label.textContent = c === 'accepted' ? 'vous avez accepté la mesure de fréquentation'
                      : c === 'refused'  ? 'vous avez refusé la mesure de fréquentation'
                      : 'aucun choix enregistré';
    buttons.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-consent') === c); });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (!save(b.getAttribute('data-consent'))) {
        label.textContent = 'impossible à enregistrer (stockage du navigateur bloqué)';
        return;
      }
      var banner = document.getElementById('cookieBanner');
      if (banner) banner.hidden = true;
      document.dispatchEvent(new CustomEvent('cookies:' + b.getAttribute('data-consent')));
      render();
    });
  });
  render();
})();
