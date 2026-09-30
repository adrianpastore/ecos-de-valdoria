// Ecos de Valdoria — Casas com interior: a casa da Mestra Elara (e, a seguir, o ferreiro)
'use strict';
// ================== SPRITES ==================
// casa com placa: o símbolo na placa diz o que tem lá dentro (o nome só aparece com o mouse)
// base: genHouse (casa de Valdor) ou genCabin (cabana rústica, em 13); o símbolo da placa é o mesmo em todas as cidades
// casas mais altas que 32 px (ex.: as de Arcádia, com torrezinha) têm a porta mais embaixo: a placa desce junto
function signHouse(roof,roofD,board,sym,base=genHouse){const g=base(roof,roofD),x=g.getContext('2d'),f=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
 x.translate(0,g.height-32);f(K,10,14,12,7);f(board,11,15,10,5);f('#00000033',11,19,10,1);sym(f);x.setTransform(1,0,0,1,0,0);return g;}
const SYM_ESTRELA=f=>{f('#ffe070',15,15,2,5);f('#ffe070',13,17,6,1);f('#ffe070',14,16,4,3);f('#fff8c0',15,17,2,1);};
const SYM_BIGORNA=f=>{f('#c8c8d0',12,16,8,2);f('#e8e8f0',12,16,8,1);f('#c8c8d0',14,18,4,1);f('#9a98a0',13,19,6,1);f('#4a3222',19,15,1,3);f('#9a98a0',18,15,3,1);};
reg('casaElara',signHouse('#6a8a3a','#4a6a24','#5a3a7a',SYM_ESTRELA));reg('casaElaraR',signHouse('#5a7a3a','#3e5a28','#5a3a7a',SYM_ESTRELA,genCabin));
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // estante de livros e a mesa com bola de cristal da Elara
 reg('estante',box(16,26,f=>{f(K,1,0,14,26);f('#6a4222',2,1,12,24);for(const y of[2,9,16]){f('#3a2414',3,y,10,6);
  for(let i=0;i<5;i++)f(['#b8423a','#3a6ab8','#6a8a3a','#c8a030','#7a4ab0'][(i+y)%5],3+i*2,y+1+(i%2),2,5-(i%2));f('#8a5a30',2,y+6,12,1);}}));
 reg('mesaCristal',box(32,22,f=>{f(K,2,9,28,7);f('#5a3a7a',3,10,26,5);f('#7a5a9a',3,10,26,1);f('#e8b43c',3,14,26,1);f(K,5,16,3,6);f('#4a2a5a',6,16,1,6);f(K,24,16,3,6);f('#4a2a5a',25,16,1,6);
  f(K,12,0,8,10);f('#7ae0ff',13,1,6,7);f('#d8f8ff',14,2,2,2);f('#3ab0d8',16,5,3,2);f(K,11,8,10,2);f('#c8a030',12,8,8,1);
  f('#f4ecd8',5,6,2,4);f('#ffd24a',5,5,2,1);f('#f4ecd8',25,6,2,4);f('#ffd24a',25,5,2,1);}));}

// ================== CASAS COM INTERIOR ==================
// Troca o sprite da casa em at=[tx,ty], põe a porta embaixo dela e cria o cômodo (room=[largura,altura]) com a porta de volta.
function houseInterior({id,city,at,sprite,name,room,deco,seed,extra}){const C=MAPS[city],[hx,hy]=at;
 C.houses=(C.houses||[]).filter(h=>!(h[0]===hx&&h[1]===hy)).concat([[hx,hy,sprite,name]]);
 C.portals[id]=[hx+.5,hy+1,'porta'];
 MAPS[id]=Object.assign({n:name,s:'',interior:1,city,theme:8,seed,color:'#2a1c12',home:city,room,portals:{[city]:[TC.x,TC.y+(room[1]>>1),'porta']},deco},extra);}


