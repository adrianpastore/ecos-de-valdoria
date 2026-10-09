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
// Clareiras presas (pedido do dono em 09/10/2026: "partes do mapa estão trancadas pelas árvores"): o linkReach (01) só garante os
// portais e o miolo do mapa, e sobravam clareiras grandes cercadas de árvores (na Floresta, 60% do chão livre ficava preso).
// Cada bolsão de 12 tiles ou mais ganha uma passagem de 3 tiles até a parte alcançável, cortando só árvores e pedras (nunca água,
// barranco ou objetos do mapa) pelo caminho mais curto. Bolsões pequenos ficam: são cantinhos naturais entre as árvores.
// Chamado pelo genWorld do 01 depois do linkReach; vale para todo mapa de fora (não para vilas, cavernas e interiores).
function abreBolsoes(M){if(M.town||M.cave||M.interior)return;const deco=new Set((M.deco||[]).map(([x,y])=>y*W+x)),N4=[[1,0],[-1,0],[0,1],[0,-1]];
 const corta=i=>solid[i]&&ground[i]!==G.WATER&&ground[i]!==G.CLIFF&&!deco.has(i);
 const tira=i=>{if(!corta(i))return;const x=i%W,y=(i/W)|0,r=objRows[y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===x)r.splice(k,1);solid[i]=0;};
 const nao=new Uint8Array(W*H);
 for(let it=0;it<40;it++){const seen=nao.slice();let alvo=null;
  for(let i=0;i<W*H&&!alvo;i++){if(solid[i]||REACH[i]||seen[i])continue;const b=[i];seen[i]=1;for(let h=0;h<b.length;h++){const x=b[h]%W,y=(b[h]/W)|0;
    for(const[dx,dy]of N4){const X=x+dx,Y=y+dy,k=Y*W+X;if(X<0||Y<0||X>=W||Y>=H||seen[k]||solid[k]||REACH[k])continue;seen[k]=1;b.push(k);}}if(b.length>=12)alvo=b;}
  if(!alvo)return;
  // busca em largura a partir do bolsão: chão livre custa 0, árvore ou pedra custa 1 (deque 0-1)
  const D=new Int32Array(W*H).fill(1e9),pr=new Int32Array(W*H).fill(-1),Q=[...alvo];for(const i of alvo)D[i]=0;let fim=-1;
  for(let h=0;h<Q.length;h++){const i=Q[h];if(REACH[i]){fim=i;break;}const x=i%W,y=(i/W)|0;
   for(const[dx,dy]of N4){const X=x+dx,Y=y+dy;if(X<1||Y<1||X>=W-1||Y>=H-1)continue;const j=Y*W+X;if(solid[j]&&!corta(j))continue;const nd=D[i]+(solid[j]?1:0);
    if(nd<D[j]){D[j]=nd;pr[j]=i;solid[j]?Q.push(j):Q.splice(h+1,0,j);}}}
  if(fim<0){for(const i of alvo)nao[i]=1;continue;} // não dá para ligar sem mexer em água ou barranco: deixa como está
  for(let i=fim;i>=0;i=pr[i]){const x=i%W,y=(i/W)|0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>0&&y+dy>0&&x+dx<W-1&&y+dy<H-1)tira((y+dy)*W+x+dx);}
  computeReach(M);}}
