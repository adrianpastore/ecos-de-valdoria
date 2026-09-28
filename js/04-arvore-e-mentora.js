// Ecos de Valdoria — Janelas da árvore de habilidades e da Mestra Elara
'use strict';
// ================== SPRITES NOVOS ==================
def('urso',["","","...kk......kk...","..kBBk....kBBk..","..kBbkkkkkkbBk..","...kbbbbbbbbk...","..kbbebbbbebbk..","..kbbbbnnbbbbk..","..kbbbnkknbbbk..","..kBbbbnnbbbBk..",".kBBbbbbbbbbBBk.",".kBbbbbbbbbbbBk.","kBBbbbbbbbbbbBBk","kBbbkbbbbbbkbbBk",".kbbk.kkkk.kbbk.",".kkkk......kkkk."],{b:'#8a5a32',B:'#5e3a1e',e:K,n:'#c89a6a'});
def('mentora',["......kkkk......",".....kVVVVk..o..","....kVvvvvVk.y..","....khhhhhhk.y..","....khsesehk.y..","....khssssshky..",".....kSSSSk..y..","....kvvvvvvksy..","...kvvvgvvvvky..","...kvvvgvvvvky..","..kvvvvgvvvvky..","..kVVVVVVVVVky..","...kkkkkkkkk.y.."],
{V:'#4a2a6a',v:'#7a4ab0',h:'#e8e0f0',s:'#f1c7a0',S:'#c8906c',e:K,g:'#e8b43c',o:'#d9a0ff',y:'#6a4526'});
function genPool(w1,w2){const c=cnv(16,10),x=c.getContext('2d');for(let y=0;y<10;y++)for(let i=0;i<16;i++){const d=hyp((i-7.5)/7.5,(y-5)/4.6);if(d>1)continue;x.fillStyle=d>.82?K:d>.62?'#8d8778':(y<4?w2:w1);x.fillRect(i,y,1,1);}return c;}
reg('pool0',genPool('#5a2a6a','#8a4aa0'));reg('pool1',genPool('#2f6fb0','#8cc8ff'));

// ================== DESENHO EXTRA ==================
function drawStatus(m,tt){if(m.rootT>0){ctx.strokeStyle='#6ab03a';ctx.lineWidth=1;for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(m.x+i*m.r*.6,m.y+1);ctx.quadraticCurveTo(m.x+i*m.r+Math.sin(tt*6+i)*2,m.y-6,m.x+i*m.r*.3,m.y-10);ctx.stroke();}}
 if(m.curse&&m.curse.t>0&&R()<.15)parts.push({x:m.x+rf(-m.r,m.r),y:m.y-rf(0,mh(m)),vx:0,vy:-15,g:0,life:.5,max:.5,color:'#b070ff',s:1});}
function drawExtra(e,tt){const o=e.o;
 if(e.t===6){ctx.fillStyle='rgba(120,255,140,.25)';ctx.beginPath();ctx.ellipse(o.x,o.y,7,3,0,0,6.29);ctx.fill();shadow(o.x,o.y,5);
  ctx.globalAlpha=o.temp&&o.temp<3?.5+Math.sin(tt*20)*.3:1;if(o.alpha){ctx.fillStyle='rgba(255,200,80,.3)';ctx.beginPath();ctx.ellipse(o.x,o.y,12,5,0,0,6.29);ctx.fill();}drawS(o.spr||'esqueleto',o.x,o.y-(o.moving&&Math.floor(o.animT*8)%2?1:0),o.face,o.sc||.9,o.hitT>0);ctx.globalAlpha=1;
  ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(o.x-7,o.y-17,14,2);ctx.fillStyle='#5dff7a';ctx.fillRect(o.x-7,o.y-17,14*Math.max(0,o.hp/o.maxHp),2);}
 else if(e.t===7){shadow(o.x,o.y,6);drawS('mentora',o.x,o.y);}
 else if(e.t===8){drawS(o.state==='pure'?'pool1':'pool0',o.x,o.y);if(o.state!=='pure'&&R()<.25)parts.push({x:o.x+rf(-6,6),y:o.y-4,vx:0,vy:-18,g:0,life:.8,max:.8,color:'#b070ff',s:1});}}
function mentorAlert(){if(!P||!hasTree(P.cls))return false;return(P.jlvl>=10&&!P.spec&&!P.quest)||(P.quest&&P.quest.done)||(P.spec&&P.promo<2&&P.jlvl>=25);}
function drawLabels(sx,sy,tt){ctx.font='700 13px "Alegreya Sans",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';
 const lab=(t,x,y,c)=>{ctx.strokeText(t,sx(x),sy(y));ctx.fillStyle=c;ctx.fillText(t,sx(x),sy(y));};
 lab('Mestra Elara',MENTOR.x,MENTOR.y-24,'#d9a0ff');
 if(mentorAlert()){ctx.font='800 24px Cinzel,serif';lab('!',MENTOR.x,MENTOR.y-31+Math.sin(tt*4)*1.5,'#ffd24a');ctx.font='700 13px "Alegreya Sans",sans-serif';}
 portalLabels(lab);for(const n of nascs)if(n.state!=='pure')lab('Nascente Corrompida',n.x,n.y-12,'#d9a0ff');}
