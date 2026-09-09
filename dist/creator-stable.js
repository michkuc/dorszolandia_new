function initStableCreator() {
const root = document.querySelector('#kreator');
if (root) {
  const oldLayout = root.querySelector('.creator-layout');
  if (oldLayout) {
    const freshLayout = oldLayout.cloneNode(true);
    oldLayout.replaceWith(freshLayout);

    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
    const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'
    }[c]));

    const drive = id => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
    const prop = (id, label, src, x, y, size, rotation = 0, category = 'Dodatki') => ({
      id, label, src, category, fit: { x, y, size, rotation }
    });

    const props = [
      prop('aparat','Aparat','assets/props/aparat.webp',67,62,122,0,'Zawody'),
      prop('bebnek','Bębenek','assets/props/bebnek.webp',66,67,132,0,'Muzyka'),
      prop('czapka-kapitana','Czapka kapitana','assets/props/czapka-kapitana.webp',43,18,176,0,'Głowa'),
      prop('gitara','Gitara','assets/props/gitara.webp',61,65,184,-18,'Muzyka'),
      prop('gogle','Gogle','assets/props/gogle.webp',43,43,174,0,'Twarz'),
      prop('helm','Hełm','assets/props/helm.webp',43,21,174,0,'Głowa'),
      prop('kapelusz-czarodzieja','Kapelusz czarodzieja','assets/props/kapelusz-czarodzieja.webp',43,16,190,-4,'Fantazja'),
      prop('kapelusz-pirata','Kapelusz pirata','assets/props/kapelusz-pirata.webp',43,17,184,0,'Głowa'),
      prop('kolo','Koło sterowe','assets/props/kolo.webp',69,68,150,0,'Przygoda'),
      prop('korona','Korona','assets/props/korona.webp',43,16,168,0,'Głowa'),
      prop('kotwica','Kotwica','assets/props/kotwica.webp',69,70,150,8,'Przygoda'),
      prop('lornetka','Lornetka','assets/props/lornetka.webp',66,48,138,0,'Przygoda'),
      prop('luk','Łuk','assets/props/luk.webp',70,59,180,0,'Średniowieczne'),
      prop('luneta','Luneta','assets/props/luneta.webp',69,49,155,-8,'Przygoda'),
      prop('miecz','Miecz','assets/props/miecz.webp',70,61,175,-20,'Średniowieczne'),
      prop('pilka','Piłka','assets/props/pilka.webp',24,74,108,0,'Sport'),
      prop('rozdzka','Różdżka','assets/props/rozdzka.webp',70,55,150,-25,'Fantazja'),
      prop('tarcza','Tarcza','assets/props/tarcza.webp',63,66,154,0,'Średniowieczne'),
      prop('trabka','Trąbka','assets/props/trabka.webp',68,59,150,-12,'Muzyka'),
      prop('pergamin','Pergamin',drive('1J91ldtorzG_Lf0AwexKHoeC7PZovEWzJ'),67,70,132,-8,'Przygoda'),
      prop('latarenka','Latarenka',drive('1gwoaJRkhTeAXoNgiqs09tENh-UkvcILg'),68,64,125,0,'Przygoda'),
      prop('helm-czerwony','Hełm z pióropuszem',drive('1A4YzyOPL6mjq9bj-hW6Ch4OjKnzSA0ID'),43,20,178,0,'Średniowieczne'),
      prop('kordelas','Kordelas pirata',drive('1LmNeS0YnOuFv7zHpKwjgEMTd7WY1V5s7'),70,61,168,-20,'Przygoda'),
      prop('tarcza-herbowa','Tarcza herbowa',drive('1ihYu6Y6L3sHwxcPNtyR28UAr9N413z1u'),62,66,154,0,'Średniowieczne'),
      prop('wlocznia','Włócznia',drive('19eeH4TLkNtSD98jvvAH1NSHEyW9uAZzY'),72,58,190,-15,'Średniowieczne'),
      prop('kolczan','Kołczan',drive('176My-RofP1y6sRirnsxy20K2ypYq-0Q0'),67,60,145,8,'Średniowieczne'),
      prop('korona-niebieska','Korona z klejnotami',drive('1MLFOfaWCouSauOMMKWuVSR1Ue_qtDVPo'),43,16,170,0,'Głowa'),
      prop('topor','Topór bojowy',drive('12sf_KViDJgbIDEm0ke_vPl_sfLEj0a9F'),70,61,170,-18,'Średniowieczne'),
      prop('miecz-zloty','Miecz ze złotym jelcem',drive('1rmQlihFLCjpUDhHMNFmS2tfDoqxnmccJ'),70,61,170,-20,'Średniowieczne'),
      prop('plecak','Plecak',drive('1pXDnvG_fiHFalhEaQzquy9elMLKFNQpC'),29,61,150,0,'Przygoda'),
      prop('czapka','Czapka',drive('1NXOGJuK74ft-ksWc04RVKOjFYr9XaIbL'),43,18,170,0,'Głowa'),
      prop('stetoskop','Stetoskop',drive('1vPxwlDBLH4HOqKfWPCIT-BKwSBKk_zxU'),57,59,150,0,'Zawody'),
      prop('ksiazka','Książka',drive('1ziobV72LPKSubv0L047V3bwFapRUPpwc'),66,71,130,-8,'Nauka'),
      prop('kontroler','Kontroler',drive('1fZ_YK6xqM7Fy6-aGEiEnMN6YDvH-myAZ'),66,68,130,0,'Dodatki'),
      prop('pedzel','Pędzel',drive('1mOUIimoYXnNXF5Q3yrGLkMio_hPe0IVy'),69,59,135,-18,'Sztuka'),
      prop('aparat-morski','Aparat morski',drive('1gwjIRLcn80nB6se_gv8Pd5CdVELjuUxs'),67,62,122,0,'Zawody')
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

    actions.querySelectorAll('#fitAccessory,#bringFront,#sendBack,#mirrorHorizontal,#mirrorVertical').forEach(node => node.remove());

    const makeButton = (id, label) => {
      const button = document.createElement('button');
      button.id = id;
      button.type = 'button';
      button.className = 'button outline small creator-extra-control';
      button.textContent = label;
      return button;
    };

    const fitButton = makeButton('fitAccessory','Dopasuj');
    const mirrorH = makeButton('mirrorHorizontal','Lustro ↔');
    const mirrorV = makeButton('mirrorVertical','Lustro ↕');
    const frontButton = makeButton('bringFront','Przed Dorsza');
    const backButton = makeButton('sendBack','Za Dorsza');
    actions.prepend(backButton);
    actions.prepend(frontButton);
    actions.prepend(mirrorV);
    actions.prepend(mirrorH);
    actions.prepend(fitButton);

    let newFishButton = $('#newFish', freshLayout);
    if (!newFishButton) {
      newFishButton = document.createElement('button');
      newFishButton.id = 'newFish';
      newFishButton.type = 'button';
      newFishButton.className = 'button outline';
      newFishButton.textContent = 'Nowy Dorsz';
      form.appendChild(newFishButton);
    }

    if (!$('#creatorStableStyles')) {
      const style = document.createElement('style');
      style.id = 'creatorStableStyles';
      style.textContent = `
        #creatorStage>#placedItems{z-index:auto!important;pointer-events:none!important}
        #creatorStage>#creatorFish{z-index:1!important;pointer-events:none!important}
        #placedItems .placed-prop{pointer-events:auto!important;transform:translate(-50%,-50%) rotate(var(--rotate)) scaleX(var(--flip-x,1)) scaleY(var(--flip-y,1));user-select:none}
        .creator-prop-filters{display:flex;gap:.38rem;overflow:auto;padding:.1rem 0 .65rem;scrollbar-width:thin}
        .creator-prop-filter{white-space:nowrap;border:1px solid #b9e6ef;border-radius:999px;background:#fff;color:#073d79;padding:.42rem .66rem;font-weight:900;font-size:.72rem}
        .creator-prop-filter.is-active{background:#073d79;color:#fff;border-color:#073d79}
        .creator-extra-control[disabled]{opacity:.4;cursor:not-allowed}
        .creator-extra-control.is-active{background:#073d79;color:#fff;border-color:#073d79}
        .creator-saved-card{max-width:430px;margin:1.2rem auto 0;border-radius:24px;background:#063c78;color:#fff;padding:1rem;box-shadow:0 14px 35px #003a6726}
        .creator-saved-preview{position:relative;aspect-ratio:1.15/1;border-radius:20px;overflow:hidden;background:linear-gradient(#1292ce,#07548e);border:4px solid #fff}
        .creator-saved-preview>.saved-fish{position:absolute;z-index:1;left:11%;top:14%;height:70%;width:78%;object-fit:contain}
        .creator-saved-prop{position:absolute;object-fit:contain;pointer-events:none}
        .creator-saved-card h3{color:#ffc62f;margin:.75rem 0 .15rem}
        .creator-saved-card p{color:#eafaff!important;margin:0}
        .creator-drive-note{font-size:.76rem!important;color:#38708e!important;margin:.45rem 0 0!important}
        @media(max-width:700px){.creator-extra-control{flex:1 1 42%}}
      `;
      document.head.appendChild(style);
    }

    let filters = $('#creatorPropFilters', freshLayout);
    if (!filters) {
      filters = document.createElement('div');
      filters.id = 'creatorPropFilters';
      filters.className = 'creator-prop-filters';
      palette.before(filters);
    }

    if (!$('#creatorDriveNote', freshLayout)) {
      const note = document.createElement('p');
      note.id = 'creatorDriveNote';
      note.className = 'creator-drive-note';
      note.textContent = 'Kliknij rekwizyt, aby dodać go do Dorsza. Potem możesz go przeciągać, skalować, obracać i odbijać lustrzanie.';
      filters.before(note);
    }

    const heading = root.querySelector('.section-heading>div');
    const readiness = root.querySelector('#propReadiness');
    if (readiness) readiness.innerHTML = `<b>${props.length}/${props.length}</b> rekwizytów · przeciąganie · rozmiar · obrót · lustro · warstwy`;
    else if (heading) {
      const status = document.createElement('p');
      status.id = 'propReadiness';
      status.className = 'prop-readiness';
      status.innerHTML = `<b>${props.length}/${props.length}</b> rekwizytów · przeciąganie · rozmiar · obrót · lustro · warstwy`;
      heading.appendChild(status);
    }

    const fallback = label => {
      const safe = esc(label);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 180"><rect x="5" y="5" width="210" height="170" rx="30" fill="#eefbff" stroke="#087fcd" stroke-width="7"/><text x="110" y="93" text-anchor="middle" font-size="52">✦</text><text x="110" y="145" text-anchor="middle" font-size="15" font-family="Arial" font-weight="700" fill="#073d79">${safe}</text></svg>`;
      return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
    };

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
      if (selection) selection.textContent = item ? `${item.label} — przeciągnij po planszy lub użyj kontrolek.` : 'Wybierz rekwizyt.';
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

    function addItem(propDef) {
      if (!propDef) return;
      const fit = propDef.fit || { x:50, y:50, size:112, rotation:0 };
      const item = { ...propDef, sourceId: propDef.id, id: `${propDef.id}-${Date.now()}-${serial++}`, x: fit.x, y: fit.y, size: fit.size, rotation: fit.rotation || 0, flipX: 1, flipY: 1, z: 3 };
      items.push(item);
      selectedId = item.id;
      renderItems();
    }

    function removeSelected() {
      if (!selectedId) return;
      items = items.filter(item => item.id !== selectedId);
      selectedId = items.at(-1)?.id || null;
      renderItems();
    }

    function fitSelected() {
      const item = selected();
      if (!item) return;
      const fit = propById.get(item.sourceId)?.fit || item.fit;
      if (!fit) return;
      item.x = fit.x; item.y = fit.y; item.size = fit.size; item.rotation = fit.rotation || 0;
      renderItems();
    }

    function cloneSelected() {
      const item = selected();
      if (!item) return;
      const copy = { ...item, id: `${item.sourceId}-copy-${Date.now()}-${serial++}`, x: Math.min(94, item.x + 6), y: Math.min(94, item.y + 6), z: item.z === 0 ? 0 : Math.max(3, ...items.map(entry => entry.z || 0)) + 1 };
      items.push(copy);
      selectedId = copy.id;
      renderItems();
    }

    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-creator-category]');
      if (!button) return;
      activeCategory = button.dataset.creatorCategory;
      renderFilters();
      renderPalette();
    });

    palette.addEventListener('click', event => {
      const button = event.target.closest('[data-prop-id]');
      if (!button) return;
      event.preventDefault();
      addItem(propById.get(button.dataset.propId));
    });

    palette.addEventListener('error', event => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement)) return;
      const item = propById.get(image.dataset.propPreview);
      if (!item || image.dataset.fallback) return;
      image.dataset.fallback = '1';
      item.src = fallback(item.label);
      image.src = item.src;
    }, true);

    placed.addEventListener('error', event => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;
      const item = items.find(entry => entry.id === image.dataset.placedImage);
      if (!item) return;
      image.dataset.fallback = '1';
      item.src = fallback(item.label);
      image.src = item.src;
    }, true);

    placed.addEventListener('click', event => {
      const node = event.target.closest('[data-item-id]');
      if (!node) return;
      selectedId = node.dataset.itemId;
      $$('#placedItems .placed-prop', freshLayout).forEach(entry => entry.classList.toggle('is-selected', entry.dataset.itemId === selectedId));
      updateControls();
    });

    let drag = null;
    placed.addEventListener('pointerdown', event => {
      const node = event.target.closest('[data-item-id]');
      if (!node) return;
      event.preventDefault();
      selectedId = node.dataset.itemId;
      const item = selected();
      if (!item) return;
      const rect = stage.getBoundingClientRect();
      drag = { id: item.id, rect };
      node.setPointerCapture?.(event.pointerId);
      $$('#placedItems .placed-prop', freshLayout).forEach(entry => entry.classList.toggle('is-selected', entry.dataset.itemId === selectedId));
      updateControls();
    });

    window.addEventListener('pointermove', event => {
      if (!drag) return;
      const item = items.find(entry => entry.id === drag.id);
      if (!item) return;
      item.x = Math.max(3, Math.min(97, ((event.clientX - drag.rect.left) / drag.rect.width) * 100));
      item.y = Math.max(3, Math.min(97, ((event.clientY - drag.rect.top) / drag.rect.height) * 100));
      const node = placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`);
      if (node) { node.style.setProperty('--x', `${item.x}%`); node.style.setProperty('--y', `${item.y}%`); }
    });

    window.addEventListener('pointerup', () => { drag = null; });

    sizeInput?.addEventListener('input', event => {
      const item = selected();
      if (!item) return;
      item.size = Number(event.target.value);
      if (sizeValue) sizeValue.textContent = `${Math.round(item.size)}px`;
      const node = placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`);
      if (node) node.style.setProperty('--size', `${item.size}px`);
    });

    rotationInput?.addEventListener('input', event => {
      const item = selected();
      if (!item) return;
      item.rotation = Number(event.target.value);
      if (rotationValue) rotationValue.textContent = `${Math.round(item.rotation)}°`;
      const node = placed.querySelector(`[data-item-id="${CSS.escape(item.id)}"]`);
      if (node) node.style.setProperty('--rotate', `${item.rotation}deg`);
    });

    fitButton.addEventListener('click', fitSelected);
    duplicateButton?.addEventListener('click', cloneSelected);
    removeButton?.addEventListener('click', removeSelected);
    clearButton?.addEventListener('click', () => { items = []; selectedId = null; renderItems(); });

    mirrorH.addEventListener('click', () => { const item = selected(); if (!item) return; item.flipX *= -1; renderItems(); });
    mirrorV.addEventListener('click', () => { const item = selected(); if (!item) return; item.flipY *= -1; renderItems(); });
    frontButton.addEventListener('click', () => { const item = selected(); if (!item) return; item.z = Math.max(3, ...items.map(entry => entry.z || 0)) + 1; renderItems(); });
    backButton.addEventListener('click', () => { const item = selected(); if (!item) return; item.z = 0; renderItems(); });

    nameInput?.addEventListener('input', () => { if (nameLabel) nameLabel.textContent = nameInput.value.trim() || 'Mój Dorsz'; });

    function resetCreator() {
      items = [];
      selectedId = null;
      activeCategory = 'Wszystkie';
      if (nameInput) nameInput.value = 'Mój Dorsz';
      if (nameLabel) nameLabel.textContent = 'Mój Dorsz';
      if (roleInput) roleInput.selectedIndex = 0;
      if (output) output.innerHTML = '';
      renderFilters(); renderPalette(); renderItems();
    }

    newFishButton.addEventListener('click', resetCreator);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const name = nameInput?.value.trim() || 'Mój Dorsz';
      const role = roleInput?.value || 'Odkrywca';
      const stageWidth = Math.max(1, stage.getBoundingClientRect().width);
      const savedItems = items.map(item => ({ ...item, sizePct: Math.max(4, Math.min(65, item.size / stageWidth * 100)) }));
      if (output) {
        output.innerHTML = `<article class="creator-saved-card"><div class="creator-saved-preview">${savedItems.filter(item => item.z === 0).map(item => `<img class="creator-saved-prop" src="${item.src}" alt="" style="left:${item.x}%;top:${item.y}%;width:${item.sizePct}%;z-index:0;transform:translate(-50%,-50%) rotate(${item.rotation}deg) scaleX(${item.flipX}) scaleY(${item.flipY})">`).join('')}<img class="saved-fish" src="assets/generated/dorsz-baza-transparent.png" alt="${esc(name)}">${savedItems.filter(item => item.z !== 0).map(item => `<img class="creator-saved-prop" src="${item.src}" alt="" style="left:${item.x}%;top:${item.y}%;width:${item.sizePct}%;z-index:${item.z};transform:translate(-50%,-50%) rotate(${item.rotation}deg) scaleX(${item.flipX}) scaleY(${item.flipY})">`).join('')}</div><h3>${esc(name)}</h3><p>${esc(role)} · ${items.length} rekwizytów</p></article>`;
        output.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
    });

    renderFilters();
    renderPalette();
    renderItems();
    console.info(`[Dorszolandia] Stabilny kreator aktywny: ${props.length} rekwizytów, lustro poziome/pionowe, drag, skala, obrót i warstwy.`);
  }
}
}
initStableCreator();
