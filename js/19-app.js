// Ecos de Valdoria — App instalável (PWA): registra o service worker (sw.js) e mostra o botão de instalar
'use strict';
// O service worker só existe em https (GitHub Pages) ou em localhost. Abrindo o index.html com dois cliques (file://)
// nada disso roda, e o jogo abre como sempre. No teste de fumaça (?teste) também não registra.
const APP_OK=typeof navigator!=='undefined'&&'serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost');
if(APP_OK&&!/[?&](teste|medir)\b/.test(location.search))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
// Android/Chrome/Edge avisam quando o jogo pode ser instalado: aí aparecem os botões [data-inst] (tela inicial e ajuda).
// No iPhone não há esse aviso: a ajuda explica o caminho pelo Compartilhar.
let instEv=null;
const instShow=on=>document.querySelectorAll('[data-inst]').forEach(b=>b.classList.toggle('hidden',!on));
addEventListener('beforeinstallprompt',e=>{e.preventDefault();instEv=e;instShow(true);});
addEventListener('appinstalled',()=>{instEv=null;instShow(false);});
document.querySelectorAll('[data-inst]').forEach(b=>b.onclick=async()=>{if(!instEv)return;const ev=instEv;instEv=null;ev.prompt();try{await ev.userChoice;}catch(_){}instShow(false);});
