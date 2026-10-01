// Ecos de Valdoria — Arcádia, a cidade dos estudiosos: redonda, cercada por um fosso, com pontes para os quatro lados.
// No centro fica a Torre (etapa 2), onde os Magos fazem a prova e a promoção (etapa 3). Ao sul, o Planalto das Runas a liga a Valdor.
'use strict';
// runas (5 px de largura) usadas no chão, nas paredes das praças e nos círculos
const RUNAS=['.#.#.|.###.|..#..|..#..','###..|#....|###..|..#..|###..','#...#|.#.#.|..#..|.#.#.','.###.|#...#|..#..|..#..','#..#.|####.|#..#.|#..#.','.##..|#..#.|.##..|#..#.|.##..'].map(s=>s.split('|'));
// ================== SPRITES ==================
// casa de estudioso: pedra clara, telhado azul-noite e uma torrezinha de ponta cônica com estrela prateada (32×40; a porta fica embaixo)
function genArcHouse(roof,roofD){const c=cnv(32,40),x=c.getContext('2d'),f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);};
 for(let y=22;y<39;y++)for(let i=4;i<28;i++)f((y-22)%4===3||(i+((y-22)>>2)%2*3)%6===0?'#b0aa9c':'#dcd6c8',i,y,1,1);
 f('#eee8da',4,22,1,17);f('#a09a8c',27,22,1,17);f('#8a8478',4,37,24,2);
 f(K,12,29,8,10);f('#3e4e7e',13,30,6,9);f('#2e3a62',15,30,1,9);f('#c8d8f0',17,34,1,1);
 for(const wx of[6,22]){f(K,wx-1,26,6,7);f('#8fd0ff',wx,27,4,5);f('#d8f0ff',wx,27,4,1);f('#5a6a8a',wx+1,27,1,5);}
 for(let y=0;y<15;y++){const hw=Math.min(15,3+y);f(y%3===0?roofD:roof,16-hw,y+8,hw*2,1);if(y%3===1)for(let i=16-hw+1;i<16+hw;i+=4)f(roofD,i,y+8,1,1);}
 f('#c8d4ec',1,22,30,1);                                                     // beirada prateada
 for(let y=10;y<24;y++)for(let i=22;i<28;i++)f(y%3===0?'#b0aa9c':'#dcd6c8',i,y,1,1);f('#eee8da',22,10,1,14);f(K,24,14,2,4);f('#8fd0ff',24,15,2,2);
 for(let y=0;y<8;y++){const hw=Math.round(y*.45)+1;f(y%2?roof:roofD,25-hw,y+2,hw*2,1);}f('#e8f0ff',24,0,2,2);f('#ffffff',24,0,1,1);
 return outlineK(c);}
