// Ecos de Valdoria — Interiores, a Guilda de Valdor e o mural de missões
'use strict';
// ================== TEMA DE INTERIOR (8) ==================
// piso de tábuas (GP), tapete da entrada (PC: o "trecho de estrada" que entra pela porta vira tapete), paredes de madeira (CLFT)
GP[8]=['#8a6440','#7e5a38','#5a3e24','#9a7450'];PC[8]=['#8a2a2a','#7a2222','#a8443a'];WC[8]=['#1e2e3e','#26384a','#5a7a9a'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[8]=o[8].map(hexRGB);
CLFT[8]=['#6a4a34','#4a3222','#2a1c12','#8a6a4a','#7a5a3e','#120c08','#0d0906'].map(hexRGB);
MINIC.obj[8]='#b08a5a';
// um cômodo retangular no meio do mapa (M.room=[largura,altura]); o resto é parede e escuridão, como na caverna
// com M.round, o cômodo é redondo (oval dentro do mesmo retângulo; ex.: o salão da Torre, em 21)
function roomMask(M){const C=new Uint8Array(W*H),[w,h]=M.room,x0=TC.x-(w>>1),y0=TC.y-(h>>1),cx=x0+w/2,cy=y0+h/2;
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)if(!M.round||((x+.5-cx)/(w/2))**2+((y+.5-cy)/(h/2))**2<1)C[y*W+x]=1;
 for(const p of Object.values(M.portals))C[Math.round(p[1])*W+Math.round(p[0])]=1;return C;}

// ================== SPRITES ==================
// cabana rústica de toras (vilas florestais como Pinheiral): mesmo tamanho e porta da genHouse, para as placas caberem igual
function genCabin(roof,roofD){const c=cnv(32,32),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f(K,3,14,26,18);for(let y=15;y<31;y+=3){f('#7a4e2c',4,y,24,2);f('#5a3820',4,y+2,24,1);}
 for(const lx of[2,28])for(let y=15;y<31;y+=3){f(K,lx,y,2,2);f('#b8844c',lx,y,1,1);}
 f(K,12,21,8,11);f('#5a3820',13,22,6,10);f('#4a2e18',15,22,1,10);f('#e8b43c',17,26,1,1);
 f(K,4,18,6,6);f('#ffd86a',5,19,4,4);f('#6a4222',7,19,1,4);f(K,22,18,6,6);f('#ffd86a',23,19,4,4);f('#6a4222',25,19,1,4);
 f(K,21,0,5,8);f('#8d8778',22,1,3,7);
 for(let y=0;y<15;y++){const hw=Math.min(15,2+y);f(K,16-hw-1,y+1,hw*2+2,1);f(y%2?roofD:roof,16-hw,y+1,hw*2,1);if(y%3===1)for(let i=16-hw+1;i<16+hw;i+=3)f(roofD,i,y+1,1,1);}
 return c;}
// contorno escuro (k) em volta de tudo que foi desenhado: para desenhos grandes feitos com retângulos
function outlineK(c){const x=c.getContext('2d'),W_=c.width,H_=c.height,d=x.getImageData(0,0,W_,H_),D=d.data,o=new Uint8ClampedArray(D),a=(i,j)=>i<0||j<0||i>=W_||j>=H_?0:D[(j*W_+i)*4+3];
 for(let j=0;j<H_;j++)for(let i=0;i<W_;i++)if(a(i,j)<200&&(a(i-1,j)>200||a(i+1,j)>200||a(i,j-1)>200||a(i,j+1)>200)){const k=(j*W_+i)*4;o[k]=0x1b;o[k+1]=0x13;o[k+2]=0x20;o[k+3]=255;}
 x.putImageData(new ImageData(o,W_,H_),0,0);return c;}
