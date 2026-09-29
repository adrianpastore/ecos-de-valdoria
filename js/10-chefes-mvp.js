// Ecos de Valdoria — Chefes MVP das Encostas
'use strict';
// ================== CHEFES DAS ENCOSTAS (MVP) ==================
def('mestreMasc',["","...kk....kk.....","..kGGk..kGGk....","..kGGGkkGGGk....",".kGGGGGGGGGGk...",".kGmmGGGGmmGk...",".kmeemGGmeemk...",".kGmmGwwGmmGk...","..kGGwkkwGGk....","...kkGGGGkk.....","..kGGwwwwGGk....",".kGkGwwwwGkGk...","..k.kGGGGk.k.kk.","....kGkkGk..kTTk","....kkk.kkk.kTk."],{G:'#6a5a8a',m:'#c8a030',e:'#ff3030',w:'#f0e8d8',T:'#4a3a6a'});SPR.mascaraClone=SPR.mestreMasc;
def('totemAnciao',[".....kkkkkk.....","....kRRRRRRk....","..kkkkkkkkkkkk..","..kWWWWWWWWWWk..","...kWkkWWkkWk...","...kWeeWWeeWk...","...kWWWWWWWWk...","...kWWWkkWWWk...","...kWkwwwwkWk...","...kWkwkkwkWk...","...kWWkkkkWWk...","...kWWWWWWWWk...","...kRWRWRWRWk...","...kWWWWWWWWk...","..kkkkkkkkkkkk..","..kSSSSSSSSSSk.."],{W:'#6a5a48',R:'#e8b030',e:'#40e0ff',w:'#ffffff',S:'#4a3a2a'});
def('raposaAnc',["","","..kk........k.k.",".kQQk......kQkQk","kQqQQk....kQQQQk","kQqqQQk..kQQeQQk",".kQqqQQkkQQQQQkk","..kQqQQQQQQQQk..","kkkQQQQQQQQQk...","kQqQQQQQQQQk....",".kQQkQQQQkQk....","..kk.kQk.kQk....",".....kQk.kQk....",".....kkk.kkk...."],{Q:'#ffe0a0',q:'#ff5a1a',e:'#8a1010'});
Object.assign(MDEF,{
 mestreMasc:{n:'Mestre das Máscaras',hp:450,atk:14,def:6,spd:62,xp:400,r:9,aggro:110,cd:1,scale:1.8,boss:true,ai:'mascaras'},
 mascaraClone:{n:'Mestre das Máscaras',hp:1,atk:6,def:0,spd:62,xp:0,r:9,aggro:200,cd:1.2,scale:1.8,clone:true},
 totemAnciao:{n:'Grande Totem Ancião',hp:520,atk:26,def:14,spd:0,xp:800,r:14,aggro:120,cd:1.4,scale:2.4,boss:true,ai:'totemA'},
 raposaAnc:{n:'Raposa Anciã de Nove Caudas',hp:650,atk:28,def:10,spd:72,xp:1300,r:12,aggro:140,cd:1.4,scale:2.2,boss:true,ai:'raposa9'}});
// Senhor dos Ossos: rei esqueleto de manto roxo e cajado, no fundo da Caverna (o mapa ganha o chefe em 11)
def('senhorOssos',["....kckckk...ko.","....kccccck.kook","...kbbbbbbbk.kT.","...kbeebeebk.kT.","...kbbbkbbbk.kT.","....kbwbwbk..kT.","...kkRkkkRkk.kT.","..kRRrbbbrRRkkT.",".kRRrRbbbRrRRbT.",".kRkrRRbRRrRkkT.",".kbkRRRRRRRRk.T.","...kRRrRRrRRk.T.","..kRRrRRRRrRRkT.","..kRrRRRRRRrRkT.",".kRRRRRRRRRRRRkT",".kkkkkkkkkkkkkkT"],
 {c:'#e8b43c',b:'#e8e2cc',e:'#b060ff',w:'#a9a28a',R:'#3a2450',r:'#5a3a78',T:'#7a5a2a',o:'#60ff9a'});
