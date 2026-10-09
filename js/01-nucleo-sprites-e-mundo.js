// Ecos de Valdoria — Utilidades, sprites em pixel art, gerador de mapas e terreno
'use strict';
const $=id=>document.getElementById(id);
const TILE=16,W=80,H=60,MW=W*TILE,MH=H*TILE;
const TC={x:40,y:30},LAIR=TC;
// com ?dev no endereço (menu de testes, 23) o herói fica num save separado e o de verdade não é tocado
const DEV=/[?&]dev\b/.test(location.search);
const K='#1b1320',SAVEKEY='valdoria_save_v1'+(DEV?'_dev':'');
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const R=Math.random,ri=(a,b)=>a+Math.floor(R()*(b-a+1)),rf=(a,b)=>a+R()*(b-a),pick=a=>a[Math.floor(R()*a.length)],clamp=(v,a,b)=>v<a?a:v>b?b:v,hyp=Math.hypot;
let uidN=1;const uid=()=>'i'+Date.now().toString(36)+(uidN++);
function cnv(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c;}
function mk(rows,pal){const h=rows.length,w=Math.max(...rows.map(r=>r.length));const c=cnv(w,h),x=c.getContext('2d');const P=Object.assign({k:K},pal);rows.forEach((r,j)=>{for(let i=0;i<r.length;i++){const col=P[r[i]];if(col){x.fillStyle=col;x.fillRect(i,j,1,1);}}});return c;}
function flipC(c){const o=cnv(c.width,c.height),x=o.getContext('2d');x.translate(c.width,0);x.scale(-1,1);x.drawImage(c,0,0);return o;}
function whiteC(c){const o=cnv(c.width,c.height),x=o.getContext('2d');x.drawImage(c,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);return o;}
const SPR={};
function reg(n,c){const f=flipC(c);SPR[n]={n:c,f,w:whiteC(c),wf:whiteC(f)};}
function def(n,rows,pal){reg(n,mk(rows,pal));}
function toURL(c,sc=4){const o=cnv(c.width*sc,c.height*sc),x=o.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(c,0,0,o.width,o.height);return o.toDataURL();}

// ---------- personagens ----------
def('guerreiro',["......rRr.......",".....kkrkk......","....kaallak.....","...kaalaaaAk....","...kAAAAAAAk....","...kssesesSk....","...ksssssSSk....","....kSSSSSk..w..","..kkaalaaAkk.w..",".krRaaaaaaAAkw..",".kRkAaaaaAk.sg..",".kR.kgggggk.kg..","..k.kpppApk..k..","....kppkppk.....","....kbbkbbk.....","....kkk.kkk....."],
{A:'#5d6679',a:'#98a4b8',l:'#dfe6ef',s:'#f1c7a0',S:'#c8906c',e:K,r:'#c8323a',R:'#7a1f2a',w:'#eef3f8',g:'#e8b43c',b:'#4a3222',p:'#3b3552'});
def('mago',[".......k........","......kMk.......",".....kMmMk......","....kMmmmMk..oO.","...kMmmmmmMk.Oo.","..kkkgggggkkk.y.","....kssesesk..y.","....kssssssk..y.",".....kSSSSk..sy.","....kMmmmmMk.ky.","...kMmmgmmmMkky.","...kMmmgmmmMk.y.","..kMmmmgmmmmMky.","..kMmmmgmmmmMk..","..kMMMMMMMMMMk..","...kkkkkkkkkk..."],
{M:'#2e3890',m:'#4b5bd6',g:'#e8b43c',s:'#f1c7a0',S:'#c8906c',e:K,y:'#8a5a2c',o:'#7ef0ff',O:'#e8ffff'});
def('arqueira',["......kkkk......",".....kFffFk.....","....kFfffffk....","....kFhhhhFk.T..","....kFsesesk.nT.","....kFssssSk.n.T",".....kSSSSk..n.T","...kffttttffksnT","..kfffttttfffk.T","..kFkfttttfkFk.T","..ks.kgggggk.nT.","....kTTTTTTk.T..","....kTTkTTk.....","....kbbkbbk.....","....kkk.kkk....."],
{F:'#25603a',f:'#3f8f4a',h:'#c9772e',s:'#f1c7a0',S:'#c8906c',e:K,t:'#9a6a3a',T:'#6a4526',n:'#f0e6d0',g:'#e8b43c',b:'#4a3222'});
def('npc',["......kkkk......",".....kPPPPk.....","...kkPPPPPPkk...","..kPPPPPPPPPPk..","....kssesesk....","....kssssssk....","....kwwwwwwk....","...kkwwwwwwkk...","..kppkwwwwkppk..","..kpgpkwwkpgpk..","..kpppppppppk...","..kspppgppppsk..","...kpppgpppk....","...kpppppppk....","...kbbk.kbbk....","...kkkk.kkkk...."],
{P:'#6a3a2a',p:'#8a5a2e',w:'#eeeeee',g:'#e8b43c',s:'#f1c7a0',e:K,b:'#4a3222'});
// ---------- monstros ----------
def('slime',["","","","","","......kkkk......","....kkGGGGkk....","...kGGlGGGGGk...","..kGGllGGGGGGk..","..kGGGGGGGGGGk..",".kGGGkeGGkeGGGk.",".kGGGkeGGkeGGGk.",".kGGGGGGGGGGGgk.",".kgGGGGGGGGGGgk.","..kggggggggggk..","...kkkkkkkkkk..."],{G:'#5fcf5a',g:'#2f8a3a',l:'#c8ffc0',e:K});
def('lobo',["","","","..........k.k...",".........kdkdk..","........kggggggk","kk.....kgggegggk","kdk.kkkkggggGGkk",".kdkggggggggGGk.","..kgggggggggGk..","..kggggggggggk..","..kgGGGGGGGgk...","..kgk.kgk.kgk...","..kdk.kdk.kdk...","..kkk.kkk.kkk..."],{g:'#8d8f9c',G:'#c6c8d2',d:'#555766',e:'#ffdd33'});
def('aranha',["","","","","......kkkk......",".....kpppPk.....","..k.kppppppk.k..",".k.kkpppppPkk.k.","k.k.kpePePpk.k.k","..kkkpppppPkkk..",".k.k.kppppk.k.k.","k..k..kkkk..k..k","...k........k..."],{p:'#6a3a8a',P:'#3e2152',e:'#ff4455'});
def('esqueleto',["......kkkk......",".....kbbbbk.....","....kbbbbbbk....","....kbrbbrbk....","....kbbbbbBk....",".....kbkbkk.....","......kkkk...w..","....kkbbbbkk.w..","...kbkBbbBkbkw..","...kbkbbbbkkbw..","...k..kBBk..kg..","......kbbk..k...",".....kb..bk.....",".....kb..bk.....","....kbb..bbk....","....kkk..kkk...."],{b:'#e8e2cc',B:'#a9a28a',r:'#ff4a3a',w:'#c8d0da',g:'#7a5a2a'});
def('orc',["",".....kkkkk......","....kOoooOk.....","...kOoeooeOk.xx.","...kOoooooOk.xxx","...kOtkkktOk.y..","..kkkOOOOOkkky..",".kooaaaaaaaooky.",".kOoaAaaaAaoOky.",".kokkaaaaakkok..","..k.kAAAAAk.k...","....kaakaak.....","....kOOkOOk.....","...kOOk.kOOk....","...kkkk.kkkk...."],{o:'#6b9a3e',O:'#466a28',e:'#ffe040',t:'#f5f0da',a:'#7a4e2c',A:'#4f3119',x:'#c0c8d0',y:'#6a4526'});
def('golem',["","....kkkkkkk.....","...kSSsSSSSk....","...kSeSSSeSk....","..kkSSSSSSSkk...",".kSSkkSSSkkSSk..","kSSSSSccSSSSSSk.","kSSkSSSccSSkSSk.","kSSkSSSSSSSkSSk.","kSk.kSSSSSk.kSk.",".kk.kSSSSSk.kk..","....kSSkSSk.....","...kSSk.kSSk....","...kSSk.kSSk....","..kkkkk.kkkkk..."],{S:'#8a8478',s:'#b8b2a4',c:'#54e3d6',e:'#7ff9ff'});
def('wyrm',["",".k.........kk...","kRk.......kRRk..","kRRk....kkRReRk.",".kRRk..kRRRRRRRk","..kRRkkRRRRkkkk.","..kRRRRRRRRk....",".kRRyyyRRRRk....","kRRyyyyyRRRRk...","kRRyyyyyRRRRRk..",".kRyyyyRRkkRRk..","..kRRRRRk..kRRk.","..kRk.kRk...kRRk","..kRk.kRk....kk.",".kkkk.kkkk......"],{R:'#b0303a',y:'#f0b050',e:'#ffe040'});
// ---------- baús ----------
const CPAL=[null,{b:'#b07a3c',B:'#7a4e22',m:'#6d6a70',g:'#e8b43c'},{b:'#9aa8b8',B:'#5f6b7a',m:'#d8e0ea',g:'#ffe07a'},{b:'#d9a930',B:'#9a6e14',m:'#fff0a0',g:'#ffffff'},{b:'#7a3ab8',B:'#4a1f78',m:'#ffcc40',g:'#fff'}];
const CH_C=["","","","","..kkkkkkkkkkkk..",".kBbbbbbbbbbbBk.",".kbbbbbbbbbbbbk.",".kmmmmmmmmmmmmk.",".kBbbbbggbbbbBk.",".kbbbbbgkbbbbbk.",".kbbbbbbbbbbbbk.",".kmmmmmmmmmmmmk.",".kBbbbbbbbbbbBk.",".kkkkkkkkkkkkkk."];
const CH_O=["","","","","..kkkkkkkkkkkk..",".kBbbbbbbbbbbBk.",".kmmmmmmmmmmmmk.",".kkkkkkkkkkkkkk.",".kddddddddddddk.",".kmmmmmmmmmmmmk.",".kBbbbbbbbbbbBk.",".kbbbbbbbbbbbbk.",".kBbbbbbbbbbbBk.",".kkkkkkkkkkkkkk."];
for(let t=1;t<=4;t++){def('chest'+t,CH_C,CPAL[t]);def('chesto'+t,CH_O,Object.assign({d:'#20140c'},CPAL[t]));}
def('mimico',["","","","..kkkkkkkkkkkk..",".kBbbrbbbbrbbBk.",".kmmmmmmmmmmmmk.",".kwkwkwkwkwkwkk.",".kdddddRRdddddk.",".kddRRRRRRRRddk.",".kkwkwkwkwkwkwk.",".kmmmmmmmmmmmmk.",".kBbbbbbbbbbbBk.",".kbbbbbbbbbbbbk.",".kkkkkkkkkkkkkk."],{b:'#9aa8b8',B:'#5f6b7a',m:'#d8e0ea',r:'#ff3030',w:'#fff',d:'#20140c',R:'#c0303a'});
// ---------- cenário ----------
def('rock',["......kkkk......","....kkrrrRkk....","...krrlrrrrRk...","..krrrrrrrRRRk..","..krrrrrrRRRRk..","..kRrrrRRRRRRk..","...kkkkkkkkkk..."],{r:'#8d8a86',R:'#5f5c59',l:'#c2bfbb'});
def('dead',["","..k.........k...","..dk.......kd...","...dk..k..kd....","....dk.dkkd..k..",".k...dkdkd..kd..",".dk...dddk.kd...","..dkk.dddkkd....","....dkddddd.....","......dddk......","......dddk......","......dDdk......","......dDdk......","......dDdk......","......dDdk......","......dDdk......",".....kdDddk.....","....kddDdddk....","...kkk.kk.kkk..."],{d:'#5a4a3c',D:'#3e3228'});
const PIL=["...kkkkkkkkkk...","..kssssssssssk..","..kSSSSSSSSSSk..","...kkkkkkkkkk...","....kssssSSk....","....ksskssSk....","....ksssksSk....","....kssssSSk....","....kssssSSk....","....kssssSSk....","....ksssskSk....","....ksssskSk....","....kssssSSk....","....kssssSSk....","....kssssSSk....","....kssssSSk....","...kkkkkkkkkk...","..kssssssssssk..","..kSSSSSSSSSSk..","..kkkkkkkkkkkk.."];
def('pillar',PIL,{s:'#b5ae9c',S:'#7f7868'});
def('pillar2',[".....k..kk......","....kskkssk....."].concat(PIL.slice(9)),{s:'#b5ae9c',S:'#7f7868'});
def('fountain',["","......kkkk......",".....kwbbwk.....","......kssk......","......kssk......","..kkkkkssSkkkk..",".kssssssssssssk.","kssbbbbbbbbbbssk","ksbbwbbbbbwbbbsk","ksbbbbbbbwbbbbsk","kSsbbbbbbbbbbsSk",".kSSSSSSSSSSSSk.","..kkkkkkkkkkkk.."],{s:'#c8c2b4',S:'#8d8778',b:'#4a9be0',w:'#e8f6ff'});
def('coin',["..kkkk..",".kgggGk.","kgglgGGk","kgglgGGk","kggggGGk","kgggGGGk",".kGGGGk.","..kkkk.."],{g:'#ffd24a',G:'#c8901a',l:'#fff6c0'});
const RARC=['#e2e2e2','#3ddc5a','#4a9bff','#c05cff','#ff9a1f'];
for(let r=0;r<5;r++)def('bag'+r,["....kkkk....",".....kk.....","....kcck....","...kBbbBk...","..kbbbbbbk..",".kbbbbbbbbk.",".kbbbbbbbbk.",".kBbbbbbbBk.","..kkkkkkkk.."],{b:'#a0703c',B:'#6f4a24',c:RARC[r]});
// árvores (24×30, ocupam 1 tile): copa em tufos sobrepostos com luz do alto à esquerda, tronco curto com raízes e sombra no chão.
// TREEK: tufos [x, y, raio] de trás para a frente; 4 tipos (redonda, alta, larga, jovem)
const TREEK=[[[12,7,6],[5.5,14,5.5],[18.5,14,5.5],[12,13.5,8]],[[12,5.5,6.5],[7,12,5],[17,12,5],[12,15.5,7.5]],
 [[12,8,7.5],[6.5,14.5,6.5],[17.5,14.5,6.5]],[[12,11,4.5],[8.5,14.5,5],[15.5,14.5,5],[12,17.5,5.5]]];
