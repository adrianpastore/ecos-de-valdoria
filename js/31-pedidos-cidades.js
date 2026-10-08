// Ecos de Valdoria — Pedidos dos moradores de Valdor, Pinheiral e Arcádia (08/10/2026)
'use strict';
// O mesmo sistema dos pedidos de Sahrem (28): três moradores em cada cidade, com pedidos da região dela, do mais fácil ao mais difícil.

// ================== ITENS DE PEDIDO ==================
Object.assign(COLD,{cogD:{maps:{floresta:8},v:'Colher'},lirio:{maps:{pantano:5},v:'Colher'},insignia:{maps:{ruinas:1},v:'Pegar'},
 ervaLua:{maps:{encosta4:7},v:'Colher'},picareta:{maps:{caverna1:1},v:'Pegar'},fragRuna:{maps:{planalto:6},v:'Pegar'},estilhaco:{maps:{covil:4},v:'Pegar'}});
for(const[k,n,c,d]of[['cogD','Cogumelo Dourado','#e8b830','Cogumelo que nasce na Floresta Verdejante. A padeira Rosa põe no pão de domingo.'],
 ['lirio','Lírio do Pântano','#e8e0ff','Flor branca que só abre na lama do Pântano Sombrio. O boticário Otto faz remédio com ela.'],
 ['insignia','Insígnia da Guarda','#c8a040','A insígnia do velho capitão da guarda de Valdor, perdida nas Ruínas.'],
 ['ervaLua','Erva-da-Lua','#a8d8ff','Folha que brilha de leve no escuro, na Encosta de Pinheiral 04. A curandeira Ilka usa nos curativos.'],
 ['picareta','Picareta Velha','#9aa4b0','A picareta do avô do Joca, esquecida no 1º andar da Caverna de Pinheiral.'],
 ['fragRuna','Fragmento de Runa','#8a9ab0','Lasca de pedra rúnica do Planalto das Runas. Ainda tem um pouco de luz.'],
 ['estilhaco','Estilhaço de Estrela','#c8d4ec','Pedaço da estrela que caiu perto do Covil do Wyrm. É frio e brilha sozinho.']])LOOTM[k]={n,c,w:1,v:0,q:1,d};
Object.assign(MATSHP,{
 cogD:[["...cCCCc....","..cCCeCCCd..",".cCeCCCCeCd.","cCCCCCCCCCCd","dddCCCCCdddd","....wwww....","....wwww....","....wwwd....","...wwwwwd..."],{e:'#fff0a0'}],
 lirio:[[".....c.....","....cCc....","..c.cCc.c..","..cCcCcCc..","...cCeCc...","....CCC....",".....g.....","....gg.....","...g.g.g...","..gggggg..."],{e:'#ffe060',g:'#3a8a5a'}],
 insignia:[["..cCCCCCCd..",".cCeeeeeeCd.",".CeeffeeeCd.",".CeefffeeCd.",".CeeeffeeCd.","..CeeeeeCd..","...CeeeCd...","....CCCd....",".....dd....."],{e:'#a83030',f:'#f0d878'}],
 ervaLua:[["....c..c....","...cCccCc...","..cCCgCCc...",".cCCgCCCCd..","..dCgCCCd...","....g.......","...gg.g.....","..g.gg......","....g......."],{g:'#3a7a5a'}],
 picareta:[[".cCCCCCCCd..","cCddddddCCd.","Cd...yy..dC.",".....yy.....",".....yy.....",".....yy.....",".....yy.....",".....yy.....","....eyy....."],{y:'#8a5a2a',e:'#5a3a1a'}],
 fragRuna:[["...cCCCd....","..cCCCCCd...",".cCCeCCCCd..",".CCeeeCCCd..",".CCCeCeCCd..","..CCCCeCCd..","..dCCCCCd...","...ddddd...."],{e:'#6ad8ff'}],
 estilhaco:[[".....c......","....cCd.....","...cCeCd....","..cCeeeCd...",".cCCeeeCCd..","..dCCeCCd...","...dCCCd....","....dCd.....",".....d......"],{e:'#ffffff'}]});
for(const k of['cogD','lirio','insignia','ervaLua','picareta','fragRuna','estilhaco'])defMat(k);

// ================== OS MORADORES ==================
const B_='#5a3a20';
def('rosa',["......kkkk......",".....kWWWWk.....","....kWWWWWWk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkRRRRRRkk...","..ksRRWWWWRRsk..",
 "...kRWWWWWWRk...","....kWWWWWWk....","....kWWddWWk....","....kRWWWWRk....","...kRRRRRRRRk...","...kRRRRRRRRk...","....kbbk.kbbk...","....kkk...kkk..."],
 {W:'#f0ece0',H:'#8a4a2a',s:'#e0a878',e:K,R:'#c84a4a',d:'#d8c8a8',b:B_});
