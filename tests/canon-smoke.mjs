import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
const page = await browser.newPage();
const errors=[];
page.on('pageerror', error => errors.push(String(error.message || error)));
try {
  await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await page.goto('http://127.0.0.1:4173/', {waitUntil:'domcontentloaded', timeout:30000});
  await page.waitForSelector('#atlas59 .atlas59-card', {timeout:15000});
  await page.waitForFunction(() => document.querySelectorAll('#atlas59 .atlas59-card').length === 59, {timeout:15000});

  const atlas = await page.evaluate(() => ({
    count: document.querySelectorAll('#atlas59 .atlas59-card').length,
    exactSprites: [...document.querySelectorAll('#atlas59 .atlas59-card img')].slice(-17).filter(img => img.getAttribute('src')?.includes('assets/canon/')).length,
    title: document.querySelector('#atlas59 h3')?.textContent || ''
  }));
  if (atlas.count !== 59) throw new Error(`Atlas ma ${atlas.count}/59 kart`);
  if (atlas.exactSprites !== 17) throw new Error(`Dokładne sprite'y późnego Atlasu: ${atlas.exactSprites}/17`);

  await page.click('#atlas59 [data-atlas-index="58"]');
  await page.waitForSelector('#modal[open] .atlas59-profile');
  const profile59 = await page.$eval('#modalContent', el => el.textContent);
  if (!profile59.includes('Kołopłetwy Sprint') || !profile59.includes('Kolarz Prądowych Tras')) throw new Error('Profil 59 nie otwiera się poprawnie');
  await page.click('#modalClose');

  await page.waitForFunction(() => document.querySelector('#stories-title')?.textContent.includes('56 pełnych opowiadań'), {timeout:15000});
  const tabs = await page.$$('#storyTabs [data-section56]');
  if (tabs.length !== 5) throw new Error(`Biblioteka ma ${tabs.length}/5 części`);
  let total=0;
  for (let section=1; section<=5; section++) {
    await page.click(`#storyTabs [data-section56="${section}"]`);
    await new Promise(resolve => setTimeout(resolve,80));
    total += await page.$$eval('#storyShelf [data-story56]', nodes => nodes.length);
  }
  if (total !== 56) throw new Error(`Biblioteka renderuje ${total}/56 opowiadań`);

  await page.click('#storyShelf [data-story56]');
  await page.waitForSelector('#modal[open] .story-reading');
  const sourceNote = await page.$('#modalContent .master-source-note');
  if (!sourceNote) throw new Error('Brak jawnego statusu źródła dla części 48–56');
  await page.click('#modalClose');

  if (errors.length) throw new Error(`Błędy JS strony: ${errors.join(' | ')}`);
  console.log(`CANON_SMOKE_PASS atlas=${atlas.count} exactSprites=${atlas.exactSprites} stories=${total} sections=${tabs.length}`);
} finally {
  await browser.close();
}
