/* APRODEC - formulaires (Contact et S'impliquer)
   Envoi par E-MAIL uniquement, sans quitter la page : le message est posté en JSON au service
   indiqué dans data-endpoint (Web3Forms). Il arrive dans la boîte mail utilisée pour créer
   la clé d'accès sur web3forms.com.
   Rien n'est envoyé par SMS ni par téléphone. Une fenêtre confirme l'envoi ou explique l'échec,
   avec un repli WhatsApp (message pré-rempli, que la personne envoie elle-même).
   Sécurité (PRD 10) : champ piège, textContent et DOM uniquement, aucune injection de HTML. */
(function () {
  'use strict';
  var f = document.querySelector('[data-form]');
  if (!f) return;
  var st = f.querySelector('.form-status'),
      btn = f.querySelector('[type="submit"]'),
      sel = f.querySelector('select'),
      saved = [].slice.call(btn.childNodes).map(function (n) { return n.cloneNode(true); });

  /* nom du champ piège anti-robot (doit correspondre au champ caché du formulaire) */
  var TRAP = 'botcheck';

  var ICONS = {
    ok:  { vb: '0 0 512 512', d: 'M256 512a256 256 0 1 1 0-512 256 256 0 1 1 0 512zM374 145.7c-10.7-7.8-25.7-5.4-33.5 5.3L221.1 315.2 169 263.1c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l72 72c5 5 11.8 7.5 18.8 7s13.4-4.1 17.5-9.8L379.3 179.2c7.8-10.7 5.4-25.7-5.3-33.5z' },
    err: { vb: '0 0 512 512', d: 'M256 0c14.7 0 28.2 8.1 35.2 21l216 400c6.7 12.4 6.4 27.4-.8 39.5S486.1 480 472 480L40 480c-14.1 0-27.2-7.4-34.4-19.5s-7.5-27.1-.8-39.5l216-400c7-12.9 20.5-21 35.2-21zm0 352a32 32 0 1 0 0 64 32 32 0 1 0 0-64zm0-192c-18.2 0-32.7 15.5-31.4 33.7l7.4 104c.9 12.5 11.4 22.3 23.9 22.3 12.6 0 23-9.7 23.9-22.3l7.4-104c1.3-18.2-13.1-33.7-31.4-33.7z' }
  };

  /* présélection du choix via ?voie=… ou ?objet=… */
  function pick(v) {
    if (!v || !sel) return;
    Array.prototype.forEach.call(sel.options, function (o) { if (o.value === v) sel.value = v; });
  }
  var qs = new URLSearchParams(location.search);
  pick(qs.get('voie') || qs.get('objet'));
  document.querySelectorAll('[data-voie]').forEach(function (a) {
    a.addEventListener('click', function () { pick(a.dataset.voie); });
  });

  function err(el, m) {
    var e = document.getElementById(el.id + '-err');
    if (e) e.textContent = m;
    el.setAttribute('aria-invalid', m ? 'true' : 'false');
  }
  function msg(t, c) { st.textContent = t; st.className = 'form-status ' + c; }
  function busy(on) {
    btn.disabled = on;
    btn.setAttribute('aria-busy', on ? 'true' : 'false');
    while (btn.firstChild) btn.removeChild(btn.firstChild);
    if (on) {
      var s = document.createElement('span');
      s.className = 'spin'; s.setAttribute('aria-hidden', 'true');
      btn.appendChild(s);
      btn.appendChild(document.createTextNode('Envoi en cours…'));
    } else {
      saved.forEach(function (n) { btn.appendChild(n.cloneNode(true)); });
    }
  }
  var isEmail = function (v) { return /^\S+@\S+\.\S+$/.test(v); };
  var isPhone = function (v) { return /^\+?\d[\d\s().-]{7,}$/.test(v); };

  /* fenêtre de confirmation (utilise les styles .fd du site) */
  function popup(kind, title, text, wa) {
    if (typeof HTMLDialogElement === 'undefined') { msg(title + ' ' + text, kind === 'ok' ? 'is-ok' : 'is-error'); return; }
    var ns = 'http://www.w3.org/2000/svg', ic = ICONS[kind];
    var d = document.createElement('dialog');
    d.className = 'fd' + (kind === 'ok' ? '' : ' is-error');
    d.setAttribute('aria-labelledby', 'fd-title');
    d.setAttribute('aria-describedby', 'fd-text');
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'fd-ico'); svg.setAttribute('viewBox', ic.vb); svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('fill', 'currentColor'); p.setAttribute('d', ic.d);
    svg.appendChild(p);
    var h = document.createElement('h2'); h.id = 'fd-title'; h.textContent = title;
    var t = document.createElement('p'); t.id = 'fd-text'; t.textContent = text;
    var box = document.createElement('div'); box.className = 'fd-actions';
    if (wa) {
      var a = document.createElement('a');
      a.className = 'btn btn-secondary'; a.href = wa; a.target = '_blank'; a.rel = 'noopener';
      a.textContent = 'Écrire sur WhatsApp';
      box.appendChild(a);
    }
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'btn btn-primary'; b.textContent = 'Fermer';
    b.addEventListener('click', function () { d.close(); });
    box.appendChild(b);
    d.appendChild(svg); d.appendChild(h); d.appendChild(t); d.appendChild(box);
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    d.addEventListener('close', function () { d.remove(); btn.focus(); });
    document.body.appendChild(d);
    d.showModal();
    b.focus();
  }

  /* repli : lien WhatsApp avec le message déjà écrit (la personne l'envoie elle-même) */
  function waLink(data, label) {
    var n = f.dataset.whatsapp;
    if (!n) return '';
    var txt = 'Bonjour APRODEC, je suis ' + (data.nom || '') + '.' + (label ? ' Objet : ' + label + '.' : '') + (data.message ? ' ' + data.message : '');
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(txt);
  }

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (f.elements[TRAP] && f.elements[TRAP].value) return;   /* robot : on ignore */

    var bad = null;
    f.querySelectorAll('[required]').forEach(function (el) {
      var m = (el.type === 'checkbox' ? !el.checked : !el.value.trim()) ? 'Ce champ est obligatoire.' : '';
      err(el, m);
      if (m && !bad) bad = el;
    });
    var c = f.elements.contact, v = c ? c.value.trim() : '';
    if (v && !isEmail(v) && !isPhone(v)) { err(c, 'Indiquez un e-mail ou un numéro valable.'); bad = bad || c; }
    if (bad) { bad.focus(); msg('Le formulaire contient des erreurs, merci de les corriger.', 'is-error'); return; }
    msg('', '');

    var data = {};
    new FormData(f).forEach(function (val, key) { if (key !== TRAP) data[key] = val; });
    var label = sel && sel.value ? sel.options[sel.selectedIndex].text : '';
    if (sel && label) data[sel.name] = label;
    var wa = waLink(data, label);

    var url = f.dataset.endpoint;
    if (!url || url.charAt(0) === '[') {
      popup('err', 'Envoi pas encore activé', "L'envoi par e-mail n'est pas encore configuré sur ce site. Vous pouvez nous écrire sur WhatsApp.", wa);
      return;
    }

    /* Web3Forms : le champ « subject » devient l'objet de l'e-mail reçu */
    data.subject = (f.dataset.subject || 'Nouveau message depuis le site APRODEC') + (label ? ' : ' + label : '');
    if (isEmail(v)) data.email = v;                                  /* permet de répondre directement */

    busy(true);
    var ctrl = 'AbortController' in window ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 20000) : null;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, j: j }; });
    }).then(function (res) {
      if (!res.ok || String(res.j.success) === 'false') throw new Error(res.j.message || ('HTTP ' + res.status));
      f.reset();
      f.querySelectorAll('[aria-invalid]').forEach(function (el) { err(el, ''); });
      var first = (data.nom || '').split(' ')[0];
      popup('ok', 'Message envoyé !', (first ? 'Merci ' + first + ', v' : 'V') + "otre message a bien été envoyé à l'association par e-mail. Nous vous répondons rapidement.");
    }).catch(function (e) {
      if (window.console) console.error('Formulaire APRODEC :', e);
      popup('err', "L'envoi a échoué", "Votre message n'est pas parti (" + (e && e.message ? e.message : 'réseau') + '). Réessayez, ou écrivez-nous directement sur WhatsApp.', wa);
    }).then(function () {
      if (timer) clearTimeout(timer);
      busy(false);
    });
  });
})();