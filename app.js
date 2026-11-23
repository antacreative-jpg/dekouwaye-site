/* DEKOUWAYE – logique du site (menu, recherche, détail, favoris, publication) */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fcfa = n => Number(n).toLocaleString('fr-FR').replace(/[  ]/g, ' ') + ' FCFA';
const norm = s => (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PH = 'assets/placeholder.svg';
const imgTag = (src, alt) => `<img src="${esc(src || PH)}" alt="${esc(alt || '')}" loading="lazy" onerror="this.onerror=null;this.src='${PH}'">`;

function store(k, def) { try { const v = JSON.parse(localStorage.getItem(k)); return v === null ? def : v; } catch (e) { return def; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
const allLogements = () => LOGEMENTS.concat(store('dek_annonces', []));
const getFavs = () => store('dek_favs', []);
const params = () => new URLSearchParams(location.search);

/* ---------- en-tête / pied de page ---------- */
function layout() {
  const page = document.body.dataset.page;
  const on = p => (page === p ? 'on' : '');
  $('#site-header').outerHTML = `
  <header class="hd"><div class="wrap hd-in">
    <a href="index.html" class="logo"><img src="assets/logo.png" alt="DEKOUWAYE"></a>
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false">☰</button>
    <div class="menu" id="menu">
      <nav class="nav">
        <a href="index.html" class="${on('home')}">Accueil</a>
        <a href="recherche.html" class="${on('search')}">Trouver un logement</a>
        <a href="publier.html" class="${on('publish')}">Publier une annonce</a>
        <a href="a-propos.html" class="${on('about')}">À propos</a>
      </nav>
      <div class="hd-r">
        <a href="favoris.html">♡ Favoris <span id="favcount">0</span></a>
        <a href="connexion.html">Se connecter</a>
        <a class="btn btn-o" href="publier.html">Publier une annonce</a>
      </div>
    </div>
  </div></header>`;
  $('#site-footer').outerHTML = `
  <footer class="ft"><div class="wrap">
    <div class="ft-g">
      <div><img src="assets/logo-blanc.png" alt="DEKOUWAYE"><p>Trouvez. Visitez. Décidez. Emménagez.</p></div>
      <div><h4>Explorer</h4><a href="index.html">Accueil</a><a href="recherche.html">Trouver un logement</a><a href="publier.html">Publier une annonce</a><a href="favoris.html">Favoris</a></div>
      <div><h4>DEKOUWAYE</h4><a href="a-propos.html">À propos</a><a href="contact.html">Contact</a></div>
      <div><h4>Suivez-nous</h4><p>Les liens vers les réseaux sociaux seront ajoutés lorsque les comptes officiels seront disponibles.</p></div>
    </div>
    <div class="ft-b">© ${new Date().getFullYear()} DEKOUWAYE. Tous droits réservés.</div>
  </div></footer>`;
  const b = $('.burger'), m = $('#menu');
  b.addEventListener('click', () => { const o = m.classList.toggle('open'); b.setAttribute('aria-expanded', o); });
  updateFavCount();
}
function updateFavCount() { const c = $('#favcount'); if (c) c.textContent = getFavs().length; }

/* ---------- cartes ---------- */
function loc(l) { return l.quartier + ', ' + l.ville; }
function feat(l) { return l.chambres + ' chambre' + (l.chambres > 1 ? 's' : '') + (l.surface ? ' · ' + l.surface + ' m²' : ''); }
function card(l) {
  const fav = getFavs().includes(l.id);
  return `<article class="card">
    <a class="card-img" href="logement.html?id=${l.id}">${imgTag(l.photos && l.photos[0], l.titre)}<span class="badge">${l.dispo ? 'Disponible' : 'À louer · disponibilité à vérifier'}</span></a>
    <button class="heart ${fav ? 'on' : ''}" data-fav="${l.id}" aria-label="Ajouter aux favoris" title="Favoris">♥</button>
    <div class="card-b"><span class="eyebrow">${esc(l.type)}</span>
      <h3><a href="logement.html?id=${l.id}">${esc(l.titre)}</a></h3>
      <p>${esc(loc(l))}</p><p>${feat(l)}</p>
      <div class="card-f"><b>${fcfa(l.prix)} / mois</b><a href="logement.html?id=${l.id}">Voir le logement →</a></div>
    </div></article>`;
}
document.addEventListener('click', e => {
  const h = e.target.closest('[data-fav]'); if (!h) return;
  e.preventDefault();
  const id = Number(h.dataset.fav); let f = getFavs();
  f = f.includes(id) ? f.filter(x => x !== id) : f.concat(id);
  save('dek_favs', f); updateFavCount();
  const p = document.body.dataset.page;
  if (p === 'favs') renderFavs(); else $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle('on', f.includes(id)));
});

/* ---------- accueil ---------- */
function initHome() {
  $('#home-listings').innerHTML = allLogements().slice(0, 6).map(card).join('');
  $('#cats').innerHTML = CATEGORIES.map(c => `<a class="tile big" href="recherche.html?type=${encodeURIComponent(c[0])}">${imgTag(c[2], c[1])}<span>${c[1]}</span></a>`).join('');
  $('#quartiers').innerHTML = QUARTIERS.map(q => `<a class="tile sm" href="recherche.html?lieu=${encodeURIComponent(q[0])}">${imgTag(q[1], q[0])}<span>${q[0]}</span></a>`).join('');
}

/* ---------- recherche ---------- */
function initSearch() {
  const p = params(), f = $('#filters');
  ['lieu', 'type', 'min', 'max', 'tri'].forEach(k => { if (f[k] && p.get(k)) f[k].value = p.get(k); });
  if (p.get('budget') && !p.get('max')) f.max.value = p.get('budget');
  const lieu = norm(f.lieu.value), type = f.type.value;
  const min = Number(f.min.value) || 0, max = Number(f.max.value) || Infinity;
  let r = allLogements().filter(l =>
    (!lieu || norm(l.quartier + ' ' + l.ville + ' ' + l.titre).includes(lieu)) &&
    (!type || l.type === type) && l.prix >= min && l.prix <= max);
  if (f.tri.value === 'asc') r.sort((a, b) => a.prix - b.prix);
  if (f.tri.value === 'desc') r.sort((a, b) => b.prix - a.prix);
  $('#count').textContent = r.length + ' résultat' + (r.length > 1 ? 's' : '') + ' · annonces de démonstration';
  $('#results').innerHTML = r.length ? r.map(card).join('') :
    `<div class="empty" style="grid-column:1/-1"><h3>Aucun logement ne correspond à votre recherche.</h3><a class="btn btn-o" href="recherche.html">Réinitialiser les filtres</a></div>`;
  $('#reset').addEventListener('click', () => { location.href = 'recherche.html'; });
}

/* ---------- détail ---------- */
function initDetail() {
  const id = Number(params().get('id')), l = allLogements().find(x => x.id === id), box = $('#detail');
  if (!l) { box.innerHTML = `<div class="empty"><h3>Ce logement est introuvable.</h3><a class="btn btn-o" href="recherche.html">Voir tous les logements</a></div>`; return; }
  document.title = l.titre + ' – DEKOUWAYE';
  const ph = l.photos && l.photos.length ? l.photos : [PH];
  const fav = getFavs().includes(l.id);
  const banner = params().get('nouveau') ? `<div class="alert"><b>Votre annonce a été enregistrée sur cet appareil.</b> Il s’agit d’une démonstration : elle n’est pas visible par les autres visiteurs.</div>` : '';
  box.innerHTML = `${banner}<div class="detail"><div>
    <div class="gal-main" id="gmain">${imgTag(ph[0], l.titre)}<button class="heart ${fav ? 'on' : ''}" data-fav="${l.id}" aria-label="Favoris">♥</button></div>
    <div class="thumbs">${ph.map((s, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" aria-label="Photo ${i + 1}">${imgTag(s, '')}</button>`).join('')}</div>
    <span class="eyebrow" style="margin-top:28px">${esc(l.type)}</span>
    <h1>${esc(l.titre)}</h1><p>${esc(loc(l))}</p>
    <h2>Description</h2><p>${esc(l.desc)}</p>
    <h2>Caractéristiques</h2><p>${feat(l)} · ${l.meuble ? 'Meublé' : 'Non meublé'} · ${l.dispo ? 'Disponible' : 'Disponibilité à vérifier'}</p>
    <h2>Équipements</h2>${l.equip && l.equip.length ? `<ul>${l.equip.map(e => `<li>${esc(e)}</li>`).join('')}</ul>` : '<p>Non précisés.</p>'}
    <h2>Informations importantes</h2><p>Annonce de démonstration. Vérifiez les informations et la disponibilité avant toute démarche.</p>
    <h2>Localisation</h2><p>${esc(loc(l))} · emplacement précis non communiqué.</p>
  </div>
  <aside class="side"><div class="price">${fcfa(l.prix)}</div><div class="muted" style="margin-top:-8px">par mois · annonce de démonstration</div>
    <a class="btn btn-o btn-block" href="contact.html?logement=${l.id}">Contacter le propriétaire</a>
    <a class="btn btn-l btn-block" href="contact.html?logement=${l.id}&visite=1">Organiser une visite</a>
    <button class="btn btn-l btn-block" data-fav="${l.id}" id="favbtn">${fav ? '♥ Dans mes favoris' : '♡ Ajouter aux favoris'}</button>
  </aside></div>`;
  $$('.thumbs button').forEach(b => b.addEventListener('click', () => {
    $('#gmain img').src = ph[b.dataset.i]; $$('.thumbs button').forEach(x => x.classList.toggle('on', x === b));
  }));
  $('#favbtn').addEventListener('click', () => { setTimeout(() => { $('#favbtn').textContent = getFavs().includes(l.id) ? '♥ Dans mes favoris' : '♡ Ajouter aux favoris'; }); });
}

/* ---------- favoris ---------- */
function renderFavs() {
  const ids = getFavs(), r = allLogements().filter(l => ids.includes(l.id));
  $('#favlist').innerHTML = r.length ? `<div class="grid">${r.map(card).join('')}</div>` :
    `<div class="empty"><h3>Vous n’avez pas encore enregistré de logement.</h3><a class="btn btn-o" href="recherche.html">Explorer les logements</a></div>`;
}

/* ---------- publier une annonce (6 étapes) ---------- */
function initPublish() {
  const form = $('#pub'), steps = $$('.step-box'), dots = $$('.dot'), bar = $('.bar i');
  let cur = 0, photos = [];
  const show = n => {
    cur = n; steps.forEach((s, i) => s.classList.toggle('on', i === n));
    dots.forEach((d, i) => d.classList.toggle('on', i <= n)); bar.style.width = ((n + 1) / steps.length * 100) + '%';
    $('#prev').textContent = n === 0 ? 'Annuler' : 'Précédent';
    $('#next').textContent = n === steps.length - 1 ? 'Publier l’annonce' : 'Continuer';
    if (n === steps.length - 1) recap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const val = k => form.elements[k] ? form.elements[k].value.trim() : '';
  function recap() {
    $('#recap').innerHTML = [
      ['Informations générales', val('titre') + ' · ' + val('type')], ['Localisation', val('quartier') + ', ' + val('ville')],
      ['Prix et caractéristiques', fcfa(val('prix') || 0) + ' / mois · ' + val('chambres') + ' chambre(s)'],
      ['Photos', photos.length + ' photo(s)'], ['Contact', val('nom') + ' · ' + val('tel')]
    ].map(x => `<li><b>✓</b>${esc(x[0])} : ${esc(x[1])}</li>`).join('');
  }
  $('#prev').addEventListener('click', () => { if (cur === 0) location.href = 'index.html'; else show(cur - 1); });
  $('#next').addEventListener('click', () => {
    const fields = $$('input,select,textarea', steps[cur]);
    for (const el of fields) if (!el.checkValidity()) { el.reportValidity(); return; }
    if (cur < steps.length - 1) return show(cur + 1);
    const l = {
      id: Date.now(), type: val('type'), titre: val('titre'), quartier: val('quartier'), ville: val('ville'),
      prix: Number(val('prix')), chambres: Number(val('chambres')), surface: Number(val('surface')) || 0,
      meuble: val('meuble') === 'Meublé', dispo: val('dispo') === 'Disponible', equip: val('equip') ? val('equip').split(',').map(s => s.trim()).filter(Boolean) : [],
      desc: val('desc'), photos: photos.length ? photos : [PH]
    };
    const list = store('dek_annonces', []); list.unshift(l);
    if (!save('dek_annonces', list)) { alert('Impossible d’enregistrer : essayez avec moins ou de plus petites photos.'); return; }
    location.href = 'logement.html?id=' + l.id + '&nouveau=1';
  });
  $('#photos').addEventListener('change', async e => {
    photos = []; const box = $('#previews'); box.innerHTML = '';
    for (const file of [...e.target.files].slice(0, 4)) {
      const url = await shrink(file); photos.push(url); box.insertAdjacentHTML('beforeend', `<img src="${url}" alt="">`);
    }
  });
  show(0);
}
function shrink(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => { const i = new Image(); i.onload = () => {
      const w = Math.min(800, i.width), h = Math.round(i.height * w / i.width), c = document.createElement('canvas');
      c.width = w; c.height = h; c.getContext('2d').drawImage(i, 0, 0, w, h); res(c.toDataURL('image/jpeg', .7));
    }; i.src = r.result; };
    r.readAsDataURL(file);
  });
}

/* ---------- contact ---------- */
function initContact() {
  const id = Number(params().get('logement')), l = allLogements().find(x => x.id === id);
  if (l) { $('#sujet').value = (params().get('visite') ? 'Demande de visite : ' : 'Question sur : ') + l.titre; }
  $('#contact').addEventListener('submit', e => {
    e.preventDefault();
    $('#sent').hidden = false; e.target.hidden = true;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  layout();
  const p = document.body.dataset.page;
  ({ home: initHome, search: initSearch, detail: initDetail, favs: renderFavs, publish: initPublish, contact: initContact }[p] || (() => { }))();
});
