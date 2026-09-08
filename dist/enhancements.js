import { residents, places } from './data.js';
import { court, creatorProps } from './catalog.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

// 1. Jedna księga mieszkańców + pełne opisy na kartach.
residents.forEach(person => {
  if (person.category === 'Dwór Króla') person.category = 'Dwór Królewski';
});

const allPeople = [...residents, ...court];
const peopleById = new Map(allPeople.map(person => [person.id, person]));

function enrichResidentCards() {
  $$('#residentGrid .person-card').forEach(card => {
    const person = peopleById.get(card.dataset.personId);
    const copy = card.querySelector('.person-copy');
    if (!person || !copy) return;
    const category = copy.querySelector('small');
    if (category && person.category === 'Dwór Króla') category.textContent = 'Dwór Królewski';
    if (!copy.querySelector('.person-tagline')) {
      const line = document.createElement('span');
      line.className = 'person-tagline';
      line.textContent = person.tagline || person.description || person.story || '';
      copy.appendChild(line);
    }
    if (['dorszusi','borys'].includes(person.id)) card.classList.add('story-hero-card');
  });
}

const residentGrid = $('#residentGrid');
if (residentGrid) {
  new MutationObserver(enrichResidentCards).observe(residentGrid, { childList: true });
  enrichResidentCards();
  const allFilter = $('#categoryFilters [data-category="Wszystkie"]');
  if (allFilter) allFilter.click();
}

// 2. Borys i Dorszuś jako główni bohaterowie opowieści.
function heroCard(person, src, quote) {
  return `<article class="story-hero-profile">
    <div class="story-hero-art"><img src="${src}" alt="${escapeHtml(person.name)}" /></div>
    <div><p class="kicker">${escapeHtml(person.role)}</p><h3>${escapeHtml(person.name)}</h3>
    <p class="story-hero-quote">„${escapeHtml(quote)}”</p>
    <p>${escapeHtml(person.tagline || person.story)}</p>
    <button type="button" class="hero-profile-button" data-open-hero="${person.id}">Poznaj bohatera →</button></div>
  </article>`;
}

function insertStoryHeroes() {
  const residentsSection = $('#mieszkancy');
  if (!residentsSection || $('#bohaterowie-opowiesci')) return;
  const dorszusi = peopleById.get('dorszusi');
  const borys = peopleById.get('borys');
  if (!dorszusi || !borys) return;
  const section = document.createElement('section');
  section.className = 'section story-heroes-section';
  section.id = 'bohaterowie-opowiesci';
  section.innerHTML = `<div class="wrap">
    <div class="section-title centered"><p class="kicker">Bohaterowie opowieści</p><h2>Dorszuś i Borys</h2><p>To ich przyjaźń, pomysły i wspólne przygody napędzają historie Dorszolandii.</p></div>
    <div class="story-heroes-grid">
      ${heroCard(dorszusi, 'assets/generated/story-characters/dorszusi.webp', 'Pomysły najpierw. Instrukcja później.')}
      <div class="hero-duo-link"><span>🤝</span><b>Najlepiej działają razem</b><p>Dorszuś rozpędza przygodę, Borys pilnuje, żeby miała sens. Zwykle.</p><a href="#opowiadania">Czytaj ich przygody →</a></div>
      ${heroCard(borys, 'assets/generated/story-characters/borys.webp', 'Plan, pytania i odrobina sarkazmu.')}
    </div></div>`;
  residentsSection.before(section);
}
insertStoryHeroes();

document.addEventListener('click', event => {
  const button = event.target.closest('[data-open-hero]');
  if (!button) return;
  const person = peopleById.get(button.dataset.openHero);
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  if (!person || !modal || !modalContent) return;
  modalContent.innerHTML = `<article class="profile-modal"><img class="profile-art" src="assets/generated/story-characters/${person.id}.webp" alt="${escapeHtml(person.name)}" /><div><p class="kicker">Bohater opowieści</p><h2>${escapeHtml(person.name)}</h2><h3>${escapeHtml(person.role)}</h3><p>${escapeHtml(person.story || person.tagline)}</p><p><b>Charakter:</b> ${escapeHtml(person.tagline)}</p>${person.fact ? `<p><b>Ciekawostka:</b> ${escapeHtml(person.fact)}</p>` : ''}${person.task ? `<p class="task"><b>Misja:</b> ${escapeHtml(person.task)}</p>` : ''}</div></article>`;
  if (!modal.open) modal.showModal();
});

