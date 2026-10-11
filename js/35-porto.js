// Ecos de Valdoria — O Porto de Maresia, a cidade do mar (etapa 4 do plano de 08/10/2026, região nova do litoral leste)
'use strict';
// Depois da Encosta de Pinheiral 07, a Costa dos Ventos (nível 26 a 29) desce até o mar. No litoral fica o Porto de Maresia: cidade de
// pescadores e marinheiros (padroeiro: Varek, o mar e as tempestades), sem muralha, com casas brancas de telhado azul, cais de madeira,
// navios ancorados e um farol na ponta do quebra-mar. Ao sul, a Praia dos Naufrágios (29 a 32); ao norte, os Rochedos da Maré (31 a 34).
// O mar (mar:[x], costa) cobre o lado leste dos mapas do litoral, com uma faixa de areia na beira.

// ================== TEMA 13: LITORAL ==================
// capim de beira-mar (um pouco amarelado), caminho de areia, mar azul-esverdeado; a praia usa o chão do deserto (tema 11)
GP[13]=['#7aa860','#72a058','#5e8a4a','#94c074'];PC[13]=['#c8b088','#b8a078','#dcc49c'];WC[13]=['#1f6a98','#2a7eac','#a8dcf0'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[13]=o[13].map(hexRGB);
PLZT[13]=['#a8a294','#827c70','#c4beb0'].map(hexRGB);MINIC.obj[13]='#2f5a3a';
RPAL[13]={l:'#c4c8c8',m:'#8e9494',d:'#5e6464',g:'#4a8a6a',G:'#2e6a50'};{const rng=mulberry32(1313);for(let v=0;v<4;v++)reg(`rock13_${v}`,genRock(RPAL[13],rng,v));}
// árvores do litoral: dois pinheiros de beira-mar (vento do leste) e duas árvores de copa baixa
{const rng=mulberry32(1314),pp={l:'#6aa070',m:'#3a7050',d:'#244a36',t:'#6a4a2a'};reg('tree13_0',genPine(pp,rng));reg('tree13_1',genPine(pp,rng));
 const tp={l:'#a8cc6a',m:'#6a9a48',d:'#3a6a3a',t1:'#8a6a42',t2:'#5e4428'};reg('tree13_2',genTree(tp,rng,2));reg('tree13_3',genTree(tp,rng,0));}

// ================== O MAR ==================
// mar:[x, largura da praia] = coluna da beira-mar (com ondulação). Do lado leste vira água funda (tema 13); as colunas antes dela (4, se não disser) viram praia de areia
// (tema 11), sem árvores. Portais, móveis (deco) e as pessoas dos pedidos ficam onde estão. M.beira[y] = primeira coluna de água da linha y.
function costa(M,road){const nz=makeNoise(mulberry32(M.seed+7),6),bx=M.mar[0],pw=M.mar[1]||4,ptx=Object.values(M.portals),dec=new Set((M.deco||[]).map(([x,y])=>y*W+x));
 for(const[hx,hy]of M.houses||[])for(let dy=-1;dy<=0;dy++)for(let dx=-1;dx<=2;dx++)dec.add((hy+dy)*W+hx+dx); // casas também ficam
 const tira=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);};M.beira=[];
 for(let y=0;y<H;y++){const c=Math.round(bx+(nz(1,y)-.5)*8+Math.sin(y*.21)*1.5);M.beira[y]=c;
  for(let x=Math.max(1,c-pw-Math.round(nz(9,y)*3));x<W;x++){const i=y*W+x;if(dec.has(i)||ptx.some(p=>hyp(x-p[0],y-p[1])<3))continue;
   if(x>=c){tira(x,y);ground[i]=G.WATER;solid[i]=1;zoneMap[i]=13;}
   else{zoneMap[i]=11;if(road[i])continue;tira(x,y);ground[i]=G.GRASS;solid[i]=0;if(((x*7+y*13)>>>0)%23===0&&x<c-1){solid[i]=1;addObj(x,y,rockAt(x,y,13));}}}}}

// ================== CASAS E COISAS DO PORTO ==================
// casa do porto (32×32): térreo de pedra, andar de reboco branco com vigas, janelas com venezianas, porta azul e telhado alto de ardósia
function genPortoHouse(roof,roofD,porta='#2a6a8a'){const c=cnv(32,32),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f(K,3,12,26,20);f('#f2eee4',4,13,24,11);f('#fbf8f0',4,13,2,11);f('#d8d2c4',26,13,2,11);
 for(let y=24;y<31;y++)for(let i=4;i<28;i++)f((y-24)%3===2||(i+(((y-24)/3)|0)*3)%7===0?'#5e6266':i<7?'#b4b8bc':'#9aa0a4',i,y,1,1);
 f('#5a3a22',4,13,24,1);f('#5a3a22',4,23,24,1);f('#5a3a22',4,13,1,11);f('#5a3a22',27,13,1,11);
 f(K,12,21,8,11);f(K,13,20,6,1);f(porta,13,21,6,10);f(shadeHex(porta,-.3),15,21,1,10);f(shadeHex(porta,.3),13,21,1,10);f('#e8c048',17,26,1,1);
 for(const wx of[6,22]){f(K,wx-1,15,6,6);f('#9fd4ff',wx,16,4,4);f('#d8f0ff',wx,16,2,1);f(porta,wx-2,15,1,6);f(porta,wx+5,15,1,6);f('#d8d2c4',wx-1,21,6,1);}
 for(let y=0;y<14;y++){const hw=Math.min(15,2+y);f(K,16-hw-1,y,hw*2+2,1);f(y%3===0?roofD:roof,16-hw,y,hw*2,1);f(shadeHex(roof,.25),16-hw,y,1,1);}
 f(K,14,5,5,5);f('#ffd06a',15,6,3,3);f('#fff0b0',15,6,1,1);f(K,23,1,4,6);f('#8a8478',24,2,2,5);return c;}
