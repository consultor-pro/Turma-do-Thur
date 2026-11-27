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
 {id:'carro',n:'Carro',main:'#FF4D4D',dark:'#E83A3A',dec:[638,300],spo:[262,234],ant:[600,136],fuel:[316,300],parts:(()=>{const s=sedan('#FF4D4D','#E83A3A');return[['base','base',s.base],['corpo','carroceria',s.corpo+cap(316,300)],['janelas','janela',s.janelas],['porta1','porta',s.porta1],['porta2','porta',s.porta2],['farois','farol',s.farois],['roda1','roda',wheel(330,392,58,'#FFD60A')],['roda2','roda',wheel(680,392,58,'#FFD60A')]]})()},
 {id:'policia',n:'Carro de polícia',main:'#FFFFFF',dec:[300,300],spo:[262,234],ant:[480,136],fuel:[316,300],parts:(()=>{const st='<polygon points="466,262 474,282 496,284 479,298 484,320 466,308 448,320 453,298 436,284 458,282" fill="#FFD60A" stroke="#2E2440" stroke-width="3"/>';const s=sedan('#FFFFFF','#3D5AFE',st);return[['base','base',s.base],['corpo','carroceria',s.corpo+cap(316,300)],['janelas','janela',s.janelas],['porta1','porta',s.porta1],['porta2','porta',s.porta2],['sirene','sirene',r(510,108,52,28,'#FF4D4D',8)+r(562,108,52,28,'#3D5AFE',8)],['farois','farol',s.farois],['roda1','roda',wheel(330,392,58,'#BDE6FF')],['roda2','roda',wheel(680,392,58,'#BDE6FF')]]})()},
 {id:'bombeiro',n:'Caminhão de bombeiros',main:'#FF4D4D',dark:'#E83A3A',dec:[690,312],spo:[230,206],ant:[650,170],fuel:[586,300],parts:[
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
 {id:'onibus',n:'Ônibus escolar',main:'#FFD60A',dec:[560,334],spo:[214,142],ant:[620,142],fuel:[230,330],parts:[
   ['base','base',r(170,370,660,40,'#5A5A5A',18)],
   ['corpo','carroceria',r(180,140,640,240,'#FFD60A',34)+r(180,276,500,22,'#2B2B2B',4)+cap(230,330)],
   ['janelas','janela',r(212,170,104,84,glass,10)+r(336,170,104,84,glass,10)+r(460,170,104,84,glass,10)],
   ['porta','porta',r(690,170,92,190,glass,10)+`<path d="M736 172 V358" stroke="${OUT}" stroke-width="5"/>`],
   ['farol','farol',c(806,332,16,'#FFFFFF')+r(184,318,16,30,'#FF4D4D',6)],
   ['roda1','roda',wheel(300,402,56,'#BDBDBD')],['roda2','roda',wheel(660,402,56,'#BDBDBD')]]},
 {id:'ambulancia',n:'Ambulância',main:'#FFFFFF',dec:[690,312],spo:[232,150],ant:[560,150],fuel:[240,320],parts:[
   ['base','base',r(190,360,620,44,'#5A5A5A',18)],
   ['corpo','carroceria',p('M200 362 L200 182 Q200 150 232 150 L600 150 L600 362 Z','#FFFFFF')+r(200,300,400,18,'#FF4D4D',2)+cap(240,320)],
   ['cabine','cabine',p('M600 362 L600 192 Q600 170 622 170 L700 170 Q724 170 738 192 L796 270 L800 362 Z','#FFFFFF')],
   ['janela','janela',p('M620 188 L700 188 L748 262 L620 262 Z',glass)],
   ['porta','porta',r(612,272,100,80,'#EDEDED',10)+handle(670,292)],
   ['cruz','cruz',p('M370 182 h60 v40 h40 v60 h-40 v40 h-60 v-40 h-40 v-60 h40 z','#FF4D4D')],
   ['sirene','sirene',r(370,122,90,28,'#FF4D4D',10)],
   ['farol','farol',c(790,300,14,'#FFD60A')],
   ['roda1','roda',wheel(300,402,52,'#BDBDBD')],['roda2','roda',wheel(690,402,52,'#BDBDBD')]]},
 {id:'trator',n:'Trator',main:'#4CC764',dec:[470,320],spo:[600,292],ant:[540,114],fuel:[600,320],parts:[
   ['corpo','carroceria',p('M360 372 L360 250 L566 250 L566 290 L784 290 L784 372 Z','#4CC764')+cap(600,320)],
   ['cabine','janela',r(380,132,180,120,glass,10)+`<path d="M470 134 V250" stroke="${OUT}" stroke-width="5"/>`],
   ['teto','teto',r(364,112,212,24,'#FFD60A',8)],
   ['cano','escapamento',r(700,206,22,86,'#9A9A9A',6)],
   ['farol','farol',c(776,318,12,'#FFD60A')],
   ['grande','roda',wheel(420,366,98,'#FFD60A')],['pequena','roda',wheel(720,404,56,'#FFD60A')]]},
 /* carros de corrida (inspirados em superesportivos, sem marcas) */
 {id:'super',n:'Super Vermelho',main:'#E8231D',dark:'#B5170F',dec:[520,316],spo:[250,262],ant:[560,208],fuel:[250,320],parts:[
   ['base','base',r(206,350,596,34,'#3A3A3A',16)],
   ['corpo','carroceria',p('M196 360 L196 326 Q198 306 226 302 L350 290 Q420 238 482 234 L590 234 Q646 238 706 286 L796 304 Q816 310 816 332 L816 360 Z','#E8231D')+p('M616 306 Q654 302 680 324 L644 340 Z','#B5170F')+r(196,336,620,8,'#FFFFFF',4)],
   ['janelas','janela',p('M488 248 L440 284 L668 284 L630 248 Z',glass)+`<path d="M566 248 V284" stroke="${OUT}" stroke-width="5"/>`],
   ['porta','porta',r(430,292,176,40,'#B5170F',12)+handle(566,302)],
   ['asa','aerofólio',p('M200 270 L200 250 L292 250 L300 270 Z','#2B2B2B')+`<path d="M246 272 V300" stroke="${OUT}" stroke-width="8"/>`],
   ['farois','farol',p('M774 300 L812 312 L808 322 L766 312 Z','#FFF6B0')+r(200,308,16,16,'#FF4D4D',5)],
   ['roda1','roda',wheel(326,386,54,'#D9D9D9')],['roda2','roda',wheel(696,386,54,'#D9D9D9')]]},
 {id:'classico',n:'Clássico Veloz',main:'#9BD3F7',dark:'#6FB7E8',dec:[470,312],spo:[236,268],ant:[600,192],fuel:[250,320],parts:[
   ['base','base',r(206,350,596,34,'#3A3A3A',16)],
   ['corpo','carroceria',p('M200 360 L200 316 Q200 286 236 280 L320 270 Q360 186 470 180 Q580 176 660 240 Q700 268 760 280 Q806 290 806 324 L806 360 Z','#9BD3F7')],
   ['janelas','janela',p('M394 264 Q420 206 470 200 L520 200 L520 264 Z',glass)+p('M540 200 Q596 204 638 264 L540 264 Z',glass)],
   ['porta','porta',r(398,276,156,66,'#6FB7E8',16)+handle(516,292)],
   ['farois','farol',c(756,284,16,'#FFF6B0')+r(204,298,16,20,'#FF4D4D',6)],
   ['faixa','faixa',r(240,322,560,12,'#FFFFFF',6)],
   ['roda1','roda',wheel(322,386,54,'#EDEDED')],['roda2','roda',wheel(694,386,54,'#EDEDED')]]},
 {id:'raio',n:'Raio Amarelo',main:'#FFC300',dark:'#E0A200',dec:[520,316],spo:[244,256],ant:[560,206],fuel:[250,320],parts:[
   ['base','base',r(206,350,600,34,'#3A3A3A',10)],
   ['corpo','carroceria',p('M194 360 L194 328 L240 314 L404 294 L494 238 L612 234 L716 284 L820 314 L820 360 Z','#FFC300')+p('M616 304 L672 300 L656 336 L608 332 Z','#2B2B2B')+p('M194 344 L820 344 L820 350 L194 350 Z','#2B2B2B')],
   ['janelas','janela',p('M500 250 L452 286 L656 286 L608 248 Z',glass)],
   ['porta','porta',p('M432 296 L606 296 L598 338 L440 338 Z','#E0A200')+handle(556,306)],
   ['asa','aerofólio',p('M196 268 L196 248 L300 244 L306 266 Z','#2B2B2B')+`<path d="M232 270 V310 M276 268 V306" stroke="${OUT}" stroke-width="7"/>`],
   ['farois','farol',p('M770 304 L818 318 L814 326 L762 314 Z','#FFFFFF')+p('M198 318 L232 312 L232 324 L198 328 Z','#FF4D4D')],
   ['roda1','roda',wheel(330,386,56,'#555555')],['roda2','roda',wheel(694,386,56,'#555555')]]},
 {id:'formula',n:'Fórmula Thur',main:'#3D5AFE',dark:'#2A40C9',dec:[420,306],spo:[230,212],ant:[520,190],fuel:[300,320],parts:[
   ['corpo','carroceria',p('M206 352 L206 302 L300 300 L360 288 L460 272 L560 252 L650 272 L820 330 L820 352 Z','#3D5AFE')],
   ['piloto','piloto',c(540,236,26,'#FFD60A')+p('M524 230 h34 v12 h-34 z','#2B2B2B')],
   ['santo','arco',p('M498 268 L512 214 L530 214 L522 268 Z','#2A40C9')],
   ['asaf','asa da frente',r(764,334,92,16,'#2A40C9',4)],
   ['asat','asa de trás',r(186,212,72,18,'#2A40C9',4)+`<path d="M222 230 V300" stroke="${OUT}" stroke-width="10"/>`],
   ['numero','número',c(420,306,22,'#FFFFFF')+`<text x="420" y="315" text-anchor="middle" font-size="26" font-weight="800" font-family="Baloo 2,sans-serif" fill="${OUT}">1</text>`],
   ['roda1','roda',wheel(296,382,64,'#FFD60A')],['roda2','roda',wheel(734,388,58,'#FFD60A')]]},
 {id:'moto',n:'Moto',main:'#9B5DE5',dark:'#7B3FC4',dec:[520,276],spo:[350,276],ant:[360,276],fuel:[560,270],parts:[
   ['quadro','quadro',`<path d="M300 396 L420 300 M560 300 L640 240" fill="none" stroke="${OUT}" stroke-width="16" stroke-linecap="round"/>`],
   ['motor','motor',r(430,300,140,74,'#6A6A72',16)+`<path d="M456 320 h88 M456 338 h88 M456 356 h88" stroke="${OUT}" stroke-width="4"/>`],
   ['escape','escapamento',r(280,350,180,18,'#BDBDBD',9)],
   ['tanque','tanque',p('M440 304 Q440 252 510 248 L604 252 Q640 258 646 304 Z','#9B5DE5')+`<path d="M470 272 q30 -12 70 -10" stroke="#C9A3F5" stroke-width="7" fill="none" stroke-linecap="round"/>`],
   ['banco','banco',p('M320 300 Q320 280 350 278 L446 278 L446 304 L320 304 Z','#2B2B2B')],
   ['garfo','garfo',`<path d="M650 232 L700 396" stroke="#BDBDBD" stroke-width="14" stroke-linecap="round"/><path d="M620 222 L668 214" stroke="${OUT}" stroke-width="12" stroke-linecap="round"/>`+p('M650 352 Q700 318 750 352','none')],
   ['farol','farol',c(684,262,18,'#FFD60A')],
   ['roda1','roda',wheel(300,396,62,'#FF85C0')],['roda2','roda',wheel(700,396,62,'#FF85C0')]]},
 {id:'monstro',n:'Caminhão Monstro',main:'#FF9F1C',dark:'#E8860A',dec:[350,250],spo:[240,206],ant:[600,140],fuel:[260,260],parts:[
   ['molas','suspensão',[300,720].map(x=>`<path d="M${x} 300 l-18 8 l36 8 l-36 8 l36 8 l-36 8 l18 8" fill="none" stroke="#9A9A9A" stroke-width="8" stroke-linejoin="round"/>`).join('')],
   ['base','base',r(236,284,568,24,'#5A5A5A',10)],
   ['corpo','carroceria',p('M220 290 L220 230 Q220 210 242 210 L420 210 L470 150 Q480 140 500 140 L620 140 Q640 140 650 156 L690 210 L790 216 Q808 218 808 238 L808 290 Z','#FF9F1C')],
   ['janelas','janela',p('M488 158 L452 206 L560 206 L560 158 Z',glass)+p('M578 158 L578 206 L670 206 L640 158 Z',glass)],
   ['porta','porta',r(452,214,174,66,'#E8860A',12)+handle(590,230)],
   ['farois','farol',c(796,238,13,'#FFD60A')+r(222,232,14,22,'#FF4D4D',5)],
   ['roda1','roda',wheel(300,382,86,'#FFD60A')],['roda2','roda',wheel(720,382,86,'#FFD60A')]]},
 {id:'sorvete',n:'Carro de sorvete',main:'#FF85C0',dark:'#F062A8',dec:[380,330],spo:[230,150],ant:[560,150],fuel:[240,330],parts:[
   ['base','base',r(190,362,620,40,'#5A5A5A',18)],
   ['corpo','carroceria',r(200,160,440,212,'#FF85C0',30)],
   ['cabine','cabine',p('M640 372 L640 210 Q640 190 662 190 L716 190 Q738 190 750 210 L800 282 L804 372 Z','#FF85C0')],
   ['janela','janela',p('M658 206 L716 206 L758 270 L658 270 Z',glass)],
   ['balcao','janela de venda',r(250,196,250,92,glass,12)+[0,1,2,3,4].map(k=>`<path d="M${250+k*50} 182 h50 v20 a25 14 0 0 1 -50 0z" fill="${k%2?'#fff':'#4FB3F0'}" stroke="${OUT}" stroke-width="4"/>`).join('')],
   ['casquinha','casquinha',p('M506 160 L530 120 L554 160 Z','#F2B35A')+c(517,124,16,'#FFF4D2')+c(543,124,16,'#7ED957')+c(530,110,16,'#FF4D6D')],
   ['farol','farol',c(796,300,13,'#FFD60A')],
   ['roda1','roda',wheel(310,400,54,'#4FB3F0')],['roda2','roda',wheel(700,400,54,'#4FB3F0')]]},
 /* mais carros */
 {id:'taxi',n:'Táxi',main:'#FFD60A',dark:'#F2C200',dec:[470,312],spo:[240,262],ant:[400,170],parts:[
   ['base','base',r(206,350,596,34,'#3A3A3A',16)],
   ['corpo','carroceria',p('M200 360 L200 300 Q200 280 222 276 L262 272 L300 206 Q306 196 320 196 L500 196 Q516 196 526 208 L586 272 L780 286 Q808 290 808 318 L808 360 Z','#FFD60A')],
   ['janelas','janela',p('M312 212 L282 266 L408 266 L408 212 Z',glass)+p('M424 212 L424 266 L566 266 L514 212 Z',glass)],
   ['porta1','porta',r(278,276,134,72,'#F2C200',12)+handle(380,292)],['porta2','porta',r(420,276,150,72,'#F2C200',12)+handle(536,292)],
   ['placa','placa de táxi',r(368,166,96,30,'#2B2B2B',8)+`<text x="416" y="188" text-anchor="middle" font-size="20" font-weight="800" font-family="Baloo 2,sans-serif" fill="#FFD60A">TÁXI</text>`],
   ['faixa','faixa',[...Array(14)].map((_,k)=>`<rect x="${224+k*40}" y="${322}" width="20" height="12" fill="${k%2?'#fff':'#2B2B2B'}"/>`).join('')],
   ['farol','farol',c(796,300,13,'#FFF6B0')],['lanterna','lanterna',r(200,292,16,24,'#FF4D4D',5)],
   ['roda1','roda',wheel(326,388,54,'#D9D9D9')],['roda2','roda',wheel(690,388,54,'#D9D9D9')]]},
 {id:'jipe',n:'Jipe',main:'#4CAF50',dark:'#3D8B40',dec:[620,290],spo:[250,226],ant:[500,170],parts:[
   ['base','base',r(220,330,580,26,'#3A3A3A',10)],
   ['estepe','estepe',`<circle cx="200" cy="290" r="40" fill="#2B2B2B" ${ST}/><circle cx="200" cy="290" r="18" fill="#9A9A9A" ${ST}/>`],
   ['corpo','carroceria',p('M210 340 L210 250 Q210 236 224 236 L300 236 L330 170 L540 170 L560 236 L780 246 Q800 248 800 268 L800 340 Z','#4CAF50')],
   ['janelas','janela',p('M344 184 L320 230 L436 230 L436 184 Z',glass)+p('M452 184 L452 230 L540 230 L528 184 Z',glass)],
   ['porta','porta',r(316,240,132,82,'#3D8B40',10)+handle(420,256)],
   ['grade','grade',r(780,262,24,52,'#2B2B2B',5)],
   ['farol','farol',c(790,254,13,'#FFF6B0')],['lanterna','lanterna',r(204,252,14,24,'#FF4D4D',5)],
   ['roda1','roda',wheel(330,378,66,'#FFD60A')],['roda2','roda',wheel(692,378,66,'#FFD60A')]]},
 {id:'lixo',n:'Caminhão de lixo',main:'#2E9E5B',dark:'#237A46',dec:[420,270],spo:[230,150],ant:[700,200],parts:[
   ['base','base',r(186,352,626,34,'#3A3A3A',14)],
   ['cacamba','caçamba',p('M200 360 L200 180 Q200 160 222 160 L606 170 Q628 172 628 194 L628 360 Z','#2E9E5B')+r(230,290,370,16,'#FFD60A',6)],
   ['tampa','tampa',p('M184 182 L236 150 L248 206 L196 214 Z','#9A9A9A')],
   ['cabine','cabine',p('M638 360 L638 220 Q638 200 660 200 L720 200 Q744 200 756 222 L806 300 L806 360 Z','#2E9E5B')],
   ['janela','janela',p('M658 216 L718 216 L762 280 L658 280 Z',glass)],
   ['lixeira','lixeira',r(160,296,34,46,'#4FB3F0',6)],
   ['farol','farol',c(796,314,13,'#FFF6B0')],['lanterna','lanterna',r(190,236,14,24,'#FF4D4D',5)],
   ['roda1','roda',wheel(296,396,50,'#E0E0E0')],['roda2','roda',wheel(452,396,50,'#E0E0E0')],['roda3','roda',wheel(716,396,50,'#E0E0E0')]]},
 {id:'betoneira',n:'Betoneira',main:'#FF9F1C',dark:'#E8860A',dec:[700,330],spo:[230,200],ant:[700,200],parts:[
   ['base','base',r(186,352,626,34,'#3A3A3A',14)],
   ['suporte','suporte',r(220,300,400,52,'#FF9F1C',10)],
   ['tambor','tambor',p('M232 214 Q410 130 600 206 Q626 266 600 300 Q410 330 236 294 Q206 254 232 214 Z','#D9D9D9')+`<path d="M300 180 Q340 250 300 305 M390 158 Q430 240 390 318 M480 160 Q520 240 480 318" fill="none" stroke="#FF9F1C" stroke-width="12" stroke-linecap="round"/>`],
   ['cabine','cabine',p('M638 360 L638 220 Q638 200 660 200 L720 200 Q744 200 756 222 L806 300 L806 360 Z','#FF9F1C')],
   ['janela','janela',p('M658 216 L718 216 L762 280 L658 280 Z',glass)],
   ['farol','farol',c(796,314,13,'#FFF6B0')],['lanterna','lanterna',r(190,316,14,24,'#FF4D4D',5)],
   ['roda1','roda',wheel(296,396,50,'#E0E0E0')],['roda2','roda',wheel(452,396,50,'#E0E0E0')],['roda3','roda',wheel(716,396,50,'#E0E0E0')]]},
 {id:'guincho',n:'Guincho',main:'#E63946',dark:'#B5222E',dec:[420,300],spo:[260,240],ant:[700,190],parts:[
   ['base','base',r(186,352,626,34,'#3A3A3A',14)],
   ['plataforma','plataforma',r(212,286,410,70,'#E63946',10)],
   ['braco','braço',`<path d="M300 288 L230 176" stroke="${OUT}" stroke-width="18" stroke-linecap="round"/><path d="M300 288 L230 176" stroke="#FFD60A" stroke-width="10" stroke-linecap="round"/><path d="M230 176 L214 250" stroke="${OUT}" stroke-width="4"/><path d="M214 250 q-14 0 -14 14 q0 14 14 14" fill="none" stroke="${OUT}" stroke-width="7" stroke-linecap="round"/>`],
   ['cabine','cabine',p('M630 360 L630 214 Q630 194 652 194 L720 194 Q744 194 756 216 L806 296 L806 360 Z','#E63946')],
   ['janela','janela',p('M650 210 L718 210 L762 276 L650 276 Z',glass)],
   ['giroflex','luz',r(670,176,46,18,'#FF9F1C',8)],
   ['farol','farol',c(796,312,13,'#FFF6B0')],['lanterna','lanterna',r(198,300,14,24,'#FF4D4D',5)],
   ['roda1','roda',wheel(310,396,52,'#E0E0E0')],['roda2','roda',wheel(700,396,52,'#E0E0E0')]]},
 {id:'fusca',n:'Fusquinha',main:'#9B5DE5',dark:'#7B3FC4',dec:[430,310],spo:[232,272],ant:[470,160],parts:[
   ['base','base',r(220,346,570,24,'#3A3A3A',12)],
   ['corpo','carroceria',p('M210 352 Q200 302 238 284 Q300 168 470 160 Q640 168 722 270 Q800 290 800 340 L800 352 Z','#9B5DE5')],
   ['janelas','janela',p('M332 262 Q360 192 450 184 L450 262 Z',glass)+p('M470 184 Q558 190 610 262 L470 262 Z',glass)],
   ['porta','porta',r(340,270,170,64,'#7B3FC4',16)+handle(480,286)],
   ['farol','farol',c(758,286,16,'#FFF6B0')],['lanterna','lanterna',r(214,300,12,20,'#FF4D4D',5)],
   ['roda1','roda',wheel(330,384,52,'#E0E0E0')],['roda2','roda',wheel(684,384,52,'#E0E0E0')]]}
];
const done=()=>store().get('thur-carros',[]);
function store(){return{get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}}}
/* loja: enfeites comprados com as estrelas da pista */
const LOJA={
  cor:[['#FF4D4D','Vermelho',0],['#4FB3F0','Azul',8],['#4CC764','Verde',8],['#FFD60A','Amarelo',8],['#FF85C0','Rosa',10],['#9B5DE5','Roxo',10],['#FF9F1C','Laranja',10],['#2B2B2B','Preto',12],['#FFFFFF','Branco',12]],
  roda:[['#FFD60A','Amarela',0],['#BDBDBD','Prata',6],['#FF4D4D','Vermelha',8],['#4FB3F0','Azul',8],['#FF85C0','Rosa',8],['#F5B800','Dourada',15]],
  adesivo:[['estrela','Estrela',10],['raio','Raio',12],['coracao','Coração',12],['chamas','Chamas',18],['sete','Número 7',15],['arco','Arco-íris',20]],
  extra:[['aero','Aerofólio',25],['antena','Bandeirinha',20],['ambos','Os dois',40]],
  buzina:[['normal','Fom-fom',0],['pato','Pato',10],['palhaco','Palhaço',12],['trem','Trem',15]],
  pista:[]};
