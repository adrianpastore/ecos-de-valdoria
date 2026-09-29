// Ecos de Valdoria — Renderização, interface, controles e inicialização
'use strict';
// ================== RENDER ==================
const cv=$('cv'),ctx=cv.getContext('2d'),mini=$('mini').getContext('2d'),bagEl=$('bag'),shopEl=$('shop'),helpEl=$('help');
let DPR=1,VW=0,VH=0,S=3;const cam={x:TC.x*TILE,y:TC.y*TILE};let CX=0,CY=0;
function resize(){DPR=Math.min(devicePixelRatio||1,2);VW=cv.clientWidth;VH=cv.clientHeight;cv.width=Math.round(VW*DPR);cv.height=Math.round(VH*DPR);S=Math.max(2,Math.min(4,Math.round(Math.min(VW/(TILE*20),VH/(TILE*13)))));}
addEventListener('resize',resize);
const TINT=[null,null,'rgba(40,70,40,.10)','rgba(120,90,40,.08)','rgba(120,20,10,.14)'];
function drawS(name,x,y,face=1,sc=1,white=false,sy=1){const s=SPR[name];if(!s)return;const img=white?(face<0?s.wf:s.w):(face<0?s.f:s.n);const w=img.width*sc,h=img.height*sc*sy;ctx.drawImage(img,Math.round(x-w/2),Math.round(y-h),Math.round(w),Math.round(h));}
function shadow(x,y,r){ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(x,y,r,r*.4,0,0,6.29);ctx.fill();}
function conColor(l){const d=l-(P?P.lvl:1);return d>=5?'#ff3b3b':d>=3?'#ff8a2a':d>=-2?'#ffd84a':d>=-5?'#5fd35a':'#a0a0a0';}
function render(dt,tt){ctx.setTransform(DPR,0,0,DPR,0,0);ctx.imageSmoothingEnabled=false;
 const vw=VW/S,vh=VH/S;let tx,ty;if(P){tx=P.x-vw/2;ty=P.y-8-vh/2;}else{tx=TC.x*TILE-vw/2+Math.sin(tt*.07)*240;ty=TC.y*TILE-vh/2+Math.cos(tt*.05)*150;}
 cam.x+=(tx-cam.x)*Math.min(1,dt*(P?12:2));cam.y+=(ty-cam.y)*Math.min(1,dt*(P?12:2));
 cam.x=vw>=MW?(MW-vw)/2:clamp(cam.x,0,MW-vw);cam.y=vh>=MH?(MH-vh)/2:clamp(cam.y,0,MH-vh);
 const sa=shakeT>0?shakeA:0;CX=Math.round((cam.x+rf(-sa,sa))*S)/S;CY=Math.round((cam.y+rf(-sa,sa))*S)/S;
 ctx.fillStyle='#0b0907';ctx.fillRect(0,0,VW,VH);ctx.save();ctx.scale(S,S);ctx.translate(-CX,-CY);
 const x0=Math.max(0,Math.floor(CX)),y0=Math.max(0,Math.floor(CY)),x1=Math.min(MW,Math.ceil(CX+vw)+1),y1=Math.min(MH,Math.ceil(CY+vh)+1);
 ctx.drawImage(mapC,x0,y0,x1-x0,y1-y0,x0,y0,x1-x0,y1-y0);
 const inView=(x,y,m=40)=>x>CX-m&&x<CX+vw+m&&y>CY-m&&y<CY+vh+m*2;
 // chão: avisos
 for(const t of teles){if(t.ring){drawRingTele(t);continue;}const f=t.t/t.delay;ctx.fillStyle=`rgba(255,${t.fire?60:30},30,${.15+f*.2})`;ctx.beginPath();ctx.ellipse(t.x,t.y,t.r,t.r*.55,0,0,6.29);ctx.fill();ctx.strokeStyle='rgba(255,60,40,.9)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(255,80,40,.35)';ctx.beginPath();ctx.ellipse(t.x,t.y,t.r*f,t.r*f*.55,0,0,6.29);ctx.fill();}
 for(const a of pAoe){ctx.strokeStyle=a.color;ctx.globalAlpha=.7;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(a.x,a.y,a.r,a.r*.55,0,0,6.29);ctx.stroke();ctx.globalAlpha=1;
  if(a.kind==='meteor'){const f=a.t/a.delay,mx=a.x+70*(1-f),my=a.y-150*(1-f);ctx.fillStyle='#ffb040';ctx.beginPath();ctx.arc(mx,my,5,0,6.29);ctx.fill();ctx.fillStyle='#fff3c0';ctx.beginPath();ctx.arc(mx,my,2.5,0,6.29);ctx.fill();parts.push({x:mx,y:my,vx:rf(-10,10),vy:rf(-10,10),g:0,life:.3,max:.3,color:'#ff6a20',s:2});}}
 if(P&&P.target&&!P.target.dead){const t=P.target,p=1+Math.sin(tt*8)*.08;ctx.strokeStyle='#ff4040';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(t.x,t.y,t.r*1.4*p,t.r*.6*p,0,0,6.29);ctx.stroke();}
 drawPlayerFx(tt);if(P&&P.buff){ctx.strokeStyle=`rgba(255,120,50,${.5+Math.sin(tt*10)*.3})`;ctx.beginPath();ctx.ellipse(P.x,P.y,11,5,0,0,6.29);ctx.stroke();}
 // entidades ordenadas por y
 const L=[];const r0=Math.max(0,Math.floor(CY/TILE)-1),r1=Math.min(H-1,Math.ceil((CY+vh)/TILE)+2);
 for(let r=r0;r<=r1;r++)for(const o of objRows[r])if(inView(o.px,o.py))L.push({y:o.py,t:0,o});
 for(const m of mons)if(inView(m.x,m.y))L.push({y:m.y,t:1,o:m});for(const c of chests)if(inView(c.x,c.y))L.push({y:c.y,t:2,o:c});
 for(const l of loots)if(inView(l.x,l.y))L.push({y:l.y,t:3,o:l});L.push({y:NPC.y,t:4,o:NPC});L.push({y:MENTOR.y,t:7,o:MENTOR});for(const a of allies)if(inView(a.x,a.y))L.push({y:a.y,t:6,o:a});for(const n of nascs)if(inView(n.x,n.y))L.push({y:n.y-4,t:8,o:n});if(P)L.push({y:P.y,t:5,o:P});
 L.sort((a,b)=>a.y-b.y);
 for(const e of L){const o=e.o;
  if(e.t===0)drawS(o.spr,o.px,o.py);
  else if(e.t===1){const m=o,bob=m.type==='slime'?1:1,sy=m.type==='slime'?1+Math.sin(m.animT*6)*.08:1;shadow(m.x,m.y,m.r*1.1);
   if(m.elite||m.boss||m.d.clone){ctx.fillStyle=`rgba(255,${m.boss||m.d.clone?80:200},40,${.25+Math.sin(tt*5)*.1})`;ctx.beginPath();ctx.ellipse(m.x,m.y,m.r*1.6,m.r*.7,0,0,6.29);ctx.fill();}
   const yy=m.y-(m.moving&&m.type!=='slime'&&Math.floor(m.animT*8)%2?1:0);drawS(m.disguise||m.type,m.x+(m.lunge>0?m.face*3:0),yy-(m.d.fly||m.d.hover?4+Math.sin(m.animT*3)*2:0),m.face,m.sc,m.hitT>0,sy*bob);
   drawStatus(m,tt);if(m.slowT>0){ctx.globalAlpha=.35;ctx.fillStyle='#9fe8ff';ctx.fillRect(m.x-m.r,m.y-mh(m),m.r*2,mh(m));ctx.globalAlpha=1;}}
  else if(e.t===2){const c=o;if(c.tier>=3&&!c.open){ctx.fillStyle=`rgba(255,220,80,${.18+Math.sin(tt*4)*.1})`;ctx.beginPath();ctx.ellipse(c.x,c.y-1,12,5,0,0,6.29);ctx.fill();}
   ctx.globalAlpha=c.open?Math.max(0,1-Math.max(0,c.openT-4)/2):1;drawS((c.open?'chesto':'chest')+(c.mimic?2:c.tier),c.x,c.y);ctx.globalAlpha=1;
   if(!c.open&&R()<.02)parts.push({x:c.x+rf(-7,7),y:c.y-rf(4,12),vx:0,vy:-12,g:0,life:.6,max:.6,color:'#fff6c0',s:1});}
  else if(e.t===3){const l=o,y=l.y-l.z;
   if(l.kind==='item'){const rc=RARC[l.item.rar];if(l.item.rar>=1&&l.z===0){const g=ctx.createLinearGradient(0,l.y-50,0,l.y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,rc);ctx.globalAlpha=.35+Math.sin(tt*4+l.x)*.12;ctx.fillStyle=g;ctx.fillRect(l.x-3,l.y-50,6,50);ctx.globalAlpha=1;}shadow(l.x,l.y,4);drawS('bag'+l.item.rar,l.x,y+1);}
   else if(l.kind==='gold'){shadow(l.x,l.y,3);drawS('coin',l.x,y-Math.abs(Math.sin(tt*4+l.x))*1);}
   else if(l.kind==='mat'){shadow(l.x,l.y,3);drawS('mat_'+l.mat,l.x,y+1);}
   else{shadow(l.x,l.y,3);drawS('pot'+l.pot,l.x,y+2,1,.65);}}
  else if(e.t>=6)drawExtra(e,tt);
  else if(e.t===4){shadow(o.x,o.y,6);drawS('npc',o.x,o.y);drawS('coin',o.x,o.y-20+Math.sin(tt*3)*1.5);}
  else{if(!P.dead){shadow(P.x,P.y,6);}ctx.globalAlpha=P.dead?.35:P.stealth?.35:1;drawS(P.form?'urso':heroSpr(),P.x+(P.swingT>0?P.face*1.5:0),P.y-(P.moving&&Math.floor(P.animT*8)%2?1:0),P.face,1,P.hitT>0);ctx.globalAlpha=1;}}
 // projéteis e efeitos
 drawMProj();for(const p of projs){if(p.arrow){const sp=hyp(p.vx,p.vy);ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x-p.vx/sp*7,p.y-p.vy/sp*7);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(p.x-.5,p.y-.5,1,1);}
  else{ctx.globalAlpha=.4;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size+2,0,6.29);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,6.29);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,p.size*.45,0,6.29);ctx.fill();}}
 for(const f of fx){const k=f.t/f.max;ctx.globalAlpha=1-k;
  if(f.k==='ring'){ctx.strokeStyle=f.color;ctx.lineWidth=f.w;const r=f.r0+(f.r1-f.r0)*k;ctx.beginPath();ctx.ellipse(f.x,f.y,r,r*.55,0,0,6.29);ctx.stroke();}
  else if(f.k==='boom'){ctx.fillStyle=f.color;ctx.beginPath();ctx.ellipse(f.x,f.y,f.r*(.4+k*.6),f.r*(.4+k*.6)*.6,0,0,6.29);ctx.fill();}
  else if(f.k==='bolt'){ctx.strokeStyle=f.color;ctx.lineWidth=2;ctx.beginPath();f.pts.forEach(([x,y],i)=>{if(!i)ctx.moveTo(x,y);else{const[px,py]=f.pts[i-1];ctx.lineTo((px+x)/2+rf(-4,4),(py+y)/2+rf(-4,4));ctx.lineTo(x,y);}});ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=.7;ctx.stroke();}
  else{ctx.strokeStyle=f.color;ctx.lineWidth=f.big?3:2;const r=f.big?14:10,a=f.face>0?0:Math.PI;ctx.beginPath();ctx.arc(f.x-f.face*4,f.y,r,a-1.2+k*.8,a+.3+k*.8);ctx.stroke();}ctx.globalAlpha=1;}
 for(const p of parts){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;if(p.streak)ctx.fillRect(p.x,p.y-5,1,6);else ctx.fillRect(p.x,p.y,p.s,p.s);}ctx.globalAlpha=1;
 if(MAPS[CUR].town&&R()<.15)parts.push({x:(TC.x+.5)*TILE+rf(-5,5),y:TC.y*TILE+rf(2,8),vx:rf(-8,8),vy:-25,g:60,life:.6,max:.6,color:'#bfe6ff',s:1});
 ctx.restore();
 // tela
 const z=P?P.zone:0;if(TINT[z]){ctx.fillStyle=TINT[z];ctx.fillRect(0,0,VW,VH);}
 const g=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.35,VW/2,VH/2,Math.max(VW,VH)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
 const sx=x=>(x-CX)*S,sy=y=>(y-CY)*S;drawDark(sx,sy,tt);ctx.textAlign='center';
 for(const m of mons){if(!inView(m.x,m.y))continue;const isT=P&&P.target===m;if(!(isT||m.hp<m.maxHp||m.elite||m.boss||m.d.clone))continue;
  const w=Math.max(28,m.r*2.6)*S/3,X=sx(m.x),Y=sy(m.y-mh(m))-8;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(X-w/2-1,Y-1,w+2,6);ctx.fillStyle=m.elite||m.boss?'#ff9a1f':'#e0403a';ctx.fillRect(X-w/2,Y,w*Math.max(0,m.fake?m.fake.hp/m.fake.maxHp:m.hp/m.maxHp),4);
  if(isT||m.elite||m.boss||m.d.clone){ctx.font='700 13px "Alegreya Sans",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';const s=`${m.elite?'★ ':''}${m.name} • ${m.lvl}`;ctx.strokeText(s,X,Y-4);ctx.fillStyle=conColor(m.lvl);ctx.fillText(s,X,Y-4);}}
 ctx.font='700 13px "Alegreya Sans",sans-serif';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.85)';ctx.strokeText('Mercador Bento',sx(NPC.x),sy(NPC.y-26));ctx.fillStyle='#ffd24a';ctx.fillText('Mercador Bento',sx(NPC.x),sy(NPC.y-26));drawLabels(sx,sy,tt);
 for(const t of texts){ctx.globalAlpha=Math.min(1,t.life*2);ctx.font=`700 ${t.big?22:15}px "Pixelify Sans",monospace`;ctx.lineWidth=3;ctx.strokeStyle='#000';ctx.strokeText(t.t,sx(t.x),sy(t.y));ctx.fillStyle=t.c;ctx.fillText(t.t,sx(t.x),sy(t.y));}ctx.globalAlpha=1;}
