import puppeteer from 'puppeteer';

const browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
const page=await browser.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(String(e.message||e)));
const go=path=>page.goto(`http://127.0.0.1:4173/${path}`,{waitUntil:'domcontentloaded',timeout:30000});
try{
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
 await go('index.html');
 await page.waitForSelector('.home-page-grid');
 let count=await page.$$eval('.home-page-card',n=>n.length); if(count!==8)throw new Error(`Home ma ${count}/8 portali`);
 count=await page.$$eval('#site-menu a',n=>n.length); if(count!==9)throw new Error(`Menu ma ${count}/9 linków`);
 let rights=await page.$eval('#siteFooter',el=>el.textContent); if(!rights.includes('© 2026 Alexander Kuc. Wszelkie prawa zastrzeżone.'))throw new Error('Brak poprawnej stopki prawnej');

 await go('mieszkancy.html'); await page.waitForFunction(()=>document.querySelectorAll('#atlasGrid .atlas-page-card').length===59,{timeout:15000});
 await go('mapa.html'); await page.waitForSelector('#mapHotspots .map-page-hotspot'); count=await page.$$eval('#mapHotspots .map-page-hotspot',n=>n.length); if(count!==12)throw new Error(`Mapa ma ${count}/12 hotspotów`); await page.click('#mapHotspots .map-page-hotspot'); if(!(await page.$eval('#mapDetail',el=>el.textContent.trim().length>20)))throw new Error('Mapa nie aktualizuje opisu');

 await go('przygody.html'); await page.waitForSelector('#adventurePageGrid .adventure-page-card'); count=await page.$$eval('#adventurePageGrid .adventure-page-card',n=>n.length); if(count<1)throw new Error('Brak przygód'); await page.click('#adventurePageGrid .adventure-page-card'); await page.waitForSelector('#modal[open] .adventure-reader');

 await go('opowiadania.html'); await page.waitForFunction(()=>document.querySelector('#libraryStatus')?.textContent.includes('56'),{timeout:15000});

 await go('gry.html'); await page.waitForSelector('#gameCatalogPage .game-page-card'); count=await page.$$eval('#gameCatalogPage .game-page-card',n=>n.length); if(count!==6)throw new Error(`Gry: ${count}/6`); await page.click('#gameCatalogPage [data-game="quiz"]'); await page.waitForSelector('#gameStagePage .answer-page-grid');

 await go('kreator.html'); await page.waitForFunction(()=>document.querySelectorAll('#accessoryPalette .prop-button').length===36,{timeout:15000}); count=await page.$$eval('#accessoryPalette .prop-button',n=>n.length); if(count!==36)throw new Error(`Kreator: ${count}/36 rekwizytów`); for(const id of ['mirrorHorizontal','mirrorVertical','fitAccessory','bringFront','sendBack','newFish'])if(!await page.$(`#${id}`))throw new Error(`Brak kontrolki ${id}`); await page.click('#accessoryPalette .prop-button'); await page.waitForSelector('#placedItems .placed-prop');

 await go('muzyka.html'); count=await page.$$eval('audio',n=>n.length); if(count!==2)throw new Error(`Muzyka: ${count}/2 audio`); if(!await page.$('video'))throw new Error('Brak teledysku');
 await go('sklep.html'); count=await page.$$eval('.shop-item',n=>n.length); if(count!==4)throw new Error(`Sklep-plan: ${count}/4 produktów`); const shopText=await page.$eval('main',el=>el.textContent); if(!shopText.includes('W PRZYGOTOWANIU'))throw new Error('Sklep nie jest oznaczony jako plan');

 await page.setViewport({width:390,height:844,deviceScaleFactor:1}); await go('index.html'); await new Promise(r=>setTimeout(r,100)); const mobile=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,toggle:!!document.querySelector('.menu-toggle')})); if(mobile.scroll>mobile.client+2)throw new Error(`Poziomy scroll mobile ${mobile.scroll}/${mobile.client}`); if(!mobile.toggle)throw new Error('Brak menu mobile');
 if(errors.length)throw new Error(`Błędy JS stron: ${errors.join(' | ')}`);
 console.log('MULTIPAGE_SMOKE_PASS home=8 nav=9 map=12 games=6 props=36 music=2 shop=4 mobile=PASS');
}finally{await browser.close();}
