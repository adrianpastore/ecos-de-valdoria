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
  t('mapa inicial: a Mestra Elara não está na praça de Valdor',()=>{if(MENTOR.x>0)throw 'Elara ainda na praça';});
  t('mapa inicial já tem a casa da Guilda (herói novo não troca de mapa)',()=>{if(!objRows.some(r=>r.some(o=>o.spr==='guilda')))throw 'Valdor foi gerada antes do 13';});
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
  // inventário em abas, peso e materiais
  t('inventário: todo monstro com material tem sprite',()=>{for(const k in LOOTM){if(!MDEF[k])throw k+' sem monstro';if(!SPR['mat_'+k])throw k+' sem sprite';}info(Object.keys(LOOTM).length+' materiais');});
  t('inventário: peso e capacidade',()=>{enter({cls:'guerreiro',name:'Peso'});P.mats={};const w=weightNow(),esp=(P.pots.hp+P.pots.mp)*WPOT+WT.arma+WT.peito;
   if(w!==esp)throw 'peso '+w+', esperado '+esp;if(capOf()!==725)throw 'capacidade nv1 '+capOf();info('herói novo: '+w+' / '+capOf());});
  t('inventário: elite deixa 2 materiais e o herói pega',()=>{switchMapNow('floresta',null);cura();loots.length=0;const m=makeMon('slime',P.x+30,P.y,3,{elite:true});mons.push(m);killMonster(m);
   const l=loots.find(x=>x.kind==='mat');if(!l||l.n!==2)throw 'material não caiu';for(let i=0;i<120&&loots.includes(l);i++){l.x=P.x;l.y=P.y;update(.05);}if(P.mats.slime!==2)throw 'não pegou: '+JSON.stringify(P.mats);});
  t('inventário: vender materiais',()=>{const g=P.gold;stackAction('sellAll','mat','slime');if(P.gold!==g+2*LOOTM.slime.v||P.mats.slime)throw 'venda errada';});
  t('inventário: acima de 50% não regenera',()=>{P.mats={golem:Math.ceil(capOf()*.6/10)};P.hp=P.st.hp/2;const h=P.hp;P.combatT=-99;for(let i=0;i<40;i++)update(.05);if(P.hp!==h)throw 'regenerou';});
  t('inventário: acima de 90% não ataca',()=>{P.mats={golem:Math.ceil(capOf()*.95/10)};const m=makeMon('slime',P.x+10,P.y,1);mons.push(m);P.target=m;const hp=m.hp;P.atkT=0;basicAttack();useSkill(0);tick(10);
   if(m.hp!==hp)throw 'atacou com peso demais';if(canCarry(WPOT))throw 'deveria recusar mais peso';P.mats={};P.target=null;});
  t('inventário: as 3 abas aparecem na bolsa',()=>{P.mats={esquilo:5,lobo:1};P.inv.push(genItem(5,0,'elmo'));for(const tb of['uso','equip','etc']){bagTab=tb;sel=null;renderBag();const E=bagEntries();if(!E.length)throw 'aba '+tb+' vazia';sel={key:E[0].key,eq:false};renderBag();}
   if($('invGrid').querySelector('.qt').textContent!=='5')throw 'pilha sem quantidade';bagTab='equip';sel=null;});
  t('inventário: save antigo, sem materiais, carrega',()=>{enter({v:1,name:'Antigo',cls:'mago',lvl:5,xp:0,gold:10,inv:[],equip:{},pots:{hp:2,mp:1},x:(TC.x+.5)*TILE,y:(TC.y+2.5)*TILE,map:'valdor'});
   if(!P.mats||Object.keys(P.mats).length)throw 'mats não iniciou vazio';if(!(weightNow()>0))throw 'peso inválido';saveReal();if(loadSave().v!==3||!loadSave().mats||!loadSave().miss)throw 'save novo sem v:3, mats ou miss';});
  // Guilda de Valdor: interior e mural de missões
  t('guilda: entrar pela porta e achar o mural',()=>{switchMapNow('valdor',null);switchMapNow('guilda','valdor');cura();if(!(BOARD.x>0))throw 'mural sem posição';
   P.x=BOARD.x;P.y=BOARD.y+6;const it=nearestInteract();if(!it||it.kind!=='board')throw 'mural não é o objeto mais próximo';interact(it);
   if($('board').classList.contains('hidden'))throw 'painel não abriu';const n=$('boardBody').querySelectorAll('.mcard').length;if(n!==MISS.filter(q=>q.city==='valdor').length)throw n+' missões no painel';closeAll();});
  t('Valdor: muralha com portões e torres',()=>{switchMapNow('valdor',null);const c={};for(const r of objRows)for(const o of r)c[o.spr]=(c[o.spr]||0)+1;
   if(!c.muroH||!c.muroV)throw 'sem muro';const saidas=Object.values(MAPS.valdor.portals).filter(p=>p[2]!=='porta').length;if((c.torre||0)<4+2*saidas)throw 'só '+(c.torre||0)+' torres';
   info((c.muroH+c.muroV)+' trechos de muro, '+c.torre+' torres, '+((c.banca||0)+(c.banca2||0))+' bancas, '+(c.poco||0)+' poço, '+(c.lampiao||0)+' lampiões');});
  t('Pinheiral: paliçada de madeira e cabanas rústicas',()=>{switchMapNow('pinheiral',null);const c={};for(const r of objRows)for(const o of r)c[o.spr]=(c[o.spr]||0)+1;
   const saidas=Object.values(MAPS.pinheiral.portals).filter(p=>p[2]!=='porta').length;if(!c.paliH||!c.paliV)throw 'sem paliçada';if((c.torreM||0)<4+2*saidas)throw 'só '+(c.torreM||0)+' torres de vigia';
   if(c.muroH||c.torre)throw 'Pinheiral não devia ter muro de pedra';if(Object.keys(c).some(k=>/^house\d/.test(k)))throw 'ainda há casa de Valdor em Pinheiral';
   for(const s of['casaElaraR','ferrariaR','guilda2'])if(!c[s])throw 'serviço sem cabana: '+s;info(c.torreM+' torres de vigia, '+((c.cabana1||0)+(c.cabana2||0))+' cabanas comuns');});
  t('Valdor: casas comuns e o nome da Guilda ao passar o mouse',()=>{switchMapNow('valdor',null);let casas=0,g=null;for(const r of objRows)for(const o of r){if(/^house/.test(o.spr))casas++;if(o.spr==='guilda')g=o;}
   if(casas<6)throw 'só '+casas+' casas comuns';const h=houseAt(g.px,g.py-10);if(!h||h.label!=='Guilda de Valdor')throw 'mouse sobre a Guilda mostrou: '+(h&&h.label);
   if(houseAt((TC.x+.5)*TILE,(TC.y+.5)*TILE))throw 'a praça não devia ter nome';info(casas+' casas comuns + a Guilda');});
  t('casa da Mestra Elara: ela atende lá dentro',()=>{switchMapNow('valdor',null);if(MENTOR.x>0)throw 'Elara continua na praça de Valdor';
   let c=null;for(const r of objRows)for(const o of r)if(o.spr==='casaElara')c=o;if(!c||c.label!=='Casa da Mestra Elara')throw 'casa sem sprite ou nome';
   switchMapNow('casaElara','valdor');cura();if(!(MENTOR.x>0))throw 'Elara não está na casa';P.x=MENTOR.x;P.y=MENTOR.y+14;const it=nearestInteract();if(!it||it.kind!=='mentor')throw 'não dá para falar com ela';
   interact(it);if($('mentor').classList.contains('hidden'))throw 'janela da mentora não abriu';closeAll();
});
  t('toda cidade principal tem Bento, Guilda, Elara e ferreiro',()=>{const cid=Object.keys(MAPS).filter(k=>MAPS[k].town);if(cid.length<2)throw 'cidades: '+cid;
   for(const c of cid){switchMapNow(c,null);if(!(NPC.x>0))throw c+': sem o Bento na praça';if(MENTOR.x>0)throw c+': Elara devia estar dentro de casa';
    const sp=new Set();for(const r of objRows)for(const o of r)if(o.label)sp.add(o.spr);for(const s of['casaElara','ferraria'])if(![...sp].some(x=>x.startsWith(s)))throw c+': sem a casa '+s;
    if(![...sp].some(s=>/^guilda/.test(s)))throw c+': sem Guilda';
    for(const to in MAPS[c].portals){const I=MAPS[to];if(!I.interior)continue;switchMapNow(to,c);cura();
     if(I.mentorAt){P.x=MENTOR.x;P.y=MENTOR.y+14;if((nearestInteract()||{}).kind!=='mentor')throw to+': não fala com a Elara';}
     if(I.smith){P.x=SMITH.x;P.y=SMITH.y+4;if((nearestInteract()||{}).kind!=='smith')throw to+': não fala com o ferreiro';}
     if(I.board){P.x=BOARD.x;P.y=BOARD.y+6;if((nearestInteract()||{}).kind!=='board')throw to+': não acha o mural';}
     switchMapNow(c,to);}}
   info(cid.map(c=>MAPS[c].n).join(' e ')+': os 4 serviços');});
  t('ferreiro: casa, interior e conversa',()=>{switchMapNow('valdor',null);let c=null;for(const r of objRows)for(const o of r)if(o.spr==='ferraria')c=o;if(!c||c.label!=='Ferreiro')throw 'casa sem sprite ou nome';
   switchMapNow('ferraria','valdor');cura();if(!(SMITH.x>0))throw 'ferreiro sem posição';P.x=SMITH.x;P.y=SMITH.y+4;const it=nearestInteract();if(!it||it.kind!=='smith')throw 'não dá para falar com ele';
   interact(it);if($('smith').classList.contains('hidden'))throw 'painel não abriu';closeAll();});
  t('ferreiro: +1 a +5 sem risco, custo dobrando e material certo',()=>{const arma=genItem(10,0,'arma'),elmo=genItem(10,0,'elmo');P.inv.push(arma,elmo);P.gold=100000;P.mats={zumbi:5,golem:1};
   const atk0=arma.stats.atk,g0=P.gold,falha=()=>.99;for(let i=0;i<5;i++)refine(arma,falha);
   if(arma.ref!==5)throw 'chegou só a +'+arma.ref;if(P.gold!==g0-3100)throw 'custo errado: '+(g0-P.gold);if(P.mats.zumbi)throw 'não gastou 1 minério por vez';
   if(!(arma.stats.atk>atk0))throw 'ataque não subiu';if(!/ \+5$/.test(arma.name))throw 'nome sem +5: '+arma.name;
   refine(elmo,falha);if(elmo.ref!==1||P.mats.golem)throw 'elmo devia usar Núcleo de Pedra';
   refine(arma);if(arma.ref!==5)throw 'refinou sem minério';info(arma.name+': ataque '+atk0+' → '+arma.stats.atk);});
  t('ferreiro: do +6 em diante pode falhar e quebrar; limite +10',()=>{const a=genItem(10,0,'arma');a.ref=5;refStats(a);P.equip.arma=a;P.gold=10**7;P.mats={zumbi:20};
   const seq=v=>{let i=0;return()=>v[i++];};
   refine(a,seq([.99,.9]));if(a.ref!==5||P.equip.arma!==a)throw 'falhou mas devia resistir';
   refine(a,seq([.99,.1]));if(P.equip.arma)throw 'devia ter quebrado e saído do corpo';
   const b=genItem(10,0,'arma');P.inv.push(b);for(let i=0;i<12;i++)refine(b,()=>0);if(b.ref!==10)throw 'limite: +'+b.ref;recalc();});
  t('guilda de Pinheiral: casa, salão e missões da região',()=>{switchMapNow('pinheiral',null);if(!objRows.some(r=>r.some(o=>o.spr==='guilda2')))throw 'sem a casa da Guilda';switchMapNow('guildaPinheiral','pinheiral');cura();
   P.x=BOARD.x;P.y=BOARD.y+6;interact(nearestInteract());const cards=$('boardBody').querySelectorAll('.mcard').length,esp=MISS.filter(q=>q.city==='pinheiral').length;if(!esp||cards!==esp)throw cards+' de '+esp+' missões';
   for(const q of MISS)if(!MAPS[q.map]||!LOOTM[q.mat])throw q.id+': mapa ou material inexistente';info(MAPS.guildaPinheiral.n+': '+esp+' missões');closeAll();});
  t('guilda: aceitar, juntar e entregar uma missão',()=>{P.miss={on:[],cd:{}};P.mats={};const q=MISS[0],r=missRew(q);missAction('aceitar',q.id);if(missState(q)!=='aceita')throw 'não aceitou';
   P.mats[q.mat]=q.n+2;if(missState(q)!=='pronta')throw 'não ficou pronta';const g=P.gold;missAction('entregar',q.id);
   if(P.gold!==g+r.g)throw 'ouro errado';if(P.mats[q.mat]!==2)throw 'não tirou só '+q.n+' materiais';if(missState(q)!=='espera')throw 'não entrou em espera';
   missAction('aceitar',q.id);if(P.miss.on.length)throw 'aceitou em espera';info(q.t+': +'+r.g+'g, +'+r.xp+' XP');});
  t('guilda: no máximo '+MISS_MAX+' missões aceitas',()=>{P.miss={on:[],cd:{}};for(const q of MISS)missAction('aceitar',q.id);if(P.miss.on.length!==MISS_MAX)throw P.miss.on.length+' aceitas';P.miss={on:[],cd:{}};});
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