function drawMini(){mini.imageSmoothingEnabled=false;mini.drawImage(miniBase,0,0,360,270);const f=360/W;for(const to in MAPS[CUR].portals){const pp=portalPt(to);mini.fillStyle='#ff6a3a';mini.fillRect(pp.x/TILE*f-5,pp.y/TILE*f-5,10,10);}
 for(const c of chests)if(!c.open){mini.fillStyle=c.tier===4?'#ff9a1f':'#ffd84a';mini.fillRect(c.x/TILE*f-2,c.y/TILE*f-2,5,5);}
 for(const m of mons)if(m.boss){mini.fillStyle='#ff2020';mini.fillRect(m.x/TILE*f-4,m.y/TILE*f-4,9,9);}
 mini.fillStyle='#40e0ff';mini.fillRect(NPC.x/TILE*f-2,NPC.y/TILE*f-2,5,5);mini.fillStyle='#d9a0ff';mini.fillRect(MENTOR.x/TILE*f-2,MENTOR.y/TILE*f-2,5,5);for(const n of nascs)if(n.state!=='pure'){mini.fillStyle='#c050ff';mini.fillRect(n.x/TILE*f-3,n.y/TILE*f-3,7,7);}
 if(P){mini.strokeStyle='rgba(255,255,255,.6)';mini.lineWidth=1;mini.strokeRect(CX/TILE*f,CY/TILE*f,VW/S/TILE*f,VH/S/TILE*f);mini.fillStyle='#000';mini.fillRect(P.x/TILE*f-4,P.y/TILE*f-4,8,8);mini.fillStyle='#fff';mini.fillRect(P.x/TILE*f-3,P.y/TILE*f-3,6,6);}}

