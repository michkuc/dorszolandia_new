import { residents, places, adventures, categoryOrder, courtResidents } from './data.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const shuffle = array => [...array].sort(() => Math.random() - .5);

const modal = $('#modal');
const modalContent = $('#modalContent');
const toast = $('#toast');
let toastTimer;

const courtMembers = [
  { artIndex: 0, name: 'Król Dorsz Wielki', role: 'Gospodarz miasta', tagline: 'Prowadzi Radę Rafy i pyta mieszkańców, czego potrzebują.', story: 'Król codziennie spotyka się z mieszkańcami przy Placu Bąbelkowym. W jego zamku działa otwarta rada: można przynieść pomysł, prośbę albo dobrą wiadomość dla miasta.' },
  { artIndex: 1, name: 'Królowa Perła', role: 'Opiekunka miejskich świąt', tagline: 'Łączy tradycję, sztukę i wspólne działanie.', story: 'Królowa Perła organizuje koncerty, czytanie opowieści i akcje sąsiedzkie. Uważa, że miasto najlepiej działa wtedy, gdy każdy czuje, że jego głos jest ważny.' },
  { artIndex: 2, name: 'Kapitan Łuska', role: 'Koordynator bezpieczeństwa', tagline: 'Pilnuje bezpieczeństwa podczas wypraw i miejskich wydarzeń.', story: 'Kapitan Łuska ćwiczy z ekipą ratunkową i strażakami. Jego tarcza jest symbolem pomocy, a nie straszenia — najważniejsze jest zawsze spokojne działanie.' },
  { artIndex: 3, name: 'Doktor Bąbel', role: 'Doradca nauki', tagline: 'W zamkowej pracowni zamienia pytania w eksperymenty.', story: 'Doktor Bąbel nie rzuca zaklęć — sprawdza pomysły razem z Naukowcem Bąblem, aby mogły ułatwić życie w mieście i chronić ocean.' },
  { artIndex: 4, name: 'Kronikarz Atrament', role: 'Redaktor kroniki miasta', tagline: 'Zapisuje historie miasta i ważne pomysły mieszkańców.', story: 'Atrament prowadzi Kronikę Dorszolandii. Zapisuje w niej sukcesy, pytania i zabawne pomyłki, żeby każda kolejna ekipa mogła uczyć się z doświadczeń poprzedniej.' },
  { artIndex: 5, name: 'Gospodarz Muszelka', role: 'Opiekun Placu Bąbelkowego', tagline: 'Dba, by spotkania, wymiany i dostawy były uczciwe.', story: 'Muszelka zna mieszkańców po imieniu. Na placu pomaga znaleźć potrzebne rzeczy, wspiera młode pomysły Dorszusiów i pilnuje, by każdy handlował uczciwie.' }
];

