// Ecos de Valdoria — Pinheiral, Encostas, monstros novos e comportamentos
'use strict';
// ================== REGIÃO DE PINHEIRAL ==================
const PINE={5:{l:'#5aa068',m:'#2f6e44',d:'#1f4a30',t:'#5a3a22'},6:{l:'#62a870',m:'#347a4a',d:'#224e34',t:'#5a3a22'}};
function genPine(p,rng){const c=cnv(16,24),x=c.getContext('2d');x.fillStyle=K;x.fillRect(6,18,4,6);x.fillStyle=p.t;x.fillRect(7,18,2,5);
 for(const[y0,y1,w]of[[1,9,4],[6,14,6],[11,19,7.5]])for(let y=y0;y<=y1;y++){const hw=Math.max(.5,(y-y0+1)/(y1-y0+1)*w);
  for(let i=0;i<16;i++){const dx=i-7.5;if(Math.abs(dx)>hw)continue;let col=Math.abs(dx)>hw-1||y===y1?K:dx<-1?p.l:dx>1.5?p.d:p.m;if(col!==K&&rng()<.12)col=rng()<.5?p.d:p.l;x.fillStyle=col;x.fillRect(i,y,1,1);}}
 return c;}
{const rng=mulberry32(777);for(const z of[5,6])for(let v=0;v<4;v++)reg(`tree${z}_${v}`,genPine(PINE[z],rng));}
reg('house3',genHouse('#3a4a5a','#26303a'));reg('house4',genHouse('#6a3a34','#442420'));
def('lampiao',["","......kkkk......",".....krrrrk.....","....krryyrrk....","....krryyrrk....",".....kRRRRk.....","......kkkk......",".......kk.......","......kwwk......","......kwwk......","......kwwk......","......kwwk......","......kwwk......","......kwwk......",".....kwwwwk.....",".....kkkkkk....."],{r:'#d8403a',R:'#8a2020',y:'#ffd86a',w:'#5a3a1a'});
const MUSH=["","","","","......kkkk......","....kkCCCCkk....","...kCClCCCCCk...","..kCCllCCwCCCk..","..kCwCCCCCCCCk..","..kkCCCCCCwCkk..","...kkkkkkkkkk...","....kbbbbbbk....","....kbebbebk....","....kbbbbbbk....",".....kbbbbk.....","......kkkk......"];
def('esporinho',MUSH,{C:'#d8743a',l:'#ffb080',w:'#fff4e0',b:'#efe0c0',e:K});
def('esporov',MUSH,{C:'#8a3aa0',l:'#c070d0',w:'#c8ff60',b:'#d8d0e0',e:K});
def('esquilo',["","",".kkk............","kTTTk...........","kTttTk.....k.k..","kTtttk....kOkOk.","kTtttTk..kOOOOk.",".kTtttTkkOOeOOkk","..kTttkOOOOOOk..","...kkkOOOwwOOk..",".....kOOwwwOk...",".....kOOOOOOk...","......kOkkOk....","......kk..kk...."],{T:'#8a4a1a',t:'#d8783a',O:'#c8642a',w:'#f4d8b0',e:K});
def('verme',["","","","","","","","...........kkk..","..........kPPPk.","..kkk....kPPePk.",".kPPPk..kPpPPk..","kPpPPPkkPpPPk...","kPPpPPPPPpPk....",".kPPPpPPPPk.....","..kkkkkkkk......"],{P:'#d87a9a',p:'#9a4a6a',e:K});
const WILLOW=["....kkkkkkk.....","..kkLLLlLLLkk...",".kLLlLLLLLlLLk..","kLLLLLLLLLLLLLk.","kLkLLkbbbkLLkLk.","kLkLkbbbbbkLkLk.",".kLkbebbebbkLk..","..kkbbbbbbbkk...","..kbkbbmmbbkbk..",".kbk.kbbbbk.kbk.",".kk..kbbbbk..kk.",".....kbBbbk.....","....kbbBbbbk....","...kbbkbbkbbk...","..kbk.kbk..kbk..","..kk...kk...kk.."];
def('salgueiro',WILLOW,{L:'#7ab04a',l:'#b0e070',b:'#8a6a42',B:'#5a4226',e:'#ffe040',m:'#3a2a1a'});
def('salgueiroA',WILLOW,{L:'#5a7a3a',l:'#8aa060',b:'#6a5238',B:'#3a2a1e',e:'#ff6a3a',m:'#1a0a0a'});
def('guaxinim',["","...kk....kk.....","..kGGk..kGGk....","..kGGGkkGGGk....",".kGGGGGGGGGGk...",".kGmmGGGGmmGk...",".kmeemGGmeemk...",".kGmmGwwGmmGk...","..kGGwkkwGGk....","...kkGGGGkk.....","..kGGwwwwGGk....",".kGkGwwwwGkGk...","..k.kGGGGk.k.kk.","....kGkkGk..kTTk","....kkk.kkk.kTk."],{G:'#8a8a92',m:'#2a2a30',e:'#ffffff',w:'#e8e4dc',T:'#5a5a62'});
def('jiboia',["","","","","","..........kkkk..",".........kSSeSk.",".........kSSSSkk","..kkkkk...kSSk..",".kSsSsSk..kSk...","kSsSsSsSkkSSk...","kSSkkkkSSSSk....","kSsk..kSsSk.....",".kSSkkSSsSk.....","..kSSSSSSk......","...kkkkkk......."],{S:'#5a9a3a',s:'#c8b040',e:K});
def('pegrande',["",".....kkkkk......","....kFFFFFk.....","...kFfffffFk....","...kFfefefFk....","...kFffmffFk....","..kkFFfffFFkk...",".kFFFFFFFFFFFk..","kFFkFFFFFFFkFFk.","kFFkFFfffFFkFFk.","kfk.kFfffFk.kfk.","kk..kFFFFFk..kk.","....kFFkFFk.....","...kFFk.kFFk....","..kffFk.kFffk...","..kkkkk.kkkkk..."],{F:'#7a5a3a',f:'#b08a60',e:K,m:'#3a2a1a'});
def('lanterna',["","","......kkkk......",".....kRRRRk.....","....kRrrrrRk....","...kRryyyyrRk...","...kryeyyeyrk...","...kryyyyyyrk...","...kRrymmyrRk...","....kRrrrrRk....",".....kRRRRk.....","......kkkk......",".......kk.......","......koOk......",".......oo.......","........o......."],{r:'#e8503a',R:'#9a2a1a',y:'#ffd86a',e:K,m:'#8a2a0a',o:'#ffb040',O:'#fff0a0'});
def('duende',["","......k.........",".....kHk........","....kGGGk....kk.","...kGGGGGk..kCCk","...kGeGeGk..kCCk","...kGGGGGk..kCk.","...kGwmwGk.kCk..","....kGGGk.kCk...","...kkBBBkkCk....","..kGkBBBkGk.....","..kk.BBB.kk.....","....kbbbk.......","....kGkGk.......","...kGk.kGk......","...kkk.kkk......"],{G:'#5aa0b0',H:'#e8e0c0',e:'#ffe040',w:'#ffffff',m:K,B:'#c0402a',b:'#6a3a1a',C:'#8a5a2c'});
def('totem',[".....kkkkkk.....","....kRRRRRRk....","..kkkkkkkkkkkk..","..kWWWWWWWWWWk..","...kWkkWWkkWk...","...kWeeWWeeWk...","...kWWWWWWWWk...","...kWWWkkWWWk...","...kWkwwwwkWk...","...kWkwkkwkWk...","...kWWkkkkWWk...","...kWWWWWWWWk...","...kRWRWRWRWk...","...kWWWWWWWWk...","..kkkkkkkkkkkk..","..kSSSSSSSSSSk.."],{W:'#9a8468',R:'#c8323a',e:'#ff4a3a',w:'#ffffff',S:'#6a5a48'});
def('raposa',["","","..kk........k.k.",".kQQk......kQkQk","kQqQQk....kQQQQk","kQqqQQk..kQQeQQk",".kQqqQQkkQQQQQkk","..kQqQQQQQQQQk..","kkkQQQQQQQQQk...","kQqQQQQQQQQk....",".kQQkQQQQkQk....","..kk.kQk.kQk....",".....kQk.kQk....",".....kkk.kkk...."],{Q:'#f4efe0',q:'#ffb040',e:'#b03030'});
Object.assign(MDEF,{
 esporinho:{n:'Esporinho',hp:26,atk:4,def:1,spd:34,xp:9,r:6,aggro:45,cd:1.4},
 esquilo:{n:'Esquilo Ruivo',hp:24,atk:5,def:1,spd:75,xp:9,r:5,aggro:60,cd:1},
 verme:{n:'Verme-de-Cauda',hp:40,atk:7,def:2,spd:40,xp:13,r:6,aggro:60,cd:1.2},
 esporov:{n:'Esporo Venenoso',hp:38,atk:6,def:2,spd:34,xp:14,r:6,aggro:55,cd:1.4,poison:1},
 salgueiro:{n:'Salgueiro Vivo',hp:80,atk:10,def:5,spd:26,xp:20,r:8,aggro:60,cd:1.6},
 guaxinim:{n:'Guaxinim Trapaceiro',hp:55,atk:10,def:3,spd:60,xp:22,r:6,aggro:30,cd:1,disguise:'esporinho'},
 jiboia:{n:'Jiboia',hp:65,atk:11,def:4,spd:44,xp:19,r:7,aggro:70,cd:1.3},
 salgueiroA:{n:'Salgueiro Ancião',hp:120,atk:14,def:7,spd:24,xp:30,r:9,aggro:65,cd:1.7,scale:1.2,slam:{every:6,r:32,mult:1.5,delay:1}},
 pegrande:{n:'Pé-Grande',hp:130,atk:16,def:6,spd:42,xp:32,r:9,aggro:75,cd:1.5,scale:1.15,slam:{every:5,r:28,mult:1.6,delay:.9}},
 lanterna:{n:'Lanterna Errante',hp:70,atk:14,def:3,spd:48,xp:28,r:6,aggro:80,cd:1.2,fly:1},
 duende:{n:'Duende do Porrete',hp:90,atk:16,def:5,spd:70,xp:32,r:6,aggro:80,cd:.9,steal:1},
 totem:{n:'Totem Guardião',hp:200,atk:24,def:12,spd:0,xp:40,r:8,aggro:45,cd:1.4,slam:{every:4,r:40,mult:1.4,delay:1}},
 raposa:{n:'Raposa Espiritual',hp:95,atk:17,def:5,spd:58,xp:36,r:7,aggro:90,cd:1.6,ranged:80}});