reg('portoCasa1',genPortoHouse('#2a5a7a','#1c4058'));reg('portoCasa2',genPortoHouse('#2a7a7a','#1c5454','#8a3a2a'));reg('portoCasa3',genPortoHouse('#3a4a6a','#262f48','#2a7a5a'));
reg('ferrariaP',signHouse('#2a5a7a','#1c4058','#8a5a30',SYM_BIGORNA,genPortoHouse));CASAEST.P='portoCasa2';
// a Guilda do Porto: o salão grande (13) em pedra cinza e reboco branco, telhado azul de ardósia
reg('guilda5',guildaGrande({R:'#2a5a7a',RD:'#1c4058',RL:'#4a84a8',RS:'#24506c',E:'#10243a',T:'#5a3a22',P:'#f2eee4',PL:'#fbf8f0',L:'#c4c8cc',D:'#6a6e72',PE:['#5a5e62','#b4b8bc','#8e9498']}));
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return outlineK(c);};
 // navio ancorado (72×56): casco de madeira, dois mastros, velas brancas com a faixa azul e a bandeira de Varek (onda partida por um raio)
 reg('navio',box(72,56,f=>{for(let y=0;y<14;y++){const a=Math.round(4+y*y*.06),b=Math.round(68-y*y*.05);f(y<3?'#8a5a30':y%4===0?'#4a2e18':y<8?'#6a4224':'#5a3820',a,42+Math.min(y,13)-13+y*0,b-a,1);}
   for(let y=0;y<11;y++){const a=Math.round(6+y*1.2),b=Math.round(66-y*1.5);f(y===0?'#a8743c':y%3===0?'#3a2414':y<5?'#7a4e2c':'#5a3820',a,42+y,b-a,1);}
   f('#e8c048',10,44,2,2);f('#e8c048',20,44,2,2);f('#e8c048',30,44,2,2);f('#e8c048',40,44,2,2);f('#e8c048',50,44,2,2);
   f('#a8743c',58,36,12,6);f('#7a4e2c',58,40,12,2);f('#3a2414',6,38,20,4);f('#7a4e2c',6,38,20,1); // castelo de popa e proa
   f('#5a3820',26,2,3,40);f('#7a4e2c',26,2,1,40);f('#5a3820',48,8,3,34);f('#7a4e2c',48,8,1,34);
   for(const[m,y0,h,w]of[[27,6,26,22],[49,12,22,18]])for(let y=0;y<h;y++){const ww=Math.round(w*(.75+.25*Math.sin(y/h*Math.PI)));f(y%9===4?'#2a6a9a':'#f4f0e4',m-ww/2|0,y0+y,ww,1);f('#d8d2c0',(m+ww/2|0)-2,y0+y,2,1);}
   f('#5a3820',14,3,26,1);f('#5a3820',38,10,20,1);
   f('#2a3a6a',29,0,10,6);f('#e8f0ff',31,2,5,1);f('#ffe060',34,1,1,4);f('#ffe060',33,3,1,1);
   for(let i=0;i<9;i++)f('#3a2414',60+i,34-i,1,1);}));
 // barco a remo na areia (32×16)
 reg('barco',box(32,16,f=>{for(let y=0;y<8;y++){const a=2+y,b=30-y;f(y===0?'#a8743c':y%3===0?'#3a2414':'#7a4e2c',a,6+y,b-a,1);}f('#5a3820',4,5,24,1);f('#c8a060',10,6,2,4);f('#c8a060',20,6,2,4);
   f('#8a6a3a',6,2,1,8);f('#8a6a3a',7,1,1,2);f('#8a6a3a',24,3,10,1);}));
 // farol (28×72): torre branca de faixas vermelhas, galeria, a luz e a base de pedra do quebra-mar
 reg('farol',box(28,72,f=>{for(let y=14;y<64;y++){const hw=Math.round(6+(y-14)*.08);const band=((y-14)/9|0)%2;
   for(let i=14-hw;i<14+hw;i++){const u=(i-14+hw)/(2*hw);f(band?(u<.3?'#e8605a':u>.7?'#a83028':'#d0403a'):(u<.3?'#ffffff':u>.7?'#c8c4bc':'#ecebe6'),i,y,1,1);}}
   f('#3a3a42',6,12,16,3);f('#5a5a62',6,12,16,1);for(let i=6;i<22;i+=3)f('#2a2a30',i,9,1,3);f('#2a2a30',6,8,16,1);
   f('#2a2a30',9,2,10,7);f('#ffe070',10,3,8,5);f('#fff8c0',11,3,3,3);f('#d8403a',8,0,12,2);f('#e8605a',12,0,4,1);
   f('#2a2a30',12,30,4,5);f('#ffd06a',13,31,2,3);f('#2a2a30',12,46,4,5);f('#ffd06a',13,47,2,3);f('#3a2414',11,56,6,8);f('#5a3820',12,57,4,7);
   for(let y=64;y<72;y++)for(let i=2;i<26;i++)f((y%3===0||(i+(y%6<3?0:3))%6===0)?'#5e6266':'#9aa0a4',i,y,1,1);}));
 // caixotes, redes de pesca secando, âncora, banca de peixe e o casco de um naufrágio
 reg('caixotes',box(16,18,f=>{f('#8a5a30',1,6,9,12);f('#a8743c',1,6,9,1);f('#5a3820',1,11,9,1);f('#5a3820',5,6,1,12);f('#9a6a3a',7,2,8,9);f('#b8844c',7,2,8,1);f('#5a3820',7,6,8,1);f('#5a3820',11,2,1,9);}));
 reg('redes',box(32,22,f=>{f('#5a3820',2,2,2,20);f('#5a3820',28,2,2,20);f('#7a4e2c',2,2,28,2);
   for(let y=4;y<17;y++)for(let i=4;i<28;i++)if((i+y)%3===0||(i-y+30)%3===0)f(y%2?'#c8b890':'#a89870',i,y,1,1);f('#e8605a',8,10,2,2);f('#e8605a',20,7,2,2);f('#e8605a',14,14,2,2);}));
 reg('ancora',box(16,18,f=>{f('#5a6068',7,1,2,14);f('#7a828a',7,1,1,14);f('#5a6068',5,2,6,1);f('#5a6068',6,0,4,2);f('#2a2a30',7,0,2,1);
   f('#5a6068',2,12,12,2);f('#5a6068',1,9,2,4);f('#5a6068',13,9,2,4);f('#7a828a',2,12,12,1);f('#8a5a30',4,15,8,2);}));
 reg('bancaPeixe',box(32,26,f=>{f('#2a5a7a',1,3,30,6);for(let i=0;i<7;i++)f(i%2?'#f2eee4':'#2a6a8a',2+i*4,4,4,4);f('#5a3820',3,9,2,10);f('#5a3820',27,9,2,10);
   f('#9a6a3a',2,17,28,8);f('#b8844c',2,17,28,1);for(const[a,c]of[[4,'#9ab8c8'],[10,'#c8a0a0'],[16,'#9ab8c8'],[22,'#b0c8b0']]){f(c,a,14,5,3);f('#2a2a30',a+4,15,1,1);f(shadeHex(c,-.3),a,16,5,1);}}));
 reg('naufragio',box(56,30,f=>{for(let y=0;y<12;y++){const a=Math.round(6+y*1.4),b=Math.round(50-y*1.1);f(y%3===0?'#3a2414':'#6a4224',a,16+y,b-a,1);}
   for(const rx of[12,20,28,36,44])for(let y=4;y<18;y++)f('#5a3820',rx+Math.round((y-4)*.3),y,2,1);f('#5a3820',22,0,3,18);f('#7a4e2c',22,0,1,18);
   f('#e8e0c8',25,2,8,7);f('#c8c0a8',27,6,6,3);f('#3a2414',30,22,8,4);f('#c8b48a',0,26,56,4);}));}