// A Guilda: salão de dois andares (64×98, ocupa 4×3 tiles), visto de cima em 3/4, com torre de sino, placa de espadas cruzadas
// e estandartes roxos. est=0 (Valdor): térreo de pedra, enxaimel e telhado roxo; est=1 (Pinheiral): toras e telhado verde-pinho;
// est=2 (Arcádia): pedra, enxaimel e telhado azul-noite de beirada prateada.
// Placa, estandartes e bandeira são roxos em toda cidade: é por eles que o jogador reconhece a Guilda.
function guildaGrande(est){const c=cnv(64,98),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);},G0=66,G1=94,rus=est===1;
 const Q=[{R:'#6a3a8a',RD:'#4a2468',RL:'#8a5aaa',RS:'#5a2e78',E:'#2a1640',T:'#6a4526',P:'#e8d6b0',PL:'#f4e6c4',L:'#a8a296',D:'#6a655c'},
  {R:'#2f6a4a',RD:'#1f4a34',RL:'#4a8a64',RS:'#285a3e',E:'#12281c',T:'#4a2e18',P:'#8a5a32',PL:'#a8743c',L:'#b8844c',D:'#4a2e18'},
  {R:'#2a3a6a',RD:'#1c2850',RL:'#c8d4ec',RS:'#24325c',E:'#10162c',T:'#4a4a62',P:'#e4e0d4',PL:'#f2eee4',L:'#a8a296',D:'#6a655c'},
  {R:'#b8603a',RD:'#8a4428',RL:'#d8845a',RS:'#9a5030',E:'#4a2010',T:'#6a4a2a',P:'#ecdcb8',PL:'#f6eacc',L:'#e0c890',D:'#9a7a50'}][est]; // 3: arenito e terracota (Sahrem, 25)
 const arn=est===3,PE=arn?['#9a7a50','#ecd4a0','#cdb07a']:['#5e5a52','#a8a296','#8a8478'];
 // parede de pedra (blocos desencontrados) ou de toras, com a luz vindo da esquerda
 const wall=(x0,y0,w,h,b)=>{for(let yy=y0;yy<y0+h;yy++)for(let xx=x0;xx<x0+w;xx++){const r=Math.floor((yy-y0)/b);
   f(rus?((yy-y0)%3===2?'#5a3820':(xx*5+yy*3)%13===0?'#9a6a3c':'#7a4e2c'):((yy-y0)%b===0||(xx+(r%2)*b)%(b*2)===0?PE[0]:(xx*7+yy*13)%11===0?PE[1]:PE[2]),xx,yy,1,1);}
  f(Q.L,x0,y0,1,h);f(Q.D,x0+w-1,y0,1,h);};
 // térreo e andar de cima (reboco com enxaimel, ou tábuas)
 wall(4,G0,56,G1-G0,4);f(Q.D,4,G1-2,56,2);
 f(Q.P,6,46,52,20);f(Q.PL,6,48,52,1);if(rus)for(let xx=8;xx<58;xx+=4)f('#6a4224',xx,46,1,20);
 f(Q.T,6,46,52,2);f(Q.T,6,64,52,2);for(const bx of[6,16,26,36,46,56])f(Q.T,bx,46,2,20);
 for(const[bx,dir]of[[18,1],[48,-1]])for(let i=0;i<8;i++)f(Q.T,dir>0?bx+i:bx-i+6,49+i*2,2,2);
 for(const wx of[9,19,39,49]){f(K,wx,50,6,9);f('#ffd06a',wx+1,51,4,7);f('#fff0b0',wx+1,51,4,2);f(Q.T,wx+2,51,1,7);f(Q.T,wx+1,54,4,1);
  f(Q.T,wx-1,59,8,2);for(let i=0;i<8;i+=2)f(i%4?'#ffd84a':'#d8403a',wx-1+i,58,1,1);f('#4a9a42',wx,58,1,1);f('#4a9a42',wx+4,58,1,1);}
 f(K,29,51,6,6);f('#ffd06a',30,52,4,4);f(Q.T,31,52,2,4);f(Q.T,30,53,4,1);
 // telhado de quatro águas, com fileiras de telhas
 for(let yy=0;yy<24;yy++){const t=yy/23,xl=Math.round(16-t*14),xr=Math.round(47+t*14),row=Math.floor(yy/3);
  for(let xx=xl;xx<=xr;xx++)f(xx-xl<2?Q.RL:xr-xx<2?Q.RD:yy%3===2?Q.RD:(xx+(row%2)*3)%6===0?Q.RS:Q.R,xx,yy+22,1,1);}
 f(Q.RL,16,21,32,1);f(Q.E,2,45,60,1);
 // chaminé de pedra
 for(let yy=26;yy<40;yy++)for(let xx=49;xx<54;xx++)f(yy%3===0||xx===51&&yy%6<3?'#5e5a52':'#8a8478',xx,yy,1,1);f('#6a655c',48,25,7,2);
 // torre do sino, com telhado pontudo e a bandeira roxa da Guilda
 wall(26,16,12,20,3);f('#2a1c16',29,19,6,8);f('#e8b43c',30,22,4,4);f('#ffe08a',30,22,1,3);f('#b8842c',31,26,2,1);
 for(let yy=0;yy<10;yy++){const hw=Math.round(1+yy*.62);for(let xx=32-hw;xx<32+hw;xx++)f(xx===32-hw?Q.RL:xx===31+hw?Q.RD:yy%3===2?Q.RD:Q.R,xx,yy+6,1,1);}
 f(Q.D,25,15,14,1);f('#2a1c16',31,0,1,7);f('#7a3a9a',32,0,6,4);f('#9a5aba',32,0,6,1);f('#e8b43c',34,1,2,2);
 // portão em arco, degraus, placa das espadas, estandartes, janelas e lampiões
 f(Q.L,25,G0+7,14,G1-G0-7);f(K,26,G0+9,12,G1-G0-9);f('#7a4e2c',27,G0+10,10,G1-G0-10);
 for(let xx=27;xx<37;xx+=3)f('#5a3820',xx,G0+10,1,G1-G0-10);f('#5a3820',31,G0+10,2,G1-G0-10);f('#e8b43c',30,G0+19,1,2);f('#e8b43c',33,G0+19,1,2);
 f(K,27,G0+8,10,1);f(K,28,G0+7,8,1);f('#8a8478',26,G0+8,1,1);f('#8a8478',37,G0+8,1,1);
 f('#a8a296',23,G1,18,2);f('#8a8478',21,G1+2,22,2);f('#6a655c',21,G1+3,22,1);
 f(K,24,G0+1,16,7);f('#c8a060',25,G0+2,14,5);f('#8a6a3a',25,G0+6,14,1);
 for(let i=0;i<5;i++){f('#dfe6ef',28+i*1.6|0,G0+2+i,1,1);f('#dfe6ef',35-(i*1.6|0),G0+2+i,1,1);}f('#e8b43c',31,G0+6,2,1);
 for(const bx of[18,42]){f('#7a3a9a',bx,G0+3,4,12);f('#9a5aba',bx,G0+3,1,12);f('#5a2478',bx+3,G0+3,1,12);f('#e8b43c',bx+1,G0+7,2,2);f(Q.T,bx-1,G0+2,6,1);f('#7a3a9a',bx+1,G0+15,2,1);}
 for(const wx of[8,49]){f(K,wx,G0+9,8,11);f('#ffd06a',wx+1,G0+11,6,8);f('#ffd06a',wx+2,G0+10,4,1);f('#fff0b0',wx+1,G0+11,6,2);f(Q.T,wx+4,G0+10,1,9);f(Q.L,wx,G0+20,8,1);}
 for(const lx of[23,40]){f(K,lx,G0+10,2,1);f('#ffcf5a',lx,G0+11,2,3);f('#fff0b0',lx,G0+11,1,1);}
 return outlineK(c);}
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // a casa da Guilda: o salão grande (guildaGrande, acima); Valdor de pedra, Pinheiral de toras
 reg('guilda',guildaGrande(0));reg('guilda2',guildaGrande(1));
 reg('mural',box(32,26,f=>{f(K,1,0,30,22);f('#8a5a30',2,1,28,20);f('#6a4222',2,1,28,2);f('#6a4222',2,19,28,2);f('#c8a870',4,3,24,16);
  f('#f4ecd8',6,5,7,8);f('#f4ecd8',15,4,6,7);f('#fff4dc',22,6,5,9);f('#f0e0c0',12,12,8,6);
  f('#8a7a60',7,7,5,1);f('#8a7a60',7,9,4,1);f('#8a7a60',16,6,4,1);f('#8a7a60',23,8,3,1);f('#8a7a60',23,10,3,1);f('#8a7a60',13,14,6,1);
  f('#d8403a',9,5,1,1);f('#3a7ad8',18,4,1,1);f('#3ad85a',24,6,1,1);f('#d8b03a',16,12,1,1);
  f(K,5,22,3,4);f('#6a4222',6,22,1,4);f(K,24,22,3,4);f('#6a4222',25,22,1,4);}));
 reg('mesa',box(16,14,f=>{f(K,0,3,16,6);f('#9a6a3a',1,4,14,4);f('#b8844c',1,4,14,1);f(K,2,9,3,5);f('#6a4222',3,9,1,5);f(K,11,9,3,5);f('#6a4222',12,9,1,5);
  f(K,5,0,4,4);f('#d8c8a0',6,1,2,3);f(K,10,1,3,3);f('#e8b43c',11,2,1,1);}));
 reg('barril',box(16,16,f=>{f(K,3,1,10,15);f('#8a5a30',4,2,8,13);f('#a8743c',5,2,2,13);f('#4a4a52',3,4,10,1);f('#4a4a52',3,11,10,1);f('#6a4222',4,2,8,1);}));}

