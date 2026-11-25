/* Turma do Thur — dados do app */
'use strict';
const SW=w=>`stroke="#2E2440" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;const S=SW(5);
const R=d=>d.replace(/<(path|circle|ellipse|rect|polygon)\b(?![^>]*class="k")/g,'<$1 class="r" fill="#fff" '+S);
const band=(x,y,o,i)=>`<path d="M${x-o} ${y} A${o} ${o} 0 0 1 ${x+o} ${y} L${x+i} ${y} A${i} ${i} 0 0 0 ${x-i} ${y} Z"/>`;
const star=(cx,cy,Ro,Ri)=>{let p=[];for(let k=0;k<10;k++){const a=Math.PI/5*k-Math.PI/2,r=k%2?Ri:Ro;p.push((cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1))}return`<polygon points="${p.join(' ')}"/>`};
const rays=()=>{let s='';for(let k=0;k<10;k++){const a=Math.PI/5*k,P=(r,d)=>(200+r*Math.cos(a+d)).toFixed(1)+','+(200+r*Math.sin(a+d)).toFixed(1);s+=`<polygon points="${P(104,-.17)} ${P(178,0)} ${P(104,.17)}"/>`}return s};
const petals=()=>{let s='';for(let k=0;k<6;k++)s+=`<ellipse cx="200" cy="96" rx="30" ry="50" transform="rotate(${k*60} 200 150)"/>`;return s};
const PAGES=[
{n:'Zuzu',s:R(`<ellipse cx="150" cy="80" rx="26" ry="66" transform="rotate(-12 150 80)"/><ellipse cx="292" cy="150" rx="26" ry="66" transform="rotate(64 292 150)"/>
<path d="M200 100 C290 100 310 190 304 266 C298 346 252 368 200 368 C148 368 102 346 96 266 C90 190 110 100 200 100 Z"/><ellipse cx="200" cy="300" rx="58" ry="46"/>
<ellipse cx="166" cy="376" rx="28" ry="15"/><ellipse cx="234" cy="376" rx="28" ry="15"/>
<path class="k" d="M300 320 C360 318 368 236 334 222 C314 214 302 236 316 246" fill="none" ${SW(9)}/>${star(316,224,26,11)}
<path class="k" d="M136 214 q20 -20 40 0" fill="none" ${SW(7)}/><ellipse class="k" cx="238" cy="212" rx="24" ry="29" fill="#2E2440"/><circle class="k" cx="246" cy="202" r="8" fill="#fff"/>
<path class="k" d="M164 250 Q200 290 236 250 Z" fill="#2E2440" ${S}/><path d="M190 262 Q194 296 210 296 Q224 296 222 262 Z"/>`)},
{n:'Lelo',s:R(`<path class="k" d="M200 160 C198 128 206 108 220 98" fill="none" ${SW(7)}/><circle cx="224" cy="86" r="18"/>
<path d="M200 156 C318 156 352 244 344 292 C336 344 270 352 200 352 C130 352 64 344 56 292 C48 244 82 156 200 156 Z"/>
<ellipse cx="46" cy="290" rx="16" ry="24" transform="rotate(20 46 290)"/><ellipse cx="354" cy="290" rx="16" ry="24" transform="rotate(-20 354 290)"/>
<ellipse cx="150" cy="358" rx="30" ry="14"/><ellipse cx="250" cy="358" rx="30" ry="14"/>
<path class="k" d="M98 214 q18 -12 36 -2 M266 212 q18 -10 36 2" fill="none" ${S}/><circle class="k" cx="118" cy="240" r="12" fill="#2E2440"/><circle class="k" cx="282" cy="240" r="12" fill="#2E2440"/>
<path class="k" d="M126 266 Q200 344 274 266 Z" fill="#2E2440" ${S}/><rect x="176" y="266" width="22" height="24" rx="4"/><rect x="202" y="266" width="22" height="24" rx="4"/>`)},
{n:'Pituca',s:R(`<path class="k" d="M168 120 C162 100 174 88 166 72 C158 58 170 48 164 36 M232 120 C238 100 226 86 236 72 C244 60 236 50 244 38" fill="none" ${S}/>
<path d="M160 40 C140 24 140 6 156 6 C162 6 166 12 166 14 C166 12 170 6 176 6 C192 6 190 24 160 40 Z"/>${star(246,34,24,10)}
<ellipse cx="96" cy="140" rx="18" ry="32" transform="rotate(-35 96 140)"/><ellipse cx="304" cy="140" rx="18" ry="32" transform="rotate(35 304 140)"/>
<ellipse cx="160" cy="300" rx="20" ry="30" transform="rotate(30 160 300)"/><ellipse cx="240" cy="300" rx="20" ry="30" transform="rotate(-30 240 300)"/>
<circle cx="200" cy="200" r="100"/><ellipse cx="128" cy="232" rx="18" ry="11"/><ellipse cx="272" cy="232" rx="18" ry="11"/>
<path class="k" d="M140 166 l26 14 l-26 14 M260 166 l-26 14 l26 14" fill="none" ${SW(7)}/>
<path class="k" d="M156 212 Q200 280 244 212 Z" fill="#2E2440" ${S}/><ellipse cx="200" cy="248" rx="20" ry="11"/>`)},
{n:'Bubu',s:R(`<path d="M120 330 C60 330 48 262 96 244 C74 190 136 158 170 184 C184 124 284 124 294 182 C340 168 380 212 354 254 C394 272 382 330 324 330 Z"/>
${band(320,110,48,36)}${band(320,110,36,24)}${band(320,110,24,12)}
<ellipse cx="170" cy="340" rx="28" ry="14"/><ellipse cx="270" cy="340" rx="28" ry="14"/><ellipse cx="150" cy="292" rx="16" ry="10"/><ellipse cx="306" cy="292" rx="16" ry="10"/>
<path class="k" d="M164 254 Q180 236 196 254 M260 254 Q276 236 292 254" fill="none" ${SW(7)}/><path class="k" d="M210 286 q9 11 18 0 q9 11 18 0" fill="none" ${S}/>`)},
{n:'Sol',s:R(`${rays()}<circle cx="200" cy="200" r="96"/><ellipse cx="150" cy="226" rx="16" ry="10"/><ellipse cx="250" cy="226" rx="16" ry="10"/>
<circle class="k" cx="166" cy="186" r="11" fill="#2E2440"/><circle class="k" cx="234" cy="186" r="11" fill="#2E2440"/><path class="k" d="M160 236 Q200 270 240 236" fill="none" ${SW(7)}/>`)},
{n:'Flor',s:R(`<path d="M192 210 L208 210 L210 316 L190 316 Z"/><path d="M200 280 C160 240 120 250 112 272 C140 292 176 292 200 280 Z"/><path d="M204 256 C240 214 282 222 290 244 C262 266 226 268 204 256 Z"/>
${petals()}<circle cx="200" cy="150" r="38"/><polygon points="120,316 280,316 260,392 140,392"/><rect x="110" y="304" width="180" height="26" rx="8"/>
<circle class="k" cx="188" cy="144" r="5" fill="#2E2440"/><circle class="k" cx="212" cy="144" r="5" fill="#2E2440"/><path class="k" d="M186 160 Q200 172 214 160" fill="none" ${SW(4)}/>`)},
{n:'Borboleta',s:R(`<path d="M196 190 C150 80 50 70 54 150 C58 200 120 212 196 200 Z"/><path d="M204 190 C250 80 350 70 346 150 C342 200 280 212 204 200 Z"/>
<path d="M196 206 C130 214 80 260 110 300 C140 330 186 280 196 230 Z"/><path d="M204 206 C270 214 320 260 290 300 C260 330 214 280 204 230 Z"/>
<circle cx="110" cy="146" r="22"/><circle cx="290" cy="146" r="22"/><circle cx="140" cy="270" r="14"/><circle cx="260" cy="270" r="14"/>
<ellipse cx="200" cy="216" rx="14" ry="74"/><path class="k" d="M194 146 C186 116 170 100 158 92 M206 146 C214 116 230 100 242 92" fill="none" ${S}/><circle cx="156" cy="90" r="9"/><circle cx="244" cy="90" r="9"/>`)},
{n:'Carrinho',s:R(`<rect x="8" y="8" width="384" height="384" rx="20"/><rect x="8" y="290" width="384" height="102" rx="20"/>
<path d="M120 170 L160 116 L262 116 L300 170 Z"/><path d="M50 176 Q50 166 62 166 L340 166 Q356 166 356 182 L356 248 Q356 260 344 260 L58 260 Q46 260 46 248 Z"/>
<path d="M142 166 L170 128 L206 128 L206 166 Z"/><path d="M218 166 L218 128 L254 128 L280 166 Z"/><rect x="330" y="186" width="22" height="20" rx="6"/>
<circle cx="120" cy="264" r="38"/><circle cx="284" cy="264" r="38"/><circle cx="120" cy="264" r="15"/><circle cx="284" cy="264" r="15"/>
<path class="k" d="M40 340 h50 M150 340 h50 M260 340 h50" fill="none" ${SW(8)}/>`)},
{n:'Maçã',s:R(`<path d="M200 120 C150 80 70 100 74 200 C78 300 150 360 200 334 C250 360 322 300 326 200 C330 100 250 80 200 120 Z"/>
<rect x="192" y="60" width="16" height="60" rx="6"/><path d="M210 94 C230 50 286 50 300 70 C276 104 236 108 210 94 Z"/><ellipse cx="128" cy="186" rx="14" ry="30" transform="rotate(20 128 186)"/>
<circle class="k" cx="168" cy="216" r="10" fill="#2E2440"/><circle class="k" cx="232" cy="216" r="10" fill="#2E2440"/><path class="k" d="M172 250 Q200 276 228 250" fill="none" ${SW(6)}/>`)},
{n:'Foguete',s:R(`<rect x="8" y="8" width="384" height="384" rx="20"/>${star(70,70,22,9)}${star(330,110,18,7)}${star(80,300,16,6)}${star(340,320,20,8)}
<path d="M176 300 C170 330 186 360 200 380 C214 360 230 330 224 300 Z"/><polygon points="160,240 112,300 160,290"/><polygon points="240,240 288,300 240,290"/>
<path d="M160 290 L160 140 C160 100 180 70 200 46 C220 70 240 100 240 140 L240 290 Z"/><path d="M164 120 C172 90 186 66 200 50 C214 66 228 90 236 120 Z"/>
<circle cx="200" cy="186" r="26"/><rect x="170" y="250" width="60" height="18" rx="6"/>`)},
{n:'Arco-íris',s:R(`<rect x="8" y="8" width="384" height="384" rx="20"/>${band(200,280,170,146)}${band(200,280,146,122)}${band(200,280,122,98)}${band(200,280,98,74)}${band(200,280,74,50)}
<path d="M20 300 C20 270 56 262 70 280 C80 256 120 258 122 286 C142 286 146 316 124 318 L36 318 C18 318 14 302 20 300 Z"/><path d="M278 300 C278 270 314 262 328 280 C338 256 378 258 380 286 C392 290 392 316 376 318 L294 318 C276 318 272 302 278 300 Z"/>
<circle cx="70" cy="70" r="30"/>`)},
{n:'Gatinho',s:R(`<path d="M300 300 C360 300 380 240 350 210 C340 200 326 212 336 226 C350 250 330 276 300 276 Z"/>
<ellipse cx="200" cy="300" rx="100" ry="76"/><polygon points="116,120 132,40 184,92"/><polygon points="284,120 268,40 216,92"/><polygon points="132,108 140,66 168,94"/><polygon points="268,108 260,66 232,94"/>
<circle cx="200" cy="170" r="90"/><ellipse cx="150" cy="370" rx="30" ry="16"/><ellipse cx="250" cy="370" rx="30" ry="16"/>
<ellipse class="k" cx="166" cy="160" rx="12" ry="16" fill="#2E2440"/><ellipse class="k" cx="234" cy="160" rx="12" ry="16" fill="#2E2440"/><polygon points="190,190 210,190 200,202"/>
<path class="k" d="M200 202 q-10 14 -24 8 M200 202 q10 14 24 8 M110 186 h46 M112 204 l44 -6 M290 186 h-46 M288 204 l-44 -6" fill="none" ${SW(4)}/>`)},
{n:'Casinha',s:R(`<rect x="8" y="8" width="384" height="300" rx="20"/><rect x="8" y="296" width="384" height="96" rx="20"/><circle cx="324" cy="76" r="38"/>
<path d="M60 70 C60 50 92 46 100 60 C110 42 146 48 142 72 C156 74 156 96 138 96 L66 96 C48 96 46 74 60 70 Z"/>
<rect x="236" y="120" width="30" height="60"/><polygon points="80,196 200,104 320,196"/><rect x="100" y="196" width="200" height="132"/>
<rect x="176" y="250" width="48" height="78" rx="6"/><rect x="118" y="220" width="44" height="44"/><rect x="238" y="220" width="44" height="44"/>
<path class="k" d="M140 220 v44 M118 242 h44 M260 220 v44 M238 242 h44 M60 372 v-36" fill="none" ${S}/><circle cx="60" cy="326" r="14"/><circle cx="60" cy="304" r="12"/><circle cx="82" cy="326" r="12"/><circle cx="38" cy="326" r="12"/><circle cx="60" cy="348" r="12"/>`)},
{n:'Peixinho',s:R(`<rect x="8" y="8" width="384" height="384" rx="20"/><path d="M8 330 C80 310 140 340 200 326 C270 310 330 336 392 320 L392 372 Q392 392 372 392 L28 392 Q8 392 8 372 Z"/>
<path d="M64 330 C40 280 80 250 60 200 C90 240 70 290 96 330 Z"/><path d="M330 326 C318 280 350 260 336 222 C364 256 350 292 360 326 Z"/>
<polygon points="300,190 362,140 362,240"/><path d="M90 190 C120 120 250 110 306 190 C250 270 120 260 90 190 Z"/>
<path d="M170 132 C182 160 182 220 170 248 L196 252 C208 222 208 158 196 130 Z"/><path d="M232 140 C242 166 242 214 232 240 L254 230 C262 208 262 172 254 150 Z"/><path d="M190 128 C200 100 236 98 250 124 Z"/>
<circle cx="132" cy="178" r="16"/><circle class="k" cx="136" cy="178" r="7" fill="#2E2440"/><circle cx="110" cy="96" r="12"/><circle cx="86" cy="64" r="9"/><circle cx="104" cy="36" r="6"/>`)}
];
const pageSvg=(p,extra='')=>`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Desenho: ${p.n}"><defs></defs>${p.s}${extra}</svg>`;

