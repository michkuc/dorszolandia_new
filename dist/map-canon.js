const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const atlasPlaces = {
  'zamek-krolewski': {
    name: 'Pałac Koralu',
    type: 'Atlas Dworu Koralu',
    description: 'Siedziba Króla Koralisa I i Królowej Perleny w Neptunopolu. To centrum spraw dworskich, dyplomacji i pałacowych tajemnic.',
    people: 'Król Koralis I, Królowa Perlena, Sir Mieczopłetw, Plumcio Rozbawiony',
    mission: 'Odszukaj drogę do Pałacu Koralu i wymyśl, co może kryć zamknięta od stu lat komnata.'
  },
  'wieza-czarodzieja': {
    name: 'Wieża Prądów',
    type: 'Magia i wiedza',
    description: 'Wieża Mistrza Bąblomira na obrzeżach Neptunopolu. To miejsce eksperymentów z magią bąbli, prądów wodnych i świetlistych muszli.',
    people: 'Mistrz Bąblomir',
    mission: 'Wymyśl bezpieczne zaklęcie, które pomoże zatrzymać bąbel, w którym czas płynie do tyłu.'
  },
  'kuznia-kowala': {
    name: 'Dzielnica Rzemieślników',
    type: 'Rzemiosło',
    description: 'Tu pracuje Młotopłetwy, królewski kowal i konstruktor. W jego kuźni powstają miecze, narzędzia oraz niezwykłe urządzenia napędzane energią kominów hydrotermalnych.',
    people: 'Młotopłetwy',
    mission: 'Wybierz trzy narzędzia potrzebne do naprawy podwodnego wynalazku.'
  },
  'smocza-grota': {
    name: 'Koralowy Kanion',
    type: 'Rubieże Dorszolandii',
    description: 'Odludny kanion, w którym Drakoryn odnalazł tajemnicze jajo i wychował morskiego smoka Pyrtka. To punkt wypraw, odkryć i zagadek dawnych stworzeń.',
    people: 'Drakoryn i Pyrtek',
    mission: 'Znajdź bezpieczną trasę do kanionu i wymyśl, co może oznaczać ściana pokryta wizerunkami setek smoków.'
  }
};

function patchLabels() {
  Object.entries(atlasPlaces).forEach(([id, place]) => {
    $$(`[data-map-id="${id}"]`).forEach(node => {
      const label = node.querySelector('b');
      if (label) label.textContent = place.name;
      node.setAttribute('aria-label', place.name);
    });
  });
  const subtitle = $('.hero-subtitle');
  if (subtitle) subtitle.textContent = 'Świat Dorszusia i Borysa, mieszkańców Neptunopolu oraz niezależnego Atlasu Dworu Koralu.';
}

function showPlace(id) {
  const place = atlasPlaces[id];
  const info = $('#mapInfo');
  if (!place || !info) return;
  $$('[data-map-id]').forEach(node => node.classList.toggle('is-active', node.dataset.mapId === id));
  info.innerHTML = `
    <p class="kicker">${escapeHtml(place.type)}</p>
    <h3>${escapeHtml(place.name)}</h3>
    <p>${escapeHtml(place.description)}</p>
    <p class="map-people"><b>Spotkasz tu:</b> ${escapeHtml(place.people)}</p>
    <p class="map-mission"><b>Misja:</b> ${escapeHtml(place.mission)}</p>`;
}

patchLabels();
const mapRoot = $('#mapa');
if (mapRoot) new MutationObserver(patchLabels).observe(mapRoot, { childList: true, subtree: true });

document.addEventListener('click', event => {
  const node = event.target.closest('[data-map-id]');
  if (!node || !atlasPlaces[node.dataset.mapId]) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  showPlace(node.dataset.mapId);
}, true);
