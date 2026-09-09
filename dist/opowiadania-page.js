import { storyLibrary } from './stories.js';
import { archiveStories } from './archive-stories.js';
import { recoveredStories } from './recovered-stories.js';
import { masterFinalExtraStories } from './master-final-extra.js';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const modal = $('#modal');
const modalContent = $('#modalContent');

const sections = {
  1:{title:'CZĘŚĆ I',subtitle:'Archiwum i początki Dorszolandii',description:'Pełne wersje historii i rozwinięcia odzyskane z archiwalnego materiału.'},
  2:{title:'CZĘŚĆ II',subtitle:'Agencja do Zadań Głupich',description:'Główny spójny cykl: od Wielkiej Afery z Pęcherzykiem do powrotu Algorii.'},
  3:{title:'CZĘŚĆ III',subtitle:'Nowe przygody',description:'Tajemnice Neptunopolu, wynalazki, sport, kosmos, pętle czasu i głębiny.'},
  4:{title:'CZĘŚĆ IV',subtitle:'Historie odzyskane',description:'Pełne historie 41–47 odzyskane ze starszego archiwum; zachowują rozdziałową strukturę.'},
  5:{title:'CZĘŚĆ V',subtitle:'MASTER FINAL 48–56',description:'Ostatnie dziewięć pozycji z MASTER FINAL. Przy historiach rekonstruowanych czytnik jawnie pokazuje status źródła.'}
};

const middleStories = storyLibrary.map((story,index) => ({...story,number:index + 21,section:index + 21 <= 25 ? 2 : 3}));
const allCandidates = [...archiveStories,...middleStories,...recoveredStories,...masterFinalExtraStories];
const byNumber = new Map(allCandidates.map(story => [Number(story.number),story]));
const stories = [...byNumber.values()].filter(story => story.number >= 1 && story.number <= 56).sort((a,b) => a.number - b.number);

function renderText(story) {
  if (Array.isArray(story.chapters) && story.chapters.length) {
    return story.chapters.map((chapter,index) => `<section class="reader-chapter"><h3>${esc(chapter.title || `Rozdział ${index + 1}`)}</h3>${(chapter.paragraphs || []).map(paragraph => `<p>${esc(paragraph)}</p>`).join('')}</section>`).join('');
  }
  return String(story.body || '').split(/\n+/).map(text => text.trim()).filter(Boolean).map(text => `<p>${esc(text)}</p>`).join('');
}

function openStory(story) {
  const previous = stories.find(item => item.number === story.number - 1);
  const next = stories.find(item => item.number === story.number + 1);
  const chapterInfo = Array.isArray(story.chapters) && story.chapters.length ? `${story.chapters.length} rozdziałów` : 'pełny tekst';
  modalContent.innerHTML = `<article class="story-reader"><p class="kicker">${sections[story.section]?.title || 'Biblioteka'} · opowiadanie ${story.number}/56</p><h2>${esc(story.title)}</h2><div class="reader-meta"><span>${story.minutes || 9} min czytania</span><span>${chapterInfo}</span></div>${story.sourceStatus ? `<aside class="master-source-note"><b>Status źródła</b><p>${esc(story.sourceStatus)}</p></aside>` : ''}<div class="reader-body">${renderText(story)}</div><nav class="reader-nav" aria-label="Nawigacja między opowiadaniami"><button type="button" data-go-story="${previous?.number || ''}" ${previous ? '' : 'disabled'}>← ${previous ? `Nr ${previous.number}` : 'Początek'}</button><button type="button" data-go-story="${next?.number || ''}" ${next ? '' : 'disabled'}>${next ? `Nr ${next.number}` : 'Koniec'} →</button></nav></article>`;
  modalContent.querySelectorAll('[data-go-story]').forEach(button => button.addEventListener('click', () => {
    const target = stories.find(item => item.number === Number(button.dataset.goStory));
    if (target) openStory(target);
  }));
  if (!modal.open) modal.showModal();
}

let activeSection = 1;
const tabs = $('#storyTabs56');
const grid = $('#storyGrid56');
const status = $('#libraryStatus');

function coverFor(story) {
  if (!story.cover) return `<div class="story-cover-fallback">${story.icon || '📖'}</div>`;
  const src = /^assets\//.test(story.cover) ? story.cover : `assets/${story.cover}`;
  return `<img src="${src}" alt="" loading="lazy" onerror="this.outerHTML='<div class=&quot;story-cover-fallback&quot;>${story.icon || '📖'}</div>'" />`;
}

function render() {
  const counts = Object.keys(sections).map(key => [Number(key),stories.filter(story => Number(story.section) === Number(key)).length]);
  tabs.innerHTML = counts.map(([key,count]) => `<button type="button" class="${key === activeSection ? 'is-active' : ''}" data-section="${key}"><b>${sections[key].title}</b><span>${esc(sections[key].subtitle)}</span><small>${count} historii</small></button>`).join('');
  const visible = stories.filter(story => Number(story.section) === activeSection);
  grid.innerHTML = `<article class="library-section-note"><b>${sections[activeSection].title} • ${esc(sections[activeSection].subtitle)}</b><p>${esc(sections[activeSection].description)}</p></article>` + visible.map(story => `<button class="story-library-card" type="button" data-story="${story.number}">${coverFor(story)}<span class="story-library-copy"><small>NR ${story.number}/56 · ${story.minutes || 9} min${Array.isArray(story.chapters) && story.chapters.length ? ` · ${story.chapters.length} rozdziałów` : ''}</small><strong>${esc(story.title)}</strong><p>${esc(story.teaser || 'Pełne opowiadanie z Wielkiej Księgi Przygód Borysa i Dorszusia.')}</p>${story.sourceStatus ? '<em>status źródła dostępny w czytniku</em>' : ''}<b>Czytaj pełne opowiadanie →</b></span></button>`).join('');
}

status.innerHTML = `<div><b>${stories.length}</b><span>pełnych historii</span></div><div><b>5</b><span>części biblioteki</span></div><div><b>1–56</b><span>ciągła numeracja</span></div>`;
if (stories.length !== 56 || stories.some((story,index) => story.number !== index + 1)) {
  status.classList.add('has-error');
  console.error('[Dorszolandia] Biblioteka MASTER FINAL nie ma poprawnej ciągłości 1–56.', stories.map(s => s.number));
}

tabs.addEventListener('click', event => {
  const button = event.target.closest('[data-section]');
  if (!button) return;
  activeSection = Number(button.dataset.section);
  render();
});
grid.addEventListener('click', event => {
  const card = event.target.closest('[data-story]');
  if (!card) return;
  const story = stories.find(item => item.number === Number(card.dataset.story));
  if (story) openStory(story);
});

render();