// a placa do Porto no arco não existe (o Porto não tem muralha); o farol e os navios são a marca dele

// ================== MONSTROS DO LITORAL ==================
// Costa (26 a 29): caranguejo (casco duro, pinçada em área), gaivota (bando, voa, rouba moedas) e água-viva (flutua, veneno).
// Praia e Rochedos (29 a 34): corsário afogado (o pirata que o mar devolveu), polvo (tinta de longe) e os da costa
defMon('caranguejo',["..cc..........cc..",".cCCc........cCCc.",".cCkC........CkCc.","..cCC..w..w..CCc..","...cC..k..k..Cc...","....cCCCCCCCCCc...","..cCCCCwwCCCCCCc..",".cCCwCCCCCCCCCCCc.",".dCCCCCCCCCCCCCCd.","..ddddddddddddd...",".d.d.d......d.d.d.","d..d..d....d..d..d"],{C:'#d8503a',c:'#ff8a6a',d:'#8a2a1a',w:'#f4ece0'});
defMon('gaivota',["...........WW...","..........WWkYy.","GG........WWW...","gGGG.....WWW....",".gGGGGWWWWWW....","..gGGGGWWWWWW...","...ggGGGWWWWWw..",".....gggWWWww...","........ww......",".......YY.YY...."],{W:'#f4f4f0',w:'#c8ccd0',G:'#9aa4b0',g:'#5a6470',Y:'#f0b030',y:'#d0402a'});
defMon('aguaviva',["....pPPPPp....","..pPPwwPPPPp..",".pPwwPPPPPPPp.",".PPwPPPPPPPPPd","pPPPPgPPgPPPPd","pPPPPPPPPPPPdd",".ddddddddddd..","..t.T.t.T.t...","..T.t.T.t.T...","...t.T..T.t...","..t..t.T..T...","...T..t..t....","....t....T...."],{P:'#e88ad8',p:'#ffc0f0',w:'#ffffff',d:'#a04a98',g:'#fff0ff',t:'#c070c0',T:'#f0a0e8'});
defMon('corsario',["....hhhhhh......","...hHHHHHHh.....","..hHHHyHHHHh....","....sseksss.....","....sssssns.....",".....sRRRs......","...cCCwwCCc....S","..cCCCwwCCCc..SS","..sCCCwwCCCc.SS.","..sCCbbbbCCssS..","...CCCwwCCC.....","...pPPPPPPp.....","...pPP..PPp.....","...pP....Pp.....","..bbb....bbb...."],
 {h:'#2a2228',H:'#3a3038',y:'#e8c048',s:'#a8c0a0',e:'#ffe060',n:'#7a9a78',R:'#4a5a48',c:'#5a1a1a',C:'#8a2a2a',w:'#e8e0c8',b:'#3a2a1a',p:'#3a3a52',P:'#4a4a6a',S:'#c8ccd4'});
