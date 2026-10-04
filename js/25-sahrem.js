// Ecos de Valdoria — Sahrem, a cidade do deserto (etapa 1): a Orla do Deserto (grama virando areia) e a cidade das caravanas,
// com a grande pirâmide no meio. Ideias e decisões do dono em 03/10/2026 (CLAUDE.md, item 17 do roteiro).
'use strict';
// Sahrem é a cidade das caravanas e mercadores (padroeira: Fenna), com muralha quadrada de arenito: chão de arenito, casas de barro de teto reto, tendas de
// feira, um oásis com palmeiras no lugar da fonte e, no centro do mapa (cercada por um lago), a pirâmide do Rei Sethkar, com a porta aberta para a tumba (a masmorra
// embaixo dela é a etapa 3). Etapa 2 (04/10/2026): a Guilda com cara de deserto, os monstros do deserto e as dunas a oeste, leste e sul.

// ================== TEMA 11: DESERTO ==================
GP[11]=['#d8b878','#d2b070','#b89458','#e6cc90'];PC[11]=['#b8925a','#a07e4a','#cca46a'];WC[11]=['#2f9ab8','#4ab0c8','#bff0f4'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[11]=o[11].map(hexRGB);
PLZT[11]=['#d4b67c','#b0905c','#e4caa0'].map(hexRGB);MINIC.obj[11]='#6a8a3a';
EARTHT[11]=['#c89a5a','#ad8044','#8a6232','#5a3e20','#e4c48a'].map(hexRGB); // barranco das dunas: areia, não terra (01)
RPAL[11]={l:'#f0dcae',m:'#cfb07a',d:'#9a7a4e'};{const rng=mulberry32(1111);for(let v=0;v<4;v++)reg(`rock11_${v}`,genRock(RPAL[11],rng,v));}

// ================== PLANTAS DO DESERTO (tree11_0 a 3, 24×30 como as árvores) ==================
// 0: palmeira; 1: cacto alto com braços; 2: arbusto seco; 3: cacto redondo com flor. O 25 também usa a palmeira virada (palma2) no oásis
{const pl=(fn)=>{const c=cnv(24,30),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  x.fillStyle='rgba(0,0,0,.22)';x.fillRect(7,27,10,1);x.fillRect(5,28,14,1);fn(f,x);return outlineK(c);};
 reg('tree11_0',pl((f,x)=>{for(let y=27;y>=9;y--){const t=(27-y)/18,cx=Math.round(10+t*t*5);f('#b08850',cx-1,y,1,1);f('#8a6a3a',cx,y,1,1);f('#6a4a2a',cx+1,y,1,1);if(y%3===0)f('#5a3e22',cx-1,y,3,1);}
  const ox=15,oy=8;for(const a of[-2.9,-2.3,-1.6,-.9,-.3,.35]){for(let k=1;k<=9;k++){const X=Math.round(ox+Math.cos(a)*k),Y=Math.round(oy+Math.sin(a)*k*.75+k*k*.07);
   f(k>7?'#7ac04a':'#4a9a3a',X,Y,1,1);f('#2f7a2a',X,Y+1,1,1);if(k%2===0)f('#5aaa42',X+(Math.cos(a)>0?0:0),Y-1,1,1);}}
  f('#6a4a22',14,9,2,2);f('#8a6a32',16,10,1,1);}));
 reg('tree11_1',pl(f=>{f('#4a8a3a',10,8,4,20);f('#6aaa4a',10,8,1,20);f('#2f6a2a',13,8,1,20);f('#4a8a3a',11,7,2,1);
  f('#4a8a3a',6,17,4,2);f('#4a8a3a',6,11,2,7);f('#6aaa4a',6,11,1,7);f('#4a8a3a',14,14,4,2);f('#4a8a3a',16,9,2,6);f('#2f6a2a',17,9,1,6);
  for(const[a,b]of[[11,10],[12,14],[11,19],[12,23],[7,13],[16,11],[11,26]])f('#f0e8c0',a,b,1,1);f('#e86a8a',11,6,2,1);}));
 reg('tree11_2',pl(f=>{for(const[a,b,w]of[[7,20,10],[5,22,14],[6,24,12],[8,26,8],[9,18,6]])f('#8a6a3a',a,b,w,1);
  for(const[a,b]of[[6,19],[8,17],[11,16],[14,17],[17,19],[18,21],[4,21],[16,23],[10,19],[13,21],[7,23],[15,25]])f('#a8844a',a,b,1,1);
  for(const[a,b]of[[9,21],[12,23],[14,20],[8,25]])f('#6a5030',a,b,2,1);}));
 reg('tree11_3',pl(f=>{for(let y=18;y<28;y++){const hw=Math.round(Math.sqrt(Math.max(0,25-(y-23)*(y-23)))*1.1);f('#4a8a3a',12-hw,y,hw*2,1);f('#6aaa4a',12-hw,y,2,1);f('#2f6a2a',12+hw-2,y,2,1);}
  for(let y=19;y<28;y+=2)for(const dx of[-3,0,3])f('#3a7a32',12+dx,y,1,1);for(const[a,b]of[[8,20],[15,21],[12,24],[9,25],[16,25]])f('#f0e8c0',a,b,1,1);
  f('#e86a8a',11,16,3,2);f('#ffb0c8',12,16,1,1);f('#e8c048',12,17,1,1);}));
 reg('palma2',flipC(SPR.tree11_0.n));}

// ================== CASAS, TENDAS E OBELISCOS ==================
// casa de barro (32×32): teto reto com parapeito, vigas de madeira saindo da parede, porta em arco e janelinhas
function genDesertHouse(wall,wallD,dome){const c=cnv(32,32),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 for(let y=8;y<31;y++)for(let i=3;i<29;i++)f((i*7+y*11)%17===0?wallD:wall,i,y,1,1);f('#f6e8c8',3,8,1,23);f(wallD,28,8,1,23);f(wallD,3,30,26,1);
 f('#f0dcb0',3,4,26,4);f(wallD,3,7,26,1);for(const px of[3,27])f('#f0dcb0',px,2,2,2);f('#e4cc9c',6,5,20,1);
 if(dome){for(let y=0;y<7;y++){const hw=Math.round(Math.sqrt(Math.max(0,36-(6-y)*(6-y))));f('#f4ecdc',16-hw,y-2+2,hw*2,1);f('#d8c8a8',16+hw-2,y,2,1);}f('#e8c048',15,-1+1,2,1);}
 for(let i=5;i<28;i+=6)f('#6a4a2a',i,11,2,1);
 f('#3a2414',12,23,8,8);f('#3a2414',13,22,6,1);f('#3a2414',14,21,4,1);f('#7a4e2c',13,24,6,7);f('#8a5a32',13,23,6,1);f('#e8c048',17,27,1,1);
 for(const wx of[6,23]){f('#3a2a1a',wx,15,3,3);f(wallD,wx-1,18,5,1);}
 return outlineK(c);}
reg('deserto1',genDesertHouse('#d8b480','#b8945e'));reg('deserto2',genDesertHouse('#e8dcc4','#c8b89c'));reg('deserto3',genDesertHouse('#dcc090','#bca070',true));
reg('ferrariaD',signHouse('#d0a870','#a8844e','#8a5a30',SYM_BIGORNA,genDesertHouse));
// Guilda de Sahrem (64×98, o mesmo chão da guildaGrande, 13): dois andares de arenito com teto reto e parapeito, vigas saindo da parede,
// cúpula branca no meio e um minarete com a bandeira roxa; portão em arco, placa das espadas e estandartes roxos, como em toda Guilda
function guildaDeserto(){const c=cnv(64,98),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);},G0=66,G1=94,T='#6a4a2a',L='#e0c890';
 const wall=(x0,y0,w,h,A,B,C)=>{for(let yy=y0;yy<y0+h;yy++)for(let xx=x0;xx<x0+w;xx++)f((xx*7+yy*11)%17===0?C:(xx*5+yy*3)%23===0?B:A,xx,yy,1,1);f('#f6e8c8',x0,y0,1,h);f(C,x0+w-1,y0,1,h);};
 // minarete à direita, com a cúpula pequena e a bandeira roxa da Guilda
 f('#2a1c16',52,0,1,9);f('#7a3a9a',53,0,6,4);f('#9a5aba',53,0,6,1);f('#e8b43c',55,1,2,2);
 for(let yy=0;yy<6;yy++){const hw=Math.round(Math.sqrt(36-(6-yy)*(6-yy))*.9);f('#3a9aa8',52-hw,8+yy,hw*2,1);f('#7acad4',52-hw,8+yy,1,1);}
 wall(47,14,10,30,'#e4d0a4','#f0e0b8','#b8985e');f('#b89a64',45,24,14,2);f('#e8d4a8',45,23,14,1);
 f(K,50,16,4,6);f(K,51,15,2,1);f('#ffd06a',51,17,2,5);f(K,50,29,4,6);f(K,51,28,2,1);f('#2a1c16',51,30,2,5);
 // a cúpula branca no meio, com a faixa de azulejos turquesa e a ponta dourada
 for(let yy=0;yy<24;yy++){const dy=24-yy,hw=Math.round(18*Math.sqrt(Math.max(0,1-(dy/25)*(dy/25))));
  for(let xx=32-hw;xx<32+hw;xx++){const u=(xx-32+hw)/(2*hw||1);f(u<.28?'#fbf6ea':u>.74?'#c8bca4':'#ece4d2',xx,16+yy,1,1);}}
 for(let xx=15;xx<49;xx++)f((xx>>1)%2?'#3a9aa8':'#e8c048',xx,37,1,2);f('#e8c048',31,9,2,7);f('#e8c048',30,12,4,2);f('#fff0a0',31,9,1,3);f('#b8902a',32,12,2,2);
 // teto reto: parapeito com ameias e azulejos
 for(let xx=3;xx<61;xx+=5)f('#e8d4a8',xx,37,3,3);f('#e8d4a8',3,40,58,6);f('#f6e8c8',3,40,58,1);f('#b89a64',3,45,58,1);for(let xx=6;xx<58;xx+=4)f('#3a9aa8',xx,42,2,2);
 // andar de cima: reboco claro, vigas de madeira e janelas de treliça acesas
 wall(6,46,52,20,'#ecdcb8','#f6e8c8','#c8b088');for(const bx of[8,17,26,36,45,54])f(T,bx,47,2,2);
 for(const wx of[10,20,38,48]){f(K,wx,51,6,10);f(K,wx+1,50,4,1);f('#ffd06a',wx+1,51,4,9);for(let i=0;i<4;i++)for(let j=0;j<9;j++)if((i+j)%2)f('#8a5a2a',wx+1+i,51+j,1,1);f('#b89a64',wx-1,61,8,1);}
 f(K,29,51,6,7);f(K,30,50,4,1);f('#ffd06a',30,51,4,6);f(T,31,51,2,6);
 // térreo de arenito
 wall(4,G0,56,G1-G0,'#d8b480','#e4c494','#b8945e');f('#9a7a50',4,G1-2,56,2);
 // portão em arco, degraus, placa das espadas, estandartes, janelas e lampiões (os mesmos lugares da guildaGrande)
 f(L,25,G0+7,14,G1-G0-7);f(K,26,G0+9,12,G1-G0-9);f('#7a4e2c',27,G0+10,10,G1-G0-10);
 for(let xx=27;xx<37;xx+=3)f('#5a3820',xx,G0+10,1,G1-G0-10);f('#5a3820',31,G0+10,2,G1-G0-10);f('#e8b43c',30,G0+19,1,2);f('#e8b43c',33,G0+19,1,2);
 f(K,27,G0+8,10,1);f(K,28,G0+7,8,1);f('#b89a64',26,G0+8,1,1);f('#b89a64',37,G0+8,1,1);
 f('#e4cc9c',23,G1,18,2);f('#cdb07a',21,G1+2,22,2);f('#9a7a50',21,G1+3,22,1);
 f(K,24,G0+1,16,7);f('#c8a060',25,G0+2,14,5);f('#8a6a3a',25,G0+6,14,1);
 for(let i=0;i<5;i++){f('#dfe6ef',28+i*1.6|0,G0+2+i,1,1);f('#dfe6ef',35-(i*1.6|0),G0+2+i,1,1);}f('#e8b43c',31,G0+6,2,1);
 for(const bx of[18,42]){f('#7a3a9a',bx,G0+3,4,12);f('#9a5aba',bx,G0+3,1,12);f('#5a2478',bx+3,G0+3,1,12);f('#e8b43c',bx+1,G0+7,2,2);f(T,bx-1,G0+2,6,1);f('#7a3a9a',bx+1,G0+15,2,1);}
 for(const wx of[8,49]){f(K,wx,G0+9,8,11);f(K,wx+1,G0+8,6,1);f('#ffd06a',wx+1,G0+9,6,10);for(let i=0;i<6;i++)for(let j=0;j<10;j++)if((i+j)%2)f('#8a5a2a',wx+1+i,G0+9+j,1,1);f(L,wx,G0+20,8,1);}
 for(const lx of[23,40]){f(K,lx,G0+10,2,1);f('#ffcf5a',lx,G0+11,2,3);f('#fff0b0',lx,G0+11,1,1);}
 return outlineK(c);}
