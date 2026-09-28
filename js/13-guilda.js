// Ecos de Valdoria — Interiores, a Guilda de Valdor e o mural de missões
'use strict';
// ================== TEMA DE INTERIOR (8) ==================
// piso de tábuas (GP), tapete da entrada (PC: o "trecho de estrada" que entra pela porta vira tapete), paredes de madeira (CLFT)
GP[8]=['#8a6440','#7e5a38','#5a3e24','#9a7450'];PC[8]=['#8a2a2a','#7a2222','#a8443a'];WC[8]=['#1e2e3e','#26384a','#5a7a9a'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[8]=o[8].map(hexRGB);
CLFT[8]=['#6a4a34','#4a3222','#2a1c12','#8a6a4a','#7a5a3e','#120c08','#0d0906'].map(hexRGB);
MINIC.obj[8]='#b08a5a';
// um cômodo retangular no meio do mapa (M.room=[largura,altura]); o resto é parede e escuridão, como na caverna
function roomMask(M){const C=new Uint8Array(W*H),[w,h]=M.room,x0=TC.x-(w>>1),y0=TC.y-(h>>1);
 for(let y=y0;y<y0+h;y++)for(let x=x0;x<x0+w;x++)C[y*W+x]=1;
 for(const p of Object.values(M.portals))C[Math.round(p[1])*W+Math.round(p[0])]=1;return C;}

// ================== SPRITES ==================
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // a casa da Guilda: uma placa com espadas cruzadas sobre a porta; o telhado muda por cidade (Valdor roxo, Pinheiral verde-pinho)
 for(const[nm,roof,roofD]of[['guilda','#6a3a8a','#4a2468'],['guilda2','#2f6a4a','#1f4a34']]){
  const g=genHouse(roof,roofD),x=g.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  f(K,10,14,12,7);f('#c8a060',11,15,10,5);f('#8a6a3a',11,19,10,1);
  for(let i=0;i<6;i++){f('#dfe6ef',13+i,15+i*.66|0,1,1);f('#dfe6ef',18-i,15+i*.66|0,1,1);}f('#e8b43c',15,19,2,1);
  reg(nm,g);}
 reg('mural',box(32,26,f=>{f(K,1,0,30,22);f('#8a5a30',2,1,28,20);f('#6a4222',2,1,28,2);f('#6a4222',2,19,28,2);f('#c8a870',4,3,24,16);
  f('#f4ecd8',6,5,7,8);f('#f4ecd8',15,4,6,7);f('#fff4dc',22,6,5,9);f('#f0e0c0',12,12,8,6);
  f('#8a7a60',7,7,5,1);f('#8a7a60',7,9,4,1);f('#8a7a60',16,6,4,1);f('#8a7a60',23,8,3,1);f('#8a7a60',23,10,3,1);f('#8a7a60',13,14,6,1);
  f('#d8403a',9,5,1,1);f('#3a7ad8',18,4,1,1);f('#3ad85a',24,6,1,1);f('#d8b03a',16,12,1,1);
  f(K,5,22,3,4);f('#6a4222',6,22,1,4);f(K,24,22,3,4);f('#6a4222',25,22,1,4);}));
 reg('mesa',box(16,14,f=>{f(K,0,3,16,6);f('#9a6a3a',1,4,14,4);f('#b8844c',1,4,14,1);f(K,2,9,3,5);f('#6a4222',3,9,1,5);f(K,11,9,3,5);f('#6a4222',12,9,1,5);
  f(K,5,0,4,4);f('#d8c8a0',6,1,2,3);f(K,10,1,3,3);f('#e8b43c',11,2,1,1);}));
 reg('barril',box(16,16,f=>{f(K,3,1,10,15);f('#8a5a30',4,2,8,13);f('#a8743c',5,2,2,13);f('#4a4a52',3,4,10,1);f('#4a4a52',3,11,10,1);f('#6a4222',4,2,8,1);}));}

// ================== MAPAS ==================
// A porta é um portal comum com a marca 'porta' (sem redemoinho). Portais podem ter meio tile, para ficar no centro da porta.
// Cada cidade principal tem a sua Guilda: a casa fica à direita da praça (TC.x+6, TC.y-3) e o salão mostra as missões da cidade (city).
function guildHall(id,city,sprite,seed){const C=MAPS[city];
 C.houses=(C.houses||[[TC.x-7,TC.y+4,'house0'],[TC.x+6,TC.y+4,'house1'],[TC.x-7,TC.y-3,'house2']]).filter(h=>!(h[0]===TC.x+6&&h[1]===TC.y-3)).concat([[TC.x+6,TC.y-3,sprite]]);
 C.portals[id]=[TC.x+6.5,TC.y-2,'porta'];
 MAPS[id]={n:'Guilda de '+C.n.replace(/^(Vila|Aldeia) de /,''),s:'Mural de missões',interior:1,city,theme:8,seed,color:'#2a1c12',home:city,room:[16,10],
  portals:{[city]:[TC.x,TC.y+5,'porta']},board:[TC.x-1,TC.y-5],
  deco:[[TC.x-1,TC.y-5,'mural',1],[TC.x-5,TC.y-1,'mesa'],[TC.x+4,TC.y-1,'mesa'],[TC.x-7,TC.y-4,'barril'],[TC.x+6,TC.y-4,'barril']]};}