defMon('polvo',["....oOOOOo......","..oOOwOOOOOo....",".oOwOOOOOOOOo...",".OOOOOOOOOOOOd..",".OOOeeOOOeeOOd..",".OOOekOOOekOOd..","..dOOOOOOOOOd...",".oOdOoOdOoOdOo..","oO.oO.oO.dO.oOo.","O..O..dO..O..dO.",".oO..oO...Oo..O.","..............oO"],{O:'#9a4ab0',o:'#c87ad8',d:'#5a2a6a',w:'#f0c8ff',e:'#fff0a0'});
Object.assign(MDEF,{
 caranguejo:{n:'Caranguejo Couraçado',hp:230,atk:24,def:16,spd:34,xp:48,r:8,aggro:70,cd:1.6,slam:{every:5,r:30,mult:1.5,delay:.9}},
 gaivota:{n:'Gaivota Ladra',hp:60,atk:16,def:3,spd:78,xp:26,r:6,aggro:120,cd:1,fly:1,pack:[2,3],steal:1},
 aguaviva:{n:'Água-Viva Errante',hp:110,atk:22,def:4,spd:30,xp:40,r:7,aggro:80,cd:1.4,hover:1,poison:1},
 corsario:{n:'Corsário Afogado',hp:170,atk:26,def:10,spd:56,xp:52,r:8,aggro:100,cd:1.2},
 polvo:{n:'Polvo da Maré',hp:140,atk:24,def:6,spd:36,xp:48,r:8,aggro:120,cd:1.7,ranged:110,projC:'#3a2a5a'}});
for(const[k,n,c]of[['caranguejo','Pinça Couraçada','#d8503a'],['gaivota','Pena de Gaivota','#e8ecf0'],['aguaviva','Gel de Água-Viva','#e88ad8'],['corsario','Tapa-Olho Rasgado','#3a3038'],['polvo','Tentáculo de Polvo','#9a4ab0']])
 LOOTM[k]={n,c,w:1,v:clamp(Math.round(MDEF[k].xp/3),2,15)};
Object.assign(MATSHP,{
 caranguejo:[["..cCCCd.....","..cCCCCd....","...dd.cCd...","......cCd...","..cCCCCCd...",".cCCwCCCCd..",".cCCCCCCCd..","..dCCCCCdd..","....dddd...."]],
 gaivota:[["..........cd",".........cCd","........cCCd","......ccCCd.",".....cCCCd..","....cCCCd...","...cCCCd....","..eeCdd.....",".eeed.......","ee.........."],{e:'#8a949c'}],
 aguaviva:[["...cCCd...","..cCwCCd..",".cCwCCCCd.",".cCCCCCCd.","cCCCCeCCCd","cCCeCCCCCd",".dCCCCCdd.","..dddddd.."],{e:'#fff0ff'}],
 corsario:[["e..........e",".e........e.","..e......e..","...cCCCCd...","..cCCCCCCd..","..CCwCCCCd..","..CCCCCCCd..","...dCCCdd...","....ddd....."],{e:'#8a6a4a'}],
 polvo:[["....cCd.....","...cCCd.....","..cCwd......","..cCd.......","..cCd..e....",".cCCd.eCe...",".cCCCdCCd...","..cCCCCd....","...dddd....."],{e:'#f0c8ff'}]});
for(const k of['caranguejo','gaivota','aguaviva','corsario','polvo'])defMat(k);
// os consumíveis deles (o sistema é o do 32: cada monstro tem o seu)
Object.assign(CONS,{
 caranguejo:{n:'Carapaça Lustrosa',c:'#e0603a',e:{def:.2,thorns:.15,t:120},s:[".cCCCCCCd.","cCwwCCCCCd","cCwCCCCCCd","cCCCCeCCCd",".cCCeCeCd.","..ddCCdd..","....dd...."]},
 gaivota:{n:'Ovo de Gaivota',c:'#f0ece0',p:{e:'#9a8a70'},e:{heal:.4},s:["...cCd...","..cCCCd..",".cCwCeCd.",".cCCCCCd.","cCeCCCeCd","cCCCeCCCd",".cCCCCCd.","..ddddd.."]},
 aguaviva:{n:'Brilho da Maré',c:'#6ad8f0',p:{e:'#8a5a30'},e:{mregen:.03,t:20},s:["...ee...","..eeee..","...cd...","..cCCd..",".cCwwCd.","cCwCCCCd","cCCCCCCd",".dCCCCd.","..dddd.."]},
 corsario:{n:'Mapa Rasgado',c:'#e8d8a8',p:{e:'#c03030'},e:{luck:.5,t:150},s:["cCCCCCCCd.","CCeCCCCCCd","CCCeCCCeCC","CCCCCCeCCd","CCCCCeCCC.","dCCeCCCCCd",".CCCCCCCd.","dddddddd.."]},
 polvo:{n:'Tinta de Polvo',c:'#3a2a5a',e:{furt:20},s:["...cCd...","..cwCCd..","..cCCCd..",".cCCCCCd.","cCCCCCCCd","cCCCCCCCd",".ddddddd."]}});