const cityStories = [
  {
    id: 'pecherzyk', icon: '🫧', title: 'Wielka Afera z Pęcherzykiem',
    teaser: 'Król Dorsz traci Złoty Pęcherz, a Dorszuś, Borys i mówiący bąbel ruszają jego tropem.',
    people: ['Dorszuś', 'Borys', 'Bąbel Maksymalny', 'Król Dorsz', 'Krab Szczękacz', 'Rekin Filozof'],
    chapters: [
      ['Bąbel, który miał pomysł', 'Dorszuś budował w pracowni bąbelkową maszynę, gdy jeden z bąbli nagle przemówił. Przedstawił się bardzo poważnie jako Bąbel Maksymalny i od razu ogłosił, że miasto potrzebuje jego pomocy.', 'Na Placu Bąbelkowym czekał zmartwiony Król Dorsz. Z jego korony zniknął Złoty Pęcherz — pamiątka po pierwszym dniu Dorszolandii. Król poprosił przyjaciół o spokojne śledztwo, a Borys od razu sprawdził, czy da się to zrobić szybko.'],
      ['Trop z błyszczącej muszli', 'Bąbel Maksymalny zauważył błyszczący ślad prowadzący ku Zatoce Tajemnic. Po drodze Dorszuś zapisywał wskazówki, a Borys wypatrywał ich między wodorostami, żeby nie przeoczyć żadnej drobinki.', 'W zatoce spotkali Kraba Szczękacza. Krab przyznał, że znalazł pęcherz i zabrał go na chwilę do obejrzenia, lecz bąbel sam wypłynął z jego szczypiec. Ostatni raz widział go, jak leciał w stronę Rekina Filozofa.'],
      ['Rekin Filozof kicha', 'Rekin Filozof rzeczywiście miał Złoty Pęcherz, ale trzymał go wyłącznie dlatego, że podobał mu się jego blask. Dorszuś wyjaśnił, dlaczego pamiątka jest ważna dla całego miasta, a Borys zaproponował, by zamiast się kłócić, urządzić pokaz niezwykłych bąbli.', 'Rekin tak się roześmiał, że kichnął ogromną, całkiem bezpieczną chmurą bąbelków. Złoty Pęcherz wrócił prosto w płetwy Dorszusiów, a Bąbel Maksymalny oznajmił, że to był jego najlepiej zaplanowany przypadek.'],
      ['Oficjalni Bohaterowie Dorszolandii', 'Na zamkowym dziedzińcu Król Dorsz przypiął Dorszusowi i Borysowi małe odznaki Bohaterów Miasta. Krab Szczękacz dostał zaproszenie na spotkanie o uczciwym pożyczaniu skarbów, a Rekin Filozof obiecał przynosić własne dekoracje.', 'Od tego dnia Dorszuś i Borys wiedzieli, że dobra przygoda zaczyna się od pytania, a kończy wtedy, gdy każdy może wrócić do domu z uśmiechem. Bąbel Maksymalny uniósł się wyżej i powiedział: „Następna sprawa może być jeszcze bardziej bąbelkowa!”']
    ]
  },
  {
    id: 'plecaki', icon: '🎒', title: 'Zagadka Znikających Plecaków',
    teaser: 'W Szkole Muszelka znikają plecaki. Trop prowadzi do Przystani Ucieczki i ważnej rozmowy.',
    people: ['Dorszuś', 'Borys', 'Pani Świecikora', 'Krab Krabiewicz', 'Zipperius Maximus'],
    chapters: [
      ['Alarm w Szkole Muszelka', 'Pani Świecikora, dyrektorka Szkoły Muszelka, wezwała Dorszusiów, gdy z szatni zaczęły znikać plecaki. Nie zginęły książki ani śniadania — zniknęły właśnie całe plecaki, jeden po drugim.', 'Dorszuś znalazł przy ostatniej ławce nitkę od zamka, a Borys zauważył małe ślady prowadzące ku Przystani Ucieczki. Wskazówka była prosta, ale zagadka wcale nie: dlaczego plecaki chciałyby uciekać ze szkoły?'],
      ['Przystań Ucieczki', 'W ukrytej zatoce czekały dziesiątki plecaków. Przewodził im Zipperius Maximus, czerwony plecak z bardzo poważnym suwakiem. Powiedział, że plecaki nie chcą przeszkadzać rybkom — po prostu są zmęczone noszeniem zbyt wielu rzeczy naraz.', 'Dorszuś wysłuchał go bez przerywania. Borys chciał od razu wszystko spakować z powrotem, lecz zamiast tego zapytał, co można zrobić lepiej. To pytanie zadziałało mocniej niż najgłośniejszy rozkaz.'],
      ['Debata rybek i toreb', 'Do Przystani przypłynęli uczniowie, nauczyciele i nawet Krab Krabiewicz, który znał się na porządkowaniu rzeczy. Wspólnie ustalili, że do szkoły warto brać tylko potrzebne przedmioty, a resztę zostawić w klasowej półce wymiany.', 'Zipperius Maximus zgodził się na próbę. Dorszuś przygotował listę „mało, ale mądrze”, a Borys zaproponował dzień bez ciężkiego plecaka, podczas którego wszyscy sprawdzą, co naprawdę jest im potrzebne.'],
      ['Medal za dobrą rozmowę', 'Nowy sposób zadziałał. Plecaki wróciły do szkoły lżejsze, uczniowie łatwiej znajdowali rzeczy, a w klasach było więcej miejsca na pomysły. Król Dorsz nazwał to Wielką Umową o Rozsądnym Pakowaniu.', 'Dorszuś i Borys nie dostali tym razem złotego pęcherza, lecz medal z napisem: „Najpierw słuchaj”. Borys uznał, że medal jest świetny, jeśli nie trzeba go nosić w plecaku. Zipperius Maximus zapiął suwak i roześmiał się pierwszy.']
    ]
  },
  {
    id: 'algoria', icon: '🌊', title: 'Algoria Powraca',
    teaser: 'Trzy zakończone rozdziały o tajemniczej Aligorii, zbuntowanym pomniku i najdziwniejszym antytrendzie rafy.',
    people: ['Dorszuś', 'Borys', 'Księżniczka Algorytma', 'Pomnik Bąbel', 'Król Dorsz'],
    chapters: [
      ['Ryba z misją', 'Pewnego dnia Dorszuś i Borys znaleźli wiadomość podpisaną przez Algorię — krainę, która potrafi podsuwać pomysły szybciej niż prąd morski. Wiadomość zapraszała ich do rozwiązania zagadki, ale ostrzegała: nie każdy świetny pomysł jest dobry dla wszystkich.', 'Przyjaciele ruszyli razem, bo Dorszuś lubił rozumieć zasady, a Borys umiał zauważyć, kiedy zasady zaczynają przeszkadzać. Właśnie ta różnica miała uratować całe miasto.'],
      ['Księżniczka Algorytma i zbuntowany pomnik', 'W centrum Algorii czekała Księżniczka Algorytma oraz Pomnik Bąbel, który otrzymał zbyt dużo poleceń naraz. Pomnik mówił bez przerwy, pokazywał wszystkim, co mają robić, i nie potrafił już zatrzymać własnego programu.', 'Dorszuś poprosił o instrukcję, Borys o przycisk pauzy, a księżniczka o chwilę ciszy. Kiedy połączyli te trzy rzeczy, Pomnik Bąbel usłyszał najważniejszą komendę: „Sprawdź, czy to pomaga”.'],
      ['Algoria przejmuje śmiech', 'Po powrocie do Dorszolandii algorytm zaczął podpowiadać mieszkańcom te same mody, te same żarty i te same obrazki. Na początku wszyscy się śmiali, ale po chwili nikt nie miał już własnego pomysłu na zabawę.', 'Król Dorsz poprosił Dorszusiów o pomoc. Przyjaciele zrozumieli, że nie trzeba walczyć z technologią — trzeba nauczyć się korzystać z niej mądrze, z miejscem na rozmowę, twórczość i własne zdanie.'],
      ['Najdziwniejszy antytrend rafy', 'Borys wymyślił plan tak dziwny, że algorytm nie umiał go powtórzyć: Dzień Zupełnie Własnego Pomysłu. Jedni śpiewali pod wodą bez słów, inni budowali domki z muszli, a ktoś urządził konkurs na najwolniejszy taniec płetw.', 'Dorszuś dodał prostą zasadę: zanim coś udostępnisz, sprawdź, czy jest prawdziwe, życzliwe i czy naprawdę chcesz to powiedzieć. Algoria zwolniła, a w mieście znowu było słychać różne głosy.'],
      ['Dorszolandia po swojemu', 'Księżniczka Algorytma podziękowała Dorszusowi i Borysowi. Obiecała, że jej wynalazki będą pomagały, a nie decydowały za mieszkańców. Pomnik Bąbel otrzymał nowy, lepszy napis: „Myśl, pytaj, wybieraj”.', 'Historia skończyła się przy wspólnym pikniku na Placu Bąbelkowym. Borys wyłączył wszystkie powiadomienia na godzinę, Dorszuś zostawił sobie jedno pytanie na później, a Król Dorsz ogłosił, że najlepszy trend to taki, w którym każdy może być sobą.']
    ]
  }
];

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
}

function openModal(markup) {
  modalContent.innerHTML = markup;
  if (!modal.open) modal.showModal();
  modal.scrollTop = 0;
}

function closeModal() { if (modal.open) modal.close(); }

