// Ecos de Valdoria — Mapa-múndi (index.html?mapa): todos os mapas de fora lado a lado, na posição que os portais indicam.
// Gera cada mapa de verdade (genWorld: terreno, árvores, casas, muralhas), reduz e monta numa imagem só, com nome, nível e as
// ligações dos portais. Interiores (casas, Guildas, Torre) ficam de fora. Serve para planejar regiões novas.
'use strict';
(function(){
 // o desenho fica em mundiImg (23), que o menu de testes (?dev) também usa
 const out=mundiImg(320,240,40,88,1).cv;
 const url=out.toDataURL('image/png');
 document.body.innerHTML='';document.body.style.cssText='margin:0;background:#0f1a2a;overflow:auto;color:#efe4cf;font-family:sans-serif';
 const bar=document.createElement('div');bar.style.cssText='padding:8px 12px';
 bar.innerHTML=`<a download="valdoria-mapa-mundi.png" href="${url}" style="color:#ffd24a">Baixar a imagem (PNG)</a> <span style="color:#a8977c">• ${out.width}×${out.height}</span>`;
 const img=new Image();img.src=url;img.style.cssText='display:block;max-width:none';document.body.append(bar,img);
 const pre=document.createElement('pre');pre.id='mapa-png';pre.style.display='none';pre.textContent=url;document.body.append(pre);})();