MDEF.senhorOssos={n:'Senhor dos Ossos',hp:600,atk:30,def:14,spd:36,xp:1600,r:13,aggro:140,cd:1.5,scale:2.4,boss:true,ai:'ossos'};
Object.assign(MAPS.encosta3,{boss:'mestreMasc',bossLv:15});Object.assign(MAPS.encosta5,{boss:'totemAnciao',bossLv:21});Object.assign(MAPS.encosta7,{boss:'raposaAnc',bossLv:28});MAPS.covil.bossLv=22;
for(const k of['encosta3','encosta5','encosta7'])MAPS[k].s+=' • chefe no alto do platô';
const BOSSAT={};
function bossSpot(){const M=MAPS[CUR];if(M.lair)return{x:(LAIR.x+.5)*TILE,y:(LAIR.y+.5)*TILE};
 // caverna não tem platô: o chefe fica no salão mais longe da escada de chegada (5×5 livre em volta)
 if(M.cave){const e=portalPt(M.home);let bi=-1,bd=-1;
  for(let y=3;y<H-3;y++)for(let x=3;x<W-3;x++){let ok=1;for(let j=-2;j<=2&&ok;j++)for(let k=-2;k<=2;k++){const q=(y+j)*W+x+k;if(solid[q]||!REACH[q]){ok=0;break;}}
   const dd=ok?hyp((x+.5)*TILE-e.x,(y+.5)*TILE-e.y):-1;if(dd>bd){bd=dd;bi=y*W+x;}}
  if(bd>0)return{x:(bi%W+.5)*TILE,y:(((bi/W)|0)+.5)*TILE};}
 const seen=new Uint8Array(W*H);let best=null;
 for(let s=0;s<W*H;s++){if(seen[s]||ground[s]!==G.HIGH||solid[s]||!REACH[s])continue;const comp=[],q=[s];seen[s]=1;
  while(q.length){const i=q.pop();comp.push(i);const x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,j=Y*W+X;if(X<0||Y<0||X>=W||Y>=H||seen[j]||ground[j]!==G.HIGH||solid[j])continue;seen[j]=1;q.push(j);}}
  if(!best||comp.length>best.length)best=comp;}
 if(!best){const t=randTile(M.theme);return{x:(t.x+.5)*TILE,y:(t.y+.5)*TILE};}
 let cx=0,cy=0;for(const i of best){cx+=i%W;cy+=(i/W)|0;}cx/=best.length;cy/=best.length;let bi=best[0],bd=1e9;
 for(const i of best){const dd=hyp(i%W-cx,((i/W)|0)-cy);if(dd<bd){bd=dd;bi=i;}}return{x:(bi%W+.5)*TILE,y:(((bi/W)|0)+.5)*TILE};}
function spawnBoss(announce){const M=MAPS[CUR],p=bossSpot(),b=makeMon(M.boss,p.x,p.y,M.bossLv||22,{zone:M.lair?4:M.theme});
 b.ai={swap:4,throw:2,quake:3,bolt:2,call:9,shot:1,nova:5,blink:8,rain:3};mons.push(b);
 if(announce){banner(`${b.name} apareceu!`,M.lair?'Algo ruge no covil.':M.cave?'Ossos estalam no fundo da caverna.':'Procure no alto das encostas.');log(`${b.name} apareceu em ${M.n}!`,'#ff6a4a');}}
function bossDead(m){const M=MAPS[CUR];BOSSAT[CUR]=time+(M.lair?180:240);dropLoot(m.x,m.y,{kind:'item',item:genItem(m.lvl+2,4,null,3)});
 for(const c of mons)if(c.d.clone||c.owner===m){c.dead=true;burst(c.x,c.y-10,'#c8c8c8',12,40);}
 banner('MVP!',`${P.name} derrotou ${m.name}`);log(`MVP! Você derrotou ${m.name}.`,'#ff9a1f');shake(4);
 for(let i=0;i<60;i++)parts.push({x:m.x+rf(-20,20),y:m.y-rf(0,30),vx:rf(-40,40),vy:rf(-120,-40),g:120,life:rf(.8,1.6),max:1.6,color:pick(['#ffd24a','#ff9a1f','#fff3b0','#ff5a3a']),s:2});save();}
