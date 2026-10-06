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
   t(cls+': subir até o nível 30',()=>{for(let i=0;i<40&&P.lvl<30;i++)gainXp(xpNeed(P.lvl));if(P.lvl<30)throw 'parou no nível '+P.lvl;
    if(P.jlvl!==10||P.jxp!==0)throw 'Classe deveria parar no 10 antes do caminho: '+P.jlvl;if(ptsTotal()!==9)throw 'pontos da classe inicial: '+ptsTotal();
    P.attr[MAINAT[cls]]+=Math.min(94,attrFree());P.attr.vita+=attrFree();recalc();cura();}); // distribui como um jogador faria
   t(cls+': aprender habilidades da base',()=>{let n=0;for(let r=0;r<6;r++)for(const id in SK)if(!canLearn(id)&&learn(id))n++;
    if(!n)throw 'nenhuma habilidade aprendida';info(n+' ranks aprendidos, '+ptsFree()+' pontos livres, '+P.bar.filter(Boolean).length+' na hotbar');});
   t(cls+': especialização e promoção',()=>{const s=Object.keys(SPECS).find(k=>SPECS[k].cls===cls);if(!s)throw 'classe sem especialização';
    acceptTrial(s);if(!P.quest)throw 'não aceitou a prova na Classe 10';P.quest.prog=P.quest.goal;P.quest.done=true;completeTrial();
    if(P.spec!==s||P.jlvl!==1)throw 'o nível de Classe não recomeçou do 1';promote();if(P.promo>=2)throw 'promoveu antes da Classe 25';
    let base=P.lvl;for(let i=0;i<200&&P.jlvl<25;i++)gainXp(jobNeed(P.jlvl));promote();if(P.promo!==2)throw 'sem promoção na Classe 25';
    for(let r=0;r<6;r++)for(const id in SK)if(!canLearn(id))learn(id);recalc();info(SPECS[s].n+': Classe '+P.jlvl+', Base '+base+' → '+P.lvl+', '+ptsFree()+' pontos livres');});
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
  t('Senhor dos Ossos: longe da escada, ergue servos que curam e somem com ele',()=>{switchMapNow('caverna3',null);const b=mons.find(ehChefe);if(!b||b.type!=='senhorOssos')throw 'o chefe não apareceu';
   const j=Math.floor(b.y/TILE)*W+Math.floor(b.x/TILE);if(solid[j]||!REACH[j])throw 'nasceu em lugar bloqueado';const e=portalPt('caverna2'),dist=hyp(b.x-e.x,b.y-e.y)/TILE;if(dist<25)throw 'perto demais da escada: '+dist.toFixed(0);
   P.x=b.x+40;P.y=b.y;b.state='chase';b.ai.call=0;cura();update(.05);const serv=mons.filter(c=>c.owner===b);if(serv.length<1)throw 'não ergueu esqueletos';
   b.hp=b.maxHp*.6;const h=b.hp;for(let i=0;i<10;i++){cura();update(.05);}if(b.hp<=h)throw 'os servos não curaram o chefe';
   b.hp=b.maxHp*.4;cura();update(.05);if(!b.ai.rage)throw 'não se enfureceu na metade da vida';
   killMonster(b);if(serv.some(c=>!c.dead))throw 'os servos não sumiram com o chefe';if(!LOOTM.senhorOssos)throw 'sem material';
   info(serv.length+' servos, a '+dist.toFixed(0)+' tiles da escada');});
  t('armas: cada arma tem desenho próprio na mão e na bolsa (4 de cada classe e as 2 lendárias)',()=>{for(const cls of Object.keys(CL)){const vistos=new Set(),ics=new Set();
   if(WART[cls].length!==6)throw cls+': '+WART[cls].length+' desenhos';
   for(let k=0;k<6;k++){const t=Math.min(k,3),rar=k<4?1:4,name=k<4?CL[cls].weapons[t]:LEG.arma[cls][k-4],it={cls,ilvl:t*6+1,rar,slot:'arma',name};
    if(weapKind(it)!==k)throw name+' caiu no desenho '+weapKind(it);const a=WART[cls][k];if(a.r.length>16||a.r.some(r=>r.length>16))throw name+' maior que 16';if(!a.r.some(r=>r.includes('+')))throw name+' sem empunhadura';
    const c=composeHero(cls,{arma:it});if(c.width!==HGW||c.height!==HGH)throw 'herói '+c.width+'×'+c.height;const g=c.getContext('2d').getImageData(0,0,HGW,HGH).data.join(',');
    if(vistos.has(g))throw name+' igual a outra arma';vistos.add(g);const ic=weapIcon(it);if(ics.has(ic))throw name+': ícone repetido';ics.add(ic);}
   const ref={cls,ilvl:19,rar:4,slot:'arma',name:LEG.arma[cls][1]+' +3',base:LEG.arma[cls][1]};if(weapKind(ref)!==5)throw 'lendária refinada perdeu o desenho';}
   const it=genItem(8,0,'arma');if(!iconOf(it).startsWith('data:image'))throw 'ícone da bolsa';});
  t('habilidades: ícones desenhados na barra e na árvore',()=>{for(const id in SKICON){if(!SK[id])throw id+' não é habilidade';const D=SKICON[id];if(D.s.length>12||D.s.some(r=>r.length>12))throw id+' maior que 12×12';
    if(!/^data:image\/png/.test(skIconURL(id)))throw id+' sem imagem';}
   enter({cls:'mago',name:'Icones'});P.ranks.fogo=1;P.bar[0]='fogo';buildHotbar();if(!document.querySelector('#hotbar .hs[data-k="1"] img.ski'))throw 'a barra não mostra o ícone da Bola de Fogo';
   treeSel='fogo';renderTree();if(!document.querySelector('#treeBody .node img.ski'))throw 'a árvore não mostra o ícone';if(!$('treeDet').querySelector('img.ski'))throw 'o detalhe não mostra o ícone';
   for(const id in SK)if(!SKICON[id])throw SK[id].n+' sem ícone desenhado';treeSel=null;info(Object.keys(SKICON).length+' ícones');});
  t('cenário: pontes, arcos nos portões e cachoeiras',()=>{enter({cls:'guerreiro',name:'Cena'});switchMapNow('pantano',null);if(!BRG.some(v=>v))throw 'o Pântano ficou sem ponte';
   const arcos=id=>{switchMapNow(id,null);let a=0;for(const r of objRows)for(const o of r)if(/^arco/.test(o.spr)){a++;if(solid[o.ty*W+o.tx])throw 'arco em cima de tile sólido em '+id;}return a;};
   const av=arcos('valdor'),ap=arcos('pinheiral'),aa=arcos('arcadia');if(av<4||ap<3||aa<4)throw `arcos: Valdor ${av}, Pinheiral ${ap}, Arcádia ${aa}`;
   let c=0;for(const id of['encosta2','encosta5']){switchMapNow(id,null);c+=FALLS.length;}if(!c)throw 'nenhuma cachoeira nas Encostas';
   switchMapNow('valdor',null);info(`arcos: ${av}+${ap}+${aa}, cachoeiras nas Encostas 02 e 05: ${c}`);});
  t('menu de testes: escondido e save de verdade sem ?dev',()=>{if(DEV||$('devBtn')||$('devm'))throw 'o menu de testes apareceu sem ?dev';if(SAVEKEY!=='valdoria_save_v1')throw 'a chave do save mudou: '+SAVEKEY;});
  // inventário em abas, peso e materiais
  t('inventário: todo monstro com material tem sprite',()=>{for(const k in LOOTM){if(!MDEF[k])throw k+' sem monstro';if(!SPR['mat_'+k])throw k+' sem sprite';if(!MATSHP[k])throw k+' sem desenho próprio';if(MATSHP[k][0].some(r=>r.length>16))throw k+' mais largo que 16';}
   const vis=new Set(Object.keys(LOOTM).map(k=>MATSHP[k][0].join('/')));if(vis.size!==Object.keys(LOOTM).length)throw 'dois materiais com o mesmo desenho';info(Object.keys(LOOTM).length+' materiais');});
  t('Estrada do Sul: sem árvore ao lado da passagem do rio (clear)',()=>{genWorld('estrada');const ok=!(objRows[10]||[]).some(o=>o.tx===21)&&!solid[10*W+21];genWorld(CUR);if(!ok)throw 'ainda há algo no tile 21,10';});
  t('toque: modo toque, botões em arco e joystick anda',()=>{enter({cls:'arqueira',name:'Toque'});switchMapNow('valdor',null);cura();
   setTouchUI(true);const on=document.body.classList.contains('toque');buildHotbar();const atk=document.querySelector('#hotbar .hs[data-k="Espaço"]');
   if(innerWidth>innerHeight){toggle(bagEl,true);const col=getComputedStyle($('detail')).gridColumnStart;
    dollView('st');const vs=getComputedStyle(document.querySelector('.doll')).display+'/'+getComputedStyle($('statsBox')).display;dollView('eq');closeAll();
    if(vs.split('/')[0]!=='none'||vs.split('/')[1]==='none')throw 'no celular, "Status" não troca o boneco pelos status ('+vs+')';if(col!=='2')throw 'no toque deitado, os detalhes da bolsa não ficam ao lado da lista';}
   P.x=(TC.x+3)*TILE+8;P.y=TC.y*TILE+8;P.dest=null;P.target=null;P.auto=false;const x0=P.x,y0=P.y;Object.assign(JOY,{on:true,x:-.7,y:-.7});tick(10);
   const d=hyp(P.x-x0,P.y-y0),face=P.face;joyEnd();setTouchUI(false);const off=!document.body.classList.contains('toque');
   if(!on||!off)throw 'a classe toque não liga/desliga';if(!atk)throw 'botão de ataque sem data-k';if(d<10||P.y>=y0)throw 'joystick não moveu o herói ('+d.toFixed(1)+'px)';if(face!==-1)throw 'herói não virou para a esquerda';
   if(JOY.x||JOY.y)throw 'joystick não zerou ao soltar';info('andou '+d.toFixed(0)+' px em meio segundo');});
  t('desempenho: modo leve, partículas, vinheta em CSS e troca automática',()=>{const q0=localStorage.getItem(QKEY),p0=qualPref;
   setQual('leve');const d1=DPR;for(let i=0;i<300;i++)parts.push({x:0,y:0,vx:0,vy:0,g:0,life:1,max:1,color:'#fff',s:1});capParts();const n=parts.length;
   setQual('alta');const d2=DPR;vigKey='';vignette(2);const bg=$('vinheta').style.background;
   setQual('auto');perfW.skip=0;const was=loading;loading=false;for(let i=0;i<110;i++)perfTick(40);const auto=QUAL.leve;loading=was;
   qualPref=p0;if(q0===null)localStorage.removeItem(QKEY);else localStorage.setItem(QKEY,q0);setLeve(p0==='leve');qualBtns();
   if(d1!==1)throw 'o modo leve não baixou a resolução';if(n>90)throw 'partículas não foram limitadas ('+n+')';if(d2!==Math.min(devicePixelRatio||1,2))throw 'a qualidade alta não voltou';
   if(!bg.includes('radial-gradient'))throw 'vinheta sem degradê';if(!auto)throw 'quadros lentos não ligaram o modo leve';info('leve: 1×, até 90 partículas; vinheta em CSS; 25 quadros/s ligam o leve sozinho');});
  t('app: manifesto e ícones no index; service worker só em https (o teste completo é o tests\\testar-app.ps1)',()=>{
   if(!document.querySelector('link[rel="manifest"][href="manifest.json"]'))throw 'sem o link do manifesto';if(!document.querySelector('link[rel="apple-touch-icon"]'))throw 'sem ícone do iPhone';
   if(location.protocol==='file:'&&APP_OK)throw 'o service worker tentaria rodar em file://';const b=document.querySelectorAll('[data-inst]');if(!b.length||[...b].some(x=>!x.classList.contains('hidden')))throw 'botão de instalar deveria começar escondido';});
  t('Sahrem: dunas a oeste, leste e sul, com morros e monstros do deserto; missões da região',()=>{const des=['lagarto','abutre','cacto','chacal','escorpiao','serpente','escaravelho','saqueador'];
   for(const id of['orla','dunasO','dunasL','dunasS']){for(const[tp]of MAPS[id].mons)if(!des.includes(tp))throw id+' ainda tem '+tp;if(id!=='orla'&&!MAPS.sahrem.portals[id])throw 'Sahrem sem saída para '+id;}
   switchMapNow('sahrem',null);const[a0,b0,a1,b1]=MAPS.sahrem.lago,[px,py]=MAPS.sahrem.piramide;let fur=0;
   for(let y=b0;y<=b1;y++)for(let x=a0;x<=a1;x++){if(x>a0+1&&x<a1-1&&y>b0+1&&y<b1-1)continue;if(ground[y*W+x]!==G.WATER)fur++;}
   if(fur!==6)throw 'o lago da pirâmide devia ter só a passagem da frente (3×2), achei '+fur+' tiles sem água';if(!REACH[(py+1)*W+px])throw 'a porta da pirâmide não se alcança a pé';
   if(!MAPS.sahrem.walls||MAPS.sahrem.wallStyle!=='arenito')throw 'Sahrem sem muralha de arenito';
   switchMapNow('dunasS',null);let alto=0;for(let i=0;i<W*H;i++)if(ground[i]===G.HIGH)alto++;if(alto<100)throw 'dunas sem morros ('+alto+' tiles altos)';
   const ms=MISS.filter(q=>q.city==='sahrem');if(ms.length<8)throw 'só '+ms.length+' missões em Sahrem';for(const q of ms)if(!des.includes(q.mat))throw q.id+' pede material de fora';info(ms.length+' missões em Sahrem');});
  t('Sahrem: a porta da pirâmide leva à tumba de 3 andares, com urnas, colunas e monstros próprios',()=>{const p=MAPS.sahrem.portals.tumba1,[px,py]=MAPS.sahrem.piramide;
   if(!p||p[0]!==px||p[1]!==py+1||p[2]!=='porta')throw 'a porta da pirâmide não leva à tumba';const tum=['besouroT','mumia','sentinela','sacerdote'];
   for(const id of['tumba1','tumba2','tumba3']){const M=MAPS[id];if(!M.dark||M.mask!==tumbaMask)throw id+' não é tumba escura';for(const[tp]of M.mons)if(!tum.includes(tp))throw id+' tem '+tp;
    switchMapNow(id,null);const c={};for(const r of objRows)for(const o of r)c[o.spr]=(c[o.spr]||0)+1;if(!c.urna&&!c.colunaT)throw id+' sem urnas nem colunas';}
   if(MAPS.tumba3.lv[1]!==40)throw 'o fundo devia ir até o nível 40';});
  t('Teleporte do menu de testes (?dev): apelidos achados e chegada na praça das cidades',()=>{for(const a in TPA)if(!MAPS[TPA[a]])throw a+' leva a um mapa que não existe';
   for(const[q,id]of[['sahrem','sahrem'],['sahrem_dungeon01','tumba1'],['sahrem_field04','dunasS'],['pinheiral_field07','encosta7'],['@x',null],['Pântano','pantano'],['torreArcadia','torreArcadia']])if(tpFind(q)!==id)throw q+' achou '+tpFind(q);
   for(const c in TPREG){switchMapNow(c,'@centro');const j=Math.floor(P.y/TILE)*W+Math.floor(P.x/TILE);if(solid[j]||!REACH[j])throw 'em '+c+' o herói chega em lugar bloqueado';}
   switchMapNow('valdor',null);info(Object.keys(TPA).length+' apelidos');});
  t('Arcádia: fosso redondo, 4 pontes, a Torre no centro; Planalto com runas; portão norte em Valdor',()=>{switchMapNow('arcadia',null);const at=(x,y)=>y*W+x;
   let agua=0;for(let i=0;i<W*H;i++)if(ground[i]===G.WATER)agua++;if(agua<150)throw 'fosso pequeno: '+agua+' tiles';
   for(const[x,y,n]of[[TC.x,TC.y-17,'norte'],[TC.x,TC.y+17,'sul'],[TC.x-17,TC.y,'oeste'],[TC.x+17,TC.y,'leste']]){const i=at(x,y);if(solid[i]||ground[i]!==G.PATH)throw 'sem ponte ao '+n;if(!REACH[i])throw 'ponte ao '+n+' não se alcança a pé';}
   if(ground[at(TC.x+12,TC.y+12)]!==G.WATER||!solid[at(TC.x+12,TC.y+12)])throw 'fosso sem água fora das pontes';
   const c={};for(const r of objRows)for(const o of r)c[o.spr]=(c[o.spr]||0)+1;const muros=(c.muroH||0)+(c.muroV||0)+(c.muroHA||0);
   if(muros<60)throw 'muralha redonda com só '+muros+' trechos';if((c.torreA||0)<12)throw 'só '+(c.torreA||0)+' torres (8 nos portões + 4 nas diagonais)';
   if((c.cristal||0)<4||(c.paredeRuna||0)<4)throw 'praças rúnicas incompletas';
   for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(hyp(x+.5-(TC.x+.5),y+.5-(TC.y+.5))<14&&ground[at(x,y)]===G.GRASS)throw 'grama dentro da cidade em '+x+','+y;if((c.torreMagos||0)!==1||!solid[at(TC.x,TC.y)])throw 'a Torre não está no centro';
   switchMapNow('planalto',null);const runas=objRows.reduce((s,r)=>s+r.filter(o=>o.spr==='runa').length,0);if(runas<10)throw 'só '+runas+' pedras rúnicas';
   switchMapNow('valdor',null);const torres=objRows.reduce((s,r)=>s+r.filter(o=>o.spr==='torre'&&o.ty<TC.y-8).length,0);if(torres<4)throw 'portão norte de Valdor sem torres ('+torres+')';
   info(agua+' tiles de fosso, 4 pontes, '+runas+' pedras rúnicas');});
  t('Torre dos Magos: no centro de Arcádia, porta ao sul, salão redondo com a Selene; ao sair, na frente da porta',()=>{switchMapNow('arcadia',null);
   const o=objRows.flat().find(o=>o.spr==='torreMagos');if(!o||o.label!=='Torre dos Magos')throw 'a Torre não tem o nome ao passar o mouse';
   if(SPR.torreMagos.n.height!==TORRE_H||SPR.torreMagos.n.width!==80)throw 'desenho da Torre com tamanho errado';
   const p=portalPt('torreArcadia');if(p.y<o.py)throw 'a porta não fica embaixo da Torre';
   switchMapNow('torreArcadia','arcadia');const M=MAPS.torreArcadia;if(!M.round||!solid[(TC.y-6)*W+TC.x-9])throw 'o salão não é redondo (o canto deveria ser parede)';
   if(TALK.length!==1||TALK[0].p.n!=='Arquimaga Selene')throw 'a Selene não está no salão';cura();P.x=TALK[0].x;P.y=TALK[0].y+6;const it=nearestInteract();
   if(!it||it.kind!=='talk')throw '[E] não conversa com a Selene';interact(it);if(!(TALK[0].until>time))throw 'a Selene não falou';
   for(const q of SALAO)if(q.id==='selene')throw 'a Selene entrou no salão da Guilda';
   switchMapNow('arcadia','torreArcadia');if(P.y<=p.y||hyp(P.x-p.x,P.y-p.y)>3*TILE)throw 'ao sair, o herói não ficou na frente da porta';render(.05,0);
   info('Torre de 80×'+TORRE_H+' px, salão com '+M.deco.filter(d=>d[2]==='estante').length+' estantes; Selene: '+GENTE[0].f.length+' falas');});
  // mestres de classe (Arcádia etapa 3 e a cabana da Kaya): prova e promoção com o mestre; a Elara manda até ele; save antigo termina com a Elara
  for(const[cls,w,casa,city,deus,lugar]of[['mago','selene','torreArcadia','arcadia','Astrael','Torre'],['arqueira','kaya','cabanaKaya','pinheiral','Ilvara','Pinheiral']])
  t(`mestre de classe: ${cls} faz a prova e a promoção com ${MENTN[w][0]}; a Elara manda até lá`,()=>{const N=MENTN[w][0];
   const acts=()=>[...$('mentorBody').querySelectorAll('[data-act]')].map(b=>b.dataset.act),clica=a=>$('mentorBody').querySelector(`[data-act="${a}"]`).click();
   const mestre=()=>{switchMapNow(casa,city);cura();const q=TALK.find(q=>q.p.id===w);if(!q)throw N+' não está em '+casa;P.x=q.x;P.y=q.y+6;return nearestInteract();};
   enter({cls,name:'Mestre'});for(let i=0;i<40&&P.jlvl<10;i++)gainXp(xpNeed(P.lvl));
   if(mentorOf()!==w||!mentorAlert(w)||mentorAlert('elara'))throw `o "!" na Classe 10 devia ficar em ${N}`;
   openMentor('elara');if(acts().includes('take')||!new RegExp(lugar).test($('mentorBody').textContent)||!acts().includes('attrReset'))throw `a Elara devia mandar para ${lugar} e continuar com os atributos`;
   let it=mestre();if(promptText(it)!=='[E] Falar com '+N)throw 'texto: '+promptText(it);interact(it);
   if($('mentor').querySelector('h2').textContent!==N||!new RegExp(deus).test($('mentorBody').textContent))throw 'a janela não é de '+N;
   if(acts().includes('attrReset'))throw 'o reset de atributos é só com a Elara';
   const s=$('mentorBody').querySelector('[data-act="take"]').dataset.spec;clica('take');if(!P.quest||P.quest.by!==w)throw 'a prova não ficou com '+N;
   P.quest.prog=P.quest.goal;questCheck();hudExtra();if(!$('quest').textContent.includes(N))throw 'o HUD não manda voltar a '+N;
   interact(mestre());clica('done');if(P.spec!==s)throw 'não virou aprendiz com '+N;for(let i=0;i<200&&P.jlvl<25;i++)gainXp(jobNeed(P.jlvl));
   if(!mentorAlert(w))throw 'sem "!" na promoção';renderMentor();clica('promo');if(P.promo!==2)throw 'sem promoção com '+N;$('mentor').classList.add('hidden');
   enter({cls,name:'Antigo'});for(let i=0;i<40&&P.jlvl<10;i++)gainXp(xpNeed(P.lvl));P.quest={spec:s,prog:1,goal:1,done:true}; // prova aceita com a Elara num save antigo
   if(mentorOf()!=='elara')throw 'prova antiga devia terminar com a Elara';interact(mestre());if(acts().includes('done'))throw N+' concluiu prova da Elara';
   openMentor('elara');if(!acts().includes('done'))throw 'a Elara não concluiu a prova antiga';clica('done');if(mentorOf()!==w)throw 'depois da prova antiga, a promoção devia ser com '+N;
   $('mentor').classList.add('hidden');enter({cls:'guerreiro',name:'Visita'});interact(mestre());const q=TALK.find(q=>q.p.id===w);
   if(!$('mentor').classList.contains('hidden')||!(q.until>time))throw 'com o Guerreiro, '+N+' devia só conversar';
   info(N+': prova "'+SPECS[s].trial.t+'" e promoção a '+SPECS[s].n);});
  t('cabana da Kaya: canto nordeste de Pinheiral, fora da paliçada, na mata, com trilha (sem portão novo) e dá para chegar',()=>{switchMapNow('pinheiral',null);
   const o=objRows.flat().find(o=>o.spr==='cabanaKaya'),p=portalPt('cabanaKaya');if(!o||o.label!=='Cabana da Caçadora Kaya')throw 'a cabana não tem o nome ao passar o mouse';
   const tx=Math.floor(p.x/TILE),ty=Math.floor(p.y/TILE);if(tx<56||ty>18)throw 'a cabana não está no canto nordeste ('+tx+','+ty+')';
   if(!REACH[ty*W+tx]&&!REACH[(ty+1)*W+tx])throw 'não dá para chegar na porta da cabana';
   const ob=objRows.flat(),n=s=>ob.filter(o=>o.spr===s).length;if(n('alvo')<2||n('lenha')<1||n('varalPeles')<1)throw 'faltam alvos, lenha ou varal';
   let arv=0,trilha=0;for(let y=ty-12;y<=ty+12;y++)for(let x=tx-12;x<=tx+12;x++){if(x<0||y<0||x>=W||y>=H)continue;if(ground[y*W+x]===G.PATH)trilha++;}
   arv=ob.filter(o=>/^tree/.test(o.spr)&&hyp(o.tx-tx,o.ty-ty)<12).length;if(arv<40)throw 'mata rala em volta da cabana: '+arv+' árvores';if(trilha<10)throw 'sem trilha perto da cabana';
   switchMapNow('cabanaKaya','pinheiral');const tem=s=>objRows.flat().some(o=>o.spr===s);if(!tem('lareira')||!tem('armeiro')||!tem('lobo'))throw 'falta lareira, armeiro ou o lobo Cinza';
   switchMapNow('pinheiral','cabanaKaya');if(hyp(P.x-p.x,P.y-p.y)>3*TILE)throw 'ao sair, o herói não ficou na frente da porta';
   info(arv+' árvores em volta, '+trilha+' tiles de trilha');});
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
   if(!P.mats||Object.keys(P.mats).length)throw 'mats não iniciou vazio';if(!(weightNow()>0))throw 'peso inválido';saveReal();if(loadSave().v!==5||!loadSave().mats||!loadSave().miss||loadSave().jlvl!==5||!loadSave().tons)throw 'save novo sem v:5, mats, miss, jlvl ou tons';});
  t('atributos: herói novo começa com 5 em tudo e sem pontos',()=>{enter({cls:'guerreiro',name:'Atrib'});if(ATTR.some(([k])=>P.attr[k]!==5)||attrFree()!==0)throw JSON.stringify(P.attr)+' livres '+attrFree();});
  t('atributos: níveis dão pontos e a Força vira ataque',()=>{for(let i=0;i<20&&P.lvl<10;i++)gainXp(xpNeed(P.lvl));if(attrFree()!==27)throw 'nível 10 com '+attrFree()+' pontos (esperado 27)';
   const a0=P.st.atk,h0=P.st.hp,c0=capOf();toggleAttr();attrAdd('forca',5);attrAdd('forca',5);attrAdd('vita',5);if(P.attr.forca!==5)throw 'aplicou antes de confirmar';attrConfirm();toggleAttr();
   if(P.attr.forca!==15||P.attr.vita!==10||attrFree()!==12)throw 'distribuição errada: '+JSON.stringify(P.attr);if(!(P.st.atk>a0&&P.st.hp>h0&&capOf()===c0+100))throw 'ataque, vida ou peso não subiram';
   info('ataque '+a0+' → '+P.st.atk+', vida '+h0+' → '+P.st.hp);});
  t('atributos: nível 50 com o principal em 99 dá o ataque de antes',()=>{const out=[];for(const c of Object.keys(CL)){P.cls=c;P.lvl=50;P.attr=newAttr(ATTR_INI);P.attr[MAINAT[c]]=99;
    const at=attrStats(CL[c],49).atk,old=CL[c].atk+CL[c].g.atk*49;if(Math.abs(at-old)>old*.05)throw c+': '+at.toFixed(0)+' contra '+old.toFixed(0);out.push(c+' '+Math.round(at));}
   P.cls='guerreiro';P.lvl=10;P.attr={forca:15,agil:5,vita:10,inte:5,dest:5,sorte:5};recalc();info(out.join(', '));});
  t('atributos: metade no principal e metade em Vitalidade fica perto do herói de antes (nv 10, 30, 50)',()=>{const out=[],sv=[P.cls,P.lvl,P.attr];try{
   for(const c of Object.keys(CL))for(const L of[10,30,50]){P.cls=c;P.lvl=L;P.attr=newAttr(ATTR_INI);let f=attrFree();const m=Math.min(94,Math.ceil(f/2));P.attr[MAINAT[c]]+=m;f-=m;P.attr.vita+=Math.min(94,f);
    const s=attrStats(CL[c],L-1),g=CL[c].g,o={atk:CL[c].atk+g.atk*(L-1),def:CL[c].def+g.def*(L-1),hp:CL[c].hp+g.hp*(L-1)};
    for(const k in o){const r=s[k]/o[k];if(r<.75||r>1.25)throw c+' nv '+L+' '+k+': '+Math.round(s[k])+' contra '+Math.round(o[k]);}
    if(L===30)out.push(c+' nv30: ataque '+Math.round(s.atk)+'/'+Math.round(o.atk)+', defesa '+Math.round(s.def)+'/'+Math.round(o.def)+', vida '+Math.round(s.hp)+'/'+Math.round(o.hp));}
   }finally{[P.cls,P.lvl,P.attr]=sv;recalc();}info(out.join(' • '));});
  t('atributos: Mestra Elara redefine por 1000 (tudo volta a 1)',()=>{P.gold=500;if(attrReset())throw 'resetou sem ouro';P.gold=1500;if(!attrReset()||P.gold!==500)throw 'não cobrou 1000';
   if(ATTR.some(([k])=>P.attr[k]!==1)||attrFree()!==attrTotal()||attrTotal()!==24+27)throw 'depois do reset: '+JSON.stringify(P.attr)+' livres '+attrFree();
   openMentor();if(!$('mentorBody').querySelector('[data-act="attrReset"]'))throw 'sem botão na Mestra Elara';$('mentor').classList.add('hidden');});
  t('atributos: Agilidade dá esquiva',()=>{P.attr.agil=99;recalc();if(!(P.st.dodge>.2))throw 'esquiva '+P.st.dodge;let z=0;for(let i=0;i<200;i++)if(preHurt(10,null,2)===0)z++;if(z<20)throw 'só esquivou '+z+' de 200';P.attr.agil=1;recalc();});
  t('níveis: save antigo ganha nível de Classe e mantém os pontos',()=>{const b={v:3,name:'Velho',cls:'guerreiro',xp:0,gold:10,inv:[],equip:{},pots:{hp:2,mp:1},x:(TC.x+.5)*TILE,y:(TC.y+2.5)*TILE,map:'valdor'};
   enter(Object.assign({},b,{lvl:20,spec:'paladino',promo:1,ranks:{giro:5,vigor:5,grito:5,pele:5}}));if(P.jlvl!==11||ptsFree()!==0||rk('pele')!==5)throw 'aprendiz nv 20: Classe '+P.jlvl+', livres '+ptsFree();
   enter(Object.assign({},b,{lvl:20,ranks:{giro:5,vigor:5,grito:5,pele:5}}));if(P.jlvl!==10||ptsFree()!==9||rk('pele'))throw 'sem caminho nv 20: Classe '+P.jlvl+', livres '+ptsFree();
   if(ATTR.some(([k])=>P.attr[k]!==5)||attrFree()!==attrTotal()-24)throw 'save antigo sem atributos: '+JSON.stringify(P.attr);
   info('aprendiz nv 20 → Classe 11; sem caminho nv 20 → Classe 10, pontos devolvidos; '+attrFree()+' pontos de atributo');});
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
   for(const s of['ferrariaR','guilda2'])if(!c[s])throw 'serviço sem cabana: '+s;if(c.casaElaraR)throw 'a casa da Elara devia ser só em Valdor';info(c.torreM+' torres de vigia, '+((c.cabana1||0)+(c.cabana2||0))+' cabanas comuns');});
  t('Valdor: casas comuns e o nome da Guilda ao passar o mouse',()=>{switchMapNow('valdor',null);let casas=0,g=null;for(const r of objRows)for(const o of r){if(/^house/.test(o.spr))casas++;if(o.spr==='guilda')g=o;}
   if(casas<6)throw 'só '+casas+' casas comuns';const h=houseAt(g.px,g.py-10);if(!h||h.label!=='Guilda de Valdor')throw 'mouse sobre a Guilda mostrou: '+(h&&h.label);
   const ht=houseAt(g.px,g.py-80);if(!ht||ht.label!=='Guilda de Valdor')throw 'mouse na torre da Guilda não mostrou o nome';
   // Guilda grande: 4×3 tiles sólidos, porta livre na frente, sem lampião dentro
   const gx=Math.round(g.px/TILE),gy=g.ty;for(let dy=0;dy<3;dy++)for(let dx=-2;dx<2;dx++)if(!solid[(gy-dy)*W+gx+dx])throw 'Guilda sem chão ocupado em '+(gx+dx)+','+(gy-dy);
   if(objRows.some(r=>r.some(o=>o.spr==='lampiao'&&o.tx>=gx-2&&o.tx<gx+2&&o.ty<=gy&&o.ty>gy-3)))throw 'lampião dentro da Guilda';
   const pd=MAPS.valdor.portals.guilda;if(blocked((pd[0]+.5)*TILE,(pd[1]+.5)*TILE,4))throw 'a porta da Guilda ficou bloqueada';
   if(houseAt((TC.x+.5)*TILE,(TC.y+.5)*TILE))throw 'a praça não devia ter nome';info(casas+' casas comuns + a Guilda');});
  t('casa da Mestra Elara: ela atende lá dentro',()=>{switchMapNow('valdor',null);if(MENTOR.x>0)throw 'Elara continua na praça de Valdor';
   let c=null;for(const r of objRows)for(const o of r)if(o.spr==='casaElara')c=o;if(!c||c.label!=='Casa da Mestra Elara')throw 'casa sem sprite ou nome';
   switchMapNow('casaElara','valdor');cura();if(!(MENTOR.x>0))throw 'Elara não está na casa';P.x=MENTOR.x;P.y=MENTOR.y+14;const it=nearestInteract();if(!it||it.kind!=='mentor')throw 'não dá para falar com ela';
   interact(it);if($('mentor').classList.contains('hidden'))throw 'janela da mentora não abriu';closeAll();
});
  t('cidades: mercador, Guilda e ferreiro em todas; a Elara só em Valdor; gente própria em cada uma',()=>{const cid=Object.keys(MAPS).filter(k=>MAPS[k].town);if(cid.length<2)throw 'cidades: '+cid;
   for(const c of cid){switchMapNow(c,null);if(!(NPC.x>0))throw c+': sem mercador na praça';if(MENTOR.x>0)throw c+': Elara devia estar dentro de casa';
    if(!CIDP[c])throw c+': sem gente própria (CIDP, 24)';if(cidP()!==CIDP[c])throw c+': a praça não usa a gente da cidade';
    const sp=new Set();for(const r of objRows)for(const o of r)if(o.label)sp.add(o.spr);if(![...sp].some(x=>x.startsWith('ferraria')))throw c+': sem ferreiro';
    const elara=[...sp].some(x=>x.startsWith('casaElara'));if(elara!==(c==='valdor'))throw c+(elara?': a casa da Elara devia ser só em Valdor':': Valdor sem a casa da Elara');
    if(![...sp].some(s=>/^guilda/.test(s)))throw c+': sem Guilda';
    openShop();if(shopEl.querySelector('h2').textContent!==CIDP[c].merc[0])throw c+': a loja não mostra o mercador da cidade';closeAll();
    for(const to in MAPS[c].portals){const I=MAPS[to];if(!I.interior)continue;switchMapNow(to,c);cura();
     if(I.mentorAt){P.x=MENTOR.x;P.y=MENTOR.y+14;if((nearestInteract()||{}).kind!=='mentor')throw to+': não fala com a Elara';}
     if(I.smith){P.x=SMITH.x;P.y=SMITH.y+4;if((nearestInteract()||{}).kind!=='smith')throw to+': não fala com o ferreiro';
      if(!I.deco.some(d=>d[2]===CIDP[c].smith[1]))throw to+': o ferreiro não é o da cidade';openSmith();if($('smith').querySelector('h2').textContent!==CIDP[c].smith[0])throw to+': janela com outro ferreiro';closeAll();}
     if(I.board){P.x=BOARD.x;P.y=BOARD.y+6;if((nearestInteract()||{}).kind!=='board')throw to+': não acha o mural';
      if(!I.deco.some(d=>d[2]===CIDP[c].bar[1]))throw to+': a taverneira não é a da cidade';if(TALK.map(q=>q.p.id).join()!==CIDP[c].salao.join())throw to+': o salão não tem a gente da cidade';}
     switchMapNow(c,to);}}
   // ninguém se repete entre as cidades
   const nomes=cid.flatMap(c=>[CIDP[c].merc[0],CIDP[c].smith[0],CIDP[c].bar[0],...CIDP[c].salao]);if(new Set(nomes).size!==nomes.length)throw 'gente repetida entre as cidades';
   info(cid.map(c=>MAPS[c].n+' ('+CIDP[c].merc[0]+')').join(', '));});
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
  t('bar da Guilda: Brígida em toda Guilda, tônico comprado, tomado, salvo e com fim',()=>{
   for(const id of Object.keys(MAPS).filter(k=>MAPS[k].interior&&MAPS[k].board)){if(!MAPS[id].bar)throw id+' sem bar';switchMapNow(id,null);if(BAR.x<0)throw id+': o bar não tem posição';
    const[bx,by]=MAPS[id].bar,j=(by+2)*W+bx;if(solid[j]||!REACH[j])throw id+': não dá para chegar na frente do balcão';
    cura();P.x=(bx+.5)*TILE;P.y=(by+2.5)*TILE;const it=nearestInteract();if(!it||it.kind!=='bar')throw id+': [E] não fala com a Brígida';}
   openTaverna();if($('taverna').classList.contains('hidden'))throw 'a janela do bar não abriu';closeAll();
   const k=MAINAT[P.cls];P.tons={};P.tonAt={};recalc();P.gold=1000;const w0=weightNow();buyTonic(k);
   if(P.tons[k]!==1||P.gold!==1000-TON_V)throw 'a compra não funcionou';if(weightNow()-w0!==WPOT)throw 'o tônico não pesa';
   bagTab='uso';if(!bagEntries().some(e=>e.key==='ton:'+k))throw 'o tônico não aparece na aba Consumíveis';bagTab='equip';
   const a0=P.st.atk;drinkTonic(k);const a1=P.st.atk;if(P.tons[k]||!(P.tonAt[k]>0))throw 'tomar não ativou o efeito';if(a1<=a0)throw 'o ataque não subiu com o tônico';
   saveReal();const s=loadSave();if(s.v!==5||!s.tonAt||!(s.tonAt[k]>0))throw 'o efeito não foi salvo';
   tonicTick(TON_T+1);if(P.tonAt[k])throw 'o efeito não acabou';if(P.st.atk!==a0)throw 'o ataque não voltou ao normal';
   info(`${TONN[k]}: ataque ${a0} → ${a1} por ${TON_T/60} min`);});
  t('salão da Guilda: Freya, Darian e Lexus conversam em toda Guilda',()=>{
   for(const id of Object.keys(MAPS).filter(k=>MAPS[k].interior&&MAPS[k].board)){switchMapNow(id,null);if(TALK.length!==SALAO.length)throw id+': '+TALK.length+' pessoas no salão';
    for(const q of TALK){let pe=null; // o chão livre mais perto de onde se conversa (o Darian fica atrás de uma mesa)
     for(let ty=0;ty<H;ty++)for(let tx=0;tx<W;tx++){const j=ty*W+tx,x=(tx+.5)*TILE,y=(ty+.5)*TILE;if(!solid[j]&&REACH[j]&&hyp(x-q.x,y-q.y)<26&&(!pe||hyp(x-q.x,y-q.y)<hyp(pe.x-q.x,pe.y-q.y)))pe={x,y};}
     if(!pe)throw id+': não dá para chegar perto de '+q.p.n;cura();P.x=pe.x;P.y=pe.y;const it=nearestInteract();if(!it||it.kind!=='talk'||it.o!==q)throw id+': [E] não conversa com '+q.p.n+' (pegou '+(it&&it.kind)+')';
     interact(it);const l1=q.line;if(!q.p.f.includes(l1)||!(q.until>time))throw q.p.n+' não falou';interact(it);if(q.line===l1)throw q.p.n+' repetiu a mesma fala';}
    render(.05,0);}
   info(SALAO.map(p=>p.n+' ('+p.f.length+' falas)').join(', '));});
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
