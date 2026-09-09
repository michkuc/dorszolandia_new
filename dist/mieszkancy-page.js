import { atlasProfiles } from './atlas-profiles.js';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const modal = $('#modal');
const modalContent = $('#modalContent');
const FALLBACK_ART = 'assets/generated/dorsz-baza-transparent.png';

const storyPeople = [
  {
    id:'dorszusi', name:'Dorszuś', role:'Generator pomysłów', art:'assets/generated/story-characters/dorszusi.webp',
    description:'Działa szybko, mówi jeszcze szybciej i wierzy, że prawie każdy problem da się rozwiązać przyciskiem, eksperymentem albo pomysłem, którego nikt rozsądny wcześniej nie próbował.'
  },
  {
    id:'borys', name:'Borys', role:'Sceptyk, obserwator i główny hamulec bezpieczeństwa', art:'assets/generated/story-characters/borys.webp',
    description:'Najczęściej wie, że coś pójdzie źle, lecz mimo to płynie za Dorszuszem, bo ktoś musi potem znaleźć wyjście.'
  },
  {
    id:'krol-dorsz', name:'Król Dorsz', role:'Władca Neptunopolu', art:'assets/generated/story-characters/krol-dorsz.webp',
    description:'Zmęczony, ale cierpliwy władca Neptunopolu. Widział już tyle dziwnych rzeczy, że coraz rzadziej pyta „dlaczego?”, a częściej „ile to będzie kosztować?”.'
  },
  {
    id:'babel-maksymalny', name:'Bąbel Maksymalny', role:'Gadający bąbel i wierny kompan', art:'assets/generated/story-characters/babel-maksymalny.webp',
    description:'Gadający bąbel, wierny kompan i specjalista od pojawiania się w najmniej przewidywalnym momencie.'
  }
];

// Lokalne ilustracje dla postaci 43–59. Nie odwołujemy się już do nieistniejącego assets/canon.
const lateArt = [
  'assets/generated/roles/czytelnik.png',
  'assets/generated/roles/ogrodniczka.png',
  'assets/generated/roles/majsterkowicz.png',
  'assets/generated/roles/architektka.png',
  'assets/generated/roles/szachistka.png',
  'assets/generated/roles/reporter.png',
  'assets/generated/roles/ratownik.png',
  'assets/generated/roles/detektyw.png',
  'assets/generated/roles/siatkarka.png',
  'assets/generated/roles/mechanik.png',
  'assets/generated/roles/koszykarz.png',
  'assets/generated/roles/wynalazczyni.png',
  'assets/generated/roles/pilkarz.png',
  'assets/generated/roles/listonosz.png',
  'assets/generated/roles/plywak.png',
  'assets/generated/roles/tenisistka.png',
  'assets/generated/roles/kolarz.png'
];

const groupFor = index => index < 18 ? 'Dwór i legendy' : index < 42 ? 'Miasto i zawody' : index < 50 ? 'Nowe role' : 'Sport';
const artFor = (profile,index) => {
  if (index < 18) return `assets/source/${profile.id}.webp`;
  if (index < 42) return `assets/generated/zawod-${String(index - 18).padStart(2,'0')}-transparent.png`;
  return lateArt[index - 42] || FALLBACK_ART;
};

function installImageFallback(scope = document) {
  scope.querySelectorAll('img[data-local-art]').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallbackApplied === '1') return;
      img.dataset.fallbackApplied = '1';
      img.src = FALLBACK_ART;
    }, { once:true });
  });
}

function openStoryPerson(person) {
  modalContent.innerHTML = `<article class="character-profile"><img data-local-art src="${person.art}" alt="${esc(person.name)}" /><div><p class="kicker">Bohater głównego cyklu</p><h2>${esc(person.name)}</h2><h3>${esc(person.role)}</h3><p>${esc(person.description)}</p><p class="canon-note"><b>Warstwa świata:</b> Borys i Dorszuś — nie jest częścią niezależnego Atlasu 59.</p></div></article>`;
  installImageFallback(modalContent);
  if (!modal.open) modal.showModal();
}

