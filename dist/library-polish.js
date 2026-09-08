const canonicalRoles = {
  'dorszusi': 'Generator pomysłów',
  'borys': 'Sceptyk, obserwator i główny hamulec bezpieczeństwa',
  'krol-dorsz': 'Władca Neptunopolu',
  'babel-maksymalny': 'Gadający bąbel i wierny kompan'
};

const courtIds = new Set([
  'krol','krolowa','rycerz','czarodziej','lucznik','blazen','mnich','kowal','minstrel',
  'zielarka','pisarz','kupiec','straznik','wojownik','zwiadowca','mysliwy','krzyzowiec','pogromca-smokow'
]);

function polishCanonicalUi() {
  if (!document.querySelector('#canonical-library-layout-fix')) {
    const style = document.createElement('style');
    style.id = 'canonical-library-layout-fix';
    style.textContent = '.story-section-note{grid-column:1/-1}.story-cover-fallback{border-radius:0}.story-card{align-self:stretch}';
    document.head.appendChild(style);
  }

  document.querySelectorAll('#residentGrid .person-card').forEach(card => {
    const id = card.dataset.personId;
    const role = canonicalRoles[id];
    if (role) {
      const roleNode = card.querySelector('.person-copy em');
      if (roleNode) roleNode.textContent = role;
    }
    if (courtIds.has(id)) {
      const category = card.querySelector('.person-copy small');
      if (category) category.textContent = 'Atlas Dworu Koralu';
    }
  });

  document.querySelectorAll('#categoryFilters [data-category="Dwór Królewski"]').forEach(button => {
    button.textContent = 'Atlas Dworu Koralu';
  });

  const modalKicker = document.querySelector('#modalContent .profile-modal .kicker');
  if (modalKicker?.textContent.trim() === 'Dwór Królewski') modalKicker.textContent = 'Atlas Dworu Koralu';
}

window.setTimeout(() => {
  polishCanonicalUi();
  const targets = [document.querySelector('#residentGrid'), document.querySelector('#categoryFilters'), document.querySelector('#modalContent')].filter(Boolean);
  const observer = new MutationObserver(polishCanonicalUi);
  targets.forEach(target => observer.observe(target, { childList: true, subtree: true }));
}, 0);
