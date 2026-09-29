// Ecos de Valdoria — Classes, itens, monstros, combate, baús, loot e save
'use strict';
// ================== DADOS ==================
const CL={
 guerreiro:{nome:'Guerreiro',desc:'Tanque corpo a corpo, com muita vida e golpes pesados.',hp:130,mp:40,atk:12,def:7,crit:5,g:{hp:15,mp:3,atk:2.6,def:1.3},range:20,atkCd:.62,proj:null,basic:'⚔️',icon:'sword',weapons:['Espada Curta','Espada Longa','Machado de Guerra','Lâmina Rúnica'],
  skills:[{n:'Golpe Giratório',ic:'🌀',mp:8,cd:4,type:'aoeSelf',r:38,mult:1.8,color:'#e8eef5',d:'Atinge todos ao redor (180% de dano).'},
   {n:'Grito de Guerra',ic:'📣',mp:12,cd:18,type:'buff',dur:8,atk:.35,def:.35,color:'#ff7a3a',d:'+35% de ataque e defesa por 8s.'},
   {n:'Execução',ic:'💀',mp:14,cd:7,type:'single',range:26,mult:3.2,color:'#ff3a3a',d:'Golpe brutal em um alvo (320%).'}]},
 mago:{nome:'Mago',desc:'Frágil, mas devastador à distância com magias em área.',hp:85,mp:110,atk:15,def:3,crit:6,g:{hp:9,mp:9,atk:3.1,def:.6},range:120,atkCd:1,proj:{color:'#9ff3ff',size:3,speed:210},basic:'🔮',icon:'staff',weapons:['Varinha de Aprendiz','Cajado de Carvalho','Cajado Arcano','Cetro Rúnico'],
  skills:[{n:'Bola de Fogo',ic:'🔥',mp:10,cd:2.5,type:'proj',mult:2,aoe:26,color:'#ff8a2a',speed:220,size:4,range:200,d:'Explode em área ao acertar (200%).'},
   {n:'Nova de Gelo',ic:'❄️',mp:16,cd:7,type:'aoeSelf',r:58,mult:1.4,slow:3,color:'#9fe8ff',d:'Congela e desacelera quem está perto (140%).'},
   {n:'Meteoro',ic:'☄️',mp:30,cd:12,type:'aoeTarget',r:44,mult:4.2,delay:.8,color:'#ff5020',range:170,kind:'meteor',d:'Um meteoro cai sobre o alvo (420% em área).'}]},
 arqueira:{nome:'Arqueira',desc:'Ágil e precisa, com muitos críticos e disparos rápidos.',hp:100,mp:65,atk:13,def:4,crit:12,g:{hp:11,mp:5,atk:2.8,def:.9},range:130,atkCd:.8,proj:{color:'#ffe9a8',size:2,speed:280,arrow:true},basic:'🏹',icon:'bow',weapons:['Arco Curto','Arco Longo','Arco Élfico','Arco Composto'],
  skills:[{n:'Tiro Múltiplo',ic:'🎯',mp:8,cd:3,type:'proj',count:5,spread:.7,mult:1.1,color:'#ffe08a',speed:270,size:2,range:190,arrow:true,d:'5 flechas em leque (110% cada).'},
   {n:'Flecha Perfurante',ic:'⚡',mp:12,cd:6,type:'proj',pierce:true,mult:2.4,color:'#8affc0',speed:340,size:3,range:240,arrow:true,d:'Atravessa todos em linha (240%).'},
   {n:'Chuva de Flechas',ic:'🌧️',mp:24,cd:11,type:'aoeTarget',r:50,mult:3.4,delay:.6,color:'#ffd060',range:170,kind:'rain',d:'Saraivada sobre a área (340%).'}]}};
const MDEF={slime:{n:'Geleia',hp:30,atk:5,def:1,spd:36,xp:10,r:6,aggro:55,cd:1.4},lobo:{n:'Lobo Cinzento',hp:42,atk:8,def:2,spd:62,xp:14,r:7,aggro:80,cd:1.1},
 aranha:{n:'Aranha do Pântano',hp:60,atk:11,def:3,spd:58,xp:18,r:7,aggro:75,cd:1},esqueleto:{n:'Esqueleto Guerreiro',hp:75,atk:13,def:5,spd:45,xp:22,r:7,aggro:80,cd:1.2},
 orc:{n:'Orc Saqueador',hp:110,atk:17,def:7,spd:50,xp:30,r:8,aggro:85,cd:1.3},golem:{n:'Golem de Pedra',hp:190,atk:22,def:12,spd:32,xp:45,r:9,aggro:70,cd:1.8,slam:{every:5,r:34,mult:1.6,delay:1}},
 mimico:{n:'Mímico',hp:140,atk:16,def:6,spd:55,xp:50,r:8,aggro:140,cd:1},
 wyrm:{n:'Wyrm Carmesim',hp:700,atk:34,def:14,spd:40,xp:600,r:14,aggro:120,cd:1.6,scale:2.2,boss:true,slam:{every:4.5,r:48,mult:1.8,delay:1.1,fire:true}}};
