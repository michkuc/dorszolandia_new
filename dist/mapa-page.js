import { places, adventures } from './data.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const modal = $('#modal');
const modalContent = $('#modalContent');

const canonicalExtras = [
  { id:'zamek-krolewski', name:'Pałac Koralu', type:'Atlas Dworu Koralu', description:'Siedziba Króla Koralisa I i Królowej Perleny w Neptunopolu. To centrum spraw dworskich, dyplomacji i pałacowych tajemnic.', people:['Król Koralis I','Królowa Perlena','Sir Mieczopłetw','Plumcio Rozbawiony'], mission:'Odszukaj drogę do Pałacu Koralu i wymyśl, co może kryć zamknięta od stu lat komnata.' },
  { id:'wieza-czarodzieja', name:'Wieża Prądów', type:'Magia i wiedza', description:'Wieża Mistrza Bąblomira na obrzeżach Neptunopolu. To miejsce eksperymentów z magią bąbli, prądów wodnych i świetlistych muszli.', people:['Mistrz Bąblomir'], mission:'Wymyśl bezpieczne zaklęcie, które pomoże zatrzymać bąbel, w którym czas płynie do tyłu.' },
  { id:'kuznia-kowala', name:'Dzielnica Rzemieślników', type:'Rzemiosło', description:'Tu pracuje Młotopłetwy, królewski kowal i konstruktor. W jego kuźni powstają miecze, narzędzia oraz niezwykłe urządzenia napędzane energią kominów hydrotermalnych.', people:['Młotopłetwy'], mission:'Wybierz trzy narzędzia potrzebne do naprawy podwodnego wynalazku.' },
  { id:'smocza-grota', name:'Koralowy Kanion', type:'Rubieże Dorszolandii', description:'Odludny kanion, w którym Drakoryn odnalazł tajemnicze jajo i wychował morskiego smoka Pyrtka. To punkt wypraw, odkryć i zagadek dawnych stworzeń.', people:['Drakoryn i Pyrtek'], mission:'Znajdź bezpieczną trasę do kanionu i wymyśl, co może oznaczać ściana pokryta wizerunkami setek smoków.' }
];

const basePlaces = places.map(place => ({...place, people: Array.isArray(place.people) ? place.people : []}));
const allPlaces = [...basePlaces, ...canonicalExtras];
const byId = new Map(allPlaces.map(place => [place.id,place]));
const points = [
  ['szkola',12.5,38.5], ['szpital',31.5,36.5], ['zamek',49.7,19.5], ['zamek-krolewski',80.6,20.0],
  ['arena',44.8,51.5], ['wieza-czarodzieja',62.6,45.5], ['kuznia-kowala',76.4,56.0], ['smocza-grota',91.0,48.0],
  ['port',11.6,64.5], ['laboratorium',38.7,75.0], ['las',61.0,75.5], ['zatoka',83.0,79.0]
].map(([id,x,y],index) => ({id,x,y,index:index + 1})).filter(point => byId.has(point.id));

const hotspots = $('#mapHotspots');
const list = $('#mapPlaceList');
const detail = $('#mapDetail');
const adventureRoot = $('#mapAdventures');

function showPlace(id) {
  const place = byId.get(id);
  if (!place) return;
  $$('[data-map-id]').forEach(node => node.classList.toggle('is-active', node.dataset.mapId === id));
  const people = (place.people || []).filter(Boolean);
  detail.innerHTML = `<p class="kicker">${esc(place.type || 'Miejsce Dorszolandii')}</p><h2>${esc(place.name)}</h2><p>${esc(place.description || place.story || '')}</p>${people.length ? `<p class="map-people"><b>Spotkasz tu:</b> ${esc(people.join(', '))}</p>` : ''}${place.mission ? `<p class="map-mission"><b>Misja:</b> ${esc(place.mission)}</p>` : ''}${place.task ? `<p><b>Pomysł:</b> ${esc(place.task)}</p>` : ''}`;
}

hotspots.innerHTML = points.map(point => {
  const place = byId.get(point.id);
  return `<button class="map-page-hotspot" type="button" data-map-id="${point.id}" style="--x:${point.x}%;--y:${point.y}%" aria-label="${esc(place.name)}"><span>${point.index}</span><b>${esc(place.name)}</b></button>`;
}).join('');

list.innerHTML = points.map(point => {
  const place = byId.get(point.id);
  return `<button class="map-page-list-item" type="button" data-map-id="${point.id}"><span>${point.index}</span><span><b>${esc(place.name)}</b><small>${esc(place.type || 'Miejsce Dorszolandii')}</small></span></button>`;
}).join('');

for (const root of [hotspots,list]) {
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-map-id]');
    if (!button) return;
    showPlace(button.dataset.mapId);
  });
}
list.addEventListener('mouseover', event => {
  const button = event.target.closest('[data-map-id]');
  if (!button) return;
  hotspots.querySelector(`[data-map-id="${button.dataset.mapId}"]`)?.classList.add('is-preview');
});
list.addEventListener('mouseout', event => {
  const button = event.target.closest('[data-map-id]');
  if (!button) return;
  hotspots.querySelector(`[data-map-id="${button.dataset.mapId}"]`)?.classList.remove('is-preview');
});

function openAdventure(adventure) {
  modalContent.innerHTML = `<article class="map-adventure-modal"><p class="kicker">Misja Dorszolandii</p><h2>${esc(adventure.title)}</h2><p>${esc(adventure.full || adventure.description || adventure.short || '')}</p>${Array.isArray(adventure.steps) && adventure.steps.length ? `<ol>${adventure.steps.map(step => `<li>${esc(step)}</li>`).join('')}</ol>` : ''}</article>`;
  if (!modal.open) modal.showModal();
}

adventureRoot.innerHTML = adventures.map(adventure => `<button type="button" class="map-adventure-card" data-adventure="${esc(adventure.id)}">${adventure.art ? `<img src="assets/${esc(adventure.art)}" alt="" loading="lazy" />` : '<span class="map-adventure-icon">🐚</span>'}<span><small>Misja</small><strong>${esc(adventure.title)}</strong><p>${esc(adventure.short || adventure.description || '')}</p><b>Otwórz misję →</b></span></button>`).join('');
adventureRoot.addEventListener('click', event => {
  const button = event.target.closest('[data-adventure]');
  if (!button) return;
  const adventure = adventures.find(item => item.id === button.dataset.adventure);
  if (adventure) openAdventure(adventure);
});

showPlace(points.find(point => point.id === 'zamek')?.id || points[0]?.id);