// ================== INTERFACE ==================
function log(msg,color='#f4ead6'){const d=document.createElement('div');d.textContent=msg;d.style.color=color;appendLog(d);}
function logItem(it){const d=document.createElement('div');d.append('Você recebeu ');const s=document.createElement('b');s.textContent='['+it.name+']';s.style.color=RARC[it.rar];d.append(s);appendLog(d);}
function appendLog(d){const L=$('log');L.append(d);while(L.children.length>6)L.firstChild.remove();setTimeout(()=>d.classList.add('old'),10000);}
let bnT;function banner(t,s){const b=$('banner');$('bT').textContent=t;$('bS').textContent=s||'';b.classList.remove('show');void b.offsetWidth;b.classList.add('show');}
const HB=[{k:'Espaço',a:()=>attackKey()},{k:'1',s:0},{k:'2',s:1},{k:'3',s:2},{k:'4',s:3},{k:'5',s:4},{k:'6',s:5},{k:'Q',p:'hp'},{k:'R',p:'mp'}];
let hbEls=[];
// os botões agem ao encostar (pointerdown), não no clique: assim funcionam com outro dedo segurando o joystick (17)
function buildHotbar(){if(!P)return;const hb=$('hotbar');hb.innerHTML='';hbEls=[];const c=CL[P.cls];
 HB.forEach(h=>{if(h.s!=null&&h.s>=3&&!hasTree(P.cls))return;const b=document.createElement('button');b.className='hs';const id=h.s!=null?P.bar[h.s]:null,sk=id&&SK[id];
  const ic=h.s!=null?(sk?sk.ic:''):h.p?'':(P.form?'🐾':c.basic);if(h.s!=null&&!sk)b.classList.add('empty');
  b.innerHTML=`<span class="ic">${ic}</span><span class="k">${h.k==='Espaço'?'␣':h.k}</span><span class="n"></span><span class="cd"></span>`;
  if(h.p){const im=document.createElement('img');im.src=iconURL('pot'+h.p);im.style.cssText='width:70%;image-rendering:pixelated';b.querySelector('.ic').append(im);}
  b.title=sk?`${sk.n}${hasTree(P.cls)?' (rank '+rk(id)+')':''}, ${sk.mp} de mana: ${typeof sk.d==='function'?sk.d(eff(id,rk(id))):sk.d}`:h.s!=null?'Vazio: escolha uma habilidade na árvore (T)':h.p?(h.p==='hp'?'Poção de vida':'Poção de mana'):'Atacar o alvo mais próximo';
  b.dataset.k=h.k;b.onpointerdown=e=>{e.preventDefault();if(h.a)h.a();else if(h.s!=null)useSkill(h.s);else usePot(h.p);};hb.append(b);hbEls.push({h,el:b});});updateHotbar();}
