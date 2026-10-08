// Ecos de Valdoria — Cópia do herói: exportar e importar o save (08/10/2026, item 2.3 do roteiro)
'use strict';
// No celular o navegador às vezes limpa os dados e o herói se perde; a cópia também leva o herói para outro aparelho ou navegador.
// O código é "EV1." + o save em base64 + "." + uma soma de conferência (pega código colado pela metade). Também vale um arquivo .txt
// com o mesmo código, ou o JSON puro do save. Importar troca o herói deste aparelho (depois de perguntar) e entra no jogo com ele.
// Janela #copia: aberta pela ajuda (❓) e pela tela inicial ("💾 Cópia" ou "Trazer meu herói").
const SAVEV=7; // a versão que o save() do 02 grava hoje
const cpSoma=t=>{let h=7;for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h.toString(36);};
function saveCode(s){const b=btoa(unescape(encodeURIComponent(JSON.stringify(s))));return'EV1.'+b+'.'+cpSoma(b);}
// devolve {s} com o save, ou {erro} com o motivo em português
function readCode(t){t=(t||'').trim();let s;
 if(t[0]==='{'){try{s=JSON.parse(t);}catch(e){return{erro:'O texto não é um herói de Valdoria.'};}}
 else{t=t.replace(/\s+/g,'');const m=t.match(/^EV1\.([A-Za-z0-9+/=]+)\.([a-z0-9]+)$/);
  if(!m)return{erro:t?'Esse código não é de Valdoria, ou está faltando um pedaço.':'Cole o código ou escolha o arquivo.'};
  if(cpSoma(m[1])!==m[2])return{erro:'O código está incompleto ou foi alterado. Copie de novo, inteiro.'};
  try{s=JSON.parse(decodeURIComponent(escape(atob(m[1]))));}catch(e){return{erro:'O código está danificado.'};}}
 if(!s||typeof s!=='object'||!CL[s.cls]||typeof s.name!=='string'||!(s.lvl>=1))return{erro:'O texto não é um herói de Valdoria.'};
 if((s.v||1)>SAVEV)return{erro:'Esse herói foi salvo numa versão mais nova do jogo. Atualize a página e tente de novo.'};
 return{s};}
const cpQuem=s=>`<b>${s.name.replace(/</g,'&lt;')}</b>, ${CL[s.cls].nome} de nível ${s.lvl}`;
let cpNovo=null;
function openCopia(){closeAll();if(P)save();cpNovo=null;const s=loadSave(),ok=s&&CL[s.cls],el=$('copia');
 let h=`<p class="flav">Guarde uma cópia do seu herói: se o navegador apagar os dados, ou se quiser jogar em outro aparelho, é só trazer ele de volta.</p>`;
 h+=ok?`<h3>Guardar uma cópia</h3><p>${cpQuem(s)}${s.gold!=null?` • ${s.gold} de ouro`:''}</p><textarea id="cpCode" readonly rows="3"></textarea>
  <div class="acts"><button class="btn sm gold" id="cpCopy">📋 Copiar código</button><button class="btn sm" id="cpFile">💾 Baixar arquivo</button><span id="cpOk" class="pos"></span></div>`
  :`<h3>Guardar uma cópia</h3><p class="flav">Ainda não há herói neste aparelho.</p>`;
 h+=`<h3>Trazer um herói</h3><textarea id="cpIn" rows="3" placeholder="Cole aqui o código do herói (começa com EV1.)"></textarea>
  <div class="acts"><button class="btn sm gold" id="cpLoad">Carregar herói</button><label class="btn sm">📂 Escolher arquivo<input type="file" id="cpPick" accept=".txt,text/plain,application/json" hidden></label></div><div id="cpMsg"></div>`;
 $('copiaBody').innerHTML=h;el.classList.remove('hidden');
 if(ok){const c=saveCode(s),ta=$('cpCode');ta.value=c;ta.onclick=()=>ta.select();
  $('cpCopy').onclick=()=>{const fim=()=>{$('cpOk').textContent='Copiado! Guarde num lugar seguro (uma nota, um e-mail para você mesmo).';};
   ta.select();(navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(fim,()=>{try{document.execCommand('copy');fim();}catch(e){$('cpOk').textContent='Selecione o texto e copie.';}});};
  $('cpFile').onclick=()=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([c],{type:'text/plain'}));
   a.href=u;a.download=`valdoria-${s.name.normalize('NFD').replace(/[^\w]/g,'').toLowerCase()||'heroi'}-nv${s.lvl}.txt`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000);
   $('cpOk').textContent='Arquivo baixado.';};}
 $('cpLoad').onclick=()=>cpTry($('cpIn').value);
 $('cpPick').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('cpIn').value=r.result;cpTry(r.result);};r.readAsText(f);};}
// confere o código e pergunta antes de trocar o herói deste aparelho
function cpTry(t){const r=readCode(t),m=$('cpMsg');if(r.erro){cpNovo=null;m.innerHTML=`<p class="neg">${r.erro}</p>`;return;}
 cpNovo=r.s;const at=loadSave(),tem=at&&CL[at.cls];
 m.innerHTML=`<p>Encontrado: ${cpQuem(r.s)}.</p>`+(tem?`<p class="neg">Isso troca o herói deste aparelho (${cpQuem(at)}) por este. Guarde uma cópia dele antes, se quiser.</p>`:'')+
  `<div class="acts"><button class="btn sm gold" id="cpSim">${tem?'Trocar e jogar':'Jogar com este herói'}</button><button class="btn sm" id="cpNao">Cancelar</button></div>`;
 $('cpSim').onclick=()=>importSave(cpNovo);$('cpNao').onclick=()=>{cpNovo=null;m.innerHTML='';};}
function importSave(s){if(!s)return false;try{localStorage.setItem(SAVEKEY,JSON.stringify(s));}catch(e){$('cpMsg').innerHTML='<p class="neg">Não foi possível guardar neste navegador.</p>';return false;}
 $('copia').classList.add('hidden');$('death').classList.add('hidden');enter(loadSave());log(`${s.name} chegou a Valdoria pela cópia do herói.`,'#8fd0ff');return true;}
$('copiaBtn').onclick=()=>openCopia(); // o botão da tela inicial (#copiaStart) é ligado pelo buildStart do 99
