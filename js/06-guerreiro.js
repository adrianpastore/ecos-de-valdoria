// Ecos de Valdoria — Árvore do Guerreiro: Paladino, Berserker e Cavaleiro
'use strict';
// ================== CLASSES COM ÁRVORE ==================
const CLASS_TREE={mago:{base:'mago',free:'fogo',ic:'🔮',specs:['bruxo','necro','druida']},guerreiro:{base:'guerreiro',free:'giro',ic:'⚔️',specs:['paladino','berserker','cavaleiro']}};
const MIGR={guerreiro:['grito','execucao'],arqueira:['perfurante','chuva']};
const hasTree=c=>!!CLASS_TREE[c],CT=()=>CLASS_TREE[P.cls],classTrees=()=>[CT().base,...CT().specs];
Object.assign(TREES,{guerreiro:'Guerreiro',paladino:'Paladino',berserker:'Berserker',cavaleiro:'Cavaleiro'});
SPECS.bruxo.cls=SPECS.necro.cls=SPECS.druida.cls='mago';SPECS.bruxo.trial.kind='skill';Object.assign(SPECS.necro.trial,{kind:'type',typ:'esqueleto'});SPECS.druida.trial.kind='nasc';
Object.assign(SPECS,{
 paladino:{cls:'guerreiro',n:'Paladino',ap:'Aprendiz de Paladino',ic:'✨',cor:'#ffe07a',d:'Guerreiro da luz: cura a si mesmo, ergue escudos sagrados e pune com julgamento divino.',bonus:{hpPct:.05,defPct:.05},trial:{t:'Derrote 3 monstros Elite',goal:3,kind:'elite'}},
 berserker:{cls:'guerreiro',n:'Berserker',ap:'Aprendiz de Berserker',ic:'🪓',cor:'#ff6a5a',d:'Fúria pura: quanto mais ferido, mais forte. Rouba vida, faz sangrar e salta sobre os inimigos.',bonus:{atkPct:.08},trial:{t:'Derrote 20 monstros com menos da metade da vida',goal:20,kind:'lowhp'}},
 cavaleiro:{cls:'guerreiro',n:'Cavaleiro',ap:'Aprendiz de Cavaleiro',ic:'🛡️',cor:'#7fb2ff',d:'Muralha viva: investe contra o inimigo, atordoa com o escudo e bloqueia golpes.',bonus:{defPct:.1},trial:{t:'Resista a 60 golpes inimigos sem cair (morrer zera a contagem)',goal:60,kind:'hits'}}});