function updateHotbar(){if(!P)return;
 for(const{h,el}of hbEls){if(h.s!=null){const id=P.bar[h.s];if(!id)continue;const sk=SK[id],cd=P.cd[id]||0,tot=sk.cd*(1-P.st.cdr),c=el.querySelector('.cd');
   c.style.background=cd>0?`conic-gradient(rgba(0,0,0,.7) ${cd/tot*360}deg,transparent 0)`:'';c.textContent=cd>0?Math.ceil(cd):'';el.classList.toggle('nomana',P.mp<sk.mp*(1-P.st.mpCut));}
  else if(h.p)el.querySelector('.n').textContent=P.pots[h.p];}}
function flashSlot(i){const e=hbEls[i]&&hbEls[i].el;if(e){e.classList.remove('flash');void e.offsetWidth;e.classList.add('flash');}}
function updateHUD(){const st=P.st;$('hpFill').style.width=(P.hp/st.hp*100)+'%';$('hpTxt').textContent=`${Math.ceil(P.hp)} / ${st.hp}`;
 $('mpFill').style.width=(P.mp/st.mp*100)+'%';$('mpTxt').textContent=`${Math.floor(P.mp)} / ${st.mp}`;$('xpFill').style.width=(P.xp/xpNeed(P.lvl)*100)+'%';$('jxpFill').style.width=(P.jlvl>=jobCap()?100:P.jxp/jobNeed(P.jlvl)*100)+'%';
 $('pLvl').textContent=P.lvl;$('pJob').textContent=P.jlvl;$('pTitle').textContent=title();hudExtra();$('gold').textContent=P.gold;let t=P.target;if(t&&t.fake&&!t.fake.dead)t=Object.assign(Object.create(t),{hp:t.fake.hp,maxHp:t.fake.maxHp});$('tframe').classList.toggle('hidden',!t||t.dead);
 if(t&&!t.dead){$('tName').textContent=`${t.elite?'★ ':''}${t.name} • nível ${t.lvl}`;$('tName').style.color=conColor(t.lvl);$('tFill').style.width=(t.hp/t.maxHp*100)+'%';$('tTxt').textContent=`${Math.max(0,Math.ceil(t.hp))} / ${t.maxHp}`;}
 weightHUD();const it=P.dead?null:nearestInteract(),pr=$('prompt');pr.classList.toggle('hidden',!it);if(it)pr.textContent=promptText(it);
 updateHotbar();}