function shootAt(m,a,sp,c,mult){mproj.push({x:m.x,y:m.y-mh(m)/2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:2.2,m,c,mult});}
function addsNear(type,lvl,n){for(let k=0;k<n;k++){for(let t=0;t<20;t++){const a=R()*6.28,r=rf(40,70),x=P.x+Math.cos(a)*r,y=P.y+Math.sin(a)*r;if(blocked(x,y,5))continue;
  const c=makeMon(type,x,y,Math.max(1,lvl),{state:'chase',zone:9});mons.push(c);burst(x,y-8,'#c8a0ff',14,50);break;}}}
function bossAI(m,dt,dP){const a=m.ai,d=m.d;for(const k in a)if(typeof a[k]==='number')a[k]-=dt;
 const aim=()=>Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);
 if(d.ai==='mascaras'){
  if(a.swap<=0&&dP<150){a.swap=9;const pts=[];for(let t=0;t<40&&pts.length<4;t++){const an=R()*6.28,r=rf(45,75),x=P.x+Math.cos(an)*r,y=P.y+Math.sin(an)*r;if(!blocked(x,y,6)&&pts.every(q=>hyp(q.x-x,q.y-y)>30))pts.push({x,y});}
   if(pts.length>=2){burst(m.x,m.y-12,'#c8c8c8',20,60);m.x=pts[0].x;m.y=pts[0].y;burst(m.x,m.y-12,'#c8c8c8',20,60);
    for(const q of pts.slice(1)){const c=makeMon('mascaraClone',q.x,q.y,m.lvl,{state:'chase',zone:9});c.maxHp=c.hp=1;c.fake=m;c.face=m.face;mons.push(c);burst(q.x,q.y-12,'#c8c8c8',20,60);}
    if(P.target===m||P.target&&P.target.d.clone){P.target=null;P.auto=false;}addText(P.x,P.y-34,'Qual é o verdadeiro?','#ffd24a');}}
  if(a.throw<=0&&dP<150){a.throw=2.2;shootAt(m,aim(),130,'#ffd24a',1.1);}
  return false;}
 if(d.ai==='totemA'){
  if(a.quake<=0&&dP<190){a.quake=7;[[45,1],[80,1.7],[115,2.4]].forEach(([r,dl])=>teles.push({x:m.x,y:m.y,r,t:0,delay:dl,m,mult:1.2,ring:true}));addText(m.x,m.y-mh(m)-8,'Tremor!','#ffb040',true);}
  if(a.bolt<=0&&dP<180){a.bolt=2.4;const b=aim();for(const o of[-.2,0,.2])shootAt(m,b+o,110,'#40e0ff',1);}
  if(a.call<=0&&dP<180){a.call=14;addsNear('totem',m.lvl-4,2);}
  return dP>m.r+6;}
 if(d.ai==='raposa9'){
  if(!a.called&&m.hp<m.maxHp*.5){a.called=1;addsNear('raposa',m.lvl-3,2);banner('A Raposa Anciã chama seus filhotes!','');}
  if(a.nova<=0&&dP<210){a.nova=7;for(let k=0;k<9;k++)shootAt(m,k/9*6.283,95,'#ff7a2a',1.3);addText(m.x,m.y-mh(m)-8,'Nove Chamas!','#ff9a4a',true);burst(m.x,m.y-12,'#ff7a2a',24,70);}
  if(a.blink<=0&&dP<230){a.blink=10;for(let t=0;t<20;t++){const an=R()*6.28,x=P.x+Math.cos(an)*80,y=P.y+Math.sin(an)*80;if(!blocked(x,y,6)){burst(m.x,m.y-12,'#ff9a4a',18,60);m.x=x;m.y=y;burst(x,y-12,'#ff9a4a',18,60);teles.push({x:P.x,y:P.y,r:34,t:0,delay:.9,m,mult:1.5,fire:true});break;}}}
  if(a.shot<=0&&dP<200){a.shot=1.4;const b=aim();for(const o of[-.25,0,.25])shootAt(m,b+o,120,'#ffb060',1);}
  const spd=m.spd*(m.slowT>0?.45:1);if(m.rootT>0)return true;
  // recua mais devagar do que o herói anda: quem luta corpo a corpo consegue alcançá-la (com a vida de chefe de 29/09/2026 ela era impossível)
  // e não recua para fora da própria área (lá ela voltaria para casa recuperando a vida)
  if(dP<70&&hyp(m.x-m.sx,m.y-m.sy)<170){stepSmart(m,(m.x-P.x)/dP*spd*.6*dt,(m.y-P.y)/dP*spd*.6*dt,6,m.side);m.moving=true;}else if(dP>130){stepSmart(m,(P.x-m.x)/dP*spd*dt,(P.y-m.y)/dP*spd*dt,6,m.side);m.moving=true;}else m.moving=false;
  m.face=P.x>m.x?1:-1;return true;}
 if(d.ai==='ossos'){const serv=mons.filter(c=>c.owner===m&&!c.dead);
  if(!a.rage&&m.hp<m.maxHp*.5){a.rage=1;a.call=0;banner('O Senhor dos Ossos se enfurece!','Os servos voltam a se erguer.');}
  if(a.call<=0&&dP<200){a.call=a.rage?9:13;raiseBones(m,Math.min(a.rage?3:2,4-serv.length));}
  if(a.rain<=0&&dP<200){a.rain=a.rage?4.5:6.5;for(let k=0;k<(a.rage?4:3);k++){const an=R()*6.28,r=k?rf(20,45):0;teles.push({x:P.x+Math.cos(an)*r,y:P.y+Math.sin(an)*r*.6,r:22,t:0,delay:1+k*.15,m,mult:1.1});}
   addText(m.x,m.y-mh(m)-8,'Chuva de Ossos!','#e8e2cc',true);}
  if(a.shot<=0&&dP<190){a.shot=a.rage?1.6:2.2;const b=aim();for(const o of[-.3,-.1,.1,.3])shootAt(m,b+o,115,'#e8e2cc',.9);}
  // cada servo vivo devolve vida ao chefe (0,05% da vida máxima por segundo; era 0,2% antes de a vida de chefe crescer): vale derrubar os esqueletos primeiro
  if(serv.length&&m.hp<m.maxHp){m.hp=Math.min(m.maxHp,m.hp+m.maxHp*.0005*serv.length*dt);
   if(R()<dt*3)for(const c of serv)parts.push({x:c.x,y:c.y-10,vx:(m.x-c.x)*1.25,vy:(m.y-12-c.y)*1.25,g:0,life:.8,max:.8,color:'#b060ff',s:2});}
  return false;}
 return false;}
