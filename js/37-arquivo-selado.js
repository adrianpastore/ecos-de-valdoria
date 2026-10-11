// Ecos de Valdoria — O Arquivo Selado: a masmorra sob a Torre dos Magos, com o Mestre Ozren, o Faminto, no fundo (etapa 5 do plano de 08/10/2026)
'use strict';
// Embaixo da Torre de Arcádia ficam os arquivos antigos dos magos e, no fundo, a prisão que eles ergueram a Torre para guardar.
// Lá está o Mestre Ozren, primeiro aprendiz de Astrael e antigo mestre da Selene: ouviu os ecos de Vorhan, se corrompeu e virou
// um ser que devora magia. A Selene só consegue mantê-lo trancado. A missão dela abre no nível de Base 20, para todas as classes
// (P.ped.selo: 1 aceita, 2 Ozren derrotado, 3 recompensa recebida), e só então a escada do salão da Torre se abre.
// Três andares escuros de salões redondos e corredores retos (arquivoMask), chão de lajes azuladas com runas apagadas (tema 15, pintado no 01).

// ================== TEMA 15: O ARQUIVO ==================
GP[15]=['#3a4258','#353c50','#262c3c','#4a5470'];PC[15]=['#2a3a6a','#24325c','#3a4a8a'];WC[15]=WC[10].slice();
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[15]=o[15].map(hexRGB);
CLFT[15]=['#3a3f52','#2a2e3e','#1a1d28','#5a6078','#4a5068','#0e0f16','#09090f'].map(hexRGB);MINIC.obj[15]='#8a9ab8';
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // pilha de livros caídos com uma vela
 reg('livros',outlineK(box(16,14,f=>{f('#6a2a3a',1,9,14,4);f('#8a3a4a',1,9,14,1);f('#e8dcc0',2,12,12,1);f('#2a3a6a',2,6,11,3);f('#3a4a8a',2,6,11,1);f('#e8dcc0',3,8,9,1);
  f('#4a6a3a',3,3,8,3);f('#5a8a4a',3,3,8,1);f('#e8dcc0',4,5,6,1);f('#f0ecd8',12,1,2,5);f('#ffd060',12,0,2,1);f('#c8a040',4,10,2,1);f('#c8a040',10,7,1,1);})));
 // coluna de pedra azulada com uma runa acesa no meio (16×34)
 reg('colunaR',outlineK(box(16,34,f=>{f('#5a6078',1,0,14,4);f('#7a8098',1,0,14,1);f('#3a3f52',1,3,14,1);f('#4a5068',3,4,10,25);f('#6a7088',3,4,2,25);f('#2a2e3e',11,4,2,25);
  f('#6ad8ff',7,10,2,10);f('#6ad8ff',5,13,6,2);f('#d8f8ff',7,13,2,2);f('#4a8ab8',6,18,1,2);f('#4a8ab8',9,18,1,2);
  f('#5a6078',1,29,14,5);f('#7a8098',1,29,14,1);f('#3a3f52',1,33,14,1);})));}

// ================== OS MONSTROS DO ARQUIVO ==================
// Grimório Errante (livro que voa e atira páginas), Fagulha Arcana (bando de faíscas), Sentinela Rúnica (guarda de pedra, golpe em área),
// Aprendiz Esvaziado (aluno de Ozren sem alma, orbes roxos que tiram mana) e Eco Faminto (sombra com o círculo vazio de Vorhan, tira mana ao bater)
defMon('grimorio',["..pp........pp..",".pWWp......pWWp.","pWWWWpp..ppWWWWp","pWlWWWWppWWWWlWp","pWWlWWWWWWWWlWWp","pWWWWlWWWWlWWWWp",".BBWWWWlWWWWWBB.","..BBBWWWlWWBBB..","....BBBBBBBB....",".....BeBBeB.....","......BBBB......"],
 {p:'#b8a888',W:'#f0e8d0',l:'#5a4a6a',B:'#6a2a3a',e:'#ffd040'});
