import { residents, places, adventures, categoryOrder } from './data.js';
import { storyLibrary } from './stories.js';
import { navigation, court, creatorProps, games, collection, storyVolumeLabels } from './catalog.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const inlineArtwork = {
  'inline:dorszusi': 'generated/story-characters/dorszusi.webp',
  'inline:borys': 'generated/story-characters/borys.webp'
};
const imagePath = art => `assets/${inlineArtwork[art] || art}`;
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
const shuffle = list => [...list].sort(() => Math.random() - .5);

const modal = $('#modal');
const modalContent = $('#modalContent');
const toast = $('#toast');
let activeCategory = 'Wszystkie';
let residentsExpanded = false;
let activeVolume = 1;
let activeGame = 'memory';
let creatorItems = [];
let selectedItemId = null;
let goalTimer;

function notice(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(notice.timer);
  notice.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function openModal(content) {
  modalContent.innerHTML = content;
  if (!modal.open) modal.showModal();
}

function closeModal() { if (modal.open) modal.close(); }

function cardImage(item, className = '') {
  return item.art ? `<img class="${className}" src="${imagePath(item.art)}" alt="" loading="lazy" />` : '';
}

function renderNavigation() {
  const links = navigation.map(([label, href]) => `<a href="${href}">${label}</a>`).join('');
  $('#site-menu').innerHTML = links;
  $('#footerNav').innerHTML = `<a href="#start">Start</a>${links}`;
  $('.menu-toggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    $('#site-menu').classList.toggle('is-open', !expanded);
  });
  $$('#site-menu a').forEach(link => link.addEventListener('click', () => {
    $('#site-menu').classList.remove('is-open');
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
  }));
}

function renderPortals() {
  const portals = [
    ['Mieszkańcy', 'Poznaj zawody, marzenia i codzienne supermoce.', '#mieszkancy', '🫧'],
    ['Dwór Króla', 'Pełna drużyna 18 średniowiecznych ryb.', '#dwor-krola', '👑'],
    ['Mapa i misje', 'Otwieraj miejsca i wybieraj wyprawy.', '#mapa', '🗺️']
  ];
  $('#portalGrid').innerHTML = portals.map(([title, copy, href, icon]) => `<a class="portal-card" href="${href}"><span>${icon}</span><h3>${title}</h3><p>${copy}</p><b>Odkryj →</b></a>`).join('');
}

function getVisibleResidents() {
  const filtered = activeCategory === 'Wszystkie' ? residents : residents.filter(person => person.category === activeCategory);
  return residentsExpanded ? filtered : filtered.slice(0, 12);
}

