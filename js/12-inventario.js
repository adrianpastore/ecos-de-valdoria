// Ecos de Valdoria — Inventário em abas (como no Ragnarok), peso e materiais de monstros
'use strict';
// ================== PESO ==================
// Equipamento vestido também pesa. Acima de 50% o herói não regenera sozinho; acima de 90% não luta.
const WT={arma:40,elmo:25,peito:60,botas:25,anel:5},WPOT=5;
const CAPF={guerreiro:[700,25],arqueira:[600,20],mago:[500,18]};
const itemW=it=>WT[it.slot]||10;
function weightNow(){let w=(P.pots.hp+P.pots.mp)*WPOT;for(const it of P.inv)w+=itemW(it);for(const s in P.equip)if(P.equip[s])w+=itemW(P.equip[s]);
 for(const k in P.mats)w+=(LOOTM[k]?LOOTM[k].w:1)*P.mats[k];for(const k in P.tons||{})w+=P.tons[k]*WPOT;return w;} // tônicos (20) pesam como poções
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
// Desenho próprio de cada material (06/10/2026, redesenhados a pedido do dono): C = cor do material, c = brilho, d = sombra, w = branco; e, f, g = cores extras
// daquele desenho. O contorno escuro é posto sozinho em volta (olM), então o desenho vai sem 'k' por fora (até 14 de largura); 'k' dentro vale como risco escuro.
function olM(rows){const w=Math.max(...rows.map(r=>r.length))+2,h=rows.length+2,G=Array.from({length:h},(_,y)=>Array.from({length:w},(_,x)=>(rows[y-1]||'')[x-1]||'.'));
 const O=G.map(r=>r.slice());for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(G[y][x]==='.')for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const c=G[y+dy]&&G[y+dy][x+dx];if(c&&c!=='.'&&c!=='k'){O[y][x]='k';break;}}return O.map(r=>r.join(''));}
