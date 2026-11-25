/* Turma do Thur — Garagem: montar, abastecer e passear com os carrinhos */
'use strict';
{
const {$,$$,show,pop,speak,party,actx,cfg,rnd,onShow}=window.TH;
const OUT='#2E2440',ST=`stroke="${OUT}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const r=(x,y,w,h,f,rx=10)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${f}" ${ST}/>`;
const c=(x,y,rad,f)=>`<circle cx="${x}" cy="${y}" r="${rad}" fill="${f}" ${ST}/>`;
const p=(d,f)=>`<path d="${d}" fill="${f}" ${ST}/>`;
const wheel=(x,y,R,hub)=>`<g class="wh">${c(x,y,R,'#2B2B2B')}${c(x,y,R*.52,hub)}${[0,1,2,3].map(k=>{const a=k*Math.PI/2+.4;return`<circle cx="${(x+Math.cos(a)*R*.3).toFixed(1)}" cy="${(y+Math.sin(a)*R*.3).toFixed(1)}" r="${(R*.07).toFixed(1)}" fill="#8A8A8A"/>`}).join('')}</g>`;
const handle=(x,y)=>`<rect x="${x}" y="${y}" width="26" height="8" rx="4" fill="${OUT}"/>`;
const cap=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="#FFD60A" ${ST}/>`;
const glass='#BDE6FF';
const sedan=(body,door,extra='')=>({
  base:r(210,350,580,46,'#5A5A5A',20),
  corpo:p('M220 360 L220 270 Q220 240 252 236 L360 226 L440 150 Q456 134 480 134 L640 134 Q662 134 676 150 L742 226 L770 232 Q800 238 800 270 L800 360 Z',body),
  janelas:p('M452 156 L392 224 L540 224 L540 156 Z',glass)+p('M560 156 L560 224 L716 224 L664 156 Z',glass),
  porta1:r(392,236,148,108,door,12)+handle(500,256)+extra,
  porta2:r(560,236,156,108,door,12)+handle(676,256)+extra.replace(/466/g,'638'),
  farois:c(786,288,16,'#FFD60A')+r(222,276,18,26,'#FF9F1C',6),
});
const V=[
 {id:'carro',n:'Carro',fuel:[316,300],parts:(()=>{const s=sedan('#FF4D4D','#E83A3A');return[['base','base',s.base],['corpo','carroceria',s.corpo+cap(316,300)],['janelas','janela',s.janelas],['porta1','porta',s.porta1],['porta2','porta',s.porta2],['farois','farol',s.farois],['roda1','roda',wheel(330,392,58,'#FFD60A')],['roda2','roda',wheel(680,392,58,'#FFD60A')]]})()},
 {id:'policia',n:'Carro de polícia',fuel:[316,300],parts:(()=>{const st='<polygon points="466,262 474,282 496,284 479,298 484,320 466,308 448,320 453,298 436,284 458,282" fill="#FFD60A" stroke="#2E2440" stroke-width="3"/>';const s=sedan('#FFFFFF','#3D5AFE',st);return[['base','base',s.base],['corpo','carroceria',s.corpo+cap(316,300)],['janelas','janela',s.janelas],['porta1','porta',s.porta1],['porta2','porta',s.porta2],['sirene','sirene',r(510,108,52,28,'#FF4D4D',8)+r(562,108,52,28,'#3D5AFE',8)],['farois','farol',s.farois],['roda1','roda',wheel(330,392,58,'#BDE6FF')],['roda2','roda',wheel(680,392,58,'#BDE6FF')]]})()},
 {id:'bombeiro',n:'Caminhão de bombeiros',fuel:[586,300],parts:[
   ['base','base',r(180,360,640,44,'#5A5A5A',18)],
   ['caixa','carroceria',r(200,210,420,152,'#FF4D4D',16)+cap(586,300)],
   ['cabine','cabine',p('M630 362 L630 190 Q630 168 652 168 L730 168 Q754 168 766 190 L806 270 L806 362 Z','#FF4D4D')],
   ['janela','janela',p('M650 186 L728 186 L768 260 L650 260 Z',glass)],
   ['porta','porta',r(642,270,96,82,'#E83A3A',10)+handle(700,290)],
   ['painel1','porta',r(222,232,170,108,'#F4E9D8',10)+handle(290,282)],
   ['painel2','porta',r(412,232,170,108,'#F4E9D8',10)+handle(480,282)],
   ['escada','escada',r(206,168,420,24,'#C8C8C8',6)+[0,1,2,3,4,5,6,7,8].map(k=>`<rect x="${230+k*44}" y="172" width="8" height="16" fill="${OUT}"/>`).join('')],
   ['sirene','sirene',r(680,142,60,24,'#4FB3F0',8)],
   ['farol','farol',c(794,300,14,'#FFD60A')],
   ['roda1','roda',wheel(290,402,52,'#FFD60A')],['roda2','roda',wheel(470,402,52,'#FFD60A')],['roda3','roda',wheel(720,402,52,'#FFD60A')]]},
 {id:'onibus',n:'Ônibus escolar',fuel:[230,330],parts:[
   ['base','base',r(170,370,660,40,'#5A5A5A',18)],
   ['corpo','carroceria',r(180,140,640,240,'#FFD60A',34)+r(180,276,500,22,'#2B2B2B',4)+cap(230,330)],
   ['janelas','janela',r(212,170,104,84,glass,10)+r(336,170,104,84,glass,10)+r(460,170,104,84,glass,10)],
   ['porta','porta',r(690,170,92,190,glass,10)+`<path d="M736 172 V358" stroke="${OUT}" stroke-width="5"/>`],
   ['farol','farol',c(806,332,16,'#FFFFFF')+r(184,318,16,30,'#FF4D4D',6)],
   ['roda1','roda',wheel(300,402,56,'#BDBDBD')],['roda2','roda',wheel(660,402,56,'#BDBDBD')]]},
 {id:'ambulancia',n:'Ambulância',fuel:[240,320],parts:[
   ['base','base',r(190,360,620,44,'#5A5A5A',18)],
   ['corpo','carroceria',p('M200 362 L200 182 Q200 150 232 150 L600 150 L600 362 Z','#FFFFFF')+r(200,300,400,18,'#FF4D4D',2)+cap(240,320)],
   ['cabine','cabine',p('M600 362 L600 192 Q600 170 622 170 L700 170 Q724 170 738 192 L796 270 L800 362 Z','#FFFFFF')],
   ['janela','janela',p('M620 188 L700 188 L748 262 L620 262 Z',glass)],
   ['porta','porta',r(612,272,100,80,'#EDEDED',10)+handle(670,292)],
   ['cruz','cruz',p('M370 182 h60 v40 h40 v60 h-40 v40 h-60 v-40 h-40 v-60 h40 z','#FF4D4D')],
   ['sirene','sirene',r(370,122,90,28,'#FF4D4D',10)],
   ['farol','farol',c(790,300,14,'#FFD60A')],
   ['roda1','roda',wheel(300,402,52,'#BDBDBD')],['roda2','roda',wheel(690,402,52,'#BDBDBD')]]},
 {id:'trator',n:'Trator',fuel:[600,320],parts:[
   ['corpo','carroceria',p('M360 372 L360 250 L566 250 L566 290 L784 290 L784 372 Z','#4CC764')+cap(600,320)],
   ['cabine','janela',r(380,132,180,120,glass,10)+`<path d="M470 134 V250" stroke="${OUT}" stroke-width="5"/>`],
   ['teto','teto',r(364,112,212,24,'#FFD60A',8)],
   ['cano','escapamento',r(700,206,22,86,'#9A9A9A',6)],
   ['farol','farol',c(776,318,12,'#FFD60A')],
   ['grande','roda',wheel(420,366,98,'#FFD60A')],['pequena','roda',wheel(720,404,56,'#FFD60A')]]}
];
const done=()=>store().get('thur-carros',[]);
function store(){return{get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}}}
const carSvg=(v,vb='160 90 700 380',cls='')=>`<svg viewBox="${vb}" class="${cls}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.n}">${v.parts.map(([id,,s])=>`<g data-p="${id}">${s}</g>`).join('')}</svg>`;

/* sons */
function tone(type,f1,f2,dur,vol=.14,delay=0){if(!cfg.som)return;const a=actx();if(!a)return;try{const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02)}catch(e){}}
const honk=()=>{tone('square',440,420,.15,.07);tone('square',350,340,.2,.07,.18)};
const clank=()=>{tone('square',900,500,.06,.08);tone('triangle',300,200,.12,.12,.04)};

/* ---------- garagem ---------- */
function garage(){const d=done();$('#garGal').innerHTML=V.map((v,i)=>`<button class="card car" data-v="${i}">${carSvg(v)}${d.includes(v.id)?'<span class="badge"><svg viewBox="0 0 32 32"><path d="M6 17l7 7L26 9" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>':''}<span>${v.n}</span></button>`).join('')}
onShow.garagem=garage;
window.openGaragem=()=>show('garagem');
if($('#garagem').classList.contains('on'))garage();
$('#garGal').onclick=e=>{const b=e.target.closest('.card');if(b){pop(520);openMontar(+b.dataset.v)}};

/* ---------- montar ---------- */
const M={v:null,i:0,parts:[],drag:null,left:0};
const svgM=()=>$('#mStage svg');
function openMontar(i){M.i=i;M.v=V[i];$('#cTitle').textContent=M.v.n;$('#cNext').hidden=true;
  const ghost=M.v.parts.map(([,,s])=>s).join('').replace(/fill="[^"]*"/g,'fill="#E9DFCF"').replace(/stroke="#2E2440"/g,'stroke="#C7B79E"');
  $('#mStage').innerHTML=`<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet"><ellipse cx="500" cy="452" rx="380" ry="26" fill="rgba(0,0,0,.08)"/><g class="ghost">${ghost}</g>${M.v.parts.map(([id,nm,s],k)=>`<g class="part" data-k="${k}">${s}</g>`).join('')}</svg>`;
  M.need=true;show('montar');speak('Vamos montar o '+M.v.n.toLowerCase()+'!')}
