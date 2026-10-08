// Ecos de Valdoria — Diário de missões (tecla J; 08/10/2026)
'use strict';
// Junta numa janela só o que está em andamento (o caminho da classe, as missões aceitas em qualquer Guilda e os pedidos dos moradores, 28)
// e o que já foi feito. Não guarda nada novo além de P.miss.done ({id: quantas vezes entregue}, contado pelo missAction do 13).
// O selo no botão conta o que está pronto para entregar.
let diaTab='abertas';
const cidN=c=>MAPS[c].n.replace(/^(Vila|Aldeia|Cidade) de /,'');
function toggleDiario(){const el=$('diario'),show=el.classList.contains('hidden');if(show){closeAll();renderDiario();}el.classList.toggle('hidden',!show);}
// cada linha: {t: título, s: subtítulo (onde), p: texto, prog: [[nome, tem, precisa]], ok: pronto para entregar, cor}
function diaAbertas(){const L=[],q=P.quest,[mn,mw]=MENTN[mentorOf()];
 if(q)L.push({t:SPECS[q.spec].ap,s:'Caminho da classe',p:q.done?`Prova concluída! Volte à ${mn}, ${mw}.`:SPECS[q.spec].trial.t+'.',prog:q.done?null:[['Progresso',q.prog,q.goal]],ok:q.done,cor:'#d9a0ff'});
 else if(mentorAlert())L.push({t:P.spec?'Promoção a '+SPECS[P.spec].n:'O seu futuro',s:'Caminho da classe',p:`A ${mn} quer falar com você. Ela ${mentorOf()==='elara'?'atende':'espera'} ${mw}.`,ok:true,cor:'#d9a0ff'});
 else if(P.spec&&P.promo<2&&hasTree(P.cls))L.push({t:'Promoção a '+SPECS[P.spec].n,s:'Caminho da classe',p:`Chegue ao nível de Classe 25 e fale com a ${mn}.`,prog:[['Nível de Classe',P.jlvl,25]],cor:'#d9a0ff'});
 for(const id of P.miss.on){const m=MISS.find(x=>x.id===id);if(!m)continue;const have=P.mats[m.mat]||0;
  L.push({t:m.t,s:`Guilda de ${cidN(m.city)} • ${MAPS[m.map].n}`,p:have>=m.n?`Pronto! Volte ao mural da Guilda de ${cidN(m.city)}.`:m.txt,prog:[[LOOTM[m.mat].n,have,m.n]],ok:have>=m.n,cor:'#ffe3a0'});}
 for(const r of PEDS){if(P.ped[r.id]!==1)continue;const ok=pedState(r)==='pronta';
  L.push({t:r.t,s:`${r.n} • ${cidN(r.map)}`,p:ok?`Pronto! Volte a ${cidN(r.map)} e fale com ${r.n}.`:r.pede,prog:r.itens.map(([m,n])=>[LOOTM[m].n+(COLD[m]?' ('+Object.keys(COLD[m].maps).map(k=>MAPS[k].n.replace(/^Pirâmide de Sahrem • /,'pirâmide, ')).join(' e ')+')':''),P.mats[m]||0,n]),ok,cor:r.c});}
 return L;}
function diaNovos(){return PEDS.filter(r=>!P.ped[r.id]&&r.lv<=P.lvl+3).map(r=>`<li><b>${r.n}</b>, em ${cidN(r.map)}, tem um pedido para você <small class="muted">(nível ${r.lv}+)</small></li>`).join('');}
function diaFeitas(){const L=[],D=P.miss.done||{};
 if(P.spec)L.push({t:P.promo>=2?'Promovido a '+SPECS[P.spec].n:'Aprendiz de '+SPECS[P.spec].n,s:'Caminho da classe',p:SPECS[P.spec].d,cor:'#d9a0ff'});
 for(const r of PEDS)if(P.ped[r.id]===2)L.push({t:r.t,s:`${r.n} • ${cidN(r.map)}`,p:`"${r.ok}"`,cor:r.c});
 for(const m of MISS)if(D[m.id])L.push({t:m.t,s:`Guilda de ${cidN(m.city)} • ${MAPS[m.map].n}`,p:`Entregue ${D[m.id]>1?D[m.id]+' vezes':'1 vez'}.`,cor:'#ffe3a0'});
 return L;}
const diaCard=e=>`<div class="mcard${e.ok?' pronta':''}" style="border-left:5px solid ${e.cor}"><div class="mt"><b>${e.t}</b><small>${e.s}</small></div><p>${e.p}</p>`+
 (e.prog||[]).map(([n,a,b])=>`<div class="mr"><span>${n}</span><span>${Math.min(a,b)}/${b}${a>=b?' ✔':''}</span></div><div class="dbar"><i style="width:${Math.min(100,a/b*100)}%"></i></div>`).join('')+`</div>`;
function renderDiario(){const B=$('diarioBody'),A=diaAbertas(),F=diaFeitas(),nv=diaNovos();
 $('diarioTabs').innerHTML=[['abertas','Em andamento',A.length],['feitas','Concluídas',F.length]].map(([k,n,c])=>`<button class="btn sm tab${diaTab===k?' on':''}" data-d="${k}">${n} (${c})</button>`).join('');
 $('diarioTabs').querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{diaTab=b.dataset.d;renderDiario();});
 B.innerHTML=diaTab==='abertas'?(A.length?A.map(diaCard).join(''):`<p class="flav">Nenhuma tarefa em andamento. O mural da Guilda de cada cidade sempre tem trabalho, e quem tem um "!" em cima pede ajuda.</p>`)+(nv?`<h3 class="dsub">Quem precisa de ajuda</h3><ul class="dnov">${nv}</ul>`:'')
  :F.length?F.map(diaCard).join(''):`<p class="flav">Nada concluído ainda. Toda grande história começa com uma tarefa pequena.</p>`;}
// selo no botão: quantas coisas estão prontas para entregar (chamada pelo hudExtra do 04)
function diaBadge(){if(!P)return;const n=diaAbertas().filter(e=>e.ok).length,el=$('diaBadge'),t=n?String(n):'';if(el.textContent!==t)el.textContent=t;}
$('diaBtn').onclick=()=>P&&toggleDiario();