defMon('fagulha',["....a.....",".a..A..a..","..AAAAA...",".AAwwwAA..","aAwwWwwAa.",".AAwwwAA..","..AAAAA...",".a..A..a..","....a....."],{a:'#6ad8ff',A:'#3a8ad8',w:'#d8f8ff',W:'#ffffff'});
defMon('sentinelaR',["....GGGGGG......","...GgggggGG.....","...GgrgrgGG.....","...GGGGGGGG.....",".GGGGGGGGGGGG...","GgGGGggrGGGGgG..","GgGGggrrrGGGgG..","GgGGGggrGGGGgG..","GGG.GGGGGGG.GGG.","GG..GGGGGGG..GG.","....GGG.GGG.....","....GGG.GGG.....","...GGGG.GGGG...."],
 {G:'#6a7080',g:'#9aa0b4',r:'#6ad8ff'});
defMon('aprendiz',[".....nnnn.......","....nNNNNn......","...nNkkkkNn.....","...nNkwkwNn.....","...nNkkkkNn.....","....nNNNNn......","...nNNNNNNn.....","..nNNpNNpNNn....","..sNNNNNNNNs.v..","..nNNNNNNNNnvVv.","..nNNNNNNNNn.v..","..nNNNNNNNNn....",".nNNNNNNNNNNn...",".nnnnnnnnnnnn..."],
 {N:'#5a6a8a',n:'#3a4a6a',w:'#e0e8ff',s:'#a8a4b8',p:'#c8d4ec',v:'#8a6aff',V:'#e0d0ff'});
defMon('ecoF',[".....dddddd.....","...ddDDDDDDdd...","..dDDDDDDDDDDd..",".dDDwDDDDDDwDDd.",".dDDDDrrrrDDDDd.","dDDDDrVVVVrDDDDd","dDDDDrVVVVrDDDDd",".dDDDDrrrrDDDDd.","..dDDDDDDDDDDd..","...dDDdDDdDDd...","....dD.dD.dD....",".....d..d..d...."],
 {D:'#3a2a5a',d:'#1e1430',w:'#ffffff',r:'#8a4ad8',V:'#06040a'});
// mpdr: parte da mana máxima que o golpe tira (onMonHit, 09)
Object.assign(MDEF,{
 grimorio:{n:'Grimório Errante',hp:70,atk:15,def:4,spd:46,xp:30,r:6,aggro:130,cd:1.6,hover:1,ranged:110,projC:'#f0e8d0'},
 fagulha:{n:'Fagulha Arcana',hp:34,atk:11,def:2,spd:86,xp:16,r:5,aggro:110,cd:.8,pack:[3,4],hover:1},
 sentinelaR:{n:'Sentinela Rúnica',hp:200,atk:21,def:11,spd:26,xp:40,r:8,aggro:80,cd:1.7,slam:{every:6,r:30,mult:1.6,delay:.9}},
 aprendiz:{n:'Aprendiz Esvaziado',hp:90,atk:18,def:5,spd:38,xp:34,r:7,aggro:130,cd:1.8,ranged:120,projC:'#8a6aff',mpdr:.04},
 ecoF:{n:'Eco Faminto',hp:120,atk:20,def:6,spd:52,xp:38,r:7,aggro:110,cd:1.3,hover:1,mpdr:.06}});
for(const[k,n,c]of[['grimorio','Página Arrancada','#f0e8d0'],['fagulha','Faísca Presa','#6ad8ff'],['sentinelaR','Núcleo Rúnico','#7a8098'],['aprendiz','Capuz Desbotado','#5a6a8a'],['ecoF','Fiapo de Sombra','#5a3a8a']])
 LOOTM[k]={n,c,w:1,v:clamp(Math.round(MDEF[k].xp/3),2,15)};