function promptText(it){return it.kind==='smith'?'[E] Falar com o ferreiro':it.kind==='board'?'[E] Ver o mural de missões':it.kind==='npc'?'[E] Falar com o mercador':it.kind==='mentor'?'[E] Falar com a Mestra Elara':it.kind==='nasc'?'[E] Purificar a nascente':`[E] Abrir ${CHN[it.o.mimic?2:it.o.tier]}`;}
let hinted10=false;
function hudExtra(){const q=P.quest,el=$('quest');el.classList.toggle('hidden',!q);
 if(q)el.innerHTML=q.done?`<b>Prova concluída</b><br>Volte à Mestra Elara, na casa com a estrela na placa.`:`<b>${SPECS[q.spec].ap}</b><br>${SPECS[q.spec].trial.t}: ${q.prog}/${q.goal}`;
 const f=ptsFree();$('treeBadge').textContent=f>0?f:'';
 if(!hinted10&&mentorAlert()&&!P.spec){hinted10=true;log('A Mestra Elara quer falar com você sobre o seu futuro. Ela atende na casa com a estrela na placa, em qualquer cidade.','#d9a0ff');}}

// ================== ÁRVORE ==================
let treeTab='mago',treeSel=null;
function toggleTree(){const el=$('tree'),show=el.classList.contains('hidden');el.classList.toggle('hidden',!show);if(show){if(!classTrees().includes(treeTab))treeTab=CT().base;if(P.spec&&treeTab===CT().base&&ptsFree()>0)treeTab=P.spec;renderTree();}}
function tierLabel(t,nodes){const s=SK[nodes[0]],base=s.tree===CT().base,lv=Math.min(...nodes.map(n=>SK[n].lvl))-(base?0:10);
 let r=`Andar ${t} • `+(base?`Classe ${lv}`:lv<=1?'ao entrar no caminho':`Classe ${lv} no caminho`);if(s.pts)r+=` e ${s.pts} pontos neste caminho`;if(s.promo)r+=' e promoção';return r;}
function renderTree(){const body=$('treeBody'),tabs=$('treeTabs'),det=$('treeDet');
 if(!hasTree(P.cls)){$('treePts').textContent='';tabs.innerHTML='';det.innerHTML='';body.innerHTML=`<p class="flav">A árvore do ${CL[P.cls].nome} ainda está sendo escrita. Por enquanto, só o Mago e o Guerreiro têm caminhos para evoluir.</p>`;return;}
 $('treePts').textContent=`${ptsFree()} ponto(s) livre(s)`;if(!classTrees().includes(treeTab)){treeTab=CT().base;treeSel=null;}
 tabs.innerHTML='';for(const t of classTrees()){const b=document.createElement('button');b.className='btn sm tab'+(t===treeTab?' on':'');
  const locked=t!==CT().base&&P.spec!==t;b.textContent=(t===CT().base?CT().ic+' ':SPECS[t].ic+' ')+TREES[t]+(locked?' 🔒':'');b.onclick=()=>{treeTab=t;treeSel=null;renderTree();};tabs.append(b);}
 const ids=Object.keys(SK).filter(id=>SK[id].tree===treeTab);let h='';
 if(treeTab!==CT().base&&P.spec!==treeTab)h+=`<p class="flav">${P.spec?'Você seguiu outro caminho.':'Complete a prova da Mestra Elara no nível de Classe 10 para abrir este caminho.'} ${SPECS[treeTab].d}</p>`;
 body.innerHTML=h;
 for(const t of[1,2,3]){const ns=ids.filter(id=>SK[id].tier===t);if(!ns.length)continue;const w=document.createElement('div');w.className='tier';w.innerHTML=`<h4>${tierLabel(t,ns)}</h4>`;const g=document.createElement('div');g.className='nodes';
  for(const id of ns){const s=SK[id],r=rk(id),b=document.createElement('button');b.className='node'+(r?' has':'')+(!canLearn(id)?' can':'')+(canLearn(id)&&!r?' lock':'')+(s.act?'':' pas')+(treeSel===id?' sel':'');
   b.innerHTML=`<span class="ni">${s.ic}</span><span class="nn">${s.n}</span><span class="nr">${r}/${s.max}${s.act?'':' • passiva'}</span>`;b.onclick=()=>{treeSel=id;renderTree();};g.append(b);}
  w.append(g);body.append(w);}
 if(!treeSel){det.innerHTML='<span style="color:var(--muted)">Toque numa habilidade para ver o que ela faz. Contorno verde: pode aprender agora. Tracejado: passiva.</span>';return;}
 const id=treeSel,s=SK[id],r=rk(id);let d=`<h3>${s.ic} ${s.n}</h3><div class="meta">${s.act?`Ativa • ${Math.round(s.mp*(1-P.st.mpCut))} de mana • recarga ${+(s.cd*(1-P.st.cdr)).toFixed(1)}s`:'Passiva'} • rank ${r}/${s.max}</div>`;
 if(r)d+=`<div><b>Atual:</b> ${s.d(eff(id,r))}</div>`;if(r<s.max)d+=`<div><b>${r?'Próximo rank':'Ao aprender'}:</b> ${s.d(eff(id,r+1))}</div>`;
 const why=canLearn(id);d+=why?`<div class="why">${why}</div>`:`<div class="acts"><button class="btn sm gold" id="learnBtn">${r?'Melhorar':'Aprender'} (1 ponto)</button></div>`;
 if(s.act&&r){d+=`<div class="slots">Na barra:`;for(let i=0;i<6;i++)d+=`<button class="btn sm${P.bar[i]===id?' on':''}" data-slot="${i}">${i+1}</button>`;d+=P.bar.includes(id)?`<button class="btn sm" data-slot="-1">Tirar</button>`:'';d+='</div>';}
 det.innerHTML=d;const lb=$('learnBtn');if(lb)lb.onclick=()=>{learn(id);renderTree();};
 det.querySelectorAll('[data-slot]').forEach(b=>b.onclick=()=>{assignSlot(id,+b.dataset.slot);renderTree();});}
