// Ecos de Valdoria — Pedidos dos moradores (missões de coleta, começando por Sahrem; 08/10/2026)
'use strict';
// Diferente do mural da Guilda (13): cada pedido é de uma pessoa da cidade, acontece uma vez só e pode pedir coisas que não caem de
// monstro: itens que brilham no chão de um mapa (COLD) e só aparecem enquanto o pedido está aceito e falta juntar. Sobre a pessoa:
// "!" dourado = tem pedido; "?" cinza = aceito, falta juntar; "?" dourado = pronto para entregar. Depois de entregue, ela só conversa (f).
// P.ped = {id: 1 aceito | 2 entregue} (save v6). Os itens de pedido ficam em P.mats (aba Itens) com q:1 em LOOTM: não vendem nem caem de monstro.

// ================== ITENS DE PEDIDO ==================
// COLD[mat] = {maps: {mapa: quantos brilham no chão}, v: verbo do [E]}
const COLD={florD:{maps:{dunasO:8},v:'Colher'},pingente:{maps:{dunasL:1},v:'Pegar'},tabuleta:{maps:{tumba1:3,tumba2:3},v:'Pegar'}};
for(const[k,n,c,d]of[['florD','Flor do Deserto','#e0609a','Flor rosada que só abre nas Dunas do Oeste. A Vó Jamila faz chá com ela.'],
 ['pingente','Pingente de Prata','#c8d0dc','O pingente que a mãe do Idris perdeu nas Dunas do Leste.'],
 ['tabuleta','Tabuleta Gravada','#b08a5a','Placa de barro com hieróglifos, dos andares da pirâmide. O escriba Omar quer ler todas.']])LOOTM[k]={n,c,w:1,v:0,q:1,d};
Object.assign(MATSHP,{
 florD:[["....c..c....","...cCccCc...","..cCCeeCCc..","...CCeeCC...","....dCCd....",".....gg.....","...g.gg.g...","...gggggg...",".....gg.....",".....gg....."],{e:'#ffe060',g:'#4a9a3a'}],
 pingente:[["...d....d...","....d..d....",".....dd.....","....cCCd....","...cCeeCd...","...CeffeCd..","...CeeeeCd..","....CCCd....",".....dd....."],{e:'#3a8ac8',f:'#a8e0ff'}],
 tabuleta:[["cCCCCCCCCCc.","CeCCeeCCeCCd","CCCCCCCCCCCd","CeeCCeCCeeCd","CCCCCCCCCCCd","CCeCCeeCCeCd","CCCCCCCCCCCd",".dddddddddd."],{e:'#3a6ab8'}]});
for(const k in COLD)defMat(k);

// ================== OS MORADORES DE SAHREM ==================
def('jamila',["......kkkk......",".....kVVVVk.....","....kVVVVVVk....","....kGseesGk....","....kGssssGk....",".....kssssk.....","...kkVVVVVVkk...","..ksVVAAAAVVsky.",
 "...kVAAAAAAVk.y.","....kAAAAAAk..y.","....kAAOOAAk..y.","....kAAAAAAk..y.","...kAAAAAAAAk.y.","...kAAAAAAAAk.y.","....kbbk.kbbk.y.","....kkk...kkk.k."],
 {V:'#3a7a5a',G:'#c8c8c0',s:'#a8703a',e:K,A:'#7a5a3a',O:'#c8862a',y:'#8a6a3a',b:'#4a3020'});
def('idris',["","","","","......kkkk......",".....kTTTTk.....",".....kseesk.....",".....kssssk.....","....kkRRRRkk....","...ksRRRRRRsk...",
 "....kRRggRRk....","....kRRRRRRk....","....kPPPPPPk....","....kPPkkPPk....","....kbbk.kbbk...","....kkk...kkk..."],
 {T:'#e8e0c8',s:'#b07040',e:K,R:'#3a8ac8',g:'#e8c048',P:'#e8dcc0',b:'#5a3a20'});
def('omar',["......kkkk......",".....kTTTTk.....","....kTTtTTTk....","....kTTTTTTk....","....kTseesTk....",".....kBBBBk.....","...kkUUUUUUkk...","..ksUUUUUUUUsk..",
 "..kskWWWWWkUsk..","...kUWwwWWkUk...","....kUkkkkUk....","....kUUUUUUk....","...kUUUUUUUUk...","...kUUUUUUUUk...","....kbbk.kbbk...","....kkk...kkk..."],
 {T:'#f0ece0',t:'#3a6ab8',s:'#b87a4a',e:K,B:'#d8d0c0',U:'#2a4a8a',W:'#f4ecd0',w:'#7a5a3a',b:'#4a3020'});
