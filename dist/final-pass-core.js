import { residents } from './data.js';
import { creatorProps } from './catalog.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

// HERO — zachowujemy oryginalną grafikę, ale przywracamy czytelną nazwę krainy i hierarchię informacji.
function finishHero() {
  const hero = $('.hero');
  const actions = $('.hero-actions');
  const title = $('#hero-title');
  if (!hero || !actions || !title || actions.dataset.finished) return;
  actions.dataset.finished = '1';
  title.classList.remove('sr-only');
  title.classList.add('hero-visible-title');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'hero-eyebrow';
  eyebrow.textContent = 'Podwodna kraina przygód';
  const subtitle = document.createElement('p');
  subtitle.className = 'hero-subtitle';
  subtitle.textContent = 'Świat Dorszusia, Borysa, królewskiego dworu i mieszkańców Neptunopolu.';
  actions.insertBefore(eyebrow, title);
  title.after(subtitle);
  const buttonRow = document.createElement('div');
  buttonRow.className = 'hero-button-row';
  [...actions.querySelectorAll(':scope > a.button')].forEach(button => buttonRow.appendChild(button));
  actions.appendChild(buttonRow);
}
finishHero();

// BOHATEROWIE — rozdzielamy bohaterów opowieści od właściwego Dworu Królewskiego.
const storyIds = new Set(['dorszusi','borys','krol-dorsz','babel-maksymalny','algoria']);
const cityIds = new Set(['krolowa-perla','kapitan-luska','doktor-babel-dwor','kronikarz-atrament','gospodarz-muszelka']);
residents.forEach(person => {
  if (storyIds.has(person.id)) person.category = 'Bohaterowie opowieści';
  if (cityIds.has(person.id)) person.category = 'Mieszkańcy Neptunopolu';
});

function enrichCardsFinal() {
  $$('#residentGrid .person-card').forEach(card => {
    const id = card.dataset.personId;
    const person = residents.find(entry => entry.id === id);
    if (person) {
      const category = card.querySelector('.person-copy small');
      if (category) category.textContent = person.category;
    }
    const copy = card.querySelector('.person-copy');
    if (copy && !copy.querySelector('.card-open-cue')) {
      const cue = document.createElement('span');
      cue.className = 'card-open-cue';
      cue.textContent = 'Poznaj postać →';
      copy.appendChild(cue);
    }
  });
}

const residentGrid = $('#residentGrid');
if (residentGrid) {
  new MutationObserver(enrichCardsFinal).observe(residentGrid, { childList: true });
  window.setTimeout(() => {
    const all = $('#categoryFilters [data-category="Wszystkie"]');
    if (all) all.click();
    enrichCardsFinal();
  }, 0);
}

// Król Dorsz ma być bezpośrednio pod główną dwójką jako bohater świata opowieści.
function addStoryKing() {
  const heroes = $('#bohaterowie-opowiesci .wrap');
  if (!heroes || heroes.querySelector('.story-king-card')) return;
  const king = residents.find(person => person.id === 'krol-dorsz');
  if (!king) return;
  const card = document.createElement('article');
  card.className = 'story-king-card';
  card.innerHTML = `<img src="assets/generated/story-characters/krol-dorsz.webp" alt="Król Dorsz" /><div><p class="kicker">Bohater opowieści</p><h3>${escapeHtml(king.name)}</h3><p>${escapeHtml(king.tagline || king.story || '')}</p><button type="button" class="hero-profile-button" data-open-hero="krol-dorsz">Poznaj Króla Dorsza →</button></div>`;
  heroes.appendChild(card);
}
addStoryKing();

// MAPA — współrzędne hotspotów mają odpowiadać całej grafice, bez jej przycinania.
function finishMap() {
  const map = $('.interactive-map');
  const info = $('#mapInfo');
  if (!map) return;
  map.classList.add('map-final');
  if (info) info.setAttribute('aria-live','polite');
  const hint = document.createElement('p');
  hint.className = 'map-hint';
  hint.textContent = 'Wybierz numer na mapie lub miejsce z listy — opis zmieni się bez przeładowania strony.';
  if (!map.parentElement.querySelector('.map-hint')) map.before(hint);
}
finishMap();