Object.assign(MATSHP,{
 grimorio:[["cCCCCCCCd...","CeeeeCCCCd..","CCCCCCCCCd..","CeeeCeeCCd..","CCCCCCCCCCd.","CeeCeeeeCCd.","CCCCCCCCCCd.","CeeeeCeCCd..","CCCCCCCCd...","ddddddddd..."],{e:'#5a4a6a'}],
 fagulha:[["....w.....","...cCd....","..cCwCd...",".cCwwwCd..","cCwwwwwCd.",".cCwwwCd..","..cCwCd...","...cCd....","....d....."]],
 sentinelaR:[["...cCCCd....","..cCCCCCCd..",".cCCCeCCCCd.","cCCCeeeCCCd.","cCCCCeCCCCCd","cCCeCeCeCCCd",".cCCCeCCCCd.","..dCCCCCCd..","...ddddd...."],{e:'#6ad8ff'}],
 aprendiz:[["....cCCd....","...cCCCCd...","..cCCCCCCd..","..CCdddCCd..",".cCd...dCCd.",".CCd....CCd.","cCCe....CCCd","CCCe....eCCd","dddd....dddd"],{e:'#c8d4ec'}],
 ecoF:[["......c.....","....ccCc....","...cCCCCd...","..cCCeeCCd..",".cCCeffeCd..","..cCCeeCCd..","...dCCCCd...","....dCCd....","...d.dd.....","..d........."],{e:'#8a4ad8',f:'#06040a'}]});
for(const k of['grimorio','fagulha','sentinelaR','aprendiz','ecoF'])defMat(k);
// os consumíveis deles (sistema do 32)
Object.assign(CONS,{
 grimorio:{n:'Página de Feitiço',c:'#f0e8d0',p:{e:'#8a4ad8'},e:{atk:.15,t:120},s:["cCCCCCCCd.","CeCCeeCCCd","CCCCCCCCCd","CCeeeeCCCd","CCCeeCCCCd","CeCCCCeCCd","CCCCCCCCCd","dddddddddd"]},
 fagulha:{n:'Fagulha Engarrafada',c:'#6ad8ff',p:{e:'#c8d4ec',f:'#8a6a4a'},e:{mana:.35},s:["...ff...","...ee...","..cCCd..",".cCwwCd.","cCwwwwCd","cCCwwCCd",".cCCCCd.","..dddd.."]},
 sentinelaR:{n:'Runa de Proteção',c:'#7a8098',p:{e:'#6ad8ff'},e:{shield:.2,t:30},s:["..cCCCd...",".cCCCCCd..","cCCCeCCCd.","cCCeeeCCd.","cCCCeCCCd.","cCCeCeCCd.",".cCCCCCd..","..ddddd..."]},
 aprendiz:{n:'Anotações do Aprendiz',c:'#d8d0b8',p:{e:'#3a4a6a'},e:{crit:8,t:120},s:["cCCCCCCCd.","CeeCCeeeCd","CCCCCCCCCd","CeeeCeeCCd","CCCCCCCCCd","CeCeeeCCCd","CCCCCCCCCd","dddddddddd"]},
 ecoF:{n:'Véu do Eco',c:'#5a3a8a',p:{e:'#c8a0ff'},e:{dodge:.12,t:90},s:["..cCCCd...",".cCCCCCd..","cCCeCCCCd.","cCCCCeCCd.","cCeCCCCCd.",".CCCeCCd..",".dCCCCCd..","..d.d.d..."]}});
for(const id of['grimorio','fagulha','sentinelaR','aprendiz','ecoF']){const C=CONS[id];def('con_'+id,olM(C.s),Object.assign({C:C.c,c:shadeHex(C.c,.45),d:shadeHex(C.c,-.35),w:'#ffffff'},C.p));}

