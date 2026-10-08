// Ecos de Valdoria — Consumíveis dos monstros (08/10/2026, ideia do dono)
'use strict';
// Cada monstro tem um consumível próprio, diferente do material dele (LOOTM, 12). Cai com 5% de chance (elite 20%, Mímico 50%;
// servos de chefe não deixam), e os baús trazem um com 30% (Madeira), 35% (Prata) e 40% (Ouro e Lendário): um dos monstros
// do mapa ou, às vezes, o Pergaminho de Retorno, que só sai de baú. Ficam na aba Consumíveis da bolsa e são usados por lá.
// CONS[id] = {n, c (cor), s (desenho sem o contorno de fora, posto pelo olM do 12), p (cores extras), e (efeito)}; o id é o do monstro.
// Efeito: tp (teleporte no mapa), home (volta à última cidade), heal/mana (fração na hora), regen/mregen (fração por segundo, por t s),
// furt (segundos sem ser visto), anti (segundos sem veneno), shield (fração da vida, por t s), gold (moedas) e, com t (segundos),
// os bônus de status somados no recalc (03, consStats): spd (velocidade %), atk/def/hp (fração), crit, dodge, aspd, leech, thorns, luck, luz.
// Save (v 7): P.cons = {id: quantidade}, P.consAt = {id: segundos que faltam} e P.lastTown (última cidade, para o pergaminho).
const WCON=2,CONCH=[0,.3,.35,.4,.4];
const CONS={
 slime:{n:'Olho de Geleia',c:'#5fcf5a',p:{e:'#3a8ab0'},e:{tp:1},s:["...cCCCd...","..cCCCCCd..",".cCwwwwCCd.",".CwweewwCd.","cCwekkewCCd","cCwekkewCCd",".CwweewwCd.",".cCwwwwCCd.","..dCCCCCd..","...ddddd..."]},
 esquilo:{n:'Noz Saltitante',c:'#a8743c',p:{e:'#6a4424',f:'#8a5a30'},e:{spd:25,t:120},s:["....ee....","..eeffee..",".effffffe.",".eeeeeeee.",".cCCCCCCd.",".cCCCCCCd.",".cCwCCCCd.","..cCCCCd..","...cCCd...","....dd...."]},
 esporinho:{n:'Chapéu de Esporinho',c:'#e8833a',p:{e:'#e8dcc0',f:'#fff4dc'},e:{heal:.25},s:["....cCCCd....","..cCCwCCCCd..",".cCwwCCCwwCd.","cCCCCCCCCCCCd","dddddddddddd.","....effe.....","....effe.....","....eeee....."]},
 lobo:{n:'Coração de Lobo',c:'#c0303a',e:{atk:.12,t:120},s:[".cCd..cCd.","cCwCdcCCCd","cCCCCCCCCd","cCCCCCCCCd",".cCCCCCCd.","..cCCCCd..","...cCCd...","....dd...."]},
 verme:{n:'Gosma de Verme',c:'#b0c860',p:{e:'#7a9030'},e:{regen:.015,t:20},s:["....c....","...cCd...","..cCCCd..",".cCwCCCd.",".cCCCCCd.","cCCCCCCCd","cCCeCCeCd",".dCCCCCd.","..ddddd.."]},
 esporov:{n:'Glândula de Esporo',c:'#9a5ac8',p:{e:'#7dff5a'},e:{anti:120},s:["..cCCCd..",".cCwCCCd.","cCwCCCCCd","cCCCeCCCd","cCCCCCeCd",".dCCCCCd.","..ddCdd..","....e....","....e...."]},
 aranha:{n:'Olhos de Aranha',c:'#4a2a5a',p:{e:'#e03040'},e:{crit:10,t:120},s:["..cCCCCCd..",".cCeCCCeCd.","cCewCCCewCd","cCCeCCCeCCd","cCeCCeCCeCd",".cCCeCeCCd.","..dCCCCCd..","...ddddd..."]},
 esqueleto:{n:'Crânio Rachado',c:'#e8e2cc',e:{def:.15,t:120},s:["..cCCCCd..",".cCCCCkCd.","cCCCCCkCCd","cCkkCCkkCd","cCkkCkkkCd","cCCCCCCCCd",".dCCkkCCd.","..CkCkCd..","..dCdCdd.."]},
 orc:{n:'Grogue de Orc',c:'#8a5a30',p:{e:'#f0e8d0',f:'#c88a2a'},e:{atk:.2,def:-.1,t:90},s:[".eeeeee...","eeweeeee..","cCCCCCCd..","cfffffCdCd","cffffCCd.C","cfffffCd.C","cCfffCCdCd","cCCCCCCd..",".dddddd..."]},
 golem:{n:'Coração de Pedra',c:'#b8b2a4',p:{e:'#ff9a3a',f:'#ffe08a'},e:{def:.3,spd:-10,t:120},s:["..cCCCd..",".cCCwCCd.","cCCeeeCCd","cCeefeeCd","cCCeeeCCd",".dCCCCCd.","..ddddd.."]},
 mimico:{n:'Língua de Mímico',c:'#e06a8a',e:{luck:.6,t:180},s:["w.w.w.w.","cCCCCCCd",".cCCCCCd","..cCwCCd","..cCCCCd","...cCCd.","....cCd.","....dd.."]},
 salgueiro:{n:'Broto Vivo',c:'#5aa83a',p:{e:'#3a7a2a',f:'#6a4424'},e:{heal:.35},s:["..cC...Cd..",".cCCd.cCCd.",".cCCCdCCCd.","..dCCeCCd..",".....e.....",".....e.....","...ffeff...","..fffffff.."]},
 guaxinim:{n:'Máscara de Guaxinim',c:'#8a8a96',p:{e:'#2a2a34'},e:{furt:15},s:["cCCCCCCCCCCd","CeeeCCCCeeeC","eewkeCCekwee","eeeeeCCeeeee",".eeeCCCCeee.","..dCCCCCCd.."]},
 jiboia:{n:'Muda de Pele',c:'#c8c870',e:{dodge:.1,t:120},s:["...cCCCd...","..cCdddCd..",".cCd...dCd.",".cd.cCd.dC.",".cd.cdd.dC.",".cCd...cCd.","..cCCCCCd..","...dddcCd..",".......cd.."]},
 salgueiroA:{n:'Seiva Dourada',c:'#e8b43c',p:{e:'#8ab0c0',f:'#8a5a30'},e:{mana:.4},s:["...ff...","...ff...","..eeee..",".ecCCde.","eCwCCCde","eCcCCCde","eCCCCCde",".eCCCde.","..eeee.."]},
 pegrande:{n:'Pelo Quentinho',c:'#a87a50',e:{hp:.2,t:180},s:[".c.c.c.c.","cCcCcCcCd","CCCCCCCCd","CwCCCCCCd","CCCCCCCCd","dCdCdCdCd",".d.d.d.d."]},
 lanterna:{n:'Chama Engarrafada',c:'#ff9a3a',p:{e:'#8ab0c0',f:'#ffe08a',g:'#8a5a30'},e:{luz:1,t:180},s:["...gggg...","..eeeeee..",".e..ff..e.","e..fCCf..e","e.fCwwCf.e","e.fCwwCf.e","e..fCCf..e",".e......e.","..eeeeee.."]},
 duende:{n:'Cogumelo de Duende',c:'#d0303a',p:{e:'#e8dcc0',f:'#fff4dc'},e:{aspd:.25,t:60},s:["...cCCCd...",".cCwCCCwCd.","cCCCCwCCCCd","dddddddddd.","...eeee....","...efee....","...eeee...."]},
 totem:{n:'Pena de Proteção',c:'#e8c040',p:{e:'#3a8ab0'},e:{shield:.2,t:20},s:[".......cd",".....cCCd","....cCCd.","....cCCd.","...cCeCd.","..cCeCd..",".cCeCd...",".cCCd....","e.dd.....",".e......."]},
 raposa:{n:'Brilho de Raposa',c:'#ffe8a0',e:{heal:.3,mana:.3},s:["....c....","...cwd...","..cCwCd..",".cCwwwCd.","cCwwwwwCd","cCCwwwCCd",".dCCCCCd.","..ddddd.."]},
 morcego:{n:'Presa de Morcego',c:'#e8e2cc',p:{e:'#c0303a'},e:{leech:.06,t:120},s:["cCCCCCd","cCwCCCd",".cCCCd.",".cCCCd.","..cCd..","..cCd..","...e...","...e..."]},
 esqArq:{n:'Flecha Ossuda',c:'#e8e2cc',p:{e:'#c03030'},e:{aspd:.2,t:120},s:[".........ww","........wwC",".......dCc.","......dCd..",".....dCd...","....dCd....",".e.dCd.....","eedCd......",".eed.......","eee........"]},
 zumbi:{n:'Marmita do Mineiro',c:'#8a9aa8',p:{e:'#5a5a6a'},e:{heal:.5},s:["....eeee....","...e....e...","cCCCCCCCCCCd","cCwCCCCCCCCd","dddddddddddd","cCCCCCCCCCCd","cCCCCCCCCCCd","cCCCCCCCCCCd",".dddddddddd."]},
 lagarto:{n:'Cauda Solta',c:'#7ab040',e:{spd:35,t:60},s:["cCCd......",".cCCCd....","..dCCCCd..","....dCCCd.","......cCd.",".....cCd..","....cCd...",".....d...."]},
 abutre:{n:'Olho de Abutre',c:'#e8b43c',e:{luck:.3,t:120},s:["..cCCCCd..",".cCwwCCCd.","cCwCkkCCCd","cCCkkkkCCd","cCCCkkCCCd",".dCCCCCCd.","..dddddd.."]},
 cacto:{n:'Flor de Cacto',c:'#5aa83a',p:{e:'#e06a8a',f:'#ffa0c0'},e:{regen:.02,mregen:.02,t:20},s:["...e.e...","..efwfe..","...efe...","..cCCCd..",".cCwCCCd.",".cCCCCCd.",".cCCCCCd.","..dCCCd.."]},
 chacal:{n:'Pata do Chacal',c:'#c89a5a',e:{atk:.1,spd:15,t:120},s:[".cd..cd.","cCd..cCd",".d.cd.d.","...cd...",".cCCCCd.","cCCCCCCd","cCCCCCCd",".dCCCCd."]},
 escorpiao:{n:'Veneno Rubro',c:'#c8282a',p:{e:'#8ab0c0',f:'#8a5a30'},e:{thorns:.3,t:120},s:["...ff...","..eeee..","...ee...","..eCCe..",".eCwCCe.","eCCCCCCe","eCCCCCCe",".eCCCCe.","..eeee.."]},
 serpente:{n:'Olho de Serpente',c:'#7ad040',e:{dodge:.15,t:90},s:["..cCCCCd..",".cCwCkCCd.","cCwCCkCCCd","cCCCCkCCCd",".cCCCkCCd.","..dddddd.."]},
 escaravelho:{n:'Casca Esmeralda',c:'#2aa870',e:{def:.25,t:120},s:["...cCd...","..cCkCd..",".cCwkCCd.","cCwCkCCCd","cCCCkCCCd","cCCCkCCCd",".cCCkCCd.","..ddddd.."]},
 saqueador:{n:'Bolsa Furtada',c:'#8a5a30',p:{e:'#ffd24a'},e:{gold:1},s:["...e.e...","..cdkdd..","...cCd...",".cCCCCCd.","cCCwCCCCd","cCCCeeCCd","cCCCeeCCd",".dCCCCCd.","..ddddd.."]},
 besouroT:{n:'Pó de Asa',c:'#5a8ad8',e:{mregen:.025,t:20},s:[".w.....w.","...w.....","......w..","...cCd...","..cCwCd..",".cCCCCCd.","cCCCCCCCd",".ddddddd."]},
 mumia:{n:'Unguento Antigo',c:'#e8dcc0',p:{e:'#a8743c',f:'#c8a870'},e:{regen:.02,t:25},s:["..eeeeee..",".eeeeeeee.","..cCCCCd..",".cCwCCCCd.",".cCfffCCd.",".cCfffCCd.",".cCCCCCCd.","..dddddd.."]},
 sentinela:{n:'Óleo de Bronze',c:'#c8803a',e:{atk:.2,t:120},s:["...cd...","..cCCd..","...cd...",".cCCCCd.","cCwCCCCd","cCCCCCCd",".cCCCCd.","..cCCd..","...dd..."]},
 sacerdote:{n:'Incenso Profano',c:'#8a3ad0',p:{e:'#d070ff'},e:{crit:20,aspd:.1,t:90},s:["...e.....","....e.e..","...e.e...","....e....","cCCCCCCCd",".cCwCCCd.","..dCCCd..","...ddd..."]},
 retorno:{n:'Pergaminho de Retorno',c:'#e8dcc0',p:{e:'#3a6ad0'},e:{home:1},s:["cCCCCCCCCd","dcCCCCCCd.",".cCkkkkCd.",".cCCCCCCd.",".cCkkkCCd.",".eeeeeeee.",".cCCCCCCd.","cCCCCCCCCd","dddddddddd"]}};