reg('guilda4',guildaDeserto());
// tenda de feira (32×26): toldo listrado, tapetes, potes e montes de temperos
for(const[nm,cor]of[['tenda1','#d8783a'],['tenda2','#3a8a9a']])reg(nm,(()=>{const c=cnv(32,26),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f(K,1,3,30,6);for(let i=0;i<7;i++)f(i%2?'#f0e4c8':cor,2+i*4,4,4,4);for(let i=0;i<8;i++)f(K,1+i*4,8,2,1);
 f(K,3,9,2,10);f('#6a4222',3,9,1,10);f(K,27,9,2,10);f('#6a4222',27,9,1,10);
 f(K,1,17,30,9);f('#9a6a3a',2,18,28,7);f('#b8844c',2,18,28,1);
 f('#c8323a',4,13,6,5);f('#e8c048',4,15,6,1);f('#2a5a8a',5,14,1,3);f('#b0603a',12,14,3,4);f('#8a4a2a',12,13,3,1);f('#e8a030',17,15,4,3);f('#c84a2a',22,15,4,3);f('#7aa03a',22,14,4,1);
 return c;})());
// obelisco de arenito com marcas antigas e a ponta dourada (12×36)
reg('obelisco',(()=>{const c=cnv(12,36),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f('#d8bc84',3,4,6,28);f('#ecd4a0',3,4,2,28);f('#b89a64',8,4,1,28);f('#e8c048',4,1,4,3);f('#e8c048',5,0,2,1);f('#fff0a0',4,1,1,2);
 for(let y=7;y<29;y+=4){f('#9a7a4e',5,y,2,1);f('#9a7a4e',5+(y%8?0:1),y+2,1,1);}f('#c8a870',1,32,10,3);f('#e4cc9c',1,32,10,1);return outlineK(c);})());