for(const id of['caranguejo','gaivota','aguaviva','corsario','polvo']){const C=CONS[id];def('con_'+id,olM(C.s),Object.assign({C:C.c,c:shadeHex(C.c,.45),d:shadeHex(C.c,-.35),w:'#ffffff'},C.p));}

// ================== A GENTE DO PORTO ==================
// pessoa(id, cabeça, corpo, cores, extras): bonecos de 16×16 como os das outras cidades, montados com peças (cabeça e corpo) e retoques
// (avental, barba, objeto na mão). Também usado por Altaforja (36)
const CABECA={
 cabelo:["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk....."],
 longo:["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","...kHHseesHHk...","...kHHssssHHk...","...kHkssssskHk.."],
 chapeu:["................",".....kCCCCk.....","....kCCCCCCk....","..kkCCCCCCCCkk..","..kkkHseesHkkk..",".....kssssk....."],
 tricornio:["...k........k...","...kCkkkkkkCk...","...kCCCCCCCCk...","....kCCyCCCk....","....kHseesHk....",".....kssssk....."],
 gorro:["......kWk.......",".....kGGGk......","....kGGGGGk.....","....kgggggk.....","....kHseesHk....",".....kssssk....."],
 lenco:["......kkkk......",".....kLLLLk.....","....kLLlLLLkk...","....kLseesLkLk..","....kHssssHk.k..",".....kssssk....."],
 capuz:["......kkkk......",".....kCCCCk.....","....kCCCCCCk....","...kCCseesCCk...","...kCCssssCCk...","...kCCkssskCCk.."],
 careca:["................","......kkkk......",".....kssssk.....","....ksseessk....","....kHssssHk....",".....kssssk....."]};