const ZTYPES={1:[['slime',.55],['lobo',1]],2:[['aranha',.55],['esqueleto',1]],3:[['orc',.7],['golem',1]]};
const ZTARGET={1:38,2:32,3:28},CTARGET={1:10,2:8,3:7};
const CHN=['','Baú de Madeira','Baú de Prata','Baú de Ouro','Baú Lendário'];
const CHT=[null,{b:.4,n:[1,2],g:[5,15]},{b:.9,n:[1,3],g:[15,40]},{b:1.6,n:[2,3],g:[40,90]},{b:3.5,n:[3,4],g:[150,300],min:2}];
const ZN=[{n:'Vila de Valdor',s:'Zona segura • mercador e cura'},{n:'Floresta Verdejante',s:'Nível 1 a 9'},{n:'Pântano Sombrio',s:'Nível 9 a 16'},{n:'Ruínas Esquecidas',s:'Nível 16 a 20'},{n:'Covil do Wyrm',s:'Chefe • nível 22'}];
const RAR=[{n:'Comum',m:1,a:1,w:62},{n:'Incomum',m:1.15,a:2,w:25},{n:'Raro',m:1.32,a:3,w:9.5},{n:'Épico',m:1.55,a:4,w:3},{n:'Lendário',m:1.85,a:5,w:.6}];
const SLOTN={arma:'Arma',elmo:'Elmo',peito:'Armadura',botas:'Botas',anel:'Anel'};
const BASES={elmo:['Capuz de Couro','Elmo de Ferro','Elmo Alado','Coroa de Batalha'],peito:['Túnica Acolchoada','Cota de Malha','Armadura de Placas','Couraça Rúnica'],botas:['Botas de Couro','Botas Reforçadas','Grevas de Aço','Botas Aladas'],anel:['Anel de Cobre','Anel de Prata','Anel de Ouro','Anel de Safira']};
const SUF=[' do Urso',' da Raposa',' do Falcão',' da Coruja',' do Lobo',' da Serpente',' do Titã',' da Tempestade'],EPIC=[' do Crepúsculo',' dos Antigos',' da Aurora',' do Abismo'];
const LEG={arma:{guerreiro:['Quebra-Reinos','Fúria de Valdor'],mago:['Cetro do Vazio Eterno','Lágrima da Aurora'],arqueira:['Sussurro do Vento','Arco da Lua Cheia']},elmo:['Coroa do Rei Caído','Elmo do Guardião Solar'],peito:['Égide do Dragão','Manto das Estrelas'],botas:['Passos do Andarilho Celeste','Botas do Relâmpago'],anel:['Anel dos Mil Sóis','Selo do Eclipse']};
const STN={atk:'Ataque',def:'Defesa',hp:'Vida',mp:'Mana',crit:'Crítico',spd:'Velocidade'};
function rollRar(bonus=0,min=0){const ws=RAR.map((r,i)=>i<min?0:r.w*Math.pow(1+bonus,i)),tot=ws.reduce((a,b)=>a+b,0);let x=R()*tot;for(let i=0;i<5;i++){x-=ws[i];if(x<=0)return i;}return 4;}
function genItem(ilvl,bonus=0,slot=null,min=0,force=null){
 slot=slot||pick(['arma','arma','elmo','peito','botas','anel']);const r=force??rollRar(bonus,min),m=RAR[r].m,cls=P.cls,tier=clamp(Math.floor(ilvl/6),0,3);
 const base=slot==='arma'?CL[cls].weapons[tier]:((STYLE_BASES[CSTYLE[cls]]||{})[slot]||BASES[slot])[tier];
 const name=r===4?pick(slot==='arma'?LEG.arma[cls]:LEG[slot]):r===3?base+pick(EPIC):r>=1?base+pick(SUF):base;
 const st={},add=(k,v)=>st[k]=(st[k]||0)+v;
 if(slot==='arma')add('atk',(5+ilvl*2)*m);
 if(slot==='elmo'){add('def',(2+ilvl*.8)*m);add('hp',(6+ilvl*3)*m);}
 if(slot==='peito'){add('def',(4+ilvl*1.4)*m);add('hp',(10+ilvl*4)*m);}
 if(slot==='botas'){add('def',(1+ilvl*.6)*m);add('spd',4+r*1.5);}
 if(slot==='anel'){add('crit',2+r*1.2);add(cls==='guerreiro'?'hp':'mp',(5+ilvl*2.5)*m);}
 const pool=['hp','mp','atk','def','crit','spd'];
 for(let a=0;a<RAR[r].a-1;a++){const k=pool.splice(Math.floor(R()*pool.length),1)[0];add(k,({hp:ilvl*3+5,mp:ilvl*2+4,atk:ilvl*.7+1,def:ilvl*.5+1,crit:rf(1,3),spd:rf(2,4)})[k]*m);}
 for(const k in st)st[k]=Math.max(1,Math.round(st[k]));
 return{id:uid(),slot,name,rar:r,ilvl,stats:st,cls,value:Math.round((4+ilvl*3)*(1+r*r*.8))};}