guildHall('guilda','valdor','guilda',1001); // o id 'guilda' fica para Valdor: saves já podem estar nesse mapa
guildHall('guildaPinheiral','pinheiral','guilda2',1002);

// ================== MURAL DE MISSÕES ==================
// Missões padrão da Guilda: problemas nos mapas vizinhos, com materiais como prova. Repetem com espera (MISS_CD, tempo real).
const MISS=[
 {city:'valdor',id:'esquilos',t:'Praga de esquilos',map:'estrada',mat:'esquilo',n:10,lv:2,txt:'Um bando de Esquilos Ruivos está causando problemas na Estrada do Sul, bem na saída da vila. Traga 10 Pelos de Esquilo para provar que nos ajudou a acabar com essa peste.'},
 {city:'valdor',id:'geleias',t:'Geleia no poço',map:'floresta',mat:'slime',n:12,lv:3,txt:'As Geleias da Floresta Verdejante estão escorrendo até o poço da vila e a água ficou com gosto de musgo. Traga 12 Musgos de Geleia.'},
 {city:'valdor',id:'lobos',t:'Lobos no rebanho',map:'floresta',mat:'lobo',n:8,lv:5,txt:'Os pastores perderam três ovelhas esta semana. Os Lobos Cinzentos da Floresta precisam aprender a ter medo da vila. Traga 8 Presas de Lobo.'},
 {city:'valdor',id:'aranhas',t:'Teias na trilha',map:'pantano',mat:'aranha',n:8,lv:10,txt:'As Aranhas do Pântano teceram teias sobre a trilha e nenhum mercador passa mais por lá. Traga 8 Sedas de Aranha.'},
 {city:'valdor',id:'ossos',t:'Mortos sem descanso',map:'pantano',mat:'esqueleto',n:8,lv:12,txt:'Esqueletos andam pelo Pântano Sombrio à noite e assustam quem volta das Ruínas. Traga 8 Ossos Velhos para que o sacerdote os abençoe.'},
 {city:'valdor',id:'orcs',t:'Saqueadores nas Ruínas',map:'ruinas',mat:'orc',n:6,lv:16,txt:'Orcs Saqueadores montaram acampamento nas Ruínas Esquecidas e atacam as caravanas. Traga 6 Dentes de Orc como prova.'},
 {city:'valdor',id:'golems',t:'Pedras que andam',map:'ruinas',mat:'golem',n:3,lv:18,txt:'Golens de Pedra despertaram nas Ruínas e a terra treme até em Valdor. Traga 3 Núcleos de Pedra para os estudiosos da Guilda.'},
 {city:'pinheiral',id:'esporos',t:'Cogumelos na horta',map:'encosta1',mat:'esporinho',n:10,lv:2,txt:'Esporinhos brotaram nas hortas da Encosta de Pinheiral 01 e estão sufocando as couves da aldeia. Traga 10 Esporos Laranja.'},
 {city:'pinheiral',id:'vermes',t:'Vermes na trilha',map:'encosta2',mat:'verme',n:8,lv:6,txt:'Os Vermes-de-Cauda cavaram buracos na trilha da Encosta 02 e as carroças de lenha estão atolando. Traga 8 Cascas de Verme.'},
 {city:'pinheiral',id:'jiboias',t:'Sumiço das galinhas',map:'encosta3',mat:'jiboia',n:8,lv:10,txt:'Todo dia some uma galinha, e os rastros levam às Jiboias da Encosta 03. Traga 8 Escamas de Jiboia.'},
 {city:'pinheiral',id:'lanternas',t:'Luzes que enganam',map:'encosta4',mat:'lanterna',n:6,lv:14,txt:'Lanternas Errantes atraem viajantes para fora da trilha na Encosta 04. Dois lenhadores ainda não voltaram. Traga 6 Brasas Errantes.'},
 {city:'pinheiral',id:'duendes',t:'Duendes ladrões',map:'encosta5',mat:'duende',n:6,lv:17,txt:'Os Duendes do Porrete da Encosta 05 roubaram a bolsa do coletor de impostos. Traga 6 Lascas de Porrete e, se achar, o ouro de volta.'},
 {city:'pinheiral',id:'morcegos',t:'Asas no escuro',map:'caverna1',mat:'morcego',n:12,lv:21,txt:'Bandos de morcegos saem da Caverna de Pinheiral ao anoitecer e assustam o gado. Traga 12 Asas de Morcego.'},
 {city:'pinheiral',id:'raposas',t:'O chamado da raposa',map:'encosta7',mat:'raposa',n:6,lv:23,txt:'As Raposas Espirituais da Encosta 07 estão cada vez mais perto da aldeia, e os anciãos temem o despertar da Anciã. Traga 6 Caudas de Raposa.'},
 {city:'pinheiral',id:'zumbis',t:'Mineiros perdidos',map:'caverna2',mat:'zumbi',n:6,lv:25,txt:'Os mineiros que sumiram na Caverna voltaram... mas não estão vivos. Dê descanso a eles e traga 6 Minérios Brutos como prova.'}];