function renderResidents() {
  const available = categoryOrder.filter(category => category === 'Wszystkie' || residents.some(person => person.category === category));
  $('#categoryFilters').innerHTML = available.map(category => `<button class="filter ${category === activeCategory ? 'is-active' : ''}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  $('#residentGrid').innerHTML = getVisibleResidents().map(person => `
    <button class="person-card" type="button" data-person-id="${person.id}">
      <span class="person-art">${cardImage(person)}</span><span class="person-copy"><small>${escapeHtml(person.category)}</small><strong>${escapeHtml(person.name)}</strong><em>${escapeHtml(person.role)}</em></span>
    </button>`).join('');
  const filteredCount = activeCategory === 'Wszystkie' ? residents.length : residents.filter(person => person.category === activeCategory).length;
  const more = $('#showAllResidents');
  more.hidden = residentsExpanded || filteredCount <= 12;
  more.textContent = `Pokaż wszystkich mieszkańców (${filteredCount}) →`;
}

function openPerson(person) {
  openModal(`<article class="profile-modal">${cardImage(person, 'profile-art')}<div><p class="kicker">${escapeHtml(person.category || 'Dorszolandia')}</p><h2>${escapeHtml(person.name)}</h2><h3>${escapeHtml(person.role)}</h3><p>${escapeHtml(person.description || person.story || '')}</p>${person.roleText ? `<p><b>Co robi?</b> ${escapeHtml(person.roleText)}</p>` : ''}${person.fact ? `<p><b>Ciekawostka:</b> ${escapeHtml(person.fact)}</p>` : ''}${person.task ? `<p class="task"><b>Misja:</b> ${escapeHtml(person.task)}</p>` : ''}</div></article>`);
}

function renderCourt() {
  $('#courtGrid').innerHTML = court.map(person => `<button class="court-card" type="button" data-court-id="${person.id}">${cardImage(person)}<span><small>${escapeHtml(person.role)}</small><strong>${escapeHtml(person.name)}</strong></span></button>`).join('');
}

function renderMap() {
  $('#placeList').innerHTML = places.map(place => `<button class="place-link" type="button" data-place-id="${place.id}"><span>⌁</span><b>${escapeHtml(place.name)}</b><small>${escapeHtml(place.type || 'miejsce')}</small></button>`).join('');
  $('#mapPins').innerHTML = places.slice(0, 8).map((place, index) => `<button type="button" data-place-id="${place.id}" style="--pin:${index}">${index + 1}</button>`).join('');
  $('#adventureGrid').innerHTML = adventures.map(adventure => `<button class="adventure-card" type="button" data-adventure-id="${adventure.id}">${cardImage(adventure)}<span><small>Misja</small><strong>${escapeHtml(adventure.title)}</strong><p>${escapeHtml(adventure.short || adventure.description || '')}</p></span></button>`).join('');
}

function openPlace(place) {
  openModal(`<article class="reading-modal"><p class="kicker">${escapeHtml(place.type || 'Miejsce na mapie')}</p><h2>${escapeHtml(place.name)}</h2><p>${escapeHtml(place.description || place.story || '')}</p>${place.mission ? `<p class="task"><b>Misja:</b> ${escapeHtml(place.mission)}</p>` : ''}${place.task ? `<p><b>Pomysł:</b> ${escapeHtml(place.task)}</p>` : ''}</article>`);
}

function openAdventure(adventure) {
  openModal(`<article class="profile-modal">${cardImage(adventure, 'profile-art')}<div><p class="kicker">Miejska misja</p><h2>${escapeHtml(adventure.title)}</h2><p>${escapeHtml(adventure.full || adventure.description || '')}</p>${adventure.steps ? `<ol>${adventure.steps.map(step => `<li>${escapeHtml(step)}</li>`).join('')}</ol>` : ''}</div></article>`);
}

function renderGameCatalog() {
  $('#gameCatalog').innerHTML = games.map(game => `<button class="game-card ${game.id === activeGame ? 'is-active' : ''}" type="button" data-game="${game.id}"><span>${game.icon}</span><b>${game.title}</b><small>${game.description}</small></button>`).join('');
  renderActiveGame();
}

function renderActiveGame() {
  window.clearInterval(goalTimer);
  const game = games.find(entry => entry.id === activeGame);
  const stage = $('#gameStage');
  if (activeGame === 'memory') {
    const choices = shuffle(residents).slice(0, 6);
    const cards = shuffle([...choices, ...choices]).map((person, index) => `<button type="button" class="memory-card" data-key="${person.id}" aria-label="Karta ${index + 1}"><span>?</span><b>${escapeHtml(person.name)}</b></button>`).join('');
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Znajdź wszystkie pary</h3></div><button class="button outline small" data-restart-game>Od nowa</button></div><div class="memory-grid">${cards}</div><p class="game-result">Odkrywaj po dwie karty.</p>`;
    initMemory();
  } else if (activeGame === 'quiz') {
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Kto wykonuje tę pracę?</h3></div><button class="button outline small" data-restart-game>Nowa zagadka</button></div><div id="quizBox"></div>`;
    nextQuiz();
  } else if (activeGame === 'goal') {
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Obroń piłkę w 15 sekund</h3></div><button class="button sun small" id="startGoal" type="button">Start</button></div><div class="goal-field"><img src="assets/generated/zawod-19-transparent.png" alt="Bramkarz Dorsz" /><button type="button" id="goalBall" disabled>⚽</button><p id="goalScore">Obrony: 0 · czas: 15 s</p></div>`;
    $('#startGoal').addEventListener('click', startGoal);
  } else if (activeGame === 'detective') {
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Wybierz najlepszy rekwizyt</h3></div><button class="button outline small" data-restart-game>Nowy trop</button></div><div id="detectiveBox"></div>`;
    nextDetective();
  } else if (activeGame === 'code') {
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Zapamiętaj sekwencję</h3></div><button class="button sun small" id="startCode">Pokaż kod</button></div><div class="code-board" id="codeBoard"><p>Naciśnij „Pokaż kod”, a potem odtwórz kolejność.</p></div>`;
    $('#startCode').addEventListener('click', startCode);
  } else {
    stage.innerHTML = `<div class="game-heading"><div><p class="kicker">${game.title}</p><h3>Znajdź cztery skarby</h3></div><button class="button outline small" data-restart-game>Od nowa</button></div><div class="treasure-scene" id="treasureScene"><span>🪸</span><span>🐚</span><span>🫧</span><span>🪸</span><button>⭐</button><button>🔑</button><button>💎</button><button>👑</button></div><p class="game-result">Kliknij każdy skarb tylko raz.</p>`;
    initTreasure();
  }
}

