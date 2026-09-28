// Ecos de Valdoria — Vila de Valdor: muralha com portões e torres, bancas, poço e lampiões
'use strict';
// ================== SPRITES ==================
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 const PED='#8d8778',PEDC='#b8b2a4',PEDT='#a09a8a',REJ='#6d685c',PEDE='#5d584c';
 // muro de frente (lados de cima e de baixo): ameias, passarela e face de pedra
 reg('muroH',box(16,22,f=>{f(K,0,4,16,18);f(PEDT,1,5,14,4);f(PED,1,9,14,12);f(REJ,1,12,14,1);f(REJ,1,16,14,1);f(REJ,5,9,1,3);f(REJ,11,12,1,4);f(REJ,4,16,1,5);f(REJ,12,16,1,5);f(PEDE,1,20,14,1);
  f(K,0,0,6,5);f(PEDC,1,1,4,4);f(K,9,0,6,5);f(PEDC,10,1,4,4);}));
 // muro de lado (esquerda e direita): a passarela vista de cima, empilhada tile a tile
 reg('muroV',box(16,22,f=>{f(K,3,0,10,22);f(PEDC,4,1,8,15);f(PEDT,4,1,2,15);f(REJ,4,6,8,1);f(REJ,4,11,8,1);f(PED,4,16,8,5);f(PEDE,4,20,8,1);}));
 // torre com ameias, janela e o estandarte vermelho de Valdor
 reg('torre',box(24,48,f=>{f('#4a3222',11,0,2,12);f(K,13,1,8,6);f('#c8323a',13,2,7,4);f('#e8b43c',15,3,2,2);
  f(K,0,10,24,9);f(PEDC,1,11,22,7);f(K,0,6,6,5);f(PEDC,1,7,4,4);f(K,9,6,6,5);f(PEDC,10,7,4,4);f(K,18,6,6,5);f(PEDC,19,7,4,4);
  f(K,2,19,20,29);f('#9a9484',3,19,18,28);f('#7a7466',16,19,5,28);for(const y of[24,30,36,42])f(REJ,3,y,18,1);
  f(K,9,26,6,8);f('#2a2016',10,27,4,6);f(PEDE,3,46,18,1);}));
 // bancas de mercado (toldo listrado) e o poço
 for(const[nm,cor]of[['banca','#c8323a'],['banca2','#3a6ab8']])reg(nm,box(32,26,f=>{f(K,1,3,30,6);for(let i=0;i<7;i++)f(i%2?'#e8e2cc':cor,2+i*4,4,4,4);
  for(let i=0;i<8;i++)f(K,1+i*4,8,2,1);f(K,3,9,2,10);f('#6a4222',3,9,1,10);f(K,27,9,2,10);f('#6a4222',27,9,1,10);
  f(K,1,17,30,9);f('#9a6a3a',2,18,28,7);f('#b8844c',2,18,28,1);
  f('#e0303a',6,15,3,3);f('#e0303a',8,14,3,3);f('#5fcf5a',12,15,3,3);f('#ffd24a',17,14,4,4);f('#d8783a',23,15,4,3);}));
 reg('poco',box(16,22,f=>{f(K,0,0,16,5);f('#8a3a2a',1,1,14,3);f('#6a4222',2,4,2,9);f('#6a4222',12,4,2,9);f(K,1,4,1,9);f(K,14,4,1,9);f('#4a3222',4,5,8,1);f('#6a4222',7,6,2,3);
  f(K,1,12,14,10);f(PED,2,13,12,8);f(REJ,2,16,12,1);f('#3a78a8',4,13,8,2);f('#9cd0f2',5,13,3,1);}));}

// ================== MURALHA ==================
// M.walls=[x0,y0,x1,y1]: retângulo de muro. Onde uma estrada cruza o muro vira portão, com uma torre de cada lado; torres nos cantos.
// Chamado pelo genWorld (01) depois das casas e dos móveis, antes do cálculo de alcance.
function buildWalls(M,road){const[x0,y0,x1,y1]=M.walls,on=(x,y)=>(x===x0||x===x1)&&y>=y0&&y<=y1||(y===y0||y===y1)&&x>=x0&&x<=x1,gate=(x,y)=>on(x,y)&&road[y*W+x];
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){if(!on(x,y)||gate(x,y))continue;const i=y*W+x,r=objRows[y];
  for(let k=r.length-1;k>=0;k--)if(r[k].tx===x)r.splice(k,1); // tira árvores que estavam no caminho do muro
  const corner=(x===x0||x===x1)&&(y===y0||y===y1),byGate=[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>gate(x+dx,y+dy));
  solid[i]=1;addObj(x,y,corner||byGate?'torre':y===y0||y===y1?'muroH':'muroV');}}

// ================== VALDOR ==================
Object.assign(MAPS.valdor,{walls:[27,19,53,41],lanterns:1,deco:[[TC.x-4,TC.y-6,'banca',1],[TC.x+3,TC.y-6,'banca2',1],[TC.x-3,TC.y+7,'poco']]});
