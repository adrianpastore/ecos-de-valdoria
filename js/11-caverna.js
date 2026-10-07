// Ecos de Valdoria — Caverna de Pinheiral: andares em corredores, escuridão e tema de rocha
'use strict';
// ================== TEMA DA CAVERNA (7) ==================
GP[7]=['#5a4d44','#54483f','#463b34','#6a5c51'];PC[7]=['#6e5c4c','#5e4e40','#7e6a58'];WC[7]=['#1e2e3e','#26384a','#5a7a9a'];
for(const[o,r]of[[GP,GPr],[PC,PCr],[WC,WCr]])r[7]=o[7].map(hexRGB);
// paredão: face, veios, pé, topo claro, topo, rocha funda, rocha funda escura
CLFT[7]=['#4a3f38','#352c27','#231d1a','#6a5d52','#5a4e45','#171210','#110d0c'].map(hexRGB);
MINIC.obj[7]='#8a7a6a';
def('estalagmite',["",".......kk.......","......klSk......","......klSk......",".....klsSSk.....",".....klsSSk.....","....klssSSSk....","....klssSSSk....","...klsssSSSSk...","...klsssSSSSk...","..klssssSSSSSk..","..kkkkkkkkkkkk.."],{s:'#8a7a6a',S:'#5a4d44',l:'#b0a090'});

// ================== MONSTROS DA CAVERNA ==================
def('morcego',["","","","","k......kk......k","kk....kMMk....kk","kWk..kMMMMk..kWk","kWWkkMeMMeMkkWWk","kWWWWMMMMMMWWWWk",".kWWWMMwwMMWWWk.",".kWkWkMMMMkWkWk.","..k.k.kMMk.k.k..",".......kk......."],{W:'#4a3a5a',M:'#6a5a7a',e:'#ff4040',w:'#ffffff'});
def('esqArq',["......kkkk...k..",".....kbbbbk..kTk","....kbbbbbbk.knT","....kbrbbrbk.n.T","....kbbbbbBk.n.T",".....kbkbkk..n.T","......kkkk...n.T","....kkbbbbkk.n.T","...kbkBbbBkbbbbT","...kbkbbbbkk.n.T","...k..kBBk...n.T","......kbbk...nT.",".....kb..bk..kT.",".....kb..bk.....","....kbb..bbk....","....kkk..kkk...."],{b:'#e8e2cc',B:'#a9a28a',r:'#40c8ff',T:'#7a5a2a',n:'#c8c0a8'});
def('zumbi',["......kkkk......",".....kZZZZk.....","....kZZzZZZk....","....kZeZZeZk....","....kZZZZZZk....",".....kZmmZk.....","......kkkk......","...kkkRRRRkkkk..","..kZkRRrRRkZZZk.","..kZkRrRRRk.kkk.","..kk.kRRRRk.....",".....kPPPPk.....",".....kPkkPk.....","....kPPk.kPk....","....kZZk.kZZk...","....kkk..kkk...."],{Z:'#7a9a6a',z:'#9aba8a',e:'#ffe040',m:'#3a2a2a',R:'#6a5a7a',r:'#4a3a5a',P:'#4a4a3a'});
// pack: nasce em bando • hover: plana no ar (sem atravessar a rocha) • arrow/projC: aparência do disparo
Object.assign(MDEF,{
 morcego:{n:'Morcego da Caverna',hp:34,atk:9,def:2,spd:88,xp:16,r:5,aggro:110,cd:.8,pack:[3,5],hover:1},
 esqArq:{n:'Esqueleto Arqueiro',hp:60,atk:13,def:4,spd:40,xp:26,r:7,aggro:130,cd:1.6,ranged:110,arrow:1,projC:'#e8e2cc'},
 zumbi:{n:'Zumbi Mineiro',hp:170,atk:18,def:8,spd:22,xp:34,r:8,aggro:70,cd:1.8,poison:1}});

