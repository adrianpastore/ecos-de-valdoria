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
 const[HX,HY]=M.praca||[TC.x,TC.y];NPC.x=M.town?(HX+3.5)*TILE:-9999;NPC.y=M.town?(HY-1)*TILE:-9999;MENTOR.x=M.town?(TC.x-3.5)*TILE:-9999;MENTOR.y=M.town?(TC.y-1)*TILE:-9999;
 if(M.mentorAt!==undefined){MENTOR.x=M.mentorAt?(M.mentorAt[0]+.5)*TILE:-9999;MENTOR.y=M.mentorAt?(M.mentorAt[1]+.5)*TILE:-9999;} // Elara dentro de uma casa (15)
 if(!P)return;
 // chegada: uns 3 tiles do portal, na direção do centro; saindo de uma casa para a rua, na frente da porta (a Torre de Arcádia fica no próprio centro)
 if(from){const e=M.portals[from]||homeOf(M),L=hyp(TC.x-e[0],TC.y-e[1])||1,rua=e[2]==='porta'&&!M.interior;
  const sp=rua?freeNear(Math.round(e[0]),Math.round(e[1])+2):freeNear(Math.round(e[0]+(TC.x-e[0])/L*3),Math.round(e[1]+(TC.y-e[1])/L*3),ground[e[1]*W+e[0]]===G.HIGH);P.x=sp.x;P.y=sp.y;}
 Object.assign(P,{portalCD:1,target:null,auto:false,dest:null,pend:null,volley:null,queued:null});
 P.zone=zoneMap[Math.floor(P.y/TILE)*W+Math.floor(P.x/TILE)];
 for(const a of allies){a.x=P.x+rf(-10,10);a.y=P.y+rf(-6,10);a.target=null;}
 if(P.quest&&P.quest.spec==='druida'&&!P.quest.done&&id==='floresta'){if(!P.quest.nasc)placeNascs();else restoreNascs();}else nascs=[];
 cam.x=P.x-VW/S/2;cam.y=P.y-8-VH/S/2;$('zoneName').textContent=M.n;if(shopEl)shopEl.classList.add('hidden');$('mentor').classList.add('hidden');$('board').classList.add('hidden');
 BOARD.x=M.board?(M.board[0]+1)*TILE:-9999;BOARD.y=M.board?(M.board[1]+1)*TILE+8:-9999;
 SMITH.x=M.smith?(M.smith[0]+.5)*TILE:-9999;SMITH.y=M.smith?(M.smith[1]+1)*TILE+8:-9999;$('smith').classList.add('hidden');
 BAR.x=M.bar?(M.bar[0]+.5)*TILE:-9999;BAR.y=M.bar?(M.bar[1]+1)*TILE+8:-9999;$('taverna').classList.add('hidden');setTalk(M);save();} // bar e gente do salão da Guilda (20)
function portalTick(dt){if(loading)return;if((P.portalCD||0)>0){P.portalCD-=dt;return;}
 for(const to in MAPS[CUR].portals){const p=portalPt(to);if(hyp(P.x-p.x,P.y-p.y)<12){changeMap(to,CUR);return;}}}
function drawPortals(tt){for(const to in MAPS[CUR].portals){if(MAPS[CUR].portals[to][2]==='porta')continue;const p=portalPt(to);
 for(let k=0;k<3;k++){const r=9-k*2.5,a=tt*(2+k)+k;ctx.strokeStyle=['#ff5a3a','#ff9a4a','#ffe0a0'][k];ctx.globalAlpha=.8;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(p.x,p.y,r,r*.5,0,a,a+4.2);ctx.stroke();}
 ctx.globalAlpha=1;if(R()<.3)parts.push({x:p.x+rf(-8,8),y:p.y+rf(-3,3),vx:0,vy:-25,g:0,life:.6,max:.6,color:pick(['#ff5a3a','#ffb060']),s:1});}}
// portas não mostram nome: o símbolo da placa e o mouse (houseAt, em 13) identificam o lugar
function portalLabels(lab){for(const to in MAPS[CUR].portals){if(MAPS[CUR].portals[to][2]==='porta')continue;const p=portalPt(to);lab(MAPS[to].n,p.x,p.y-12,'#ffc890');}}
