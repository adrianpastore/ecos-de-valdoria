// Ecos de Valdoria — Mapa do mundo (tecla M, botão 🗺 ou toque no minimapa; 08/10/2026)
'use strict';
// Os mapas de fora lado a lado, na posição que os portais indicam (mundoPos, também usado pelo mundiImg do 23).
// Gerar cada mapa custa ~0,3 s, então o mapa do mundo não gera nada: guarda o minimapa (miniBase, 80×60) de cada lugar
// por onde o herói passou (mundoVisto, chamado pelo switchMapNow do 08) e mostra o resto como pergaminho com névoa.
// As miniaturas ficam no aparelho (valdoria_mundo), fora do save, como as preferências de controle e qualidade.
const MUNDO_K='valdoria_mundo';let MUNDO_TH={};try{MUNDO_TH=JSON.parse(localStorage.getItem(MUNDO_K)||'{}')||{};}catch(e){}
function mundoPos(){const fora=id=>MAPS[id]&&!MAPS[id].interior;
 // Valdor no meio; um portal na borda leste põe o vizinho à direita, e assim por diante
 const pos={valdor:[0,0]},usado={'0,0':'valdor'},fila=['valdor'];
 const dirDe=p=>{const dx=(p[0]-W/2)/(W/2),dy=(p[1]-H/2)/(H/2);return Math.abs(dx)>=Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)];};
 const livre=(x,y)=>{if(!usado[x+','+y])return[x,y];for(let r=1;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const k=(x+dx)+','+(y+dy);if(!usado[k])return[x+dx,y+dy];}return[x+9,y];};
 while(fila.length){const id=fila.shift(),M=MAPS[id];for(const to in M.portals){const p=M.portals[to];if(!fora(to)||pos[to]||p[2]==='porta')continue;
  const[dx,dy]=dirDe(p),[x,y]=livre(pos[id][0]+dx,pos[id][1]+dy);pos[to]=[x,y];usado[x+','+y]=to;fila.push(to);}}
 const ids=Object.keys(pos),xs=ids.map(i=>pos[i][0]),ys=ids.map(i=>pos[i][1]),x0=Math.min(...xs),y0=Math.min(...ys);
 return{pos,ids,x0,y0,cols:Math.max(...xs)-x0+1,rows:Math.max(...ys)-y0+1};}
let MPOS=null;const mpos=()=>MPOS||(MPOS=mundoPos());
// guarda o minimapa do lugar atual (só dos mapas que aparecem no mapa do mundo)
function mundoVisto(){if(!mpos().pos[CUR]||MUNDO_TH[CUR])return;MUNDO_TH[CUR]=miniBase.toDataURL();try{localStorage.setItem(MUNDO_K,JSON.stringify(MUNDO_TH));}catch(e){}}
// onde o herói está no mapa do mundo: o próprio mapa ou, num interior ou andar de masmorra, o mapa de fora mais perto pelos portais
// devolve [id do mapa, x, y em tiles]
function mundoOnde(){const pos=mpos().pos;if(pos[CUR])return[CUR,P.x/TILE,P.y/TILE];
 const vis={[CUR]:1},fila=[CUR];while(fila.length){const id=fila.shift();for(const to in MAPS[id].portals){if(vis[to])continue;
  if(pos[to]){const p=MAPS[to].portals[id];return[to,p?p[0]+.5:TC.x,p?p[1]+.5:TC.y];}vis[to]=1;fila.push(to);}}
 return['valdor',TC.x,TC.y];}
