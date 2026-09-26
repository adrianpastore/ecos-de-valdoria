// Ecos de Valdoria — Teste de fumaça
// Carregado pelo index.html quando a página é aberta com ?teste (veja tests/smoke.html).
// Percorre as 3 classes, habilidades, mapas, portais, chefes e save, e mostra o resultado na tela.
// O save do jogador é guardado antes e devolvido no final: rodar o teste não apaga o progresso.
'use strict';
(function(){
 const out=[];let falhas=0;
 const ok=m=>out.push('OK    '+m),info=m=>out.push('      '+m);
 const bad=(m,e)=>{falhas++;out.push('FALHA '+m+' :: '+(e&&e.stack?e.stack.split('\n').slice(0,3).join(' | '):e));};
 const t=(m,f)=>{try{f();ok(m);}catch(e){bad(m,e);}};
 const tick=n=>{for(let i=0;i<n;i++){if(P&&!P.dead)update(.05);render(.05,i*.05);}};
 const cura=()=>{P.dead=false;P.hp=P.st.hp;P.mp=P.st.mp;};
 const ehChefe=m=>m.boss||(MDEF[m.type]&&MDEF[m.type].boss);

 // Protege o save verdadeiro: o jogo salva sozinho em vários momentos
 const saveOriginal=localStorage.getItem(SAVEKEY),saveReal=save;save=()=>{};

 try{
  for(const cls of Object.keys(CL)){
   t(cls+': criar herói',()=>enter({cls,name:'Teste'}));
   t(cls+': 200 quadros em Valdor',()=>tick(200));
   t(cls+': subir até o nível 30',()=>{for(let i=0;i<40&&P.lvl<30;i++)gainXp(xpNeed(P.lvl));if(P.lvl<30)throw 'parou no nível '+P.lvl;});
   t(cls+': aprender habilidades da base',()=>{let n=0;for(let r=0;r<6;r++)for(const id in SK)if(!canLearn(id)&&learn(id))n++;
    if(!n)throw 'nenhuma habilidade aprendida';info(n+' ranks aprendidos, '+ptsFree()+' pontos livres, '+P.bar.filter(Boolean).length+' na hotbar');});
   t(cls+': especialização e promoção',()=>{const s=Object.keys(SPECS).find(k=>SPECS[k].cls===cls);if(!s)throw 'classe sem especialização';
    P.spec=s;P.promo=1;for(let r=0;r<6;r++)for(const id in SK)if(!canLearn(id))learn(id);recalc();info(SPECS[s].n+', '+ptsFree()+' pontos livres');});
   t(cls+': usar a hotbar 1 a 6 em campo',()=>{switchMapNow('floresta',null);cura();
    for(let r=0;r<3;r++){for(let s=0;s<6;s++){try{useSkill(s);}catch(e){throw 'tecla '+(s+1)+': '+e;}}tick(60);cura();}});
   t(cls+': salvar e carregar',()=>{saveReal();const s=loadSave();if(!s||s.cls!==cls||s.lvl!==P.lvl||s.map!==CUR)throw 'o save não bate com o herói';});
  }
  for(const id of Object.keys(MAPS))t('mapa '+id,()=>{cura();switchMapNow(id,null);tick(120);drawMini();updateHUD();});
  t('todo monstro dos mapas tem dados e sprite',()=>{for(const id in MAPS)for(const[tp]of MAPS[id].mons||[]){if(!MDEF[tp])throw id+': '+tp+' sem MDEF';if(!SPR[tp])throw id+': '+tp+' sem sprite';}});
  t('morcegos nascem em bando',()=>{switchMapNow('caverna1',null);mons.length=0;for(let k=0;k<30&&!mons.some(m=>m.type==='morcego');k++)spawnMon(7,false);
   const b=mons.filter(m=>m.type==='morcego').length;if(b<3)throw 'só '+b+' morcego(s)';info('bando de '+b+' morcegos');});
  for(const id of Object.keys(MAPS).filter(k=>MAPS[k].cave))t('caverna '+id+': corredores e escuridão',()=>{switchMapNow(id,null);
   let f=0;for(let i=0;i<W*H;i++)if(REACH[i])f++;const pct=Math.round(f/(W*H)*100);if(pct<12||pct>60)throw 'o chão alcançável ocupa '+pct+'% do mapa';
   const tipos={};for(const m of mons)tipos[m.name]=(tipos[m.name]||0)+1;info(pct+'% de chão alcançável • '+Object.entries(tipos).map(([k,v])=>v+' '+k).join(', '));cura();tick(60);});
  const livre=(x,y)=>{const j=Math.floor(y/TILE)*W+Math.floor(x/TILE);return!solid[j]&&REACH[j];};
  for(const id of Object.keys(MAPS))for(const dest in MAPS[id].portals){
   t('portal '+id+' → '+dest,()=>{if(!MAPS[dest])throw 'destino não existe';if(!MAPS[dest].portals[id])throw 'não há portal de volta';
    switchMapNow(id,null);const p=portalPt(dest);if(!livre(p.x,p.y))throw 'o portal não é alcançável a pé';
    switchMapNow(dest,id);if(!livre(P.x,P.y))throw 'a chegada caiu em lugar bloqueado';const b=portalPt(id);if(hyp(P.x-b.x,P.y-b.y)>8*TILE)throw 'chegou longe do portal de volta';tick(5);});}
  for(const id of Object.keys(MAPS).filter(k=>MAPS[k].boss))
   t('chefe de '+id+' ('+MDEF[MAPS[id].boss].n+')',()=>{switchMapNow(id,null);const b=mons.find(ehChefe);if(!b)throw 'o chefe não apareceu';
    P.x=b.x+40;P.y=b.y;for(let i=0;i<300;i++){cura();update(.05);}render(.05,0);});
 }catch(e){bad('teste interrompido',e);}

 // Devolve o save original e volta para a tela inicial
 try{if(saveOriginal===null)localStorage.removeItem(SAVEKEY);else localStorage.setItem(SAVEKEY,saveOriginal);}catch(e){}
 P=null;$('hud').classList.add('hidden');$('start').classList.remove('hidden');

 const errs=window.__errs||[];falhas+=errs.length;
 const txt=['=== TESTE DE FUMAÇA: '+(falhas?falhas+' PROBLEMA(S)':'TUDO OK')+' ===',...out,'=== ERROS NO CONSOLE ('+errs.length+') ===',...errs.slice(0,30)].join('\n');
 document.title=falhas?'SMOKE FALHOU':'SMOKE OK';
 const pre=document.createElement('pre');pre.id='smoke';pre.textContent=txt;
 pre.style.cssText='position:fixed;inset:0;z-index:9999;margin:0;padding:16px;overflow:auto;background:#1b1320;color:'+(falhas?'#ff9a7a':'#b8f0a0')+';font:13px/1.45 monospace;white-space:pre-wrap';
 document.body.append(pre);
})();