const power=it=>{if(!it)return 0;const s=it.stats;return(s.atk||0)*3+(s.def||0)*2+(s.hp||0)*.3+(s.mp||0)*.2+(s.crit||0)*4+(s.spd||0)*3;};
const iconOf=it=>iconURL(it.slot==='arma'?CL[it.cls].icon:it.slot,it.rar);

// ================== ESTADO ==================
let P=null,time=0,bossT=0,lairChestT=0,shakeT=0,shakeA=0,fullMsgT=0,saveT=0,spawnT=0,chestT=0;
const mons=[],chests=[],loots=[],projs=[],fx=[],parts=[],texts=[],teles=[],pAoe=[];
const NPC={x:(TC.x+3.5)*TILE,y:(TC.y-1)*TILE};
const mh=m=>SPR[m.type].n.height*m.sc;
function blocked(x,y,r){for(const[px,py]of[[x-r,y-r*.5],[x+r,y-r*.5],[x-r,y+r*.3],[x+r,y+r*.3]]){const tx=Math.floor(px/TILE),ty=Math.floor(py/TILE);if(tx<0||ty<0||tx>=W||ty>=H||solid[ty*W+tx])return true;}return false;}
function step(e,dx,dy,r=4){if(!blocked(e.x+dx,e.y,r))e.x+=dx;if(!blocked(e.x,e.y+dy,r))e.y+=dy;}
function stepSmart(e,dx,dy,r,side){const ox=e.x,oy=e.y,s=hyp(dx,dy);step(e,dx,dy,r);if(hyp(e.x-ox,e.y-oy)<s*.3&&s>0)step(e,-dy*side,dx*side,r);}
function randTile(z){for(let k=0;k<500;k++){const x=ri(2,W-3),y=ri(2,H-3),i=y*W+x;if(zoneMap[i]===z&&!solid[i]&&REACH[i])return{x,y};}return null;}
// vida e ataque por nível: comuns com mais vida e ataque (equilíbrio de 29/09/2026, ver CLAUDE.md item 7); chefes na curva antiga
const MONHP=d=>d.boss?[12,.22]:[2.8,.35],MONATK=d=>d.boss?[1,.16]:[1.4,.28];
function makeMon(type,x,y,lvl,o={}){const d=MDEF[type],el=!!o.elite,h=MONHP(d),a=MONATK(d);
 const m={type,d,lvl,x,y,sx:x,sy:y,zone:o.zone||0,maxHp:Math.round(d.hp*h[0]*(1+h[1]*(lvl-1))*(el?2.6:1)),atk:d.atk*a[0]*(1+a[1]*(lvl-1))*(el?1.35:1),dfn:d.def*(1+.12*(lvl-1)),spd:d.spd,r:d.r*(el?1.2:1),sc:(d.scale||1)*(el?1.3:1),
  state:o.state||'idle',wanderT:rf(0,3),tx:null,atkT:0,hitT:0,slowT:0,animT:R()*5,face:R()<.5?1:-1,abilT:d.slam?d.slam.every:0,elite:el,boss:!!d.boss,lunge:0,dead:false,side:R()<.5?1:-1,lootBonus:o.lootBonus||0};
 m.hp=m.maxHp;m.name=d.n+(el?' Elite':'');if(d.disguise&&!el){m.disguise=d.disguise;m.name=MDEF[d.disguise].n;}return m;}
function spawnMon(z,far){for(let k=0;k<40;k++){const t=randTile(z);if(!t)return;const x=(t.x+.5)*TILE,y=(t.y+.5)*TILE;if(far&&P&&hyp(x-P.x,y-P.y)<220)continue;
 const r=R();const type=(MAPS[CUR].mons||ZTYPES[z]).find(e=>r<=e[1])[0],lv=clamp(lvlAt(t.x,t.y)+ri(-1,1),1,40);mons.push(makeMon(type,x,y,lv,{elite:R()<(MAPS[CUR].elite||.07),zone:z}));
 const pk=MDEF[type].pack;if(pk)for(let n=ri(pk[0],pk[1])-1;n>0;n--)for(let k=0;k<10;k++){const bx=x+rf(-22,22),by=y+rf(-16,16);if(!blocked(bx,by,4)){mons.push(makeMon(type,bx,by,lv,{zone:z}));break;}}return;}}
