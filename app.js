/* Turma do Thur — app de colorir e aprender */
'use strict';
{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const cfg=Object.assign({som:true,voz:true,vozTipo:'masc'},store.get('thur-cfg',{}));
const COLORS=['#FF4D4D','#FF9F1C','#FFD60A','#4CC764','#8FE0A0','#4FB3F0','#3D5AFE','#9B5DE5','#FF85C0','#F4C9A0','#8D5B3E','#2B2B2B','#FFFFFF'];
const NEON=['#FF2E88','#FF9F1C','#FFE600','#39FF14','#00F0FF','#3D7BFF','#B44CFF','#FFFFFF'];
const rnd=n=>Math.floor(Math.random()*n);
const DPR=()=>Math.min(window.devicePixelRatio||1,2);
const evs=e=>e.getCoalescedEvents?e.getCoalescedEvents():[e];
const lum=h=>{const n=parseInt(h.slice(1),16);return(0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255};

/* ---------- som, voz, festa, avisos ---------- */
let toastT;
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2600)}
let ac=null;
function actx(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume()}catch(e){ac=null}return ac}
function pop(f=520){if(!cfg.som)return;const a=actx();if(!a)return;try{const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.setValueAtTime(f,a.currentTime);o.frequency.exponentialRampToValueAtTime(f*1.8,a.currentTime+.12);g.gain.setValueAtTime(.16,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.18);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+.2)}catch(e){}}
function splashSound(){if(!cfg.som)return;const a=actx();if(!a)return;try{const n=a.sampleRate*.25,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='lowpass';f.frequency.value=900;g.gain.value=.5;s.buffer=b;s.connect(f).connect(g).connect(a.destination);s.start()}catch(e){}}
/* vozes: Thur = menino; mascotes = vozinhas de bichinho (estilo esquilo: bem aguda e rápida) */
const VOZES={clara:{p:1.15,r:.98,g:'fem'},lois:{p:.95,r:.98,g:'masc'},thur:{p:1.75,r:1.05},zuzu:{p:2,r:1.3},lelo:{p:2,r:1.18},pituca:{p:2,r:1.4},bubu:{p:2,r:1.24}};
const MASC=/daniel|ant[oô]nio|felipe|fabio|f[aá]bio|humberto|julio|j[uú]lio|ricardo|donato|valerio|male|masculin/i;
const FEM=/maria|luciana|francisca|vit[oó]ria|thalita|raquel|camila|leila|helo[ií]sa|manuela|yara|female|feminin/i;
/* os pais escolhem voz masculina ou feminina; se o celular não tiver a voz pedida, muda o tom da que existe */
let VCACHE={};function ptVoice(g=cfg.vozTipo){const vs=speechSynthesis.getVoices().filter(v=>/pt[-_]BR/i.test(v.lang));if(!vs.length)return null;if(VCACHE[g]&&vs.includes(VCACHE[g]))return VCACHE[g];const W=g==='fem'?FEM:MASC,N=g==='fem'?MASC:FEM;let V;
  V=vs.find(v=>W.test(v.name)&&v.localService)||vs.find(v=>W.test(v.name))||vs.find(v=>!N.test(v.name)&&v.localService)||vs.find(v=>!N.test(v.name))||vs[0];VCACHE[g]=V;V['_ok'+g]=W.test(V.name);return V}
const vozAjuste=(v,g)=>v&&v['_ok'+g]?1:g==='fem'?1.12:.82;
function speak(t,who='thur',queue=false){if(!cfg.voz)return;try{const s=window.speechSynthesis;if(!s)return;if(!queue)s.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';const vz=VOZES[who]||VOZES.thur;const g=vz.g||cfg.vozTipo,v=ptVoice(g);if(v)u.voice=v;u.pitch=Math.min(2,vz.p*vozAjuste(v,g));u.rate=vz.r;
  /* avisa quem está falando, para a boca mexer */
  const fala=on=>document.dispatchEvent(new CustomEvent('thur-fala',{detail:{who,on}}));clearTimeout(speak.t);
  u.onstart=()=>{if(speak.cur!==u)return;fala(true);clearTimeout(speak.t);speak.t=setTimeout(()=>fala(false),600+t.length*75/vz.r)};u.onend=u.onerror=()=>{if(speak.cur!==u)return;clearTimeout(speak.t);fala(false)};speak.cur=u;
  fala(true);speak.t=setTimeout(()=>fala(false),900+t.length*75/vz.r);s.speak(u)}catch(e){}}
try{speechSynthesis.addEventListener('voiceschanged',()=>{VCACHE={}})}catch(e){}
function party(){const p=$('#party');p.innerHTML='';for(let i=0;i<44;i++){const c=document.createElement('i');c.style.left=Math.random()*100+'vw';c.style.background=COLORS[i%12];c.style.animationDelay=Math.random()*.5+'s';p.appendChild(c)}[660,880,1100].forEach((f,i)=>setTimeout(()=>pop(f),i*120));setTimeout(()=>p.innerHTML='',2500)}
function hop(){$$('.peek').forEach(p=>{p.classList.remove('hop');void p.offsetWidth;p.classList.add('hop')});const h=document.getElementById('helper');if(h&&h.classList.contains('on'))h.animate([{transform:'translateY(0)'},{transform:'translateY(-25%)'},{transform:'translateY(0)'}],{duration:450})}
function peek(view){const p=view.querySelector('.peek');if(p)p.src='img/pets/'+PETS[rnd(4)]+'.png'}
let askCb=null;
function ask(text,cb){$('#dlgT').textContent=text;askCb=cb;$('#veil').classList.add('on')}
$('#no').onclick=()=>$('#veil').classList.remove('on');
$('#yes').onclick=()=>{$('#veil').classList.remove('on');askCb&&askCb()};

/* ---------- navegação com arco-íris ---------- */
const onShow={};
function show(id,rain=true){
  if(!document.getElementById(id))id='home';
  const swap=()=>{$$('.view').forEach(v=>v.classList.toggle('on',v.id===id));onShow[id]&&onShow[id]();
    if(location.hash.slice(1)!==id){try{history.replaceState(null,'','#'+id)}catch(e){}}};
  const tr=$('#tr');
  if(rain&&!matchMedia('(prefers-reduced-motion: reduce)').matches){tr.classList.remove('go');void tr.offsetWidth;tr.classList.add('go');const tp=$('#trp');tp.classList.remove('go');void tp.offsetWidth;tp.classList.add('go');setTimeout(swap,330)}else swap();
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){pop(440);show(b.dataset.go)}});

/* ---------- paletas ---------- */
function palette(el,colors,onPick,start=0,nums=false){
  el.innerHTML=colors.map((c,i)=>`<button class="sw${i===start?' on':''}${lum(c)<.45?' darkc':''}" style="background:${c}" data-i="${i}" aria-label="${nums?'Cor número '+(i+1):'Cor '+(i+1)}">${nums?i+1:''}</button>`).join('');
  el.onclick=e=>{const b=e.target.closest('.sw');if(!b)return;el.querySelectorAll('.sw').forEach(s=>s.classList.toggle('on',s===b));onPick(+b.dataset.i,colors[+b.dataset.i]);pop(600+ +b.dataset.i*30)};
}

