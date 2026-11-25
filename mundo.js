/* Turma do Thur — Mundinho: quarto, cozinha e parque */
'use strict';
{
const {$,$$,show,pop,speak,actx,cfg,rnd,onShow}=window.TH;
const O='img/mundo/obj/';
const CH=[
  {id:'thur',src:'img/thur.png',w:9,say:'Oi! Eu sou o Thur!',pitch:1.1},
  {id:'zuzu',src:'img/pets/zuzu.png',w:7.5,say:'Zum-zum! Eu sou o Zuzu!',pitch:1.6},
  {id:'lelo',src:'img/pets/lelo.png',w:7.5,say:'Oi! Eu sou o Lelo!',pitch:.75},
  {id:'pituca',src:'img/pets/pituca.png',w:7.5,say:'Pulão! Eu sou a Pituca!',pitch:1.9},
  {id:'bubu',src:'img/pets/bubu.png',w:8.5,say:'Atchim! Eu sou a Bubu!',pitch:1.4}];
const SCENES={
  parque:{n:'Parque',bg:'img/mundo/parque.jpg',items:[
    {id:'cavalinho',w:15,x:14,y:82,seat:[54,42],act:'rock'},
    {id:'carro',w:19,x:40,y:74,seat:[46,56],act:'drive'},
    {id:'piscina',w:17,x:72,y:75,seat:[50,52],act:'balls'},
    {id:'baloes',w:8,x:93,y:64,act:'float'},
    {id:'escorregador',w:17,x:86,y:97,seat:[74,16],act:'slide'},
    {id:'pula',w:14,x:57,y:98,seat:[50,60],act:'jump'},
    {id:'joao',w:7.5,x:27,y:98,act:'wobble'}],
    chars:[[7,99],[35,99],[46,97],[67,99],[77,99]]},
  quarto:{n:'Quarto',bg:'img/mundo/quarto.jpg',items:[
    {id:'cama',w:26,x:17,y:80,seat:[56,46],act:'sleep'},
    {id:'bau',w:14,x:84,y:76,act:'bau'},
    {id:'abajur',w:7,x:95,y:92,act:'lamp'},
    {id:'tambor',w:10,x:72,y:95,act:'drum'},
    {id:'trem',w:22,x:44,y:98,seat:[74,32],act:'drive'},
    {id:'bola',w:6.5,x:62,y:83,act:'hop'},
    {id:'urso',w:7,x:31,y:93,act:'hop'}],
    chars:[[52,88],[40,90],[60,92],[68,86],[27,84]]},
  cozinha:{n:'Cozinha',bg:'img/mundo/cozinha.jpg',items:[
    {id:'maca',w:5,x:30,y:66,food:'maçã'},{id:'banana',w:6,x:37,y:65,food:'banana'},{id:'uva',w:5,x:44,y:66,food:'uva'},{id:'melancia',w:6.5,x:51,y:65,food:'melancia'},
    {id:'cupcake',w:5,x:58,y:66,food:'bolinho'},{id:'leite',w:4,x:64,y:66,food:'leite'},{id:'biscoito',w:5,x:70,y:66,food:'biscoito'},{id:'cenoura',w:5,x:77,y:66,food:'cenoura'}],
    chars:[[91,99],[13,99],[27,99],[73,99],[50,99]]},
  banheiro:{n:'Banheiro',bg:'img/mundo/banheiro.svg',thumb:'img/mundo/banheiro.svg',items:[
    {id:'vaso',src:O+'vaso.svg',w:12,x:30,y:93,seat:[50,52],act:'flush',auto:1},
    {id:'pia',src:O+'pia.svg',w:13,x:51,y:78,seat:[50,112],act:'wash',auto:1},
    {id:'patinho',src:O+'patinho.svg',w:6,x:68,y:94,act:'quack'}],
    chars:[[84,99],[12,99],[72,98],[93,96],[60,99]]}
};
const stage=$('#stage');let cur='parque',drag=null;

/* sons do mundinho */
function tone(type,f1,f2,dur,vol=.15,delay=0){if(!cfg.som)return;const a=actx();if(!a)return;try{const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02)}catch(e){}}
const boing=(d=0)=>tone('sine',220,700,.28,.18,d);
const honk=()=>{tone('square',420,400,.16,.07);tone('square',330,320,.2,.07,.2)};
const drum=(d=0)=>{tone('sine',120,45,.25,.35,d);tone('triangle',200,80,.08,.15,d)};
const click=()=>tone('square',1400,900,.05,.06);
const munch=()=>[0,.18,.36].forEach(d=>tone('triangle',300,180,.08,.12,d));

