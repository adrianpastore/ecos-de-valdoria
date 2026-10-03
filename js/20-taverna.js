// Ecos de Valdoria — O salão da Guilda: o bar da taverneira Brígida (tônicos de atributo) e a gente que conversa (Freya, Darian, Lexus)
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
// addBar: também chamada por cidades criadas depois deste arquivo (ex.: Arcádia, 21)
function addBar(M){M.bar=[TC.x+5,TC.y+2];M.deco.push([TC.x+5,TC.y+1,'prateleira',1],[TC.x+5,TC.y+2,'brigida'],[TC.x+4,TC.y+3,'balcao',1],[TC.x+6,TC.y+3,'barril'],[TC.x+7,TC.y+3,'barril']);}
for(const id in MAPS)if(MAPS[id].interior&&MAPS[id].board)addBar(MAPS[id]);
function openTaverna(){closeAll();$('taverna').querySelector('h2').textContent='Bar da '+cidP().bar[0];renderTaverna();$('taverna').classList.remove('hidden');} // a taverneira da cidade (24)
function renderTaverna(){const B=$('tavernaBody');
 let h=`<p class="flav">"${cidP().bar[2]}"</p>`;
 for(const[k,n]of TON){const have=P.tons[k]||0,on=P.tonAt[k]>0;
  h+=`<div class="shoprow ton"><img src="${tonIcon(k)}" alt=""><span><b>${n}</b><br><small>+${TON_B} de ${attrN(k)[1]} por ${TON_T/60} minutos${have?` • você tem ${have}`:''}${on?` • ativo: ${mmss(P.tonAt[k])}`:''}</small></span>`+
   `<button class="btn sm" data-ton="${k}"${P.gold<TON_V?' disabled':''}>${TON_V}g</button></div>`;}
 B.innerHTML=h+`<p class="muted" style="margin:8px 0 0;font-size:13px">Os tônicos ficam na bolsa, aba Consumíveis. Tônicos diferentes funcionam juntos; tomar um igual renova o tempo. O efeito some se você cair em combate.</p>`;
 B.querySelectorAll('[data-ton]').forEach(b=>b.onclick=()=>buyTonic(b.dataset.ton));}

// ================== GENTE DO SALÃO ==================
// NPCs de ambiente (nomes do dono, 29/09/2026): só conversam. Cada E sorteia uma fala (nunca a mesma duas vezes seguidas),
// que aparece num balão sobre a cabeça por 5 s e no registro. at = posição relativa ao centro do salão (TC).
const SALAO=[
 {id:'freya',n:'Freya',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda! O mural ali tem trabalho para quem tem coragem.','Aceite até 3 missões por vez e traga as provas. A Guilda paga em ouro e experiência.',
  'Cada missão volta ao mural um tempo depois de entregue. Trabalho aqui nunca falta!','Os murais falam dos problemas de cada região. Outras cidades têm os seus.','Cansado? A Brígida, no balcão, tem um tônico para cada tipo de aventureiro.']},
 {id:'darian',n:'Darian',c:'#e8c080',at:[-5,-2],f:['Derrube os esqueletos antes do Senhor dos Ossos, ou ele não cai nunca!','Viu círculo vermelho no chão? Saia dele. Aprendi isso do jeito difícil.',
  'A Raposa Anciã foge de quem luta de perto. Encurrale-a, não desista.','O Wyrm Carmesim cospe fogo onde você está parado. Nunca fique parado.','Um Tônico do Touro antes de um chefe já salvou minha pele mais de uma vez.',
  'Baú longe da vila? Pode ter dentes. Eu tenho a cicatriz para provar.','O Mestre das Máscaras se divide em cópias. Só o verdadeiro sangra.']},
 {id:'lexus',n:'Lexus',c:'#d9a0ff',at:[-7,3],f:['Ah, um aventureiro! Um dia faço uma balada sobre você... se voltar vivo.','Dizem que a Raposa de Nove Caudas canta nas noites de lua. Eu só queria ouvir uma vez.',
  'Estou afinando o alaúde para a noite. A Brígida prometeu uma caneca por música.','Conhece a lenda do Wyrm Carmesim? Não? Pague uma rodada e eu conto!','Toda Guilda tem um bardo. As boas têm dois. Esta tem só eu, e já basta.']}];