/* ---------- galeria (IndexedDB) ---------- */
let dbp=null;
function db(){if(!dbp)dbp=new Promise((res,rej)=>{try{const r=indexedDB.open('thur',1);r.onupgradeneeded=()=>r.result.createObjectStore('arte',{keyPath:'id',autoIncrement:true});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});return dbp}
function tx(mode,fn){return db().then(d=>new Promise((res,rej)=>{const t=d.transaction('arte',mode);const out=fn(t.objectStore('arte'));t.oncomplete=()=>res(out&&out.result);t.onerror=()=>rej(t.error)}))}
const dbAdd=(url,m)=>tx('readwrite',s=>s.add({url,t:Date.now(),m:m||''})).catch(()=>toast('Não deu para guardar na galeria.'));
const dbDel=id=>tx('readwrite',s=>s.delete(id)).catch(()=>{});
const dbAll=()=>tx('readonly',s=>s.getAll()).catch(()=>[]);
const dbClear=()=>tx('readwrite',s=>s.clear()).catch(()=>{});
/* galeria separada por modo, com selo de onde veio cada desenho e opção de apagar */
const GMODES=[['balde','Colorir','#FF4D4D'],['giz','Rabiscar','#FF9F1C'],['numeros','Pintar por números','#9B5DE5'],['desenho','Desenhar','#3D5AFE'],['brilho','Caneta brilhante','#2E2440'],['espelho','Espelho','#B8860B'],['px','Pixel','#21A35A'],['rv','Revelar','#F25CA2'],['','Outros','#9A9A9A']];
const GICO={balde:'<path d="M7 14l9-9 10 10-9 9z" fill="#FF4D4D" stroke="#2E2440" stroke-width="2"/><path d="M26 18c0 3 2 4 2 6a2 2 0 0 1-4 0c0-2 2-3 2-6z" fill="#4FB3F0"/>',giz:'<path d="M20 4l8 8-14 14H6v-8z" fill="#FF9F1C" stroke="#2E2440" stroke-width="2"/>',numeros:'<text x="16" y="23" font-size="16" font-weight="800" text-anchor="middle" fill="#9B5DE5">123</text>',desenho:'<path d="M4 24C10 6 16 28 28 8" fill="none" stroke="#3D5AFE" stroke-width="4" stroke-linecap="round"/>',brilho:'<path d="M16 3l3.5 8 8.5 1-6.5 5.5 2 8.5L16 21.5 8.5 26l2-8.5L4 12l8.5-1z" fill="#FF85C0" stroke="#2E2440" stroke-width="2"/>',espelho:'<path d="M16 3v26" stroke="#B8860B" stroke-width="2" stroke-dasharray="3 3"/><path d="M14 8C6 4 2 12 8 16c-5 4 0 12 6 8zM18 8c8-4 12 4 6 8 5 4 0 12-6 8z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/>',px:'<path d="M6 6h6v6H6zM14 6h6v6h-6zM10 14h6v6h-6zM18 14h6v6h-6zM14 22h6v6h-6z" fill="#FF4D4D"/>',rv:'<rect x="4" y="6" width="24" height="20" rx="3" fill="#BDE6FF" stroke="#2E2440" stroke-width="2"/><path d="M16 6h12v20H16z" fill="#BDBDBD"/>','':'<circle cx="16" cy="16" r="10" fill="#E0E0E0" stroke="#2E2440" stroke-width="2"/>'};
let gFilter='todos';
onShow.galeria=async()=>{const all=(await dbAll()||[]).sort((a,b)=>b.t-a.t);const g=$('#artGal');const mo=x=>GMODES.find(m=>m[0]===(x.m||''))||GMODES[GMODES.length-1];
  const present=GMODES.filter(m=>all.some(x=>(x.m||'')===m[0]));
  $('#galTabs').innerHTML=all.length?[`<button class="ico txt${gFilter==='todos'?' on':''}" data-gf="todos">Todos</button>`].concat(present.map(m=>`<button class="ico txt gtab${gFilter===m[0]?' on':''}" data-gf="${m[0]}"><svg viewBox="0 0 32 32">${GICO[m[0]]}</svg>${m[1]}</button>`)).join(''):'';
  const list=all.filter(x=>gFilter==='todos'||(x.m||'')===gFilter);
  g.innerHTML=list.length?list.map(a=>{const m=mo(a);return`<button class="card" data-id="${a.id}"><img alt="Arte guardada"><span class="gchip" style="--gc:${m[2]}"><svg viewBox="0 0 32 32">${GICO[m[0]]}</svg>${m[1]}</span></button>`}).join(''):'<p class="empty">A galeria ainda está vazia. Termine uma pintura e ela aparece aqui.</p>';
  list.forEach(a=>{const im=g.querySelector(`[data-id="${a.id}"] img`);if(im)im.src=a.url});
  g.onclick=e=>{const c=e.target.closest('.card');if(!c)return;const a=all.find(x=>x.id==c.dataset.id);if(!a)return;$('#viewImg').src=a.url;$('#viewer').dataset.id=a.id;$('#viewer').classList.add('on');pop(520)}};
$('#galTabs').onclick=e=>{const b=e.target.closest('[data-gf]');if(!b)return;gFilter=b.dataset.gf;pop(480);onShow.galeria()};
$('#viewDel').onclick=()=>{const id=+$('#viewer').dataset.id;$('#viewer').classList.remove('on');ask('Apagar este desenho da galeria?',async()=>{await dbDel(id);toast('Desenho apagado.');onShow.galeria()})};
$('#viewClose').onclick=()=>$('#viewer').classList.remove('on');
$('#viewSave').onclick=()=>{try{const a=document.createElement('a');a.href=$('#viewImg').src;a.download='arte-turma-do-thur.jpg';document.body.appendChild(a);a.click();a.remove();toast('Imagem salva!')}catch(e){toast('Não deu para salvar aqui.')}};

/* ---------- adesivos ---------- */
/* adesivos: um para cada atividade que dá para completar (o álbum cresce junto com o app) */
let ACTS_=null;
function acts(){if(ACTS_)return ACTS_;const k=[];const seen=new Set();
  PAGES.forEach(p=>{if(!seen.has(p.n)){seen.add(p.n);k.push('balde:'+p.n)}});PAGES.forEach(p=>{if(seen.has(p.n)){seen.delete(p.n);k.push('giz:'+p.n)}});
  Object.keys(PLANS).forEach(n=>k.push('numeros:'+n));PIXELS.forEach((_,i)=>k.push('px:'+i));REVEAL.forEach((_,i)=>k.push('rv:'+i));
  ['up','low'].forEach(s=>LETRAS.forEach(l=>k.push('l:'+s+':'+(s==='low'?l[0].toLowerCase():l[0]))));NUMS.forEach((_,i)=>k.push('l:num:'+i));
  PALAVRAS.forEach(w=>k.push('w:'+w[0]));
  const C=window.CARROS;if(C){C.V.forEach(v=>k.push('car:'+v.id));Object.keys(C.PISTAS||{}).forEach(p=>k.push('pista:'+p))}
  ['arroz','feijao','macarrao','carne','salada'].forEach(r=>k.push('cook:'+r));
  if(window.LER)window.LER.keys().forEach(x=>k.push(x));
  const r=[...new Set(k)];if(window.LER)ACTS_=r;return r}
const STK_BG=['#FFF4D2','#DDF3FF','#E5F9DD','#FFE3F0','#EEE5FF','#FFE8D6'];
const stkOf=i=>({e:STICKERS[i%STICKERS.length],bg:STK_BG[Math.floor(i/STICKERS.length)%STK_BG.length]});
function gotSet(){let g=store.get('thur-st2',null);if(!g){g=[];const old=store.get('thur-st',[]);const A=acts();old.forEach(()=>{const left=A.filter(x=>!g.includes(x));if(left.length)g.push(left[rnd(left.length)])});store.set('thur-st2',g)}return g}
/* ganha o adesivo da atividade (repetir não dá outro); sem atividade: um adesivo que ainda falta */
function award(key){const A=acts(),g=gotSet();let k=key&&A.includes(key)?key:null;
  if(!k){const left=A.filter(x=>!g.includes(x));k=left.length?left[rnd(left.length)]:A[rnd(A.length)]}
  const fresh=!g.includes(k);if(fresh){g.push(k);store.set('thur-st2',g)}award.fresh=fresh;return stkOf(A.indexOf(k)).e}
onShow.adesivos=()=>{const A=acts(),g=new Set(gotSet());$('#stTitle').textContent=`Meus adesivos (${A.filter(k=>g.has(k)).length} de ${A.length})`;
  $('#album').innerHTML=A.map((k,i)=>{const s=stkOf(i);return g.has(k)?`<div class="stk" style="background:${s.bg}" role="img" aria-label="Adesivo">${s.e}</div>`:`<div class="stk locked" aria-label="Adesivo ainda não ganho">?</div>`}).join('')};
let doneBack=null;
function complete(url,back,key){
  if(url)dbAdd(url,key?key.split(':')[0]:'');window.helperCheer&&window.helperCheer();
  const st=award(key);
  $('#doneImg').parentElement.style.display=url?'':'none';if(url)$('#doneImg').src=url;
  const d=$('#doneSt');d.textContent=st;d.style.animation='none';void d.offsetWidth;d.style.animation='';
  $('#doneT').textContent=(url?'Que lindo! Guardei na galeria':'Muito bem!')+(award.fresh?' Você ganhou um adesivo novo!':' Você já tinha esse adesivo — complete outras atividades para ganhar mais!');
  doneBack=back||null;$('#done').classList.add('on');party();hop();speak(url?'Que lindo! Você ganhou um adesivo!':'Muito bem! Você ganhou um adesivo!');
}
$('#doneOk').onclick=()=>{$('#done').classList.remove('on');pop(520);if(doneBack)doneBack()};
const every=(key,n)=>{const c=store.get(key,0)+1;store.set(key,c);return c%n===0};

/* ---------- menu inicial ---------- */
const ICON={
carros:'<path d="M8 40V30q0-4 4-4l8-1 8-9q2-2 5-2h12q3 0 5 2l7 9 3 1q4 1 4 4v10z" fill="#fff"/><path d="M30 18l-6 8h12v-8zM40 18v8h11l-6-8z" fill="#BDE6FF"/><circle cx="20" cy="42" r="8" fill="#2E2440"/><circle cx="48" cy="42" r="8" fill="#2E2440"/><circle cx="20" cy="42" r="3" fill="#FFD60A"/><circle cx="48" cy="42" r="3" fill="#FFD60A"/>',
mundo:'<path d="M6 40c10-6 18-6 26 0s16 6 26 0v18H6z" fill="#4CC764"/><circle cx="46" cy="16" r="8" fill="#FFD60A"/><path d="M14 40V26l10-8 10 8v14z" fill="#fff"/><path d="M10 28l14-12 14 12" fill="none" stroke="#FF4D4D" stroke-width="4" stroke-linecap="round"/><rect x="20" y="30" width="8" height="10" fill="#8D5B3E"/>',
balde:'<path d="M12 28l18-16 18 16-18 18z" fill="#fff"/><path d="M12 28h36L30 46z" fill="#FFD60A"/><path d="M52 36c0 6-4 9-4 12a4 4 0 0 0 8 0c0-3-4-6-4-12z" fill="#FFD60A"/>',
giz:'<path d="M12 52l6-16L44 10l10 10-26 26z" fill="#FFD60A" stroke="#2E2440" stroke-width="3" stroke-linejoin="round"/><path d="M12 52l6-16 10 10z" fill="#FF85C0" stroke="#2E2440" stroke-width="3" stroke-linejoin="round"/><path d="M24 30l10 10" stroke="#2E2440" stroke-width="3"/>',
desenho:'<path d="M12 52c8-2 10-14 18-14s8 10 16 8 6-12 8-16" fill="none" stroke="#FFD60A" stroke-width="5" stroke-linecap="round"/><path d="M40 8l8 8-18 18-10 2 2-10z" fill="#fff" stroke="#2E2440" stroke-width="3" stroke-linejoin="round"/>',
brilho:'<path d="M32 6l7 15 16 2-12 11 3 16-14-8-14 8 3-16L9 23l16-2z" fill="#FFE600" stroke="#fff" stroke-width="2"/><circle cx="14" cy="50" r="4" fill="#00F0FF"/><circle cx="52" cy="50" r="3" fill="#FF2E88"/>',
numeros:'<circle cx="18" cy="22" r="12" fill="#fff"/><circle cx="46" cy="22" r="12" fill="#FFD60A"/><circle cx="32" cy="46" r="12" fill="#FF85C0"/><g font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="#2E2440"><text x="18" y="28">1</text><text x="46" y="28">2</text><text x="32" y="52">3</text></g>',
aquarela:'<path d="M32 6c-10 14-16 22-16 30a16 16 0 0 0 32 0c0-8-6-16-16-30z" fill="#fff"/><circle cx="26" cy="40" r="7" fill="#FF85C0" opacity=".85"/><circle cx="38" cy="42" r="7" fill="#FFD60A" opacity=".85"/><circle cx="32" cy="32" r="6" fill="#9B5DE5" opacity=".7"/>',
pixel:'<rect x="8" y="8" width="14" height="14" fill="#FF4D4D"/><rect x="25" y="8" width="14" height="14" fill="#fff"/><rect x="42" y="8" width="14" height="14" fill="#FFD60A"/><rect x="8" y="25" width="14" height="14" fill="#fff"/><rect x="25" y="25" width="14" height="14" fill="#3D5AFE"/><rect x="42" y="25" width="14" height="14" fill="#fff"/><rect x="8" y="42" width="14" height="14" fill="#FFD60A"/><rect x="25" y="42" width="14" height="14" fill="#fff"/><rect x="42" y="42" width="14" height="14" fill="#FF4D4D"/>',
revelar:'<path d="M12 52L38 26" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M12 52L22 42" stroke="#2E2440" stroke-width="7" stroke-linecap="round"/><path d="M46 6l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#FFD60A"/><circle cx="54" cy="38" r="3" fill="#fff"/><circle cx="30" cy="12" r="2.5" fill="#fff"/>',
respingo:'<path d="M32 10c4 8 12 4 14 12s10 8 6 16-12 6-14 14-12 6-14-2-12-4-10-12 6-10 8-16 6-12 10-12z" fill="#fff"/><circle cx="10" cy="14" r="4" fill="#fff"/><circle cx="54" cy="12" r="3" fill="#fff"/><circle cx="54" cy="54" r="4" fill="#fff"/>',
espelho:'<path d="M31 32C24 12 6 10 8 24c1 8 12 10 23 8zM31 34C22 36 10 44 14 52c4 6 14-4 17-14z" fill="#FFD60A"/><path d="M33 32c7-20 25-22 23-8-1 8-12 10-23 8zM33 34c9 2 21 10 17 18-4 6-14-4-17-14z" fill="#FF85C0"/><path d="M32 10v46" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/>',
letras:'<text x="32" y="48" text-anchor="middle" font-size="42" font-weight="800" font-family="Baloo 2,sans-serif" fill="#4FB3F0" stroke="#2E2440" stroke-width="2.5" paint-order="stroke">Aa</text>',
palavras:'<rect x="4" y="20" width="17" height="24" rx="5" fill="#FFD60A"/><rect x="24" y="20" width="17" height="24" rx="5" fill="#fff"/><rect x="44" y="20" width="17" height="24" rx="5" fill="#8FE0A0"/><g font-family="Baloo 2,sans-serif" font-weight="800" font-size="16" text-anchor="middle" fill="#2E2440"><text x="12.5" y="38">S</text><text x="32.5" y="38">O</text><text x="52.5" y="38">L</text></g>'};
/* tela inicial organizada em grupos, cada modo com um desenho que mostra o que ele faz */
const GROUPS=[
  ['Brincar',[['mundo','Mundinho','#FF9F1C'],['carros','Garagem','#E63946']]],
  ['Desenhar e colorir',[['balde','Colorir','#FF4D4D'],['giz','Rabiscar','#FF9F1C'],['numeros','Pintar por números','#9B5DE5'],['desenho','Desenhar','#3D5AFE'],['brilho','Caneta brilhante','#2E2440'],['espelho','Espelho','#B8860B'],['pixel','Pixel','#21A35A'],['revelar','Revelar','#F25CA2']]],
  ['Aprender',[['ler','Aprender a ler','#58CC02'],['mat','Matemática','#FF9600'],['letras','Letras','#4FB3F0'],['palavras','Palavras','#FF6F61']]]];
const TILES=GROUPS.flatMap(g=>g[1]);
function tileArt(id){const pg=n=>PAGES.find(p=>p.n===n);
  const tint=(n,cols,partial)=>{const p=pg(n);if(!p)return'';let k=0;return pageSvg(p).replace(/fill="#fff"/g,()=>{const c=(partial&&k%3===2)?'#fff':cols[k%cols.length];k++;return`fill="${c}"`})};
  switch(id){
  case'balde':return tint('Flor',['#FF85C0','#FFD60A','#4CC764','#FF4D4D','#4FB3F0'])+'<svg class="tbadge" viewBox="0 0 32 32"><path d="M7 14l9-9 10 10-9 9z" fill="#FF4D4D" stroke="#2E2440" stroke-width="2"/><path d="M26 18c0 3 2 4 2 6a2 2 0 0 1-4 0c0-2 2-3 2-6z" fill="#4FB3F0"/></svg>';
  case'giz':{const p=pg('Coração')||pg('Maçã')||pg('Flor');return(p?pageSvg(p):'')+'<svg class="tover" viewBox="0 0 100 100"><path d="M28 40 L70 34 L30 52 L72 46 L32 62 L68 58 L38 70" fill="none" stroke="#FF4D4D" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".85"/></svg><svg class="tbadge" viewBox="0 0 32 32"><path d="M20 4l8 8-14 14H6v-8z" fill="#FF9F1C" stroke="#2E2440" stroke-width="2"/></svg>'}
  case'numeros':return'<svg viewBox="0 0 100 100"><circle cx="34" cy="40" r="22" fill="#FFD60A" stroke="#2E2440" stroke-width="3"/><circle cx="66" cy="40" r="22" fill="#fff" stroke="#2E2440" stroke-width="3"/><rect x="22" y="62" width="56" height="26" rx="10" fill="#fff" stroke="#2E2440" stroke-width="3"/><text x="34" y="48" font-size="22" font-weight="800" text-anchor="middle" fill="#2E2440">1</text><text x="66" y="48" font-size="22" font-weight="800" text-anchor="middle" fill="#2E2440">2</text><text x="50" y="82" font-size="20" font-weight="800" text-anchor="middle" fill="#2E2440">3</text></svg>';
  case'desenho':return'<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="10" fill="#fff"/><path d="M18 70 C30 30 46 80 58 44 S80 30 84 56" fill="none" stroke="#3D5AFE" stroke-width="6" stroke-linecap="round"/><path d="M22 30 q10 -12 20 0" fill="none" stroke="#FF4D4D" stroke-width="6" stroke-linecap="round"/><circle cx="72" cy="26" r="9" fill="#FFD60A"/><path d="M60 88 l26 -26 6 6 -26 26z" fill="#FF9F1C" stroke="#2E2440" stroke-width="2"/></svg>';
  case'brilho':return'<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="10" fill="#1B1430"/><defs><filter id="tglow"><feGaussianBlur stdDeviation="3"/></filter></defs><g filter="url(#tglow)"><path d="M50 14 L60 40 L88 42 L66 60 L74 88 L50 72 L26 88 L34 60 L12 42 L40 40 Z" fill="none" stroke="#FF85C0" stroke-width="6"/></g><path d="M50 14 L60 40 L88 42 L66 60 L74 88 L50 72 L26 88 L34 60 L12 42 L40 40 Z" fill="none" stroke="#fff" stroke-width="2.5"/></svg>';
  case'espelho':return'<svg viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="10" fill="#fff"/><path d="M50 20 C30 4 6 24 22 46 C8 60 26 84 50 64 C74 84 92 60 78 46 C94 24 70 4 50 20 Z" fill="#FFD60A" stroke="#2E2440" stroke-width="3"/><circle cx="32" cy="36" r="7" fill="#FF85C0"/><circle cx="68" cy="36" r="7" fill="#FF85C0"/><path d="M50 10 V90" stroke="#B8860B" stroke-width="3" stroke-dasharray="6 5"/></svg>';
  case'pixel':{const H=['0110110','1111111','1111111','0111110','0011100','0001000'];return'<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="10" fill="#fff"/>'+H.map((r,y)=>[...r].map((c,x)=>`<rect x="${15+x*10}" y="${22+y*10}" width="9" height="9" rx="1.5" fill="${c==='1'?'#FF4D4D':'#EEE'}"/>`).join('')).join('')+'</svg>'}
  case'revelar':{const s=REVEAL.find(r=>r.f&&!r.f.startsWith('data:'));return s?`<div class="trev"><img src="${s.f}" alt=""><img src="${s.f}" alt="" class="gray"></div>`:''}
  case'letras':return'<svg viewBox="0 0 100 100"><rect width="100" height="100" rx="10" fill="#fff"/><text x="50" y="80" font-size="80" font-weight="800" text-anchor="middle" fill="#EAF6FF" stroke="#4FB3F0" stroke-width="3" stroke-dasharray="7 6" font-family="Baloo 2,Arial Black,sans-serif">A</text><circle cx="30" cy="80" r="7" fill="#4CC764"/><path d="M34 76 L44 50" stroke="#FF4D4D" stroke-width="6" stroke-linecap="round"/></svg>';
  case'palavras':return'<svg viewBox="0 0 100 100"><circle cx="50" cy="30" r="16" fill="#FFD60A" stroke="#2E2440" stroke-width="3"/>'+['S','O','L'].map((l,i)=>`<rect x="${14+i*25}" y="56" width="22" height="26" rx="5" fill="${['#FF4D4D','#4FB3F0','#4CC764'][i]}" stroke="#2E2440" stroke-width="2.5"/><text x="${25+i*25}" y="76" font-size="18" font-weight="800" text-anchor="middle" fill="#fff">${l}</text>`).join('')+'</svg>';
  case'mat':return'<svg viewBox="0 0 100 100"><rect x="6" y="8" width="88" height="84" rx="14" fill="#fff"/><text x="28" y="46" font-size="34" font-weight="800" text-anchor="middle" fill="#58CC02">2</text><text x="50" y="46" font-size="34" font-weight="800" text-anchor="middle" fill="#FF9600">+</text><text x="72" y="46" font-size="34" font-weight="800" text-anchor="middle" fill="#1CB0F6">1</text><text x="50" y="82" font-size="30" font-weight="800" text-anchor="middle" fill="#CE82FF">= 3</text></svg>';
  case'ler':return'<svg viewBox="0 0 100 100"><path d="M50 92 C20 80 80 64 50 52 C20 40 80 28 50 14" fill="none" stroke="#E5E5E5" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 12"/>'+[[50,84,'#58CC02','✓'],[36,58,'#58CC02','✓'],[62,36,'#1CB0F6','B'],[44,14,'#AFAFAF','']].map(([x,y,c,t])=>`<circle cx="${x}" cy="${y+4}" r="13" fill="#0003"/><circle cx="${x}" cy="${y}" r="13" fill="${c}"/><text x="${x}" y="${y+6}" font-size="15" font-weight="800" text-anchor="middle" fill="#fff">${t}</text>`).join('')+'</svg>';
  case'mundo':return'<div class="tmundo"><img src="img/mundo/parque.jpg" alt=""><img src="img/thur.png" alt="" class="tt"><img src="img/pets/lelo.png" alt="" class="tp"></div>';
  case'carros':return(window.CARROS?window.CARROS.carSvg(window.CARROS.V.find(v=>v.id==='super')||window.CARROS.V[0]):'')}
  return''}
function drawTiles(){$('#tiles').innerHTML=GROUPS.map(([g,ts])=>`<h3 class="tgrp">${g}</h3><div class="tgrid">${ts.map(([id,t,bg])=>`<button class="tile2" data-tile="${id}" style="--tc:${bg}"><span class="tpic">${tileArt(id)}</span><span class="tname">${t}</span></button>`).join('')}</div>`).join('')}
drawTiles();window.addEventListener('load',drawTiles);
$('#tiles').onclick=e=>{const b=e.target.closest('[data-tile]');if(!b)return;pop(460);const id=b.dataset.tile;
  if(['balde','giz','respingo','numeros','aquarela'].includes(id))openPicker(id);
  else if(['desenho','brilho','espelho'].includes(id))openTela(id);
  else if(id==='mundo')window.openMundo&&window.openMundo();else if(id==='carros')window.openGaragem&&window.openGaragem();else if(id==='pixel')show('pixpick');else if(id==='revelar')show('revpick');else show(id)};

/* ---------- escolher desenho ---------- */
const MODE_T={balde:'Colorir',giz:'Rabiscar',respingo:'Respingo',numeros:'Pintar por números',aquarela:'Aquarela'};
let pickMode='balde';
/* Colorir: todos os desenhos, separados por tipo */
const CATS=(()=>{const c3=window.CATS3||{};const C=[
  ['Bolelecos',['Zuzu','Lelo','Pituca','Bubu']],
  ['Bichos',['Cachorro','Coelho','Urso','Gatinho','Dinossauro','Tartaruga','Peixinho','Baleia','Pato','Borboleta','Leão','Elefante','Girafa','Macaco','Porco','Vaca','Galinha','Pintinho','Ovelha','Panda','Pinguim','Coruja','Sapo','Polvo','Caranguejo','Joaninha','Abelha','Caracol','Golfinho','Estrela-do-mar']],
  ['Veículos',['Carrinho','Carro','Caminhão','Ônibus','Avião','Helicóptero','Moto','Trator','Submarino','Bicicleta','Barco','Trem','Foguete','Balão']],
  ['Natureza',['Sol','Flor','Arco-íris','Árvore','Chuva','Lua',...(c3['Natureza']||[])]],
  ['Coisas',[]],['Letras',c3['Letras']||[]],['Números',c3['Números']||[]],['Palavras',c3['Palavras']||[]]];
  const used=new Set(C.flatMap(([,l])=>l));const seen=new Set();
  PAGES.forEach(p=>{if(!used.has(p.n)&&!seen.has(p.n)){seen.add(p.n);C[4][1].push(p.n)}});
  return C.map(([n,l])=>[n,l.filter(x=>PAGES.some(p=>p.n===x))]).filter(([,l])=>l.length)})();
let pickCat=0;
function drawPick(names){const list=names.map(n=>({p:PAGES.find(p=>p.n===n),i:PAGES.findIndex(p=>p.n===n)})).filter(x=>x.p);
  /* a miniatura mostra o desenho do jeito que a criança deixou: pintado (terminado) ou pela metade (para continuar) */
  const thumb=(p,i)=>{const sv=store.get(`thur-s-${pickMode}-${i}`,null);const base=pageSvg(p);if(!sv)return base;const j=base.indexOf('>')+1;return base.slice(0,j)+sv.replace(/id="(c[a-z0-9]+)"/g,'id="t$1"').replace(/url\(#(c[a-z0-9]+)\)/g,'url(#t$1)')+'</svg>'};
  const badge=i=>store.get(`thur-f-${pickMode}-${i}`,false)?'<span class="badge" aria-label="Terminado"><svg viewBox="0 0 32 32"><path d="M6 17l7 7L26 9" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>':store.get(`thur-s-${pickMode}-${i}`,null)?'<span class="badge wip" aria-label="Continuar"><svg viewBox="0 0 32 32"><path d="M20 5l7 7-13 13H7v-7z" fill="#fff"/></svg></span>':'';
  $('#pickGal').innerHTML=list.map(({p,i})=>`<button class="card" data-p="${i}">${thumb(p,i)}${badge(i)}<span>${p.n}</span></button>`).join('');$('#pickGal').scrollTop=0}
function openPicker(mode){pickMode=mode;$('#pickTitle').textContent=MODE_T[mode];const tabs=$('#pickTabs');
  if(mode==='balde'||mode==='giz'){tabs.hidden=false;tabs.innerHTML=CATS.map(([n],k)=>`<button class="ico txt${k===pickCat?' on':''}" data-c="${k}">${n}</button>`).join('');drawPick(CATS[pickCat][1])}
  else{tabs.hidden=true;drawPick(SETS[mode])}
  show('escolher')}
$('#pickTabs').onclick=e=>{const b=e.target.closest('[data-c]');if(!b)return;pickCat=+b.dataset.c;pop(480);$$('#pickTabs [data-c]').forEach(x=>x.classList.toggle('on',x===b));drawPick(CATS[pickCat][1])};
$('#pickGal').onclick=e=>{const c=e.target.closest('.card');if(!c)return;pop(520);const i=+c.dataset.p;if(pickMode==='aquarela')openTela('aquarela',i);else openSvg(pickMode,i)};

/* ---------- pintar sobre o desenho ---------- */
const NS='http://www.w3.org/2000/svg';
const P={mode:'balde',tool:'balde',i:0,color:COLORS[0],num:0,tex:'liso',w:22,hist:[],scrib:null};
const svgEl=()=>$('#page svg');
const pKey=()=>`thur-s-${P.mode}-${P.i}`;
const saveP=()=>store.set(pKey(),svgEl().innerHTML);
const snap=()=>{P.hist.push(svgEl().innerHTML);if(P.hist.length>30)P.hist.shift()};
function seedRand(seed){let s=seed>>>0||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function paintOf(svg,color){if(P.tex==='liso')return color;const id='t'+P.tex+color.slice(1);
  if(!svg.querySelector('#'+id)){const pt=document.createElementNS(NS,'pattern');pt.id=id;pt.setAttribute('patternUnits','userSpaceOnUse');const r=seedRand(parseInt(color.slice(1),16)+(P.tex==='giz'?7:3));
    const dark=lum(color)>.85;let h=`<rect width="24" height="24" fill="${color}"/>`;
    if(P.tex==='giz'){pt.setAttribute('width',12);pt.setAttribute('height',12);h=`<rect width="12" height="12" fill="${color}"/>`;for(let k=0;k<6;k++){const y=r()*12;h+=`<path d="M0 ${y.toFixed(1)} l12 ${(r()*4-2).toFixed(1)}" stroke="${k%2&&!dark?'#ffffff':'#000000'}" stroke-opacity="${k%2&&!dark?.32:.10}" stroke-width="${(0.6+r()).toFixed(1)}"/>`}}
    else{pt.setAttribute('width',24);pt.setAttribute('height',24);for(let k=0;k<12;k++)h+=`<circle cx="${(r()*24).toFixed(1)}" cy="${(r()*24).toFixed(1)}" r="${(0.6+r()*1.6).toFixed(1)}" fill="${dark?'#C9A23A':'#ffffff'}" fill-opacity="${(0.45+r()*.5).toFixed(2)}"/>`}
    pt.innerHTML=h;svg.querySelector('defs').appendChild(pt)}
  return`url(#${id})`}
function centerOf(svg,el){const b=el.getBBox();let x=b.x+b.width/2,y=b.y+b.height/2;const t=el.transform.baseVal.consolidate();if(t){const p=svg.createSVGPoint();p.x=x;p.y=y;const q=p.matrixTransform(t.matrix);x=q.x;y=q.y}return{x,y,s:Math.max(13,Math.min(30,Math.min(b.width,b.height)*.42))}}
const AT={'Balão':{0:[40,200],3:[122,150]},'Casinha':{0:[200,40],1:[340,352],6:[200,212]},'Peixinho':{0:[330,60],5:[282,192]},'Pituca':{6:[200,138]}};
function addNums(svg,page){const plan=PLANS[page.n];const at=AT[page.n]||{};let g=document.createElementNS(NS,'g');g.setAttribute('class','nums');
  svg.querySelectorAll('.r').forEach((r,k)=>{const n=plan.p[k];if(n==null)return;r.dataset.n=n;r.dataset.k=k;const c=centerOf(svg,r);const pos=at[k]||[c.x,c.y];
    const t=document.createElementNS(NS,'text');t.setAttribute('class','num');t.setAttribute('x',pos[0].toFixed(1));t.setAttribute('y',pos[1].toFixed(1));t.setAttribute('font-size',at[k]?20:c.s.toFixed(0));t.dataset.k=k;t.textContent=n+1;g.appendChild(t)});
  svg.appendChild(g)}
function freshPage(){const page=PAGES[P.i];$('#page').innerHTML=pageSvg(page);if(P.mode==='numeros')addNums(svgEl(),page)}
function openSvg(mode,i){Object.assign(P,{mode,i,hist:[],scrib:null});const page=PAGES[i];$('#pTitle').textContent=page.n;
  $('#page').innerHTML=pageSvg(page);const saved=store.get(pKey(),null);P.needNums=false;if(saved)svgEl().innerHTML=saved;else if(mode==='numeros')P.needNums=true;
  P.erase=false;$('#pErase').classList.remove('on');const offE=()=>{P.erase=false;$('#pErase').classList.remove('on')};
  if(mode==='numeros'){P.num=0;palette($('#palP'),PLANS[page.n].c,(i)=>{P.num=i;offE()},0,true);markNumDone()}
  else palette($('#palP'),COLORS,(i,c)=>{P.color=c;offE()},COLORS.indexOf(P.color));
  $('#texRow').style.display=(mode==='balde'||mode==='giz'||mode==='respingo')?'':'none';
  $('#toolRow').style.display='none';P.tool='balde';syncTool();
  peek($('#pintar'));show('pintar')}
onShow.pintar=()=>{if(P.needNums){P.needNums=false;addNums(svgEl(),PAGES[P.i]);saveP();markNumDone()}};
function markNumDone(){if(P.mode!=='numeros')return;const s=svgEl();const plan=PLANS[PAGES[P.i].n];plan.c.forEach((_,n)=>{const left=s.querySelectorAll(`.r[data-n="${n}"]:not([data-f])`).length;const b=$(`#palP .sw[data-i="${n}"]`);if(b)b.classList.toggle('gone',left===0)})}
$$('#texRow .tex').forEach(b=>b.onclick=()=>{P.tex=b.dataset.tex;$$('#texRow .tex').forEach(x=>x.classList.toggle('on',x===b));pop(480)});
function syncTool(){const giz=P.mode==='giz'||(P.mode==='balde'&&P.tool==='giz');$('#sizeRow').style.display=giz?'':'none';$$('#toolRow .tool').forEach(x=>x.classList.toggle('on',x.dataset.tool===P.tool))}
$$('#toolRow .tool').forEach(b=>b.onclick=()=>{P.tool=b.dataset.tool;syncTool();pop(480);speak(P.tool==='giz'?'Rabisque com o dedo dentro da linha!':'Toque para pintar tudo!')});
$$('#sizeRow .psize').forEach(b=>b.onclick=()=>{P.w=+b.dataset.w;$$('#sizeRow .psize').forEach(x=>x.classList.toggle('on',x===b));pop(500)});
const toSvg=(s,e)=>{const p=s.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(s.getScreenCTM().inverse())};
function clipFor(s,a){const id='c'+Date.now().toString(36)+rnd(1e6).toString(36);const cp=document.createElementNS(NS,'clipPath');cp.id=id;const sh=a.cloneNode();sh.removeAttribute('class');sh.removeAttribute('data-n');sh.removeAttribute('data-k');cp.appendChild(sh);s.querySelector('defs').appendChild(cp);
  const g=document.createElementNS(NS,'g');g.setAttribute('clip-path',`url(#${id})`);g.setAttribute('pointer-events','none');
  const ol=a.cloneNode();ol.setAttribute('class','o');ol.setAttribute('fill','none');ol.removeAttribute('data-n');ol.setAttribute('pointer-events','none');
  /* o rabisco novo fica POR CIMA dos anteriores (antes entrava por baixo e parecia que não pintava) */
  let ref=a;while(ref.nextElementSibling&&(ref.nextElementSibling.matches('g[clip-path]')||ref.nextElementSibling.classList.contains('o')))ref=ref.nextElementSibling;ref.after(g);g.after(ol);return g}
/* borracha: toque numa parte e ela volta a ficar branca (some a cor e o rabisco dela) */
function eraseRegion(s,a){let n=a.nextElementSibling;while(n&&(n.matches('g[clip-path]')||n.classList.contains('o'))){const nx=n.nextElementSibling;n.remove();n=nx}
  a.setAttribute('fill','#fff');delete a.dataset.cov;
  if(P.mode==='numeros'&&a.dataset.f){delete a.dataset.f;const page=PAGES[P.i];const old=s.querySelector('.nums');if(old)old.remove();addNums(s,page);s.querySelectorAll('.r[data-f]').forEach(r=>{const t=s.querySelector(`.num[data-k="${r.dataset.k}"]`);if(t)t.remove()});markNumDone()}}
$('#pErase').onclick=()=>{P.erase=!P.erase;$('#pErase').classList.toggle('on',P.erase);pop(380);if(P.erase)speak('Borracha! Toque no que quer apagar.')};
$('#page').addEventListener('pointerdown',e=>{const s=svgEl();if(!s)return;const el=document.elementFromPoint(e.clientX,e.clientY);const a=el&&el.closest?el.closest('.r'):null;if(!a)return;e.preventDefault();
  if(P.erase){if(a.getAttribute('fill')==='#fff'&&!(a.nextElementSibling&&a.nextElementSibling.matches('g[clip-path]')))return;snap();eraseRegion(s,a);saveP();pop(300);return}
  if(P.mode==='balde'&&P.tool!=='giz'){const f=paintOf(s,P.color);if(a.getAttribute('fill')===f)return;snap();a.setAttribute('fill',f);saveP();pop(700);checkBalde(s);return}
  if(P.mode==='numeros'){if(a.dataset.n===undefined||a.dataset.f)return;if(+a.dataset.n!==P.num){a.classList.remove('bad');void a.getBBox();a.classList.add('bad');pop(200);return}
    snap();a.setAttribute('fill',PLANS[PAGES[P.i].n].c[P.num]);a.dataset.f='1';const t=s.querySelector(`.num[data-k="${a.dataset.k}"]`);if(t)t.remove();saveP();pop(720);markNumDone();
    if(!s.querySelector('.r[data-n]:not([data-f])'))setTimeout(finishSvg,500);return}
  const q=toSvg(s,e);
  if(P.mode==='respingo'){snap();const g=clipFor(s,a);const f=paintOf(s,P.color);const c=document.createElementNS(NS,'circle');c.setAttribute('cx',q.x);c.setAttribute('cy',q.y);c.setAttribute('r',0);c.setAttribute('fill',f);g.appendChild(c);
    for(let k=0;k<7;k++){const d=document.createElementNS(NS,'circle');const ang=Math.random()*6.28,dist=30+Math.random()*60;d.setAttribute('cx',(q.x+Math.cos(ang)*dist).toFixed(1));d.setAttribute('cy',(q.y+Math.sin(ang)*dist).toFixed(1));d.setAttribute('r',(5+Math.random()*10).toFixed(1));d.setAttribute('fill',f);g.appendChild(d)}
    splashSound();const t0=performance.now();const step=t=>{const k=Math.max(0,Math.min(1,(t-t0)/520));c.setAttribute('r',(560*(1-Math.pow(1-k,3))).toFixed(1));if(k<1)requestAnimationFrame(step);else saveP()};requestAnimationFrame(step);return}
  /* giz */
  snap();const g=clipFor(s,a);const path=document.createElementNS(NS,'path');const d=`M${q.x.toFixed(1)} ${q.y.toFixed(1)} l0.1 0`;path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke',paintOf(s,P.color));path.setAttribute('stroke-width',P.w);path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');g.appendChild(path);
  P.scrib={s,path,d,a,g};try{$('#page').setPointerCapture(e.pointerId)}catch(x){}});
$('#page').addEventListener('pointermove',e=>{const sc=P.scrib;if(!sc)return;evs(e).forEach(ev=>{const q=toSvg(sc.s,ev);sc.d+=` L${q.x.toFixed(1)} ${q.y.toFixed(1)}`});if(!sc.raf)sc.raf=requestAnimationFrame(()=>{sc.raf=0;sc.path.setAttribute('d',sc.d)})});
const pEnd=()=>{if(P.scrib){const sc=P.scrib;sc.path.setAttribute('d',sc.d);P.scrib=null;if(P.mode==='balde'||P.mode==='giz')covCheck(sc);saveP();if(P.mode==='balde'||P.mode==='giz')checkBalde(sc.s)}};
/* rabisco: a parte conta como pintada quando o rabisco cobre quase toda ela */
function covCheck(sc){const a=sc.a;if(a.dataset.cov)return;try{const s=sc.s,b=a.getBBox(),toA=a.getCTM().inverse().multiply(s.getCTM());
  const all=[];for(let n=a.nextElementSibling;n&&(n.matches('g[clip-path]')||n.classList.contains('o'));n=n.nextElementSibling)if(n.matches('g[clip-path]'))all.push(...n.querySelectorAll('path'));
  const R=a.getBoundingClientRect();
  let tot=0,hit=0;const pt=s.createSVGPoint(),inv=s.getScreenCTM().inverse();
  for(let i=0;i<14;i++)for(let j=0;j<14;j++){pt.x=R.left+R.width*(i+.5)/14;pt.y=R.top+R.height*(j+.5)/14;const q=pt.matrixTransform(inv);const qa=q.matrixTransform(toA);
    if(!a.isPointInFill(qa))continue;tot++;for(const p of all){if(p.isPointInStroke(q)){hit++;break}}}
  if(tot&&hit/tot>.82){a.dataset.cov='1';pop(880)}}catch(e){}}
$('#page').addEventListener('pointerup',pEnd);$('#page').addEventListener('pointercancel',pEnd);
$('#pUndo').onclick=()=>{if(!P.hist.length)return;svgEl().innerHTML=P.hist.pop();saveP();markNumDone();pop(330)};
$('#pClear').onclick=()=>ask('Recomeçar este desenho?',()=>{snap();freshPage();store.del(pKey());store.del(`thur-f-${P.mode}-${P.i}`);markNumDone()});
$('#pBack').onclick=()=>{pop(440);openPicker(P.mode)};
$('#pPrint').onclick=()=>{const pr=$('#print');pr.innerHTML=pageSvg(PAGES[P.i]);if(P.mode==='numeros'){pr.style.cssText='display:block;position:fixed;left:-9999px;top:0;width:800px;height:800px';addNums(pr.querySelector('svg'),PAGES[P.i]);pr.style.cssText=''}try{window.print()}catch(e){toast('Abra o app instalado para imprimir.')}};
function svgToUrl(svg,size=900){return new Promise(res=>{const c=svg.cloneNode(true);c.setAttribute('width',size);c.setAttribute('height',size);c.setAttribute('xmlns',NS);c.querySelectorAll('.nums').forEach(n=>n.remove());
  const str=new XMLSerializer().serializeToString(c);const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=size;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,size,size);x.drawImage(im,0,0,size,size);res(cv.toDataURL('image/jpeg',.88))};im.onerror=()=>res(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(str)})}
/* terminou de pintar tudo: parabéns e guarda na galeria sozinho */
let bDone=false;function checkBalde(s){if(bDone||store.get(`thur-f-${P.mode}-${P.i}`,false))return;const left=[...s.querySelectorAll('.r')].filter(r=>(r.getAttribute('fill')||'').toLowerCase()==='#fff'&&!r.dataset.cov).length;if(!left){bDone=true;setTimeout(()=>{finishSvg().finally(()=>bDone=false)},600)}}
async function finishSvg(){const url=await svgToUrl(svgEl());saveP();store.set(`thur-f-${P.mode}-${P.i}`,true);complete(url,()=>openPicker(P.mode),P.mode+':'+PAGES[P.i].n)}
$('#pDone').onclick=()=>{pop(600);finishSvg()};

/* ---------- tela livre: desenhar, brilho, espelho, aquarela ---------- */
const petImgs=PETS.map(n=>{const im=new Image();im.src='img/pets/'+n+'.png';return im});
$('#stampRow').innerHTML=PETS.map((n,i)=>`<button class="stampimg" data-st="${i}" aria-label="Carimbo"><img src="img/pets/${n}.png" alt=""></button>`).join('');
const cv=$('#cv'),ctx=cv.getContext('2d');
const T={mode:'desenho',page:-1,strokes:[],cur:null,color:COLORS[7],s:0.028,e:false,rb:false,mir:2,stamp:-1,W:0,H:0};
const TITLES={desenho:'Desenhar',brilho:'Caneta brilhante',espelho:'Espelho',aquarela:'Aquarela'};
const tKey=()=>'thur-t-'+T.mode+(T.mode==='aquarela'?'-'+T.page:'');
const dark=()=>T.mode==='brilho';
function openTela(mode,page=-1){Object.assign(T,{mode,page,cur:null,e:false,stamp:-1});$('#stampRow').style.display='none';T.strokes=store.get(tKey(),[]);
  $('#tTitle').textContent=page>=0?PAGES[page].n:TITLES[mode];$('#tPaper').classList.toggle('dark',dark());
  const pal=dark()?NEON:COLORS;T.color=pal[dark()?4:7];palette($('#palT'),pal,(i,c)=>{T.color=c;T.e=false;T.stamp=-1;syncT()},dark()?4:7);
  $('#tEraser').style.display='';$('#tStamp').style.display=mode==='desenho'?'':'none';
  $('#tRainbow').style.display=mode==='brilho'?'':'none';$('#tMir').style.display=mode==='espelho'?'':'none';
  const ml=$('#mirLines');ml.style.display=mode==='espelho'?'block':'none';ml.classList.toggle('four',T.mir===4);$('#tMir').textContent=T.mir+'×';
  const ao=$('#aquaOver');if(mode==='aquarela'){ao.innerHTML=pageSvg({n:PAGES[page].n,s:PAGES[page].s.replace(/fill="#fff"/g,'fill="none"')});ao.style.display='flex'}else{ao.innerHTML='';ao.style.display='none'}
  syncT();peek($('#tela'));show('tela')}
function syncT(){$('#tEraser').classList.toggle('on',T.e);$('#tStamp').classList.toggle('on',T.stamp>=0||$('#stampRow').style.display==='flex');$('#tRainbow').classList.toggle('on',T.rb);
  $$('#stampRow .stampimg').forEach(b=>b.classList.toggle('on',+b.dataset.st===T.stamp))}
function fitTela(){const r=cv.parentElement.getBoundingClientRect();if(!r.width)return;const d=DPR();T.W=r.width;T.H=r.height;cv.width=T.W*d;cv.height=T.H*d;ctx.setTransform(d,0,0,d,0,0);redrawT()}
onShow.tela=()=>requestAnimationFrame(fitTela);
new ResizeObserver(()=>{if($('#tela').classList.contains('on'))fitTela()}).observe($('#tPaper'));
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`};
function seg(p,from,W,H,tf){ctx.beginPath();const a=Math.max(0,from-1);const P0=tf(p[a]);ctx.moveTo(P0[0]*W,P0[1]*H);if(p.length===1)ctx.lineTo(P0[0]*W+.1,P0[1]*H);for(let i=a+1;i<p.length;i++){const q=tf(p[i]);ctx.lineTo(q[0]*W,q[1]*H)}ctx.stroke()}
const ID=q=>q;
function renderStroke(st,from){const W=T.W,H=T.H,m=Math.min(W,H),w=st.s*m,p=st.p;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  if(st.k==='stamp'){const im=petImgs[st.im];if(im.complete&&im.naturalWidth){const hh=st.s*m,ww=hh*im.naturalWidth/im.naturalHeight;ctx.drawImage(im,p[0][0]*W-ww/2,p[0][1]*H-hh/2,ww,hh)}}
  else if(st.k==='pen'){ctx.strokeStyle=st.e?'#fff':st.c;ctx.lineWidth=w;seg(p,from,W,H,ID)}
  else if(st.k==='mir'){ctx.strokeStyle=st.e?'#fff':st.c;ctx.lineWidth=w;const tfs=[ID,q=>[1-q[0],q[1]]];if(st.mir===4)tfs.push(q=>[q[0],1-q[1]],q=>[1-q[0],1-q[1]]);tfs.forEach(tf=>seg(p,from,W,H,tf))}
  else if(st.k==='glow'){const start=Math.max(1,from);if(p.length===1){ctx.fillStyle=st.c;ctx.shadowBlur=w*1.6;ctx.shadowColor=st.c;ctx.beginPath();ctx.arc(p[0][0]*W,p[0][1]*H,w/2,0,7);ctx.fill()}
    for(let i=start;i<p.length;i++){const c=st.rb?`hsl(${(i*7)%360},100%,60%)`:st.c;ctx.shadowBlur=w*1.6;ctx.shadowColor=c;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(p[i-1][0]*W,p[i-1][1]*H);ctx.lineTo(p[i][0]*W,p[i][1]*H);ctx.stroke();
      ctx.shadowBlur=0;ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=w*.32;ctx.stroke()}}
  else if(st.k==='aqua'){ctx.globalCompositeOperation='multiply';const r=w*1.1;const blob=(x,y)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,hexA(st.c,.11));g.addColorStop(.7,hexA(st.c,.07));g.addColorStop(1,hexA(st.c,0));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,7);ctx.fill()};
    if(from===0)blob(p[0][0]*W,p[0][1]*H);for(let i=Math.max(1,from);i<p.length;i++){const x0=p[i-1][0]*W,y0=p[i-1][1]*H,x1=p[i][0]*W,y1=p[i][1]*H;const n=Math.max(1,Math.ceil(Math.hypot(x1-x0,y1-y0)/(r*.3)));for(let k=1;k<=n;k++)blob(x0+(x1-x0)*k/n,y0+(y1-y0)*k/n)}}
  ctx.restore()}
function redrawT(){ctx.fillStyle=dark()?'#120E24':'#fff';ctx.fillRect(0,0,T.W,T.H);T.strokes.forEach(s=>renderStroke(s,0))}
const tPt=e=>{const r=cv.getBoundingClientRect();return[+((e.clientX-r.left)/r.width).toFixed(4),+((e.clientY-r.top)/r.height).toFixed(4)]};
const saveT=()=>{if(T.strokes.length>500)T.strokes=T.strokes.slice(-500);store.set(tKey(),T.strokes)};
cv.addEventListener('pointerdown',e=>{e.preventDefault();cv.setPointerCapture(e.pointerId);
  if(T.mode==='desenho'&&T.stamp>=0){const st={k:'stamp',im:T.stamp,s:0.26,p:[tPt(e)]};T.strokes.push(st);renderStroke(st,0);saveT();pop(760);return}
  const k={desenho:'pen',brilho:'glow',espelho:'mir',aquarela:'aqua'}[T.mode];
  T.cur={k,c:T.color,s:T.mode==='aquarela'?T.s*1.6:T.s,e:T.e,rb:T.rb,mir:T.mir,p:[tPt(e)]};T.strokes.push(T.cur);renderStroke(T.cur,0);tDrawn=1});
let tDrawn=0,tRaf=0;
cv.addEventListener('pointermove',e=>{if(!T.cur)return;evs(e).forEach(ev=>T.cur.p.push(tPt(ev)));if(!tRaf)tRaf=requestAnimationFrame(()=>{tRaf=0;if(T.cur){renderStroke(T.cur,tDrawn);tDrawn=T.cur.p.length}})});
const tEnd=()=>{if(T.cur){if(tDrawn<T.cur.p.length)renderStroke(T.cur,tDrawn);T.cur=null;saveT()}};
cv.addEventListener('pointerup',tEnd);cv.addEventListener('pointercancel',tEnd);
$('#tUndo').onclick=()=>{T.strokes.pop();redrawT();saveT();pop(330)};
$('#tClear').onclick=()=>ask('Apagar tudo?',()=>{T.strokes=[];redrawT();saveT()});
$('#tBack').onclick=async()=>{pop(440);
  /* saiu do desenho livre: guarda sozinho na galeria */
  /* guarda na galeria (só se mudou desde a última vez) e o desenho continua na tela para continuar depois */
  const sig=T.strokes.length+':'+JSON.stringify(T.strokes[T.strokes.length-1]||'').length;if(T.strokes.length&&store.get(tKey()+'-g','')!==sig){const url=await telaUrl();dbAdd(url,T.mode);store.set(tKey()+'-g',sig);saveT();toast('Guardei seu desenho na galeria! 🎨')}
  if(T.mode==='aquarela')openPicker('aquarela');else show('home')};
$$('.tsize').forEach(b=>b.onclick=()=>{T.s=+b.dataset.s;$$('.tsize').forEach(x=>x.classList.toggle('on',x===b));T.stamp=-1;syncT();pop(500)});
$('#tEraser').onclick=()=>{T.e=!T.e;T.stamp=-1;syncT();pop(380)};
$('#tStamp').onclick=()=>{const r=$('#stampRow');const open=r.style.display!=='flex';r.style.display=open?'flex':'none';if(!open)T.stamp=-1;else if(T.stamp<0)T.stamp=0;T.e=false;syncT();pop(480)};
$('#stampRow').onclick=e=>{const b=e.target.closest('.stampimg');if(!b)return;T.stamp=+b.dataset.st;T.e=false;syncT();pop(640)};
$('#tRainbow').onclick=()=>{T.rb=!T.rb;syncT();pop(520)};
$('#tMir').onclick=()=>{T.mir=T.mir===2?4:2;$('#tMir').textContent=T.mir+'×';$('#mirLines').classList.toggle('four',T.mir===4);pop(520)};
function telaUrl(){return new Promise(res=>{const out=document.createElement('canvas');out.width=cv.width;out.height=cv.height;const o=out.getContext('2d');o.drawImage(cv,0,0);
  if(T.mode!=='aquarela')return res(out.toDataURL('image/jpeg',.88));
  const svg=$('#aquaOver svg').cloneNode(true);svg.setAttribute('xmlns',NS);const d=cv.width/T.W;const bw=T.W-20,bh=T.H-20,side=Math.min(bw,bh);const x=10+(bw-side)/2,y=10+(bh-side)/2;
  svg.setAttribute('width',side*d);svg.setAttribute('height',side*d);const im=new Image();im.onload=()=>{o.drawImage(im,x*d,y*d,side*d,side*d);res(out.toDataURL('image/jpeg',.88))};im.onerror=()=>res(out.toDataURL('image/jpeg',.88));
  im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(svg))})}
$('#tDone').onclick=async()=>{if(!T.strokes.length){toast('Desenhe alguma coisa primeiro!');return}pop(600);const url=await telaUrl();const back=T.mode==='aquarela'?()=>openPicker('aquarela'):()=>show('home');T.strokes=[];saveT();redrawT();complete(url,back)};

/* ---------- pixel por números ---------- */
const X={i:0,d:null,sel:0,hint:false,painted:new Set(),down:false};
$('#pixGal').innerHTML=PIXELS.map((d,i)=>`<button class="card" data-x="${i}"><canvas width="200" height="200"></canvas><span>${d.n}</span></button>`).join('');
function drawPix(c,d,painted){const g=d.g,rows=g.length,cols=Math.max(...g.map(r=>r.length));const x=c.getContext('2d');const cell=Math.floor(Math.min(c.width/cols,c.height/rows));const ox=(c.width-cell*cols)/2,oy=(c.height-cell*rows)/2;x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);
  g.forEach((r,ri)=>[...r].forEach((ch,ci)=>{if(ch==='.')return;const idx=ri*cols+ci;x.fillStyle=painted&&!painted.has(idx)?'#EEE7DB':d.c[+ch-1];x.fillRect(ox+ci*cell,oy+ri*cell,cell-(painted?1:0),cell-(painted?1:0))}))}
onShow.pixpick=()=>{$$('#pixGal canvas').forEach((c,i)=>drawPix(c,PIXELS[i],new Set(store.get('thur-px-'+i,[]))))};
$('#pixGal').onclick=e=>{const c=e.target.closest('.card');if(c){pop(520);openPixel(+c.dataset.x)}};
function openPixel(i){X.i=i;X.d=PIXELS[i];X.sel=0;X.painted=new Set(store.get('thur-px-'+i,[]));$('#xTitle').textContent=X.d.n;
  const g=X.d.g,cols=Math.max(...g.map(r=>r.length));
  $('#pxGrid').innerHTML=g.map((r,ri)=>[...r.padEnd(cols,'.')].map((ch,ci)=>{const idx=ri*cols+ci;if(ch==='.')return'<div class="px blank"></div>';const done=X.painted.has(idx);return`<div class="px" data-i="${idx}" data-n="${+ch-1}"${done?` style="background:${X.d.c[+ch-1]}"`:''}>${done?'':ch}</div>`}).join('')).join('');
  X.erase=false;$('#xErase').classList.remove('on');palette($('#palX'),X.d.c,(n)=>{X.sel=n;X.erase=false;$('#xErase').classList.remove('on');hl()},0,true);drawPix($('#pxPrev'),X.d,null);markPx();peek($('#pixel'));show('pixel')}
function layoutPx(){const d=X.d;if(!d)return;const r=$('#pxWrap').getBoundingClientRect();const rows=d.g.length,cols=Math.max(...d.g.map(r=>r.length));const cell=Math.max(16,Math.floor(Math.min((r.width-36)/cols,(r.height-36)/rows))-2);
  const gr=$('#pxGrid');gr.style.gridTemplateColumns=`repeat(${cols},${cell}px)`;gr.style.gridAutoRows=cell+'px';gr.style.fontSize=Math.max(10,cell*.45)+'px'}
onShow.pixel=()=>requestAnimationFrame(()=>{layoutPx();hl()});
new ResizeObserver(()=>{if($('#pixel').classList.contains('on'))layoutPx()}).observe($('#pxWrap'));
function hl(){$$('#pxGrid .px[data-n]').forEach(c=>c.classList.toggle('hl',X.hint&&+c.dataset.n===X.sel&&!X.painted.has(+c.dataset.i)));$('#xHint').classList.toggle('on',X.hint)}
function markPx(){X.d.c.forEach((_,n)=>{const left=$$(`#pxGrid .px[data-n="${n}"]`).some(c=>!X.painted.has(+c.dataset.i));const b=$(`#palX .sw[data-i="${n}"]`);if(b)b.classList.toggle('gone',!left)})}
let pxPopT=0;
function paintPx(el,isDown){if(!el||!el.classList.contains('px')||el.dataset.n===undefined)return;const idx=+el.dataset.i;
  if(X.erase){if(!X.painted.has(idx))return;X.painted.delete(idx);el.style.background='';el.textContent=String(+el.dataset.n+1);store.set('thur-px-'+X.i,[...X.painted]);markPx();hl();pop(300);return}
  if(X.painted.has(idx))return;
  if(+el.dataset.n!==X.sel){if(isDown){el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad');pop(200)}return}
  X.painted.add(idx);el.style.background=X.d.c[X.sel];el.textContent='';el.classList.remove('hl');
  const now=performance.now();if(now-pxPopT>70){pop(700+rnd(200));pxPopT=now}
  store.set('thur-px-'+X.i,[...X.painted]);markPx();
  if(X.painted.size===$$('#pxGrid .px[data-n]').length){X.down=false;setTimeout(()=>{const c=document.createElement('canvas');c.width=c.height=600;drawPix(c,X.d,null);store.del('thur-px-'+X.i);complete(c.toDataURL('image/jpeg',.9),()=>show('pixpick'),'px:'+X.i)},450)}}
const gridEl=$('#pxGrid');
gridEl.addEventListener('pointerdown',e=>{e.preventDefault();X.down=true;try{gridEl.setPointerCapture(e.pointerId)}catch(x){}paintPx(document.elementFromPoint(e.clientX,e.clientY),true)});
gridEl.addEventListener('pointermove',e=>{if(!X.down)return;evs(e).forEach(ev=>paintPx(document.elementFromPoint(ev.clientX,ev.clientY),false))});
const pxUp=()=>X.down=false;gridEl.addEventListener('pointerup',pxUp);gridEl.addEventListener('pointercancel',pxUp);
$('#xErase').onclick=()=>{X.erase=!X.erase;$('#xErase').classList.toggle('on',X.erase);pop(380);if(X.erase)speak('Borracha! Passe o dedo no que quer apagar.')};
$('#xHint').onclick=()=>{X.hint=!X.hint;hl();pop(480)};
$('#xClear').onclick=()=>ask('Recomeçar este desenho?',()=>{store.del('thur-px-'+X.i);openPixel(X.i)});

/* ---------- revelar ---------- */
/* revelar: além das fotos da turma, desenhos coloridos */
(()=>{const pal=['#FF4D4D','#FFD60A','#4FB3F0','#4CC764','#FF85C0','#9B5DE5','#FF9F1C','#8D5B3E'];
  ['Leão','Girafa','Panda','Golfinho','Dinossauro','Borboleta','Joaninha','Baleia','Carro','Foguete','Trem','Helicóptero','Girassol','Ilha','Planeta Terra','Vulcão','Cogumelo','Castelo','Arco-íris','Robô'].forEach((n,j)=>{const p=PAGES.find(x=>x.n===n);if(!p)return;const pl=PLANS[n];let k=0;
    let s=pageSvg(p).replace(/fill="#fff"/g,()=>{const c=pl&&pl.p[k]!==undefined?pl.c[pl.p[k]]:pal[(k*3+j)%pal.length];k++;return`fill="${c}"`});
    s=s.replace('<svg ','<svg width="720" height="720" ').replace('<defs></defs>','<defs><linearGradient id="bgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BDE6FF"/><stop offset="1" stop-color="#FFF4D2"/></linearGradient></defs><rect width="400" height="400" fill="url(#bgg)"/>');
    REVEAL.push({n,f:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)})})})();
$('#revGal').innerHTML=REVEAL.map((r,i)=>`<button class="card" data-r="${i}"><img src="${r.f}" alt="" style="filter:grayscale(1) brightness(1.25) contrast(.7)"><span>${r.n}</span></button>`).join('');
$('#revGal').onclick=e=>{const c=e.target.closest('.card');if(c){pop(520);openReveal(+c.dataset.r)}};
const rb=$('#rvBase'),rc=$('#rvCover'),rbx=rb.getContext('2d'),rcx=rc.getContext('2d');
const R={i:0,img:null,rect:null,down:false,last:null,done:false};
function openReveal(i){R.i=i;R.done=false;$('#rTitle').textContent=REVEAL[i].n;rc.style.transition='';rc.style.opacity=1;const im=new Image();im.onload=()=>{R.img=im;if($('#revelar').classList.contains('on'))layoutReveal()};im.src=REVEAL[i].f;peek($('#revelar'));show('revelar')}
function layoutReveal(){const im=R.img;if(!im)return;const box=$('#rPaper').getBoundingClientRect();if(!box.width)return;const d=DPR();
  for(const c of[rb,rc]){c.width=box.width*d;c.height=box.height*d}
  const pad=12*d,bw=rb.width-pad*2,bh=rb.height-pad*2,s=Math.min(bw/im.width,bh/im.height),w=im.width*s,h=im.height*s,x=(rb.width-w)/2,y=(rb.height-h)/2;R.rect={x,y,w,h};
  rbx.fillStyle='#fff';rbx.fillRect(0,0,rb.width,rb.height);rbx.drawImage(im,x,y,w,h);
  rcx.clearRect(0,0,rc.width,rc.height);rcx.globalCompositeOperation='source-over';rcx.drawImage(im,x,y,w,h);
  if(!R.done){try{const id=rcx.getImageData(x|0,y|0,Math.ceil(w),Math.ceil(h)),a=id.data;for(let k=0;k<a.length;k+=4){const g=.3*a[k]+.59*a[k+1]+.11*a[k+2];const v=255-(255-g)*.42;a[k]=a[k+1]=a[k+2]=v}rcx.putImageData(id,x|0,y|0)}catch(e){rcx.fillStyle='#EEE';rcx.fillRect(x,y,w,h)}}else rcx.clearRect(0,0,rc.width,rc.height)}
onShow.revelar=()=>requestAnimationFrame(layoutReveal);
new ResizeObserver(()=>{if($('#revelar').classList.contains('on'))layoutReveal()}).observe($('#rPaper'));
const rPt=e=>{const r=rc.getBoundingClientRect(),d=rc.width/r.width;return[(e.clientX-r.left)*d,(e.clientY-r.top)*d]};
function rub(p){rcx.globalCompositeOperation='destination-out';rcx.lineCap='round';rcx.lineJoin='round';rcx.lineWidth=Math.min(rc.width,rc.height)*.11;rcx.beginPath();const a=R.last||p;rcx.moveTo(a[0],a[1]);rcx.lineTo(p[0]+.1,p[1]);rcx.stroke();R.last=p}
rc.addEventListener('pointerdown',e=>{if(R.done)return;e.preventDefault();rc.setPointerCapture(e.pointerId);R.down=true;R.last=null;rub(rPt(e));pop(500)});
let rQ=[],rRaf=0;
rc.addEventListener('pointermove',e=>{if(!R.down)return;evs(e).forEach(ev=>rQ.push(rPt(ev)));if(!rRaf)rRaf=requestAnimationFrame(()=>{rRaf=0;rQ.forEach(rub);rQ=[]})});
const rUp=()=>{if(!R.down)return;rQ.forEach(rub);rQ=[];R.down=false;R.last=null;checkReveal()};rc.addEventListener('pointerup',rUp);rc.addEventListener('pointercancel',rUp);
function checkReveal(){const q=R.rect;if(!q||R.done)return;const id=rcx.getImageData(q.x|0,q.y|0,Math.ceil(q.w),Math.ceil(q.h)).data,W=Math.ceil(q.w);let tot=0,left=0;for(let y=0;y<q.h;y+=8)for(let x=0;x<W;x+=8){tot++;if(id[(y*W+x)*4+3]>10)left++}
  if(left/tot<.12){R.done=true;rc.style.transition='opacity .6s';rc.style.opacity=0;setTimeout(()=>{const c=document.createElement('canvas');c.width=c.height=720;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,720,720);const im=R.img,s=Math.min(720/im.width,720/im.height);x.drawImage(im,(720-im.width*s)/2,(720-im.height*s)/2,im.width*s,im.height*s);complete(c.toDataURL('image/jpeg',.9),()=>show('revpick'),'rv:'+R.i)},700)}}
$('#rAgain').onclick=()=>{pop(330);openReveal(R.i)};

/* ---------- letras ---------- */
let lSet='up',lIdx=0,lColor=COLORS[5],tStroke=null,lDone=false,tFs=200,tW=0,tH=0;
const tcv=$('#tcv'),tctx=tcv.getContext('2d'),mk=document.createElement('canvas'),um=document.createElement('canvas');const K=.25;
palette($('#palL'),COLORS,(i,c)=>{lColor=c;lErase=false;$('#lErase').classList.remove('on')},5);
const lItems=()=>lSet==='num'?NUMS.map((n,i)=>[String(i),n,'']):LETRAS.map(l=>[lSet==='low'?l[0].toLowerCase():l[0],l[1],l[2]]);
const glyphFont=px=>`800 ${px}px "Baloo 2", "Arial Rounded MT Bold", Arial, sans-serif`;
function setLetter(i){LSTR=[];const it=lItems();lIdx=(i+it.length)%it.length;const ch=it[lIdx][0];lDone=false;$('#lStars').innerHTML='';$('#lTitle').textContent=ch;$('#lPic').textContent=it[lIdx][2];$('#lWord').textContent=it[lIdx][1];
  const r=tcv.parentElement.getBoundingClientRect();if(!r.width)return;const d=DPR();tW=r.width;tH=r.height;tcv.width=tW*d;tcv.height=tH*d;tctx.setTransform(d,0,0,d,0,0);
  tFs=Math.min(tH*.9,tW*.85);tctx.fillStyle='#fff';tctx.fillRect(0,0,tW,tH);tctx.font=glyphFont(tFs);tctx.textAlign='center';tctx.textBaseline='middle';const y=tH/2+tFs*.06;
  for(const c of[mk,um]){c.width=Math.ceil(tW*K);c.height=Math.ceil(tH*K)}const m=mk.getContext('2d');m.font=glyphFont(tFs*K);m.textAlign='center';m.textBaseline='middle';m.fillStyle='#000';m.fillText(ch,mk.width/2,y*K);
  /* letra em pontilhado único: a linha do meio da letra, para passar o dedo por cima (sem pintar por dentro) */
  LS=skeleton(mk);const sp=Math.max(3,tFs*K*.055);const kept=[];LS.pts.forEach(([x,yy])=>{if(kept.every(([a,b])=>(a-x)**2+(b-yy)**2>sp*sp))kept.push([x,yy])});
  tctx.fillStyle='#A08BE0';kept.forEach(([x,yy])=>{tctx.beginPath();tctx.arc((x+.5)/K,(yy+.5)/K,Math.max(4,tFs*.022),0,7);tctx.fill()})}
let LS={pts:[],W:0,H:0,sk:null};tcv._ls=()=>LS;
/* afina a letra até sobrar só a linha do meio (Zhang-Suen) */
function skeleton(cv){const W=cv.width,H=cv.height,d=cv.getContext('2d').getImageData(0,0,W,H).data;const im=new Uint8Array(W*H);for(let i=0;i<W*H;i++)im[i]=d[i*4+3]>100?1:0;
  const at=(x,y)=>x<0||y<0||x>=W||y>=H?0:im[y*W+x];let ch=true,it=0;
  while(ch&&it<60){ch=false;it++;for(const step of[0,1]){const del=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(!im[y*W+x])continue;
      const p=[at(x,y-1),at(x+1,y-1),at(x+1,y),at(x+1,y+1),at(x,y+1),at(x-1,y+1),at(x-1,y),at(x-1,y-1)];const B=p.reduce((s,v)=>s+v,0);if(B<2||B>6)continue;
      let A=0;for(let k=0;k<8;k++)if(!p[k]&&p[(k+1)%8])A++;if(A!==1)continue;
      if(step===0){if(p[0]*p[2]*p[4]||p[2]*p[4]*p[6])continue}else{if(p[0]*p[2]*p[6]||p[0]*p[4]*p[6])continue}del.push(y*W+x)}
    if(del.length){ch=true;del.forEach(i=>im[i]=0)}}}
  const pts=[];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(im[y*W+x])pts.push([x,y]);return{pts,W,H,sk:im}}
function tLine(c,p,from,w,k){c.lineCap='round';c.lineJoin='round';c.lineWidth=w*k;c.beginPath();const a=Math.max(0,from-1);c.moveTo(p[a][0]*k,p[a][1]*k);if(p.length===1)c.lineTo(p[0][0]*k+.1,p[0][1]*k);for(let i=a+1;i<p.length;i++)c.lineTo(p[i][0]*k,p[i][1]*k);c.stroke()}
const lPt=e=>{const r=tcv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
function lDraw(from){const w=tFs*.1;tctx.strokeStyle=lColor;tLine(tctx,tStroke,from,w,1);const u=um.getContext('2d');u.strokeStyle='#000';tLine(u,tStroke,from,w,K)}
let LSTR=[],lErase=false;
function lRedraw(){/* redesenha o pontilhado e os traços que sobraram */const ch=lItems()[lIdx][0];const sv=LSTR;setLetter(lIdx);LSTR=sv;sv.forEach(st=>{tStroke=st.p;tctx.strokeStyle=st.c;const w=tFs*.1;tLine(tctx,st.p,0,w,1);const u=um.getContext('2d');u.strokeStyle='#000';tLine(u,st.p,0,w,K)});tStroke=null}
function lEraseAt(pt){const r=tFs*.09;const before=LSTR.length;LSTR=LSTR.filter(st=>!st.p.some(q=>(q[0]-pt[0])**2+(q[1]-pt[1])**2<r*r));if(LSTR.length!==before){pop(300);lRedraw()}}
$('#lErase').onclick=()=>{lErase=!lErase;$('#lErase').classList.toggle('on',lErase);pop(380);if(lErase)speak('Borracha! Passe o dedo no risco que quer apagar.')};
tcv.addEventListener('pointerdown',e=>{e.preventDefault();tcv.setPointerCapture(e.pointerId);if(lErase){tStroke=null;lEraseAt(lPt(e));tcv._er=true;return}tcv._er=false;tStroke=[lPt(e)];LSTR.push({p:tStroke,c:lColor});lDraw(0);lDrawn=1});
tcv.addEventListener('pointermove',e=>{if(tcv._er&&e.buttons)lEraseAt(lPt(e))});
let lDrawn=0,lRaf=0;
tcv.addEventListener('pointermove',e=>{if(!tStroke)return;evs(e).forEach(ev=>tStroke.push(lPt(ev)));if(!lRaf)lRaf=requestAnimationFrame(()=>{lRaf=0;if(tStroke){lDraw(lDrawn);lDrawn=tStroke.length}})});
const lEnd=()=>{if(!tStroke)return;if(lDrawn<tStroke.length)lDraw(lDrawn);tStroke=null;lCheck()};tcv.addEventListener('pointerup',lEnd);tcv.addEventListener('pointercancel',lEnd);
function lCheck(){if(lDone||!LS.pts.length)return;const b=um.getContext('2d').getImageData(0,0,um.width,um.height).data,W=LS.W,H=LS.H;
  /* cobrir a linha pontilhada inteira (todas as partes da letra) sem rabiscar muito longe dela */
  const R=Math.max(2,Math.round(tFs*K*.09));const band=new Uint8Array(W*H);LS.pts.forEach(([x,y])=>{for(let dy=-R;dy<=R;dy++)for(let dx=-R;dx<=R;dx++){const X=x+dx,Y=y+dy;if(X>=0&&Y>=0&&X<W&&Y<H&&dx*dx+dy*dy<=R*R)band[Y*W+X]=1}});
  let hit=0;const G=5,cl=new Array(G*G).fill(0),cb=new Array(G*G).fill(0);
  LS.pts.forEach(([x,y])=>{const c=Math.min(G-1,Math.floor(x/W*G))+G*Math.min(G-1,Math.floor(y/H*G));cl[c]++;if(b[(y*W+x)*4+3]>100){hit++;cb[c]++}});
  let U=0,inB=0;for(let i=0;i<W*H;i++)if(b[i*4+3]>100){U++;if(band[i])inB++}
  const L=LS.pts.length,both=hit,tot=L;const parts=cl.every((n,c)=>n<tot*.03||cb[c]/n>.75);
  if(L&&both/L>.85&&U&&inB/U>.6&&parts){lDone=true;$('#lStars').innerHTML='<svg viewBox="0 0 100 100" width="55%" height="55%" aria-hidden="true"><polygon points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38" fill="#FFD60A" stroke="#2E2440" stroke-width="3" stroke-linejoin="round" opacity=".9"/></svg>';party();const it=lItems()[lIdx];speak('Muito bem! '+(lSet==='num'?it[1]:it[0].toUpperCase()+' de '+it[1]));
    window.helperCheer&&window.helperCheer();const lk='l:'+lSet+':'+it[0];if(every('thur-cnt-l',3))setTimeout(()=>complete(null,null,lk),1600);else award(lk)}}
function sayLetter(){const it=lItems()[lIdx];speak(lSet==='num'?it[1]:it[0].toUpperCase()+', de '+it[1])}
$('#lNext').onclick=()=>{pop(520);setLetter(lIdx+1);sayLetter()};$('#lPrev').onclick=()=>{pop(520);setLetter(lIdx-1);sayLetter()};
$('#lClear').onclick=()=>{pop(330);setLetter(lIdx)};$('#lSay').onclick=sayLetter;
$$('.lset').forEach(b=>b.onclick=()=>{lSet=b.dataset.set;$$('.lset').forEach(x=>x.classList.toggle('on',x===b));pop(480);setLetter(0);sayLetter()});
onShow.letras=()=>requestAnimationFrame(()=>setLetter(lIdx));
new ResizeObserver(()=>{if($('#letras').classList.contains('on')&&!tStroke)setLetter(lIdx)}).observe(tcv.parentElement);

/* ---------- palavras ---------- */
let word=null,wQueue=[],wHint=store.get('thur-dica',true),slots=[],wLv=store.get('thur-wlv','medio');
$('#wHint').classList.toggle('on',wHint);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const fam=()=>store.get('thur-familia',[]);
function wPool(){if(wLv==='familia')return fam();return PALAVRAS.filter(([w])=>{const n=[...w].length;return wLv==='facil'?n<=3:wLv==='medio'?n===4:n>=5})}
function syncLv(){$$('#wLv .ico').forEach(b=>b.classList.toggle('on',b.dataset.lv===wLv))}
function newWord(){if(!wQueue.length){const p=wPool();if(!p.length){if(wLv==='familia'){openWD();return}}wQueue=shuffle(p.slice())}
  word=wQueue.pop();const letters=[...word[0]];slots=Array(letters.length).fill(null);const L=letters.map((c,i)=>({c,i}));let n=0;do{shuffle(L);n++}while(L.map(l=>l.c).join('')===word[0]&&n<20);
  $('#wPic').textContent=word[1]||'⭐';$('#ltiles').innerHTML=L.map(l=>`<button class="lt" data-t="${l.i}" aria-label="Letra ${l.c}">${l.c}</button>`).join('');renderSlots();setTimeout(()=>speak(word[0].toLowerCase()),350)}
const wl=i=>[...word[0]][i];
function renderSlots(){$('#slots').innerHTML=slots.map((t,i)=>{const c=t===null?(wHint?wl(i):''):wl(t);return`<button class="slot${t!==null?' full':''}" data-s="${i}" aria-label="Espaço ${i+1}">${c}</button>`}).join('')}
$('#ltiles').onclick=e=>{const b=e.target.closest('.lt');if(!b||b.classList.contains('used'))return;const k=slots.indexOf(null);if(k<0)return;const t=+b.dataset.t;slots[k]=t;b.classList.add('used');speak(wl(t).toLowerCase());pop(640);renderSlots();if(!slots.includes(null))wCheck()};
$('#slots').onclick=e=>{const s=e.target.closest('.slot');if(!s)return;const i=+s.dataset.s,t=slots[i];if(t===null)return;slots[i]=null;$(`.lt[data-t="${t}"]`).classList.remove('used');pop(380);renderSlots()};
function wCheck(){const got=slots.map(t=>wl(t)).join('');if(got===word[0]){$$('.slot').forEach(s=>s.classList.add('ok'));party();speak(word[0].toLowerCase()+'! Muito bem!');const wk='w:'+word[0];if(every('thur-cnt-w',3))setTimeout(()=>complete(null,newWord,wk),1500);else{award(wk);setTimeout(newWord,2600)}}
  else{const box=$('#slots');box.classList.add('shake');pop(200);setTimeout(()=>{box.classList.remove('shake');slots.forEach((t,i)=>{if(t!==null&&wl(t)!==wl(i)){$(`.lt[data-t="${t}"]`).classList.remove('used');slots[i]=null}});renderSlots()},450)}}
$('#wSay').onclick=()=>{if(word)speak(word[0].toLowerCase())};$('#wNext').onclick=()=>{pop(520);newWord()};
$('#wHint').onclick=()=>{wHint=!wHint;store.set('thur-dica',wHint);$('#wHint').classList.toggle('on',wHint);renderSlots();pop(480)};
$('#wLv').onclick=e=>{const b=e.target.closest('[data-lv]');if(!b)return;wLv=b.dataset.lv;store.set('thur-wlv',wLv);wQueue=[];syncLv();pop(480);newWord()};
syncLv();
/* palavras da família (os pais escrevem) */
const EMOS=['⭐','❤️','🏠','👨','👩','👧','👦','👶','👵','👴','🐶','🐱','⚽','🚗','🎂','🌈'];let wEmo='⭐';
$('#wEmo').innerHTML=EMOS.map(e=>`<button class="emo${e===wEmo?' on':''}" data-e="${e}" aria-label="Figura">${e}</button>`).join('');
$('#wEmo').onclick=e=>{const b=e.target.closest('.emo');if(!b)return;wEmo=b.dataset.e;$$('#wEmo .emo').forEach(x=>x.classList.toggle('on',x===b))};
function renderWL(){const l=$('#wList');l.innerHTML='';fam().forEach(([w,e],i)=>{const c=document.createElement('span');c.className='wchip';c.textContent=e+' '+w;const x=document.createElement('button');x.textContent='✕';x.setAttribute('aria-label','Apagar '+w);x.onclick=()=>{const f=fam();f.splice(i,1);store.set('thur-familia',f);renderWL()};c.appendChild(x);l.appendChild(c)})}
function openWD(){renderWL();$('#wIn').value='';$('#wdlg').classList.add('on');setTimeout(()=>{try{$('#wIn').focus()}catch(e){}},100)}
$('#wEdit').onclick=()=>{pop(480);openWD()};
$('#wClose').onclick=()=>{$('#wdlg').classList.remove('on')};
function addW(){const w=$('#wIn').value.normalize('NFC').toUpperCase().replace(/[^A-ZÀ-ÖØ-Ý]/g,'').slice(0,10);if(w.length<2){toast('Escreva uma palavra com pelo menos 2 letras.');return false}const f=fam();if(!f.some(x=>x[0]===w))f.push([w,wEmo]);store.set('thur-familia',f);$('#wIn').value='';renderWL();pop(700);return true}
$('#wAdd').onclick=addW;
$('#wIn').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addW()}});
$('#wPlay').onclick=()=>{if($('#wIn').value.trim())addW();if(!fam().length){toast('Adicione pelo menos uma palavra.');return}$('#wdlg').classList.remove('on');wLv='familia';store.set('thur-wlv',wLv);wQueue=[];syncLv();newWord()};
onShow.palavras=()=>{if(!word)newWord()};