// KREATOR — 36/36 pozycji zawsze ma grafikę. Preferujemy lokalne/source assets i źródłowe SVG z wersji Drive.
const sourceSvg = {
  'maska-nurka': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyODAgMTkwIj48cGF0aCBkPSJNMzIgNjZjMzktMzMgODAtMzEgMTEwLTEgMzQtMzIgNzktMjggMTA4IDVsLTE4IDcxYy04IDI4LTU3IDMzLTc2IDdsLTE1LTIxLTE0IDIxYy0xOSAyNS02OSAyMC03Ny04eiIgZmlsbD0iIzY0ZDNmMyIgc3Ryb2tlPSIjMTgzNjZlIiBzdHJva2Utd2lkdGg9IjEwIi8+PHBhdGggZD0iTTEzOCA3NXY0OSIgc3Ryb2tlPSIjMTgzNjZlIiBzdHJva2Utd2lkdGg9IjEwIi8+PHBhdGggZD0iTTI0OCA3MmgyM3Y3NGMwIDE4LTkgMjgtMjQgMzIiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzE4MzY2ZSIgc3Ryb2tlLXdpZHRoPSIxMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+',
  sluchawki: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNjAgMjIwIj48cGF0aCBkPSJNNDUgMTE4YzAtNzAgMzUtOTkgODUtOTkgNTIgMCA4NiAzNSA4NiA5OSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMTgzNjZlIiBzdHJva2Utd2lkdGg9IjIwIi8+PHJlY3QgeD0iMjIiIHk9IjEwMyIgd2lkdGg9IjUyIiBoZWlnaHQ9Ijg2IiByeD0iMjQiIGZpbGw9IiMyZDc1ZDYiIHN0cm9rZT0iIzE4MzY2ZSIgc3Ryb2tlLXdpZHRoPSI5Ii8+PHJlY3QgeD0iMTg3IiB5PSIxMDMiIHdpZHRoPSI1MiIgaGVpZ2h0PSI4NiIgcng9IjI0IiBmaWxsPSIjMmQ3NWQ2IiBzdHJva2U9IiMxODM2NmUiIHN0cm9rZS13aWR0aD0iOSIvPjwvc3ZnPg==',
  roslinka: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMjUwIj48cGF0aCBkPSJNMTg1IDI5QzkzIDM4IDQ0IDg2IDQyIDE2MmM1OCAxNSAxMTYtMTYgMTQzLTEzM3oiIGZpbGw9IiM1NWJmNjEiIHN0cm9rZT0iIzE4MzY2ZSIgc3Ryb2tlLXdpZHRoPSI5Ii8+PHBhdGggZD0iTTQ1IDIwNWMzNC02MiA2Ny05OSAxMTktMTQ1IiBzdHJva2U9IiMyNzc5NDAiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==',
  narzedzia: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMjAgMjYwIj48cGF0aCBkPSJNNDggNDVoMTExYzE4IDAgMjUgMTAgMjIgMzBsLTcgMzRINTd6IiBmaWxsPSIjOGU5YWE1IiBzdHJva2U9IiMxODM2NmUiIHN0cm9rZS13aWR0aD0iMTAiLz48cGF0aCBkPSJtMTA4IDEwNC0zOCAxMzMiIHN0cm9rZT0iIzhiNTgyYyIgc3Ryb2tlLXdpZHRoPSIyNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9zdmc+'
};
const localArt = {
  korona:'assets/props/korona.webp', helm:'assets/props/helm.webp', 'czapka-kapitana':'assets/props/czapka-kapitana.webp',
  okulary:'assets/props/gogle.webp', pilka:'assets/props/pilka.webp', aparat:'assets/props/aparat.webp', gitara:'assets/props/gitara.webp',
  lupa:'assets/props/lornetka.webp'
};
const driveArt = {
  czapka:'https://drive.google.com/thumbnail?id=1NXOGJuK74ft-ksWc04RVKOjFYr9XaIbL&sz=w800',
  plecak:'https://drive.google.com/thumbnail?id=1pXDnvG_fiHFalhEaQzquy9elMLKFNQpC&sz=w800',
  stetoskop:'https://drive.google.com/thumbnail?id=1vPxwlDBLH4HOqKfWPCIT-BKwSBKk_zxU&sz=w800',
  ksiazka:'https://drive.google.com/thumbnail?id=1ziobV72LPKSubv0L047V3bwFapRUPpwc&sz=w800',
  pedzel:'https://drive.google.com/thumbnail?id=1mOUIimoYXnNXF5Q3yrGLkMio_hPe0IVy&sz=w800',
  paleta:'https://drive.google.com/thumbnail?id=1mOUIimoYXnNXF5Q3yrGLkMio_hPe0IVy&sz=w800'
};
const glyphs = {mucha:'🎀',mapa:'🗺️',kompas:'🧭',latarka:'🔦',tablet:'▣',mikroskop:'🔬',odznaka:'★',flaga:'⚑',gwizdek:'♪',dzwonek:'🔔',bilet:'🎟',chronobabel:'◉',latarnia:'🏮',puchar:'🏆',rakieta:'🚀',meduza:'🪼',ksiezyc:'☾','stara-mapa':'📜'};
function polishedFallback(label, glyph='✦') {
  const safe = escapeHtml(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 190"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7feff"/><stop offset="1" stop-color="#bdefff"/></linearGradient></defs><rect x="5" y="5" width="230" height="180" rx="34" fill="url(#g)" stroke="#087fcd" stroke-width="7"/><circle cx="120" cy="82" r="53" fill="#fff" opacity=".84"/><text x="120" y="105" text-anchor="middle" font-size="62" font-family="Segoe UI Emoji,Arial">${glyph}</text><text x="120" y="162" text-anchor="middle" font-size="15" font-family="Arial" font-weight="700" fill="#073d79">${safe}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
creatorProps.forEach(prop => {
  prop.src = localArt[prop.id] || sourceSvg[prop.id] || driveArt[prop.id] || prop.src || polishedFallback(prop.label, glyphs[prop.id]);
});

function refreshCreatorPaletteFinal() {
  const palette = $('#accessoryPalette');
  if (!palette) return;
  palette.innerHTML = creatorProps.map(prop => `<button type="button" class="prop-button" data-prop-id="${prop.id}" title="${escapeHtml(prop.label)}"><img src="${prop.src}" alt="" loading="lazy" /><span>${escapeHtml(prop.label)}</span></button>`).join('');
  const heading = $('#kreator .section-heading>div');
  if (heading && !$('#propReadiness')) {
    const status = document.createElement('p');
    status.id = 'propReadiness';
    status.className = 'prop-readiness';
    status.innerHTML = `<b>${creatorProps.length}/36</b> rekwizytów aktywnych · przeciąganie · rozmiar · obrót · warstwy`;
    heading.appendChild(status);
  }
}
refreshCreatorPaletteFinal();

document.addEventListener('error', event => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  const button = image.closest('.prop-button');
  if (!button || image.dataset.finalFallback) return;
  const prop = creatorProps.find(item => item.id === button.dataset.propId);
  if (!prop) return;
  image.dataset.finalFallback = '1';
  image.src = polishedFallback(prop.label, glyphs[prop.id]);
}, true);

// Warstwy dla rekwizytów — stan jest zachowywany także po ponownym renderowaniu elementu przez app.js.
const layerState = new Map();
let topLayer = 20;
let bottomLayer = 1;
function applyLayerState() {
  $$('#placedItems .placed-prop').forEach(item => {
    if (!layerState.has(item.dataset.itemId)) layerState.set(item.dataset.itemId, 10);
    item.style.zIndex = String(layerState.get(item.dataset.itemId));
  });
}
function addLayerControls() {
  const actions = $('#kreator .inline-actions');
  if (!actions || $('#bringFront')) return;
  const front = document.createElement('button');
  front.id = 'bringFront'; front.type = 'button'; front.className = 'button outline small'; front.textContent = 'Na wierzch';
  const back = document.createElement('button');
  back.id = 'sendBack'; back.type = 'button'; back.className = 'button outline small'; back.textContent = 'Pod spód';
  actions.prepend(back); actions.prepend(front);
  const selected = () => $('#placedItems .placed-prop.is-selected');
  front.addEventListener('click', () => { const item = selected(); if (!item) return; layerState.set(item.dataset.itemId, ++topLayer); applyLayerState(); });
  back.addEventListener('click', () => { const item = selected(); if (!item) return; layerState.set(item.dataset.itemId, --bottomLayer); applyLayerState(); });
  const placed = $('#placedItems');
  if (placed) new MutationObserver(applyLayerState).observe(placed, { childList:true, subtree:true });
  applyLayerState();
}
addLayerControls();

// BIBLIOTEKA — bez ingerencji w tekst źródłowy, tylko czytelniejsza informacja i wygląd.
function finishStoryCards() {
  $$('#storyShelf .story-card').forEach(card => {
    const content = card.querySelector('span');
    if (content && !content.querySelector('.full-text-badge')) {
      const badge = document.createElement('i');
      badge.className = 'full-text-badge';
      badge.textContent = 'Pełny tekst · bez skrótów';
      content.insertBefore(badge, content.firstChild);
    }
  });
}
const shelf = $('#storyShelf');
if (shelf) {
  new MutationObserver(finishStoryCards).observe(shelf, { childList:true });
  finishStoryCards();
}