onShow.montar=()=>{if(M.need){M.need=false;requestAnimationFrame(scatter)}};
function scatter(){const s=svgM();if(!s)return;const gs=[...s.querySelectorAll('.part')];
  const slots=[[80,80],[80,200],[80,320],[80,450],[920,80],[920,200],[920,320],[920,450],[320,50],[500,50],[680,50],[320,515],[500,515],[680,515]];
  const order=gs.map((_,k)=>k).sort(()=>Math.random()-.5);M.left=gs.length;
  gs.forEach((g,n)=>{const b=g.getBBox();g._c=[b.x+b.width/2,b.y+b.height/2];const sl=slots[order.indexOf(n)%slots.length];const sc=Math.min(1,118/Math.max(b.width,b.height));g._slot={x:sl[0],y:sl[1],s:sc};g._done=false;setT(g,sl[0],sl[1],sc,false)})}
function setT(g,x,y,s,anim){g.style.transition=anim?'transform .35s cubic-bezier(.3,1.4,.6,1)':'none';g.style.transform=`translate(${x}px,${y}px) scale(${s}) translate(${-g._c[0]}px,${-g._c[1]}px)`}
const toPt=(s,e)=>{const q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(s.getScreenCTM().inverse())};
$('#mStage').addEventListener('pointerdown',e=>{const g=e.target.closest('.part');if(!g||g._done)return;e.preventDefault();actx();const s=svgM();const q=toPt(s,e);
  g.parentNode.appendChild(g);M.drag={g,ox:q.x-g._slot.x,oy:q.y-g._slot.y,x:g._slot.x,y:g._slot.y};setT(g,g._slot.x,g._slot.y,1,true);pop(520);try{$('#mStage').setPointerCapture(e.pointerId)}catch(x){}});
