// Ecos de Valdoria — Altaforja, a cidade dos ferreiros nas Montanhas (etapa 4 do plano de 08/10/2026, região nova do norte)
'use strict';
// Acima do Covil do Wyrm e à direita de Arcádia sobem as Montanhas. O Passo da Serra (nível 40 a 43) sai do norte do Covil e leva a
// Altaforja: cidade de ferreiros e mineiros (padroeiro: Brannar, a forja e os juramentos), de granito escuro coberto de neve, muralha de
// granito com estandartes cor de brasa, chaminés soltando fumaça e, ao lado da praça, a Grande Forja de Brannar. A mina antiga, ao norte,
// está selada (é a masmorra de uma etapa futura). A leste, os Picos Gelados (43 a 46); ao norte, a Geleira Eterna (46 a 50).

// ================== TEMA 14: NEVE ==================
GP[14]=['#d6e0ea','#ccd8e4','#b4c2d2','#f4f8fc'];PC[14]=['#8a8a94','#7a7a84','#9c9ca6'];WC[14]=['#6aa8d0','#84bce0','#e4f6ff'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[14]=o[14].map(hexRGB);
PLZT[14]=['#6a6a74','#4e4e58','#86868f'].map(hexRGB);MINIC.obj[14]='#2a4a3a';
EARTHT[14]=['#7a7a86','#5e5e6a','#44444e','#26262e','#c8d4e0'].map(hexRGB); // barranco dos morros: rocha cinza, não terra (01)
RPAL[14]={l:'#c8ccd8',m:'#8a8e9c',d:'#5a5e6a',g:'#ffffff',G:'#e4ecf4'};{const rng=mulberry32(1414);for(let v=0;v<4;v++)reg(`rock14_${v}`,genRock(RPAL[14],rng,v));}
// pinheiros com neve nos galhos (o mesmo desenho dos de Pinheiral, com o alto de cada camada branco)
{const rng=mulberry32(1415),pp={l:'#4a8a6a',m:'#2a5a46',d:'#1c3e30',t:'#5a3a22'};
 for(let v=0;v<4;v++){const c=genPine(pp,rng),x=c.getContext('2d'),d=x.getImageData(0,0,16,24),D=d.data,ehK=(i,y)=>{const j=(y*16+i)*4;return D[j+3]&&D[j]===0x1b&&D[j+1]===0x13;};
  for(let i=0;i<16;i++)for(let y=0;y<18;y++){const j=(y*16+i)*4;if(!D[j+3]||ehK(i,y))continue;const up=y>0?(y-1)*16+i:-1;
   if(up<0||!D[up*4+3]||ehK(i,y-1)){x.fillStyle=(i+y+v)%5?'#f4f8fc':'#d8e4f0';x.fillRect(i,y,1,1);if(v%2&&y<17&&(i+v)%3===0)x.fillRect(i,y+1,1,1);}}
  reg(`tree14_${v}`,c);}}

// ================== CASAS DE ALTAFORJA ==================
// casa de granito (32×32): pedra escura, telhado de ardósia com neve, chaminé soltando fumaça e janelas com o brilho laranja da forja
function genForjaHouse(roof,roofD,brilho='#ffa040'){const c=cnv(32,32),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
 f(K,3,13,26,19);for(let y=14;y<31;y++)for(let i=4;i<28;i++)f((y-14)%4===3||(i+(((y-14)/4)|0)*4)%8===0?'#2e2e36':i<7?'#7a7a86':'#5a5a64',i,y,1,1);
 f(K,12,21,8,11);f(K,13,20,6,1);f('#5a3a22',13,21,6,10);f('#3a2414',15,21,1,10);f('#3a2414',13,25,6,1);f('#9aa4b0',17,26,1,1);
 for(const wx of[6,22]){f(K,wx-1,17,6,6);f(brilho,wx,18,4,4);f('#ffe0a0',wx,18,2,1);f('#3a2414',wx+1.5,18,1,4);f('#8a8a94',wx-1,23,6,1);}
 for(let y=0;y<15;y++){const hw=Math.min(15,2+y);f(K,16-hw-1,y,hw*2+2,1);f(y%3===0?roofD:roof,16-hw,y,hw*2,1);if(y<4||y%5===1)f('#eef4fa',16-hw,y,Math.max(1,hw*2-((y*7)%5)),1);}
 f(K,21,0,6,9);f('#4a4a54',22,1,4,8);f('#e8eef4',22,1,4,1);f('#ff7a2a',23,2,2,1);
 return c;}
reg('forjaCasa1',genForjaHouse('#3a3e4a','#262a34'));reg('forjaCasa2',genForjaHouse('#4a3e3a','#2e2622','#ff8a3a'));reg('forjaCasa3',genForjaHouse('#2e3a4a','#1e2834','#ffb050'));
reg('ferrariaM',signHouse('#3a3e4a','#262a34','#8a5a30',SYM_BIGORNA,genForjaHouse));CASAEST.M='forjaCasa2';
reg('guilda6',guildaGrande({R:'#3a3e4a',RD:'#262a34',RL:'#e8eef4',RS:'#30343e',E:'#14161c',T:'#4a3a2a',P:'#8a8a94',PL:'#a8a8b4',L:'#9a9aa6',D:'#4a4a54',PE:['#2e2e36','#7a7a86','#55555f']}));
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return outlineK(c);};
 const PED='#55555f',PEDC='#8a8a96',PEDT='#6a6a76',REJ='#2e2e36',PEDE='#26262e',NEVE='#eef4fa';
 // muralha de granito (estilo 'granito' do buildWalls, 14): ameias com neve e o estandarte cor de brasa com a bigorna de Brannar
 reg('muroHG',box(16,22,f=>{f(PEDT,1,5,14,4);f(PED,1,9,14,12);f(REJ,1,12,14,1);f(REJ,1,16,14,1);f(REJ,5,9,1,3);f(REJ,11,12,1,4);f(REJ,4,16,1,5);f(REJ,12,16,1,5);f(PEDE,1,20,14,1);
  f(PEDC,1,1,4,4);f(NEVE,1,1,4,1);f(PEDC,10,1,4,4);f(NEVE,10,1,4,1);f(NEVE,1,5,14,1);}));
 reg('muroVG',box(16,22,f=>{f(PEDC,4,1,8,15);f(NEVE,4,1,8,3);f(PEDT,4,4,2,12);f(REJ,4,6,8,1);f(REJ,4,11,8,1);f(PED,4,16,8,5);f(PEDE,4,20,8,1);}));
 reg('torreG',box(24,48,f=>{f('#3a2a1a',11,0,2,12);f('#c8501a',13,1,8,5);f('#e8702a',13,1,8,1);f('#c8c8d0',15,3,4,1);f('#c8c8d0',16,4,2,1);
  f(PEDC,1,11,22,7);f(NEVE,1,11,22,2);f(PEDC,1,7,4,4);f(NEVE,1,7,4,1);f(PEDC,10,7,4,4);f(NEVE,10,7,4,1);f(PEDC,19,7,4,4);f(NEVE,19,7,4,1);
  f(PED,3,19,18,28);f('#44444e',16,19,5,28);for(const y of[24,30,36,42])f(REJ,3,y,18,1);f('#1e1e24',10,26,4,7);f('#ff8a3a',11,28,2,3);f(PEDE,3,46,18,1);}));
 // a Grande Forja de Brannar (96×80): salão de granito, duas chaminés grandes soltando fumaça, a boca da fornalha acesa e a bigorna de Brannar
 reg('grandeForja',box(96,80,f=>{
  for(const cx of[18,78]){for(let y=4;y<44;y++)for(let i=cx-5;i<cx+5;i++)f((y%4===0||(i+(y/4|0)*3)%6===0)?REJ:i<cx-2?PEDC:PED,i,y,1,1);f(NEVE,cx-6,3,12,2);f('#2a2a30',cx-4,0,8,3);f('#ff7a2a',cx-3,1,6,1);}
  for(let y=26;y<44;y++){const t=(y-26)/17,xl=Math.round(30-t*24),xr=Math.round(66+t*24);for(let i=xl;i<=xr;i++)f(i-xl<2?'#5a5e6a':xr-i<2?'#262a34':y%3===2?'#262a34':'#3a3e4a',i,y,1,1);if(y<30)f(NEVE,xl,y,xr-xl,1);}
  for(let y=44;y<78;y++)for(let i=6;i<90;i++)f((y-44)%5===4||(i+(((y-44)/5)|0)*5)%10===0?REJ:i<10?PEDC:i>85?PEDE:PED,i,y,1,1);
  f('#1a1012',32,52,32,26);for(let y=52;y<78;y++){const hw=Math.round(16-Math.max(0,(56-y))*2);if(hw>0)f(y>66?'#ff8a2a':y>60?'#e8501a':'#a82a10',48-hw,y,hw*2,1);}
  f('#ffd060',40,68,16,6);f('#fff0a0',44,70,8,3);f(PEDC,30,50,36,3);f(NEVE,30,50,36,1);
  f('#3a3e4a',38,30,20,12);f('#9aa4b0',40,33,16,3);f('#c8ccd8',40,33,16,1);f('#9aa4b0',45,36,6,3);f('#6a6e7a',42,39,12,2); // a bigorna no frontão
  for(const wx of[12,74]){f('#1e1e24',wx,54,10,12);f('#ff9a3a',wx+1,55,8,10);f('#ffd080',wx+1,55,8,2);f('#3a2414',wx+5,55,1,10);f('#3a2414',wx+1,60,8,1);}
  f('#5a5e6a',0,76,96,4);}));
 // a boca da mina antiga, selada com tábuas (48×40): o paredão de rocha com neve, a moldura de toras e o aviso de Brannar
 reg('minaSelada',box(48,40,f=>{for(let y=0;y<40;y++){const hw=Math.round(24-Math.max(0,8-y)*1.6);for(let i=24-hw;i<24+hw;i++)f((i*7+y*5)%13===0?'#44444e':i<12?'#8a8e9c':'#6a6e7a',i,y,1,1);}
  for(let i=4;i<44;i++)if((i*3)%7<3)f(NEVE,i,Math.round(Math.abs(i-24)*.4),1,2);
  f('#141418',14,14,20,26);f('#5a3a22',12,12,24,3);f('#5a3a22',12,12,3,28);f('#5a3a22',33,12,3,28);f('#7a4e2c',12,12,24,1);
  for(const y of[18,25,32])f('#8a5a30',13,y,22,3);f('#5a3a22',13,20,22,1);f('#c83a2a',21,26,6,4);f('#e8c048',23,27,2,2);}));
 // braseiro (16×20) e a bigorna grande da praça (24×18)
 reg('braseiro',box(16,20,f=>{f('#4a4a54',4,10,8,6);f('#6a6a74',4,10,8,1);f('#3a3a42',5,16,2,4);f('#3a3a42',9,16,2,4);f('#ff7a2a',5,6,6,4);f('#ffd060',6,4,4,4);f('#fff0a0',7,3,2,3);}));
 reg('bigornaG',box(24,18,f=>{f('#6a6e7a',2,2,20,4);f('#9aa4b0',2,2,20,1);f('#6a6e7a',0,3,3,2);f('#6a6e7a',8,6,8,5);f('#4a4e5a',5,11,14,3);f('#5a5e6a',3,14,18,4);f('#8a8e9c',3,14,18,1);}));}