for(const id in CONS){const C=CONS[id];def('con_'+id,olM(C.s),Object.assign({C:C.c,c:shadeHex(C.c,.45),d:shadeHex(C.c,-.35),w:'#ffffff'},C.p));}
const conIc={},conIcon=id=>conIc[id]||(conIc[id]=toURL(SPR['con_'+id].n,4));
const ctf=t=>t%60?`${t} segundos`:t===60?'1 minuto':`${t/60} minutos`;
function consDesc(e){const p=v=>Math.round(Math.abs(v)*100)+'%',sg=v=>v<0?'−':'+',L=[],B=[];
 if(e.tp)L.push('Leva você para um ponto qualquer do mapa em que está (não funciona em cidades nem perto de um chefe)');
 if(e.home)L.push('Leva você de volta para a última cidade em que esteve (não funciona perto de um chefe)');
 if(e.heal)L.push(`Recupera ${p(e.heal)} da vida`);if(e.mana)L.push(`Recupera ${p(e.mana)} da mana`);
 if(e.regen)L.push(`Recupera ${p(e.regen*e.t)} da vida aos poucos, em ${ctf(e.t)}`);if(e.mregen)L.push(`Recupera ${p(e.mregen*e.t)} da mana aos poucos, em ${ctf(e.t)}`);
 if(e.furt)L.push(`Os monstros não veem você por ${ctf(e.furt)} (atacar desfaz, e o primeiro golpe é crítico)`);
 if(e.anti)L.push(`Cura o veneno e protege dele por ${ctf(e.anti)}`);if(e.shield)L.push(`Escudo que absorve até ${p(e.shield)} da sua vida em dano por ${ctf(e.t)}`);
 if(e.gold)L.push('Tem moedas dentro (mais quanto maior o seu nível)');
 if(e.spd)B.push(`${sg(e.spd)}${Math.abs(e.spd)}% de velocidade`);for(const[k,n]of[['atk','de ataque'],['def','de defesa'],['hp','de vida máxima']])if(e[k])B.push(`${sg(e[k])}${p(e[k])} ${n}`);
 if(e.crit)B.push(`+${e.crit} de crítico`);if(e.dodge)B.push(`+${p(e.dodge)} de esquiva`);if(e.aspd)B.push(`+${p(e.aspd)} de velocidade de ataque`);
 if(e.leech)B.push(`${p(e.leech)} do dano que você causa vira vida`);if(e.thorns)B.push(`${p(e.thorns)} do dano que você leva volta para quem bateu`);
 if(e.luck)B.push(`+${p(e.luck)} de chance de itens e materiais caírem`);if(e.luz)B.push('tocha bem mais forte no escuro');
 if(B.length)L.push(B.join(', ').replace(/^./,c=>c.toUpperCase())+` por ${ctf(e.t)}`);return L.join('. ')+'.';}