function genTree(p,rng,kind=0){const TW=24,TH=30,c=cnv(TW,TH),x=c.getContext('2d'),B=26,top=kind===3?18:17,px=(i,y,col)=>{x.fillStyle=col;x.fillRect(i,y,1,1);};
 x.fillStyle='rgba(0,0,0,.24)';for(const[hw,y]of[[5,25],[8,26],[8,27],[5,28]])x.fillRect(12-hw,y,hw*2,1);
 for(let y=top;y<=B;y++){px(9,y,K);px(14,y,K);for(let i=10;i<14;i++)px(i,y,i<12?(rng()<.12?p.t2:p.t1):(rng()<.15?p.t1:p.t2));}
 px(8,B,K);px(9,B,p.t2);px(14,B,p.t2);px(15,B,K);x.fillStyle=K;x.fillRect(8,B+1,8,1);px(9,B-1,K);px(14,B-1,K);
 // cada pixel da copa fica com o tufo mais da frente que o cobre
 const cl=TREEK[kind],own=new Int8Array(TW*TH).fill(-1),at=(i,y)=>i<0||y<0||i>=TW||y>=TH?-1:own[y*TW+i];
 for(let k=0;k<cl.length;k++){const[cx,cy,r]=cl[k];for(let y=0;y<TH;y++)for(let i=0;i<TW;i++)if(hyp(i+.5-cx,(y+.5-cy)*1.05)+(rng()-.5)*.8<r)own[y*TW+i]=k;}
 for(let y=0;y<TH;y++)for(let i=0;i<TW;i++){const k=at(i,y);if(k<0)continue;const[cx,cy,r]=cl[k],nb=[at(i-1,y),at(i+1,y),at(i,y-1),at(i,y+1)];let col;
  if(nb.some(v=>v<0))col=K; // contorno
  else if(nb.some(v=>v<k))col=p.d; // borda de um tufo da frente sobre um de trás
  else{const s=((i+.5-cx)*.65+(y+.5-cy))/r;col=s<-.5?p.l:s>.42?p.d:p.m;if(col===p.m&&s<-.1&&rng()<.09)col=p.l;else if(rng()<.07)col=rng()<.5?p.d:p.l;}
  px(i,y,col);}
 return c;}
const TPAL={0:{l:'#8fdc72',m:'#56a84a',d:'#2f6e34',t1:'#8a5a32',t2:'#6a4224'},1:{l:'#7fd06a',m:'#4a9a42',d:'#2a6430',t1:'#8a5a32',t2:'#6a4224'},2:{l:'#7a8f4a',m:'#566b36',d:'#384826',t1:'#5e4a36',t2:'#43352a'},3:{l:'#e0a040',m:'#b86a2a',d:'#7a3a1c',t1:'#6a4a32',t2:'#4a3222'},4:{l:'#6a4a3a',m:'#4a3228',d:'#2a1c16',t1:'#3a2a22',t2:'#2a1e18'}};
{const rng=mulberry32(4242);for(let z=0;z<5;z++)for(let v=0;v<4;v++)reg(`tree${z}_${v}`,genTree(TPAL[z],rng,v));}
// pedras (16×14): 4 tipos (pedregulho com rachadura, duas pedras, pedra alta, laje com pedrinha), cor de cada região e musgo (g/G)
// onde é úmido. O mapa escolhe o tipo pela posição (rockAt), sem mexer no sorteio do gerador
const ROCKK=[[[8,8,6.5,4.6]],[[6,9,4.6,3.6],[11.5,10.2,3.4,2.6]],[[8,7.5,4.2,6]],[[4.2,9.6,2.4,1.9],[9.5,10,5.6,2.9]]];
function genRock(p,rng,kind){const RW=16,RH=14,c=cnv(RW,RH),x=c.getContext('2d'),st=ROCKK[kind],own=new Int8Array(RW*RH).fill(-1),at=(i,y)=>i<0||y<0||i>=RW||y>=RH?-1:own[y*RW+i];
 x.fillStyle='rgba(0,0,0,.24)';x.fillRect(2,12,12,1);x.fillRect(1,13,14,1);
 for(let k=0;k<st.length;k++){const[cx,cy,rx,ry]=st[k];for(let y=0;y<RH;y++)for(let i=0;i<RW;i++){const dx=(i+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy+(rng()-.5)*.12<1)own[y*RW+i]=k;}}
 for(let y=0;y<RH;y++)for(let i=0;i<RW;i++){const k=at(i,y);if(k<0)continue;const[cx,cy,rx,ry]=st[k],dx=(i+.5-cx)/rx,dy=(y+.5-cy)/ry,nb=[at(i-1,y),at(i+1,y),at(i,y-1),at(i,y+1)];let col;
  if(nb.some(v=>v<0)||nb.some(v=>v>=0&&v!==k&&cy<st[v][1]))col=K;
  else{const s=dx*.6+dy;col=s<-.62?p.l:s>.5?p.d:p.m;if(rng()<.08)col=rng()<.5?p.d:p.l;if(p.g&&dy<-.3&&s<.2&&rng()<.55)col=rng()<.3?p.G:p.g;}
  x.fillStyle=col;x.fillRect(i,y,1,1);}
 if(kind===0||kind===2){const[cx,cy]=st[0];let i=Math.round(cx+1),y=Math.round(cy-2);x.fillStyle=p.d;for(let n=0;n<4;n++){if(at(i,y)===0)x.fillRect(i,y,1,1);y++;i+=n%2?-1:0;}}
 return c;}