let sel=null;
function statLine(k,v){return k==='crit'||k==='spd'?`+${v}% ${STN[k]}`:`+${v} ${STN[k]}`;}
function renderBag(){const g=$('invGrid');g.innerHTML='';
 $('bagTabs').querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('on',b.dataset.tab===bagTab));
 const E=bagEntries(),n=Math.max(24,Math.ceil(E.length/6)*6);
 for(let i=0;i<n;i++){const e=E[i],b=document.createElement('button');b.className='slot';
  if(e){if(e.border)b.style.borderColor=e.border;b.innerHTML=`<img src="${e.img}" alt="">`+(e.up?'<span class="up">▲</span>':'')+(e.n>1?`<span class="qt">${e.n}</span>`:'')+(e.ref?`<span class="qt">+${e.ref}</span>`:'');b.title=e.name;
   if(sel&&!sel.eq&&sel.key===e.key)b.classList.add('sel');b.onclick=()=>{sel={key:e.key,eq:false};renderBag();};}
  g.append(b);}
 document.querySelectorAll('[data-eq]').forEach(b=>{const s=b.dataset.eq,it=P.equip[s];b.style.borderColor=it?RARC[it.rar]:'';b.classList.toggle('sel',!!(it&&sel&&sel.key===it.id));
  b.innerHTML=it?`<img src="${iconOf(it)}" alt="">`:`<span class="ph">${SLOTN[s]}</span>`;b.onclick=()=>{if(it){sel={key:it.id,eq:true};renderBag();}};});
 $('dollImg').src=toURL(SPR[heroSpr()].n,6);$('invCount').textContent=E.length?`${E.length} ${E.length>1?'tipos':'tipo'} de item`:'Nada nesta aba';$('sortBtn').style.display=bagTab==='equip'?'':'none';weightBar();
 const st=P.st;$('statsBox').innerHTML=`<span>Nível de Base</span><b>${P.lvl}</b><span>Nível de Classe</span><b>${P.jlvl} / ${jobCap()}</b><span>Vida</span><b>${st.hp}</b><span>Mana</span><b>${st.mp}</b><span>Ataque</span><b>${st.atk}</b><span>Defesa</span><b>${st.def}</b><span>Crítico</span><b>${st.crit}%</b><span>Velocidade</span><b>+${st.spd}%</b><span>Ouro</span><b>${P.gold}</b>`;
 const d=$('detail');if(sel&&!sel.eq&&sel.key.includes(':'))return stackDetail(d,sel.key);
 const it=sel&&(sel.eq?Object.values(P.equip).find(x=>x&&x.id===sel.key):P.inv.find(x=>x.id===sel.key));
 if(!it){d.innerHTML='<span style="color:var(--muted)">Toque num item para ver os detalhes.'+(bagTab==='equip'?' ▲ indica um item melhor que o equipado.':'')+'</span>';return;}
 const cur=P.equip[it.slot];let h=`<h3 class="r${it.rar}">${it.name}</h3><div class="meta">${SLOTN[it.slot]} • nível ${it.ilvl} • ${RAR[it.rar].n}</div>`;
 for(const k in it.stats)h+=`<div>${statLine(k,it.stats[k])}</div>`;
 if(!sel.eq&&cur){const keys=new Set([...Object.keys(it.stats),...Object.keys(cur.stats)]);let cmp='';for(const k of keys){const df=(it.stats[k]||0)-(cur.stats[k]||0);if(df)cmp+=`<span class="${df>0?'pos':'neg'}">${df>0?'+':''}${df} ${STN[k]}</span> `;}if(cmp)h+=`<div style="margin-top:4px;font-size:13px">Comparado ao equipado: ${cmp}</div>`;}
 const near=hyp(NPC.x-P.x,NPC.y-P.y)<70;h+=`<div class="acts">`+(sel.eq?`<button class="btn sm" data-a="un">Remover</button>`:`<button class="btn sm gold" data-a="eq">Equipar</button>`+(near?`<button class="btn sm" data-a="sell">Vender por ${it.value}g</button>`:`<button class="btn sm" data-a="drop">Descartar</button>`))+`</div>`;
 d.innerHTML=h;d.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>itemAction(b.dataset.a,it));}