reg('arcCasa1',genArcHouse('#2a3a6a','#1c2850'));reg('arcCasa2',genArcHouse('#3a4a7a','#26325a'));
reg('casaElaraA',signHouse('#2a5a6a','#1c4050','#5a3a7a',SYM_ESTRELA,genArcHouse));reg('ferrariaA',signHouse('#3a4a7a','#26325a','#8a5a30',SYM_BIGORNA,genArcHouse));
reg('guilda3',guildaGrande(2));
// A Torre dos Magos (etapa 2), desenhada à mão como a Guilda: 80×176, ocupa 5×3 tiles no centro da cidade, com a porta virada para o sul.
// Cone de pedra clara que afina até o topo, faixas em espiral com runas acesas, janelinhas, uma saliência no meio, chapéu azul-noite
// de beirada prateada e, flutuando lá em cima, o cristal azul (a marca de Arcádia; o brilho que sobe dele é o torreFx).
const TORRE_H=176;
function torreMagos(){const c=cnv(80,TORRE_H),x=c.getContext('2d'),f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);},cx=40,hw=y=>10+24*(y-44)/116;
 // corpo: cone de pedra (luz da esquerda), blocos desencontrados e a faixa em espiral com runas
 for(let y=44;y<160;y++){const h=hw(y),xl=Math.round(cx-h),xr=Math.round(cx+h);
  for(let xx=xl;xx<xr;xx++){const u=clamp((xx+.5-cx)/h,-1,1),th=Math.asin(u),v=((y+Math.round(th*11))%34+34)%34;let col;
   if(v<6)col=v===0||v===5?(u>.5?'#5e5a52':'#7a7466'):(v===2||v===3)&&(xx+(y>>2))%7<2?(v===2?'#d8f8ff':'#6ad8ff'):u>.5?'#948e80':'#b0aa9c';
   else{const row=Math.floor((y-44)/5),mort=(y-44)%5===4||(Math.round(th*h*1.3)+(row%2)*4)%8===0;
    col=mort?(u>.5?'#948e80':'#b0aa9c'):u<-.55?'#eee8da':u>.5?'#a8a294':u>.2?'#cec8ba':'#dcd6c8';}
   f(col,xx,y,1,1);}}
 // saliência de pedra no meio da Torre
 [['#f2eee4'],['#dcd6c8'],['#b0aa9c'],['#7a7466']].forEach(([c_],i)=>{const h=hw(100+i)+2;f(c_,Math.round(cx-h),100+i,Math.round(h*2),1);});
 // ameias do topo, beirada prateada e o chapéu azul-noite em ponta, com a estrela
 f('#dcd6c8',cx-15,41,30,5);f('#f2eee4',cx-15,41,30,1);f('#8a8478',cx-15,45,30,1);for(let i=0;i<5;i++){f('#dcd6c8',cx-15+i*7,37,4,4);f('#f2eee4',cx-15+i*7,37,4,1);}
 for(let y=18;y<40;y++){const h=1+(y-18)/22*13,xl=Math.round(cx-h),xr=Math.round(cx+h);
  for(let xx=xl;xx<xr;xx++)f(xx-xl<1?'#3a4e8a':xr-xx<=1?'#141c3a':(y-18)%3===2?'#1c2850':(xx+y)%5===0?'#24325c':'#2a3a6a',xx,y,1,1);}
 f('#c8d4ec',cx-14,40,28,1);f('#e8f0ff',cx-14,40,10,1);f('#e8f0ff',cx-1,15,2,3);f('#ffffff',cx-1,15,1,1);
 // o cristal flutuando sobre a ponta
 [2,4,6,8,10,10,8,6,6,4,2].forEach((w,y)=>{f('#3ab0e0',cx-w/2,y,w,1);f('#7ad8ff',cx-w/2,y,Math.max(1,w/2),1);});f('#d8f8ff',cx-2,2,1,6);f('#e8fcff',cx,4,1,3);
 // janelinhas acesas
 for(const[wx,wy]of[[40,60],[30,80],[51,112],[27,121]]){f(K,wx-3,wy,6,9);f('#8fd0ff',wx-2,wy+2,4,6);f('#8fd0ff',wx-1,wy+1,2,1);f('#d8f0ff',wx-2,wy+2,4,1);f('#f2eee4',wx-3,wy+9,6,1);}
 // estandartes azul-noite com estrela prateada, dos dois lados da porta
 for(const bx of[18,57]){f('#4a3222',bx-1,127,7,1);f('#2a4a9a',bx,128,5,14);f('#3a5ab8',bx,128,5,1);f('#1e3a7a',bx+4,128,1,14);f('#2a4a9a',bx,142,2,2);f('#2a4a9a',bx+3,142,2,2);
  f('#e8f0ff',bx+2,132,1,3);f('#e8f0ff',bx+1,133,3,1);}
 // base, degraus e a porta em arco, com uma runa acesa em cima
 f('#a8a296',cx-37,158,74,8);f('#dcd6c8',cx-37,158,74,1);f('#8a8478',cx-37,163,74,1);f('#6a655c',cx-37,165,74,1);
 f('#b8b2a4',cx-12,166,24,4);f('#dcd6c8',cx-12,166,24,1);f('#a8a296',cx-15,170,30,4);f('#dcd6c8',cx-15,170,30,1);f('#6a655c',cx-15,174,30,2);
 f('#b0aa9c',cx-10,134,20,3);f('#f2eee4',cx-10,134,20,1);f(K,cx-8,138,16,20);f(K,cx-6,136,12,2);f('#3e4e7e',cx-7,139,14,19);f('#3e4e7e',cx-5,137,10,2);
 f('#2e3a62',cx-1,138,2,20);f('#c8d4ec',cx-5,148,1,2);f('#c8d4ec',cx+4,148,1,2);
 RUNAS[3].forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==='#')f('#6ad8ff',cx-2+i,127+j,1,1);}));
 // braseiros de chama azul ao pé da porta
 for(const bx of[cx-16,cx+12]){f(K,bx,153,4,5);f('#6a655c',bx,154,4,3);f('#6ad8ff',bx,150,4,3);f('#d8f8ff',bx+1,151,2,2);}
 outlineK(c);
 // faíscas em volta do cristal (depois do contorno, para não ganharem borda)
 for(const[a,b]of[[-9,3],[8,6],[-7,11],[10,1],[-11,8]])f('#aef0ff',cx+a,b,1,1);
 return c;}