function initMemory() {
  const opened = [];
  let matched = 0;
  $$('.memory-card').forEach(card => card.addEventListener('click', () => {
    if (card.classList.contains('is-open') || card.classList.contains('is-matched') || opened.length === 2) return;
    card.classList.add('is-open'); opened.push(card);
    if (opened.length !== 2) return;
    const [first, second] = opened;
    if (first.dataset.key === second.dataset.key) {
      first.classList.add('is-matched'); second.classList.add('is-matched'); opened.length = 0; matched += 1;
      $('.game-result').textContent = matched === 6 ? 'Brawo! Wszystkie pary odnalezione.' : `Masz już ${matched} z 6 par.`;
    } else window.setTimeout(() => { first.classList.remove('is-open'); second.classList.remove('is-open'); opened.length = 0; }, 650);
  }));
}

function nextQuiz() {
  const answer = residents[Math.floor(Math.random() * residents.length)];
  const options = shuffle([answer, ...shuffle(residents.filter(person => person.id !== answer.id)).slice(0, 3)]);
  $('#quizBox').innerHTML = `<p class="question">${escapeHtml(answer.roleText || answer.tagline)}</p><div class="answer-grid">${options.map(person => `<button type="button" data-answer="${person.id}">${escapeHtml(person.name)}<small>${escapeHtml(person.role)}</small></button>`).join('')}</div><p class="game-result"></p>`;
  $$('#quizBox [data-answer]').forEach(button => button.addEventListener('click', () => {
    const correct = button.dataset.answer === answer.id;
    $$('#quizBox [data-answer]').forEach(item => item.disabled = true);
    button.classList.add(correct ? 'correct' : 'wrong');
    $('#quizBox .game-result').textContent = correct ? `Brawo! To ${answer.name}.` : `Tym razem: ${answer.name}.`;
  }));
}

function startGoal() {
  let score = 0; let time = 15;
  const ball = $('#goalBall'); const scoreLine = $('#goalScore');
  $('#startGoal').disabled = true; ball.disabled = false;
  const move = () => { ball.style.left = `${12 + Math.random() * 72}%`; ball.style.top = `${10 + Math.random() * 58}%`; };
  move();
  ball.onclick = () => { score += 1; move(); scoreLine.textContent = `Obrony: ${score} · czas: ${time} s`; };
  goalTimer = window.setInterval(() => { time -= 1; scoreLine.textContent = `Obrony: ${score} · czas: ${time} s`; if (time <= 0) { window.clearInterval(goalTimer); ball.disabled = true; $('#startGoal').disabled = false; notice(`Koniec gry: ${score} obron.`); } }, 1000);
}

