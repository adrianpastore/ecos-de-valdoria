// Ecos de Valdoria — Rei Sethkar, o Soberano Enfaixado: chefe da câmara do rei, no fundo da pirâmide de Sahrem (Sahrem, etapa 4)
'use strict';
// Rei tirano de Sahrem que jurou fidelidade a Kharzen para reinar para sempre e ficou preso à pirâmide sem poder morrer.
// Coroa de ferro com pontas (o símbolo de Kharzen) por cima do toucado listrado de ouro e roxo, olhos roxos acesos e o cetro com o escaravelho.
defMon('reiSethkar',[
"......i..i..i..i..........",
"......I..I..I..I......gg..",
".....IIIIIIIIIIII....gSSg.",
".....IiIIIGGIIIiI....SssS.",
"....GGGGGGGGGGGGGG...gSSg.",
"...PPPPWWwWWWWwWPPPP..oo..",
"...GGGWdeedWdeedWGGG..oo..",
"...PPPWWWWWwWWWWWPPP..GG..",
"..GGGGWwWWkkkWWwWGGGG.oo..",
"..PPPP.wWWWWWWWw.PPPP.oo..",
"..GGGG..WWoGoWW..GGGG.oo..",
"..PPPPRRGgGGGgGRRPPPP.oo..",
".RRGGGGgGTGGTGgGGGGGRWWo..",
".RrRGGGGGGGGGGGGGGRWWwWW..",
".RrRWWwwWWWWWWWWWWRrWWW...",
".RrRWWWWwwWWWWWWWWRrRo....",
".RrRPPPPPPPGGPPPPPRrRo....",
".RrRPPPPPPGgGGPPPPRrRo....",
".RrRWWWWWPPGGPWWwwRrRo....",
".RrRRWWWWWWPPwwWWRRrRo....",
".RrRRwwWWWWPPWWWWRRrR.....",
"RrRRRWWwwWW.WWwwWRRrRR....",
"RrRRRWWWWw..WWWWWRRrRR....",
"RRrRRwwWWW..WWWwwRRRrRR...",
"RRrRRRWWww..wwWWRRRRrRR...",
"RRRRRWWWWW..WWWWWRRRRRR...",
"..w.wwwwww..wwwwww..w.w..."],
 {W:'#d8ccb0',w:'#a89a78',d:'#2a2018',e:'#c060ff',I:'#6a6a72',i:'#a8a8b4',G:'#e8c048',g:'#fff0a0',o:'#a87820',P:'#4a2a5a',R:'#3a1a3a',r:'#6a2a5a',T:'#40c8a8',S:'#2aa070',s:'#8af0c0'});
MDEF.reiSethkar={n:'Rei Sethkar, o Soberano Enfaixado',hp:650,atk:30,def:16,spd:34,xp:2400,r:14,aggro:150,cd:1.6,scale:1.5,boss:true,ai:'sethkar'};
Object.assign(MAPS.tumba3,{boss:'reiSethkar',bossLv:40});MAPS.tumba3.s+=' • chefe no salão mais fundo';
// material de chefe: o amuleto de escaravelho dourado que ele leva no peito
LOOTM.reiSethkar={n:'Escaravelho Real',c:'#e8c048',w:1,v:150};
MATSHP.reiSethkar=[["....d....d....",".....d..d.....","....cCCCCd....","...cCcCCCCd...","..dCCCCCCCCd..",".ccCeeffeeCCd.","cCCeeeffeeeCCd","cCCeeegfeeeCCd",".dCeeeffeeeCd.","..dCeeffeeCd..","...dCCCCCCd...","..d.dCCCCd.d..",".d...dddd...d."],{e:'#4a2a5a',f:'#8a4ab0',g:'#e0a0ff'}];
defMat('reiSethkar');
// missões da tumba na Guilda de Sahrem (o Tarek já conta que a porta da pirâmide se abriu)
MISS.push({city:'sahrem',id:'ataduras',t:'Faixas que andam',map:'tumba1',mat:'mumia',n:8,lv:31,txt:'Múmias Enfaixadas sobem as escadas da pirâmide de noite. Traga 8 Ataduras Antigas para o selo ser refeito.'},
 {city:'sahrem',id:'laminasBronze',t:'Guardas sem descanso',map:'tumba2',mat:'sentinela',n:6,lv:34,txt:'As Sentinelas Chacal ainda guardam o rei morto. Traga 6 Lâminas de Bronze para provar que passou por elas.'},
 {city:'sahrem',id:'amuletos',t:'O culto da coroa de ferro',map:'tumba2',mat:'sacerdote',n:6,lv:35,txt:'Sacerdotes de Kharzen rezam pela volta do Rei Sethkar. Traga 6 Amuletos Profanos antes que a reza termine.'});