Object.assign(SK,{
 giro:{tree:'guerreiro',tier:1,lvl:1,max:5,act:1,ic:'🌀',n:'Golpe Giratório',type:'aoeSelf',mp:8,cd:4,r:38,color:'#e8eef5',m:[1.8,.25],d:e=>`Atinge todos ao seu redor: ${pc(e.mult)} de dano.`},
 vigor:{tree:'guerreiro',tier:1,lvl:2,max:5,ic:'❤️',n:'Vigor',pas:{hpPct:.06},d:e=>`+${e.r*6}% de vida máxima.`},
 grito:{tree:'guerreiro',tier:1,lvl:3,max:5,act:1,ic:'📣',n:'Grito de Guerra',type:'buff',mp:12,cd:18,dur:[8,1],batk:[.3,.05],bdef:[.3,.05],color:'#ff7a3a',d:e=>`+${pc(e.batk)} de ataque e +${pc(e.bdef)} de defesa por ${e.dur}s.`},
 pele:{tree:'guerreiro',tier:2,lvl:5,max:5,ic:'🪨',n:'Pele de Ferro',pas:{defPct:.05},d:e=>`+${e.r*5}% de defesa.`},
 execucao:{tree:'guerreiro',tier:2,lvl:6,max:5,act:1,ic:'💀',n:'Execução',type:'single',range:26,mp:14,cd:7,color:'#ff3a3a',m:[3.2,.4],d:e=>`Golpe brutal em um alvo: ${pc(e.mult)}.`},
 julgamento:{tree:'paladino',tier:1,lvl:10,max:5,act:1,ic:'🔆',n:'Julgamento',type:'aoeTarget',kind:'holy',r:30,delay:.15,range:140,mp:12,cd:5,color:'#ffe07a',m:[2.2,.3],d:e=>`Luz sagrada cai sobre o alvo: ${pc(e.mult)} em área.`},
 luz:{tree:'paladino',tier:1,lvl:10,max:5,act:1,ic:'💛',n:'Luz Curativa',type:'heal',mp:18,cd:12,heal:[.25,.05],d:e=>`Cura ${pc(e.heal)} da sua vida na hora.`},
 devocao:{tree:'paladino',tier:1,lvl:10,max:5,ic:'🙏',n:'Aura de Devoção',pas:{defPct:.05,hpPct:.03},d:e=>`+${e.r*5}% de defesa e +${e.r*3}% de vida.`},
 escudo:{tree:'paladino',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🔰',n:'Escudo Divino',type:'shield',mp:20,cd:20,dur:[8,0],shield:[.3,.05],color:'#ffe07a',d:e=>`Escudo que absorve até ${pc(e.shield)} da sua vida em dano por ${e.dur}s.`},
 consagracao:{tree:'paladino',tier:2,lvl:15,pts:4,max:5,ic:'🕯️',n:'Consagração',pas:{leech:.03},d:e=>`${e.r*3}% do dano causado volta como vida.`},
 juizo:{tree:'paladino',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🌟',n:'Juízo Final',type:'storm',r:70,range:170,mp:45,cd:22,color:'#ffe07a',m:[2,.35],hits:[7,2],d:e=>`${e.hits} colunas de luz caem na área em 4s: ${pc(e.mult)} cada.`},
 furia:{tree:'berserker',tier:1,lvl:10,max:5,act:1,ic:'😡',n:'Fúria Sangrenta',type:'buff',mp:10,cd:20,dur:[10,1],batk:[.4,.06],bdef:[-.25,0],color:'#ff3a3a',d:e=>`+${pc(e.batk)} de ataque por ${e.dur}s, mas −25% de defesa.`},
 selvagem:{tree:'berserker',tier:1,lvl:10,max:5,act:1,ic:'🩸',n:'Golpe Selvagem',type:'single',range:26,mp:10,cd:5,color:'#c0303a',m:[2.2,.25],bleed:[.6,.1],d:e=>`${pc(e.mult)} de dano e mais ${pc(e.bleed)} do golpe em sangramento por 4s.`},
 sede:{tree:'berserker',tier:1,lvl:10,max:5,ic:'🧛',n:'Sede de Sangue',pas:{leech:.04},d:e=>`${e.r*4}% do dano causado volta como vida.`},
 salto:{tree:'berserker',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🦘',n:'Salto Devastador',type:'leap',range:170,r:40,mp:18,cd:10,color:'#ff9a5a',m:[2,.3],d:e=>`Salta sobre o alvo e esmaga a área: ${pc(e.mult)}.`},
 frenesi:{tree:'berserker',tier:2,lvl:15,pts:4,max:5,ic:'🔥',n:'Frenesi',pas:{rage:.08},d:e=>`Até +${e.r*8}% de dano, quanto menos vida você tiver.`},
 avatar:{tree:'berserker',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'👹',n:'Avatar da Guerra',type:'buff',mp:40,cd:40,dur:[12,2],batk:[.6,.1],bdef:[.2,0],bspd:[20,5],color:'#ff3a3a',d:e=>`Por ${e.dur}s: +${pc(e.batk)} de ataque, +20% de defesa e +${e.bspd}% de velocidade.`},
 investida:{tree:'cavaleiro',tier:1,lvl:10,max:5,act:1,ic:'🐎',n:'Investida',type:'leap',range:170,r:26,root:1.5,mp:12,cd:8,color:'#9fc8ff',m:[1.6,.2],d:e=>`Avança até o alvo e o atordoa por 1,5s: ${pc(e.mult)}.`},
 escudada:{tree:'cavaleiro',tier:1,lvl:10,max:5,act:1,ic:'🛡️',n:'Golpe de Escudo',type:'single',range:26,root:2,mp:10,cd:6,color:'#9fc8ff',m:[1.8,.2],d:e=>`Atordoa o alvo por 2s: ${pc(e.mult)}.`},
 bastiao:{tree:'cavaleiro',tier:1,lvl:10,max:5,ic:'🏰',n:'Bastião',pas:{defPct:.07},d:e=>`+${e.r*7}% de defesa.`},
 muralha:{tree:'cavaleiro',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🧱',n:'Muralha de Escudos',type:'shield',mp:22,cd:24,dur:[10,0],shield:[.4,.06],color:'#9fc8ff',d:e=>`Absorve até ${pc(e.shield)} da sua vida em dano por ${e.dur}s.`},
 contra:{tree:'cavaleiro',tier:2,lvl:15,pts:4,max:5,ic:'⚔️',n:'Contra-ataque',pas:{block:.05},d:e=>`${e.r*5}% de chance de bloquear um golpe corpo a corpo e revidar (80%).`},
 estandarte:{tree:'cavaleiro',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🚩',n:'Estandarte de Guerra',type:'banner',r:70,mp:35,cd:40,dur:[15,3],d:e=>`Finca um estandarte por ${e.dur}s: dentro dele, −30% de dano recebido, 3% de vida por segundo e inimigos lentos.`}});
function eff(id,r){const s=SK[id];r=Math.max(1,r);const o={r};for(const k in s)if(Array.isArray(s[k]))o[k]=s[k][0]+s[k][1]*(r-1);
 o.mult=s.m?o.m:s.mult||1;o.jumps=Math.floor(o.j||0);o.hits=Math.round(o.hits||0);o.dur=Math.round(o.dur||s.dur||0);o.count=Math.round(o.n2||0);
 for(const k of['hpm','amp','heal','bleed','shield','batk','bdef','bspd','poison'])o[k]=o[k]||0;o.cap=2+(rk('ossos')>=3)+(rk('ossos')>=5);return o;}
function initSkills(){const ct=CLASS_TREE[P.cls];
 if(P.ranks&&P.ranks[P.cls+'0']){P.ranks=null;P.bar=null;}
 if(ct){if(!P.ranks){P.ranks={[ct.free]:1};const MIG=MIGR[P.cls];if(MIG){if(P.lvl>=3)P.ranks[MIG[0]]=1;if(P.lvl>=6)P.ranks[MIG[1]]=1;}}
  if(!P.bar){P.bar=[ct.free,null,null,null,null,null];let i=1;for(const id of(MIGR[P.cls]||[]))if(P.ranks[id])P.bar[i++]=id;}}
 else{P.ranks=P.ranks||{[P.cls+'0']:1,[P.cls+'1']:1,[P.cls+'2']:1};P.bar=P.bar||[P.cls+'0',P.cls+'1',P.cls+'2',null,null,null];}
 P.spec=P.spec||null;P.promo=P.promo||0;P.quest=P.quest||null;P.cd={};P.shield=null;P.banner=null;}
function trialKill(T,m,src){return T.kind==='skill'?(src==='skill'||src==='corpse'):T.kind==='type'?m.type===T.typ:T.kind==='elite'?(m.elite||m.boss):T.kind==='lowhp'?P.hp<P.st.hp*.5:T.kind==='clean'?!m.hurtP:false;}
function hitCount(){const q=P.quest;if(q&&!q.done&&SPECS[q.spec].trial.kind==='hits'){q.prog++;questCheck();}}
function preHurt(d,m,mult){if(m)m.hurtP=true;
 if(mult===1&&m&&P.st.block&&R()<P.st.block){addText(P.x,P.y-22,'Bloqueado!','#9fd0ff');burst(P.x+P.face*6,P.y-8,'#dfe6ef',8,40);if(!m.dead)hitMonster(m,.8,{src:'skill'});hitCount();return 0;}
 if(P.banner&&hyp(P.x-P.banner.x,P.y-P.banner.y)<P.banner.r)d*=.7;
 if(P.shield){const a=Math.min(P.shield.hp,d);P.shield.hp-=a;d-=a;if(a>0)addText(P.x+8,P.y-18,'('+Math.round(a)+')',P.shield.c);if(P.shield.hp<=0)P.shield=null;}
 hitCount();return Math.round(d);}
function tickWar(dt){if(P.shield){P.shield.t-=dt;if(P.shield.t<=0)P.shield=null;}
 if(P.banner){const b=P.banner;b.t-=dt;if(hyp(P.x-b.x,P.y-b.y)<b.r)P.hp=Math.min(P.st.hp,P.hp+P.st.hp*.03*dt);
  for(const m of mons)if(!m.dead&&hyp(m.x-b.x,m.y-b.y)<b.r)m.slowT=Math.max(m.slowT,.3);if(b.t<=0)P.banner=null;}
 for(const m of mons){if(m.dead||!m.dot)continue;m.dot.t-=dt;m.dot.acc+=dt;if(m.dot.acc>=1){m.dot.acc-=1;const dp=m.dot.dps,dc=m.dot.c||'#c0303a';if(m.dot.t<=0)m.dot=null;dealMonster(m,dp,false,{src:'dot'});if(!m.dead)burst(m.x,m.y-mh(m)/2,dc,4,30);}else if(m.dot.t<=0)m.dot=null;}}
function castWar(sk,e,t){switch(sk.type){
 case'heal':{const h=Math.round(P.st.hp*e.heal);P.hp=Math.min(P.st.hp,P.hp+h);addText(P.x,P.y-26,'+'+h,'#5dff7a');burst(P.x,P.y-8,'#ffe07a',24,60);fx.push({k:'ring',x:P.x,y:P.y-4,r0:4,r1:30,t:0,max:.4,color:'#ffe07a',w:2});return true;}
 case'shield':P.shield={hp:P.st.hp*e.shield,t:e.dur,c:sk.color};burst(P.x,P.y-8,sk.color,20,50);return true;
 case'banner':P.banner={x:P.x,y:P.y,t:e.dur,r:sk.r};burst(P.x,P.y-10,'#ff5a4a',20,50);log('Estandarte erguido!','#9fc8ff');return true;
 case'leap':{const a=Math.atan2(t.y-P.y,t.x-P.x),tx=t.x-Math.cos(a)*(t.r+8),ty=t.y-Math.sin(a)*(t.r+8);
  for(let k=0;k<12;k++)parts.push({x:P.x+(tx-P.x)*k/12,y:P.y-8+(ty-P.y)*k/12-Math.sin(k/12*Math.PI)*14,vx:0,vy:-8,g:0,life:.4,max:.4,color:sk.color,s:2});
  if(!blocked(tx,ty,4)){P.x=tx;P.y=ty;}P.dest=null;explode(t.x,t.y-6,sk.r,e.mult,sk.color,{src:'skill',root:sk.root});shake(3);P.target=t;P.auto=true;return true;}}
 return false;}
function drawPlayerFx(tt){drawPortals(tt);if(!P)return;drawTraps(tt);
 if(P.banner){const b=P.banner;ctx.strokeStyle='rgba(159,200,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(b.x,b.y,b.r,b.r*.55,0,0,6.29);ctx.stroke();
  ctx.fillStyle='#5a3a1a';ctx.fillRect(b.x,b.y-28,1,28);ctx.fillStyle='#c8323a';const w=Math.sin(tt*6);ctx.fillRect(b.x+1,b.y-27,8,6);ctx.fillRect(b.x+9,b.y-26+w,1,4);ctx.fillStyle='#ffd24a';ctx.fillRect(b.x+4,b.y-25,2,2);}
 if(P.shield){ctx.strokeStyle=P.shield.c;ctx.globalAlpha=.55+Math.sin(tt*6)*.2;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(P.x,P.y-8,10,12,0,0,6.29);ctx.stroke();ctx.globalAlpha=1;}
 for(const m of mons)if(m.dot&&!m.dead&&R()<.05)parts.push({x:m.x+rf(-3,3),y:m.y-mh(m)/2,vx:0,vy:20,g:0,life:.4,max:.4,color:'#c0303a',s:1});}
