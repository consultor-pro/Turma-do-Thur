/* Turma do Thur — app de colorir e aprender */
'use strict';
{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
const cfg=Object.assign({som:true,voz:true},store.get('thur-cfg',{}));
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
function speak(t){if(!cfg.voz)return;try{const s=window.speechSynthesis;if(!s)return;s.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=.88;u.pitch=1.15;const v=s.getVoices().find(v=>/pt[-_]BR/i.test(v.lang));if(v)u.voice=v;s.speak(u)}catch(e){}}
function party(){const p=$('#party');p.innerHTML='';for(let i=0;i<44;i++){const c=document.createElement('i');c.style.left=Math.random()*100+'vw';c.style.background=COLORS[i%12];c.style.animationDelay=Math.random()*.5+'s';p.appendChild(c)}[660,880,1100].forEach((f,i)=>setTimeout(()=>pop(f),i*120));setTimeout(()=>p.innerHTML='',2500)}
function hop(){$$('.peek').forEach(p=>{p.classList.remove('hop');void p.offsetWidth;p.classList.add('hop')})}
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
  if(rain&&!matchMedia('(prefers-reduced-motion: reduce)').matches){tr.classList.remove('go');void tr.offsetWidth;tr.classList.add('go');setTimeout(swap,330)}else swap();
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
const dbAdd=url=>tx('readwrite',s=>s.add({url,t:Date.now()})).catch(()=>toast('Não deu para guardar na galeria.'));
const dbAll=()=>tx('readonly',s=>s.getAll()).catch(()=>[]);
const dbClear=()=>tx('readwrite',s=>s.clear()).catch(()=>{});
onShow.galeria=async()=>{const all=(await dbAll()||[]).sort((a,b)=>b.t-a.t);const g=$('#artGal');
  g.innerHTML=all.length?all.map(a=>`<button class="card" data-id="${a.id}"><img alt="Arte guardada"></button>`).join(''):'<p class="empty">A galeria ainda está vazia. Termine uma pintura e toque no botão verde para guardar aqui.</p>';
  all.forEach(a=>{const im=g.querySelector(`[data-id="${a.id}"] img`);if(im)im.src=a.url});
  g.onclick=e=>{const c=e.target.closest('.card');if(!c)return;const a=all.find(x=>x.id==c.dataset.id);if(!a)return;$('#viewImg').src=a.url;$('#viewer').classList.add('on');pop(520)}};
$('#viewClose').onclick=()=>$('#viewer').classList.remove('on');
$('#viewSave').onclick=()=>{try{const a=document.createElement('a');a.href=$('#viewImg').src;a.download='arte-turma-do-thur.jpg';document.body.appendChild(a);a.click();a.remove();toast('Imagem salva!')}catch(e){toast('Não deu para salvar aqui.')}};

/* ---------- adesivos ---------- */
function award(){const got=store.get('thur-st',[]);const left=STICKERS.map((_,i)=>i).filter(i=>!got.includes(i));const i=left.length?left[rnd(left.length)]:rnd(STICKERS.length);if(!got.includes(i)){got.push(i);store.set('thur-st',got)}return STICKERS[i]}
onShow.adesivos=()=>{const got=store.get('thur-st',[]);$('#stTitle').textContent=`Meus adesivos (${got.length} de ${STICKERS.length})`;
  $('#album').innerHTML=STICKERS.map((s,i)=>got.includes(i)?`<div class="stk" role="img" aria-label="Adesivo">${s}</div>`:`<div class="stk locked" aria-label="Adesivo ainda não ganho">?</div>`).join('')};
let doneBack=null;
function complete(url,back){
  if(url)dbAdd(url);
  const st=award();
  $('#doneImg').parentElement.style.display=url?'':'none';if(url)$('#doneImg').src=url;
  const d=$('#doneSt');d.textContent=st;d.style.animation='none';void d.offsetWidth;d.style.animation='';
  $('#doneT').textContent=url?'Que lindo! Guardei na galeria e você ganhou um adesivo!':'Muito bem! Você ganhou um adesivo!';
  doneBack=back||null;$('#done').classList.add('on');party();hop();speak(url?'Que lindo! Você ganhou um adesivo!':'Muito bem! Você ganhou um adesivo!');
}
$('#doneOk').onclick=()=>{$('#done').classList.remove('on');pop(520);if(doneBack)doneBack()};
const every=(key,n)=>{const c=store.get(key,0)+1;store.set(key,c);return c%n===0};

/* ---------- menu inicial ---------- */
const ICON={
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
const TILES=[['mundo','Mundinho','#FF9F1C'],['balde','Colorir','#FF4D4D'],['giz','Giz de cera','#9B5DE5'],['desenho','Desenhar','#3D5AFE'],['brilho','Caneta brilhante','#2E2440'],['numeros','Pintar por números','#FF9F1C'],['aquarela','Aquarela','#4FB3F0'],['pixel','Pixel','#21A35A'],['revelar','Revelar','#F25CA2'],['respingo','Respingo','#00A6A6'],['espelho','Espelho','#B8860B'],['letras','Letras','#FFFFFF'],['palavras','Palavras','#FF6F61']];
$('#tiles').innerHTML=TILES.map(([id,t,bg])=>`<button class="tile${lum(bg)>.8?' light':''}" style="background:${bg}" data-tile="${id}"><svg viewBox="0 0 64 64" aria-hidden="true">${ICON[id]}</svg>${t}</button>`).join('');
$('#tiles').onclick=e=>{const b=e.target.closest('[data-tile]');if(!b)return;pop(460);const id=b.dataset.tile;
  if(['balde','giz','respingo','numeros','aquarela'].includes(id))openPicker(id);
  else if(['desenho','brilho','espelho'].includes(id))openTela(id);
  else if(id==='mundo')window.openMundo&&window.openMundo();else if(id==='pixel')show('pixpick');else if(id==='revelar')show('revpick');else show(id)};

/* ---------- escolher desenho ---------- */
const MODE_T={balde:'Colorir',giz:'Giz de cera',respingo:'Respingo',numeros:'Pintar por números',aquarela:'Aquarela'};
let pickMode='balde';
function openPicker(mode){pickMode=mode;$('#pickTitle').textContent=MODE_T[mode];
  const list=SETS[mode].map(n=>({p:PAGES.find(p=>p.n===n),i:PAGES.findIndex(p=>p.n===n)}));
  $('#pickGal').innerHTML=list.map(({p,i})=>`<button class="card" data-p="${i}">${pageSvg(p)}<span>${p.n}</span></button>`).join('');
  show('escolher')}
$('#pickGal').onclick=e=>{const c=e.target.closest('.card');if(!c)return;pop(520);const i=+c.dataset.p;if(pickMode==='aquarela')openTela('aquarela',i);else openSvg(pickMode,i)};

/* ---------- pintar sobre o desenho ---------- */
const NS='http://www.w3.org/2000/svg';
const P={mode:'balde',i:0,color:COLORS[0],num:0,tex:'liso',w:10,hist:[],scrib:null};
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
  if(mode==='numeros'){P.num=0;palette($('#palP'),PLANS[page.n].c,(i)=>{P.num=i},0,true);markNumDone()}
  else palette($('#palP'),COLORS,(i,c)=>{P.color=c},COLORS.indexOf(P.color));
  $('#texRow').style.display=(mode==='balde'||mode==='giz'||mode==='respingo')?'':'none';
  $('#sizeRow').style.display=mode==='giz'?'':'none';
  peek($('#pintar'));show('pintar')}
onShow.pintar=()=>{if(P.needNums){P.needNums=false;addNums(svgEl(),PAGES[P.i]);saveP();markNumDone()}};
function markNumDone(){if(P.mode!=='numeros')return;const s=svgEl();const plan=PLANS[PAGES[P.i].n];plan.c.forEach((_,n)=>{const left=s.querySelectorAll(`.r[data-n="${n}"]:not([data-f])`).length;const b=$(`#palP .sw[data-i="${n}"]`);if(b)b.classList.toggle('gone',left===0)})}
$$('#texRow .tex').forEach(b=>b.onclick=()=>{P.tex=b.dataset.tex;$$('#texRow .tex').forEach(x=>x.classList.toggle('on',x===b));pop(480)});
$$('#sizeRow .psize').forEach(b=>b.onclick=()=>{P.w=+b.dataset.w;$$('#sizeRow .psize').forEach(x=>x.classList.toggle('on',x===b));pop(500)});
const toSvg=(s,e)=>{const p=s.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(s.getScreenCTM().inverse())};
function clipFor(s,a){const id='c'+Date.now().toString(36)+rnd(1e6).toString(36);const cp=document.createElementNS(NS,'clipPath');cp.id=id;const sh=a.cloneNode();sh.removeAttribute('class');sh.removeAttribute('data-n');sh.removeAttribute('data-k');cp.appendChild(sh);s.querySelector('defs').appendChild(cp);
  const g=document.createElementNS(NS,'g');g.setAttribute('clip-path',`url(#${id})`);g.setAttribute('pointer-events','none');
  const ol=a.cloneNode();ol.setAttribute('class','o');ol.setAttribute('fill','none');ol.removeAttribute('data-n');ol.setAttribute('pointer-events','none');a.after(g);g.after(ol);return g}
$('#page').addEventListener('pointerdown',e=>{const s=svgEl();if(!s)return;const el=document.elementFromPoint(e.clientX,e.clientY);const a=el&&el.closest?el.closest('.r'):null;if(!a)return;e.preventDefault();
  if(P.mode==='balde'){const f=paintOf(s,P.color);if(a.getAttribute('fill')===f)return;snap();a.setAttribute('fill',f);saveP();pop(700);return}
  if(P.mode==='numeros'){if(a.dataset.n===undefined||a.dataset.f)return;if(+a.dataset.n!==P.num){a.classList.remove('bad');void a.getBBox();a.classList.add('bad');pop(200);return}
    snap();a.setAttribute('fill',PLANS[PAGES[P.i].n].c[P.num]);a.dataset.f='1';const t=s.querySelector(`.num[data-k="${a.dataset.k}"]`);if(t)t.remove();saveP();pop(720);markNumDone();
    if(!s.querySelector('.r[data-n]:not([data-f])'))setTimeout(finishSvg,500);return}
  const q=toSvg(s,e);
  if(P.mode==='respingo'){snap();const g=clipFor(s,a);const f=paintOf(s,P.color);const c=document.createElementNS(NS,'circle');c.setAttribute('cx',q.x);c.setAttribute('cy',q.y);c.setAttribute('r',0);c.setAttribute('fill',f);g.appendChild(c);
    for(let k=0;k<7;k++){const d=document.createElementNS(NS,'circle');const ang=Math.random()*6.28,dist=30+Math.random()*60;d.setAttribute('cx',(q.x+Math.cos(ang)*dist).toFixed(1));d.setAttribute('cy',(q.y+Math.sin(ang)*dist).toFixed(1));d.setAttribute('r',(5+Math.random()*10).toFixed(1));d.setAttribute('fill',f);g.appendChild(d)}
    splashSound();const t0=performance.now();const step=t=>{const k=Math.max(0,Math.min(1,(t-t0)/520));c.setAttribute('r',(560*(1-Math.pow(1-k,3))).toFixed(1));if(k<1)requestAnimationFrame(step);else saveP()};requestAnimationFrame(step);return}
  /* giz */
  snap();const g=clipFor(s,a);const path=document.createElementNS(NS,'path');const d=`M${q.x.toFixed(1)} ${q.y.toFixed(1)} l0.1 0`;path.setAttribute('d',d);path.setAttribute('fill','none');path.setAttribute('stroke',paintOf(s,P.color));path.setAttribute('stroke-width',P.w);path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');g.appendChild(path);
  P.scrib={s,path,d};try{$('#page').setPointerCapture(e.pointerId)}catch(x){}});
$('#page').addEventListener('pointermove',e=>{const sc=P.scrib;if(!sc)return;evs(e).forEach(ev=>{const q=toSvg(sc.s,ev);sc.d+=` L${q.x.toFixed(1)} ${q.y.toFixed(1)}`});if(!sc.raf)sc.raf=requestAnimationFrame(()=>{sc.raf=0;sc.path.setAttribute('d',sc.d)})});
const pEnd=()=>{if(P.scrib){P.scrib.path.setAttribute('d',P.scrib.d);P.scrib=null;saveP()}};
$('#page').addEventListener('pointerup',pEnd);$('#page').addEventListener('pointercancel',pEnd);
$('#pUndo').onclick=()=>{if(!P.hist.length)return;svgEl().innerHTML=P.hist.pop();saveP();markNumDone();pop(330)};
$('#pClear').onclick=()=>ask('Recomeçar este desenho?',()=>{snap();freshPage();saveP();markNumDone()});
$('#pBack').onclick=()=>{pop(440);openPicker(P.mode)};
$('#pPrint').onclick=()=>{const pr=$('#print');pr.innerHTML=pageSvg(PAGES[P.i]);if(P.mode==='numeros'){pr.style.cssText='display:block;position:fixed;left:-9999px;top:0;width:800px;height:800px';addNums(pr.querySelector('svg'),PAGES[P.i]);pr.style.cssText=''}try{window.print()}catch(e){toast('Abra o app instalado para imprimir.')}};
function svgToUrl(svg,size=900){return new Promise(res=>{const c=svg.cloneNode(true);c.setAttribute('width',size);c.setAttribute('height',size);c.setAttribute('xmlns',NS);c.querySelectorAll('.nums').forEach(n=>n.remove());
  const str=new XMLSerializer().serializeToString(c);const im=new Image();im.onload=()=>{const cv=document.createElement('canvas');cv.width=cv.height=size;const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,size,size);x.drawImage(im,0,0,size,size);res(cv.toDataURL('image/jpeg',.88))};im.onerror=()=>res(null);im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(str)})}