// ================== ANDARES ==================
Object.assign(MAPS,{
 caverna1:{n:'Caverna de Pinheiral • 1º andar',s:'Nível 20 a 24 • escuridão',cave:1,dark:1,theme:7,seed:901,color:'#1a1412',lv:[20,24],home:'pinheiral',portals:{pinheiral:[78,30],caverna2:[6,52]},count:24,chests:5,tier:3,mons:[['morcego',.45],['esqueleto',1]]},
 caverna2:{n:'Caverna de Pinheiral • 2º andar',s:'Nível 24 a 28 • escuridão',cave:1,dark:1,theme:7,seed:902,color:'#15100f',lv:[24,28],home:'caverna1',portals:{caverna1:[6,52],caverna3:[72,7]},count:24,chests:5,tier:3,mons:[['esqArq',.45],['zumbi',.8],['esqueleto',1]]},
 caverna3:{n:'Caverna de Pinheiral • fundo',s:'Nível 28 a 30 • escuridão',cave:1,dark:1,theme:7,seed:903,color:'#100b0b',lv:[28,30],home:'caverna2',portals:{caverna2:[72,7]},count:18,chests:4,tier:3,elite:.12,mons:[['esqArq',.35],['zumbi',.7],['morcego',.85],['esqueleto',1]]}});
MAPS.pinheiral.portals.caverna1=[1,30]; // a boca da caverna fica no lado oeste da aldeia
// chefe do fundo (sprite, números e golpes em 10): nasce no salão mais longe da escada
Object.assign(MAPS.caverna3,{boss:'senhorOssos',bossLv:30});MAPS.caverna3.s+=' • chefe no salão mais fundo';

// salões espalhados, ligados por corredores sinuosos (árvore mínima + dois atalhos), e um túnel até cada portal
function caveMask(M,rng){const C=new Uint8Array(W*H);
 const dig=(x,y,r,edge)=>{const lo=edge?1:2,n=Math.ceil(r);for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++){const X=Math.round(x)+i,Y=Math.round(y)+j;if(X>=lo&&Y>=lo&&X<W-lo&&Y<H-lo&&i*i+j*j<=r*r)C[Y*W+X]=1;}};
 const tunnel=(a,b,w,edge)=>{const L=hyp(b.x-a.x,b.y-a.y)||1,st=Math.ceil(L*2),nx=-(b.y-a.y)/L,ny=(b.x-a.x)/L,ph=rng()*6,am=1.5+rng()*2.5;
  for(let s=0;s<=st;s++){const t=s/st,off=Math.sin(t*Math.PI*2+ph)*am*Math.sin(t*Math.PI);dig(a.x+(b.x-a.x)*t+nx*off,a.y+(b.y-a.y)*t+ny*off,w,edge);}};
 const room=o=>{const n=Math.ceil(o.r)+2;for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++)if(hyp(i/o.r,j/(o.r*.75))+(rng()-.5)*.35<1)dig(o.x+i,o.y+j,0);};
 const rooms=[];for(let k=0;k<300&&rooms.length<10;k++){const r=3.5+rng()*4,x=8+rng()*(W-16),y=7+rng()*(H-14);if(rooms.some(o=>hyp(o.x-x,o.y-y)<o.r+r+5))continue;rooms.push({x,y,r});}
 for(const p of Object.values(M.portals)){const o={x:clamp(p[0],7,W-8),y:clamp(p[1],6,H-7),r:3};rooms.push(o);tunnel({x:p[0],y:p[1]},o,1,true);dig(p[0],p[1],1,true);}
 const inT=[rooms[0]],out=rooms.slice(1);
 while(out.length){let best=null;for(const a of inT)for(const b of out){const d=hyp(a.x-b.x,a.y-b.y);if(!best||d<best.d)best={a,b,d};}
  tunnel(best.a,best.b,1.5);inT.push(best.b);out.splice(out.indexOf(best.b),1);}
 for(let k=0;k<2;k++){const a=rooms[Math.floor(rng()*rooms.length)],b=rooms[Math.floor(rng()*rooms.length)];if(a!==b)tunnel(a,b,1.2);}
 for(const o of rooms)room(o);
 return C;}