def('otto',["......kkkk......",".....kGGGGk.....","....kGGGGGGk....","....kGgeegGk....","....kGsWWsGk....",".....kWWWWk.....","...kkGGGGGGkk...","..ksGGLLLLGGsk..",
 "..kVkGLLLLGksk..","...kGGLLLLGGk...","....kGGLLGGk....","....kGGGGGGk....","...kGGGGGGGGk...","...kGGGGGGGGk...","....kbbk.kbbk...","....kkk...kkk..."],
 {G:'#3a6a4a',g:'#c8d8e8',s:'#e0a878',e:K,W:'#e8e8e0',L:'#9ac87a',V:'#c84ac8',b:B_});
def('aldo',["......kkkk......",".....kMMMMk.....","....kMMMMMMk....","....kMseesMk....","....kMssssMk....",".....kBBBBk.....","...kkMMMMMMkk...","..kMMRRRRRRMMk..",
 "..ksMRRyyRRMsk..","...kMRRRRRRMk...","....kRRRRRRk....","....kMMMMMMk....","...kMMRRRRMMk...","...kMMRRRRMMk...","....kbbk.kbbk...","....kkk...kkk..."],
 {M:'#9aa4b0',s:'#d89868',e:K,B:'#5a3a2a',R:'#a83030',y:'#e8c048',b:B_});
def('osvaldo',["......kkkk....k.",".....kHHHHk..kA.","....kHHHHHHk.kAk","....kHseesHk.ky.","....kBBssBBk.ky.",".....kBBBBk..ky.","...kkCCCCCCkkky.","..ksCcCcCcCCsk..",
 "..ksCCCCCCCCsk..","...kCcCcCcCCk...","....kCCCCCCk....","....knnnnnnk....","...kPPPPPPPPk...","...kPPPPPPPPk...","....kbbk.kbbk...","....kkk...kkk..."],
 {H:'#6a3a1a',s:'#d89868',e:K,B:'#7a4a2a',C:'#c83a2a',c:'#7a1a1a',n:'#3a2a1a',P:'#3a4a6a',A:'#b8c0c8',y:'#8a6a3a',b:B_});
def('ilka',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....","....kHkssk......","...kkWWWWWWkk...","..ksWWWWWWWWsk..",
 "...kWWggggWWk...","....kWWWWWWk....","....kWWWWWWk....","....kWWggWWk....","...kWWWWWWWWk...","...kWWWWWWWWk...","....kbbk.kbbk...","....kkk...kkk..."],
 {H:'#a8582a',s:'#e8b088',e:K,W:'#eae4d4',g:'#4a9a4a',b:B_});
def('joca',["......kkkk......",".....kYYYYk.....","....kYYLYYYk....","....kYYYYYYk....","....kBseesBk....",".....kssssk.....","...kkTTTTTTkk...","..ksOTTTTTTOsk..",
 "..ksOOOOOOOOsk..","...kOOOOOOOOk...","....kOOddOOk....","....kOOOOOOk....","...kOOOOOOOOk...","...kOOOOOOOOk...","....kbbk.kbbk...","....kkk...kkk..."],
 {Y:'#e8c030',L:'#fff8c0',B:'#4a3a2a',s:'#c88858',e:K,T:'#8a6a4a',O:'#4a5a7a',d:'#3a4058',b:B_});
def('tobias',["...........k....","..........kUk...","........kkUUk...",".......kUUUUk...","....kkkUUUUUkk..","...kkUUUUUUUUkk.","....kHseesHk....","....kHssssHk....",
 ".....kssssk.....","...kkUUUUUUkk...","..ksUUSSSSUUsk..","..kRRkUUUUkUsk..","..kRRkUUUUUUk...","...kkUUUUUUUUk..","....kbbk.kbbk...","....kkk...kkk..."],
 {U:'#3a5aa8',S:'#c8d4ec',R:'#a83a3a',H:'#d8a040',s:'#e8b088',e:K,b:B_});
def('odete',["......kkkk......",".....kGGGGk.....","....kGGGGGGk....","....kGgeegGk....","....kGssssGk....",".....kssssk.....","...kkDDDDDDkk...","..ksDDWWWWDDsk..",
 "..ksDDDWWDDDsk..","...kDDDDDDDDk...","....kDDDDDDk....","....kDDDDDDk....","...kDDDDDDDDk...","...kDDDDDDDDk...","....kbbk.kbbk...","....kkk...kkk..."],
 {G:'#b8b8b8',g:'#e8f0ff',s:'#e0a878',e:K,D:'#2a5a5a',W:'#f0ece0',b:B_});