const CORPO={
 calca:["...kkTTTTTTkk...","..ksTTTTTTTTsk..","..ksTTTTTTTTsk..","...kTTTTTTTTk...","....kTTTTTTk....","....kyyyyyyk....","....kPPPPPPk....","....kPPkkPPk....","....kbbk.kbbk...","....kkk...kkk..."],
 saia:["...kkTTTTTTkk...","..ksTTTTTTTTsk..","..ksTTTTTTTTsk..","...kTTTTTTTTk...","....kTTTTTTk....","....kDDDDDDk....","...kDDDDDDDDk...","...kDDDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],
 manto:["..kkTTTTTTTTkk..",".kTTTTTTTTTTTTk.",".kTsTTTTTTTTsTk.","..kTTTTTTTTTTk..","..kTTTTTTTTTTk..","...kTTTTTTTTk...","...kTTTTTTTTk...","...kTTTTTTTTk...","....kbbk.kbbk...","....kkk...kkk..."]};
function pessoa(id,cab,corpo,pal,ex={}){const r=[...CABECA[cab],...CORPO[corpo]];const put=(y,x,s)=>{r[y]=r[y].slice(0,x)+s+r[y].slice(x+s.length);};
 if(ex.listras)for(const y of[7,9])put(y,5,'tttttt');
 if(ex.barba){put(5,5,'kRRRRk');put(6,6,'RRRR');}
 if(ex.bigode)put(4,6,'RRRR');
 if(ex.avental)for(let y=7;y<=12;y++)put(y,6,'AAAA');
 if(ex.cinto)put(11,5,'yyggyy');
 for(const[y,x,s]of ex.mao||[])put(y,x,s);
 def(id,r,Object.assign({s:'#e0a878',e:K,b:'#4a3020',y:'#5a3a22',g:'#e8c048'},pal));}
// objetos na mão (lado direito), [linha, coluna, desenho]
const MAO={
 vara:[[0,14,'k'],[1,14,'y'],[2,13,'ky'],[3,13,'y'],[4,13,'y'],[5,13,'y'],[6,13,'y'],[7,12,'kyk'],[8,13,'y'],[9,13,'y'],[1,15,'n'],[2,15,'n'],[3,15,'n'],[4,15,'n'],[5,15,'o']],
 martelo:[[7,12,'kMMk'],[8,12,'kMMk'],[9,13,'y'],[10,13,'y'],[11,13,'y']],
 lanterna:[[8,13,'kk'],[9,12,'kLLk'],[10,12,'kLLk'],[11,13,'kk']],
 livro:[[8,12,'kkkk'],[9,12,'kVVk'],[10,12,'kVVk'],[11,12,'kkkk']],
 peixe:[[9,12,'kFFFk'],[10,11,'kFFFFFk'],[11,12,'kFFFk']],
 picareta:[[5,11,'kMMMMk'],[6,13,'y'],[7,13,'y'],[8,13,'y'],[9,13,'y'],[10,13,'y']],
 cajado:[[1,13,'kOk'],[2,13,'kOk'],[3,14,'y'],[4,14,'y'],[5,14,'y'],[6,14,'y'],[7,14,'y'],[8,14,'y'],[9,14,'y'],[10,14,'y'],[11,14,'y'],[12,14,'y'],[13,14,'y']],
 caneca:[[9,12,'kkkk'],[10,12,'kWWkk'],[11,12,'kWWk'],[12,12,'kkkk']]};
// mercador, ferreiro, taverneira e o salão da Guilda (recepção, veterano, bardo)
pessoa('ruy','chapeu','calca',{R:'#5a3a22',C:'#c8a060',H:'#5a3a22',T:'#2a5a8a',t:'#f4f0e4',P:'#3a3a4a'},{listras:1,bigode:1});
pessoa('tristao','careca','calca',{H:'#3a2a1a',T:'#6a6e72',P:'#3a3a4a',A:'#8a5a30',R:'#3a2a1a',M:'#9aa4b0',s:'#c88858'},{avental:1,barba:1,mao:MAO.martelo});
pessoa('leonor','longo','saia',{H:'#8a3a2a',T:'#f2eee4',D:'#2a6a7a',A:'#f4f0e4',W:'#e8e0c8'},{avental:1,mao:MAO.caneca});
pessoa('iara','longo','saia',{H:'#2a1a14',T:'#2a7a8a',D:'#1c5a6a',V:'#c8a048',s:'#b07a50'},{mao:MAO.livro});
pessoa('gaspar','tricornio','manto',{C:'#2a2a3a',y:'#e8c048',H:'#c8c8c8',T:'#2a3a6a',R:'#d8d8d8'},{barba:1});
pessoa('quim','lenco','calca',{L:'#d0403a',l:'#f4f0e4',H:'#6a4a2a',T:'#f4f0e4',t:'#2a5a8a',P:'#5a4a3a',O:'#a8743c',o:'#5a3820'},{listras:1,mao:[[8,12,'kOOk'],[9,11,'kOooOk'],[10,11,'kOooOk'],[11,12,'kOOk'],[7,13,'y'],[6,13,'y']]});
// os moradores com pedido
pessoa('marina','lenco','saia',{L:'#2a6a8a',l:'#f4f0e4',H:'#a85a2a',T:'#e8dcc0',D:'#5a7a8a',F:'#9ab8c8'},{mao:MAO.peixe});
pessoa('anselmo','gorro','manto',{G:'#2a3a5a',g:'#1c2840',W:'#f4f0e4',H:'#d8d8d8',T:'#3a4a5a',R:'#e8e8e8',L:'#ffe070'},{barba:1,mao:MAO.lanterna});
pessoa('ondina','tricornio','calca',{C:'#8a2a2a',y:'#e8c048',H:'#1a1414',T:'#f4f0e4',P:'#2a2a3a',s:'#c88858',S:'#d8dce4'},{cinto:1,mao:[[7,12,'kSk'],[6,13,'S'],[5,14,'S'],[4,15,'S'],[8,12,'kyk']]});
CIDP.porto={merc:['Mercador Ruy','ruy','Peixe fresco, corda boa e poções salgadas! Pago bem pelo que o mar devolve, aventureiro.'],
 smith:['Ferreiro Tristão','tristao','Aço de porto aguenta sal e tempestade. Até o +5, nem a maresia estraga. Depois disso... o mar sempre cobra a parte dele.'],
 bar:['Leonor','leonor','Rum? Não, aqui só tônico de marinheiro. Um gole e você aguenta até tempestade de Varek!'],salao:['iara','gaspar','quim']};
GENTE.push(
 {id:'iara',n:'Iara',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda de Maresia! O mural fala da Costa, da Praia dos Naufrágios e dos Rochedos.','Até 3 missões por vez, somando todas as Guildas. Eu anoto tudo neste livro de bordo.',
  'Cada missão volta ao mural um tempo depois de entregue. O mar nunca para de trazer problema.','A Leonor, no balcão, serve tônico de marinheiro. Cura até enjoo.','O farol nunca se apaga. Enquanto ele brilhar, Maresia dorme tranquila.']},
 {id:'gaspar',n:'Capitão Gaspar',c:'#e8c080',at:[-5,-2],f:['Quarenta anos de mar e três naufrágios. O mar me devolveu nos três.','Os Corsários Afogados eram gente de carne. Varek não perdoa quem rouba no mar dele.',
  'O Polvo da Maré cospe tinta de longe. Chegue perto rápido, ou fique longe de vez.','Caranguejo Couraçado bate o chão com as pinças. Viu a areia tremer? Saia de perto.','Gaivota rouba moeda, sim senhor. Já perdi um mês de soldo para uma.']},
 {id:'quim',n:'Quim',c:'#d9a0ff',at:[-7,3],f:['Este alaúde já atravessou o mar duas vezes. Ainda está afinado, quase.','Sei todas as canções de marinheiro. A melhor é sobre uma sereia que cobrava pedágio.',
  'A Leonor paga a música com sopa de peixe. Vale mais que ouro em noite fria.','Varek é temperamental: canta-se baixinho para ele não ouvir e mandar tempestade.','Toda Guilda tem um bardo. O de Sahrem toca pandeiro e se acha o rei da festa.']});

// ================== MAPAS ==================
// Costa dos Ventos: o caminho que desce da Encosta 07 até o Porto, com morros, pinheiros de beira-mar e a estrada do porto
MAPS.costa={n:'Costa dos Ventos',s:'Nível 26 a 29',theme:13,seed:1311,color:'#24485a',road:1,plateau:.66,lv:[26,29],home:'encosta7',
 portals:{encosta7:[1,40],porto:[78,30]},count:26,chests:6,tier:3,mons:[['caranguejo',.35],['gaivota',.7],['aguaviva',1]]};