function residentById(id) { return residents.find(resident => resident.id === id); }

function residentArtwork(person, alt = '') {
  const badge = person.badge ? `<span class="resident-badge" aria-hidden="true">${escapeHtml(person.badge)}</span>` : '';
  return `<img src="assets/${person.art}" alt="${escapeHtml(alt)}" loading="lazy" />${badge}`;
}

function renderResidents() {
  const grid = $('#residentGrid');
  const filters = $('#categoryFilters');
  let selectedCategory = 'Wszystkie';
  let showAll = false;
  const render = () => {
    filters.innerHTML = categoryOrder.map(category => `<button type="button" class="filter-button ${category === selectedCategory ? 'is-active' : ''}" data-category="${category}">${category}</button>`).join('');
    const matching = selectedCategory === 'Wszystkie' ? residents : residents.filter(person => person.category === selectedCategory);
    const visible = showAll || selectedCategory !== 'Wszystkie' ? matching : matching.slice(0, 8);
    grid.innerHTML = visible.map(person => `
      <button class="resident-card" type="button" data-resident="${person.id}" aria-label="Otwórz profil: ${person.name}, ${person.role}">
        <div class="resident-art">${residentArtwork(person)}</div><h3>${person.name}</h3><p>${person.tagline}</p>
      </button>`).join('');
    const button = $('#showAllResidents');
    button.textContent = showAll ? 'Pokaż wybrane 8 mieszkańców' : `Zobacz wszystkich ${residents.length} mieszkańców →`;
  };
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    selectedCategory = button.dataset.category;
    showAll = selectedCategory !== 'Wszystkie';
    render();
  });
  $('#showAllResidents').addEventListener('click', () => { showAll = !showAll; selectedCategory = 'Wszystkie'; render(); });
  grid.addEventListener('click', event => {
    const card = event.target.closest('[data-resident]');
    if (card) openResident(card.dataset.resident);
  });
  render();
}

function openResident(id) {
  const person = residentById(id);
  if (!person) return;
  openModal(`<article class="profile-modal"><div class="profile-art">${residentArtwork(person, `Ilustracja: ${person.name}`)}</div><div><p class="modal-eyebrow">${person.category} · ${person.place}</p><h2>${person.name}</h2><p><strong>${person.role}</strong> — ${person.tagline}</p><h3>Historia mieszkańca</h3><p>${person.story}</p><h3>Na czym polega jego rola?</h3><p>${person.roleText}</p><div class="fact-box"><strong>Ciekawostka:</strong> ${person.fact}</div><div class="mission-box"><strong>Zadanie dla Ciebie:</strong> ${person.task}</div><button class="button button-sun button-small modal-place-button" data-place-open="${places.find(place => place.name === person.place)?.id || ''}" type="button">Poznaj jego miejsce w Dorszolandii →</button></div></article>`);
}

const pinPositions = {
  szkola: [20, 26], szpital: [43, 24], arena: [62, 27], laboratorium: [80, 26],
  port: [17, 73], las: [38, 75], zatoka: [61, 74], zamek: [82, 72]
};

function renderMap() {
  const pins = $('#mapPins');
  pins.innerHTML = places.map(place => {
    const [left, top] = pinPositions[place.id];
    return `<button class="map-pin" type="button" data-place="${place.id}" style="left:${left}%;top:${top}%"><span class="pin-icon">${place.icon}</span><span class="pin-label">${place.name.replace(' Dorszolandii', '')}</span></button>`;
  }).join('');
  pins.addEventListener('click', event => { const pin = event.target.closest('[data-place]'); if (pin) openPlace(pin.dataset.place); });
}

function openPlace(id) {
  const place = places.find(item => item.id === id);
  if (!place) return;
  const people = place.people.map(residentById).filter(Boolean);
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Miejsce na mapie</p><h2>${place.icon} ${place.name}</h2><p>${place.description}</p><h3>Kto tu działa?</h3><div class="modal-people">${people.map(person => `<button type="button" class="modal-person" data-resident-open="${person.id}">${person.name}</button>`).join('')}</div><div class="mission-box"><strong>Misja:</strong> ${place.mission}</div><div class="fact-box"><strong>Mini-zadanie:</strong> ${place.task}</div></article>`);
}

function renderAdventures() {
  const grid = $('#adventureGrid');
  grid.innerHTML = adventures.map(adventure => `<article class="adventure-card"><img src="assets/${adventure.art}" alt="" loading="lazy" /><div><h3>${adventure.title}</h3><p>${adventure.short}</p></div><button class="round-arrow" type="button" data-adventure="${adventure.id}" aria-label="Otwórz przygodę ${adventure.title}">→</button></article>`).join('');
  grid.addEventListener('click', event => { const button = event.target.closest('[data-adventure]'); if (button) openAdventure(button.dataset.adventure); });
}

function openAdventure(id) {
  const adventure = adventures.find(item => item.id === id);
  if (!adventure) return;
  const steps = id === 'muszla' ? ['Odwiedź Port Muszelka.', 'Porozmawiaj z Fotografem Migawką.', 'Wybierz właściwy trop: piasek, bąbelki czy wiadomość?'] : id === 'bramkarze' ? ['Rozgrzej płetwy.', 'Zagraj w Bramkarza Dorsza.', 'Pamiętaj o fair play po każdym wyniku.'] : ['Odwiedź Las Wodorostów.', 'Wskaż rzeczy, które szkodzą wodzie.', 'Wymyśl jedną własną zmianę dla oceanu.'];
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Przygoda miasta</p><h2>${adventure.icon} ${adventure.title}</h2><p>${adventure.full}</p><h3>Twoja misja</h3><ol class="story-steps">${steps.map(step => `<li>${step}</li>`).join('')}</ol><button class="button button-sun button-small adventure-action" data-adventure-action="${id}" type="button">${id === 'bramkarze' ? 'Zagraj w Bramkarza Dorsza' : 'Wróć na mapę'} →</button></article>`);
}