// muralha de arenito (estilo 'arenito' do buildWalls, 14): o mesmo formato da de Valdor, em arenito, com ameias quadradas e o estandarte
// laranja de Sahrem com a moeda dourada de Fenna nas torres
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 const PED='#c8a870',PEDC='#ecd4a0',PEDT='#d8bc84',REJ='#9a7a4e',PEDE='#7a5e3a';
 reg('muroHD',box(16,22,f=>{f(K,0,4,16,18);f(PEDT,1,5,14,4);f(PED,1,9,14,12);f(REJ,1,12,14,1);f(REJ,1,16,14,1);f(REJ,5,9,1,3);f(REJ,11,12,1,4);f(REJ,4,16,1,5);f(REJ,12,16,1,5);f(PEDE,1,20,14,1);
  f(K,0,0,6,5);f(PEDC,1,1,4,4);f(K,9,0,6,5);f(PEDC,10,1,4,4);}));
 reg('muroVD',box(16,22,f=>{f(K,3,0,10,22);f(PEDC,4,1,8,15);f(PEDT,4,1,2,15);f(REJ,4,6,8,1);f(REJ,4,11,8,1);f(PED,4,16,8,5);f(PEDE,4,20,8,1);}));
 reg('torreD',box(24,48,f=>{f('#4a3222',11,0,2,12);f(K,13,1,8,6);f('#d8783a',13,2,7,4);f('#e8c048',15,3,2,2);
  f(K,0,10,24,9);f(PEDC,1,11,22,7);f(K,0,6,6,5);f(PEDC,1,7,4,4);f(K,9,6,6,5);f(PEDC,10,7,4,4);f(K,18,6,6,5);f(PEDC,19,7,4,4);
  f(K,2,19,20,29);f(PED,3,19,18,28);f('#b0905e',16,19,5,28);for(const y of[24,30,36,42])f(REJ,3,y,18,1);
  f(K,9,25,6,9);f(K,10,24,4,1);f('#2a2016',10,26,4,7);f(PEDE,3,46,18,1);}));}
WALLSTY.arenito={h:'muroHD',v:'muroVD',t:'torreD'};
// A grande pirâmide (176×124): dez degraus de arenito, luz da esquerda, ponta de ouro e a porta virada para o sul; desde a etapa 3 ela
// está aberta (escuridão lá dentro, a laje de pedra caída de lado e o selo do Rei Sethkar partido no chão)
// do Rei Sethkar. Ocupa 9×4 tiles no centro do mapa
function genPiramide(){const W_=176,H_=124,c=cnv(W_,H_),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);},cx=88;
 for(let k=0;k<10;k++){const w=14+k*18,y0=13+k*11,xl=cx-w/2;
  for(let y=y0;y<y0+11;y++)for(let i=0;i<w;i++){const X=xl+i,u=i/w,top=y-y0<2,joint=(y-y0)===6||((X+(k%2)*4)%8===0&&y-y0>2);
   f(top?(u<.6?'#f4e2b0':'#dcc48c'):joint?'#b8985e':u<.25?'#ecd49c':u>.72?'#bc9c66':'#d8bc84',X,y,1,1);}}
 for(let y=0;y<14;y++){const hw=Math.round(y*.55)+1;f('#e8c048',cx-hw,y,hw*2,1);f('#fff0a0',cx-hw,y,1,1);f('#b8902a',cx+hw-1,y,1,1);}
 f('#9a7a4e',68,82,40,7);f('#c8a870',68,82,40,1);f(K,70,89,36,35);f('#2a1c12',71,90,34,34);
 f('#1a100a',73,93,30,31);f('#120a06',76,100,24,24);for(let y=96;y<124;y+=7)f('#2a1c12',73,y,30,1); // a passagem aberta, escura
 f('#b09060',104,113,16,10);f('#c8a874',104,113,16,1);f('#9a7a50',104,118,16,1); // a laje caída
 f('#c8902a',58,116,6,6);f('#e8c048',59,117,4,4);f('#c8902a',111,107,6,5);f('#e8c048',112,108,4,3); // o selo partido
 f('#e4cc9c',50,120,24,4);f('#e4cc9c',104,119,26,5);f('#f0dcb0',54,120,6,1);f('#f0dcb0',110,119,6,1);
 return outlineK(c);}
reg('piramide',genPiramide());