// efeitos com tempo que ficam em P.consAt (o escudo usa o P.shield do 06, a furtividade o P.stealth do 07)
const conTimed=e=>e.anti||(!e.shield&&!e.furt&&e.t)||0;
const consOn=k=>{const a=P&&P.consAt;if(a)for(const id in a)if(a[id]>0&&CONS[id]&&CONS[id].e[k])return true;return false;};
// chamado pelo recalc (03), antes dos limites de cada status
function consStats(st){const a=P&&P.consAt;if(!a)return;for(const id in a){const e=CONS[id]&&CONS[id].e;if(!e||!(a[id]>0))continue;
 if(e.spd)st.spd+=e.spd;if(e.atk)st.atk*=1+e.atk;if(e.def)st.def*=1+e.def;if(e.hp)st.hp*=1+e.hp;
 for(const k of['crit','dodge','aspd','leech','thorns','luck'])if(e[k])st[k]=(st[k]||0)+e[k];}}
// chamado pelo tonicTick (20), a cada quadro
function consTick(dt){if(!P)return;if(MAPS[CUR].town)P.lastTown=CUR;let fim=false;
 for(const id in P.consAt){const e=CONS[id]&&CONS[id].e;if(!e){delete P.consAt[id];continue;}
  if(!P.dead){if(e.regen)P.hp=Math.min(P.st.hp,P.hp+P.st.hp*e.regen*dt);if(e.mregen)P.mp=Math.min(P.st.mp,P.mp+P.st.mp*e.mregen*dt);}
  P.consAt[id]-=dt;if(P.consAt[id]<=0){delete P.consAt[id];fim=true;if(!e.regen&&!e.mregen)log(`O efeito de ${CONS[id].n} acabou.`,'#cccccc');}}
 if(fim)recalc();}