async function finishSvg(){const url=await svgToUrl(svgEl());store.del(pKey());complete(url,()=>openPicker(P.mode))}
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
  $('#tEraser').style.display=(mode==='desenho'||mode==='espelho')?'':'none';$('#tStamp').style.display=mode==='desenho'?'':'none';
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
$('#tBack').onclick=()=>{pop(440);if(T.mode==='aquarela')openPicker('aquarela');else show('home')};
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
  palette($('#palX'),X.d.c,(n)=>{X.sel=n;hl()},0,true);drawPix($('#pxPrev'),X.d,null);markPx();peek($('#pixel'));show('pixel')}
function layoutPx(){const d=X.d;if(!d)return;const r=$('#pxWrap').getBoundingClientRect();const rows=d.g.length,cols=Math.max(...d.g.map(r=>r.length));const cell=Math.max(16,Math.floor(Math.min((r.width-36)/cols,(r.height-36)/rows))-2);
  const gr=$('#pxGrid');gr.style.gridTemplateColumns=`repeat(${cols},${cell}px)`;gr.style.gridAutoRows=cell+'px';gr.style.fontSize=Math.max(10,cell*.45)+'px'}
onShow.pixel=()=>requestAnimationFrame(()=>{layoutPx();hl()});
new ResizeObserver(()=>{if($('#pixel').classList.contains('on'))layoutPx()}).observe($('#pxWrap'));
function hl(){$$('#pxGrid .px[data-n]').forEach(c=>c.classList.toggle('hl',X.hint&&+c.dataset.n===X.sel&&!X.painted.has(+c.dataset.i)));$('#xHint').classList.toggle('on',X.hint)}
function markPx(){X.d.c.forEach((_,n)=>{const left=$$(`#pxGrid .px[data-n="${n}"]`).some(c=>!X.painted.has(+c.dataset.i));const b=$(`#palX .sw[data-i="${n}"]`);if(b)b.classList.toggle('gone',!left)})}
let pxPopT=0;
function paintPx(el,isDown){if(!el||!el.classList.contains('px')||el.dataset.n===undefined)return;const idx=+el.dataset.i;if(X.painted.has(idx))return;
  if(+el.dataset.n!==X.sel){if(isDown){el.classList.remove('bad');void el.offsetWidth;el.classList.add('bad');pop(200)}return}
  X.painted.add(idx);el.style.background=X.d.c[X.sel];el.textContent='';el.classList.remove('hl');
  const now=performance.now();if(now-pxPopT>70){pop(700+rnd(200));pxPopT=now}
  store.set('thur-px-'+X.i,[...X.painted]);markPx();
  if(X.painted.size===$$('#pxGrid .px[data-n]').length){X.down=false;setTimeout(()=>{const c=document.createElement('canvas');c.width=c.height=600;drawPix(c,X.d,null);store.del('thur-px-'+X.i);complete(c.toDataURL('image/jpeg',.9),()=>show('pixpick'))},450)}}
