import { residents } from './data.js';
import { storyLibrary as currentStories } from './stories.js';
import { archiveStories } from './archive-stories.js';
import { recoveredStories } from './recovered-stories.js';

const sections = {
  1: {
    title: 'CZĘŚĆ I',
    subtitle: 'Archiwum i początki Dorszolandii',
    description: 'Pełne wersje historii oraz rozwinięcia pomysłów odnalezionych w archiwalnym zapisie Dorszolandii.'
  },
  2: {
    title: 'CZĘŚĆ II',
    subtitle: 'Agencja do Zadań Głupich',
    description: 'Pięć opowiadań tworzących główny, spójny cykl: od Wielkiej Afery z Pęcherzykiem do powrotu Algorii.'
  },
  3: {
    title: 'CZĘŚĆ III',
    subtitle: 'Nowe przygody',
    description: 'Kolejne wyprawy Borysa i Dorszusia: tajemnice Neptunopolu, wynalazki, sport, kosmos, pętle czasu i głębiny.'
  },
  4: {
    title: 'CZĘŚĆ IV',
    subtitle: 'Historie odzyskane z archiwalnego czatu',
    description: 'Siedem pełnych historii 41–47 odzyskanych ze starszego czatu. Każda zachowuje spójną, 10-rozdziałową strukturę z wydania rozszerzonego.'
  }
};

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const existingStories = currentStories.map((story, index) => {
  const number = index + 21;
  return {
    ...story,
    number,
    section: number <= 25 ? 2 : 3,
    teaser: `Pełne opowiadanie nr ${number} z „Wielkiej Księgi Przygód Borysa i Dorszusia”.`
  };
});

const canonicalStories = [...archiveStories, ...existingStories, ...recoveredStories]
  .sort((a, b) => a.number - b.number);

const canonicalProfiles = {
  'dorszusi': {
    role: 'Generator pomysłów',
    description: 'Działa szybko, mówi jeszcze szybciej i wierzy, że prawie każdy problem da się rozwiązać przyciskiem, eksperymentem albo pomysłem, którego nikt rozsądny wcześniej nie próbował.'
  },
  'borys': {
    role: 'Sceptyk, obserwator i główny hamulec bezpieczeństwa',
    description: 'Najczęściej wie, że coś pójdzie źle, lecz mimo to płynie za Dorszuszem, bo ktoś musi potem znaleźć wyjście.'
  },
  'krol-dorsz': {
    role: 'Władca Neptunopolu',
    description: 'Zmęczony, ale cierpliwy władca Neptunopolu. Widział już tyle dziwnych rzeczy, że coraz rzadziej pyta „dlaczego?”, a częściej „ile to będzie kosztować?”.'
  },
  'babel-maksymalny': {
    role: 'Gadający bąbel i wierny kompan',
    description: 'Gadający bąbel, wierny kompan i specjalista od pojawiania się w najmniej przewidywalnym momencie.'
  }
};

function applyCanonicalProfiles() {
  residents.forEach(person => {
    const profile = canonicalProfiles[person.id];
    if (!profile) return;
    person.role = profile.role;
    person.description = profile.description;
    person.tagline = profile.description;
    person.story = profile.description;
  });
}