const consHUD=()=>Object.keys(P.consAt||{}).map(id=>`<span title="${CONS[id].n}"><img src="${conIcon(id)}" alt="">${mmss(P.consAt[id])}</span>`).join('');
function useCons(id){const C=CONS[id],e=C&&C.e;if(!e||!P||!(P.cons[id]>0)||P.dead)return false;const M=MAPS[CUR];
 if(e.tp||e.home){if(e.tp&&(M.town||M.interior)){log('Isso não funciona na cidade.','#cccccc');return false;}
  if(e.home&&M.town){log('Você já está numa cidade.','#cccccc');return false;}
  if(mons.some(m=>m.boss&&!m.dead&&(m.state==='chase'||hyp(m.x-P.x,m.y-P.y)<300))){log('O poder do chefe não deixa você fugir!','#ff8080');return false;}}
 let tp=null;if(e.tp){for(let k=0;k<800&&!tp;k++){const x=ri(2,W-3),y=ri(2,H-3),i=y*W+x;if(!solid[i]&&REACH[i]&&hyp((x+.5)*TILE-P.x,(y+.5)*TILE-P.y)>TILE*15)tp={x,y};}
  if(!tp){log('O olho piscou, mas nada aconteceu.','#cccccc');return false;}}
 P.cons[id]--;if(!P.cons[id])delete P.cons[id];
 const calma=()=>{for(const m of mons)if(m.state==='chase'){m.state='idle';m.sx=m.x;m.sy=m.y;}P.target=null;P.auto=false;P.dest=null;};
 if(tp){burst(P.x,P.y-8,C.c,18,60);P.x=(tp.x+.5)*TILE;P.y=(tp.y+.5)*TILE;calma();burst(P.x,P.y-8,C.c,18,60);log(`${C.n}: um piscar de olhos e você está em outro lugar!`,'#9fe8a0');save();return true;}
 if(e.home){const to=MAPS[P.lastTown]&&MAPS[P.lastTown].town?P.lastTown:'valdor';log(`${C.n}: de volta para ${MAPS[to].n}.`,'#9fe8a0');burst(P.x,P.y-8,'#8fb0ff',24,60);changeMap(to,'@centro');save();return true;}
 if(e.heal){const v=Math.round(P.st.hp*e.heal);P.hp=Math.min(P.st.hp,P.hp+v);addText(P.x,P.y-24,'+'+v,'#7dff5a');}
 if(e.mana){const v=Math.round(P.st.mp*e.mana);P.mp=Math.min(P.st.mp,P.mp+v);addText(P.x+8,P.y-30,'+'+v,'#80a8ff');}
 if(e.gold){const v=ri(4,9)*(P.lvl+4);P.gold+=v;addText(P.x,P.y-24,'+'+v+'g','#ffd24a');}
 if(e.furt){P.stealth={t:e.furt};P.ambush=false;calma();}
 if(e.anti)P.pdot=null;
 if(e.shield)P.shield={hp:Math.round(P.st.hp*e.shield),t:e.t,c:C.c};
 const t=conTimed(e),re=P.consAt[id]>0;if(t){P.consAt[id]=t;recalc();}
 log(`${C.n}: ${consDesc(e).replace(/ \(.*?\)/g,'')}${re?' (tempo renovado)':''}`,'#9fe8a0');burst(P.x,P.y-10,C.c,16,50);save();return true;}
