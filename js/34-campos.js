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
// Uma passagem garantida (pedido do dono: "não tem um caminho que dê pra passar pelas árvores"): o caminho mais barato entre os
// dois portais, desviando de água e barranco e cortando o mínimo de árvores, ganha 5 tiles de largura sem árvore nem pedra
// (a copa de uma árvore cobre o tile do lado e o de cima, então com 3 a passagem ainda parecia fechada).
// Fica de grama (não é estrada): o herói ainda procura, mas sempre acha uma passagem larga.
function passagem(M){const ps=Object.values(M.portals),a=ps[0],b=ps[1],s=(a[1]|0)*W+(a[0]|0),t=(b[1]|0)*W+(b[0]|0),deco=new Set((M.deco||[]).map(([x,y])=>y*W+x));
 const dur=i=>ground[i]===G.WATER||ground[i]===G.CLIFF||deco.has(i),cus=i=>dur(i)?1e9:solid[i]?6:1;
 const D=new Float64Array(W*H).fill(1e9),pr=new Int32Array(W*H).fill(-1),Q=[[0,s]];D[s]=0;
 while(Q.length){let m=0;for(let k=1;k<Q.length;k++)if(Q[k][0]<Q[m][0])m=k;const[d,i]=Q.splice(m,1)[0];if(i===t)break;if(d>D[i])continue;const x=i%W,y=(i/W)|0;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<1||Y<1||X>=W-1||Y>=H-1)continue;const j=Y*W+X,c=cus(j);if(c>=1e9)continue;
   if(d+c<D[j]){D[j]=d+c;pr[j]=i;Q.push([d+c,j]);}}}
 if(pr[t]<0)return;passagem.rota=[];for(let i=t;i!==s;i=pr[i]){passagem.rota.push(i);const x=i%W,y=(i/W)|0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const X=x+dx,Y=y+dy,j=Y*W+X;
  if(X<1||Y<1||X>=W-1||Y>=H-1||dur(j)||!solid[j])continue;const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);solid[j]=0;}}}
MAPS.bosque.gen=passagem;
MAPS.bosque.deco=[[35,19],[66,52],[55,17],[44,8],[24,44],[8,7],[8,25],[17,15],[66,27]].map(([x,y])=>[x,y,'runa']);
// os vizinhos passam a apontar para os campos novos (o portal fica no mesmo lugar, então portões e trilhas não mudam)
const trocaPortal=(id,de,para)=>{const p=MAPS[id].portals,o={};for(const k in p)o[k===de?para:k]=p[k];MAPS[id].portals=o;};
trocaPortal('estrada','pinheiral','lenhadores');trocaPortal('pinheiral','estrada','lenhadores');
trocaPortal('planalto','arcadia','bosque');trocaPortal('arcadia','planalto','bosque');
