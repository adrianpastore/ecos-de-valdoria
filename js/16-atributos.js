// Ecos de Valdoria — Atributos do herói (Força, Agilidade, Vitalidade, Inteligência, Destreza, Sorte), como no Ragnarok
'use strict';
// ================== REGRAS ==================
// Todos começam em 5. Cada nível de Base dá 3 pontos, +1 a cada 10 níveis (nv 1–9: 3, 10–19: 4…). Máximo 99, custo 1.
// Ataque e defesa vêm só dos atributos (e do equipamento); vida e mana ainda sobem um pouco por nível, conforme a classe.
const ATTR=[['forca','Força','💪'],['agil','Agilidade','💨'],['vita','Vitalidade','❤️'],['inte','Inteligência','🔮'],['dest','Destreza','🎯'],['sorte','Sorte','🍀']];
const ATTR_INI=5,ATTR_MAX=99,ATTR_RESET=1000;
const MAINAT={guerreiro:'forca',mago:'inte',arqueira:'dest'}; // o atributo que vira ataque em cada classe
const ATTR_D={forca:'Ataque do Guerreiro; +10 de peso por ponto.',agil:'Velocidade de ataque e esquiva (chance de não levar o golpe).',vita:'Vida máxima, defesa e recuperação de vida.',
 inte:'Ataque do Mago, mana máxima e recuperação de mana.',dest:'Ataque da Arqueira; habilidades recarregam um pouco mais rápido.',sorte:'Chance de crítico e de itens e materiais caírem.'};
const newAttr=v=>Object.fromEntries(ATTR.map(([k])=>[k,v]));
const attrGain=l=>3+Math.floor((l-1)/10); // pontos ganhos ao chegar no nível l
// pontos acima de 1 em cada atributo: os 4 iniciais de cada um mais os dos níveis (o reset da Elara devolve tudo)
function attrTotal(){let s=ATTR.length*(ATTR_INI-1);for(let l=2;l<=P.lvl;l++)s+=attrGain(l);return s;}
function attrFree(){let s=0;for(const[k]of ATTR)s+=P.attr[k]-1;return attrTotal()-s;}
// Números calibrados para que, no nível 50, o atributo principal em 99 dê o ataque de antes (ver CLAUDE.md, item 9).
// atributos que valem agora: os distribuídos mais os tônicos ativos do bar da Guilda (20). attrFree e o peso usam só P.attr.
const TON_B=5;
function attrEff(){const t=P.tonAt,a=Object.assign({},P.attr);if(t)for(const k in t)if(t[k]>0)a[k]+=TON_B;return a;}
function attrStats(c,L){const a=attrEff(),d=k=>a[k]-ATTR_INI;
 return{hp:(c.hp+c.g.hp*.5*L)*(1+d('vita')*.01),mp:(c.mp+c.g.mp*.75*L)*(1+d('inte')*.004),
  atk:Math.max(1,c.atk+c.g.atk*.52*d(MAINAT[P.cls]||'forca')),def:Math.max(0,c.def+c.g.def*.6*d('vita')),crit:c.crit+d('sorte')*.3,
  dodge:d('agil')*.0025,aspd:d('agil')*.006,cdr:d('dest')*.002,regen:d('vita')*.01,mregen:d('inte')*.01,luck:d('sorte')*.01};}
const luckMul=()=>1+Math.max(0,P.st.luck||0);

// ================== DISTRIBUIR ==================
let attrPend=newAttr(0);
const pendSum=()=>ATTR.reduce((s,[k])=>s+attrPend[k],0);
function attrAdd(k,n){n=Math.min(n,attrFree()-pendSum(),ATTR_MAX-P.attr[k]-attrPend[k]);if(n>0)attrPend[k]+=n;renderAttr();}
function attrConfirm(){if(!pendSum())return;for(const[k]of ATTR)P.attr[k]+=attrPend[k];attrPend=newAttr(0);recalc();save();log('Atributos distribuídos.','#ffe3a0');renderAttr();}
function attrReset(){if(P.gold<ATTR_RESET){log('Ouro insuficiente.','#ff6b6b');return false;}P.gold-=ATTR_RESET;P.attr=newAttr(1);attrPend=newAttr(0);recalc();save();
 log(`Seus atributos voltaram a 1. Você tem ${attrFree()} pontos para distribuir (P).`,'#ffe3a0');return true;}

// ================== JANELA ==================
function toggleAttr(){const el=$('attr'),show=el.classList.contains('hidden');el.classList.toggle('hidden',!show);if(show){attrPend=newAttr(0);renderAttr();}}
function renderAttr(){const free=attrFree()-pendSum(),main=MAINAT[P.cls];$('attrPts').textContent=`${free} ponto(s) livre(s)`;
 // prévia: aplica os pontos pendentes só para calcular, depois volta
 const a0=P.attr,hp=P.hp,mp=P.mp;P.attr=Object.fromEntries(ATTR.map(([k])=>[k,a0[k]+attrPend[k]]));recalc();const st=P.st,cap=capOf();P.attr=a0;recalc();P.hp=hp;P.mp=mp;
 const dif=(v,b)=>v!==b?` <em>(${v>b?'+':''}${Math.round((v-b)*10)/10})</em>`:'';
 let h='<div class="attrs">';
 for(const[k,n,ic]of ATTR){const v=P.attr[k],p=attrPend[k];
  h+=`<div class="arow${k===main?' main':''}"><span class="aic">${ic}</span><span class="an"><b>${n}</b>${k===main?' <small>principal</small>':''}<small>${ATTR_D[k]}</small></span>
   <span class="av">${v}${p?`<em>+${p}</em>`:''}</span><button class="btn sm" data-add="${k}" data-n="1"${free<1||v+p>=ATTR_MAX?' disabled':''}>+1</button><button class="btn sm" data-add="${k}" data-n="5"${free<1||v+p>=ATTR_MAX?' disabled':''}>+5</button></div>`;}
 h+='</div>';
 const cur=P.st;
 h+=`<div class="stats"><span>Ataque</span><b>${st.atk}${dif(st.atk,cur.atk)}</b><span>Defesa</span><b>${st.def}${dif(st.def,cur.def)}</b><span>Vida</span><b>${st.hp}${dif(st.hp,cur.hp)}</b><span>Mana</span><b>${st.mp}${dif(st.mp,cur.mp)}</b>
  <span>Crítico</span><b>${st.crit}%</b><span>Esquiva</span><b>${Math.round(st.dodge*1000)/10}%</b><span>Vel. de ataque</span><b>+${Math.round(st.aspd*100)}%</b><span>Recarga</span><b>−${Math.round(st.cdr*100)}%</b><span>Peso máximo</span><b>${cap}</b></div>`;
 if(pendSum())h+=`<div class="acts"><button class="btn gold" id="attrOk">Confirmar ${pendSum()} ponto(s)</button> <button class="btn" id="attrUndo">Desfazer</button></div>`;
 h+=`<p class="flav">A escolha vale até você pedir à Mestra Elara para redefinir (${ATTR_RESET} de ouro).</p>`;
 const b=$('attrBody');b.innerHTML=h;b.querySelectorAll('[data-add]').forEach(x=>x.onclick=()=>attrAdd(x.dataset.add,+x.dataset.n));
 const ok=$('attrOk');if(ok){ok.onclick=attrConfirm;$('attrUndo').onclick=()=>{attrPend=newAttr(0);renderAttr();};}}
