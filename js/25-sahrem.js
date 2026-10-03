// Ecos de Valdoria — Sahrem, a cidade do deserto (etapa 1): a Orla do Deserto (grama virando areia) e a cidade das caravanas,
// com a grande pirâmide no meio. Ideias e decisões do dono em 03/10/2026 (CLAUDE.md, item 17 do roteiro).
'use strict';
// Sahrem é uma cidade aberta de caravanas e mercadores (padroeira: Fenna): chão de arenito, casas de barro de teto reto, tendas de
// feira, um oásis com palmeiras no lugar da fonte e, ao norte da praça, a pirâmide do Rei Sethkar, com a porta selada (a masmorra
// embaixo dela é a etapa 3). Monstros da Orla ainda são os das Encostas e das Ruínas (os do deserto são a etapa 2).

// ================== TEMA 11: DESERTO ==================
GP[11]=['#d8b878','#d2b070','#b89458','#e6cc90'];PC[11]=['#b8925a','#a07e4a','#cca46a'];WC[11]=['#2f9ab8','#4ab0c8','#bff0f4'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[11]=o[11].map(hexRGB);
PLZT[11]=['#d4b67c','#b0905c','#e4caa0'].map(hexRGB);MINIC.obj[11]='#6a8a3a';
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
reg('guilda4',guildaGrande(3));
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
// A grande pirâmide (176×124): dez degraus de arenito, luz da esquerda, ponta de ouro e a porta selada, virada para o sul, com o selo
// do Rei Sethkar. Ocupa 9×4 tiles ao norte da praça
function genPiramide(){const W_=176,H_=124,c=cnv(W_,H_),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);},cx=88;
 for(let k=0;k<10;k++){const w=14+k*18,y0=13+k*11,xl=cx-w/2;
  for(let y=y0;y<y0+11;y++)for(let i=0;i<w;i++){const X=xl+i,u=i/w,top=y-y0<2,joint=(y-y0)===6||((X+(k%2)*4)%8===0&&y-y0>2);
   f(top?(u<.6?'#f4e2b0':'#dcc48c'):joint?'#b8985e':u<.25?'#ecd49c':u>.72?'#bc9c66':'#d8bc84',X,y,1,1);}}
 for(let y=0;y<14;y++){const hw=Math.round(y*.55)+1;f('#e8c048',cx-hw,y,hw*2,1);f('#fff0a0',cx-hw,y,1,1);f('#b8902a',cx+hw-1,y,1,1);}
 f('#9a7a4e',68,82,40,7);f('#c8a870',68,82,40,1);f(K,70,89,36,35);f('#2a1c12',71,90,34,34);
 f('#b09060',74,91,28,33);f('#9a7a50',74,91,1,33);f('#c8a874',75,91,26,1);for(let y=98;y<122;y+=6)f('#9a7a50',74,y,28,1);
 f('#c8902a',82,99,12,12);f('#e8c048',83,100,10,10);f('#7a4a1a',86,103,4,4);f('#4a2a10',87,104,2,2); // o selo
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
  'A porta da pirâmide está selada desde antes de Sahrem existir. Melhor assim.','No deserto, a água é ouro. Leve poções de vida, aventureiro.','Esta cicatriz? Um escorpião do tamanho de uma carroça. Ele saiu pior.']},
 {id:'zuri',n:'Zuri',c:'#d9a0ff',at:[-7,3],f:['Quer uma história? A do rei que quis viver para sempre é a minha preferida... e a mais triste.','Fenna sorri para as caravanas. Por isso Sahrem nunca passou fome.',
  'Meu pandeiro já tocou em todas as cidades. A de Valdor tem o melhor público.','A Samira paga as histórias com chá. Eu conto devagar para ganhar mais um copo.','Contam que Kharzen prometeu ao Rei Sethkar um reino eterno. Prometeu e cumpriu, do pior jeito.']});

// ================== MAPAS ==================
// Orla do Deserto: logo abaixo da Encosta 05; a grama vai virando areia da metade para baixo (blend, no 01). A estrada é o caminho das caravanas
MAPS.orla={n:'Orla do Deserto',s:'Nível 19 a 23',theme:11,blend:[5,11,16,36],seed:1101,color:'#5a4a2a',road:1,lv:[19,23],home:'encosta5',
 portals:{encosta5:[40,1],sahrem:[24,58]},count:24,chests:6,tier:3,mons:[['pegrande',.35],['raposa',.7],['golem',1]]};
