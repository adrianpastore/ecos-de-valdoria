// Ecos de Valdoria — Árvore da Arqueira: Caçadora, Patrulheira e Assassina
'use strict';
// ================== ARQUEIRA ==================
CLASS_TREE.arqueira={base:'arqueira',free:'multi',ic:'🏹',specs:['cacadora','patrulheira','assassina']};
Object.assign(TREES,{arqueira:'Arqueira',cacadora:'Caçadora',patrulheira:'Patrulheira',assassina:'Assassina'});
Object.assign(SPECS,{
 cacadora:{cls:'arqueira',n:'Caçadora',ap:'Aprendiz de Caçadora',ic:'🐺',cor:'#d8a86a',d:'Luta ao lado de lobos leais, marca a presa e comanda a matilha.',bonus:{hpPct:.05,atkPct:.04},trial:{t:'Derrote 15 Lobos Cinzentos',goal:15,kind:'type',typ:'lobo'}},
 patrulheira:{cls:'arqueira',n:'Patrulheira',ap:'Aprendiz de Patrulheira',ic:'🎯',cor:'#8ad04a',d:'Controla o campo com armadilhas, redes e rajadas de flechas, sempre a um passo de distância.',bonus:{atkPct:.06},trial:{t:'Derrote 12 Aranhas do Pântano',goal:12,kind:'type',typ:'aranha'}},
 assassina:{cls:'arqueira',n:'Assassina',ap:'Aprendiz de Assassina',ic:'🗡️',cor:'#b070ff',d:'Some nas sombras, envenena e termina o serviço com golpes letais.',bonus:{atkPct:.08},trial:{t:'Derrote 20 monstros sem levar nenhum golpe deles',goal:20,kind:'clean'}}});
