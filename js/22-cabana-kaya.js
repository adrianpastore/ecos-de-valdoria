// Ecos de Valdoria — A cabana da Caçadora Kaya, mestra das Arqueiras (pedido do dono em 01/10/2026).
// Fica fora da paliçada, no canto nordeste de Pinheiral, numa clareira no meio da mata fechada; uma trilha estreita a liga à estrada norte.
// Dentro: Kaya, o lobo Cinza, lareira, armeiros de arcos e mesa de flechas. Com a Arqueira, E nela abre a janela da mentora
// (prova e promoção, em nome de Ilvara, a deusa da floresta e da caça; 03/04); com as outras classes, ela só conversa.
'use strict';
// ================== SPRITES ==================
// Kaya: capuz verde-musgo, trança ruiva, couro e arco nas costas
def('kaya',["......kkkk......",".....kHHHHk.....","....kHHHHHHk..k.","...kHHrrrrHHkkbk","...kHrseesrHkkbk","...kHrssssrHkkbk","..kHHHrssrHHHkbk","..kLLLLLLLLLLkbk",
 "..kLLqLLLLLLrkbk",".kskLLqLLLLLkskk","..kkGGGGGGGGkk..","...kLLLLLLLLk...","...kPPPPPPPPk...","....kPPkkPPk....","....kddk.kddk...","....kkk...kkk..."],
 {H:'#3e6a32',r:'#b8562a',s:'#e8b088',e:K,L:'#8a5a32',q:'#5a3820',G:'#4a3222',P:'#4a5a32',d:'#3a2a1a',b:'#a0703a'});
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // a cabana: toras como as de Pinheiral, telhado verde de musgo, hera nas paredes e uma galhada de cervo sobre a porta
 reg('cabanaKaya',(()=>{const c=genCabin('#4a6a3a','#36522a'),x=c.getContext('2d'),f=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h);};
  for(const[a,b]of[[9,4],[13,7],[19,5],[7,10],[22,11],[16,12],[11,13],[25,13]])f('#6a9a4a',a,b,2,1);
  for(const[a,b,h]of[[4,15,9],[6,17,5],[26,15,7],[24,15,3]]){f('#3e6a32',a,b,1,h);f('#5a8a3a',a,b+1,1,1);}
  f(K,11,16,10,5);f('#5a3820',12,17,8,3);f('#e8dcc0',15,18,2,2);f('#e8dcc0',12,16,1,3);f('#e8dcc0',13,18,2,1);f('#e8dcc0',19,16,1,3);f('#e8dcc0',17,18,2,1);f('#e8dcc0',11,16,1,1);f('#e8dcc0',20,16,1,1);
  return c;})());
 // alvo de palha para treinar o arco, com uma flecha cravada
 reg('alvo',box(16,20,f=>{f(K,3,10,2,10);f('#6a4222',3,11,1,9);f(K,11,10,2,10);f('#6a4222',12,11,1,9);
  f(K,4,0,8,14);f(K,3,1,10,12);f(K,2,2,12,10);f('#e8d090',4,1,8,12);f('#e8d090',3,2,10,10);
  f('#c83a2a',5,3,6,8);f('#c83a2a',4,4,8,6);f('#f4ecd8',6,4,4,6);f('#f4ecd8',5,5,6,4);f('#c83a2a',7,5,2,4);f('#c83a2a',6,6,4,2);f('#ffd24a',7,6,2,2);
  f('#6a4222',9,6,5,1);f('#e84a3a',13,5,2,1);f('#e84a3a',13,7,2,1);}));
 // lenha empilhada e o varal de peles secando
 reg('lenha',box(16,12,f=>{f(K,1,2,14,10);f('#5a3820',2,3,12,8);for(const a of[2,6,10]){f('#c8945c',a,7,3,3);f('#8a5a30',a+1,8,1,1);}for(const a of[4,8]){f('#c8945c',a,3,3,3);f('#8a5a30',a+1,4,1,1);}}));
 reg('varalPeles',box(16,22,f=>{f(K,1,2,3,20);f('#6a4222',2,3,1,19);f(K,12,2,3,20);f('#6a4222',13,3,1,19);f(K,0,1,16,3);f('#7a4e2c',1,2,14,1);
  f(K,4,4,8,12);f('#b8844c',5,5,6,10);f('#a0703a',6,7,4,6);f('#d8a86a',5,5,6,1);f('#e8d090',4,5,1,1);f('#e8d090',11,5,1,1);f('#e8d090',4,14,1,1);f('#e8d090',11,14,1,1);}));
 // dentro: armeiro de arcos com aljava, lareira de pedra e mesa de flechas
 reg('armeiro',box(16,26,f=>{f(K,1,0,14,26);f('#6a4222',2,1,12,24);f('#4a2e18',3,2,10,22);
  for(const a of[4,7,10]){f('#a0703a',a,3,1,10);f('#a0703a',a+1,2,1,1);f('#a0703a',a+1,13,1,1);f('#e8e0d0',a+1,3,1,10);}
  f(K,4,15,8,9);f('#8a5a30',5,16,6,7);f('#5a3820',5,19,6,1);for(const a of[5,7,9])f('#e84a3a',a,14+(a%2),1,2);}));
 reg('lareira',box(32,28,f=>{f(K,10,0,12,5);f('#6d685c',11,1,10,4);f(K,1,4,30,24);f('#8d8778',2,5,28,22);f('#6d685c',2,14,28,1);f('#6d685c',2,26,28,1);
  f('#6a4222',2,10,28,2);f('#8a5a30',2,10,28,1);f(K,8,13,16,12);f('#2a1a0a',9,14,14,10);
  f('#ff6a1a',10,18,12,6);f('#ffd24a',12,19,8,4);f('#fff3b0',14,20,4,2);f('#5a3820',10,23,12,1);
  f('#e8dcc0',14,7,4,2);f('#e8dcc0',12,5,1,3);f('#e8dcc0',19,5,1,3);f('#e8dcc0',13,7,1,1);f('#e8dcc0',18,7,1,1);}));
 reg('mesaFlechas',box(32,22,f=>{f(K,2,9,28,7);f('#7a4e2c',3,10,26,5);f('#9a6a3c',3,10,26,1);f(K,5,16,3,6);f('#5a3820',6,16,1,6);f(K,24,16,3,6);f('#5a3820',25,16,1,6);
  f('#a0703a',6,7,16,1);f('#c8c8d0',22,7,2,1);f('#e84a3a',4,7,2,1);f('#a0703a',9,5,16,1);f('#c8c8d0',25,5,2,1);f('#e84a3a',7,5,2,1);
  f(K,22,3,6,6);f('#b8844c',23,4,4,4);f('#8a5a30',24,5,2,2);}));}

