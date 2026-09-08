import { creatorProps } from './catalog.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

const prop = (id, label, src, x, y, size, rotation = 0, category = 'Dodatki') => ({
  id, label, src, defaultSize: size, category, fit: { x, y, size, rotation }
});

// 36 realnych grafik: 19 istniejących assetów + 17 źródłowych grafik z biblioteki Google Drive.
// Pozycje startowe są skalibrowane do głównego, pomarańczowego Dorsza.
const fittedProps = [
  prop('aparat','Aparat','assets/props/aparat.webp',44,64,120,0,'Zawody'),
  prop('bebnek','Bębenek','assets/props/bebnek.webp',43,70,130,0,'Muzyka'),
  prop('czapka-kapitana','Czapka kapitana','assets/props/czapka-kapitana.webp',44,19,170,0,'Głowa'),
  prop('gitara','Gitara','assets/props/gitara.webp',57,65,180,-18,'Muzyka'),
  prop('gogle','Gogle','assets/props/gogle.webp',43,44,170,0,'Twarz'),
  prop('helm','Hełm','assets/props/helm.webp',44,22,170,0,'Głowa'),
  prop('kapelusz-czarodzieja','Kapelusz czarodzieja','assets/props/kapelusz-czarodzieja.webp',44,17,185,-4,'Fantazja'),
  prop('kapelusz-pirata','Kapelusz pirata','assets/props/kapelusz-pirata.webp',44,18,180,0,'Głowa'),
  prop('kolo','Koło sterowe','assets/props/kolo.webp',67,69,145,0,'Przygoda'),
  prop('korona','Korona','assets/props/korona.webp',44,17,165,0,'Głowa'),
  prop('kotwica','Kotwica','assets/props/kotwica.webp',67,72,145,8,'Przygoda'),
  prop('lornetka','Lornetka','assets/props/lornetka.webp',43,46,125,0,'Przygoda'),
  prop('luk','Łuk','assets/props/luk.webp',68,59,175,0,'Średniowieczne'),
  prop('luneta','Luneta','assets/props/luneta.webp',66,49,150,-8,'Przygoda'),
  prop('miecz','Miecz','assets/props/miecz.webp',69,61,170,-20,'Średniowieczne'),
  prop('pilka','Piłka','assets/props/pilka.webp',25,74,105,0,'Sport'),
  prop('rozdzka','Różdżka','assets/props/rozdzka.webp',69,55,145,-25,'Fantazja'),
  prop('tarcza','Tarcza','assets/props/tarcza.webp',43,66,150,0,'Średniowieczne'),
  prop('trabka','Trąbka','assets/props/trabka.webp',66,59,145,-12,'Muzyka'),

  prop('aparat-drive','Aparat morski','assets/props/drive/aparat.svg',44,64,120,0,'Zawody'),
  prop('czapka-kucharza','Czapka kucharza','assets/props/drive/czapka-kucharza.svg',44,17,175,0,'Głowa'),
  prop('gitara-drive','Gitara klasyczna','assets/props/drive/gitara.svg',57,65,165,-22,'Muzyka'),
  prop('helm-drive','Hełm srebrny','assets/props/drive/helm-rycerski.svg',44,22,175,0,'Średniowieczne'),
  prop('kapelusz-czarodzieja-drive','Kapelusz maga','assets/props/drive/kapelusz-czarodzieja.svg',44,16,190,-4,'Fantazja'),
  prop('kolba','Kolba naukowca','assets/props/drive/kolba.svg',67,70,120,8,'Nauka'),
  prop('korona-drive','Korona królewska','assets/props/drive/korona.svg',44,17,170,0,'Głowa'),
  prop('lisc','Liść','assets/props/drive/lisc.svg',57,70,115,10,'Natura'),
  prop('lornetka-drive','Lornetka błękitna','assets/props/drive/lornetka.svg',43,46,130,0,'Przygoda'),
  prop('luk-drive','Łuk klasyczny','assets/props/drive/luk.svg',68,59,175,0,'Średniowieczne'),
  prop('maska-nurka','Maska nurka','assets/props/drive/maska-nurka.svg',43,44,180,0,'Twarz'),
  prop('miecz-drive','Miecz srebrny','assets/props/drive/miecz.svg',69,61,170,-20,'Średniowieczne'),
  prop('mikrofon','Mikrofon','assets/props/drive/mikrofon.svg',67,62,125,12,'Muzyka'),
  prop('mlotek','Młotek','assets/props/drive/mlotek.svg',67,64,140,-12,'Zawody'),
  prop('pioro','Pióro','assets/props/drive/pioro.svg',67,54,135,-18,'Dodatki'),
  prop('rozdzka-drive','Różdżka gwiezdna','assets/props/drive/rozdzka.svg',69,55,145,-25,'Fantazja'),
  prop('sluchawki','Słuchawki','assets/props/drive/sluchawki.svg',43,43,190,0,'Twarz')
];