// ================== MAPAS ==================
// A porta é um portal comum com a marca 'porta' (sem redemoinho). Portais podem ter meio tile, para ficar no centro da porta.
// Cada cidade principal tem a sua Guilda: a casa fica à direita da praça (TC.x+6, TC.y-3) e o salão mostra as missões da cidade (city).
function guildHall(id,city,sprite,seed){const C=MAPS[city],n='Guilda de '+C.n.replace(/^(Vila|Aldeia|Cidade) de /,'');
 C.houses=(C.houses||[[TC.x-7,TC.y+4,'house0'],[TC.x+6,TC.y+4,'house1'],[TC.x-7,TC.y-3,'house2']]).filter(h=>!(h[0]===TC.x+6&&h[1]===TC.y-3)).concat([[TC.x+6,TC.y-3,sprite,n]]);
 C.portals[id]=[TC.x+6.5,TC.y-2,'porta'];
 MAPS[id]={n,s:'Mural de missões',interior:1,city,theme:8,seed,color:'#2a1c12',home:city,room:[16,10],
  portals:{[city]:[TC.x,TC.y+5,'porta']},board:[TC.x-1,TC.y-5],
  deco:[[TC.x-1,TC.y-5,'mural',1],[TC.x-5,TC.y-1,'mesa'],[TC.x+4,TC.y-1,'mesa'],[TC.x-7,TC.y-4,'barril'],[TC.x+6,TC.y-4,'barril']]};}