WALLSTY.granito={h:'muroHG',v:'muroVG',t:'torreG'};

// ================== MONSTROS DAS MONTANHAS ==================
// Passo da Serra (40 a 43): cabra (rápida, chifrada), lobo das neves (bando) e gavião (voa, em bando). Picos e Geleira (43 a 50):
// urso branco (duro, patada em área) e espírito da nevasca (flutua, atira gelo de longe)
defMon('cabra',["............hHh...","...........hH.Hh..","...........H.wWWw.","..........wWWWkWW.","..........wWWWWWWn","..ww......wWWWbb..",".wWWWWWWWWWWWW.b..","wWWWWWWWWWWWWW....","wWWwWWWWWWWWgW....",".gWWWWWWWWWWg.....",".gWg.gWg..gWgWg...",".gWg.gW...gW.gW...",".dd..dd...dd..dd.."],{W:'#e8e4dc',w:'#ffffff',g:'#a8a49c',h:'#8a7458',H:'#b89a70',b:'#c8c0b0',n:'#3a3030',d:'#4a3a2a'});
defMon('loboN',["...............d.d..","..............dGdGd.","dd............gGGGG.",".dgd.....gggggGGeGGk","..dggggggGGGGGGGGGG.","...gGGGGGGGGGGggwwg.","...gggggggggggggg...","...dgggggggggggdg...","...dgg.dgg..dgg.dg..","...dg..dg...dg..dg..","...dd..dd...dd..dd.."],{g:'#d8e0ea',G:'#f6f8fc',d:'#8a96a8',e:'#6ad0ff',w:'#ffffff'});
defMon('ursoB',["...............ww.ww..","..............wWWwWWw.","..............WWWWWWW.","..wwwwwwwww...WWWkWWW.",".wWWWWWWWWWwwwWWWWWnn.","wWWWWWWWWWWWWWWWWWWnn.","WWWWWWWWWWWWWWWWWWWW..","WWWWWWWWWWWWWWWWWgg...","gWWWWWWWWWWWWWWWg.....",".gWWWgggWWWWWgWWg.....",".gWWg..gWWg..gWWg.....",".gWWg..gWWg..gWWg.....",".ddd...ddd...ddd......"],{W:'#f0f0f4',w:'#ffffff',g:'#b8c0cc',n:'#2a2a30',d:'#5a5a66'});
defMon('gaviao',["...........hHH..","..........hHHkY.","bb.......hHHHHY.","bBB.....hHHHH...",".bBBBBBHHHHHH...","..bBBBBBBHHHHh..","...bbBBBBBBHHh..",".....bbbBBBhh...","........tt......",".......YY.YY...."],{h:'#d8d8e0',H:'#f0f0f8',Y:'#e8b030',b:'#5a4a3a',B:'#8a7458',t:'#a8a8b0'});
defMon('nevasca',[".....wWWw.....","...wWWWWWWw...","..wWWWWWWWWw..",".wWWkWWWWkWWw.",".WWWbWWWWbWWW.",".WWWWWkkWWWWW.","..WWWWWWWWWWc.","..cWWWWWWWWWc.",".c.cWWWWWWc.c.","c...cWWWWc...c","...c.cWWc.c...","..c...cc...c..",".....c..c....."],{W:'#e0f4ff',w:'#ffffff',c:'#9ad8f0',b:'#6ab8e8'});
Object.assign(MDEF,{
 cabra:{n:'Cabra da Serra',hp:160,atk:30,def:10,spd:80,xp:58,r:8,aggro:100,cd:1.1},
 loboN:{n:'Lobo das Neves',hp:130,atk:28,def:8,spd:76,xp:50,r:8,aggro:110,cd:.9,pack:[3,4]},
 ursoB:{n:'Urso Branco',hp:320,atk:36,def:18,spd:40,xp:75,r:10,aggro:80,cd:1.6,slam:{every:6,r:34,mult:1.8,delay:.9}},
 gaviao:{n:'Gavião das Neves',hp:90,atk:26,def:5,spd:84,xp:46,r:7,aggro:130,cd:1,fly:1,pack:[2,3]},
 nevasca:{n:'Espírito da Nevasca',hp:150,atk:32,def:8,spd:44,xp:62,r:8,aggro:140,cd:1.8,hover:1,ranged:130,projC:'#bfefff'}});