$('#mStage').addEventListener('pointermove',e=>{const d=M.drag;if(!d)return;const q=toPt(svgM(),e);d.x=q.x-d.ox;d.y=q.y-d.oy;if(!d.raf)d.raf=requestAnimationFrame(()=>{d.raf=0;if(M.drag)setT(d.g,d.x,d.y,1,false)})});
function mDrop(){const d=M.drag;if(!d)return;M.drag=null;cancelAnimationFrame(d.raf);const g=d.g;
  if(Math.hypot(d.x-g._c[0],d.y-g._c[1])<80){g._done=true;g.style.transition='transform .25s ease-out';g.style.transform='none';
    const parts=[...svgM().querySelectorAll('.part')];parts.sort((a,b)=>a.dataset.k-b.dataset.k).forEach(x=>x.parentNode.appendChild(x));
    clank();speak(M.v.parts[+g.dataset.k][1]);M.left--;if(!M.left)setTimeout(finishBuild,450)}
  else{setT(g,g._slot.x,g._slot.y,g._slot.s,true);pop(300)}}
$('#mStage').addEventListener('pointerup',mDrop);$('#mStage').addEventListener('pointercancel',mDrop);
function finishBuild(){svgM().querySelector('.ghost').style.display='none';honk();setTimeout(()=>window.CARROS.afterBuild(),700);
  const s=svgM();s.classList.add('built');const d=done();if(!d.includes(M.v.id)){d.push(M.v.id);store().set('thur-carros',d)}$('#cNext').hidden=false}