// ================== OS ANDARES ==================
// salões redondos (raio 3,5 a 6,5) ligados por corredores retos de 3 tiles em L (árvore mínima + 2 atalhos), e um salãozinho em cada escada
function arquivoMask(M,rng){const C=new Uint8Array(W*H),n=a=>Math.floor(rng()*a);
 const box=(x0,y0,x1,y1)=>{for(let y=Math.max(2,Math.min(y0,y1));y<=Math.min(H-3,Math.max(y0,y1));y++)for(let x=Math.max(2,Math.min(x0,x1));x<=Math.min(W-3,Math.max(x0,x1));x++)C[y*W+x]=1;};
 const disc=o=>{const k=Math.ceil(o.r);for(let j=-k;j<=k;j++)for(let i=-k;i<=k;i++)if(i*i+j*j<=o.r*o.r+.5){const X=o.x+i,Y=o.y+j;if(X>=2&&Y>=2&&X<W-2&&Y<H-2)C[Y*W+X]=1;}};
 const hall=(a,b)=>{if(rng()<.5){box(a.x,a.y-1,b.x,a.y+1);box(b.x-1,a.y,b.x+1,b.y);}else{box(a.x-1,a.y,a.x+1,b.y);box(a.x,b.y-1,b.x,b.y+1);}};
 const rooms=[];for(let k=0;k<400&&rooms.length<10;k++){const r=3.5+rng()*3,x=Math.round(5+r+n(W-10-2*r)),y=Math.round(5+r+n(H-10-2*r));
  if(rooms.some(o=>hyp(o.x-x,o.y-y)<o.r+r+5))continue;rooms.push({x,y,r});}
 for(const p of Object.values(M.portals))rooms.push({x:clamp(Math.round(p[0]),5,W-6),y:clamp(Math.round(p[1]),4,H-5),r:2.5});
 for(const o of rooms)disc(o);
 const inT=[rooms[0]],out=rooms.slice(1);
 while(out.length){let best=null;for(const a of inT)for(const b of out){const d=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);if(!best||d<best.d)best={a,b,d};}
  hall(best.a,best.b);inT.push(best.b);out.splice(out.indexOf(best.b),1);}
 for(let k=0;k<2;k++)hall(rooms[n(rooms.length)],rooms[n(rooms.length)]);
 return C;}
const ARQ={cave:1,dark:1,mask:arquivoMask,theme:15};
Object.assign(MAPS,{
 arquivo1:{...ARQ,n:'Arquivo Selado • Biblioteca Afundada',s:'Nível 20 a 23 • escuridão',caveObj:['estante','livros'],seed:1301,color:'#141826',lv:[20,23],home:'torreArcadia',
  portals:{torreArcadia:[40,6],arquivo2:[72,52]},count:24,chests:5,tier:3,mons:[['grimorio',.4],['fagulha',.75],['aprendiz',1]]},
 arquivo2:{...ARQ,n:'Arquivo Selado • Salões do Eco',s:'Nível 23 a 26 • escuridão',caveObj:['colunaR','livros'],seed:1302,color:'#121420',lv:[23,26],home:'arquivo1',
  portals:{arquivo1:[72,52],arquivo3:[8,8]},count:24,chests:5,tier:3,mons:[['aprendiz',.3],['ecoF',.6],['sentinelaR',.85],['grimorio',1]]},
 arquivo3:{...ARQ,n:'Arquivo Selado • Prisão do Selo',s:'Nível 26 a 30 • escuridão',caveObj:['colunaR','cristal'],seed:1303,color:'#0e0e18',lv:[26,30],home:'arquivo2',
  portals:{arquivo2:[8,8]},count:18,chests:4,tier:3,elite:.12,mons:[['ecoF',.3],['sentinelaR',.55],['aprendiz',.8],['fagulha',1]]}});
// a escada fica no salão da Torre, à direita do círculo mágico, fechada por um selo até a Selene confiar no herói
MAPS.torreArcadia.portals.arquivo1=[TC.x+6,TC.y-1,0,'escada']; // 'escada': sem tapete até ela (01)
TPREG.arcadia.d=['arquivo1','arquivo2','arquivo3'];tpReg('arcadia',TPREG.arcadia);

// ================== O MESTRE OZREN, O FAMINTO ==================
// Mago velho e magro de manto azul-noite rasgado, capuz caído, barba branca, olhos brancos acesos e, no peito, o buraco escuro
// com borda roxa (o círculo vazio de Vorhan). Segura o cajado partido, com o cristal da Torre rachado na ponta.
defMon('ozren',[
".......nnnnnnnn.......cc.",
"......nNNNNNNNNn.....cCCc",
".....nNNnnnnnnNNn....cCwc",
".....nNnsssssSnNn.....cc.",
".....nNnswSSwSnNn.....yy.",
".....nNnsSSSSSnNn......y.",
"....nNNnbsSSSbnNNn.....y.",
"...nNNNnbbbbbbnNNNn....y.",
"..nNNpNNnbbbbnNNpNNn...y.",
".nNNNpNNNNbbNNNNpNNNnssy.",
".nNNNpNNNrrrrNNNpNNNNssy.",
"nsNNNpNNrVVVVrNNpNNNn..y.",
"ssnNNpNrVVVVVVrNpNNNn..y.",
"s.nNNpNrVVVVVVrNpNNn...y.",
"..nNNpNrVVVVVVrNpNNn...y.",
"..nNNpNNrVVVVrNNpNNn...y.",
"..nNNpNNNrrrrNNNpNNn...y.",
"..nNNpNNNNNNNNNNpNNn...y.",
"..nNNpNNnNNNNNnNpNNn...y.",
"..nNNpNnNNNNNNNnpNNn...y.",
"..nNNNnNNNnNNNNNnNNn...y.",
"..nNNnNNNn.nNNNNnNNn...y.",
"...nNnNNn..nNNNn.nNn.....",
"...nn.nNn...nNn...nn.....",
"......nn.....n..........."],
 {n:'#1c2850',N:'#2a3a6a',s:'#c8c4d8',S:'#9a96b0',w:'#ffffff',b:'#e0e0ec',p:'#c8d4ec',r:'#8a4ad8',V:'#06040a',y:'#5a4a3a',c:'#3a8ad8',C:'#6ad8ff'});