// 3. Interaktywna mapa z 12 miejscami widocznymi na źródłowej grafice.
const extraPlaces = [
  { id:'zamek-krolewski', name:'Zamek Królewskich Dorszy', type:'Dwór Królewski', description:'Siedziba królewskiego dworu. Tu odbywają się narady, uroczystości i spotkania mieszkańców z Królem Koralisem I i Królową Perleną.', people:['krol','krolowa','rycerz','straznik'], mission:'Znajdź na mapie drogę z Zamku Dorszolandii do królewskiego pałacu.' },
  { id:'wieza-czarodzieja', name:'Wieża Czarodzieja', type:'Magia i nauka', description:'Wieża Mistrza Bąblomira, pełna fiolek, ksiąg, bąbelkowych eksperymentów i zaklęć, które czasem działają trochę bardziej niż planowano.', people:['czarodziej'], mission:'Wymyśl nazwę bezpiecznego zaklęcia, które pomaga mieszkańcom.' },
  { id:'kuznia-kowala', name:'Kuźnia Kowala', type:'Rzemiosło', description:'Warsztat Młotopłetwego. Powstają tu narzędzia, elementy królewskich zbroi oraz wynalazki potrzebne w kolejnych wyprawach.', people:['kowal'], mission:'Wybierz trzy narzędzia, które przydałyby się do naprawy podwodnego pojazdu.' },
  { id:'smocza-grota', name:'Smocza Grota', type:'Miejsce przygód', description:'Skalna grota morskiego smoka Pyrtka. Drakoryn pilnuje, by odwiedzający pamiętali, że nawet wielkie stworzenia potrzebują spokoju i szacunku.', people:['pogromca-smokow'], mission:'Znajdź najbezpieczniejszą drogę od królewskiego zamku do groty.' }
];
const mapPlaces = [...places, ...extraPlaces];
const mapById = new Map(mapPlaces.map(place => [place.id, place]));
const mapPoints = [
  ['szkola',12.5,38.5], ['szpital',31.5,36.5], ['zamek',49.7,19.5], ['zamek-krolewski',80.6,20.0],
  ['arena',44.8,51.5], ['wieza-czarodzieja',62.6,45.5], ['kuznia-kowala',76.4,56.0], ['smocza-grota',91.0,48.0],
  ['port',11.6,64.5], ['laboratorium',38.7,75.0], ['las',61.0,75.5], ['zatoka',83.0,79.0]
].map(([id,x,y]) => ({ id,x,y }));

function peopleNames(place) {
  return (place.people || []).map(id => peopleById.get(id)?.name).filter(Boolean);
}

