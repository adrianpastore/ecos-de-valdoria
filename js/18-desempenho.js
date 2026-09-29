// Ecos de Valdoria — Desempenho: vinheta e tom da região em CSS, modo leve (resolução 1× e menos partículas)
'use strict';
// Qualidade: 'auto' liga o modo leve sozinho se o jogo ficar abaixo de ~40 quadros por segundo; 'alta' e 'leve' fixam.
// A escolha fica no aparelho (não no save). O modo leve não volta sozinho para o alto, para não ficar trocando.
const QKEY='valdoria_qualidade';
let qualPref='auto';try{qualPref=localStorage.getItem(QKEY)||'auto';}catch(e){}
const QUAL={leve:qualPref==='leve'},perfW={n:0,sum:0,skip:1};
document.body.classList.toggle('leve',QUAL.leve);
function setLeve(on){QUAL.leve=!!on;document.body.classList.toggle('leve',QUAL.leve);resize();vigKey='';}
function setQual(p){qualPref=p;try{localStorage.setItem(QKEY,p);}catch(e){}perfW.n=perfW.sum=0;setLeve(p==='leve');qualBtns();}
function qualBtns(){document.querySelectorAll('[data-qual]').forEach(b=>b.classList.toggle('on',b.dataset.qual===qualPref));}
document.querySelectorAll('[data-qual]').forEach(b=>b.onclick=()=>setQual(b.dataset.qual));qualBtns();
// chamada a cada quadro (99) com o tempo real desde o anterior; mede em janelas de ~4 s e ignora a primeira
function perfTick(ms){if(qualPref!=='auto'||QUAL.leve||!P||loading||document.hidden){perfW.n=perfW.sum=0;return;}
 if(ms>250)return; // aba escondida ou troca de mapa
 perfW.sum+=ms;perfW.n++;if(perfW.sum<4000)return;const avg=perfW.sum/perfW.n;perfW.n=perfW.sum=0;if(perfW.skip>0){perfW.skip--;return;}
 if(avg>25){setLeve(true);log('Modo leve ligado para o jogo ficar mais fluido (dá para mudar na ajuda ❓).','#8fd0ff');}}
const maxParts=()=>QUAL.leve?90:400;
function capParts(){const m=maxParts();if(parts.length>m)parts.splice(0,parts.length-m);}
// Vinheta (bordas escuras) e tom de cada região: antes eram pintados no canvas a cada quadro (a vinheta sozinha
// custava ~70% do quadro); agora são o fundo de uma camada por cima do canvas, que o navegador compõe de graça.
let vigKey='';
function vignette(z){const k=z+'|'+VW+'x'+VH;if(k===vigKey)return;vigKey=k;const a=Math.round(Math.min(VW,VH)*.35),b=Math.round(Math.max(VW,VH)*.75),t=TINT[z];
 const el=$('vinheta');if(el)el.style.background=`radial-gradient(circle at 50% 50%,rgba(0,0,0,0) ${a}px,rgba(0,0,0,.45) ${b}px)`+(t?`,linear-gradient(${t},${t})`:'');}
