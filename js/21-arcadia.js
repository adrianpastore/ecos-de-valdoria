// Ecos de Valdoria — Arcádia, a cidade dos estudiosos: redonda, cercada por um fosso, com pontes para os quatro lados.
// No centro fica a Torre (etapa 2), onde os Magos fazem a prova e a promoção (etapa 3). Ao sul, o Planalto das Runas a liga a Valdor.
'use strict';
// ================== SPRITES ==================
// casa de estudioso: pedra clara, telhado azul-noite e uma torrezinha de ponta cônica com estrela prateada (32×40; a porta fica embaixo)
function genArcHouse(roof,roofD){const c=cnv(32,40),x=c.getContext('2d'),f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);};
 for(let y=22;y<39;y++)for(let i=4;i<28;i++)f((y-22)%4===3||(i+((y-22)>>2)%2*3)%6===0?'#b0aa9c':'#dcd6c8',i,y,1,1);
 f('#eee8da',4,22,1,17);f('#a09a8c',27,22,1,17);f('#8a8478',4,37,24,2);
 f(K,12,29,8,10);f('#3e4e7e',13,30,6,9);f('#2e3a62',15,30,1,9);f('#c8d8f0',17,34,1,1);
 for(const wx of[6,22]){f(K,wx-1,26,6,7);f('#8fd0ff',wx,27,4,5);f('#d8f0ff',wx,27,4,1);f('#5a6a8a',wx+1,27,1,5);}
 for(let y=0;y<15;y++){const hw=Math.min(15,3+y);f(y%3===0?roofD:roof,16-hw,y+8,hw*2,1);if(y%3===1)for(let i=16-hw+1;i<16+hw;i+=4)f(roofD,i,y+8,1,1);}
 f('#c8d4ec',1,22,30,1);                                                     // beirada prateada
 for(let y=10;y<24;y++)for(let i=22;i<28;i++)f(y%3===0?'#b0aa9c':'#dcd6c8',i,y,1,1);f('#eee8da',22,10,1,14);f(K,24,14,2,4);f('#8fd0ff',24,15,2,2);
 for(let y=0;y<8;y++){const hw=Math.round(y*.45)+1;f(y%2?roof:roofD,25-hw,y+2,hw*2,1);}f('#e8f0ff',24,0,2,2);f('#ffffff',24,0,1,1);
 return outlineK(c);}
reg('arcCasa1',genArcHouse('#2a3a6a','#1c2850'));reg('arcCasa2',genArcHouse('#3a4a7a','#26325a'));
reg('casaElaraA',signHouse('#2a5a6a','#1c4050','#5a3a7a',SYM_ESTRELA,genArcHouse));reg('ferrariaA',signHouse('#3a4a7a','#26325a','#8a5a30',SYM_BIGORNA,genArcHouse));
reg('guilda3',guildaGrande(2));
// pedra rúnica do Planalto: pedra alta com uma runa azul acesa
{const c=cnv(16,24),x=c.getContext('2d'),f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);};
 f('#8a8a92',4,4,8,18);f('#8a8a92',5,2,6,2);f('#8a8a92',6,1,4,1);f('#a8a8b0',4,4,2,18);f('#a8a8b0',5,2,1,2);f('#6a6a74',10,4,2,18);f('#74747e',5,12,5,1);
 f('#6ad8ff',7,7,2,1);f('#6ad8ff',7,7,1,6);f('#6ad8ff',8,10,2,1);f('#6ad8ff',9,10,1,4);f('#6ad8ff',7,15,3,1);f('#bff4ff',7,7,1,1);
 f('#4a8a42',3,21,10,2);f('#6aba5a',4,21,2,1);f('#6aba5a',10,21,1,1);reg('runa',outlineK(c));}

// ================== FOSSO E PONTES ==================
// Chamado pelo genWorld (01) em mapas com moat:1, depois das casas. O círculo é centrado no meio do tile central:
// dentro (d<14) a cidade, com ruas de pedra; de 14 a 15,5 o cais de pedra; de 15,5 a 18 o fosso; fora, os campos.
// As pontes são as quatro ruas retas (norte, sul, leste, oeste) e qualquer estrada que cruze a água.
const MOAT_IN=15.5,MOAT_OUT=18,QUAY=14;let BRIDGES=[];
function buildMoat(M,road){const cx=TC.x+.5,cy=TC.y+.5,axis=(x,y)=>Math.abs(x-TC.x)<=1||Math.abs(y-TC.y)<=1;BRIDGES=[];
 const clearTrees=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X&&/^(tree|rock)/.test(r[k].spr)){r.splice(k,1);solid[Y*W+X]=0;}};
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,d=hyp(x+.5-cx,y+.5-cy);
  if(d<MOAT_OUT+5)clearTrees(x,y);
  if(d>=MOAT_IN&&d<MOAT_OUT){if(axis(x,y)||road[i]){ground[i]=G.PATH;solid[i]=0;BRIDGES.push(i);}else{ground[i]=G.WATER;solid[i]=1;}}
  else if(d>=QUAY&&d<MOAT_IN)ground[i]=G.PLAZA;                                   // cais de pedra em volta da cidade
  else if(axis(x,y)&&d>=6&&d<MOAT_OUT+5&&!solid[i])ground[i]=G.PATH;             // as quatro ruas retas até os campos
  else if(d>=10.1&&d<11.9&&!solid[i]&&ground[i]===G.GRASS)ground[i]=G.PATH;       // rua em anel
  else if(d>=MOAT_OUT+2.5&&ground[i]===G.GRASS&&!road[i]&&!axis(x,y)&&((x*73856093^y*19349663)>>>0)%100<9){solid[i]=1;addObj(x,y,`tree0_${(x+y)%4}`);} // bosque em volta
  if(d<QUAY&&ground[i]===G.PATH)ground[i]=G.PLAZA;}}                                  // dentro do fosso, as ruas são de pedra
