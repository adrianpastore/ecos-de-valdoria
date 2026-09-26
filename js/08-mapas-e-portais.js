// Ecos de Valdoria — Troca de mapas, portais e tela de carregamento
'use strict';
// ================== TROCA DE MAPAS ==================
const MSTATE={};let loading=false;
function changeMap(id,from){if(loading||!MAPS[id])return;loading=true;const M=MAPS[id],L=$('loading');
 $('ldName').textContent=M.n;$('ldSub').textContent=M.s;L.style.setProperty('--ldc',M.color||'#2a3a2a');L.classList.remove('hidden','out');
 setTimeout(()=>{switchMapNow(id,from);setTimeout(()=>{L.classList.add('out');loading=false;banner(M.n,M.s);setTimeout(()=>L.classList.add('hidden'),320);},500);},320);}
function switchMapNow(id,from){const prev=CUR;
 if(prev!==id){MSTATE[prev]={mons:mons.splice(0),chests:chests.splice(0),loots:loots.splice(0)};}
 for(const a of[projs,fx,parts,texts,teles,pAoe,traps,mproj])a.length=0;
 CUR=id;genWorld(id);const M=MAPS[id],st=MSTATE[id];
 if(prev!==id){if(st){mons.push(...st.mons);chests.push(...st.chests);loots.push(...st.loots);delete MSTATE[id];}else populate();}
 NPC.x=M.town?(TC.x+3.5)*TILE:-9999;NPC.y=M.town?(TC.y-1)*TILE:-9999;MENTOR.x=M.town?(TC.x-3.5)*TILE:-9999;MENTOR.y=M.town?(TC.y-1)*TILE:-9999;
 if(!P)return;
 if(from){const side=Object.keys(M.exits).find(s=>M.exits[s]===from)||Object.keys(M.exits)[0],e=EDGE[side],v=INW[side];P.x=(e[0]+.5+v[0]*3)*TILE;P.y=(e[1]+.5+v[1]*3)*TILE;}
 Object.assign(P,{portalCD:1,target:null,auto:false,dest:null,pend:null,volley:null,queued:null});
 P.zone=zoneMap[Math.floor(P.y/TILE)*W+Math.floor(P.x/TILE)];
 for(const a of allies){a.x=P.x+rf(-10,10);a.y=P.y+rf(-6,10);a.target=null;}
 if(P.quest&&P.quest.spec==='druida'&&!P.quest.done&&id==='floresta'){if(!P.quest.nasc)placeNascs();else restoreNascs();}else nascs=[];
 cam.x=P.x-VW/S/2;cam.y=P.y-8-VH/S/2;$('zoneName').textContent=M.n;if(shopEl)shopEl.classList.add('hidden');$('mentor').classList.add('hidden');save();}
function portalTick(dt){if(loading)return;if((P.portalCD||0)>0){P.portalCD-=dt;return;}
 const M=MAPS[CUR];for(const s in M.exits){const p=portalPt(s);if(hyp(P.x-p.x,P.y-p.y)<12){changeMap(M.exits[s],CUR);return;}}}
function drawPortals(tt){const M=MAPS[CUR];for(const s in M.exits){const p=portalPt(s);
 for(let k=0;k<3;k++){const r=9-k*2.5,a=tt*(2+k)+k;ctx.strokeStyle=['#ff5a3a','#ff9a4a','#ffe0a0'][k];ctx.globalAlpha=.8;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x,p.y,r,r*.5,0,a,a+4.2);ctx.stroke();}
 ctx.globalAlpha=1;if(R()<.3)parts.push({x:p.x+rf(-8,8),y:p.y+rf(-3,3),vx:0,vy:-25,g:0,life:.6,max:.6,color:pick(['#ff5a3a','#ffb060']),s:1});}}
function portalLabels(lab){const M=MAPS[CUR];for(const s in M.exits){const p=portalPt(s);lab(MAPS[M.exits[s]].n,p.x,p.y-12,'#ffc890');}}
