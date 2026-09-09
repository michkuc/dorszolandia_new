import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
const errors=[];
const missing=[];
page.on('pageerror', error => { errors.push(String(error.message || error)); console.error('[pageerror]', error.message || error); });
page.on('console', message => console.log(`[browser:${message.type()}] ${message.text()}`));
page.on('response', response => {
  if (response.status() === 404) {
    const url = response.url();
    missing.push(url);
    console.error('[404]', url);
  }
});

try {
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4173/mieszkancy.html', {waitUntil:'domcontentloaded', timeout:30000});
  await new Promise(resolve => setTimeout(resolve,1800));
  const atlas = await page.evaluate(() => ({ count: document.querySelectorAll('#atlasGrid .atlas-page-card').length, title: document.querySelector('#atlas h2')?.textContent || '', storyPeople: document.querySelectorAll('#storyPeople .story-person-card').length }));
  if (atlas.count !== 59) throw new Error(`Atlas ma ${atlas.count}/59 kart; storyPeople=${atlas.storyPeople}; JS=${errors.join(' | ') || 'brak zgłoszonego pageerror'}`);
  if (atlas.storyPeople !== 4) throw new Error(`Główny cykl ma ${atlas.storyPeople}/4 bohaterów`);
  await page.click('#atlasGrid [data-atlas-index="58"]');
  await page.waitForSelector('#modal[open] .character-profile');
  const profile59 = await page.$eval('#modalContent', el => el.textContent);
  if (!profile59.includes('Kołopłetwy Sprint') || !profile59.includes('Kolarz Prądowych Tras')) throw new Error('Profil 59 nie otwiera się poprawnie');
  await page.click('#modalClose');

  await page.goto('http://127.0.0.1:4173/opowiadania.html', {waitUntil:'domcontentloaded', timeout:30000});
  await new Promise(resolve => setTimeout(resolve,1800));
  const libraryText = await page.$eval('#libraryStatus', el => el.textContent);
  if (!libraryText.includes('56')) throw new Error(`Biblioteka nie raportuje 56 historii: ${libraryText}; JS=${errors.join(' | ')}`);
  const tabs = await page.$$('#storyTabs56 [data-section]');
  if (tabs.length !== 5) throw new Error(`Biblioteka ma ${tabs.length}/5 części`);
  let total=0;
  for (let section=1; section<=5; section++) { await page.click(`#storyTabs56 [data-section="${section}"]`); await new Promise(resolve => setTimeout(resolve,80)); total += await page.$$eval('#storyGrid56 [data-story]', nodes => nodes.length); }
  if (total !== 56) throw new Error(`Biblioteka renderuje ${total}/56 opowiadań`);
  await page.click('#storyTabs56 [data-section="5"]'); await new Promise(resolve => setTimeout(resolve,80)); await page.click('#storyGrid56 [data-story="48"]'); await page.waitForSelector('#modal[open] .story-reader');
  if (!await page.$('#modalContent .master-source-note')) throw new Error('Brak jawnego statusu źródła dla historii 48–56');
  await page.click('#modalClose');
  if (errors.length) throw new Error(`Błędy JS: ${errors.join(' | ')}`);
  if (missing.length) throw new Error(`Brakujące zasoby 404 (${missing.length}): ${[...new Set(missing)].join(' | ')}`);
  console.log(`CANON_SMOKE_PASS atlas=${atlas.count} storyPeople=${atlas.storyPeople} stories=${total} sections=${tabs.length} missing=0`);
} finally { await browser.close(); }
