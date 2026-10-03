// Ecos de Valdoria — Gente própria de cada cidade: mercador, ferreiro, taverneira e o salão da Guilda
'use strict';
// Decisão do dono (03/10/2026): os serviços ficam no mesmo lugar e com o mesmo símbolo em toda cidade, mas quem atende muda,
// com nome, roupa e falas que combinam com o lugar. Valdor fica com Bento, Gorvan, Brígida, Freya, Darian e Lexus.
// A Mestra Elara fica só em Valdor (15): as outras cidades não têm a casa da estrela.
// Cidade nova: uma entrada em CIDP, os sprites aqui e, no salão, 3 pessoas na ordem do SALAO (recepção, veterano, bardo).

// ================== SPRITES (16×16, como os de Valdor) ==================
// Pinheiral: couro, peles e lã em tons de floresta
def('hilda',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkXXXXXXkk...","..ksXXXXXXXXsk..","..ksXAAAAAAXsk..","...kXAAAAAAXk...","....kAAAAAAk.kk.","....kDDDDDDkkrrk","...kDDDDDDDDkWWk","...kDDDDDDDDkkk.","....kbbk.kbbk...","....kkk...kkk..."],{H:'#5a8a3a',s:'#f0c8a0',e:K,X:'#3e6e3a',A:'#8a5a30',D:'#7a4a2a',r:'#d0383a',W:'#b88a4a',b:'#3a2a1a'});
def('ulric',["......kkkk......",".....kRRRRk.....","....kRRRRRRk....","....kRseesRk....","....kssssssk....",".....kRRRRk.....","..kkkLLLLLLkk...",".ksskLLLLLLkssk.",".ksskLLggLLkssk.","..kkkLLLLLLkkwk.","....kTTTTTTkkwwk","....kPPPPPPk.y..","....kPPkkPPk.y..","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{R:'#c8603a',s:'#d8a070',e:K,L:'#7a5230',g:'#e8b43c',T:'#4a3020',w:'#c8c8d0',y:'#8a5a32',P:'#4a5a3a',b:'#3a2a1a'});
def('marta',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kCseesCk....","....kCssssCk....",".....kssssk.....","...kkDDwwDDkk...","..ksDDwwwwDDsk..","..ksDDwwwwDDsk..","...kkwwwwwwkk...","....kwwwwwwk....","....kSSSSSSk....","...kSSSSSSSSk...","...kSSSSSSSSk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#e8dcc0',C:'#7a4a2a',s:'#f0c8a0',e:K,D:'#6a8a4a',w:'#f0e8d0',S:'#8a6a3a',b:'#3a2a1a'});
def('liane',["......kkkk...k..",".....kHHHHk.kWk.","....kHHHHHHkkWk.","....kHseesHk.kWk","....kHssssHk.kWk","...kHkssssk.kWk.","...kkLLGGLLkkWk.","..ksLLGGGGLLsk..","..ksLLGGGGLLsk..","...kLLGGGGLLk...","....kTTTTTTk....","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#c8984a',W:'#8a5a30',s:'#f0c8a0',e:K,L:'#7a4a2a',G:'#5a8a4a',T:'#4a3020',P:'#5a4a3a',b:'#3a2a1a'});
def('velhoBastiao',[".....k....k.....","....kGk..kGk....","....kGGkkGGk....","...kGGGGGGGGk...","...kGkseeskGk...","...kGkwwwwkGk...","..kGGGkwwkGGGk..",".kGGLLLLLLLLGGk.",".kGsLLLLLLLLsGk.","..kGLLLLLLLLGk..","...kGLLLLLLGk...","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{G:'#8a8a94',s:'#c89060',e:K,w:'#e8e4dc',L:'#5a6a3a',P:'#4a3a2a',b:'#2a1c12'});
def('pipo',["..........f.....","......kkkkfk....",".....kCCCCCCk...","....kCCCCCCCCk..","....kseesssk....","....kssssssk....","...kkVVVVVVkk...","..ksVVVVVVVVsk..","..kswwwwwwwwwwk.","...kVVVVVVVVk...","....kTTTTTTk....","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{f:'#d0383a',C:'#6a8a3a',s:'#f0c8a0',e:K,V:'#c8904a',w:'#e0c090',T:'#5a3a20',P:'#3a5a3a',b:'#3a2a1a'});
// Arcádia: túnicas de estudioso em azul-noite e prata
def('teodoro',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHgegeHk....","....kHssssHk....",".....kssssk.....","...kkBBBBBBkk...","..ksBBBccBBBsk..","..ksBBBccBBBkMMk","...kBBBccBBBkvvk","....kBBBBBBkkkk.","....kBBBBBBk....","...kBBBBBBBBk...","...kBBBBBBBBk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#8a7a6a',g:'#c8d4ec',s:'#e8c0a0',e:K,B:'#2a3a6a',c:'#c8d4ec',M:'#7a5230',v:'#6ad8ff',b:'#2a2016'});
def('isolde',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","..kkBBAAAABBkk..",".kgBkAAAAAAkBgk.",".kgBkAArrAAkBgww","..kkkAAAAAAkkww.","....kAAAAAAk.y..","....kBBBBBBk.y..","....kBBkkBBk....","....kBBk.kBBk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#2a2030',s:'#e8c0a0',e:K,B:'#2a3a6a',A:'#5a4a3a',r:'#6ad8ff',g:'#c8d4ec',w:'#e8f0ff',y:'#5a4030',b:'#2a2016'});
def('celeste',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkDDDDDDkk...","..ksDDcDDDDDsk..","..ksDDDDDcDDsk..","...kDcDDDDDDk...","....kDDDDcDk....","....kDDDDDDk....","...kDDcDDDDDk...","...kDDDDDDcDk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#e8e0c8',s:'#f0c8a0',e:K,D:'#1c2850',c:'#e8f0ff',b:'#2a2016'});
def('aurelio',["......kkkk......",".....kBBBBk.....","....kBBBBBBk....","....kBseesBk....","....kBssssBk....",".....kssssk.....","...kkBBBBBBkk...","..ksBBBBBBBBsk..","..kswwwwwwBBsk..","...kwwwwwwBBkf..","....kBBBBBBk.f..","....kBBBBBBk....","...kBBBBBBBBk...","...kBBBBBBBBk...","....kbbk.kbbk...","....kkk...kkk..."],{B:'#3a5aa8',s:'#e8c0a0',e:K,w:'#f4ecd8',f:'#ffffff',b:'#2a2016'});
def('magnus',[".......k........","......kHk.......",".....kHHHk......","....kHHHHHk.....","...kcccccccck...","....ksseessk....","....kwwwwwwk.y..","...kkwwwwwwkky..","..ksBBwwwwBBsy..","..ksBBBwwBBBkyk.","...kBBBBBBBBky..","....kBBBBBBk.y..","...kBBBBBBBBky..","...kBBBBBBBBk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#2a3a6a',c:'#c8d4ec',s:'#e0b890',e:K,w:'#f0f0f0',B:'#2a4a7a',y:'#8a6a4a',b:'#2a2016'});
def('elio',["......kkkk......",".....kHHHHk.....","....kHHHHHHk....","....kHseesHk....","....kHssssHk....",".....kssssk.....","...kkTTTTTTkk...","..ksTTccTTTkhh..","..ksTTTTTTkh.hk.","...kTTTTTTkh.hk.","....kTTTTTkhhhk.","....kPPPPPPk....","....kPPkkPPk....","....kPPk.kPPk...","....kbbk.kbbk...","....kkk...kkk..."],{H:'#c8a060',s:'#f0c8a0',e:K,T:'#3a5aa8',c:'#c8d4ec',h:'#9fe8ff',P:'#2a2a4a',b:'#2a2016'});

// ================== QUEM ATENDE EM CADA CIDADE ==================
// merc/smith/bar: [nome, sprite, fala de boas-vindas]; salao: os 3 do salão da Guilda, nos lugares de Freya, Darian e Lexus
const CIDP={
 valdor:{merc:['Mercador Bento','npc','Poções frescas e ouro justo pelo seu saque, aventureiro!'],
  smith:['Ferreiro Gorvan','ferreiro','Traga ouro e o minério certo, e eu deixo seu equipamento mais forte. Até o +5 não tem perigo. Depois disso... às vezes o metal não aguenta.'],
  bar:['Brígida','brigida','Um gole antes da caçada, aventureiro? Meus tônicos nunca falham!'],salao:['freya','darian','lexus']},
 pinheiral:{merc:['Mercadora Hilda','hilda','Cogumelos frescos, poções da mata e um preço honesto pelas suas peles!'],
  smith:['Ferreiro Ulric','ulric','Aço bom é como pinheiro velho: aguenta tudo até o +5. Depois disso, nem a floresta garante que ele não racha.'],
  bar:['Marta','marta','Hidromel da casa e tônicos de raiz. Senta aí, que a noite na mata é fria.'],salao:['liane','velhoBastiao','pipo']},
 arcadia:{merc:['Mercador Teodoro','teodoro','Poções destiladas com precisão, e pago o justo pelo que você trouxer das runas!'],
  smith:['Ferreira Isolde','isolde','Cada runa no metal guarda um pouco de força. Até o +5, as runas seguram firme. Depois... às vezes elas estalam, e o metal vai junto.'],
  bar:['Celeste','celeste','Chá de estrelas ou um tônico? Os dois clareiam a mente antes de uma batalha.'],salao:['aurelio','magnus','elio']}};
// quem atende no mapa atual (num interior, vale a cidade dele); cidade sem entrada usa a gente de Valdor
const cidP=()=>{const M=MAPS[CUR]||{};return CIDP[M.town?CUR:M.city]||CIDP.valdor;};

// ================== O SALÃO DA GUILDA DE CADA CIDADE ==================
// mesmos lugares e cores de papel que Freya, Darian e Lexus (20); entram na GENTE para o setTalk achar
GENTE.push(
 {id:'liane',n:'Liane',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda de Pinheiral! O mural tem trabalho das Encostas e da Caverna.','Até 3 missões por vez, somando todas as Guildas. Traga as provas, que a gente paga.',
  'Cada missão volta ao mural um tempo depois de entregue. A mata nunca fica quieta por muito tempo.','Cansado? A Marta, no balcão, tem um tônico de raiz que levanta até urso.','A Caçadora Kaya mora fora da paliçada, no nordeste. Se você é arqueira, vá vê-la.']},
 {id:'velhoBastiao',n:'Bastião',c:'#e8c080',at:[-5,-2],f:['O Mestre das Máscaras se divide em cópias. Só o verdadeiro sangra; ataque esse.','O Grande Totem Ancião não anda, mas o que ele chama anda. Fique de olho em volta.',
  'A Raposa Anciã foge de quem luta de perto. Encurrale-a contra a mata.','Na Caverna, o escuro esconde morcego em bando. Ande perto da parede e ouça.','O Senhor dos Ossos se cura com os servos dele. Quebre os esqueletos primeiro.',
  'Esta capa é de um lobo que quase me pegou. Quase.']},
 {id:'pipo',n:'Pipo',c:'#d9a0ff',at:[-7,3],f:['Toco flauta para os pinheiros. Eles não aplaudem, mas também não vaiam.','Dizem que a Raposa de Nove Caudas canta nas noites de lua. Eu respondo com a flauta.',
  'A Marta paga a música com hidromel. É o melhor cachê da região!','Já viu a cachoeira das Encostas? Cai tão bonito que dá vontade de compor uma balada inteira.','Toda Guilda tem um bardo. O de Valdor toca alaúde e se acha o melhor. Eu discordo.']},
 {id:'aurelio',n:'Aurélio',c:'#8fd0ff',at:[2,-4],f:['Bem-vindo à Guilda de Arcádia. O mural fala dos problemas do Planalto das Runas.','Até 3 missões por vez, somando todas as Guildas. Eu anoto tudo; nada se perde.',
  'Cada missão volta ao mural um tempo depois de entregue. Está nos meus registros.','A Celeste, no balcão, serve chá e tônicos. Os dois ajudam a pensar.','Se você é mago, a Arquimaga Selene espera na Torre, no centro da cidade.']},
 {id:'magnus',n:'Magnus',c:'#e8c080',at:[-5,-2],f:['Lutei com fogo e gelo por quarenta anos. Hoje uso o cajado só para andar.','O Wyrm Carmesim cospe fogo onde você está parado. Mago parado é mago assado.',
  'Viu círculo vermelho no chão? Saia dele. Nenhum escudo de mana segura aquilo.','Dizem que algo antigo dorme embaixo da Torre. A Selene não gosta que falem disso.','Mana acabando? Recue, respire, volte. Paciência também é magia.']},
 {id:'elio',n:'Elio',c:'#d9a0ff',at:[-7,3],f:['Esta harpa é de cristal do Planalto. Cada corda canta numa runa diferente.','Toco para os estudiosos estudarem. Eles dizem que ajuda. Eu digo que é verdade.',
  'A Celeste me paga em chá. Já bebi tanto que enxergo as estrelas de dia.','Conhece a canção de Astrael? Fala de estrelas que viraram gente.','Toda Guilda tem um bardo. O de Pinheiral toca flauta para árvores, coitado.']});
// troca, nos interiores de cada cidade, o ferreiro, a taverneira e a gente do salão pelos daquela cidade.
// Cidade criada depois deste arquivo (ex.: Sahrem, 25) chama de novo depois de criar os interiores dela (não estraga quem já foi trocado)
function gentePorCidade(){const base=CIDP.valdor.salao;for(const id in MAPS){const M=MAPS[id],C=CIDP[M.city];if(!M.interior||!C||C===CIDP.valdor)continue;
 const tr=s=>s==='ferreiro'?C.smith[1]:s==='brigida'?C.bar[1]:base.includes(s)?C.salao[base.indexOf(s)]:s;
 if(M.deco)for(const d of M.deco)d[2]=tr(d[2]);if(M.talk)M.talk=M.talk.map(([x,y,s])=>[x,y,tr(s)]);}}
gentePorCidade();