function showCityStories() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Dorszo-Kumple · ukończone historie</p><h2>Biblioteka Dorszolandii</h2><p>Dorszuś i Borys są częścią dzisiejszego miasta Króla Dorsza. Każda opowieść ma zakończenie, ważną rozmowę i odrobinę bąbelkowego chaosu.</p><div class="story-library">${cityStories.map(story => `<button type="button" class="story-card" data-story-open="${story.id}"><span class="story-card-icon" aria-hidden="true">${story.icon}</span><span><span class="story-status is-complete">Ukończona historia</span><strong>${story.title}</strong><small>${story.teaser}</small></span><b aria-hidden="true">→</b></button>`).join('')}</div><div class="fact-box"><strong>W kronice:</strong> wszystkie trzy opowieści mają pełne zakończenie. Wybierz tytuł, aby przeczytać rozdziały.</div></article>`);
}

function openCityStory(id) {
  const story = cityStories.find(item => item.id === id);
  if (!story) return;
  openModal(`<article class="story-modal"><button type="button" class="story-back" data-stories-home="true">← Wszystkie historie</button><p class="modal-eyebrow">Dorszo-Kumple · pełna opowieść</p><p class="story-status is-complete">Ukończona historia</p><h2>${story.icon} ${story.title}</h2><p>${story.teaser}</p><div class="modal-people">${story.people.map(person => `<span class="modal-person">${person}</span>`).join('')}</div><div class="story-reader">${story.chapters.map(([title, first, second], index) => `<section class="story-chapter"><span class="story-chapter-number">Rozdział ${index + 1}</span><h3>${title}</h3><p>${first}</p><p>${second}</p></section>`).join('')}</div><div class="mission-box"><strong>Po lekturze:</strong> Która decyzja bohaterów była najmądrzejsza? Jak Ty pomógłbyś mieszkańcom Dorszolandii?</div></article>`);
}

let memoryDeck = [];
let memoryOpen = [];
let memoryMatched = new Set();
let memoryLocked = false;

function resetMemory() {
  const selected = shuffle(residents).slice(0, 4);
  memoryDeck = shuffle([...selected, ...selected]);
  memoryOpen = [];
  memoryMatched = new Set();
  memoryLocked = false;
  renderMemory();
}

function renderMemory() {
  const grid = $('#memoryGrid');
  grid.innerHTML = memoryDeck.map((person, index) => {
    const state = memoryMatched.has(index) ? 'is-matched is-open' : memoryOpen.includes(index) ? 'is-open' : '';
    return `<button type="button" class="memory-card ${state}" data-memory-card="${index}" ${memoryMatched.has(index) ? 'disabled' : ''} aria-label="Karta memory ${index + 1}"><span>${memoryOpen.includes(index) || memoryMatched.has(index) ? `<span class="memory-art">${residentArtwork(person, person.role)}</span>` : '🫧'}</span></button>`;
  }).join('');
  const pairs = memoryMatched.size / 2;
  $('#memoryStatus').textContent = pairs === 4 ? 'Brawo! Znalazłeś wszystkie pary!' : `Pary: ${pairs} z 4`;
}

function openMemoryCard(index) {
  if (memoryLocked || memoryMatched.has(index) || memoryOpen.includes(index)) return;
  memoryOpen.push(index);
  renderMemory();
  if (memoryOpen.length !== 2) return;
  memoryLocked = true;
  const [first, second] = memoryOpen;
  if (memoryDeck[first].id === memoryDeck[second].id) {
    memoryMatched.add(first); memoryMatched.add(second); memoryOpen = []; memoryLocked = false; renderMemory();
    if (memoryMatched.size === memoryDeck.length) showToast('Brawo! Wszystkie Dorsze znalazły swoją parę.');
  } else {
    window.setTimeout(() => { memoryOpen = []; memoryLocked = false; renderMemory(); }, 720);
  }
}

let currentQuiz;
function newQuiz() {
  currentQuiz = residents[Math.floor(Math.random() * residents.length)];
  const options = shuffle([currentQuiz.role, ...shuffle(residents.filter(person => person.id !== currentQuiz.id)).slice(0, 3).map(person => person.role)]);
  $('#quizBody').innerHTML = `<p class="quiz-clue">„${currentQuiz.story}”<br /><strong>Jaki to zawód?</strong></p><div class="quiz-options">${options.map(option => `<button type="button" class="quiz-option" data-quiz-answer="${escapeHtml(option)}">${option}</button>`).join('')}</div><p class="quiz-feedback" id="quizFeedback"></p>`;
}

function answerQuiz(button) {
  const answer = button.dataset.quizAnswer;
  const right = answer === currentQuiz.role;
  $$('.quiz-option').forEach(option => {
    option.disabled = true;
    if (option.dataset.quizAnswer === currentQuiz.role) option.classList.add('is-right');
  });
  if (!right) button.classList.add('is-wrong');
  $('#quizFeedback').textContent = right ? `Brawo! To ${currentQuiz.name}.` : `Prawidłowa odpowiedź: ${currentQuiz.role}.`;
}

let goalTimer;
let goalMovement;
let goalRunning = false;
let goalBest = 0;
function moveGoalBall() {
  const field = $('#goalField');
  const ball = $('#goalBall');
  const maxX = Math.max(0, field.clientWidth - ball.offsetWidth - 28);
  const maxY = Math.max(0, field.clientHeight - ball.offsetHeight - 28);
  ball.style.left = `${14 + Math.random() * maxX}px`;
  ball.style.top = `${14 + Math.random() * maxY}px`;
}
function startGoalGame() {
  if (goalRunning) return;
  goalRunning = true;
  let remaining = 15;
  $('#goalScore').textContent = '0';
  $('#goalTime').textContent = String(remaining);
  $('#goalOverlay').classList.add('is-hidden');
  $('#goalBall').classList.add('is-visible');
  moveGoalBall();
  goalMovement = window.setInterval(moveGoalBall, 620);
  goalTimer = window.setInterval(() => {
    remaining -= 1;
    $('#goalTime').textContent = String(remaining);
    if (remaining > 0) return;
    window.clearInterval(goalTimer); window.clearInterval(goalMovement);
    goalRunning = false;
    $('#goalBall').classList.remove('is-visible');
    $('#goalOverlay').classList.remove('is-hidden');
    $('#goalOverlay').innerHTML = `<button class="button button-sun button-small" type="button" id="startGoal">Zagraj jeszcze raz</button>`;
    showToast(`Koniec gry! Twoje obrony: ${$('#goalScore').textContent}.`);
  }, 1000);
}
function saveGoal() {
  if (!goalRunning) return;
  const score = Number($('#goalScore').textContent) + 1;
  $('#goalScore').textContent = String(score);
  if (score > goalBest) { goalBest = score; $('#goalBest').textContent = String(goalBest); }
  moveGoalBall();
}

let foundDifferences = new Set();
function resetDifferences() {
  foundDifferences = new Set();
  $$('#differenceScene [data-difference]').forEach(item => item.classList.remove('is-found'));
  $('#differenceResult').textContent = 'Znajdź 4 ukryte skarby. Klikaj tylko różne elementy!';
}
function setUpDifferences() {
  $('#differenceScene').addEventListener('click', event => {
    const item = event.target.closest('[data-difference]');
    if (!item || foundDifferences.has(item.dataset.difference)) return;
    foundDifferences.add(item.dataset.difference); item.classList.add('is-found');
    $('#differenceResult').textContent = foundDifferences.size === 4 ? 'Brawo! Znalazłeś wszystkie 4 skarby rafy.' : `Znalezione: ${foundDifferences.size} z 4. Szukaj dalej!`;
    if (foundDifferences.size === 4) showToast('Świetne oko! Wszystkie różnice odnalezione.');
  });
  $('#resetDifferences').addEventListener('click', resetDifferences);
}

const accessoryOptions = [
  { key: 'czapka', label: 'Czapka', icon: '🧢', x: 49, y: 19 }, { key: 'korona', label: 'Korona', icon: '👑', x: 50, y: 16 },
  { key: 'helm', label: 'Hełm', icon: '⛑️', x: 49, y: 20 }, { key: 'czapka-kapitana', label: 'Czapka kapitana', icon: '⚓', x: 49, y: 19 },
  { key: 'okulary', label: 'Okulary', icon: '👓', x: 48, y: 42 }, { key: 'maska', label: 'Maska nurka', icon: '🥽', x: 49, y: 42 },
  { key: 'sluchawki', label: 'Słuchawki', icon: '🎧', x: 49, y: 34 }, { key: 'mucha', label: 'Mucha', icon: '🎀', x: 54, y: 58 },
  { key: 'plecak', label: 'Plecak', icon: '🎒', x: 26, y: 60 }, { key: 'pilka', label: 'Piłka', icon: '⚽', x: 77, y: 66 },
  { key: 'lupa', label: 'Lupa', icon: '🔍', x: 72, y: 56 }, { key: 'stetoskop', label: 'Stetoskop', icon: '🩺', x: 52, y: 66 },
  { key: 'ksiazka', label: 'Książka', icon: '📘', x: 70, y: 68 }, { key: 'mapa', label: 'Mapa', icon: '🗺️', x: 70, y: 68 },
  { key: 'kompas', label: 'Kompas', icon: '🧭', x: 73, y: 61 }, { key: 'aparat', label: 'Aparat', icon: '📷', x: 66, y: 54 },
  { key: 'gitara', label: 'Gitara', icon: '🎸', x: 66, y: 70 }, { key: 'pedzel', label: 'Pędzel', icon: '🖌️', x: 72, y: 64 },
  { key: 'paleta', label: 'Paleta', icon: '🎨', x: 70, y: 67 }, { key: 'latarka', label: 'Latarka', icon: '🔦', x: 70, y: 60 },
  { key: 'tablet', label: 'Tablet', icon: '💻', x: 69, y: 66 }, { key: 'mikroskop', label: 'Mikroskop', icon: '🔬', x: 69, y: 64 },
  { key: 'roslinka', label: 'Roślinka', icon: '🌿', x: 29, y: 68 }, { key: 'gwiazdka', label: 'Odznaka', icon: '⭐', x: 60, y: 56 },
  { key: 'choragiewka', label: 'Flaga', icon: '🚩', x: 75, y: 47 }, { key: 'gwizdek', label: 'Gwizdek', icon: '📣', x: 72, y: 61 }
];
const colorFilters = { '#ffad24': 'none', '#33a8e8': 'hue-rotate(135deg) saturate(1.16)', '#f26492': 'hue-rotate(295deg) saturate(1.13)', '#75c95b': 'hue-rotate(74deg) saturate(1.1)', '#8c69e8': 'hue-rotate(218deg) saturate(1.14)' };
let creatorItems = [];
let creatorColor = '#ffad24';
let movingItemId = null;
let selectedItemId = null;
let resizeState = null;

function renderAccessories() {
  $('#accessoryPalette').innerHTML = accessoryOptions.map(accessory => `<button type="button" class="accessory-button" data-accessory="${accessory.key}" title="Dodaj: ${accessory.label}" aria-label="Dodaj ${accessory.label}">${accessory.icon}</button>`).join('');
  const itemMarkup = item => `<button type="button" class="placed-item ${item.id === selectedItemId ? 'is-selected' : ''}" data-item-id="${item.id}" style="left:${item.x}%;top:${item.y}%;z-index:${item.layer};font-size:${item.size}px;transform:translate(-50%,-50%) rotate(${item.angle}deg)" aria-label="${item.label}. Przeciągnij, aby przesunąć. Użyj żółtego uchwytu, aby zmienić wielkość.">${item.icon}<span class="resize-handle" aria-hidden="true">↘</span></button>`;
  const ordered = items => [...items].sort((first, second) => first.layer - second.layer).map(itemMarkup).join('');
  $('#placedItemsBack').innerHTML = ordered(creatorItems.filter(item => item.surface === 'back'));
  $('#placedItemsFront').innerHTML = ordered(creatorItems.filter(item => item.surface !== 'back'));
  $('#layerList').innerHTML = creatorItems.length ? [...creatorItems].sort((first, second) => (first.surface === second.surface ? second.layer - first.layer : first.surface === 'front' ? -1 : 1)).map(item => `<button type="button" class="layer-chip ${item.id === selectedItemId ? 'is-selected' : ''}" data-layer-item="${item.id}"><span>${item.icon}</span>${item.label}<small>${item.surface === 'back' ? 'za' : 'przed'} · ${item.layer}</small></button>`).join('') : '<span class="layer-empty">Dodaj pierwszy rekwizyt z palety.</span>';
  updateAccessoryControls();
}

function updateAccessoryControls() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  const sizeInput = $('#accessorySize');
  const removeButton = $('#removeSelectedAccessory');
  const increaseButton = $('#increaseAccessory');
  const decreaseButton = $('#decreaseAccessory');
  const rotationInput = $('#accessoryRotation');
  const transformButtons = ['layerDown', 'layerUp', 'sendToBack', 'bringToFront', 'sendBehindFish', 'bringBeforeFish', 'resetSelectedAccessory', 'duplicateAccessory', 'centerAccessory'].map(id => $(`#${id}`));
  if (!selected) {
    $('#accessorySelection').textContent = 'Wybierz dodatek na Dorszu, aby go przesunąć, obrócić lub zmienić jego wielkość.';
    sizeInput.value = '48'; rotationInput.value = '0'; $('#accessorySizeValue').textContent = '—'; $('#accessoryRotationValue').textContent = '—';
    sizeInput.disabled = true; rotationInput.disabled = true; removeButton.disabled = true; increaseButton.disabled = true; decreaseButton.disabled = true; transformButtons.forEach(button => { if (button) button.disabled = true; });
    return;
  }
  $('#accessorySelection').textContent = `Wybrano: ${selected.label}. ${selected.surface === 'back' ? 'Za Dorszem' : 'Przed Dorszem'}, warstwa ${selected.layer}.`;
  sizeInput.value = String(selected.size); rotationInput.value = String(selected.angle); $('#accessorySizeValue').textContent = `${selected.size}px`; $('#accessoryRotationValue').textContent = `${selected.angle}°`;
  sizeInput.disabled = false; rotationInput.disabled = false; removeButton.disabled = false; increaseButton.disabled = false; decreaseButton.disabled = false; transformButtons.forEach(button => { if (button) button.disabled = false; });
}