const mproj=[];
function monSpecial(m,dt,dP){const d=m.d;if(d.clone){m.life=(m.life??12)-dt;if(m.life<=0||!m.fake||m.fake.dead){m.dead=true;burst(m.x,m.y-12,'#c8c8c8',14,40);return true;}}if(d.ai&&bossAI(m,dt,dP))return true;
 if(m.disguise){m.disguise=null;m.name=d.n+(m.elite?' Elite':'');burst(m.x,m.y-8,'#c8c8c8',16,50);addText(m.x,m.y-22,'!','#ffd24a',true);}
 if(d.ranged&&!P.dead&&dP<=d.ranged&&dP>24){m.moving=false;m.face=P.x>m.x?1:-1;
  if(m.atkT<=0){m.atkT=d.cd;const a=Math.atan2(P.y-8-(m.y-mh(m)/2),P.x-m.x);mproj.push({x:m.x,y:m.y-mh(m)/2,vx:Math.cos(a)*120,vy:Math.sin(a)*120,life:1.4,m,c:d.projC||'#9ad8ff',arrow:d.arrow});}return true;}
 if(d.fly&&dP>m.r+6){if(m.rootT>0)return true;const spd=m.spd*(m.slowT>0?.45:1);m.x+=(P.x-m.x)/dP*spd*dt;m.y+=(P.y-m.y)/dP*spd*dt;m.face=P.x>m.x?1:-1;m.moving=true;return true;}
 return false;}