for(const[k,n,c]of[['cabra','Chifre de Cabra','#b89a70'],['loboN','Pele de Lobo Branco','#e8ecf0'],['ursoB','Garra de Urso Branco','#e0e4ea'],['gaviao','Pena Nevada','#f0f0f8'],['nevasca','Essência Gelada','#9ad8f0']])
 LOOTM[k]={n,c,w:1,v:clamp(Math.round(MDEF[k].xp/3),2,15)};
Object.assign(MATSHP,{
 cabra:[[".....cCCd...","...cCCCCCd..","..cCd...dCd.",".cCd.....Cd.",".cd......Cd.",".cd.....cCd.",".cCd...cCd..","..dCCCCCd...","....dd......"]],
 loboN:[["..cC....Cd..",".cCCCCCCCCd.","cCCwCCCCCCCd","cCCCCCCCCCCd",".cCCCCCCCCd.","..cCCCCCCd..",".cCd....cCd.","cd........dd"]],
 ursoB:[["..cCCCCCCd..",".cCCwCCCCCd.","cCCCCCCCCCCd","cCCCCCCCCCCd",".dCCCCCCCCd.","..e.e.e.e...","..e.e.e.e...","...e.e.e.e.."],{e:'#4a4a52'}],
 gaviao:[["...........d","..........cd",".........cCd","........cCed","......cCCCd.",".....cCeCd..","....cCCCd...","...cCeCd....","..cCCdd.....",".ee.d.......","e..........."],{e:'#8a7458'}],
 nevasca:[[".....cd.....","....cCCd....","...cCwCCd...","..cCwCCCCd..","..cCCCeCCd..",".cCCCeeCCCd.","..dCCCeCCd..","...dCCCCd...","....dCCd....",".....dd....."],{e:'#ffffff'}]});
