import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
const errors=[];
page.on('pageerror', error => errors.push(String(error.message || error)));
try {
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});

  await page.goto('http://127.0.0.1:4173/mieszkancy.html', {waitUntil:'domcontentloaded', timeout:30000});
  await page.waitForFunction(() => document.querySelectorAll('#atlasGrid .atlas-page-card').length === 59, {timeout:15000});
  const atlas = await page.evaluate(() => ({
    count: document.querySelectorAll('#atlasGrid .atlas-page-card').length,
    title: document.querySelector('#atlas h2')?.textContent || '',
    storyPeople: document.querySelectorAll('#storyPeople .story-person-card').length
  }));
  if (atlas.count !== 59) throw new Error(`Atlas ma ${atlas.count}/59 kart`);
  if (atlas.storyPeople !== 4) throw new Error(`Główny cykl ma ${atlas.storyPeople}/4 bohaterów`);
  await page.click('#atlasGrid [data-atlas-index="58"]');
  await page.waitForSelector('#modal[open] .character-profile');
  const profile59 = await page.$eval('#modalContent', el => el.textContent);
  if (!profile59.includes('Kołopłetwy Sprint') || !profile59.includes('Kolarz Prądowych Tras')) throw new Error('Profil 59 nie otwiera się poprawnie');
  await page.click('#modalClose');

  await page.goto('http://127.0.0.1:4173/opowiadania.html', {waitUntil:'domcontentloaded', timeout:30000});
  await page.waitForFunction(() => document.querySelector('#libraryStatus')?.textContent.includes('56'), {timeout:15000});
  const tabs = await page.$$('#storyTabs56 [data-section]');
  if (tabs.length !== 5) throw new Error(`Biblioteka ma ${tabs.length}/5 części`);
  let total=0;
  for (let section=1; section<=5; section++) {
    await page.click(`#storyTabs56 [data-section="${section}"]`);
    await new Promise(resolve => setTimeout(resolve,80));
    total += await page.$$eval('#storyGrid56 [data-story]', nodes => nodes.length);
  }
  if (total !== 56) throw new Error(`Biblioteka renderuje ${total}/56 opowiadań`);
  await page.click('#storyTabs56 [data-section="5"]');
  await new Promise(resolve => setTimeout(resolve,80));
  await page.click('#storyGrid56 [data-story="48"]');
  await page.waitForSelector('#modal[open] .story-reader');
  const sourceNote = await page.$('#modalContent .master-source-note');
  if (!sourceNote) throw new Error('Brak jawnego statusu źródła dla historii 48–56');
  await page.click('#modalClose');

  if (errors.length) throw new Error(`Błędy JS: ${errors.join(' | ')}`);
  console.log(`CANON_SMOKE_PASS atlas=${atlas.count} storyPeople=${atlas.storyPeople} stories=${total} sections=${tabs.length}`);
} finally {
  await browser.close();
}