/* montar cena */
function place(e,x,y,w){e.style.left=x+'%';e.style.top=y+'%';e.style.width=(e.classList.contains('char')?w*grow(e):w)+'%';e.style.zIndex=Math.round(y*10)}
/* barriga cheia: cada comida deixa o personagem maior; o banheiro volta ao normal */
const LV=Object.assign({thur:0,zuzu:0,lelo:0,pituca:0,bubu:0},(()=>{try{return JSON.parse(localStorage.getItem('thur-barriga'))||{}}catch(e){return{}}})());
const MAXLV=4,grow=e=>1+.15*(LV[e.dataset.id]||0);
const saveLv=()=>{try{localStorage.setItem('thur-barriga',JSON.stringify(LV))}catch(e){}};
function applyLv(c,anim=true){c.style.transition=anim?'width .5s cubic-bezier(.3,1.6,.6,1)':'none';
  if(c.classList.contains('seated')){const o=c.closest('.ent.obj');if(o)c.style.width=(+c.dataset.w*grow(c)/ +o.dataset.w*100)+'%'}else c.style.width=(+c.dataset.w*grow(c))+'%';
  let b=c.querySelector(':scope > .need');const full=(LV[c.dataset.id]||0)>=MAXLV;
  if(full&&!b){b=document.createElement('div');b.className='need';b.innerHTML='<svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx="20" cy="20" r="18" fill="#fff" stroke="#2E2440" stroke-width="3"/><path d="M12 14h16v6c0 6-4 9-8 9s-8-3-8-9z" fill="#BDE6FF" stroke="#2E2440" stroke-width="2.5"/><rect x="11" y="10" width="18" height="5" rx="2" fill="#fff" stroke="#2E2440" stroke-width="2.5"/></svg>';c.appendChild(b)}
  if(!full&&b)b.remove();c.classList.toggle('apertado',full)}
function say(c,t,queue){if(!cfg.voz)return;try{const s=speechSynthesis;if(!queue)s.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='pt-BR';u.rate=.95;u.pitch=Math.min(2,+(c&&c.dataset.pitch)||1.1);const v=s.getVoices().find(v=>/pt[-_]BR/i.test(v.lang));if(v)u.voice=v;s.speak(u)}catch(e){}}
const FALAS={
  'maçã':['Maçã crocante! Crec, crec, crec!','Hummm, maçã vermelhinha! Que delícia!'],
  'banana':['Banana! Uh uh, ah ah! Virei macaquinho!','Bananinha docinha! Escorregou na boca!'],
  'uva':['Uvinha! Ploc, ploc, ploc! Estourou na boca!','Uva roxinha! Fiquei com a língua roxa!'],
  'melancia':['Melancia gigante! Escorreu no queixo!','Melancia! Cuspi uma sementinha! Ptuu!'],
  'bolinho':['Bolinho com cereja! Nham nham, que gostosura!','Bolinho! Fiquei com o nariz de glacê!'],
  'leite':['Leitinho! Olha meu bigode branco!','Glub, glub, glub! Leite quentinho!'],
  'biscoito':['Biscoito! Croc, croc, croc! Caiu farelo!','Biscoito com gotinhas! Que crocante!'],
  'cenoura':['Cenoura! Agora eu enxergo no escuro!','Cenourinha! Crunch, crunch! Igual um coelhinho!']};