guildHall('guilda','valdor','guilda',1001); // o id 'guilda' fica para Valdor: saves já podem estar nesse mapa
guildHall('guildaPinheiral','pinheiral','guilda2',1002);

// ================== MURAL DE MISSÕES ==================
// Missões padrão da Guilda: problemas nos mapas vizinhos, com materiais como prova. Repetem com espera (MISS_CD, tempo real).
const MISS=[
 {city:'valdor',id:'esquilos',t:'Praga de esquilos',map:'estrada',mat:'esquilo',n:10,lv:2,txt:'Um bando de Esquilos Ruivos está causando problemas na Estrada do Sul, bem na saída da vila. Traga 10 Pelos de Esquilo para provar que nos ajudou a acabar com essa peste.'},
 {city:'valdor',id:'geleias',t:'Geleia no poço',map:'floresta',mat:'slime',n:12,lv:3,txt:'As Geleias da Floresta Verdejante estão escorrendo até o poço da vila e a água ficou com gosto de musgo. Traga 12 Musgos de Geleia.'},
 {city:'valdor',id:'lobos',t:'Lobos no rebanho',map:'floresta',mat:'lobo',n:8,lv:5,txt:'Os pastores perderam três ovelhas esta semana. Os Lobos Cinzentos da Floresta precisam aprender a ter medo da vila. Traga 8 Presas de Lobo.'},
 {city:'valdor',id:'aranhas',t:'Teias na trilha',map:'pantano',mat:'aranha',n:8,lv:10,txt:'As Aranhas do Pântano teceram teias sobre a trilha e nenhum mercador passa mais por lá. Traga 8 Sedas de Aranha.'},
 {city:'valdor',id:'ossos',t:'Mortos sem descanso',map:'pantano',mat:'esqueleto',n:8,lv:12,txt:'Esqueletos andam pelo Pântano Sombrio à noite e assustam quem volta das Ruínas. Traga 8 Ossos Velhos para que o sacerdote os abençoe.'},
 {city:'valdor',id:'orcs',t:'Saqueadores nas Ruínas',map:'ruinas',mat:'orc',n:6,lv:16,txt:'Orcs Saqueadores montaram acampamento nas Ruínas Esquecidas e atacam as caravanas. Traga 6 Dentes de Orc como prova.'},
 {city:'valdor',id:'golems',t:'Pedras que andam',map:'ruinas',mat:'golem',n:3,lv:18,txt:'Golens de Pedra despertaram nas Ruínas e a terra treme até em Valdor. Traga 3 Núcleos de Pedra para os estudiosos da Guilda.'},
 {city:'pinheiral',id:'esporos',t:'Cogumelos na horta',map:'encosta1',mat:'esporinho',n:10,lv:2,txt:'Esporinhos brotaram nas hortas da Encosta de Pinheiral 01 e estão sufocando as couves da aldeia. Traga 10 Esporos Laranja.'},
 {city:'pinheiral',id:'vermes',t:'Vermes na trilha',map:'encosta2',mat:'verme',n:8,lv:6,txt:'Os Vermes-de-Cauda cavaram buracos na trilha da Encosta 02 e as carroças de lenha estão atolando. Traga 8 Cascas de Verme.'},
 {city:'pinheiral',id:'jiboias',t:'Sumiço das galinhas',map:'encosta3',mat:'jiboia',n:8,lv:10,txt:'Todo dia some uma galinha, e os rastros levam às Jiboias da Encosta 03. Traga 8 Escamas de Jiboia.'},
 {city:'pinheiral',id:'lanternas',t:'Luzes que enganam',map:'encosta4',mat:'lanterna',n:6,lv:14,txt:'Lanternas Errantes atraem viajantes para fora da trilha na Encosta 04. Dois lenhadores ainda não voltaram. Traga 6 Brasas Errantes.'},
 {city:'pinheiral',id:'duendes',t:'Duendes ladrões',map:'encosta5',mat:'duende',n:6,lv:17,txt:'Os Duendes do Porrete da Encosta 05 roubaram a bolsa do coletor de impostos. Traga 6 Lascas de Porrete e, se achar, o ouro de volta.'},
 {city:'pinheiral',id:'morcegos',t:'Asas no escuro',map:'caverna1',mat:'morcego',n:12,lv:21,txt:'Bandos de morcegos saem da Caverna de Pinheiral ao anoitecer e assustam o gado. Traga 12 Asas de Morcego.'},
 {city:'pinheiral',id:'raposas',t:'O chamado da raposa',map:'encosta7',mat:'raposa',n:6,lv:23,txt:'As Raposas Espirituais da Encosta 07 estão cada vez mais perto da aldeia, e os anciãos temem o despertar da Anciã. Traga 6 Caudas de Raposa.'},
 {city:'pinheiral',id:'zumbis',t:'Mineiros perdidos',map:'caverna2',mat:'zumbi',n:6,lv:25,txt:'Os mineiros que sumiram na Caverna voltaram... mas não estão vivos. Dê descanso a eles e traga 6 Minérios Brutos como prova.'}];
