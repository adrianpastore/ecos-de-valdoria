// Ecos de Valdoria — Equipamentos visíveis no personagem
'use strict';
// ================== BONECO EM CAMADAS ==================
const CSTYLE={guerreiro:'metal',mago:'cloth',arqueira:'leather'};
const STYLE_BASES={metal:{elmo:['Elmo de Couro Fervido','Elmo de Ferro','Elmo Alado','Elmo do Campeão'],peito:['Gibão Acolchoado','Cota de Malha','Armadura de Placas','Couraça Rúnica']},
 leather:{elmo:['Faixa de Couro','Capuz de Couro','Capuz do Batedor','Capuz Sombrio'],peito:['Colete de Couro','Couraça de Couro','Jaqueta de Batedor','Manto do Caçador']},
 cloth:{elmo:['Faixa de Linho','Chapéu Pontudo','Chapéu Arcano','Coroa Astral'],peito:['Túnica de Linho','Manto de Aprendiz','Veste Arcana','Veste do Arquimago']}};
const MATS={
 metal:[{a:'#98a4b8',A:'#5d6679',l:'#dfe6ef',g:'#c8a040'},{a:'#9ab8a8',A:'#557565',l:'#dff2e6',g:'#3ddc5a'},{a:'#86a6dc',A:'#3f5a98',l:'#dce8ff',g:'#4a9bff'},{a:'#a888d0',A:'#5a3a88',l:'#efdcff',g:'#c05cff'},{a:'#e0b040',A:'#9a6a14',l:'#fff0b0',g:'#ff7a1a'}],
 leather:[{a:'#8a6a42',A:'#5a4226',l:'#b89a6a',g:'#c8a040'},{a:'#5f8a4a',A:'#3a5a2a',l:'#9ac080',g:'#3ddc5a'},{a:'#4a6a9a',A:'#2a4270',l:'#8aa8d8',g:'#4a9bff'},{a:'#6a3a8a',A:'#3e2152',l:'#a070c0',g:'#c05cff'},{a:'#34323a',A:'#1c1b20',l:'#6a6a78',g:'#ff9a1f'}],
 cloth:[{a:'#8a8478',A:'#5f5a50',l:'#bdb6a8',g:'#c8a040'},{a:'#4f8a55',A:'#2f5a35',l:'#8ac090',g:'#e8d070'},{a:'#4b5bd6',A:'#2e3890',l:'#8fa0ff',g:'#e8b43c'},{a:'#7a3ab8',A:'#4a1f78',l:'#b890e8',g:'#ffd24a'},{a:'#c83a2a',A:'#7a1f18',l:'#ff8a6a',g:'#ffd24a'}]};
