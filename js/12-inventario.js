// Ecos de Valdoria — Inventário em abas (como no Ragnarok), peso e materiais de monstros
'use strict';
// ================== PESO ==================
// Equipamento vestido também pesa. Acima de 50% o herói não regenera sozinho; acima de 90% não luta.
const WT={arma:40,elmo:25,peito:60,botas:25,anel:5},WPOT=5;
const CAPF={guerreiro:[700,25],arqueira:[600,20],mago:[500,18]};
const itemW=it=>WT[it.slot]||10;
function weightNow(){let w=(P.pots.hp+P.pots.mp)*WPOT;for(const it of P.inv)w+=itemW(it);for(const s in P.equip)if(P.equip[s])w+=itemW(P.equip[s]);
 for(const k in P.mats)w+=(LOOTM[k]?LOOTM[k].w:1)*P.mats[k];return w;}
function capOf(){const c=CAPF[P.cls]||[600,20];return c[0]+c[1]*P.lvl+(P.attr?(P.attr.forca-ATTR_INI)*10:0);} // Força: +10 por ponto
const wRatio=()=>weightNow()/capOf(),canCarry=w=>weightNow()+w<=capOf();
let heavyMsgT=-99,wLvl=0;
function heavyMsg(t){if(time-heavyMsgT>3){heavyMsgT=time;log(t||'Peso demais! Venda ou descarte algo para pegar mais.','#ff6b6b');}}
function tooHeavy(){if(wRatio()<=.9)return false;heavyMsg('Peso acima de 90%: você não consegue lutar. Venda ou descarte algo.');return true;}
function weightHUD(){const r=wRatio(),l=r>.9?2:r>.5?1:0,b=$('bagBtn');b.classList.toggle('heavy',l===1);b.classList.toggle('over',l===2);
 if(l>wLvl)log(l===2?'Peso acima de 90%: você não consegue atacar nem usar habilidades.':'Peso acima de 50%: você parou de regenerar vida e mana.','#ffb040');wLvl=l;}
function weightBar(){const w=weightNow(),c=capOf(),r=w/c,f=$('wFill');f.style.width=Math.min(100,r*100)+'%';
 f.style.background=r>.9?'linear-gradient(#ff6a5a,#a82020)':r>.5?'linear-gradient(#ffc04a,#b07010)':'';
 $('wTxt').textContent=`Peso ${w} / ${c}`+(r>.9?' • não consegue lutar':r>.5?' • sem regeneração':'');}

// ================== MATERIAIS ==================
// Um por monstro (a chave é o tipo do monstro). Valor no Bento: 2 a 15 moedas conforme o monstro; de chefe, 150.
const LOOTM={};
for(const[k,n,c,w]of[['slime','Musgo de Geleia','#5fcf5a'],['esquilo','Pelo de Esquilo','#d8783a'],['lobo','Presa de Lobo','#e8e2cc'],['aranha','Seda de Aranha','#d8d0e8'],
 ['esqueleto','Osso Velho','#e8e2cc'],['orc','Dente de Orc','#f5f0da'],['golem','Núcleo de Pedra','#8a8478',10],['mimico','Dente de Mímico','#ffffff'],['esporinho','Esporo Laranja','#d8743a'],
 ['esporov','Pó Venenoso','#8a3aa0'],['verme','Casca de Verme','#d87a9a'],['salgueiro','Galho Vivo','#7ab04a'],['salgueiroA','Seiva Antiga','#c8a040'],['guaxinim','Rabo Listrado','#5a5a62'],
 ['jiboia','Escama de Jiboia','#5a9a3a'],['pegrande','Tufo de Pelo Grosso','#7a5a3a'],['lanterna','Brasa Errante','#ffb040'],['duende','Lasca de Porrete','#8a5a2c'],['totem','Pena Ritual','#c8323a'],
 ['raposa','Cauda de Raposa','#f4efe0'],['morcego','Asa de Morcego','#4a3a5a'],['esqArq','Ponta de Osso','#c8c0a8'],['zumbi','Minério Bruto','#6a7a8a'],
 ['wyrm','Escama Carmesim','#b0303a'],['mestreMasc','Máscara Rachada','#c8a030'],['totemAnciao','Madeira Sagrada','#6a5a48'],['raposaAnc','Pérola de Raposa','#ffe0a0'],['senhorOssos','Coroa de Osso','#e8b43c']]){
 const d=MDEF[k];LOOTM[k]={n,c,w:w||1,v:d.boss?150:clamp(Math.round(d.xp/3),2,15)};}
