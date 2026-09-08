import { court } from './catalog.js';
import { atlasProfilesById } from './atlas-profiles.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

court.forEach(person => {
  const profile = atlasProfilesById.get(person.id);
  if (!profile) return;
  person.name = profile.name;
  person.role = profile.role;
  person.description = profile.history;
  person.history = profile.history;
  person.place = profile.place;
  person.character = profile.character;
  person.talent = profile.talent;
  person.weakness = profile.weakness;
  person.quote = profile.quote;
  person.hook = profile.hook;
  person.potential = profile.potential;
});

function installAtlasStyles() {
  if ($('#atlas-profile-styles')) return;
  const style = document.createElement('style');
  style.id = 'atlas-profile-styles';
  style.textContent = `
    .atlas-profile{display:grid;grid-template-columns:minmax(220px,330px) 1fr;gap:1.4rem;align-items:start}
    .atlas-profile .profile-art{width:100%;max-height:420px;object-fit:contain;border-radius:22px;background:linear-gradient(145deg,#e6fbff,#fff8db)}
    .atlas-profile blockquote{margin:.7rem 0 1rem;padding:.75rem 1rem;border-left:4px solid #18c5dc;background:#f2fbff;border-radius:0 14px 14px 0;color:#073d79;font-weight:800}
    .atlas-facts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.6rem;margin:1rem 0}
    .atlas-facts div{padding:.7rem .8rem;background:#f5fbff;border:1px solid #cfeaf1;border-radius:14px}
    .atlas-facts dt{font-size:.7rem;letter-spacing:.06em;text-transform:uppercase;font-weight:900;color:#1189aa}
    .atlas-facts dd{margin:.2rem 0 0;color:#073d79}
    .atlas-story-block{margin-top:.85rem;padding-top:.85rem;border-top:1px solid #d7e9ef}
    .atlas-story-block h3{margin:.1rem 0 .35rem;color:#062c62}
    @media(max-width:720px){.atlas-profile{grid-template-columns:1fr}.atlas-profile .profile-art{max-height:300px}.atlas-facts{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);
}

function openAtlasProfile(id) {
  const profile = atlasProfilesById.get(id);
  const modal = $('#modal');
  const modalContent = $('#modalContent');
  if (!profile || !modal || !modalContent) return;
  modalContent.innerHTML = `
    <article class="atlas-profile">
      <img class="profile-art" src="assets/source/${escapeHtml(id)}.webp" alt="${escapeHtml(profile.name)}" />
      <div>
        <p class="kicker">Atlas Dworu Koralu · pełny profil</p>
        <h2>${escapeHtml(profile.name)}</h2>
        <h3>${escapeHtml(profile.role)}</h3>
        <blockquote>„${escapeHtml(profile.quote)}”</blockquote>
        <dl class="atlas-facts">
          <div><dt>Miejsce</dt><dd>${escapeHtml(profile.place)}</dd></div>
          <div><dt>Charakter</dt><dd>${escapeHtml(profile.character)}</dd></div>
          <div><dt>Talent</dt><dd>${escapeHtml(profile.talent)}</dd></div>
          <div><dt>Słabość</dt><dd>${escapeHtml(profile.weakness)}</dd></div>
        </dl>
        <section class="atlas-story-block"><h3>Historia postaci</h3><p>${escapeHtml(profile.history)}</p></section>
        <section class="atlas-story-block"><h3>Mini-historia / zaczep fabularny</h3><p>${escapeHtml(profile.hook)}</p></section>
        <section class="atlas-story-block"><h3>Potencjał postaci</h3><p>${escapeHtml(profile.potential)}</p></section>
      </div>
    </article>`;
  if (!modal.open) modal.showModal();
}

function patchAtlasCards() {
  $$('#residentGrid .person-card').forEach(card => {
    const profile = atlasProfilesById.get(card.dataset.personId);
    if (!profile) return;
    const copy = card.querySelector('.person-copy');
    const category = copy?.querySelector('small');
    const role = copy?.querySelector('em');
    const tagline = copy?.querySelector('.person-tagline');
    if (category) category.textContent = 'Atlas Dworu Koralu';
    if (role) role.textContent = profile.role;
    if (tagline) tagline.textContent = profile.history;
  });
}

installAtlasStyles();
patchAtlasCards();

document.addEventListener('click', event => {
  const card = event.target.closest('#residentGrid .person-card[data-person-id]');
  if (!card || !atlasProfilesById.has(card.dataset.personId)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  openAtlasProfile(card.dataset.personId);
}, true);

const grid = $('#residentGrid');
if (grid) new MutationObserver(patchAtlasCards).observe(grid, { childList: true, subtree: true });