const RPAL={0:{l:'#d0ccc4',m:'#a29d94',d:'#6e6a63'},1:{l:'#c8c4bc',m:'#96918a',d:'#64605a',g:'#6aa84a',G:'#4a8a38'},2:{l:'#9c9c8a',m:'#707062',d:'#4a4a40',g:'#5f7a3c',G:'#44602e'},
 3:{l:'#e4d4a8',m:'#bca87c',d:'#867452'},4:{l:'#8e6e5e',m:'#62483e',d:'#3c2a24'},5:{l:'#c8c4bc',m:'#96918a',d:'#64605a',g:'#5a9a52',G:'#3e7a44'},7:{l:'#8a7a6a',m:'#64564a',d:'#463a32'}};
RPAL[6]=RPAL[5];
{const rng=mulberry32(7171);for(const z in RPAL)for(let v=0;v<4;v++)reg(`rock${z}_${v}`,genRock(RPAL[z],rng,v));}
const rockAt=(x,y,z)=>SPR[`rock${z}_0`]?`rock${z}_${((x*7+y*13)>>>0)%4}`:'rock';
function genHouse(roof,roofD){const c=cnv(32,32),x=c.getContext('2d');const f=(c_,a,b,w,h)=>{x.fillStyle=c_;x.fillRect(a,b,w,h);};
 f(K,3,13,26,19);f('#e8d6b0',4,14,24,17);f('#6a4526',4,14,24,2);f('#6a4526',4,29,24,2);f('#6a4526',4,14,2,17);f('#6a4526',26,14,2,17);f('#6a4526',15,16,2,13);
 f(K,12,21,8,11);f('#7a4e2c',13,22,6,10);f('#5a3820',15,22,1,10);f('#e8b43c',17,26,1,1);
 for(const wx of [7,21]){f(K,wx-1,18,6,6);f('#9fd4ff',wx,19,4,4);f('#6a4526',wx+1.5,19,1,4);}
 for(let y=0;y<15;y++){const hw=Math.min(15,3+y);f(K,16-hw-1,y,hw*2+2,1);f(y%3===0?roofD:roof,16-hw,y,hw*2,1);}
 f(K,21,0,5,6);f('#8a8478',22,1,3,5);return c;}
reg('house0',genHouse('#b8423a','#8a2a24'));reg('house1',genHouse('#3a6ab8','#244a8a'));reg('house2',genHouse('#6a8a3a','#4a6a24'));
// ---------- ícones de itens ----------
const ICON={sword:["..............kk",".............kwk","............kwWk","...........kwWk.","..........kwWk..",".........kwWk...","........kwWk....","..kk...kwWk.....","..kgk.kwWk......","...kgkwWk.......","....kggk........","....kykgk.......","...kyk.kgk......","..kyk...kk......",".kgk............",".kk............."],
staff:["...........kkk..","..........kOook.","..........koOok.",".........kykkk..","........kyk.....",".......kyk......","......kyk.......",".....kyk........","....kyk.........","...kyk..........","..kyk...........",".kyk............",".kk............."],
bow:[".....kk.........","....kTTk........","....k.kTk.......","....kn.kTk......","....kn..kTk.....","....kn...kTk....","....kn...kTk....","....kn...kTk....","....kn...kTk....","....kn..kTk.....","....kn.kTk......","....k.kTk.......","....kTTk........",".....kk........."],
elmo:["","",".....kkkkkk.....","....kwllwwwk....","...kwlwwwwwWk...","...kwwwwwwwWk...","...kWkkkkkkWk...","...kWk....kWk...","...kWWk..kWWk...","....kkk..kkk...."],
peito:["","","...kkk....kkk...","..kwwwkkkkwwwk..","..kwwwwwwwwwwk..","..kkwwllwwwwkk..","...kwwlwwwwWk...","...kwwwwwwwWk...","...kwwwgwwwWk...","...kgggggggggk..","...kWwwwwwwWk...","...kkkkkkkkkk..."],
botas:["","","","..kkkk...kkkk...","..kbbk...kbbk...","..kbbk...kbbk...","..kbbk...kbbk...","..kbbkk..kbbkk..","..kbbbbk.kbbbbk.","..kWWWWk.kWWWWk.","..kkkkkk.kkkkkk."],
anel:["",".......kk.......","......kcck......","......kCck......",".....kkkkkk.....","....kgk..kgk....","...kgk....kgk...","...kgk....kgk...","...kgk....kgk...","....kgk..kgk....",".....kkkkkk....."],
pot:["","","......kkkk......","......kyyk......",".......kk.......","......kggk......",".....kgrrgk.....","....krrlrrrk....","...krrlrrrrrk...","...krrrrrrrrk...","...krrrrrrRrk...","....krrrrRrk....",".....kkkkkk....."]};
const RMET=[['#dfe4ea','#8a93a3'],['#e2f0df','#6f9c7a'],['#d2e2ff','#5f82c8'],['#ecd4ff','#9a62d0'],['#ffe7a6','#d08a20']];
const icCache={};
function iconURL(key,rar=0){const id=key+rar;if(icCache[id])return icCache[id];
 const m=RMET[rar];const pal={w:m[0],W:m[1],l:'#fff',g:'#e8b43c',y:'#8a5a2c',o:RARC[rar],O:'#fff',T:rar>=3?m[1]:'#8a5a2c',n:'#f0e6d0',b:'#7a4e2c',c:RARC[rar],C:'#fff'};
 if(key==='pothp')Object.assign(pal,{r:'#e0303a',R:'#9a1a22',l:'#ffb0b0',y:'#b07a3c',g:'#cfe6f0'});
 if(key==='potmp')Object.assign(pal,{r:'#3a7aff',R:'#1a3a9a',l:'#b0d0ff',y:'#b07a3c',g:'#cfe6f0'});
 const c=mk(ICON[key.startsWith('pot')?'pot':key],pal);if(key.startsWith('pot')&&!SPR[key])reg(key,c);
 return icCache[id]=toURL(c,4);}
iconURL('pothp');iconURL('potmp');

// ---------- mundo ----------
const G={GRASS:0,PATH:1,WATER:2,PLAZA:3,HIGH:4,CLIFF:5,RAMP:6};
const ground=new Uint8Array(W*H),solid=new Uint8Array(W*H),zoneMap=new Uint8Array(W*H);
// BRG: estrada que passa por cima da água (lago ou rio): vira ponte de madeira na pintura do chão
const BRG=new Uint8Array(W*H);let FALLS=[]; // FALLS: cachoeiras do mapa atual (genWorld)
const objRows=Array.from({length:H},()=>[]);
function makeNoise(rng,sp){const gw=Math.ceil(W/sp)+3,gh=Math.ceil(H/sp)+3;const g=new Float32Array(gw*gh);for(let i=0;i<g.length;i++)g[i]=rng();
 return(x,y)=>{const fx=x/sp,fy=y/sp,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);const a=g[iy*gw+ix],b=g[iy*gw+ix+1],c=g[(iy+1)*gw+ix],d=g[(iy+1)*gw+ix+1];return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;};}