function spawnChest(z,far){for(let k=0;k<40;k++){const t=randTile(z);if(!t)return;const x=(t.x+.5)*TILE,y=(t.y+.8)*TILE;
 if(far&&P&&hyp(x-P.x,y-P.y)<200)continue;if(chests.some(c=>hyp(c.x-x,c.y-y)<100))continue;
 const tr=MAPS[CUR].tier||z;chests.push({x,y,tier:tr,zone:z,open:false,openT:0,mimic:tr>=2&&R()<(tr===2?.08:.12),lvl:lvlAt(t.x,t.y)});return;}}
function populate(){const M=MAPS[CUR],z=M.theme;if(!M.town&&!M.lair){for(let i=0;i<(M.count||0);i++)spawnMon(z,false);for(let i=0;i<(M.chests||0);i++)spawnChest(z,false);}
 if(M.boss&&time>=(BOSSAT[CUR]||0))spawnBoss(false);if(M.lair&&time>=lairChestT)chests.push({x:(LAIR.x+.5)*TILE,y:(LAIR.y+3.8)*TILE,tier:4,zone:4,open:false,openT:0,lvl:22,lair:true});}

// ================== JOGADOR ==================
function newPlayer(cls,name){return{name,cls,lvl:1,xp:0,jlvl:1,jxp:0,attr:newAttr(ATTR_INI),gold:20,inv:[],equip:{},pots:{hp:3,mp:2},mats:{},miss:{on:[],cd:{}},x:(TC.x+.5)*TILE,y:(TC.y+2.5)*TILE};}
function initRuntime(){Object.assign(P,{face:1,moving:false,target:null,auto:false,atkT:0,potCd:0,form:null,hot:null,pulse:null,buff:null,dest:null,pend:null,queued:null,dead:false,hitT:0,combatT:-99,swingT:0,animT:0,zone:-1});initSkills();recalc();P.hp=P.st.hp;P.mp=P.st.mp;}

const xpNeed=l=>Math.floor(50*Math.pow(l,1.6));
// Nível de Classe (dá os pontos de habilidade): vai até 10 na classe inicial; ao virar aprendiz (P.spec) recomeça do 1 e vai até 50.
// A barra do caminho enche um pouco mais rápido (85%), para a promoção (Classe 25) chegar perto do nível de Base 25.
const jobCap=()=>P.spec?50:10,jobNeed=j=>P.spec?Math.floor(xpNeed(j)*.85):xpNeed(j);
function gainJob(x){const cap=jobCap();if(P.jlvl>=cap){P.jxp=0;return false;}P.jxp+=x;let up=false;
 while(P.jlvl<cap&&P.jxp>=jobNeed(P.jlvl)){P.jxp-=jobNeed(P.jlvl);P.jlvl++;up=true;log(`Nível de Classe ${P.jlvl}! Mais 1 ponto de habilidade.`,'#8fd0ff');
  fx.push({k:'ring',x:P.x,y:P.y-4,r0:4,r1:40,t:0,max:.6,color:'#8fd0ff',w:2});}
 if(P.jlvl>=cap){P.jxp=0;if(up)log(P.spec?'Você chegou ao nível máximo de Classe.':'Nível de Classe 10! A Mestra Elara quer falar com você.','#8fd0ff');}
 return up;}
function gainXp(x){const jup=gainJob(x),lv0=P.lvl;P.xp+=x;while(P.xp>=xpNeed(P.lvl)&&P.lvl<50){P.xp-=xpNeed(P.lvl);P.lvl++;recalc();P.hp=P.st.hp;P.mp=P.st.mp;
 banner(`Nível ${P.lvl}!`,`Vida e mana restauradas. +${attrGain(P.lvl)} pontos de atributo (P).`);log(`Você alcançou o nível ${P.lvl}!`,'#ffd24a');
 fx.push({k:'ring',x:P.x,y:P.y-4,r0:4,r1:50,t:0,max:.6,color:'#ffd24a',w:3});for(let i=0;i<40;i++)parts.push({x:P.x+rf(-8,8),y:P.y-rf(0,16),vx:rf(-15,15),vy:rf(-90,-30),g:0,life:rf(.6,1.2),max:1.2,color:pick(['#ffd24a','#fff3b0','#ffb020']),s:rf(1,2)});save();}
 if(jup&&P.lvl===lv0){banner(`Nível de Classe ${P.jlvl}!`,'Um ponto de habilidade para a árvore (T).');save();}}
function hurtPlayer(atk,m,mult=1){if(P.dead)return;let d=Math.max(1,Math.round(atk*mult*rf(.9,1.1)*60/(60+P.st.def)));d=preHurt(d,m,mult);if(d<=0)return;P.hp-=d;onMonHit(m,d);P.hitT=.15;P.combatT=time;
 addText(P.x+rf(-4,4),P.y-22,'-'+d,'#ff5a5a');shake(m&&m.boss?4:1.5);
 if(m&&!m.dead&&!P.target){P.target=m;if(!P.dest)P.auto=true;}
 if(mult===1&&m&&!m.dead&&P.st.thorns)dealMonster(m,d*P.st.thorns,false,{src:'thorns'});
 if(P.hp<=0){P.hp=0;die(m);}}