MAPS.encosta5.portals.orla=[40,58];
// Sahrem: cidade aberta, sem muralha. A pirâmide fica ao norte da praça (a saída norte é desviada para oeste, para a estrada não passar por ela)
MAPS.sahrem={n:'Cidade de Sahrem',s:'Zona segura • a cidade das caravanas',town:1,road:1,theme:11,seed:1121,color:'#6a4a22',oasis:1,fountain:[TC.x-12,TC.y+6],
 houses:[[29,22,'deserto2'],[52,21,'deserto3'],[29,38,'deserto3'],[51,38,'deserto2'],[33,43,'deserto1'],[46,43,'deserto1'],[25,27,'deserto1'],[55,27,'deserto2'],
  [24,33,'deserto2'],[56,33,'deserto1'],[37,47,'deserto3'],[43,47,'deserto2'],[26,42,'deserto1'],[54,43,'deserto3']],
 deco:[[TC.x-5,TC.y-9,'obelisco'],[TC.x+5,TC.y-9,'obelisco'],[TC.x-6,TC.y+4,'tenda1',1],[TC.x+1,TC.y+6,'tenda2',1],[TC.x-3,TC.y+8,'tenda2',1],
  ...[[31,25],[49,25],[32,35],[48,35],[35,40],[45,40],[28,30],[52,30]].map(([x,y],k)=>[x,y,k%2?'tree11_0':'palma2'])],portals:{orla:[24,1]},
 piramide:[TC.x,TC.y-9],gen:sahremGen};
// oásis (água redonda com palmeiras em volta) no lugar da fonte, e a pirâmide: chão ocupado de 7×3 tiles, com o nome ao passar o mouse
function sahremGen(M){const[ox,oy]=M.fountain,tira=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);};
 for(let y=oy-6;y<=oy+6;y++)for(let x=ox-7;x<=ox+7;x++){const d=hyp(x-ox,(y-oy)*1.25),i=y*W+x;if(d<3.3){tira(x,y);ground[i]=G.WATER;solid[i]=1;}
  else if(d<5.2&&ground[i]===G.GRASS&&!solid[i]&&((x*7+y*13)%5===0)){solid[i]=1;addObj(x,y,(x+y)%2?'tree11_0':'palma2');}}
 const[px,py]=M.piramide;for(let y=py-3;y<=py;y++)for(let x=px-4;x<=px+4;x++){tira(x,y);solid[y*W+x]=1;}
 objRows[py].push({tx:px-4,ty:py,spr:'piramide',px:(px+.5)*TILE,py:(py+1)*TILE,label:'Grande Pirâmide (selada)'});}
// os serviços (sem a casa da Elara, que fica só em Valdor): mercador na praça, Guilda com bar e salão, e a ferraria
guildHall('guildaSahrem','sahrem','guilda4',1131);addBar(MAPS.guildaSahrem);addSalao(MAPS.guildaSahrem);
cityHouses('sahrem','Sahrem',1141,'D');
gentePorCidade();
// missões da Guilda de Sahrem (região: Orla do Deserto; as das dunas vêm com a etapa 2)
MISS.push({city:'sahrem',id:'peGrandeOrla',t:'Pegadas na areia',map:'orla',mat:'pegrande',n:8,lv:20,txt:'Pés-Grandes desceram das Encostas e assustam as caravanas na Orla do Deserto. Traga 8 Tufos de Pelo Grosso.'},
 {city:'sahrem',id:'raposasOrla',t:'Raposas no caminho',map:'orla',mat:'raposa',n:10,lv:21,txt:'Raposas espirituais rondam a estrada das caravanas e espantam os camelos. Traga 10 Caudas de Raposa.'},
 {city:'sahrem',id:'golemOrla',t:'Pedras que andam',map:'orla',mat:'golem',n:6,lv:22,txt:'Golens de pedra rolaram até a Orla e bloqueiam a estrada. Traga 6 Núcleos de Pedra.'});