function addObj(tx,ty,spr,wide,label){objRows[ty].push({tx,ty,spr,px:(tx+(wide?1:.5))*TILE,py:(ty+1)*TILE,label});}
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const GP={5:['#4a8a50','#43804a','#386b3e','#62a066'],6:['#52925a','#4b8852','#3e7446','#6aaa6e'],0:['#5aa74e','#529c47','#468b3e','#78c865'],1:['#4f9a45','#57a34b','#437f3a','#6cbd5a'],2:['#4a6a3c','#43613a','#384f30','#5f8250'],3:['#7a7358','#847c5f','#665f49','#968d6c'],4:['#3b2b27','#43302b','#2f221f','#55403a']};
const PC={5:['#a08a68','#907a5a','#b09a78'],6:['#a08a68','#907a5a','#b09a78'],0:['#b89a62','#a88b55','#c9ad74'],1:['#b89a62','#a88b55','#c9ad74'],2:['#8a7a55','#7c6c4a','#9c8c66'],3:['#9a8a70','#8a7a60','#aa9a80'],4:['#5a4238','#4a342c','#6a5044']};
const WC={5:['#3a78a8','#4a88b8','#a0d0f0'],6:['#3a78a8','#4a88b8','#a0d0f0'],0:['#2f6fb0','#3b82c4','#9cd0f2'],1:['#2f6fb0','#3b82c4','#9cd0f2'],2:['#2c4a45','#35574f','#6f9a7e'],3:['#3a5f80','#44708f','#9ab8cc'],4:['#2a1a1a','#3a2222','#6a3a2a']};
const toRGB=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,v.map(hexRGB)]));
const GPr=toRGB(GP),PCr=toRGB(PC),WCr=toRGB(WC),PLZ=['#8d8778','#6d685c','#a09a8a'].map(hexRGB),PLZT={}; // PLZT[tema]: cores próprias da praça (ex.: o arenito de Sahrem, 25)
const mapC=cnv(MW,MH),miniBase=cnv(W,H);
const MINIC={obj:['#2f6e34','#2a6430','#384826','#7a3a1c','#2a1c16','#244a2c','#285030']};
// EARTH: barranco dos morros (platôs): terra, terra escura, terra mais escura, contorno, pedrinha
const EARTH=['#9a6e46','#7e5636','#5e3e26','#3a2616','#c09868'].map(hexRGB);
// EARTHT[tema]: barranco com outra cor naquele tema (ex.: areia nas dunas, 25); o genWorld troca o EARTH antes de pintar
const EARTH0=EARTH.map(c=>c.slice()),EARTHT={};
const CLF_C=['#6f6a60','#4f4a42','#35312c','#9a9488','#86806f'].map(hexRGB),CLFT={}; // CLFT[tema]: cores de paredão próprias (a caverna usa)
let CUR='valdor';
const MAPS={
 // portals: {destino: [tx, ty, noPlatô?]} • road: estrada até cada portal • home: portal de onde o nível cresce
 valdor:{n:'Vila de Valdor',s:'Zona segura • mercador, mentora e fonte de cura',town:1,road:1,theme:0,seed:101,color:'#3a5a2a',portals:{floresta:[1,20],pantano:[78,42],estrada:[48,58]}},
 floresta:{n:'Floresta Verdejante',s:'Nível 1 a 9',theme:1,seed:202,color:'#2f5a2a',lv:[1,9],home:'valdor',portals:{valdor:[78,20]},count:30,chests:8},
 pantano:{n:'Pântano Sombrio',s:'Nível 9 a 16',theme:2,seed:303,color:'#23352c',lv:[9,16],home:'valdor',portals:{valdor:[1,42],ruinas:[78,12]},count:28,chests:7},
 ruinas:{n:'Ruínas Esquecidas',s:'Nível 16 a 20',theme:3,seed:404,color:'#5a4a30',lv:[16,20],home:'pantano',portals:{pantano:[1,12],covil:[58,8]},count:26,chests:7},
 covil:{n:'Covil do Wyrm',s:'Chefe • nível 22',theme:4,seed:505,color:'#4a1a14',lv:[22,22],home:'ruinas',portals:{ruinas:[24,56]},boss:'wyrm',lair:1,chests:0},
 estrada:{n:'Estrada do Sul',s:'Nível 2 a 6',road:1,theme:1,seed:606,color:'#2f5a2a',lv:[2,6],home:'valdor',portals:{valdor:[48,1],pinheiral:[32,58]},clear:[[21,10]],count:18,chests:4,tier:1,mons:[['slime',.45],['esquilo',.8],['esporinho',1]]},
 pinheiral:{n:'Aldeia de Pinheiral',s:'Zona segura • mercador, mentora e fonte de cura',town:1,road:1,theme:6,seed:707,color:'#23402f',lanterns:1,houses:[[TC.x-7,TC.y+4,'house3'],[TC.x+6,TC.y+4,'house4'],[TC.x-7,TC.y-3,'house4'],[TC.x+6,TC.y-3,'house3']],portals:{estrada:[32,1],encosta1:[78,38]}},
 encosta1:{n:'Encosta de Pinheiral 01',s:'Nível 1 a 5',road:1,theme:5,seed:811,color:'#23402f',plateau:.62,lv:[1,5],home:'pinheiral',portals:{pinheiral:[1,38],encosta2:[78,24]},count:26,chests:6,tier:1,mons:[['slime',.35],['esporinho',.7],['esquilo',1]]},
 encosta2:{n:'Encosta de Pinheiral 02',s:'Nível 5 a 9',theme:5,seed:812,color:'#23402f',plateau:.62,lv:[5,9],home:'encosta1',portals:{encosta1:[1,24],encosta3:[40,9,1]},count:26,chests:6,tier:1,mons:[['lobo',.35],['verme',.7],['esporov',1]]},
 encosta3:{n:'Encosta de Pinheiral 03',s:'Nível 9 a 13',theme:5,seed:813,color:'#23402f',plateau:.62,lv:[9,13],home:'encosta2',portals:{encosta2:[40,58],encosta4:[78,30]},count:26,chests:6,tier:2,mons:[['salgueiro',.35],['guaxinim',.65],['jiboia',1]]},
 encosta4:{n:'Encosta de Pinheiral 04',s:'Nível 13 a 16',theme:5,seed:814,color:'#23402f',plateau:.62,lv:[13,16],home:'encosta3',portals:{encosta3:[1,30],encosta5:[78,46]},count:26,chests:6,tier:2,mons:[['salgueiroA',.35],['pegrande',.65],['lanterna',1]]},
 encosta5:{n:'Encosta de Pinheiral 05',s:'Nível 16 a 19',theme:5,seed:815,color:'#23402f',plateau:.62,lv:[16,19],home:'encosta4',portals:{encosta4:[1,46],encosta6:[56,9,1]},count:26,chests:6,tier:3,mons:[['duende',.4],['totem',.6],['pegrande',1]]},
 encosta6:{n:'Encosta de Pinheiral 06',s:'Nível 19 a 22',theme:5,seed:816,color:'#23402f',plateau:.62,lv:[19,22],home:'encosta5',portals:{encosta5:[56,58],encosta7:[78,16]},count:26,chests:6,tier:3,mons:[['salgueiroA',.2],['pegrande',.4],['lanterna',.6],['duende',.8],['totem',1]],elite:.15},
 encosta7:{n:'Encosta de Pinheiral 07',s:'Nível 22 a 26',theme:5,seed:817,color:'#23402f',plateau:.62,lv:[22,26],home:'encosta6',portals:{encosta6:[1,16]},count:26,chests:6,tier:3,mons:[['raposa',.45],['duende',.75],['totem',1]],elite:.1}};
const homeOf=M=>M.portals[M.home]||Object.values(M.portals)[0];
const portalPt=to=>{const p=MAPS[CUR].portals[to];return{x:(p[0]+.5)*TILE,y:(p[1]+.5)*TILE};};
function lvlAt(tx,ty){const M=MAPS[CUR];if(!M.lv)return 1;if(M.lv[0]===M.lv[1])return M.lv[0];const h=homeOf(M);return Math.round(M.lv[0]+(M.lv[1]-M.lv[0])*clamp(hyp(tx-h[0],ty-h[1])/(hyp(W,H)*.75),0,1));}
const REACH=new Uint8Array(W*H);
function computeReach(M){REACH.fill(0);const E=homeOf(M),q=[E[1]*W+E[0]];REACH[q[0]]=1;
 while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,j=Y*W+X;if(X<0||Y<0||X>=W||Y>=H||REACH[j]||solid[j])continue;REACH[j]=1;q.push(j);}}}
// tile livre e alcançável mais perto de (tx,ty); com hi definido, prefere o mesmo nível (em cima ou embaixo do platô)
function freeNear(tx,ty,hi){for(const same of hi==null?[0]:[1,0])for(let r=0;r<12;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;
  const X=tx+dx,Y=ty+dy,j=Y*W+X;if(X<1||Y<1||X>=W-1||Y>=H-1||solid[j]||!REACH[j])continue;if(same&&(ground[j]===G.HIGH)!==hi)continue;return{x:(X+.5)*TILE,y:(Y+.5)*TILE};}
 return{x:(TC.x+.5)*TILE,y:(TC.y+.5)*TILE};}
// sem estrada, um portal pode ficar cercado: abre a brecha mais barata (árvore/pedra < água/paredão) até a área alcançável
function linkReach(M){if(M.town)return;
 const cost=j=>!solid[j]?0:(ground[j]===G.WATER||ground[j]===G.CLIFF)?3:1;
 let mid=TC.y*W+TC.x;for(let r=0;solid[mid]&&r<20;r++)for(let dy=-r;dy<=r&&solid[mid];dy++)for(let dx=-r;dx<=r;dx++){const j=(TC.y+dy)*W+TC.x+dx;if(!solid[j]){mid=j;break;}}
 for(const s of[...Object.values(M.portals).map(p=>p[1]*W+p[0]),mid]){if(REACH[s])continue;
  const dist=new Int32Array(W*H).fill(1e9),prev=new Int32Array(W*H).fill(-1),B=[[s]];dist[s]=0;let end=-1;
  for(let d=0;d<B.length&&end<0;d++){const b=B[d];if(!b)continue;for(const i of b){if(dist[i]!==d)continue;if(REACH[i]){end=i;break;}
    const x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy;if(X<1||Y<1||X>=W-1||Y>=H-1)continue;const j=Y*W+X,nd=d+cost(j);if(nd<dist[j]){dist[j]=nd;prev[j]=i;(B[nd]||(B[nd]=[])).push(j);}}}}
  for(let i=end;i>=0;i=prev[i]){if(!solid[i])continue;const x=i%W,y=(i/W)|0,r=objRows[y];
   if(ground[i]===G.WATER)ground[i]=G.GRASS;else if(ground[i]===G.CLIFF)ground[i]=G.RAMP;
   for(let k=r.length-1;k>=0;k--)if(r[k].tx===x)r.splice(k,1);solid[i]=0;}
  computeReach(M);}}
