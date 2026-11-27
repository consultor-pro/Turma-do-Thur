/* ---------- Histórias: vídeos, livros e quadrinhos da Turma do Thur (com editor para criar) ---------- */
(()=>{const TH=window.TH;const {$,$$,show,pop,speak,party,rnd,onShow,toast,ask}=TH;
const LS={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Date.now().toString(36)+rnd(1e6).toString(36);

/* personagens: Thur, Bolelecos e professores (todas as poses que já existem no app) */
const THP=['acenando','andando','apontando','bravo','cantando','correndo','costas','deitado','joinha','pensando','pulando','sentado','surpreso'];
const PETP={zuzu:['feliz','pulando','correndo','amor','joinha','cantando','pensando','surpreso','espiando','bravo','sentado','deitado','costas'],lelo:['feliz','pulando','correndo','amor','joinha','cantando','pensando','surpreso','chorando','bravo','sentado','deitado','costas'],pituca:['feliz','pulando','acenando','amor','cantando','pensando','surpreso','sentado','costas'],bubu:['feliz','espirro','pensando','surpreso','chorando','bravo','sentado','deitado','costas']};
const PRP=['c-acolhe','c-ponteiro','c-ideia','c-pulando','c-mesa','c-globo','c-lousa','c-quadro','l-mostra','l-ponteiro','l-ideia','l-pulando','l-pensando','l-joinha','l-livro','l-quadro','dupla'];
const CHARS={Thur:THP.map(p=>'img/thur/'+p+'.webp'),Bolelecos:Object.entries(PETP).flatMap(([n,ps])=>ps.map(p=>`img/poses/${n}-${p}.webp`)),Professores:PRP.map(p=>'img/prof/'+p+'.webp')};
const SCENES=[['img/mundo/parque.jpg','Parque'],['img/mundo/quarto.jpg','Quarto'],['img/mundo/cozinha.jpg','Cozinha'],['img/bg-parque.jpg','Jardim'],['img/bg-quarto.jpg','Casa'],['#BDE6FF','Céu'],['#FFF4D2','Amarelo'],['#FFE3F0','Rosa'],['#E5F9DD','Verde'],['#FFFFFF','Branco']];
const WHO=[['narr','Narrador'],['thur','Thur'],['zuzu','Zuzu'],['lelo','Lelo'],['pituca','Pituca'],['bubu','Bubu'],['clara','Clara'],['lois','Lois']];
const whoOf=src=>/thur\//.test(src)?'thur':/poses\/(\w+)-/.test(src)?src.match(/poses\/(\w+)-/)[1]:/prof\/l-/.test(src)?'lois':'clara';

/* ---------- histórias que já vêm no app ---------- */
const C=(src,x,y,s,f)=>({k:'img',src,x,y,s,f:f?1:0});
const B=(who,txt,x,y,tail)=>({k:'bal',who,txt,x,y,tail:tail||'e'});
const P='img/mundo/parque.jpg',Q='img/mundo/quarto.jpg',K='img/mundo/cozinha.jpg';
const PRONTAS=[
 {id:'livro-parque',tipo:'livro',t:'Thur e Lelo no parque',pags:[
  {lay:1,txt:'Era um dia de sol. O Thur foi ao parque com o Lelo.',pn:[{bg:P,it:[C('img/thur/acenando.webp',32,96,70),C('img/poses/lelo-feliz.webp',70,96,38)]}]},
  {lay:1,txt:'Eles correram muito pela grama verde.',pn:[{bg:P,it:[C('img/thur/correndo.webp',36,96,68),C('img/poses/lelo-correndo.webp',72,96,38)]}]},
  {lay:1,txt:'Cadê a Pituca? perguntou o Thur.',pn:[{bg:P,it:[C('img/thur/pensando.webp',35,96,70),C('img/poses/lelo-pensando.webp',72,96,38)]}]},
  {lay:1,txt:'A Pituca estava escondida atrás da árvore!',pn:[{bg:P,it:[C('img/thur/surpreso.webp',30,96,68),C('img/poses/pituca-acenando.webp',72,92,40)]}]},
  {lay:1,txt:'Todos pularam de alegria. Fim!',pn:[{bg:P,it:[C('img/thur/pulando.webp',45,96,72),C('img/poses/lelo-pulando.webp',18,96,36),C('img/poses/pituca-pulando.webp',80,96,36)]}]}]},
 {id:'livro-escola',tipo:'livro',t:'A primeira aula',pags:[
  {lay:1,txt:'Hoje é dia de aula! A professora Clara chegou.',pn:[{bg:'#FFF4D2',it:[C('img/prof/c-acolhe.webp',50,96,82)]}]},
  {lay:1,txt:'Ela escreveu a letra A no quadro. A de abelha!',pn:[{bg:'#FFF4D2',it:[C('img/prof/c-quadro.webp',50,96,80)]}]},
  {lay:1,txt:'O professor Lois teve uma ideia: vamos contar até três!',pn:[{bg:'#E5F9DD',it:[C('img/prof/l-ideia.webp',50,96,80)]}]},
  {lay:1,txt:'Um, dois, três! O Thur e o Zuzu contaram juntos.',pn:[{bg:'#E5F9DD',it:[C('img/thur/joinha.webp',35,96,72),C('img/poses/zuzu-joinha.webp',72,96,40)]}]},
  {lay:1,txt:'Que aula divertida! Até amanhã!',pn:[{bg:'#BDE6FF',it:[C('img/prof/dupla.webp',50,96,84)]}]}]},
 {id:'hq-bola',tipo:'hq',t:'Cadê a bola?',pags:[
  {lay:4,pn:[{bg:Q,it:[C('img/thur/pensando.webp',40,98,80),B('thur','Cadê a minha bola?',62,18,'e')]},
             {bg:Q,it:[C('img/poses/zuzu-espiando.webp',50,98,55),B('zuzu','Eu não vi!',50,16,'e')]},
             {bg:K,it:[C('img/poses/bubu-espirro.webp',45,98,55),B('bubu','Atchim!',62,16,'e')]},
             {bg:P,it:[C('img/poses/lelo-joinha.webp',45,98,55),B('lelo','Está aqui no parque!',55,16,'e')]}]},
  {lay:2,pn:[{bg:P,it:[C('img/thur/correndo.webp',30,98,85),C('img/poses/lelo-feliz.webp',72,98,45),B('thur','Oba! Vamos brincar!',58,16,'e')]},
             {bg:P,it:[C('img/thur/pulando.webp',50,98,85),C('img/poses/zuzu-pulando.webp',16,98,40),C('img/poses/pituca-pulando.webp',84,98,40),C('img/poses/bubu-feliz.webp',30,98,32),B('narr','E todos brincaram juntos. Fim!',30,12)]}]}]},
 {id:'hq-espirro',tipo:'hq',t:'O espirro do Bubu',pags:[
  {lay:4,pn:[{bg:K,it:[C('img/poses/bubu-pensando.webp',45,98,58),B('bubu','Que cheiro é esse?',58,16,'e')]},
             {bg:K,it:[C('img/poses/bubu-espirro.webp',50,98,60),B('narr','ATCHIM!!!',50,14)]},
             {bg:K,it:[C('img/thur/surpreso.webp',40,98,82),B('thur','Saúde, Bubu!',64,16,'e')]},
             {bg:K,it:[C('img/poses/bubu-feliz.webp',35,98,50),C('img/thur/joinha.webp',72,98,80),B('bubu','Obrigado, Thur!',40,16,'d')]}]}]}];
/* quadrinhos desenhados no Gemini: página em imagem + pontos de toque nos balões (cada um fala com a voz do personagem) */
const I=(img,bal)=>({img:'img/hq/'+img+'.webp',bal:bal.map(([x,y,who,t])=>({x,y,who,t}))});
const GEMINI=[
 {id:'g-ep1',tipo:'hq',t:'Episódio 1: O lanche dividido',pags:[I('ep1',[[22,13.3,'lelo','Psiu... eu vi uma coisa!'],[76,11.7,'bubu','Atchim! Tem coisa errada aqui!'],[36,59.6,'thur','Bora dividir?'],[72.5,60,'thur','Fez o bem? Brilhou também!']])]},
 {id:'g-ep2',tipo:'hq',t:'Episódio 2: O vaso quebrado',pags:[I('ep2',[[28.5,13.3,'narr','Crás!'],[84,13,'thur','Foi o vento...'],[34,60.4,'thur','Eu quebrei sem querer.'],[74,60.4,'narr','Fez o bem? Brilhou também!']])]},
 {id:'g-parte2',tipo:'hq',t:'Quatro jeitos de ser amigo',pags:[I('p2a',[[38.6,20.3,'thur','Turma! Olha essa bagunça!']]),
   {lay:2,pn:[{bg:Q,it:[C('img/thur/bravo.webp',32,98,88),C('img/poses/lelo-chorando.webp',76,98,42),C('img/poses/bubu-chorando.webp',92,98,30),B('thur','Vocês só atrapalham! Voltem para as nuvens!',60,16,'e')]},
              {bg:'#FFF4D2',it:[C('img/prof/c-acolhe.webp',30,98,92),C('img/thur/pensando.webp',78,98,78),B('clara','Todo amigo erra. Amigo de verdade pede desculpas.',55,14,'e')]}]},
   I('p2b',[[53,20,'thur','Me desculpem. Eu falei uma coisa feia.']]),I('p2c',[[29,18,'zuzu','Psiu... eu escutei um miado!']]),I('p2d',[[49,20,'thur','Fez o bem? Brilhou também!']])]},
 {id:'g-bubu',tipo:'hq',t:'O Bubu das emoções',pags:[I('bubu',[[28,8,'bubu','Buáááá! O mundo é injusto!'],[80,7.5,'thur','Mas nem abrimos o lanche!'],[29.5,49,'bubu','Tô bravo... Quer dizer, arco-íris!'],[78,58,'thur','Tempestade e arco-íris no mesmo minuto!']]),
   {lay:1,pn:[{bg:'#FFE3F0',it:[C('img/poses/bubu-feliz.webp',35,98,48),C('img/poses/pituca-amor.webp',68,98,48),B('narr','Tudo bem ficar bravo. Um abraço ajuda!',50,14),B('narr','Fez o bem? Brilhou também!',50,91)]}]}]},
 {id:'g-lelo',tipo:'hq',t:'O show do Lelo',pags:[I('lelo',[[32,7.5,'lelo','Láááá! Soltaaaa o som!'],[85,7,'pituca','É isso aí! Bis! Bis!'],[29.5,49,'thur','Show às sete da manhã?!'],[77,58,'thur','Só se eu fizer o refrão!']]),
   {lay:1,pn:[{bg:'#E5F9DD',it:[C('img/thur/cantando.webp',50,98,80),C('img/poses/lelo-cantando.webp',18,98,40),C('img/poses/pituca-cantando.webp',82,98,40),B('narr','Cantar junto é mais divertido!',50,12),B('narr','Fez o bem? Brilhou também!',50,91)]}]}]},
 {id:'g-zuzu',tipo:'hq',t:'A estrela do Zuzu',pags:[I('zuzu',[[32.4,7.5,'zuzu','Thur, essa estrela é o meu tesouro!'],[29.5,49,'thur','Calma, eu peg... Opa!'],[78,58,'thur','Foi a gravidade! Fiu-fiu...']]),
   {lay:2,pn:[{bg:Q,it:[C('img/thur/pensando.webp',30,98,88),C('img/poses/zuzu-bravo.webp',75,98,45),B('thur','Espera... não foi a gravidade. Fui eu.',60,15,'e')]},
              {bg:Q,it:[C('img/thur/joinha.webp',30,98,88),C('img/poses/zuzu-amor.webp',74,98,45),B('thur','Desculpa, Zuzu!',30,14,'d'),B('zuzu','Obrigado pela verdade!',72,14,'e'),B('narr','Fez o bem? Brilhou também!',50,90)]}]}]}];
PRONTAS.unshift(...GEMINI);
const mine=()=>LS.get('thur-hist',[]);
const allStories=tipo=>[...PRONTAS.filter(s=>s.tipo===tipo).map(s=>Object.assign({pronta:1},s)),...mine().filter(s=>s.tipo===tipo)];
const findStory=id=>PRONTAS.find(s=>s.id===id)||mine().find(s=>s.id===id);

/* ---------- desenhar página (mesmo desenho no leitor e no editor) ---------- */
const bgCss=bg=>bg&&bg[0]==='#'?`background:${bg}`:`background:#BDE6FF url(${bg}) center/cover`;
function itemHtml(it,i,ed){if(it.k==='img')return`<img class="hit${ed?' ed':''}" data-i="${i}" src="${it.src}" alt="" draggable="false" style="left:${it.x}%;top:${it.y}%;height:${it.s}%;transform:translate(-50%,-100%)${it.f?' scaleX(-1)':''}">`;
  return`<div class="hbal ${it.who==='narr'?'narr':'tail-'+(it.tail||'e')}${ed?' ed':''}" data-i="${i}" data-who="${it.who}" style="left:${it.x}%;top:${it.y}%">${esc(it.txt)}</div>`}
function pageHtml(pg,ed,sel){if(pg.img)return`<div class="hpage himgp"><div class="himgw"><img src="${pg.img}" alt="" draggable="false">${(pg.bal||[]).map(b=>`<button class="hspot" data-who="${b.who}" data-t="${esc(b.t)}" style="left:${b.x}%;top:${b.y}%" aria-label="${esc(b.t)}"></button>`).join('')}</div></div>`;const pn=pg.pn||[];return`<div class="hpage lay${pg.lay}">${pn.map((p,j)=>`<div class="hpn${ed&&sel===j?' sel':''}" data-p="${j}" style="${bgCss(p.bg)}">${(p.it||[]).map((it,i)=>itemHtml(it,i,ed)).join('')}</div>`).join('')}</div>`}

/* ---------- biblioteca ---------- */
let TAB='livro';
const TABS=[['video','📺','Vídeos'],['livro','📖','Livros'],['hq','💬','Quadrinhos']];
function capa(s){const p=s.pags[0];if(p&&p.img)return`<div class="hcapa" style="background:#fff url(${p.img}) center 8%/cover"></div>`;const pn=p&&p.pn&&p.pn[0];return`<div class="hcapa" style="${bgCss(pn?pn.bg:'#FFF4D2')}">${pn?(pn.it||[]).filter(i=>i.k==='img').slice(0,3).map(i=>`<img src="${i.src}" alt="" style="left:${i.x}%;height:${Math.min(90,i.s)}%;${i.f?'transform:translateX(-50%) scaleX(-1)':''}">`).join(''):''}</div>`}
const vids=()=>[...(window.HIST_VIDEOS||[]),...LS.get('thur-videos',[])];
function renderLib(){$('#hTabs').innerHTML=TABS.map(([k,e,n])=>`<button class="htab${k===TAB?' on':''}" data-t="${k}"><span>${e}</span>${n}</button>`).join('');
  let h='';
  if(TAB==='video'){const v=vids();h=v.length?v.map((x,i)=>`<button class="hcard vid" data-v="${i}"><div class="hcapa vidc" style="background-image:url(https://i.ytimg.com/vi/${x.yt}/hqdefault.jpg)"><span class="hplay">▶</span></div><b>${esc(x.t)}</b></button>`).join('')
      :`<div class="hvazio"><img src="img/prof/l-mostra.webp" alt=""><p><b>Os vídeos da Turma do Thur vão aparecer aqui!</b><br>Os pais podem adicionar vídeos do YouTube em <b>Para os pais → Vídeos</b>. Precisa de internet para assistir.</p></div>`}
  else{const L=allStories(TAB);h=`<button class="hcard novo" id="hNovo"><div class="hcapa novoc">＋</div><b>Criar ${TAB==='hq'?'quadrinho':'livro'}</b></button>`+L.map(s=>`<button class="hcard" data-id="${s.id}">${capa(s)}<b>${esc(s.t)}</b>${s.pronta?'':'<i class="hmine">Meu</i>'}</button>`).join('')}
  $('#hLib').innerHTML=h}
$('#hTabs').onclick=e=>{const b=e.target.closest('.htab');if(!b)return;TAB=b.dataset.t;pop(520);renderLib()};
$('#hLib').onclick=e=>{const v=e.target.closest('.vid');if(v){playVid(vids()[+v.dataset.v]);return}
  if(e.target.closest('#hNovo')){pop(600);openEditor(null,TAB);return}
  const c=e.target.closest('.hcard[data-id]');if(c){pop(600);openReader(c.dataset.id)}};
onShow.historias=()=>{renderLib();speak('Vamos ver histórias da Turma do Thur!')};

/* ---------- vídeos (YouTube) ---------- */
function ytId(s){s=String(s||'').trim();const m=s.match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);return m?m[1]:/^[\w-]{11}$/.test(s)?s:null}
function playVid(v){if(!v)return;if(!navigator.onLine){toast('Para ver os vídeos precisa de internet.');return}try{speechSynthesis.cancel()}catch(e){}
  $('#hVid').innerHTML=`<div class="hvbox"><button class="ico" id="hVidX" aria-label="Fechar">✕</button><iframe src="https://www.youtube-nocookie.com/embed/${v.yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; fullscreen" allowfullscreen title="${esc(v.t)}"></iframe></div>`;$('#hVid').classList.add('on');
  $('#hVidX').onclick=()=>{$('#hVid').classList.remove('on');$('#hVid').innerHTML=''}}
TH.ytId=ytId;

/* ---------- leitor ---------- */
const R={s:null,p:0,auto:false,run:0};
function openReader(id){R.s=findStory(id);if(!R.s)return;R.p=0;R.auto=false;show('hler');drawR()}
function drawR(){const s=R.s,pg=s.pags[R.p];R.run++;
  $('#hrTitle').textContent=s.t;
  $('#hrBody').innerHTML=pageHtml(pg,false)+(s.tipo==='livro'?`<div class="hrtxt">${(pg.txt||'').split(/\s+/).map((w,i)=>`<span class="hw" data-w="${i}">${esc(w)}</span>`).join(' ')}</div>`:'');
  $('#hrPg').textContent=`${R.p+1} / ${s.pags.length}`;$('#hrDel').style.display=PRONTAS.some(p=>p.id===s.id)?'none':'block';$('#hrEdit').style.display=s.pags.some(p=>p.img)?'none':'';$('#hrPrev').disabled=R.p===0;
  $('#hrNext').classList.toggle('fim',R.p===s.pags.length-1);
  $('#hrBody .hpage').animate([{opacity:0,transform:'translateX(40px)'},{opacity:1,transform:'none'}],{duration:300});
  if(R.auto)readPage()}
/* lê a página: no livro as palavras acendem em verde; no quadrinho cada balão fala com a voz do personagem */
function readPage(){const s=R.s,pg=s.pags[R.p],run=R.run;
  if(s.tipo==='livro'){const ws=$$('#hrBody .hw');const txt=pg.txt||'';speak(txt,'narr');const per=Math.max(260,Math.round(5200/Math.max(6,ws.length)*(ws.length/8)));
    ws.forEach((w,i)=>setTimeout(()=>{if(R.run!==run)return;ws.forEach(x=>x.classList.remove('on'));w.classList.add('on')},i*380));
    setTimeout(()=>{if(R.run!==run)return;ws.forEach(x=>x.classList.remove('on'));if(R.auto)nextR(true)},ws.length*380+1400);return}
  const bals=$$('#hrBody .hbal,#hrBody .hspot');let t=0;bals.forEach(b=>{const tx=b.dataset.t||b.textContent,d=900+tx.length*85;setTimeout(()=>{if(R.run!==run)return;bals.forEach(x=>x.classList.remove('on'));b.classList.add('on');speak(tx,b.dataset.who)},t);t+=d});
  setTimeout(()=>{if(R.run!==run)return;bals.forEach(x=>x.classList.remove('on'));if(R.auto)nextR(true)},t+600)}
function nextR(auto){const s=R.s;if(R.p<s.pags.length-1){R.p++;pop(560);drawR();return}
  R.auto=false;$('#hrAuto').classList.remove('on');const done=LS.get('thur-hist-lidas',[]),first=!done.includes(s.id);if(first){done.push(s.id);LS.set('thur-hist-lidas',done)}
  /* terminou uma história do app pela primeira vez: ganha adesivo */
  if(first&&PRONTAS.some(p=>p.id===s.id))TH.complete(null,()=>show('historias'),'hist:'+s.id);else{party();speak('Fim! Que história legal!');setTimeout(()=>show('historias'),1800)}}
$('#hrNext').onclick=()=>nextR(false);
$('#hrPrev').onclick=()=>{if(R.p>0){R.p--;pop(480);drawR()}};
$('#hrRead').onclick=()=>{pop(600);R.run++;readPage()};
$('#hrAuto').onclick=()=>{R.auto=!R.auto;$('#hrAuto').classList.toggle('on',R.auto);pop(600);if(R.auto){R.run++;readPage()}else{R.run++;try{speechSynthesis.cancel()}catch(e){}}};
$('#hrBody').onclick=e=>{const b=e.target.closest('.hbal,.hspot');if(b){speak(b.dataset.t||b.textContent,b.dataset.who);b.classList.add('on');setTimeout(()=>b.classList.remove('on'),1500);return}
  const w=e.target.closest('.hw');if(w){speak(w.textContent.replace(/[^\p{L}\p{N}]/gu,''),'narr');w.classList.add('on');setTimeout(()=>w.classList.remove('on'),900);return}
  const im=e.target.closest('.hit');if(im){im.animate([{transform:im.style.transform},{transform:im.style.transform+' translateY(-12%)'},{transform:im.style.transform}],{duration:420});pop(700)}};
$('#hrBack').onclick=()=>{R.run++;R.auto=false;try{speechSynthesis.cancel()}catch(e){}pop(440);show('historias')};

/* ---------- editor: criar livros e quadrinhos ---------- */
const E={s:null,p:0,pn:0,sel:-1,tab:'Thur'};
const newPage=tipo=>tipo==='livro'?{lay:1,txt:'',pn:[{bg:SCENES[0][0],it:[]}]}:{lay:4,pn:[0,1,2,3].map(i=>({bg:SCENES[i%3][0],it:[]}))};
function openEditor(id,tipo){const s=id?JSON.parse(JSON.stringify(findStory(id))):{id:uid(),tipo,t:tipo==='hq'?'Meu quadrinho':'Meu livro',pags:[newPage(tipo)]};
  if(id&&PRONTAS.some(p=>p.id===id)){s.id=uid();s.t+=' (cópia)'}E.s=s;E.p=0;E.pn=0;E.sel=-1;show('hedit');drawE()}
TH.openHistEditor=openEditor;
const cur=()=>E.s.pags[E.p],curPn=()=>cur().pn[E.pn];
function setLay(n){const pg=cur();const old=pg.pn;pg.lay=n;pg.pn=Array.from({length:n},(_,i)=>old[i]||{bg:SCENES[i%3][0],it:[]});E.pn=Math.min(E.pn,n-1);E.sel=-1;drawE()}
function drawE(){const s=E.s,pg=cur();$('#heTitle').value=s.t;
  $('#hePages').innerHTML=s.pags.map((_,i)=>`<button class="hepg${i===E.p?' on':''}" data-p="${i}">${i+1}</button>`).join('')+`<button class="hepg add" data-add="1" aria-label="Nova página">＋</button>`+(s.pags.length>1?`<button class="hepg del" data-del="1" aria-label="Apagar página">🗑</button>`:'');
  $('#heLay').innerHTML=s.tipo==='hq'?[1,2,4].map(n=>`<button class="helay${pg.lay===n?' on':''}" data-l="${n}" aria-label="${n} quadros"><i class="l${n}">${'<b></b>'.repeat(n)}</i></button>`).join(''):'';
  $('#heCanvas').innerHTML=pageHtml(pg,true,E.pn)+(s.tipo==='livro'?`<textarea id="heTxt" class="hetxt" rows="2" maxlength="160" placeholder="Escreva o texto desta página…">${esc(pg.txt||'')}</textarea>`:'');
  const ti=$('#heTxt');if(ti)ti.oninput=()=>{cur().txt=ti.value};
  if(E.sel>=0){const el=$(`#heCanvas .hpn[data-p="${E.pn}"] [data-i="${E.sel}"]`);if(el)el.classList.add('picked')}
  drawTools()}
function drawTools(){const it=E.sel>=0?curPn().it[E.sel]:null;let h='';
  if(it){h=`<div class="hesel"><span>${it.k==='img'?'Personagem':'Balão'}:</span><button class="hb" data-a="menor">－</button><button class="hb" data-a="maior">＋</button>${it.k==='img'?'<button class="hb" data-a="virar">↔ Virar</button><button class="hb" data-a="frente">⬆ Frente</button>':'<button class="hb" data-a="texto">✏️ Texto</button><button class="hb" data-a="rabo">↔ Ponta</button>'}<button class="hb red" data-a="apagar">🗑</button><button class="hb" data-a="ok">✓</button></div>`;
    if(it.k==='bal')h+=`<div class="hewho">${WHO.map(([k,n])=>`<button class="hchip${it.who===k?' on':''}" data-who="${k}">${n}</button>`).join('')}</div>`}
  else h=`<div class="hesec"><b>Cenário do quadro ${E.s.tipo==='hq'?E.pn+1:''}</b><div class="hescn">${SCENES.map(([v,n])=>`<button class="hscn${curPn().bg===v?' on':''}" data-bg="${v}" style="${bgCss(v)}" aria-label="${n}"><span>${n}</span></button>`).join('')}</div></div>
    <div class="hesec"><b>Personagens <small>(toque para colocar no quadro)</small></b><div class="hechtab">${Object.keys(CHARS).map(k=>`<button class="hchip${E.tab===k?' on':''}" data-ct="${k}">${k}</button>`).join('')}<button class="hchip bal" data-addbal="1">💬 Balão</button></div><div class="hechars">${CHARS[E.tab].map(src=>`<button class="hch" data-src="${src}"><img src="${src}" alt="" loading="lazy"></button>`).join('')}</div></div>`;
  $('#heTools').innerHTML=h}
/* arrastar personagens e balões dentro do quadro */
let drag=null;
$('#heCanvas').addEventListener('pointerdown',e=>{const pn=e.target.closest('.hpn');if(!pn)return;const j=+pn.dataset.p;const el=e.target.closest('[data-i]');
  if(j!==E.pn){E.pn=j;E.sel=el?+el.dataset.i:-1;drawE();if(!el)return}
  if(!el){if(E.sel!==-1){E.sel=-1;drawE()}return}
  e.preventDefault();const i=+el.dataset.i;if(E.sel!==i){E.sel=i;$$('#heCanvas .picked').forEach(x=>x.classList.remove('picked'));el.classList.add('picked');drawTools()}
  const r=pn.getBoundingClientRect(),it=curPn().it[i];drag={el,it,r,ox:e.clientX,oy:e.clientY,x0:it.x,y0:it.y,moved:false};try{el.setPointerCapture(e.pointerId)}catch(_){}});
$('#heCanvas').addEventListener('pointermove',e=>{if(!drag)return;const d=drag;const dx=(e.clientX-d.ox)/d.r.width*100,dy=(e.clientY-d.oy)/d.r.height*100;if(Math.abs(dx)+Math.abs(dy)>1)d.moved=true;
  d.it.x=Math.max(0,Math.min(100,Math.round(d.x0+dx)));d.it.y=Math.max(d.it.k==='img'?15:0,Math.min(d.it.k==='img'?115:95,Math.round(d.y0+dy)));d.el.style.left=d.it.x+'%';d.el.style.top=d.it.y+'%'});
const endDrag=()=>{if(drag&&!drag.moved&&drag.it.k==='bal')null;drag=null};
$('#heCanvas').addEventListener('pointerup',endDrag);$('#heCanvas').addEventListener('pointercancel',endDrag);
$('#heTools').onclick=e=>{const b=e.target.closest('button');if(!b)return;const pn=curPn();pop(560);
  if(b.dataset.bg){pn.bg=b.dataset.bg;drawE();return}
  if(b.dataset.ct){E.tab=b.dataset.ct;drawTools();return}
  if(b.dataset.src){pn.it.push({k:'img',src:b.dataset.src,x:30+rnd(40),y:98,s:E.s.tipo==='hq'&&cur().lay===4?60:70,f:0});E.sel=pn.it.length-1;drawE();speak('Pronto! Arraste para mudar de lugar.');return}
  if(b.dataset.addbal){textBox('O que ele fala?','',t=>{if(!t)return;const last=[...pn.it].reverse().find(i=>i.k==='img');pn.it.push({k:'bal',who:last?whoOf(last.src):'narr',txt:t,x:50,y:15,tail:'e'});E.sel=pn.it.length-1;drawE()});return}
  if(b.dataset.who){pn.it[E.sel].who=b.dataset.who;drawE();return}
  const it=pn.it[E.sel],a=b.dataset.a;if(!it)return;
  if(a==='maior'){if(it.k==='img')it.s=Math.min(160,it.s+8);else it.z=Math.min(1.8,(it.z||1)+.15)}
  if(a==='menor'){if(it.k==='img')it.s=Math.max(15,it.s-8);else it.z=Math.max(.6,(it.z||1)-.15)}
  if(a==='virar')it.f=it.f?0:1;
  if(a==='frente'){pn.it.splice(E.sel,1);pn.it.push(it);E.sel=pn.it.length-1}
  if(a==='rabo')it.tail=it.tail==='e'?'d':'e';
  if(a==='texto'){textBox('Texto do balão',it.txt,t=>{if(t){it.txt=t;drawE()}});return}
  if(a==='apagar'){pn.it.splice(E.sel,1);E.sel=-1}
  if(a==='ok')E.sel=-1;
  drawE()};
$('#hePages').onclick=e=>{const b=e.target.closest('.hepg');if(!b)return;pop(520);const s=E.s;
  if(b.dataset.add){s.pags.push(newPage(s.tipo));E.p=s.pags.length-1}else if(b.dataset.del){ask('Apagar a página '+(E.p+1)+'?',()=>{s.pags.splice(E.p,1);E.p=Math.max(0,E.p-1);E.pn=0;E.sel=-1;drawE()});return}else E.p=+b.dataset.p;E.pn=0;E.sel=-1;drawE()};
$('#heLay').onclick=e=>{const b=e.target.closest('.helay');if(b){pop(520);setLay(+b.dataset.l)}};
$('#heTitle').oninput=e=>{E.s.t=e.target.value.slice(0,40)};
function saveE(quiet){const L=mine();const i=L.findIndex(x=>x.id===E.s.id);if(!E.s.t.trim())E.s.t=E.s.tipo==='hq'?'Meu quadrinho':'Meu livro';if(i>=0)L[i]=E.s;else L.push(E.s);LS.set('thur-hist',L);if(!quiet)toast('História guardada!')}
$('#heSave').onclick=()=>{saveE();party();speak('Que história linda!');TAB=E.s.tipo;setTimeout(()=>show('historias'),900)};
$('#heBack').onclick=()=>{pop(440);saveE(true);TAB=E.s.tipo;show('historias')};
$('#hePlay').onclick=()=>{saveE(true);openReader(E.s.id)};
$('#heImg').onclick=()=>exportPages(E.s);
/* caixa de texto simples (para os pais escreverem) */
function textBox(title,val,cb){const d=$('#htxt');$('#htxtT').textContent=title;const i=$('#htxtIn');i.value=val||'';d.classList.add('on');setTimeout(()=>{try{i.focus()}catch(e){}},80);
  $('#htxtOk').onclick=()=>{d.classList.remove('on');cb(i.value.trim().slice(0,90))};$('#htxtNo').onclick=()=>d.classList.remove('on')}
/* livros e quadrinhos que a pessoa criou: editar e apagar a partir do leitor */
$('#hrEdit').onclick=()=>{pop(520);R.run++;openEditor(R.s.id,R.s.tipo)};
$('#hrDel').onclick=()=>{if(PRONTAS.some(p=>p.id===R.s.id))return;ask('Apagar esta história?',()=>{LS.set('thur-hist',mine().filter(x=>x.id!==R.s.id));show('historias')})};
const _open=openReader;

/* ---------- salvar como imagem (vai para a galeria e dá para compartilhar/imprimir) ---------- */
const loadImg=src=>new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=src});
function wrap(ctx,t,maxW){const ws=t.split(/\s+/),ls=[];let l='';ws.forEach(w=>{const tt=l?l+' '+w:w;if(ctx.measureText(tt).width>maxW&&l){ls.push(l);l=w}else l=tt});if(l)ls.push(l);return ls}
async function drawPanel(ctx,p,X,Y,W,H){ctx.save();ctx.beginPath();ctx.rect(X,Y,W,H);ctx.clip();
  if(p.bg&&p.bg[0]==='#'){ctx.fillStyle=p.bg;ctx.fillRect(X,Y,W,H)}else{const im=await loadImg(p.bg);ctx.fillStyle='#BDE6FF';ctx.fillRect(X,Y,W,H);if(im){const sc=Math.max(W/im.width,H/im.height),w=im.width*sc,h=im.height*sc;ctx.drawImage(im,X+(W-w)/2,Y+(H-h)/2,w,h)}}
  for(const it of p.it||[]){if(it.k==='img'){const im=await loadImg(it.src);if(!im)continue;const h=H*it.s/100,w=im.width*h/im.height,cx=X+W*it.x/100,by=Y+H*it.y/100;ctx.save();ctx.translate(cx,by);if(it.f)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore()}
    else{const fs=Math.round(H*.065*(it.z||1));ctx.font=`800 ${fs}px "Baloo 2", Arial, sans-serif`;const ls=wrap(ctx,it.txt,W*.58),lh=fs*1.15,tw=Math.max(...ls.map(l=>ctx.measureText(l).width)),bw=tw+fs*1.2,bh=ls.length*lh+fs*.8,cx=X+W*it.x/100,cy=Y+H*it.y/100,bx=cx-bw/2,by=cy-bh/2;
      const narr=it.who==='narr';ctx.fillStyle=narr?'#FFF4A8':'#fff';ctx.strokeStyle='#2E2440';ctx.lineWidth=Math.max(3,fs*.12);ctx.beginPath();ctx.roundRect(bx,by,bw,bh,narr?fs*.25:bh/2.2);ctx.fill();ctx.stroke();
      if(!narr){const tx=it.tail==='d'?cx+bw*.2:cx-bw*.2;ctx.beginPath();ctx.moveTo(tx-fs*.4,by+bh-2);ctx.lineTo(tx+(it.tail==='d'?fs*.5:-fs*.5),by+bh+fs*.9);ctx.lineTo(tx+fs*.4,by+bh-2);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillRect(tx-fs*.4+ctx.lineWidth,by+bh-ctx.lineWidth*1.5,fs*.8-ctx.lineWidth*2,ctx.lineWidth*2)}
      ctx.fillStyle='#2E2440';ctx.textAlign='center';ctx.textBaseline='middle';ls.forEach((l,k)=>ctx.fillText(l,cx,by+fs*.4+lh*(k+.5)))}}
  ctx.restore();ctx.lineWidth=8;ctx.strokeStyle='#2E2440';ctx.strokeRect(X,Y,W,H)}