for(const k of['cabra','loboN','ursoB','gaviao','nevasca'])defMat(k);
Object.assign(CONS,{
 cabra:{n:'Leite da Serra',c:'#f4f4ec',p:{e:'#8a5a30'},e:{regen:.025,t:20},s:["...ee...","..cCCd..","..cwCd..",".cCwCCd.","cCCCCCCd","cCCCCCCd","cCCCCCCd",".dddddd."]},
 loboN:{n:'Dente Gélido',c:'#bfefff',e:{crit:15,t:120},s:["cCCCCCCd",".cCwCCd.",".cCCCCd.","..cCCd..","..cCCd..","...cd...","...cd...","....d..."]},
 ursoB:{n:'Gordura de Urso',c:'#f0e0b0',p:{e:'#8a5a30'},e:{hp:.25,t:180},s:[".eeeeee.","eeeeeeee",".cCCCCd.","cCwCCCCd","cCCCCCCd","cCCCCCCd","cCCCCCCd",".dddddd."]},
 gaviao:{n:'Pluma do Vento',c:'#d8e8ff',p:{e:'#8a7458'},e:{spd:30,dodge:.05,t:90},s:["......cd","....cCCd","...cCwd.","..cCCd..",".cCCd...",".cCd....","cCd.....","e.......","ee......"]},
 nevasca:{n:'Floco Eterno',c:'#a8e8ff',e:{shield:.25,t:20},s:["...c.c.c...","....cCc....",".c..cCc..c.","..cCcwcCc..","cCCwwwwwCCd","..cCcwcCd..",".c..cCc..d.","....cCd....","...d.d.d..."]}});
