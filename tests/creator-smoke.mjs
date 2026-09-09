import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => console.log(`[browser:${message.type()}] ${message.text()}`));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('#kreator.creator-premium .prop-button', { timeout: 10000 });

  const propCount = await page.$$eval('#kreator .prop-button', nodes => nodes.length);
  if (propCount !== 36) throw new Error(`Kreator powinien mieć 36 rekwizytów, ma: ${propCount}`);

  const duplicateFilters = await page.$$eval('#creatorPropFilters', nodes => nodes.length);
  if (duplicateFilters !== 1) throw new Error(`Kreator zainicjalizował się wielokrotnie: ${duplicateFilters}`);

  const layout = await page.$eval('#kreator .creator-premium-layout', el => {
    const rect = el.getBoundingClientRect();
    const stage = el.querySelector('#creatorStage')?.getBoundingClientRect();
    const paletteImg = el.querySelector('.prop-button img')?.getBoundingClientRect();
    return { width: rect.width, stageWidth: stage?.width || 0, stageHeight: stage?.height || 0, thumbHeight: paletteImg?.height || 0 };
  });
  if (layout.width < 1200) throw new Error(`Układ desktop jest za wąski: ${layout.width}`);
  if (layout.stageWidth < 600 || layout.stageHeight < 500) throw new Error(`Plansza Dorsza jest za mała: ${layout.stageWidth}x${layout.stageHeight}`);
  if (layout.thumbHeight < 60) throw new Error(`Miniatury rekwizytów są za małe: ${layout.thumbHeight}`);

  const placedLayer = await page.$eval('#placedItems', el => getComputedStyle(el).zIndex);
  if (placedLayer !== 'auto') throw new Error(`Kontener rekwizytów blokuje warstwy: z-index=${placedLayer}`);

  for (const id of ['mirrorHorizontal','mirrorVertical','fitAccessory','bringFront','sendBack','newFish']) {
    if (!await page.$(`#${id}`)) throw new Error(`Brakuje kontrolki ${id}`);
  }

  await page.click('#kreator .prop-button');
  await page.waitForSelector('#placedItems .placed-prop', { timeout: 5000 });
  let placedCount = await page.$$eval('#placedItems .placed-prop', nodes => nodes.length);
  if (placedCount !== 1) throw new Error(`Kliknięcie rekwizytu nie dodało jednego elementu: ${placedCount}`);

  const sizeDisabled = await page.$eval('#accessorySize', el => el.disabled);
  const rotationDisabled = await page.$eval('#accessoryRotation', el => el.disabled);
  if (sizeDisabled || rotationDisabled) throw new Error('Kontrolki rozmiaru/obrotu pozostały zablokowane');

  await page.click('#mirrorHorizontal');
  const flip = await page.$eval('#placedItems .placed-prop', el => el.style.getPropertyValue('--flip-x').trim());
  if (flip !== '-1') throw new Error(`Lustro poziome nie działa: ${flip}`);

  await page.$eval('#accessoryRotation', el => {
    el.value = '45';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const rotation = await page.$eval('#placedItems .placed-prop', el => el.style.getPropertyValue('--rotate').trim());
  if (rotation !== '45deg') throw new Error(`Obrót nie działa: ${rotation}`);

  await page.click('#sendBack');
  let itemZ = await page.$eval('#placedItems .placed-prop', el => getComputedStyle(el).zIndex);
  if (itemZ !== '0') throw new Error(`Za Dorsza nie ustawia warstwy 0: ${itemZ}`);
  await page.click('#bringFront');
  itemZ = await page.$eval('#placedItems .placed-prop', el => Number(getComputedStyle(el).zIndex));
  if (!(itemZ > 1)) throw new Error(`Przed Dorsza nie ustawia warstwy przed rybą: ${itemZ}`);

  await page.$eval('#fishName', el => {
    el.value = 'Testowy Dorsz';
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  const nameLabel = await page.$eval('#fishNameLabel', el => el.textContent.trim());
  if (nameLabel !== 'Testowy Dorsz') throw new Error(`Zmiana imienia nie działa: ${nameLabel}`);

  await page.$eval('#creatorForm', form => form.requestSubmit());
  await page.waitForSelector('#customCardOutput .creator-saved-card', { timeout: 5000 });
  const savedText = await page.$eval('#customCardOutput .creator-saved-card', el => el.textContent);
  if (!savedText.includes('Testowy Dorsz')) throw new Error('Zapisana karta nie zawiera imienia');

  await page.click('#newFish');
  placedCount = await page.$$eval('#placedItems .placed-prop', nodes => nodes.length);
  if (placedCount !== 0) throw new Error(`Nowy Dorsz nie wyczyścił rekwizytów: ${placedCount}`);

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await new Promise(resolve => setTimeout(resolve, 150));
  const mobile = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    columns: getComputedStyle(document.querySelector('#kreator .creator-premium-layout')).gridTemplateColumns,
    stageWidth: document.querySelector('#creatorStage').getBoundingClientRect().width
  }));
  if (mobile.scrollWidth > mobile.clientWidth + 2) throw new Error(`Kreator powoduje poziomy scroll na mobile: ${mobile.scrollWidth}/${mobile.clientWidth}`);
  if (mobile.stageWidth > mobile.clientWidth) throw new Error(`Plansza wychodzi poza ekran mobile: ${mobile.stageWidth}/${mobile.clientWidth}`);

  if (pageErrors.length) throw new Error(`Błędy JS strony: ${pageErrors.join(' | ')}`);
  console.log(`CREATOR_PREMIUM_SMOKE_PASS props=${propCount} stage=${layout.stageWidth}x${layout.stageHeight} thumb=${layout.thumbHeight} mobile=${mobile.clientWidth}`);
} finally {
  await browser.close();
}
