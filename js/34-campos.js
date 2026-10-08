// Ecos de Valdoria — Campos novos entre as cidades (passo 3 do plano de 08/10/2026)
'use strict';
// Vale dos Lenhadores (nível 4 a 8): entre a Estrada do Sul e Pinheiral. A estrada das carroças de toras continua até a aldeia;
// a floresta de Valdor vai virando pinhal na metade de baixo (blend), com montes de lenha dos acampamentos dos lenhadores.
// Bosque dos Sussurros (nível 8 a 12): entre o Planalto das Runas e Arcádia. Sem estrada: o caminho dos peregrinos some no bosque
// (Arcádia é isolada de propósito) e o herói procura a saída entre árvores, pedras rúnicas e as lanternas que vagam por ali.
MAPS.lenhadores={n:'Vale dos Lenhadores',s:'Nível 4 a 8',road:1,theme:1,blend:[1,6,24,40],seed:1201,color:'#2a4a2a',lv:[4,8],home:'estrada',
 portals:{estrada:[32,1],pinheiral:[32,58]},count:24,chests:5,tier:1,
 mons:[['esquilo',.3],['lobo',.6],['guaxinim',.8],['salgueiro',1]],deco:[[46,40,'lenha'],[48,41,'lenha'],[24,46,'lenha'],[26,47,'lenha']]};
MAPS.bosque={n:'Bosque dos Sussurros',s:'Nível 8 a 12',theme:1,seed:1211,color:'#1e3a3a',plateau:.66,lv:[8,12],home:'planalto',
 portals:{planalto:[40,58],arcadia:[40,1]},count:26,chests:6,tier:2,mons:[['lanterna',.4],['esporov',.7],['jiboia',1]],deco:[]};
// pedras rúnicas escolhidas à mão em tiles livres (sorteadas uma vez; sorteio na carga caía em cima de árvore ou de morro)
MAPS.bosque.deco=[[35,19],[66,52],[55,17],[44,8],[24,44],[8,7],[8,25],[17,15],[66,27]].map(([x,y])=>[x,y,'runa']);
// os vizinhos passam a apontar para os campos novos (o portal fica no mesmo lugar, então portões e trilhas não mudam)
const trocaPortal=(id,de,para)=>{const p=MAPS[id].portals,o={};for(const k in p)o[k===de?para:k]=p[k];MAPS[id].portals=o;};
trocaPortal('estrada','pinheiral','lenhadores');trocaPortal('pinheiral','estrada','lenhadores');
trocaPortal('planalto','arcadia','bosque');trocaPortal('arcadia','planalto','bosque');