$('#cNext').onclick=()=>{pop(600);openPosto()};
$('#cAgain').onclick=()=>{pop(330);openMontar(M.i)};

/* ---------- abastecer ---------- */
const F={att:false,fill:0,drag:null,raf:0};
function openPosto(){F.att=false;F.fill=0;$('#gauge i').style.transform='scaleX(0)';$('#fNext').hidden=true;
  $('#fCar').innerHTML=carSvg(M.v,'160 90 700 380');show('posto');setTimeout(()=>{placeNoz(0,0,true);speak('Coloque a mangueira no tanque!')},350)}
function capPos(){const s=$('#fCar svg'),pt=s.createSVGPoint();pt.x=M.v.fuel[0];pt.y=M.v.fuel[1];const q=pt.matrixTransform(s.getScreenCTM()),sr=$('#fScene').getBoundingClientRect();return[q.x-sr.left,q.y-sr.top]}
function pumpPos(){const b=$('#pump').getBoundingClientRect(),sr=$('#fScene').getBoundingClientRect();return[b.left+b.width*.82-sr.left,b.top+b.height*.42-sr.top]}
function placeNoz(x,y,home){const n=$('#noz'),[px,py]=pumpPos();if(home){x=px+30;y=py+70}n.style.transform=`translate(${x-26}px,${y-26}px)`;const sag=Math.max(40,Math.abs(x-px)*.35);$('#hose path').setAttribute('d',`M${px} ${py} C${px+40} ${py+sag+60} ${x-40} ${y+sag} ${x} ${y}`);F.pos=[x,y]}
$('#noz').addEventListener('pointerdown',e=>{if(F.att)return;e.preventDefault();actx();F.drag=true;try{$('#noz').setPointerCapture(e.pointerId)}catch(x){}pop(520)});
$('#noz').addEventListener('pointermove',e=>{if(!F.drag)return;const sr=$('#fScene').getBoundingClientRect();F.nx=e.clientX-sr.left;F.ny=e.clientY-sr.top;if(!F.raf)F.raf=requestAnimationFrame(()=>{F.raf=0;placeNoz(F.nx,F.ny)})});
function fDrop(){if(!F.drag)return;F.drag=false;const [cx,cy]=capPos();if(F.pos&&Math.hypot(F.pos[0]-cx,F.pos[1]-cy)<70){F.att=true;placeNoz(cx,cy);clank();fillUp()}else{placeNoz(0,0,true);pop(300)}}
$('#noz').addEventListener('pointerup',fDrop);$('#noz').addEventListener('pointercancel',fDrop);
function fillUp(){const t0=performance.now();const g=$('#gauge i');const step=t=>{const k=Math.min(1,(t-t0)/2600);g.style.transform=`scaleX(${k})`;if(Math.random()<.12)tone('sine',200+k*400,260+k*400,.08,.06);if(k<1)requestAnimationFrame(step);else{party();speak('Tanque cheio! Vamos para a pista!');$('#fNext').hidden=false}};requestAnimationFrame(step)}
$('#fNext').onclick=()=>{pop(600);window.CARROS.openPista()};