Object.assign(SK,{
 multi:{tree:'arqueira',tier:1,lvl:1,max:5,act:1,ic:'🎯',n:'Tiro Múltiplo',type:'proj',count:5,spread:.7,mp:8,cd:3,color:'#ffe08a',speed:270,size:2,range:190,arrow:1,m:[1.1,.12],d:e=>`5 flechas em leque: ${pc(e.mult)} cada.`},
 aguia:{tree:'arqueira',tier:1,lvl:2,max:5,ic:'🦅',n:'Olhos de Águia',pas:{crit:2},d:e=>`+${e.r*2}% de chance de crítico.`},
 perfurante:{tree:'arqueira',tier:1,lvl:3,max:5,act:1,ic:'⚡',n:'Flecha Perfurante',type:'proj',pierce:true,mp:12,cd:6,color:'#8affc0',speed:340,size:3,range:240,arrow:1,m:[2.4,.3],d:e=>`Atravessa todos em linha: ${pc(e.mult)}.`},
 passos:{tree:'arqueira',tier:2,lvl:5,max:5,ic:'🍃',n:'Passos Leves',pas:{spd:4},d:e=>`+${e.r*4}% de velocidade de movimento.`},
 chuva:{tree:'arqueira',tier:2,lvl:6,max:5,act:1,ic:'🌧️',n:'Chuva de Flechas',type:'aoeTarget',kind:'rain',r:50,delay:.6,range:170,mp:24,cd:11,color:'#ffd060',m:[3.4,.4],d:e=>`Saraivada sobre a área: ${pc(e.mult)}.`},
 companheiro:{tree:'cacadora',tier:1,lvl:10,max:5,act:1,ic:'🐺',n:'Companheiro Lobo',type:'pet',mp:18,cd:8,m:[.5,.08],hpm:[.5,.1],d:e=>`Chama um lobo que luta ao seu lado (máx. ${petCap()}). Vida: ${pc(e.hpm)} da sua. Dano: ${pc(e.mult)} do seu ataque.`},
 marca:{tree:'cacadora',tier:1,lvl:10,max:5,act:1,ic:'🎯',n:'Marca do Caçador',type:'curse',r:6,range:190,mp:8,cd:8,color:'#ff9a4a',amp:[.2,.04],d:e=>`Por 8s, o alvo recebe +${pc(e.amp)} de dano e causa 25% menos.`},
 vinculo:{tree:'cacadora',tier:1,lvl:10,max:5,ic:'🤝',n:'Vínculo Selvagem',pas:{petPct:.1},d:e=>`Seus lobos ganham +${e.r*10}% de vida e dano.`},
 uivo:{tree:'cacadora',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🌕',n:'Uivo da Matilha',type:'howl',mp:16,cd:20,dur:[10,1],batk:[.25,.05],color:'#d8a86a',d:e=>`+${pc(e.batk)} de ataque por ${e.dur}s e cura 30% da vida dos lobos.`},
 matilha:{tree:'cacadora',tier:2,lvl:15,pts:4,max:5,ic:'🐾',n:'Matilha',pas:{},d:e=>`No rank 3, +1 lobo. No rank 5, +1 lobo.`},
 fera:{tree:'cacadora',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🐺',n:'Fera Primordial',type:'alpha',mp:45,cd:45,d:e=>`Invoca um lobo alfa gigante por 20s, com o dobro da vida e mais que o dobro do dano.`},
 armadilha:{tree:'patrulheira',tier:1,lvl:10,max:5,act:1,ic:'🪤',n:'Armadilha de Espinhos',type:'trap',mp:12,cd:4,color:'#c8b060',m:[2,.3],d:e=>`Deixa uma armadilha aos seus pés (máx. 3). Ao ser pisada, causa ${pc(e.mult)} em área e prende por 2s.`},
 rajada:{tree:'patrulheira',tier:1,lvl:10,max:5,act:1,ic:'🏹',n:'Rajada',type:'volley',range:180,mp:14,cd:7,n2:[5,.5],m:[.6,.08],color:'#ffe9a8',d:e=>`Dispara ${e.count} flechas seguidas no alvo: ${pc(e.mult)} cada.`},
 precisao:{tree:'patrulheira',tier:1,lvl:10,max:5,ic:'🎖️',n:'Precisão',pas:{dmgPct:.05},d:e=>`+${e.r*5}% de dano em tudo.`},
 rede:{tree:'patrulheira',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🕸️',n:'Flecha de Rede',type:'proj',aoe:32,root:3,mp:14,cd:10,color:'#e8e0c0',speed:260,size:3,range:200,arrow:1,m:[1.5,.2],d:e=>`Explode numa rede que prende a área por 3s: ${pc(e.mult)}.`},
 recuo:{tree:'patrulheira',tier:2,lvl:15,pts:4,max:5,act:1,ic:'💨',n:'Salto para Trás',type:'evade',mp:8,cd:7,d:e=>`Salta para longe do alvo. Se você conhece Armadilha de Espinhos, deixa uma no lugar.`},
 tempestade2:{tree:'patrulheira',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🌪️',n:'Tempestade de Flechas',type:'storm',arrow:1,r:80,range:180,mp:45,cd:22,color:'#ffe08a',m:[1.6,.3],hits:[10,3],d:e=>`${e.hits} saraivadas caem na área em 4s: ${pc(e.mult)} cada.`},
 veneno:{tree:'assassina',tier:1,lvl:10,max:5,act:1,ic:'🧪',n:'Flecha Envenenada',type:'proj',mp:8,cd:2,color:'#7dff5a',speed:280,size:2,range:200,arrow:1,m:[1.4,.15],poison:[.8,.12],d:e=>`${pc(e.mult)} de dano e mais ${pc(e.poison)} do golpe em veneno por 5s.`},
 sombras:{tree:'assassina',tier:1,lvl:10,max:5,act:1,ic:'🌑',n:'Manto de Sombras',type:'stealth',mp:14,cd:16,dur:[6,1],d:e=>`Fica oculta por ${e.dur}s: os monstros perdem você de vista. O próximo ataque é crítico com +50% de dano.`},
 letal:{tree:'assassina',tier:1,lvl:10,max:5,ic:'💀',n:'Golpe Letal',pas:{crit:3},d:e=>`+${e.r*3}% de chance de crítico.`},
 leque:{tree:'assassina',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🌀',n:'Leque de Adagas',type:'fan',r:45,mp:16,cd:7,color:'#b070ff',m:[1.6,.2],poison:[.5,.08],d:e=>`Adagas ao redor: ${pc(e.mult)} e envenenam os atingidos.`},
 toxinas:{tree:'assassina',tier:2,lvl:15,pts:4,max:5,ic:'☠️',n:'Toxinas',pas:{toxin:.15},d:e=>`Seus venenos causam +${e.r*15}% de dano.`},
 sentenca:{tree:'assassina',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'⚰️',n:'Sentença',type:'execute',range:200,mp:35,cd:18,color:'#b070ff',m:[4,.8],d:e=>`Golpe mortal: ${pc(e.mult)} de dano, dobrado se o alvo tiver menos de 35% de vida.`}});
const petCap=()=>1+(rk('matilha')>=3)+(rk('matilha')>=5);
function makePet(alpha){const e=eff('companheiro',Math.max(1,rk('companheiro'))),pp=1+P.st.petPct,hp=Math.round(P.st.hp*e.hpm*pp*(alpha?2:1));burst(P.x,P.y,'#d8a86a',14,50);
 return{x:P.x+rf(-14,14),y:P.y+rf(-6,12),maxHp:hp,hp,atkM:e.mult*pp*(alpha?2.2:1),atkT:0,face:1,animT:0,hitT:0,temp:alpha?20:0,target:null,dead:false,moving:false,spr:'lobo',sc:alpha?1.5:1,kind:'wolf',alpha};}
const traps=[];
function castArcher(sk,e,t){switch(sk.type){
 case'pet':{const own=allies.filter(a=>a.kind==='wolf'&&!a.alpha);if(own.length>=petCap())own[0].dead=true;allies.push(makePet(false));return true;}
 case'alpha':allies.push(makePet(true));banner('Fera Primordial','O lobo alfa responde ao seu chamado.');shake(2);return true;
 case'howl':P.buff={t:e.dur,atk:e.batk,def:0,spd:0};recalc();for(const a of allies)a.hp=Math.min(a.maxHp,a.hp+a.maxHp*.3);fx.push({k:'ring',x:P.x,y:P.y-4,r0:6,r1:70,t:0,max:.5,color:sk.color,w:2});log('Uivo da Matilha!','#d8a86a');return true;
 case'trap':placeTrap(P.x,P.y);return true;
 case'volley':P.volley={n:e.count,next:0,mult:e.mult,t};return true;
 case'evade':{let dx=-P.face,dy=0;if(t){const d=hyp(P.x-t.x,P.y-t.y)||1;dx=(P.x-t.x)/d;dy=(P.y-t.y)/d;}const ox=P.x,oy=P.y;
  for(let k=0;k<11;k++){if(blocked(P.x+dx*5,P.y+dy*5,4))break;P.x+=dx*5;P.y+=dy*5;parts.push({x:P.x,y:P.y-8,vx:0,vy:-6,g:0,life:.35,max:.35,color:'#dfe6ef',s:2});}
  P.dest=null;P.auto=false;if(rk('armadilha'))placeTrap(ox,oy);return true;}
 case'stealth':P.stealth={t:e.dur};P.ambush=false;burst(P.x,P.y-8,'#4a3a6a',24,40);for(const m of mons)if(m.state==='chase'){m.state='idle';m.sx=m.x;m.sy=m.y;}P.target=null;P.auto=false;return true;
 case'fan':fx.push({k:'ring',x:P.x,y:P.y-4,r0:4,r1:sk.r,t:0,max:.3,color:sk.color,w:2});for(let k=0;k<16;k++){const a=k/16*6.28;parts.push({x:P.x,y:P.y-8,vx:Math.cos(a)*140,vy:Math.sin(a)*80,g:0,life:.3,max:.3,color:'#dfe6ef',s:1});}
  for(const m of mons)if(!m.dead&&hyp(m.x-P.x,m.y-P.y)<sk.r+m.r)hitMonster(m,e.mult,{src:'skill',poison:e.poison});return true;
 case'execute':{const low=t.hp<t.maxHp*.35;hitMonster(t,e.mult*(low?2:1),{src:'skill'});fx.push({k:'slash',x:t.x,y:t.y-mh(t)/2,face:P.face,t:0,max:.35,color:sk.color,big:true});burst(t.x,t.y-mh(t)/2,sk.color,20,70);if(low)addText(t.x,t.y-mh(t)-14,'SENTENÇA','#d9a0ff',true);shake(2);return true;}}
 return false;}
function placeTrap(x,y){const e=eff('armadilha',Math.max(1,rk('armadilha')));if(traps.length>=3)traps.shift();traps.push({x,y,t:30,arm:.5,mult:e.mult});}
function tickArcher(dt){
 for(let i=traps.length-1;i>=0;i--){const tr=traps[i];tr.t-=dt;tr.arm-=dt;if(tr.t<=0){traps.splice(i,1);continue;}if(tr.arm>0)continue;
  if(mons.some(m=>!m.dead&&hyp(m.x-tr.x,m.y-tr.y)<14+m.r)){traps.splice(i,1);explode(tr.x,tr.y-4,32,tr.mult,'#c8b060',{src:'skill',root:2});shake(1.5);}}
 if(P.volley){const v=P.volley;v.next-=dt;if(!v.t||v.t.dead){P.volley=null;}else if(v.next<=0){v.next=.14;v.n--;const t=v.t,a=Math.atan2(t.y-mh(t)/2-(P.y-9),t.x-P.x);P.face=t.x>=P.x?1:-1;
   projs.push({x:P.x,y:P.y-9,vx:Math.cos(a)*300,vy:Math.sin(a)*300,speed:300,target:t,homing:true,mult:v.mult,color:'#ffe9a8',size:2,arrow:true,life:2,o:{src:'skill'}});if(v.n<=0)P.volley=null;}}
 if(P.stealth){P.stealth.t-=dt;if(P.stealth.t<=0){P.stealth=null;log('Você saiu das sombras.','#b8a0d8');}}}
function drawTraps(tt){for(const tr of traps){const a=tr.arm>0?.4:.9;ctx.globalAlpha=a;ctx.fillStyle='#5a4a2a';ctx.fillRect(tr.x-5,tr.y-1,10,2);ctx.fillStyle='#c8c0a0';for(let k=-4;k<=4;k+=2)ctx.fillRect(tr.x+k,tr.y-3,1,2);ctx.globalAlpha=1;}}