reg('torreMagos',torreMagos());
// a Arquimaga Selene: cabelo prateado, chapéu e manto azul-noite com barra prateada, cajado com cristal
def('selene',["......kkk...kkk.",".....kNNNk.kCCCk","....kNNSNNk.kCk.","...kkkkkkkkkkyk.","...kHseesHk.kyk.","...kHssssHk.kyk.","..kHHksskHHkkyk.","..kHRRRRRRHksyk.",
 "..kHRRggRRHkkyk.","...kRRggRRRkkyk.","...kRRggRRRkkyk.","..kRRRggRRRRkyk.","..kRRRggRRRRkyk.",".kRRRRggRRRRkyk.",".kggggggggggkyk.","..kkkkkkkkkk.kk."],
 {N:'#2a3a6a',S:'#e8f0ff',C:'#6ad8ff',H:'#e8ecf4',s:'#f0c8a8',e:K,R:'#34458a',g:'#c8d4ec',y:'#6a4a2a'});
// salão da Torre (tema 10): lajes de pedra clara, tapete azul-noite da porta até o círculo mágico, paredes de pedra
GP[10]=['#a8a296','#9e988a','#7a7466','#b8b2a4'];PC[10]=['#2a3a6a','#24325c','#3a4a8a'];WC[10]=WC[0].slice();
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[10]=o[10].map(hexRGB);
CLFT[10]=['#8d8778','#6d685c','#4d4a42','#a8a296','#9a9484','#14121a','#0e0c12'].map(hexRGB);
MINIC.obj[10]='#c8c2b4';
// muralha de Arcádia: o muro de Valdor com runas acesas em algumas pedras, torre com estandarte azul-noite e estrela prateada,
// e, nas praças, a parede de runas e o cristal que flutua sobre um pedestal
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 const PED='#8d8778',PEDC='#b8b2a4',PEDT='#a09a8a',REJ='#6d685c',PEDE='#5d584c',RU='#6ad8ff',RUC='#d8f8ff';
 reg('muroHA',box(16,22,f=>{f(K,0,4,16,18);f(PEDT,1,5,14,4);f(PED,1,9,14,12);f(REJ,1,16,14,1);f(PEDE,1,20,14,1);f(K,0,0,6,5);f(PEDC,1,1,4,4);f(K,9,0,6,5);f(PEDC,10,1,4,4);
  f(RU,6,10,3,1);f(RU,7,10,1,6);f(RU,6,13,3,1);f(RU,5,15,2,1);f(RU,8,15,2,1);f(RUC,7,10,1,1);}));
 reg('torreA',box(24,48,f=>{f('#4a3222',11,0,2,12);f(K,13,1,9,7);f('#2a4a9a',13,2,8,5);f('#3a5ab8',13,2,8,1);f('#e8f0ff',16,3,2,2);f('#e8f0ff',15,4,1,1);f('#e8f0ff',18,4,1,1);
  f(K,0,10,24,9);f(PEDC,1,11,22,7);f(K,0,6,6,5);f(PEDC,1,7,4,4);f(K,9,6,6,5);f(PEDC,10,7,4,4);f(K,18,6,6,5);f(PEDC,19,7,4,4);
  f(K,2,19,20,29);f('#9a9484',3,19,18,28);f('#7a7466',16,19,5,28);for(const y of[24,30,36,42])f(REJ,3,y,18,1);
  f(K,9,25,6,8);f('#2a2016',10,26,4,6);f(RU,6,37,2,4);f(RU,11,38,2,1);f(RU,11,38,1,4);f(RU,15,37,2,4);f(PEDE,3,46,18,1);}));
 reg('paredeRuna',box(32,30,f=>{f(K,0,1,32,6);f(PEDC,1,2,30,4);f(PEDT,1,5,30,1);f(K,1,6,30,22);f(PED,2,6,28,21);f('#a09a8a',2,6,2,21);f(REJ,26,6,4,21);f(REJ,2,16,28,1);f(PEDE,2,26,28,1);
  for(const[rx,g]of[[6,0],[14,3],[22,5]])RUNAS[g].forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==='#'){f(RU,rx+i,9+j*2,1,2);}}));f(RUC,6,9,1,1);f(RUC,14,9,1,1);f(RUC,22,9,1,1);
  f('#3a3a44',3,27,26,3);}));
 reg('cristal',box(16,28,f=>{f(K,3,17,10,11);f(PED,4,18,8,9);f(PEDC,4,18,8,2);f(REJ,4,23,8,1);f(K,2,16,12,2);f(PEDC,3,16,10,1);
  for(const[y,w]of[[1,2],[2,4],[3,6],[4,6],[5,6],[6,6],[7,4],[8,4],[9,2],[10,2]])f(K,8-w/2-1,y,w+2,1);
  for(const[y,w]of[[1,2],[2,4],[3,6],[4,6],[5,6],[6,6],[7,4],[8,4],[9,2],[10,2]]){f('#3ab0e0',8-w/2,y,w,1);f('#7ad8ff',8-w/2,y,Math.max(1,w/2),1);}
  f(RUC,7,2,1,3);f('#aef0ff',2,5,1,1);f('#aef0ff',13,3,1,1);f('#aef0ff',12,11,1,1);f('#aef0ff',3,12,1,1);f('#5ac8f0',6,14,4,1);}));}
