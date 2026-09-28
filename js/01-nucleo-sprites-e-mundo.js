// Ecos de Valdoria — Utilidades, sprites em pixel art, gerador de mapas e terreno
'use strict';
const $=id=>document.getElementById(id);
const TILE=16,W=80,H=60,MW=W*TILE,MH=H*TILE;
const TC={x:40,y:30},LAIR=TC;
const K='#1b1320',SAVEKEY='valdoria_save_v1';
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
function genTree(p,rng){const c=cnv(16,24),x=c.getContext('2d');
 for(let y=14;y<23;y++)for(let i=6;i<10;i++){x.fillStyle=(i===6||i===9)?K:(i===7?p.t1:p.t2);x.fillRect(i,y,1,1);}
 x.fillStyle=K;x.fillRect(5,23,6,1);
 for(let y=0;y<17;y++)for(let i=0;i<16;i++){const dx=i-7.5,dy=(y-8)*1.05,d=hyp(dx,dy)+(rng()-.5)*.9;
  if(d<7.4){let col;if(d>6.3)col=K;else{const s=dx*.7+dy;col=s<-3.2?p.l:s>2.8?p.d:p.m;if(rng()<.1)col=rng()<.5?p.d:p.l;}x.fillStyle=col;x.fillRect(i,y,1,1);}}
 return c;}
const TPAL={0:{l:'#8fdc72',m:'#56a84a',d:'#2f6e34',t1:'#8a5a32',t2:'#6a4224'},1:{l:'#7fd06a',m:'#4a9a42',d:'#2a6430',t1:'#8a5a32',t2:'#6a4224'},2:{l:'#7a8f4a',m:'#566b36',d:'#384826',t1:'#5e4a36',t2:'#43352a'},3:{l:'#e0a040',m:'#b86a2a',d:'#7a3a1c',t1:'#6a4a32',t2:'#4a3222'},4:{l:'#6a4a3a',m:'#4a3228',d:'#2a1c16',t1:'#3a2a22',t2:'#2a1e18'}};
{const rng=mulberry32(4242);for(let z=0;z<5;z++)for(let v=0;v<4;v++)reg(`tree${z}_${v}`,genTree(TPAL[z],rng));}
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
const objRows=Array.from({length:H},()=>[]);
function makeNoise(rng,sp){const gw=Math.ceil(W/sp)+3,gh=Math.ceil(H/sp)+3;const g=new Float32Array(gw*gh);for(let i=0;i<g.length;i++)g[i]=rng();
 return(x,y)=>{const fx=x/sp,fy=y/sp,ix=Math.floor(fx),iy=Math.floor(fy),tx=fx-ix,ty=fy-iy,sx=tx*tx*(3-2*tx),sy=ty*ty*(3-2*ty);const a=g[iy*gw+ix],b=g[iy*gw+ix+1],c=g[(iy+1)*gw+ix],d=g[(iy+1)*gw+ix+1];return a+(b-a)*sx+(c-a)*sy+(a-b-c+d)*sx*sy;};}