/* pintura por números: cores numeradas e o número de cada área, na ordem das áreas */
const PLANS={
 'Sol':{c:['#FF9F1C','#FFD60A','#FF85C0'],p:[0,0,0,0,0,0,0,0,0,0,1,2,2]},
 'Maçã':{c:['#FF4D4D','#8D5B3E','#4CC764','#FFC2CC'],p:[0,1,2,3]},
 'Peixinho':{c:['#4FB3F0','#F4C9A0','#4CC764','#FF9F1C','#FFD60A','#FFFFFF','#BDE6FF'],p:[0,1,2,2,3,4,3,3,3,5,6,6,6]},
 'Casinha':{c:['#BDE6FF','#4CC764','#FFD60A','#FFFFFF','#8D5B3E','#FF4D4D','#FFE7A8','#4FB3F0','#FF85C0'],p:[0,1,2,3,4,5,6,4,7,7,2,8,8,8,8]},
 'Flor':{c:['#4CC764','#8FE0A0','#FF85C0','#FFD60A','#FF9F1C','#8D5B3E'],p:[0,1,1,2,2,2,2,2,2,3,4,5]},
 'Pituca':{c:['#FF85C0','#4FB3F0','#FFD60A','#FF9F1C','#FF4D4D'],p:[0,1,2,2,3,3,2,0,0,4]}
};