const DECAL={
  estrela:'<polygon points="0,-30 9,-10 30,-9 13,5 19,27 0,15 -19,27 -13,5 -30,-9 -9,-10" fill="#FFD60A" stroke="#2E2440" stroke-width="4" stroke-linejoin="round"/>',
  raio:'<path d="M6 -32 L-16 4 L-2 4 L-8 32 L16 -6 L2 -6 Z" fill="#FFD60A" stroke="#2E2440" stroke-width="4" stroke-linejoin="round"/>',
  coracao:'<path d="M0 26 C-30 6 -32 -14 -18 -22 C-8 -28 0 -20 0 -14 C0 -20 8 -28 18 -22 C32 -14 30 6 0 26 Z" fill="#FF4D6D" stroke="#2E2440" stroke-width="4"/>',
  chamas:'<path d="M-40 20 C-30 -6 -18 6 -12 -16 C-4 2 4 -20 12 -6 C18 -24 30 -4 40 -12 C34 10 20 22 -40 20 Z" fill="#FF9F1C" stroke="#2E2440" stroke-width="4" stroke-linejoin="round"/><path d="M-26 16 C-18 2 -10 10 -6 -2 C0 8 6 -6 12 4 C16 -6 24 4 28 0 C22 12 10 18 -26 16 Z" fill="#FFD60A"/>',
  sete:'<circle r="28" fill="#fff" stroke="#2E2440" stroke-width="4"/><text y="13" text-anchor="middle" font-size="40" font-weight="800" font-family="Baloo 2,sans-serif" fill="#2E2440">7</text>',
  arco:'<path d="M-34 14 A34 34 0 0 1 34 14" fill="none" stroke="#FF4D4D" stroke-width="8"/><path d="M-26 14 A26 26 0 0 1 26 14" fill="none" stroke="#FFD60A" stroke-width="8"/><path d="M-18 14 A18 18 0 0 1 18 14" fill="none" stroke="#4CC764" stroke-width="8"/><path d="M-10 14 A10 10 0 0 1 10 14" fill="none" stroke="#4FB3F0" stroke-width="8"/>'};