function defMat(k){const c=LOOTM[k].c,s=MATSHP[k]||[MATROWS];def('mat_'+k,MATSHP[k]?olM(s[0]):s[0],Object.assign({C:c,c:shadeHex(c,.45),d:shadeHex(c,-.35),w:'#ffffff'},s[1]));}
const MATSHP={
 slime:[["....wcc.......","...wcCCC......","..cCCCCCC.....",".cCCCeCCCd....",".CCCCCCCCCd...","cCCeCCCCeCCd..","cCCCCCCCCCdd..",".dCCCCCCCCdd..","..ddddddddd..."],{e:'#2f8a3a'}],
 esquilo:[["....ccCCC....","..ccCCCCCCC..",".cCCCCwCCCCd.",".cCCCd..dCCd.","..dd....cCCd.",".......cCCCd.","......cCCCd..",".....cCCCd...","....cCCCd....","...cCCCd.....","..eCCdd......",".eed........."],{e:'#f0e0c0'}],
 lobo:[["..ffff.....","..eeeee....","..cwCCe....","...cCCC....","...cCCCd...","....cCCd...","....cCCd...",".....cCd...",".....cCd...","......Cd...","......d...."],{e:'#c8a088',f:'#9a6a58'}],
 aranha:[["..eeeeeeee..","..ffffffff..","...cCwCCd...","...CcCCCd...","...cCCwCd...","...CcCCCd...","...cCCCCd...","..eeeeeeee..","..ffffffff..","........CC..",".........Cd."],{e:'#b07a48',f:'#6a4424'}],
 esqueleto:[[".cc.......","cwCc......","cCCCd.....",".dCCCc....","...cCCc...","....cCCc...",".....cCCd..","......cCCCd",".......cCCd",".......dCd."]],
 orc:[["........cc","........cC",".......cCC","......cCCd",".....cCCCd","....cCCCd.","...cCCCd..","..wCCCd...",".eeCCd....","eeeed.....",".ee......."],{e:'#5a7a3a'}],
 golem:[["....dddd.....","..dCCCCCCd...",".dCcCCdCCCd..","dCcCCefeCCCd.","dCCCefwfeCCd.","dCCdeffeCdCd.","dCCCCeeCCCCd.",".dCCdCCCCCd..","..dCCCCCCd...","....dddd....."],{e:'#3aa8e8',f:'#9ff0ff'}],
 mimico:[["eeeeeeeeee","eCCCCCCCCe",".cwCCCCCd.",".cCCCCCCd.","..cCCCCd..","..cCCCCd..","...cCCd...","...cCCd...","....Cd....","....d....."],{e:'#c83a4a'}],
 esporinho:[["....eeeeee....","..eeCCCCCCee..",".eCCwCCCCwCCe.","eCCwwCCCCCCCCe","eCCCCCCwCCCCCe","edddddddddddde","....ffffff....","....fgffff....","....ffffgf....","....ffffff....","...dddddddd..."],{e:'#b8582a',f:'#f0e0c0',g:'#d8c8a8'}],
 esporov:[["....w...e...","..e....w....","......e.....","....ffff....","...fgggff...","..fCCCCCCf..",".fCcCCCCCdf.",".fCCCwCCCdf.",".fCCCCCCddf.","..fddddddf..","...ffffff..."],{e:'#e0a0ff',f:'#c8a878',g:'#8a6a48'}],
 verme:[["...ccccccc....","..cCkCkCkCd...",".cCCkCkCkCCd..","cCCCkCkCkCCCd.","cCCCkCkCkCCCd.","dCCCkCkCkCCCd.",".dkkkkkkkkkd.."]],
 salgueiro:[["........ee....",".......eGGe...","......eGgG....","...ee..eGf....","..eGGe.fe.....","..eGgGef......","...e.ff.......","....ff........","...ff.........","..ff..........",".ff..........."],{e:'#2f6a2a',G:'#7ab04a',g:'#b8e080',f:'#8a5a2c'}],
 salgueiroA:[[".....cc.....","....cwCC....","....cCCC....","...cwCCCd...","..cCCCCCCd..","..cCCeeCCd..",".cCCeffeCCd.",".cCCCeeCCCd.",".cCCCCCCCdd.","..dCCCCCdd..","...dddddd..."],{e:'#8a5a20',f:'#4a2a10'}],
 guaxinim:[["..........ee..",".........eCCe.","........eCCCe.",".......eeeee..","......eCCCe...",".....eeeee....","....eCCCe.....","...eeeee......","..eCCCe.......",".dddd.........","dd............"],{e:'#e8e2d0'}],
 jiboia:[["...dddddd...","..dCCCCCCd..",".dCcewCeCCd.",".dCeeCCeeCd.",".dCCCeCCCCd.",".dCeCCCeCCd.",".dCeeCeeCCd.","..dCCCCCCd..","...dCCCCd...","....dCCd....",".....dd....."],{e:'#2e5a1e'}],
 pegrande:[[".c.c.C.C.c....","cCcCCCCCCCc...","cCCCCdCCdCCd..",".CdCCCCdCCd...","..eeeeeeee....","..eggeeggee...",".cCCCdCCCCd...","cCCdCCCCdCCd..","CCdCdCCdCdCd..",".d.d.d.d.d...."],{e:'#c8a040',g:'#f0d870'}],
 lanterna:[["......e.......",".....eFe......","....eFFe..e...","...eFfFeeFe...","..eFffffFe....","..eFfwwfFe....","..eFfwwfFe....","...eFffFe.....","....eFFe......",".....ee......."],{e:'#c84a1a',F:'#ff9a2a',f:'#ffe070'}],
 duende:[["......cCC.....",".....cCCCd....","....cCCCCd....","...cCdCCCd....","..cCCCCdCd....",".cCCdCCCCd.ee.","cCCCCCdCCdew..","cCdCCCCCCde...",".ddCCdCCdd....","..d.dd.dd....."],{e:'#8a8a98',w:'#d8d8e8'}],
 totem:[["...........f.","..........fwf",".........cCf.","........cCCd.","...e...cCCCd.","...e..cCCCd..","....ecCCCd...","....cCCCd....","...cCCCd.....","..eCCdd......","..gge........","..gg........."],{e:'#8a1a1a',f:'#f0d060',g:'#3a9ad8'}],
 raposa:[["...........ww.","..........wCCw",".........eeCCw","........eeeeC.",".......eeeeee.","......eeeeeef.","....eeeeeeef..","..eeeeeeeff...",".eeeeefff.....","eeefff........",".ff..........."],{e:'#e0803a',f:'#a8502a'}],
 morcego:[["e.............","eCe...........","eCCe.....e....","eCcCee..eCe...","eCcCCCeeCCe...","eCCcCCCCCCe...","eCCCcCCCCCde..","eCdCCdCCdCde..","eCdeCdeCdeCde.","ed.ed.ed..ed.."],{e:'#2a1e34'}],
 esqArq:[[".....w.....","....cCd....","...cCCCd...","..cCCCCCd..","..cCCCCCd..",".cCCCCCCCd.","...dCCCd...","....fff....","....ege....","....fff....","....ege....","....fff...."],{e:'#8a5a2c',f:'#c89060',g:'#e8e2cc'}],
 zumbi:[["....e....e....","...efe..efe...","..efwfe.efe...","..effe.efwfe..","..dCeeddeffe..",".dCcCeCCdeeCd.","dCcCCCCCCCCCd.","dCCCdCCCCdCCd.",".dCCCCdCCCCd..","..dddddddddd.."],{e:'#3a8ab0',f:'#8ad8f0'}],
 wyrm:[["...ggggggg....","..gCCCCCCCg...",".gCcwCCCCCdg..",".gCcCCCCCCdg..",".gCcCCCCCCdg..","..gCcCCCCdg...","..gCcCCCCdg...","...gCcCCdg....","....gCCdg.....",".....gdg......","......g......."],{e:'#f0c040',g:'#e8b43c'}],
 mestreMasc:[[".cCCCCCCCCd..","cCwCCCCCCCCd.","cCCCCCCCCkCd.","cCkkkCCkkkkd.","cCekkCCkkekd.","cCCCCdkCCCCd.","cCCCCdkCCCCd.",".cCCkCCCCdd..",".cCCCkkkCdd..","..dCCCkCCd...","...ddddkd...."],{e:'#f0d040'}],
 totemAnciao:[["...ffffffff...","..ffeeeeeeff..","..fedfffdeef..","..fefgggfeef..","..feffgffeef..","..fedfffdeef..","..ffeeeeeeff..","..fCCCCCCCCf..","..fCgCCCCgCf..","..fCCgCCgCCf..","..fCCCggCCCf..","...ffffffff..."],{e:'#a07a50',f:'#5a3a24',g:'#7fe07a'}],
 raposaAnc:[["......e.......","..e..eee..e...","....ffffff....","...fwwCCCCf...","..fwCCCCCCdf..","e.fCCCCCCCdf.e","..fCCCCCCddf..","...fCCCCddf...","....ffffff....","..e..eee..e...","......e......."],{e:'#fff0a0',f:'#e0a840'}],
 senhorOssos:[["g...g...g...g","Cc.cCc.cCc.cC","CCcCCCcCCCcCC","cCCCCCCCCCCCd","CCeCCCfCCCeCd","CCCCCCCCCCCCd","dddddddddddd."],{e:'#8a3ad0',f:'#d070ff',g:'#e8e2cc'}]};