function itemAction(a,it){const i=P.inv.indexOf(it);
 if(a==='eq'){const old=P.equip[it.slot];P.equip[it.slot]=it;if(old)P.inv[i]=old;else P.inv.splice(i,1);sel={key:it.id,eq:true};log(`Equipou ${it.name}.`,RARC[it.rar]);}
 else if(a==='un'){delete P.equip[it.slot];P.inv.push(it);sel={key:it.id,eq:false};}
 else if(a==='sell'){P.inv.splice(i,1);P.gold+=it.value;sel=null;log(`Vendeu ${it.name} por ${it.value}g.`,'#ffd24a');}
 else{P.inv.splice(i,1);sel=null;}
 recalc();renderBag();save();}
function toggle(el,on){const show=on??el.classList.contains('hidden');el.classList.toggle('hidden',!show);if(el===bagEl&&show)renderBag();}
function openShop(){toggle(shopEl,true);}
function closeAll(){[bagEl,shopEl,helpEl,$('tree'),$('mentor'),$('board'),$('smith'),$('attr')].forEach(e=>e.classList.add('hidden'));}
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).classList.add('hidden'));
document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{const[t,n]=b.dataset.buy.split(','),cost=n==='5'?90:20;if(!canCarry(+n*WPOT)){heavyMsg();return;}if(P.gold<cost){log('Ouro insuficiente.','#ff6b6b');return;}P.gold-=cost;P.pots[t]+=+n;log(`Comprou ${n} poção(ões) de ${t==='hp'?'vida':'mana'}.`,'#ffd24a');updateHotbar();save();});
document.querySelectorAll('[data-sell]').forEach(b=>b.onclick=()=>{const mx=+b.dataset.sell;let g=0,n=0;P.inv=P.inv.filter(it=>{if(it.rar<=mx){g+=it.value;n++;return false;}return true;});P.gold+=g;log(n?`Vendeu ${n} itens por ${g}g.`:'Nada para vender.','#ffd24a');if(!bagEl.classList.contains('hidden'))renderBag();save();});
$('shopBag').onclick=()=>{if(innerWidth<1150)shopEl.classList.add('hidden');toggle(bagEl,true);};
$('sortBtn').onclick=()=>{const o={arma:0,elmo:1,peito:2,botas:3,anel:4};P.inv.sort((a,b)=>b.rar-a.rar||o[a.slot]-o[b.slot]||b.ilvl-a.ilvl);renderBag();};
$('bagBtn').onclick=()=>toggle(bagEl);$('treeBtn').onclick=()=>P&&toggleTree();$('attrBtn').onclick=()=>P&&toggleAttr();$('helpBtn').onclick=()=>toggle(helpEl);$('respBtn').onclick=respawn;$('prompt').onclick=()=>P&&interact(nearestInteract());