/* ---------- passear ---------- */
const R={run:false,stars:[],got:0,jump:0,last:0,spawn:0};
function openEstrada(){$('#eCar').innerHTML=carSvg(M.v,'160 90 700 380');R.got=0;R.stars.forEach(s=>s.el.remove());R.stars=[];$('#eCount').textContent='0';show('estrada');setTimeout(()=>{R.run=true;R.last=performance.now();requestAnimationFrame(loop);speak('Pule para pegar as estrelas!')},400)}
const ASP={clouds:4.5,hills:800/240,trees:640/220,lane:2.5};
function sizeStrips(){$$('#eScene .strip').forEach(el=>{const k=[...el.classList].find(x=>ASP[x]);el.style.setProperty('--tw',(el.clientHeight*ASP[k]).toFixed(1)+'px')})}
onShow.estrada=()=>requestAnimationFrame(sizeStrips);
new ResizeObserver(()=>{if($('#estrada').classList.contains('on'))sizeStrips()}).observe($('#eScene'));
function spawnStar(){const sc=$('#eScene'),h=sc.clientHeight;const el=document.createElement('div');el.className='estar';el.innerHTML='<svg viewBox="0 0 32 32"><path d="M16 2l4.2 9 9.8 1.2-7.2 6.8 1.9 9.8L16 24 7.3 28.8l1.9-9.8L2 12.2 11.8 11z" fill="#FFD60A" stroke="#fff" stroke-width="2"/></svg>';sc.appendChild(el);
  const high=Math.random()<.6;R.stars.push({el,x:sc.clientWidth+40,y:high?h*.30:h*.58})}
function loop(t){if(!R.run)return;if(!$('#estrada').classList.contains('on')){R.run=false;return}const dt=Math.min(50,t-R.last);R.last=t;
  R.spawn-=dt;if(R.spawn<=0){spawnStar();R.spawn=1100+rnd(900)}
  const car=$('#eCar');if(R.jump>0){R.jump=Math.max(0,R.jump-dt);const k=1-R.jump/900;car.style.transform=`translateY(${-Math.sin(k*Math.PI)*42}%)`}else car.style.transform='';
  const cr=car.getBoundingClientRect(),sr=$('#eScene').getBoundingClientRect();
  R.stars=R.stars.filter(s=>{s.x-=dt*.32;s.el.style.transform=`translate(${s.x}px,${s.y}px)`;const sx=sr.left+s.x+24,sy=sr.top+s.y+24;
    if(sx>cr.left+cr.width*.1&&sx<cr.right-cr.width*.1&&sy>cr.top&&sy<cr.bottom-cr.height*.15){s.el.remove();R.got++;$('#eCount').textContent=R.got;tone('sine',880,1760,.15,.12);if(R.got>=10)finishDrive();return false}
    if(s.x<-60){s.el.remove();return false}return true});
  requestAnimationFrame(loop)}
function jump(){if(R.jump>0)return;R.jump=900;tone('sine',300,700,.25,.12)}
$('#eScene').addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;actx();jump()});
$('#eJump').onclick=jump;$('#eHonk').onclick=()=>{actx();honk();const sv=$('#eCar svg');if(sv)sv.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:250})};
window.CARROS={V,M,carSvg,openPosto};
function finishDrive(){R.run=false;R.stars.forEach(s=>s.el.remove());R.stars=[];TH.complete(null,()=>show('garagem'))}
}

/* ---------- parabéns e pista (versão 4.2) ---------- */
{
const {$,$$,show,pop,speak,party,actx,cfg,rnd,onShow}=window.TH;
const V=window.CARROS.V,M=window.CARROS.M,carSvg=window.CARROS.carSvg;
function fanfare(){if(!cfg.som)return;const a=actx();if(!a)return;[523,659,784,1047,784,1047].forEach((f,i)=>{try{const t=a.currentTime+i*.14,o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.16,t);g.gain.exponentialRampToValueAtTime(.001,t+(i>3?.45:.18));o.connect(g).connect(a.destination);o.start(t);o.stop(t+.5)}catch(e){}})}
let pBtns=[];
function parabens(title,sub,svg,buttons,sticker){$('#pbT').innerHTML=[...title].map((ch,i)=>`<span style="color:${['#FF4D4D','#FF9F1C','#F5B800','#4CC764','#4FB3F0','#9B5DE5','#FF85C0'][i%7]};animation-delay:${i*60}ms">${ch===' '?'&nbsp;':ch}</span>`).join('');
  $('#pbS').textContent=sub;$('#pbCar').innerHTML=svg||'';$('#pbSt').textContent=sticker||'';$('#pbSt').hidden=!sticker;
  $('#pbB').innerHTML=buttons.map((b,i)=>`<button class="pbtn${i===0?' go2 bigb':''}" data-i="${i}">${b[0]}</button>`).join('');pBtns=buttons;
  $('#parab').classList.add('on');party();setTimeout(party,900);fanfare();speak(title+' '+sub)}