const MISS_CD=10*60*1000,MISS_MAX=3,BOARD={x:-9999,y:-9999};
// ouro ≈ 2,5× o valor dos materiais + 10 por nível sugerido; XP de um nível inteiro no nível sugerido
const missRew=q=>({g:Math.round(LOOTM[q.mat].v*q.n*2.5+10*q.lv),xp:xpNeed(q.lv)});
function missState(q){const M=P.miss;if(M.on.includes(q.id))return(P.mats[q.mat]||0)>=q.n?'pronta':'aceita';return(M.cd[q.id]||0)>Date.now()?'espera':'livre';}
function openBoard(){closeAll();renderBoard();$('board').classList.remove('hidden');}
function renderBoard(){const B=$('boardBody');
 const city=MAPS[CUR].city||'valdor',nome=MAPS[city].n.replace(/^(Vila|Aldeia) de /,'');
 let h=`<p class="flav">"Aventureiros, ${nome} precisa de vocês! Aceitem até ${MISS_MAX} tarefas por vez (somando todas as Guildas) e tragam as provas."</p>`;
 for(const q of MISS.filter(q=>q.city===city)){const st=missState(q),r=missRew(q),have=P.mats[q.mat]||0,on=st==='aceita'||st==='pronta';
  h+=`<div class="mcard ${st}"><div class="mt"><b>${q.t}</b><small>${MAPS[q.map].n} • nível sugerido ${q.lv}+</small></div><p>${q.txt}</p>`+
   `<div class="mr"><span>Traga <b>${q.n}× ${LOOTM[q.mat].n}</b>${on?` (${Math.min(have,q.n)}/${q.n})`:''}</span><span>💰 ${r.g}g • ✨ ${r.xp} XP</span></div><div class="acts">`+
   (st==='livre'?`<button class="btn sm gold" data-m="aceitar" data-q="${q.id}">Aceitar</button>`
   :st==='espera'?`<span class="muted">Volta ao mural em ${Math.ceil((P.miss.cd[q.id]-Date.now())/60000)} min</span>`
   :(st==='pronta'?`<button class="btn sm gold" data-m="entregar" data-q="${q.id}">Entregar</button>`:'')+`<button class="btn sm" data-m="desistir" data-q="${q.id}">Desistir</button>`)+`</div></div>`;}
 B.innerHTML=h;B.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>missAction(b.dataset.m,b.dataset.q));}
function missAction(a,id){const q=MISS.find(x=>x.id===id),M=P.miss;
 if(a==='aceitar'){if(missState(q)!=='livre')return;if(M.on.length>=MISS_MAX){log(`Você já tem ${MISS_MAX} missões aceitas. Entregue ou desista de uma.`,'#ff9a7a');return;}M.on.push(id);log(`Missão aceita: ${q.t}.`,'#ffe3a0');}
 else if(a==='desistir'){M.on=M.on.filter(x=>x!==id);log(`Você desistiu de: ${q.t}.`,'#cccccc');}
 else if(a==='entregar'){if((P.mats[q.mat]||0)<q.n)return;P.mats[q.mat]-=q.n;if(!P.mats[q.mat])delete P.mats[q.mat];
  const r=missRew(q);P.gold+=r.g;M.on=M.on.filter(x=>x!==id);M.cd[id]=Date.now()+MISS_CD;
  banner('Missão cumprida!',q.t);log(`Missão cumprida: ${q.t}! +${r.g}g`,'#ffd24a');addText(P.x,P.y-30,'+'+r.xp+' XP','#d6a8ff');gainXp(r.xp);}
 renderBoard();save();}
// ao pegar um material de uma missão aceita, mostra o progresso
function missNote(mat){for(const id of P.miss.on){const q=MISS.find(x=>x.id===id);if(!q||q.mat!==mat)continue;const n=P.mats[mat]||0;
 if(n<=q.n)log(`${q.t}: ${n}/${q.n}${n>=q.n?' • volte ao mural da Guilda!':''}`,'#ffe3a0');}}