// ================== FERREIRO (REFINAMENTO) ==================
// A casa azul, embaixo à direita da praça de Valdor, com bigorna na placa. Regras aprovadas pelo dono (28/09/2026):
// arma usa Minério Bruto (Zumbi Mineiro); armaduras e acessórios usam Núcleo de Pedra (Golem). 1 material + ouro por tentativa.
// Ouro: 100 no +1 e dobra a cada nível. +1 a +5 sempre dão certo; +6..+10: 60/55/50/40/35%. Na falha, 50% de o item quebrar.
// Cada + dá +5% nos atributos do item (com pelo menos +1 a cada 2 níveis, para atributos pequenos) e o nome mostra o nível.
reg('ferraria',signHouse('#3a6ab8','#244a8a','#8a5a30',SYM_BIGORNA));reg('ferrariaR',signHouse('#4a5a6a','#323e4a','#8a5a30',SYM_BIGORNA,genCabin));
def('ferreiro',["......kkkk......",".....kHHHHk.....","....kssssssk....","....kseSSesk....","....kBBBBBBk....",".....kBBBBk.....","..kkssAAAAsskk..",".ksskAAAAAAksk..",".ksskAAgAAAksww.","..kkkAAAAAAkkww.","....kAAAAAAk.y..","....kPPPPPPk.y..","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk..kkk...."],
 {H:'#b8423a',s:'#e0a878',e:K,S:'#c8906c',B:'#8a4a22',A:'#5a3a22',g:'#e8b43c',w:'#8d8a86',y:'#6a4526',P:'#3a3552',b:'#4a3222'});
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 reg('bigorna',box(16,12,f=>{f(K,0,1,16,4);f('#6d6a70',1,2,14,2);f('#9a98a0',1,2,14,1);f(K,5,5,6,3);f('#5d5a60',6,5,4,3);f(K,3,8,10,4);f('#4d4a50',4,9,8,2);}));
 reg('forja',box(32,28,f=>{f(K,11,0,10,7);f('#6d685c',12,1,8,6);f(K,1,6,30,22);f('#8d8778',2,7,28,20);f('#6d685c',2,11,28,1);f('#6d685c',2,23,28,1);
  f(K,8,12,16,10);f('#3a1a0a',9,13,14,8);f('#ff6a1a',10,16,12,5);f('#ffd24a',12,17,8,3);f('#fff3b0',14,18,4,1);f('#5d584c',2,26,28,1);}));}
const SMITH={x:-9999,y:-9999},REF_OK=[1,1,1,1,1,.6,.55,.5,.4,.35];
const refCost=r=>100*2**r,refMat=it=>it.slot==='arma'?'zumbi':'golem';
const refVal=(b,r)=>Math.max(b+Math.floor(r/2),Math.round(b*(1+.05*r)));
function refStats(it){if(!it.bs)it.bs=Object.assign({},it.stats);const r=it.ref||0;for(const k in it.bs)it.stats[k]=refVal(it.bs[k],r);
 it.base=it.base||it.name;it.name=r?it.base+' +'+r:it.base;}
// roll: sorteio (trocável nos testes); a 1ª jogada decide o sucesso, a 2ª se o item quebra na falha
function refine(it,roll=R){const r=it.ref||0;if(!it||r>=10)return;const cost=refCost(r),m=refMat(it),M=LOOTM[m];
 if(P.gold<cost){log('Ouro insuficiente para refinar.','#ff6b6b');return;}if(!(P.mats[m]>0)){log(`Falta ${M.n} para refinar.`,'#ff6b6b');return;}
 P.gold-=cost;P.mats[m]--;if(!P.mats[m])delete P.mats[m];
 if(roll()<REF_OK[r]){it.ref=r+1;refStats(it);banner('Refinado!',it.name);log(`O ferreiro refinou: ${it.name}.`,'#ffd24a');}
 else if(roll()<.5){const s=Object.keys(P.equip).find(k=>P.equip[k]===it);if(s)delete P.equip[s];else P.inv.splice(P.inv.indexOf(it),1);
  smithSel=null;banner('O item quebrou!',it.name);log(`O metal não aguentou: ${it.name} quebrou.`,'#ff6b6b');shake(3);}
 else log(`O refinamento falhou, mas ${it.name} resistiu.`,'#ffb040');
 recalc();if(!$('smith').classList.contains('hidden'))renderSmith();save();}