function mk(d){const e=document.createElement('div');e.className='ent '+d.kind;e.dataset.id=d.id;e.dataset.w=d.w;place(e,d.x,d.y,d.w);
  if(d.seat)e.dataset.seat=d.seat.join(',');if(d.act)e.dataset.act=d.act;if(d.food){e.dataset.food=d.food;e.dataset.hx=d.x;e.dataset.hy=d.y}if(d.say)e.dataset.say=d.say;if(d.pitch)e.dataset.pitch=d.pitch;if(d.auto)e.dataset.auto=1;
  e.innerHTML=`<div class="an"><img class="im" src="${d.src}" alt="" draggable="false"></div>`;return e}
function build(key){cur=key;const S=SCENES[key];stage.classList.remove('isnight');stage.querySelectorAll('.ent,.fx').forEach(e=>e.remove());
  stage.querySelector('.sbg').src=S.bg;$('#mTitle').textContent=S.n;
  S.items.forEach(it=>stage.appendChild(mk({src:O+it.id+'.webp',...it,kind:it.food?'food':'obj'})));
  CH.forEach((c,i)=>{const e=mk({...c,kind:'char',x:S.chars[i][0],y:S.chars[i][1]});stage.appendChild(e);applyLv(e,false)});
  $$('#scenes .scn').forEach(b=>b.classList.toggle('on',b.dataset.s===key))}
$('#scenes').innerHTML=Object.entries(SCENES).map(([k,s])=>`<button class="scn" data-s="${k}" aria-label="${s.n}"><img src="${s.thumb||'img/bg-'+k+'.jpg'}" alt=""></button>`).join('');
$('#scenes').onclick=e=>{const b=e.target.closest('.scn');if(!b||b.dataset.s===cur)return;pop(480);build(b.dataset.s)};
function fit(){const w=$('#mwrap').getBoundingClientRect();if(!w.width)return;const sw=Math.min(w.width-16,(w.height-16)*16/9);stage.style.width=sw+'px';stage.style.height=sw*9/16+'px'}
onShow.mundo=()=>requestAnimationFrame(fit);
new ResizeObserver(()=>{if($('#mundo').classList.contains('on'))fit()}).observe($('#mwrap'));
window.openMundo=()=>{build(cur);show('mundo')};