function assignSlot(id,i){const j=P.bar.indexOf(id);if(i<0){if(j>=0)P.bar[j]=null;}else{const prev=P.bar[i];P.bar[i]=id;if(j>=0&&j!==i)P.bar[j]=prev;}buildHotbar();save();}

// ================== MENTORA ==================
function openMentor(){$('mentor').classList.remove('hidden');renderMentor();}
function renderMentor(){const b=$('mentorBody');let h='';
 const icons=t=>Object.keys(SK).filter(id=>SK[id].tree===t).map(id=>SK[id].ic).join(' ');
 if(!hasTree(P.cls))h=`<p class="flav">"Sinto em você a força de um ${CL[P.cls].nome.toLowerCase()}, mas os segredos desse caminho ainda não me foram revelados. Volte em breve."</p>`;
 else if(P.quest){const q=P.quest,S=SPECS[q.spec];
  h=q.done?`<p class="flav">"Você provou seu valor. O caminho de ${S.n.toLowerCase()} está aberto."</p><button class="btn gold" data-act="done">Tornar-me ${S.ap}</button>`
   :`<p class="flav">"Continue. A prova ainda não terminou."</p><div class="spec"><h3 style="color:${S.cor}">${S.ic} ${S.ap}</h3><p>${S.trial.t}</p><div class="prog"><i style="width:${q.prog/q.goal*100}%"></i></div><p>${q.prog} de ${q.goal}</p></div><button class="btn sm" data-act="quit">Abandonar a prova</button>`;}
 else if(!P.spec){h=`<p class="flav">"${P.jlvl<10?`Ainda é cedo, jovem ${CL[P.cls].nome.toLowerCase()}. Volte quando alcançar o nível de Classe 10 e eu mostrarei os caminhos que se abrem a partir daqui.`:`Chegou a hora de escolher. Cada caminho exige uma prova, e a escolha é para sempre.`}"</p>`;
  for(const k of CT().specs){const S=SPECS[k];h+=`<div class="spec"><h3 style="color:${S.cor}">${S.ic} ${S.ap}</h3><p>${S.d}</p><p style="font-size:20px">${icons(k)}</p><p><b>Prova:</b> ${S.trial.t}.</p>${P.jlvl>=10?`<button class="btn sm gold" data-act="take" data-spec="${k}">Aceitar a prova</button>`:''}</div>`;}}
 else{const S=SPECS[P.spec];
  h=P.promo>=2?`<p class="flav">"Você dominou o caminho de ${S.n.toLowerCase()}. Pouco resta que eu possa ensinar."</p>`
   :P.jlvl>=25?`<p class="flav">"Seu poder amadureceu. Aceite o título de ${S.n}."</p><button class="btn gold" data-act="promo">Receber a promoção</button>`
   :`<p class="flav">"Siga treinando, ${S.ap.toLowerCase()}. No nível de Classe 25 você estará pronto para a promoção e para a sua habilidade suprema."</p>`;}
 if(hasTree(P.cls))h+=`<div class="shoprow"><span>Redistribuir todos os pontos da árvore</span><button class="btn sm" data-act="respec">${respecCost()}g</button></div>`;
 b.innerHTML=h;b.querySelectorAll('[data-act]').forEach(x=>x.onclick=()=>{const a=x.dataset.act;
  if(a==='take')acceptTrial(x.dataset.spec);else if(a==='quit')abandonTrial();else if(a==='done')completeTrial();else if(a==='promo')promote();else if(a==='respec')respec();
  renderMentor();if(!$('tree').classList.contains('hidden'))renderTree();});}