def('yasmin',["......kkkk......",".....kVVVVk.....","....kVVVVVVk....","....kVseesVkkk..","....kVssssVkCCk.",".....kssssk.kCk.","...kkDDDDDDkkCk.","..ksDDDDDDDDsk..",
 "..ksDDggggDDsk..","...kDDDDDDDDk...","....kDDDDDDk....","....kDDggDDk....","...kDDDDDDDDk...","...kDDDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],
 {V:'#7a3a8a',s:'#b87a4a',e:K,C:'#3aa0a8',D:'#e07a2a',g:'#e8c048',b:'#5a3a20'});
// Cada pedido é a própria pessoa (entra na GENTE do 20, que o setTalk procura). at = tile onde ela fica; itens = [[material, quantos]];
// rew = {g: ouro, pots: poções, item: [parte, raridade]}, mais a XP de um nível inteiro no nível sugerido (lv), como as missões da Guilda.
const PEDS=[
 {id:'jamila',city:'sahrem',map:'sahrem',at:[21,24],n:'Vó Jamila',c:'#9ad87a',lv:23,t:'Flores para o chá',itens:[['florD',6]],rew:{g:400,pots:{hp:5}},
  pede:'Ai, meus joelhos... Faço chá de Flor do Deserto para metade de Sahrem, mas já não ando até as Dunas do Oeste. Elas brilham na areia depois do meio-dia. Me traz 6?',
  ok:'Que cheiro bom! Tome estas poções, fui eu que fiz. E volte para um chá quando quiser, viu?',
  f:['O chá está no fogo. Senta um pouco, a areia espera.','No meu tempo, os chacais tinham medo de gente. Hoje é o contrário.','Fenna cuida das caravanas. Eu cuido de quem chega cansado delas.','Flor do Deserto acalma o coração. Tome devagar.']},
 {id:'idris',city:'sahrem',map:'sahrem',at:[59,29],n:'Idris',c:'#8fd0ff',lv:25,t:'O pingente da mamãe',itens:[['pingente',1]],rew:{g:250,item:['anel',2]},
  pede:'Moço! Eu peguei o pingente da minha mãe escondido e perdi nas Dunas do Leste, quando fui ver os escorpiões... Ele é de prata e brilha. Por favor, acha antes que ela descubra!',
  ok:'Você achou! Mamãe não brigou comigo, só pediu para eu te dar isto. Era do vovô, e ela disse que você merece mais que eu.',
  f:['Não vou mais nas dunas sozinho. Prometi.','Quando eu crescer, vou ser aventureiro igual a você!','Os escorpiões são vermelhos de verdade? Eu só vi de longe.','A mamãe agora guarda o pingente numa caixinha com chave.']},
 {id:'yasmin',city:'sahrem',map:'sahrem',at:[50,53],n:'Tecelã Yasmin',c:'#e8a0d0',lv:27,t:'Tendas para as caravanas',itens:[['saqueador',6],['serpente',6]],rew:{g:700,item:['peito',2]},
  pede:'As tendas das caravanas rasgaram na última tempestade. Os lenços dos Saqueadores das Dunas são de tecido bom, e a pele de serpente não deixa a areia entrar. Traz 6 de cada?',
  ok:'Perfeito! Com isso faço tendas para três caravanas. E isto aqui é para você: forrei por dentro com o que sobrou.',
  f:['Cada fio desta tenda já viajou mais que muito mercador.','Os Saqueadores têm bom gosto para lenço. Pena que roubam.','Se rasgar a roupa nas dunas, me procure. Eu remendo.','O vermelho é tingido com flor de cacto. Ninguém acredita.']},
 {id:'omar',city:'sahrem',map:'sahrem',at:[35,41],n:'Escriba Omar',c:'#a8c8ff',lv:31,t:'O que a pirâmide conta',itens:[['tabuleta',5]],rew:{g:900,item:['arma',2]},
  pede:'Desde que a porta abriu, sonho em ler as paredes da pirâmide. Nos dois primeiros andares há tabuletas gravadas espalhadas pelo chão. Eu não passo da primeira múmia... Traz 5 para mim?',
  ok:'Incrível... Aqui diz que o Rei Sethkar jurou a Kharzen que nunca morreria, e Kharzen cumpriu: ele não morre. Fique com esta arma, guardei para quem me trouxesse a verdade.',
  f:['As tabuletas falam de Kharzen, a coroa de ferro. Não é um nome para dizer alto.','Sethkar não está vivo. Também não está morto. As tabuletas chamam isso de "o castigo do juramento".','Estou copiando tudo para a biblioteca de Arcádia. Os estudiosos de lá vão ficar loucos.','Uma das tabuletas fala de um "silêncio" mais antigo que os reis. Ainda não entendi.']}];
GENTE.push(...PEDS.map(p=>Object.assign(p,{ped:1})));
for(const q of PEDS){const M=MAPS[q.map];M.talk=(M.talk||[]).concat([[q.at[0],q.at[1],q.id]]);M.deco.push([q.at[0],q.at[1],q.id]);}

// ================== ESTADO, JANELA E ENTREGA ==================
function pedState(q){const s=(P&&P.ped||{})[q.id];return s===2?'feito':s===1?(q.itens.every(([m,n])=>(P.mats[m]||0)>=n)?'pronta':'aceita'):'livre';}
const pedRew=q=>({...q.rew,xp:xpNeed(q.lv)}),SLOTA={arma:['uma arma',1],elmo:['um elmo'],peito:['uma armadura',1],botas:['botas',1,1],anel:['um anel']};
// "uma armadura rara", "botas raras", "um anel épico"
const rarAdj=(r,[,f,pl])=>r<2?['comum','incomum'][r]+(pl?'s':''):['rar','épic','lendári'][r-2]+(f?'a':'o')+(pl?'s':'');
function pedRewTxt(q){const r=pedRew(q);return[`💰 ${r.g}g`,r.pots&&r.pots.hp?`🧪 ${r.pots.hp} poções de vida`:'',r.item?`🎁 ${SLOTA[r.item[0]][0]} ${rarAdj(r.item[1],SLOTA[r.item[0]])}`:'',`✨ ${r.xp} XP`].filter(Boolean).join(' • ');}
let PED_Q=null;
function openPedido(q){if(pedState(q)==='feito'){talkTo(TALK.find(t=>t.p===q));return;}closeAll();PED_Q=q;renderPedido();$('pedido').classList.remove('hidden');}
function renderPedido(){const q=PED_Q,st=pedState(q),B=$('pedidoBody');$('pedido').querySelector('h2').textContent=q.n;
 B.innerHTML=`<div class="mcard ${st}"><div class="mt"><b>${q.t}</b><small>nível sugerido ${q.lv}+</small></div><p>"${q.pede}"</p>`+
  q.itens.map(([m,n])=>{const have=P.mats[m]||0,onde=COLD[m]?Object.keys(COLD[m].maps).map(k=>MAPS[k].n.replace(/^Pirâmide de Sahrem • /,'pirâmide, ')).join(' e '):'de '+MDEF[m].n;
   return`<div class="mr"><span><img src="${matIcon(m)}" alt="" class="pic"> <b>${n}× ${LOOTM[m].n}</b> <small class="muted">(${onde})</small></span><span>${st==='livre'?'':Math.min(have,n)+'/'+n}</span></div>`;}).join('')+
  `<div class="mr"><span>Recompensa</span><span>${pedRewTxt(q)}</span></div><div class="acts">`+
  (st==='livre'?`<button class="btn sm gold" data-p="aceitar">Aceitar</button><button class="btn sm" data-p="fechar">Agora não</button>`
  :st==='pronta'?`<button class="btn sm gold" data-p="entregar">Entregar</button>`:`<span class="muted">${COLD[q.itens[0][0]]?'Procure o brilho no chão e no minimapa.':'Os monstros deixam cair o que ela pediu.'}</span><button class="btn sm" data-p="fechar">Fechar</button>`)+`</div></div>`;
 B.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pedAction(b.dataset.p));}