function renderInteractiveMap() {
  const mapCard = $('.map-card');
  const placeList = $('#placeList');
  if (!mapCard || !placeList || mapCard.querySelector('.map-hotspots')) return;
  mapCard.classList.add('interactive-map');
  const hotspotLayer = document.createElement('div');
  hotspotLayer.className = 'map-hotspots';
  hotspotLayer.setAttribute('aria-label','Interaktywne punkty mapy');
  hotspotLayer.innerHTML = mapPoints.map((point,index) => {
    const place = mapById.get(point.id);
    return `<button type="button" class="map-hotspot" data-map-id="${point.id}" style="--x:${point.x}%;--y:${point.y}%" aria-label="${escapeHtml(place?.name)}"><span>${index+1}</span><b>${escapeHtml(place?.name || '')}</b></button>`;
  }).join('');
  mapCard.appendChild(hotspotLayer);
  placeList.innerHTML = mapPlaces.map((place,index) => `<button class="place-link" type="button" data-map-id="${place.id}"><span>${index+1}</span><b>${escapeHtml(place.name)}</b><small>${escapeHtml(place.type || 'Miejsce Dorszolandii')}</small></button>`).join('');
  const info = document.createElement('article');
  info.id = 'mapInfo';
  info.className = 'map-info';
  placeList.after(info);

  const selectPlace = id => {
    const place = mapById.get(id);
    if (!place) return;
    $$('[data-map-id]').forEach(el => el.classList.toggle('is-active',el.dataset.mapId === id));
    const names = peopleNames(place);
    info.innerHTML = `<p class="kicker">${escapeHtml(place.type || 'Miejsce Dorszolandii')}</p><h3>${escapeHtml(place.name)}</h3><p>${escapeHtml(place.description || place.story || '')}</p>${names.length ? `<p class="map-people"><b>Spotkasz tu:</b> ${escapeHtml(names.join(', '))}</p>` : ''}${place.mission ? `<p class="map-mission"><b>Misja:</b> ${escapeHtml(place.mission)}</p>` : ''}`;
  };
  const intercept = event => {
    const button = event.target.closest('[data-map-id]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    selectPlace(button.dataset.mapId);
  };
  hotspotLayer.addEventListener('click',intercept,true);
  placeList.addEventListener('click',intercept,true);
  placeList.addEventListener('mouseover',event => {
    const button = event.target.closest('[data-map-id]');
    if (button) $$(`.map-hotspot[data-map-id="${button.dataset.mapId}"]`).forEach(pin => pin.classList.add('is-preview'));
  });
  placeList.addEventListener('mouseout',event => {
    const button = event.target.closest('[data-map-id]');
    if (button) $$(`.map-hotspot[data-map-id="${button.dataset.mapId}"]`).forEach(pin => pin.classList.remove('is-preview'));
  });
  selectPlace('zamek');
}
renderInteractiveMap();

// 4. Kreator: 36 pozycji ma grafikę; najpierw używamy zasobów źródłowych/lokalnych.
const driveThumb = id => `https://drive.google.com/thumbnail?id=${id}&sz=w800`;
const localProp = name => `assets/props/${name}.webp`;
const sourcePropArt = {
  czapka: driveThumb('1NXOGJuK74ft-ksWc04RVKOjFYr9XaIbL'), korona: localProp('korona'), helm: localProp('helm'),
  'czapka-kapitana': localProp('czapka-kapitana'), okulary: localProp('gogle'), 'maska-nurka': localProp('gogle'),
  plecak: driveThumb('1pXDnvG_fiHFalhEaQzquy9elMLKFNQpC'), pilka: localProp('pilka'),
  stetoskop: driveThumb('1vPxwlDBLH4HOqKfWPCIT-BKwSBKk_zxU'), ksiazka: driveThumb('1ziobV72LPKSubv0L047V3bwFapRUPpwc'),
  aparat: localProp('aparat'), gitara: localProp('gitara')
};
const propEmoji = {sluchawki:'🎧',mucha:'🎀',lupa:'🔎',mapa:'🗺️',kompas:'🧭',pedzel:'🖌️',paleta:'🎨',latarka:'🔦',tablet:'📱',mikroskop:'🔬',roslinka:'🌱',odznaka:'🏅',flaga:'🚩',gwizdek:'📣',dzwonek:'🔔',bilet:'🎟️',chronobabel:'🫧',latarnia:'🏮',puchar:'🏆',rakieta:'🚀',meduza:'🪼',ksiezyc:'🌙',narzedzia:'🛠️','stara-mapa':'📜'};
function fallbackProp(label,emoji='✦') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e9fbff"/><stop offset="1" stop-color="#bcecff"/></linearGradient></defs><rect x="4" y="4" width="232" height="172" rx="34" fill="url(#g)" stroke="#087fcd" stroke-width="8"/><text x="120" y="108" text-anchor="middle" font-size="76" font-family="Arial">${emoji}</text><circle cx="198" cy="34" r="12" fill="#fff" opacity=".8"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
creatorProps.forEach(prop => { prop.src = sourcePropArt[prop.id] || prop.src || fallbackProp(prop.label,propEmoji[prop.id]); });
function refreshPropPalette() {
  const palette = $('#accessoryPalette');
  if (!palette) return;
  palette.innerHTML = creatorProps.map(prop => `<button type="button" class="prop-button" data-prop-id="${prop.id}"><img src="${prop.src}" alt="" loading="lazy" /><span>${escapeHtml(prop.label)}</span></button>`).join('');
}
refreshPropPalette();

document.addEventListener('error',event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || !img.closest('.prop-button')) return;
  const button = img.closest('[data-prop-id]');
  const prop = creatorProps.find(item => item.id === button?.dataset.propId);
  if (prop && !img.dataset.fallbackApplied) { img.dataset.fallbackApplied='1'; img.src=fallbackProp(prop.label,propEmoji[prop.id]); }
},true);

// 5. Naprawa źródła teledysku i zabezpieczenie kart postaci przed pustym obrazem.
const video = $('.music-grid video');
const videoSource = video?.querySelector('source');
if (video && videoSource && videoSource.getAttribute('src')?.includes('assets/music/')) {
  videoSource.src='assets/stories/piosenka-dorszolandii.mp4';
  video.load();
}
document.addEventListener('error',event => {
  const img=event.target;
  if (!(img instanceof HTMLImageElement)) return;
  if (img.closest('.person-card, .story-hero-profile') && !img.dataset.safeFallback) { img.dataset.safeFallback='1'; img.src='assets/hero/logo-dorszolandia.png'; }
},true);