/* pixel por números: '.' fica em branco */
const PIXELS=[
 {n:'Coração',c:['#FF4D4D','#FFB3BE'],g:['.111...111.','11211.11111','12211111111','11111111111','11111111111','.111111111.','..1111111..','...11111...','....111....','.....1.....']},
 {n:'Estrela',c:['#FFD60A','#FF9F1C'],g:['.....1.....','....111....','....121....','11111211111','.111121111.','..1112111..','..1111111..','.111.1.111.','.11.....11.','.1.......1.']},
 {n:'Maçã',c:['#FF4D4D','#4CC764','#8D5B3E','#FFFFFF'],g:['....3.22..','....322...','.1111311..','111111111.','141111111.','141111111.','111111111.','111111111.','.1111111..','..11.11...']},
 {n:'Carinha',c:['#FFD60A','#2B2B2B','#FF85C0'],g:['...1111...','.11111111.','.11211211.','1112112111','1111111111','1311111131','1121111211','.11222211.','.11111111.','...1111...']},
 {n:'Casinha',c:['#FF4D4D','#FFE07A','#8D5B3E','#4FB3F0'],g:['....11....','...1111...','..111111..','.11111111.','1111111111','.22222222.','.24422442.','.24422442.','.22233222.','.22233222.']},
 {n:'Cogumelo',c:['#FF4D4D','#FFFFFF','#F4C9A0','#2B2B2B'],g:['...1111...','..112111..','.11111211.','.12111111.','1111121111','1111111111','...3333...','...4334...','...3333...','...3333...']}
];