const shadeHex=(h,f)=>'#'+hexRGB(h).map(v=>clamp(Math.round(f>0?v+(255-v)*f:v*(1+f)),0,255).toString(16).padStart(2,'0')).join('');
const MATROWS=["...kkkk...","..kCCCCk..",".kCcCCCCk.","kCcCCCCCCk","kCCCCCCCdk","kCCCCCCddk",".kCCCCddk.","..kkkkkk.."];
// Desenho próprio de cada material: C = cor do material, c = brilho, d = sombra; e, f, g = cores extras daquele desenho
const MATSHP={
 slime:[["....kk....","...kcCk...","..kcCCCk..",".kcCCCCdk.","kCCCCCCCdk","kCCdCCCCdk",".kdCCdCdk.","..kkkdkkk.",".....k...."]],
 esquilo:[["..k...k....",".kCk.kCk...",".kCCkCCk.k.","..kCCCCkkCk",".kCCcCCCCk.","kCcCCCCdCk.","kCCCCCddk..",".kdCCddk...","..kkkkk...."]],
 lobo:[[".kkkk.....","kcCCCk....","kCCCCCk...",".kCCCCk...","..kCCCdk..","...kCCdk..","...kCCdk..","....kCdk..","....kdk...",".....k...."]],
 aranha:[[".kkkkkkkk...","keeeeeeeek..",".kcCcCcCk...",".kCcCcCdk...",".kcCcCdCkk..",".kCcCdCdkCk.","keeeeeeeekCk","kfffffffk.kk",".kkkkkkk...."],{e:'#b07a48',f:'#6a4424'}],
 esqueleto:[[".kk......kk.","kcCk....kCCk","kCCCkkkkCCdk",".kCcCCCCCdk.","kCCdkkkkdCdk","kCdk....kddk",".kk......kk."]],
 orc:[["......kk..",".....kcCk.","....kcCCk.","...kCCCdk.","..kCCCdk..",".kCCCdk...","kdCCdk....","kdddk.....",".kkk......"]],
 golem:[["...kkkk...",".kkcCCCkk.","kcCCCCCCdk","kCCdeedCdk","kCCeffeCdk","kCCdeedCdk","kCCCCCCddk",".kkdCCddk.","...kkkk..."],{e:'#6fd8ff',f:'#e0fbff'}],
 mimico:[["..kkkkkk..",".keeeeeek.",".kCCCCCCk.",".kcCCCCdk.","..kCCCdk..","..kcCCdk..","...kCdk...","...kCdk...","....kk...."],{e:'#c83a4a'}],
 esporinho:[["..kkkkkk..",".kcCeCCCk.","kcCCCCeCCk","kCeCCCCCdk","kddddddddk",".kkkffkkk.","...kffk...","...kffk...","...kkkk..."],{e:'#fff0d0',f:'#f0e0c0'}],
 esporov:[["....e.....","..e...e...","....kk....","...kcCk...","..kcCCCk..",".kCCCeCCk.","kCCCCCCddk","kkkkkkkkkk"],{e:'#e0a0ff'}],
 verme:[[".kkkk.......","kddddkkkk...","kdkkdcCkckk.","kdkkdCCkCCkk","kdkkdCCkCCdk","kddddCdkCdk.",".kkkkkkkkk.."]],
 salgueiro:[[".......kk.","......kCCk","..kk..kCck",".kCCk.kek.",".kcCCkek..","..kkekek..","....kek...","...kek....","..kek.....","..kk......"],{e:'#8a5a2c'}],
 salgueiroA:[["....kk....","...kcCk...","...kcCk...","..kcCCCk..",".kcCCCCdk.",".kCcCCCdk.",".kCCCCddk.","..kddddk..","...kkkk..."]],
 guaxinim:[[".......kk.","......kcCk",".....kCeek","....keeCCk","...kCCeek.","..keeCCk..",".kCCeek...","kCeeCk....","kkkkk....."],{e:'#e8e2d0'}],
 jiboia:[["..kkkkkkkk",".kCeCCeCCk","kCeCeeCeCk","keCCeCCedk","kCCeCCeCdk","kkkkkkkkk."],{e:'#2e5a1e'}],
 pegrande:[[".k.k.k.k..","kCkCkCkCk.","kCCCCCCCk.",".kcCCCCdk.","..keeeek..",".kCCCCCdk.","kCcCCCCCdk","kCkCkCkdk.",".k.k.k.k.."],{e:'#d8c070'}],
 lanterna:[["....k.....","...kek....","...kek.k..","..keCekek.",".keCfCeek.",".kCfffCek.",".kCfffCdk.","..kCCCdk..","...kkkk..."],{e:'#ff6a2a',f:'#fff4c0'}],
 duende:[["......kk..",".....kcdk.","....kcCdk.","...kcCdk..","..kcCCdk..",".kcCdCdk..","kcCCCdk...","kCdCdk....","kkkkk....."]],
 totem:[["......kkk.",".....keCck","....kCCcek","...kCCcCk.","..kCCcCdk.","..kCcCdk..",".kCcCdk...",".kcddk....","kck.......","kk........"],{e:'#f0d060'}],
 raposa:[["......kkk.",".....kCCck","....kCCCCk","...keCCCk.","..keeeCk..",".keeeeek..","keeeeefk..","keeeffk...",".kkkkk...."],{e:'#e0803a',f:'#a8502a'}],
 morcego:[["kk........","kCkk......","kCCCkk....","kCcCCCkk..","kCCcCCCCkk","kCCCcCCCdk","kCkCCkCCdk","kk.kk.kCdk",".......kk."]],
 esqArq:[["....kk....","...kcCk...","...kcCk...","..kcCCdk..","..kcCCdk..",".kcCCCCdk.",".kkkCCkkk.","...keek...","...keek...","....kk...."],{e:'#8a5a2c'}],
 zumbi:[["...k...k...","..kfk.kfk..","..kek.kek.k","..keekkek.kfk",".kCeeCeeCkek","kcCCeCCeCCek","kCCCCCCCCdk.","kCCeCCCCddk.",".kkkkkkkkk.."],{e:'#8ad8f0',f:'#f0fcff'}],
 wyrm:[[".kkkkkkkk.","keeeeeeeek","kecCCCCdek","kecCCCCdek",".kecCCdek.",".kecCCdek.","..kecdek..","...keek...","....kk...."],{e:'#f0c040'}],
 mestreMasc:[[".kkkkkkkk.","kcCCCCCCdk","kCkkCCkkdk","kCkkCkkkdk","kCCCCkCCdk","kCCCkCCCdk",".kCCkCCdk.","..kCCCdk..","...kkkk..."]],
 totemAnciao:[["..kkkkkk..",".kffffffk.","kffeeeeffk","kffeffeffk",".kffeeffk.",".kCCCCCdk.",".kCgCgCdk.",".kCgCCgdk.",".kCCCCCdk.","..kkkkkk.."],{e:'#a07a50',f:'#d8b88a',g:'#7fe07a'}],
 raposaAnc:[["....e.....","...kkkk...","..kcfCCk..",".kcffCCCk.",".kcfCCCdk.",".kCCCCddk.","..kCCddk..","...kkkk...",".....e...."],{e:'#fff8d0',f:'#ffffff'}],
 senhorOssos:[["k...kk...k","kk.kcCk.kk","kCkCCCCkCk","kcCCCCCCdk","kCCeCCeCdk","kCCCCCCCdk","kkkkkkkkkk"],{e:'#8a3ad0'}]};