let smithSel=null;
function openSmith(){closeAll();smithSel=null;renderSmith();$('smith').classList.remove('hidden');}
function renderSmith(){const B=$('smithBody'),list=[...Object.values(P.equip).filter(Boolean),...P.inv];
 let h=`<p class="flav">"Traga ouro e o minério certo, e eu deixo seu equipamento mais forte. Até o +5 não tem perigo. Depois disso... às vezes o metal não aguenta."</p>`;
 h+=list.length?'<div class="grid">'+list.map((it,i)=>`<button class="slot${smithSel===it?' sel':''}" data-i="${i}" title="${it.name}" style="border-color:${RARC[it.rar]}"><img src="${iconOf(it)}" alt="">${it.ref?`<span class="qt">+${it.ref}</span>`:''}</button>`).join('')+'</div>':'<p>Você não tem equipamentos.</p>';
 const it=smithSel;
 if(it){const r=it.ref||0,m=refMat(it),M=LOOTM[m],have=P.mats[m]||0,eq=Object.values(P.equip).includes(it);
  h+=`<div class="detail"><h3 class="r${it.rar}">${it.name}</h3><div class="meta">${SLOTN[it.slot]}${eq?' • equipado':''}</div>`;
  if(r>=10)h+='<div>Este item já está no máximo (+10).</div>';
  else{const ch=REF_OK[r],bs=it.bs||it.stats;
   h+=`<div>Para <b>+${r+1}</b>: `+Object.keys(bs).map(k=>`${STN[k]} ${it.stats[k]} → <span class="pos">${refVal(bs[k],r+1)}</span>`).join(' • ')+`</div>`+
    `<div>Custo: <b>${refCost(r)}g</b> e <b>1× ${M.n}</b> (você tem ${have})</div>`+
    `<div>Chance: <b>${Math.round(ch*100)}%</b> • ${ch<1?'<span class="neg">se falhar, 50% de chance de o item quebrar</span>':'sem risco'}</div>`+
    `<div class="acts"><button class="btn sm gold" id="refBtn"${P.gold<refCost(r)||!have?' disabled':''}>Refinar</button></div>`;}
  h+='</div>';}
 B.innerHTML=h;B.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>{smithSel=list[+b.dataset.i];renderSmith();});const rb=$('refBtn');if(rb)rb.onclick=()=>refine(smithSel);}

// ================== SERVIÇOS PADRÃO DE CADA CIDADE PRINCIPAL ==================
// Regra do dono (28/09/2026): toda cidade principal tem o Mercador Bento (na praça), a Guilda (13, guildHall),
// a casa da Mestra Elara (placa com estrela, à esquerda da praça) e o ferreiro (placa com bigorna, embaixo à direita).
// Mesmos lugares e mesmos símbolos em todas, para o jogador reconhecer de longe.
// Cidade nova: town:1 no MAPS, guildHall(...) no 13, cityHouses(...) aqui e missões com o seu city.
// mentorAt: onde a Elara fica em cada mapa; null = não fica ali (08 usa isso ao trocar de mapa).
// estilo: true = cabanas (vilas florestais, sprites com 'R'); texto = sufixo do estilo da cidade (ex.: 'A' em Arcádia)
function cityHouses(city,sfx,seed,estilo){const R_=estilo===true?'R':estilo||'';
 houseInterior({id:'casaElara'+sfx,city,at:[TC.x-7,TC.y-3],sprite:'casaElara'+R_,name:'Casa da Mestra Elara',room:[12,8],seed,
  deco:[[TC.x-5,TC.y-4,'estante'],[TC.x-4,TC.y-4,'estante'],[TC.x+3,TC.y-4,'estante'],[TC.x+4,TC.y-4,'estante'],[TC.x-1,TC.y-4,'mesaCristal',1]],
  extra:{s:'Mentora de todas as classes',mentorAt:[TC.x,TC.y-2]}});
 houseInterior({id:'ferraria'+sfx,city,at:[TC.x+6,TC.y+4],sprite:'ferraria'+R_,name:'Ferreiro',room:[14,8],seed:seed+10,
  deco:[[TC.x-2,TC.y-2,'ferreiro'],[TC.x,TC.y-2,'bigorna'],[TC.x+2,TC.y-4,'forja',1],[TC.x-6,TC.y-4,'barril'],[TC.x+5,TC.y-4,'barril']],
  extra:{s:'Refinamento de equipamentos',smith:[TC.x-2,TC.y-2]}});
 MAPS[city].mentorAt=null;}
cityHouses('valdor','',1011); // Valdor sem sufixo: saves já podem estar nos mapas 'casaElara' e 'ferraria'
cityHouses('pinheiral','Pinheiral',1031,true);
// o mapa inicial (Valdor) não passa por switchMapNow num herói novo: tira a Elara da praça já no carregamento
if(MAPS[CUR].mentorAt===null){MENTOR.x=-9999;MENTOR.y=-9999;}
