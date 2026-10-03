// Ecos de Valdoria — Mapa-múndi (index.html?mapa): todos os mapas de fora lado a lado, na posição que os portais indicam.
// Gera cada mapa de verdade (genWorld: terreno, árvores, casas, muralhas), reduz e monta numa imagem só, com nome, nível e as
// ligações dos portais. Interiores (casas, Guildas, Torre) ficam de fora. Serve para planejar regiões novas.
'use strict';
(function(){
 const CW=320,CH=240,SC=CW/MW,PAD=40,TOP=88;
 const fora=id=>MAPS[id]&&!MAPS[id].interior;
 // posição de cada mapa na grade: Valdor no meio; um portal na borda leste põe o vizinho à direita, e assim por diante
 const pos={valdor:[0,0]},usado={'0,0':'valdor'},fila=['valdor'];
 const dirDe=p=>{const dx=(p[0]-W/2)/(W/2),dy=(p[1]-H/2)/(H/2);return Math.abs(dx)>=Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)];};
 const livre=(x,y)=>{if(!usado[x+','+y])return[x,y];for(let r=1;r<6;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){const k=(x+dx)+','+(y+dy);if(!usado[k])return[x+dx,y+dy];}return[x+9,y];};
 while(fila.length){const id=fila.shift(),M=MAPS[id];for(const to in M.portals){const p=M.portals[to];if(!fora(to)||pos[to]||p[2]==='porta')continue;
  const[dx,dy]=dirDe(p),[x,y]=livre(pos[id][0]+dx,pos[id][1]+dy);pos[to]=[x,y];usado[x+','+y]=to;fila.push(to);}}
 const ids=Object.keys(pos),xs=ids.map(i=>pos[i][0]),ys=ids.map(i=>pos[i][1]),x0=Math.min(...xs),y0=Math.min(...ys);
 const cols=Math.max(...xs)-x0+1,rows=Math.max(...ys)-y0+1;
 const out=cnv(PAD*2+cols*CW,TOP+PAD+rows*CH),o=out.getContext('2d');
 o.fillStyle='#0f1a2a';o.fillRect(0,0,out.width,out.height);
 o.fillStyle='#e8c479';o.font='bold 30px Cinzel, serif';o.fillText('Mapa-múndi de Valdoria',PAD,46);
 o.fillStyle='#a8977c';o.font='15px sans-serif';o.fillText(`${ids.length} mapas • gerado em ${new Date().toLocaleDateString('pt-BR')} • as linhas douradas são os portais`,PAD,70);
 const cel=id=>[PAD+(pos[id][0]-x0)*CW,TOP+(pos[id][1]-y0)*CH];
 const cur=CUR;
 for(const id of ids){genWorld(id);const big=cnv(MW,MH),b=big.getContext('2d');b.drawImage(mapC,0,0);
  for(const r of objRows)for(const ob of r){const s=SPR[ob.spr];if(s)b.drawImage(s.n,Math.round(ob.px-s.n.width/2),Math.round(ob.py-s.n.height));}
  const[cx,cy]=cel(id);o.imageSmoothingEnabled=true;o.drawImage(big,cx,cy,CW,CH);
  o.strokeStyle='rgba(0,0,0,.6)';o.lineWidth=2;o.strokeRect(cx+1,cy+1,CW-2,CH-2);}
 // ligações dos portais: do ponto do portal num mapa ao ponto do portal de volta no outro
 o.strokeStyle='#ffd24a';o.lineWidth=3;o.fillStyle='#ffd24a';
 for(const id of ids)for(const to in MAPS[id].portals){if(!pos[to]||id>to)continue;const a=MAPS[id].portals[to],b=(MAPS[to].portals||{})[id];if(!b)continue;
  const[ax,ay]=cel(id),[bx,by]=cel(to),A=[ax+a[0]*TILE*SC,ay+a[1]*TILE*SC],B=[bx+b[0]*TILE*SC,by+b[1]*TILE*SC];
  o.beginPath();o.moveTo(...A);o.lineTo(...B);o.stroke();for(const P_ of[A,B]){o.beginPath();o.arc(P_[0],P_[1],5,0,6.29);o.fill();}}
 // nome e nível de cada mapa (cidades em dourado)
 for(const id of ids){const M=MAPS[id],[cx,cy]=cel(id),t=M.n,s=M.town?'Cidade':M.lv?`Nível ${M.lv[0]} a ${M.lv[1]}`:'';
  o.fillStyle='rgba(10,8,6,.72)';o.fillRect(cx+6,cy+6,Math.min(CW-12,12+Math.max(t.length*8.4,s.length*7.2)),42);
  o.fillStyle=M.town?'#ffd24a':'#fff';o.font=(M.town?'bold ':'')+'15px sans-serif';o.fillText(t,cx+12,cy+24);
  o.fillStyle='#d8c8a8';o.font='13px sans-serif';o.fillText(s,cx+12,cy+41);}
 genWorld(cur);
 const url=out.toDataURL('image/png');
 document.body.innerHTML='';document.body.style.cssText='margin:0;background:#0f1a2a;overflow:auto;color:#efe4cf;font-family:sans-serif';
 const bar=document.createElement('div');bar.style.cssText='padding:8px 12px';
 bar.innerHTML=`<a download="valdoria-mapa-mundi.png" href="${url}" style="color:#ffd24a">Baixar a imagem (PNG)</a> <span style="color:#a8977c">• ${out.width}×${out.height}</span>`;
 const img=new Image();img.src=url;img.style.cssText='display:block;max-width:none';document.body.append(bar,img);
 const pre=document.createElement('pre');pre.id='mapa-png';pre.style.display='none';pre.textContent=url;document.body.append(pre);})();