function selectAccessory(id) {
  selectedItemId = creatorItems.some(item => item.id === id) ? id : null;
  $$('.placed-item').forEach(element => element.classList.toggle('is-selected', element.dataset.itemId === selectedItemId));
  updateAccessoryControls();
}

function updateAccessorySize(size) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.size = Math.min(104, Math.max(24, Math.round(Number(size))));
  const element = $(`[data-item-id="${selected.id}"]`);
  if (element) element.style.fontSize = `${selected.size}px`;
  $('#accessorySize').value = String(selected.size); $('#accessorySizeValue').textContent = `${selected.size}px`;
}

function updateAccessoryRotation(angle) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.angle = Math.min(180, Math.max(-180, Math.round(Number(angle))));
  const element = $(`[data-item-id="${selected.id}"]`);
  if (element) element.style.transform = `translate(-50%,-50%) rotate(${selected.angle}deg)`;
  $('#accessoryRotation').value = String(selected.angle); $('#accessoryRotationValue').textContent = `${selected.angle}°`;
}

function setAccessoryLayer(layer) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.layer = Math.min(30, Math.max(1, layer));
  renderAccessories();
}

function setAccessorySurface(surface) {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.surface = surface;
  renderAccessories();
}

function resetSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.x = selected.homeX; selected.y = selected.homeY; selected.size = selected.homeSize; selected.angle = 0; selected.layer = 10; selected.surface = 'front';
  renderAccessories();
}

function duplicateSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  const duplicate = { ...selected, id: `${selected.key}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, x: Math.min(92, selected.x + 7), y: Math.min(88, selected.y + 7), layer: Math.min(30, selected.layer + 1) };
  creatorItems.push(duplicate); selectedItemId = duplicate.id; renderAccessories(); showToast(`${selected.label} skopiowany.`);
}

function centerSelectedAccessory() {
  const selected = creatorItems.find(item => item.id === selectedItemId);
  if (!selected) return;
  selected.x = 50; selected.y = 50; renderAccessories();
}

function addAccessory(key) {
  const option = accessoryOptions.find(item => item.key === key);
  if (!option) return;
  const item = { ...option, id: `${option.key}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, size: 48, homeX: option.x, homeY: option.y, homeSize: 48, angle: 0, layer: 10, surface: 'front' };
  creatorItems.push(item);
  selectedItemId = item.id;
  renderAccessories();
  showToast(`${option.label} dodany. Przeciągnij go lub zmień jego wielkość.`);
}

function setCreatorColor(color) {
  creatorColor = color;
  const colorFilter = colorFilters[color] || 'none';
  $('#creatorFish').style.filter = colorFilter === 'none' ? 'drop-shadow(0 8px 8px rgba(0,63,119,.24))' : `${colorFilter} drop-shadow(0 8px 8px rgba(0,63,119,.24))`;
  $$('.color-dot').forEach(button => button.classList.toggle('is-selected', button.dataset.color === color));
}

function moveCreatorItem(event) {
  if (!movingItemId) return;
  if (resizeState) {
    updateAccessorySize(resizeState.startSize + (event.clientX - resizeState.startX) / 1.3);
    return;
  }
  const rect = $('#creatorStage').getBoundingClientRect();
  const x = Math.min(94, Math.max(6, (event.clientX - rect.left) / rect.width * 100));
  const y = Math.min(92, Math.max(7, (event.clientY - rect.top) / rect.height * 100));
  const item = creatorItems.find(entry => entry.id === movingItemId);
  if (item) { item.x = x; item.y = y; }
  const element = $(`[data-item-id="${movingItemId}"]`);
  if (element) { element.style.left = `${x}%`; element.style.top = `${y}%`; }
}

function loadCreatorFish() {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = 'assets/generated/dorsz-baza-transparent.png';
  });
}

function drawCreatorItem(context, item, stage) {
  context.save();
  context.translate(stage.x + item.x / 100 * stage.width, stage.y + item.y / 100 * stage.height);
  context.rotate(item.angle * Math.PI / 180);
  context.font = `${Math.round(item.size * 1.55)}px sans-serif`;
  context.fillText(item.icon, 0, 0);
  context.restore();
}