// estalagmites só no meio dos salões (5×5 livre), para nunca fechar um corredor
function caveRoom(C,x,y){for(let j=-2;j<=2;j++)for(let i=-2;i<=2;i++){const X=x+i,Y=y+j;if(X<0||Y<0||X>=W||Y>=H||!C[Y*W+X])return false;}return true;}
// rocha longe de qualquer chão é pintada quase preta
function deepRock(x,y){for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const X=x+i,Y=y+j;if(X>=0&&Y>=0&&X<W&&Y<H&&ground[Y*W+X]!==G.CLIFF)return false;}return true;}

// ================== ESCURIDÃO ==================
// Tudo escuro, menos a luz da tocha do herói (que tremula), os portais e as magias em voo.
let darkC=null;
function drawDark(sx,sy,tt){if(!MAPS[CUR].dark)return;
 // pintada em meia resolução e esticada com suavização: a luz é um degradê, ninguém nota, e fica ~4× mais leve (18)
 const dw=Math.ceil(VW/2),dh=Math.ceil(VH/2);if(!darkC||darkC.width!==dw||darkC.height!==dh)darkC=cnv(dw,dh);
 const d=darkC.getContext('2d');d.setTransform(.5,0,0,.5,0,0);d.globalCompositeOperation='source-over';d.clearRect(0,0,VW,VH);d.fillStyle='rgba(6,4,8,.93)';d.fillRect(0,0,VW,VH);
 d.globalCompositeOperation='destination-out';
 const hole=(x,y,r,a)=>{const g=d.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(0,0,0,${a})`);g.addColorStop(.55,`rgba(0,0,0,${a*.85})`);g.addColorStop(1,'rgba(0,0,0,0)');d.fillStyle=g;d.fillRect(x-r,y-r,r*2,r*2);};
 const fl=1+Math.sin(tt*7)*.025+Math.sin(tt*13)*.015,tr=92*S*fl;
 if(P)hole(sx(P.x),sy(P.y-8),tr,1);
 for(const to in MAPS[CUR].portals){const p=portalPt(to);hole(sx(p.x),sy(p.y),34*S,.8);}
 for(const p of projs)hole(sx(p.x),sy(p.y),14*S,.6);
 for(const p of mproj)hole(sx(p.x),sy(p.y),10*S,.5);
 // a atadura do Rei Sethkar (27) clareia o caminho todo, do rei até a ponta
 for(const[m,q]of[...mproj.filter(p=>p.pull).map(p=>[p.m,p]),...(FAIXA&&mons.includes(FAIXA)?[[FAIXA,{x:P.x,y:P.y-8}]]:[])])for(let k=1;k<6;k++){const f=k/6;hole(sx(m.x+(q.x-m.x)*f),sy(m.y-mh(m)/2+(q.y-m.y+mh(m)/2)*f),12*S,.45);}
 for(const m of mons)if(m.boss)hole(sx(m.x),sy(m.y-14),44*S,.55); // o chefe brilha no escuro
 for(const f of fx)if(f.k==='boom')hole(sx(f.x),sy(f.y),(f.r||20)*1.5*S,.7);
 // brilho alaranjado da tocha: pintado na própria camada (por cima do escuro, como antes), em meia resolução
 d.globalCompositeOperation='source-over';if(P){const x=sx(P.x),y=sy(P.y-8),g=d.createRadialGradient(x,y,0,x,y,tr);g.addColorStop(0,'rgba(255,170,80,.10)');g.addColorStop(1,'rgba(255,170,80,0)');d.fillStyle=g;d.fillRect(x-tr,y-tr,tr*2,tr*2);}
 ctx.imageSmoothingEnabled=true;ctx.drawImage(darkC,0,0,VW,VH);ctx.imageSmoothingEnabled=false;}