const MISS_CD=10*60*1000,MISS_MAX=3,BOARD={x:-9999,y:-9999};
// ouro ≈ 2,5× o valor dos materiais + 10 por nível sugerido; XP de um nível inteiro no nível sugerido
const missRew=q=>({g:Math.round(LOOTM[q.mat].v*q.n*2.5+10*q.lv),xp:xpNeed(q.lv)});
function missState(q){const M=P.miss;if(M.on.includes(q.id))return(P.mats[q.mat]||0)>=q.n?'pronta':'aceita';return(M.cd[q.id]||0)>Date.now()?'espera':'livre';}
function openBoard(){closeAll();renderBoard();$('board').classList.remove('hidden');}
function renderBoard(){const B=$('boardBody');
 const city=MAPS[CUR].city||'valdor',nome=MAPS[city].n.replace(/^(Vila|Aldeia) de /,'');
 let h=`<p class="flav">"Aventureiros, ${nome} precisa de vocês! Aceitem até ${MISS_MAX} tarefas por vez (somando todas as Guildas) e tragam as provas."</p>`;
 for(const q of MISS.filter(q=>q.city===city)){const st=missState(q),r=missRew(q),have=P.mats[q.mat]||0,on=st==='aceita'||st==='pronta';
  h+=`<div class="mcard ${st}"><div class="mt"><b>${q.t}</b><small>${MAPS[q.map].n} • nível sugerido ${q.lv}+</small></div><p>${q.txt}</p>`+
   `<div class="mr"><span>Traga <b>${q.n}× ${LOOTM[q.mat].n}</b>${on?` (${Math.min(have,q.n)}/${q.n})`:''}</span><span>💰 ${r.g}g • ✨ ${r.xp} XP</span></div><div class="acts">`+
   (st==='livre'?`<button class="btn sm gold" data-m="aceitar" data-q="${q.id}">Aceitar</button>`
   :st==='espera'?`<span class="muted">Volta ao mural em ${Math.ceil((P.miss.cd[q.id]-Date.now())/60000)} min</span>`
   :(st==='pronta'?`<button class="btn sm gold" data-m="entregar" data-q="${q.id}">Entregar</button>`:'')+`<button class="btn sm" data-m="desistir" data-q="${q.id}">Desistir</button>`)+`</div></div>`;}
 B.innerHTML=h;B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>missAction(b.dataset.m,b.dataset.q));}
