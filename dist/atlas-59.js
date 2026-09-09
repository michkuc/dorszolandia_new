import { atlasProfiles } from './atlas-profiles.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
}[c]));

const legacyCourtIds = new Set([
  'krol','krolowa','rycerz','czarodziej','lucznik','blazen','mnich','kowal','minstrel',
  'zielarka','pisarz','kupiec','straznik','wojownik','zwiadowca','mysliwy','krzyzowiec','pogromca-smokow'
]);

// Postacie 43–59 korzystają z najlepszych dostępnych, lokalnych ilustracji ról.
// Dzięki temu Atlas nie zależy od nieistniejącego katalogu assets/canon i nie generuje 404.
const lateArt = [
  'generated/roles/czytelnik.png',      // 43 Bibliotekarz Książkołuski
  'generated/roles/ogrodniczka.png',    // 44 Florka Kwiatopłetwa
  'generated/roles/majsterkowicz.png',  // 45 Deskopłetwy
  'generated/roles/architektka.png',    // 46 Wstążka Fala
  'generated/roles/szachistka.png',     // 47 Gambit Płetwa
  'generated/roles/reporter.png',       // 48 Kapitan Czarnopłetwy
  'generated/roles/ratownik.png',       // 49 Błyskawiczny Płetw
  'generated/roles/detektyw.png',       // 50 Detektyw Łuszczek
  'generated/roles/siatkarka.png',      // 51 Serwus Siatkopłetwy
  'generated/roles/mechanik.png',       // 52 Bramkownik Bulgot
  'generated/roles/koszykarz.png',      // 53 Koszor Płetwa
  'generated/roles/wynalazczyni.png',   // 54 Judomir Pas
  'generated/roles/pilkarz.png',        // 55 Golik Fala
  'generated/roles/listonosz.png',      // 56 Biegus Prąd
  'generated/roles/plywak.png',         // 57 Aqua Nurta
  'generated/roles/tenisistka.png',     // 58 Rakietnik Topspin
  'generated/roles/kolarz.png'          // 59 Kołopłetwy Sprint
];

const FALLBACK_ART = 'assets/generated/dorsz-baza-transparent.png';

function artFor(profile, index) {
  if (index < 18) return `assets/source/${profile.id}.webp`;
  if (index < 42) return `assets/generated/zawod-${String(index - 18).padStart(2, '0')}-transparent.png`;
  return `assets/${lateArt[index - 42] || 'generated/dorsz-baza-transparent.png'}`;
}

function groupFor(index) {
  if (index < 18) return 'Dwór i legendy';
  if (index < 42) return 'Miasto i zawody';
  if (index < 50) return 'Nowe role';
  return 'Sport';
}

function removeLegacyCourtCards() {
  $$('#residentGrid .person-card').forEach(card => {
    if (legacyCourtIds.has(card.dataset.personId)) card.remove();
  });
  const oldFilter = $('#categoryFilters [data-category="Dwór Królewski"]');
  if (oldFilter) oldFilter.style.display = 'none';
}

function installImageFallback(scope = document) {
  $$('img[data-atlas-art]', scope).forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = FALLBACK_ART;
    }, { once: true });
  });
}