function fixReach(M){const E=homeOf(M);
 for(let it=0;it<60;it++){const seen=new Uint8Array(W*H),q=[E[1]*W+E[0]];seen[q[0]]=1;
  while(q.length){const i=q.pop(),x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const X=x+dx,Y=y+dy,j=Y*W+X;if(X<0||Y<0||X>=W||Y>=H||seen[j]||solid[j])continue;seen[j]=1;q.push(j);}}
  let fixed=false;
  for(let i=0;i<W*H&&!fixed;i++){if(ground[i]!==G.CLIFF)continue;const x=i%W,y=(i/W)|0;
   const nb=[[0,1],[1,0],[-1,0],[0,-1]].map(([dx,dy])=>[x+dx,y+dy]).filter(([a,b])=>a>=0&&b>=0&&a<W&&b<H).map(([a,b])=>b*W+a);
   if(nb.some(j=>ground[j]===G.HIGH&&!solid[j]&&!seen[j])&&nb.some(j=>seen[j])){ground[i]=G.RAMP;solid[i]=0;fixed=true;}}
  if(!fixed)break;}}
function genWorld(id){const M=MAPS[id],z=M.theme||0,rng=mulberry32(M.seed);const n1=makeNoise(rng,10),n2=makeNoise(rng,5),nf=makeNoise(rng,3);
 ground.fill(0);solid.fill(0);BRG.fill(0);zoneMap.fill(z);for(const r of objRows)r.length=0;
 const road=new Uint8Array(W*H),amp=M.town?1.5:M.interior?0:4;
 const paint=(x,y,w=1)=>{for(let j=-w;j<=w;j++)for(let i=-w;i<=w;i++){const X=x+i,Y=y+j;if(X>0&&Y>0&&X<W-1&&Y<H-1)road[Y*W+X]=1;}};
 // praca:[x,y] = centro da praça de uma cidade que não fica no meio do mapa (Sahrem, 25: a pirâmide está no centro); as estradas partem dela.
 // via:{destino:[x,y]} = a estrada até aquele portal passa antes por esse ponto (para contornar algo, como o lago da pirâmide)
 const[HX,HY]=M.praca||[TC.x,TC.y];
 const carve=(x1,y1,wob,x0=HX,y0=HY)=>{const L=hyp(x1-x0,y1-y0)||1,st=Math.ceil(L*2),nx=-(y1-y0)/L,ny=(x1-x0)/L;for(let s=0;s<=st;s++){const t=s/st,off=Math.sin(t*Math.PI*2.5+wob)*amp*Math.sin(t*Math.PI);paint(Math.round(x0+(x1-x0)*t+nx*off),Math.round(y0+(y1-y0)*t+ny*off));}};
 // quando o mapa vizinho tem estrada, ela ainda entra alguns passos por este portal e some no mato
 const stub=(x1,y1,wob)=>{const L0=hyp(TC.x-x1,TC.y-y1)||1,dx=(TC.x-x1)/L0,dy=(TC.y-y1)/L0,L=9;
  for(let s=0;s<=L*2;s++){const t=s/2,off=Math.sin(t*.7+wob)*1.2*t/L,X=Math.round(x1+dx*t-dy*off),Y=Math.round(y1+dy*t+dx*off);if(t<4)paint(X,Y);else if(rng()<1-(t-4)/(L-4))paint(X,Y,0);}};
 for(const to in M.portals){const p=M.portals[to],wob=rng()*6;if(p[3]==='trilha')continue;if(M.road||M.interior){const v=M.via&&M.via[to];if(v){carve(v[0],v[1],wob);carve(p[0],p[1],wob,v[0],v[1]);}else carve(p[0],p[1],wob);}else if(MAPS[to]&&MAPS[to].road)stub(p[0],p[1],wob);} // interior: tapete reto da porta até o meio
 // portal com 'trilha' (ex.: a cabana da Kaya, 22): em vez da estrada até o centro, um caminho estreito da porta até a estrada mais
 // próxima fora da muralha. trail 1 = sem árvores (sempre dá para passar); 2 = chão de trilha, inteiro perto das pontas e aos pedaços no meio
 const trail=new Uint8Array(W*H),Wl=M.walls,inW=(x,y)=>Wl&&x>=Wl[0]-1&&x<=Wl[2]+1&&y>=Wl[1]-1&&y<=Wl[3]+1;
 for(const to in M.portals){const p=M.portals[to];if(p[3]!=='trilha')continue;const x1=Math.round(p[0]),y1=Math.round(p[1]);let bx=TC.x,by=TC.y,bd=1e9;
  for(let i=0;i<W*H;i++)if(road[i]){const x=i%W,y=(i/W)|0,d=hyp(x-x1,y-y1);if(d<bd&&!inW(x,y)){bd=d;bx=x;by=y;}}
  const L=hyp(bx-x1,by-y1)||1,st=Math.ceil(L*2),nx=-(by-y1)/L,ny=(bx-x1)/L,wob=rng()*6;
  for(let s=0;s<=st;s++){const t=s/st,off=Math.sin(t*Math.PI*2+wob)*2.5*Math.sin(t*Math.PI),X=Math.round(x1+(bx-x1)*t+nx*off),Y=Math.round(y1+(by-y1)*t+ny*off);
   for(const[dx,dy]of[[0,0],[1,0],[0,1]]){const j=(Y+dy)*W+X+dx;if(!trail[j])trail[j]=1;}if(Math.min(t,1-t)*L<3||rng()<.45)trail[Y*W+X]=2;}}
 const ex=Object.values(M.portals),nearP=(x,y)=>ex.some(e=>hyp(x-e[0],y-e[1])<2.6);
 const CAV=M.cave?(M.mask||caveMask)(M,rng):M.interior?roomMask(M):null; // cavernas (11) e interiores (13): chão cavado na rocha ou num cômodo; mask: outro gerador de salões (a tumba de Sahrem, 25)
 let HI=null,CLF=null,CLR=null;
 if(M.plateau){const np=makeNoise(rng,7);HI=new Uint8Array(W*H);CLF=new Uint8Array(W*H);CLR=new Uint8Array(W*H);
  for(let y=5;y<H-5;y++)for(let x=5;x<W-5;x++){const i=y*W+x;if(!road[i]&&!nearP(x,y)&&hyp(x-TC.x,y-TC.y)>4&&np(x,y)>M.plateau)HI[i]=1;}
  for(const p of ex)if(p[2]===1)for(let y=p[1]-5;y<=p[1]+5;y++)for(let x=p[0]-5;x<=p[0]+5;x++)if(x>=5&&y>=5&&x<W-5&&y<H-5&&hyp(x-p[0],(y-p[1])*1.2)<4.6)HI[y*W+x]=1;
  const hi=(x,y)=>x>=0&&y>=0&&x<W&&y<H&&HI[y*W+x];
  for(let i=0;i<W*H;i++)if(HI[i]){const x=i%W,y=(i/W)|0;if(!hi(x+1,y)||!hi(x-1,y)||!hi(x,y+1)||!hi(x,y-1))CLF[i]=1;}
  const seen=new Uint8Array(W*H);
  for(let s=0;s<W*H;s++){if(!HI[s]||seen[s])continue;const comp=[],q=[s];seen[s]=1;
   while(q.length){const i=q.pop();comp.push(i);const x=i%W,y=(i/W)|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const j=(y+dy)*W+x+dx;if(hi(x+dx,y+dy)&&!seen[j]){seen[j]=1;q.push(j);}}}
   if(comp.length<12){for(const i of comp){HI[i]=0;CLF[i]=0;}continue;}
   let cand=comp.filter(i=>{const x=i%W,y=(i/W)|0;return CLF[i]===1&&!hi(x,y+1)&&hi(x,y-1)&&hi(x-1,y)&&hi(x+1,y);});if(!cand.length)cand=comp.filter(i=>CLF[i]===1);
   const n=Math.min(cand.length,comp.length>60?2:1);
   for(let k=0;k<n;k++){const i=cand.splice(Math.floor(rng()*cand.length),1)[0];CLF[i]=2;const x=i%W,y=(i/W)|0;
    for(const[dx,dy]of[[0,1],[0,2],[-1,1],[1,1]]){const X=x+dx,Y=y+dy;if(X>0&&Y>0&&X<W&&Y<H&&!HI[Y*W+X])CLR[Y*W+X]=1;}
    if(hi(x,y-1)&&CLF[(y-1)*W+x]===1)CLF[(y-1)*W+x]=2;
    // a subida tem 3 tiles de largura onde o barranco ao lado também dá para o sul (uma abertura no morro, não uma escada)
    const sd=!hi(x,y+1)?1:!hi(x,y-1)?-1:0; // para que lado a subida desce (sul ou norte)
    if(sd)for(const dx of[-1,1]){const X=x+dx;if(CLF[y*W+X]!==1||hi(X,y+sd))continue;CLF[y*W+X]=2;if(CLF[(y-sd)*W+X]===1)CLF[(y-sd)*W+X]=2;
     for(const[ex,ey]of[[0,sd],[0,2*sd],[dx,sd]]){const j=(y+ey)*W+X+ex;if(j>=0&&j<W*H&&!HI[j])CLR[j]=1;}}}}}
 // blend:[tema de cima, tema de baixo, linha onde começa, linha onde termina]: o mapa muda de região aos poucos, com a divisa irregular
 // (ex.: a Orla do Deserto, grama virando areia, 25). Cada tile usa o tema dele (zoneMap) para chão, árvores, pedras e água
 if(M.blend){const[za,zb,y0,y1]=M.blend;for(let y=0;y<H;y++)for(let x=0;x<W;x++)zoneMap[y*W+x]=(y-y0)/(y1-y0)+(nf(x,y)-.5)*.6>.5?zb:za;}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,a=n1(x,y),b=n2(x,y),c=rng(),zt=zoneMap[i];let g=G.GRASS,obj=null;
  if(CAV){g=!CAV[i]?G.CLIFF:road[i]?G.PATH:G.GRASS;if(g===G.GRASS&&M.cave&&c<.05&&!nearP(x,y)&&caveRoom(CAV,x,y))obj=(M.caveObj||['rock','estalagmite'])[c<.018?0:1];}
  else if(HI&&HI[i]){g=CLF[i]===1?G.CLIFF:CLF[i]===2?G.RAMP:G.HIGH;if(g===G.HIGH&&c<.05&&!nearP(x,y))obj='tree';}
  else if(M.town){const d=hyp(x-HX,(y-HY)*1.3),mt=M.mata?hyp(x-M.mata[0],y-M.mata[1]):99; // mata: [x, y, raio da mata fechada, raio da clareira]
   g=d<6.5?G.PLAZA:road[i]||trail[i]===2?G.PATH:G.GRASS;if(g===G.GRASS&&d>13&&!trail[i]&&c<(M.mata&&mt<M.mata[3]?0:mt<(M.mata||[])[2]?.24:.04))obj='tree';}
  else if(road[i])g=G.PATH;
  else if(nearP(x,y)){}
  else if(CLR&&CLR[i]){}
  else if(M.lair){const d=hyp(x-TC.x,y-TC.y);if(d>10&&d<12.5&&c<.45)obj=c<.3?'pillar':'pillar2';else if(d>14&&c<.1)obj=c<.05?'rock':'tree';}
  else if(zt===1){if(a>.72)g=G.WATER;else if((b>.58&&c<.55)||c<.035)obj='tree';else if(c<.045)obj='rock';}
  else if(zt===2){if(a>.62)g=G.WATER;else if((b>.6&&c<.45)||c<.03)obj=rng()<.35?'dead':'tree';else if(c<.04)obj='rock';}
  else if(zt===11){if(a>.86)g=G.WATER;else if(b>.72&&c<.16)obj='tree';else if(c<.008)obj=rng()<.5?'pillar':'pillar2';else if(c<.028)obj='rock';} // deserto (25): pouca planta, oásis raros
  else{if(a>.78)g=G.WATER;else if(b>.62&&c<.35)obj='tree';else if(c<.03)obj=rng()<.5?'pillar':'pillar2';else if(c<.05)obj='rock';}
  if(!CAV&&(x<2||y<2||x>=W-2||y>=H-2)&&!nearP(x,y)){obj='tree';g=G.GRASS;}
  ground[i]=g;if(g===G.WATER||g===G.CLIFF)solid[i]=1;
  if(obj){solid[i]=1;addObj(x,y,obj==='tree'?`tree${zt}_${Math.floor(rng()*4)}`:obj==='rock'?rockAt(x,y,zt):obj);}}
 if(M.town){(M.houses||[[TC.x-7,TC.y+4,'house0'],[TC.x+6,TC.y+4,'house1'],[TC.x-7,TC.y-3,'house2']]).forEach(([hx,hy,s,lb])=>{ // lb: nome mostrado ao passar o mouse (só casas com função)
   // chão ocupado: 2×2 tiles para casas de 32 px; casas mais largas (ex.: a Guilda, 64 px) ocupam 4×3, com o mesmo centro
   const fw=SPR[s]?Math.max(2,Math.round(SPR[s].n.width/TILE)):2,fd=fw>2?3:2,x0=hx+1-fw/2;
   for(let dy=0;dy<fd;dy++)for(let dx=0;dx<fw;dx++){const X=x0+dx,Y=hy-dy,r=objRows[Y];for(let k=r.length-1;k>=0;k--)if(r[k].tx===X)r.splice(k,1);solid[Y*W+X]=1;}
   addObj(hx,hy,s,true,lb);});
  const[fo,fy]=M.fountain||[TC.x,TC.y];if(!M.oasis){solid[fy*W+fo]=1;addObj(fo,fy,'fountain');}if(M.lanterns)for(const[lx,ly]of[[-5,-4],[5,-4],[-5,4],[5,4],[-2,-6],[2,-6]]){const X=TC.x+lx,Y=TC.y+ly;if(solid[Y*W+X])continue;solid[Y*W+X]=1;addObj(X,Y,'lampiao');}} // lampião não nasce dentro de casa
 if(M.deco)for(const[dx,dy,s,wide]of M.deco){solid[dy*W+dx]=1;if(wide)solid[dy*W+dx+1]=1;addObj(dx,dy,s,wide);} // móveis e objetos fixos (ex.: interiores)
 if(M.clear)for(const[cx,cy]of M.clear){const r=objRows[cy];for(let k=r.length-1;k>=0;k--)if(r[k].tx===cx)r.splice(k,1);const g=ground[cy*W+cx];if(g!==G.WATER&&g!==G.CLIFF)solid[cy*W+cx]=0;} // tiles sem árvore nem pedra, escolhidos à mão
 if(M.walls)buildWalls(M,road); // muralha com portões e torres (14)
 if(M.moat)buildMoat(M,road); // fosso redondo com pontes e a Torre no centro (Arcádia, 21)
 if(M.gen)M.gen(M,road); // construções só daquela cidade (ex.: o oásis e a pirâmide de Sahrem, 25), antes do cálculo de alcance
 // cachoeiras (morros): onde o barranco do lado sul cai direto num lago, a água desce por ele, e um riacho de até 3 tiles no alto a
 // alimenta. Até 2 por mapa, nos trechos mais largos (1 ou 2 tiles). FALLS = [x0, x1, y] da fileira do barranco; o 99 anima por cima (fallsFx)
 FALLS=[];if(M.plateau){const runs=[],okF=(X,y)=>ground[y*W+X]===G.CLIFF&&ground[(y+1)*W+X]===G.WATER&&ground[(y-1)*W+X]===G.HIGH;
  for(let y=6;y<H-6;y++)for(let x=2;x<W-2;x++){if(!okF(x,y))continue;let e=x;while(okF(e+1,y))e++;runs.push([x,e,y]);x=e;}
  runs.sort((a,b)=>(b[1]-b[0])-(a[1]-a[0])||a[2]-b[2]||a[0]-b[0]);
  for(const[a,b,y]of runs){if(FALLS.length>=2)break;if(FALLS.some(f=>Math.abs(f[2]-y)<6&&Math.abs(f[0]-a)<8))continue;
   const w=Math.min(2,b-a+1),x0=a+((b-a+1-w)>>1),x1=x0+w-1;FALLS.push([x0,x1,y]);
   for(let k=1;k<=3;k++){const Y=y-k;let ok=true;for(let X=x0;X<=x1;X++)if(ground[Y*W+X]!==G.HIGH||nearP(X,Y))ok=false;if(!ok)break;
    for(let X=x0;X<=x1;X++){const j=Y*W+X;ground[j]=G.WATER;solid[j]=1;const r=objRows[Y];for(let q=r.length-1;q>=0;q--)if(r[q].tx===X)r.splice(q,1);}}}}
 if(M.plateau)fixReach(M);
 computeReach(M);linkReach(M);if(typeof abreBolsoes==="function")abreBolsoes(M); // clareiras presas ganham passagem (34)
 // pontes: trecho de estrada com água dos dois lados, atravessando a largura da estrada (até 4 tiles). Arcádia tem as pontes de pedra dela (21)
 if(!M.town&&!M.moat&&!CAV)for(let i=0;i<W*H;i++){if(ground[i]!==G.PATH)continue;const x=i%W,y=(i/W)|0;
  const wat=(dx,dy)=>{let X=x,Y=y;for(let k=0;k<5;k++){X+=dx;Y+=dy;if(X<0||Y<0||X>=W||Y>=H)return false;const g=ground[Y*W+X];if(g===G.WATER)return true;if(g!==G.PATH)return false;}return false;};
  BRG[i]=(wat(-1,0)&&wat(1,0)?1:0)|(wat(0,-1)&&wat(0,1)?2:0);}
 // cada ponte inteira tem um sentido só: 2 = atravessa de norte a sul (água dos lados), 3 = de leste a oeste
 {const sb=new Uint8Array(W*H);for(let s=0;s<W*H;s++){if(!BRG[s]||sb[s])continue;const q=[s],cm=[];sb[s]=1;let v=0;
  while(q.length){const i=q.pop();cm.push(i);v+=(BRG[i]&1)-(BRG[i]>>1&1);for(const j of[i-1,i+1,i-W,i+W])if(j>=0&&j<W*H&&BRG[j]&&!sb[j]){sb[j]=1;q.push(j);}}
  for(const i of cm)BRG[i]=v>=0?2:3;}}
 // pintura dos pixels
 const mx=mapC.getContext('2d'),img=mx.createImageData(MW,MH),D=img.data,BLD=M.blend;
 {const e=EARTHT[M.theme]||EARTH0;for(let k=0;k<5;k++)EARTH[k]=e[k];}
 const put=(X,Y,c)=>{const o=(Y*MW+X)*4;D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;};
 // platôs fora das cavernas são morros de terra, vistos de cima e um pouco de frente: barranco de terra no lado sul (com a grama
 // pendendo na borda e sombra no chão de baixo), terra fina nas laterais, só a beirada no norte e cantos de fora arredondados.
 // A entrada é uma subida de grama (rampa), sem escada. null = aquele pixel mostra o chão de baixo
 const upT=(x,y)=>{if(x<0||y<0||x>=W||y>=H)return false;const g=ground[y*W+x];return g===G.HIGH||g===G.CLIFF||g===G.RAMP;};
 // grama de cima mais clara que a de baixo, para o platô se destacar
 const hiMid={},hiM=(gp,z)=>hiMid[z]||(hiMid[z]=gp[0].map((c,i)=>(c+gp[3][i]*3)>>2));
 const highCol=(tx,ty,px,py,gp,z)=>{const v=nf(tx+px/16,ty+py/16)+(rng()-.5)*.18;return rng()<.05?gp[1]:v>.5?gp[3]:hiM(gp,z);};
 // barranco: f = linha a partir da borda (0 a 12 no tile do morro, 13 a 18 descendo sobre o chão de baixo)
 // (a grama pende 2 a 4 px na borda; a base é irregular: null = já é o chão de baixo)
 const earthCol=(px,f,h,gp)=>{const od=2+((px*5+h)%4===0)+((px*3+h)%7===0),fm=16+((px*7+h)%3===0)+((px*5+h*3)%5<2)*2;
  if(f<od)return gp[2];if(f===od||f===fm)return EARTH[3];if(f>fm)return null;if(f===fm-1)return EARTH[2];
  const r=rng();return r<.05?EARTH[4]:r<.1?EARTH[2]:(px*11+h*3)%13===0&&f<od+4?EARTH[3]:(f+((px+h)>>2)%2)%5===0?EARTH[1]:EARTH[0];};
 function cliffCol(tx,ty,px,py,z,gp){const N=!upT(tx,ty-1),S=!upT(tx,ty+1),Wo=!upT(tx-1,ty),E=!upT(tx+1,ty),h=(tx*7+ty*13)&15,R=3;
  const m=Math.min(N&&Wo?px+py:99,N&&E?15-px+py:99);
  if(m<R)return null;if(m===R)return EARTH[3];
  if(S&&py>=3){if((Wo&&px===0)||(E&&px===15))return EARTH[3];return earthCol(px,py-3,h,gp)||EARTH[3];}
  if((N&&py===0)||(Wo&&px===0)||(E&&px===15))return EARTH[3];
  if((Wo&&px===1)||(E&&px===14))return EARTH[1];
  if((N&&py===1)||(Wo&&px===2)||(E&&px===13))return gp[2];
  return highCol(tx,ty,px,py,gp,z);}
 // subida: a grama vai do tom do alto ao tom de baixo (2 tiles de rampa), e o barranco afina dos lados
 // a subida desce para o lado em que o vizinho é chão de baixo (quase sempre o sul); no meio dela, uma trilha de terra batida
 function rampCol(i,tx,ty,px,py,z,gp){const R_=G.RAMP,dS=!upT(tx,ty+1)||ground[i+W]===R_&&!upT(tx,ty+2),dN=!dS&&(!upT(tx,ty-1)||ground[i-W]===R_&&!upT(tx,ty-2));
  const vert=dS||dN,a=vert?py:px,far=vert?(dS?ground[i+W]===R_:ground[i-W]===R_):false,s=(dN?15-a:a)+(far?0:16);
  const t=s/31+(rng()-.5)*.22;let col=t<.3?gp[3]:t<.55?hiM(gp,z):t<.8?gp[1]:gp[0];if(rng()<.05)col=gp[2];
  // trilha de terra no meio da abertura inteira (conta quantos tiles de subida há de cada lado)
  let nl=0,nr=0;while(nl<4&&ground[i-nl-1]===R_)nl++;while(nr<4&&ground[i+nr+1]===R_)nr++;
  const pc=PCr[z],q=Math.abs(px-7.5-(nr-nl)*8);if(vert&&q<3.5+(rng()<.5))col=rng()<.15?pc[1]:pc[0];
  const lw=ground[i-1]===G.CLIFF,rw=ground[i+1]===G.CLIFF,wd=Math.max(0,((dN?py:15-py)/5|0)-(far?0:2));
  if(vert&&lw&&px<=wd)col=px===wd?EARTH[3]:EARTH[0];else if(vert&&rw&&15-px<=wd)col=15-px===wd?EARTH[3]:EARTH[0];return col;}
 // ponte de madeira (BRG): tábuas atravessadas, corrimão com postes nos lados de fora e a água aparecendo na borda, com sombra.
 // O sentido vem de BRG (2 = norte a sul, 3 = leste a oeste); a estrada pode ter 2 ou 3 tiles de largura
 const PWOOD=['#b8875a','#9a6e44','#6e4a2c','#4a301c'].map(hexRGB),KR=hexRGB(K);
 function bridgeCol(i,px,py,z,gp){const vt=BRG[i]===2,a=vt?px:py,b=vt?py:px,d=vt?1:W,e=vt?W:1,lo=!BRG[i-d],hi=!BRG[i+d],w=WCr[z];
  const side=(lo&&a<=1)||(hi&&a>=14);if(side){const j=a<=1?i-d:i+d;if(ground[j]!==G.WATER)return ground[j]===G.PATH?PCr[z][0]:gp[0];return a===14||a===15?w[0].map(v=>v*.72|0):w[0];}
  // ponta que dá para a água: borda escura e sombra na tábua
  if((b===0&&ground[i-e]===G.WATER)||(b===15&&ground[i+e]===G.WATER))return KR;if(b===14&&ground[i+e]===G.WATER)return PWOOD[3];
  if((lo&&a===2)||(hi&&a===13))return KR;
  if((lo&&a===3)||(hi&&a===12))return b%8<2?PWOOD[0]:b%8===2?KR:PWOOD[2];
  if(b%4===3)return PWOOD[3];if((a===5||a===10)&&b%4===1)return PWOOD[3];
  const pl=((b>>2)+(vt?i/W|0:i%W)*4)&1;return rng()<.08?PWOOD[2]:pl?PWOOD[0]:PWOOD[1];}
 // cachoeira (FALLS): a água desce pelo barranco em faixas verticais, mais clara na borda de cima; py vai até 21 (desce sobre o lago)
 const isFall=(tx,ty)=>FALLS.some(f=>ty===f[2]&&tx>=f[0]&&tx<=f[1]);
 function fallCol(tx,ty,px,py,z){const w=WCr[z],eL=!isFall(tx-1,ty)&&px===0,eR=!isFall(tx+1,ty)&&px===15;if(eL||eR)return EARTH[3];
  if(py<2)return w[0];if(py<4)return rng()<.6?w[2]:w[1];const s=(px+tx*16)%5;return s===0?w[2]:s===2?w[1]:rng()<.1?w[1]:w[0];}
 // a trilha da subida continua 2 tiles no chão de baixo e 2 no alto, sumindo aos poucos (HT: centro da trilha em px, HS: distância)
 const HT=new Int8Array(W*H).fill(-99),HS=new Uint8Array(W*H);
 if(M.plateau)for(let i=W;i<W*(H-1);i++){if(ground[i]!==G.RAMP)continue;const tx=i%W,ty=(i/W)|0,sd=!upT(tx,ty+1)?1:!upT(tx,ty-1)?-1:0;if(!sd)continue;
  let nl=0,nr=0;while(nl<4&&ground[i-nl-1]===G.RAMP)nl++;while(nr<4&&ground[i+nr+1]===G.RAMP)nr++;if(nl!==((nl+nr)>>1))continue;
  const off=(nr-nl)*8;let top=ty;while(ground[(top-sd)*W+tx]===G.RAMP)top-=sd;
  for(const[cx,o]of off>0?[[tx,off],[tx+1,off-16]]:[[tx,off]])
   for(const[y,d]of[[ty+sd,1],[ty+2*sd,2],[top-sd,1],[top-2*sd,2]]){if(y<0||y>=H)continue;const j=y*W+cx;if(ground[j]===G.RAMP)continue;HT[j]=o;HS[j]=d;}}
 const edge=(tx,ty,px,py,t)=>{let d=99;const gt=(x,y)=>(x<0||y<0||x>=W||y>=H)?t:ground[y*W+x];if(gt(tx-1,ty)!==t)d=Math.min(d,px);if(gt(tx+1,ty)!==t)d=Math.min(d,15-px);if(gt(tx,ty-1)!==t)d=Math.min(d,py);if(gt(tx,ty+1)!==t)d=Math.min(d,15-py);return d;};
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const i=ty*W+tx,g=ground[i],z=zoneMap[i];
  for(let py=0;py<16;py++)for(let px=0;px<16;px++){const X=tx*16+px,Y=ty*16+py;let col,gp=GPr[z];
   if(BLD&&g===G.GRASS){const zz=(ty+py/16-BLD[2])/(BLD[3]-BLD[2])+(nf(tx+px/16,ty+py/16)-.5)*.6>.5?BLD[1]:BLD[0];gp=GPr[zz];} // divisa irregular pixel a pixel (blend)
   if(g===G.GRASS){const v=nf(tx+px/16,ty+py/16)+(rng()-.5)*.18;col=v>.55?gp[1]:gp[0];const r=rng();if(r<.08)col=gp[2];else if(r<.12)col=gp[3];
    if(z===8){const row=Math.floor(Y/6),seam=Y%6===0||(X+row*11)%29===0;col=seam?gp[2]:row%2?gp[0]:gp[1];if(!seam&&rng()<.04)col=gp[3];}
    if(z===10){const row=Math.floor(Y/8),seam=Y%8===0||(X+(row%2)*8)%16===0;col=seam?gp[2]:(X>>4)%2^row%2?gp[0]:gp[1];if(!seam&&rng()<.05)col=gp[3];} // lajes de pedra (Torre de Arcádia, 21)
    if(z===12){const row=Math.floor(Y/8),seam=Y%8===0||(X+(row%2)*8)%16===0;col=seam?gp[2]:(X*3+Y*5)%37===0?gp[3]:row%3===1?gp[1]:gp[0];} // lajes de arenito (tumba de Sahrem, 25)
    if(z===4){const w=n2(tx+px/16,ty+py/16);if(Math.abs(w-.5)<.016)col=[255,110,30];else if(Math.abs(w-.5)<.03)col=[150,48,20];}}
   else if(g===G.PATH&&BRG[i])col=bridgeCol(i,px,py,z,gp);
   else if(g===G.PATH){const p=PCr[z];const r=rng();col=r<.12?p[1]:r<.18?p[2]:p[0];const e=edge(tx,ty,px,py,g);if(e<3&&rng()<(3-e)/4)col=gp[0];}
   else if(g===G.HIGH)col=highCol(tx,ty,px,py,gp,z);
   else if(g===G.CLIFF&&!CAV&&isFall(tx,ty))col=fallCol(tx,ty,px,py,z);
   else if(g===G.CLIFF&&!CAV){col=cliffCol(tx,ty,px,py,z,gp);if(!col)col=gp[0];}
   else if(g===G.RAMP&&!CAV)col=rampCol(i,tx,ty,px,py,z,gp);
   else if(g===G.CLIFF){const gb=ty+1<H?ground[(ty+1)*W+tx]:0,sb=gb!==G.HIGH&&gb!==G.CLIFF&&gb!==G.RAMP,cc=CLFT[z]||CLF_C;
    if(CAV&&!sb&&deepRock(tx,ty))col=rng()<.1?cc[5]:cc[6];
    else if(sb&&py>=4){col=(px%5===0||rng()<.08)?cc[1]:cc[0];if(py>=14)col=cc[2];}else{col=rng()<.15?cc[3]:cc[4];if(sb&&py>=3)col=cc[3];}}
   else if(g===G.RAMP){const cc=CLFT[z]||CLF_C;col=(py%4<2)?cc[4]:cc[1];if(px<2||px>13)col=cc[0];}
   else if(g===G.PLAZA){const row=Math.floor(Y/5),mort=Y%5===0||(X+(row%2)*4)%9===0;const pz=PLZT[z]||PLZ;col=mort?pz[1]:(rng()<.1?pz[2]:pz[0]);const e=edge(tx,ty,px,py,g);if(e<2&&rng()<.5)col=gp[0];}
   else{const w=WCr[z];col=w[0];if(((X+Y*3)>>2)%9===0&&rng()<.35)col=w[1];const e=edge(tx,ty,px,py,g);if(e<1)col=w[2];else if(e<3&&rng()<.5)col=w[1];}
   if(HT[i]>-99&&(g===G.GRASS||g===G.HIGH)){const q=Math.abs(px-7.5-HT[i]);if(q<3.6-HS[i]*.6&&rng()<1.15-HS[i]*.3)col=rng()<.15?PCr[z][1]:PCr[z][0];}
   // sombra do platô no chão logo abaixo do paredão (e um pouco à direita dele)
   if(M.plateau&&!upT(tx,ty)){const fa=ty>0&&ground[i-W]===G.CLIFF;
    if(fa&&isFall(tx,ty-1)){if(py<6)col=fallCol(tx,ty-1,px,py+16,z);else if(py<10&&rng()<.75-(py-6)*.15)col=rng()<.5?WCr[z][2]:[236,246,255];put(X,Y,col);continue;}
    const ec=fa&&py<7?earthCol(px,py+13,((tx*7+(ty-1)*13)&15),gp):null;
    if(ec){const wo=!upT(tx-1,ty-1),eo=!upT(tx+1,ty-1);col=(wo&&px===0)||(eo&&px===15)?EARTH[3]:ec;}
    else if((fa&&py<10)||(px<2&&upT(tx-1,ty)&&ground[i-1]!==G.RAMP))col=col.map(v=>v*.62|0);}
   put(X,Y,col);}}
 mx.putImageData(img,0,0);
 // decoração
 for(let ty=1;ty<H-1;ty++)for(let tx=1;tx<W-1;tx++){const i=ty*W+tx;if(solid[i])continue;const g=ground[i],z=zoneMap[i],X=tx*16,Y=ty*16,r=rng();
  if(g===G.GRASS&&(z<=1)){if(r<.05){const fc=pick(['#ffd84a','#ff6b8a','#ffffff','#b98cff']);const ox=X+ri(3,11),oy=Y+ri(3,11);mx.fillStyle=fc;mx.fillRect(ox-1,oy,3,1);mx.fillRect(ox,oy-1,1,3);mx.fillStyle='#ffe98a';mx.fillRect(ox,oy,1,1);}
   else if(r<.2){mx.fillStyle='#3a7a34';const ox=X+ri(2,12),oy=Y+ri(4,13);mx.fillRect(ox,oy,1,2);mx.fillRect(ox+2,oy,1,2);mx.fillRect(ox+1,oy-1,1,3);}}
  else if(g===G.GRASS&&z===2&&r<.05){const ox=X+ri(4,10),oy=Y+ri(5,11);mx.fillStyle='#e8e0d0';mx.fillRect(ox+1,oy+2,2,2);mx.fillStyle='#c0303a';mx.fillRect(ox,oy,4,2);mx.fillStyle='#fff';mx.fillRect(ox+1,oy,1,1);}
  else if(g===G.GRASS&&z===7&&r<.06){const ox=X+ri(3,11),oy=Y+ri(4,12);if(r<.02){mx.fillStyle='#d8d0bc';mx.fillRect(ox,oy,4,1);mx.fillRect(ox,oy-1,1,3);mx.fillRect(ox+3,oy-1,1,3);}else{mx.fillStyle='#6a5d52';mx.fillRect(ox,oy,2,1);mx.fillStyle='#2a2320';mx.fillRect(ox,oy+1,2,1);}}
  else if(g===G.GRASS&&z>=5&&z<=6&&r<.08){if(r<.03){mx.fillStyle='#8a8a86';const ox=X+ri(3,11),oy=Y+ri(5,12);mx.fillRect(ox,oy,3,2);mx.fillStyle='#b0b0aa';mx.fillRect(ox,oy,2,1);}else{mx.fillStyle='#2f6a36';const ox=X+ri(2,12),oy=Y+ri(4,13);mx.fillRect(ox,oy,1,2);mx.fillRect(ox+2,oy,1,2);mx.fillRect(ox+1,oy-1,1,3);}}
  else if(g===G.GRASS&&z>=3&&z<=4&&r<.04){mx.fillStyle='#ddd6c0';const ox=X+ri(3,11),oy=Y+ri(4,12);mx.fillRect(ox,oy,4,1);mx.fillRect(ox,oy-1,1,3);mx.fillRect(ox+3,oy-1,1,3);}
  else if(g===G.GRASS&&z===11&&r<.07){const ox=X+ri(2,12),oy=Y+ri(4,13); // deserto (25): tufo seco ou pedrinha e marcas de vento na areia
   if(r<.025){mx.fillStyle='#9a8a4a';mx.fillRect(ox,oy,1,2);mx.fillRect(ox+2,oy,1,2);mx.fillRect(ox+1,oy-1,1,3);mx.fillStyle='#7a6a3a';mx.fillRect(ox+1,oy+1,1,1);}
   else if(r<.04){mx.fillStyle='#a8906a';mx.fillRect(ox,oy,2,1);mx.fillStyle='#e8d4a4';mx.fillRect(ox,oy-1,1,1);}else{mx.fillStyle='#c4a468';mx.fillRect(ox,oy,5,1);mx.fillRect(ox+1,oy-1,3,1);}}
 }
 if(M.moat||M.circulo)paintMoat(M,mx); // pontes de pedra e runas pintadas no chão; círculo mágico do salão da Torre (21)
 // minimapa base
 const mc=miniBase.getContext('2d'),mi=mc.createImageData(W,H);
 for(let i=0;i<W*H;i++){const z=zoneMap[i],g=ground[i];let c=g===G.CLIFF?(CAV?[14,11,10]:EARTH[1]):g===G.RAMP?(CAV?CLF_C[4]:GPr[z][3]):g===G.HIGH?GPr[z][3]:solid[i]&&g!==G.WATER?hexRGB(MINIC.obj[z]):g===G.WATER?WCr[z][0]:g===G.PATH?PCr[z][0]:g===G.PLAZA?PLZ[0]:GPr[z][0];mi.data.set([c[0],c[1],c[2],255],i*4);}
 mc.putImageData(mi,0,0);
}
genWorld('valdor');
// animação das cachoeiras (chamada pelo render do 99, logo depois do chão): faixas claras descendo pelo barranco, espuma no lago e névoa
function fallsFx(tt){for(const[x0,x1,y]of FALLS){const X=x0*TILE,Y=y*TILE+3,w=(x1-x0+1)*TILE,h=TILE+3;
  ctx.fillStyle='rgba(255,255,255,.45)';for(let c=X+2;c<X+w-2;c+=3){const o=(tt*46+c*7.3)%(h+6)-6,a=Math.max(Y,Y+o),b=Math.min(Y+h,Y+o+5);if(b>a)ctx.fillRect(c,a,1,b-a);}
  ctx.fillStyle='rgba(240,250,255,.75)';for(let k=0;k<w/3;k++)ctx.fillRect((X+R()*w)|0,(Y+h+3+R()*4)|0,2,1);
  if(R()<.15)parts.push({x:X+R()*w,y:Y+h+4,vx:rf(-6,6),vy:rf(-12,-4),g:0,life:.7,max:.7,color:'#e8f6ff',s:1});}}