MDEF.ozren={n:'Mestre Ozren, o Faminto',hp:500,atk:24,def:12,spd:36,xp:1800,r:13,aggro:150,cd:1.5,scale:1.5,boss:true,ai:'ozren'};
Object.assign(MAPS.arquivo3,{boss:'ozren',bossLv:30});MAPS.arquivo3.s+=' • chefe no salão mais fundo';
// material de chefe: um pedaço do selo que os magos puseram nele
LOOTM.ozren={n:'Lasca do Selo',c:'#8a4ad8',w:1,v:150};
MATSHP.ozren=[["....cCCCd.....","..cCCeeeCCd...",".cCeCCCCCeCd..",".CeCCffCCCeCd.","cCeCfggfCCeCd.","cCeCfggfCdddd.","cCeCCffCd.....",".CeCCCCd......",".dCeeeCd......","..dCCCd.......","...ddd........"],{e:'#6ad8ff',f:'#06040a',g:'#3a1a5a'}];
defMat('ozren');

// ---------- Golpes (chamados pelo bossAI, em 10) ----------
// Fome Arcana: avisa 1 s antes ("Ozren abre a boca...") e por 2,5 s brilha em roxo e todo golpe que leva o cura (dealMonster, 03) — é a hora de parar de bater.
// Orbes do Silêncio: lentos, tiram mana. Ecos dos alunos: ergue um Aprendiz Esvaziado e um Eco Faminto (35% da vida, no máximo 2).
// Abaixo da metade da vida, o selo racha: tudo vem mais rápido, e o Vazio chama (anéis em volta dele).
function ozrenAI(m,dt,dP,a){const serv=mons.filter(c=>c.owner===m&&!c.dead);if(a.fomeT===undefined){a.fomeT=7;a.sil=4;a.eco=3;a.vazio=6;}
 if(!a.rage&&m.hp<m.maxHp*.5){a.rage=true;a.eco=0;banner('O selo racha!','Ozren devora a luz em volta dele.');}
 if(a.avOn&&a.avT<=0){a.avOn=false;m.fome=2.5;burst(m.x,m.y-20,'#8a4ad8',24,70);addText(m.x,m.y-mh(m)-8,'Fome Arcana!','#c8a0ff',true);}
 if(a.avOn&&R()<.5)parts.push({x:m.x+rf(-6,6),y:m.y-mh(m)/2,vx:rf(-60,60),vy:rf(-60,60),g:0,life:.3,max:.3,color:'#c8a0ff',s:1});
 if(m.fome>0){m.fome-=dt;for(let k=0;k<3;k++)parts.push({x:m.x+rf(-18,18),y:m.y-rf(0,44),vx:rf(-10,10),vy:-35,g:0,life:.7,max:.7,color:pick(['#8a4ad8','#c8a0ff','#b070ff']),s:3});}
 if(a.fomeT<=0&&dP<230){a.fomeT=a.rage?11:13;a.avT=1;a.avOn=true;addText(m.x,m.y-mh(m)-8,'Ozren abre a boca...','#c8a0ff',true);
  if(!a.avisou){a.avisou=true;log('O Mestre Ozren devora magia: enquanto ele brilha em roxo, todo golpe o cura. Espere o brilho passar!','#c8a0ff');}}
 if(a.sil<=0&&dP<210){a.sil=a.rage?6:8;const b=Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);
  for(const o of[-.35,0,.35])mproj.push({x:m.x,y:m.y-mh(m)/2,vx:Math.cos(b+o)*80,vy:Math.sin(b+o)*80,life:3,m,c:'#6a3aa0',mult:.6,sil:1});addText(m.x,m.y-mh(m)-8,'Silêncio!','#a8a0d8',true);}
 if(a.eco<=0&&dP<220){a.eco=a.rage?14:18;if(serv.length<2){raiseEcos(m,2-serv.length);addText(m.x,m.y-mh(m)-8,'Venham, meus alunos!','#c8d4ec',true);}}
 if(a.rage&&a.vazio<=0&&dP<180){a.vazio=8;[[40,1],[75,1.6],[110,2.2]].forEach(([r,dl])=>teles.push({x:m.x,y:m.y,r,t:0,delay:dl,m,mult:1.2,ring:true}));addText(m.x,m.y-mh(m)-8,'O Vazio chama!','#8a4ad8',true);}
 if(a.shot<=0&&dP<200){a.shot=a.rage?1.8:2.4;const b=Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);for(const o of[-.2,0,.2])shootAt(m,b+o,120,'#8a4ad8',1);}
 return false;}