// o que cai: monstros (chamado pelo killMonster do 02) e baús (openChest do 02)
function dropCons(m){if(!CONS[m.type]||m.boss||m.owner||m.d.clone)return;if(R()<(m.type==='mimico'?.5:m.elite?.2:.05)*luckMul())dropLoot(m.x,m.y,{kind:'con',con:m.type});}
function chestCons(c){if(R()>=CONCH[c.tier])return;const L=[...new Set(mons.filter(m=>!m.boss&&!m.owner).map(m=>m.type))].filter(t=>CONS[t]&&t!=='mimico');
 dropLoot(c.x,c.y-2,{kind:'con',con:R()<.2||!L.length?'retorno':pick(L)});}
// bolsa (12): entradas da aba Consumíveis e o detalhe de cada um
function consEntries(E){for(const id in CONS)if(P.cons[id]>0)E.push({key:'con:'+id,img:conIcon(id),n:P.cons[id],name:CONS[id].n});}
function consDetail(id){const C=CONS[id],n=P.cons[id],t=P.consAt[id];if(!C||!n)return null;
 const de=id==='retorno'?'Só se acha em baús.':`Deixado por: ${MDEF[id].n}.`;
 return[`<h3>${C.n}</h3><div class="meta">Consumível • ${n} na bolsa • peso ${WCON} cada</div><div>${consDesc(C.e)} ${de}</div>`+(t>0?`<div class="pos">Ativo: faltam ${mmss(t)}. Usar outro renova o tempo.</div>`:''),
  `<button class="btn sm gold" data-a="use">Usar</button><button class="btn sm" data-a="drop1">Descartar 1</button>`];}
