import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => console.log(`[browser:${message.type()}] ${message.text()}`));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForSelector('#kreator .prop-button', { timeout: 10000 });

  const propCount = await page.$$eval('#kreator .prop-button', nodes => nodes.length);
  if (propCount < 30) throw new Error(`Za mało rekwizytów w kreatorze: ${propCount}`);

  const mirrorExists = await page.$('#mirrorHorizontal');
  const newFishExists = await page.$('#newFish');
  if (!mirrorExists || !newFishExists) throw new Error('Brakuje kontrolek Lustro lub Nowy Dorsz');

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

  if (pageErrors.length) throw new Error(`Błędy JS strony: ${pageErrors.join(' | ')}`);

  console.log(`CREATOR_SMOKE_PASS props=${propCount}`);
} finally {
  await browser.close();
}