function pedAction(a){const q=PED_Q;if(!q)return;
 if(a==='fechar'){$('pedido').classList.add('hidden');return;}
 if(a==='aceitar'&&pedState(q)==='livre'){P.ped[q.id]=1;log(`Pedido aceito: ${q.t} (${q.n}).`,'#ffe3a0');}
 else if(a==='entregar'&&pedState(q)==='pronta'){for(const[m,n]of q.itens){P.mats[m]-=n;if(!P.mats[m])delete P.mats[m];}P.ped[q.id]=2;
  const r=pedRew(q);P.gold+=r.g;if(r.pots)for(const k in r.pots)P.pots[k]+=r.pots[k];updateHotbar();
  if(r.item){const it=genItem(q.lv,0,r.item[0],0,r.item[1]);P.inv.push(it);logItem(it);}
  banner('Pedido cumprido!',q.t);log(`${q.n}: "${q.ok}"`,q.c);log(`+${r.g}g`,'#ffd24a');addText(P.x,P.y-30,'+'+r.xp+' XP','#d6a8ff');gainXp(r.xp);
  $('pedido').classList.add('hidden');const tk=TALK.find(t=>t.p===q);if(tk){tk.line=q.ok;tk.until=time+6;}save();return;}
 renderPedido();colSpawn(MAPS[CUR]);save();}
