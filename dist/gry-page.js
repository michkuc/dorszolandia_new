import { residents } from './data.js';
import { games } from './catalog.js';

const $ = selector => document.querySelector(selector);
const $$ = (selector,scope=document) => [...scope.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const shuffle = list => [...list].sort(() => Math.random() - .5);
const catalog = $('#gameCatalogPage');
const stage = $('#gameStagePage');
let active = games[0]?.id || 'memory';
let timer;

function renderCatalog(){catalog.innerHTML=games.map(game=>`<button type="button" class="game-page-card ${game.id===active?'is-active':''}" data-game="${game.id}"><span>${game.icon}</span><b>${esc(game.title)}</b><small>${esc(game.description)}</small></button>`).join('')}
function heading(game,title){return `<div class="game-page-heading"><div><p class="kicker">${esc(game.title)}</p><h2>${esc(title)}</h2></div><button type="button" class="button outline small" data-restart>Od nowa</button></div>`}

function memory(game){
 const choices=shuffle(residents).slice(0,6), cards=shuffle([...choices,...choices]); let open=[],matched=0;
 stage.innerHTML=heading(game,'Znajdź sześć par')+`<div class="memory-page-grid">${cards.map((p,i)=>`<button type="button" data-key="${p.id}" aria-label="Karta ${i+1}"><span>?</span><b>${esc(p.name)}</b></button>`).join('')}</div><p class="game-page-result">Odkrywaj po dwie karty.</p>`;
 $$('.memory-page-grid button',stage).forEach(card=>card.addEventListener('click',()=>{if(card.classList.contains('open')||card.classList.contains('matched')||open.length===2)return;card.classList.add('open');open.push(card);if(open.length===2){const[a,b]=open;if(a.dataset.key===b.dataset.key){a.classList.add('matched');b.classList.add('matched');open=[];matched++;$('.game-page-result').textContent=matched===6?'Brawo! Wszystkie pary odnalezione.':`Masz ${matched} z 6 par.`}else setTimeout(()=>{a.classList.remove('open');b.classList.remove('open');open=[]},650)}}));
}
function quiz(game){
 const answer=residents[Math.floor(Math.random()*residents.length)], opts=shuffle([answer,...shuffle(residents.filter(p=>p.id!==answer.id)).slice(0,3)]);
 stage.innerHTML=heading(game,'Kto wykonuje tę pracę?')+`<p class="game-question">${esc(answer.roleText||answer.tagline||answer.role)}</p><div class="answer-page-grid">${opts.map(p=>`<button type="button" data-answer="${p.id}"><b>${esc(p.name)}</b><small>${esc(p.role)}</small></button>`).join('')}</div><p class="game-page-result"></p>`;
 $$('.answer-page-grid button',stage).forEach(btn=>btn.addEventListener('click',()=>{const ok=btn.dataset.answer===answer.id;$$('.answer-page-grid button',stage).forEach(x=>x.disabled=true);btn.classList.add(ok?'correct':'wrong');$('.game-page-result').textContent=ok?`Brawo! To ${answer.name}.`:`Tym razem: ${answer.name}.`}));
}
function goal(game){
 clearInterval(timer);stage.innerHTML=heading(game,'Obroń jak najwięcej piłek w 15 sekund')+`<div class="goal-page-field"><img src="assets/generated/zawod-19-transparent.png" alt="Bramkarz Dorsz" /><button id="goalPageBall" type="button" disabled>⚽</button><p id="goalPageScore">Obrony: 0 · czas: 15 s</p><button class="button sun" id="goalPageStart" type="button">Start</button></div>`;
 $('#goalPageStart').addEventListener('click',()=>{let score=0,time=15;const ball=$('#goalPageBall'),line=$('#goalPageScore'),start=$('#goalPageStart');start.disabled=true;ball.disabled=false;const move=()=>{ball.style.left=`${12+Math.random()*72}%`;ball.style.top=`${8+Math.random()*58}%`};move();ball.onclick=()=>{score++;move();line.textContent=`Obrony: ${score} · czas: ${time} s`};timer=setInterval(()=>{time--;line.textContent=`Obrony: ${score} · czas: ${time} s`;if(time<=0){clearInterval(timer);ball.disabled=true;start.disabled=false;line.textContent=`Koniec! Obrony: ${score}`}},1000)});
}
function detective(game){
 const cases=[['W jaskini zgasło światło. Co wybierasz?','🔦','Latarka'],['Trzeba zbadać mały ślad. Co wybierasz?','🔎','Lupa'],['Kapitan szuka kierunku. Co wybierasz?','🧭','Kompas'],['Rycerz potrzebuje ochrony. Co wybierasz?','🛡️','Tarcza']];const [q,icon,label]=cases[Math.floor(Math.random()*cases.length)];const pool=shuffle([[icon,label],['🎸','Gitara'],['⚽','Piłka'],['📘','Książka']]);
 stage.innerHTML=heading(game,'Wybierz właściwy rekwizyt')+`<p class="game-question">${q}</p><div class="prop-page-grid">${pool.map(([i,l])=>`<button type="button" data-label="${esc(l)}"><span>${i}</span><b>${esc(l)}</b></button>`).join('')}</div><p class="game-page-result"></p>`;$$('.prop-page-grid button',stage).forEach(btn=>btn.addEventListener('click',()=>{const ok=btn.dataset.label===label;$$('.prop-page-grid button',stage).forEach(x=>x.disabled=true);btn.classList.add(ok?'correct':'wrong');$('.game-page-result').textContent=ok?'Dobry trop!':`Najlepiej pasuje: ${label}.`}));
}
function code(game){
 const symbols=['🔵','🟡','🟢','🟣']; let sequence=[],input=[];stage.innerHTML=heading(game,'Zapamiętaj kod bąbelków')+`<div class="code-page-board"><button class="button sun" id="showCode" type="button">Pokaż kod</button><p id="codePreview">••••</p><div>${symbols.map((s,i)=>`<button type="button" data-code="${i}" disabled>${s}</button>`).join('')}</div><p class="game-page-result">Najpierw pokaż kod.</p></div>`;$('#showCode').addEventListener('click',()=>{sequence=Array.from({length:4},()=>Math.floor(Math.random()*4));input=[];$('#codePreview').textContent=sequence.map(i=>symbols[i]).join(' ');$$('[data-code]',stage).forEach(b=>b.disabled=true);setTimeout(()=>{$('#codePreview').textContent='? ? ? ?';$$('[data-code]',stage).forEach(b=>b.disabled=false)},1500)});$$('[data-code]',stage).forEach(btn=>btn.addEventListener('click',()=>{input.push(Number(btn.dataset.code));if(input.length===sequence.length){const ok=input.every((v,i)=>v===sequence[i]);$('.game-page-result').textContent=ok?'Kod odtworzony poprawnie!':'Spróbuj jeszcze raz.';$$('[data-code]',stage).forEach(b=>b.disabled=true)}}));
}
function treasure(game){
 const treasures=['⭐','🔑','💎','👑'];stage.innerHTML=heading(game,'Znajdź cztery skarby')+`<div class="treasure-page-scene"><span>🪸</span><span>🫧</span><span>🐚</span><span>🌿</span>${treasures.map((t,i)=>`<button type="button" data-treasure="${i}">${t}</button>`).join('')}</div><p class="game-page-result">Kliknij każdy skarb tylko raz.</p>`;let found=0;$$('[data-treasure]',stage).forEach(btn=>btn.addEventListener('click',()=>{if(btn.disabled)return;btn.disabled=true;btn.classList.add('found');found++;$('.game-page-result').textContent=found===4?'Wszystkie skarby znalezione!':`Znaleziono ${found} z 4.`}));
}
function renderGame(){clearInterval(timer);renderCatalog();const game=games.find(g=>g.id===active)||games[0];if(active==='memory')memory(game);else if(active==='quiz')quiz(game);else if(active==='goal')goal(game);else if(active==='detective')detective(game);else if(active==='code')code(game);else treasure(game);stage.querySelector('[data-restart]')?.addEventListener('click',renderGame)}
catalog.addEventListener('click',event=>{const btn=event.target.closest('[data-game]');if(!btn)return;active=btn.dataset.game;renderGame()});renderGame();