for(const k in LOOTM)defMat(k);
const matIc={},matIcon=k=>matIc[k]||(matIc[k]=toURL(SPR['mat_'+k].n,4));
function dropMat(m){if(!LOOTM[m.type])return;const n=m.boss?3:m.elite?2:R()<.4*luckMul()?1:0;if(n)dropLoot(m.x,m.y,{kind:'mat',mat:m.type,n});}

// ================== ABAS DA BOLSA ==================
// Consumíveis (usar/abrir) • Equipamentos • Itens (materiais). As poções continuam em P.pots e os equipamentos em P.inv.
let bagTab='equip';
$('bagTabs').querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{bagTab=b.dataset.tab;sel=null;renderBag();});
// No celular (modo toque) a coluna do boneco não cabe inteira: mostra ou o que está vestido ou os status (classe st em #bagLeft)
function dollView(v){$('bagLeft').classList.toggle('st',v==='st');document.querySelectorAll('[data-dv]').forEach(b=>b.classList.toggle('on',b.dataset.dv===v));}
document.querySelectorAll('[data-dv]').forEach(b=>b.onclick=()=>dollView(b.dataset.dv));
function bagEntries(){const E=[];
 if(bagTab==='uso'){for(const t of['hp','mp'])if(P.pots[t]>0)E.push({key:'pot:'+t,img:iconURL('pot'+t),n:P.pots[t],name:t==='hp'?'Poção de vida':'Poção de mana'});
  for(const[k,n]of TON)if(P.tons[k]>0)E.push({key:'ton:'+k,img:tonIcon(k),n:P.tons[k],name:n});}
 else if(bagTab==='equip'){for(const it of P.inv)E.push({key:it.id,img:iconOf(it),n:1,name:it.name,border:RARC[it.rar],up:power(it)>power(P.equip[it.slot]),ref:it.ref});}
 else for(const k of Object.keys(P.mats).sort((a,b)=>LOOTM[a].n.localeCompare(LOOTM[b].n)))if(P.mats[k]>0)E.push({key:'mat:'+k,img:matIcon(k),n:P.mats[k],name:LOOTM[k].n});
 return E;}
