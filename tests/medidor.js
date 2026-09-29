// Ecos de Valdoria — Medidor de equilíbrio
// Carregado pelo index.html quando a página é aberta com ?medir (ou: tests\rodar-testes.ps1 -Medir).
// Monta um herói "típico" de cada classe em vários níveis e o põe para lutar, sozinho, contra cada monstro do nível dele
// e contra cada chefe. Mede quanto tempo e quantos golpes ele leva para matar, quanto dano leva e quantos monstros precisa por nível.
// Herói típico: metade dos pontos no atributo principal e metade em Vitalidade, habilidades aprendidas na ordem da árvore,
// equipamento Incomum do próprio nível em todos os espaços, sem refinamento e sem poções.
// A luta é o jogo de verdade (update). Duas medições separadas: a caçada (5 monstros seguidos, usando toda habilidade pronta,
// sem recarregar mana nem habilidades entre um e outro) e o dano do monstro (ele bate por 30 s no herói parado, que não desvia
// dos círculos vermelhos). A vida do herói é reposta a cada quadro; o dano é somado à parte.
// O save do jogador é guardado antes e devolvido no final.
'use strict';
(function(){
 const out=[],saveOriginal=localStorage.getItem(SAVEKEY),gainXpReal=gainXp,baReal=basicAttack,usReal=useSkill;save=()=>{};
 // sem mana, cada tecla tentada escreve "Mana insuficiente" na tela: milhares de linhas numa luta longa deixavam o medidor lento demais
 const telaReal=[log,banner,flashSlot];log=banner=flashSlot=()=>{};
 const so=(location.search.match(/medir=(\w+)/)||[])[1]; // ?medir=mago mede só uma classe
 const NIVEIS=[5,10,15,20,25,30],SLOTS=['arma','elmo','peito','botas','anel'];
 const f1=v=>v.toFixed(1).replace('.',','),pad=(s,n)=>String(s).padEnd(n),lpad=(s,n)=>String(s).padStart(n);
 const mediana=v=>{const s=[...v].sort((a,b)=>a-b),h=s.length>>1;return s.length%2?s[h]:(s[h-1]+s[h])/2;}; // um monstro esquisito não puxa o resumo
 const ehChefe=m=>m.boss||(MDEF[m.type]&&MDEF[m.type].boss);

 function heroi(cls,L){gainXp=gainXpReal;enter({cls,name:'Medidor'});
  const spec=Object.keys(SPECS).find(k=>SPECS[k].cls===cls);
  for(let i=0;i<200&&P.lvl<L;i++){gainXp(xpNeed(P.lvl)-P.xp);
   if(!P.spec&&P.jlvl>=10){acceptTrial(spec);P.quest.prog=P.quest.goal;P.quest.done=true;completeTrial();}
   if(P.spec&&P.jlvl>=25)promote();}
  const f=attrFree(),k=MAINAT[cls],a=Math.min(ATTR_MAX-P.attr[k],Math.ceil(f/2));P.attr[k]+=a;P.attr.vita=Math.min(ATTR_MAX,P.attr.vita+f-a);
  for(let r=0;r<8;r++)for(const id in SK)if(!canLearn(id))learn(id);
  for(const s of SLOTS)P.equip[s]=genItem(L,0,s,0,1);recalc();P.hp=P.st.hp;P.mp=P.st.mp;}

 // põe o monstro (ou o chefe do mapa, com tipo=null) no mapa e o herói ao lado dele, num tile livre
 function arena(mapa,tipo,lv){if(CUR!==mapa)switchMapNow(mapa,null);else for(const a of[projs,fx,parts,texts,teles,pAoe,traps,mproj])a.length=0; // gerar o mapa é o que mais custa
  mons.length=0;loots.length=0;allies.length=0;
  let m;if(tipo){const t=randTile(MAPS[mapa].theme);m=makeMon(tipo,(t.x+.5)*TILE,(t.y+.5)*TILE,lv);mons.push(m);}
  else{spawnBoss(false);m=mons.find(ehChefe);}
  const pp=freeNear(Math.floor((m.x+30)/TILE),Math.floor(m.y/TILE),ground[Math.floor(m.y/TILE)*W+Math.floor(m.x/TILE)]===G.HIGH);P.x=pp.x;P.y=pp.y;P.hp=P.st.hp;m.state='chase';return m;}
 const fresco=()=>{P.hp=P.st.hp;P.mp=P.st.mp;P.buff=null;P.form=null;P.shield=null;for(const k in P.cd)P.cd[k]=0;recalc();};
 const acorda=()=>{P.dead=false;$('death').classList.add('hidden');};
 // o herói ataca até matar (usa toda habilidade pronta): devolve segundos e ações (ataques básicos + habilidades)
 function caca(mapa,tipo,lv,max=120){const m=arena(mapa,tipo,lv);P.target=m;P.auto=true;let t=0,acoes=0;
  basicAttack=function(){acoes++;return baReal.apply(this,arguments);};
  useSkill=function(s){const id=P.bar[s],c=id&&P.cd[id];const r=usReal.apply(this,arguments);if(id&&!c&&P.cd[id]>0)acoes++;return r;};
  while(!m.dead&&t<max){for(let s=0;s<6;s++)useSkill(s);if(!P.target||P.target.dead){P.target=m;P.auto=true;}
   update(.05);t+=.05;loots.length=0;if(P.dead)acorda();P.hp=P.st.hp;}
  basicAttack=baReal;useSkill=usReal;return{t,morto:m.dead,acoes,nome:m.name,lv:m.lvl,resto:Math.round(Math.max(0,m.hp)/m.maxHp*100),st:m.state};}
 // caçada em sequência: 5 monstros seguidos, sem recarregar mana nem habilidades (só 4 s de caminhada entre um e outro)
 function sequencia(mapa,tipo,lv){fresco();let t=0,a=0,ok=true,r;
  for(let i=0;i<5;i++){if(i)for(const k in P.cd)P.cd[k]=Math.max(0,P.cd[k]-4);r=caca(mapa,tipo,lv);t+=r.t;a+=r.acoes;if(!r.morto){ok=false;break;}}
  return{t:t/5,acoes:a/5,morto:ok,nome:r.nome,m:r};}
 // o monstro bate no herói parado por 30 s (o monstro não morre): devolve dano por segundo e dano médio por golpe
 function apanha(mapa,tipo,lv){const m=arena(mapa,tipo,lv);P.target=null;P.auto=false;let t=0,dano=0,n=0,umGolpe=false;
  while(t<30){const h=P.hp;update(.05);t+=.05;if(P.dead){umGolpe=true;acorda();}if(P.hp<h){dano+=h-P.hp;n++;}P.hp=P.st.hp;m.hp=m.maxHp;if(m.dead)break;}
  return{dps:dano/t,golpe:n?dano/n:0,umGolpe};}

 // os mapas de campo e os monstros de cada um
 const campos=Object.keys(MAPS).filter(k=>{const M=MAPS[k];return!M.town&&!M.interior&&!M.lair&&M.lv&&(M.count||0)>0;});
 const tiposDe=k=>(MAPS[k].mons||ZTYPES[MAPS[k].theme]||[]).map(e=>e[0]);
 function mapasDoNivel(L){let c=campos.filter(k=>MAPS[k].lv[0]<=L&&L<=MAPS[k].lv[1]);
  if(!c.length){const d=k=>Math.min(Math.abs(MAPS[k].lv[0]-L),Math.abs(MAPS[k].lv[1]-L)),min=Math.min(...campos.map(d));c=campos.filter(k=>d(k)===min);}return c;}

 const resumo=[];
 try{
  gainXp=()=>{}; // nas lutas, matar não sobe o herói de nível
  for(const cls of Object.keys(CL).filter(c=>!so||c===so)){out.push('','######## '+CL[cls].nome.toUpperCase()+' ########');
   for(const L of NIVEIS){heroi(cls,L);gainXp=()=>{};
    out.push('',`Nível ${L} (Classe ${P.jlvl}${P.spec?', '+SPECS[P.spec].ap:''}) — vida ${P.st.hp}, ataque ${P.st.atk}, defesa ${P.st.def}, crítico ${P.st.crit}%`);
    const vistos=new Set(),va=[],vt=[],vm=[];
    for(const k of mapasDoNivel(L))for(const tp of tiposDe(k)){if(vistos.has(tp)||MDEF[tp].boss)continue;vistos.add(tp);
     const r=sequencia(k,tp,L),d=apanha(k,tp,L),mg=d.golpe?Math.ceil(P.st.hp/d.golpe):Infinity;
     if(r.morto){va.push(r.acoes);vt.push(r.t);vm.push(Math.min(mg,99));}
     out.push(`  ${pad(r.nome,26)} ${r.morto?'mata em '+lpad(f1(r.t),5)+' s ('+lpad(f1(r.acoes),4)+' ações)':('NÃO MATOU em 120 s (ele ficou com '+r.m.resto+'%, '+r.m.st+')').padEnd(26)}   ele te mata em ${mg===Infinity?'nunca':lpad(mg,3)+' golpes ('+lpad(Math.round(P.st.hp/d.dps),3)+' s)'}${d.umGolpe?'  [morreu num golpe só]':''}`);}
    if(va.length)resumo.push({cls,L,a:mediana(va),t:mediana(vt),m:mediana(vm)});}
   out.push('','Chefes (herói no nível do chefe, começando com tudo pronto):');
   for(const k of Object.keys(MAPS).filter(k=>MAPS[k].boss)){const bl=MAPS[k].bossLv||22;heroi(cls,bl);gainXp=()=>{};
    BOSSAT[k]=0;fresco();const r=caca(k,null,bl,600);BOSSAT[k]=0;const d=apanha(k,null,bl);
    out.push(`  ${pad(r.nome+' nv '+r.lv,36)} ${r.morto?'mata em '+lpad(f1(r.t),5)+' s':'NÃO MATOU em 600 s (ficou com '+r.resto+'%)'}   te mata em ${d.dps?lpad(Math.round(P.st.hp/d.dps),3)+' s':'nunca'}${d.umGolpe?'  [morreu num golpe só]':''}   (herói: vida ${P.st.hp}, ataque ${P.st.atk})`);}}

  out.push('','######## SUBIR DE NÍVEL ########','Monstros do próprio nível (sem elite) para passar do nível L para o L+1:');
  for(const L of NIVEIS){const ks=[];for(const k of mapasDoNivel(L))for(const tp of tiposDe(k))if(!MDEF[tp].boss)ks.push(xpNeed(L)/xpOf(MDEF[tp],L,false));
   const med=ks.reduce((a,b)=>a+b,0)/ks.length;out.push(`  nível ${lpad(L,2)}: XP da barra ${lpad(xpNeed(L),6)} → de ${Math.round(Math.min(...ks))} a ${Math.round(Math.max(...ks))} monstros (média ${Math.round(med)})`);}

  out.push('','######## RESUMO (mediana contra os monstros do próprio nível) ########','Meta: herói mata em 6 a 8 ações; monstro mata o herói em 10 a 12 golpes. Chefe: luta de 90 a 180 s.');
  for(const r of resumo)out.push(`  ${pad(CL[r.cls].nome,10)} nv ${lpad(r.L,2)}: herói mata em ${lpad(f1(r.a),4)} ações (${lpad(f1(r.t),4)} s); monstro mata em ${lpad(f1(r.m),4)} golpes`);
 }catch(e){out.push('ERRO NO MEDIDOR: '+(e&&e.stack?e.stack.split('\n').slice(0,3).join(' | '):e));}
 gainXp=gainXpReal;basicAttack=baReal;useSkill=usReal;[log,banner,flashSlot]=telaReal;

 try{if(saveOriginal===null)localStorage.removeItem(SAVEKEY);else localStorage.setItem(SAVEKEY,saveOriginal);}catch(e){}
 P=null;$('hud').classList.add('hidden');$('start').classList.remove('hidden');
 const errs=window.__errs||[];
 const txt=['=== MEDIDOR DE EQUILÍBRIO ===',...out,'','=== ERROS NO CONSOLE ('+errs.length+') ===',...errs.slice(0,30)].join('\n');
 const pre=document.createElement('pre');pre.id='medidor';pre.textContent=txt;
 pre.style.cssText='position:fixed;inset:0;z-index:9999;margin:0;padding:16px;overflow:auto;background:#1b1320;color:#e8dcc0;font:13px/1.45 monospace;white-space:pre-wrap';
 document.body.append(pre);
})();
