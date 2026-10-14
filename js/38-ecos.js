// Ecos de Valdoria — Os Ecos: o objetivo do jogo (14/10/2026)
'use strict';
// Pergunta de um amigo do dono: "Tá, mas qual é o objetivo do jogo?". Resposta (panteão, item 15 do roteiro):
// Vorhan, o Silenciado, foi selado pelos deuses no fim do mundo, e os sussurros dele (os "ecos") voltaram a Valdoria.
// A Mestra Elara conta isso ao herói novo (ECOS.intro) e cada chefe, na primeira vez que cai, deixa uma pista (ECOS.p)
// sobre quem está ouvindo os ecos. As pistas ficam na aba "Os Ecos" do diário (29).
// Guardado em P.ped (sem mudar a versão do save): P.ped.ecoIntro = 1 depois da conversa; P.ped['eco_'+tipoDoChefe] = 1 por pista.

const ECOS={
 obj:'Descubra quem está ouvindo os ecos de Vorhan.',
 // a conversa da Elara, uma fala por vez
 intro:['Antes de tudo, aventureiro, sente-se. Há uma coisa que todo herói de Valdoria precisa saber.',
  'Há muito tempo, os deuses enfrentaram um dos seus: Vorhan, o Silenciado, que devorava tudo, até as lembranças. Não conseguiram destruí-lo. Então o selaram bem longe, no fim do mundo.',
  'O selo ainda segura. Mas, de uns anos para cá, algo atravessa: sussurros. Nós chamamos de ecos. Quem os escuta muda. Monstros ficam mais fortes, criaturas que eram só lendas acordam, e cultos antigos voltam a se reunir.',
  'Não sei quem está ouvindo, nem o que querem. Fique forte, explore, enfrente os grandes. Cada um deles pode guardar uma pista. Traga o que descobrir, e juntos vamos entender o que Vorhan está tramando.'],
 rever:'Fale de novo sobre os ecos',
 // fala da Elara depois da conversa, conforme as pistas achadas
 depois:n=>n>=7?'Você juntou todas as pistas. Três cultos, um mestre caído e um silêncio que não para de crescer. Valdoria vai precisar de você mais do que imagina.':
  n?`Você já trouxe ${n} ${n>1?'pistas':'pista'}. Cada uma me assusta um pouco mais. Continue.`:'Os grandes deste mundo guardam respostas. Comece pelas Encostas de Pinheiral.',
 // uma pista por chefe (pela ordem do jogo): m = mapa do chefe (dica no diário), t = título, d = de quem é o rastro, c = cor, x = texto
 p:{
  mestreMasc:{m:'encosta3',t:'A máscara rachada',d:'Sirrek, o de Mil Rostos',c:'#d8a040',
   x:'Entre os restos do Mestre das Máscaras, uma máscara rachada ao meio com um bilhete: "O de Mil Rostos agradece. Use esta enquanto aprende a mentir melhor." Alguém deu a ele aquele poder.'},
  totemAnciao:{m:'encosta5',t:'A voz no silêncio',d:'os ecos',c:'#8fd8a0',
   x:'O Grande Totem Ancião guardava as encostas há séculos. Ao cair, as runas dele se apagam numa última frase: "Uma voz no silêncio mandou proteger nada. E eu obedeci."'},
  wyrm:{m:'covil',t:'A coroa no tesouro',d:'Kharzen, a coroa de ferro',c:'#c84a3a',
   x:'No meio do tesouro do Wyrm, uma coroa de ferro com pontas, ainda quente. Os orcs das Ruínas falam dela como de um rei. O Wyrm não guardava ouro. Guardava um presente.'},
  raposaAnc:{m:'encosta7',t:'A fuga das nove caudas',d:'os ecos',c:'#ff9a5a',
   x:'Ferida, a Raposa Anciã não ataca mais. Olha para o leste e some, mas deixa uma ideia clara na sua cabeça: "Não era de vocês que eu fugia. Era do que vem do silêncio."'},
  senhorOssos:{m:'caverna3',t:'As flores murchas',d:'Gulgra, a podridão',c:'#a0b860',
   x:'Os ossos do Senhor dos Ossos se desfazem num monte de flores murchas, a marca de Gulgra. Os mortos da caverna não se levantaram sozinhos: alguém plantou a podridão lá embaixo.'},
  ozren:{m:'arquivo3',t:'O silêncio',d:'Vorhan, o Silenciado',c:'#a87ae8',
   x:'Antes de se desfazer, Ozren sussurra: "Ele não fala. Ele cala. E no silêncio a gente ouve tudo." No peito dele fica, por um instante, um círculo vazio. O símbolo de Vorhan.'},
  reiSethkar:{m:'tumba3',t:'O juramento quebrado',d:'Kharzen, a coroa de ferro',c:'#c84a3a',
   x:'Nas ataduras do Rei Sethkar, as tabuletas do Omar fazem sentido: ele jurou a Kharzen e quebrou o juramento. O castigo foi não morrer nunca. Kharzen cobra as promessas, e há outros reis jurando hoje.'}}};

