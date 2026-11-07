/* Bannière de consentement : "Refuser" et "Accepter" ont le même poids visuel.
   Le choix est gardé 6 mois dans le navigateur et modifiable depuis le footer.
   Aucun outil de mesure n'est chargé tant que l'utilisateur n'a pas accepté. */
(function () {
  var KEY = 'aprodec_cookie_consent';
  var banner = document.getElementById('cookieBanner');
  var manage = document.getElementById('manageCookies');
  if (!banner) return;

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (Date.now() - data.date > 1000 * 60 * 60 * 24 * 180) return null; // 6 mois
      return data.choice;
    } catch (e) { return null; }
  }
  function save(choice) {
    try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, date: Date.now() })); } catch (e) {}
  }
  function apply(choice) {
    if (choice === 'accepted') {
      // Ici, plus tard : charger l'outil de statistiques respectueux de la vie privée.
      document.dispatchEvent(new CustomEvent('cookies:accepted'));
    }
  }
  function show() { banner.hidden = false; var b = banner.querySelector('button'); if (b) b.focus({ preventScroll: true }); }
  function hide() { banner.hidden = true; }

  banner.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-cookie]');
    if (!btn) return;
    var choice = btn.getAttribute('data-cookie');
    save(choice); apply(choice); hide();
  });

  if (manage) manage.addEventListener('click', show);

  var current = read();
  if (current === null) show(); else apply(current);
})();
