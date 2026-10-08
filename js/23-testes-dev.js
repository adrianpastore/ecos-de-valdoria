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
// ================== TELEPORTE (só com ?dev) ==================
// Apelidos curtos por região: cidade, campos (_field01…) e andares de masmorra (_dungeon01…). O id do mapa e o nome também valem.
const TPREG={valdor:{f:['estrada','floresta','pantano','ruinas','covil']},pinheiral:{f:[1,2,3,4,5,6,7].map(n=>'encosta'+n),d:['caverna1','caverna2','caverna3']},
 arcadia:{f:['planalto'],torre:'torreArcadia'},sahrem:{f:['orla','dunasO','dunasL','dunasS'],d:['tumba1','tumba2','tumba3']}};
const TPA={};
for(const c in TPREG){const r=TPREG[c],d2=n=>String(n+1).padStart(2,'0');TPA[c]=c;(r.f||[]).forEach((m,i)=>TPA[c+'_field'+d2(i)]=m);(r.d||[]).forEach((m,i)=>TPA[c+'_dungeon'+d2(i)]=m);if(r.torre)TPA[c+'_torre']=r.torre;}
const tpNorm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim();
// acha o mapa pelo apelido, pelo id ou pelo nome (sem acento, maiúscula ou minúscula)
function tpFind(q){q=tpNorm(q);if(!q)return null;if(TPA[q]&&MAPS[TPA[q]])return TPA[q];
 for(const id in MAPS)if(tpNorm(id)===q)return id;for(const id in MAPS)if(tpNorm(MAPS[id].n).includes(q))return id;return null;}
// cidade: chega na praça; o resto: perto do portal de onde o nível cresce (home), ou do primeiro portal
function devTp(id){if(!P||!MAPS[id]||loading)return false;const M=MAPS[id];
 for(const k of['devm','devmundo'])if($(k))$(k).classList.add('hidden');
 log(`Teleporte: ${M.n}.`,'#8fd0ff');changeMap(id,M.town?'@centro':M.portals[M.home]?M.home:Object.keys(M.portals)[0]);return true;}
// linha de comando: "@teleport sahrem" (ou "@tp sahrem"); sem nome, lista os apelidos
function devCmd(s){const m=String(s).trim().match(/^@?(teleport|tp)\b\s*(.*)$/i);
 if(!m){log('Comando desconhecido. Use: @teleport nome (ex.: @teleport sahrem_dungeon01).','#ff9a7a');return false;}
 if(!P){log('Crie ou carregue um herói antes de teleportar.','#ff9a7a');return false;}
 if(!m[2]){log('Lugares: '+Object.keys(TPA).join(', ')+'. Também vale o nome do mapa.','#8fd0ff');return false;}
 const id=tpFind(m[2]);if(!id){log(`Não achei o lugar "${m[2]}". Digite só @teleport para ver a lista.`,'#ff9a7a');return false;}
 return devTp(id);}
// mapa-múndi: os mapas de fora lado a lado, na posição que os portais indicam (usado aqui e pelo tests/mapa-mundi.js, com ?mapa)
function mundiImg(CW,CH,PAD,TOP,titulo){const SC=CW/MW;
 // posição de cada mapa: mundoPos (30), a mesma do mapa do mundo do jogo
 const{pos,ids,x0,y0,cols,rows}=mundoPos();
 const out=cnv(PAD*2+cols*CW,TOP+PAD+rows*CH),o=out.getContext('2d');
 o.fillStyle='#0f1a2a';o.fillRect(0,0,out.width,out.height);
 if(titulo){o.fillStyle='#e8c479';o.font='bold 30px Cinzel, serif';o.fillText('Mapa-múndi de Valdoria',PAD,46);
  o.fillStyle='#a8977c';o.font='15px sans-serif';o.fillText(`${ids.length} mapas • gerado em ${new Date().toLocaleDateString('pt-BR')} • as linhas douradas são os portais`,PAD,70);}
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
 return{cv:out,ids,cel,CW,CH};}
// janela do mapa-múndi no modo ?dev: clicar num mapa leva até ele; embaixo, botões para todos os lugares (andares e interiores também)
let MUNDI=null;
function devMundi(){const w=$('devmundo');w.classList.remove('hidden');$('devm').classList.add('hidden');if(MUNDI)return;
 const box=w.querySelector('.mdbox');box.textContent='Desenhando o mapa-múndi…';
 setTimeout(()=>{MUNDI=mundiImg(240,180,12,12,0);const cv=MUNDI.cv;cv.className='mdcv';box.textContent='';box.append(cv);
  cv.onclick=e=>{const r=cv.getBoundingClientRect(),k=cv.width/r.width,x=(e.clientX-r.left)*k,y=(e.clientY-r.top)*k;
   for(const id of MUNDI.ids){const[cx,cy]=MUNDI.cel(id);if(x>=cx&&x<cx+MUNDI.CW&&y>=cy&&y<cy+MUNDI.CH){devTp(id);return;}}};},30);}
if(DEV){
 // campo de comando no menu de testes; Enter no jogo abre o menu já com o cursor no campo
 const m=$('devm'),c=document.createElement('div');c.className='dvcmd';
 c.innerHTML=`<input id="dvCmd" placeholder="@teleport sahrem_dungeon01" autocomplete="off" spellcheck="false"><button class="btn" id="dvCmdGo">Ir</button><button class="btn gold" id="dvMundo">🗺 Mapa-múndi</button>`;
 m.append(c);
 const go=()=>{if(devCmd($('dvCmd').value))$('dvCmd').value='';};
 $('dvCmdGo').onclick=go;$('dvCmd').addEventListener('keydown',e=>{if(e.key==='Enter')go();});$('dvMundo').onclick=devMundi;
 const w=document.createElement('div');w.id='devmundo';w.className='panel frame hidden';
 w.innerHTML=`<div class="phead"><h2>Mapa-múndi</h2><button class="x" aria-label="Fechar">✕</button></div><p class="dvnota">Clique num mapa para ir até ele. Os andares das masmorras e a Torre estão nos botões embaixo.</p><div class="mdbox"></div><div class="mdlist">${
  Object.entries(TPA).filter(([,id])=>MAPS[id]).map(([a,id])=>`<button class="btn" data-tp="${id}" title="${MAPS[id].n}">${a}</button>`).join('')}</div>`;
 document.body.append(w);w.addEventListener('keydown',e=>e.stopPropagation());
 w.querySelector('.x').onclick=()=>w.classList.add('hidden');
 w.querySelector('.mdlist').onclick=e=>{const id=e.target.dataset&&e.target.dataset.tp;if(id)devTp(id);};
 addEventListener('keydown',e=>{if(e.key!=='Enter'||e.target.tagName==='INPUT'||!P)return;m.classList.remove('hidden');$('dvCmd').focus();e.preventDefault();});}