function openAtlas(profile,index) {
  modalContent.innerHTML = `<article class="character-profile"><img data-local-art src="${artFor(profile,index)}" alt="${esc(profile.name)}" /><div><p class="kicker">Wielka Księga Bohaterów · ${index + 1}/59</p><h2>${esc(profile.name)}</h2><h3>${esc(profile.role)}</h3>${profile.quote ? `<blockquote>„${esc(profile.quote)}”</blockquote>` : ''}<dl class="profile-facts"><div><dt>Miejsce</dt><dd>${esc(profile.place)}</dd></div><div><dt>Charakter</dt><dd>${esc(profile.character)}</dd></div><div><dt>Talent</dt><dd>${esc(profile.talent)}</dd></div><div><dt>Słabość</dt><dd>${esc(profile.weakness)}</dd></div></dl><section><h3>Historia postaci</h3><p>${esc(profile.history)}</p></section><section><h3>Mini-historia / zaczep fabularny</h3><p>${esc(profile.hook)}</p></section>${profile.potential ? `<section><h3>Potencjał postaci</h3><p>${esc(profile.potential)}</p></section>` : ''}</div></article>`;
  installImageFallback(modalContent);
  if (!modal.open) modal.showModal();
}

const storyRoot = $('#storyPeople');
storyRoot.innerHTML = storyPeople.map((person,index) => `<button class="story-person-card" type="button" data-story-person="${person.id}"><span class="story-person-art"><img data-local-art src="${person.art}" alt="" loading="lazy" /></span><span class="story-person-copy"><small>${index < 2 ? 'Dorszo-Kumple' : 'Bohater opowieści'}</small><strong>${esc(person.name)}</strong><em>${esc(person.role)}</em><p>${esc(person.description)}</p><b>Poznaj bohatera →</b></span></button>`).join('');
installImageFallback(storyRoot);
storyRoot.addEventListener('click', event => {
  const card = event.target.closest('[data-story-person]');
  if (!card) return;
  const person = storyPeople.find(item => item.id === card.dataset.storyPerson);
  if (person) openStoryPerson(person);
});

if (atlasProfiles.length !== 59) {
  console.error(`[Dorszolandia] Atlas powinien mieć 59 postaci, ma ${atlasProfiles.length}.`);
}

const groups = ['Wszystkie','Dwór i legendy','Miasto i zawody','Nowe role','Sport'];
let activeGroup = 'Wszystkie';
let query = '';
const filters = $('#atlasFilters');
const grid = $('#atlasGrid');
const search = $('#atlasSearch');
const empty = $('#atlasEmpty');

function renderAtlas() {
  filters.innerHTML = groups.map(group => `<button type="button" data-group="${group}" class="${group === activeGroup ? 'is-active' : ''}">${group}</button>`).join('');
  const normalized = query.trim().toLocaleLowerCase('pl');
  const items = atlasProfiles.map((profile,index) => ({profile,index,group:groupFor(index)})).filter(item => {
    if (activeGroup !== 'Wszystkie' && item.group !== activeGroup) return false;
    if (!normalized) return true;
    return [item.profile.name,item.profile.role,item.profile.place,item.profile.character,item.profile.talent,item.profile.history].join(' ').toLocaleLowerCase('pl').includes(normalized);
  });
  grid.innerHTML = items.map(({profile,index,group}) => `<button class="atlas-page-card" type="button" data-atlas-index="${index}"><span class="atlas-page-art"><img data-local-art src="${artFor(profile,index)}" alt="" loading="lazy" /></span><span class="atlas-page-copy"><small>${esc(group)} · ${index + 1}/59</small><strong>${esc(profile.name)}</strong><em>${esc(profile.role)}</em><p>${esc(profile.history)}</p><b>Pełny profil →</b></span></button>`).join('');
  installImageFallback(grid);
  empty.hidden = items.length > 0;
}

filters.addEventListener('click', event => {
  const button = event.target.closest('[data-group]');
  if (!button) return;
  activeGroup = button.dataset.group;
  renderAtlas();
});
search.addEventListener('input', () => { query = search.value; renderAtlas(); });
grid.addEventListener('click', event => {
  const card = event.target.closest('[data-atlas-index]');
  if (!card) return;
  const index = Number(card.dataset.atlasIndex);
  if (atlasProfiles[index]) openAtlas(atlasProfiles[index], index);
});

renderAtlas();