// ================== CONTROLES ==================
const keys={};
function attackKey(){if(!P||P.dead)return;let t=P.target&&!P.target.dead?P.target:nearestMon(180);if(t){P.target=t;P.auto=true;P.dest=null;}}
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||!P)return;const k=e.key.toLowerCase();
 if([' ','tab','arrowup','arrowdown','arrowleft','arrowright'].includes(k))e.preventDefault();keys[k]=true;if(e.repeat&&!'123456'.includes(k))return;
 if(k===' ')attackKey();else if(k.length===1&&'123456'.includes(k))useSkill(+k-1);else if(k==='t')toggleTree();else if(k==='p')toggleAttr();else if(k==='q')usePot('hp');else if(k==='r')usePot('mp');
 else if(k==='e'&&!P.dead)interact(nearestInteract());else if(k==='i'||k==='c')toggle(bagEl);else if(k==='escape'){closeAll();P.target=null;P.auto=false;}
 else if(k==='tab'){const list=mons.filter(m=>!m.dead&&hyp(m.x-P.x,m.y-P.y)<200).sort((a,b)=>hyp(a.x-P.x,a.y-P.y)-hyp(b.x-P.x,b.y-P.y));if(list.length){const i=list.indexOf(P.target);P.target=list[(i+1)%list.length];}}});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});addEventListener('blur',()=>{for(const k in keys)keys[k]=false;});
let dragging=false;
function worldAt(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/S+CX,y:(e.clientY-r.top)/S+CY};}
cv.addEventListener('pointerdown',e=>{if(!P||P.dead)return;e.preventDefault();const w=worldAt(e);
 let hit=null;for(const m of mons){if(m.dead)continue;const h=mh(m),hw=Math.max(8,SPR[m.type].n.width*m.sc/2);if(w.x>m.x-hw&&w.x<m.x+hw&&w.y>m.y-h-2&&w.y<m.y+4&&(!hit||m.y>hit.y))hit=m;}
 if(hit){P.target=hit;P.auto=true;P.dest=null;P.pend=null;return;}
 for(const c of chests)if(!c.open&&hyp(c.x-w.x,c.y-6-w.y)<12){P.pend={kind:'chest',o:c};P.dest={x:c.x,y:c.y+2};P.auto=false;return;}
 if(hyp(SMITH.x-w.x,SMITH.y-16-w.y)<18){P.pend={kind:'smith',o:SMITH};P.dest={x:SMITH.x,y:SMITH.y+4};P.auto=false;return;}
 if(hyp(BOARD.x-w.x,BOARD.y-16-w.y)<18){P.pend={kind:'board',o:BOARD};P.dest={x:BOARD.x,y:BOARD.y+4};P.auto=false;return;}
 if(hyp(NPC.x-w.x,NPC.y-8-w.y)<14){P.pend={kind:'npc',o:NPC};P.dest={x:NPC.x,y:NPC.y+10};P.auto=false;return;}
 P.dest=w;P.auto=false;P.pend=null;P.queued=null;dragging=true;fx.push({k:'ring',x:w.x,y:w.y,r0:6,r1:2,t:0,max:.3,color:'#ffffff',w:1});});
