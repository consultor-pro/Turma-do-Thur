/* Turma do Thur — Cozinhar: escolher a receita, colocar os ingredientes, mexer, ligar o fogo e servir na mesa */
'use strict';
{
const {$,$$,pop,speak,party,actx,cfg,rnd}=window.TH;
const OBJ='img/mundo/obj/';
/* ingrediente: [nome, emoji, cor dentro da panela, forma] */
const RECEITAS=[
  {id:'arroz',n:'Arroz',vaso:'panela',fogo:1,ing:[['Arroz','🌾','#FFF6DA','grao'],['Água','💧','#8FD3F5','agua'],['Sal','🧂','#FFFFFF','pó']],pronto:'#FFFDF4',fim:'Arroz soltinho, prontinho!'},
  {id:'feijao',n:'Feijão',vaso:'panela',fogo:1,ing:[['Feijão','🫘','#6B3420','grao'],['Água','💧','#8FD3F5','agua'],['Alho','🧄','#F3EBD3','grao']],pronto:'#5A2A18',fim:'Feijão caldoso, que cheiro bom!'},
  {id:'macarrao',n:'Macarrão',vaso:'panela',fogo:1,ing:[['Água','💧','#8FD3F5','agua'],['Macarrão','🍝','#FFD36B','fio'],['Molho de tomate','🍅','#E8452C','agua']],pronto:'#F28A3C',fim:'Macarrão com molho! Fluuup!'},
  {id:'carne',n:'Carne',vaso:'frigideira',fogo:1,ing:[['Carne','🥩','#E0786A','bife'],['Cebola','🧅','#F5E1EC','grao'],['Sal','🧂','#FFFFFF','pó']],pronto:'#8A3B22',fim:'Carninha douradinha!'},
  {id:'salada',n:'Salada',vaso:'tigela',fogo:0,ing:[['Alface','🥬','#7ED957','folha'],['Tomate','🍅','#F2453D','grao'],['Cenoura','🥕','#FF9F1C','grao']],pronto:null,fim:'Salada fresquinha e colorida!'}];
const C={r:null,step:'',added:0,mix:0,blobs:[]};
const K='stroke="#2E2440" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"';
function tone(type,f1,f2,dur,vol=.12,delay=0){if(!cfg.som)return;const a=actx();if(!a)return;try{const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02)}catch(e){}}
const plop=()=>{tone('sine',500,160,.18,.16);tone('sine',900,500,.08,.06,.05)};
const chiado=()=>{if(!cfg.som)return;const a=actx();if(!a)return;try{const n=a.sampleRate*2.6,b=a.createBuffer(1,n,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*.35*(1-i/n);const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();f.type='highpass';f.frequency.value=2500;g.gain.value=.25;s.buffer=b;s.connect(f).connect(g).connect(a.destination);s.start()}catch(e){}};

/* desenho da panela / frigideira / tigela, com o conteúdo dentro */
function vaso(r,cooked){
  const inner={panela:[150,96,104,22],frigideira:[150,110,112,22],tigela:[150,92,112,24]}[r.vaso];const [cx,cy,rx,ry]=inner;
  const blobs=C.blobs.map(b=>{const col=cooked&&r.pronto&&b.f!=='folha'&&b.f!=='fio'?r.pronto:b.c;
    if(b.f==='agua')return`<ellipse cx="${b.x}" cy="${b.y}" rx="${b.s*2.6}" ry="${b.s*.9}" fill="${col}" opacity=".85"/>`;
    if(b.f==='fio')return`<path d="M${b.x-18} ${b.y} q9 -12 18 0 t18 0" fill="none" stroke="${cooked?'#FFC94D':col}" stroke-width="5" stroke-linecap="round"/>`;
    if(b.f==='bife')return`<path d="M${b.x-30} ${b.y+6} c-6 -18 14 -26 30 -20 c20 -8 36 6 28 20 c-8 12 -48 14 -58 0z" fill="${col}" stroke="#2E2440" stroke-width="3"/>${cooked?`<path d="M${b.x-14} ${b.y+6} l14 -12 M${b.x+4} ${b.y+8} l14 -12" stroke="#5A2412" stroke-width="5" stroke-linecap="round"/>`:''}`;
    if(b.f==='folha')return`<path d="M${b.x} ${b.y+8} q-14 -20 2 -26 q16 8 -2 26z" fill="${col}" stroke="#2E2440" stroke-width="2.5"/>`;
    if(b.f==='pó')return`<circle cx="${b.x}" cy="${b.y}" r="2.6" fill="${col}" stroke="#ccc" stroke-width=".8"/>`;
    return`<ellipse cx="${b.x}" cy="${b.y}" rx="${b.s}" ry="${b.s*.6}" fill="${col}" stroke="rgba(46,36,64,.35)" stroke-width="1.2"/>`}).join('');
  const fill=C.blobs.length?`<ellipse cx="${cx}" cy="${cy+2}" rx="${rx-6}" ry="${ry-5}" fill="${cooked&&r.pronto?r.pronto:(C.blobs.find(b=>b.f==='agua')||C.blobs[0]).c}" opacity=".9"/>`:'';
  const inside=`<clipPath id="cpClip"><ellipse cx="${cx}" cy="${cy}" rx="${rx-4}" ry="${ry-3}"/></clipPath><g clip-path="url(#cpClip)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#3A2E4A"/>${fill}${blobs}</g>`;
  let body;
  if(r.vaso==='panela')body=`<path d="M22 112 h26 M252 112 h26" stroke="#2E2440" stroke-width="14" stroke-linecap="round"/><path d="M46 96 h208 v74 c0 26 -22 38 -46 38 h-116 c-24 0 -46 -12 -46 -38z" fill="#E8452C" ${K}/><path d="M66 120 v40" stroke="#FF8C7C" stroke-width="9" stroke-linecap="round"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#C7321F" ${K}/>`;
  else if(r.vaso==='frigideira')body=`<path d="M250 118 l42 -10" stroke="#2E2440" stroke-width="16" stroke-linecap="round"/><path d="M34 110 c0 40 40 58 116 58 s116 -18 116 -58z" fill="#3D3D4A" ${K}/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2B2B35" ${K}/>`;
  else body=`<path d="M36 92 c0 64 50 100 114 100 s114 -36 114 -100z" fill="#4FB3F0" ${K}/><path d="M60 128 c14 30 46 46 90 48" stroke="#9FD8FA" stroke-width="10" fill="none" stroke-linecap="round"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#2F8FCB" ${K}/>`;
  const fire=r.fogo&&C.step==='cozinhando'?`<g class="fogo"><path d="M110 236 c-10 -20 6 -30 6 -44 c12 14 18 24 10 44z" fill="#FF9F1C"/><path d="M146 238 c-14 -26 8 -38 6 -58 c18 18 24 34 12 58z" fill="#FF6B1C"/><path d="M182 236 c-10 -20 6 -30 6 -44 c12 14 18 24 10 44z" fill="#FF9F1C"/><path d="M140 236 c-4 -10 4 -16 6 -26 c8 10 10 18 4 26z" fill="#FFD60A"/></g>`:'';
  const stove=r.fogo?`<rect x="60" y="234" width="180" height="16" rx="8" fill="#9AA3AD" stroke="#2E2440" stroke-width="4"/>`:`<rect x="30" y="210" width="240" height="14" rx="7" fill="#E9C9A0" stroke="#2E2440" stroke-width="4"/>`;
  const steam=cooked&&r.fogo?`<g class="vapor"><path d="M110 70 q-12 -18 0 -36 q12 -18 0 -36"/><path d="M150 60 q-12 -18 0 -36 q12 -18 0 -36"/><path d="M190 70 q-12 -18 0 -36 q12 -18 0 -36"/></g>`:'';
  const spoon=`<g class="colher"><path d="M150 96 L226 6" stroke="#C98B4E" stroke-width="10" stroke-linecap="round"/><ellipse cx="150" cy="98" rx="14" ry="9" fill="#C98B4E" stroke="#2E2440" stroke-width="3"/></g>`;
  return`<svg viewBox="0 -10 300 270" xmlns="http://www.w3.org/2000/svg">${steam}${fire}${stove}${body}${inside}${C.step==='mexer'||C.step==='fogo'?spoon:''}</svg>`}
function drawPot(cooked=false){$('#cPot').innerHTML=vaso(C.r,cooked);$('#cPot').classList.toggle('acesa',C.step==='cozinhando');}

function setBtn(txt,show=true){const b=$('#cBtn');b.textContent=txt;b.hidden=!show}
function bar(k){$('#cBar').style.transform=`scaleX(${k})`}
function pick(){C.r=null;C.step='';$('#ckTitle').textContent='O que vamos cozinhar?';$('#cPick').hidden=false;$('#cPlay').hidden=true;
  $('#cPick').innerHTML=RECEITAS.map((r,i)=>`<button class="crec" data-i="${i}"><img src="${OBJ+r.id}.svg" alt=""><b>${r.n}</b></button>`).join('')}
function start(r){C.r=r;C.step='ing';C.added=0;C.mix=0;C.blobs=[];$('#ckTitle').textContent=r.n;$('#cPick').hidden=true;$('#cPlay').hidden=false;bar(0);
  $('#cIng').innerHTML=r.ing.map(([n,e],k)=>`<button class="cingb" data-k="${k}"><span>${e}</span><b>${n}</b></button>`).join('');
  setBtn('',false);drawPot();speak(`Vamos fazer ${r.n.toLowerCase()}! Coloque os ingredientes na ${r.vaso}!`)}
function addIng(k,btn){const r=C.r,[n,e,c,f]=r.ing[k];btn.disabled=true;btn.classList.add('usado');
  const pr=$('#cPot').getBoundingClientRect(),br=btn.getBoundingClientRect();const fly=document.createElement('span');fly.className='cfly';fly.textContent=e;document.body.appendChild(fly);
  fly.style.left=br.left+br.width/2+'px';fly.style.top=br.top+br.height/2+'px';
  const k2=fly.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:`translate(calc(-50% + ${(pr.left+pr.width/2-br.left-br.width/2)*.5}px),calc(-50% + ${(pr.top-br.top)-80}px)) scale(1.3)`,offset:.5},{transform:`translate(calc(-50% + ${pr.left+pr.width/2-br.left-br.width/2}px),calc(-50% + ${pr.top+pr.height*.35-br.top-br.height/2}px)) scale(.4)`}],{duration:650,easing:'ease-in-out'});
  k2.onfinish=()=>{fly.remove();plop();
    const cx=150,cy=C.r.vaso==='frigideira'?110:C.r.vaso==='tigela'?92:96;const cnt=f==='agua'?5:f==='bife'?1:f==='pó'?18:f==='folha'?9:f==='fio'?7:14;
    for(let i=0;i<cnt;i++){const a=Math.random()*6.28,d=Math.sqrt(Math.random());C.blobs.push({x:cx+Math.cos(a)*d*(f==='bife'?20:80),y:cy+Math.sin(a)*d*14,s:5+rnd(4),c,f})}
    drawPot();$('#cPot').animate([{transform:'scale(1)'},{transform:'scale(1.05,.95)'},{transform:'scale(1)'}],{duration:260});
    C.added++;bar(C.added/(r.ing.length+2));
    if(C.added===r.ing.length){C.step='mexer';C.mix=0;drawPot();setTimeout(()=>speak(r.fogo?'Agora mexa! Toque na panela para mexer!':'Agora misture! Toque na tigela!'),300);setBtn('',false)}};
  speak(n)}