// ergue esqueletos (guerreiros ou arqueiros) em volta do Senhor dos Ossos; somem quando ele morre
function raiseBones(m,n){for(let k=0;k<n;k++)for(let t=0;t<20;t++){const an=R()*6.28,r=rf(24,50),x=m.x+Math.cos(an)*r,y=m.y+Math.sin(an)*r;if(blocked(x,y,5))continue;
  const c=makeMon(R()<.5?'esqueleto':'esqArq',x,y,Math.max(1,m.lvl-4),{state:'chase',zone:9});c.owner=m;c.maxHp=c.hp=Math.round(c.maxHp*.5);mons.push(c);burst(x,y-8,'#b060ff',16,50);break;}} // servos com meia vida: renascem a cada 9–13 s
function drawRingTele(t){const f=t.t/t.delay;ctx.strokeStyle=`rgba(255,150,40,${.35+f*.5})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(t.x,t.y,t.r,t.r*.55,0,0,6.29);ctx.stroke();
 ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(t.x,t.y,t.r-32,(t.r-32)*.55,0,0,6.29);ctx.stroke();ctx.fillStyle=`rgba(255,120,30,${f*.25})`;ctx.beginPath();ctx.ellipse(t.x,t.y,t.r,t.r*.55,0,0,6.29);ctx.ellipse(t.x,t.y,t.r-32,(t.r-32)*.55,0,0,6.29,true);ctx.fill();}