// golpe do herói num Ozren faminto: vira cura (chamado pelo dealMonster do 03)
function fomeCura(m,d,o){if(['ally','dot','thorns'].includes(o.src))return 0; // mascote, sangramento e espinhos só não doem
 const h=Math.max(1,Math.round(d*.25));m.hp=Math.min(m.maxHp,m.hp+h);m.hitT=.12;addText(m.x+rf(-5,5),m.y-mh(m)-2,'+'+h,'#c8a0ff');return 0;}
// orbe do silêncio acertou: tira um quarto da mana (chamado pelo tickPay do 09)
function silHit(){const a=Math.round(P.mp*.25);P.mp-=a;addText(P.x,P.y-32,'Silenciado! -'+a+' mana','#a8a0d8');}
function raiseEcos(m,n){const L=['aprendiz','ecoF','aprendiz'].slice(0,n);for(const ty of L)for(let t=0;t<20;t++){const an=R()*6.28,r=rf(24,50),x=m.x+Math.cos(an)*r,y=m.y+Math.sin(an)*r;if(blocked(x,y,5))continue;
  const c=makeMon(ty,x,y,Math.max(1,m.lvl-4),{state:'chase',zone:9});c.owner=m;c.maxHp=c.hp=Math.round(c.maxHp*.35);mons.push(c);burst(x,y-8,'#8a4ad8',16,50);break;}}
// derrotado (chamado pelo bossDead do 10): a missão da Selene fica pronta para entregar
function ozrenDead(){if(P.ped.selo===1){P.ped.selo=2;log('Ozren se desfaz em sombra, e o selo volta a fechar sozinho. Volte à Arquimaga Selene, na Torre dos Magos.','#ffd24a');}}

// ================== A MISSÃO DA SELENE ==================
const SELO={lv:20,t:'O que dorme sob a Torre',g:1500,
 pede:'Você ficou forte, e eu preciso de alguém forte. Sob esta Torre há um selo, e atrás dele está o Mestre Ozren, que foi o meu mestre. Ele ouviu algo que não devia e passou a devorar magia. Eu só consigo mantê-lo trancado. Desça pelo Arquivo Selado, chegue à Prisão do Selo e enfraqueça Ozren, para o selo ganhar força de novo.',
 vai:'A escada fica à direita do círculo. Cuidado: quando ele brilhar em roxo, não o acerte. Ele come o que você jogar nele.',
 ok:'Eu senti o selo apertar daqui de cima. Obrigada. Ele vai se refazer, sempre se refaz, mas agora temos tempo. Antes de cair, ele falou de um "silêncio"? Era assim que ele chamava a voz que ouvia.',
 f:['O selo segura. Graças a você, segura bem.','Ozren me ensinou a ler as estrelas. É estranho sentir saudade de quem precisa ficar preso.',
  'Ele dizia ouvir um "eco" antes de dormir. Hoje acho que era um nome. Não vou dizê-lo aqui dentro.','Se quiser descer de novo, a escada está aberta. Ele se refaz, mas mais fraco a cada vez.']};