creatorProps.splice(0, creatorProps.length, ...fittedProps);

const categories = ['Wszystkie','Głowa','Twarz','Muzyka','Przygoda','Średniowieczne','Sport','Fantazja','Nauka','Zawody'];
let activeCreatorCategory = 'Wszystkie';

function renderFittedPalette() {
  const palette = $('#accessoryPalette');
  if (!palette) return;
  const visible = activeCreatorCategory === 'Wszystkie'
    ? creatorProps
    : creatorProps.filter(item => item.category === activeCreatorCategory);
  palette.innerHTML = visible.map(item => `
    <button type="button" class="prop-button" data-prop-id="${item.id}" title="${escapeHtml(item.label)}">
      <img src="${item.src}" alt="" loading="lazy" />
      <span>${escapeHtml(item.label)}</span>
    </button>`).join('');
}

function installFilters() {
  const palette = $('#accessoryPalette');
  if (!palette || $('#creatorPropFilters')) return;
  const filters = document.createElement('div');
  filters.id = 'creatorPropFilters';
  filters.className = 'creator-prop-filters';
  filters.setAttribute('aria-label','Kategorie rekwizytów');
  filters.innerHTML = categories.map(category => `
    <button type="button" class="creator-prop-filter ${category === activeCreatorCategory ? 'is-active' : ''}" data-creator-category="${category}">
      ${category}
    </button>`).join('');
  palette.before(filters);
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-creator-category]');
    if (!button) return;
    activeCreatorCategory = button.dataset.creatorCategory;
    $$('#creatorPropFilters .creator-prop-filter').forEach(entry => entry.classList.toggle('is-active', entry === button));
    renderFittedPalette();
  });
}

function updateCreatorCopy() {
  const intro = $('#kreator .section-heading>div>p:not(.kicker):not(.prop-readiness)');
  if (intro) {
    intro.textContent = 'Wybierz prawdziwy rekwizyt graficzny. Każdy startuje w miejscu dopasowanym do pomarańczowego Dorsza, a potem możesz go przeciągać, obracać i skalować.';
  }
  const readiness = $('#propReadiness');
  if (readiness) {
    readiness.innerHTML = '<b>36/36</b> grafik aktywnych · automatyczne dopasowanie · przeciąganie · rozmiar · obrót · warstwy';
  }
}

function installCreatorStyles() {
  if ($('#creatorDriveStyles')) return;
  const style = document.createElement('style');
  style.id = 'creatorDriveStyles';
  style.textContent = `
    #creatorFish{pointer-events:none!important;z-index:1!important}
    #placedItems{z-index:auto!important;pointer-events:none!important}
    #placedItems .placed-prop{pointer-events:auto!important;z-index:2}
    .creator-prop-filters{display:flex;gap:.38rem;overflow:auto;padding:.05rem 0 .6rem;scrollbar-width:thin}
    .creator-prop-filter{white-space:nowrap;border:1px solid #b9e6ef;border-radius:999px;background:#fff;color:#073d79;padding:.42rem .66rem;font-weight:900;font-size:.72rem}
    .creator-prop-filter.is-active{background:#073d79;color:#fff;border-color:#073d79}
    .creator-fit-note{margin:.35rem 0!important;padding:.5rem .65rem;border-radius:12px;background:#eefbff;color:#38708e!important;font-size:.72rem!important;line-height:1.4}
    #fitAccessory{background:#fff8d6;border-color:#e4bc2e}
    .prop-button img{filter:drop-shadow(0 3px 3px #003f6122)}
  `;
  document.head.appendChild(style);
}