function mexer(){if(C.step!=='mexer')return;C.mix++;const sp=$('#cPot .colher');if(sp)sp.animate([{transform:'rotate(0)'},{transform:'rotate(-14deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}],{duration:340});
  C.blobs.forEach(b=>{if(b.f!=='bife'){b.x+=rnd(22)-11;b.y+=rnd(8)-4}});tone('triangle',260+C.mix*30,200,.07,.08);
  const r=C.r;bar((r.ing.length+C.mix/6)/(r.ing.length+2));setTimeout(()=>{if(C.step==='mexer')drawPot()},170);
  if(C.mix>=6){if(r.fogo){C.step='fogo';drawPot();setBtn('🔥 Ligar o fogo');speak('Muito bem! Agora ligue o fogo!')}else finish()}}
function cozinhar(){if(C.step!=='fogo')return;C.step='cozinhando';setBtn('',false);drawPot();chiado();speak('Tchiii! Cozinhando... espere um pouquinho!');
  const t0=performance.now(),base=(C.r.ing.length+1)/(C.r.ing.length+2),dur=3200;
  const tick=t=>{const k=Math.min(1,(t-t0)/dur);bar(base+(1-base)*k);if(Math.random()<.18)tone('sine',300+rnd(400),700+rnd(300),.06,.05);
    if(Math.random()<.3){C.blobs.forEach(b=>{if(b.f==='agua'||b.f==='grao')b.y+=rnd(4)-2});drawPot()}
    if(k<1&&C.step==='cozinhando')requestAnimationFrame(tick);else if(C.step==='cozinhando')finish()};requestAnimationFrame(tick)}
function finish(){C.step='pronto';bar(1);drawPot(true);party();[0,.12,.24,.4].forEach((d,i)=>tone('sine',[523,659,784,1046][i],[523,659,784,1046][i]*1.01,.25,.12,d));
  speak(C.r.fim+' Leve para a mesa!');setBtn('🍽️ Servir na mesa')}
function servir(){const id=C.r.id;close();window.MUNDO.go('cozinha');
  setTimeout(()=>{const e=$(`#stage .ent.food[data-id="${id}"]`);if(!e)return;const an=e.querySelector('.an');
    window.MUNDO.A(an,[{transform:'scale(0) translateY(0)'},{transform:'scale(1.3) translateY(-20%)'},{transform:'scale(1)'}],{duration:620,easing:'cubic-bezier(.3,1.6,.6,1)'});
    for(let i=0;i<3;i++)window.MUNDO.fx(e,window.MUNDO.sparkle(['#FFD60A','#FF85C0','#4FB3F0'][i]),{fy:.2,delay:i*120});
    window.TH.speak('Comida na mesa! Arraste até um amigo para ele comer!','zuzu')},250)}
function open(){if(!$('#mundo').classList.contains('on')||!$('#cook').hidden)return;actx();pop(640);pick();$('#cook').hidden=false;speak('Vamos cozinhar! O que você quer fazer?')}
function close(){$('#cook').hidden=true;C.step=''}
window.openCook=open;
$('#mCook').onclick=open;
$('#cClose').onclick=()=>{pop(420);close()};
$('#cPick').onclick=e=>{const b=e.target.closest('.crec');if(!b)return;pop(560);start(RECEITAS[+b.dataset.i])};
$('#cIng').onclick=e=>{const b=e.target.closest('.cingb');if(!b||b.disabled||C.step!=='ing')return;actx();addIng(+b.dataset.k,b)};
$('#cPot').onclick=()=>{actx();if(C.step==='mexer')mexer();else if(C.step==='fogo')cozinhar();else if(C.step==='pronto')servir()};
$('#cBtn').onclick=()=>{actx();if(C.step==='fogo')cozinhar();else if(C.step==='pronto')servir()};
}
