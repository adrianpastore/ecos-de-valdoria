// Ecos de Valdoria — Monstros redesenhados (pedido do dono em 06/10/2026), por regiões
'use strict';
// Cada monstro com o tamanho dele (a Geleia pequena, o Lobo maior que o herói) e com luz do alto à esquerda.
// O desenho vai sem o contorno de fora, que olM (12) põe sozinho; 'k' dentro vale como risco escuro (olhos, boca).
// Substitui o sprite antigo com o mesmo nome (def troca o SPR). Desenhado olhando para a direita, como os antigos.
const defMon=(n,rows,pal)=>def(n,olM(rows),pal);
// ---------- Etapa 1: os primeiros campos (Estrada do Sul e Encostas 01 e 02) ----------
defMon('slime',[".....GGGG.....","...GGlwGGGG...","..GllwGGGGGG..",".GGlGGGGGGGGG.",".GGGGGGGGGGGg.","GGGGkGGGkGGGGg","GGGGkGGGkGGGgg","GGGGGGkkGGGGgg","GGlGGGGGGGGggg",".gGGGGGGGGgggg","..gggggggggg.."],{G:'#5fcf5a',g:'#2f8a3a',l:'#c8ffc0',w:'#ffffff'});
defMon('esporinho',[".....cccc.....","...ccCCwCCC...","..cCwwCCCCCd..",".cCCwCCCCwwCd.",".CCCCCCCCwwCCd","cCwCCCCCCCCCCd","dCCCCCCwCCCCdd",".dddddddddddd.","....bbbbbB....","....bkbbkB....","....bbbbbB....","....bbkkbB....",".....bbbB.....","....BB..BB...."],{C:'#d8743a',c:'#ffb080',d:'#9a4a1a',w:'#fff4e0',b:'#efe0c0',B:'#c8b898'});
defMon('esporov',["......pppp......","....ppPPPPpp....","...pPPvPPPPPp...","..pPPvvPPPvPPp..",".pPPPPPPPvvPPPd.","pPPvPPPPPPPPPPPd","dPPPPPPvPPPPPPdd","d.dPdddPdddPd.d.","..v.....d....v..","....bbbbbB......","....bkbkbB......","....bbbbbB......","....bbkbbB......","....BB..BB......"],{P:'#8a3aa0',p:'#c070d0',d:'#4a1a5a',v:'#c8ff60',b:'#d8d0e0',B:'#a898b8'});
defMon('esquilo',["..TTT...........",".TtttT..........","TtttttT.........","TttTttT.........","TtT.TtT....O.O..",".T..TtT...OOOO..","....TtT..OoOeO..","....TttTOoOOOOw.",".....TtTOOwwOO..",".....TtOOwwwO...","......TOOwwnn...","......OOOwnNn...",".......OO.OO....","......OO..OO...."],{T:'#8a4a1a',t:'#d8783a',O:'#c8642a',o:'#e88a4a',w:'#f4d8b0',e:K,n:'#a8743a',N:'#5a3a1a'});
defMon('lobo',["...............d.d..","..............dGdGd.","dd............gGGGG.",".dgd.....gggggGGeGGk","..dggggggGGGGGGGGGG.","...gGGGGGGGGGGggwwg.","...gggggggggggggg...","...dgggggggggggdg...","...dgg.dgg..dgg.dg..","...dg..dg...dg..dg..","...dd..dd...dd..dd.."],{g:'#8d8f9c',G:'#c6c8d2',d:'#555766',e:'#ffdd33',w:'#ffffff'});
defMon('verme',["............lPP...","...........lPPPP..","...........PPkPPp.","...........PPPPPp.","..........pPlPpp..",".ss.....pPPlPp....","ssPpPp.pPlPPp.....",".pPlPPpPlPPp......","..pPPlPPPPp.......","...ppppppp........"],{P:'#d87a9a',p:'#9a4a6a',l:'#f0a8c0',s:'#e8e2cc'});