function die(m){P.dead=true;P.pdot=null;P.stealth=null;P.volley=null;P.shield=null;P.banner=null;if(P.quest&&!P.quest.done&&SPECS[P.quest.spec].trial.kind==='hits')P.quest.prog=0;P.form=null;P.pulse=null;allies.length=0;recalc();P.target=null;P.auto=false;P.dest=null;const lost=Math.floor(P.gold*.05);P.gold-=lost;
 $('deathTxt').textContent=`${m?m.name+' (nível '+m.lvl+')':'Algo'} derrotou você. Você perdeu ${lost} de ouro.`;$('death').classList.remove('hidden');}
function respawn(){P.dead=false;if(CUR!=='valdor')switchMapNow('valdor',null);P.x=(TC.x+.5)*TILE;P.y=(TC.y+2.5)*TILE;P.hp=P.st.hp;P.mp=P.st.mp;$('death').classList.add('hidden');save();}
function nearestMon(range){let b=null,bd=range;for(const m of mons){if(m.dead)continue;const d=hyp(m.x-P.x,m.y-P.y);if(d<bd){bd=d;b=m;}}return b;}

const xpOf=(d,lvl,el)=>Math.round(d.xp*1.5*(1+.35*(lvl-1))*(el?3:1)); // XP de um monstro (também usada pelo medidor)
function killMonster(m,src){m.dead=true;if(m.d.clone){burst(m.x,m.y-12,'#c8c8c8',18,50);addText(m.x,m.y-26,'Falso!','#cccccc');if(P.target===m){P.target=null;P.auto=false;}return;}onKill(m,src);let xp=xpOf(m.d,m.lvl,m.elite);const diff=P.lvl-m.lvl;if(diff>5)xp=Math.max(1,Math.round(xp*Math.max(.1,1-(diff-5)*.2)));
 addText(m.x,m.y-mh(m)-12,'+'+xp+' XP','#d6a8ff');gainXp(xp);
 dropLoot(m.x,m.y,{kind:'gold',amt:Math.round(ri(2,5)*(1+m.lvl*.6)*(m.elite?3:1)*(m.boss?10:1))+(m.stolen||0)});dropMat(m);
 let n=0,b=0,min=0;if(m.boss){n=3;b=3;min=2;}else if(m.type==='mimico'){n=ri(2,3);b=m.lootBonus;}else if(m.elite){n=ri(1,2);b=1.2;}else if(R()<.2*luckMul())n=1;
 for(let i=0;i<n;i++)dropLoot(m.x,m.y,{kind:'item',item:genItem(m.lvl,b,null,min)});
 if(R()<(m.boss?1:.12))dropLoot(m.x,m.y,{kind:'pot',pot:R()<.6?'hp':'mp'});
 burst(m.x,m.y-mh(m)/2,m.type==='slime'?'#5fcf5a':m.type==='golem'?'#b8b2a4':'#c0303a',14,60);
 if(P.target===m){P.target=null;P.auto=false;P.queued=null;}
 if(m.boss)bossDead(m);
 else if(m.elite||m.type==='mimico')log(`Você derrotou ${m.name}!`,'#ffd23a');}
function dropLoot(x,y,o){loots.push(Object.assign({x,y,z:.1,vz:rf(70,110),vx:rf(-35,35),vy:rf(-25,25),t:0},o));}


function usePot(t){if(!P||P.dead||P.potCd>0)return;if(P.pots[t]<=0){log(t==='hp'?'Sem poções de vida.':'Sem poções de mana.','#cccccc');return;}
 const k=t==='hp'?'hp':'mp';if(P[k]>=P.st[k])return;P.pots[t]--;P.potCd=1;const v=Math.round(P.st[k]*.45);P[k]=Math.min(P.st[k],P[k]+v);
 addText(P.x,P.y-24,'+'+v,t==='hp'?'#5dff7a':'#7fb2ff');burst(P.x,P.y-8,t==='hp'?'#ff6060':'#6090ff',12,40);updateHotbar();}

