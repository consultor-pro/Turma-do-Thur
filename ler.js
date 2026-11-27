/* ---------- Aprender a ler: trilha no estilo Duolingo (som das letras → sílabas → palavras → falar) ---------- */
(()=>{const TH=window.TH;const {$,$$,show,pop,speak,party,rnd,onShow,complete}=TH;
const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
const pick=a=>a[rnd(a.length)];
const VOG=['A','E','I','O','U'],ACC={A:'á',E:'é',I:'í',O:'ó',U:'ú'};
/* cada letra: palavra-chave, figura e o som do começo (a voz do celular fala melhor a sílaba do que o som sozinho) */
const LET={A:['abelha','🐝','a'],E:['elefante','🐘','é'],I:['ilha','🏝️','i'],O:['ovo','🥚','ó'],U:['uva','🍇','u'],P:['pato','🦆','pá'],B:['bola','⚽','bó'],M:['macaco','🐒','má'],T:['tomate','🍅','tó'],D:['dado','🎲','dá'],L:['lua','🌙','lú'],F:['foca','🦭','fó'],V:['vaca','🐄','vá'],N:['navio','🚢','ná'],S:['sapo','🐸','sá'],C:['casa','🏠','cá'],G:['gato','🐱','gá'],R:['rato','🐭','rá'],J:['jacaré','🐊','já'],X:['xícara','☕','xí'],Z:['zebra','🦓','zé']};
const MAIS={A:[['avião','✈️'],['abacaxi','🍍']],E:[['estrela','⭐']],I:[['igreja','⛪']],O:[['olho','👁️'],['ônibus','🚌']],U:[['urso','🐻'],['unicórnio','🦄']],P:[['pipoca','🍿'],['pera','🍐']],B:[['banana','🍌'],['bolo','🎂']],M:[['maçã','🍎'],['moto','🏍️']],T:[['tartaruga','🐢'],['tigre','🐯']],D:[['dinossauro','🦕']],L:[['leão','🦁'],['limão','🍋']],F:[['fada','🧚'],['flor','🌸']],V:[['vela','🕯️']],N:[['nuvem','☁️']],S:[['sol','☀️'],['sorvete','🍦']],C:[['cavalo','🐴'],['coelho','🐰']],G:[['galinha','🐔']],R:[['rosa','🌹'],['relógio','⏰']],J:[['joaninha','🐞']]};
const pics=l=>[LET[l].slice(0,2),...(MAIS[l]||[])];
const somDe=l=>`${LET[l][2]}... ${LET[l][0]}`;
const fam=c=>(c==='C'?['A','O']:c==='G'?['A','O','U']:VOG).map(v=>c+v);
const silSay=s=>/[ÁÉÍÓÚÂÊÔÃÕ]/.test(s)?s.toLowerCase():s.slice(0,-1).toLowerCase()+(ACC[s.slice(-1)]||s.slice(-1).toLowerCase());
const PAL=[['bola','BO-LA','⚽'],['bolo','BO-LO','🎂'],['casa','CA-SA','🏠'],['pato','PA-TO','🦆'],['gato','GA-TO','🐱'],['sapo','SA-PO','🐸'],['vaca','VA-CA','🐄'],['dado','DA-DO','🎲'],['mala','MA-LA','🧳'],['lua','LU-A','🌙'],['uva','U-VA','🍇'],['ovo','O-VO','🥚'],['pipoca','PI-PO-CA','🍿'],['macaco','MA-CA-CO','🐒'],['tomate','TO-MA-TE','🍅'],['foca','FO-CA','🦭'],['rato','RA-TO','🐭'],['sapato','SA-PA-TO','👞'],['banana','BA-NA-NA','🍌'],['cavalo','CA-VA-LO','🐴'],['jacaré','JA-CA-RÉ','🐊'],['moto','MO-TO','🏍️'],['mapa','MA-PA','🗺️'],['fada','FA-DA','🧚'],['copo','CO-PO','🥤'],['pipa','PI-PA','🪁'],['bebê','BE-BÊ','👶'],['sofá','SO-FÁ','🛋️'],['vela','VE-LA','🕯️'],['lata','LA-TA','🥫'],['bota','BO-TA','👢'],['navio','NA-VI-O','🚢'],['xícara','XÍ-CA-RA','☕'],['suco','SU-CO','🧃'],['cama','CA-MA','🛏️'],['lixo','LI-XO','🗑️'],['roda','RO-DA','🛞'],['fogo','FO-GO','🔥'],['boca','BO-CA','👄'],['panela','PA-NE-LA','🍳'],['galo','GA-LO','🐓'],['boneca','BO-NE-CA','🪆'],['janela','JA-NE-LA','🪟'],['zero','ZE-RO','0️⃣'],['dedo','DE-DO','☝️'],['tatu','TA-TU','🦔']].filter(w=>w[0]!=='tatu');
const cons=w=>[...new Set(w[1].replace(/[^A-Z]/g,'').split('').filter(c=>!VOG.includes(c)))];
const UN=[['Vogais',['A','E','I','O','U'],'#58CC02','#46A302'],['P e B',['P','B'],'#1CB0F6','#1899D6'],['M e T',['M','T'],'#FF9600','#E08600'],['D e L',['D','L'],'#CE82FF','#A568CC'],['F e V',['F','V'],'#FF4B4B','#D63F3F'],['N e S',['N','S'],'#2EC4B6','#22A094'],['C e G',['C','G'],'#FFC800','#E0AF00'],['R e J',['R','J'],'#FF86D0','#D96FB0'],['X e Z',['X','Z'],'#7B61FF','#6450D6']];
const NODES=u=>u===0?['Sons','Figuras','Pares','Baú']:['Sons','Sílabas','Palavras','Baú'];
const known=u=>UN.slice(0,u+1).flatMap(x=>x[1]);
const words=u=>{const K=new Set(known(u));return PAL.filter(w=>cons(w).every(c=>K.has(c)))};
const focusW=u=>{const F=UN[u][1],all=words(u),f=all.filter(w=>cons(w).some(c=>F.includes(c)));return f.length?f:all};
const silPool=u=>[...VOG,...known(u).filter(c=>!VOG.includes(c)).flatMap(fam)];
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
/* professores: Clara (unidades ímpares) e Lois (pares) — cada um com a sua voz e as suas poses */
const PROF={clara:{n:'Professora Clara',base:['c-ponteiro','c-ideia','c-lousa','c-quadro','c-acolhe'],oi:'c-acolhe',viva:'c-pulando',ops:'c-ideia',fala:'c-acolhe',mesa:'c-mesa'},
  lois:{n:'Professor Lois',base:['l-ponteiro','l-mostra','l-ideia','l-quadro','l-livro'],oi:'l-mostra',viva:'l-pulando',ops:'l-pensando',fala:'l-mostra',mesa:'l-joinha'}};
const profDe=u=>u%2===0?'clara':'lois';
const PIMG=p=>`img/prof/${p}.webp`;
/* ---------- degraus por idade: 1 Primeiras palavras (2–3), 2 Primeiras letras (3–4), 3 Aprender a ler (4–6) ---------- */
const DEGS=[{n:'Primeiras palavras',e:'🐣',id:'2 a 3 anos'},{n:'Primeiras letras',e:'🐥',id:'3 a 4 anos'},{n:'Aprender a ler',e:'🦉',id:'4 a 6 anos'}];
const FEMW=new Set(['vaca','galinha','ovelha','maçã','banana','uva','cenoura','melancia','bola','cama','casa','boca','orelha','mão','bolinha','estrela','abelha','ilha','igreja','pipa']);
const oa=w=>FEMW.has(w)?'a':'o';
const B1={bichos:[['gato','🐱'],['cachorro','🐶'],['vaca','🐄'],['pato','🦆'],['galinha','🐔'],['porco','🐷'],['cavalo','🐴'],['ovelha','🐑'],['leão','🦁'],['sapo','🐸']],
  comidas:[['maçã','🍎'],['banana','🍌'],['uva','🍇'],['bolo','🎂'],['pão','🍞'],['leite','🥛'],['ovo','🥚'],['cenoura','🥕'],['melancia','🍉'],['morango','🍓']],
  coisas:[['bola','⚽'],['carro','🚗'],['ursinho','🧸'],['balão','🎈'],['trem','🚂'],['avião','✈️'],['sapato','👟'],['livro','📖'],['cama','🛏️'],['casa','🏠']],
  sons:[['cachorro','🐶','au au'],['gato','🐱','miau'],['vaca','🐄','muuuu'],['pato','🦆','quá quá'],['galinha','🐔','có có có'],['porco','🐷','óinc óinc'],['ovelha','🐑','méééé'],['leão','🦁','rooaar'],['sapo','🐸','croac croac'],['cavalo','🐴','iiirrrí']],
  cores:[['vermelho','#FF4B4B'],['azul','#1CB0F6'],['amarelo','#FFD60A'],['verde','#58CC02'],['rosa','#FF86D0'],['laranja','#FF9600']],
  corpo:[['olho','👁️'],['nariz','👃'],['boca','👄'],['orelha','👂'],['mão','✋'],['pé','🦶']],
  formas:[['bolinha'],['quadrado'],['triângulo'],['estrela'],['coração']]};
const E1=[['Bichos','bichos','#58CC02','#46A302'],['Comidas','comidas','#FF9600','#E08600'],['Brinquedos','coisas','#1CB0F6','#1899D6'],['Sons dos bichos','sons','#CE82FF','#A568CC'],['Cores','cores','#FF4B4B','#D63F3F'],['Corpo','corpo','#2EC4B6','#22A094'],['Formas','formas','#FFC800','#E0AF00']];
const itemsOf=k=>B1[k].map(([w,x,s])=>k==='cores'?{w,c:x}:k==='formas'?{w,f:w}:{w,e:x,s});
const FORMA={bolinha:'<circle cx="50" cy="50" r="42"/>',quadrado:'<rect x="10" y="10" width="80" height="80" rx="6"/>',triângulo:'<path d="M50 8 L94 90 H6 Z"/>',estrela:'<path d="M50 6l12 28 30 3-23 20 7 30-26-16-26 16 7-30-23-20 30-3z"/>',coração:'<path d="M50 90C10 62 4 36 22 22c12-9 24-2 28 8 4-10 16-17 28-8 18 14 12 40-28 68z"/>'};
const FCOR={bolinha:'#1CB0F6',quadrado:'#FF9600',triângulo:'#58CC02',estrela:'#FFD60A',coração:'#FF4B4B'};
const artOf=it=>it.c?`<svg viewBox="0 0 100 100" class="lcart"><circle cx="50" cy="50" r="44" fill="${it.c}" stroke="#2E2440" stroke-width="5"/></svg>`:it.f?`<svg viewBox="0 0 100 100" class="lcart"><g fill="${FCOR[it.f]}" stroke="#2E2440" stroke-width="5" stroke-linejoin="round">${FORMA[it.f]}</g></svg>`:`<span class="lcemo">${it.e}</span>`;
const LETX={H:['hipopótamo','🦛'],K:['kiwi','🥝'],Q:['queijo','🧀'],W:['waffle','🧇'],Y:['yakisoba','🍜']};
const picL=l=>LET[l]?LET[l].slice(0,2):LETX[l]||['','⭐'];
const NOMEL={A:'a',B:'bê',C:'cê',D:'dê',E:'é',F:'éfe',G:'gê',H:'agá',I:'i',J:'jota',K:'cá',L:'éle',M:'ême',N:'ene',O:'ó',P:'pê',Q:'quê',R:'érre',S:'ésse',T:'tê',U:'u',V:'vê',W:'dáblio',X:'xis',Y:'ípsilon',Z:'zê'};
const nomeKid=()=>((TH.cfg&&TH.cfg.nome)||'Thur');
const nomeLetras=()=>[...new Set(nomeKid().normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase().replace(/[^A-Z]/g,''))].slice(0,8);
const RIMAS=[['gato','🐱','pato','🦆'],['mão','✋','pão','🍞'],['leão','🦁','limão','🍋'],['rato','🐭','sapato','👞'],['janela','🪟','panela','🍳'],['pé','🦶','café','☕'],['bota','👢','gota','💧'],['anel','💍','pincel','🖌️'],['bolo','🎂','tijolo','🧱'],['cama','🛏️','pijama','🩳']];
const PALMAS=[['sol','☀️',['SOL']],['pão','🍞',['PÃO']],['flor','🌸',['FLOR']],['bola','⚽',['BO','LA']],['gato','🐱',['GA','TO']],['casa','🏠',['CA','SA']],['uva','🍇',['U','VA']],['banana','🍌',['BA','NA','NA']],['macaco','🐒',['MA','CA','CO']],['sapato','👞',['SA','PA','TO']]];
const E2=[['Vogais A E I','vog','#58CC02','#46A302',['A','E','I']],['Vogais O U','vog','#1CB0F6','#1899D6',['O','U']],['Meu nome','nome','#FF86D0','#D96FB0'],['Rimas','rima','#FF9600','#E08600'],['Palmas','palmas','#CE82FF','#A568CC']];
const unitsOf=d=>d===0?E1:d===1?E2:UN;
const nodesOf=(d,u)=>d===2?NODES(u):['Conhecer','Cadê?','Brincar','Baú'];
const pk=(d,u,li)=>d===2?u+'-'+li:`d${d+1}:${u}-${li}`;
const stk=(d,u,li)=>d===2?'ler:'+u+':'+li:`ler${d+1}:${u}:${li}`;
const unitTag=(d,u)=>{const U=unitsOf(d)[u];if(d===2)return U[1].join(' ');if(d===0)return itemsOf(U[1]).slice(0,3).map(it=>it.e||(it.c?'🎨':'🔷')).join('');return U[1]==='vog'?U[4].join(' '):U[1]==='nome'?nomeLetras().join(''):U[1]==='rima'?'🐱🦆':'👏👏'};
const degAtual=()=>{const s=LS.get('thur-ler-deg',null);if(s!==null)return s;const i=String((TH.cfg&&TH.cfg.idade)||'2');return i==='2'?0:i==='3'?1:2};
window.LER={keys:()=>[0,1,2].flatMap(d=>unitsOf(d).flatMap((_,u)=>[0,1,2,3].map(li=>stk(d,u,li)))),setDeg:d=>LS.set('thur-ler-deg',d)};

/* ---------- progresso, ofensiva (dias seguidos) e XP ---------- */
const prog=()=>LS.get('thur-ler',{done:{},xp:0});
const hoje=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function streak(){const D=LS.get('thur-ler-dias',{d:'',n:0});const ont=hoje(new Date(Date.now()-864e5));return D.d===hoje()||D.d===ont?D.n:0}
function bumpStreak(){const D=LS.get('thur-ler-dias',{d:'',n:0});if(D.d===hoje())return D.n;D.n=D.d===hoje(new Date(Date.now()-864e5))?D.n+1:1;D.d=hoje();LS.set('thur-ler-dias',D);return D.n}
const prevOf=(d,u,li)=>li>0?pk(d,u,li-1):u>0?pk(d,u-1,3):null;
const isOpen=(d,u,li,P)=>{const p=prevOf(d,u,li);return!p||!!P.done[p]};

/* ---------- desenhos ---------- */
const SPK='<svg viewBox="0 0 32 32"><path d="M5 12h5l7-6v20l-7-6H5z" fill="#fff"/><path d="M21 11a6 6 0 0 1 0 10M24 7a11 11 0 0 1 0 18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
const MIC='<svg viewBox="0 0 32 32"><rect x="11" y="3" width="10" height="17" rx="5" fill="#fff"/><path d="M7 15a9 9 0 0 0 18 0M16 24v5M11 29h10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
const LOCK='<svg viewBox="0 0 32 32"><rect x="7" y="14" width="18" height="14" rx="4" fill="#AFAFAF"/><path d="M11 14v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#AFAFAF" stroke-width="3.5"/></svg>';
const CHEST=(open)=>`<svg viewBox="0 0 32 32"><rect x="4" y="14" width="24" height="14" rx="3" fill="#C97B2A" stroke="#7A4510" stroke-width="2"/>${open?'<path d="M4 14l3-9h18l3 9z" fill="#E09A45" stroke="#7A4510" stroke-width="2"/><circle cx="12" cy="11" r="2.5" fill="#FFD60A"/><circle cx="19" cy="10" r="2.5" fill="#FFD60A"/>':'<path d="M4 14q12-10 24 0z" fill="#E09A45" stroke="#7A4510" stroke-width="2"/>'}<rect x="14" y="16" width="4" height="6" rx="1" fill="#FFD60A" stroke="#7A4510" stroke-width="1.5"/></svg>`;
function nodeIco(d,u,li,done,open){if(!open)return LOCK;if(li===3)return CHEST(done);
  const t=d<2?['👀','❓','⭐'][li]:u===0?['🔊','🐝','A🐝'][li]:['🔊',UN[u][1][0]+'A','Aa'][li];
  if(li===0&&d===2)return SPK;return`<span class="lnt">${t}</span>`}

/* ---------- trilha ---------- */
let pet=pick(['zuzu','lelo','pituca','bubu']);
const HELLO=['Vamos conhecer as primeiras palavras?','Vamos conhecer as letras?','Vamos aprender a ler juntos?'];
function renderPath(){const P=prog(),D=degAtual();let h='',k=0,cur=null;
  h+=`<div class="ldegs">${DEGS.map((g,i)=>`<button class="ldeg${i===D?' on':''}" data-d="${i}"><span>${g.e}</span><b>${g.n}</b><small>${g.id}</small></button>`).join('')}</div>`;
  h+=`<div class="lhello"><img src="${PIMG('dupla')}" alt="Professora Clara e Professor Lois"><div class="lbub">Oi! Nós somos a <b>Professora Clara</b> e o <b>Professor Lois</b>. ${HELLO[D]}</div></div>`;
  unitsOf(D).forEach(([n,_,c,dd],u)=>{const d=dd;h+=`<div class="lunit" style="--uc:${c};--ud:${d}"><div><b>Unidade ${u+1}</b><span>${n}</span><em>${unitTag(D,u)}</em></div><img class="luprof" src="${PIMG(PROF[profDe(u)].base[0])}" alt=""></div><div class="lnodes">`;
    nodesOf(D,u).forEach((nm,li)=>{const id=pk(D,u,li),done=!!P.done[id],open=done||isOpen(D,u,li,P);if(open&&!done&&!cur)cur=id;const x=Math.round(Math.sin(k*1.15)*72);k++;const me=id===cur;
      h+=`<div class="lnw" style="transform:translateX(${x}px)">${me?'<div class="lgo">COMEÇAR</div>':''}<button class="lnode${done?' done':''}${open?'':' lock'}${me?' cur':''}${li===3?' chest':''}" style="--uc:${c};--ud:${d}" data-u="${u}" data-li="${li}" aria-label="${nm}">${nodeIco(D,u,li,done,open)}${done&&li<3?'<i class="lck">✓</i>':''}</button>${me?`<img class="lpet prof" src="${PIMG(PROF[profDe(u)].oi)}" alt="${PROF[profDe(u)].n}">`:''}</div>`});
    h+='</div>'});
  h+=`<div class="lfim">${D<2?`🏆 Depois vem: ${DEGS[D+1].e} ${DEGS[D+1].n}`:'🏆 Você vai ler muitas palavras!'}</div>`;
  $('#lerPath').innerHTML=h;
  $('#lerStat').innerHTML=`<span class="lsb fire">🔥 ${streak()}</span><span class="lsb xp">⚡ ${P.xp}</span>`;
  requestAnimationFrame(()=>{const c=$('#lerPath .lnode.cur');if(c)c.scrollIntoView({block:'center'})})}
$('#lerPath').onclick=e=>{const g=e.target.closest('.ldeg');if(g){pop(560);LS.set('thur-ler-deg',+g.dataset.d);renderPath();speak(DEGS[+g.dataset.d].n+'!','clara');return}
  const b=e.target.closest('.lnode');if(!b)return;const u=+b.dataset.u,li=+b.dataset.li;
  if(b.classList.contains('lock')){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');pop(200);speak('Termine a lição de antes primeiro!');return}
  pop(640);start(u,li)};
onShow.ler=()=>{renderPath();const P=prog();speak(Object.keys(P.done).length?'Que bom te ver de novo! Vamos continuar?':'Oi! Eu sou a professora Clara. E este é o professor Lois. Vamos aprender a ler!','clara')};

/* ---------- exercícios ---------- */
const PLAN=u=>u===0?[['som','som','fig','som','fig','pares','fig','som'],['fig','som','fig','pares','som','fig','som','fig'],['pares','som','fig','pares','som','fig','pares','som'],['som','fig','pares','som','fig','pares','som','fig','pares','som']]
  :[['som','fig','som','fig','pares','som','fig','som'],['sil','sil','completa','sil','pares','sil','completa','fig'],['montar','completa','montar','sil','falar','montar','completa','montar'],['som','sil','fig','montar','completa','pares','sil','falar','montar','fig']];
function fix(t,u){if(['montar','completa','falar'].includes(t)&&!focusW(u).length)return u?'sil':'som';if(t==='falar'&&!SR)return'montar';return t}
const others=(x,pool,n)=>shuf([...new Set(pool)].filter(y=>y!==x)).slice(0,n);
function mk(t,u){const F=UN[u][1],K=known(u),tgt=()=>Math.random()<.75?pick(F):pick(K);
  if(t==='som'){const l=tgt();return{t,l,opts:shuf([l,...others(l,K,2)])}}
  if(t==='fig'){const l=tgt();const p=pick(pics(l));const wrong=others(l,Object.keys(LET).filter(x=>x[0]!==l),2).map(x=>pick(pics(x)));return{t,l,ans:p[0],opts:shuf([p,...wrong])}}
  if(t==='pares'){const ls=[...new Set([...shuf(F),...shuf(K)])].slice(0,4);return{t,ls:shuf(ls),ps:shuf(ls)}}
  if(t==='sil'){const c=pick(F.filter(x=>!VOG.includes(x)));const fs=fam(c),s=pick(fs);return{t,s,opts:shuf([s,...others(s,[...fs,...silPool(u).filter(x=>x.length>1)],2)])}}
  const w=pick(focusW(u)),sy=w[1].split('-');
  if(t==='montar'){const ex=others(null,silPool(u).filter(s=>!sy.includes(s)),sy.length>2?1:2);return{t,w,sy,tiles:shuf([...sy,...ex])}}
  if(t==='completa'){const i=rnd(sy.length);return{t,w,sy,i,opts:shuf([sy[i],...others(sy[i],silPool(u).filter(s=>!sy.includes(s)),2)])}}
  return{t:'falar',w,sy}}

const S={};window.LER.S=S;
function planE(d,u,li){if(d===0)return[['ver','ver','ver','ver'],['ver','cade','cade','cade'],['cade','cade','cade','cade'],['cade','cade','cade','cade','cade']][li];
  const k=E2[u][1];
  if(k==='rima')return[['verR','verR','verR'],['verR','rima','rima','rima'],['rima','rima','rima','rima'],['rima','rima','rima','rima','rima']][li];
  if(k==='palmas')return[['verP','verP','palmas'],['verP','palmas','palmas','palmas'],['palmas','palmas','palmas','palmas'],['palmas','palmas','palmas','palmas','palmas']][li];
  const f=k==='nome'?'cadeL':'fig2';return[['verL','verL','verL'],['verL','cadeL','cadeL',f],['cadeL',f,'cadeL',f],['cadeL',f,'cadeL',f,'cadeL']][li]}
const introE=(d,u)=>d===0?`Vamos conhecer: ${E1[u][0]}!`:E2[u][1]==='vog'?'Vamos conhecer as vogais!':E2[u][1]==='nome'?`Vamos conhecer as letras do nome ${nomeKid()}!`:E2[u][1]==='rima'?'Vamos brincar de rimas!':'Vamos bater palmas com as palavras!';
/* pega sem repetir dentro da lição */
function pickU(arr,key){const k=x=>key?key(x):JSON.stringify(x);let f=arr.filter(x=>!S.used.has(k(x)));if(!f.length){arr.forEach(x=>S.used.delete(k(x)));f=arr}const x=pick(f);S.used.add(k(x));return x}
function mkE(t,d,u,li){
  if(d===0){const uu=li===3?rnd(u+1):u,kind=E1[uu][1],its=itemsOf(kind);const it=pickU(its,x=>x.w);
    if(t==='ver')return{t,it,kind};const o=pick(its.filter(x=>x.w!==it.w));return{t,it,kind,ans:it.w,opts:shuf([it,o])}}
  const k=E2[u][1];
  if(k==='vog'||k==='nome'){const L=k==='nome'?nomeLetras():li===3?[...new Set(E2.slice(0,u+1).filter(x=>x[1]==='vog').flatMap(x=>x[4]))]:E2[u][4];const l=pickU(L);
    if(t==='verL')return{t,l};
    if(t==='cadeL'){const o=pick((L.length>1?L:VOG).filter(x=>x!==l));return{t,l,ans:l,opts:shuf([l,o])}}
    const p=LET[l]?pick(pics(l)):picL(l);const ol=pick(Object.keys(LET).filter(x=>x!==l&&x[0]!==l)),op=pick(pics(ol));return{t,l,ans:p[0],opts:shuf([p,op])}}
  if(k==='rima'){const r=pickU(RIMAS,x=>x[0]);if(t==='verR')return{t,r};const o=pick(RIMAS.filter(x=>x!==r));const op=Math.random()<.5?[o[0],o[1]]:[o[2],o[3]];return{t,r,ans:r[2],opts:shuf([[r[2],r[3]],op])}}
  const p=pickU(PALMAS,x=>x[0]);return{t,p}}
const sylSay=s=>silSay(s);
function renderE(){const x=S.ex,B=$('#lcBody');let q='',h='',say='';S.pose=pick(PROF[S.T].base);
  if(x.t==='ver'){const it=x.it;q=x.kind==='sons'?`${oa(it.w)==='a'?'A':'O'} ${it.w} faz ${it.s}!`:`${oa(it.w)==='a'?'Esta é a':'Este é o'} ${it.w}!`;say=q;h=`<button class="lcverb" data-say="${x.kind==='sons'?it.s:it.w}">${artOf(it)}<span class="lctap">👆</span></button>`}
  else if(x.t==='cade'){const it=x.it;q=x.kind==='sons'?`Quem faz ${it.s}?`:`Cadê ${oa(it.w)} ${it.w}?`;say=q;h=`<button class="lcspk" data-say="${q}" aria-label="Ouvir de novo">${SPK}</button><div class="lcopts e2">${x.opts.map(o=>`<button class="lco e" data-v="${o.w}">${artOf(o)}</button>`).join('')}</div>`}
  else if(x.t==='verL'){const [w,e]=picL(x.l);q=`${x.l} de ${w}!`;say=`${NOMEL[x.l]}! ${NOMEL[x.l]} de ${w}!`;h=`<button class="lcverb" data-say="${say}"><span class="lcbigl">${x.l}<small>${x.l.toLowerCase()}</small></span><span class="lcemo">${e}</span><span class="lctap">👆</span></button>`}
  else if(x.t==='cadeL'){q=`Cadê a letra ${x.l}?`;say=`Cadê a letra ${NOMEL[x.l]}?`;h=`<button class="lcspk" data-say="${say}" aria-label="Ouvir de novo">${SPK}</button><div class="lcopts e2">${x.opts.map(o=>`<button class="lco e let" data-v="${o}">${o}</button>`).join('')}</div>`}
  else if(x.t==='fig2'){q=`Qual começa com ${x.l}?`;say=`Qual começa com ${NOMEL[x.l]}?`;h=`<div class="lcfig"><span class="lcbigl">${x.l}</span><button class="lcspk" data-say="${say}" aria-label="Ouvir de novo">${SPK}</button></div><div class="lcopts e2">${x.opts.map(o=>`<button class="lco e" data-v="${o[0]}" data-say="${o[0]}"><span class="lcemo">${o[1]}</span></button>`).join('')}</div>`}
  else if(x.t==='verR'){const r=x.r;q=`${r[0]} e ${r[2]}: rima!`;say=`${r[0]}... ${r[2]}! Rima!`;h=`<button class="lcverb" data-say="${say}"><span class="lcemo">${r[1]}</span><span class="lcemo">${r[3]}</span><span class="lctap">👆</span></button>`}
  else if(x.t==='rima'){const r=x.r;q=`O que rima com ${r[0]}?`;say=q;h=`<div class="lcfig"><span class="lcemo">${r[1]}</span><button class="lcspk" data-say="${q}" aria-label="Ouvir de novo">${SPK}</button></div><div class="lcopts e2">${x.opts.map(o=>`<button class="lco e" data-v="${o[0]}" data-say="${o[0]}"><span class="lcemo">${o[1]}</span></button>`).join('')}</div>`}
  else{const [w,e,sy]=x.p,n=sy.length;q=x.t==='verP'?`${w}: ${n} ${n>1?'palmas':'palma'}!`:`Bata palmas: ${w}!`;say=x.t==='verP'?`Vamos bater palmas: ${w}!`:`Bata no tambor: ${w}!`;
    h=`<div class="lcfig"><span class="lcemo">${e}</span><button class="lcspk" data-say="${sy.map(sylSay).join('... ')}" aria-label="Ouvir">${SPK}</button></div><div class="lcdots">${sy.map((s,i)=>`<span class="lcdot" data-i="${i}">${s}</span>`).join('')}</div><button class="lcdrum" id="lcDrum" aria-label="Bater palma">👏</button>`}
  B.innerHTML=prof(q)+h;B.classList.remove('in');void B.offsetWidth;B.classList.add('in');sayL(say);
  if(x.t==='verP')setTimeout(()=>demoPalmas(),1900)}
function demoPalmas(){const x=S.ex;if(S.state!=='ask'||!x||x.t!=='verP')return;x.p[2].forEach((s,i)=>setTimeout(()=>{if(S.ex!==x)return;const d=$(`.lcdot[data-i="${i}"]`);if(d)d.classList.add('on');pop(700+i*120);speak(sylSay(s),S.T,true);const dr=$('#lcDrum');if(dr)dr.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:300});if(i===x.p[2].length-1)setTimeout(()=>{if(S.ex===x)okE()},1100)},i*800))}
function okE(){const x=S.ex;S.state='fb';S.done++;bar();setPose(PROF[S.T].viva);[880,1100,1320].forEach((f,i)=>setTimeout(()=>pop(f),i*110));
  const v=pick(['Muito bem!','Isso!','Parabéns!','Que lindo!','Uhuu!']);
  const w=x.t==='cade'?(x.kind==='sons'?x.it.w:x.it.w):x.t==='cadeL'?NOMEL[x.l]:x.t==='fig2'?x.ans:x.t==='rima'?`${x.r[0]}... ${x.r[2]}`:x.t==='palmas'?x.p[0]:'';
  if(!['ver','verL','verR','verP'].includes(x.t))speak(`${v} ${w}!`,S.T);window.helperCheer&&window.helperCheer();setTimeout(next,['ver','verL','verR'].includes(x.t)?1500:2100)}
function tapE(e){const x=S.ex;
  if(['ver','verL','verR','verP'].includes(x.t)){const b=e.target.closest('.lcverb,#lcDrum');if(!b)return;if(x.t==='verP'){demoPalmas();return}
    speak(b.dataset.say,S.T);pop(700);b.animate([{transform:'scale(1)'},{transform:'scale(1.12) rotate(-3deg)'},{transform:'scale(1)'}],{duration:450});if(!S.tapped){S.tapped=1;setTimeout(okE,1300)}return}
  if(x.t==='palmas'){const b=e.target.closest('#lcDrum');if(!b)return;const n=x.p[2].length;if(S.taps>=n)return;const i=S.taps++;$(`.lcdot[data-i="${i}"]`).classList.add('on');speak(sylSay(x.p[2][i]),S.T);pop(700+i*140);
    b.animate([{transform:'scale(1)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:280});if(S.taps===n)setTimeout(okE,700);return}
  const b=e.target.closest('.lco');if(!b||b.classList.contains('ok'))return;
  if(b.dataset.v===x.ans){b.classList.add('ok');okE();return}
  /* errou: sem bronca — mostra a certa piscando e espera tocar nela */
  if(!S.miss){S.miss=1;S.err++}b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');pop(300);
  if(b.dataset.say)speak(b.dataset.say,S.T);
  const ok=[...$$('#lcBody .lco')].find(o=>o.dataset.v===x.ans);if(ok){ok.classList.remove('hint');void ok.offsetWidth;ok.classList.add('hint')}
  setPose(PROF[S.T].ops,1600);
  setTimeout(()=>{if(S.ex!==x||S.state!=='ask')return;speak(x.t==='cade'?(x.kind==='sons'?`Olha: quem faz ${x.it.s} é ${oa(x.it.w)} ${x.it.w}!`:`Olha ${oa(x.it.w)} ${x.it.w} aqui!`):x.t==='cadeL'?`Olha a letra ${NOMEL[x.l]} aqui!`:x.t==='fig2'?`${x.ans} começa com ${NOMEL[x.l]}!`:`${x.r[0]}... ${x.r[2]}! Rima!`,S.T)},b.dataset.say?900:100)}
function start(u,li){const d=degAtual(),easy=d<2;Object.assign(S,{d,easy,T:profDe(u),u,li,used:new Set(),done:0,err:0,combo:0,xp0:prog().xp});S.q=easy?planE(d,u,li).map(t=>mkE(t,d,u,li)):PLAN(u)[li].map(t=>mk(fix(t,u),u));S.total=S.q.length;S.state='';$('#licao').classList.toggle('easy',easy);$('#licao').classList.remove('fimon');$('#lcBody').innerHTML='';foot('','','VERIFICAR',true);bar();show('licao');setTimeout(()=>{S.pose=PROF[S.T].oi;speak(li===3?'Hora do baú! Vamos brincar com tudo!':easy?introE(d,u):u===0?'Vamos aprender o som das vogais!':`Vamos aprender o som do ${UN[u][1][0]} e do ${UN[u][1][1]}!`,S.T);$('#lcBody').innerHTML=`<div class="lcend"><img class="lcpf big" src="${PIMG(li===3?'dupla':PROF[S.T].oi)}" alt=""><h2 class="lcintro">${li===3?'Clara e Lois':PROF[S.T].n}</h2></div>`;setTimeout(next,2200)},380)}
const bar=()=>{$('#lcBar').style.width=Math.round(S.done/S.total*100)+'%'};
const foot=(cls,msg,btn,dis)=>{const f=$('#lcFoot');f.className=cls||'';$('#lcMsg').innerHTML=msg||'';const b=$('#lcBtn');b.textContent=btn;b.disabled=!!dis};
function next(){bar();if(!S.q.length){finish();return}S.ex=S.q.shift();S.sel=null;S.state='ask';S.fill=[];S.tries=0;S.miss=0;S.tapped=0;S.taps=0;if(S.easy){renderE();return}render();foot('','', 'VERIFICAR',true)}
const big=(e,say)=>`<div class="lcfig"><span class="lcemo">${e}</span><button class="lcspk" data-say="${say}" aria-label="Ouvir de novo">${SPK}</button></div>`;
const prof=q=>`<div class="lcprof"><img class="lcpf" id="lcPf" src="${PIMG(S.pose)}" alt="${PROF[S.T].n}"><div class="lcbub">${q}</div></div>`;
function setPose(p,ms){S.pose=p;const i=$('#lcPf');if(!i)return;i.src=PIMG(p);i.animate([{transform:'scale(.9) translateY(6px)'},{transform:'scale(1.06) translateY(-6px)'},{transform:'scale(1)'}],{duration:420});if(ms){clearTimeout(setPose.t);setPose.t=setTimeout(()=>{if(S.state==='ask')setPose(pick(PROF[S.T].base))},ms)}}
function render(){const x=S.ex,B=$('#lcBody');let h='';S.pose=x.t==='falar'?PROF[S.T].fala:pick(PROF[S.T].base);
  if(x.t==='som'){h=`<h3 class="lcq">Que letra faz esse som?</h3>${big(LET[x.l][1],somDe(x.l))}<div class="lcopts">${x.opts.map(o=>`<button class="lco let" data-v="${o}">${o}</button>`).join('')}</div>`;sayL(somDe(x.l))}
  else if(x.t==='fig'){h=`<h3 class="lcq">Qual figura começa com esse som?</h3><div class="lcfig"><span class="lcbigl">${x.l}<small>${x.l.toLowerCase()}</small></span><button class="lcspk" data-say="${LET[x.l][2]}" aria-label="Ouvir o som">${SPK}</button></div><div class="lcopts">${x.opts.map(o=>`<button class="lco pic" data-v="${o[0]}" data-say="${o[0]}">${o[1]}</button>`).join('')}</div>`;sayL(`Qual começa com ${LET[x.l][2]}?`)}
  else if(x.t==='pares'){h=`<h3 class="lcq">Junte cada letra com a figura</h3><div class="lcpairs"><div>${x.ls.map(l=>`<button class="lco let pl" data-l="${l}">${l}</button>`).join('')}</div><div>${x.ps.map(l=>`<button class="lco pic pp" data-l="${l}">${LET[l][1]}</button>`).join('')}</div></div>`;S.pl=null;S.ok=0;sayL('Junte cada letra com a figura!')}
  else if(x.t==='sil'){h=`<h3 class="lcq">Toque na sílaba que você ouviu</h3><div class="lcfig"><button class="lcspk huge" data-say="${silSay(x.s)}" aria-label="Ouvir">${SPK}</button></div><div class="lcopts">${x.opts.map(o=>`<button class="lco syl" data-v="${o}">${o}</button>`).join('')}</div>`;sayL(silSay(x.s))}
  else if(x.t==='montar'){h=`<h3 class="lcq">Monte a palavra</h3>${big(x.w[2],x.w[0])}<div class="lcans" id="lcAns"></div><div class="lcopts" id="lcTiles">${x.tiles.map((s,i)=>`<button class="lco syl" data-i="${i}">${s}</button>`).join('')}</div>`;sayL(x.w[0])}
  else if(x.t==='completa'){h=`<h3 class="lcq">Qual sílaba está faltando?</h3>${big(x.w[2],x.w[0])}<div class="lcans">${x.sy.map((s,i)=>`<span class="lcsy${i===x.i?' gap':''}" ${i===x.i?'id="lcGap"':''}>${i===x.i?'?':s}</span>`).join('')}</div><div class="lcopts">${x.opts.map(o=>`<button class="lco syl" data-v="${o}">${o}</button>`).join('')}</div>`;sayL(x.w[0])}
  else if(x.t==='falar'){h=`<h3 class="lcq">Fale a palavra bem alto</h3>${big(x.w[2],x.w[0])}<div class="lcans">${x.sy.map(s=>`<span class="lcsy">${s}</span>`).join('')}</div><button class="lcmic" id="lcMic" aria-label="Falar">${MIC}</button><div class="lcmst" id="lcMst">Toque no microfone e fale</div><button class="lcskip" id="lcSkip">Agora não posso falar</button>`;sayL(`Fale comigo: ${x.w[0]}!`)}
  h=h.replace(/<h3 class="lcq">(.*?)<\/h3>/,(m,q)=>prof(q));B.innerHTML=h;B.classList.remove('in');void B.offsetWidth;B.classList.add('in')}
const sayL=t=>setTimeout(()=>speak(t,S.T),250);
function renderAns(){const x=S.ex;$('#lcAns').innerHTML=S.fill.map((i,k)=>`<button class="lco syl in" data-k="${k}">${x.tiles[i]}</button>`).join('')||'<span class="lcline"></span>';
  $$('#lcTiles .lco').forEach(b=>b.classList.toggle('used',S.fill.includes(+b.dataset.i)));$('#lcBtn').disabled=!S.fill.length}
$('#lcBody').onclick=e=>{const sp=e.target.closest('.lcspk');if(sp){pop(500);speak(sp.dataset.say,S.T);return}
  if(S.state!=='ask')return;if(S.easy){tapE(e);return}const x=S.ex,b=e.target.closest('.lco,#lcMic,#lcSkip');if(!b)return;
  if(x.t==='pares'){pairTap(b);return}
  if(x.t==='montar'){if(b.dataset.k!==undefined){S.fill.splice(+b.dataset.k,1);pop(380)}else if(b.dataset.i!==undefined&&!b.classList.contains('used')){S.fill.push(+b.dataset.i);speak(silSay(x.tiles[+b.dataset.i]),S.T);pop(640)}renderAns();return}
  if(x.t==='falar'){if(b.id==='lcSkip'){S.q=S.q.filter(()=>true);S.done++;S.state='fb';foot('ok','Tudo bem! Vamos continuar.','CONTINUAR');return}if(b.id==='lcMic')listen();return}
  $$('#lcBody .lco').forEach(o=>o.classList.toggle('sel',o===b));S.sel=b.dataset.v;pop(560);
  if(x.t==='fig')speak(b.dataset.say,S.T);
  if(x.t==='completa'){const g=$('#lcGap');g.textContent=S.sel;g.classList.add('fill')}
  $('#lcBtn').disabled=false};
function pairTap(b){const x=S.ex;if(b.classList.contains('ok'))return;
  if(b.classList.contains('pl')){$$('.pl').forEach(o=>o.classList.toggle('sel',o===b));S.pl=b.dataset.l;speak(LET[S.pl][2],S.T);pop(560);return}
  if(!S.pl){speak(LET[b.dataset.l][0],S.T);return}
  const L=$(`.pl[data-l="${S.pl}"]`);if(b.dataset.l===S.pl){L.classList.remove('sel');L.classList.add('ok');b.classList.add('ok');speak(somDe(S.pl),S.T);pop(880);S.pl=null;if(++S.ok===x.ls.length)setTimeout(()=>result(true),500)}
  else{[L,b].forEach(o=>{o.classList.remove('shake','sel');void o.offsetWidth;o.classList.add('shake','bad');setTimeout(()=>o.classList.remove('bad'),500)});S.pl=null;pop(200);S.pairErr=1}}
function check(){const x=S.ex;let ok,ans;
  if(x.t==='som'){ok=S.sel===x.l;ans=x.l}
  else if(x.t==='fig'){ok=S.sel===x.ans;ans=x.opts.find(o=>o[0]===x.ans)[1]+' '+x.ans}
  else if(x.t==='sil'){ok=S.sel===x.s;ans=x.s}
  else if(x.t==='montar'){ok=S.fill.map(i=>x.tiles[i]).join('-')===x.sy.join('-');ans=x.sy.join(' · ')}
  else if(x.t==='completa'){ok=S.sel===x.sy[x.i];ans=x.sy[x.i];if(!ok){const g=$('#lcGap');g.textContent=ans}}
  result(ok,ans)}
const VIVA=['Muito bem!','Isso aí!','Excelente!','Arrasou!','Perfeito!','Você é demais!'];
function result(ok,ans){const x=S.ex;S.state='fb';
  if(ok){S.done++;S.combo++;const v=pick(VIVA);const extra=S.combo>=3&&S.combo%3===0?`<span class="lcombo">🔥 ${S.combo} seguidas!</span>`:'';
    foot('ok',`<b>${v}</b>${extra}`,'CONTINUAR');setPose(PROF[S.T].viva);pop(880);setTimeout(()=>pop(1180),110);
    speak(x.t==='montar'||x.t==='completa'||x.t==='falar'?`${x.w[1].split('-').map(silSay).join('... ')}... ${x.w[0]}! ${v}`:x.t==='pares'?v:v,S.T);window.helperCheer&&window.helperCheer()}
  else{S.err++;S.combo=0;S.q.push(x);setPose(PROF[S.T].ops);foot('bad',`<b>Quase!</b><span>Resposta certa: ${ans}</span>`,'CONTINUAR');pop(200);
    speak('Quase! '+(x.t==='som'?'Esse é o '+x.l+': '+somDe(x.l):x.t==='sil'?'É '+silSay(x.s):x.t==='fig'?'É '+x.ans:'É '+x.w[0]),S.T)}
  bar()}
$('#lcBtn').onclick=()=>{if(S.state==='ask')check();else if(S.state==='fb')next();else if(S.state==='fim')collect()};

/* ---------- falar (reconhecimento de voz do celular) ---------- */
const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z]/g,'');
function lev(a,b){const m=[...Array(b.length+1).keys()];for(let i=1;i<=a.length;i++){let p=m[0];m[0]=i;for(let j=1;j<=b.length;j++){const t=m[j];m[j]=Math.min(m[j]+1,m[j-1]+1,p+(a[i-1]===b[j-1]?0:1));p=t}}return m[b.length]}
function listen(){const x=S.ex,mic=$('#lcMic'),st=$('#lcMst');if(!SR||mic.classList.contains('on'))return;try{speechSynthesis.cancel()}catch(e){}
  let r;try{r=new SR()}catch(e){return}r.lang='pt-BR';r.maxAlternatives=5;r.interimResults=false;let fim=false;
  const end=(ok,heard)=>{if(fim)return;fim=true;mic.classList.remove('on');if(S.state!=='ask')return;
    if(ok){result(true);return}S.tries++;
    if(S.tries>=3){S.done++;S.state='fb';foot('ok','<b>Boa tentativa!</b><span>Vamos treinar mais depois.</span>','CONTINUAR');speak('Boa tentativa! '+x.w[0],S.T);bar();return}
    setPose(PROF[S.T].ops,1800);st.textContent=heard?`Ouvi "${heard}". Tente de novo!`:'Não ouvi nada. Tente de novo!';speak('Tente de novo: '+x.w[0],S.T)};
  r.onresult=e=>{const t=norm(x.w[0]),alts=[...e.results[0]].map(a=>a.transcript);end(alts.some(a=>{const n=norm(a);return n.includes(t)||lev(n,t)<=(t.length>4?2:1)}),alts[0]||'')};
  r.onerror=()=>end(false,'');r.onend=()=>end(false,'');
  mic.classList.add('on');st.textContent='Pode falar…';try{r.start()}catch(e){end(false,'')}}

/* ---------- fim da lição: XP, estrelas, ofensiva e adesivo ---------- */
function finish(){const perf=S.err===0,xp=S.easy?5+(S.li===3?5:0):10+(perf?5:0)+(S.li===3?10:0),stars=S.easy?(S.li===3?5:2):S.li===3?10:3;S.gain={xp,stars};S.state='fim';$('#licao').classList.add('fimon');
  const n=streak()+(LS.get('thur-ler-dias',{d:''}).d===hoje()?0:1);
  $('#lcBody').innerHTML=`<div class="lcend">${S.li===3?`<div class="lcchest">${CHEST(true)}</div>`:''}<img class="lcpf big" src="${PIMG(S.li===3?'dupla':PROF[S.T].viva)}" alt=""><h2>${S.li===3?'Baú aberto!':'Lição completa!'}</h2>
    <div class="lccards"><div class="lcc xp"><b>XP</b><span>⚡ ${xp}</span></div><div class="lcc st"><b>Estrelas</b><span>⭐ ${stars}</span></div>${S.easy?'':`<div class="lcc ac"><b>${perf?'Perfeito':'Acertos'}</b><span>🎯 ${Math.round(S.total/(S.total+S.err)*100)}%</span></div>`}</div>
    <div class="lcstreak">🔥 ${n} ${n===1?'dia':'dias'} seguidos aprendendo!</div></div>`;
  foot('','', 'CONTINUAR');bar();party();speak(S.easy?'Parabéns! Você é muito esperto!':perf?'Perfeito! Você não errou nenhuma!':'Lição completa! Muito bem!',S.T)}
function collect(){const P=prog();P.done[pk(S.d,S.u,S.li)]=1;
  /* terminou o último baú do degrau: sobe para o próximo */
  if(S.d<2&&S.li===3&&S.u===unitsOf(S.d).length-1&&degAtual()===S.d){const g=DEGS[S.d+1];LS.set('thur-ler-deg',S.d+1);setTimeout(()=>{TH.toast&&TH.toast('Subiu de degrau: '+g.e+' '+g.n+'!');speak('Uau! Agora você vai para: '+g.n+'!','clara')},2600)}P.xp+=S.gain.xp;LS.set('thur-ler',P);LS.set('thur-estrelas',LS.get('thur-estrelas',0)+S.gain.stars);bumpStreak();
  S.state='';complete(null,()=>show('ler'),stk(S.d,S.u,S.li))}
$('#lcX').onclick=()=>{pop(380);if(S.state==='fim'){collect();return}TH.ask?TH.ask('Sair da lição? Você vai perder o progresso desta lição.',()=>show('ler')):show('ler')};
document.addEventListener('thur-fala',e=>{const d=e.detail||{};$$('#licao .lcpf,#ler .lpet.prof').forEach(i=>i.classList.toggle('talk',!!d.on&&(d.who==='clara'||d.who==='lois')))});
})();