cv.addEventListener('pointermove',e=>{if(dragging&&P&&e.buttons)P.dest=worldAt(e);});
addEventListener('pointerup',()=>dragging=false);cv.addEventListener('contextmenu',e=>e.preventDefault());

// ================== INÍCIO ==================
let chosen='guerreiro';
function buildStart(){const box=$('classes');box.innerHTML='';
 for(const k in CL){const c=CL[k],d=document.createElement('button');d.className='ccard frame'+(k===chosen?' on':'');
  d.innerHTML=`<img src="${toURL(previewLook(k),6)}" alt=""><h3>${c.nome}</h3><p>${c.desc}</p><div class="cs">❤️ ${c.hp} • 💧 ${c.mp} • ⚔️ ${c.atk} • 🛡️ ${c.def}</div>`;
  d.onclick=()=>{chosen=k;buildStart();};box.append(d);}
 const s=loadSave(),cb=$('contBox');if(s&&CL[s.cls]){cb.classList.remove('hidden');cb.innerHTML=`<p><b>${s.name}</b>, ${CL[s.cls].nome} de nível ${s.lvl}, espera por você.</p><button class="btn gold" id="contBtn">Continuar aventura</button><p style="margin:8px 0 0;font-size:13px;color:var(--muted)">Criar um novo herói abaixo substitui este progresso.</p>`;$('contBtn').onclick=()=>enter(s);}}
function enter(s){P=newPlayer(s.cls,s.name);if(s.lvl){Object.assign(P,{lvl:s.lvl,xp:s.xp,jlvl:s.jlvl??(s.spec?clamp(s.lvl-9,1,50):Math.min(10,s.lvl)),jxp:s.jxp||0,attr:s.attr||newAttr(ATTR_INI),gold:s.gold,inv:s.inv||[],equip:s.equip||{},pots:s.pots||{hp:3,mp:2},mats:s.mats||{},miss:s.miss||{on:[],cd:{}},ranks:s.ranks,bar:s.bar,spec:s.spec,promo:s.promo,quest:s.quest});if(s.map&&MAPS[s.map]){switchMapNow(s.map,null);const sp=blocked(s.x,s.y,4)||!REACH[Math.floor(s.y/TILE)*W+Math.floor(s.x/TILE)]?freeNear(Math.floor(s.x/TILE),Math.floor(s.y/TILE)):s;P.x=sp.x;P.y=sp.y;}else switchMapNow('valdor',null);}
 initRuntime();restoreNascs();allies.length=0;hinted10=false;if(!s.lvl){const w=genItem(1,0,'arma',0,0);P.equip.arma=w;P.equip.peito=genItem(1,0,'peito',0,0);recalc();P.hp=P.st.hp;P.mp=P.st.mp;}
 const pc=$('portrait').getContext('2d');pc.clearRect(0,0,16,16);lookKey='';heroSpr();$('pName').textContent=P.name;
 $('start').classList.add('hidden');$('hud').classList.remove('hidden');buildHotbar();save();
 log(`Bem-vindo a Valdoria, ${P.name}! Pressione ❓ para ver os controles.`,'#ffe3a0');if(!s.lvl)log('Dica: baús dourados aparecem no minimapa.','#ffe3a0');
 if(attrFree()>0)log(`Você tem ${attrFree()} pontos de atributo para distribuir: pressione P.`,'#8fd0ff');}
$('goBtn').onclick=()=>{const n=$('nameIn').value.trim()||pick(['Aldric','Lyra','Thorne','Mira','Kael','Seren']);enter({cls:chosen,name:n.slice(0,14)});};
$('nameIn').addEventListener('keydown',e=>{if(e.key==='Enter')$('goBtn').click();});
resize();genWorld(CUR);populate();buildStart(); // gera o mapa inicial de novo: arquivos posteriores ao 01 podem ter mudado MAPS (ex.: a casa da Guilda)
let last=performance.now(),hudT=0,miniT=0;
function frame(t){const dt=clamp((t-last)/1000,0,.05);last=t;if(P&&!P.dead&&!loading)update(dt);else if(P)time+=dt;render(dt,t/1000);
 hudT-=dt;if(P&&hudT<=0){hudT=.1;updateHUD();}miniT-=dt;if(miniT<=0){miniT=.25;drawMini();}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