/* revelar: esfregar para descobrir a imagem colorida */
const REVEAL=[{n:'Turma',f:'img/rev/turma.jpg'},{n:'Thur',f:'img/rev/thur.jpg'},{n:'Zuzu',f:'img/rev/zuzu.jpg'},{n:'Lelo',f:'img/rev/lelo.jpg'},{n:'Pituca',f:'img/rev/pituca.jpg'},{n:'Bubu',f:'img/rev/bubu.jpg'}];
const PETS=['zuzu','lelo','pituca','bubu'];

const LETRAS=[['A','Abelha','🐝'],['B','Bola','⚽'],['C','Casa','🏠'],['D','Dado','🎲'],['E','Elefante','🐘'],['F','Foca','🦭'],['G','Gato','🐱'],['H','Hipopótamo','🦛'],['I','Ilha','🏝️'],['J','Jacaré','🐊'],['K','Kiwi','🥝'],['L','Leão','🦁'],['M','Macaco','🐒'],['N','Navio','🚢'],['O','Ovo','🥚'],['P','Pato','🦆'],['Q','Queijo','🧀'],['R','Rato','🐭'],['S','Sol','☀️'],['T','Tartaruga','🐢'],['U','Uva','🍇'],['V','Vaca','🐄'],['W','Waffle','🧇'],['X','Xícara','☕'],['Y','Yoga','🧘'],['Z','Zebra','🦓']];
const NUMS=['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove'];
const PALAVRAS=[['SOL','☀️'],['LUA','🌙'],['UVA','🍇'],['OVO','🥚'],['PATO','🦆'],['GATO','🐱'],['BOLA','⚽'],['CASA','🏠'],['BOLO','🎂'],['SAPO','🐸'],['VACA','🐄'],['DADO','🎲'],['FLOR','🌸'],['PEIXE','🐟'],['MALA','🧳'],['PIPOCA','🍿']];
const STICKERS=['🍎','🍓','🍉','🍌','🍦','🧁','🍭','🎈','🎨','🖍️','⭐','🌈','🦄','🐶','🐱','🐰','🦊','🐼','🐸','🐥','🦋','🐞','🚀','🚗','🚂','⚽','🎸','👑','💎','🌻'];
