// Ecos de Valdoria — Casas com interior: a casa da Mestra Elara (e, a seguir, o ferreiro)
'use strict';
// ================== SPRITES ==================
// casa com placa: o símbolo na placa diz o que tem lá dentro (o nome só aparece com o mouse)
function signHouse(roof,roofD,board,sym){const g=genHouse(roof,roofD),x=g.getContext('2d'),f=(c,a,b,w,h)=>{x.fillStyle=c;x.fillRect(a,b,w,h);};
 f(K,10,14,12,7);f(board,11,15,10,5);f('#00000033',11,19,10,1);sym(f);return g;}
reg('casaElara',signHouse('#6a8a3a','#4a6a24','#5a3a7a',f=>{f('#ffe070',15,15,2,5);f('#ffe070',13,17,6,1);f('#ffe070',14,16,4,3);f('#fff8c0',15,17,2,1);}));
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // estante de livros e a mesa com bola de cristal da Elara
 reg('estante',box(16,26,f=>{f(K,1,0,14,26);f('#6a4222',2,1,12,24);for(const y of[2,9,16]){f('#3a2414',3,y,10,6);
  for(let i=0;i<5;i++)f(['#b8423a','#3a6ab8','#6a8a3a','#c8a030','#7a4ab0'][(i+y)%5],3+i*2,y+1+(i%2),2,5-(i%2));f('#8a5a30',2,y+6,12,1);}}));
 reg('mesaCristal',box(32,22,f=>{f(K,2,9,28,7);f('#5a3a7a',3,10,26,5);f('#7a5a9a',3,10,26,1);f('#e8b43c',3,14,26,1);f(K,5,16,3,6);f('#4a2a5a',6,16,1,6);f(K,24,16,3,6);f('#4a2a5a',25,16,1,6);
  f(K,12,0,8,10);f('#7ae0ff',13,1,6,7);f('#d8f8ff',14,2,2,2);f('#3ab0d8',16,5,3,2);f(K,11,8,10,2);f('#c8a030',12,8,8,1);
  f('#f4ecd8',5,6,2,4);f('#ffd24a',5,5,2,1);f('#f4ecd8',25,6,2,4);f('#ffd24a',25,5,2,1);}));}

// ================== CASAS COM INTERIOR ==================
// Troca o sprite da casa em at=[tx,ty], põe a porta embaixo dela e cria o cômodo (room=[largura,altura]) com a porta de volta.
function houseInterior({id,city,at,sprite,name,room,deco,seed,extra}){const C=MAPS[city],[hx,hy]=at;
 C.houses=(C.houses||[]).filter(h=>!(h[0]===hx&&h[1]===hy)).concat([[hx,hy,sprite,name]]);
 C.portals[id]=[hx+.5,hy+1,'porta'];
 MAPS[id]=Object.assign({n:name,s:'',interior:1,city,theme:8,seed,color:'#2a1c12',home:city,room,portals:{[city]:[TC.x,TC.y+(room[1]>>1),'porta']},deco},extra);}

// A Mestra Elara atende na casa verde, à esquerda da praça de Valdor (em Pinheiral ela continua na praça).
// mentorAt: onde a Elara fica neste mapa; null = não fica aqui (08 usa isso ao trocar de mapa).
houseInterior({id:'casaElara',city:'valdor',at:[TC.x-7,TC.y-3],sprite:'casaElara',name:'Casa da Mestra Elara',room:[12,8],seed:1011,
 deco:[[TC.x-5,TC.y-4,'estante'],[TC.x-4,TC.y-4,'estante'],[TC.x+3,TC.y-4,'estante'],[TC.x+4,TC.y-4,'estante'],[TC.x-1,TC.y-4,'mesaCristal',1]],
 extra:{s:'Mentora de todas as classes',mentorAt:[TC.x,TC.y-2]}});
MAPS.valdor.mentorAt=null;
// o mapa inicial (Valdor) não passa por switchMapNow num herói novo: tira a Elara da praça já no carregamento
if(MAPS[CUR].mentorAt===null){MENTOR.x=-9999;MENTOR.y=-9999;}