function openChest(c){if(c.open)return;
 if(c.mimic){chests.splice(chests.indexOf(c),1);const m=makeMon('mimico',c.x,c.y,c.lvl+1,{state:'chase',lootBonus:CHT[c.tier].b+.8});mons.push(m);P.target=m;
  banner('É um Mímico!','O baú tinha dentes.');shake(3);burst(c.x,c.y-8,'#ff3030',16,70);return;}
 c.open=true;c.openT=0;const T=CHT[c.tier];log(`Você abriu um ${CHN[c.tier]}!`,'#ffd24a');
 dropLoot(c.x,c.y-2,{kind:'gold',amt:Math.round(ri(T.g[0],T.g[1])*(1+c.lvl*.15))});
 const n=ri(T.n[0],T.n[1]);for(let i=0;i<n;i++)dropLoot(c.x,c.y-2,{kind:'item',item:genItem(c.lvl,T.b,null,T.min||0)});
 if(R()<.5)dropLoot(c.x,c.y-2,{kind:'pot',pot:R()<.6?'hp':'mp'});
 for(let i=0;i<26;i++)parts.push({x:c.x+rf(-6,6),y:c.y-8,vx:rf(-30,30),vy:rf(-80,-20),g:60,life:rf(.5,1),max:1,color:pick(['#ffd24a','#fff3b0','#ffffff']),s:rf(1,2)});
 if(c.lair)lairChestT=time+240;save();}


function shake(a){shakeT=.2;shakeA=Math.max(shakeA,a);}
function addText(x,y,t,c,big){texts.push({x,y,t:String(t),c,big:!!big,life:.9});}
function burst(x,y,c,n,s){for(let i=0;i<n;i++){const a=R()*6.28,v=rf(s*.3,s);parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:40,life:rf(.3,.7),max:.7,color:c,s:rf(1,2)});}}

