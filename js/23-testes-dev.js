// Ecos de Valdoria — Menu de testes do dono (só com ?dev no endereço): escolher classe, caminho e níveis na hora
'use strict';
// O herói de teste fica num save separado (SAVEKEY ganha "_dev" no 01), então o herói de verdade nunca é tocado.
// Sem ?dev, nada deste arquivo aparece.
const DEVCLS={mago:'Mago',guerreiro:'Guerreiro',arqueira:'Arqueira'};
function devSpecs(){const c=$('dvCls').value;$('dvSpec').innerHTML='<option value="">Nenhum (classe inicial)</option>'+CLASS_TREE[c].specs.map(k=>`<option value="${k}">${SPECS[k].ic} ${SPECS[k].n}</option>`).join('');devJob();}
function devJob(){const sp=$('dvSpec').value,j=$('dvJob');j.max=sp?50:10;if(+j.value>+j.max)j.value=j.max;$('dvJobMax').textContent=`(1 a ${j.max})`;$('dvPromo').disabled=!sp;if(!sp)$('dvPromo').checked=false;}
// cria um herói novo do jeito escolhido, com equipamento Incomum do nível e os pontos de atributo livres para distribuir (P)
function devApply(){const c=$('dvCls').value,sp=$('dvSpec').value||null,L=clamp(Math.round(+$('dvLvl').value)||1,1,50),J=clamp(Math.round(+$('dvJob').value)||1,1,sp?50:10);
 enter({cls:c,name:'Teste'});
 Object.assign(P,{lvl:L,xp:0,jlvl:J,jxp:0,spec:sp,promo:sp?($('dvPromo').checked?2:1):0,quest:null,attr:newAttr(ATTR_INI),gold:5000});
 for(const s of['arma','peito','elmo','botas'])P.equip[s]=genItem(L,0,s,0,1);
 const ct=CT();P.ranks={[ct.free]:1};P.bar=[ct.free,null,null,null,null,null];
 recalc();P.hp=P.st.hp;P.mp=P.st.mp;lookKey='';heroSpr();buildHotbar();save();$('devm').classList.add('hidden');
 log(`Herói de teste: ${sp?SPECS[sp].n+(P.promo>=2?' (promovido)':''):DEVCLS[c]}, nível ${L}, Classe ${J}. Pontos livres na árvore (T) e nos atributos (P).`,'#8fd0ff');}
// todas as habilidades liberadas no rank máximo (a da promoção só se promovido); as ativas vão para a barra
function devLearnAll(){if(!P)return;const ok=t=>t===CT().base||t===P.spec;let n=0;
 for(const id in SK){const s=SK[id];if(ok(s.tree)&&(!s.promo||P.promo>=s.promo)){P.ranks[id]=s.max;n++;}}
 const b=[...new Set([...P.bar.filter(Boolean),...Object.keys(P.ranks).filter(id=>SK[id]&&SK[id].act)])].slice(0,6);while(b.length<6)b.push(null);P.bar=b;
 recalc();buildHotbar();if(!$('tree').classList.contains('hidden'))renderTree();save();log(`${n} habilidades no rank máximo.`,'#8fd0ff');}
if(DEV){
 const bt=document.createElement('button');bt.id='devBtn';bt.className='frame';bt.textContent='🛠 Testes';bt.title='Menu de testes (só no modo ?dev)';document.body.append(bt);
 const m=document.createElement('div');m.id='devm';m.className='panel frame hidden';
 m.innerHTML=`<div class="phead"><h2>Menu de testes</h2><button class="x" aria-label="Fechar">✕</button></div>
 <p class="dvnota">Este herói fica num save separado: o seu herói de verdade não muda.</p>
 <div class="dvg"><label>Classe</label><select id="dvCls">${Object.entries(DEVCLS).map(([k,n])=>`<option value="${k}">${CLASS_TREE[k].ic} ${n}</option>`).join('')}</select>
 <label>Caminho</label><select id="dvSpec"></select>
 <label>Promovido</label><span><input type="checkbox" id="dvPromo"> <small>(libera a habilidade suprema)</small></span>
 <label>Nível de Base</label><span><input type="number" id="dvLvl" min="1" max="50" value="10"> <small>(1 a 50)</small></span>
 <label>Nível de Classe</label><span><input type="number" id="dvJob" min="1" max="10" value="10"> <small id="dvJobMax"></small></span></div>
 <div class="dvb"><button class="btn gold" id="dvGo">Criar herói de teste</button><button class="btn" id="dvAll">Aprender todas as habilidades</button></div>`;
 document.body.append(m);
 // teclas digitadas no menu não chegam ao jogo (o herói não anda nem usa habilidades)
 m.addEventListener('keydown',e=>e.stopPropagation());
 bt.onclick=()=>{m.classList.toggle('hidden');if(P&&!m.classList.contains('hidden')){$('dvCls').value=P.cls;devSpecs();$('dvSpec').value=P.spec||'';devJob();$('dvPromo').checked=P.promo>=2;$('dvLvl').value=P.lvl;$('dvJob').value=P.jlvl;}};
 m.querySelector('.x').onclick=()=>m.classList.add('hidden');
 $('dvCls').onchange=devSpecs;$('dvSpec').onchange=devJob;$('dvGo').onclick=devApply;$('dvAll').onclick=devLearnAll;devSpecs();}