function missAction(a,id){const q=MISS.find(x=>x.id===id),M=P.miss;
 if(a==='aceitar'){if(missState(q)!=='livre')return;if(M.on.length>=MISS_MAX){log(`Você já tem ${MISS_MAX} missões aceitas. Entregue ou desista de uma.`,'#ff9a7a');return;}M.on.push(id);log(`Missão aceita: ${q.t}.`,'#ffe3a0');}
 else if(a==='desistir'){M.on=M.on.filter(x=>x!==id);log(`Você desistiu de: ${q.t}.`,'#cccccc');}
 else if(a==='entregar'){if((P.mats[q.mat]||0)<q.n)return;P.mats[q.mat]-=q.n;if(!P.mats[q.mat])delete P.mats[q.mat];
  const r=missRew(q);P.gold+=r.g;M.on=M.on.filter(x=>x!==id);M.cd[id]=Date.now()+MISS_CD;
  banner('Missão cumprida!',q.t);log(`Missão cumprida: ${q.t}! +${r.g}g`,'#ffd24a');addText(P.x,P.y-30,'+'+r.xp+' XP','#d6a8ff');gainXp(r.xp);}
 renderBoard();save();}
// ao pegar um material de uma missão aceita, mostra o progresso
function missNote(mat){for(const id of P.miss.on){const q=MISS.find(x=>x.id===id);if(!q||q.mat!==mat)continue;const n=P.mats[mat]||0;
 if(n<=q.n)log(`${q.t}: ${n}/${q.n}${n>=q.n?' • volte ao mural da Guilda!':''}`,'#ffe3a0');}}

// ================== NOME DA CASA AO PASSAR O MOUSE ==================
// Só com mouse (no toque não existe "passar por cima"). Casas com função têm label; as comuns não mostram nada.
function houseAt(x,y){const r0=Math.floor(y/TILE);for(let r=Math.min(H-1,r0+7);r>=Math.max(0,r0-1);r--)for(const o of objRows[r])
 if(o.label){const s=SPR[o.spr],hw=s?s.n.width/2:16,hh=s?s.n.height:32;if(x>o.px-hw&&x<o.px+hw&&y>o.py-hh&&y<o.py)return o;}return null;}
$('cv').addEventListener('pointermove',e=>{const t=$('tip'),o=e.pointerType==='mouse'&&P?houseAt(worldAt(e).x,worldAt(e).y):null;
 if(!o){t.classList.add('hidden');return;}t.textContent=o.label;t.style.left=(e.clientX+14)+'px';t.style.top=(e.clientY+12)+'px';t.classList.remove('hidden');});
$('cv').addEventListener('pointerleave',()=>$('tip').classList.add('hidden'));