/* ---------- para os pais ---------- */
onShow.pais=()=>{$('#panel').hidden=true;$('#gate').hidden=false;const a=3+rnd(7),b=3+rnd(7),ok=a+b;$('#gq').textContent=`${a} + ${b}`;
  const opts=shuffle([ok,ok+1+rnd(3),Math.max(2,ok-1-rnd(3))]);$('#gopts').innerHTML=opts.map(v=>`<button class="gnum" data-v="${v}">${v}</button>`).join('');
  $('#gopts').onclick=e=>{const b2=e.target.closest('.gnum');if(!b2)return;if(+b2.dataset.v===ok){$('#gate').hidden=true;$('#panel').hidden=false}else{pop(200);onShow.pais()}}};
$$('input[name=vozTipo]').forEach(r=>{r.checked=r.value===cfg.vozTipo;r.onchange=()=>{cfg.vozTipo=r.value;store.set('thur-cfg',cfg);VCACHE={};speak(r.value==='fem'?'Oi! Agora eu falo com voz feminina.':'Oi! Agora eu falo com voz masculina.')}});
$('#vozTeste').onclick=()=>speak('Olá! Eu sou o Thur. Vamos brincar?');
/* criança: nome, idade (degrau do Aprender a ler) e lembrete de pausa */
$('#cfgNome').value=cfg.nome||'';$('#cfgNome').onchange=e=>{cfg.nome=e.target.value.trim().slice(0,14);store.set('thur-cfg',cfg)};
$('#cfgIdade').value=cfg.idade||'2';$('#cfgIdade').onchange=e=>{cfg.idade=e.target.value;store.set('thur-cfg',cfg);const i=cfg.idade;window.LER&&(window.LER.setDeg(i==='2'?0:i==='3'?1:2),window.LER.setDegM(i==='2'?0:i==='5'?2:1));toast('Pronto! Aprender a ler e Matemática ajustados para '+e.target.selectedOptions[0].text+'.')};
$('#cfgPausa').value=String(cfg.pausa||0);$('#cfgPausa').onchange=e=>{cfg.pausa=+e.target.value;store.set('thur-cfg',cfg)};
$('#cfgSom').checked=cfg.som;$('#cfgVoz').checked=cfg.voz;
$('#cfgSom').onchange=e=>{cfg.som=e.target.checked;store.set('thur-cfg',cfg)};$('#cfgVoz').onchange=e=>{cfg.voz=e.target.checked;store.set('thur-cfg',cfg)};
$('#clrArt').onclick=()=>ask('Apagar todas as artes da galeria?',()=>{dbClear();toast('Galeria apagada.')});
$('#clrSt').onclick=()=>ask('Zerar todos os adesivos?',()=>{store.del('thur-st');store.set('thur-st2',[]);toast('Adesivos zerados.')});
$('#clrWip').onclick=()=>ask('Apagar as pinturas em andamento?',()=>{try{Object.keys(localStorage).filter(k=>/^thur-(s|t|px)-/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}toast('Pinturas em andamento apagadas.')});

/* lembrete de pausa: soma o tempo de uso do dia (só com a tela visível) */
(()=>{const dia=()=>new Date().toDateString();let U=store.get('thur-uso',{d:dia(),s:0});
  setInterval(()=>{if(document.hidden)return;if(U.d!==dia())U={d:dia(),s:0,extra:0};U.s+=15;store.set('thur-uso',U);
    const lim=(cfg.pausa||0)*60+(U.extra||0)*60;if(cfg.pausa&&U.s>=lim&&!$('#pausa').classList.contains('on')){$('#pausa').classList.add('on');try{speechSynthesis.cancel()}catch(e){}speak('Hora de descansar os olhinhos! Que tal brincar lá fora?','clara')}},15000);
  let t=null;const b=$('#pzMais');const ini=e=>{e.preventDefault();b.classList.add('hold');t=setTimeout(()=>{b.classList.remove('hold');U.extra=(U.extra||0)+10;store.set('thur-uso',U);$('#pausa').classList.remove('on');toast('Mais 10 minutos liberados.')},2000)},fim=()=>{clearTimeout(t);b.classList.remove('hold')};
  b.addEventListener('pointerdown',ini);['pointerup','pointerleave','pointercancel'].forEach(k=>b.addEventListener(k,fim))})();
window.TH={$,$$,show,pop,speak,party,hop,actx,cfg,rnd,onShow,splashSound,complete,award,ask,toast};
/* adesivos já ganhos (sem repetir o desenho), para colar nos carros */
window.TH.meusAdesivos=()=>{const A=acts(),g=new Set(gotSet()),seen=new Set(),out=[];A.forEach((k,i)=>{if(g.has(k)){const e=stkOf(i).e;if(!seen.has(e)){seen.add(e);out.push(e)}}});return out};
/* ---------- início ---------- */
{const h=location.hash.slice(1);show(['galeria','adesivos','ler','mat','letras','palavras','pixpick','revpick','garagem','loja'].includes(h)?h:'home',false)}
try{speechSynthesis.getVoices()}catch(e){}
const APP_VER='8.1';$('#appVer').textContent='Versão '+APP_VER;
/* backup e importação (Área dos Pais): tudo do app num arquivo só */
(()=>{
  $('#bkExport').onclick=async()=>{try{const ls={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith('thur-'))ls[k]=localStorage.getItem(k)}
    const arte=await dbAll()||[];const data={app:'turma-do-thur',v:APP_VER,quando:new Date().toISOString(),ls,arte:arte.map(({url,t,m})=>({url,t,m}))};
    const blob=new Blob([JSON.stringify(data)],{type:'application/json'});const d=new Date();const nome=`turma-do-thur-backup-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.json`;
    const file=new File([blob],nome,{type:'application/json'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:'Backup Turma do Thur'});toast('Backup pronto!');return}catch(e){if(e&&e.name==='AbortError')return}}
    const u=URL.createObjectURL(blob);const lnk=document.createElement('a');lnk.href=u;lnk.download=nome;document.body.appendChild(lnk);lnk.click();lnk.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast(`Backup salvo: ${arte.length} desenhos`)}catch(e){toast('Não deu para fazer o backup.')}};
  $('#bkImport').onclick=()=>$('#bkFile').click();
  $('#bkFile').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;let data;try{data=JSON.parse(await f.text())}catch(x){toast('Esse arquivo não é um backup do app.');return}
    if(!data||data.app!=='turma-do-thur'||!data.ls){toast('Esse arquivo não é um backup do app.');return}
    ask(`Importar o backup de ${new Date(data.quando).toLocaleDateString('pt-BR')}? Ele substitui o que está no app agora (${(data.arte||[]).length} desenhos).`,async()=>{
      Object.keys(localStorage).filter(k=>k.startsWith('thur-')).forEach(k=>localStorage.removeItem(k));Object.entries(data.ls).forEach(([k,v])=>{try{localStorage.setItem(k,v)}catch(x){}});
      await dbClear();for(const a of data.arte||[])await tx('readwrite',s=>s.add({url:a.url,t:a.t||Date.now(),m:a.m||''}));
      toast('Backup importado!');setTimeout(()=>location.reload(),900)})};})();