function nextDetective() {
  const missions = [
    ['W podwodnej jaskini zgasło światło. Co wybierasz?', 'rozdzka'],
    ['Trzeba bezpiecznie obejrzeć bardzo daleką rafę. Co się przyda?', 'lornetka'],
    ['Rycerska wyprawa wymaga ochrony. Co wybierasz?', 'tarcza'],
    ['Kapitan szuka drogi do portu. Co pomoże?', 'luneta']
  ];
  const [question, answer] = missions[Math.floor(Math.random() * missions.length)];
  const choices = shuffle([answer, ...creatorProps.filter(prop => prop.id !== answer).slice(0, 3).map(prop => prop.id)]);
  $('#detectiveBox').innerHTML = `<p class="question">${question}</p><div class="prop-answer-grid">${choices.map(id => { const prop = creatorProps.find(item => item.id === id) || { id, label: id, src: '' }; return `<button type="button" data-answer="${prop.id}">${prop.src ? `<img src="${prop.src}" alt="" />` : '✨'}<span>${escapeHtml(prop.label)}</span></button>`; }).join('')}</div><p class="game-result"></p>`;
  $$('#detectiveBox [data-answer]').forEach(button => button.addEventListener('click', () => {
    const correct = button.dataset.answer === answer;
    $$('#detectiveBox [data-answer]').forEach(item => item.disabled = true);
    button.classList.add(correct ? 'correct' : 'wrong');
    $('#detectiveBox .game-result').textContent = correct ? 'Świetny wybór, detektywie!' : 'To nie ten rekwizyt — spróbuj kolejnego tropu.';
  }));
}

function startCode() {
  const symbols = ['🔵', '🟡', '🟢', '🟣'];
  const sequence = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => symbols[Math.floor(Math.random() * symbols.length)]);
  const board = $('#codeBoard');
  board.innerHTML = `<p class="sequence">${sequence.join(' ')}</p><div class="code-options">${symbols.map(symbol => `<button type="button">${symbol}</button>`).join('')}</div><p class="game-result">Zapamiętaj kod.</p>`;
  const chosen = [];
  $$('#codeBoard .code-options button').forEach(button => button.addEventListener('click', () => {
    chosen.push(button.textContent); button.classList.add('picked');
    if (chosen.length !== sequence.length) return;
    const correct = chosen.every((symbol, index) => symbol === sequence[index]);
    $('#codeBoard .game-result').textContent = correct ? 'Kod odczytany! Brawo.' : 'Kod był inny — spróbuj ponownie.';
  }));
}

function initTreasure() {
  let found = 0;
  $$('#treasureScene button').forEach(button => button.addEventListener('click', () => {
    if (button.disabled) return;
    button.disabled = true; button.classList.add('found'); found += 1;
    $('.game-result').textContent = found === 4 ? 'Wszystkie skarby są bezpieczne!' : `Masz ${found} z 4 skarbów.`;
  }));
}

function readableChapters(story) {
  const paragraphs = story.body.split(/\n+/).map(part => part.trim()).filter(Boolean);
  const chunkSize = Math.max(5, Math.ceil(paragraphs.length / 4));
  return Array.from({ length: Math.ceil(paragraphs.length / chunkSize) }, (_, index) => paragraphs.slice(index * chunkSize, (index + 1) * chunkSize));
}