function selectedNode() {
  return $('#placedItems .placed-prop.is-selected');
}

function sourcePropForItemId(itemId = '') {
  return [...creatorProps]
    .sort((a, b) => b.id.length - a.id.length)
    .find(item => itemId.startsWith(`${item.id}-`));
}

function updateRange(id, value) {
  const input = $(`#${id}`);
  if (!input || input.disabled) return;
  input.value = String(value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function moveSelectedTo(x, y) {
  const item = selectedNode();
  const stageNode = $('#creatorStage');
  if (!item || !stageNode) return;
  const stage = stageNode.getBoundingClientRect();
  const current = item.getBoundingClientRect();
  const pointerId = 19;
  const EventCtor = window.PointerEvent || window.MouseEvent;
  item.dispatchEvent(new EventCtor('pointerdown', {
    bubbles: true, pointerId,
    clientX: current.left + current.width / 2,
    clientY: current.top + current.height / 2
  }));
  window.dispatchEvent(new EventCtor('pointermove', {
    bubbles: true, pointerId,
    clientX: stage.left + stage.width * x / 100,
    clientY: stage.top + stage.height * y / 100
  }));
  window.dispatchEvent(new EventCtor('pointerup', { bubbles: true, pointerId }));
}

function fitSelected(item) {
  if (!item?.fit) return;
  updateRange('accessorySize', Math.max(32, Math.min(360, item.fit.size)));
  updateRange('accessoryRotation', item.fit.rotation || 0);
  requestAnimationFrame(() => moveSelectedTo(item.fit.x, item.fit.y));
}

function installFitControls() {
  const actions = $('#kreator .inline-actions');
  if (!actions || $('#fitAccessory')) return;
  const fit = document.createElement('button');
  fit.id = 'fitAccessory';
  fit.type = 'button';
  fit.className = 'button outline small';
  fit.textContent = 'Dopasuj';
  actions.prepend(fit);
  fit.addEventListener('click', () => {
    const item = selectedNode();
    if (!item) return;
    fitSelected(sourcePropForItemId(item.dataset.itemId));
  });

  const selection = $('#accessorySelection');
  if (selection && !$('#creatorFitNote')) {
    const note = document.createElement('p');
    note.id = 'creatorFitNote';
    note.className = 'creator-fit-note';
    note.textContent = 'Dopasuj przywraca rekomendowane położenie względem głowy, oczu lub płetwy Dorsza.';
    selection.after(note);
  }

  const front = $('#bringFront');
  const back = $('#sendBack');
  if (front) front.textContent = 'Przed Dorsza';
  if (back) back.textContent = 'Za Dorsza';
}

function bindAutoFit() {
  const palette = $('#accessoryPalette');
  if (!palette || palette.dataset.autoFitBound) return;
  palette.dataset.autoFitBound = '1';
  palette.addEventListener('click', event => {
    const button = event.target.closest('[data-prop-id]');
    if (!button) return;
    const item = creatorProps.find(entry => entry.id === button.dataset.propId);
    if (!item) return;
    queueMicrotask(() => fitSelected(item));
  });
}

function finishCreator() {
  if (!$('#kreator')) return;
  installCreatorStyles();
  renderFittedPalette();
  installFilters();
  updateCreatorCopy();
  installFitControls();
  bindAutoFit();
}

finishCreator();