for(const id of['cabra','loboN','ursoB','gaviao','nevasca']){const C=CONS[id];def('con_'+id,olM(C.s),Object.assign({C:C.c,c:shadeHex(C.c,.45),d:shadeHex(C.c,-.35),w:'#ffffff'},C.p));}

// ================== A GENTE DE ALTAFORJA ==================
// ferreiros e mineiros: lã grossa, peles, aventais de couro e muita barba (os bonecos são montados pelo pessoa do 35)
pessoa('greta','gorro','saia',{G:'#c8501a',g:'#8a3010',W:'#f4f0e4',H:'#e8c048',T:'#6a4a3a',D:'#4a5a6a',s:'#f0c8a0'});
pessoa('ferraz','careca','calca',{H:'#6a6a72',T:'#5a4a3a',P:'#3a3a42',A:'#6a4224',R:'#8a8a94',M:'#9aa4b0',s:'#c88858'},{avental:1,barba:1,mao:MAO.martelo});
pessoa('tereza','longo','saia',{H:'#c8a050',T:'#8a3a2a',D:'#5a4a3a',A:'#f0e8d8',W:'#e8e0c8'},{avental:1,mao:MAO.caneca});
pessoa('agnes','cabelo','saia',{H:'#3a2a1a',T:'#4a5a7a',D:'#3a4a6a',V:'#c8501a'},{mao:MAO.livro});
pessoa('baldo','capuz','manto',{C:'#7a6a5a',T:'#5a4a3a',R:'#d8d8d8',s:'#d8a070',M:'#9aa4b0'},{barba:1,mao:MAO.picareta});
pessoa('tilo','gorro','calca',{G:'#2a5a3a',g:'#1c3e28',W:'#f4f0e4',H:'#8a5a2a',T:'#8a6a3a',P:'#4a3a2a'},{cinto:1,mao:[[8,12,'kOOk'],[9,12,'kOOOk'],[10,13,'kOOk'],[7,13,'kk']]});
pessoa('pedrinho','cabelo','calca',{H:'#a85a2a',T:'#6a8aa8',P:'#4a4a5a',A:'#8a5a30',M:'#9aa4b0'},{avental:1,mao:MAO.martelo});
pessoa('dora','gorro','calca',{G:'#e8c048',g:'#a8862a',W:'#ffe070',H:'#3a2a1a',T:'#7a5a3a',P:'#3a3a48',M:'#9aa4b0',s:'#c88858'},{cinto:1,mao:MAO.picareta});
pessoa('clotilde','capuz','manto',{C:'#8a3a1a',T:'#a84a1a',O:'#ffb040',s:'#e8b088'},{mao:MAO.cajado});
CIDP.altaforja={merc:['Mercadora Greta','greta','Poções quentes, cordas grossas e um preço justo pelo que você arrancar da montanha!'],
 smith:['Mestre Ferraz','ferraz','Em Altaforja o aço nasce da montanha. Até o +5 eu garanto com o meu nome. Depois disso... nem Brannar promete.'],
 bar:['Tereza','tereza','Senta perto do fogo! Tônico de ferreiro: quente por dentro, forte por fora.'],salao:['agnes','baldo','tilo']};