async function createFishCardCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 720;
  const context = canvas.getContext('2d');
  const image = await loadCreatorFish();
  const stage = { x: 190, y: 125, width: 700, height: 445 };
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1ab7e9'); gradient.addColorStop(1, '#d4f9ff');
  context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff'; context.font = '900 66px Nunito, sans-serif'; context.textAlign = 'center';
  context.fillText($('#fishName').value.trim() || 'Mój Dorsz', canvas.width / 2, 86);
  [...creatorItems].filter(item => item.surface === 'back').sort((first, second) => first.layer - second.layer).forEach(item => drawCreatorItem(context, item, stage));
  const fishHeight = 410;
  const fishWidth = Math.round(fishHeight * image.width / image.height);
  context.save();
  context.filter = colorFilters[creatorColor] || 'none';
  context.drawImage(image, (canvas.width - fishWidth) / 2, 128, fishWidth, fishHeight);
  context.restore();
  [...creatorItems].filter(item => item.surface !== 'back').sort((first, second) => first.layer - second.layer).forEach(item => drawCreatorItem(context, item, stage));
  context.fillStyle = '#073c87'; context.font = '800 32px Nunito, sans-serif';
  context.fillText(`${$('#fishRole').value} · Dorszolandia`, canvas.width / 2, 650);
  return canvas;
}

async function createCustomFish(event) {
  event.preventDefault();
  const name = escapeHtml($('#fishName').value.trim() || 'Mój Dorsz');
  const role = escapeHtml($('#fishRole').value);
  const addOnText = creatorItems.length ? creatorItems.map(item => item.label.toLowerCase()).join(', ') : 'bez dodatków — gotowy na własny pomysł';
  $('#customCardOutput').classList.add('is-visible');
  $('#customCardOutput').innerHTML = '<p>Tworzymy kartę Twojego Dorsza…</p>';
  try {
    const canvas = await createFishCardCanvas();
    $('#customCardOutput').innerHTML = `<img src="${canvas.toDataURL('image/png')}" alt="Karta mieszkańca: ${name}" /><div><p class="eyebrow eyebrow-blue">Nowy mieszkaniec</p><h3>${name}</h3><p><strong>${role}</strong><br />Akcesoria: ${addOnText}</p></div>`;
    showToast(`${name} dołącza do Dorszolandii!`);
  } catch {
    $('#customCardOutput').classList.remove('is-visible');
    showToast('Nie udało się utworzyć karty. Spróbuj ponownie.');
  }
}

async function downloadCustomFish() {
  try {
    const canvas = await createFishCardCanvas();
    const link = document.createElement('a');
    link.download = `${($('#fishName').value.trim() || 'moj-dorsz').replace(/[^a-z0-9ąćęłńóśźż_-]+/gi, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Karta PNG została przygotowana do pobrania.');
  } catch {
    showToast('Nie udało się przygotować karty. Spróbuj ponownie.');
  }
}

function renderCourt() {
  const grid = $('#courtGrid');
  grid.innerHTML = courtMembers.map((member, index) => `<button type="button" class="court-card" data-court="${index}" aria-label="Poznaj: ${member.name}"><img src="assets/${courtResidents[member.artIndex].art}" alt="" loading="lazy" /><h3>${member.name}</h3><p>${member.role}</p></button>`).join('');
  grid.addEventListener('click', event => { const card = event.target.closest('[data-court]'); if (card) openCourtMember(Number(card.dataset.court)); });
}

function openCourtMember(index) {
  const member = courtMembers[index];
  if (!member) return;
  const courtMember = courtResidents[member.artIndex];
  openModal(`<article class="profile-modal"><div class="profile-art"><img src="assets/${courtMember.art}" alt="Ilustracja: ${member.name}" /></div><div><p class="modal-eyebrow">Dzisiejszy Dwór Króla Dorsza</p><h2>${member.name}</h2><p><strong>${member.role}</strong> — ${member.tagline}</p><h3>Jego rola w mieście</h3><p>${member.story}</p><div class="mission-box"><strong>Mała misja Dworu:</strong> Wymyśl jedną rzecz, o którą Rada Rafy powinna zapytać mieszkańców.</div></div></article>`);
}

function openCourtStory() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Zamek Dorszolandii</p><h2>Współczesny Dwór Króla Dorsza</h2><p>Zamek jest najstarszym miejscem miasta, ale żyje dzisiejszym rytmem. W sali map spotykają się mieszkańcy, nauczyciele, naukowcy i Dorszo-Kumple, kiedy sprawa dotyczy całej rafy.</p><div class="court-story-list">${courtMembers.map(member => `<article><h3>${member.name}</h3><p><strong>${member.role}.</strong> ${member.tagline}</p></article>`).join('')}</div><div class="fact-box"><strong>Ważna zasada Dworu:</strong> dobry pomysł staje się lepszy, gdy można go wspólnie sprawdzić.</div></article>`);
}

function randomResident() {
  const person = residents[Math.floor(Math.random() * residents.length)];
  $('#dreamResult').innerHTML = `<span class="dream-art">${residentArtwork(person)}</span><span><strong>${person.name} — ${person.role}</strong><br /><small>${person.category} · ${person.tagline}</small></span>`;
  $('#dreamResult').classList.add('is-visible');
}