const MCW=120,MCH=90,MPAD=10;
const mcel=id=>{const L=mpos(),p=L.pos[id];return[MPAD+(p[0]-L.x0)*MCW,MPAD+(p[1]-L.y0)*MCH];};
let mundoSel=null;
function mundoDesenha(cv,imgs){const L=mpos(),o=cv.getContext('2d');cv.width=MPAD*2+L.cols*MCW;cv.height=MPAD*2+L.rows*MCH;
 // pergaminho
 o.fillStyle='#d8c49a';o.fillRect(0,0,cv.width,cv.height);const rng=mulberry32(7);
 for(let i=0;i<1400;i++){o.fillStyle=rng()<.5?'rgba(120,90,50,.07)':'rgba(255,245,220,.12)';o.fillRect(rng()*cv.width,rng()*cv.height,1+rng()*3,1+rng()*2);}
 for(const id of L.ids){const[cx,cy]=mcel(id),M=MAPS[id],im=imgs[id];
  if(im){o.imageSmoothingEnabled=false;o.drawImage(im,cx+3,cy+3,MCW-6,MCH-6);}
  else{// névoa: a cor do lugar bem apagada, riscos de pergaminho e um "?"
   const c=GPr[M.theme||0][0];o.fillStyle=`rgb(${c.map(v=>Math.round(v*.35+200*.65)).join(',')})`;o.fillRect(cx+3,cy+3,MCW-6,MCH-6);
   o.strokeStyle='rgba(110,80,45,.18)';o.lineWidth=1;o.beginPath();for(let k=-MCH;k<MCW;k+=7){o.moveTo(cx+3+Math.max(0,k),cy+3+Math.max(0,-k));o.lineTo(cx+3+Math.min(MCW-6,k+MCH-6),cy+3+Math.min(MCH-6,MCH-6-k));}o.stroke();
   o.fillStyle='rgba(90,62,30,.45)';o.font='bold 34px Cinzel, serif';o.textAlign='center';o.fillText('?',cx+MCW/2,cy+MCH/2+20);o.textAlign='left';}
  o.strokeStyle=id===mundoSel?'#ffd24a':'#5a3e1e';o.lineWidth=id===mundoSel?3:2;o.strokeRect(cx+3,cy+3,MCW-6,MCH-6);}
 // trilhas entre os mapas (de portal a portal)
 o.setLineDash([5,4]);o.lineWidth=2.5;o.strokeStyle='#7a4a1e';o.fillStyle='#7a4a1e';
 for(const id of L.ids)for(const to in MAPS[id].portals){if(!L.pos[to]||id>to)continue;const a=MAPS[id].portals[to],b=(MAPS[to].portals||{})[id];if(!b)continue;
  const[ax,ay]=mcel(id),[bx,by]=mcel(to),f=MCW/W,A=[ax+(a[0]+.5)*f,ay+(a[1]+.5)*f],B=[bx+(b[0]+.5)*f,by+(b[1]+.5)*f];
  o.beginPath();o.moveTo(...A);o.lineTo(...B);o.stroke();for(const Q of[A,B]){o.beginPath();o.arc(Q[0],Q[1],3,0,6.29);o.fill();}}
 o.setLineDash([]);
 // nome, nível e marcas (cidade em dourado; chefe com a coroa vermelha)
 for(const id of L.ids){const M=MAPS[id],[cx,cy]=mcel(id),s=M.town?'Cidade':M.lv?`Nível ${M.lv[0]}–${M.lv[1]}`:'',t=mnome(M.n);
  o.font='12px "Pixelify Sans", sans-serif';const sw=o.measureText(s).width;o.font=(M.town?'bold ':'')+'15px "Alegreya Sans", sans-serif';
  o.fillStyle=M.town?'rgba(60,34,10,.88)':'rgba(30,20,12,.78)';o.fillRect(cx+5,cy+5,Math.min(MCW-10,Math.max(o.measureText(t).width,sw)+10),35);
  o.fillStyle=M.town?'#ffd24a':'#fff4dc';o.fillText(t,cx+10,cy+21,MCW-20);o.font='12px "Pixelify Sans", sans-serif';o.fillStyle='#e8d4a8';o.fillText(s,cx+10,cy+35);
  if(M.boss){o.fillStyle='#b8282a';o.fillRect(cx+MCW-36,cy+MCH-22,30,16);o.fillStyle='#fff';o.font='bold 11px sans-serif';o.fillText('MVP',cx+MCW-32,cy+MCH-10);}}
}
// texto embaixo do mapa: o lugar escolhido (toque ou mouse) ou onde o herói está
function mundoInfo(id){const M=MAPS[id],onde=mundoOnde()[0]===id,dun=Object.keys(M.portals).filter(k=>!mpos().pos[k]&&MAPS[k].lv&&!MAPS[k].interior).map(k=>MAPS[k].n.replace(/ • .*/,''));
 const p=[`<b>${M.n}</b>`,M.town?'Cidade (zona segura)':M.lv?`Nível ${M.lv[0]} a ${M.lv[1]}`:''];
 if(M.boss)p.push(`MVP: ${MDEF[M.boss].n}`);if(dun.length)p.push('Entrada: '+[...new Set(dun)].join(', '));
 if(!MUNDO_TH[id])p.push('<i>ainda não explorado</i>');if(onde)p.push('<span class="mvc">você está aqui</span>');
 $('mundoInfo').innerHTML=p.filter(Boolean).join(' • ');}
function toggleMundo(){const el=$('mundo'),show=el.classList.contains('hidden');if(show){closeAll();el.classList.remove('hidden');renderMundo();}else el.classList.add('hidden');}
// nome curto para caber no quadro (o nome inteiro aparece embaixo, ao tocar)
const mnome=n=>n.replace(/^(Vila|Aldeia|Cidade) de /,'').replace(' de Pinheiral','');
function renderMundo(){mundoVisto();mundoSel=null;const L=mpos(),cv=$('mundoCv'),imgs={};
 const[oid,ox,oy]=mundoOnde();$('mundoAqui').textContent=oid===CUR?`Você está em ${MAPS[CUR].n}.`:`Você está em ${MAPS[CUR].n} (${MAPS[oid].n}).`;
 const ps=L.ids.filter(id=>MUNDO_TH[id]).map(id=>new Promise(ok=>{const im=new Image();im.onload=()=>{imgs[id]=im;ok();};im.onerror=ok;im.src=MUNDO_TH[id];}));
 mundoDesenha(cv,imgs);Promise.all(ps).then(()=>mundoDesenha(cv,imgs));
 const[cx,cy]=mcel(oid),pin=$('mundoPin');pin.style.left=(cx+3+ox/W*(MCW-6))/cv.width*100+'%';pin.style.top=(cy+3+oy/H*(MCH-6))/cv.height*100+'%';
 mundoInfo(oid);
 // no celular o mapa fica maior que a tela (dá para arrastar) e abre centrado no herói
 const rol=$('mundoRol');cv.style.width=document.body.classList.contains('toque')?cv.width*.8+'px':'';
 rol.scrollLeft=(cx+ox/W*MCW)*(rol.scrollWidth/cv.width)-rol.clientWidth/2;rol.scrollTop=(cy+oy/H*MCH)*(rol.scrollHeight/cv.height)-rol.clientHeight/2;
 const pega=e=>{const r=cv.getBoundingClientRect(),k=cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k;
  return L.ids.find(id=>{const[a,b]=mcel(id);return x>=a&&x<a+MCW&&y>=b&&y<b+MCH;});};
 cv.onclick=e=>{const id=pega(e);if(!id)return;mundoSel=id;mundoInfo(id);mundoDesenha(cv,imgs);};
 cv.onpointermove=e=>{if(e.pointerType!=='mouse')return;const id=pega(e);if(id&&id!==mundoSel){mundoSel=id;mundoInfo(id);mundoDesenha(cv,imgs);}};}
$('mundoBtn').onclick=()=>P&&toggleMundo();$('mapbox').onclick=()=>P&&toggleMundo();
