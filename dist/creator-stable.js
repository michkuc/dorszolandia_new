function initStableCreator() {
  const root = document.querySelector('#kreator');
  if (!root || root.dataset.creatorReady === '1') return;
  root.dataset.creatorReady = '1';
  root.classList.add('creator-premium');

  const oldLayout = root.querySelector('.creator-layout');
  if (!oldLayout) return;
  const freshLayout = oldLayout.cloneNode(true);
  oldLayout.replaceWith(freshLayout);

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const drive = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1200`;

  const icon = (label, glyph, a = '#e8f8ff', b = '#ffffff') => {
    const safe = esc(label);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect x="6" y="6" width="228" height="188" rx="34" fill="url(#g)" stroke="#8bd9ef" stroke-width="6"/><circle cx="120" cy="86" r="58" fill="#fff" opacity=".9"/><text x="120" y="113" text-anchor="middle" font-size="70" font-family="Segoe UI Emoji,Apple Color Emoji,Noto Color Emoji,Arial">${glyph}</text><text x="120" y="170" text-anchor="middle" font-size="15" font-family="Arial" font-weight="700" fill="#073d79">${safe}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const prop = (id, label, src, x, y, size, rotation = 0, category = 'Dodatki', fallback = null) => ({
    id, label, src, category, fit: { x, y, size, rotation }, fallback: fallback || icon(label, '✦')
  });

  const props = [
    prop('korona','Korona z klejnotami',drive('1MLFOfaWCouSauOMMKWuVSR1Ue_qtDVPo'),43,17,182,0,'Głowa',icon('Korona','👑','#fff5c9','#fff')),
    prop('helm-czerwony','Hełm rycerski',drive('1A4YzyOPL6mjq9bj-hW6Ch4OjKnzSA0ID'),43,21,190,0,'Średniowieczne',icon('Hełm','🪖')),
    prop('miecz-zloty','Miecz',drive('1rmQlihFLCjpUDhHMNFmS2tfDoqxnmccJ'),72,60,178,-20,'Średniowieczne',icon('Miecz','⚔️')),
    prop('tarcza-herbowa','Tarcza herbowa',drive('1ihYu6Y6L3sHwxcPNtyR28UAr9N413z1u'),66,66,166,0,'Średniowieczne',icon('Tarcza','🛡️')),
    prop('kordelas','Kordelas pirata',drive('1LmNeS0YnOuFv7zHpKwjgEMTd7WY1V5s7'),71,61,170,-18,'Przygoda',icon('Kordelas','🗡️')),
    prop('topor','Topór bojowy',drive('12sf_KViDJgbIDEm0ke_vPl_sfLEj0a9F'),71,61,176,-18,'Średniowieczne',icon('Topór','🪓')),
    prop('wlocznia','Włócznia',drive('19eeH4TLkNtSD98jvvAH1NSHEyW9uAZzY'),73,58,198,-14,'Średniowieczne',icon('Włócznia','🔱')),
    prop('kolczan','Kołczan',drive('176My-RofP1y6sRirnsxy20K2ypYq-0Q0'),68,60,152,7,'Średniowieczne',icon('Kołczan','🏹')),
    prop('pergamin','Pergamin',drive('1J91ldtorzG_Lf0AwexKHoeC7PZovEWzJ'),68,70,142,-8,'Przygoda',icon('Pergamin','📜','#fff1d9','#fff')),
    prop('latarenka','Latarenka',drive('1gwoaJRkhTeAXoNgiqs09tENh-UkvcILg'),69,64,136,0,'Przygoda',icon('Latarenka','🏮','#fff0cf','#fff')),
    prop('plecak','Plecak',drive('1pXDnvG_fiHFalhEaQzquy9elMLKFNQpC'),31,61,160,0,'Przygoda',icon('Plecak','🎒','#ffe8e8','#fff')),
    prop('czapka','Czapka',drive('1NXOGJuK74ft-ksWc04RVKOjFYr9XaIbL'),43,18,178,0,'Głowa',icon('Czapka','🧢','#e4f2ff','#fff')),
    prop('stetoskop','Stetoskop',drive('1vPxwlDBLH4HOqKfWPCIT-BKwSBKk_zxU'),58,58,158,0,'Zawody',icon('Stetoskop','🩺')),
    prop('ksiazka','Książka',drive('1ziobV72LPKSubv0L047V3bwFapRUPpwc'),67,71,142,-8,'Nauka',icon('Książka','📘','#e7efff','#fff')),
    prop('pedzel','Pędzel',drive('1mOUIimoYXnNXF5Q3yrGLkMio_hPe0IVy'),70,59,145,-18,'Sztuka',icon('Pędzel','🖌️','#fff0fa','#fff')),
    prop('aparat','Aparat',drive('1gwjIRLcn80nB6se_gv8Pd5CdVELjuUxs'),68,62,132,0,'Zawody',icon('Aparat','📷')),
    prop('gitara','Gitara',icon('Gitara','🎸','#fff0d7','#fff'),63,66,178,-14,'Muzyka'),
    prop('pilka','Piłka',icon('Piłka','⚽','#eefcff','#fff'),25,75,116,0,'Sport'),
    prop('gogle','Gogle',icon('Gogle','🥽','#e4f7ff','#fff'),43,43,176,0,'Twarz'),
    prop('kapelusz-czarodzieja','Kapelusz czarodzieja',icon('Kapelusz maga','🧙‍♂️','#efe7ff','#fff'),43,16,194,-4,'Fantazja'),
    prop('kapelusz-pirata','Kapelusz pirata',icon('Kapelusz pirata','🏴‍☠️','#f0f4f7','#fff'),43,17,188,0,'Głowa'),
    prop('czapka-kapitana','Czapka kapitana',icon('Czapka kapitana','🧑‍✈️','#e6f2ff','#fff'),43,18,180,0,'Głowa'),
    prop('lornetka','Lornetka',icon('Lornetka','🔭','#e7f7ff','#fff'),67,49,145,0,'Przygoda'),
    prop('luneta','Luneta',icon('Luneta','🔭','#e9f5ff','#fff'),70,49,150,-8,'Przygoda'),
    prop('kompas','Kompas',icon('Kompas','🧭','#fff2d9','#fff'),68,64,130,0,'Przygoda'),
    prop('mapa','Mapa',icon('Mapa','🗺️','#eef8df','#fff'),67,71,148,-8,'Przygoda'),
    prop('kotwica','Kotwica',icon('Kotwica','⚓','#e7f0f7','#fff'),69,70,152,8,'Przygoda'),
    prop('kolo','Koło sterowe',icon('Koło sterowe','☸️','#fff1dc','#fff'),69,68,154,0,'Przygoda'),
    prop('trabka','Trąbka',icon('Trąbka','🎺','#fff0c7','#fff'),69,59,150,-12,'Muzyka'),
    prop('bebnek','Bębenek',icon('Bębenek','🥁','#ffe8e8','#fff'),67,67,140,0,'Muzyka'),
    prop('mikrofon','Mikrofon',icon('Mikrofon','🎤','#eef0ff','#fff'),68,60,132,0,'Muzyka'),
    prop('rozdzka','Różdżka',icon('Różdżka','🪄','#f3e8ff','#fff'),70,55,154,-25,'Fantazja'),
    prop('mikroskop','Mikroskop',icon('Mikroskop','🔬','#e4fbf5','#fff'),67,65,146,0,'Nauka'),
    prop('lupa','Lupa',icon('Lupa','🔎','#eaf8ff','#fff'),67,55,132,0,'Nauka'),
    prop('narzedzia','Narzędzia',icon('Narzędzia','🛠️','#eef1f4','#fff'),68,66,145,0,'Zawody'),
    prop('kontroler','Kontroler',icon('Kontroler','🎮','#eee9ff','#fff'),67,68,140,0,'Dodatki')
  ];

  const categories = ['Wszystkie','Głowa','Twarz','Przygoda','Średniowieczne','Muzyka','Sport','Fantazja','Nauka','Zawody','Sztuka','Dodatki'];
  let activeCategory = 'Wszystkie';
  let items = [];
  let selectedId = null;
  let serial = 1;

  const stage = $('#creatorStage', freshLayout);
  const placed = $('#placedItems', freshLayout);
  const palette = $('#accessoryPalette', freshLayout);
  const form = $('#creatorForm', freshLayout);
  const nameInput = $('#fishName', freshLayout);
  const roleInput = $('#fishRole', freshLayout);
  const nameLabel = $('#fishNameLabel', freshLayout);
  const selection = $('#accessorySelection', freshLayout);
  const sizeInput = $('#accessorySize', freshLayout);
  const sizeValue = $('#accessorySizeValue', freshLayout);
  const rotationInput = $('#accessoryRotation', freshLayout);
  const rotationValue = $('#accessoryRotationValue', freshLayout);
  const duplicateButton = $('#duplicateAccessory', freshLayout);
  const removeButton = $('#removeSelectedAccessory', freshLayout);
  const clearButton = $('#clearAccessories', freshLayout);
  const output = $('#customCardOutput');
  const actions = freshLayout.querySelector('.inline-actions');
  if (!stage || !placed || !palette || !form || !actions) return;

  const title = $('#creator-title', root);
  const kicker = root.querySelector('.section-heading .kicker');
  const intro = root.querySelector('.section-heading h2 + p');
  if (title) title.textContent = 'Stwórz własnego Dorsza';
  if (kicker) kicker.textContent = 'Twój mieszkaniec krainy';
  if (intro) intro.textContent = 'Wybierz rekwizyty, dopasuj je i stwórz wyjątkowego mieszkańca Dorszolandii. Na komputerze pracujesz na dużej planszy, a na telefonie układ składa się automatycznie.';

  freshLayout.classList.add('creator-premium-layout');
  form.classList.add('creator-premium-controls');

  const stageShell = document.createElement('section');
  stageShell.className = 'creator-stage-shell';
  stage.before(stageShell);
  stageShell.append(stage);
  stageShell.insertAdjacentHTML('afterbegin', `<div class="creator-stage-head"><div><span class="creator-stage-eyebrow">Podgląd na żywo</span><h3>Twój Dorsz</h3></div><span class="creator-stage-tip">Każdy Dorsz jest wyjątkowy</span></div>`);
  stageShell.insertAdjacentHTML('beforeend', `<div class="creator-stage-foot"><span>Przeciągaj rekwizyty bezpośrednio po planszy.</span><b>Wyobraźnia nie ma granic.</b></div>`);

  const fields = $$('fieldset', form);
  if (fields[0]) fields[0].classList.add('creator-props-card');
  if (fields[1]) fields[1].classList.add('creator-selected-card');
  const labels = [...form.children].filter(node => node.tagName === 'LABEL');
  labels.forEach(node => node.classList.add('creator-data-field'));

  actions.querySelectorAll('#fitAccessory,#bringFront,#sendBack,#mirrorHorizontal,#mirrorVertical').forEach(node => node.remove());
  const makeButton = (id, label) => {
    const button = document.createElement('button');
    button.id = id; button.type = 'button'; button.className = 'button outline small creator-extra-control'; button.textContent = label;
    return button;
  };
  const fitButton = makeButton('fitAccessory','Dopasuj');
  const mirrorH = makeButton('mirrorHorizontal','Lustro ↔');
  const mirrorV = makeButton('mirrorVertical','Lustro ↕');
  const frontButton = makeButton('bringFront','Przed Dorsza');
  const backButton = makeButton('sendBack','Za Dorsza');
  [fitButton, mirrorH, mirrorV, frontButton, backButton].reverse().forEach(button => actions.prepend(button));

  let newFishButton = $('#newFish', freshLayout);
  if (!newFishButton) {
    newFishButton = document.createElement('button');
    newFishButton.id = 'newFish'; newFishButton.type = 'button'; newFishButton.className = 'button outline creator-new'; newFishButton.textContent = 'Nowy Dorsz';
    form.appendChild(newFishButton);
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const primaryActions = document.createElement('div');
  primaryActions.className = 'creator-primary-actions';
  if (clearButton) primaryActions.appendChild(clearButton);
  primaryActions.appendChild(newFishButton);
  if (submitButton) primaryActions.appendChild(submitButton);
  form.appendChild(primaryActions);

  let filters = $('#creatorPropFilters', freshLayout);
  if (!filters) {
    filters = document.createElement('div');
    filters.id = 'creatorPropFilters'; filters.className = 'creator-prop-filters'; palette.before(filters);
  }
  if (!$('#creatorDriveNote', freshLayout)) {
    const note = document.createElement('p');
    note.id = 'creatorDriveNote'; note.className = 'creator-drive-note';
    note.textContent = 'Kliknij rekwizyt, aby dodać go do Dorsza. Potem możesz go przeciągać, skalować, obracać i odbijać lustrzanie.';
    filters.before(note);
  }

  const heading = root.querySelector('.section-heading>div');
  let readiness = root.querySelector('#propReadiness');
  if (!readiness && heading) {
    readiness = document.createElement('p'); readiness.id = 'propReadiness'; readiness.className = 'prop-readiness'; heading.appendChild(readiness);
  }
  if (readiness) readiness.innerHTML = `<b>${props.length}/${props.length}</b> rekwizytów · nowe grafiki z Drive · obrót · lustro · warstwy`;

  const propById = new Map(props.map(item => [item.id, item]));
  const selected = () => items.find(item => item.id === selectedId) || null;

  function renderFilters() {
    filters.innerHTML = categories.map(category => `<button type="button" class="creator-prop-filter ${category === activeCategory ? 'is-active' : ''}" data-creator-category="${esc(category)}">${esc(category)}</button>`).join('');
  }

  function renderPalette() {
    const visible = activeCategory === 'Wszystkie' ? props : props.filter(item => item.category === activeCategory);
    palette.innerHTML = visible.map(item => `<button type="button" class="prop-button" data-prop-id="${esc(item.id)}" title="${esc(item.label)}"><img src="${item.src}" alt="" loading="lazy" data-prop-preview="${esc(item.id)}"><span>${esc(item.label)}</span></button>`).join('');
  }

  function updateControls() {
    const item = selected();
    const disabled = !item;
    [sizeInput, rotationInput, duplicateButton, removeButton, fitButton, mirrorH, mirrorV, frontButton, backButton].forEach(node => { if (node) node.disabled = disabled; });
    if (selection) selection.textContent = item ? `${item.label} — przeciągnij po planszy lub użyj kontrolek.` : 'Wybierz rekwizyt z biblioteki.';
    if (sizeInput) sizeInput.value = String(item?.size ?? 112);
    if (rotationInput) rotationInput.value = String(item?.rotation ?? 0);
    if (sizeValue) sizeValue.textContent = item ? `${Math.round(item.size)}px` : '—';
    if (rotationValue) rotationValue.textContent = item ? `${Math.round(item.rotation)}°` : '—';
    mirrorH.classList.toggle('is-active', Boolean(item?.flipX === -1));
    mirrorV.classList.toggle('is-active', Boolean(item?.flipY === -1));
  }

  function renderItems() {
    placed.innerHTML = items.map(item => `<button type="button" class="placed-prop ${item.id === selectedId ? 'is-selected' : ''}" data-item-id="${esc(item.id)}" aria-label="${esc(item.label)}" style="--x:${item.x}%;--y:${item.y}%;--size:${item.size}px;--rotate:${item.rotation}deg;--flip-x:${item.flipX};--flip-y:${item.flipY};z-index:${item.z}"><img src="${item.src}" alt="${esc(item.label)}" draggable="false" data-placed-image="${esc(item.id)}"></button>`).join('');
    updateControls();
  }

  function addItem(def) {
    if (!def) return;
    const fit = def.fit;
    const item = { ...def, sourceId:def.id, id:`${def.id}-${Date.now()}-${serial++}`, x:fit.x, y:fit.y, size:fit.size, rotation:fit.rotation || 0, flipX:1, flipY:1, z:3 };
    items.push(item); selectedId = item.id; renderItems();
  }

  function fitSelected() {
    const item = selected(); if (!item) return;
    const fit = propById.get(item.sourceId)?.fit; if (!fit) return;
    Object.assign(item, {x:fit.x,y:fit.y,size:fit.size,rotation:fit.rotation || 0}); renderItems();
  }

  function cloneSelected() {
    const item = selected(); if (!item) return;
    const copy = {...item,id:`${item.sourceId}-copy-${Date.now()}-${serial++}`,x:Math.min(94,item.x+5),y:Math.min(94,item.y+5),z:Math.max(3,...items.map(entry=>entry.z||0))+1};
    items.push(copy); selectedId = copy.id; renderItems();
  }

  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-creator-category]'); if (!button) return;
    activeCategory = button.dataset.creatorCategory; renderFilters(); renderPalette();
  });

  palette.addEventListener('click', event => {
    const button = event.target.closest('[data-prop-id]'); if (!button) return;
    event.preventDefault(); addItem(propById.get(button.dataset.propId));
  });

  const replaceBrokenImage = image => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallback === '1') return;
    const sourceId = image.dataset.propPreview || items.find(entry => entry.id === image.dataset.placedImage)?.sourceId;
    const def = propById.get(sourceId); if (!def) return;
    image.dataset.fallback = '1'; image.src = def.fallback; def.src = def.fallback;
  };
  palette.addEventListener('error', event => replaceBrokenImage(event.target), true);
  placed.addEventListener('error', event => replaceBrokenImage(event.target), true);

  placed.addEventListener('click', event => {
    const node = event.target.closest('[data-item-id]'); if (!node) return;
    selectedId = node.dataset.itemId;
    $$('#placedItems .placed-prop', freshLayout).forEach(entry => entry.classList.toggle('is-selected', entry.dataset.itemId === selectedId));
    updateControls();
  });

  let drag = null;
  placed.addEventListener('pointerdown', event => {
    const node = event.target.closest('[data-item-id]'); if (!node) return;
    event.preventDefault(); selectedId = node.dataset.itemId;
    const item = selected(); if (!item) return;
    drag = {id:item.id,rect:stage.getBoundingClientRect()}; node.setPointerCapture?.(event.pointerId); updateControls();
  });
  window.addEventListener('pointermove', event => {
    if (!drag) return;
    const item = items.find(entry => entry.id === drag.id); if (!item) return;
    item.x = Math.max(4,Math.min(96,((event.clientX-drag.rect.left)/drag.rect.width)*100));
    item.y = Math.max(4,Math.min(96,((event.clientY-drag.rect.top)/drag.rect.height)*100));
    const node = placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`);
    if (node) { node.style.setProperty('--x',`${item.x}%`); node.style.setProperty('--y',`${item.y}%`); }
  });
  window.addEventListener('pointerup', () => { drag = null; });

  sizeInput?.addEventListener('input', event => {
    const item = selected(); if (!item) return;
    item.size = Number(event.target.value); if (sizeValue) sizeValue.textContent = `${Math.round(item.size)}px`;
    placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`)?.style.setProperty('--size',`${item.size}px`);
  });
  rotationInput?.addEventListener('input', event => {
    const item = selected(); if (!item) return;
    item.rotation = Number(event.target.value); if (rotationValue) rotationValue.textContent = `${Math.round(item.rotation)}°`;
    placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`)?.style.setProperty('--rotate',`${item.rotation}deg`);
  });

  fitButton.addEventListener('click', fitSelected);
  duplicateButton?.addEventListener('click', cloneSelected);
  removeButton?.addEventListener('click', () => { if (!selectedId) return; items = items.filter(item => item.id !== selectedId); selectedId = items.at(-1)?.id || null; renderItems(); });
  clearButton?.addEventListener('click', () => { items = []; selectedId = null; renderItems(); });
  mirrorH.addEventListener('click', () => { const item = selected(); if (!item) return; item.flipX *= -1; renderItems(); });
  mirrorV.addEventListener('click', () => { const item = selected(); if (!item) return; item.flipY *= -1; renderItems(); });
  frontButton.addEventListener('click', () => { const item = selected(); if (!item) return; item.z = Math.max(3,...items.map(entry=>entry.z||0))+1; renderItems(); });
  backButton.addEventListener('click', () => { const item = selected(); if (!item) return; item.z = 0; renderItems(); });
  nameInput?.addEventListener('input', () => { if (nameLabel) nameLabel.textContent = nameInput.value.trim() || 'Mój Dorsz'; });

  function resetCreator() {
    items=[]; selectedId=null; activeCategory='Wszystkie';
    if (nameInput) nameInput.value='Mój Dorsz'; if (nameLabel) nameLabel.textContent='Mój Dorsz'; if (roleInput) roleInput.selectedIndex=0; if (output) output.innerHTML='';
    renderFilters(); renderPalette(); renderItems();
  }
  newFishButton.addEventListener('click', resetCreator);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = nameInput?.value.trim() || 'Mój Dorsz';
    const role = roleInput?.value || 'Odkrywca';
    const stageWidth = Math.max(1,stage.getBoundingClientRect().width);
    const savedItems = items.map(item => ({...item,sizePct:Math.max(4,Math.min(65,item.size/stageWidth*100))}));
    if (output) {
      output.innerHTML = `<article class="creator-saved-card"><div class="creator-saved-preview">${savedItems.filter(item=>item.z===0).map(item=>`<img class="creator-saved-prop" src="${item.src}" alt="" style="left:${item.x}%;top:${item.y}%;width:${item.sizePct}%;z-index:0;transform:translate(-50%,-50%) rotate(${item.rotation}deg) scaleX(${item.flipX}) scaleY(${item.flipY})">`).join('')}<img class="saved-fish" src="assets/generated/dorsz-baza-transparent.png" alt="${esc(name)}">${savedItems.filter(item=>item.z!==0).map(item=>`<img class="creator-saved-prop" src="${item.src}" alt="" style="left:${item.x}%;top:${item.y}%;width:${item.sizePct}%;z-index:${item.z};transform:translate(-50%,-50%) rotate(${item.rotation}deg) scaleX(${item.flipX}) scaleY(${item.flipY})">`).join('')}</div><h3>${esc(name)}</h3><p>${esc(role)} · ${items.length} rekwizytów</p></article>`;
      output.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  });

  renderFilters(); renderPalette(); renderItems();
  console.info(`[Dorszolandia] Kreator Premium aktywny: ${props.length} rekwizytów.`);
}

initStableCreator();