// pedra rúnica do Planalto: pedra alta com uma runa azul acesa
{const c=cnv(16,24),x=c.getContext('2d'),f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);};
 f('#8a8a92',4,4,8,18);f('#8a8a92',5,2,6,2);f('#8a8a92',6,1,4,1);f('#a8a8b0',4,4,2,18);f('#a8a8b0',5,2,1,2);f('#6a6a74',10,4,2,18);f('#74747e',5,12,5,1);
 f('#6ad8ff',7,7,2,1);f('#6ad8ff',7,7,1,6);f('#6ad8ff',8,10,2,1);f('#6ad8ff',9,10,1,4);f('#6ad8ff',7,15,3,1);f('#bff4ff',7,7,1,1);
 f('#4a8a42',3,21,10,2);f('#6aba5a',4,21,2,1);f('#6aba5a',10,21,1,1);reg('runa',outlineK(c));}

// ================== MURALHA, FOSSO E PONTES ==================
// Chamado pelo genWorld (01) em mapas com moat:1, depois das casas. O círculo é centrado no meio do tile central:
// dentro (d<14,1) a cidade, toda de pedra; de 14,1 a 15,5 a muralha redonda; de 15,5 a 18 o fosso (água por fora da muralha); fora, os campos.
// As ruas retas (norte, sul, leste, oeste) atravessam a muralha em portões, com torres de estandarte dos dois lados, e viram pontes sobre a água.
const WALL_IN=14.1,MOAT_IN=15.5,MOAT_OUT=18;let BRIDGES=[];
function buildMoat(M,road){const cx=TC.x+.5,cy=TC.y+.5,axis=(x,y)=>Math.abs(x-TC.x)<=1||Math.abs(y-TC.y)<=1,wallT=[];BRIDGES=[];
 const clearTrees=(X,Y)=>{const r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X&&/^(tree|rock)/.test(r[k].spr)){r.splice(k,1);solid[Y*W+X]=0;}};
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,d=hyp(x+.5-cx,y+.5-cy);
  if(d<MOAT_OUT+5)clearTrees(x,y);
  if(d<WALL_IN)ground[i]=G.PLAZA;                                                   // cidade toda de pedra
  else if(d<MOAT_IN){ground[i]=G.PLAZA;if(!axis(x,y)){solid[i]=1;wallT.push([x,y]);}}  // muralha (o eixo é portão)
  else if(d<MOAT_OUT){if(axis(x,y)||road[i]){ground[i]=G.PATH;solid[i]=0;BRIDGES.push(i);}else{ground[i]=G.WATER;solid[i]=1;}}
  else if(axis(x,y)&&d<MOAT_OUT+5&&!solid[i])ground[i]=G.PATH;                      // as ruas seguem pelos campos
  else if(d>=MOAT_OUT+2.5&&ground[i]===G.GRASS&&!road[i]&&!axis(x,y)&&((x*73856093^y*19349663)>>>0)%100<9){solid[i]=1;addObj(x,y,`tree0_${(x+y)%4}`);}} // bosque em volta
 // torres: dos dois lados de cada portão e uma em cada diagonal; o resto é muro (de lado só onde a muralha é quase vertical; nas diagonais, de frente em degraus, para não parecer pilares soltos)
 const diag=[1,2,3,4].map(q=>wallT.filter(([x,y])=>(x>=TC.x)===(q%2===1)&&(y>=TC.y)===(q>2)).reduce((b,t)=>{const s=Math.abs(Math.abs(t[0]-TC.x)-Math.abs(t[1]-TC.y));return!b||s<b[2]?[t[0],t[1],s]:b;},null));
 for(const[x,y]of wallT){const dx=x-TC.x,dy=y-TC.y,torre=Math.abs(dx)===2&&Math.abs(dy)>5||Math.abs(dy)===2&&Math.abs(dx)>5||diag.some(t=>t&&t[0]===x&&t[1]===y);
  addObj(x,y,torre?'torreA':Math.abs(dx)>Math.abs(dy)*2.2?'muroV':(x+y)%3?'muroH':'muroHA');}
 // a Torre no centro (M.torre = tile de baixo, no meio): ocupa 5×3 tiles; o nome aparece ao passar o mouse
 if(M.torre){const[tx,ty]=M.torre;for(let y=ty-2;y<=ty;y++)for(let x=tx-2;x<=tx+2;x++){const r=objRows[y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===x)r.splice(k,1);solid[y*W+x]=1;}
  addObj(tx,ty,'torreMagos',false,'Torre dos Magos');}}