GENTE.push(
 {id:'agnes',n:'Agnes',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda de Altaforja! O mural fala do Passo, dos Picos e da Geleira.','Até 3 missões por vez, somando todas as Guildas. Juramento é juramento.',
  'Cada missão volta ao mural um tempo depois de entregue. A montanha sempre manda mais.','A Tereza, no balcão, tem tônico de ferreiro. Esquenta até osso congelado.','A mina antiga está selada desde antes de eu nascer. Os velhos não gostam que se fale dela.']},
 {id:'baldo',n:'Baldo',c:'#e8c080',at:[-5,-2],f:['Cavei esta montanha por trinta anos. Ela me cavou de volta: olhe estas mãos.','O Urso Branco bate o chão com as patas. Viu a neve tremer? Pule para longe.',
  'Espírito da Nevasca atira gelo de longe. Corra até ele, que de perto ele é fraco.','Lobo das Neves anda em bando. Nunca lute com as costas para o abismo.','Fecharam a mina porque cavamos fundo demais. Ouvimos uma coisa batendo do outro lado.']},
 {id:'tilo',n:'Tilo',c:'#d9a0ff',at:[-7,3],f:['Toco este tambor no ritmo dos martelos. A cidade inteira é a minha banda.','Brannar ouve juramento e canção de forja. Por isso canto alto.',
  'A Tereza paga a música com sopa quente. Aqui em cima, isso é fortuna.','O eco da montanha repete o refrão. Nunca precisei de coro.','Toda Guilda tem um bardo. O do Porto canta sereia. Aqui a gente canta martelo.']});

// ================== MAPAS ==================
// Passo da Serra: a estrada dos mineiros sobe do norte do Covil até Altaforja, entre morros de rocha e pinheiros nevados
MAPS.passo={n:'Passo da Serra',s:'Nível 40 a 43',theme:14,seed:1411,color:'#3a4a5a',road:1,plateau:.62,lv:[40,43],home:'covil',
 portals:{covil:[40,58],altaforja:[40,1]},count:26,chests:6,tier:4,mons:[['cabra',.4],['loboN',.75],['gaviao',1]]};
MAPS.covil.portals.passo=[40,1];
// Altaforja: praça de granito no meio, muralha de granito, casas de pedra com chaminé, a Grande Forja ao lado da praça e a mina selada
MAPS.altaforja={n:'Altaforja',s:'Zona segura • a cidade dos ferreiros',town:1,road:1,theme:14,seed:1401,color:'#2a2e3a',walls:[9,7,71,53],wallStyle:'granito',
 portals:{passo:[40,58],picos:[78,30],geleira:[40,1]},forja:[52,17],mina:[23,14],gen:altaforjaGen,
 houses:[[15,11,'forjaCasa1'],[30,11,'forjaCasa3'],[45,11,'forjaCasa2'],[62,11,'forjaCasa1'],[66,17,'forjaCasa3'],[14,21,'forjaCasa2'],[28,21,'forjaCasa1'],
  [14,38,'forjaCasa3'],[22,43,'forjaCasa1'],[30,49,'forjaCasa2'],[48,49,'forjaCasa3'],[56,43,'forjaCasa1'],[64,48,'forjaCasa2'],[66,38,'forjaCasa1'],[56,37,'forjaCasa3'],[24,35,'forjaCasa2'],
  [19,29,'forjaCasa1'],[22,25,'forjaCasa3'],[62,24,'forjaCasa2'],[61,35,'forjaCasa1'],[34,44,'forjaCasa3'],[48,43,'forjaCasa2']],
 deco:[[33,34,'bigornaG',1],[36,24,'braseiro'],[44,24,'braseiro'],[36,36,'braseiro'],[44,36,'braseiro'],[57,20,'caixotes'],[48,20,'barril'],[26,17,'barril']]};