function addLibraryStyles() {
  if (document.querySelector('#canonical-library-styles')) return;
  const style = document.createElement('style');
  style.id = 'canonical-library-styles';
  style.textContent = `
    .library-canonical-summary{display:flex;gap:.6rem;flex-wrap:wrap;margin:1rem 0 1.4rem}
    .library-canonical-summary span{padding:.45rem .75rem;border-radius:999px;background:rgba(255,255,255,.12);font-weight:800;font-size:.86rem}
    .story-tab .story-tab-count{display:block;margin-top:.2rem;font-size:.76rem;opacity:.75}
    .story-section-note{margin:1rem 0 1.35rem;padding:1rem 1.1rem;border-radius:18px;background:rgba(255,255,255,.78);box-shadow:0 10px 30px rgba(19,31,68,.08);grid-column:1/-1}
    .story-section-note b{display:block;font-size:1.05rem;margin-bottom:.25rem}
    .story-section-note p{margin:0;line-height:1.55}
    .story-cover-fallback{width:100%;aspect-ratio:16/10;display:grid;place-items:center;font-size:4rem;background:linear-gradient(145deg,#e9f8ff,#f3e9ff)}
    .story-card-number{font-weight:900;letter-spacing:.03em}
    .story-reader-nav{display:flex;justify-content:space-between;gap:.75rem;margin-top:1.5rem;padding-top:1rem;border-top:1px solid rgba(20,30,60,.15)}
    .story-reader-nav button{border:0;border-radius:999px;padding:.65rem 1rem;font:inherit;font-weight:800;cursor:pointer;background:#eef5ff}
    .story-reader-nav button:disabled{opacity:.35;cursor:default}
    .world-canon-note{margin-top:.55rem;max-width:760px}
    .story-reading .reader-chapter{padding-top:1.25rem;margin-top:1.25rem;border-top:1px solid #d9e7ec}
    .story-reading .reader-chapter:first-child{border-top:0;margin-top:.4rem;padding-top:.4rem}
    .story-reading .reader-chapter h3{font-size:1.25rem;line-height:1.25;margin:0 0 .65rem;color:#062c62}
    .story-reading .reader-chapter p,.story-reading .story-chapter>p{line-height:1.72;margin:.7rem 0}
    .chapter-count{display:inline-flex;margin-left:.35rem;padding:.15rem .45rem;border-radius:999px;background:#eafaff;color:#087fcd;font-size:.75rem;font-weight:900}
    @media(max-width:680px){.story-section-note{margin-top:.75rem}.story-reader-nav{align-items:stretch;flex-direction:column}.story-reader-nav button{width:100%}}
  `;
  document.head.appendChild(style);
}

function patchVisibleWorldCopy() {
  const residentsSection = document.querySelector('#mieszkancy');
  if (!residentsSection) return;
  const kicker = residentsSection.querySelector('.section-heading .kicker');
  const copy = residentsSection.querySelector('.section-heading p:not(.kicker)');
  if (kicker) kicker.textContent = 'Mieszkańcy miasta • Dorszo-Kumple • Atlas Dworu Koralu';
  if (copy) {
    copy.classList.add('world-canon-note');
    copy.textContent = 'Borys, Dorszuś, Król Dorsz i Bąbel Maksymalny należą do głównego cyklu opowiadań. Dwór Koralu z Królem Koralisem I to niezależny atlas postaci — nie jest tym samym wątkiem fabularnym.';
  }
  document.querySelectorAll('#categoryFilters [data-category="Dwór Królewski"]').forEach(button => {
    if (button.textContent !== 'Atlas Dworu Koralu') button.textContent = 'Atlas Dworu Koralu';
  });
}

function storyContent(story) {
  if (Array.isArray(story.chapters) && story.chapters.length) {
    return story.chapters.map(chapter => `
      <section class="reader-chapter">
        <h3>${escapeHtml(chapter.title)}</h3>
        ${(chapter.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </section>`).join('');
  }
  return String(story.body || '').split(/\n+/).map(paragraph => paragraph.trim()).filter(Boolean)
    .map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('');
}

function openCanonicalStory(story) {
  const modal = document.querySelector('#modal');
  const modalContent = document.querySelector('#modalContent');
  if (!modal || !modalContent) return;
  const previous = canonicalStories.find(item => item.number === story.number - 1);
  const next = canonicalStories.find(item => item.number === story.number + 1);
  const section = sections[story.section];
  const chapterBadge = Array.isArray(story.chapters) && story.chapters.length
    ? `<span class="chapter-count">${story.chapters.length} rozdziałów</span>` : '';
  const edition = story.section === 4 ? 'wydanie rozszerzone · historie odzyskane z archiwalnego czatu' : 'pełny tekst z Wielkiej Księgi Przygód';
  modalContent.innerHTML = `
    <article class="reading-modal story-reading">
      <p class="kicker">${section.title} · opowiadanie ${story.number} z 47</p>
      <h2>${escapeHtml(story.title)}</h2>
      <p class="story-meta">${story.minutes} minut czytania · ${edition} ${chapterBadge}</p>
      <section class="story-chapter original-text">${storyContent(story)}</section>
      <nav class="story-reader-nav" aria-label="Nawigacja między opowiadaniami">
        <button type="button" data-canonical-go="${previous?.number || ''}" ${previous ? '' : 'disabled'}>← ${previous ? `Nr ${previous.number}` : 'Początek'}</button>
        <button type="button" data-canonical-go="${next?.number || ''}" ${next ? '' : 'disabled'}>${next ? `Nr ${next.number}` : 'Koniec'} →</button>
      </nav>
    </article>`;
  modalContent.querySelectorAll('[data-canonical-go]').forEach(button => button.addEventListener('click', () => {
    const target = canonicalStories.find(item => item.number === Number(button.dataset.canonicalGo));
    if (target) openCanonicalStory(target);
  }));
  if (!modal.open) modal.showModal();
}