function installStyles() {
  if ($('#atlas59-styles')) return;
  const style = document.createElement('style');
  style.id = 'atlas59-styles';
  style.textContent = `
    .atlas59-shell{margin-top:2.4rem;padding-top:2rem;border-top:1px solid rgba(8,127,205,.18)}
    .atlas59-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:1rem}
    .atlas59-head h3{font-size:clamp(1.55rem,3vw,2.2rem);margin:.15rem 0;color:#062c62}
    .atlas59-head p{max-width:800px;margin:.35rem 0;color:#36546c;line-height:1.55}
    .atlas59-count{flex:none;padding:.55rem .8rem;border-radius:999px;background:#e8fbff;color:#067ea7;font-weight:900}
    .atlas59-filters{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0 1.25rem}
    .atlas59-filters button{border:1px solid #b9dfeb;background:#fff;color:#0a5078;border-radius:999px;padding:.55rem .8rem;font:inherit;font-weight:800;cursor:pointer}
    .atlas59-filters button.is-active{background:#087fcd;color:#fff;border-color:#087fcd}
    .atlas59-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1rem}
    .atlas59-card{border:1px solid rgba(8,127,205,.16);border-radius:22px;background:rgba(255,255,255,.94);padding:0;overflow:hidden;text-align:left;cursor:pointer;box-shadow:0 12px 28px rgba(21,71,105,.08);transition:transform .16s ease,box-shadow .16s ease}
    .atlas59-card:hover,.atlas59-card:focus-visible{transform:translateY(-3px);box-shadow:0 18px 34px rgba(21,71,105,.14)}
    .atlas59-card img{width:100%;height:210px;object-fit:contain;background:linear-gradient(145deg,#eafcff,#fff8df);padding:.45rem}
    .atlas59-copy{display:block;padding:.9rem 1rem 1.05rem}
    .atlas59-copy small{display:block;color:#1388a8;font-weight:900;text-transform:uppercase;letter-spacing:.05em;font-size:.68rem}
    .atlas59-copy strong{display:block;margin:.3rem 0 .15rem;color:#062c62;font-size:1.05rem}
    .atlas59-copy em{display:block;font-style:normal;color:#36546c;font-weight:700;font-size:.85rem}
    .atlas59-copy p{margin:.55rem 0 0;color:#536b7a;line-height:1.45;font-size:.86rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .atlas59-profile{display:grid;grid-template-columns:minmax(220px,330px) 1fr;gap:1.4rem;align-items:start}
    .atlas59-profile>img{width:100%;max-height:420px;object-fit:contain;border-radius:22px;background:linear-gradient(145deg,#eafcff,#fff8df)}
    .atlas59-profile blockquote{margin:.7rem 0 1rem;padding:.75rem 1rem;border-left:4px solid #18c5dc;background:#f2fbff;border-radius:0 14px 14px 0;color:#073d79;font-weight:800}
    .atlas59-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem;margin:1rem 0}
    .atlas59-facts div{padding:.7rem .8rem;background:#f5fbff;border:1px solid #cfeaf1;border-radius:14px}
    .atlas59-facts dt{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;font-weight:900;color:#1189aa}
    .atlas59-facts dd{margin:.2rem 0 0;color:#073d79}
    .atlas59-story{margin-top:.85rem;padding-top:.85rem;border-top:1px solid #d7e9ef}
    .atlas59-story h3{margin:.1rem 0 .35rem;color:#062c62}
    @media(max-width:980px){.atlas59-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:720px){.atlas59-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.atlas59-card img{height:170px}.atlas59-head{align-items:start;flex-direction:column}.atlas59-profile{grid-template-columns:1fr}.atlas59-profile>img{max-height:300px}.atlas59-facts{grid-template-columns:1fr}}
    @media(max-width:430px){.atlas59-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function openProfile(profile, index) {
  const modal = $('#modal');
  const content = $('#modalContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <article class="atlas59-profile">
      <img data-atlas-art src="${artFor(profile,index)}" alt="${esc(profile.name)}" />
      <div>
        <p class="kicker">Wielka Księga Bohaterów · postać ${index + 1} z ${atlasProfiles.length}</p>
        <h2>${esc(profile.name)}</h2>
        <h3>${esc(profile.role)}</h3>
        <blockquote>„${esc(profile.quote)}”</blockquote>
        <dl class="atlas59-facts">
          <div><dt>Miejsce</dt><dd>${esc(profile.place)}</dd></div>
          <div><dt>Charakter</dt><dd>${esc(profile.character)}</dd></div>
          <div><dt>Talent</dt><dd>${esc(profile.talent)}</dd></div>
          <div><dt>Słabość</dt><dd>${esc(profile.weakness)}</dd></div>
        </dl>
        <section class="atlas59-story"><h3>Historia postaci</h3><p>${esc(profile.history)}</p></section>
        <section class="atlas59-story"><h3>Mini-historia / zaczep fabularny</h3><p>${esc(profile.hook)}</p></section>
        ${profile.potential ? `<section class="atlas59-story"><h3>Potencjał postaci</h3><p>${esc(profile.potential)}</p></section>` : ''}
      </div>
    </article>`;
  installImageFallback(content);
  if (!modal.open) modal.showModal();
}