function altaforjaGen(M){const tira=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);};
 // a Grande Forja: chão ocupado de 6×3 tiles, com o nome ao passar o mouse
 const[fx,fy]=M.forja;for(let y=fy-2;y<=fy;y++)for(let x=fx-3;x<=fx+2;x++){tira(x,y);solid[y*W+x]=1;}
 for(let y=fy+1;y<=fy+3;y++)for(let x=fx-4;x<=fx+3;x++)if(objRows[y].some(o=>o.tx===x&&/^tree/.test(o.spr))){tira(x,y);solid[y*W+x]=0;} // a frente da forja fica livre
 objRows[fy].push({tx:fx-3,ty:fy,spr:'grandeForja',px:fx*TILE,py:(fy+1)*TILE,label:'Grande Forja de Brannar'});
 const[mx,my]=M.mina;for(let y=my-1;y<=my;y++)for(let x=mx-1;x<=mx+1;x++){tira(x,y);solid[y*W+x]=1;}
 objRows[my].push({tx:mx-1,ty:my,spr:'minaSelada',px:(mx+.5)*TILE,py:(my+1)*TILE,label:'Mina Antiga (selada)'});}
Object.assign(MAPS,{
 picos:{n:'Picos Gelados',s:'Nível 43 a 46',theme:14,seed:1421,color:'#2e3e50',lv:[43,46],plateau:.58,home:'altaforja',portals:{altaforja:[1,30]},count:26,chests:6,tier:4,
  mons:[['ursoB',.3],['nevasca',.6],['cabra',.8],['loboN',1]]},
 geleira:{n:'Geleira Eterna',s:'Nível 46 a 50',theme:14,seed:1431,color:'#24344a',lv:[46,50],plateau:.6,home:'altaforja',portals:{altaforja:[40,58]},count:28,chests:7,tier:4,elite:.12,
  mons:[['nevasca',.35],['ursoB',.65],['gaviao',.85],['loboN',1]]}});
// os serviços (sem a casa da Elara, que fica só em Valdor): mercador na praça, Guilda com bar e salão, e a ferraria
guildHall('guildaAltaforja','altaforja','guilda6',1441);addBar(MAPS.guildaAltaforja);addSalao(MAPS.guildaAltaforja);
cityHouses('altaforja','Altaforja',1451,'M');
gentePorCidade();
tpReg('altaforja',{f:['passo','picos','geleira']});
// missões da Guilda de Altaforja
MISS.push({city:'altaforja',id:'cabras',t:'Chifradas no passo',map:'passo',mat:'cabra',n:10,lv:41,txt:'Cabras da Serra derrubam as carroças de minério no Passo da Serra. Traga 10 Chifres de Cabra.'},
 {city:'altaforja',id:'lobosNeve',t:'Uivos brancos',map:'passo',mat:'loboN',n:12,lv:42,txt:'Bandos de Lobos das Neves cercam quem sobe sozinho até Altaforja. Traga 12 Peles de Lobo Branco.'},
 {city:'altaforja',id:'gavioes',t:'Garras do céu',map:'passo',mat:'gaviao',n:10,lv:43,txt:'Gaviões das Neves atacam os mineiros na estrada. Traga 10 Penas Nevadas para os arqueiros da muralha.'},
 {city:'altaforja',id:'ursosB',t:'O dono da montanha',map:'picos',mat:'ursoB',n:6,lv:45,txt:'Ursos Brancos desceram dos Picos Gelados e rondam a muralha. Traga 6 Garras de Urso Branco.'},
 {city:'altaforja',id:'nevascas',t:'Vento que fala',map:'picos',mat:'nevasca',n:8,lv:46,txt:'Espíritos da Nevasca congelam a água dos poços. Traga 8 Essências Geladas para a forja derreter.'},
 {city:'altaforja',id:'geleira',t:'O frio sem fim',map:'geleira',mat:'nevasca',n:10,lv:48,txt:'Na Geleira Eterna os Espíritos da Nevasca ficam mais fortes a cada noite. Traga 10 Essências Geladas antes da próxima tempestade.'});

