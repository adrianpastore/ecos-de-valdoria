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
// Armaduras: um desenho para cada peça (elmo e peitoral: 4 por estilo; botas: 4; e as 2 lendárias de cada parte), no corpo e no ícone da bolsa.
// Cada desenho é texto em cima do corpo de 16×16: 'y' é a linha do corpo onde começa (pode ser negativa: acima da cabeça), e cada linha tem 16 colunas (x de 0 a 15).
// a,A,l = cor do material na raridade (MATS), g = detalhe da raridade, o = gema na cor RARC, y = corda; 'p' troca cores só daquela peça; 'm' força o material.
const ARM={
 elmo:{
  metal:[
   {y:2,m:'leather',r:["......aaaa......",".....aallaa.....","....AgAAAAgA...."]},
   {y:1,r:["......aaaa......",".....alllaa.....","....allaaaaA....","....aAAAAAAA....","....A...a..A....","....A......A...."]},
   {y:-1,r:["..l..........l..",".ll..........ll.",".lla..aaaa..all.","..lla.alla.all..","...laallaaaal...","....aAgggAAA....","....A...a..A...."]},
   {y:-3,r:[".......rr.......","......rrrr......","......rRrr......",".......rR.......","......gaag......",".....aallaa.....","....allaaaaA....","....aAgggAAA....","....aKKKKKKA....","....aAaAaAaA....",".....AAAAAA....."],p:{r:'#c83a2a',R:'#7a1f18',K:'#2a2030'}}],
  leather:[
   {y:4,r:["...aaaaaaaaA....","..aA............","..a............."]},
   {y:1,r:["......aaaa......",".....aaaaaa.....","....alaaaaaA....","....laAAAAAA....","....a......A....","....a......A....","....Aa....aA...."]},
   {y:0,r:["....aa..........","....aaaaaa......",".....aaaaaaa....","....alaaaaaA....","....laAAAAAA....","....a......A....","....aggggggA....",".....AAAAAA....."]},
   {y:0,r:["......aaa.......",".....aaaaaa.....","....aaaaaaaa....","...alaaaaaaaA...","...laAAAAAAAA...","...aaKKoKoKAA...","...aAKKKKKKAA...","...aA......AA..."],p:{K:'#2a1e2a'}}],
  cloth:[
   {y:4,r:["....aaaagaaa...."]},
   {y:-2,r:[".........a......","........aa......",".......aaa......","......aaaA......",".....aaaaaA.....","....aaaaaaaA....","..AAAAAAAAAAAA.."]},
   {y:-4,r:["..........a.....",".........aa.....","........aaa.....","........aAa.....",".......alaa.....","......aaaaA.....",".....aaaaaaA....","....gggogggA....","..AAAAAAAAAAAA.."]},
   {y:-3,r:["........w.......",".......wow......","........w.......","................","................","....g.g..g.g....","....gggoggg....."],p:{w:'#ffffff'}}],
  L:[{y:0,r:["....d.....d.....","....d..d..dd....","....dd.dd.dd....","....drdddrdd....","....DDDDDDDD...."],p:{d:'#6a6a78',D:'#34323a',r:'#e0303a'}},
   {y:-3,r:["......s.s.......","...s..sss..s....","....s.sSs.s.....","................","......dddd......",".....dllldd.....","....dllddddD....","....dSSSSSDD....","....D...d..D....","....D......D...."],p:{d:'#ffd24a',D:'#b07a14',l:'#fff6c0',s:'#ffe080',S:'#ff9a1f'}}]},
 peito:{
  metal:[
   {y:8,p:{a:'#b8a070',A:'#8a7448',l:'#d8c898'},r:[".....llaaaA.....",".....aAaAaA.....",".....AaAaAA.....",".....AgAAAA....."]},
   {y:8,r:["...aAlalalaAa...",".....AaAaAa.....",".....aAaAaA.....",".....AAgAAA....."]},
   {y:7,r:["..aal......laa..","..alAllaaaAalA..",".....laaaaA.....",".....aAlaAA.....",".....AAggAA.....",".....A....A....."]},
   {y:6,r:["..l..........l..","..al........la..","..alAllaaaAalA..",".....laAgaA.....",".....aggggA.....",".....AAgAAA.....",".....o....o....."]}],
  leather:[
   {y:8,r:[".....aa..aA.....",".....aa..aA.....",".....aA..AA.....",".....AgAAAA....."]},
   {y:8,r:["...aa.laaaaA....",".....aAaaaA.....",".....aaAaaA.....",".....AAgAAA....."]},
   {y:8,r:["...aAlaaaaga....",".....aaagaA.....",".....aagaaA.....",".....AgAAAA.....",".....A....A....."]},
   {y:7,r:[".....ffffff.....","..AAfaaaaafA....","..AA.aAaaaA.....",".AAA.aaAaaA.....",".AAA.AAgAAA.....",".AA.............",".A.............."],p:{f:'#e8dcc0'}}],
  cloth:[
   {y:8,r:[".....laaaaA.....",".....aaaaaA.....",".....aaaaaA.....",".....yyyyyy.....",".....aa..aA....."]},
   {y:8,r:["...aalaaaaAa....","..a..aaaaaA..A..","..a..aaaaaA..A..",".....aaaaaA.....","....aaaaaaaA....","....aaaaaaaA...."]},
   {y:7,r:[".....g....g.....","...aalaggaAa....","..a..aagaaA..A..","..a..aagaaA..A..",".....AAgAAA.....","....aaagaaaA....","....AAAgAAAA...."]},
   {y:5,r:["...g........g...","...gg......gg...","...ggg....ggg...","..ggalaooaAgg...","..a..aaoaaA..A..","..a..aoaoaA..A..",".....AAgAAA.....","....aaaoaaaA....","...gggggggggg..."]}],
  L:[{y:6,r:["..e..........e..","..re........er..","..rRrerererRrR..",".....erereR.....",".....rereRR.....",".....RGRGRR.....",".....R....R....."],p:{r:'#c8302a',R:'#7a1a18',e:'#ff7a5a',G:'#ffd24a'}},
   {y:8,r:["...nnwnnnnNn....","..n..nnwnnN..N..","..n..wnnnwN..N..",".....NNGNNN.....","....nnwnnnnN....","....NnnnwnNN...."],p:{n:'#2a3a7a',N:'#1a2450',w:'#e8f0ff',G:'#e8b43c'}}]},
 botas:{
  any:[
   {y:13,m:'leather',r:[".....A...A......",".....aA..aA....."]},
   {y:12,m:'leather',r:[".....aa..aa.....",".....gA..gA.....",".....AA..AA....."]},
   {y:12,m:'metal',r:[".....la..la.....",".....aA..aA.....",".....AA..AA....."]},
   {y:12,m:'metal',p:{w:'#ffffff'},r:["...w.la.wla.....","..ww.aA.waA.....",".....AA..AA....."]}],
  L:[{y:12,r:[".....cc..cc.....","....wcC.wcC.....","...w.CC.wCC....."],p:{c:'#a8e0ff',C:'#5a9ad8',w:'#ffffff'}},
   {y:12,r:[".....zd..zd.....",".....dz..dz.....",".....DD..DD....."],p:{d:'#3a3a5a',D:'#24243a',z:'#ffe040'}}]}};