function stackDetail(d,key){const[kind,id]=key.split(':'),near=hyp(NPC.x-P.x,NPC.y-P.y)<70;let h,acts;
 if(kind==='pot'){const n=P.pots[id];if(!n){sel=null;return renderBag();}
  h=`<h3>${id==='hp'?'Poção de vida':'Poção de mana'}</h3><div class="meta">Consumível • ${n} na bolsa • peso ${WPOT} cada</div><div>Recupera 45% da ${id==='hp'?'vida':'mana'}. Atalho: ${id==='hp'?'Q':'R'}.</div>`;
  acts=`<button class="btn sm gold" data-a="use">Usar</button><button class="btn sm" data-a="drop1">Descartar 1</button>`;}
 else if(kind==='ton'){const n=P.tons[id],t=P.tonAt[id];if(!n){sel=null;return renderBag();}
  h=`<h3>${TONN[id]}</h3><div class="meta">Consumível • ${n} na bolsa • peso ${WPOT} cada</div><div>+${TON_B} de ${attrN(id)[1]} por ${TON_T/60} minutos. Do bar da Guilda.</div>`+
   (t>0?`<div class="pos">Ativo: faltam ${mmss(t)}. Tomar outro renova o tempo.</div>`:'');
  acts=`<button class="btn sm gold" data-a="use">Tomar</button><button class="btn sm" data-a="drop1">Descartar 1</button>`;}
 else{const M=LOOTM[id],n=P.mats[id]||0;if(!n){sel=null;return renderBag();}
  h=`<h3>${M.n}</h3><div class="meta">Item • ${n} na bolsa • peso ${M.w} cada</div><div>Deixado por: ${MDEF[id].n}. O mercador da praça paga ${M.v}g por unidade.</div>`;
  acts=near?`<button class="btn sm gold" data-a="sell1">Vender 1 por ${M.v}g</button>`+(n>1?`<button class="btn sm" data-a="sellAll">Vender ${n} por ${M.v*n}g</button>`:'')
   :`<button class="btn sm" data-a="drop1">Descartar 1</button>`+(n>1?`<button class="btn sm" data-a="dropAll">Descartar todos</button>`:'');}
 d.innerHTML=h+`<div class="acts">${acts}</div>`;d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>stackAction(b.dataset.a,kind,id));}
function stackAction(a,kind,id){
 if(kind==='pot'){if(a==='use')usePot(id);else P.pots[id]=Math.max(0,P.pots[id]-1);updateHotbar();}
 else if(kind==='ton'){if(a==='use')drinkTonic(id);else if(P.tons[id]>0&&!--P.tons[id])delete P.tons[id];}
 else{const M=LOOTM[id],n=P.mats[id]||0,q=a.endsWith('All')?n:1;P.mats[id]=n-q;
  if(a.startsWith('sell')){P.gold+=M.v*q;log(`Vendeu ${q}× ${M.n} por ${M.v*q}g.`,'#ffd24a');}if(!P.mats[id])delete P.mats[id];}
 renderBag();save();}
function sellAllMats(){let g=0,n=0;for(const k in P.mats){g+=LOOTM[k].v*P.mats[k];n+=P.mats[k];}P.mats={};P.gold+=g;
 log(n?`Vendeu ${n} materiais por ${g}g.`:'Nenhum material para vender.','#ffd24a');if(!bagEl.classList.contains('hidden'))renderBag();save();}
$('sellMats').onclick=()=>P&&sellAllMats();