function openShop() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Zapowiedź kolekcji</p><h2>Sklep Dorszolandii</h2><p>Przygotowaliśmy spójną sekcję sklepu, ale nie udajemy działającego koszyka ani płatności. Przed uruchomieniem sprzedaży trzeba podłączyć prawdziwy katalog, regulamin, dostawę i bezpieczne płatności.</p><div class="encyclopedia-grid"><article><span>👕</span><h3>Koszulki</h3><p>Motywy mieszkańców i hasło „Ryby też mają marzenia”.</p></article><article><span>☕</span><h3>Kubki</h3><p>Dla małych i dużych miłośników Dorszolandii.</p></article><article><span>🎒</span><h3>Gadżety</h3><p>Przypinki, zeszyty, torby i zestawy kreatywne.</p></article></div></article>`);
}

function openSong() {
  openModal(`<article class="story-modal"><p class="modal-eyebrow">Melodia miasta</p><h2>♫ Piosenka Dorszolandii</h2><p>Włącz piosenkę i pobaw się razem z mieszkańcami Dorszolandii.</p><video controls preload="metadata" style="width:100%;border-radius:16px;background:#073c87"><source src="assets/stories/piosenka-dorszolandii.mp4" type="video/mp4" />Twoja przeglądarka nie obsługuje odtwarzania filmu.</video></article>`);
}

function setUpEvents() {
  $('#modalClose').addEventListener('click', closeModal);
  modal.addEventListener('click', event => { const rect = modal.getBoundingClientRect(); if (event.target === modal && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeModal(); });
  modalContent.addEventListener('click', event => {
    const person = event.target.closest('[data-resident-open]'); if (person) { openResident(person.dataset.residentOpen); return; }
    const place = event.target.closest('[data-place-open]'); if (place?.dataset.placeOpen) { openPlace(place.dataset.placeOpen); return; }
    const story = event.target.closest('[data-story-open]'); if (story) { openCityStory(story.dataset.storyOpen); return; }
    if (event.target.closest('[data-stories-home]')) { showCityStories(); return; }
    const action = event.target.closest('[data-adventure-action]'); if (action) { closeModal(); document.querySelector(action.dataset.adventureAction === 'bramkarze' ? '#gry' : '#mapa').scrollIntoView({ behavior: 'smooth' }); }
  });
  $('#openStories').addEventListener('click', showCityStories);
  $('#openCourtStory').addEventListener('click', openCourtStory);
  $('#playSong').addEventListener('click', openSong);
  $('#randomResident').addEventListener('click', randomResident);
  $('#shopButton').addEventListener('click', openShop);
  $('#memoryGrid').addEventListener('click', event => { const card = event.target.closest('[data-memory-card]'); if (card) openMemoryCard(Number(card.dataset.memoryCard)); });
  $('#resetMemory').addEventListener('click', resetMemory);
  $('#quizBody').addEventListener('click', event => { const option = event.target.closest('[data-quiz-answer]'); if (option && !option.disabled) answerQuiz(option); });
  $('#nextQuiz').addEventListener('click', newQuiz);
  $('#goalField').addEventListener('click', event => { if (event.target.closest('#startGoal')) startGoalGame(); });
  $('#goalBall').addEventListener('click', saveGoal);
  $('#accessoryPalette').addEventListener('click', event => { const button = event.target.closest('[data-accessory]'); if (button) addAccessory(button.dataset.accessory); });
  $('#colorPicker').addEventListener('click', event => { const button = event.target.closest('[data-color]'); if (button) setCreatorColor(button.dataset.color); });
  $('#clearAccessories').addEventListener('click', () => { creatorItems = []; selectedItemId = null; renderAccessories(); showToast('Akcesoria zostały usunięte.'); });
  $('#accessorySize').addEventListener('input', event => updateAccessorySize(event.target.value));
  $('#accessoryRotation').addEventListener('input', event => updateAccessoryRotation(event.target.value));
  $('#increaseAccessory').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) updateAccessorySize(selected.size + 8); });
  $('#decreaseAccessory').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) updateAccessorySize(selected.size - 8); });
  $('#layerDown').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) setAccessoryLayer(selected.layer - 1); });
  $('#layerUp').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (selected) setAccessoryLayer(selected.layer + 1); });
  $('#sendToBack').addEventListener('click', () => setAccessoryLayer(1));
  $('#bringToFront').addEventListener('click', () => setAccessoryLayer(30));
  $('#sendBehindFish').addEventListener('click', () => setAccessorySurface('back'));
  $('#bringBeforeFish').addEventListener('click', () => setAccessorySurface('front'));
  $('#resetSelectedAccessory').addEventListener('click', resetSelectedAccessory);
  $('#duplicateAccessory').addEventListener('click', duplicateSelectedAccessory);
  $('#centerAccessory').addEventListener('click', centerSelectedAccessory);
  $('#layerList').addEventListener('click', event => { const item = event.target.closest('[data-layer-item]'); if (item) selectAccessory(item.dataset.layerItem); });
  $('#removeSelectedAccessory').addEventListener('click', () => {
    const selected = creatorItems.find(item => item.id === selectedItemId);
    if (!selected) return;
    creatorItems = creatorItems.filter(item => item.id !== selectedItemId); selectedItemId = null; renderAccessories(); showToast(`${selected.label} został usunięty.`);
  });
  $('#creatorForm').addEventListener('submit', createCustomFish);
  $('#downloadFish').addEventListener('click', downloadCustomFish);
  $('#creatorStage').addEventListener('pointerdown', event => {
    const item = event.target.closest('[data-item-id]'); if (!item) return;
    movingItemId = item.dataset.itemId;
    selectAccessory(movingItemId);
    if (event.target.closest('.resize-handle')) {
      const selected = creatorItems.find(entry => entry.id === movingItemId);
      resizeState = { startX: event.clientX, startSize: selected?.size || 48 };
    }
    item.classList.add('is-moving'); item.setPointerCapture(event.pointerId); event.preventDefault();
  });
  $('#creatorStage').addEventListener('pointermove', moveCreatorItem);
  $('#creatorStage').addEventListener('pointerup', event => { const item = event.target.closest('[data-item-id]'); if (item) item.classList.remove('is-moving'); movingItemId = null; resizeState = null; });
  $('#creatorStage').addEventListener('pointercancel', () => { movingItemId = null; resizeState = null; $$('.placed-item').forEach(item => item.classList.remove('is-moving')); });
  const toggle = $('.mobile-toggle');
  toggle.addEventListener('click', () => { const open = $('.nav-links').classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  $$('.nav-links a').forEach(link => link.addEventListener('click', () => { $('.nav-links').classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }));
}

function init() {
  renderResidents(); renderMap(); renderAdventures(); resetMemory(); newQuiz(); setUpDifferences(); renderAccessories(); renderCourt(); setUpEvents();
}

init();