// brilho que sobe do cristal no alto da Torre (chamado pelo render do 99)
function torreFx(){if(R()>.3)return;const[tx,ty]=MAPS[CUR].torre,top=(ty+1)*TILE-TORRE_H;
 parts.push({x:(tx+.5)*TILE+rf(-8,8),y:top+rf(0,13),vx:rf(-5,5),vy:rf(-14,-4),g:0,life:.8,max:.8,color:pick(['#aef0ff','#6ad8ff','#ffffff']),s:1});}
// Pintura por cima do chão (01, depois da decoração): pontes de pedra, círculos de runas (praças e em volta da Torre) e runas soltas pelo chão
function paintMoat(M,mx){const f=(c,a,b,w,h)=>{mx.fillStyle=c;mx.fillRect(a,b,w,h);};
 if(M.moat)for(const i of BRIDGES){const x=i%W,y=(i/W)|0,X=x*TILE,Y=y*TILE,wa=j=>ground[j]===G.WATER,wl=wa(i-1),wr=wa(i+1),wu=wa(i-W),wd=wa(i+W),vert=Math.abs(x-TC.x)<=1||(wl||wr)&&!(wu||wd);
  f('#b8b2a4',X,Y,16,16);for(let k=0;k<16;k+=4){if(vert){f('#8a8478',X,Y+k,16,1);f('#d4cec0',X,Y+k+1,16,1);}else{f('#8a8478',X+k,Y,1,16);f('#d4cec0',X+k+1,Y,1,16);}}
  if(vert){if(wl){f('#6a655c',X,Y,3,16);f('#dcd6c8',X,Y,3,1);}if(wr){f('#6a655c',X+13,Y,3,16);f('#dcd6c8',X+13,Y,3,1);}}
  else{if(wu){f('#6a655c',X,Y,16,3);f('#dcd6c8',X,Y,16,1);}if(wd){f('#6a655c',X,Y+13,16,3);f('#dcd6c8',X,Y+13,16,1);}}}
 const glyph=(g,X,Y,c)=>g.forEach((row,j)=>[...row].forEach((ch,i)=>{if(ch==='#')f(c,X+i,Y+j,1,1);}));
 // círculo de runas: dois anéis com runas entre eles
 const circle=(px,py,R)=>{for(const[r,c]of[[R,'#4aa8d8'],[R-9,'#4aa8d8'],[R+1,'#2a6a98']]){const n=Math.ceil(r*6.3);for(let k=0;k<n;k++){const a=k/n*6.2832;f(c,Math.round(px+Math.cos(a)*r),Math.round(py+Math.sin(a)*r*.8),1,1);}}
  const n=Math.max(6,Math.round(R/5));for(let k=0;k<n;k++){const a=k/n*6.2832,rr=R-4.5;glyph(RUNAS[k%RUNAS.length],Math.round(px+Math.cos(a)*rr)-2,Math.round(py+Math.sin(a)*rr*.8)-2,k%2?'#6ad8ff':'#9fe8ff');}};
 if(M.circulo)circle((TC.x+.5)*TILE,(TC.y+.5)*TILE,M.circulo);                          // círculo mágico no meio do salão da Torre
 if(!M.runas)return;
 circle((TC.x+.5)*TILE,(TC.y+.5)*TILE,72);                                            // em volta da Torre
 for(const[cx,cy]of M.pracas||[])circle((cx+.5)*TILE,(cy+.5)*TILE,34);
 // runas soltas pelo chão de pedra, apagadas (algumas mais acesas)
 for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){const i=y*W+x,h=((x*2654435761^y*40503)>>>0)%1000;if(ground[i]!==G.PLAZA||solid[i]||h>=45)continue;
  if(hyp(x-TC.x,y-TC.y)<5)continue;glyph(RUNAS[h%RUNAS.length],x*TILE+5,y*TILE+5,h<12?'#6ad8ff':'#7a9ab8');}}