const seloSt=()=>P&&P.ped?P.ped.selo||0:0;
// a Selene tem algo a dizer sobre o selo (abre a janela em vez da conversa de sempre)
function seloQuer(){if(!P||P.lvl<SELO.lv||seloSt()>=3)return false;return!(mentorOf()==='selene'&&mentorAlert('selene'));}
const seloRew=()=>({g:SELO.g,xp:xpNeed(30)});
function openSelo(){closeAll();PED_Q=null;renderSelo();$('pedido').classList.remove('hidden');}
function renderSelo(){const st=seloSt(),B=$('pedidoBody'),r=seloRew();$('pedido').querySelector('h2').textContent='Arquimaga Selene';
 B.innerHTML=`<div class="mcard ${st===2?'pronta':st?'aceita':'livre'}"><div class="mt"><b>${SELO.t}</b><small>nível ${SELO.lv}+ • 3 andares</small></div><p>"${st===2?'Você voltou! Conte tudo.':st?SELO.vai:SELO.pede}"</p>`+
  `<div class="mr"><span>Objetivo</span><span>${st>=2?'Ozren derrotado ✔':'Derrotar o Mestre Ozren na Prisão do Selo'}</span></div>`+
  `<div class="mr"><span>Recompensa</span><span>💰 ${r.g}g • 🎁 um equipamento épico • ✨ ${r.xp} XP</span></div><div class="acts">`+
  (st===0?`<button class="btn sm gold" data-s="aceitar">Aceitar</button><button class="btn sm" data-s="fechar">Agora não</button>`
  :st===2?`<button class="btn sm gold" data-s="entregar">Contar à Selene</button>`:`<span class="muted">A escada fica no salão, à direita do círculo mágico.</span><button class="btn sm" data-s="fechar">Fechar</button>`)+`</div></div>`;
 B.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>seloAction(b.dataset.s));}
function seloAction(a){const st=seloSt();
 if(a==='fechar'){$('pedido').classList.add('hidden');return;}
 if(a==='aceitar'&&st===0){P.ped.selo=1;log(`Missão aceita: ${SELO.t}. O selo da escada se abre para você.`,'#c8a0ff');burst(portalPt('arquivo1').x,portalPt('arquivo1').y,'#8a4ad8',30,70);}
 else if(a==='entregar'&&st===2){P.ped.selo=3;const r=seloRew(),it=genItem(32,3,null,3);P.gold+=r.g;P.inv.push(it);logItem(it);
  banner('O selo está firme!',SELO.t);log(`Arquimaga Selene: "${SELO.ok}"`,'#8fd8ff');log(`+${r.g}g`,'#ffd24a');addText(P.x,P.y-30,'+'+r.xp+' XP','#d6a8ff');gainXp(r.xp);
  $('pedido').classList.add('hidden');const tk=TALK.find(t=>t.p.id==='selene');if(tk){tk.line=SELO.ok;tk.until=time+8;}save();return;}
 renderSelo();save();}
// depois da missão, a Selene ganha falas sobre Ozren
function seloFalas(){const s=GENTE.find(g=>g.id==='selene');if(s&&seloSt()>=3&&!s.f.includes(SELO.f[0]))s.f.push(...SELO.f);}
// aviso no nível 20 (uma vez por herói carregado) e falas novas; chamada pelo hudExtra do 04
let seloAvisou=null;
function seloTick(){if(!P)return;if(seloAvisou!==P&&P.lvl>=SELO.lv&&!seloSt()){seloAvisou=P;log('A Arquimaga Selene quer falar com você. Ela espera na Torre dos Magos, em Arcádia, ao norte de Valdor.','#c8a0ff');}seloFalas();}
// "!" sobre a Selene quando ela tem a missão, "?" cinza com a missão aceita e "?" dourado com Ozren derrotado (chamada pelo drawLabels do 04)
function seloMarks(lab,tt){if(!P||P.lvl<SELO.lv||seloSt()>=3||(mentorOf()==='selene'&&mentorAlert('selene')))return;const q=TALK.find(t=>t.p.id==='selene');if(!q)return;const st=seloSt();
 ctx.font='800 24px Cinzel,serif';lab(st?'?':'!',q.x,q.y-37+Math.sin(tt*4)*1.5,st===1?'#b8b0a0':'#ffd24a');ctx.font='700 13px "Alegreya Sans",sans-serif';}