async function exportPages(s){toast('Preparando as imagens…');let n=0;
  for(const pg of s.pags){const livro=s.tipo==='livro',W=livro?1600:1200,H=livro?1500:1600,cv=document.createElement('canvas');cv.width=W;cv.height=H;const ctx=cv.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
    const g=28;if(livro){await drawPanel(ctx,pg.pn[0],g,g,W-2*g,1200-2*g);ctx.fillStyle='#2E2440';ctx.font='800 64px "Baloo 2", Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';const ls=wrap(ctx,pg.txt||'',W-160);ls.forEach((l,k)=>ctx.fillText(l,W/2,1200+90+k*76-(ls.length-1)*38))}
    else{const L=pg.lay,cols=L===4?2:1,rows=L===1?1:2,pw=(W-g*(cols+1))/cols,ph=(H-90-g*(rows+1))/rows;ctx.fillStyle='#2E2440';ctx.font='800 54px "Baloo 2", Arial, sans-serif';ctx.textAlign='center';ctx.fillText(s.t,W/2,62);
      for(let k=0;k<L;k++){const c=k%cols,r=Math.floor(k/cols);await drawPanel(ctx,pg.pn[k],g+c*(pw+g),90+g+r*(ph+g),pw,ph)}}
    const url=cv.toDataURL('image/jpeg',.9);if(TH.dbAdd){await TH.dbAdd(url,'hist');n++}}
  party();toast(n+(n===1?' página guardada':' páginas guardadas')+' na Galeria (aba Histórias). De lá dá para compartilhar ou imprimir.')}
document.addEventListener('thur-fala',e=>{const d=e.detail||{};if(!d.on)return});
window.HISTORIAS={PRONTAS,openReader:_open};
})();