if('serviceWorker' in navigator){try{const sw=navigator.serviceWorker,had=!!sw.controller;let re=false;
  sw.register('sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});setInterval(()=>reg.update().catch(()=>{}),20*60*1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)reg.update().catch(()=>{})})}).catch(()=>{});
  sw.addEventListener('controllerchange',()=>{if(!had||re)return;re=true;toast('Atualizando o app…');setTimeout(()=>location.reload(),600)})}catch(e){}}
$('#forceUpd').onclick=async()=>{toast('Atualizando o app…');try{if('serviceWorker' in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch(e){}setTimeout(()=>location.reload(),500)};
}

/* tela cheia: some a barra do Android ao tocar (reforça o modo fullscreen do app instalado) */
(()=>{const inApp=matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone;
  const go=()=>{const d=document.documentElement;if(document.fullscreenElement||!d.requestFullscreen)return;d.requestFullscreen({navigationUI:'hide'}).catch(()=>{})};
  if(inApp)document.addEventListener('pointerup',go,{passive:true});})();

/* desenhos nos botões com palavras: a criança que ainda não lê entende pelo desenho */
(()=>{const I={
  replay:'<path d="M24 10a10 10 0 1 0 3 8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M27 4v8h-8" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
  flag:'<path d="M7 4v26" stroke="#2E2440" stroke-width="3" stroke-linecap="round"/><rect x="8" y="5" width="18" height="12" fill="#fff" stroke="#2E2440" stroke-width="2"/><path d="M8 5h4.5v4H8zM17 5h4.5v4H17zM12.5 9H17v4h-4.5zM21.5 9H26v4h-4.5zM8 13h4.5v4H8zM17 13h4.5v4H17z" fill="#2E2440"/>',
  shop:'<path d="M6 12h20l-2 16H8z" fill="#FF85C0" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><path d="M11 12V9a5 5 0 0 1 10 0v3" fill="none" stroke="#2E2440" stroke-width="2.5"/><path d="M16 17l1.5 3 3.3.4-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.4z" fill="#FFD60A"/>',
  garage:'<path d="M4 14L16 5l12 9v14H4z" fill="#FFD60A" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><rect x="8" y="17" width="16" height="11" fill="#fff" stroke="#2E2440" stroke-width="2"/><rect x="10" y="21" width="12" height="5" rx="2" fill="#FF4D4D"/>',
  brush:'<path d="M20 4l8 8-10 10-8-8z" fill="#4FB3F0" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><path d="M10 14c-4 1-5 5-6 12 6-1 11-2 12-6z" fill="#FF4D4D" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/>',
  wheel:'<circle cx="16" cy="16" r="12" fill="#2B2B2B" stroke="#2E2440" stroke-width="2"/><circle cx="16" cy="16" r="6" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/>',
  sticker:'<path d="M16 3l4 8.5 9.3 1.2-6.8 6.4 1.7 9.2L16 23.8 7.8 28.3l1.7-9.2-6.8-6.4 9.3-1.2z" fill="#FFD60A" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/>',
  wing:'<path d="M3 22h26l-4-8H7z" fill="#2B2B2B" stroke="#2E2440" stroke-width="2"/><path d="M16 22v7" stroke="#2E2440" stroke-width="4"/><path d="M24 3v12" stroke="#2E2440" stroke-width="2"/><path d="M24 3l-7 2.5 7 2.5z" fill="#FF4D4D"/>',
  horn:'<path d="M4 12h6l12-7v22l-12-7H4z" fill="#FF9F1C" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><path d="M25 10a8 8 0 0 1 0 12" fill="none" stroke="#2E2440" stroke-width="2.5" stroke-linecap="round"/>',
  pet:'<circle cx="16" cy="18" r="11" fill="#7ED957" stroke="#2E2440" stroke-width="2.5"/><path d="M16 7c0-3 2-4 4-4" fill="none" stroke="#2E2440" stroke-width="2.5"/><circle cx="20" cy="3.5" r="2.5" fill="#7ED957" stroke="#2E2440" stroke-width="1.5"/><circle cx="12" cy="17" r="2" fill="#2E2440"/><circle cx="20" cy="17" r="2" fill="#2E2440"/><path d="M12 22q4 4 8 0" fill="none" stroke="#2E2440" stroke-width="2" stroke-linecap="round"/>',
  paw:'<ellipse cx="16" cy="21" rx="7" ry="6" fill="#C98B4E" stroke="#2E2440" stroke-width="2"/><circle cx="8" cy="13" r="3" fill="#C98B4E" stroke="#2E2440" stroke-width="2"/><circle cx="13" cy="8" r="3" fill="#C98B4E" stroke="#2E2440" stroke-width="2"/><circle cx="19" cy="8" r="3" fill="#C98B4E" stroke="#2E2440" stroke-width="2"/><circle cx="24" cy="13" r="3" fill="#C98B4E" stroke="#2E2440" stroke-width="2"/>',
  car:'<path d="M3 21v-5l4-1 4-6h10l4 6 4 1v5z" fill="#FF4D4D" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><circle cx="9" cy="22" r="3.5" fill="#2B2B2B" stroke="#2E2440" stroke-width="1.5"/><circle cx="23" cy="22" r="3.5" fill="#2B2B2B" stroke="#2E2440" stroke-width="1.5"/>',
  flower:'<g fill="#FF85C0" stroke="#2E2440" stroke-width="2"><circle cx="16" cy="8" r="5"/><circle cx="24" cy="14" r="5"/><circle cx="21" cy="23" r="5"/><circle cx="11" cy="23" r="5"/><circle cx="8" cy="14" r="5"/></g><circle cx="16" cy="16" r="4" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/>',
  ball:'<circle cx="16" cy="16" r="12" fill="#fff" stroke="#2E2440" stroke-width="2.5"/><path d="M4 16h24" stroke="#FF4D4D" stroke-width="5"/><path d="M16 4v24" stroke="#4FB3F0" stroke-width="5"/><circle cx="16" cy="16" r="12" fill="none" stroke="#2E2440" stroke-width="2.5"/>',
  letter:'<text x="16" y="26" font-size="26" font-weight="800" text-anchor="middle" fill="#4FB3F0" stroke="#2E2440" stroke-width="1.5" font-family="Baloo 2,Arial Black,sans-serif">A</text>',
  number:'<text x="16" y="25" font-size="18" font-weight="800" text-anchor="middle" fill="#9B5DE5" stroke="#2E2440" stroke-width="1" font-family="Baloo 2,Arial Black,sans-serif">123</text>',
  word:'<rect x="2" y="9" width="9" height="14" rx="2" fill="#FF4D4D" stroke="#2E2440" stroke-width="2"/><rect x="11.5" y="9" width="9" height="14" rx="2" fill="#4FB3F0" stroke="#2E2440" stroke-width="2"/><rect x="21" y="9" width="9" height="14" rx="2" fill="#4CC764" stroke="#2E2440" stroke-width="2"/>',
  star1:'<path d="M16 5l3 6.6 7.2.8-5.3 4.9 1.4 7.1L16 20.9l-6.3 3.5 1.4-7.1-5.3-4.9 7.2-.8z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/>',
  star2:'<g fill="#FFD60A" stroke="#2E2440" stroke-width="1.8"><path d="M9 8l2 4.4 4.8.5-3.6 3.3.9 4.8L9 18.7 4.9 21l.9-4.8-3.6-3.3 4.8-.5z"/><path d="M23 8l2 4.4 4.8.5-3.6 3.3.9 4.8-4.1-2.3-4.1 2.3.9-4.8-3.6-3.3 4.8-.5z"/></g>',
  star3:'<g fill="#FFD60A" stroke="#2E2440" stroke-width="1.6"><path d="M16 2l2 4.4 4.8.5-3.6 3.3.9 4.8L16 12.7 11.9 15l.9-4.8-3.6-3.3 4.8-.5z"/><path d="M8 14l2 4.4 4.8.5-3.6 3.3.9 4.8L8 24.7 3.9 27l.9-4.8-3.6-3.3 4.8-.5z"/><path d="M24 14l2 4.4 4.8.5-3.6 3.3.9 4.8-4.1-2.3-4.1 2.3.9-4.8-3.6-3.3 4.8-.5z"/></g>',
  family:'<path d="M16 28C5 20 3 13 7 9s9-2 9 2c0-4 5-6 9-2s2 11-9 19z" fill="#FF4D6D" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/>',
  plate:'<ellipse cx="16" cy="20" rx="13" ry="6" fill="#fff" stroke="#2E2440" stroke-width="2.5"/><path d="M8 18c0-6 4-10 8-10s8 4 8 10z" fill="#FFD36B" stroke="#2E2440" stroke-width="2"/>',
  fire:'<path d="M16 3c2 6 9 9 9 17a9 9 0 0 1-18 0c0-5 3-7 4-11 1 3 2 4 3 4 0-4 1-7 2-10z" fill="#FF9F1C" stroke="#2E2440" stroke-width="2.5" stroke-linejoin="round"/><path d="M16 15c1 3 4 4 4 8a4 4 0 0 1-8 0c0-3 3-4 4-8z" fill="#FFD60A"/>',
  check:'<path d="M6 17l6 6 14-14" fill="none" stroke="#4CC764" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
  hand:'<path d="M12 28c-4-2-7-6-7-9l3-2 4 3V6a2 2 0 0 1 4 0v8l8 1c2 .4 3 2 3 4l-1 6c-.5 2-2 3-4 3z" fill="#FFD2A8" stroke="#2E2440" stroke-width="2.2" stroke-linejoin="round"/>',
  mirror:'<path d="M16 3v26" stroke="#B8860B" stroke-width="2.5" stroke-dasharray="3 3"/><path d="M14 8C6 4 2 12 8 16c-5 4 0 12 6 8z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/><path d="M18 8c8-4 12 4 6 8 5 4 0 12-6 8z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/>'};
  const R=[[/^correr de novo/i,'replay'],[/pista|correr!/i,'flag'],[/loja/i,'shop'],[/^garagem/i,'garage'],[/^pintura/i,'brush'],[/^rodas?$/i,'wheel'],[/^adesivos?/i,'sticker'],[/^enfeites?/i,'wing'],[/^buzinas?/i,'horn'],[/^pistas$/i,'flag'],
    [/^bolelecos/i,'pet'],[/^bichos/i,'paw'],[/^ve[ií]culos/i,'car'],[/^natureza/i,'flower'],[/^coisas/i,'ball'],[/^letras/i,'letter'],[/^n[uú]meros/i,'number'],[/^palavras/i,'word'],
    [/^f[aá]cil/i,'star1'],[/^m[eé]dio/i,'star2'],[/^dif[ií]cil/i,'star3'],[/^fam[ií]lia/i,'family'],[/servir/i,'plate'],[/fogo/i,'fire'],[/^usando/i,'check'],[/^usar/i,'hand'],[/^\d×$/,'mirror']];
  const txt=el=>[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').replace(/[🔥🍽️]/gu,'').trim();
  function deco(){document.querySelectorAll('button, .lbt').forEach(b=>{if(b.querySelector('.bi'))return;if(b.closest('#pais,#ler,#mat,#licao'))return;const t=txt(b);if(!t)return;const r=R.find(([re])=>re.test(t));if(!r)return;
    b.insertAdjacentHTML('afterbegin',`<span class="bi" aria-hidden="true"><svg viewBox="0 0 32 32">${I[r[1]]}</svg></span>`);b.classList.add('hasbi')})}
  let q=0;new MutationObserver(()=>{if(!q)q=requestAnimationFrame(()=>{q=0;deco()})}).observe(document.body,{childList:true,subtree:true});deco()})();

/* um Boleleco acompanha a criança nas atividades: torce, comemora e conversa com a voz dele */
(()=>{const {rnd,actx,speak}=window.TH;const VIEWS=['pintar','tela','letras','palavras','pixel','revelar','pista','montar'];
  const PETS=['zuzu','lelo','pituca','bubu'];const HAS={zuzu:['feliz','pulando','amor','joinha','cantando'],lelo:['feliz','pulando','amor','joinha','cantando'],pituca:['feliz','pulando','amor','acenando','cantando'],bubu:['feliz','espirro','pensando','surpreso']};
  const FALA={inicio:['Vamos lá! Eu te ajudo!','Oba! Adoro essa brincadeira!','Você consegue!'],toque:['Hihi! Que cosquinha!','Continua, tá ficando lindo!','Eu sou seu ajudante!','Uau, que capricho!'],fim:['Uhuu! Você conseguiu!','Que lindo! Parabéns!','Ebaaa! Muito bem!'],dica:['Que tal outra cor?','Tá ficando muito legal!','Vai, vai, você consegue!']};
  const el=document.createElement('button');el.id='helper';el.setAttribute('aria-label','Boleleco ajudante');el.innerHTML='<img alt="">';document.body.appendChild(el);
  let pet='lelo',tm=0,dica=0;const img=el.querySelector('img');
  const poseOf=p=>HAS[pet].includes(p)?`img/poses/${pet}-${p}.webp`:`img/pets/${pet}.png`;
  function setPose(p,ms){img.src=poseOf(p);clearTimeout(tm);if(ms)tm=setTimeout(()=>{img.src=`img/pets/${pet}.png`},ms)}
  const say=k=>{const l=FALA[k];speak(l[rnd(l.length)],pet,true)};
  function onView(id){const on=VIEWS.includes(id);el.classList.toggle('on',on);el.dataset.v=id;clearInterval(dica);
    if(!on)return;pet=PETS[rnd(PETS.length)];setPose('feliz',0);img.src=`img/pets/${pet}.png`;el.animate([{transform:'translateY(120%)'},{transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.3,1.5,.6,1)'});
    setTimeout(()=>{if(el.classList.contains('on')&&id!=='pista')say('inicio')},900);
    dica=setInterval(()=>{if(!el.classList.contains('on')||document.hidden)return;setPose(HAS[pet].includes('cantando')?'cantando':'feliz',1800);if(Math.random()<.5)say('dica')},26000)}
  el.addEventListener('click',()=>{actx();el.animate([{transform:'translateY(0)'},{transform:'translateY(-30%) rotate(-8deg)'},{transform:'translateY(0)'}],{duration:450});setPose(pet==='bubu'?'espirro':'pulando',1500);say('toque')});
  window.helperCheer=()=>{if(!el.classList.contains('on'))return;setPose(HAS[pet].includes('amor')?'amor':'surpreso',2600);el.animate([{transform:'translateY(0) scale(1)'},{transform:'translateY(-40%) scale(1.2)'},{transform:'translateY(0) scale(1)'}],{duration:700});setTimeout(()=>say('fim'),1200)};
  const obs=new MutationObserver(()=>{const v=document.querySelector('.view.on');const id=v&&v.id;if(id!==el.dataset.cur){el.dataset.cur=id;onView(id)}});
  document.querySelectorAll('.view').forEach(v=>obs.observe(v,{attributes:true,attributeFilter:['class']}));})();