MAPS.encosta7.portals.costa=[78,40];
// o Porto: a praça no meio, casas brancas espalhadas, o mar a leste com dois cais de madeira, navios e o farol na ponta do quebra-mar
MAPS.porto={n:'Porto de Maresia',s:'Zona segura • a cidade do mar',town:1,road:1,theme:13,seed:1301,color:'#1e3a4a',lanterns:1,mar:[59],gen:portoGen,
 portals:{costa:[1,30],rochedos:[40,1],naufragios:[40,58]},cais:[22,38],quebraMar:30,
 houses:[[24,11,'portoCasa1'],[30,9,'portoCasa3'],[47,10,'portoCasa2'],[52,14,'portoCasa1'],[22,20,'portoCasa2'],[29,17,'portoCasa1'],[48,19,'portoCasa3'],
  [20,40,'portoCasa3'],[27,44,'portoCasa1'],[24,50,'portoCasa2'],[33,51,'portoCasa3'],[47,49,'portoCasa1'],[52,44,'portoCasa2'],[16,30,'portoCasa1'],[15,15,'portoCasa3'],[14,46,'portoCasa2'],
  [34,20,'portoCasa2'],[35,14,'portoCasa1'],[45,15,'portoCasa1'],[36,41,'portoCasa2'],[44,45,'portoCasa3'],[29,37,'portoCasa1'],[22,35,'portoCasa3'],[28,25,'portoCasa3'],[51,8,'portoCasa2'],[20,9,'portoCasa1']],
 deco:[[34,35,'bancaPeixe',1],[53,26,'redes',1],[53,33,'caixotes'],[54,40,'ancora'],[52,20,'caixotes'],[55,48,'barco',1],[50,24,'caixotes'],[47,41,'barril'],[48,41,'barril'],[53,36,'redes',1]]};
// os cais (cais: linhas de cima de cada um, 2 tiles de largura) e o quebra-mar de pedra com o farol na ponta
function portoGen(M,road){costa(M,road);const tira=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);};
 for(const y0 of M.cais){const bx=Math.min(M.beira[y0],M.beira[y0+1]);
  for(let y=y0;y<=y0+1;y++)for(let x=44;x<bx+11;x++){const i=y*W+x;if(solid[i]&&ground[i]!==G.WATER&&objRows[y].some(o=>o.tx===x&&!/^(tree|rock)/.test(o.spr)))continue;tira(x,y);ground[i]=G.PATH;solid[i]=0;if(x>=bx)BRG[i]=2;}
  const nx=bx+6;addObj(nx,y0-1,'navio');}
 const y=M.quebraMar,bx=M.beira[y];for(let x=bx-1;x<bx+10;x++)for(const yy of[y,y+1]){const i=yy*W+x;tira(x,yy);ground[i]=G.PLAZA;solid[i]=0;}
 const fx=bx+10;for(const yy of[y,y+1]){const i=yy*W+fx;tira(fx,yy);ground[i]=G.PLAZA;solid[i]=1;}objRows[y+1].push({tx:fx,ty:y+1,spr:'farol',px:(fx+.5)*TILE,py:(y+2)*TILE,label:'Farol de Maresia'});
}
// os campos do litoral, ao sul e ao norte do Porto (sem estrada: a do Porto entra alguns passos e some na areia)
Object.assign(MAPS,{
 naufragios:{n:'Praia dos Naufrágios',s:'Nível 29 a 32',theme:13,seed:1321,color:'#1e4a5a',lv:[29,32],home:'porto',mar:[54,12],gen:(M,road)=>{costa(M,road);
   for(const y of[12,27,44]){const x=M.beira[y]-5;for(let dx=-1;dx<=2;dx++){const r=objRows[y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===x+dx)r.splice(k,1);solid[y*W+x+dx]=1;}addObj(x,y,'naufragio',1);}},
  portals:{porto:[40,1]},count:26,chests:6,tier:3,mons:[['corsario',.4],['caranguejo',.65],['polvo',1]]},
 rochedos:{n:'Rochedos da Maré',s:'Nível 31 a 34',theme:13,seed:1331,color:'#1a3a4a',lv:[31,34],home:'porto',mar:[56,6],gen:(M,road)=>{costa(M,road);
   // mais pedra que capim: rochedos espalhados (o abreBolsoes, 34, abre passagem se algum canto ficar preso)
   const rg=mulberry32(M.seed+3);for(let y=3;y<H-3;y++)for(let x=3;x<M.beira[y]-1;x++){const i=y*W+x;if(solid[i]||road[i]||Object.values(M.portals).some(p=>hyp(x-p[0],y-p[1])<4))continue;if(rg()<.06){solid[i]=1;addObj(x,y,rockAt(x,y,13));}}},
  portals:{porto:[40,58]},count:28,chests:7,tier:4,elite:.1,mons:[['polvo',.35],['aguaviva',.6],['corsario',.85],['gaivota',1]]}});