function renderStories() {
  $('#storyTabs').innerHTML = Object.entries(storyVolumeLabels).map(([volume, meta]) => `<button class="story-tab ${Number(volume) === activeVolume ? 'is-active' : ''}" data-volume="${volume}" type="button"><b>${meta.title}</b><span>${meta.subtitle}</span></button>`).join('');
  const volumeStories = storyLibrary.filter(story => story.volume === activeVolume);
  $('#storyShelf').innerHTML = volumeStories.map(story => `<button class="story-card" type="button" data-story-id="${story.id}"><img src="${imagePath(story.cover)}" alt="" loading="lazy" /><span><small>${story.minutes} min · ${storyVolumeLabels[story.volume].title}</small><strong>${escapeHtml(story.title)}</strong><em>${escapeHtml(story.teaser)}</em><b>Czytaj pełną historię →</b></span></button>`).join('');
}

function openStory(story) {
  const chapters = readableChapters(story);
  const content = chapters.map((chapter, index) => `<section class="story-chapter"><h3>Część ${index + 1} z ${chapters.length}</h3>${chapter.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`).join('');
  openModal(`<article class="reading-modal story-reading"><p class="kicker">${storyVolumeLabels[story.volume].title} · pełna opowieść</p><h2>${escapeHtml(story.title)}</h2><p class="story-meta">${story.minutes} minut czytania · ${chapters.length} wygodne części</p>${content}</article>`);
}

function renderCreator() {
  $('#accessoryPalette').innerHTML = creatorProps.map(prop => `<button type="button" class="prop-button" data-prop-id="${prop.id}"><img src="${prop.src}" alt="" /><span>${escapeHtml(prop.label)}</span></button>`).join('');
  $('#placedItems').innerHTML = creatorItems.map(item => `<button type="button" class="placed-prop ${item.id === selectedItemId ? 'is-selected' : ''}" data-item-id="${item.id}" style="--x:${item.x}%;--y:${item.y}%;--size:${item.size}px;--rotate:${item.rotation}deg"><img src="${item.src}" alt="${escapeHtml(item.label)}" /></button>`).join('');
  const selected = creatorItems.find(item => item.id === selectedItemId);
  $('#accessorySelection').textContent = selected ? `${selected.label} — przeciągnij na planszy.` : 'Wybierz dodatek z planszy.';
  ['accessorySize', 'accessoryRotation', 'duplicateAccessory', 'removeSelectedAccessory'].forEach(id => $(`#${id}`).disabled = !selected);
  $('#accessorySize').value = selected?.size ?? 96; $('#accessoryRotation').value = selected?.rotation ?? 0;
  $('#accessorySizeValue').textContent = selected ? `${selected.size}px` : '—'; $('#accessoryRotationValue').textContent = selected ? `${selected.rotation}°` : '—';
  $$('#placedItems [data-item-id]').forEach(button => {
    button.addEventListener('click', () => { selectedItemId = button.dataset.itemId; renderCreator(); });
    button.addEventListener('pointerdown', startPropDrag);
  });
}

function addProp(prop) {
  const count = creatorItems.length;
  const item = { ...prop, id: `${prop.id}-${Date.now()}-${count}`, x: 50 + (count % 3 - 1) * 10, y: 32 + (count % 4) * 11, size: prop.defaultSize, rotation: 0 };
  creatorItems.push(item); selectedItemId = item.id; renderCreator();
}

function startPropDrag(event) {
  event.preventDefault();
  const itemId = event.currentTarget.dataset.itemId;
  selectedItemId = itemId;
  const stage = $('#creatorStage').getBoundingClientRect();
  const move = moveEvent => {
    const item = creatorItems.find(entry => entry.id === itemId);
    item.x = Math.max(4, Math.min(96, ((moveEvent.clientX - stage.left) / stage.width) * 100));
    item.y = Math.max(4, Math.min(96, ((moveEvent.clientY - stage.top) / stage.height) * 100));
    renderCreator();
  };
  const stop = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', stop); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', stop);
}

function renderCollection() {
  $('#collectionGrid').innerHTML = collection.map(item => `<article class="collection-card"><span>${item.art}</span><small>${escapeHtml(item.type)}</small><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.note)}</p><b>W przygotowaniu</b></article>`).join('');
}