// ---------- Golpes (chamados pelo bossAI, em 10) ----------
// Ergue servos da tumba: Ataduras do Rei puxam o herói para perto e logo vem um círculo em volta dele (fuja depois do puxão);
// Tempestade de Areia: uma fileira de círculos que vai dele até o herói; abaixo da metade da vida, a Maldição de Kharzen (orbes roxos que envenenam).
let FAIXA=null; // a atadura esticada até o herói enquanto puxa (desenhada pelo drawMProj, em 09)
function sethkarAI(m,dt,dP,a){const serv=mons.filter(c=>c.owner===m&&!c.dead);if(a.faixa===undefined){a.faixa=5;a.areia=7;a.pullT=0;}
 if(!a.rage&&m.hp<m.maxHp*.5){a.rage=1;a.call=0;banner('O Rei Sethkar invoca Kharzen!','A coroa de ferro arde em roxo.');}
 if(a.pullT>0){FAIXA=m;const d=hyp(m.x-P.x,m.y-P.y);if(d>m.r+14)step(P,(m.x-P.x)/d*300*dt,(m.y-P.y)/d*300*dt);
  if((a.pullT-=dt)<=0||d<=m.r+14){a.pullT=0;FAIXA=null;teles.push({x:m.x,y:m.y,r:56,t:0,delay:1.1,m,mult:1.6});addText(m.x,m.y-mh(m)-8,'Ajoelhe-se!','#ffd24a',true);}}
 if(a.call<=0&&dP<220){a.call=a.rage?11:15;if(serv.length<4){raiseTumba(m,4-serv.length);addText(m.x,m.y-mh(m)-8,'Levantem-se, servos!','#e8dcc0',true);}}
 if(a.faixa<=0&&dP>50&&dP<200&&!a.pullT){a.faixa=a.rage?7:9;const b=Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);
  mproj.push({x:m.x,y:m.y-mh(m)/2,vx:Math.cos(b)*170,vy:Math.sin(b)*170,life:1.3,m,c:'#d8ccb0',mult:.5,pull:1});addText(m.x,m.y-mh(m)-8,'Ataduras do Rei!','#e8dcc0',true);}
 if(a.areia<=0&&dP<200){a.areia=a.rage?8:11;const b=Math.atan2(P.y-m.y,P.x-m.x);
  for(let k=0;k<6;k++){const r=24+k*26,x=m.x+Math.cos(b)*r,y=m.y+Math.sin(b)*r;teles.push({x,y,r:24,t:0,delay:.9+k*.18,m,mult:1.3});burst(x,y-4,'#e8c890',10,40);}
  addText(m.x,m.y-mh(m)-8,'Tempestade de Areia!','#f0d898',true);}
 if(a.shot<=0&&dP<200){const b=Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);
  if(a.rage){a.shot=2;for(const o of[-.4,-.2,0,.2,.4])mproj.push({x:m.x,y:m.y-mh(m)/2,vx:Math.cos(b+o)*115,vy:Math.sin(b+o)*115,life:2.2,m,c:'#c060ff',mult:1,curse:1});}
  else{a.shot=2.6;for(const o of[-.2,0,.2])shootAt(m,b+o,120,'#f0d070',1);}}
 return false;}
// a atadura acertou: começa a puxar
function sethkarPull(m){if(m.dead||!m.ai)return;m.ai.pullT=.6;addText(P.x,P.y-32,'Puxado!','#e8dcc0');}
// servos: uma Múmia Enfaixada e, se couber, dois Enxames de Escaravelhos (meia vida; no máximo 4 vivos; somem quando ele morre)
function raiseTumba(m,n){const L=['mumia','besouroT','besouroT'].slice(0,n);for(const ty of L)for(let t=0;t<20;t++){const an=R()*6.28,r=rf(24,50),x=m.x+Math.cos(an)*r,y=m.y+Math.sin(an)*r;if(blocked(x,y,5))continue;
  const c=makeMon(ty,x,y,Math.max(1,m.lvl-4),{state:'chase',zone:9});c.owner=m;c.maxHp=c.hp=Math.round(c.maxHp*.5);mons.push(c);burst(x,y-8,'#e8c890',16,50);break;}}
