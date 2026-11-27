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
window.LER={keys:()=>UN.flatMap((_,u)=>[0,1,2,3].map(li=>'ler:'+u+':'+li))};

/* ---------- progresso, ofensiva (dias seguidos) e XP ---------- */
const prog=()=>LS.get('thur-ler',{done:{},xp:0});
const hoje=(d=new Date())=>d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
function streak(){const D=LS.get('thur-ler-dias',{d:'',n:0});const ont=hoje(new Date(Date.now()-864e5));return D.d===hoje()||D.d===ont?D.n:0}
function bumpStreak(){const D=LS.get('thur-ler-dias',{d:'',n:0});if(D.d===hoje())return D.n;D.n=D.d===hoje(new Date(Date.now()-864e5))?D.n+1:1;D.d=hoje();LS.set('thur-ler-dias',D);return D.n}
const prevOf=(u,li)=>li>0?u+'-'+(li-1):u>0?(u-1)+'-3':null;
const isOpen=(u,li,P)=>{const p=prevOf(u,li);return!p||!!P.done[p]};

/* ---------- desenhos ---------- */
const SPK='<svg viewBox="0 0 32 32"><path d="M5 12h5l7-6v20l-7-6H5z" fill="#fff"/><path d="M21 11a6 6 0 0 1 0 10M24 7a11 11 0 0 1 0 18" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
const MIC='<svg viewBox="0 0 32 32"><rect x="11" y="3" width="10" height="17" rx="5" fill="#fff"/><path d="M7 15a9 9 0 0 0 18 0M16 24v5M11 29h10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
const LOCK='<svg viewBox="0 0 32 32"><rect x="7" y="14" width="18" height="14" rx="4" fill="#AFAFAF"/><path d="M11 14v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#AFAFAF" stroke-width="3.5"/></svg>';
const CHEST=(open)=>`<svg viewBox="0 0 32 32"><rect x="4" y="14" width="24" height="14" rx="3" fill="#C97B2A" stroke="#7A4510" stroke-width="2"/>${open?'<path d="M4 14l3-9h18l3 9z" fill="#E09A45" stroke="#7A4510" stroke-width="2"/><circle cx="12" cy="11" r="2.5" fill="#FFD60A"/><circle cx="19" cy="10" r="2.5" fill="#FFD60A"/>':'<path d="M4 14q12-10 24 0z" fill="#E09A45" stroke="#7A4510" stroke-width="2"/>'}<rect x="14" y="16" width="4" height="6" rx="1" fill="#FFD60A" stroke="#7A4510" stroke-width="1.5"/></svg>`;
function nodeIco(u,li,done,open){if(!open)return LOCK;if(li===3)return CHEST(done);
  const t=u===0?['🔊','🐝','A🐝'][li]:['🔊',UN[u][1][0]+'A','Aa'][li];
  if(li===0)return SPK;return`<span class="lnt">${t}</span>`}

/* ---------- trilha ---------- */
let pet=pick(['zuzu','lelo','pituca','bubu']);
function renderPath(){const P=prog();let h='',k=0,cur=null;
  h+=`<div class="lhello"><img src="${PIMG('dupla')}" alt="Professora Clara e Professor Lois"><div class="lbub">Oi! Nós somos a <b>Professora Clara</b> e o <b>Professor Lois</b>. Vamos aprender a ler juntos?</div></div>`;
  UN.forEach(([n,ls,c,d],u)=>{h+=`<div class="lunit" style="--uc:${c};--ud:${d}"><div><b>Unidade ${u+1}</b><span>${n}</span><em>${ls.join(' ')}</em></div><img class="luprof" src="${PIMG(PROF[profDe(u)].base[0])}" alt=""></div><div class="lnodes">`;
    NODES(u).forEach((nm,li)=>{const id=u+'-'+li,done=!!P.done[id],open=done||isOpen(u,li,P);if(open&&!done&&!cur)cur=id;const x=Math.round(Math.sin(k*1.15)*72);k++;const me=id===cur;
      h+=`<div class="lnw" style="transform:translateX(${x}px)">${me?'<div class="lgo">COMEÇAR</div>':''}<button class="lnode${done?' done':''}${open?'':' lock'}${me?' cur':''}${li===3?' chest':''}" style="--uc:${c};--ud:${d}" data-u="${u}" data-li="${li}" aria-label="${nm}">${nodeIco(u,li,done,open)}${done&&li<3?'<i class="lck">✓</i>':''}</button>${me?`<img class="lpet prof" src="${PIMG(PROF[profDe(u)].oi)}" alt="${PROF[profDe(u)].n}">`:''}</div>`});
    h+='</div>'});
  h+='<div class="lfim">🏆 Você vai ler muitas palavras!</div>';
  $('#lerPath').innerHTML=h;
  $('#lerStat').innerHTML=`<span class="lsb fire">🔥 ${streak()}</span><span class="lsb xp">⚡ ${P.xp}</span>`;
  requestAnimationFrame(()=>{const c=$('#lerPath .lnode.cur');if(c)c.scrollIntoView({block:'center'})})}