const HAIR={guerreiro:'#6a4226',mago:'#d8d0e8',arqueira:'#c9772e'};
const BODY=["","","......kkkk......",".....khhhhk.....","....khhhhhhk....","....khsesesk....","....kssssssk....",".....kSSSSk.....","...kkttttttkk...","..kskttttttksk..","..kskttttttksk..","...kkppppppkk...","....kppkkppk....","....kppkkppk....","....kbbkkbbk....","....kkkkkkkk...."];
const tierOf=it=>clamp(Math.floor(it.ilvl/6),0,3);
function rect(s,x0,y0,x1,y1,c){for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)s(x,y,c);}
const DRAW={
 peito:{
  metal:(s,t)=>{rect(s,5,8,10,10,'a');rect(s,10,8,10,10,'A');s(5,8,'l');s(6,8,'l');
   if(t===0)rect(s,5,9,9,9,'A');if(t===1)for(let y=8;y<=10;y++)for(let x=5;x<=9;x++)if((x+y)%2)s(x,y,'A');
   if(t>=2){s(3,7,'A');s(4,7,'a');s(11,7,'a');s(12,7,'A');s(3,8,'a');s(4,8,'l');s(11,8,'a');s(12,8,'A');rect(s,5,11,10,11,'A');s(7,9,'l');}
   if(t===3){s(7,9,'g');s(8,9,'g');s(3,9,'A');s(3,10,'A');s(12,9,'A');rect(s,5,11,10,11,'g');}},
  leather:(s,t)=>{rect(s,5,8,10,10,'a');rect(s,10,8,10,10,'A');s(5,8,'l');
   if(t>=1){rect(s,5,11,10,11,'A');s(7,11,'g');}if(t>=2){s(3,9,'a');s(12,9,'a');s(9,8,'A');s(8,9,'A');s(7,10,'A');}
   if(t===3){rect(s,3,8,3,12,'A');rect(s,2,9,2,11,'A');s(5,7,'a');s(10,7,'a');s(6,8,'g');}},
  cloth:(s,t)=>{rect(s,5,8,10,12,'a');s(4,12,'a');s(11,12,'a');rect(s,10,8,10,12,'A');s(5,8,'l');
   if(t>=1){rect(s,4,13,11,13,'a');s(3,9,'a');s(3,10,'a');s(12,9,'a');}
   if(t>=2){rect(s,7,9,7,13,'g');rect(s,4,13,11,13,'A');}
   if(t===3){s(5,7,'g');s(10,7,'g');s(4,8,'g');s(11,8,'g');rect(s,4,13,11,13,'g');}}},
 elmo:{
  metal:(s,t)=>{rect(s,6,3,9,3,'a');rect(s,5,4,10,4,'a');s(10,4,'A');
   if(t>=1){s(5,3,'a');s(10,3,'A');rect(s,6,2,9,2,'a');s(10,5,'A');s(5,5,'a');s(6,2,'l');}
   if(t>=2){s(4,3,'l');s(3,2,'l');s(3,3,'a');s(4,2,'a');s(2,1,'l');}
   if(t===3){rect(s,6,1,8,1,'g');s(7,0,'g');s(5,1,'g');}},
  leather:(s,t)=>{if(t===0){rect(s,5,4,10,4,'a');s(4,4,'a');s(3,5,'a');return;}
   rect(s,6,2,9,2,'a');rect(s,5,3,10,3,'a');rect(s,5,4,10,4,'a');s(10,4,'A');s(4,4,'a');s(4,5,'a');s(4,6,'a');s(5,5,'A');
   if(t>=2){s(3,5,'a');s(3,6,'a');s(3,7,'A');s(6,3,'l');}if(t===3){rect(s,6,6,10,6,'A');s(7,2,'g');}},
  cloth:(s,t)=>{if(t===0){rect(s,5,4,10,4,'a');s(8,4,'g');return;}
   if(t===3){rect(s,5,3,10,3,'g');s(5,2,'g');s(7,2,'g');s(9,2,'g');s(7,0,'o');s(8,0,'o');return;}
   rect(s,3,4,12,4,'A');rect(s,5,3,10,3,'a');rect(s,6,2,9,2,'a');rect(s,6,1,8,1,'a');s(6,0,'a');s(5,0,'a');
   if(t===2){rect(s,5,3,10,3,'g');s(7,1,'l');}}},
 botas:(s,t)=>{if(t>=2){rect(s,5,12,6,14,'a');rect(s,9,12,10,14,'a');s(5,12,'l');s(9,12,'l');s(6,14,'A');s(10,14,'A');if(t===3){s(4,12,'l');s(4,13,'g');s(8,12,'l');}return;}
  rect(s,5,14,6,14,'a');rect(s,9,14,10,14,'a');if(t===1){rect(s,5,13,6,13,'a');rect(s,9,13,10,13,'a');s(6,14,'A');s(10,14,'A');}}};