// os serviços (sem a casa da Elara, que fica só em Valdor): mercador na praça, Guilda com bar e salão, e a ferraria
guildHall('guildaPorto','porto','guilda5',1341);addBar(MAPS.guildaPorto);addSalao(MAPS.guildaPorto);
cityHouses('porto','Porto',1351,'P');
gentePorCidade();
tpReg('porto',{f:['costa','naufragios','rochedos']});
// missões da Guilda do Porto
MISS.push({city:'porto',id:'pincas',t:'Pinças na estrada',map:'costa',mat:'caranguejo',n:8,lv:27,txt:'Caranguejos Couraçados subiram a Costa dos Ventos e cortam as rédeas das carroças de peixe. Traga 8 Pinças Couraçadas.'},
 {city:'porto',id:'gaivotas',t:'Ladras de asa',map:'costa',mat:'gaivota',n:12,lv:27,txt:'As Gaivotas Ladras roubam moedas, peixe e até chapéu de quem passa pela Costa. Traga 12 Penas de Gaivota.'},
 {city:'porto',id:'aguasvivas',t:'Queimaduras na beira',map:'costa',mat:'aguaviva',n:8,lv:28,txt:'Águas-Vivas Errantes flutuam para fora do mar e queimam os pescadores. Traga 8 Géis de Água-Viva para o boticário estudar.'},
 {city:'porto',id:'corsarios',t:'O que o mar devolveu',map:'naufragios',mat:'corsario',n:8,lv:30,txt:'Corsários Afogados andam pela Praia dos Naufrágios procurando o tesouro que perderam. Traga 8 Tapa-Olhos Rasgados.'},
 {city:'porto',id:'polvos',t:'Tinta na água',map:'naufragios',mat:'polvo',n:8,lv:31,txt:'Polvos da Maré sujam de tinta as redes dos pescadores na Praia dos Naufrágios. Traga 8 Tentáculos de Polvo.'},
 {city:'porto',id:'rochedos',t:'Piratas nos rochedos',map:'rochedos',mat:'corsario',n:10,lv:33,txt:'Um bando de Corsários Afogados se esconde nos Rochedos da Maré, perto do farol. Traga 10 Tapa-Olhos Rasgados e acabe com o esconderijo.'});

// ================== PEDIDOS DOS MORADORES (28) ==================
Object.assign(COLD,{conchaP:{maps:{naufragios:8},v:'Pegar'},lente:{maps:{rochedos:1},v:'Pegar'}});
for(const[k,n,c,d]of[['conchaP','Concha Perolada','#f0c8b8','Concha rosada da Praia dos Naufrágios, com uma pérola pequena dentro. A Marina faz colares com elas.'],
 ['lente','Lente do Farol','#a8d8f0','A lente grande do farol, que uma onda levou para os Rochedos da Maré. Sem ela, a luz não chega longe.']])LOOTM[k]={n,c,w:1,v:0,q:1,d};
Object.assign(MATSHP,{
 conchaP:[["....cCCd....","..cCeCeCd...",".cCeCCeCCd..","cCeCCCCeCCd.","cCCCCCCCCCd.",".dCCfwCCCd..","..ddCCCdd...","....ddd....."],{e:'#d89888',f:'#f0f0ff'}],
 lente:[["...eeeee....","..ewwfffe...",".ewfffffCe..",".efffffCCe..",".efffCCCCe..",".effCCCCCe..","..eCCCCCe...","...eeeee...."],{e:'#c89a3a',f:'#d8f0ff'}]});
for(const k of['conchaP','lente'])defMat(k);
addPeds([
 {id:'marina',city:'porto',map:'porto',at:[37,36],n:'Pescadora Marina',c:'#9ad0f0',lv:29,t:'Colares de concha',itens:[['conchaP',6]],rew:{g:600,pots:{hp:5,mp:3}},
  pede:'Faço colares de concha para vender no cais, mas as mais bonitas ficam na Praia dos Naufrágios, onde os corsários andam. Brilham na areia quando a maré baixa. Me traz 6?',
  ok:'Que conchas lindas! Tome estas poções, e o primeiro colar é seu. Quer dizer, quando eu fizer.',
  f:['O peixe de hoje está ótimo. O de amanhã, só Varek sabe.','A maré baixa às duas. É quando as conchas aparecem.','Meu pai dizia: quem tem medo do mar não come peixe.','Cuidado com as gaivotas. Roubam até concha.']},
 {id:'anselmo',city:'porto',map:'porto',at:[55,32],n:'Faroleiro Anselmo',c:'#ffe080',lv:32,t:'A luz do farol',itens:[['lente',1],['aguaviva',6]],rew:{g:850,item:['anel',2]},
  pede:'Uma onda levou a lente do farol para os Rochedos da Maré. Sem ela a luz é fraca, e os navios batem nas pedras. E o gel de água-viva limpa o vidro melhor que tudo. Traz a lente e 6 Géis?',
  ok:'A lente! Hoje à noite o farol brilha até o fim do mar. Fique com este anel. Era do faroleiro antes de mim, e ele vigiou o mar por cinquenta anos.',
  f:['Cinquenta degraus até a lâmpada. Subo duas vezes por noite.','A luz do farol nunca se apaga. Pelo menos enquanto eu estiver aqui.','Varek manda as tempestades. O farol manda os navios para casa.','Daqui de cima já vi baleia, navio pirata e uma vez um polvo do tamanho de uma casa.']},
 {id:'ondina',city:'porto',map:'porto',at:[50,36],n:'Capitã Ondina',c:'#ff9a8a',lv:34,t:'Um navio sem medo',itens:[['corsario',8],['polvo',6]],rew:{g:1100,item:['arma',2]},
  pede:'Meu navio não sai do cais enquanto os Corsários Afogados rondarem os rochedos. Traga 8 Tapa-Olhos Rasgados, para a tripulação ver que dá para vencê-los, e 6 Tentáculos de Polvo para a ceia da partida.',
  ok:'Agora sim, a tripulação sobe a bordo! Leve esta arma. Ela já cortou corda, vela e um ou outro pirata. Agora corta o que você precisar.',
  f:['O mar não tem dono. Quem diz que tem é pirata.','Meu navio se chama Gaivota Teimosa. Nunca voltou sem carga.','Uma capitã nunca larga o leme, nem no meio da tempestade.','Quando o farol pisca três vezes, é sinal de navio chegando.']}]);