function onMonHit(m,d){if(!m||P.dead)return;
 if(m.d.poison&&R()<.5){P.pdot={t:4,acc:0,dps:Math.max(1,Math.round(d*.3))};addText(P.x,P.y-32,'Envenenado!','#7dff5a');}
 if(m.d.steal&&P.gold>0){const a=Math.min(P.gold,Math.ceil(P.gold*.03)+m.lvl);P.gold-=a;m.stolen=(m.stolen||0)+a;addText(P.x,P.y-32,'-'+a+'g roubado!','#ffd24a');}}
function tickPay(dt){
 if(P.pdot&&!P.dead){P.pdot.t-=dt;P.pdot.acc+=dt;if(P.pdot.acc>=1){P.pdot.acc-=1;P.hp-=P.pdot.dps;addText(P.x+rf(-4,4),P.y-22,'-'+P.pdot.dps,'#7dff5a');burst(P.x,P.y-8,'#7dff5a',4,20);
   if(P.hp<=0){P.hp=0;P.pdot=null;die(null);return;}}if(P.pdot&&P.pdot.t<=0)P.pdot=null;}
 for(let i=mproj.length-1;i>=0;i--){const p=mproj[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(R()<.5)parts.push({x:p.x,y:p.y,vx:0,vy:0,g:0,life:.25,max:.25,color:p.c,s:1});
  if(!P.dead&&hyp(p.x-P.x,p.y-(P.y-8))<8){mproj.splice(i,1);hurtPlayer(p.m.atk*weakOf(p.m),p.m,p.mult||1.2);
   if(p.pull)sethkarPull(p.m);if(p.curse&&!P.dead){P.pdot={t:4,acc:0,dps:Math.max(1,Math.round(p.m.atk*.25))};addText(P.x,P.y-32,'Amaldiçoado!','#c060ff');} // golpes do Rei Sethkar (27)
  burst(p.x,p.y,p.c,8,40);continue;}
  if(p.life<=0||blocked(p.x,p.y+8,1))mproj.splice(i,1);}}
// a atadura do Rei Sethkar (27): faixa clara com pontas escuras
function faixaLine(x0,y0,x1,y1){ctx.strokeStyle='#1b1320';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.strokeStyle='#d8ccb0';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#a89a78';ctx.fillRect(x1-2,y1-2,4,4);}
function drawMProj(){if(FAIXA&&!FAIXA.dead&&mons.includes(FAIXA))faixaLine(FAIXA.x,FAIXA.y-mh(FAIXA)/2,P.x,P.y-8);for(const p of mproj){if(p.pull){faixaLine(p.m.x,p.m.y-mh(p.m)/2,p.x,p.y);continue;}if(p.arrow){const sp=hyp(p.vx,p.vy);ctx.strokeStyle=p.c;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-p.vx/sp*7,p.y-p.vy/sp*7);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(p.x-.5,p.y-.5,1,1);continue;}ctx.globalAlpha=.45;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,4,0,6.29);ctx.fill();ctx.globalAlpha=1;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,1.5,0,6.29);ctx.fill();}}