const gridEl=$('#pxGrid');
gridEl.addEventListener('pointerdown',e=>{e.preventDefault();X.down=true;try{gridEl.setPointerCapture(e.pointerId)}catch(x){}paintPx(document.elementFromPoint(e.clientX,e.clientY),true)});
gridEl.addEventListener('pointermove',e=>{if(!X.down)return;evs(e).forEach(ev=>paintPx(document.elementFromPoint(ev.clientX,ev.clientY),false))});
const pxUp=()=>X.down=false;gridEl.addEventListener('pointerup',pxUp);gridEl.addEventListener('pointercancel',pxUp);
$('#xHint').onclick=()=>{X.hint=!X.hint;hl();pop(480)};
$('#xClear').onclick=()=>ask('Recomeçar este desenho?',()=>{store.del('thur-px-'+X.i);openPixel(X.i)});

/* ---------- revelar ---------- */
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
  if(left/tot<.12){R.done=true;rc.style.transition='opacity .6s';rc.style.opacity=0;setTimeout(()=>{const c=document.createElement('canvas');c.width=c.height=720;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,720,720);const im=R.img,s=Math.min(720/im.width,720/im.height);x.drawImage(im,(720-im.width*s)/2,(720-im.height*s)/2,im.width*s,im.height*s);complete(c.toDataURL('image/jpeg',.9),()=>show('revpick'))},700)}}