// qual desenho: lendária pelo nome (cada uma tem o seu), as outras pelo nível do item; botas não dependem da classe
function armKind(it){if(it.rar===4){const i=(LEG[it.slot]||[]).indexOf(it.base||it.name);return i<0?4:4+i;}return tierOf(it);}
function armArt(it){const T=ARM[it.slot],k=armKind(it);if(k>=4)return T.L[k-4];return(T[CSTYLE[it.cls]]||T.any||T.metal)[k];}
const armPal=(it,art)=>Object.assign({},MATS[art.m||CSTYLE[it.cls]||'metal'][it.rar],{y:'#8a5a2c',Y:'#5a3a1a',n:'#f0e6d0',o:RARC[it.rar]},art.p);
function putArm(set,art){art.r.forEach((r,j)=>{for(let i=0;i<r.length;i++)if(r[i]!=='.')set(i,art.y+j,r[i]);});}
// ícone da armadura na bolsa: a peça em cima de um boneco apagado, recortada na parte do corpo dela e ampliada 2× (num quadro de 30, os pontos saem do tamanho dos das armas)
const ARMCUT={elmo:[1,-4,13,13],peito:[1,5,13,10],botas:[2,11,11,4]},aicCache={};
function armIcon(it){const art=armArt(it),id=it.slot+CSTYLE[it.cls]+armKind(it)+'_'+it.rar;if(aicCache[id])return aicCache[id];const pal=armPal(it,art),[cx,cy,cw,ch]=ARMCUT[it.slot],sc=2;
 const G=Array.from({length:ch+2},()=>Array(cw+2).fill(null));putArm((x,y,c)=>{x-=cx-1;y-=cy-1;if(G[y]&&x>=0&&x<cw+2&&pal[c])G[y][x]=pal[c];},art);
 const O=outlineG(G),c=cnv(30,30),x=c.getContext('2d'),ox=Math.floor((30-(cw+2)*sc)/2),oy=Math.floor((30-(ch+2)*sc)/2);x.fillStyle='rgba(60,40,30,.3)';
 BODY.forEach((r,y)=>{for(let i=0;i<r.length;i++){const gx=i-cx+1,gy=y-cy+1;if(r[i]!=='.'&&gy>=0&&gy<ch+2&&gx>=0&&gx<cw+2&&!O[gy][gx])x.fillRect(ox+gx*sc,oy+gy*sc,sc,sc);}});
 O.forEach((r,gy)=>r.forEach((col,gx)=>{if(col){x.fillStyle=col;x.fillRect(ox+gx*sc,oy+gy*sc,sc,sc);}}));return aicCache[id]=toURL(c,3);}
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
 for(const slot of['botas','peito','elmo','arma']){const it=eq[slot];if(!it)continue;
  if(slot==='arma'){const art=weapArt(it),pal=weapPal(it,art);putArt((x,y,c)=>{if(x>=0&&x<HGW&&y>=0&&y<HGH&&pal[c])G[y][x]=pal[c];},art,HOX+13,HOY+10);continue;}
  const art=armArt(it),pal=armPal(it,art);putArm((x,y,c)=>{x+=HOX;y+=HOY;if(x>=0&&x<HGW&&y>=0&&y<HGH&&pal[c])G[y][x]=pal[c];},art);}
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
function heroSpr(){const eq=P.equip;const k=P.cls+'|'+['botas','peito','elmo','arma'].map(s=>eq[s]?`${s}${eq[s].cls}${s==='arma'?weapKind(eq[s]):armKind(eq[s])}${eq[s].rar}`:'').join('|');
 if(k!==lookKey){lookKey=k;reg('hero',composeHero(P.cls,eq));const pc=$('portrait').getContext('2d');pc.clearRect(0,0,16,16);pc.drawImage(SPR.hero.n,HOX,HOY,16,16,0,0,16,16);}return'hero';}
function lookFx(){if(R()<.2&&Object.values(P.equip).some(it=>it&&it.rar===4))parts.push({x:P.x+rf(-6,6),y:P.y-rf(0,16),vx:0,vy:-14,g:0,life:.7,max:.7,color:pick(['#ff9a1f','#ffd24a']),s:1});
 const w=P.equip.arma;if(w&&w.rar>=3&&!P.form&&R()<.12)parts.push({x:P.x+P.face*rf(4,7),y:P.y-rf(9,19),vx:0,vy:-8,g:0,life:.5,max:.5,color:pick([RARC[w.rar],'#ffffff']),s:1});}