// tarefas do diário (29)
function seloDia(abertas){const st=seloSt();if(abertas){if(!st&&P.lvl>=SELO.lv)return[{t:SELO.t,s:'Arquimaga Selene • Torre dos Magos',p:'A Arquimaga Selene quer falar com você. Ela espera na Torre dos Magos, em Arcádia.',cor:'#c8a0ff'}];if(st===1||st===2)return[{t:SELO.t,s:'Arquimaga Selene • Torre dos Magos',p:st===2?'Pronto! Volte à Arquimaga Selene, na Torre dos Magos.':SELO.pede,prog:[['Mestre Ozren derrotado',st===2?1:0,1]],ok:st===2,cor:'#c8a0ff'}];return[];}
 return st===3?[{t:SELO.t,s:'Arquimaga Selene • Torre dos Magos',p:`"${SELO.ok}"`,cor:'#c8a0ff'}]:[];}

// ================== A ESCADA SELADA ==================
// fechada enquanto a missão não foi aceita (portalTick e drawPortals, no 08)
const seloFecha=to=>to==='arquivo1'&&CUR==='torreArcadia'&&seloSt()<1;
let seloMsgT=0;
function seloAviso(){if(time<seloMsgT)return;seloMsgT=time+3;addText(P.x,P.y-32,'Um selo fecha a escada','#c8a0ff');log('Um selo de runas fecha a escada. Só a Arquimaga Selene pode abri-lo.','#c8a0ff');}
// a boca da escada no chão do salão e, se fechada, o anel de runas roxas por cima
function seloDraw(to,tt){const p=portalPt(to),x=Math.round(p.x),y=Math.round(p.y);
 ctx.fillStyle='#1b1320';ctx.fillRect(x-10,y-8,20,16);for(let k=0;k<4;k++){ctx.fillStyle=['#6a7088','#4a5068','#2a2e3e','#14121a'][k];ctx.fillRect(x-9,y-7+k*4,18,3);}
 if(!seloFecha(to))return;const a=.65+Math.sin(tt*3)*.2;ctx.globalAlpha=a;ctx.strokeStyle='#8a4ad8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,14,8,0,0,6.29);ctx.stroke();
 ctx.fillStyle='#c8a0ff';for(let k=0;k<6;k++){const b=k/6*6.283+tt*.6;ctx.fillRect(Math.round(x+Math.cos(b)*14)-1,Math.round(y+Math.sin(b)*8)-1,3,3);}
 ctx.strokeStyle='#c8a0ff';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x-8,y-5);ctx.lineTo(x+8,y+5);ctx.moveTo(x+8,y-5);ctx.lineTo(x-8,y+5);ctx.stroke();ctx.globalAlpha=1;}

// ================== MISSÕES DA GUILDA DE ARCÁDIA ==================
MISS.push({city:'arcadia',id:'paginas',t:'Páginas fugidas',map:'arquivo1',mat:'grimorio',n:8,lv:21,txt:'Os grimórios do Arquivo Selado criaram asas e mordem quem tenta lê-los. Traga 8 Páginas Arrancadas para a biblioteca refazer os livros.'},
 {city:'arcadia',id:'nucleos',t:'Guardas que não dormem',map:'arquivo2',mat:'sentinelaR',n:6,lv:24,txt:'As Sentinelas Rúnicas dos Salões do Eco não reconhecem mais os magos. Traga 6 Núcleos Rúnicos para os estudiosos acalmarem as runas.'},
 {city:'arcadia',id:'sombras',t:'Fome que ecoa',map:'arquivo2',mat:'ecoF',n:8,lv:26,txt:'Ecos Famintos sobem pelas escadas e bebem a magia das lâmpadas da Torre. Traga 8 Fiapos de Sombra antes que a Torre fique às escuras.'});