function installAtlas59() {
  if (atlasProfiles.length !== 59) {
    console.error(`[Dorszolandia] Błąd Atlasu: oczekiwano 59 profili, otrzymano ${atlasProfiles.length}.`);
    return;
  }

  installStyles();
  removeLegacyCourtCards();

  const section = $('#mieszkancy .wrap');
  const residentGrid = $('#residentGrid');
  if (!section || !residentGrid || $('#atlas59')) return;

  const intro = $('#mieszkancy .section-heading p:not(.kicker)');
  if (intro) intro.textContent = 'Bohaterowie głównego cyklu i mieszkańcy Neptunopolu są pokazani osobno. Poniżej znajduje się niezależny Atlas 59 postaci Dorszolandii.';

  const shell = document.createElement('section');
  shell.className = 'atlas59-shell';
  shell.id = 'atlas59';
  shell.innerHTML = `
    <div class="atlas59-head">
      <div><p class="kicker">Niezależny atlas świata</p><h3>Wielka Księga Bohaterów — 59 postaci</h3>
      <p>Dwór, magia, rzemiosło, mieszkańcy miasta, odkrywcy i sportowcy. Kliknij kartę, aby zobaczyć pełny profil: miejsce, charakter, talent, słabość, historię i zaczep fabularny.</p></div>
      <span class="atlas59-count">${atlasProfiles.length} postaci</span>
    </div>
    <div class="atlas59-filters" aria-label="Filtry Atlasu 59"></div>
    <div class="atlas59-grid" aria-live="polite"></div>`;

  const more = $('#showAllResidents');
  if (more) more.after(shell); else residentGrid.after(shell);

  const filters = $('.atlas59-filters', shell);
  const grid = $('.atlas59-grid', shell);
  const groups = ['Wszystkie','Dwór i legendy','Miasto i zawody','Nowe role','Sport'];
  let active = 'Wszystkie';

  const render = () => {
    filters.innerHTML = groups.map(group => `<button type="button" class="${group === active ? 'is-active' : ''}" data-atlas-group="${esc(group)}">${esc(group)}</button>`).join('');
    grid.innerHTML = atlasProfiles.map((profile,index) => ({profile,index,group:groupFor(index)}))
      .filter(item => active === 'Wszystkie' || item.group === active)
      .map(({profile,index,group}) => `
        <button class="atlas59-card" type="button" data-atlas-index="${index}">
          <img data-atlas-art src="${artFor(profile,index)}" alt="" loading="lazy" />
          <span class="atlas59-copy"><small>${esc(group)} · ${index + 1}/59</small><strong>${esc(profile.name)}</strong><em>${esc(profile.role)}</em><p>${esc(profile.history)}</p></span>
        </button>`).join('');
    installImageFallback(grid);
  };

  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-atlas-group]');
    if (!button) return;
    active = button.dataset.atlasGroup;
    render();
  });

  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-atlas-index]');
    if (!card) return;
    const index = Number(card.dataset.atlasIndex);
    openProfile(atlasProfiles[index], index);
  });

  render();

  const gridObserver = new MutationObserver(removeLegacyCourtCards);
  gridObserver.observe(residentGrid, {childList:true, subtree:true});
  console.info(`[Dorszolandia] Atlas: ${atlasProfiles.length}/59 profili aktywnych.`);
}

window.setTimeout(installAtlas59, 10);