$('#pbB').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;$('#parab').classList.remove('on');pop(600);pBtns[+b.dataset.i][1]()};
window.CARROS.parabens=parabens;
window.CARROS.afterBuild=()=>parabens('Parabéns!','Você montou o '+M.v.n.toLowerCase()+'!',carSvg(M.v),[['Ir para a pista',()=>openPista()],['Abastecer',()=>window.CARROS.openPosto()],['Garagem',()=>show('garagem')]]);

/* pista: o carro anda sobre morros e rampas */
const pcv=$('#pcv'),px=pcv.getContext('2d');
const PTS=[[0,430],[700,430],[1100,330],[1500,430],[1850,350],[1930,440],[2300,430],[2500,400],[2650,430],[2800,395],[2950,430],[3300,430],[3800,250],[4300,440],[4700,430],[5050,340],[5120,445],[5500,430],[5700,380],[5900,430],[6100,385],[6300,430],[7400,430]];
const END=6900,G=1500;
function g(x){if(x<=0)return PTS[0][1];for(let i=1;i<PTS.length;i++){const [x1,y1]=PTS[i];if(x<=x1){const [x0,y0]=PTS[i-1];const t=(x-x0)/(x1-x0);return y0+(y1-y0)*(1-Math.cos(Math.PI*t))/2}}return PTS[PTS.length-1][1]}
const S={on:false,x:120,v:0,y:430,vy:0,air:false,ang:0,gas:false,brake:false,stars:[],got:0,body:null,wh:[],k:1,camY:300,last:0,spin:0,done:false,eng:null};
function prep(v){const wh=[];const parts=v.parts.filter(([, ,s])=>{const m=s.match(/^<g class="wh"><circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/);if(m){wh.push({cx:+m[1],cy:+m[2],r:+m[3],s});return false}return true});
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="160 90 700 380" width="1400" height="760">${parts.map(([,,s])=>s).join('')}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const wims=wh.map(w=>{const i=new Image();const R=w.r+4;i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${w.cx-R} ${w.cy-R} ${R*2} ${R*2}" width="${R*4}" height="${R*4}">${w.s}</svg>`);return i});
  S.body=im;S.wh=wh.map((w,i)=>({...w,im:wims[i]}));
  const xs=S.wh.map(w=>w.cx);S.rearX=Math.min(...xs);S.frontX=Math.max(...xs);S.bottom=Math.max(...S.wh.map(w=>w.cy+w.r))}
const SC=250/700;
function openPista(){const v=M.v;prep(v);Object.assign(S,{x:120,v:0,y:g(120),vy:0,air:false,ang:0,got:0,done:false,gas:false,brake:false});
  S.stars=[];for(let x=500;x<END-200;x+=260){const high=[1930,5120].some(r=>Math.abs(x-r-150)<160);S.stars.push({x,y:g(x)-(high?150:70),got:false})}
  $('#psCount').textContent='0';$('#psTot').textContent=S.stars.length;$('#pTitle2').textContent=v.n;show('pista');
  setTimeout(()=>{fitP();S.on=true;S.last=performance.now();requestAnimationFrame(tick);speak('Segure o pedal verde para acelerar!')},380)}
window.CARROS.openPista=openPista;
function fitP(){const r=pcv.parentElement.getBoundingClientRect();if(!r.width)return;const d=Math.min(devicePixelRatio||1,2);pcv.width=r.width*d;pcv.height=r.height*d;S.W=r.width;S.H=r.height;S.d=d;S.k=Math.min(r.height/560,r.width/760)}
new ResizeObserver(()=>{if($('#pista').classList.contains('on'))fitP()}).observe($('#pPaper'));
function engine(on){if(!cfg.som)return;const a=actx();if(!a)return;try{if(!S.eng){const o=a.createOscillator(),f=a.createBiquadFilter(),gn=a.createGain();o.type='sawtooth';o.frequency.value=60;f.type='lowpass';f.frequency.value=500;gn.gain.value=0;o.connect(f).connect(gn).connect(a.destination);o.start();S.eng={o,gn}}
  S.eng.gn.gain.setTargetAtTime(on?.05:0,a.currentTime,.1)}catch(e){}}
function tick(t){if(!S.on)return;if(!$('#pista').classList.contains('on')){S.on=false;engine(false);return}const dt=Math.min(.04,(t-S.last)/1000);S.last=t;
  if(!S.done){if(S.gas)S.v+=380*dt;else if(S.brake)S.v-=700*dt;else S.v-=120*dt;S.v=Math.max(0,Math.min(560,S.v))}else S.v=Math.max(0,S.v-500*dt);
  const slope=(g(S.x+2)-g(S.x-2))/4;if(!S.air)S.v=Math.max(0,S.v+slope*260*dt);
  S.x+=S.v*dt;
  if(S.air){S.vy+=G*dt;S.y+=S.vy*dt;const gy=g(S.x);if(S.y>=gy){S.y=gy;S.air=false;TH.pop(260)}}
  else{const ny=S.y+slope*S.v*dt,gy=g(S.x);if(gy-ny>3&&S.v>220){S.air=true;S.vy=slope*S.v;S.y=ny}else S.y=gy}
  const wb=(S.frontX-S.rearX)*SC;const target=S.air?S.ang*.97:Math.atan2(g(S.x+wb/2)-g(S.x-wb/2),wb);S.ang+=(target-S.ang)*Math.min(1,dt*12);
  S.spin+=S.v*dt;
  if(S.eng&&cfg.som)try{S.eng.o.frequency.setTargetAtTime(55+S.v*.25,actx().currentTime,.1)}catch(e){}
  S.stars.forEach(s=>{if(!s.got&&Math.abs(s.x-S.x)<70&&Math.abs(s.y-(S.y-60))<90){s.got=true;S.got++;$('#psCount').textContent=S.got;TH.pop(900)}});
  if(!S.done&&S.x>=END){S.done=true;S.gas=false;engine(false);setTimeout(()=>{const st=TH.award();parabens('Parabéns!',`Você chegou ao final com ${S.got} estrelas!`,carSvg(M.v),[['Correr de novo',()=>openPista()],['Garagem',()=>show('garagem')]],st)},900)}
  draw();requestAnimationFrame(tick)}
function draw(){const {W,H,d,k}=S;if(!W)return;px.setTransform(d,0,0,d,0,0);const vw=W/k,vh=H/k;
  const sky=px.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#7CCBFF');sky.addColorStop(1,'#D8F1FF');px.fillStyle=sky;px.fillRect(0,0,W,H);
  px.scale(k,k);const camX=S.x-vw*.3;S.camY+=((S.y-vh*.62)-S.camY)*.08;const camY=Math.min(S.camY,0);
  px.fillStyle='#fff';for(let i=0;i<6;i++){const cx=((i*420-camX*.15)%2520+2520)%2520-200,cy=70+(i%3)*40;px.beginPath();px.ellipse(cx,cy-camY*.1,60,22,0,0,7);px.ellipse(cx+40,cy-14-camY*.1,40,24,0,0,7);px.fill()}
  px.fillStyle='#A9DD8C';px.beginPath();px.moveTo(0,vh);for(let x=0;x<=vw+20;x+=20){const wx=x+camX*.35;px.lineTo(x,330-camY*.35+Math.sin(wx/260)*40+Math.sin(wx/97)*12)}px.lineTo(vw,vh);px.fill();
  px.save();px.translate(-camX,-camY);
  for(let tx=Math.floor((camX-100)/430)*430;tx<camX+vw+100;tx+=430){if(tx<100)continue;const ty=g(tx)+8;px.fillStyle='#A0663C';px.fillRect(tx-7,ty-70,14,72);px.fillStyle=tx%860?'#4CC764':'#3FB35A';px.beginPath();px.arc(tx,ty-92,40,0,7);px.fill();px.strokeStyle='#2E2440';px.lineWidth=4;px.stroke()}
  const x0=camX-40,x1=camX+vw+40;px.beginPath();px.moveTo(x0,vh+camY+400);for(let x=x0;x<=x1;x+=8)px.lineTo(x,g(x)+10);px.lineTo(x1,vh+camY+400);px.closePath();px.fillStyle='#C98B4E';px.fill();
  px.beginPath();for(let x=x0;x<=x1;x+=8){x===x0?px.moveTo(x,g(x)+14):px.lineTo(x,g(x)+14)}px.strokeStyle='#6CC24A';px.lineWidth=18;px.stroke();
  px.beginPath();for(let x=x0;x<=x1;x+=8){x===x0?px.moveTo(x,g(x)+2):px.lineTo(x,g(x)+2)}px.strokeStyle='#5A5A66';px.lineWidth=20;px.lineJoin='round';px.stroke();
  px.setLineDash([22,22]);px.lineDashOffset=0;px.strokeStyle='#fff';px.lineWidth=3;px.stroke();px.setLineDash([]);
  [[END,'#2E2440']].forEach(([fx])=>{const fy=g(fx);px.fillStyle='#2E2440';px.fillRect(fx-60,fy-150,8,150);px.fillRect(fx+52,fy-150,8,150);for(let i=0;i<14;i++)for(let j=0;j<3;j++){px.fillStyle=(i+j)%2?'#2E2440':'#fff';px.fillRect(fx-52+i*8,fy-150+j*12,8,12)}});
  {const sx=120,sy=g(sx);px.fillStyle='#FF4D4D';px.fillRect(sx-80,sy-110,6,110);px.beginPath();px.moveTo(sx-74,sy-110);px.lineTo(sx-30,sy-96);px.lineTo(sx-74,sy-82);px.fill()}
  S.stars.forEach(s=>{if(s.got||s.x<x0||s.x>x1)return;star(s.x,s.y+Math.sin((performance.now()/300)+s.x)*5,22)});
  const sc=SC,bw=700*sc,bh=380*sc,pivX=((S.rearX+S.frontX)/2-160)*sc,pivY=(S.bottom-90)*sc;
  px.save();px.translate(S.x,S.y);px.rotate(S.ang);
  if(S.body&&S.body.complete)px.drawImage(S.body,-pivX,-pivY,bw,bh);
  S.wh.forEach(w=>{const R=(w.r+4)*sc;px.save();px.translate((w.cx-160)*sc-pivX,(w.cy-90)*sc-pivY);px.rotate(S.spin/(w.r*sc));if(w.im.complete)px.drawImage(w.im,-R,-R,R*2,R*2);px.restore()});
  px.restore();px.restore();
  const prog=Math.min(1,S.x/END);px.fillStyle='rgba(255,255,255,.8)';px.fillRect(vw*.25,14,vw*.5,10);px.fillStyle='#4CC764';px.fillRect(vw*.25,14,vw*.5*prog,10)}
function star(x,y,r){px.beginPath();for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,rr=i%2?r*.45:r;px.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}px.closePath();px.fillStyle='#FFD60A';px.fill();px.strokeStyle='#fff';px.lineWidth=3;px.stroke()}
const hold=(el,key)=>{const on=e=>{e.preventDefault();actx();S[key]=true;el.classList.add('down');if(key==='gas')engine(true)},off=()=>{S[key]=false;el.classList.remove('down');if(key==='gas')engine(false)};
  el.addEventListener('pointerdown',on);el.addEventListener('pointerup',off);el.addEventListener('pointercancel',off);el.addEventListener('pointerleave',off)};
hold($('#gasP'),'gas');hold($('#brkP'),'brake');
pcv.addEventListener('pointerdown',e=>{const r=pcv.getBoundingClientRect();if(e.clientX>r.left+r.width/2){actx();S.gas=true;engine(true)}else S.brake=true});
const pOff=()=>{if(!$('#gasP').classList.contains('down'))S.gas=false;if(!$('#brkP').classList.contains('down'))S.brake=false;engine(S.gas)};
pcv.addEventListener('pointerup',pOff);pcv.addEventListener('pointercancel',pOff);
document.addEventListener('keydown',e=>{if(!$('#pista').classList.contains('on'))return;if(e.key==='ArrowRight'){S.gas=true;engine(true)}if(e.key==='ArrowLeft')S.brake=true});
document.addEventListener('keyup',e=>{if(e.key==='ArrowRight'){S.gas=false;engine(false)}if(e.key==='ArrowLeft')S.brake=false});
$('#pRestart').onclick=()=>{pop(330);openPista()};
}