// ================== MAPAS ==================
// Arcádia: toda de pedra por dentro, com poucas casas (4 comuns, perto dos portões norte e sul, mais os serviços) e quatro praças rúnicas
// nas diagonais (círculo de runas no chão, parede de runas atrás e um cristal no meio). O centro fica livre para a Torre (etapa 2).
MAPS.arcadia={n:'Cidade de Arcádia',s:'Zona segura • a cidade dos estudiosos',town:1,road:1,theme:0,seed:901,color:'#1e2a4a',lanterns:1,moat:1,runas:1,fountain:[TC.x-4,TC.y+3],
 houses:[[35,20,'arcCasa1'],[44,20,'arcCasa2'],[35,41,'arcCasa2'],[44,41,'arcCasa1']],pracas:[[33,22],[48,22],[33,38],[48,39]],portals:{planalto:[40,58]}};
MAPS.arcadia.deco=MAPS.arcadia.pracas.flatMap(([x,y])=>[[x-1,y-3,'paredeRuna',1],[x,y,'cristal']]);// Planalto das Runas: campo de nível 5 a 10 entre Valdor e Arcádia, com pedras rúnicas e o caminho dos peregrinos (estrada)
MAPS.planalto={n:'Planalto das Runas',s:'Nível 5 a 10',road:1,theme:0,seed:921,color:'#2a4a3a',plateau:.64,lv:[5,10],home:'valdor',portals:{valdor:[40,58],arcadia:[40,1]},
 count:24,chests:6,tier:1,mons:[['lobo',.4],['verme',.7],['esporov',1]],deco:[]};
{const rg=mulberry32(4321),rr=(a,b)=>a+Math.floor(rg()*(b-a+1));
 for(let k=0,t=0;k<14&&t<400;t++){const x=rr(4,75),y=rr(4,55);if(Math.abs(x-TC.x)<5||MAPS.planalto.deco.some(d=>hyp(d[0]-x,d[1]-y)<7))continue;MAPS.planalto.deco.push([x,y,'runa']);k++;}}