/* efeitos */
const A=(el,kf,opt)=>el.animate(kf,Object.assign({duration:600,easing:'ease-in-out'},opt));
const an=e=>e.querySelector(':scope > .an');
function fx(ent,html,opts={}){const sr=stage.getBoundingClientRect(),r=ent.getBoundingClientRect();const s=document.createElement('div');s.className='fx';s.innerHTML=html;
  s.style.left=((r.left+r.width*(opts.fx??.5)-sr.left)/sr.width*100)+'%';s.style.top=((r.top+r.height*(opts.fy??.1)-sr.top)/sr.height*100)+'%';stage.appendChild(s);
  const dx=opts.dx??(rnd(80)-40),dy=opts.dy??-90;const k=A(s,[{transform:'translate(-50%,-50%) scale(.4)',opacity:0},{transform:'translate(-50%,-50%) scale(1)',opacity:1,offset:.2},{transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(1)`,opacity:0}],{duration:opts.dur||1300,easing:'ease-out',delay:opts.delay||0,fill:'backwards'});k.onfinish=()=>s.remove()}
const heart='<svg viewBox="0 0 32 32" width="34" height="34"><path d="M16 28S3 20 3 11a7 7 0 0 1 13-3 7 7 0 0 1 13 3c0 9-13 17-13 17z" fill="#FF4D6D" stroke="#fff" stroke-width="2"/></svg>';
const sparkle=c=>`<svg viewBox="0 0 32 32" width="30" height="30"><path d="M16 2l3.5 9.5L29 15l-9.5 3.5L16 28l-3.5-9.5L3 15l9.5-3.5z" fill="${c}" stroke="#fff" stroke-width="1.5"/></svg>`;
const seated=obj=>an(obj).querySelector(':scope > .char');
function night(on){stage.classList.toggle('isnight',on)}
function hopEl(el,h='-45%',n=1){return A(el,[{transform:'translateY(0)'},{transform:`translateY(${h})`},{transform:'translateY(0)'}],{duration:520,iterations:n,easing:'cubic-bezier(.3,0,.7,1)'})}

const ACTS={
  rock(o){const a=an(o);a.style.transformOrigin='50% 85%';A(a,[{transform:'rotate(0)'},{transform:'rotate(-12deg)'},{transform:'rotate(10deg)'},{transform:'rotate(-7deg)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}],{duration:1600});boing();boing(.6)},
  drive(o){const sr=stage.getBoundingClientRect(),x=parseFloat(o.style.left);const d=sr.width*.32*(x>50?-1:1);A(an(o),[{transform:'translateX(0)'},{transform:`translateX(${d}px)`},{transform:'translateX(0)'}],{duration:2800});honk()},
  balls(o){const cols=['#FF4D4D','#FFD60A','#4FB3F0','#4CC764','#FF9F1C','#9B5DE5'];for(let i=0;i<12;i++)fx(o,`<span class="ball" style="background:${cols[i%6]}"></span>`,{fx:.2+Math.random()*.6,fy:.3,dx:rnd(160)-80,dy:-60-rnd(80),dur:900,delay:i*40});TH.splashSound();const c=seated(o);if(c)hopEl(an(c),'-30%',2)},
  float(o){A(an(o),[{transform:'translateY(0)'},{transform:'translateY(-30%) rotate(-4deg)'},{transform:'translateY(-15%) rotate(3deg)'},{transform:'translateY(0)'}],{duration:2200});[0,.15,.3].forEach(d=>tone('sine',600+rnd(400),1200,.12,.1,d))},
  slide(o){const c=seated(o);if(!c){A(an(o),[{transform:'scale(1)'},{transform:'scale(1.05)'},{transform:'scale(1)'}],{duration:300});boing();return}
    const r=o.getBoundingClientRect();const k=A(an(c),[{transform:'translate(0,0)'},{transform:`translate(${-r.width*.62}px,${r.height*.68}px)`}],{duration:950,easing:'ease-in',fill:'forwards'});tone('sine',900,200,.9,.12);
    k.onfinish=()=>{detach(c);k.cancel();hopEl(an(c),'-25%')}},
  jump(o){const c=seated(o);A(an(o),[{transform:'scaleY(1)'},{transform:'scaleY(.9)'},{transform:'scaleY(1)'}],{duration:540,iterations:3});if(c)hopEl(an(c),'-110%',3);[0,.54,1.08].forEach(d=>boing(d))},
  wobble(o){const a=an(o);a.style.transformOrigin='50% 95%';A(a,[{transform:'rotate(0)'},{transform:'rotate(-20deg)'},{transform:'rotate(15deg)'},{transform:'rotate(-10deg)'},{transform:'rotate(6deg)'},{transform:'rotate(-3deg)'},{transform:'rotate(0)'}],{duration:1700});boing();boing(.35)},
  sleep(o){const on=!stage.classList.contains('isnight');night(on);speak(on?'Boa noite!':'Bom dia!');if(on)[0,1,2].forEach(i=>fx(o,'<b class="zzz">Z</b>',{fx:.6+i*.08,fy:.2,dx:30+i*10,dy:-70,delay:i*350,dur:1800}));tone('sine',on?500:300,on?250:600,.4,.1)},
  lamp(o){night(!stage.classList.contains('isnight'));click()},
  bau(o){A(an(o),[{transform:'rotate(0)'},{transform:'rotate(-4deg)'},{transform:'rotate(4deg)'},{transform:'rotate(0)'}],{duration:400,iterations:2});['#FFD60A','#FF85C0','#4FB3F0','#4CC764','#FF9F1C','#9B5DE5'].forEach((c,i)=>fx(o,sparkle(c),{fy:.2,dx:rnd(140)-70,dy:-80-rnd(60),delay:i*70}));[0,.1,.2].forEach(d=>tone('sine',700+d*2000,1400,.15,.08,d))},
  drum(o){A(an(o),[{transform:'scale(1)'},{transform:'scale(.93,1.04)'},{transform:'scale(1)'}],{duration:220,iterations:3});drum();drum(.22);drum(.44)},
  hop(o){hopEl(an(o),'-60%');boing()},
  quack(o){A(an(o),[{transform:'rotate(0)'},{transform:'rotate(-12deg)'},{transform:'rotate(10deg)'},{transform:'rotate(0)'}],{duration:500});tone('square',700,500,.12,.06);tone('square',650,450,.14,.06,.16);say(null,'Quém, quém!')},
  flush(o){const c=seated(o);
    const swirl=()=>{for(let i=0;i<8;i++)fx(o,'<span class="ball" style="background:#8FD3F5"></span>',{fx:.3+Math.random()*.4,fy:.5,dx:rnd(80)-40,dy:-40-rnd(50),dur:800,delay:i*60});tone('sine',900,120,1.1,.12)};
    if(!c){swirl();say(null,'Vrummmm! Descarga!');return}
    const lv=LV[c.dataset.id]||0;
    if(!lv){say(c,'Agora não estou com vontade!');return}
    A(an(c),[{transform:'translateY(0)'},{transform:'translateY(-4%) scale(1.03,.97)'},{transform:'translateY(0)'}],{duration:400,iterations:3});
    setTimeout(()=>{tone('sine',500,90,.35,.18);LV[c.dataset.id]=0;saveLv();applyLv(c);say(c,'Ufa! Que alívio! Agora a descarga!');fx(c,sparkle('#FFD60A'),{fy:.1})},1300);
    setTimeout(()=>{swirl();say(c,'Não esquece de lavar as mãozinhas!',true)},2700)},
  wash(o){const c=seated(o);for(let i=0;i<14;i++)fx(o,'<span class="bub"></span>',{fx:.2+Math.random()*.6,fy:.25,dx:rnd(120)-60,dy:-50-rnd(70),dur:1200,delay:i*90});tone('sine',600,900,.2,.06);tone('sine',700,1000,.2,.06,.3);
    say(c,c?'Lavando as mãozinhas! Esfrega, esfrega! Pronto, limpinho!':'Água fresquinha! Vamos lavar as mãos!')}
};
function act(ent){
  if(ent.classList.contains('char')){hopEl(an(ent),'-22%');if((LV[ent.dataset.id]||0)>=MAXLV){say(ent,'Preciso ir ao banheiro! Me leva lá, por favor!');return}say(ent,ent.dataset.say);fx(ent,heart,{fy:.05});tone('sine',500,900,.15,.12);return}
  if(ent.classList.contains('food')){A(an(ent),[{transform:'rotate(0)'},{transform:'rotate(-10deg)'},{transform:'rotate(10deg)'},{transform:'rotate(0)'}],{duration:400});speak(ent.dataset.food);return}
  const f=ACTS[ent.dataset.act];if(f)f(ent)}

/* sentar e comer */
function detach(ent){const r=ent.getBoundingClientRect(),sr=stage.getBoundingClientRect();stage.appendChild(ent);ent.classList.remove('seated');
  place(ent,(r.left+r.width/2-sr.left)/sr.width*100,Math.min(100,(r.bottom-sr.top)/sr.height*100),+ent.dataset.w)}
function seat(c,o){const [sx,sy]=o.dataset.seat.split(',').map(Number);an(o).appendChild(c);c.classList.add('seated');c.style.left=sx+'%';c.style.top=sy+'%';c.style.transition='none';c.style.width=(+c.dataset.w*grow(c)/ +o.dataset.w*100)+'%';c.style.zIndex=5;hopEl(an(c),'-20%');pop(760);if(o.dataset.auto)setTimeout(()=>{const f=ACTS[o.dataset.act];if(f&&seated(o)===c)f(o)},500)}
function eat(f,c){const lv=LV[c.dataset.id]||0;
  if(lv>=MAXLV){A(an(c),[{transform:'translateX(0)'},{transform:'translateX(-8%)'},{transform:'translateX(8%)'},{transform:'translateX(0)'}],{duration:400,iterations:2});say(c,'Não cabe mais nada! Preciso ir ao banheiro!');
    A(f,[{transform:'translate(-50%,-100%) scale(1)'},{transform:'translate(-50%,-100%) scale(1.15)'},{transform:'translate(-50%,-100%) scale(1)'}],{duration:300});place(f,+f.dataset.hx,+f.dataset.hy,+f.dataset.w);return}
  const fr=f.getBoundingClientRect(),cr=c.getBoundingClientRect();const dx=cr.left+cr.width/2-(fr.left+fr.width/2),dy=cr.top+cr.height*.45-(fr.top+fr.height/2);
  const k=A(f,[{transform:'translate(-50%,-100%) translate(0px,0px) scale(1)'},{transform:`translate(-50%,-100%) translate(${dx}px,${dy}px) scale(.2)`}],{duration:380,easing:'ease-in',fill:'forwards'});
  k.onfinish=()=>{f.style.visibility='hidden';k.cancel();place(f,+f.dataset.hx,+f.dataset.hy,+f.dataset.w);A(an(c),[{transform:'scale(1,1)'},{transform:'scale(1.06,.92)'},{transform:'scale(1,1)'}],{duration:260,iterations:3});munch();
    LV[c.dataset.id]=lv+1;saveLv();setTimeout(()=>applyLv(c),300);
    const fl=FALAS[f.dataset.food]||['Nham nham!'];say(c,fl[rnd(fl.length)]);[0,1,2].forEach(i=>fx(c,heart,{fy:.05,delay:i*200}));
    if(lv+1>=MAXLV)setTimeout(()=>{say(c,'Ai, que barrigão! Estou cheio! Preciso ir ao banheiro!',true);tone('sine',300,160,.4,.12)},400);
    setTimeout(()=>{f.style.visibility='';A(an(f),[{transform:'scale(0)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:420})},2600)}}

/* arrastar */
stage.addEventListener('pointerdown',e=>{const ent=e.target.closest('.ent');if(!ent||drag)return;e.preventDefault();actx();
  drag={ent,sx:e.clientX,sy:e.clientY,dx:0,dy:0,moved:false,raf:0};try{stage.setPointerCapture(e.pointerId)}catch(x){}});
stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;
  if(!drag.moved){if(Math.hypot(dx,dy)<9)return;drag.moved=true;const ent=drag.ent;if(ent.classList.contains('seated'))detach(ent);ent.classList.add('drag');ent.style.pointerEvents='none';pop(520)}
  drag.dx=dx;drag.dy=dy;if(!drag.raf)drag.raf=requestAnimationFrame(()=>{if(!drag)return;drag.raf=0;drag.ent.style.translate=`${drag.dx}px ${drag.dy}px`})});
function drop(e,cancel){if(!drag)return;const d=drag;drag=null;const ent=d.ent;cancelAnimationFrame(d.raf);
  if(!d.moved){if(!cancel)act(ent);return}
  ent.style.translate=`${d.dx}px ${d.dy}px`;const r=ent.getBoundingClientRect(),sr=stage.getBoundingClientRect();
  const under=cancel?null:document.elementFromPoint(e.clientX,e.clientY);ent.style.pointerEvents='';ent.style.translate='';ent.classList.remove('drag');
  const t=under&&under.closest?under.closest('.ent'):null;
  if(t&&t!==ent&&ent.classList.contains('char')&&t.dataset.seat&&!seated(t)){seat(ent,t);return}
  if(t&&t!==ent&&ent.classList.contains('food')&&t.classList.contains('char')){eat(ent,t);return}
  const x=Math.max(2,Math.min(98,(r.left+r.width/2-sr.left)/sr.width*100)),y=Math.max(12,Math.min(100,(r.bottom-sr.top)/sr.height*100));
  place(ent,x,y,+ent.dataset.w);A(an(ent),[{transform:'scale(1.1,.9)'},{transform:'scale(1)'}],{duration:220});pop(420)}
stage.addEventListener('pointerup',e=>drop(e,false));stage.addEventListener('pointercancel',e=>drop(e,true));
}