for(const k in LOOTM){const c=LOOTM[k].c,s=MATSHP[k]||[MATROWS];def('mat_'+k,s[0],Object.assign({C:c,c:shadeHex(c,.45),d:shadeHex(c,-.35)},s[1]));}
const matIc={},matIcon=k=>matIc[k]||(matIc[k]=toURL(SPR['mat_'+k].n,4));
function dropMat(m){if(!LOOTM[m.type])return;const n=m.boss?3:m.elite?2:R()<.4*luckMul()?1:0;if(n)dropLoot(m.x,m.y,{kind:'mat',mat:m.type,n});}

// ================== ABAS DA BOLSA ==================
// Consumíveis (usar/abrir) • Equipamentos • Itens (materiais). As poções continuam em P.pots e os equipamentos em P.inv.
let bagTab='equip';
$('bagTabs').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{bagTab=b.dataset.tab;sel=null;renderBag();});
function bagEntries(){const E=[];
 if(bagTab==='uso'){for(const t of['hp','mp'])if(P.pots[t]>0)E.push({key:'pot:'+t,img:iconURL('pot'+t),n:P.pots[t],name:t==='hp'?'Poção de vida':'Poção de mana'});}
 else if(bagTab==='equip'){for(const it of P.inv)E.push({key:it.id,img:iconOf(it),n:1,name:it.name,border:RARC[it.rar],up:power(it)>power(P.equip[it.slot]),ref:it.ref});}
 else for(const k of Object.keys(P.mats).sort((a,b)=>LOOTM[a].n.localeCompare(LOOTM[b].n)))if(P.mats[k]>0)E.push({key:'mat:'+k,img:matIcon(k),n:P.mats[k],name:LOOTM[k].n});
 return E;}
