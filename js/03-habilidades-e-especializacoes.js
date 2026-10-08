// Ecos de Valdoria — Sistema de habilidades, árvores do Mago, aliados e provas
'use strict';
// ================== ÁRVORES E ESPECIALIZAÇÕES ==================
const TREES={mago:'Mago',bruxo:'Bruxo',necro:'Necromante',druida:'Druida'};
const SPECS={
 bruxo:{n:'Bruxo',ap:'Aprendiz de Bruxo',ic:'⚡',cor:'#7fc8ff',d:'O caminho mais fiel ao Mago: domínio total do fogo, do gelo e do relâmpago.',bonus:{atkPct:.08},trial:{t:'Derrote 15 monstros com habilidades',goal:15}},
 necro:{n:'Necromante',ap:'Aprendiz de Necromante',ic:'💀',cor:'#9dff9a',d:'Ergue mortos-vivos para lutar por você, drena vida e amaldiçoa inimigos.',bonus:{hpPct:.08},trial:{t:'Derrote 10 Esqueletos Guerreiros no Pântano Sombrio',goal:10}},
 druida:{n:'Druida',ap:'Aprendiz de Druida',ic:'🌿',cor:'#b8e65a',d:'Cura, raízes que prendem e a Forma de Urso para lutar corpo a corpo.',bonus:{hpPct:.05,mpPct:.05},trial:{t:'Purifique 3 Nascentes Corrompidas na Floresta',goal:3}}};
