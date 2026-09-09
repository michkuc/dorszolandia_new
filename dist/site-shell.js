const navItems = [
  ['Start','index.html'],
  ['Mieszkańcy','mieszkancy.html'],
  ['Mapa','mapa.html'],
  ['Przygody','przygody.html'],
  ['Opowieści','opowiadania.html'],
  ['Gry','gry.html'],
  ['Kreator','kreator.html'],
  ['Muzyka','muzyka.html'],
  ['Sklep','sklep.html']
];

const page = document.body.dataset.page || '';
const header = document.querySelector('#siteHeader');
const footer = document.querySelector('#siteFooter');
const normalize = href => href.replace('.html','');
const activeHref = page === 'home' ? 'index.html' : `${page}.html`;

if (header) {
  header.className = 'site-header multipage-header';
  header.innerHTML = `
    <a class="brand" href="index.html" aria-label="Dorszolandia — strona główna"><img src="assets/hero/logo-dorszolandia.png" alt="Dorszolandia" /></a>
    <button class="menu-toggle" type="button" aria-label="Otwórz menu" aria-expanded="false">☰</button>
    <nav class="multipage-nav" id="site-menu" aria-label="Główna nawigacja">${navItems.map(([label,href]) => `<a href="${href}" class="${href === activeHref ? 'is-active' : ''}" ${href === activeHref ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`;
  const toggle = header.querySelector('.menu-toggle');
  const nav = header.querySelector('#site-menu');
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); nav?.classList.toggle('is-open', !open); });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { nav.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); }));
}

if (footer) {
  footer.innerHTML = `<div class="wrap footer-content multipage-footer-content"><a class="brand" href="index.html"><img src="assets/hero/logo-dorszolandia.png" alt="Dorszolandia" /></a><p>Podwodna kraina przygód, opowieści, mieszkańców i zabawy.</p><nav aria-label="Nawigacja w stopce">${navItems.map(([label,href]) => `<a href="${href}">${label}</a>`).join('')}</nav><small>© 2026 Alexander Kuc. Wszelkie prawa zastrzeżone.</small></div>`;
}

const modal = document.querySelector('#modal');
const modalClose = document.querySelector('#modalClose');
modalClose?.addEventListener('click', () => modal?.close());
modal?.addEventListener('click', event => { if (event.target === modal) modal.close(); });
document.documentElement.dataset.page = page;
window.DORSZOLANDIA_PAGE = { page, active: normalize(activeHref) };