def('benedito',["......kkkk......",".....kNNNNk.....","....kNNyNNNk....","....kNNNNNNk....","....kWseesWk....","....kWWssWWk....","...kkWWWWWWkk..t","..ksNWWWWWWNskt.",
 "..ksNNWWWWNNtk..","...kNNyNNNNtk...","....kNNNNNtk....","....kNyNNNNk....","...kNNNNNyNNk...","...kNNNNNNNNk...","....kbbk.kbbk...","....kkk...kkk..."],
 {N:'#2a3a6a',y:'#e8e0a0',W:'#f0f0f0',s:'#e0a878',e:K,t:'#c8a048',b:B_});

addPeds([
 // ---------- Valdor ----------
 {id:'rosa',city:'valdor',map:'valdor',at:[31,23],n:'Padeira Rosa',c:'#ffb0a0',lv:3,t:'Pão de domingo',itens:[['cogD',6]],rew:{g:120,pots:{hp:4}},
  pede:'Domingo é dia de pão de cogumelo, e a vila inteira espera por ele! Os Cogumelos Dourados nascem na Floresta Verdejante, aqui do lado. Me traz 6? Brilham no meio do mato.',
  ok:'Que cogumelos lindos! Tome, umas poções para a estrada. E domingo o primeiro pão é seu!',
  f:['O forno acende antes do sol. Pão bom pede paciência.','Mirena abençoa a colheita, e eu abençoo a massa.','O Bento jura que meu pão é melhor que o de Pinheiral. Não conte a ninguém.','Cuidado com as Geleias da floresta. Grudam no cesto.']},
 {id:'otto',city:'valdor',map:'valdor',at:[50,26],n:'Boticário Otto',c:'#9ad87a',lv:11,t:'Remédio para a febre',itens:[['lirio',3],['aranha',6]],rew:{g:380,item:['botas',2]},
  pede:'Meia vila está com a febre do pântano. Preciso de 3 Lírios do Pântano, que só abrem na lama do Pântano Sombrio, e de 6 Sedas de Aranha para filtrar o xarope. Pode me ajudar?',
  ok:'Com isso o xarope fica pronto ainda hoje! Fique com estas botas: aguentam lama até o joelho. Eu sei, testei.',
  f:['Febre do pântano passa com xarope, repouso e nada de pântano.','A seda de aranha filtra melhor que qualquer pano. Nojento, mas funciona.','Já pensou em levar umas poções extras? Prevenir é mais barato.','Os esporos do pântano fazem mal ao pulmão. Respire pelo nariz.']},
 {id:'aldo',city:'valdor',map:'valdor',at:[36,37],n:'Sargento Aldo',c:'#ffc080',lv:18,t:'A insígnia do capitão',itens:[['insignia',1],['orc',6]],rew:{g:650,item:['elmo',2]},
  pede:'O velho capitão da guarda caiu lutando contra os orcs nas Ruínas Esquecidas. A insígnia dele nunca voltou. Traz ela para mim, e 6 Dentes de Orc, para eles saberem que Valdor não esquece.',
  ok:'A insígnia do capitão... Vai ficar no portão, onde ele sempre ficava. Use este elmo. É da guarda, e agora você também é um pouco.',
  f:['A guarda de Valdor nunca dorme. Pelo menos um de nós, nunca.','Aurel dá coragem. Treino dá o resto.','Se vir orcs perto da estrada, me avise antes de virar herói sozinho.','O capitão dizia: "o muro protege a vila, a gente protege o muro".']},
 // ---------- Pinheiral ----------
 {id:'osvaldo',city:'pinheiral',map:'pinheiral',at:[33,23],n:'Lenhador Osvaldo',c:'#ffb060',lv:10,t:'Madeira que não racha',itens:[['salgueiro',8]],rew:{g:320,item:['arma',2]},
  pede:'Lenha comum racha no inverno. Galho de Salgueiro Vivo, não: é a melhor madeira para as casas da aldeia. Só que o salgueiro bate de volta... Traz 8 Galhos Vivos da Encosta 03?',
  ok:'Isso é madeira de primeira! Guardei esta arma para quem me ajudasse. Agora é sua.',
  f:['Corte sempre a favor do vento. E longe de salgueiro acordado.','Toda cabana desta aldeia tem um pouco do meu suor.','Ilvara cuida da floresta. Eu só pego o que ela deixa.','Quer aprender a rachar lenha? Primeiro, aprenda a não rachar o pé.']},
 {id:'ilka',city:'pinheiral',map:'pinheiral',at:[47,23],n:'Curandeira Ilka',c:'#b8f0b0',lv:14,t:'Ervas que brilham',itens:[['ervaLua',5]],rew:{g:420,pots:{hp:6,mp:4}},
  pede:'A Erva-da-Lua fecha qualquer corte, mas só cresce na Encosta 04, onde os Pés-Grandes andam. Ela brilha de leve no chão. Me traz 5? Pago com poções feitas com ela.',
  ok:'Estão perfeitas! Tome, poções de vida e de mana, fresquinhas. Volte sempre que se machucar. Quer dizer, espero que não volte muito.',
  f:['Ferida limpa sara rápido. Ferida suja, me procura.','A Erva-da-Lua brilha porque guarda um pouco do luar, dizia minha avó.','Mirena e Ilvara se dão bem. Uma cura, a outra dá as ervas.','Os Pés-Grandes são mansos se você não pisar no pé deles. Que é enorme.']},
 {id:'joca',city:'pinheiral',map:'pinheiral',at:[31,36],n:'Mineiro Joca',c:'#ffe080',lv:22,t:'A picareta do avô',itens:[['picareta',1],['morcego',6]],rew:{g:720,item:['peito',2]},
  pede:'Meu avô deixou a picareta dele no 1º andar da caverna quando os morcegos atacaram. Quero ela de volta. E traz 6 Asas de Morcego, que é para aprenderem a não mexer com mineiro!',
  ok:'A picareta do vovô! Ainda tem as iniciais dele no cabo. Leve esta armadura, é de mineiro: aguenta pedra caindo na cabeça.',
  f:['Na caverna, a tocha é sua melhor amiga. A segunda é a saída.','O Minério Bruto do fundo da caverna é o melhor do reino. Pergunte ao Ulric.','Brannar abençoa quem trabalha com as mãos. E com picareta.','Os zumbis lá embaixo eram mineiros também. Não gosto de pensar nisso.']},
 // ---------- Arcádia ----------
 {id:'tobias',city:'arcadia',map:'arcadia',at:[30,24],n:'Aprendiz Tobias',c:'#a8c8ff',lv:6,t:'Runas caídas',itens:[['fragRuna',5]],rew:{g:200,pots:{mp:5}},
  pede:'Minha prova na Torre é ler uma runa inteira, mas as pedras do Planalto das Runas vivem soltando lascas. Junta 5 Fragmentos de Runa para mim? Eles ainda brilham um pouquinho.',
  ok:'Consegui montar a runa! Diz "caminho"... ou "cavalo", ainda não sei. Fique com estas poções de mana, você merece.',
  f:['A Arquimaga Selene lê uma runa em um segundo. Eu levo uma semana.','Astrael escreveu as primeiras runas nas estrelas. Por isso brilham.','Não toque nos cristais das praças. Eu toquei. Fiquei azul por dois dias.','Um dia vou ter um chapéu de mago de verdade, sem remendo.']},
 {id:'odete',city:'arcadia',map:'arcadia',at:[50,24],n:'Bibliotecária Odete',c:'#a0e0d8',lv:8,t:'Livros sem capa',itens:[['verme',6]],rew:{g:260,item:['elmo',1]},
  pede:'Shhh. Metade dos livros da biblioteca perdeu a capa. Casca de Verme, bem seca, vira o melhor couro de encadernação. Os vermes vivem no Planalto. Traz 6? Em silêncio, por favor.',
  ok:'Perfeito. Os livros agradecem, e eu também. Tome isto, era de um estudioso que nunca voltou para buscar. Shhh.',
  f:['Shhh.','Um livro bem cuidado vive mais que quem o escreveu.','O escriba Omar, de Sahrem, me manda cópias das tabuletas da pirâmide. Fascinante.','Livro devolvido com orelha dobrada paga multa. Até herói.']},
 {id:'benedito',city:'arcadia',map:'arcadia',at:[40,35],n:'Astrônomo Benedito',c:'#d8e0ff',lv:22,t:'A estrela que caiu',itens:[['estilhaco',3]],rew:{g:850,item:['arma',2]},
  pede:'Há três noites, vi uma estrela cair perto do Covil do Wyrm! Os pedaços devem estar espalhados lá, frios e brilhando. Traz 3 Estilhaços de Estrela? Só não acorde o dragão... muito.',
  ok:'Que maravilha! Isto é um pedaço do céu de Astrael. Fique com esta arma, temperada com um estilhaço. Ela vai brilhar nas noites sem lua.',
  f:['As estrelas não mudam. Mas, ultimamente, uma delas está... mais fraca.','Astrael desenhou cada constelação. A minha favorita é a do Viajante.','Já tentou olhar o céu de cima da Torre? Dá para ver Sahrem.','O Wyrm dorme de dia. Ou finge.']}]);