let ecoAvisou=null,ecoPasso=0,ecoRever=false;
function ecoQuer(){return !!P&&!(P.ped&&P.ped.ecoIntro);}
function ecoTick(){if(ecoQuer()&&ecoAvisou!==P){ecoAvisou=P;log('A Mestra Elara quer falar com você. Ela atende na casa da estrela, em Valdor.','#d9a0ff');}}
function ecoN(){return P?Object.keys(ECOS.p).filter(k=>P.ped&&P.ped['eco_'+k]).length:0;}
function ecoMentor(){if(MENT_W!=='elara'||!P)return null;
 if(ecoQuer()||ecoRever)return `<p class="flav">"${ECOS.intro[ecoPasso]}"</p><button class="btn gold" data-act="ecoAvanca">${ecoPasso<ECOS.intro.length-1?'Continuar':'Vou descobrir'}</button>`;
 return `<p class="flav">"${ECOS.depois(ecoN())}"</p><button class="btn sm" data-act="ecoRever">${ECOS.rever}</button>`;}
function ecoAction(a){if(!P||MENT_W!=='elara')return;
 if(a==='ecoRever'){ecoPasso=0;ecoRever=true;}
 else if(a==='ecoAvanca'&&(ecoQuer()||ecoRever)){if(ecoPasso<ECOS.intro.length-1){ecoPasso++;return;}
  if(ecoQuer()){P.ped=P.ped||{};P.ped.ecoIntro=1;save();log('Novo objetivo: '+ECOS.obj,'#ffd24a');banner('Os Ecos de Vorhan',ECOS.obj);}ecoRever=false;ecoPasso=0;}}
function ecoPista(m){const e=ECOS.p[m.type];if(!P||!e)return;P.ped=P.ped||{};const k='eco_'+m.type;if(P.ped[k])return;
 P.ped[k]=1;log('Pista encontrada: '+e.t+'. '+e.x,e.c);log('Abra o diário (J), aba Os Ecos.');
 const heroi=P;setTimeout(()=>{if(P===heroi&&!P.dead)banner('Pista encontrada!',e.t);},2500);}
function ecoDiario(){if(!P||ecoQuer())return '<p class="flav">A Mestra Elara, em Valdor, quer falar com você.</p>';
 return `<p class="flav"><b>Objetivo:</b> ${ECOS.obj}</p><p>Pistas: ${ecoN()} de 7</p>`+Object.entries(ECOS.p).map(([k,e])=>diaCard(P.ped['eco_'+k]?{t:e.t,s:e.d,p:e.x,cor:e.c}
  :{t:'???',s:'Pista ainda não encontrada',p:'Dizem que algo se esconde em '+MAPS[e.m].n+'.',cor:'#6a6070'})).join('');}