function bindEvents() {
  $('#categoryFilters').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (!button) return; activeCategory = button.dataset.category; residentsExpanded = false; renderResidents(); });
  $('#showAllResidents').addEventListener('click', () => { residentsExpanded = true; renderResidents(); });
  $('#residentGrid').addEventListener('click', event => { const button = event.target.closest('[data-person-id]'); if (button) openPerson(residents.find(person => person.id === button.dataset.personId)); });
  $('#randomResident').addEventListener('click', () => openPerson(residents[Math.floor(Math.random() * residents.length)]));
  $('#courtGrid').addEventListener('click', event => { const button = event.target.closest('[data-court-id]'); if (button) openPerson(court.find(person => person.id === button.dataset.courtId)); });
  const mapClick = event => { const button = event.target.closest('[data-place-id]'); if (button) openPlace(places.find(place => place.id === button.dataset.placeId)); };
  $('#placeList').addEventListener('click', mapClick); $('#mapPins').addEventListener('click', mapClick);
  $('#adventureGrid').addEventListener('click', event => { const button = event.target.closest('[data-adventure-id]'); if (button) openAdventure(adventures.find(item => item.id === button.dataset.adventureId)); });
  $('#gameCatalog').addEventListener('click', event => { const button = event.target.closest('[data-game]'); if (!button) return; activeGame = button.dataset.game; renderGameCatalog(); });
  $('#gameStage').addEventListener('click', event => { if (event.target.closest('[data-restart-game]')) renderActiveGame(); });
  $('#storyTabs').addEventListener('click', event => { const button = event.target.closest('[data-volume]'); if (!button) return; activeVolume = Number(button.dataset.volume); renderStories(); });
  $('#storyShelf').addEventListener('click', event => { const button = event.target.closest('[data-story-id]'); if (button) openStory(storyLibrary.find(story => story.id === button.dataset.storyId)); });
  $('#accessoryPalette').addEventListener('click', event => { const button = event.target.closest('[data-prop-id]'); if (button) addProp(creatorProps.find(prop => prop.id === button.dataset.propId)); });
  $('#accessorySize').addEventListener('input', event => { const selected = creatorItems.find(item => item.id === selectedItemId); if (!selected) return; selected.size = Number(event.target.value); renderCreator(); });
  $('#accessoryRotation').addEventListener('input', event => { const selected = creatorItems.find(item => item.id === selectedItemId); if (!selected) return; selected.rotation = Number(event.target.value); renderCreator(); });
  $('#removeSelectedAccessory').addEventListener('click', () => { creatorItems = creatorItems.filter(item => item.id !== selectedItemId); selectedItemId = null; renderCreator(); });
  $('#duplicateAccessory').addEventListener('click', () => { const selected = creatorItems.find(item => item.id === selectedItemId); if (!selected) return; const copy = { ...selected, id: `${selected.id}-copy`, x: Math.min(92, selected.x + 8), y: Math.min(92, selected.y + 8) }; creatorItems.push(copy); selectedItemId = copy.id; renderCreator(); });
  $('#clearAccessories').addEventListener('click', () => { creatorItems = []; selectedItemId = null; renderCreator(); });
  $('#fishName').addEventListener('input', event => $('#fishNameLabel').textContent = event.target.value || 'Mój Dorsz');
  $('#creatorForm').addEventListener('submit', event => { event.preventDefault(); const name = $('#fishName').value || 'Mój Dorsz'; $('#customCardOutput').innerHTML = `<article><span>✦</span><p>Karta mieszkańca</p><h3>${escapeHtml(name)}</h3><b>${escapeHtml($('#fishRole').value)}</b><small>${creatorItems.length} rekwizytów · zaprojektowano w Dorszolandii</small></article>`; notice('Karta Dorsza jest gotowa.'); });
  $('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
}

renderNavigation(); renderPortals(); renderResidents(); renderCourt(); renderMap(); renderGameCatalog(); renderCreator(); renderStories(); renderCollection(); bindEvents();