$('#lerPath').onclick=e=>{const b=e.target.closest('.lnode');if(!b)return;const u=+b.dataset.u,li=+b.dataset.li;
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
function start(u,li){Object.assign(S,{T:profDe(u),u,li,q:PLAN(u)[li].map(t=>mk(fix(t,u),u)),done:0,err:0,combo:0,xp0:prog().xp});S.total=S.q.length;S.state='';$('#lcBody').innerHTML='';foot('','','VERIFICAR',true);bar();show('licao');setTimeout(()=>{S.pose=PROF[S.T].oi;speak(li===3?'Hora do baú! Vamos revisar tudo!':u===0?'Vamos aprender o som das vogais!':`Vamos aprender o som do ${UN[u][1][0]} e do ${UN[u][1][1]}!`,S.T);$('#lcBody').innerHTML=`<div class="lcend"><img class="lcpf big" src="${PIMG(li===3?'dupla':PROF[S.T].oi)}" alt=""><h2 class="lcintro">${li===3?'Clara e Lois':PROF[S.T].n}</h2></div>`;setTimeout(next,2200)},380)}
const bar=()=>{$('#lcBar').style.width=Math.round(S.done/S.total*100)+'%'};
const foot=(cls,msg,btn,dis)=>{const f=$('#lcFoot');f.className=cls||'';$('#lcMsg').innerHTML=msg||'';const b=$('#lcBtn');b.textContent=btn;b.disabled=!!dis};
function next(){bar();if(!S.q.length){finish();return}S.ex=S.q.shift();S.sel=null;S.state='ask';S.fill=[];S.tries=0;render();foot('','', 'VERIFICAR',true)}
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
  if(S.state!=='ask')return;const x=S.ex,b=e.target.closest('.lco,#lcMic,#lcSkip');if(!b)return;
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
function finish(){const perf=S.err===0,xp=10+(perf?5:0)+(S.li===3?10:0),stars=S.li===3?10:3;S.gain={xp,stars};S.state='fim';
  const n=streak()+(LS.get('thur-ler-dias',{d:''}).d===hoje()?0:1);
  $('#lcBody').innerHTML=`<div class="lcend">${S.li===3?`<div class="lcchest">${CHEST(true)}</div>`:''}<img class="lcpf big" src="${PIMG(S.li===3?'dupla':PROF[S.T].viva)}" alt=""><h2>${S.li===3?'Baú aberto!':'Lição completa!'}</h2>
    <div class="lccards"><div class="lcc xp"><b>XP</b><span>⚡ ${xp}</span></div><div class="lcc st"><b>Estrelas</b><span>⭐ ${stars}</span></div><div class="lcc ac"><b>${perf?'Perfeito':'Acertos'}</b><span>🎯 ${Math.round(S.total/(S.total+S.err)*100)}%</span></div></div>
    <div class="lcstreak">🔥 ${n} ${n===1?'dia':'dias'} seguidos aprendendo!</div></div>`;
  foot('','', 'CONTINUAR');bar();party();speak(perf?'Perfeito! Você não errou nenhuma!':'Lição completa! Muito bem!',S.T)}
function collect(){const P=prog();P.done[S.u+'-'+S.li]=1;P.xp+=S.gain.xp;LS.set('thur-ler',P);LS.set('thur-estrelas',LS.get('thur-estrelas',0)+S.gain.stars);bumpStreak();
  S.state='';complete(null,()=>show('ler'),'ler:'+S.u+':'+S.li)}
$('#lcX').onclick=()=>{pop(380);if(S.state==='fim'){collect();return}TH.ask?TH.ask('Sair da lição? Você vai perder o progresso desta lição.',()=>show('ler')):show('ler')};
document.addEventListener('thur-fala',e=>{const d=e.detail||{};$$('#licao .lcpf,#ler .lpet.prof').forEach(i=>i.classList.toggle('talk',!!d.on&&(d.who==='clara'||d.who==='lois')))});
})();