function paintBridges(mx){const f=(c,a,b,w,h)=>{mx.fillStyle=c;mx.fillRect(a,b,w,h);};
 for(const i of BRIDGES){const x=i%W,y=(i/W)|0,X=x*TILE,Y=y*TILE,wa=j=>ground[j]===G.WATER,wl=wa(i-1),wr=wa(i+1),wu=wa(i-W),wd=wa(i+W),vert=Math.abs(x-TC.x)<=1||(wl||wr)&&!(wu||wd);
  f('#b8b2a4',X,Y,16,16);for(let k=0;k<16;k+=4){if(vert){f('#8a8478',X,Y+k,16,1);f('#d4cec0',X,Y+k+1,16,1);}else{f('#8a8478',X+k,Y,1,16);f('#d4cec0',X+k+1,Y,1,16);}}
  if(vert){if(wl){f('#6a655c',X,Y,3,16);f('#dcd6c8',X,Y,3,1);}if(wr){f('#6a655c',X+13,Y,3,16);f('#dcd6c8',X+13,Y,3,1);}}
  else{if(wu){f('#6a655c',X,Y,16,3);f('#dcd6c8',X,Y,16,1);}if(wd){f('#6a655c',X,Y+13,16,3);f('#dcd6c8',X,Y+13,16,1);}}}}

// ================== MAPAS ==================
// Arcádia: o centro (a praça) fica livre para a Torre (etapa 2); a fonte vai para baixo, à esquerda da rua sul.
MAPS.arcadia={n:'Cidade de Arcádia',s:'Zona segura • a cidade dos estudiosos',town:1,road:1,theme:0,seed:901,color:'#1e2a4a',lanterns:1,moat:1,fountain:[TC.x-4,TC.y+3],
 houses:[[TC.x-7,TC.y+4,'arcCasa1'],[TC.x+6,TC.y+4,'arcCasa2'],[TC.x-7,TC.y-3,'arcCasa1'],[TC.x+6,TC.y-3,'arcCasa2'],[30,22,'arcCasa2'],[49,22,'arcCasa1'],
  [30,39,'arcCasa2'],[49,39,'arcCasa1'],[35,18,'arcCasa1'],[44,18,'arcCasa2'],[35,43,'arcCasa2'],[44,43,'arcCasa1']],portals:{planalto:[40,58]}};
// Planalto das Runas: campo de nível 5 a 10 entre Valdor e Arcádia, com pedras rúnicas e o caminho dos peregrinos (estrada)
MAPS.planalto={n:'Planalto das Runas',s:'Nível 5 a 10',road:1,theme:0,seed:921,color:'#2a4a3a',plateau:.64,lv:[5,10],home:'valdor',portals:{valdor:[40,58],arcadia:[40,1]},
 count:24,chests:6,tier:1,mons:[['lobo',.4],['verme',.7],['esporov',1]],deco:[]};
{const rg=mulberry32(4321),rr=(a,b)=>a+Math.floor(rg()*(b-a+1));
 for(let k=0,t=0;k<14&&t<400;t++){const x=rr(4,75),y=rr(4,55);if(Math.abs(x-TC.x)<5||MAPS.planalto.deco.some(d=>hyp(d[0]-x,d[1]-y)<7))continue;MAPS.planalto.deco.push([x,y,'runa']);k++;}}
MAPS.valdor.portals.planalto=[40,1]; // saída norte de Valdor: a muralha abre um portão com torres sozinha
// os 4 serviços de toda cidade principal: Bento (praça), Guilda, casa da Elara e ferreiro, no estilo de Arcádia
guildHall('guildaArcadia','arcadia','guilda3',1061);addBar(MAPS.guildaArcadia);addSalao(MAPS.guildaArcadia); // bar e gente do salão (20)
cityHouses('arcadia','Arcadia',1071,'A');
// missões da Guilda de Arcádia (região: Planalto das Runas)
MISS.push({city:'arcadia',id:'lobosRunas',t:'Uivos entre as runas',map:'planalto',mat:'lobo',n:8,lv:6,txt:'Lobos rondam as pedras rúnicas do Planalto e assustam os estudiosos que vão copiar as inscrições. Traga 8 Presas de Lobo.'},
 {city:'arcadia',id:'vermesCaminho',t:'Vermes no caminho',map:'planalto',mat:'verme',n:10,lv:7,txt:'Vermes cavaram túneis sob o caminho dos peregrinos, e as carroças de livros vivem atolando. Traga 10 Cascas de Verme.'},
 {city:'arcadia',id:'poAlquimia',t:'Pó para a alquimia',map:'planalto',mat:'esporov',n:12,lv:8,txt:'Os alquimistas de Arcádia precisam de Pó Venenoso para um antídoto novo (juram que é para o bem). Traga 12.'});