// Armas: um desenho para cada arma (as 4 de cada classe e as 2 lendárias), usado na mão do herói e no ícone da bolsa.
// '+' é o ponto da empunhadura (fica junto da mão; 'd' afasta a arma do corpo, nos arcos); a,A,l = metal na cor da raridade, g = brilho da raridade, o = gema da raridade, y/Y = madeira, n = corda; 'p' troca cores só daquela arma.
const WART={
 guerreiro:[
  {r:[".l.",".la",".la",".la",".lA","ggg",".+.",".g."]},
  {r:["..l..",".laa.",".lAa.",".lAa.",".lAa.",".lAa.",".lAa.",".lAa.",".lAa.","AgggA","..+..","..Y..","..o.."]},
  {r:[".y.al.","aYalll","aYAall","aYAall","aYalll",".y.al.",".y....",".y....",".Y....",".y....",".y....",".Y....",".+....",".Y....",".g...."]},
  {r:["..l..",".lal.",".lAa.",".lga.",".lAa.",".lga.",".lAa.",".lga.",".lAa.",".lAa.","glAag","ggogg","..+..","..Y..",".g.g."]},
  {r:[".lllll.","laagaaA","lagogaA","laagaaA",".AAAAA.","...y...","...Y...","...y...","...g...","...y...","...Y...","...y...","...+...","...Y...","..ggg.."]},
  {r:["..F..",".FwF.","fwlrf",".wlrF","Fwlr.",".wlrf","fwlr.",".wlrF","Fwlr.",".wlr.","rgggr","..+..","..Y..",".rgr."],p:{w:'#fff8e8',l:'#f0e0c8',r:'#c8b090',f:'#ff7a1a',F:'#ffd24a',g:'#ffd24a'}}],
 mago:[
  {r:[".O.","OoO",".O.",".g.",".y.",".y.",".y.",".+.",".Y."]},
  {r:["L.yy.",".y.yL","Ly.oy",".yyY.","..y..","..Y..","..y..","..y..","..Y..","..y..","..y..","..+..","..Y..","..y.."],p:{L:'#5aa040'}},
  {r:[".a.a.","aoOoa","aoooa",".aoa.","..A..",".gyg.","..y..","..y..","..Y..","..y..","..y..","..+..","..Y..","..g.."]},
  {r:["..o..",".oOo.","a.o.a","a...a",".aaa.","..l..","..g..","..A..","..l..","..g..","..A..","..+..","..A..",".ggg."]},
  {r:["v.....v","v..m..v","v.mVm.v",".vmVmv.","..vmv..","...v...","...m...","...v...","...v...","...m...","...v...","...+...","...v...","..mvm.."],p:{v:'#4a2a70',V:'#0a0612',m:'#c070ff','+':'#2a1840'}},
  {r:["..w..",".wcw.",".ccc.","cccpc","cpppc",".ppp.","D.d.D","DdddD",".DdD.","..d..","..D..","..d..","..+..","..D..",".dDd."],p:{w:'#ffffff',c:'#a8f0ff',p:'#ffb0e0',d:'#ffd24a',D:'#b07a14','+':'#8a5a2c'}}],
 arqueira:[
  {r:[".y..","n.y.","n..y","n..y","n..y","n..+","n..y","n..y","n.y.",".y.."],d:2},
  {r:[".y..","n.y.","n.yy","n..y","n..yY","n..yY","n..yY","n..yY","n..g","n..+","n..g","n..yY","n..y","n.yy",".y.."],d:2},
  {r:[".l...","n.y..","n.yL.","n..y.","n..yL","n..y.","n..y.","n..y.","n..Y.","n..+o","n..Y.","n..yL","n.yL.","n.y..",".l..."],p:{y:'#c8a060',L:'#5ac070'},d:2},
  {r:["....a","n..a.","n.Y..","n.Y..","n..Y.","n..g.","n..Y.","n..Y.","n..g.","n..+.","n..g.","n..Y.","n.Y..","n..a.","....a"],p:{Y:'#4a2c18','+':'#2a1a10'},d:2},
  {r:[".eW...","n.eW..","n.eW..","n..eW.","n..eW.","n..e..","n..e..","n..e..","n..E..","n..+W.","n..E..","n..eW.","n.eW..","n.eW..",".eW..."],p:{e:'#7adfa0',E:'#3a9a6a',W:'#f4fff8',n:'#d8fff0','+':'#3a6a4a'},d:2},
  {r:[".s...","n.s..","n.sS.","n..sS","n..sS","n..sS","n..sS","n..sS","n..SS","n..+m","n..SS","n..sS","n.sS.","n.s..",".s..."],p:{s:'#eef4ff',S:'#9ab0d8',m:'#fff6c0',n:'#fff6c0','+':'#5a6a98'},d:2}]};
// qual desenho: lendária pelo nome (cada uma tem o seu); as outras pelo nível do item (as 4 armas-base da classe)
function weapKind(it){if(it.rar===4){const i=LEG.arma[it.cls].indexOf(it.base||it.name);return i<0?4:4+i;}return tierOf(it);}
const weapArt=it=>{const L=WART[it.cls]||WART.guerreiro;return L[weapKind(it)]||L[tierOf(it)];};
const weapPal=(it,art)=>Object.assign({},MATS.metal[it.rar],{y:'#8a5a2c',Y:'#5a3a1a',n:'#c8bca0',o:RARC[it.rar],O:'#ffffff','+':'#5a3a1a'},art.p);
function putArt(set,art,ax,ay){let px=0,py=0;ax+=art.d||0;art.r.forEach((r,j)=>{const i=r.indexOf('+');if(i>=0){px=i;py=j;}});art.r.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.')set(ax+i-px,ay+j-py,r[i]);});}
// contorno escuro em volta de tudo que foi pintado
function outlineG(G){const O=G.map(r=>r.slice());
 for(let y=0;y<G.length;y++)for(let x=0;x<G[0].length;x++)if(!G[y][x])for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=G[y+dy]&&G[y+dy][x+dx];if(c&&c!==K){O[y][x]=K;break;}}return O;}
