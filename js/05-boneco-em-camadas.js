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
  rect(s,5,14,6,14,'a');rect(s,9,14,10,14,'a');if(t===1){rect(s,5,13,6,13,'a');rect(s,9,13,10,13,'a');s(6,14,'A');s(10,14,'A');}},
 arma:{
  guerreiro:(s,t)=>{if(t===2){rect(s,13,2,13,11,'Y');rect(s,14,2,15,5,'a');s(15,3,'l');s(12,2,'A');s(12,3,'A');return;}
   s(13,10,'Y');s(13,11,'g');
   if(t===3){rect(s,13,1,13,8,'l');rect(s,14,1,14,8,'a');s(13,3,'g');s(13,6,'g');s(13,0,'l');rect(s,11,9,15,9,'g');return;}
   rect(s,12,9,14,9,'g');if(t===0){rect(s,13,5,13,8,'l');s(13,4,'a');}else{rect(s,13,2,13,8,'l');rect(s,14,3,14,8,'A');s(13,1,'a');}},
  mago:(s,t)=>{if(t===0){rect(s,13,6,13,11,'y');s(13,5,'g');return;}rect(s,13,2,13,13,'y');rect(s,13,9,13,10,'Y');
   if(t===1){s(13,1,'Y');s(12,1,'Y');s(14,1,'Y');return;}rect(s,12,0,14,1,'o');s(13,0,'l');if(t===3){s(11,1,'g');s(11,0,'g');s(15,1,'g');s(15,0,'g');}},
  arqueira:(s,t)=>{const lo=t===0?5:2,hi=t===0?12:14,wood=t===3?'A':'y';rect(s,14,lo+1,14,hi-1,wood);s(13,lo,wood);s(13,hi,wood);rect(s,12,lo+1,12,hi-1,'n');
   if(t>=2){s(13,lo,'l');s(13,hi,'l');}if(t===3){s(14,8,'g');s(14,9,'g');s(12,lo,'y');s(12,hi,'y');}}}};
function composeGrid(cls,eq){const G=Array.from({length:16},()=>Array(16).fill(null));
 const bp={k:K,h:HAIR[cls],s:'#f1c7a0',S:'#c8906c',e:K,t:'#b8a888',p:'#4a3f36',b:'#3a2a1e'};
 BODY.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(bp[r[x]])G[y][x]=bp[r[x]];});
 if(cls==='arqueira'){G[6][4]=G[6][3]=G[7][3]=G[8][3]=HAIR.arqueira;}
 for(const slot of['botas','peito','elmo','arma']){const it=eq[slot];if(!it)continue;const st=CSTYLE[it.cls]||'metal',t=tierOf(it);
  const mat=slot==='botas'?(t>=2?'metal':'leather'):slot==='arma'?'metal':st;
  const pal=Object.assign({},MATS[mat][it.rar],{y:'#8a5a2c',Y:'#5a3a1a',n:'#f0e6d0',o:RARC[it.rar]});
  const set=(x,y,c)=>{if(x>=0&&x<16&&y>=0&&y<16&&pal[c])G[y][x]=pal[c];};
  if(slot==='arma')DRAW.arma[it.cls](set,t);else if(slot==='botas')DRAW.botas(set,t);else DRAW[slot][st](set,t);}
 const O=G.map(r=>r.slice());
 for(let y=0;y<16;y++)for(let x=0;x<16;x++)if(!G[y][x])for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=G[y+dy]&&G[y+dy][x+dx];if(c&&c!==K){O[y][x]=K;break;}}
 return O;}
function composeHero(cls,eq){const G=composeGrid(cls,eq),c=cnv(16,16),x=c.getContext('2d');G.forEach((r,y)=>r.forEach((col,i)=>{if(col){x.fillStyle=col;x.fillRect(i,y,1,1);}}));return c;}
const starterEq=cls=>({arma:{cls,ilvl:1,rar:0,slot:'arma'},peito:{cls,ilvl:1,rar:0,slot:'peito'}});
const previewLook=cls=>composeHero(cls,starterEq(cls));
let lookKey='';
function heroSpr(){const eq=P.equip;const k=P.cls+'|'+['botas','peito','elmo','arma'].map(s=>eq[s]?`${s}${eq[s].cls}${tierOf(eq[s])}${eq[s].rar}`:'').join('|');
 if(k!==lookKey){lookKey=k;reg('hero',composeHero(P.cls,eq));const pc=$('portrait').getContext('2d');pc.clearRect(0,0,16,16);pc.drawImage(SPR.hero.n,0,0);}return'hero';}
function lookFx(){if(R()<.2&&Object.values(P.equip).some(it=>it&&it.rar===4))parts.push({x:P.x+rf(-6,6),y:P.y-rf(0,16),vx:0,vy:-14,g:0,life:.7,max:.7,color:pick(['#ff9a1f','#ffd24a']),s:1});}