def('freya',["......kkkk......",".....kYYYYk.....","....kYYYYYYk....","....kYseesYk....","....kYssssYk....",".....kssssk.....","...kkDDDDDDkk...","..ksDDDDDDDDsk..",
 "..ksDDwwwwDDsk..","...kDDwwwwDDk...","....kDDDDDDk....","....kDDDDDDk....","...kDDDDDDDDk...","...kDDDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],
 {Y:'#f0d060',s:'#f0c8a0',e:K,D:'#3a5aa8',w:'#f4ecd8',b:'#3a2a1a'});
def('darian',["......kkkk......",".....kGGGGk.....","....kGGGGGGk....","....kGseesGk....","....ksrsssGk....",".....kGGGGk.....","..kkkLLLLLLkkw..",".ksskLLggLLkskw.",
 ".ksskLLLLLLksk..","..kkkLLLLLLkk...","....kLLLLLLk....","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],
 {G:'#b8b8b0',s:'#d8a070',e:K,r:'#b8423a',L:'#7a5230',g:'#e8b43c',w:'#c8c8d0',P:'#4a4038',b:'#2a1c12'});
def('lexus',[".........kFk....",".....kkkkkFk....","....kHHHHHHk....","...kHHHHHHHHk...","....kseesssk....","....ksssssk.....","...kkRRRRRRkk...","..ksRRRRRRRRsk..",
 "..kskLLLLkRRsk..","...kLLoLLLkRk...","....kLLLLkRRk...","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],
 {F:'#f4ecd8',H:'#6a3a8a',s:'#e8b088',e:K,R:'#b8423a',L:'#c8904a',o:'#3a2414',P:'#3a5a3a',b:'#4a3222'});
// addSalao: também chamada por cidades criadas depois deste arquivo (ex.: Arcádia, 21)
function addSalao(M){M.talk=SALAO.map(p=>[TC.x+p.at[0],TC.y+p.at[1],p.id]);for(const[x,y,s]of M.talk)M.deco.push([x,y,s]);}
for(const id in MAPS)if(MAPS[id].interior&&MAPS[id].board)addSalao(MAPS[id]);
// pontos de conversa do mapa atual (como o SMITH): na frente dos pés de cada um. setTalk é chamada ao trocar de mapa (08).
// GENTE: quem conversa fora do salão da Guilda, no mesmo formato do SALAO (ex.: a Arquimaga Selene, na Torre de Arcádia, 21)
const TALK=[],GENTE=[];
function setTalk(M){TALK.length=0;for(const[tx,ty,id]of M.talk||[])TALK.push({x:(tx+.5)*TILE,y:(ty+1)*TILE+8,p:SALAO.concat(GENTE).find(p=>p.id===id),line:null,until:-1});}
function talkTo(q){const f=q.p.f.filter(l=>l!==q.line);q.line=pick(f);q.until=time+5;log(`${q.p.n}: "${q.line}"`,q.p.c);}
// nome sobre a cabeça e, enquanto fala, um balão de pergaminho em cima (chamada pelo drawLabels do 04)
function drawTalk(sx,sy,lab){for(const q of TALK){lab(q.p.n,q.x,q.y-30,q.p.c);if(time>=q.until)continue;
 ctx.save();ctx.font='600 13px "Alegreya Sans",sans-serif';const ls=[];let cur='';for(const w of q.line.split(' ')){if(cur&&ctx.measureText(cur+' '+w).width>200){ls.push(cur);cur=w;}else cur=cur?cur+' '+w:w;}ls.push(cur);
 const bw=Math.max(...ls.map(l=>ctx.measureText(l).width))+14,bh=ls.length*16+8,X=sx(q.x),Y=sy(q.y-30)-18-bh;
 ctx.fillStyle='rgba(244,234,214,.96)';ctx.strokeStyle='#5a3a1a';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(X-bw/2,Y,bw,bh,6);ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(X-5,Y+bh);ctx.lineTo(X,Y+bh+6);ctx.lineTo(X+5,Y+bh);ctx.fill();
 ctx.fillStyle='#2a1a0a';ls.forEach((l,i)=>ctx.fillText(l,X,Y+17+i*16));ctx.restore();}}
