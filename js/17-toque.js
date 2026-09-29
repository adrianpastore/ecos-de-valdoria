// Ecos de Valdoria — Controles de toque (celular): joystick, botões grandes em arco, tela cheia e aviso de girar
'use strict';
// Modo de controle: 'auto' segue o jeito de jogar (tocou na tela → toque; teclado ou mouse → computador).
// A escolha fica no aparelho (não no save): cada aparelho tem o seu jeito de jogar.
const CTLKEY='valdoria_controles';
let ctlPref='auto',touchUI=false;try{ctlPref=localStorage.getItem(CTLKEY)||'auto';}catch(e){}
const coarse=()=>typeof matchMedia==='function'&&matchMedia('(pointer: coarse)').matches;
function setTouchUI(on){on=!!on;if(touchUI===on)return;touchUI=on;document.body.classList.toggle('toque',on);if(!on)joyEnd();}
function applyCtl(){setTouchUI(ctlPref==='auto'?coarse():ctlPref==='toque');document.querySelectorAll('[data-ctl]').forEach(b=>b.classList.toggle('on',b.dataset.ctl===ctlPref));}
function setCtl(p){ctlPref=p;try{localStorage.setItem(CTLKEY,p);}catch(e){}applyCtl();}
addEventListener('pointerdown',e=>{if(ctlPref==='auto')setTouchUI(e.pointerType==='touch');},true);
addEventListener('keydown',e=>{if(ctlPref==='auto'&&e.target.tagName!=='INPUT')setTouchUI(false);},true);
document.querySelectorAll('[data-ctl]').forEach(b=>b.onclick=()=>setCtl(b.dataset.ctl));

// ================== JOYSTICK ==================
// Nasce onde o polegar encosta (dentro da área do canto esquerdo) e volta ao lugar ao soltar.
// JOY.x/JOY.y vão de -1 a 1 e são lidos no update (02), como as teclas WASD.
const JOY={on:false,x:0,y:0,id:null,cx:0,cy:0},JOYR=48;
function joyMove(e){let dx=e.clientX-JOY.cx,dy=e.clientY-JOY.cy;const l=hyp(dx,dy);if(l>JOYR){dx*=JOYR/l;dy*=JOYR/l;}
 $('joyKnob').style.transform=`translate(${dx}px,${dy}px)`;const on=l>JOYR*.22;JOY.x=on?dx/JOYR:0;JOY.y=on?dy/JOYR:0;} // zona morta no meio
function joyEnd(){JOY.on=false;JOY.x=JOY.y=0;JOY.id=null;const k=$('joyKnob'),b=$('joyBase');if(k)k.style.transform='';if(b)b.style.left=b.style.top='';}
{const z=$('joy');if(z){
 z.addEventListener('pointerdown',e=>{if(!P||P.dead||JOY.on)return;e.preventDefault();try{z.setPointerCapture(e.pointerId);}catch(_){}
  const r=z.getBoundingClientRect(),b=$('joyBase'),h=b.offsetWidth/2,x=clamp(e.clientX-r.left,h,r.width-h),y=clamp(e.clientY-r.top,h,r.height-h);
  b.style.left=(x-h)+'px';b.style.top=(y-h)+'px';Object.assign(JOY,{on:true,id:e.pointerId,cx:r.left+x,cy:r.top+y});joyMove(e);});
 z.addEventListener('pointermove',e=>{if(JOY.on&&e.pointerId===JOY.id)joyMove(e);});
 for(const ev of['pointerup','pointercancel','lostpointercapture'])z.addEventListener(ev,e=>{if(e.pointerId===JOY.id)joyEnd();});}}

// ================== TELA CHEIA E PAISAGEM ==================
// Só dá para pedir tela cheia num gesto do jogador: ao entrar no jogo (Criar herói / Continuar) ou pelo botão da ajuda.
function goFull(){const d=document.documentElement,f=d.requestFullscreen||d.webkitRequestFullscreen;if(!f||document.fullscreenElement||document.webkitFullscreenElement)return;
 try{const p=f.call(d);const lock=()=>{try{screen.orientation.lock('landscape').catch(()=>{});}catch(_){}};if(p&&p.then)p.then(lock,()=>{});else lock();}catch(_){}}
addEventListener('click',e=>{if(touchUI&&e.target.closest&&e.target.closest('#goBtn,#contBtn'))goFull();},true);
{const b=$('fullBtn');if(b)b.onclick=goFull;}
applyCtl();