function upgradeLibrary() {
  applyCanonicalProfiles();
  addLibraryStyles();

  const tabs = document.querySelector('#storyTabs');
  const shelf = document.querySelector('#storyShelf');
  const title = document.querySelector('#stories-title');
  const banner = document.querySelector('.library-banner > div');
  if (!tabs || !shelf || !banner) return;

  if (title) title.textContent = '47 pełnych opowiadań';
  const bannerCopy = banner.querySelector('p:not(.kicker)');
  if (bannerCopy) bannerCopy.textContent = 'Wydanie rozszerzone: 47 pełnych historii w czterech częściach. Jeden tytuł to zawsze jedno całe opowiadanie — bez skracania i bez przypadkowego dzielenia.';
  if (!banner.querySelector('.library-canonical-summary')) {
    const summary = document.createElement('div');
    summary.className = 'library-canonical-summary';
    summary.innerHTML = '<span>47 historii</span><span>4 części</span><span>41–47: po 10 rozdziałów</span><span>1 tytuł = 1 pełne opowiadanie</span>';
    banner.appendChild(summary);
  }

  let activeSection = 1;
  const render = () => {
    tabs.innerHTML = Object.entries(sections).map(([key, meta]) => {
      const count = canonicalStories.filter(story => story.section === Number(key)).length;
      return `<button class="story-tab ${Number(key) === activeSection ? 'is-active' : ''}" data-canon-section="${key}" type="button"><b>${meta.title}</b><span>${escapeHtml(meta.subtitle)}</span><small class="story-tab-count">${count} opowiadań</small></button>`;
    }).join('');

    const meta = sections[activeSection];
    const stories = canonicalStories.filter(story => story.section === activeSection);
    shelf.innerHTML = `<article class="story-section-note"><b>${meta.title} • ${escapeHtml(meta.subtitle)}</b><p>${escapeHtml(meta.description)}</p></article>` + stories.map(story => {
      const artwork = story.cover
        ? `<img src="assets/${escapeHtml(story.cover)}" alt="" loading="lazy" />`
        : `<div class="story-cover-fallback" aria-hidden="true">${story.icon || '📖'}</div>`;
      const chapters = Array.isArray(story.chapters) && story.chapters.length ? ` · ${story.chapters.length} rozdziałów` : '';
      return `<button class="story-card" type="button" data-canon-story-id="${escapeHtml(story.id)}">
        ${artwork}
        <span><small><span class="story-card-number">NR ${story.number}/47</span> · ${story.minutes} min${chapters}</small><strong>${escapeHtml(story.title)}</strong><em>${escapeHtml(story.teaser || '')}</em><b>Czytaj pełne opowiadanie →</b></span>
      </button>`;
    }).join('');
  };

  tabs.addEventListener('click', event => {
    const button = event.target.closest('[data-canon-section]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    activeSection = Number(button.dataset.canonSection);
    render();
  }, true);

  shelf.addEventListener('click', event => {
    const button = event.target.closest('[data-canon-story-id]');
    if (!button) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const story = canonicalStories.find(item => item.id === button.dataset.canonStoryId);
    if (story) openCanonicalStory(story);
  }, true);

  render();
  patchVisibleWorldCopy();

  const observer = new MutationObserver(() => patchVisibleWorldCopy());
  const filters = document.querySelector('#categoryFilters');
  if (filters) observer.observe(filters, { childList: true, subtree: true });

  console.info(`[Dorszolandia] Biblioteka kanoniczna: ${canonicalStories.length} pełnych opowiadań (20 + 5 + 15 + 7).`);
}

window.setTimeout(upgradeLibrary, 0);