// ================== PEDIDOS DOS MORADORES (28) ==================
Object.assign(COLD,{cristalG:{maps:{passo:8},v:'Pegar'},brasaE:{maps:{geleira:3},v:'Pegar'}});
for(const[k,n,c,d]of[['cristalG','Cristal de Gelo','#a8e0f8','Cristal que nasce no gelo do Passo da Serra. Esfria o aço da forja sem rachar.'],
 ['brasaE','Brasa Eterna','#e8602a','Brasa que nunca apaga, perdida na Geleira Eterna. Dizem que caiu da forja do próprio Brannar.']])LOOTM[k]={n,c,w:1,v:0,q:1,d};
Object.assign(MATSHP,{
 cristalG:[["...c.......",".cCd..c....","cCwCd.Cd...","CCCCdcCCd..","dCCCcCwCCd.",".dCCCCCCCd.","..ddddddd.."]],
 brasaE:[["....f.f.....","...fef.f....","..fefeff....","..cCeeCd....",".cCeeeeCd...",".cCeeeCCd...","..dCCCCd....","...dddd....."],{e:'#fff0a0',f:'#ffd060'}]});
for(const k of['cristalG','brasaE'])defMat(k);
addPeds([
 {id:'pedrinho',city:'altaforja',map:'altaforja',at:[30,31],n:'Aprendiz Pedrinho',c:'#ffc080',lv:41,t:'Aço que não racha',itens:[['cristalG',6]],rew:{g:900,pots:{hp:6,mp:4}},
  pede:'O Mestre Ferraz disse que eu só faço uma espada quando souber temperar. Para temperar, preciso de Cristal de Gelo, que brilha no chão do Passo da Serra. Me traz 6? Por favor!',
  ok:'Agora eu tempero! A primeira espada que eu fizer vai ter o seu nome. Tome estas poções, roubei... quer dizer, peguei emprestadas da Greta.',
  f:['Bati o martelo mil vezes hoje. O Mestre disse que faltam mais mil.','Brannar gosta de quem trabalha. Eu gosto de quem traz cristal.','Um dia vou ter minha própria forja. Com chaminé e tudo!','Queimei a mão de novo. Faz parte, dizem.']},
 {id:'dora',city:'altaforja',map:'altaforja',at:[52,35],n:'Mineira Dora',c:'#ffe080',lv:45,t:'Roupa para o frio',itens:[['cabra',8],['loboN',6]],rew:{g:1300,item:['peito',2]},
  pede:'Lá em cima o frio corta como picareta. Preciso forrar os casacos da minha turma: chifre de cabra para os botões e pele de lobo branco para o forro. Traz 8 Chifres e 6 Peles?',
  ok:'Com isso a turma passa o inverno quentinha! Fique com esta armadura. É de mineiro de verdade: aguenta pedra, gelo e mau humor.',
  f:['Mineiro bom escuta a montanha antes de bater nela.','A mina velha? Fechada. E é melhor que continue.','Uma picareta bem afiada vale mais que espada. Às vezes.','Quando a lamparina treme, saia da galeria. Sempre.']},
 {id:'clotilde',city:'altaforja',map:'altaforja',at:[56,23],n:'Irmã Clotilde',c:'#ffb070',lv:49,t:'O fogo de Brannar',itens:[['brasaE',3],['nevasca',6]],rew:{g:1800,item:['arma',3]},
  pede:'O fogo da Grande Forja está fraco, e um juramento de Brannar só vale diante dele. Três Brasas Eternas caíram na Geleira Eterna; e o gelo dos espíritos da nevasca precisa voltar ao fogo. Traz as 3 Brasas e 6 Essências Geladas?',
  ok:'Sinta: a forja respira de novo! Brannar viu o que você fez. Esta arma foi forjada no fogo dele e espera um juramento à altura.',
  f:['Martelo sobre bigorna: é assim que Brannar escreve.','Todo ferreiro daqui jura diante da Grande Forja antes do primeiro trabalho.','O fogo não pergunta quem você é. Pergunta o que você faz.','Dizem que a mina selada guarda uma forja mais antiga que a cidade. Eu rezo para que seja só lenda.']}]);