// progresso ao juntar algo de um pedido aceito (chamada pelo missNote do 13 e ao colher)
function pedNote(mat){for(const q of PEDS){if(P.ped[q.id]!==1)continue;const it=q.itens.find(([m])=>m===mat);if(!it)continue;const n=P.mats[mat]||0;
 if(n<=it[1])log(`${q.t}: ${LOOTM[mat].n} ${n}/${it[1]}`,'#ffe3a0');if(n===it[1]&&pedState(q)==='pronta')log(`Tudo pronto! Volte a ${MAPS[q.map].n.replace(/^Cidade de /,'')} e fale com ${q.n}.`,'#ffd24a');}}

// ================== ITENS QUE BRILHAM NO CHÃO ==================
// Nascem ao entrar no mapa (colSpawn, chamada pelo 08), só para pedidos aceitos que ainda precisam deles; pegou o que faltava, os outros somem.
const COL=[];
function colFalta(mat){let f=0;for(const q of PEDS)if(P.ped&&P.ped[q.id]===1)for(const[m,n]of q.itens)if(m===mat)f=Math.max(f,n-(P.mats[m]||0));return f;}
function colSpawn(M){COL.length=0;if(!P)return;for(const m in COLD){const k=COLD[m].maps[CUR];if(!k||colFalta(m)<=0)continue;
 for(let i=0;i<k;i++){const t=randTile(M.theme);if(t)COL.push({x:(t.x+.5)*TILE,y:(t.y+.5)*TILE+4,mat:m});}}}
function pickCol(c){if(!COL.includes(c))return;if(!canCarry(LOOTM[c.mat].w)){heavyMsg();return;}COL.splice(COL.indexOf(c),1);
 P.mats[c.mat]=(P.mats[c.mat]||0)+1;log(`Você pegou ${LOOTM[c.mat].n}.`,'#e0d0b0');burst(c.x,c.y-6,'#fff0a0',14,40);pedNote(c.mat);
 if(colFalta(c.mat)<=0)for(let i=COL.length-1;i>=0;i--)if(COL[i].mat===c.mat)COL.splice(i,1);if(!bagEl.classList.contains('hidden'))renderBag();save();}
// desenho (chamado pelo drawExtra do 04): brilho no chão, o item e uma faísca de vez em quando
function drawCol(c,tt){ctx.fillStyle=`rgba(180,255,170,${.32+Math.sin(tt*4+c.x)*.12})`;ctx.beginPath();ctx.ellipse(c.x,c.y,11,4.5,0,0,6.29);ctx.fill();
 const g=ctx.createLinearGradient(0,c.y-56,0,c.y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'#b8ffb0');ctx.globalAlpha=.4+Math.sin(tt*4+c.x)*.12;ctx.fillStyle=g;ctx.fillRect(c.x-3,c.y-56,6,56);ctx.globalAlpha=1;
 drawS('mat_'+c.mat,c.x,c.y+Math.sin(tt*3+c.x)*.8);if(R()<.04)parts.push({x:c.x+rf(-6,6),y:c.y-rf(3,12),vx:0,vy:-14,g:0,life:.7,max:.7,color:'#eaffd0',s:1});}
// "!" e "?" sobre quem tem pedido (chamada pelo drawLabels do 04)
function pedMarks(lab,tt){if(!P)return;for(const q of TALK){if(!q.p.ped)continue;const st=pedState(q.p);if(st==='feito')continue;
 ctx.font='800 24px Cinzel,serif';lab(st==='livre'?'!':'?',q.x,q.y-37+Math.sin(tt*4)*1.5,st==='aceita'?'#b8b0a0':'#ffd24a');ctx.font='700 13px "Alegreya Sans",sans-serif';}}