const gridC=G=>{const c=cnv(G[0].length,G.length),x=c.getContext('2d');G.forEach((r,y)=>r.forEach((col,i)=>{if(col){x.fillStyle=col;x.fillRect(i,y,1,1);}}));return c;};
// o herói tem 22×20 px: o corpo de 16×16 fica embaixo e no meio (HOX, HOY), e a sobra é para a arma caber inteira
const HGW=22,HGH=20,HOX=3,HOY=4;
function composeGrid(cls,eq){const G=Array.from({length:HGH},()=>Array(HGW).fill(null));
 const bp={k:K,h:HAIR[cls],s:'#f1c7a0',S:'#c8906c',e:K,t:'#b8a888',p:'#4a3f36',b:'#3a2a1e'};
 BODY.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(bp[r[x]])G[y+HOY][x+HOX]=bp[r[x]];});
 if(cls==='arqueira'){for(const[x,y]of[[4,6],[3,6],[3,7],[3,8]])G[y+HOY][x+HOX]=HAIR.arqueira;}
 for(const slot of['botas','peito','elmo','arma']){const it=eq[slot];if(!it)continue;const st=CSTYLE[it.cls]||'metal',t=tierOf(it);
  if(slot==='arma'){const art=weapArt(it),pal=weapPal(it,art);putArt((x,y,c)=>{if(x>=0&&x<HGW&&y>=0&&y<HGH&&pal[c])G[y][x]=pal[c];},art,HOX+13,HOY+10);continue;}
  const mat=slot==='botas'?(t>=2?'metal':'leather'):st;
  const pal=Object.assign({},MATS[mat][it.rar],{y:'#8a5a2c',Y:'#5a3a1a',n:'#f0e6d0',o:RARC[it.rar]});
  const set=(x,y,c)=>{if(x>=0&&x<16&&y>=0&&y<16&&pal[c])G[y+HOY][x+HOX]=pal[c];};
  if(slot==='botas')DRAW.botas(set,t);else DRAW[slot][st](set,t);}
 return outlineG(G);}
function composeHero(cls,eq){return gridC(composeGrid(cls,eq));}
function cropC(c,x,y,w,h){const o=cnv(w,h);o.getContext('2d').drawImage(c,x,y,w,h,0,0,w,h);return o;}
// ícone da arma na bolsa: o mesmo desenho da mão, em pé, no meio de 16×16
const wicCache={};
function weapIcon(it){const art=weapArt(it),id=it.cls+weapKind(it)+'_'+it.rar;if(wicCache[id])return wicCache[id];const pal=weapPal(it,art);
 const G=Array.from({length:16},()=>Array(16).fill(null)),w=Math.max(...art.r.map(r=>r.length)),h=art.r.length,ox=Math.floor((16-w)/2),oy=Math.floor((16-h)/2);
 art.r.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(pal[r[i]])G[oy+j][ox+i]=pal[r[i]];});
 return wicCache[id]=toURL(gridC(outlineG(G)),4);}
const starterEq=cls=>({arma:{cls,ilvl:1,rar:0,slot:'arma'},peito:{cls,ilvl:1,rar:0,slot:'peito'}});
const previewLook=cls=>composeHero(cls,starterEq(cls));
let lookKey='';
function heroSpr(){const eq=P.equip;const k=P.cls+'|'+['botas','peito','elmo','arma'].map(s=>eq[s]?`${s}${eq[s].cls}${s==='arma'?weapKind(eq[s]):tierOf(eq[s])}${eq[s].rar}`:'').join('|');
 if(k!==lookKey){lookKey=k;reg('hero',composeHero(P.cls,eq));const pc=$('portrait').getContext('2d');pc.clearRect(0,0,16,16);pc.drawImage(SPR.hero.n,HOX,HOY,16,16,0,0,16,16);}return'hero';}
function lookFx(){if(R()<.2&&Object.values(P.equip).some(it=>it&&it.rar===4))parts.push({x:P.x+rf(-6,6),y:P.y-rf(0,16),vx:0,vy:-14,g:0,life:.7,max:.7,color:pick(['#ff9a1f','#ffd24a']),s:1});
 const w=P.equip.arma;if(w&&w.rar>=3&&!P.form&&R()<.12)parts.push({x:P.x+P.face*rf(4,7),y:P.y-rf(9,19),vx:0,vy:-8,g:0,life:.5,max:.5,color:pick([RARC[w.rar],'#ffffff']),s:1});}