function addObj(tx,ty,spr,wide){objRows[ty].push({tx,ty,spr,px:(tx+(wide?1:.5))*TILE,py:(ty+1)*TILE});}
const hexRGB=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const GP={5:['#4a8a50','#43804a','#386b3e','#62a066'],6:['#52925a','#4b8852','#3e7446','#6aaa6e'],0:['#5aa74e','#529c47','#468b3e','#78c865'],1:['#4f9a45','#57a34b','#437f3a','#6cbd5a'],2:['#4a6a3c','#43613a','#384f30','#5f8250'],3:['#7a7358','#847c5f','#665f49','#968d6c'],4:['#3b2b27','#43302b','#2f221f','#55403a']};
const PC={5:['#a08a68','#907a5a','#b09a78'],6:['#a08a68','#907a5a','#b09a78'],0:['#b89a62','#a88b55','#c9ad74'],1:['#b89a62','#a88b55','#c9ad74'],2:['#8a7a55','#7c6c4a','#9c8c66'],3:['#9a8a70','#8a7a60','#aa9a80'],4:['#5a4238','#4a342c','#6a5044']};
const WC={5:['#3a78a8','#4a88b8','#a0d0f0'],6:['#3a78a8','#4a88b8','#a0d0f0'],0:['#2f6fb0','#3b82c4','#9cd0f2'],1:['#2f6fb0','#3b82c4','#9cd0f2'],2:['#2c4a45','#35574f','#6f9a7e'],3:['#3a5f80','#44708f','#9ab8cc'],4:['#2a1a1a','#3a2222','#6a3a2a']};
const toRGB=o=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,v.map(hexRGB)]));
const GPr=toRGB(GP),PCr=toRGB(PC),WCr=toRGB(WC),PLZ=['#8d8778','#6d685c','#a09a8a'].map(hexRGB);
const mapC=cnv(MW,MH),miniBase=cnv(W,H);
const MINIC={obj:['#2f6e34','#2a6430','#384826','#7a3a1c','#2a1c16','#244a2c','#285030']};
const CLF_C=['#6f6a60','#4f4a42','#35312c','#9a9488','#86806f'].map(hexRGB),CLFT={}; // CLFT[tema]: cores de paredão próprias (a caverna usa)
let CUR='valdor';
const MAPS={
 // portals: {destino: [tx, ty, noPlatô?]} • road: estrada até cada portal • home: portal de onde o nível cresce
 valdor:{n:'Vila de Valdor',s:'Zona segura • mercador, mentora e fonte de cura',town:1,road:1,theme:0,seed:101,color:'#3a5a2a',portals:{floresta:[1,20],pantano:[78,42],estrada:[48,58]}},
 floresta:{n:'Floresta Verdejante',s:'Nível 1 a 9',theme:1,seed:202,color:'#2f5a2a',lv:[1,9],home:'valdor',portals:{valdor:[78,20]},count:30,chests:8},
 pantano:{n:'Pântano Sombrio',s:'Nível 9 a 16',theme:2,seed:303,color:'#23352c',lv:[9,16],home:'valdor',portals:{valdor:[1,42],ruinas:[78,12]},count:28,chests:7},
 ruinas:{n:'Ruínas Esquecidas',s:'Nível 16 a 20',theme:3,seed:404,color:'#5a4a30',lv:[16,20],home:'pantano',portals:{pantano:[1,12],covil:[58,8]},count:26,chests:7},
 covil:{n:'Covil do Wyrm',s:'Chefe • nível 22',theme:4,seed:505,color:'#4a1a14',lv:[22,22],home:'ruinas',portals:{ruinas:[24,56]},boss:'wyrm',lair:1,chests:0},
 estrada:{n:'Estrada do Sul',s:'Nível 2 a 6',road:1,theme:1,seed:606,color:'#2f5a2a',lv:[2,6],home:'valdor',portals:{valdor:[48,1],pinheiral:[32,58]},count:18,chests:4,tier:1,mons:[['slime',.45],['esquilo',.8],['esporinho',1]]},
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
 ground.fill(0);solid.fill(0);zoneMap.fill(z);for(const r of objRows)r.length=0;
 const road=new Uint8Array(W*H),amp=M.town?1.5:M.interior?0:4;
 const paint=(x,y,w=1)=>{for(let j=-w;j<=w;j++)for(let i=-w;i<=w;i++){const X=x+i,Y=y+j;if(X>0&&Y>0&&X<W-1&&Y<H-1)road[Y*W+X]=1;}};
 const carve=(x1,y1,wob)=>{const x0=TC.x,y0=TC.y,L=hyp(x1-x0,y1-y0)||1,st=Math.ceil(L*2),nx=-(y1-y0)/L,ny=(x1-x0)/L;for(let s=0;s<=st;s++){const t=s/st,off=Math.sin(t*Math.PI*2.5+wob)*amp*Math.sin(t*Math.PI);paint(Math.round(x0+(x1-x0)*t+nx*off),Math.round(y0+(y1-y0)*t+ny*off));}};
 // quando o mapa vizinho tem estrada, ela ainda entra alguns passos por este portal e some no mato
 const stub=(x1,y1,wob)=>{const L0=hyp(TC.x-x1,TC.y-y1)||1,dx=(TC.x-x1)/L0,dy=(TC.y-y1)/L0,L=9;
  for(let s=0;s<=L*2;s++){const t=s/2,off=Math.sin(t*.7+wob)*1.2*t/L,X=Math.round(x1+dx*t-dy*off),Y=Math.round(y1+dy*t+dx*off);if(t<4)paint(X,Y);else if(rng()<1-(t-4)/(L-4))paint(X,Y,0);}};
 for(const to in M.portals){const p=M.portals[to],wob=rng()*6;if(M.road||M.interior)carve(p[0],p[1],wob);else if(MAPS[to]&&MAPS[to].road)stub(p[0],p[1],wob);} // interior: tapete reto da porta até o meio
 const ex=Object.values(M.portals),nearP=(x,y)=>ex.some(e=>hyp(x-e[0],y-e[1])<2.6);
 const CAV=M.cave?caveMask(M,rng):M.interior?roomMask(M):null; // cavernas (11) e interiores (13): chão cavado na rocha ou num cômodo
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
    if(hi(x,y-1)&&CLF[(y-1)*W+x]===1)CLF[(y-1)*W+x]=2;}}}
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x,a=n1(x,y),b=n2(x,y),c=rng();let g=G.GRASS,obj=null;
  if(CAV){g=!CAV[i]?G.CLIFF:road[i]?G.PATH:G.GRASS;if(g===G.GRASS&&M.cave&&c<.05&&!nearP(x,y)&&caveRoom(CAV,x,y))obj=c<.018?'rock':'estalagmite';}
  else if(HI&&HI[i]){g=CLF[i]===1?G.CLIFF:CLF[i]===2?G.RAMP:G.HIGH;if(g===G.HIGH&&c<.05&&!nearP(x,y))obj='tree';}
  else if(M.town){const d=hyp(x-TC.x,(y-TC.y)*1.3);g=d<6.5?G.PLAZA:road[i]?G.PATH:G.GRASS;if(g===G.GRASS&&d>13&&c<.04)obj='tree';}
  else if(road[i])g=G.PATH;
  else if(nearP(x,y)){}
  else if(CLR&&CLR[i]){}
  else if(M.lair){const d=hyp(x-TC.x,y-TC.y);if(d>10&&d<12.5&&c<.45)obj=c<.3?'pillar':'pillar2';else if(d>14&&c<.1)obj=c<.05?'rock':'tree';}
  else if(z===1){if(a>.72)g=G.WATER;else if((b>.58&&c<.55)||c<.035)obj='tree';else if(c<.045)obj='rock';}
  else if(z===2){if(a>.62)g=G.WATER;else if((b>.6&&c<.45)||c<.03)obj=rng()<.35?'dead':'tree';else if(c<.04)obj='rock';}
  else{if(a>.78)g=G.WATER;else if(b>.62&&c<.35)obj='tree';else if(c<.03)obj=rng()<.5?'pillar':'pillar2';else if(c<.05)obj='rock';}
  if(!CAV&&(x<2||y<2||x>=W-2||y>=H-2)&&!nearP(x,y)){obj='tree';g=G.GRASS;}
  ground[i]=g;if(g===G.WATER||g===G.CLIFF)solid[i]=1;
  if(obj){solid[i]=1;addObj(x,y,obj==='tree'?`tree${z}_${Math.floor(rng()*4)}`:obj);}}
 if(M.town){(M.houses||[[TC.x-7,TC.y+4,'house0'],[TC.x+6,TC.y+4,'house1'],[TC.x-7,TC.y-3,'house2']]).forEach(([hx,hy,s])=>{for(const[dx,dy]of[[0,0],[1,0],[0,-1],[1,-1]])solid[(hy+dy)*W+hx+dx]=1;addObj(hx,hy,s,true);});
  solid[TC.y*W+TC.x]=1;addObj(TC.x,TC.y,'fountain');if(M.lanterns)for(const[lx,ly]of[[-5,-4],[5,-4],[-5,4],[5,4],[-2,-6],[2,-6]]){const X=TC.x+lx,Y=TC.y+ly;solid[Y*W+X]=1;addObj(X,Y,'lampiao');}}
 if(M.deco)for(const[dx,dy,s,wide]of M.deco){solid[dy*W+dx]=1;if(wide)solid[dy*W+dx+1]=1;addObj(dx,dy,s,wide);} // móveis e objetos fixos (ex.: interiores)
 if(M.plateau)fixReach(M);
 computeReach(M);linkReach(M);
 // pintura dos pixels
 const mx=mapC.getContext('2d'),img=mx.createImageData(MW,MH),D=img.data;
 const put=(X,Y,c)=>{const o=(Y*MW+X)*4;D[o]=c[0];D[o+1]=c[1];D[o+2]=c[2];D[o+3]=255;};
 const edge=(tx,ty,px,py,t)=>{let d=99;const gt=(x,y)=>(x<0||y<0||x>=W||y>=H)?t:ground[y*W+x];if(gt(tx-1,ty)!==t)d=Math.min(d,px);if(gt(tx+1,ty)!==t)d=Math.min(d,15-px);if(gt(tx,ty-1)!==t)d=Math.min(d,py);if(gt(tx,ty+1)!==t)d=Math.min(d,15-py);return d;};
 for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const i=ty*W+tx,g=ground[i],z=zoneMap[i];
  for(let py=0;py<16;py++)for(let px=0;px<16;px++){const X=tx*16+px,Y=ty*16+py;let col;const gp=GPr[z];
   if(g===G.GRASS){const v=nf(tx+px/16,ty+py/16)+(rng()-.5)*.18;col=v>.55?gp[1]:gp[0];const r=rng();if(r<.08)col=gp[2];else if(r<.12)col=gp[3];
    if(z===8){const row=Math.floor(Y/6),seam=Y%6===0||(X+row*11)%29===0;col=seam?gp[2]:row%2?gp[0]:gp[1];if(!seam&&rng()<.04)col=gp[3];}
    if(z===4){const w=n2(tx+px/16,ty+py/16);if(Math.abs(w-.5)<.016)col=[255,110,30];else if(Math.abs(w-.5)<.03)col=[150,48,20];}}
   else if(g===G.PATH){const p=PCr[z];const r=rng();col=r<.12?p[1]:r<.18?p[2]:p[0];const e=edge(tx,ty,px,py,g);if(e<3&&rng()<(3-e)/4)col=gp[0];}
   else if(g===G.HIGH){const v=nf(tx+px/16,ty+py/16)+(rng()-.5)*.18;col=v>.5?gp[3]:gp[1];if(rng()<.06)col=gp[2];}
   else if(g===G.CLIFF){const gb=ty+1<H?ground[(ty+1)*W+tx]:0,sb=gb!==G.HIGH&&gb!==G.CLIFF&&gb!==G.RAMP,cc=CLFT[z]||CLF_C;
    if(CAV&&!sb&&deepRock(tx,ty))col=rng()<.1?cc[5]:cc[6];
    else if(sb&&py>=4){col=(px%5===0||rng()<.08)?cc[1]:cc[0];if(py>=14)col=cc[2];}else{col=rng()<.15?cc[3]:cc[4];if(sb&&py>=3)col=cc[3];}}
   else if(g===G.RAMP){const cc=CLFT[z]||CLF_C;col=(py%4<2)?cc[4]:cc[1];if(px<2||px>13)col=cc[0];}
   else if(g===G.PLAZA){const row=Math.floor(Y/5),mort=Y%5===0||(X+(row%2)*4)%9===0;col=mort?PLZ[1]:(rng()<.1?PLZ[2]:PLZ[0]);const e=edge(tx,ty,px,py,g);if(e<2&&rng()<.5)col=gp[0];}
   else{const w=WCr[z];col=w[0];if(((X+Y*3)>>2)%9===0&&rng()<.35)col=w[1];const e=edge(tx,ty,px,py,g);if(e<1)col=w[2];else if(e<3&&rng()<.5)col=w[1];}
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
 }
 // minimapa base
 const mc=miniBase.getContext('2d'),mi=mc.createImageData(W,H);
 for(let i=0;i<W*H;i++){const z=zoneMap[i],g=ground[i];let c=g===G.CLIFF?(CAV?[14,11,10]:CLF_C[1]):g===G.RAMP?CLF_C[4]:g===G.HIGH?GPr[z][3]:solid[i]&&g!==G.WATER?hexRGB(MINIC.obj[z]):g===G.WATER?WCr[z][0]:g===G.PATH?PCr[z][0]:g===G.PLAZA?PLZ[0]:GPr[z][0];mi.data.set([c[0],c[1],c[2],255],i*4);}
 mc.putImageData(mi,0,0);
}
genWorld('valdor');