// ================== A GENTE DE SAHREM (24) ==================
def('kassim',["......kkkk......",".....kTTTTk.....","....kTTtTTTk....","....kTTTTTTk....","....kTseesTk....",".....kBBBBk.....","...kkVwwwwVkk...","..ksVVwwwwVVsk..","..ksVggwwggVsk..","...kVVwwwwVVk...","....kRRRRRRk....","....kPPPPPPk....","...kPPPPPPPPk...","...kPPPkkPPPk...","....kbbk.kbbk...","....kkk...kkk..."],{T:'#c8323a',t:'#e8c048',s:'#c88a5a',e:K,B:'#2a1c12',V:'#2a5a8a',w:'#f0e8d8',g:'#e8c048',R:'#c8323a',P:'#e8dcc0',b:'#6a4a2a'});
def('nadira',["......kkkk......",".....kVVVVk.....","....kVVVVVVk....","....kVseesVk....","....kVssssVk....",".....kssssk.....","..kkssAAAAsskk..",".ksskAAAAAAkssk.",".kOOkAAOOAAkOOww","..kkkAAAAAAkkww.","....kAAAAAAk.y..","....kSSSSSSk.y..","....kSSkkSSk....","....kSSk.kSSk...","....kbbk.kbbk...","....kkk...kkk..."],{V:'#d8c090',s:'#b87a4a',e:K,A:'#6a4a2a',O:'#c8862a',w:'#c8c8d0',y:'#5a4030',S:'#a87a4a',b:'#4a3020'});
def('samira',["......kkkk......",".....kCCCCk.....","....kCCcCCCk....","....kCseesCk....","....kCssssCk....",".....kssssk.....","...kkDDDDDDkk...","..ksDDDDDDDDsk..","..kOgOgODDDDsk..","...kkkkkDDDDk...","....kDDDDDDk....","....kDDDDDDk....","...kDDDDDDDDk...","...kDDDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],{C:'#c83a7a',c:'#e8c048',s:'#c88a5a',e:K,D:'#e07a2a',O:'#c8862a',g:'#a8e0e8',b:'#6a3a1a'});
def('farid',["......kkkk......",".....kTTTTk.....","....kTTTTTTk....","....kTseesTk....","....kTssssTk....",".....kssssk.....","...kkRRRRRRkk...","..ksRRRRRRRRsk..","..ksLlLLRRRRsk..","...kLLLLRRRRk...","....kRRRRRRk....","....kRRRRRRk....","...kRRRRRRRRk...","...kRRRRRRRRk...","....kbbk.kbbk...","....kkk...kkk..."],{T:'#f0ece0',s:'#b87a4a',e:K,R:'#c8b088',L:'#7a4a2a',l:'#f0e8d0',b:'#5a3a20'});
def('tarek',["......kkkk......",".....kCCCCk.....","....kCCCCCCk....","....kCseesCk....","....kCccccCk....",".....kcccck.....","..kkCCCCCCCCkk..",".kCCCCMMMMCCCCk.",".kCCsMMMMMMsCCk.",".kCCCMMMMMMCCCk.","..kCCMMMMMMCCk..","...kCPPPPPPCk...","...kCPPkkPPCk...","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{C:'#c8a46a',s:'#a8703a',e:K,c:'#e8dcc0',M:'#6a5a4a',P:'#8a7a5a',b:'#4a3020'});
def('zuri',["......kkkk......",".....kHHHHk.....","....kHHhHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkDDDDDDkk...","..ksDDdDDdDDsOOk","..ksDDDDDDDDkOyO","...kDdDDdDDDkOOk","....kDDDDDDk....","....kDDdDDDk....","...kDDDDDDdDk...","...kDdDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#2a8a7a',h:'#e8c048',s:'#8a5a3a',e:K,D:'#d8a030',d:'#c8323a',O:'#c8862a',y:'#f0e0c0',b:'#5a3a20'});
CIDP.sahrem={merc:['Mercador Kassim','kassim','Tapetes, temperos e poções frescas! Em Sahrem, até a areia tem preço justo.'],
 smith:['Ferreira Nadira','nadira','Bronze e aço, temperados no calor do deserto. Até o +5, nada racha. Depois disso... às vezes o calor vence o metal.'],
 bar:['Samira','samira','Chá de hortelã ou um tônico das caravanas? Os dois refrescam no calor.'],salao:['farid','tarek','zuri']};
GENTE.push(
 {id:'farid',n:'Farid',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda de Sahrem! O mural fala dos problemas da Orla e das dunas.','Até 3 missões por vez, somando todas as Guildas. Está tudo no meu livro-razão.',
  'Cada missão volta ao mural um tempo depois de entregue. As caravanas nunca param.','A Samira, no balcão, serve chá de hortelã e tônicos. Beba antes de sair no sol.','A Mestra Elara mora em Valdor. Para mudar seus atributos, a viagem é longa.']},
 {id:'tarek',n:'Tarek',c:'#e8c080',at:[-5,-2],f:['Já guiei caravanas por todas as dunas. A areia muda de lugar; as estrelas, não.','Dizem que o Rei Sethkar ainda manda dentro da pirâmide. Eu não entro lá nem pago.',
  'A porta da pirâmide se abriu na última tempestade de areia. Quem desce volta calado... quando volta.','No deserto, a água é ouro. Leve poções de vida, aventureiro.','Esta cicatriz? Um escorpião do tamanho de uma carroça. Ele saiu pior.']},
 {id:'zuri',n:'Zuri',c:'#d9a0ff',at:[-7,3],f:['Quer uma história? A do rei que quis viver para sempre é a minha preferida... e a mais triste.','Fenna sorri para as caravanas. Por isso Sahrem nunca passou fome.',
  'Meu pandeiro já tocou em todas as cidades. A de Valdor tem o melhor público.','A Samira paga as histórias com chá. Eu conto devagar para ganhar mais um copo.','Contam que Kharzen prometeu ao Rei Sethkar um reino eterno. Prometeu e cumpriu, do pior jeito.']});

// ================== MONSTROS DO DESERTO (etapa 2) ==================
// Orla (19 a 23): lagarto, abutre (bando, voa) e cacto andante (chuva de espinhos). Dunas (23 a 30): chacal (bando), escorpião (veneno),
// serpente (cospe de longe), escaravelho (casco duro, pisão) e saqueador (rouba ouro, como o duende)
def('lagarto',["","","","","","..........kkkk..","...k.k.k.kLLLLk.","..kCkCkCkLLLeLLk",".kLLLLLLLLLLLLmk","kLLlLLlLLLLLLkk.","kLkkLLLLlLLLk...","kk.kLLkkkkLLk...","...kdk...kdk....","...kk....kk....."],{L:'#c8a050',l:'#9a7432',C:'#e0602a',e:'#ffe040',m:'#e8c890',d:'#8a6a3a'});
def('abutre',["","","","......kkkk......",".....kHHHHk.....",".....kHeeHk.....","......kOOk......","..kkk.kWWk.kkk..",".kBBBkWWWWkBBBk.","kBBbBBBBBBBBbBBk","kBbkBBBBBBBBkbBk","kbk.kBBBBBBk.kbk","kk...kBBBBk...kk",".....kOkkOk.....",".....kk..kk....."],{H:'#d88a7a',e:'#ffe040',O:'#e8c048',W:'#f0ece0',B:'#4a3a32',b:'#2e2420'});
def('cacto',["......kkkk......",".....kFffFk.....","......kkkk......",".....kGGgGk.....","..kk.kGwgGk.kk..",".kGgkkGeGekkgGk.",".kGgkGGGgGGkgGk.",".kGGGGGmmGGGGGk.","..kkkGwGgGGkkk..",".....kGGgwk.....",".....kGGgGk.....","....kGGGgGGk....","....kGGkkGGk....","...kGGk..kGGk...","...kkk....kkk..."],{F:'#e86a8a',f:'#ffd0a0',G:'#4a8a3a',g:'#6aaa4a',w:'#f0e8c0',e:'#ffe040',m:'#2a1a1a'});
def('chacal',["","","..........k..k..",".........kdkkdk.",".........kdggdk.","........kggggggk","k.......kggegggk","kdk.kkkkggggggWk",".kdkSSSSSSgggWk.","..kgSSSSSSggkk..","..kggggggggk....","..kgWWWWWWgk....","..kgk.kgk.kgk...","..kgk.kgk.kgk...","..kdk.kdk.kdk...","..kkk.kkk.kkk..."],{g:'#c8904a',d:'#7a4a2a',S:'#3a2a22',W:'#f0dcb0',e:'#ffe040'});
def('escorpiao',["...kkkk.........","..kTTTTk........",".kTk..kTk.......",".kTk...kSk......",".kTk....k.......",".kTk............",".kTTk......kk.kk","..kTTk....kCCkCk","...kBBBBBkkCCCCk","..kBBbBBbBBkkkk.",".kBbBBbBBbBBBek.",".kBBBBBBBBBBBBk.","..kkBBBBBBBBkk..","..kLk.kLk.kLk...","..kk..kk..kk...."],{T:'#a83a2a',S:'#e8c048',B:'#c8402a',b:'#e8704a',C:'#d85a3a',e:'#ffe040',L:'#7a2a1a'});
def('serpente',["","","","..........kkkk..",".........kSSSSk.",".........kSeSSk.","..........kSSkr.","..........kSSk.r","...........kSk..","....kkkkk..kSk..","...kSsSsSkkSSk..","..kSsSsSsSSSk...",".kSSkkkkkSsSSk..",".kSsSsSsSsSsSk..","..kkkkkkkkkkk..."],{S:'#d8b060',s:'#8a5a2a',e:'#e83a2a',r:'#e83a5a'});
def('escaravelho',["","","","",".....kkkkk......","...kkCCcCCkk....","..kCCcCCCCCCk.kk",".kCcCCCCCCCCCkHk",".kCCCCCCCCCCkHHk",".kCCCCCCCCCCkHek","..kddddddddkHHk.","...kLkkLkkLkkk..","..kL.kL..kL.....","..kk.kk..kk....."],{C:'#2f8a72',c:'#8ae0c8',d:'#1e4a42',H:'#24584c',e:'#ffe040',L:'#1e2a28'});
def('saqueador',["......kkkk......",".....kTTTTk.....","....kTTTTTTk....","....kVeVVeVk....","....kVVVVVVk....",".....kVVVVk.....","...kkRRRRRRkk.k.","..ksRRRRRRRRskSk","..ksRggggggRskSk","...kRRRRRRRRkSk.","....kRRRRRRk.k..","....kPPPPPPk....","...kPPPkkPPPk...","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{T:'#2a2a3a',V:'#3a3a4a',e:'#ffe040',R:'#a83a3a',s:'#b87a4a',g:'#e8c048',S:'#d8d8e8',P:'#6a5a4a',b:'#3a2a1a'});
Object.assign(MDEF,{
 lagarto:{n:'Lagarto da Orla',hp:80,atk:15,def:4,spd:66,xp:30,r:7,aggro:85,cd:1},
 abutre:{n:'Abutre Carniceiro',hp:55,atk:13,def:3,spd:70,xp:24,r:6,aggro:120,cd:1.1,fly:1,pack:[2,3]},
 cacto:{n:'Cacto Andante',hp:150,atk:19,def:8,spd:24,xp:38,r:8,aggro:60,cd:1.6,slam:{every:5,r:30,mult:1.5,delay:.9}},
 chacal:{n:'Chacal das Dunas',hp:70,atk:15,def:4,spd:74,xp:26,r:7,aggro:110,cd:.9,pack:[3,4]},
 escorpiao:{n:'Escorpião Rubro',hp:140,atk:21,def:9,spd:44,xp:40,r:8,aggro:80,cd:1.3,poison:1},
 serpente:{n:'Serpente das Dunas',hp:90,atk:18,def:5,spd:50,xp:36,r:7,aggro:120,cd:1.7,ranged:100,projC:'#9ae04a'},
 escaravelho:{n:'Escaravelho Esmeralda',hp:200,atk:22,def:14,spd:30,xp:46,r:9,aggro:70,cd:1.8,slam:{every:5,r:34,mult:1.6,delay:1}},
 saqueador:{n:'Saqueador das Dunas',hp:100,atk:19,def:6,spd:64,xp:38,r:7,aggro:90,cd:1,steal:1}});
// os materiais deles (tabela e desenhos no 12)
for(const[k,n,c]of[['lagarto','Crista de Lagarto','#e0602a'],['abutre','Pena de Abutre','#5a4a3a'],['cacto','Espinho de Cacto','#6aaa4a'],['chacal','Orelha de Chacal','#c8904a'],
 ['escorpiao','Ferrão de Escorpião','#c8402a'],['serpente','Pele de Serpente','#d8b060'],['escaravelho','Élitro Esmeralda','#3a9a7a'],['saqueador','Lenço de Saqueador','#a83a3a']])
 LOOTM[k]={n,c,w:1,v:clamp(Math.round(MDEF[k].xp/3),2,15)};
Object.assign(MATSHP,{
 lagarto:[["k.k.k.k...","kCkCkCk...","kCcCcCCk..",".kCCCCCdk.","..kdddddk.","...kkkkk.."]],
 abutre:[["....k....","...kCk...","..kcCdk..","..kcCdk..",".kcCCCdk.",".kcCeCdk.",".kcCeCdk.","..kCedk..","...kek...","...kek...","....k...."],{e:'#e8dcc0'}],
 cacto:[["...e..e...","..kkkkkk..",".kcCCCCdk.","ekCCeCCCke",".kCCCCeCk.","ekCeCCCdke",".kCCCCCdk.","..kddddk..","...kkkk..."],{e:'#f0e8c0'}],
 chacal:[["k.........","kk........","kCk.......","kcCk......","kceCk.....","kceeCk....","kcCeeCk...","kCCCCCdk..","kkkkkkkk.."],{e:'#f0c8a0'}],
 escorpiao:[["...kkk....","..kCCCk...",".kCck.k...",".kCk......",".kCck.....","..kCCk.kk.","...kCCkek.","....kCCek.",".....kkk.."],{e:'#e8c048'}],
 serpente:[["..kkkkkk..",".kCeCCeCk.","kCekkkkeCk","keCk..kCek","kCek..keCk","keCkkkkCek",".kCeCCeCk.","..kkkkkk.."],{e:'#8a5a2a'}],
 escaravelho:[["..kkkkk...",".kcCCCCk..","kcCcCCCdk.","kCcCCCCdk.","kCCCCCddk.","kCCCCCddk.",".kCCCddk..","..kCddk...","...kkk...."]],
 saqueador:[["kkkkkkkkkk","kcCCeCCCdk",".kCeCeCdk.",".kCCeCCdk.","..kCCCdk..","..kCeCdk..","...kCdk...","....kk...."],{e:'#e8c048'}]});
for(const k of['lagarto','abutre','cacto','chacal','escorpiao','serpente','escaravelho','saqueador']){const c=LOOTM[k].c,s=MATSHP[k];def('mat_'+k,s[0],Object.assign({C:c,c:shadeHex(c,.45),d:shadeHex(c,-.35)},s[1]));}

// ================== MAPAS ==================
// Orla do Deserto: logo abaixo da Encosta 05; a grama vai virando areia da metade para baixo (blend, no 01). A estrada é o caminho das caravanas
MAPS.orla={n:'Orla do Deserto',s:'Nível 19 a 23',theme:11,blend:[5,11,16,36],seed:1101,color:'#5a4a2a',road:1,lv:[19,23],home:'encosta5',
 portals:{encosta5:[40,1],sahrem:[24,58]},count:24,chests:6,tier:3,mons:[['lagarto',.4],['abutre',.7],['cacto',1]]};
MAPS.encosta5.portals.orla=[40,58];
// Sahrem: a pirâmide fica no centro do mapa, cercada por um lago sagrado com uma passagem só, na frente (sul), onde fica a porta.
// A praça fica logo abaixo (praca, no 01), e a cidade inteira é cercada por uma muralha quadrada de arenito. A estrada do norte contorna
// o lago pelo oeste (via)
const SAH_P=[TC.x,TC.y+17]; // centro da praça
MAPS.sahrem={n:'Cidade de Sahrem',s:'Zona segura • a cidade das caravanas',town:1,road:1,theme:11,seed:1121,color:'#6a4a22',oasis:1,fountain:[16,28],praca:SAH_P,
 walls:[8,5,72,55],wallStyle:'arenito',
 houses:[[11,9,'deserto2'],[16,12,'deserto3'],[12,17,'deserto1'],[30,10,'deserto1'],[36,8,'deserto2'],[44,8,'deserto3'],[50,10,'deserto2'],[57,8,'deserto1'],[63,11,'deserto3'],
  [69,8,'deserto2'],[58,16,'deserto2'],[66,17,'deserto1'],[55,25,'deserto3'],[62,24,'deserto1'],[68,29,'deserto2'],[56,33,'deserto1'],[64,36,'deserto3'],[69,40,'deserto1'],
  [12,39,'deserto3'],[18,37,'deserto2'],[11,53,'deserto1'],[17,52,'deserto3'],[23,54,'deserto2'],[29,53,'deserto1'],[51,53,'deserto3'],[57,52,'deserto1'],[63,54,'deserto2'],[69,52,'deserto3']],
 deco:[[TC.x-4,TC.y+6,'obelisco'],[TC.x+4,TC.y+6,'obelisco'],[34,52,'tenda1',1],[44,52,'tenda2',1],
  ...[[29,21],[51,21],[29,39],[51,39],[33,25],[47,25]].map(([x,y],k)=>[x,y,k%2?'tree11_0':'palma2'])],
 portals:{orla:[24,1],dunasO:[1,47],dunasL:[78,47],dunasS:[40,58]},via:{orla:[24,47]},
 piramide:[TC.x,TC.y+3],lago:[30,22,50,38],gen:sahremGen};
// as dunas em volta da cidade (etapa 2): morros de areia (plateau) e sem estrada (a das caravanas entra alguns passos e some na areia); quanto mais ao sul, mais perigo
Object.assign(MAPS,{
 dunasO:{n:'Dunas do Oeste',s:'Nível 23 a 26',theme:11,seed:1151,color:'#6a5228',lv:[23,26],plateau:.58,home:'sahrem',portals:{sahrem:[78,47]},count:26,chests:6,tier:3,mons:[['chacal',.4],['serpente',.7],['escaravelho',1]]},
 dunasL:{n:'Dunas do Leste',s:'Nível 25 a 28',theme:11,seed:1161,color:'#6a4a24',lv:[25,28],plateau:.58,home:'sahrem',portals:{sahrem:[1,47]},count:26,chests:6,tier:3,mons:[['escorpiao',.4],['saqueador',.7],['chacal',1]]},
 dunasS:{n:'Dunas do Sul',s:'Nível 27 a 30',theme:11,seed:1171,color:'#5a3e1e',lv:[27,30],plateau:.58,home:'sahrem',portals:{sahrem:[40,1]},count:28,chests:7,tier:3,elite:.1,
  mons:[['escorpiao',.3],['serpente',.55],['escaravelho',.8],['saqueador',1]]}});
// oásis (água redonda com palmeiras em volta) no lugar da fonte; o lago sagrado (lago:[x0,y0,x1,y1], 2 tiles de largura) com o pátio de
// lajes por dentro e a passagem de 3 tiles na frente da porta; e a pirâmide: chão ocupado de 9×4 tiles, com o nome ao passar o mouse
function sahremGen(M){const[ox,oy]=M.fountain,tira=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);};
 for(let y=oy-6;y<=oy+6;y++)for(let x=ox-7;x<=ox+7;x++){const d=hyp(x-ox,(y-oy)*1.25),i=y*W+x;if(d<3.3){tira(x,y);ground[i]=G.WATER;solid[i]=1;}
  else if(d<5.2&&ground[i]===G.GRASS&&!solid[i]&&((x*7+y*13)%5===0)){solid[i]=1;addObj(x,y,(x+y)%2?'tree11_0':'palma2');}}
 const[a0,b0,a1,b1]=M.lago,[px,py]=M.piramide;
 for(let y=b0;y<=b1;y++)for(let x=a0;x<=a1;x++){const i=y*W+x,borda=x<a0+2||x>a1-2||y<b0+2||y>b1-2,passa=Math.abs(x-px)<=1&&y>b1-2;
  const dc=M.deco.find(d=>d[0]===x&&d[1]===y);if(dc){const r=objRows[y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===x&&r[k].spr!==dc[2])r.splice(k,1);continue;}tira(x,y);ground[i]=passa?G.PATH:borda?G.WATER:G.PLAZA;solid[i]=borda&&!passa?1:0;}
 for(let y=b1+1;y<M.praca[1]-3;y++)for(let x=px-1;x<=px+1;x++){tira(x,y);ground[y*W+x]=G.PATH;solid[y*W+x]=0;} // da passagem até a praça
 for(let y=py-3;y<=py;y++)for(let x=px-4;x<=px+4;x++){tira(x,y);solid[y*W+x]=1;}
 objRows[py].push({tx:px-4,ty:py,spr:'piramide',px:(px+.5)*TILE,py:(py+1)*TILE,label:'Grande Pirâmide'});}
// os serviços (sem a casa da Elara, que fica só em Valdor): mercador na praça, Guilda com bar e salão, e a ferraria
{const n0=MAPS.sahrem.houses.length;guildHall('guildaSahrem','sahrem','guilda4',1131);addBar(MAPS.guildaSahrem);addSalao(MAPS.guildaSahrem);
 cityHouses('sahrem','Sahrem',1141,'D');
 // guildHall e cityHouses põem os serviços em volta do centro do mapa; em Sahrem eles descem junto com a praça
 const dy=SAH_P[1]-TC.y;for(const h of MAPS.sahrem.houses.slice(n0))h[1]+=dy;for(const k of['guildaSahrem','ferrariaSahrem'])MAPS.sahrem.portals[k][1]+=dy;}
gentePorCidade();
// missões da Guilda de Sahrem: a Orla do Deserto e as dunas
MISS.push({city:'sahrem',id:'lagartosOrla',t:'Cristas ao sol',map:'orla',mat:'lagarto',n:10,lv:20,txt:'Lagartos da Orla mordem as patas dos camelos na estrada das caravanas. Traga 10 Cristas de Lagarto.'},
 {city:'sahrem',id:'abutresOrla',t:'Sombras no céu',map:'orla',mat:'abutre',n:10,lv:21,txt:'Abutres Carniceiros atacam em bando quem descansa na Orla. Traga 10 Penas de Abutre.'},
 {city:'sahrem',id:'cactosOrla',t:'Cactos que andam',map:'orla',mat:'cacto',n:6,lv:22,txt:'Cactos Andantes fecham a estrada e espetam quem passa perto. Traga 6 Espinhos de Cacto.'},
 {city:'sahrem',id:'chacaisDunas',t:'Uivos na noite',map:'dunasO',mat:'chacal',n:12,lv:24,txt:'Bandos de chacais rondam o acampamento das caravanas nas Dunas do Oeste. Traga 12 Orelhas de Chacal.'},
 {city:'sahrem',id:'escaravelhosDunas',t:'Cascos verdes',map:'dunasO',mat:'escaravelho',n:6,lv:25,txt:'Escaravelhos Esmeralda cavam túneis embaixo da trilha e derrubam as carroças. Traga 6 Élitros Esmeralda.'},
 {city:'sahrem',id:'saqueadoresDunas',t:'Lenços vermelhos',map:'dunasL',mat:'saqueador',n:8,lv:26,txt:'Saqueadores das Dunas roubam as caravanas no leste. Traga 8 Lenços de Saqueador e ensine que Sahrem não é presa fácil.'},
 {city:'sahrem',id:'escorpioesDunas',t:'Ferrões na areia',map:'dunasL',mat:'escorpiao',n:8,lv:27,txt:'Escorpiões Rubros se escondem perto dos poços do leste. Traga 8 Ferrões de Escorpião (com cuidado).'},
 {city:'sahrem',id:'serpentesDunas',t:'Silvos ao sul',map:'dunasS',mat:'serpente',n:10,lv:28,txt:'Serpentes das Dunas cospem veneno em quem se aproxima da pirâmide pelo sul. Traga 10 Peles de Serpente.'});

// ================== ETAPA 3: A TUMBA DENTRO DA PIRÂMIDE ==================
// Três andares escuros (como a Caverna de Pinheiral, 11), mas de salões retos e corredores de 3 tiles em ângulo reto (tumbaMask, ligado
// pelo campo mask do 01), chão de lajes de arenito (tema 12, pintado no 01), urnas e colunas de hieróglifos no miolo dos salões (caveObj).
// A porta da pirâmide abre para o 1º andar. O Rei Sethkar (o chefe do fundo) é a etapa 4
GP[12]=['#6e5a40','#66533a','#4e3e2a','#86704e'];PC[12]=['#7a6446','#6a563c','#8a7452'];WC[12]=['#1e2a34','#26343e','#4a6a7a'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[12]=o[12].map(hexRGB);
CLFT[12]=['#7a5e3a','#5e462a','#3e2c1a','#a8885a','#947448','#1e150c','#150e08'].map(hexRGB);MINIC.obj[12]='#c8a870';
def('urna',["","","","","......kkkk......",".....kgGGgk.....","......kUUk......",".....kUUUuk.....","....kUUUUUuk....","...kUGGGGGGuk...","...kUUhUhUUuk...","...kUUUUUUUuk...","....kUUUUUuk....",".....kUUUuk.....","....kkkkkkkk...."],{U:'#b8703a',u:'#7a4422',G:'#e8c048',g:'#b8902a',h:'#2a1a10'});
// coluna de arenito (16×34) com hieróglifos pintados de azul e ocre
reg('colunaT',(()=>{const c=cnv(16,34),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f('#c8a870',1,0,14,4);f('#ecd4a0',1,0,14,1);f('#9a7a4e',1,3,14,1);f('#d8bc84',3,4,10,25);f('#ecd4a0',3,4,2,25);f('#a8885a',11,4,2,25);
 for(let y=7;y<27;y+=5){f('#3a6ab8',5,y,2,2);f('#c8862a',8,y+1,3,1);f('#3a6ab8',8,y+2,1,1);f('#7a4422',6,y+3,4,1);}
 f('#c8a870',1,29,14,5);f('#ecd4a0',1,29,14,1);f('#9a7a4e',1,33,14,1);return outlineK(c);})());
def('mumia',["......kkkk......",".....kWWwWk.....","....kWwWWwWk....","....kWeWWeWk....","....kwWWWWwk....",".....kWwWWk.....","...kkWWWwWWkkkk.","..kWwWWwWWWWWWWk","..kWWwWWwWkkkkk.","...kWWWwWWk.....","....kWwWWWk.....","....kWWwWWk.....","...kWWwkWWwk....","...kWwk.kWWk....","...kWWk.kwWk....","...kkk...kkk...."],{W:'#d8ccb0',w:'#a89a78',e:'#5aff8a'});
def('besouroT',["","","","","","","","","......kkk.......",".....kBbBk......",".....kBBBk......","..kkk.kkk..kkk..",".kBbBk....kBbBk.",".kBBBk....kBBBk.","..kkk......kkk.."],{B:'#2a4a7a',b:'#6a9ad8'});
def('sentinela',["....k..k.....k..","...kJkkJk...kSk.","...kJJJJk...kSk.","...kJeJJJJk..n..","...kJJJJkkk..n..","....kJJk.....n..","..kkGGGGkk...n..",".kJJGgGGJJk.kn..",".kJkCCCCkJJkJnk.",".kJkCCCCk.kkkn..","..k.kCCk.....n..","....kWWWk....n..","...kWWkWWk...n..","...kJk.kJk...n..","...kJk.kJk......","...kkk.kkk......"],{J:'#2a2a3a',e:'#ffd040',G:'#e8c048',g:'#fff0a0',C:'#d8c8a0',W:'#e8e0c8',S:'#d8d8e8',n:'#8a6a3a'});
def('sacerdote',["...k.k.k....kk..","...kIkIkk..kOOk.","...kIIIIIk.kOOk.","...kSSSSSk..kk..","...kSeSeSk..n...","....kSSSk...n...","..kkRRRRRkk.n...",".kRRRrRRRRRkn...",".kRRRrRRRRsknk..","..kRRrRRRRk.n...","..kRRrRRRRk.n...","..kRRrRRRRk.n...",".kRRRrRRRRRkn...",".kRRRRRRRRRkn...",".kkkkkkkkkkkn...","............k..."],{I:'#6a6a72',S:'#b89a8a',e:'#ff4040',R:'#4a2a5a',r:'#c8a040',s:'#b89a8a',O:'#c060ff',n:'#5a3a20'});
Object.assign(MDEF,{
 besouroT:{n:'Enxame de Escaravelhos',hp:40,atk:12,def:3,spd:80,xp:18,r:6,aggro:110,cd:.7,pack:[4,6]},
 mumia:{n:'Múmia Enfaixada',hp:220,atk:24,def:10,spd:26,xp:50,r:8,aggro:80,cd:1.7,poison:1},
 sentinela:{n:'Sentinela Chacal',hp:180,atk:28,def:12,spd:52,xp:55,r:8,aggro:100,cd:1.4,slam:{every:6,r:30,mult:1.7,delay:.8}},
 sacerdote:{n:'Sacerdote de Kharzen',hp:120,atk:26,def:6,spd:40,xp:52,r:7,aggro:140,cd:1.8,ranged:120,projC:'#c060ff'}});
for(const[k,n,c]of[['besouroT','Asa de Escaravelho','#3a5a8a'],['mumia','Atadura Antiga','#e8dcc0'],['sentinela','Lâmina de Bronze','#c8862a'],['sacerdote','Amuleto Profano','#8a3ab0']])
 LOOTM[k]={n,c,w:1,v:clamp(Math.round(MDEF[k].xp/3),2,15)};
Object.assign(MATSHP,{
 besouroT:[["kk......kk","kCk....kCk",".kCk..kCk.",".kcCkkCdk.","..kCeeCk..","..kCeeCk..",".kcCkkCdk.",".kCk..kCk.","kk......kk"],{e:'#1e2a3a'}],
 mumia:[["..kkkkkk..",".kCCdCCCk.","kCdCCCdCCk","kCCCdCCCdk","kdCCCdCCCk",".kCCCCdCk.","..kCdCCk..","...kCCk...","....kk...."]],
 sentinela:[["........kk",".......kck","......kcCk",".....kcCk.","....kcCk..","...kcCk...","kk.kCdk...","keekdk....",".kkk......"],{e:'#5a3a20'}],
 sacerdote:[["...kkkk...","..kCCCCk..","..kCk.kCk.","..kCk.kCk.","...kCCCk..","....kek...","...kefek..","..kefffek.","...keeek..","....kkk..."],{e:'#e8c048',f:'#c060ff'}]});
for(const k of['besouroT','mumia','sentinela','sacerdote']){const c=LOOTM[k].c,s=MATSHP[k];def('mat_'+k,s[0],Object.assign({C:c,c:shadeHex(c,.45),d:shadeHex(c,-.35)},s[1]));}
// salões retangulares (7 a 13 de largura, 5 a 9 de altura) ligados por corredores de 3 tiles em L (árvore mínima + 2 atalhos), e um
// salãozinho em volta de cada escada ou porta
function tumbaMask(M,rng){const C=new Uint8Array(W*H),n=a=>Math.floor(rng()*a);
 const box=(x0,y0,x1,y1)=>{for(let y=Math.max(2,Math.min(y0,y1));y<=Math.min(H-3,Math.max(y0,y1));y++)for(let x=Math.max(2,Math.min(x0,x1));x<=Math.min(W-3,Math.max(x0,x1));x++)C[y*W+x]=1;};
 const hall=(a,b)=>{if(rng()<.5){box(a.x,a.y-1,b.x,a.y+1);box(b.x-1,a.y,b.x+1,b.y);}else{box(a.x-1,a.y,a.x+1,b.y);box(a.x,b.y-1,b.x,b.y+1);}};
 const rooms=[];for(let k=0;k<400&&rooms.length<10;k++){const w=3+n(4),h=2+n(3),x=5+w+n(W-10-2*w),y=5+h+n(H-10-2*h);
  if(rooms.some(o=>Math.abs(o.x-x)<o.w+w+4&&Math.abs(o.y-y)<o.h+h+4))continue;rooms.push({x,y,w,h});}
 for(const p of Object.values(M.portals))rooms.push({x:clamp(Math.round(p[0]),5,W-6),y:clamp(Math.round(p[1]),4,H-5),w:2,h:2});
 for(const r of rooms)box(r.x-r.w,r.y-r.h,r.x+r.w,r.y+r.h);
 const inT=[rooms[0]],out=rooms.slice(1);
 while(out.length){let best=null;for(const a of inT)for(const b of out){const d=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);if(!best||d<best.d)best={a,b,d};}
  hall(best.a,best.b);inT.push(best.b);out.splice(out.indexOf(best.b),1);}
 for(let k=0;k<2;k++)hall(rooms[n(rooms.length)],rooms[n(rooms.length)]);
 return C;}
const TUMBA={cave:1,dark:1,mask:tumbaMask,caveObj:['urna','colunaT'],theme:12};
Object.assign(MAPS,{
 tumba1:{...TUMBA,n:'Pirâmide de Sahrem • 1º andar',s:'Nível 30 a 33 • escuridão',seed:1201,color:'#1e140a',lv:[30,33],home:'sahrem',portals:{sahrem:[40,56],tumba2:[8,7]},
  count:24,chests:5,tier:3,mons:[['besouroT',.45],['mumia',1]]},
 tumba2:{...TUMBA,n:'Pirâmide de Sahrem • 2º andar',s:'Nível 33 a 36 • escuridão',seed:1202,color:'#1a1008',lv:[33,36],home:'tumba1',portals:{tumba1:[8,7],tumba3:[71,52]},
  count:24,chests:5,tier:4,mons:[['mumia',.35],['sentinela',.7],['sacerdote',1]]},
 tumba3:{...TUMBA,n:'Pirâmide de Sahrem • câmara do rei',s:'Nível 36 a 40 • escuridão',seed:1203,color:'#140c06',lv:[36,40],home:'tumba2',portals:{tumba2:[71,52]},
  count:20,chests:4,tier:4,elite:.12,mons:[['sacerdote',.3],['sentinela',.6],['mumia',.85],['besouroT',1]]}});
// a porta da pirâmide (o tile da frente dela, embaixo no meio) agora leva ao 1º andar
MAPS.sahrem.portals.tumba1=[MAPS.sahrem.piramide[0],MAPS.sahrem.piramide[1]+1,'porta'];