function stackDetail(d,key){const[kind,id]=key.split(':'),near=hyp(NPC.x-P.x,NPC.y-P.y)<70;let h,acts;
 if(kind==='pot'){const n=P.pots[id];if(!n){sel=null;return renderBag();}
  h=`<h3>${id==='hp'?'Poção de vida':'Poção de mana'}</h3><div class="meta">Consumível • ${n} na bolsa • peso ${WPOT} cada</div><div>Recupera 45% da ${id==='hp'?'vida':'mana'}. Atalho: ${id==='hp'?'Q':'R'}.</div>`;
  acts=`<button class="btn sm gold" data-a="use">Usar</button><button class="btn sm" data-a="drop1">Descartar 1</button>`;}
 else{const M=LOOTM[id],n=P.mats[id]||0;if(!n){sel=null;return renderBag();}
  h=`<h3>${M.n}</h3><div class="meta">Item • ${n} na bolsa • peso ${M.w} cada</div><div>Deixado por: ${MDEF[id].n}. O Mercador Bento paga ${M.v}g por unidade.</div>`;
  acts=near?`<button class="btn sm gold" data-a="sell1">Vender 1 por ${M.v}g</button>`+(n>1?`<button class="btn sm" data-a="sellAll">Vender ${n} por ${M.v*n}g</button>`:'')
   :`<button class="btn sm" data-a="drop1">Descartar 1</button>`+(n>1?`<button class="btn sm" data-a="dropAll">Descartar todos</button>`:'');}
 d.innerHTML=h+`<div class="acts">${acts}</div>`;d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>stackAction(b.dataset.a,kind,id));}
function stackAction(a,kind,id){
 if(kind==='pot'){if(a==='use')usePot(id);else P.pots[id]=Math.max(0,P.pots[id]-1);updateHotbar();}
 else{const M=LOOTM[id],n=P.mats[id]||0,q=a.endsWith('All')?n:1;P.mats[id]=n-q;
  if(a.startsWith('sell')){P.gold+=M.v*q;log(`Vendeu ${q}× ${M.n} por ${M.v*q}g.`,'#ffd24a');}if(!P.mats[id])delete P.mats[id];}
 renderBag();save();}
function sellAllMats(){let g=0,n=0;for(const k in P.mats){g+=LOOTM[k].v*P.mats[k];n+=P.mats[k];}P.mats={};P.gold+=g;
 log(n?`Vendeu ${n} materiais por ${g}g.`:'Nenhum material para vender.','#ffd24a');if(!bagEl.classList.contains('hidden'))renderBag();save();}
$('sellMats').onclick=()=>P&&sellAllMats();