$('#rAgain').onclick=()=>{pop(330);openReveal(R.i)};

/* ---------- letras ---------- */
let lSet='up',lIdx=0,lColor=COLORS[5],tStroke=null,lDone=false,tFs=200,tW=0,tH=0;
const tcv=$('#tcv'),tctx=tcv.getContext('2d'),mk=document.createElement('canvas'),um=document.createElement('canvas');const K=.25;
palette($('#palL'),COLORS,(i,c)=>lColor=c,5);
const lItems=()=>lSet==='num'?NUMS.map((n,i)=>[String(i),n,'']):LETRAS.map(l=>[lSet==='low'?l[0].toLowerCase():l[0],l[1],l[2]]);
const glyphFont=px=>`800 ${px}px "Baloo 2", "Arial Rounded MT Bold", Arial, sans-serif`;
function setLetter(i){const it=lItems();lIdx=(i+it.length)%it.length;const ch=it[lIdx][0];lDone=false;$('#lStars').innerHTML='';$('#lTitle').textContent=ch;$('#lPic').textContent=it[lIdx][2];$('#lWord').textContent=it[lIdx][1];
  const r=tcv.parentElement.getBoundingClientRect();if(!r.width)return;const d=DPR();tW=r.width;tH=r.height;tcv.width=tW*d;tcv.height=tH*d;tctx.setTransform(d,0,0,d,0,0);
  tFs=Math.min(tH*.9,tW*.85);tctx.fillStyle='#fff';tctx.fillRect(0,0,tW,tH);tctx.font=glyphFont(tFs);tctx.textAlign='center';tctx.textBaseline='middle';const y=tH/2+tFs*.06;
  tctx.fillStyle='#EFE8FA';tctx.fillText(ch,tW/2,y);tctx.setLineDash([2,14]);tctx.lineCap='round';tctx.lineWidth=6;tctx.strokeStyle='#B9A6E8';tctx.strokeText(ch,tW/2,y);tctx.setLineDash([]);
  for(const c of[mk,um]){c.width=Math.ceil(tW*K);c.height=Math.ceil(tH*K)}const m=mk.getContext('2d');m.font=glyphFont(tFs*K);m.textAlign='center';m.textBaseline='middle';m.fillStyle='#000';m.fillText(ch,mk.width/2,y*K)}