// ================== ATUALIZAÇÃO ==================
function update(dt){time+=dt;const st=P.st;
 P.atkT-=dt;P.potCd-=dt;P.hitT-=dt;P.swingT-=dt;P.animT+=dt;tickSkills(dt);
 if(P.buff){P.buff.t-=dt;if(P.buff.t<=0){P.buff=null;recalc();}}
 const z=zoneMap[Math.floor(P.y/TILE)*W+Math.floor(P.x/TILE)];if(z!==P.zone)P.zone=z;
 if(!P.dead){const town=!!MAPS[CUR].town,ooc=time-P.combatT>6;
  const rg=town||wRatio()<=.5?dt:0; // acima de 50% do peso, sem regeneração natural
  P.hp=Math.min(st.hp,P.hp+st.hp*(town?.1:ooc?.02:.004)*rg*(1+st.regen));P.mp=Math.min(st.mp,P.mp+st.mp*(town?.1:ooc?.03:.012)*rg*(1+st.mregen));
  let ix=0,iy=0;if(keys.a||keys.arrowleft)ix--;if(keys.d||keys.arrowright)ix++;if(keys.w||keys.arrowup)iy--;if(keys.s||keys.arrowdown)iy++;
  if(typeof JOY!=='undefined'&&(JOY.x||JOY.y)){ix=JOY.x;iy=JOY.y;} // joystick de toque (17)
  const spd=70*(1+st.spd/100);P.moving=false;
  if(P.target&&P.target.dead){P.target=null;P.auto=false;P.queued=null;}
  if(ix||iy){const l=hyp(ix,iy);step(P,ix/l*spd*dt,iy/l*spd*dt);if(ix)P.face=Math.sign(ix);P.moving=true;P.dest=null;P.pend=null;P.auto=false;P.queued=null;}
  else if(P.auto&&P.target){const t=P.target,c=CL[P.cls],d=hyp(t.x-P.x,t.y-P.y),need=(P.queued!=null&&SK[P.bar[P.queued]]?(SK[P.bar[P.queued]].range||basicRange()):basicRange())+t.r*.5;
   if(d>need)moveTo(t.x,t.y,spd,dt);else{P.face=t.x>=P.x?1:-1;if(P.queued!=null){const q=P.queued;P.queued=null;useSkill(q);}else if(P.atkT<=0)basicAttack();}}
  else if(P.dest){if(hyp(P.dest.x-P.x,P.dest.y-P.y)<3)P.dest=null;else moveTo(P.dest.x,P.dest.y,spd,dt);}
  if(P.pend&&hyp(P.pend.o.x-P.x,P.pend.o.y-P.y)<22){const it=P.pend;P.pend=null;P.dest=null;interact(it);}
  if(!shopEl.classList.contains('hidden')&&hyp(NPC.x-P.x,NPC.y-P.y)>70)shopEl.classList.add('hidden');}
 // saque
 for(let i=loots.length-1;i>=0;i--){const l=loots[i];l.t+=dt;
  if(l.z>0||l.vz>0){l.vz-=280*dt;l.z+=l.vz*dt;const nx=l.x+l.vx*dt,ny=l.y+l.vy*dt;if(!blocked(nx,ny,2)){l.x=nx;l.y=ny;}if(l.z<=0){l.z=0;l.vz=0;}continue;}
  if(l.t>180){loots.splice(i,1);continue;}if(P.dead)continue;const d=hyp(l.x-P.x,l.y-P.y);
  if(l.kind==='gold'&&d<36){l.x+=(P.x-l.x)*Math.min(1,dt*8);l.y+=(P.y-l.y)*Math.min(1,dt*8);}
  if(d>=13)continue;
  if(l.kind==='gold'){P.gold+=l.amt;addText(P.x,P.y-20,'+'+l.amt+'g','#ffd24a');loots.splice(i,1);}
  else if(l.kind==='pot'){if(!canCarry(WPOT)){heavyMsg();continue;}P.pots[l.pot]++;log(`Você pegou uma poção de ${l.pot==='hp'?'vida':'mana'}.`,l.pot==='hp'?'#ff8080':'#80a8ff');loots.splice(i,1);updateHotbar();}
  else if(l.kind==='mat'){const M=LOOTM[l.mat];if(!canCarry(M.w*l.n)){heavyMsg();continue;}P.mats[l.mat]=(P.mats[l.mat]||0)+l.n;log(`Você pegou ${l.n>1?l.n+'× ':''}${M.n}.`,'#e0d0b0');missNote(l.mat);loots.splice(i,1);if(!bagEl.classList.contains('hidden'))renderBag();}
  else if(!canCarry(itemW(l.item)))heavyMsg();
  else{P.inv.push(l.item);logItem(l.item);loots.splice(i,1);if(!bagEl.classList.contains('hidden'))renderBag();}}
 // monstros
 const inTown=!!MAPS[CUR].town;
 for(const m of mons){if(m.dead)continue;const dP=hyp(P.x-m.x,P.y-m.y);m.hitT-=dt;m.animT+=dt;m.lunge-=dt;
  if(dP>520&&m.state==='idle')continue;m.atkT-=dt;m.slowT-=dt;m.rootT=(m.rootT||0)-dt;if(m.curse)m.curse.t-=dt;const spd=m.spd*(m.slowT>0?.45:1),cr=Math.min(m.r*.6,6);m.moving=false;
  if(m.state==='idle'){if(!P.dead&&!inTown&&!P.stealth&&dP<m.d.aggro)m.state='chase';else{m.wanderT-=dt;if(m.wanderT<=0){m.wanderT=rf(2,5);if(R()<.6){const a=R()*6.28,r=rf(10,40);m.tx=m.sx+Math.cos(a)*r;m.ty=m.sy+Math.sin(a)*r;}else m.tx=null;}
    if(m.tx!=null){const dx=m.tx-m.x,dy=m.ty-m.y,d=hyp(dx,dy);if(d>2){step(m,dx/d*spd*.4*dt,dy/d*spd*.4*dt,cr);m.face=dx>0?1:-1;m.moving=true;}else m.tx=null;}}}
  else if(m.state==='chase'){if(P.stealth){m.state='idle';m.sx=m.x;m.sy=m.y;continue;}if(P.dead||inTown||hyp(m.x-m.sx,m.y-m.sy)>(m.boss?260:230)){m.state='return';continue;}if(monSpecial(m,dt,dP))continue;
   if(m.d.slam){m.abilT-=dt;if(m.abilT<=0&&dP<140){m.abilT=m.d.slam.every;teles.push({x:P.x,y:P.y,r:m.d.slam.r,t:0,delay:m.d.slam.delay,m,mult:m.d.slam.mult,fire:m.d.slam.fire});}}
   const tg=pickTarget(m,dP),dT=hyp(tg.x-m.x,tg.y-m.y);
   if(dT>m.r+6){if(m.rootT<=0){const dx=tg.x-m.x,dy=tg.y-m.y;stepSmart(m,dx/dT*spd*dt,dy/dT*spd*dt,cr,m.side);m.face=dx>0?1:-1;m.moving=true;}}
   else if(m.atkT<=0){m.atkT=m.d.cd;m.lunge=.15;m.face=tg.x>m.x?1:-1;if(tg===P)hurtPlayer(m.atk*weakOf(m),m);else hurtAlly(tg,m);}}
  else{const dx=m.sx-m.x,dy=m.sy-m.y,d=hyp(dx,dy);m.hp=Math.min(m.maxHp,m.hp+m.maxHp*.5*dt);if(d<4){m.state='idle';m.hp=m.maxHp;}else{m.x+=dx/d*spd*1.3*dt;m.y+=dy/d*spd*1.3*dt;m.face=dx>0?1:-1;m.moving=true;}}}
 // projéteis
 for(let i=projs.length-1;i>=0;i--){const p=projs[i];p.life-=dt;
  if(p.homing){const t=p.target;if(!t||t.dead){projs.splice(i,1);continue;}const dx=t.x-p.x,dy=t.y-mh(t)/2-p.y,d=hyp(dx,dy);
   if(d<5+t.r*.5){hitMonster(t,p.mult,p.o);burst(p.x,p.y,p.color,5,40);projs.splice(i,1);continue;}p.vx=dx/d*p.speed;p.vy=dy/d*p.speed;}
  p.x+=p.vx*dt;p.y+=p.vy*dt;let done=p.life<=0;
  if(!p.homing&&!done)for(const m of mons){if(m.dead||p.hit.has(m))continue;if(hyp(m.x-p.x,m.y-mh(m)/2-p.y)<m.r+p.size+2){
   if(p.aoe){explode(p.x,p.y,p.aoe,p.mult,p.color,p.o);done=true;break;}hitMonster(m,p.mult,p.o);p.hit.add(m);burst(p.x,p.y,p.color,4,40);if(!p.pierce){done=true;break;}}}
  if(done){projs.splice(i,1);continue;}
  if(R()<.5)parts.push({x:p.x,y:p.y,vx:0,vy:0,g:0,life:.2,max:.2,color:p.color,s:1});}
 // áreas
 for(let i=pAoe.length-1;i>=0;i--){const a=pAoe[i];a.t+=dt;if(a.kind==='storm'){if(stormTick(a,dt))pAoe.splice(i,1);continue;}
  if(a.kind==='rain'&&R()<.8)parts.push({x:a.x+rf(-a.r,a.r),y:a.y-60+rf(-10,10),vx:0,vy:220,g:0,life:.25,max:.25,color:a.color,s:1,streak:true});
  if(a.t>=a.delay){explode(a.x,a.y-6,a.r,a.mult,a.color,{src:'skill',root:a.root});if(a.kind==='meteor')shake(3);pAoe.splice(i,1);}}
 for(let i=teles.length-1;i>=0;i--){const t=teles[i];t.t+=dt;if(t.m.dead){teles.splice(i,1);continue;}
  if(t.t>=t.delay){fx.push({k:'boom',x:t.x,y:t.y,r:t.r,t:0,max:.35,color:t.fire?'#ff6a20':'#c8b89a'});burst(t.x,t.y,t.fire?'#ff8a20':'#a09a8a',20,90);shake(3);
   {const dd=hyp(P.x-t.x,P.y-t.y);if(!P.dead&&dd<t.r&&(!t.ring||dd>t.r-32))hurtPlayer(t.m.atk,t.m,t.mult);}teles.splice(i,1);}}
 for(let i=mons.length-1;i>=0;i--)if(mons[i].dead)mons.splice(i,1);
 for(let i=fx.length-1;i>=0;i--){fx[i].t+=dt;if(fx[i].t>=fx[i].max)fx.splice(i,1);}
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.life-=dt;if(p.life<=0)parts.splice(i,1);}
 for(let i=texts.length-1;i>=0;i--){const t=texts[i];t.y-=22*dt;t.life-=dt;if(t.life<=0)texts.splice(i,1);}
 for(let i=chests.length-1;i>=0;i--){const c=chests[i];if(c.open){c.openT+=dt;if(c.openT>6)chests.splice(i,1);}}
 shakeT-=dt;if(shakeT<=0)shakeA=0;
 // reposição
 spawnT-=dt;if(spawnT<=0){spawnT=1.5;const MM=MAPS[CUR];if(MM.count&&mons.filter(m=>m.type!=='mimico'&&!m.boss&&m.zone!==9).length<MM.count)spawnMon(MM.theme,true);}
 chestT-=dt;if(chestT<=0){chestT=15;{const MM=MAPS[CUR];if(MM.chests&&chests.filter(c=>!c.open&&!c.lair).length<MM.chests)spawnChest(MM.theme,true);}}
 if(MAPS[CUR].boss&&!mons.some(m=>m.boss)&&time>=(BOSSAT[CUR]||0))spawnBoss(true);
 if(MAPS[CUR].lair&&!chests.some(c=>c.lair)&&time>=lairChestT){chests.push({x:(LAIR.x+.5)*TILE,y:(LAIR.y+3.8)*TILE,tier:4,zone:4,open:false,openT:0,lvl:22,lair:true});}
 saveT-=dt;if(saveT<=0){saveT=15;save();}}
function moveTo(x,y,spd,dt){const dx=x-P.x,dy=y-P.y,d=hyp(dx,dy);if(d<.5)return;const s=Math.min(d,spd*dt);stepSmart(P,dx/d*s,dy/d*s,4,Math.floor(time*.5)%2?1:-1);if(Math.abs(dx)>.5)P.face=dx>0?1:-1;P.moving=true;}
function save(){if(!P)return;try{localStorage.setItem(SAVEKEY,JSON.stringify({v:4,mats:P.mats,miss:P.miss,name:P.name,cls:P.cls,lvl:P.lvl,xp:P.xp,jlvl:P.jlvl,jxp:P.jxp,attr:P.attr,gold:P.gold,inv:P.inv,equip:P.equip,pots:P.pots,x:P.x,y:P.y,map:CUR,ranks:P.ranks,bar:P.bar,spec:P.spec,promo:P.promo,quest:P.quest}));}catch(e){}}
function loadSave(){try{const s=localStorage.getItem(SAVEKEY);return s?JSON.parse(s):null;}catch(e){return null;}}