MAPS.valdor.portals.planalto=[40,1]; // saída norte de Valdor: a muralha abre um portão com torres sozinha
// os 4 serviços de toda cidade principal: Bento (praça), Guilda, casa da Elara e ferreiro, no estilo de Arcádia
guildHall('guildaArcadia','arcadia','guilda3',1061);addBar(MAPS.guildaArcadia);addSalao(MAPS.guildaArcadia); // bar e gente do salão (20)
cityHouses('arcadia','Arcadia',1071,'A');
// ================== A TORRE DOS MAGOS (etapa 2) ==================
// No centro de Arcádia, sobre o círculo grande de runas; a porta fica embaixo, virada para o sul.
// Dentro: salão redondo de pedra, estantes seguindo a parede, o círculo mágico no meio e a Arquimaga Selene ao fundo, diante de um cristal.
// Com o Mago, E abre a janela da mentora em nome dela (prova e promoção, etapa 3, em 03/04); com as outras classes, ela só conversa.
MAPS.arcadia.torre=[TC.x,TC.y+1];MAPS.arcadia.portals.torreArcadia=[TC.x,TC.y+2,'porta'];
MAPS.torreArcadia={n:'Torre dos Magos',s:'Arquimaga Selene',interior:1,round:1,city:'arcadia',theme:10,seed:1081,color:'#1e2a4a',home:'arcadia',room:[19,13],circulo:36,
 portals:{arcadia:[TC.x,TC.y+6,'porta']},talk:[[TC.x,TC.y-4,'selene']],
 deco:[[TC.x,TC.y-6,'cristal'],[TC.x,TC.y-4,'selene'],[TC.x-7,TC.y+2,'mesaCristal',1],[TC.x+6,TC.y+2,'mesaCristal',1],
  ...[[-3,-6],[-2,-6],[2,-6],[3,-6],[-6,-5],[-5,-5],[5,-5],[6,-5],[-7,-4],[7,-4],[-8,-3],[8,-3],[-9,-1],[-9,0],[9,-1],[9,0]].map(([dx,dy])=>[TC.x+dx,TC.y+dy,'estante'])]};
GENTE.push({id:'selene',n:'Arquimaga Selene',c:'#8fd8ff',f:['Bem-vindo à Torre, viajante. Aqui guardamos o saber de todo o reino.',
 'As runas do Planalto são mais antigas que Arcádia. Ainda não conseguimos ler todas.','O cristal lá no alto nunca se apaga. Os estudiosos juram que ele sonha.',
 'Todo Mago que busca o seu caminho sobe estas escadas. Astrael guia a escolha; eu só leio as estrelas.',
 'Sou aprendiz de Astrael, o senhor das estrelas e do saber. Cada estrela lá fora é uma página que ele escreveu.','Silêncio perto das estantes, por favor. Alguns livros mordem.',
 'A magia não é força, é paciência. Quem tem pressa, que vá para a Guilda.']});
// missões da Guilda de Arcádia (região: Planalto das Runas)
MISS.push({city:'arcadia',id:'lobosRunas',t:'Uivos entre as runas',map:'planalto',mat:'lobo',n:8,lv:6,txt:'Lobos rondam as pedras rúnicas do Planalto e assustam os estudiosos que vão copiar as inscrições. Traga 8 Presas de Lobo.'},
 {city:'arcadia',id:'vermesCaminho',t:'Vermes no caminho',map:'planalto',mat:'verme',n:10,lv:7,txt:'Vermes cavaram túneis sob o caminho dos peregrinos, e as carroças de livros vivem atolando. Traga 10 Cascas de Verme.'},
 {city:'arcadia',id:'poAlquimia',t:'Pó para a alquimia',map:'planalto',mat:'esporov',n:12,lv:8,txt:'Os alquimistas de Arcádia precisam de Pó Venenoso para um antídoto novo (juram que é para o bem). Traga 12.'});