const AERO=(x,y)=>`<path d="M${x-8} ${y} v-26" stroke="#2E2440" stroke-width="8"/><path d="M${x-64} ${y-24} h96 l-10 -18 h-82 z" fill="#2B2B2B" stroke="#2E2440" stroke-width="5" stroke-linejoin="round"/>`;
const ANT=(x,y)=>`<path d="M${x} ${y} v-74" stroke="#2E2440" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y-74} l40 12 l-40 12 z" fill="#FF4D4D" stroke="#2E2440" stroke-width="4" stroke-linejoin="round"/>`;
const ls={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const custom=id=>ls.get('thur-custom',{})[id]||{};
const shade=(h,k)=>{const n=parseInt(h.slice(1),16);const f=c=>Math.max(0,Math.min(255,Math.round(c*k)));return'#'+[n>>16,n>>8&255,n&255].map(c=>f(c).toString(16).padStart(2,'0')).join('')};
function partsOf(v){const c=custom(v.id);const fl=FLIP[v.id]||[];let out=v.parts.map(([id,nm,s])=>{let t=fl.includes(id)?`<g transform="translate(1020 0) scale(-1 1)">${s}</g>`:s;
    if(c.cor&&!t.startsWith('<g class="wh">')){t=t.split(`fill="${v.main}"`).join(`fill="${c.cor}"`);if(v.dark)t=t.split(`fill="${v.dark}"`).join(`fill="${shade(c.cor,c.cor==='#2B2B2B'?1.6:.88)}"`)}
    if(c.roda&&t.startsWith('<g class="wh">'))t=t.replace(/(<g class="wh"><circle[^>]*\/><circle [^>]*?fill=")[^"]+/,`$1${c.roda}`);
    return[id,nm,t]});
  if(c.adesivo&&DECAL[c.adesivo])out.push(['adesivo','adesivo',`<g transform="translate(${v.dec[0]} ${v.dec[1]})">${DECAL[c.adesivo]}</g>`]);
  if(c.extra==='aero'||c.extra==='ambos')out.push(['aero','aerofólio',AERO(v.spo[0],v.spo[1])]);
  if(c.extra==='antena'||c.extra==='ambos')out.push(['antena','bandeirinha',ANT(v.ant[0],v.ant[1])]);
  const w=out.filter(p=>p[2].startsWith('<g class="wh">')),o=out.filter(p=>!p[2].startsWith('<g class="wh">'));const ext=o.filter(p=>['aero','antena'].includes(p[0])),rest=o.filter(p=>!['aero','antena'].includes(p[0]));
  return[...ext,...rest,...w]}
/* faróis e lanternas viram peças separadas (cada uma do seu tamanho, mais fáceis de pegar) */
V.forEach(v=>{const out=[];v.parts.forEach(([id,nm,s0])=>{if(id==='farois'){const els=s0.match(/<(circle|rect|path|polygon|ellipse)\b[^>]*\/>/g)||[s0];
  if(els.length>1){els.forEach((e,k)=>{const red=/#FF4D4D|#E63946/.test(e);out.push([red?'lanterna'+(k||''):'farol'+(k||''),red?'lanterna':'farol',e])});return}}out.push([id,nm,s0])});v.parts=out});
/* carros de passeio: cabine mais para trás e capô comprido na frente (antes pareciam andar de ré) */
const FLIP={carro:['corpo','janelas','porta1','porta2'],policia:['corpo','janelas','porta1','porta2','sirene'],super:['corpo','janelas','porta'],raio:['corpo','janelas','porta'],classico:['corpo','janelas','porta']};
const carSvg=(v,vb='160 90 700 380',cls='')=>`<svg viewBox="${vb}" class="${cls}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${v.n}">${partsOf(v).map(([id,,s])=>`<g data-p="${id}">${s}</g>`).join('')}</svg>`;

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
  M.parts=partsOf(M.v);const ghost=M.parts.map(([,,s])=>s).join('').replace(/fill="[^"]*"/g,'fill="#E9DFCF"').replace(/stroke="#2E2440"/g,'stroke="#C7B79E"');
  $('#mStage').innerHTML=`<svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet"><ellipse cx="500" cy="452" rx="380" ry="26" fill="rgba(0,0,0,.08)"/><g class="ghost">${ghost}</g>${M.parts.map(([id,nm,s],k)=>`<g class="part" data-k="${k}">${s}</g>`).join('')}</svg>`;
  M.need=true;show('montar');speak('Vamos montar o '+M.v.n.toLowerCase()+'!')}
onShow.montar=()=>{if(M.need){M.need=false;requestAnimationFrame(scatter)}};
function scatter(){const s=svgM();if(!s)return;const gs=[...s.querySelectorAll('.part')];
  const slots=[[80,80],[80,200],[80,320],[80,450],[920,80],[920,200],[920,320],[920,450],[320,50],[500,50],[680,50],[320,515],[500,515],[680,515]];
  const order=gs.map((_,k)=>k).sort(()=>Math.random()-.5);M.left=gs.length;
  gs.forEach((g,n)=>{const b=g.getBBox();g._c=[b.x+b.width/2,b.y+b.height/2];const sl=slots[order.indexOf(n)%slots.length];const sc=Math.max(.3,Math.min(2.4,118/Math.max(b.width,b.height,1)));
    /* área de toque maior: peça pequena fica fácil de pegar com o dedo */
    if(!g.querySelector('.hit')){const pad=Math.max(6,(124/sc-Math.max(b.width,b.height))/2);const h=document.createElementNS('http://www.w3.org/2000/svg','rect');h.setAttribute('class','hit');h.setAttribute('x',b.x-pad);h.setAttribute('y',b.y-pad);h.setAttribute('width',b.width+pad*2);h.setAttribute('height',b.height+pad*2);h.setAttribute('fill','transparent');g.insertBefore(h,g.firstChild)}g._slot={x:sl[0],y:sl[1],s:sc};g._done=false;setT(g,sl[0],sl[1],sc,false)})}
function setT(g,x,y,s,anim){g.style.transition=anim?'transform .35s cubic-bezier(.3,1.4,.6,1)':'none';g.style.transform=`translate(${x}px,${y}px) scale(${s}) translate(${-g._c[0]}px,${-g._c[1]}px)`}
const toPt=(s,e)=>{const q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(s.getScreenCTM().inverse())};
$('#mStage').addEventListener('pointerdown',e=>{const g=e.target.closest('.part');if(!g||g._done)return;e.preventDefault();actx();const s=svgM();const q=toPt(s,e);
  g.parentNode.appendChild(g);M.drag={g,ox:q.x-g._slot.x,oy:q.y-g._slot.y,x:g._slot.x,y:g._slot.y};setT(g,g._slot.x,g._slot.y,1,true);pop(520);try{$('#mStage').setPointerCapture(e.pointerId)}catch(x){}});
$('#mStage').addEventListener('pointermove',e=>{const d=M.drag;if(!d)return;const q=toPt(svgM(),e);d.x=q.x-d.ox;d.y=q.y-d.oy;if(!d.raf)d.raf=requestAnimationFrame(()=>{d.raf=0;if(M.drag)setT(d.g,d.x,d.y,1,false)})});
function mDrop(){const d=M.drag;if(!d)return;M.drag=null;cancelAnimationFrame(d.raf);const g=d.g;
  if(Math.hypot(d.x-g._c[0],d.y-g._c[1])<80){g._done=true;const hh=g.querySelector('.hit');if(hh)hh.remove();g.style.transition='transform .25s ease-out';g.style.transform='none';
    const parts=[...svgM().querySelectorAll('.part')];parts.sort((a,b)=>a.dataset.k-b.dataset.k).forEach(x=>x.parentNode.appendChild(x));
    clank();speak(M.parts[+g.dataset.k][1]);M.left--;if(!M.left)setTimeout(finishBuild,450)}
  else{setT(g,g._slot.x,g._slot.y,g._slot.s,true);pop(300)}}
$('#mStage').addEventListener('pointerup',mDrop);$('#mStage').addEventListener('pointercancel',mDrop);
function finishBuild(){svgM().querySelector('.ghost').style.display='none';honk();setTimeout(()=>window.CARROS.afterBuild(TH.award('car:'+M.v.id)),700);
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
window.CARROS={V,M,carSvg,openPosto,partsOf,LOJA,DECAL,ls,custom};
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
window.CARROS.afterBuild=st=>parabens('Parabéns!','Você montou o '+M.v.n.toLowerCase()+'!',carSvg(M.v),[['Escolher a pista',()=>window.CARROS.openPistas()],['Garagem',()=>show('garagem')]],st);

/* pista: o carro anda sobre morros e rampas */
const pcv=$('#pcv'),px=pcv.getContext('2d');
const PTS=[[0,430],[700,430],[1100,330],[1500,430],[1850,350],[1930,440],[2300,430],[2500,400],[2650,430],[2800,395],[2950,430],[3300,430],[3800,250],[4300,440],[4700,430],[5050,340],[5120,445],[5500,430],[5700,380],[5900,430],[6100,385],[6300,430],[7400,430]];
let PTS2=PTS,END=6900,G=1500,JUMPS=[1930,5120];
/* cada pista: cenário + formato do chão (h=morro, v=vale, r=rampa de pulo, f=reto) */
function mkTrack(list){const pts=[[0,430],[700,430]],j=[];let x=700;
  list.forEach(([t,len,h])=>{if(t==='h'){pts.push([x+len/2,430-h],[x+len,430])}else if(t==='v'){pts.push([x+len/2,430+h],[x+len,430])}else if(t==='r'){pts.push([x+len,430-h],[x+len+70,446],[x+len+200,430]);j.push(x+len);len+=200}else pts.push([x+len,430]);x+=len});
  pts.push([x+400,430],[x+1600,430]);return{pts,end:x+200,jumps:j}}
const PISTAS={
  dia:{n:'Campo',price:0,t:{pts:PTS,end:6900,jumps:[1930,5120]},sky:['#7CCBFF','#D8F1FF'],hill:'#A9DD8C',dirt:'#C98B4E',grass:'#6CC24A',tree:['#4CC764','#3FB35A'],cloud:'#FFFFFF',dash:'#FFFFFF'},
  praia:{n:'Praia',price:20,t:mkTrack([['h',300,40],['h',300,50],['f',200],['r',360,90],['h',300,40],['h',300,50],['h',300,40],['f',300],['r',380,110],['h',400,60],['h',300,40],['f',300],['h',500,90],['r',360,90],['h',300,40]]),sky:['#5EC8F2','#E6F8FF'],hill:'#2FA7E0',hillAmp:.25,dirt:'#E9C58A',grass:'#F7E2A8',deco:'palma',cloud:'#FFFFFF',dash:'#FFFFFF',sun:1},
  noite:{n:'Noite',price:30,t:mkTrack([['h',500,90],['f',200],['r',400,120],['h',400,70],['v',400,60],['h',600,150],['r',350,100],['f',300],['h',300,60],['h',300,60],['r',420,130],['v',500,70],['h',500,110]]),sky:['#0B1340','#3A3F8F'],hill:'#2F5D50',dirt:'#5B4030',grass:'#2E7D4A',tree:['#2E8B57','#256F47'],cloud:'#5C64A8',dash:'#FFD60A',night:1},
  deserto:{n:'Deserto',price:35,t:mkTrack([['h',700,140],['f',200],['h',800,180],['r',400,120],['h',700,150],['f',300],['r',380,140],['h',900,200],['h',600,120]]),sky:['#FF9E58','#FFE3B3'],hill:'#F2B66D',dirt:'#D9884A',grass:'#F2C27E',deco:'cacto',cloud:'#FFE9CC',dash:'#FFFFFF',sun:1},
  neve:{n:'Neve',price:40,t:mkTrack([['h',900,220],['f',200],['r',300,90],['v',600,80],['h',700,180],['r',400,130],['f',300],['h',1000,260],['r',360,110]]),sky:['#A9DCFF','#F2FBFF'],hill:'#FFFFFF',dirt:'#DDEBF7',grass:'#FFFFFF',tree:['#2E8B57','#3FA36A'],deco:'pinheiro',cloud:'#FFFFFF',dash:'#FFFFFF',snow:1},
  doces:{n:'Terra dos Doces',price:50,t:mkTrack([['h',220,40],['h',220,40],['h',220,40],['r',360,100],['h',220,40],['h',220,40],['v',400,60],['r',400,130],['h',220,40],['h',220,40],['h',220,40],['r',380,120],['h',600,120],['h',220,40],['h',220,40]]),sky:['#FFB3DA','#FFF0F8'],hill:'#FFC2E0',dirt:'#7B3F20',grass:'#FF85C0',deco:'pirulito',cloud:'#FFFFFF',dash:'#FFFFFF'},
  fazenda:{n:'Fazenda',price:25,t:mkTrack([['h',400,70],['f',300],['h',300,50],['r',380,100],['f',200],['h',500,90],['h',300,40],['r',420,120],['f',300],['h',600,110],['h',300,50]]),sky:['#8FD3FF','#EAF8FF'],hill:'#C5E1A5',dirt:'#B07B4F',grass:'#7CB342',deco:'celeiro',cloud:'#FFFFFF',dash:'#FFFFFF',sun:1},
  cidade:{n:'Cidade',price:45,t:mkTrack([['f',300],['r',300,80],['f',400],['h',400,60],['r',360,110],['f',300],['v',400,50],['r',400,130],['f',300],['h',300,50],['r',380,120]]),sky:['#87CEEB','#E6F6FF'],hill:'#A7B4C6',hillAmp:.5,dirt:'#5E5E66',grass:'#9AA3AF',deco:'predio',cloud:'#FFFFFF',dash:'#FFD60A'},
  vulcao:{n:'Vulcão',price:70,g:1300,t:mkTrack([['h',600,150],['r',380,130],['v',500,80],['h',800,200],['r',420,150],['f',300],['h',700,180],['r',420,160]]),sky:['#2A0A0A','#B23A1A'],hill:'#5A2E1E',dirt:'#3D2B24',grass:'#FF6A00',deco:'lava',cloud:'#6B3A30',dash:'#FFD60A'},
  arcoiris:{n:'Arco-íris',price:80,g:1100,t:mkTrack([['h',300,60],['r',400,140],['h',300,60],['h',300,60],['r',420,160],['v',400,60],['h',500,120],['r',420,170],['h',300,60]]),sky:['#FFD6F5','#D6F0FF'],hill:'#FFFFFF',hillAmp:.6,dirt:'#B39DDB',grass:'#FF85C0',deco:'arco',cloud:'#FFFFFF',dash:'#FFFFFF'},
  lua:{n:'Lua',price:60,g:560,t:mkTrack([['r',400,120],['f',300],['h',800,160],['r',420,160],['v',600,90],['r',380,150],['f',300],['h',900,200],['r',420,170],['f',200]]),sky:['#05060F','#1B1E3A'],hill:'#6E7180',dirt:'#8D90A0',grass:'#B8BBC8',deco:'pedra',cloud:null,dash:'#FFD60A',night:1,terra:1}};
window.CARROS.PISTAS=PISTAS;
function g(x){const PTS=PTS2;if(x<=0)return PTS[0][1];for(let i=1;i<PTS.length;i++){const [x1,y1]=PTS[i];if(x<=x1){const [x0,y0]=PTS[i-1];const t=(x-x0)/(x1-x0);return y0+(y1-y0)*(1-Math.cos(Math.PI*t))/2}}return PTS[PTS.length-1][1]}
const S={on:false,x:120,v:0,y:430,vy:0,air:false,ang:0,gas:false,brake:false,stars:[],got:0,body:null,wh:[],k:1,camY:300,last:0,spin:0,done:false,eng:null};
function prep(v){const wh=[];const parts=window.CARROS.partsOf(v).filter(([, ,s])=>{const m=s.match(/^<g class="wh"><circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/);if(m){wh.push({cx:+m[1],cy:+m[2],r:+m[3],s});return false}return true});
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="160 90 700 380" width="1400" height="760">${parts.map(([,,s])=>s).join('')}</svg>`;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  const wims=wh.map(w=>{const i=new Image();const R=w.r+4;i.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${w.cx-R} ${w.cy-R} ${R*2} ${R*2}" width="${R*4}" height="${R*4}">${w.s}</svg>`);return i});
  S.body=im;S.wh=wh.map((w,i)=>({...w,im:wims[i]}));
  const xs=S.wh.map(w=>w.cx);S.rearX=Math.min(...xs);S.frontX=Math.max(...xs);S.bottom=Math.max(...S.wh.map(w=>w.cy+w.r))}
const SC=250/700;
const THEMES=PISTAS,_old={
  noite:{sky:['#0B1340','#3A3F8F'],hill:'#2F5D50',dirt:'#5B4030',grass:'#2E7D4A',tree:['#2E8B57','#256F47'],cloud:'#5C64A8',dash:'#FFD60A',night:1},
  neve:{sky:['#A9DCFF','#F2FBFF'],hill:'#FFFFFF',dirt:'#DDEBF7',grass:'#FFFFFF',tree:['#2E8B57','#3FA36A'],cloud:'#FFFFFF',dash:'#FFFFFF',snow:1}};
function openPista(){const v=M.v;S.th=THEMES[window.CARROS.ls.get('thur-pista','dia')]||THEMES.dia;PTS2=S.th.t.pts;END=S.th.t.end;JUMPS=S.th.t.jumps;G=S.th.g||1500;prep(v);Object.assign(S,{x:120,v:0,y:g(120),vy:0,air:false,ang:0,got:0,done:false,gas:false,brake:false});
  S.stars=[];for(let x=500;x<END-200;x+=260){const high=JUMPS.some(r=>Math.abs(x-r-150)<160);S.stars.push({x,y:g(x)-(high?150:70),got:false})}
  $('#psCount').textContent='0';$('#psTot').textContent=S.stars.length;$('#pTitle2').textContent=v.n+' • '+S.th.n;show('pista');
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
  S.stars.forEach(s=>{if(!s.got&&Math.abs(s.x-S.x)<70&&Math.abs(s.y-(S.y-60))<90){s.got=true;S.got++;$('#psCount').textContent=S.got;const w=window.CARROS.ls.get('thur-estrelas',0)+1;window.CARROS.ls.set('thur-estrelas',w);TH.pop(900)}});
  if(!S.done&&S.x>=END){S.done=true;S.gas=false;engine(false);setTimeout(()=>{const st=TH.award('pista:'+window.CARROS.ls.get('thur-pista','dia'));parabens('Parabéns!',`Você pegou ${S.got} estrelas! Agora você tem ${window.CARROS.ls.get('thur-estrelas',0)} para gastar na loja.`,carSvg(M.v),[['Correr de novo',()=>openPista()],['Outra pista',()=>window.CARROS.openPistas()],['Ir para a loja',()=>window.CARROS.openLoja(M.i)],['Garagem',()=>show('garagem')]],st)},900)}
  draw();requestAnimationFrame(tick)}
function deco(kind,x,y){px.strokeStyle='#2E2440';px.lineWidth=4;
  if(kind==='palma'){px.strokeStyle='#8B5A2B';px.lineWidth=12;px.beginPath();px.moveTo(x,y);px.quadraticCurveTo(x+18,y-60,x+8,y-130);px.stroke();px.fillStyle='#3FB35A';[[-1,0],[1,0],[-.7,-.6],[.7,-.6],[0,-1]].forEach(([dx,dy])=>{px.beginPath();px.ellipse(x+8+dx*36,y-130+dy*14+12,40,11,Math.atan2(dy+.5,dx)*.6,0,7);px.fill()});px.fillStyle='#8B5A2B';px.beginPath();px.arc(x+8,y-124,9,0,7);px.fill()}
  else if(kind==='cacto'){px.fillStyle='#4CAF50';const rr=(a,b,w,h)=>{px.beginPath();px.roundRect(a,b,w,h,w/2);px.fill();px.stroke()};rr(x-14,y-120,28,122);rr(x-48,y-90,20,50);rr(x-48,y-58,40,18);rr(x+28,y-100,20,46);rr(x+10,y-72,38,18)}
  else if(kind==='pinheiro'){px.fillStyle='#8B5A2B';px.fillRect(x-7,y-30,14,32);px.fillStyle='#2E8B57';for(let i=0;i<3;i++){px.beginPath();px.moveTo(x,y-150+i*36);px.lineTo(x-46+i*-6,y-40-36*(2-i)+36);px.lineTo(x+46+i*6,y-40-36*(2-i)+36);px.closePath();px.fill();px.stroke()}px.fillStyle='#fff';px.beginPath();px.moveTo(x,y-150);px.lineTo(x-16,y-122);px.lineTo(x+16,y-122);px.fill()}
  else if(kind==='pirulito'){px.fillStyle='#fff';px.fillRect(x-5,y-100,10,102);px.strokeRect(x-5,y-100,10,102);const cs=['#FF4D6D','#FFD60A','#4FB3F0','#9B5DE5'];px.fillStyle=cs[Math.abs(x/430|0)%4];px.beginPath();px.arc(x,y-130,40,0,7);px.fill();px.stroke();px.strokeStyle='#fff';px.lineWidth=7;px.beginPath();for(let a=0;a<12;a+=.2){const rr=a*3;a===0?px.moveTo(x,y-130):px.lineTo(x+Math.cos(a)*rr,y-130+Math.sin(a)*rr)}px.stroke()}
  else if(kind==='celeiro'){if(Math.abs(x/430|0)%2){px.fillStyle='#C0392B';px.beginPath();px.moveTo(x-50,y);px.lineTo(x-50,y-70);px.lineTo(x,y-110);px.lineTo(x+50,y-70);px.lineTo(x+50,y);px.closePath();px.fill();px.stroke();px.fillStyle='#fff';px.fillRect(x-16,y-46,32,46);px.strokeRect(x-16,y-46,32,46);px.beginPath();px.moveTo(x-16,y-46);px.lineTo(x+16,y);px.moveTo(x+16,y-46);px.lineTo(x-16,y);px.stroke()}else{px.fillStyle='#8B5A2B';[-40,-14,12,38].forEach(o=>{px.fillRect(x+o,y-40,8,40)});px.fillRect(x-44,y-32,92,7);px.fillRect(x-44,y-16,92,7)}}
  else if(kind==='predio'){const k=Math.abs(x/430|0)%3,h=[150,200,120][k],w=[70,80,90][k],col=['#7FA7D9','#F2A65A','#9B8BD9'][k];px.fillStyle=col;px.fillRect(x-w/2,y-h,w,h);px.strokeRect(x-w/2,y-h,w,h);px.fillStyle='#FFF4B0';for(let yy=y-h+14;yy<y-24;yy+=26)for(let xx=x-w/2+10;xx<x+w/2-14;xx+=22)px.fillRect(xx,yy,12,14)}
  else if(kind==='lava'){px.fillStyle='#4A2418';px.beginPath();px.moveTo(x-60,y);px.lineTo(x-16,y-90);px.lineTo(x+16,y-90);px.lineTo(x+60,y);px.closePath();px.fill();px.stroke();px.fillStyle='#FF6A00';px.beginPath();px.moveTo(x-16,y-90);px.quadraticCurveTo(x-6,y-60,x-10,y-40);px.quadraticCurveTo(x+4,y-62,x+16,y-90);px.closePath();px.fill();px.fillStyle='rgba(120,120,120,.7)';px.beginPath();px.arc(x,y-112,16,0,7);px.arc(x+18,y-130,12,0,7);px.fill()}
  else if(kind==='arco'){['#FF4D4D','#FF9F1C','#FFD60A','#4CC764','#4FB3F0','#9B5DE5'].forEach((col,i)=>{px.strokeStyle=col;px.lineWidth=8;px.beginPath();px.arc(x,y,70-i*8,Math.PI,0);px.stroke()});px.fillStyle='#fff';px.beginPath();px.arc(x-70,y-4,18,0,7);px.arc(x+70,y-4,18,0,7);px.fill()}
  else if(kind==='pedra'){px.fillStyle='#5D606E';px.beginPath();px.ellipse(x,y-14,46,24,0,0,7);px.fill();px.stroke();px.fillStyle='#4A4C58';px.beginPath();px.ellipse(x+180,y+4,40,9,0,0,7);px.fill()}}
function draw(){const {W,H,d,k}=S;if(!W)return;px.setTransform(d,0,0,d,0,0);const vw=W/k,vh=H/k;
  const sky=px.createLinearGradient(0,0,0,H);const th=S.th||THEMES.dia;sky.addColorStop(0,th.sky[0]);sky.addColorStop(1,th.sky[1]);px.fillStyle=sky;px.fillRect(0,0,W,H);
  px.scale(k,k);const camX=S.x-vw*.3;if(th.sun){px.fillStyle='#FFE45C';px.beginPath();px.arc(vw*.82,80,40,0,7);px.fill()}if(th.terra){px.fillStyle='#4FB3F0';px.beginPath();px.arc(vw*.8,90,38,0,7);px.fill();px.fillStyle='#4CC764';px.beginPath();px.ellipse(vw*.8-10,80,14,10,.5,0,7);px.ellipse(vw*.8+14,100,10,8,0,0,7);px.fill()}if(th.night){px.fillStyle='#FFF7C2';if(!th.terra){px.beginPath();px.arc(vw*.8,70,30,0,7);px.fill()}px.fillStyle='#fff';for(let i=0;i<40;i++){const sx=((i*137-camX*.05)%vw+vw)%vw,sy=(i*53)%220+10;px.fillRect(sx,sy,2.5,2.5)}}S.camY+=((S.y-vh*.62)-S.camY)*.08;const camY=Math.min(S.camY,0);
  if(th.cloud){px.fillStyle=th.cloud;for(let i=0;i<6;i++){const cx=((i*420-camX*.15)%2520+2520)%2520-200,cy=70+(i%3)*40;px.beginPath();px.ellipse(cx,cy-camY*.1,60,22,0,0,7);px.ellipse(cx+40,cy-14-camY*.1,40,24,0,0,7);px.fill()}}
  px.fillStyle=th.hill;px.beginPath();px.moveTo(0,vh);for(let x=0;x<=vw+20;x+=20){const wx=x+camX*.35;px.lineTo(x,330-camY*.35+(Math.sin(wx/260)*40+Math.sin(wx/97)*12)*(th.hillAmp||1))}px.lineTo(vw,vh);px.fill();
  px.save();px.translate(-camX,-camY);
  for(let tx=Math.floor((camX-100)/430)*430;tx<camX+vw+100;tx+=430){if(tx<100)continue;const ty=g(tx)+8;if(th.deco){deco(th.deco,tx,ty);continue}px.fillStyle='#A0663C';px.fillRect(tx-7,ty-70,14,72);px.fillStyle=tx%860?th.tree[0]:th.tree[1];px.beginPath();px.arc(tx,ty-92,40,0,7);px.fill();px.strokeStyle='#2E2440';px.lineWidth=4;px.stroke();if(th.snow){px.fillStyle='#fff';px.beginPath();px.ellipse(tx,ty-118,30,14,0,0,7);px.fill()}}
  const x0=camX-40,x1=camX+vw+40;px.beginPath();px.moveTo(x0,vh+camY+400);for(let x=x0;x<=x1;x+=8)px.lineTo(x,g(x)+10);px.lineTo(x1,vh+camY+400);px.closePath();px.fillStyle=th.dirt;px.fill();
  px.beginPath();for(let x=x0;x<=x1;x+=8){x===x0?px.moveTo(x,g(x)+14):px.lineTo(x,g(x)+14)}px.strokeStyle=th.grass;px.lineWidth=18;px.stroke();
  px.beginPath();for(let x=x0;x<=x1;x+=8){x===x0?px.moveTo(x,g(x)+2):px.lineTo(x,g(x)+2)}px.strokeStyle='#5A5A66';px.lineWidth=20;px.lineJoin='round';px.stroke();
  px.setLineDash([22,22]);px.lineDashOffset=0;px.strokeStyle=th.dash;px.lineWidth=3;px.stroke();px.setLineDash([]);
  [[END,'#2E2440']].forEach(([fx])=>{const fy=g(fx);px.fillStyle='#2E2440';px.fillRect(fx-60,fy-150,8,150);px.fillRect(fx+52,fy-150,8,150);for(let i=0;i<14;i++)for(let j=0;j<3;j++){px.fillStyle=(i+j)%2?'#2E2440':'#fff';px.fillRect(fx-52+i*8,fy-150+j*12,8,12)}});
  {const sx=120,sy=g(sx);px.fillStyle='#FF4D4D';px.fillRect(sx-80,sy-110,6,110);px.beginPath();px.moveTo(sx-74,sy-110);px.lineTo(sx-30,sy-96);px.lineTo(sx-74,sy-82);px.fill()}
  S.stars.forEach(s=>{if(s.got||s.x<x0||s.x>x1)return;star(s.x,s.y+Math.sin((performance.now()/300)+s.x)*5,22)});
  const sc=SC,bw=700*sc,bh=380*sc,pivX=((S.rearX+S.frontX)/2-160)*sc,pivY=(S.bottom-90)*sc;
  px.save();px.translate(S.x,S.y);px.rotate(S.ang);
  if(S.body&&S.body.complete)px.drawImage(S.body,-pivX,-pivY,bw,bh);
  S.wh.forEach(w=>{const R=(w.r+4)*sc;px.save();px.translate((w.cx-160)*sc-pivX,(w.cy-90)*sc-pivY);px.rotate(S.spin/(w.r*sc));if(w.im.complete)px.drawImage(w.im,-R,-R,R*2,R*2);px.restore()});
  px.restore();px.restore();
  if(th.snow){px.fillStyle='rgba(255,255,255,.9)';const tt=performance.now()/1000;for(let i=0;i<60;i++){const fx=((i*97+tt*20*(1+i%3))%vw+vw)%vw,fy=((i*61+tt*40*(1+i%2))%vh);px.beginPath();px.arc(fx,fy,2+(i%3),0,7);px.fill()}}
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
$('#pHonk').onclick=()=>{actx();window.CARROS.horn(window.CARROS.custom(M.v.id).buzina||'normal')};
}

/* ---------- loja ---------- */
{
const {$,$$,show,pop,speak,party,actx,cfg,rnd,onShow}=window.TH;
const C=window.CARROS,{V,LOJA,DECAL,ls,custom,carSvg}=C;
LOJA.pista=Object.entries(C.PISTAS).map(([id,p])=>[id,p.n,p.price]);
const grad=p=>`linear-gradient(${p.sky[0]},${p.sky[1]} 55%,${p.grass} 55%,${p.grass} 68%,${p.dirt} 68%)`;
const wallet=()=>ls.get('thur-estrelas',0);
function syncWallet(){$$('.walletN').forEach(e=>e.textContent=wallet())}
function tone(type,f1,f2,dur,vol=.14,delay=0){if(!cfg.som)return;const a=actx();if(!a)return;try{const t=a.currentTime+delay,o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g).connect(a.destination);o.start(t);o.stop(t+dur+.02)}catch(e){}}
C.horn=type=>{if(type==='pato'){tone('square',760,520,.12,.07);tone('square',700,480,.14,.07,.17)}else if(type==='palhaco'){[0,.12,.24,.36].forEach((d,i)=>tone('sine',[600,800,600,1000][i],[900,500,900,400][i],.11,.12,d))}else if(type==='trem'){tone('sawtooth',300,300,.5,.05);tone('sawtooth',378,378,.5,.05);tone('sawtooth',300,280,.4,.05,.6);tone('sawtooth',378,350,.4,.05,.6)}else{tone('square',440,420,.15,.07);tone('square',350,340,.2,.07,.18)}};
const TABS=[['cor','Pintura'],['roda','Rodas'],['adesivo','Adesivos'],['extra','Enfeites'],['buzina','Buzinas'],['pista','Pistas']];
const items=tab=>tab==='cor'||tab==='roda'?[['','Original',0],...LOJA[tab]]:tab==='adesivo'||tab==='extra'?[['','Nenhum',0],...LOJA[tab]]:LOJA[tab];
const L={vi:0,tab:'cor'};
const owned=()=>ls.get('thur-loja',[]);
/* cada carro tem as suas compras (pintura, rodas, adesivos, enfeites, buzina); pistas valem para todos */
const okey=(tab,id,vid)=>tab==='pista'?'pista:'+id:'c:'+vid+':'+tab+':'+id;
const has=(tab,id,price,vid)=>{if(!price)return true;const o=owned();const v=vid||V[L.vi].id;if(o.includes(okey(tab,id,v)))return true;
  /* compras antigas (antes valiam para todos): continuam valendo só no carro que já estava usando */
  return tab==='pista'?o.includes('pista:'+id):(o.includes(tab+':'+id)&&custom(v)[tab]===id)};
function using(tab,id){if(tab==='pista')return ls.get('thur-pista','dia')===id;const c=custom(V[L.vi].id)[tab];return tab==='buzina'?(c||'normal')===id:(c||'')===id}
function preview(tab,id){
  if(tab==='cor')return id?`<span class="swc" style="background:${id}"></span>`:`<span class="swc orig">${carSvg(V[L.vi])}</span>`;
  if(tab==='roda')return`<svg viewBox="-34 -34 68 68" class="ipv"><circle r="30" fill="#2B2B2B" stroke="#2E2440" stroke-width="4"/><circle r="16" fill="${id||'#FFD60A'}" stroke="#2E2440" stroke-width="3"/></svg>`;
  if(tab==='adesivo')return id?`<svg viewBox="-44 -36 88 72" class="ipv">${DECAL[id]}</svg>`:'<span class="ipt">—</span>';
  if(tab==='extra')return id?`<svg viewBox="0 0 120 90" class="ipv">${id!=='antena'?'<path d="M20 50 h80 l-10 -18 h-62 z" fill="#2B2B2B" stroke="#2E2440" stroke-width="4"/><path d="M60 50 v20" stroke="#2E2440" stroke-width="6"/>':''}${id!=='aero'?'<path d="M98 86 v-70" stroke="#2E2440" stroke-width="4"/><path d="M98 16 l-30 9 l30 9 z" fill="#FF4D4D" stroke="#2E2440" stroke-width="3"/>':''}</svg>`:'<span class="ipt">—</span>';
  if(tab==='buzina')return'<svg viewBox="0 0 32 32" class="ipv"><path d="M5 12h6l10-6v20l-10-6H5z" fill="#2E2440"/><path d="M24 11a6 6 0 0 1 0 10" fill="none" stroke="#2E2440" stroke-width="3" stroke-linecap="round"/></svg>';
  if(tab==='pista')return`<span class="swc" style="background:${grad(C.PISTAS[id])};border-radius:14px"></span>`;}
function render(){const v=V[L.vi];$('#lCar').innerHTML=carSvg(v);syncWallet();
  $('#lPick').innerHTML=V.map((x,i)=>`<button class="lpk${i===L.vi?' on':''}" data-i="${i}" aria-label="${x.n}">${carSvg(x)}</button>`).join('');
  $('#lTabs').innerHTML=TABS.map(([k,n])=>`<button class="ico txt${k===L.tab?' on':''}" data-t="${k}">${n}</button>`).join('');
  $('#lItems').innerHTML=items(L.tab).map(([id,n,price])=>{const ow=has(L.tab,id,price),us=using(L.tab,id);
    return`<button class="litem${us?' using':''}" data-id="${id}" data-p="${price}">${preview(L.tab,id)}<span class="lin">${n}</span><span class="lbt${ow?'':' buy'}">${us?'Usando':ow?'Usar':'<svg viewBox="0 0 32 32" width="20" height="20"><path d="M16 2l4.2 9 9.8 1.2-7.2 6.8 1.9 9.8L16 24 7.3 28.8l1.9-9.8L2 12.2 11.8 11z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/></svg>'+price}</span></button>`}).join('')}
function apply(tab,id){if(tab==='pista'){ls.set('thur-pista',id);return}const all=ls.get('thur-custom',{});const vid=V[L.vi].id;all[vid]=Object.assign({},all[vid],{[tab]:id||undefined});ls.set('thur-custom',all);if(tab==='buzina')C.horn(id)}
$('#lPick').onclick=e=>{const b=e.target.closest('.lpk');if(!b)return;L.vi=+b.dataset.i;pop(480);render()};
$('#lTabs').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;L.tab=b.dataset.t;pop(480);render()};
$('#lItems').onclick=e=>{const b=e.target.closest('.litem');if(!b)return;actx();const id=b.dataset.id,price=+b.dataset.p;
  if(!has(L.tab,id,price)){if(wallet()<price){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');pop(200);speak(`Faltam ${price-wallet()} estrelas! Corra na pista para ganhar mais!`);return}
    ls.set('thur-estrelas',wallet()-price);const o=owned();o.push(okey(L.tab,id,V[L.vi].id));ls.set('thur-loja',o);party();speak(L.tab==='pista'?'Pista comprada!':'Comprado para o '+V[L.vi].n.toLowerCase()+'! Ficou lindo!')}
  else{pop(640);if(L.tab==='buzina')null}
  apply(L.tab,id);render();const c=$('#lCar svg');if(c)c.animate([{transform:'scale(1)'},{transform:'scale(1.06) translateY(-4%)'},{transform:'scale(1)'}],{duration:420})};
C.openLoja=i=>{if(typeof i==='number')L.vi=i;render();show('loja')};
onShow.loja=render;
/* escolher a pista antes de correr */
function renderPistas(){syncWallet();$('#piGrid').innerHTML=Object.entries(C.PISTAS).map(([id,p])=>{const ow=has('pista',id,p.price);
  return`<button class="picard${ow?'':' lock'}" data-id="${id}"><span class="pisky" style="background:${grad(p)}"></span><b>${p.n}</b><span class="lbt${ow?'':' buy'}">${ow?'Correr!':'<svg viewBox="0 0 32 32" width="20" height="20"><path d="M16 2l4.2 9 9.8 1.2-7.2 6.8 1.9 9.8L16 24 7.3 28.8l1.9-9.8L2 12.2 11.8 11z" fill="#FFD60A" stroke="#2E2440" stroke-width="2"/></svg>'+p.price}</span></button>`}).join('')}
$('#piGrid').onclick=e=>{const b=e.target.closest('.picard');if(!b)return;actx();const id=b.dataset.id,p=C.PISTAS[id];
  if(!has('pista',id,p.price)){if(wallet()<p.price){b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');pop(200);speak(`Faltam ${p.price-wallet()} estrelas para a pista ${p.n}! Corra para ganhar mais!`);return}
    ls.set('thur-estrelas',wallet()-p.price);const o=owned();o.push(okey('pista',id));ls.set('thur-loja',o);party();speak(`Pista ${p.n} comprada!`)}
  pop(640);ls.set('thur-pista',id);C.openPista()};
C.openPistas=()=>{renderPistas();show('pistas');speak('Escolha a pista!')};
onShow.pistas=renderPistas;
const og=onShow.garagem;onShow.garagem=()=>{og&&og();syncWallet()};
$('#garLoja').onclick=()=>{pop(480);C.openLoja()};
syncWallet();
}
