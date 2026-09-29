// Ecos de Valdoria — O bar da Guilda: a taverneira Brígida e os tônicos de atributo
'use strict';
// ================== TÔNICOS ==================
// Cada tônico dá +TON_B (definido em 16, que soma o bônus em attrEff) num atributo por 10 minutos de jogo (o tempo só corre com o jogo aberto). Um de cada tipo ativo
// por vez; tomar outro igual renova o tempo. Números aprovados pelo dono em 29/09/2026: +5, 10 minutos, 150 de ouro.
// P.tons = {atributo: quantos na bolsa}; P.tonAt = {atributo: segundos que faltam}. Morrer desfaz os efeitos.
const TON=[['forca','Tônico do Touro','#c8423a'],['agil','Tônico do Vento','#7ad0e8'],['vita','Caldo de Raiz Forte','#a8743c'],
 ['inte','Chá de Sálvia','#7ab04a'],['dest','Colírio do Falcão','#e8b43c'],['sorte','Trevo em Conserva','#3aa05a']];
const TON_T=600,TON_V=150,TONN=Object.fromEntries(TON.map(([k,n])=>[k,n]));
const attrN=k=>ATTR.find(a=>a[0]===k),mmss=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const tonIc={},tonIcon=k=>tonIc[k]||(tonIc[k]=toURL(mk(ICON.pot,(c=>({r:c,R:shadeHex(c,-.4),l:shadeHex(c,.55),y:'#b07a3c',g:'#cfe6f0'}))(TON.find(t=>t[0]===k)[2])),4));
function buyTonic(k){if(!canCarry(WPOT)){heavyMsg();return;}if(P.gold<TON_V){log('Ouro insuficiente.','#ff6b6b');return;}
 P.gold-=TON_V;P.tons[k]=(P.tons[k]||0)+1;log(`Comprou 1 ${TONN[k]}. Tome pela bolsa (aba Consumíveis).`,'#ffd24a');renderTaverna();save();}
function drinkTonic(k){if(!(P.tons[k]>0)||P.dead)return;P.tons[k]--;if(!P.tons[k])delete P.tons[k];
 const re=P.tonAt[k]>0;P.tonAt[k]=TON_T;recalc();log(`${TONN[k]}: +${TON_B} de ${attrN(k)[1]} por ${TON_T/60} minutos${re?' (tempo renovado)':''}.`,'#8fd0ff');
 burst(P.x,P.y-10,TON.find(t=>t[0]===k)[2],16,50);save();}
function tonicTick(dt){let fim=false;for(const k in P.tonAt){P.tonAt[k]-=dt;if(P.tonAt[k]<=0){delete P.tonAt[k];fim=true;log(`O efeito do ${TONN[k]} acabou.`,'#cccccc');}}if(fim)recalc();}
// selos dos tônicos ativos, embaixo do retrato (#tonics)
function tonicHUD(){const h=Object.keys(P.tonAt).map(k=>`<span title="${TONN[k]}: +${TON_B} de ${attrN(k)[1]}">${attrN(k)[2]} ${mmss(P.tonAt[k])}</span>`).join(''),el=$('tonics');if(el.innerHTML!==h)el.innerHTML=h;}

// ================== SPRITES ==================
def('brigida',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkBBwwBBkk...","..ksBBwwwwBBsk..",
 "..ksBBwwwwBBsk..","...kkwwwwwwkk...","....kwwwwwwk....","....kSSSSSSk....","...kSSSSSSSSk...","...kSSSSSSSSk...","....kbbk.kbbk...","....kkk...kkk..."],
 {H:'#c8602a',s:'#e8b088',e:K,B:'#3a7a4a',w:'#f4ecd8',S:'#7a2a3a',b:'#4a3222'});
{const box=(w,h,fn)=>{const c=cnv(w,h),x=c.getContext('2d');fn((col,a,b,ww,hh)=>{x.fillStyle=col;x.fillRect(a,b,ww,hh);});return c;};
 // balcão com canecas de espuma e uma garrafa; prateleira com as garrafas dos tônicos
 reg('balcao',box(32,18,f=>{f(K,0,6,32,12);f('#8a5a30',1,7,30,10);f('#b8844c',1,7,30,2);f('#6a4222',1,16,30,1);for(const x of[8,16,24])f('#6a4222',x,10,1,6);
  for(const x of[3,11]){f(K,x,1,6,6);f('#e8b43c',x+1,3,4,3);f('#fff4dc',x+1,2,4,1);f(K,x+6,3,2,3);}f(K,22,0,4,7);f('#3a8a4a',23,2,2,4);f('#cfe6f0',23,1,2,1);}));
 reg('prateleira',box(32,26,f=>{f(K,1,0,30,26);f('#6a4222',2,1,28,24);
  for(const[r,y]of[[0,2],[1,10],[2,18]]){f('#8a5a30',2,y+6,28,2);for(let i=0;i<6;i++){const x=4+i*4,c=TON[(i+r*2)%6][2];f(K,x,y+1,3,5);f(c,x+1,y+3,1,2);f('#cfe6f0',x+1,y+2,1,1);}}}));}

// ================== O BAR DA GUILDA ==================
// Em toda Guilda, no canto de baixo à direita do salão (mesmo lugar em todas as cidades, como os 4 serviços padrão):
// prateleira atrás, a Brígida, o balcão na frente e dois barris. BAR é o ponto de conversa (como o SMITH do ferreiro).
const BAR={x:-9999,y:-9999};
for(const id in MAPS)if(MAPS[id].interior&&MAPS[id].board){const M=MAPS[id];M.bar=[TC.x+5,TC.y+2];
 M.deco.push([TC.x+5,TC.y+1,'prateleira',1],[TC.x+5,TC.y+2,'brigida'],[TC.x+4,TC.y+3,'balcao',1],[TC.x+6,TC.y+3,'barril'],[TC.x+7,TC.y+3,'barril']);}
function openTaverna(){closeAll();renderTaverna();$('taverna').classList.remove('hidden');}
function renderTaverna(){const B=$('tavernaBody');
 let h=`<p class="flav">"Um gole antes da caçada, aventureiro? Meus tônicos nunca falham!"</p>`;
 for(const[k,n]of TON){const have=P.tons[k]||0,on=P.tonAt[k]>0;
  h+=`<div class="shoprow ton"><img src="${tonIcon(k)}" alt=""><span><b>${n}</b><br><small>+${TON_B} de ${attrN(k)[1]} por ${TON_T/60} minutos${have?` • você tem ${have}`:''}${on?` • ativo: ${mmss(P.tonAt[k])}`:''}</small></span>`+
   `<button class="btn sm" data-ton="${k}"${P.gold<TON_V?' disabled':''}>${TON_V}g</button></div>`;}
 B.innerHTML=h+`<p class="muted" style="margin:8px 0 0;font-size:13px">Os tônicos ficam na bolsa, aba Consumíveis. Tônicos diferentes funcionam juntos; tomar um igual renova o tempo. O efeito some se você cair em combate.</p>`;
 B.querySelectorAll('[data-ton]').forEach(b=>b.onclick=()=>buyTonic(b.dataset.ton));}