// ================== A CABANA ==================
// at=[64,11]: canto nordeste, fora da paliçada (28..52 × 20..40). A porta é um portal com 'trilha' (01): sem estrada até a praça,
// só um caminho estreito até a estrada norte. mata: [x, y, raio da mata fechada, raio da clareira sem árvores].
houseInterior({id:'cabanaKaya',city:'pinheiral',at:[64,11],sprite:'cabanaKaya',name:'Cabana da Caçadora Kaya',room:[12,8],seed:1041,
 deco:[[TC.x-5,TC.y-4,'armeiro'],[TC.x-4,TC.y-4,'armeiro'],[TC.x+3,TC.y-4,'lareira',1],[TC.x+3,TC.y-2,'lobo'],[TC.x,TC.y-2,'kaya'],
  [TC.x-5,TC.y+1,'mesaFlechas',1],[TC.x+5,TC.y+1,'barril']],
 extra:{s:'Mestra das Arqueiras',color:'#2a2414',talk:[[TC.x,TC.y-2,'kaya']]}});
MAPS.pinheiral.portals.cabanaKaya[3]='trilha';MAPS.pinheiral.mata=[65,10,13,4.6];
MAPS.pinheiral.deco=(MAPS.pinheiral.deco||[]).concat([[68,9,'alvo'],[69,11,'alvo'],[62,9,'lenha'],[61,11,'varalPeles']]);
GENTE.push({id:'kaya',n:'Caçadora Kaya',c:'#9ad87a',f:['Fale baixo. A floresta escuta.',
 'Ilvara, a senhora da floresta e da caça, não gosta de quem caça por esporte. Eu caço o que como, e só.',
 'Este é o Cinza. Ele morde quem mexe nas minhas flechas.','Arqueira de verdade aprende aqui, no meio dos pinheiros, não atrás de paliçada.',
 'Os lobos das Encostas andam nervosos. Alguma coisa está empurrando eles para perto da aldeia.',
 'Se veio pela trilha, passou por três armadilhas minhas. Sorte que estavam desarmadas.']});