const pc=v=>Math.round(v*100)+'%';
const SK={
 fogo:{tree:'mago',tier:1,lvl:1,max:5,act:1,ic:'🔥',n:'Bola de Fogo',type:'proj',mp:10,cd:2.5,aoe:26,color:'#ff8a2a',speed:220,size:4,range:200,m:[2,.25],d:e=>`Projétil que explode em área: ${pc(e.mult)} de dano.`},
 mente:{tree:'mago',tier:1,lvl:2,max:5,ic:'🧠',n:'Mente Arcana',pas:{mpPct:.08},d:e=>`+${e.r*8}% de mana máxima.`},
 gelo:{tree:'mago',tier:1,lvl:3,max:5,act:1,ic:'❄️',n:'Nova de Gelo',type:'aoeSelf',mp:16,cd:7,r:58,slow:3,color:'#9fe8ff',m:[1.4,.2],d:e=>`Explosão ao seu redor que desacelera por 3s: ${pc(e.mult)}.`},
 foco:{tree:'mago',tier:2,lvl:5,max:5,ic:'👁️',n:'Foco Arcano',pas:{crit:2},d:e=>`+${e.r*2}% de chance de crítico.`},
 meteoro:{tree:'mago',tier:2,lvl:6,max:5,act:1,ic:'☄️',n:'Meteoro',type:'aoeTarget',mp:30,cd:12,r:44,delay:.8,kind:'meteor',color:'#ff5020',range:170,m:[4.2,.5],d:e=>`Um meteoro cai sobre o alvo: ${pc(e.mult)} em área.`},
 raio:{tree:'bruxo',tier:1,lvl:10,max:5,act:1,ic:'⚡',n:'Corrente de Relâmpagos',type:'chain',mp:14,cd:4,color:'#aee6ff',range:170,m:[1.6,.2],j:[3,.5],d:e=>`Raio que salta entre ${e.jumps+1} inimigos: ${pc(e.mult)} no primeiro.`},
 lanca:{tree:'bruxo',tier:1,lvl:10,max:5,act:1,ic:'🧊',n:'Lança de Gelo',type:'proj',mp:12,cd:5,pierce:true,slow:2,color:'#bff4ff',speed:320,size:3,range:240,m:[2.2,.25],d:e=>`Atravessa inimigos em linha e os desacelera: ${pc(e.mult)}.`},
 sobrecarga:{tree:'bruxo',tier:1,lvl:10,max:5,ic:'💥',n:'Sobrecarga Elemental',pas:{dmgPct:.06},d:e=>`+${e.r*6}% de dano em tudo.`},
 conv:{tree:'bruxo',tier:2,lvl:15,pts:4,max:5,ic:'🌀',n:'Convergência',pas:{cdr:.05,mpCut:.05},d:e=>`Habilidades recarregam ${e.r*5}% mais rápido e custam ${e.r*5}% menos mana.`},
 tempestade:{tree:'bruxo',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🌩️',n:'Tempestade Arcana',type:'storm',mp:45,cd:20,r:70,range:170,color:'#c8a0ff',m:[1.8,.3],hits:[8,2],d:e=>`${e.hits} descargas caem na área em 4s: ${pc(e.mult)} cada.`},
 esqueleto:{tree:'necro',tier:1,lvl:10,max:5,act:1,ic:'💀',n:'Erguer Esqueleto',type:'summon',mp:18,cd:6,m:[.35,.06],hpm:[.4,.08],d:e=>`Ergue um esqueleto aliado (máx. ${e.cap}). Vida: ${pc(e.hpm)} da sua. Dano: ${pc(e.mult)} do seu ataque.`},
 dreno:{tree:'necro',tier:1,lvl:10,max:5,act:1,ic:'🩸',n:'Toque Drenante',type:'proj',homing:1,mp:8,cd:1.5,drain:.4,color:'#7dff9a',speed:230,size:3,range:190,m:[1.6,.2],d:e=>`Projétil que devolve 40% do dano como vida: ${pc(e.mult)}.`},
 ossos:{tree:'necro',tier:1,lvl:10,max:5,ic:'🦴',n:'Pele de Osso',pas:{defPct:.06},d:e=>`+${e.r*6}% de defesa. Nos ranks 3 e 5, +1 esqueleto máximo.`},
 maldicao:{tree:'necro',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🕸️',n:'Maldição da Fraqueza',type:'curse',mp:14,cd:10,r:45,range:170,color:'#b070ff',amp:[.15,.03],d:e=>`Por 8s, inimigos na área causam 25% menos dano e recebem +${pc(e.amp)} de dano.`},
 cadaver:{tree:'necro',tier:2,lvl:15,pts:4,max:5,ic:'💣',n:'Explosão de Cadáver',pas:{},d:e=>`${e.r*12}% de chance de inimigos derrotados explodirem (150% em área).`},
 exercito:{tree:'necro',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'⚰️',n:'Exército dos Mortos',type:'army',mp:50,cd:45,n2:[4,1],d:e=>`Ergue ${e.count} esqueletos temporários por 20s.`},
 rejuv:{tree:'druida',tier:1,lvl:10,max:5,act:1,ic:'💚',n:'Rejuvenescer',type:'hot',mp:16,cd:10,heal:[.35,.05],d:e=>`Recupera ${pc(e.heal)} da vida em 6s.`},
 raizes:{tree:'druida',tier:1,lvl:10,max:5,act:1,ic:'🌱',n:'Raízes Enredantes',type:'aoeTarget',mp:14,cd:8,r:40,delay:.25,kind:'roots',root:3,color:'#8ad04a',range:170,m:[1.2,.2],d:e=>`Prende os inimigos na área por 3s: ${pc(e.mult)}.`},
 espinhos:{tree:'druida',tier:1,lvl:10,max:5,ic:'🌵',n:'Pele de Espinhos',pas:{thorns:.1},d:e=>`Devolve ${e.r*10}% do dano corpo a corpo recebido.`},
 urso:{tree:'druida',tier:2,lvl:15,pts:4,max:5,act:1,ic:'🐻',n:'Forma de Urso',type:'bear',mp:25,cd:30,dur:[20,2],m:[1.5,.15],d:e=>`Por ${e.dur}s: +50% de vida, +40% de defesa e ataques de garra (${pc(e.mult)}).`},
 ira:{tree:'druida',tier:3,lvl:25,pts:8,promo:2,max:3,act:1,ic:'🌳',n:'Ira da Floresta',type:'pulse',mp:45,cd:30,r:70,m:[1.4,.25],d:e=>`6 pulsos em 6s ao seu redor: ${pc(e.mult)} de dano e 5% de cura cada.`}};
for(const c of[])CL[c].skills.forEach((s,i)=>SK[c+i]=Object.assign({tree:c,act:1,max:1,lvl:1},s));
// ================== ÍCONES DAS HABILIDADES ==================
// 16×16: moldura escura, fundo brilhando na cor `g` e o símbolo `s` (até 12×12) por cima, com as cores de `p`.
// Habilidade sem desenho aqui continua com o emoji `ic`.
const SKICON={
 fogo:{g:'#ff8a2a',p:{C:'#ff7a1a',d:'#c03a10',y:'#ffd23a',l:'#fff6c0'},s:["....k.......","...kCk..k...","...kCk.kCk..","..kyCCkkCk..","..kyCCCCCk..",".kCyyCCCCCk.",".kCyllyCCdk.","kCyllllyCCdk","kCyllllyCddk",".kCyyyyCCdk.","..kdCCCddk..","...kkkkkk..."]},
 mente:{g:'#8a6cff',p:{C:'#f0a0e8',c:'#ffe0fa',d:'#8a3a86'},s:["...kkkkkk...","..kcCCkCCk..",".kcCddkCdCk.",".kCdCCkdCCk.","kcCCdCkCCdCk","kCdCCdkCdCCk","kCCdCCkCCdCk",".kCCdCkdCCk.","..kddkkkddk.","...kk...kk.."]},
 gelo:{g:'#5fd0ff',p:{c:'#bff4ff',l:'#ffffff'},s:[".....k.....","..k.kck.k..",".kck.c.kck.","..kckckck..","....clc....","kcccclcccck","....clc....","..kckckck..",".kck.c.kck.","..k.kck.k..",".....k....."]},
 foco:{g:'#c070ff',p:{l:'#f4eaff',C:'#b050ff',d:'#5a1a9a'},s:["....kkkk....","..kkllllkk..",".klllCClllk.","kllCCddCCllk","kllCdlkdCllk","kllCdkkdCllk","kllCCddCCllk",".klllCClllk.","..kkllllkk..","....kkkk...."]},
 meteoro:{g:'#ff5020',p:{b:'#9a7a6a',B:'#d0b0a0',d:'#5a3a34',y:'#ffe060',C:'#ff6a20'},s:["..........kk","........kkyk",".......kyyCk","......kyyCk.","....kkyCCk..","..kkCyyCk...",".kCBBbCk....","kCBBbbdCk...","kyBbbbdyk...","kCbbddbCk...",".kCdddCk....","..kkkkk....."]},
 // Bruxo
 raio:{g:'#4aa8ff',p:{l:'#ffffff',c:'#aee6ff'},s:["......kkkk..",".....klllk..","....kllck...","...kllck....","..kllckkkk..",".kllllllllk.","..kkkkcllk..","....kcllk...","...kcllk....","..kcllk.....","..kclk......","..kkk......."]},
 lanca:{g:'#4ac8ff',p:{l:'#ffffff',c:'#bff4ff',C:'#5ab8e0'},s:[".........kkk","........kllk",".......klcCk","......klcCk.",".....klcCk..","....klcCk...","...klcCk....","..klcCk.....",".kkcCk......","kCkkk.......","kCCk........","kkk........."]},
 sobrecarga:{g:'#ff9a30',p:{y:'#ffd040',l:'#fff8d0',r:'#ff6a20',b:'#8ad8ff'},s:[".....kk.....","..k..kyk..k.",".krk.kyk.kbk","..krkyyykbk.","...kyllyk...","kkkyllllykkk","kryyllllyybk","kkkyllllykkk","...kyllyk...","..kbkyyykrk.",".kbk.kyk.krk","..k..kyk..k."]},
 conv:{g:'#6a8cff',p:{c:'#d0dcff',C:'#7a9aff'},s:["...kkkkkk...","..kcccccck..",".kcCkkkkCck.","kcCk....kCck","kcCk.kkk.kCk","kCk.kcck.kCk","kCk.kCk.kcCk","kCk..kkkcCk.","kcCk...kcCk.",".kcCkkkCck..","..kccCCk....","...kkkk....."]},
 tempestade:{g:'#a070ff',p:{l:'#ece4ff',C:'#9a70e0',y:'#ffe860'},s:["....kkkk....","..kkllllkk..",".kllllllllk.","kllllllllllk","kCCllllCCCCk",".kCCCCCCCCk.","..kkkyykkk..","....kyk.....","...kyyk.....","....kyyk....","....kyk.....",".....k......"]},
 // Necromante
 esqueleto:{g:'#4ac070',p:{l:'#f0ecd8',c:'#b8b098',g:'#7dff9a'},s:["...kkkkkk...","..kllllllk..",".kllllllllk.","kllllllllllk","klkkkllkkkck","klkgkllkgkck","kllkkllkkllk",".klllkklllk.","..kclllllck.","..klkllklk..","...kkkkkk..."]},
 dreno:{g:'#4ac070',p:{r:'#e83848',R:'#b01828',d:'#6a0a18',l:'#ffd0d0'},s:[".....kk.....",".....kRk....","....kRRk....","....kRrRk...","...kRrrRk...","..kRrrrrRk..","..kRllrrRk..",".kRrllrrrRk.",".kRrlrrrrRk.",".kRrrrrrdRk.","..kRrrrddk..","...kkkkkk..."]},
 ossos:{g:'#6a9a80',p:{l:'#f0ecd8',c:'#b8b098'},s:[".kk......kk.","kllk....kllk","klllk..klllk",".kkllkkllkk.","...kllllk...","....kllk....","...kclllk...",".kkclkkllkk.","kcllk..kllck","kclk....klck",".kk......kk."]},
 maldicao:{g:'#9a50e0',p:{c:'#e0b0ff',C:'#9a50e0',d:'#5a2090',y:'#b8ff70'},s:["...kkkkkk...","..kcccccck..",".kcCCCCCCck.","kcCkkCCkkCck","kCCkyCCkyCCk","kCCCCCCCCCCk","kCCCkkkkCCCk","kCCCCCCCCCCk","kCCCdCCCdCCk","kCdkkCdkkCdk",".kk..kk..kk."]},
 cadaver:{g:'#9a50e0',p:{g:'#6ae060',l:'#f4ffe0'},s:["....k..k....","..k.kgkgk.k.",".kgkgggggkgk","..kgglllggk.",".kgllllllgk.","kgllkllkllgk","kglllkklllgk",".kgllllllgk.","..kgglllggk.",".kgkgggggkgk","..k.kgkgk.k.","....k..k...."]},
 exercito:{g:'#7a50c0',p:{l:'#f0ecd8',g:'#7dff9a'},s:["....kkkk....","...kllllk...","...kgllgk...","...kllllk...","....kllk....",".kkkk..kkkk.","kllllkkllllk","kgllgkkgllgk","kllllkkllllk",".klkk..klkk.",".kkkk..kkkk."]},
 // Druida
 rejuv:{g:'#ffd860',p:{l:'#e0ffd0',g:'#5ad050',G:'#2a8a30'},s:["..kkk..kkk..",".kllgkkgggk.","kllggggggggk","klggggggggGk","kgggggggggGk",".kgggggggGk.","..kgggggGk..","...kgggGk...","....kgGk....",".....kk....."]},
 raizes:{g:'#d0a050',p:{g:'#8ad04a',G:'#2a8a30',b:'#9a6a3a'},s:["..kk....kk..",".kGgk..kgGk.",".kgGgkkgGgk.","..kkgGGgkk..","....kGGk....",".....kbk....",".....kbk....","..kkkbbbkkk.",".kbbbkbkbbbk","kbk.kbbk.kbk","kk..kbk...kk","....kk......"]},
 espinhos:{g:'#e0c070',p:{g:'#6ac040',G:'#3a8a30',l:'#f0ffd0',b:'#c08040'},s:[".....kk.....","....kglk....",".k..kgGk..k.","kgk.kgGk.kgk","kgGkkgGkkgGk","kgGgggGgggGk",".kkgggGggkk.","...klgGgk...","...kggGlk...","...klgGgk...","..kbbbbbbk..","..kkkkkkkk.."]},
 urso:{g:'#c08040',p:{b:'#9a6034',d:'#e0a070',l:'#e8c090'},s:[".kk......kk.","kbbk....kbbk","kbdkkkkkkdbk",".kbbbbbbbbk.","kbbbbbbbbbbk","kbbkbbbbkbbk","kbbbbllbbbbk","kbbbllkllbbk",".kbblllllbk.","..kbbllbbk..","...kkkkkk..."]},
 ira:{g:'#ff7a30',p:{g:'#5ad050',G:'#2a8a30',l:'#d0ffa0',b:'#8a5a30'},s:["...kkkkkk...",".kkgGggGgkk.","kgGgggggGggk","kggGgllgggGk","kGggglllgggk",".kgGgggGggk.","..kkkbbkkk..","....kbbk....","....kbbk....","..kkbbbbkk..",".kbk.kk.kbk."]},
 // Guerreiro
 giro:{g:'#ff9a40',p:{m:'#e8eef4',M:'#8a98a8',h:'#e8b43c',b:'#7a4e2c',w:'#fff4c0'},s:["..wwww....kk",".w.......kmk","w.......kmMk","w......kmMk.","......kmMk..","..k..kmMk..w","..khkmMk...w","...khMk...w.","..kbkhhk.ww.",".kbk..kk....","kbk.........","kk.........."]},
 vigor:{g:'#ffb040',p:{l:'#ffd0d0',g:'#e8303a',G:'#9a1a22'},s:["..kkk..kkk..",".kllgkkgggk.","kllggggggggk","klggggggggGk","kgggggggggGk",".kgggggggGk.","..kgggggGk..","...kgggGk...","....kgGk....",".....kk....."]},
 grito:{g:'#ff7a30',p:{h:'#e8b43c',b:'#7a4e2c',w:'#ffffff'},s:["......kk..w.",".....khk...w","....khhk.w.w","kk.khhhk.w.w","kbkhhhhk.w.w","kbkhhhhk.w.w","kk.khhhk.w.w","....khhk.w.w",".....khk...w","......kk..w."]},
 pele:{g:'#7ab0e0',p:{m:'#b8c4d0',M:'#6a7888',l:'#ffffff'},s:[".kkk....kkk.","kmmmkkkkmmmk","kmlmmmmmmMmk","kmlmmmmmmMmk",".kmlmmmmMmk.",".kmlmmmmMmk.",".kmmmmmmMmk.","..kmmmmmMk..","..kmmmmmMk..","...kmmmMk...","....kkkk...."]},
 execucao:{g:'#e03030',p:{m:'#d8e0e8',M:'#7a8898',l:'#ffffff',b:'#7a4e2c'},s:[".....kk.....",".kk.kbbk.kk.","klmkkbbkkMlk","klmmkbbkMmlk","klmmMbbMmmlk","klmmkbbkMmlk","klmkkbbkkMlk",".kk.kbbk.kk.","....kbbk....","....kbbk....","....kbbk....","....kkkk...."]},
 // Paladino
 julgamento:{g:'#ffd040',p:{l:'#ffffff',y:'#e8eef4',Y:'#8a98a8',b:'#c08a20'},s:[".kkkkkkkkkk.",".kllyyyyyYk.",".kyyyyyyyYk.",".kYYYYYYYYk.",".kkkkbbkkkk.","....kbbk....","....kbbk....","....kbbk....","....kbbk....","....kbbk....","....kkkk...."]},
 luz:{g:'#ffb020',p:{l:'#ffffff',y:'#fff0a0',Y:'#e0b040'},s:["....kkkk....","....klyk....","....klyk....","....klyk....","kkkkklykkkkk","klllllyyyyyk","kyyyyyyYYYYk","kkkkkyYkkkkk","....kyYk....","....kyYk....","....kyYk....","....kkkk...."]},
 devocao:{g:'#a0c8ff',p:{y:'#ffd84a',l:'#ffffff'},s:["...kkkkkk...",".kkyyyyyykk.","kyykkkkkkyyk","kyk......kyk","kyykkkkkkyyk",".kkyyyyyykk.","...kkkkkk...",".....kk.....","....kllk....","..kkllllkk..","....kllk....",".....kk....."]},
 escudo:{g:'#5ab0ff',p:{y:'#ffc83a',Y:'#b07a18',l:'#ffffff'},s:[".kkkkkkkkkk.",".kyyyllyyyk.",".kyyyllyyyk.",".kllllllllk.",".kllllllllk.",".kyyyllyyYk.",".kyyyllyyYk.","..kyyllyYk..","..kyyllyYk..","...kyllYk...","....kyYk....",".....kk....."]},
 consagracao:{g:'#e0a040',p:{y:'#ffb030',l:'#fff6c0',w:'#f8f0e0',W:'#c8b8a0',h:'#e8b43c'},s:[".....k......","....kyk.....","....kylk....","...kyllyk...","....kyyk....",".....kk.....","...kkkkkk...","...kwwwWk...","...kwwwWk...","...kwwwWk...",".kkhhhhhhkk.","..kkkkkkkk.."]},
 juizo:{g:'#ffd040',p:{y:'#e8b43c',b:'#7a4e2c',l:'#ffffff',Y:'#c8d4ec',w:'#fff8d0'},s:["....kkkk....","....kyyk....","....kbbk....",".kkkkyykkkk.","kyyyyyyyyyyk",".kkkllYYkkk.","...kllYYk...","...kllYYk...","...kllYYk...","w...klYk...w",".w..klYk..w.",".....kk....."]},
 // Berserker
 furia:{g:'#ff8a30',p:{r:'#e83030',w:'#fff0a0'},s:["...kkkkkk...",".kkrrrrrrkk.","krkkrrrrkkrk","krrrkrrkrrrk","krrwkrrkwrrk","krrrrrrrrrrk","krrkkkkkkrrk","krkwwwwwwkrk","krrkkkkkkrrk",".kkrrrrrrkk.","...kkkkkk..."]},
 selvagem:{g:'#e03030',p:{w:'#ffffff',r:'#ff4a4a'},s:["..k...k...k.",".kwk.kwk.kwk",".kwk.kwk.kwk",".kwk.kwk.kwk",".krk.krk.krk",".krk.krk.krk",".krk.krk.krk",".krk.krk.krk",".krk.krk.krk","..k...k...k."]},
 sede:{g:'#9a50e0',p:{r:'#d02040',w:'#ffffff'},s:[".kkkkkkkkkk.","krrrrrrrrrrk","kwwkwwwwkwwk","kwwkkkkkkwwk",".kwk....kwk.",".kwk....kwk.","..k......k..","............",".kk......kk.","krrk....krrk","krrk....krrk",".kk......kk."]},
 salto:{g:'#ffb040',p:{y:'#ff6a40',w:'#ffe0b0',b:'#8a5a30'},s:["....kkkk....","....kyyk....","....kyyk....","....kyyk....","..kkkyykkk..","..kyyyyyyk..","...kyyyyk...","....kyyk....",".....kk.....",".w..w..w..w.","kkkkkkkkkkkk","kbbkbbbbkbbk"]},
 frenesi:{g:'#ff3030',p:{C:'#e82020',d:'#8a1010',y:'#ff8a30',l:'#ffe060'},s:[".......k....","...k..kCk...","..kCk.kCk...","..kCkkCCyk..","..kCCCCCyk..",".kCCCCCyyCk.",".kdCCyllyCk.","kdCCyllllyCk","kddCyllllyCk",".kdCCyyyyCk.","..kddCCCdk..","...kkkkkk..."]},
 avatar:{g:'#ff4020',p:{w:'#f0e8d0',m:'#8a8a98',M:'#4a4a58',r:'#ff3030'},s:["k..........k","kwk......kwk",".kwk....kwk.","..kwkkkkwk..","..kmmmmmMk..",".kmmmmmmmMk.",".kmkkkkkkMk.",".kmkrkkrkMk.",".kmmmkkmmMk.",".kmmkmmkmMk.","..kkk..kkk.."]},
 // Cavaleiro
 investida:{g:'#7fb2ff',p:{w:'#f0f4f8',m:'#c8d0dc',M:'#6a7888',b:'#3a7aff'},s:["..........kk","w.w......kwk","........kwk.","w.w....kwk..","..k...kwk...",".kbk.kwk....",".kbbkmk.....","..kbmMk.....","..kmMMk.....",".kmMMk......","kmMk........","kkk........."]},
 escudada:{g:'#ffb040',p:{b:'#3a6ae0',m:'#d0d8e4',M:'#7a8898',l:'#ffffff'},s:[".kkkkkkkkkk.","kmmmmmmmmmmk","kmbbbbbbbbMk","kmbbbbbbbbMk","kmbbbmmbbbMk","kmbbmllmbbMk","kmbbbmmbbbMk",".kmbbbbbbMk.",".kmbbbbbbMk.","..kmbbbbMk..","...kmmmMk...",".....kk....."]},
 bastiao:{g:'#7fb2ff',p:{m:'#c8c0b0',M:'#8a8070',b:'#5a3a20'},s:[".kk.kkkk.kk.",".kmkkmmkkmk.",".kmmmmmmmMk.",".kkkkkkkkkk.","..kmmmmmMk..","..kmmkkmMk..","..kmmkkmMk..","..kmmmmmMk..","..kmkkkkMk..","..kmkbbkMk..","..kmkbbkMk..","..kkkkkkkk.."]},
 muralha:{g:'#5a8ae0',p:{b:'#3a6ae0',B:'#2a4aa0',m:'#e0e6f0',M:'#9aa4b4',l:'#ffffff'},s:["kkkkkkkkkkkk","klBkklMkklBk","kbBkkmMkkbBk","kbBkkmMkkbBk","kbBkkmMkkbBk","kbBkkmMkkbBk","kbBkkmMkkbBk","kbBkkmMkkbBk",".kk..kk..kk."]},
 contra:{g:'#4a8aff',p:{m:'#e8eef4',h:'#e8b43c',b:'#7a4e2c'},s:["kk........kk","kmk......kmk",".kmk....kmk.","..kmk..kmk..","...kmkkmk...","....kmmk....","...kmkkmk...",".khkk..kkhk.","..kh....hk..",".kbhk..khbk.","kbk......kbk","kk........kk"]},
 estandarte:{g:'#ffb040',p:{r:'#3a6ae0',w:'#ffd84a',b:'#8a5a2c',y:'#ffd84a'},s:["kk..........","kyk.........","kbkkkkkkkkk.","kbkrrrrrrrk.","kbkrrwwrrrk.","kbkrwrrwrrk.","kbkrrwwrrrk.","kbkrrrrrrk..","kbkrk.krk...","kbkk...k....","kbk.........","kkk........."]},
 // Arqueira
 multi:{g:'#6ac040',p:{m:'#e8eef4',M:'#9aa4b4',b:'#e0c090',f:'#ff5a4a'},s:["......m.....",".....mMm....","..m...b...m.",".mMm..b..mMm","..b...b...b.","..b...b...b.","..b...b...b.","..b..fbf..b.","..b..f.f..b.",".fbf.....fbf",".f.f.....f.f"]},
 aguia:{g:'#5ab0ff',p:{w:'#f4f0e8',b:'#8a5a30',y:'#ffc030',e:'#ffd040'},s:["...kkkkk....","..kwwwwwk...",".kwwwwwwwk..",".kwwkewwwyk.","kwwwkkwwyyyk","kbwwwwwwkyyk","kbbwwwwk.kyk","kbbbbbbk..k.","kbbbbbk.....",".kbbbk......","..kkk......."]},
 perfurante:{g:'#4aa8ff',p:{y:'#ffe060',f:'#ff5a4a',b:'#e0c090',m:'#e8eef4'},s:["...yy.......","...yy....k..","ff.yy....mk.","fbbbbbbbbmmk","ff.yy....mk.","...yy....k..","...yy......."]},
 passos:{g:'#8ad04a',p:{w:'#ffffff',b:'#9a6a3a',s:'#d0ffd0'},s:["k.k.........","kwkwk.kkkk..",".kwwkkbbbk..","..kwwkbbbk..","...kkkbbbk..",".s...kbbbk..",".....kbbbkk.","s.s..kbbbbbk",".s...kbbbbbk",".....kkkkkkk"]},
 chuva:{g:'#5a8ae0',p:{f:'#ffffff',b:'#e0c090',m:'#e8eef4',M:'#9aa4b4'},s:["f.f.........","fbf......f.f",".b.......fbf",".b...f.f..b.","mMm..fbf..b.",".m....b..mMm","..f.f.b...m.","..fbfmMmf.f.","...b..m.fbf.","...b.....b..","..mMm....b..","...m....mMm."]},
 // Caçadora
 companheiro:{g:'#d8a86a',p:{g:'#8a8a98',w:'#e8e8f0',y:'#ffd040'},s:[".kk......kk.",".kgk....kgk.",".kggkkkkggk.","kggggggggggk","kgyggggggygk","kggggwwggggk",".kggwwwwggk.",".kgwwkkwwgk.","..kwwwwwwk..","...kwwwwk...","....kkkk...."]},
 marca:{g:'#d8a86a',p:{r:'#ff3a3a',w:'#ffffff'},s:["....kkkk....","..kkrrrrkk..",".krrk..krrk.",".krk.ww.krk.","krk..ww..krk","krwwwrrwwwrk","krwwwrrwwwrk","krk..ww..krk",".krk.ww.krk.",".krrk..krrk.","..kkrrrrkk..","....kkkk...."]},
 vinculo:{g:'#ff7aa0',p:{b:'#f0c890'},s:["...kk..kk...","..kbbkkbbk..","..kbbkkbbk..","kk.kk..kk.kk","kbbk....kbbk","kbbk.kk.kbbk",".kk.kbbk.kk.","...kbbbbk...","..kbbbbbbk..","..kbbbbbbk..","...kbbbbk...","....kkkk...."]},
 uivo:{g:'#5a6ae0',p:{y:'#fff0b0',l:'#ffffff',d:'#d8c880'},s:["...kkkkkk...",".kkllllyykk.",".klllyyyyyk.","kllyyyyyddyk","klyyyyyyddyk","kyyddyyyyyyk","kyyddyyyyyyk","kyyyyyyyyyyk",".kyyyddyyyk.",".kkyyyyyykk.","...kkkkkk..."]},
 matilha:{g:'#c06a30',p:{b:'#fff4e0'},s:["......b.b.b.","............",".......bbb..","......bbbbb.",".......bbb..","............",".b.b.b......","............","..bbb.......",".bbbbb......","..bbb......."]},
 fera:{g:'#ff6a20',p:{g:'#4a4a5a',r:'#ff3030',w:'#ffffff'},s:["kk........kk","kgk......kgk","kggkkkkkkggk","kggggggggggk","kgrkggggkrgk","kggggggggggk",".kgggkkgggk.",".kgkwkkwkgk.","..kgwwwwgk..","...kggggk...","....kkkk...."]},
 // Patrulheira
 armadilha:{g:'#8ad04a',p:{l:'#ffffff',M:'#8a98a8',b:'#9a6a3a'},s:[".kk..kk..kk.",".lM..lM..lM.","klMkklMkklMk","kllMkllMkllM","kkkkkkkkkkkk","kbbbbbbbbbbk","kkkkkkkkkkkk"]},
 rajada:{g:'#8ad04a',p:{w:'#ffffff',b:'#8a5a30',s:'#e0c090',f:'#ff5a4a',m:'#e8eef4'},s:["..kk........","..wbk.......","..w.bk......","..w..bk.....","..w...bk.k..","ffsssssssmmk","..w...bk.k..","..w..bk.....","..w.bk......","..wbk.......","..kk........"]},
 precisao:{g:'#8ad04a',p:{r:'#e83030',w:'#ffffff',y:'#ffd040'},s:["...kkkkkk...",".kkrrrrrrkk.",".krwwwwwwrk.","krwwrrrrwwrk","krwrrwwrrwrk","krwrwyywrwrk","krwrwyywrwrk","krwrrwwrrwrk","krwwrrrrwwrk",".krwwwwwwrk.",".kkrrrrrrkk.","...kkkkkk..."]},
 rede:{g:'#5ab0a0',p:{w:'#f4ecd0'},s:["w...w...w...",".w.w.w.w.w.w","..w...w...w.",".w.w.w.w.w.w","w...w...w...",".w.w.w.w.w.w","..w...w...w.",".w.w.w.w.w.w","w...w...w...",".w.w.w.w.w.w","..w...w...w.",".w.w.w.w.w.w"]},
 recuo:{g:'#8ad04a',p:{w:'#ffffff',s:'#d0ffd0'},s:["...kkkkkk...","..kwwwwwwk..",".kwwkkkkwwk.",".kwk....kwk.","kwwwk...kwk.",".kwk....kwk.","..k.....kwk.","........kwk.",".s.s....kwk.","s.s.s...kkk."]},
 tempestade2:{g:'#8ad04a',p:{w:'#d0f0e0'},s:["kkkkkkkkkkkk","kwwwwwwwwwwk",".kkkkkkkkkk.",".kwwwwwwwwk.","..kkkkkkkk..","...kwwwwwk..","...kkkkkkk..","....kwwwk...","....kkkkk...",".....kwk....",".....kk....."]},
 // Assassina
 veneno:{g:'#b070ff',p:{b:'#9a6a3a',w:'#c8d8e0',g:'#7aff4a',G:'#3a9a20',l:'#e0ffd0'},s:["....kkkk....","....kbbk....","....kwwk....","....kwwk....","...kwwwwk...","..kggggggk..",".kglgggggGk.",".kglggggGGk.",".kgggggggGk.",".kgggggGGGk.","..kGGGGGGk..","...kkkkkk..."]},
 sombras:{g:'#b070ff',p:{c:'#9a70d0',C:'#5a3a8a',d:'#3a2060',y:'#ffe0ff'},s:["....kkkk....","...kccCCk...","..kccCCCCk..",".kcCkkkkCCk.",".kcCykkyCCk.",".kcCkkkkCCk.","kcCCCkkkCCCk","kcCCCCCCCCCk","kcCCCCCCCCdk","kcCCdCCCdCdk","kkkkkkkkkkkk"]},
 letal:{g:'#b070ff',p:{y:'#e8b43c',b:'#5a3a2a',l:'#ffffff',M:'#9aa4b4',r:'#ff3030'},s:[".....kk.....","....kyyk....","....kbbk....","....kbbk....","..kkkyykkk..","..kyyyyyyk..","....klMk....","....klMk....","....krMk....","....klMk....",".....kk.....",".....rr....."]},
 leque:{g:'#b070ff',p:{l:'#ffffff',M:'#9aa4b4',y:'#e8b43c',b:'#5a3a2a'},s:[".....kk.....","kk..klMk..kk","klk.klMk.klk",".klk.lM.klk.","..klklMklk..","...kllMMk...","..kkyyyykk..","...kbbbbk...","....kbbk....","....kkkk...."]},
 toxinas:{g:'#b070ff',p:{g:'#7aff4a'},s:["...kkkkkk...","..kggggggk..",".kggggggggk.",".kgkkggkkgk.",".kgkkggkkgk.",".kgggkkgggk.","..kgkggkgk..","...kkkkkk...","....g..g....","....g......."]},
 sentenca:{g:'#ff4060',p:{b:'#6a3a8a',y:'#d0a0ff'},s:["...kkkkkk...","..kbbbbbbk..",".kbbbyybbbk.","kbbyyyyyybbk","kbbbbyybbbbk",".kbbbyybbbk.",".kbbbyybbbk.",".kbbbbbbbbk.","..kbbbbbbk..","..kbbbbbbk..","...kkkkkk..."]},
};
const skMix=(a,b,t)=>'#'+hexRGB(a).map((v,i)=>Math.round(v+(hexRGB(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');
const skIcCache={};
function skIconURL(id){const D=SKICON[id];if(!D)return null;if(skIcCache[id])return skIcCache[id];
 const c=cnv(16,16),x=c.getContext('2d'),g=D.g,dark=skMix(g,'#0a0710',.82),mid=skMix(g,'#0a0710',.55),hi=skMix(g,'#0a0710',.3),rim=skMix(g,'#000000',.35);
 for(let j=0;j<16;j++)for(let i=0;i<16;i++){if((i<1||i>14)&&(j<1||j>14))continue;const d=hyp(i-7.5,j-7.5);
  x.fillStyle=i===0||i===15||j===0||j===15?K:i===1||i===14||j===1||j===14?rim:d<2.6?g:d<4.2?hi:d<5.6?mid:dark;x.fillRect(i,j,1,1);}
 const s=mk(D.s,D.p);x.drawImage(s,(16-s.width)>>1,(16-s.height)>>1);return skIcCache[id]=toURL(c,4);}
// HTML do ícone: a imagem desenhada, ou o emoji enquanto a habilidade não tem desenho
const skIcHTML=id=>{const u=skIconURL(id);return u?`<img class="ski" src="${u}" alt="">`:SK[id].ic;};
const rk=id=>(P&&P.ranks&&P.ranks[id])||0;


const treePts=t=>{let s=0;for(const id in P.ranks)if(SK[id]&&SK[id].tree===t)s+=P.ranks[id];return s;};
// 1 ponto por nível de Classe: até 9 na classe inicial (Classe 1→10) e mais 49 no caminho (Classe 1→50 de novo)
const ptsTotal=()=>P.spec?9+P.jlvl-1:P.jlvl-1;
function ptsFree(){if(!hasTree(P.cls))return 0;let s=0;for(const id in P.ranks)if(SK[id]&&TREES[SK[id].tree])s+=P.ranks[id];return ptsTotal()-(s-1);}
// nível de Classe exigido: na árvore da classe inicial vale o `lvl` da habilidade (já cumprido depois de virar aprendiz);
// no caminho, `lvl` conta a partir da especialização (lvl 15 → Classe 5 do caminho)
const skillJob=s=>s.tree===CT().base?(P.spec?0:s.lvl):s.lvl-10;
function canLearn(id){const s=SK[id];if(!hasTree(P.cls)||!TREES[s.tree])return'Indisponível';
 if(s.tree!==CT().base&&!CT().specs.includes(s.tree))return'Indisponível';if(s.tree!==CT().base&&P.spec!==s.tree)return'Exige o caminho de '+TREES[s.tree];if(rk(id)>=s.max)return'Rank máximo';
 if(P.jlvl<skillJob(s))return'Exige nível de Classe '+skillJob(s);if(s.pts&&treePts(s.tree)<s.pts)return`Exige ${s.pts} pontos em ${TREES[s.tree]}`;
 if(s.promo&&P.promo<s.promo)return'Exige a promoção (Classe 25 no caminho)';if(ptsFree()<1)return'Sem pontos livres';return null;}
function learn(id){const why=canLearn(id);if(why){log(why,'#ff9a7a');return false;}P.ranks[id]=rk(id)+1;
 if(SK[id].act&&!P.bar.includes(id)){const i=P.bar.indexOf(null);if(i>=0)P.bar[i]=id;}
 if(SK[id].n)log(`${SK[id].n} agora está no rank ${P.ranks[id]}.`,'#ffe3a0');recalc();buildHotbar();save();return true;}
const respecCost=()=>P.lvl*20;
function respec(){const c=respecCost();if(P.gold<c){log('Ouro insuficiente.','#ff6b6b');return false;}P.gold-=c;P.ranks={[CT().free]:1};P.bar=[CT().free,null,null,null,null,null];P.shield=null;P.banner=null;
 if(P.form){P.form=null;}allies.length=0;recalc();buildHotbar();save();log('Seus pontos foram devolvidos.','#ffe3a0');return true;}

// ================== ATRIBUTOS ==================
// a base vem dos atributos (attrStats, em 16); depois somam equipamento, passivas, caminho, forma e buffs
function recalc(){const c=CL[P.cls],L=P.lvl-1;const st=Object.assign(attrStats(c,L),{spd:0,dmgPct:0,mpCut:0,thorns:0,leech:0,rage:0,block:0,toxin:0,petPct:0});
 for(const k in P.equip){const it=P.equip[k];if(it)for(const s in it.stats)st[s]+=it.stats[s];}
 const pct={hpPct:0,mpPct:0,defPct:0,atkPct:0};
 for(const id in(P.ranks||{})){const s=SK[id];if(s&&s.pas)for(const k in s.pas){const v=s.pas[k]*P.ranks[id];if(k in pct)pct[k]+=v;else st[k]+=v;}}
 if(P.spec){const b=SPECS[P.spec].bonus,mul=P.promo>=2?2:1;for(const k in b)pct[k]+=b[k]*mul;}
 if(P.form){pct.hpPct+=.5;pct.defPct+=.4;}
 st.hp*=1+pct.hpPct;st.mp*=1+pct.mpPct;st.def*=1+pct.defPct;st.atk*=1+pct.atkPct;
 if(P.buff){st.atk*=1+P.buff.atk;st.def*=1+P.buff.def;st.spd+=P.buff.spd||0;}consStats(st);st.block=Math.min(st.block,.35);
 st.spd=Math.min(st.spd,40);st.crit=clamp(st.crit,0,60);st.cdr=clamp(st.cdr,0,.4);st.mpCut=Math.min(st.mpCut,.4);st.dodge=clamp(st.dodge,0,.3);st.aspd=clamp(st.aspd,0,.6);
 for(const k of['hp','mp','atk','def'])st[k]=Math.round(st[k]);st.crit=Math.round(st.crit);
 P.st=st;if(P.hp!=null){P.hp=Math.min(P.hp,st.hp);P.mp=Math.min(P.mp,st.mp);}}

// ================== DANO ==================
function dmgRoll(mult){let d=P.st.atk*mult*(1+P.st.dmgPct+P.st.rage*(1-P.hp/P.st.hp))*rf(.9,1.1);let crit=R()*100<P.st.crit;if(P.ambush){crit=true;d*=1.5;P.ambush=false;}if(crit)d*=1.8;return{d,crit};}
function hitMonster(m,mult,o={}){if(m.dead)return 0;const{d,crit}=dmgRoll(mult);return dealMonster(m,d,crit,o);}
function dealMonster(m,d,crit,o={}){if(m.dead)return 0;if(m.curse&&m.curse.t>0)d*=1+m.curse.amp;
 const f=Math.max(1,Math.round(d*60/(60+m.dfn)));m.hp-=f;m.hitT=.12;if(m.state==='idle')m.state='chase';P.combatT=time;
 addText(m.x+rf(-5,5),m.y-mh(m)-2,f,o.src==='ally'?'#bfffbf':crit?'#ffd23a':'#ffffff',crit);
 if(o.slow)m.slowT=o.slow;if(o.root)m.rootT=o.root;if(o.bleed)m.dot={t:4,acc:0,c:'#c0303a',dps:f*o.bleed/4*(60+m.dfn)/60};if(o.poison)m.dot={t:5,acc:0,c:'#7dff5a',dps:f*o.poison*(1+P.st.toxin)/5*(60+m.dfn)/60};
 if(P.st.leech&&!['ally','dot','thorns'].includes(o.src))P.hp=Math.min(P.st.hp,P.hp+f*P.st.leech);
 if(o.drain){const h=Math.round(f*o.drain);P.hp=Math.min(P.st.hp,P.hp+h);if(h>0)addText(P.x,P.y-26,'+'+h,'#5dff7a');}
 if(m.hp<=0)killMonster(m,o.src||'skill');return f;}
function explode(x,y,r,mult,color,o={}){fx.push({k:'boom',x,y,r,t:0,max:.35,color});burst(x,y,color,18,80);
 for(const m of mons)if(!m.dead&&hyp(m.x-x,m.y-mh(m)/2-y)<r+m.r)hitMonster(m,mult,o);}
function onKill(m,src){const q=P.quest;
 if(q&&!q.done&&trialKill(SPECS[q.spec].trial,m,src)){q.prog++;questCheck();}
 const c=rk('cadaver');if(c&&src!=='corpse'&&R()<c*.12)setTimeout(()=>explode(m.x,m.y-6,32,1.5,'#9dff9a',{src:'corpse'}),60);}
function weakOf(m){return m.curse&&m.curse.t>0?1-m.curse.weak:1;}

// ================== ATAQUES E HABILIDADES ==================
const basicRange=()=>P.form?22:CL[P.cls].range;
function basicAttack(){if(tooHeavy())return;const t=P.target,c=CL[P.cls];if(P.stealth){P.stealth=null;P.ambush=true;}P.swingT=.18;P.combatT=time;
 if(P.form){P.atkT=.8;hitMonster(t,P.form.mult,{src:'basic'});fx.push({k:'slash',x:P.x+P.face*8,y:P.y-8,face:P.face,t:0,max:.2,color:'#ffe0b0',big:true});return;}
 P.atkT=c.atkCd/(1+P.st.aspd);
 if(c.proj){const a=Math.atan2(t.y-mh(t)/2-(P.y-9),t.x-P.x);projs.push({x:P.x+P.face*4,y:P.y-9,vx:Math.cos(a)*c.proj.speed,vy:Math.sin(a)*c.proj.speed,speed:c.proj.speed,target:t,homing:true,mult:1,color:c.proj.color,size:c.proj.size,arrow:!!c.proj.arrow,life:2,o:{src:'basic'}});}
 else{hitMonster(t,1,{src:'basic'});fx.push({k:'slash',x:P.x+P.face*8,y:P.y-8,face:P.face,t:0,max:.18,color:'#ffffff'});}}
const NEEDT={single:1,proj:1,aoeTarget:1,chain:1,curse:1,storm:1,leap:1,volley:1,execute:1};
function useSkill(slot){if(!P||P.dead||tooHeavy())return;const id=P.bar[slot];if(!id)return;const sk=SK[id];if((P.cd[id]||0)>0)return;
 const cost=Math.round(sk.mp*(1-P.st.mpCut));if(P.mp<cost){log('Mana insuficiente.','#7fb2ff');flashSlot(slot+1);return;}
 let t=P.target&&!P.target.dead?P.target:null;
 if(NEEDT[sk.type]){if(!t){t=nearestMon(200);if(t)P.target=t;}if(!t){log('Nenhum alvo por perto.','#cccccc');return;}
  if(hyp(t.x-P.x,t.y-P.y)>(sk.range||200)+t.r*.5){P.auto=true;P.queued=slot;P.dest=null;return;}}
 const e=eff(id,rk(id));P.mp-=cost;if(P.stealth&&sk.type!=='stealth'){P.stealth=null;P.ambush=true;}P.cd[id]=sk.cd*(1-P.st.cdr);P.combatT=time;P.swingT=.2;if(t)P.face=t.x>=P.x?1:-1;const cx=P.x,cy=P.y-8,o={src:'skill'};
 if(castWar(sk,e,t)||castArcher(sk,e,t)){updateHotbar();return;}
 switch(sk.type){
 case'aoeSelf':fx.push({k:'ring',x:P.x,y:P.y-4,r0:4,r1:sk.r,t:0,max:.35,color:sk.color,w:3});burst(P.x,P.y-6,sk.color,24,90);
  for(const m of mons)if(!m.dead&&hyp(m.x-P.x,m.y-P.y)<sk.r+m.r)hitMonster(m,e.mult,{src:'skill',slow:sk.slow});break;
 case'buff':P.buff={t:e.dur||sk.dur,atk:sk.batk?e.batk:sk.atk,def:sk.bdef?e.bdef:sk.def,spd:e.bspd||0};recalc();fx.push({k:'ring',x:P.x,y:P.y-4,r0:30,r1:4,t:0,max:.4,color:sk.color,w:2});burst(P.x,P.y-8,sk.color,20,50);log(sk.n+'!','#ff9a5a');break;
 case'single':hitMonster(t,e.mult,{src:'skill',root:sk.root,bleed:e.bleed});fx.push({k:'slash',x:t.x,y:t.y-mh(t)/2,face:P.face,t:0,max:.3,color:sk.color,big:true});burst(t.x,t.y-mh(t)/2,sk.color,16,70);shake(2);break;
 case'proj':{const a0=Math.atan2(t.y-mh(t)/2-cy,t.x-cx),n=sk.count||1;const po={src:'skill',slow:sk.slow,drain:sk.drain,poison:e.poison,root:sk.root};
  for(let k=0;k<n;k++){const a=a0+(n>1?(k/(n-1)-.5)*sk.spread:0);
   projs.push({x:cx,y:cy,vx:Math.cos(a)*sk.speed,vy:Math.sin(a)*sk.speed,speed:sk.speed,mult:e.mult,color:sk.color,size:sk.size||3,arrow:!!sk.arrow,aoe:sk.aoe||0,pierce:!!sk.pierce,homing:!!sk.homing,target:sk.homing?t:null,life:sk.homing?2:(sk.range||200)/sk.speed+.15,hit:new Set(),o:po});}break;}
 case'aoeTarget':pAoe.push({x:t.x,y:t.y,r:sk.r,t:0,delay:sk.delay,mult:e.mult,color:sk.color,kind:sk.kind,root:sk.root});break;
 case'chain':{const hit=[t];let cur=t;for(let j=0;j<e.jumps;j++){let nx=null,bd=75;for(const m of mons){if(m.dead||hit.includes(m))continue;const d=hyp(m.x-cur.x,m.y-cur.y);if(d<bd){bd=d;nx=m;}}if(!nx)break;hit.push(nx);cur=nx;}
  const pts=[[cx,cy]].concat(hit.map(m=>[m.x,m.y-mh(m)/2]));fx.push({k:'bolt',pts,t:0,max:.25,color:sk.color});
  hit.forEach((m,i)=>{hitMonster(m,e.mult*Math.pow(.9,i),o);burst(m.x,m.y-mh(m)/2,sk.color,6,50);});break;}
 case'curse':fx.push({k:'ring',x:t.x,y:t.y,r0:6,r1:sk.r,t:0,max:.4,color:sk.color,w:2});burst(t.x,t.y-8,sk.color,16,40);
  for(const m of mons)if(!m.dead&&hyp(m.x-t.x,m.y-t.y)<sk.r+m.r){m.curse={t:8,amp:e.amp,weak:.25};if(m.state==='idle')m.state='chase';}break;
 case'storm':pAoe.push({x:t.x,y:t.y,r:sk.r,t:0,delay:4,mult:e.mult,color:sk.color,kind:'storm',hits:e.hits,total:e.hits,next:0,arrow:sk.arrow});break;
 case'summon':{const own=allies.filter(a=>!a.temp);if(own.length>=e.cap){own[0].dead=true;burst(own[0].x,own[0].y-8,'#9dff9a',10,40);}allies.push(makeAlly(0));break;}
 case'army':for(let k=0;k<e.count;k++)allies.push(makeAlly(20));banner('Exército dos Mortos','Os mortos atendem ao seu chamado.');break;
 case'hot':P.hot={t:6,rate:P.st.hp*e.heal/6};for(const a of allies)a.hot={t:6,rate:a.maxHp*e.heal/6};fx.push({k:'ring',x:P.x,y:P.y-4,r0:26,r1:4,t:0,max:.5,color:'#7dff7a',w:2});break;
 case'bear':{const old=P.st.hp;P.form={t:e.dur,mult:e.mult};recalc();P.hp+=P.st.hp-old;burst(P.x,P.y-8,'#c89a5a',30,70);shake(2);log('Forma de Urso!','#e8c090');buildHotbar();break;}
 case'pulse':P.pulse={n:6,next:0,mult:e.mult,r:sk.r};break;}
 updateHotbar();}
function stormTick(a,dt){a.next-=dt;if(a.next<=0&&a.hits>0){a.hits--;a.next=a.delay/a.total;const ang=R()*6.28,d=R()*a.r;const x=a.x+Math.cos(ang)*d,y=a.y+Math.sin(ang)*d*.6;
 if(a.arrow){for(let k=0;k<5;k++)parts.push({x:x+rf(-8,8),y:y-40+rf(-6,6),vx:0,vy:300,g:0,life:.12,max:.12,color:a.color,s:1,streak:true});}else fx.push({k:'bolt',pts:[[x+rf(-8,8),y-90],[x+rf(-6,6),y-50],[x,y-6]],t:0,max:.2,color:a.color});explode(x,y-6,24,a.mult,a.color,{src:'skill'});shake(1.5);}return a.hits<=0;}

// ================== ALIADOS ==================
const allies=[];
function makeAlly(temp){const e=eff('esqueleto',Math.max(1,rk('esqueleto')));const hp=Math.round(P.st.hp*e.hpm*(temp?.7:1));
 burst(P.x,P.y,'#9dff9a',14,50);return{x:P.x+rf(-14,14),y:P.y+rf(-6,12),maxHp:hp,hp,atkM:e.mult,atkT:0,face:1,animT:0,hitT:0,temp,target:null,dead:false,moving:false};}
function hurtAlly(a,m){const d=Math.max(1,Math.round(m.atk*weakOf(m)*rf(.9,1.1)*60/(60+P.st.def*.6)));a.hp-=d;a.hitT=.15;addText(a.x,a.y-18,'-'+d,'#ffb0b0');
 if(a.hp<=0){a.dead=true;burst(a.x,a.y-8,'#e8e2cc',12,50);}}
function updateAllies(dt){for(const a of allies){if(a.dead)continue;a.animT+=dt;a.atkT-=dt;a.hitT-=dt;a.moving=false;
  if(a.temp){a.temp-=dt;if(a.temp<=0){a.dead=true;burst(a.x,a.y-8,'#9dff9a',10,40);continue;}}
  if(a.hot){a.hot.t-=dt;a.hp=Math.min(a.maxHp,a.hp+a.hot.rate*dt);if(a.hot.t<=0)a.hot=null;}
  const dP=hyp(P.x-a.x,P.y-a.y);if(dP>260){a.x=P.x+rf(-10,10);a.y=P.y+rf(-6,10);continue;}
  if(!a.target||a.target.dead||hyp(a.target.x-P.x,a.target.y-P.y)>170){a.target=null;
   if(P.target&&!P.target.dead&&hyp(P.target.x-P.x,P.target.y-P.y)<170)a.target=P.target;
   else{let bd=110;for(const m of mons){if(m.dead||m.state!=='chase')continue;const d=hyp(m.x-a.x,m.y-a.y);if(d<bd){bd=d;a.target=m;}}}}
  const spd=a.kind==='wolf'?100:78;
  if(a.target&&!P.dead){const t=a.target,d=hyp(t.x-a.x,t.y-a.y);
   if(d>t.r+8){stepSmart(a,(t.x-a.x)/d*spd*dt,(t.y-a.y)/d*spd*dt,3,1);a.face=t.x>a.x?1:-1;a.moving=true;}
   else if(a.atkT<=0){a.atkT=1;a.face=t.x>a.x?1:-1;dealMonster(t,P.st.atk*a.atkM*rf(.9,1.1),false,{src:'ally'});}}
  else if(dP>28){stepSmart(a,(P.x-a.x)/dP*spd*dt,(P.y-a.y)/dP*spd*dt,3,1);a.face=P.x>a.x?1:-1;a.moving=true;}}
 for(let i=allies.length-1;i>=0;i--)if(allies[i].dead)allies.splice(i,1);}
function pickTarget(m,dP){let tg=P,bd=dP;for(const a of allies){if(a.dead)continue;const d=hyp(a.x-m.x,a.y-m.y);if(d<bd&&d<70){bd=d;tg=a;}}return tg;}

// ================== TIMERS POR QUADRO ==================
function tickSkills(dt){for(const id in P.cd)P.cd[id]=Math.max(0,P.cd[id]-dt);
 if(P.form){P.form.t-=dt;if(P.form.t<=0){P.form=null;recalc();burst(P.x,P.y-8,'#c89a5a',16,50);log('Você voltou à forma humana.','#e8c090');buildHotbar();}}
 if(P.hot){P.hot.t-=dt;P.hp=Math.min(P.st.hp,P.hp+P.hot.rate*dt);if(R()<.3)parts.push({x:P.x+rf(-6,6),y:P.y-rf(0,14),vx:0,vy:-20,g:0,life:.5,max:.5,color:'#7dff7a',s:1});if(P.hot.t<=0)P.hot=null;}
 if(P.pulse){P.pulse.next-=dt;if(P.pulse.next<=0){P.pulse.n--;P.pulse.next=1;const p=P.pulse;
   fx.push({k:'ring',x:P.x,y:P.y-2,r0:8,r1:p.r,t:0,max:.45,color:'#8ad04a',w:3});burst(P.x,P.y-6,'#8ad04a',16,80);
   for(const m of mons)if(!m.dead&&hyp(m.x-P.x,m.y-P.y)<p.r+m.r)hitMonster(m,p.mult,{src:'skill'});
   const h=Math.round(P.st.hp*.05);P.hp=Math.min(P.st.hp,P.hp+h);addText(P.x,P.y-26,'+'+h,'#5dff7a');if(p.n<=0)P.pulse=null;}}
 updateAllies(dt);nascTick();lookFx();tickWar(dt);tickArcher(dt);portalTick(dt);tickPay(dt);}

// ================== MENTORA E PROVAS ==================
const MENTOR={x:(TC.x-3.5)*TILE,y:(TC.y-1)*TILE};
let nascs=[];
// quem cuida da prova e da promoção: cada classe com mestre próprio vai a ele (MENT_CLS); as outras, à Mestra Elara.
// O Mago vai à Arquimaga Selene, na Torre de Arcádia (21); a Arqueira, à Caçadora Kaya, na cabana de Pinheiral (22).
// A prova guarda quem a deu (by); prova sem 'by' (aceita com a Elara antes, em saves antigos) termina com a Elara.
const MENTN={elara:['Mestra Elara','na casa com a estrela na placa, em Valdor'],selene:['Arquimaga Selene','na Torre dos Magos, no centro de Arcádia'],
 kaya:['Caçadora Kaya','na cabana no canto nordeste de Pinheiral']},MENT_CLS={mago:'selene',arqueira:'kaya'};
const mentorOf=()=>P.quest?P.quest.by||'elara':MENT_CLS[P.cls]||'elara';
function acceptTrial(spec){if(!hasTree(P.cls)||SPECS[spec].cls!==P.cls||P.jlvl<10||P.spec||P.quest)return;const T=SPECS[spec].trial;P.quest={spec,prog:0,goal:T.goal,done:false,by:mentorOf()};
 if(spec==='druida'&&CUR==='floresta')placeNascs();banner('Prova: '+SPECS[spec].ap,T.t);log('Nova prova: '+T.t+'.','#ffe3a0');save();}
function abandonTrial(){P.quest=null;nascs=[];save();log('Você abandonou a prova.','#cccccc');}
function questCheck(){const q=P.quest;if(q&&!q.done&&q.prog>=q.goal){q.prog=q.goal;q.done=true;const[mn,mw]=MENTN[mentorOf()];banner('Prova concluída!',`Volte à ${mn}, ${mw}.`);log(`Prova concluída! Fale com a ${mn}.`,'#ffd24a');save();}}
function completeTrial(){const q=P.quest;if(!q||!q.done)return;P.spec=q.spec;P.promo=1;P.quest=null;P.jlvl=1;P.jxp=0;nascs=[];recalc();
 banner(SPECS[P.spec].ap,'Um novo ramo se abriu. Seu nível de Classe recomeça do 1.');log(`Você agora é ${SPECS[P.spec].ap}! Seu nível de Classe recomeça do 1 e vai até 50; cada nível dá 1 ponto para a árvore (T).`,'#ffd24a');
 for(let i=0;i<30;i++)parts.push({x:P.x+rf(-8,8),y:P.y-rf(0,16),vx:rf(-15,15),vy:rf(-90,-30),g:0,life:1,max:1,color:SPECS[P.spec].cor,s:2});buildHotbar();save();}
function promote(){if(!P.spec||P.promo>=2||P.jlvl<25)return;P.promo=2;recalc();banner(SPECS[P.spec].n,'Sua habilidade suprema foi desbloqueada.');log(`Você foi promovido a ${SPECS[P.spec].n}!`,'#ffd24a');save();}
const title=()=>P.spec?(P.promo>=2?SPECS[P.spec].n:SPECS[P.spec].ap):CL[P.cls].nome;
function placeNascs(){nascs=[];for(let k=0;k<600&&nascs.length<3;k++){const t=randTile(1);if(!t)break;
  let wet=false;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(ground[(t.y+dy)*W+t.x+dx]===G.WATER)wet=true;
  const x=(t.x+.5)*TILE,y=(t.y+.8)*TILE;if(!wet||nascs.some(n=>hyp(n.x-x,n.y-y)<300))continue;nascs.push({x,y,state:'corr',guards:[]});}
 while(nascs.length<3){const t=randTile(1);nascs.push({x:(t.x+.5)*TILE,y:(t.y+.8)*TILE,state:'corr',guards:[]});}
 P.quest.nasc=nascs.map(n=>({x:n.x,y:n.y,state:n.state}));}
function restoreNascs(){nascs=CUR==='floresta'&&P.quest&&P.quest.nasc?P.quest.nasc.map(n=>({x:n.x,y:n.y,state:n.state==='pure'?'pure':'corr',guards:[]})):[];}
function purify(n){if(n.state!=='corr')return;n.state='guard';const tx=Math.floor(n.x/TILE),ty=Math.floor(n.y/TILE);
 for(let i=0;i<3;i++){const m=makeMon(R()<.5?'lobo':'slime',n.x+rf(-30,30),n.y+rf(-20,20),clamp(lvlAt(tx,ty)+2,1,20),{state:'chase',zone:9});if(blocked(m.x,m.y,4)){m.x=n.x;m.y=n.y;}m.name='Espírito Corrompido';n.guards.push(m);mons.push(m);}
 banner('A nascente resiste!','Derrote os espíritos corrompidos.');burst(n.x,n.y-6,'#8a3aa0',20,60);}
function nascTick(){for(const n of nascs)if(n.state==='guard'&&n.guards.every(g=>g.dead)){n.state='pure';burst(n.x,n.y-6,'#7dff9a',30,70);
  if(P.quest){P.quest.prog++;P.quest.nasc=nascs.map(k=>({x:k.x,y:k.y,state:k.state}));log(`Nascente purificada (${P.quest.prog}/3).`,'#9dff9a');questCheck();}}}
function nearestInteract(){let b=null,bd=26;for(const c of chests){if(c.open)continue;const d=hyp(c.x-P.x,c.y-P.y);if(d<bd){bd=d;b={kind:'chest',o:c};}}
 for(const c of COL){const d=hyp(c.x-P.x,c.y-P.y);if(d<bd){bd=d;b={kind:'col',o:c};}} // itens de pedido no chão (28)
 for(const n of nascs){if(n.state!=='corr')continue;const d=hyp(n.x-P.x,n.y-P.y);if(d<bd){bd=d;b={kind:'nasc',o:n};}}
 if(hyp(NPC.x-P.x,NPC.y-P.y)<bd){bd=hyp(NPC.x-P.x,NPC.y-P.y);b={kind:'npc',o:NPC};}
 if(hyp(MENTOR.x-P.x,MENTOR.y-P.y)<bd){bd=hyp(MENTOR.x-P.x,MENTOR.y-P.y);b={kind:'mentor',o:MENTOR};}
 for(const q of TALK){const d=hyp(q.x-P.x,q.y-P.y);if(d<Math.max(bd,30)){bd=d;b={kind:'talk',o:q};}} // gente do salão da Guilda (20)
 if(hyp(BOARD.x-P.x,BOARD.y-P.y)<Math.max(bd,30))b={kind:'board',o:BOARD};
 if(hyp(SMITH.x-P.x,SMITH.y-P.y)<Math.max(bd,30))b={kind:'smith',o:SMITH};
 if(hyp(BAR.x-P.x,BAR.y-P.y)<Math.max(bd,30))b={kind:'bar',o:BAR};return b;}
function interact(it){if(!it)return;if(it.kind==='chest')openChest(it.o);else if(it.kind==='nasc')purify(it.o);else if(it.kind==='mentor')openMentor();else if(it.kind==='board')openBoard();else if(it.kind==='smith')openSmith();else if(it.kind==='bar')openTaverna();else if(it.kind==='col')pickCol(it.o);else if(it.kind==='talk'){if(it.o.p.id===MENT_CLS[P.cls])openMentor(it.o.p.id);else if(it.o.p.ped)openPedido(it.o.p);else talkTo(it.o);}else openShop();}
