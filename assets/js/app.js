const $=s=>document.querySelector(s);
const cp=(el,b)=>navigator.clipboard.writeText(el.value).then(()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1500)},()=>{b.textContent='Copy failed'});
const IMPL={
'word-counter':{ui:`<label for="in">Text</label><textarea id="in" rows="8"></textarea><div class="stats" id="out"></div>`,init(){const i=$('#in'),o=$('#out');const f=()=>{const v=i.value,w=(v.trim().match(/\S+/g)||[]).length,s=(v.match(/[^.!?]+[.!?]+(\s|$)/g)||[]).length,p=v.split(/\n\s*\n/).filter(x=>x.trim()).length;o.innerHTML=[['Words',w],['Characters',v.length],['No spaces',v.replace(/\s/g,'').length],['Sentences',s],['Paragraphs',p],['Reading time',w?Math.max(1,Math.round(w/200))+' min':'0 min']].map(([a,b])=>`<div class="stat"><b>${b}</b><span>${a}</span></div>`).join('')};i.oninput=f;f()}},
'case-converter':{ui:`<label for="in">Text</label><textarea id="in" rows="5"></textarea><div class="actions"><button class="btn ghost" data-m="up">UPPERCASE</button><button class="btn ghost" data-m="low">lowercase</button><button class="btn ghost" data-m="title">Title Case</button><button class="btn ghost" data-m="sent">Sentence case</button></div><label for="o">Result</label><textarea id="o" rows="5" readonly></textarea><div class="actions"><button class="btn" id="cp">Copy</button></div>`,init(){const M={up:v=>v.toUpperCase(),low:v=>v.toLowerCase(),title:v=>v.toLowerCase().replace(/(^|[\s\-(])(\p{L})/gu,(m,a,b)=>a+b.toUpperCase()),sent:v=>v.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu,(m,a,b)=>a+b.toUpperCase())};document.querySelectorAll('#tb [data-m]').forEach(b=>b.onclick=()=>{$('#o').value=M[b.dataset.m]($('#in').value)});$('#cp').onclick=e=>cp($('#o'),e.target)}},
'json-formatter':{ui:`<label for="in">JSON</label><textarea id="in" rows="9" spellcheck="false"></textarea><div class="actions"><button class="btn" data-m="2">Format</button><button class="btn ghost" data-m="0">Minify</button></div><p id="msg" role="alert" class="err"></p><label for="o">Result</label><textarea id="o" rows="9" readonly></textarea><div class="actions"><button class="btn ghost" id="cp">Copy</button></div>`,init(){const m=$('#msg');document.querySelectorAll('#tb [data-m]').forEach(b=>b.onclick=()=>{try{const x=JSON.parse($('#in').value);$('#o').value=JSON.stringify(x,null,+b.dataset.m||0);m.className='pv';m.textContent='Valid JSON.'}catch(e){$('#o').value='';m.className='err';m.textContent='Invalid JSON: '+e.message}});$('#cp').onclick=e=>cp($('#o'),e.target)}},
'subnet-calculator':{ui:`<label for="in">IPv4 address and prefix, for example 192.168.1.10/24</label><input id="in" value="192.168.1.10/24" autocomplete="off" spellcheck="false"><p id="msg" role="alert" class="err"></p><dl id="out"></dl>`,init(){const dot=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');const f=()=>{const m=$('#in').value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/),e=$('#msg'),o=$('#out');const o4=m&&m.slice(1,5).map(Number),p=m&&+m[5];if(!m||o4.some(x=>x>255)||p>32){e.textContent='Enter a valid IPv4 address and a prefix from 0 to 32.';o.innerHTML='';return}e.textContent='';const ip=((o4[0]<<24)|(o4[1]<<16)|(o4[2]<<8)|o4[3])>>>0,mask=p?(0xFFFFFFFF<<(32-p))>>>0:0,net=(ip&mask)>>>0,bc=(net|(~mask>>>0))>>>0,tot=2**(32-p),pt=p>=31,us=p===32?1:p===31?2:tot-2;const r=[['Address',dot(ip)],['Network',dot(net)],['Subnet mask',dot(mask)],['Wildcard mask',dot(~mask>>>0)],['Broadcast',pt?'not used':dot(bc)],['First host',dot(pt?net:net+1)],['Last host',dot(pt?bc:bc-1)],['Usable hosts',us.toLocaleString('en-US')],['Total addresses',tot.toLocaleString('en-US')]];o.innerHTML=r.map(([a,b])=>`<dt>${a}</dt><dd>${b}</dd>`).join('')};$('#in').oninput=f;f()}},
'slug-generator':{ui:`<label for="in">Title</label><input id="in" autocomplete="off"><label for="o">Slug</label><input id="o" readonly><div class="actions"><button class="btn" id="cp">Copy</button></div>`,init(){$('#in').oninput=()=>{$('#o').value=$('#in').value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')};$('#cp').onclick=e=>cp($('#o'),e.target)}}};

function initTyping(){
/* typing test */
const WORDS=('the of and to in is you that it he was for on are as with his they at be this from have or by one had not but what all were when we there can an your which their said if do will each about how up out them then she many some so these would other into has more her two like him see time could no make than first been its who now people my made over did down only way find use may water long little very after words called just where most know get through back much before go good new write our used me man too any day same right look think also around another came come work three word must because does part even place well such here take why help put different away again off went old number great tell men say small every found still between name should home big give air line set own under read last never us left end along while might next sound below saw something thought both few those always looked show large often together asked house world going want school important until form food keep children feet land side without boy once animal life enough took sometimes four head above kind began almost live page got earth need far hand high year mother light country father let night picture being study second soon story since white ever paper hard near sentence better best across during today however sure knew try told young sun thing whole hear example heard several change answer room sea against top turned learn point city play toward five using').split(' ');
const D={dur:60,left:60,text:'',typed:'',keys:0,errs:0,state:'idle',t0:0,acc:0,pauseAt:0,iv:null};
const ghost=$('#ghost'),box=$('#box'),wEl=$('#words');
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
function gen(){const n=D.dur===60?160:D.dur===180?420:700;let a=[],last='';
 for(let i=0;i<n;i++){let w;do{w=WORDS[Math.random()*WORDS.length|0]}while(w===last);a.push(w);last=w}
 return a.join(' ')}
function reset(){clearInterval(D.iv);Object.assign(D,{left:D.dur,typed:'',keys:0,errs:0,state:'idle',acc:0});
 D.text=gen();ghost.value='';ghost.disabled=false;
 wEl.innerHTML=[...D.text].map((c,i)=>`<span data-i="${i}">${c}</span>`).join('');
 wEl.children[0].classList.add('cur');box.scrollTop=0;box.classList.remove('paused','on');
 $('#res').hidden=true;$('#pause').disabled=true;$('#pause').textContent='Pause';
 $('#hint').textContent='Click the text and start typing.';stats()}
function elapsed(){return D.state==='run'?(performance.now()-D.t0)/1000:D.dur-D.left}
function stats(){
 let ok=0;for(let i=0;i<D.typed.length;i++)if(D.typed[i]===D.text[i])ok++;
 const el=Math.max(elapsed(),1)/60;
 const wpm=D.typed.length?Math.round(ok/5/el):0;
 const acc=D.keys?Math.round((D.keys-D.errs)/D.keys*100):100;
 $('#sTime').textContent=fmt(Math.max(0,Math.ceil(D.dur-elapsed())));
 $('#sWpm').textContent=wpm;$('#sAcc').textContent=acc+'%';$('#sErr').textContent=D.errs;
 return{wpm,acc,ok}}
function tick(){if(D.dur-elapsed()<=0)finish();else stats()}
function start(){D.state='run';D.t0=performance.now();D.iv=setInterval(tick,250);$('#pause').disabled=false;$('#hint').textContent='Esc restarts. Backspace fixes mistakes.'}
function finish(){clearInterval(D.iv);D.left=0;D.state='done';ghost.disabled=true;ghost.blur();D.left=0;
 const dur=D.dur;let ok=0;for(let i=0;i<D.typed.length;i++)if(D.typed[i]===D.text[i])ok++;
 const wpm=Math.round(ok/5/(dur/60)),acc=D.keys?Math.round((D.keys-D.errs)/D.keys*100):100;
 $('#sTime').textContent='0:00';$('#sWpm').textContent=wpm;$('#sAcc').textContent=acc+'%';$('#sErr').textContent=D.errs;
 $('#rWpm').textContent=wpm;
 $('#rLine').textContent=`${acc}% accuracy, ${D.errs} error${D.errs===1?'':'s'}, ${ok} correct characters in ${dur/60} minute${dur>60?'s':''}.`;
 $('#rNote').textContent=acc<92?'Accuracy is below 92%. Slow down slightly; accurate typing usually raises speed over time.':'Solid accuracy. Try a longer test to check consistency.';
 $('#res').hidden=false;$('#pause').disabled=true;$('#res').scrollIntoView({block:'nearest'})}
function paint(from){
 const to=Math.max(D.typed.length,from)+1;
 for(let i=Math.max(0,from-1);i<=Math.min(to,wEl.children.length-1);i++){
  const s=wEl.children[i];s.className=i<D.typed.length?(D.typed[i]===D.text[i]?'ok':'bad'):(i===D.typed.length?'cur':'')}
 const c=wEl.children[D.typed.length];if(c&&c.offsetTop-box.scrollTop>box.clientHeight*.6)box.scrollTop=c.offsetTop-box.clientHeight*.3}
ghost.addEventListener('input',()=>{
 if(D.state==='done'||D.state==='pause')return;
 const v=ghost.value,prev=D.typed.length;
 if(v.length>prev){if(D.state==='idle')start();
  for(let i=prev;i<v.length;i++){D.keys++;if(v[i]!==D.text[i])D.errs++}}
 D.typed=v;paint(Math.min(prev,v.length));stats();
 if(v.length>=D.text.length)finish()});
ghost.addEventListener('paste',e=>e.preventDefault());
ghost.addEventListener('focus',()=>box.classList.add('on'));
ghost.addEventListener('blur',()=>box.classList.remove('on'));
box.addEventListener('click',()=>{if(D.state!=='pause')ghost.focus()});
function pause(){
 if(D.state==='run'){D.left=D.dur-elapsed();clearInterval(D.iv);D.state='pause';box.classList.add('paused');ghost.disabled=true;$('#pause').textContent='Resume';$('#hint').textContent='Paused. Resume to continue.'}
 else if(D.state==='pause'){D.t0=performance.now()-(D.dur-D.left)*1000;D.state='run';D.iv=setInterval(tick,250);box.classList.remove('paused');ghost.disabled=false;ghost.focus();$('#pause').textContent='Pause';$('#hint').textContent='Esc restarts. Backspace fixes mistakes.'}}
$('#pause').addEventListener('click',pause);
$('#restart').addEventListener('click',()=>{reset();ghost.focus()});
$('#again').addEventListener('click',()=>{reset();ghost.focus()});
addEventListener('keydown',e=>{if(e.key==='Escape'){reset();ghost.focus()}});
document.querySelectorAll('.modes .chip').forEach(b=>b.addEventListener('click',()=>{
 D.dur=+b.dataset.d;document.querySelectorAll('.modes .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));reset();ghost.focus()}));

reset();}

function initDir(){const q=$('#q'),cards=[...document.querySelectorAll('#all .card')],chips=[...document.querySelectorAll('#chips .chip')];let cat='All';
const M={seo:'SEO',documents:'Documents',text:'Text','it-network':'IT & Network',productivity:'Productivity'};
const f=()=>{const v=q.value.trim().toLowerCase();let n=0;cards.forEach(c=>{const ok=(cat==='All'||c.dataset.c===cat)&&(!v||c.dataset.s.includes(v));c.hidden=!ok;if(ok)n++});$('#count').textContent=n?n+' tool'+(n>1?'s':''):'No tools match. Try a different word or category.'};
const set=c=>{cat=c;chips.forEach(x=>x.setAttribute('aria-pressed',x.dataset.c===cat));f()};
chips.forEach(b=>b.onclick=()=>set(b.dataset.c));q.oninput=f;
const p=new URLSearchParams(location.search).get('q');if(p)q.value=p;
const h=()=>set(M[decodeURIComponent(location.hash.slice(1)).toLowerCase()]||'All');addEventListener('hashchange',h);h()}
const pg=document.body.dataset.page;
if(pg==='typing-test')initTyping();else if(IMPL[pg]){$('#tb').innerHTML=IMPL[pg].ui;IMPL[pg].init()}else if(pg==='tools')initDir();