function tLine(c,p,from,w,k){c.lineCap='round';c.lineJoin='round';c.lineWidth=w*k;c.beginPath();const a=Math.max(0,from-1);c.moveTo(p[a][0]*k,p[a][1]*k);if(p.length===1)c.lineTo(p[0][0]*k+.1,p[0][1]*k);for(let i=a+1;i<p.length;i++)c.lineTo(p[i][0]*k,p[i][1]*k);c.stroke()}
const lPt=e=>{const r=tcv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
function lDraw(from){const w=tFs*.12;tctx.strokeStyle=lColor;tLine(tctx,tStroke,from,w,1);const u=um.getContext('2d');u.strokeStyle='#000';tLine(u,tStroke,from,w,K)}
tcv.addEventListener('pointerdown',e=>{e.preventDefault();tcv.setPointerCapture(e.pointerId);tStroke=[lPt(e)];lDraw(0);lDrawn=1});
let lDrawn=0,lRaf=0;
tcv.addEventListener('pointermove',e=>{if(!tStroke)return;evs(e).forEach(ev=>tStroke.push(lPt(ev)));if(!lRaf)lRaf=requestAnimationFrame(()=>{lRaf=0;if(tStroke){lDraw(lDrawn);lDrawn=tStroke.length}})});
const lEnd=()=>{if(!tStroke)return;if(lDrawn<tStroke.length)lDraw(lDrawn);tStroke=null;lCheck()};tcv.addEventListener('pointerup',lEnd);tcv.addEventListener('pointercancel',lEnd);
function lCheck(){if(lDone||!mk.width)return;const a=mk.getContext('2d').getImageData(0,0,mk.width,mk.height).data,b=um.getContext('2d').getImageData(0,0,um.width,um.height).data;let L=0,both=0,U=0;
  for(let i=3;i<a.length;i+=4){const l=a[i]>100,u=b[i]>100;if(l)L++;if(u)U++;if(l&&u)both++}
  if(L&&both/L>.55&&both/U>.33){lDone=true;$('#lStars').innerHTML='<svg viewBox="0 0 100 100" width="55%" height="55%" aria-hidden="true"><polygon points="50,8 61,38 93,38 67,57 77,89 50,70 23,89 33,57 7,38 39,38" fill="#FFD60A" stroke="#2E2440" stroke-width="3" stroke-linejoin="round" opacity=".9"/></svg>';party();const it=lItems()[lIdx];speak('Muito bem! '+(lSet==='num'?it[1]:it[0].toUpperCase()+' de '+it[1]));
    if(every('thur-cnt-l',3))setTimeout(()=>complete(null,null),1600)}}
function sayLetter(){const it=lItems()[lIdx];speak(lSet==='num'?it[1]:it[0].toUpperCase()+', de '+it[1])}
$('#lNext').onclick=()=>{pop(520);setLetter(lIdx+1);sayLetter()};$('#lPrev').onclick=()=>{pop(520);setLetter(lIdx-1);sayLetter()};
$('#lClear').onclick=()=>{pop(330);setLetter(lIdx)};$('#lSay').onclick=sayLetter;
$$('.lset').forEach(b=>b.onclick=()=>{lSet=b.dataset.set;$$('.lset').forEach(x=>x.classList.toggle('on',x===b));pop(480);setLetter(0);sayLetter()});
onShow.letras=()=>requestAnimationFrame(()=>setLetter(lIdx));
new ResizeObserver(()=>{if($('#letras').classList.contains('on')&&!tStroke)setLetter(lIdx)}).observe(tcv.parentElement);

/* ---------- palavras ---------- */
let word=null,wQueue=[],wHint=store.get('thur-dica',true),slots=[];
$('#wHint').classList.toggle('on',wHint);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
function newWord(){if(!wQueue.length)wQueue=shuffle(PALAVRAS.slice());word=wQueue.pop();slots=Array(word[0].length).fill(null);const L=word[0].split('').map((c,i)=>({c,i}));let n=0;do{shuffle(L);n++}while(L.map(l=>l.c).join('')===word[0]&&n<20);
  $('#wPic').textContent=word[1];$('#ltiles').innerHTML=L.map(l=>`<button class="lt" data-t="${l.i}" aria-label="Letra ${l.c}">${l.c}</button>`).join('');renderSlots();setTimeout(()=>speak(word[0].toLowerCase()),350)}
function renderSlots(){$('#slots').innerHTML=slots.map((t,i)=>{const c=t===null?(wHint?word[0][i]:''):word[0][t];return`<button class="slot${t!==null?' full':''}" data-s="${i}" aria-label="Espaço ${i+1}">${c}</button>`}).join('')}
$('#ltiles').onclick=e=>{const b=e.target.closest('.lt');if(!b||b.classList.contains('used'))return;const k=slots.indexOf(null);if(k<0)return;const t=+b.dataset.t;slots[k]=t;b.classList.add('used');speak(word[0][t].toLowerCase());pop(640);renderSlots();if(!slots.includes(null))wCheck()};
$('#slots').onclick=e=>{const s=e.target.closest('.slot');if(!s)return;const i=+s.dataset.s,t=slots[i];if(t===null)return;slots[i]=null;$(`.lt[data-t="${t}"]`).classList.remove('used');pop(380);renderSlots()};
function wCheck(){const got=slots.map(t=>word[0][t]).join('');if(got===word[0]){$$('.slot').forEach(s=>s.classList.add('ok'));party();speak(word[0].toLowerCase()+'! Muito bem!');if(every('thur-cnt-w',3))setTimeout(()=>complete(null,newWord),1500);else setTimeout(newWord,2600)}
  else{const box=$('#slots');box.classList.add('shake');pop(200);setTimeout(()=>{box.classList.remove('shake');slots.forEach((t,i)=>{if(t!==null&&word[0][t]!==word[0][i]){$(`.lt[data-t="${t}"]`).classList.remove('used');slots[i]=null}});renderSlots()},450)}}
$('#wSay').onclick=()=>{if(word)speak(word[0].toLowerCase())};$('#wNext').onclick=()=>{pop(520);newWord()};
$('#wHint').onclick=()=>{wHint=!wHint;store.set('thur-dica',wHint);$('#wHint').classList.toggle('on',wHint);renderSlots();pop(480)};
onShow.palavras=()=>{if(!word)newWord()};

/* ---------- para os pais ---------- */
onShow.pais=()=>{$('#panel').hidden=true;$('#gate').hidden=false;const a=3+rnd(7),b=3+rnd(7),ok=a+b;$('#gq').textContent=`${a} + ${b}`;
  const opts=shuffle([ok,ok+1+rnd(3),Math.max(2,ok-1-rnd(3))]);$('#gopts').innerHTML=opts.map(v=>`<button class="gnum" data-v="${v}">${v}</button>`).join('');
  $('#gopts').onclick=e=>{const b2=e.target.closest('.gnum');if(!b2)return;if(+b2.dataset.v===ok){$('#gate').hidden=true;$('#panel').hidden=false}else{pop(200);onShow.pais()}}};
$('#cfgSom').checked=cfg.som;$('#cfgVoz').checked=cfg.voz;
$('#cfgSom').onchange=e=>{cfg.som=e.target.checked;store.set('thur-cfg',cfg)};$('#cfgVoz').onchange=e=>{cfg.voz=e.target.checked;store.set('thur-cfg',cfg)};
$('#clrArt').onclick=()=>ask('Apagar todas as artes da galeria?',()=>{dbClear();toast('Galeria apagada.')});
$('#clrSt').onclick=()=>ask('Zerar todos os adesivos?',()=>{store.del('thur-st');toast('Adesivos zerados.')});
$('#clrWip').onclick=()=>ask('Apagar as pinturas em andamento?',()=>{try{Object.keys(localStorage).filter(k=>/^thur-(s|t|px)-/.test(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}toast('Pinturas em andamento apagadas.')});

window.TH={$,$$,show,pop,speak,party,hop,actx,cfg,rnd,onShow,splashSound};
/* ---------- início ---------- */
{const h=location.hash.slice(1);show(['galeria','adesivos','letras','palavras','pixpick','revpick'].includes(h)?h:'home',false)}
try{speechSynthesis.getVoices()}catch(e){}
if('serviceWorker' in navigator){try{navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}}
}
