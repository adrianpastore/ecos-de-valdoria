# CLAUDE.md — Ecos de Valdoria

Guia de contexto para continuar o desenvolvimento no Claude Code. Leia inteiro antes de mudar qualquer coisa.

## O projeto

RPG leve de navegador em pixel art, feito para diversão do dono do projeto e, talvez, de alguns amigos. Inspirações: Ragnarok Online (mapas ligados por portais, campos numerados, MVPs, dungeons com andares), Aika, Perfect World e WoW (raridades, loot com brilho no chão).

- Sem build, sem dependências: HTML + CSS + JavaScript puro, com Canvas 2D.
- Publicado via **GitHub Pages** (branch `main`, pasta raiz). O `.nojekyll` fica na raiz.
- Rodar localmente: abrir `index.html` no navegador.

## Preferências do dono (importante)

- **Toda a interface e os textos do jogo em português do Brasil.** Converse com ele em português também.
- Ele gosta de avançar **por etapas**, uma coisa de cada vez, com explicação em linguagem simples do que foi feito e do que vem a seguir.
- **Testar antes de entregar.** Sempre rode o teste de fumaça (veja "Testes") antes de dizer que terminou.
- **Inspirado, não copiado:** mapas e monstros podem lembrar o Ragnarok (clima, papel, faixa de nível), mas nomes e visuais são sempre originais. Nada de "Poring", "Prontera" etc. Folclore público (raposa de nove caudas, duende, totem) pode ser usado livremente.
- Por enquanto, **toda cidade tem um Mercador Bento e uma Mestra Elara** (mentora de todas as classes). No futuro, cada cidade pode ter um mestre de classe próprio.
- **Saves antigos precisam continuar funcionando.** Ao mudar o formato do save, escreva uma migração.
- **Portais onde fizer sentido, não em posição padrão.** O dono achava os portais no meio de cada borda "padrões" demais. Um portal deve ficar onde for natural para aquele mapa: a boca de uma caverna no paredão, a ponta de uma estrada, uma escada, uma trilha entre pinheiros, o alto de um platô. Os dois lados de um portal devem combinar (saída no alto da borda leste → chegada no alto da borda oeste do vizinho).
- **Nem todo mapa tem estrada.** Hoje `genWorld` sempre cava um caminho do centro até cada portal, e isso deixa os mapas iguais. Estrada só onde alguém construiria uma (vilas, aldeias, a própria Estrada do Sul). Floresta pode ser toda grama e árvores; as Ruínas podem ser só terreno castigado; o jogador explora até achar a saída.

## A alma do jogo (o que não pode se perder)

- **Clássico de MMO, em miniatura.** Mapas com nome e faixa de nível, campos numerados, MVP com banner, loot brilhando no chão, raridades por cor. Quem jogou Ragnarok deve se sentir em casa sem ver nada copiado.
- **Pixel art de 16 px com contorno escuro** (`k` = `#1b1320`) em todos os sprites. Nada de imagens externas: tudo é desenhado no código.
- **Interface de pergaminho e couro** (tema claro e escuro), com as fontes Cinzel (títulos), Alegreya Sans (texto) e Pixelify Sans (números e detalhes de jogo).
- **Textos curtos e calorosos**, com personagens que falam com o jogador ("Poções frescas e ouro justo pelo seu saque, aventureiro!"). Português do Brasil natural, sem jargão técnico na tela.
- **Risco com aviso e recompensa com surpresa.** Golpes fortes são avisados por círculos vermelhos no chão; baús podem morder; quanto mais longe da vila, mais perigo e melhor o saque.
- **Leve e sem instalação.** Abre com dois cliques no `index.html`. Não introduzir framework, bundler, TypeScript nem dependências.
- **Estilo de código compacto e denso**, como já está nos arquivos: funções curtas em poucas linhas, nomes curtos para o que é muito usado (`P`, `R`, `rf`, `SK`). Siga o estilo do arquivo que estiver editando; não "modernize" nem reformate código existente.

## Estrutura

Os scripts são carregados **em ordem** por `<script src>` no `index.html` e compartilham o mesmo escopo global (`const`, `let` e `function` no topo de um arquivo ficam visíveis para os seguintes).

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Marcação da interface (HUD, bolsa, loja, árvore, mentora, carregamento, tela inicial) |
| `css/estilo.css` | Estilos com tokens de cor (tema claro = pergaminho, escuro = couro) |
| `js/01-nucleo-sprites-e-mundo.js` | Utilidades (`$`, `R`, `ri`, `rf`, `pick`, `clamp`, `hyp`), sprites, `MAPS`, gerador de mapas `genWorld(id)`, platôs, `REACH` |
| `js/02-jogador-monstros-e-combate.js` | `CL` (classes), itens (`genItem`, raridades `RAR`), `MDEF` (monstros), `makeMon`, loop `update(dt)`, baús, loot, morte, save |
| `js/03-habilidades-e-especializacoes.js` | `TREES`, `SPECS`, `SK` (nós de habilidade do Mago), `useSkill`, `recalc`, dano, aliados, provas, Nascentes do Druida |
| `js/04-arvore-e-mentora.js` | UI da árvore (tecla T) e da Mestra Elara, sprites de urso/mentora/nascente |
| `js/05-boneco-em-camadas.js` | Equipamento visível: `composeGrid`, `DRAW` por slot/estilo, `heroSpr()` |
| `js/06-guerreiro.js` | `CLASS_TREE`, árvore do Guerreiro, `eff`, `initSkills` (com migração), escudo, sangramento, salto, bloqueio, estandarte |
| `js/07-arqueira.js` | Árvore da Arqueira: mascote lobo, armadilhas, rajada, furtividade, veneno, execução |
| `js/08-mapas-e-portais.js` | `changeMap`, `switchMapNow`, `MSTATE` (memória por mapa), portais, tela de carregamento |
| `js/09-regiao-pinheiral.js` | Pinheiros, casas, lampiões, 12 monstros da região e seus comportamentos (`monSpecial`, `onMonHit`, `tickPay`, `mproj`) |
| `js/10-chefes-mvp.js` | Chefes MVP: `bossSpot`, `spawnBoss`, `bossDead`, `bossAI`, `BOSSAT` |
| `js/11-caverna.js` | Caverna de Pinheiral: tema 7 (paletas, `CLFT[7]`, estalagmite), os 3 andares em `MAPS`, gerador de salões e corredores (`caveMask`), escuridão (`drawDark`) |
| `js/99-interface-e-inicio.js` | Render do canvas, minimapa, HUD, hotbar, bolsa, controles, tela inicial, loop `frame` — **sempre o último** |

### Armadilhas da estrutura
- **Declarações de função só "sobem" (hoisting) dentro do próprio arquivo.** O código que roda no topo de um arquivo não pode chamar funções de arquivos posteriores. Chamadas dentro de funções executadas depois (no loop do jogo) podem.
- **Não repita nomes de `const`/`let` entre arquivos**, porque isso quebra o carregamento com `SyntaxError`. Também evite nomes reservados do navegador (`top`, `name`, `location`, `status`…).
- Novos sistemas: crie `js/NN-assunto.js` (NN entre 11 e 98) e adicione a tag antes do `99-...`.

## Sistemas e formatos de dados

### Mundo e mapas (`01`, `08`)
- Tile de 16 px. **Todo mapa tem 80×60 tiles** (`W`, `H` fixos). `TC` = centro (40,30).
- `MAPS[id]` campos: `n` (nome), `s` (subtítulo), `theme` (paleta: 0 Valdor, 1 floresta, 2 pântano, 3 ruínas, 4 covil, 5 serra, 6 aldeia de Pinheiral, 7 caverna; o 9 é reservado para invocações), `seed`, `color` (fundo da tela de carregamento), `lv:[min,max]`, `portals`, `road`, `home`, `count` (monstros), `chests`, `tier` (nível do baú 1–4), `mons:[[tipo, probAcumulada],…]`, `elite`, `town`, `houses`, `lanterns`, `plateau` (limiar de ruído para platôs, ex.: .62), `boss`, `bossLv`, `lair`.
- **Portais:** `portals:{idDoDestino: [tx, ty, noPlatô?]}`, um por destino, em qualquer tile (borda ou dentro do mapa). O destino precisa ter um portal de volta com o id deste mapa. Com o 3º valor `1`, o gerador ergue um platô em volta do portal (o jogador precisa achar a rampa, "subir a serra"). `portalPt(idDoDestino)` dá a posição em pixels no mapa atual. Ao chegar, o jogador aparece uns 3 tiles do portal de volta, na direção do centro (`freeNear`, que também prefere ficar no mesmo nível do platô).
- **Estradas:** `road:1` cava um caminho do centro até cada portal (vilas, Estrada do Sul, Encosta 01). Sem `road`, o mapa não tem caminho, mas se o mapa **vizinho** tiver estrada, ela entra alguns passos pelo portal e some no mato (`stub` em `genWorld`), para a passagem não parecer um corte seco.
- `home`: id do portal de onde o nível dos monstros cresce (`lvlAt`) e de onde parte o cálculo de alcance (`REACH`).
- **Tudo precisa ser alcançável a pé.** Sem estrada, um portal pode nascer cercado. `linkReach` confere cada portal e o miolo do mapa e, se preciso, abre a brecha mais barata (tira árvores/pedras; em último caso vira rampa no paredão ou aterra água). O teste de fumaça verifica isso para todos os portais.
- **Cavernas** (`cave:1`): o mesmo 80×60, mas `caveMask` (em `11`) cava salões ligados por corredores sinuosos de 3 tiles na rocha; todo o resto vira paredão (`G.CLIFF`), e a rocha longe do chão é pintada quase preta (`deepRock`). Estalagmites só no miolo dos salões (`caveRoom`), para nunca fechar corredor. Um tema novo precisa de cores em `GP`, `PC`, `WC` **e** nas versões RGB `GPr`, `PCr`, `WCr` (como faz o `11`), mais `MINIC.obj[tema]`; paredão com cor própria vai em `CLFT[tema]`.
- **Escuridão** (`dark:1`): `drawDark` (em `11`, chamado pelo `render` do `99`) cobre a tela e abre luz na tocha do herói, nos portais, nas magias em voo e nas explosões. Nomes e barras de vida são desenhados por cima.
- Posições salvas que caírem num lugar bloqueado ou isolado (porque o terreno mudou) vão para o tile livre mais próximo (`freeNear`, em `enter`).
- O terreno é regenerado de forma determinística (pela `seed`) a cada entrada. Monstros, baús e loot do mapa ficam em `MSTATE` enquanto você está fora.
- Tipos de chão `G`: GRASS, PATH, WATER, PLAZA, HIGH (platô), CLIFF (paredão, sólido), RAMP.
- `fixReach` abre rampas até que todo platô seja alcançável. `computeReach` gera `REACH`, e `randTile` só sorteia tiles alcançáveis.
- Cidades (`town:1`) são zonas seguras: sem monstros, com regeneração rápida, Bento, Elara e fonte.

Mapa atual (norte para cima, conforme os `exits` no código):
```
                                [Covil do Wyrm]
                                       │
[Floresta] ─ [Valdor] ─ [Pântano] ─ [Ruínas]
                │
        [Estrada do Sul]
                │
[Caverna] ─ [Aldeia de Pinheiral] ─ [Encostas 01 a 07]
```
Caverna de Pinheiral: boca no oeste da aldeia → 1º andar → 2º andar → fundo (escadas no mesmo ponto em andares vizinhos).
Encostas de Pinheiral (desenhadas à parte, também com o norte para cima):
```
                                   [06] ─ [07]
                                     │
                     [03] ─ [04] ─ [05]
                      │
[Pinheiral] ─ [01] ─ [02]
```
Chefes: Covil (Wyrm Carmesim), Encosta 03 (Mestre das Máscaras), 05 (Grande Totem Ancião) e 07 (Raposa Anciã de Nove Caudas). O lado oeste de Pinheiral leva à Caverna.

### Sprites (`01` e outros)
- `def(nome, linhas, paleta)`: linhas de texto de até 16 caracteres, uma por pixel. `.` = transparente, `k` = contorno `#1b1320`, demais letras vêm da paleta. **Confira a largura das linhas** (devem ter no máximo 16).
- `SPR[nome]` guarda `{n, f (espelhado), w (branco para flash de dano), wf}`. `drawS(nome, x, y, face, escala…)` desenha ancorado pelos pés.
- Árvores são geradas proceduralmente: `genTree` (redondas) e `genPine` (pinheiros, temas 5 e 6).

### Monstros (`02`, `09`, `10`)
- `MDEF[tipo]`: `n, hp, atk, def, spd, xp, r, aggro, cd` + opcionais `scale, boss, slam{every,r,mult,delay,fire}, poison, steal, fly, ranged, disguise, ai, clone, pack, hover, arrow, projC`.
  - `fly` voa direto até o herói **atravessando paredes**; `hover` só dá o balanço de voo no desenho e respeita paredes (use `hover` em cavernas).
  - `pack:[min,max]`: nasce em bando (`spawnMon`, em `02`). `ranged` atira de longe (`monSpecial`, em `09`); `arrow:1` desenha flecha em vez de orbe e `projC` é a cor do disparo. Os disparos param na rocha.
  - Monstros da caverna (em `11`): Morcego da Caverna (bando, `hover`), Esqueleto Arqueiro (`ranged`, `arrow`), Zumbi Mineiro (lento, resistente, `poison`), além do Esqueleto Guerreiro de `02`.
- Escala por nível: vida ×(1+0,22·(nv−1)), ataque ×(1+0,16·(nv−1)), defesa ×(1+0,12·(nv−1)). Elite: 2,6× vida, 1,35× ataque.
- IA: estados `idle`, `chase`, `return`. `monSpecial(m, dt, dP)` trata os comportamentos especiais e `bossAI` as mecânicas dos chefes (`mascaras`, `totemA`, `raposa9`).
- **Onde cada chefe é definido:** o Wyrm tem `boss:'wyrm'` direto em `MAPS.covil` (`01`). Os chefes das Encostas são acrescentados em `10`, com `Object.assign(MAPS.encostaN, {boss, bossLv})`. Por isso, olhar só a tabela `MAPS` não mostra todos os chefes.
- Chefes nascem no centro do maior platô (`bossSpot`) ou no `LAIR`. Voltam em 4 min (Covil: 3 min). Ao morrer: banner "MVP!" e um item épico+ garantido.

### Classes, habilidades e especializações (`02`, `03`, `06`, `07`)
- `CL[classe]` guarda os atributos base e o crescimento por nível. `CLASS_TREE[classe] = {base, free, ic, specs:[…]}`.
- `SPECS[esp] = {cls, n, ap, ic, cor, d, bonus, trial:{t, goal, kind, typ}}`. Tipos de prova: `skill`, `type`, `nasc`, `elite`, `lowhp`, `hits`, `clean`.
- `SK[id]` (nó da árvore): `tree, tier, lvl, pts, promo, max, act, ic, n, type, mp, cd, range, color`, arrays `[base, porRank]` (`m, hits, j, hpm, amp, heal, dur, n2, batk, bdef, bspd, bleed, poison, shield`), `pas:{atributo: valorPorRank}` e `d: e => texto`. `eff(id, rank)` calcula os valores.
- Tipos de habilidade:
  - `03`: `proj, aoeSelf, aoeTarget, single, buff, chain, curse, storm, summon, army, hot, bear, pulse`
  - `06` (`castWar`): `heal, shield, banner, leap`
  - `07` (`castArcher`): `pet, alpha, howl, trap, volley, evade, stealth, fan, execute`
- Atributos derivados em `P.st`: `hp, mp, atk, def, crit, spd, dmgPct, cdr, mpCut, thorns, leech, rage, block, toxin, petPct`.
- 1 ponto por nível a partir do 2. A primeira habilidade da classe é grátis. Especialização no nível 10 (prova com a Mestra Elara) e promoção no 25 (libera a habilidade suprema).

### Itens e visual do herói (`02`, `05`)
- Slots: `arma, elmo, peito, botas, anel`. Raridades: Comum, Incomum, Raro, Épico, Lendário (cores em `RARC`).
- O estilo segue a classe (`CSTYLE`): Guerreiro = metal, Mago = tecido, Arqueira = couro. O nível visual vem de `tierOf(item)` = `floor(ilvl/6)`, de 0 a 3. O herói é recomposto quando o equipamento muda.

### Save
- `localStorage['valdoria_save_v1']` (constante `SAVEKEY` em `01`): `v, name, cls, lvl, xp, gold, inv, equip, pots, x, y, map, ranks, bar, spec, promo, quest`.
- **`v` é a versão do formato** (hoje `1`, gravada em `save()` no `02`). Ao mudar o formato, aumente `v` e migre em `enter()` (`99`) conforme o `v` lido. Trate saves sem `v` como versão 1.
- `initSkills` migra saves antigos (ids `guerreiro0`/`arqueira0` → nós novos da árvore).
- Se o `map` salvo deixar de existir, `enter()` já manda o herói para Valdor. Mantenha esse comportamento ao renomear ou remover mapas.

## Testes

O teste roda **no navegador de verdade**, sem Node nem instalação. (Nesta máquina não há Node, então `node --check` não está disponível; erros de sintaxe aparecem no teste como "ERROS NO CONSOLE".)

- **Para o Claude rodar:** `powershell -ExecutionPolicy Bypass -File tests\rodar-testes.ps1` (a partir da pasta do jogo). Abre o jogo em Edge/Chrome sem janela, num perfil temporário, e imprime o resultado. Código de saída 0 = tudo OK.
- **Para o dono ver:** abrir `tests/smoke.html` (ou `index.html?teste`). O resultado aparece por cima do jogo.
- Como funciona: com `?teste` no endereço, o `index.html` passa a anotar erros desde o carregamento e, depois de todos os scripts, carrega `tests/smoke.js`. Sem `?teste`, nada disso roda.
- O `smoke.js` percorre: criação das 3 classes, 200 quadros de jogo, subida até o nível 30, aprendizado de habilidades, especialização e promoção, as 6 teclas da hotbar em combate, save e load, todos os mapas, todos os portais (ida e volta) e a IA de cada chefe por 300 quadros.
- Ele **desliga o `save()` enquanto roda e devolve o save original no final**. Qualquer teste novo que salve deve usar o mesmo cuidado.
- Ao criar um sistema novo, **acrescente um teste nele** em `tests/smoke.js`.
- O script tenta duas vezes: o navegador sem janela às vezes trava sozinho. Se travar nas duas, desconfie de laço infinito no jogo.
- `tests/smoke-node.js` é a versão antiga do teste, para Node (simula o navegador). Útil numa máquina com Node (`node tests/smoke-node.js`); se mexer em algo que ela usa, mantenha-a funcionando, mas o teste oficial é o do navegador.
- Para validar sprites visualmente, dá para capturar os pixels desenhados e gerar um PNG (foi feito com Python/PIL durante o desenvolvimento).

## Roteiro (próximos passos)

1. **Caverna de Pinheiral**, em três etapas:
   - ✅ Portais com posição livre, estradas opcionais e o trecho de estrada que some no mato (26/09/2026).
   - ✅ **Etapa 1, estrutura** (26/09/2026): boca no oeste de Pinheiral, 3 andares de 80×60 em salões e corredores (o dono decidiu manter o tamanho), escadas, escuridão com a tocha do herói, tema 7. Os monstros são **provisórios** (aranha, esqueleto, golem).
   - ✅ **Etapa 2, monstros próprios** (26/09/2026): `caverna1` morcegos em bando + esqueletos; `caverna2` esqueletos arqueiros + zumbis mineiros + esqueletos; `caverna3` todos misturados, com 12% de elites. Números ainda não testados jogando.
   - **Etapa 3, chefe:** o **Senhor dos Ossos** no fundo (`caverna3`), que invoca esqueletos. Seguir o padrão de `10` (`boss`, `bossLv`, `ai` em `bossAI`).
   - Sugestões ainda não aprovadas: aparência própria para cada portal conforme o lugar (boca de caverna, escada, arco de pedra); minimapa que só revela o que o herói já viu, nas cavernas.
2. **Exportar e importar save**, para levar o herói entre o link do Claude, o GitHub Pages e outros navegadores.
3. Visual próprio por especialização (ex.: armadura dourada só do Paladino) e mestres de classe por cidade.
4. Revisão de equilíbrio jogando de verdade (os números foram ajustados por testes automáticos).
5. Multiplayer, em fases:
   - Presença compartilhada: ver amigos no mesmo mapa e chat (ex.: Supabase Realtime ou WebSocket simples).
   - Um jogador anfitrião via WebRTC, ou servidor autoritativo em Node (ex.: Colyseus), com grupo, loot compartilhado e contas.
   - O servidor exige mover a lógica de mundo (monstros, combate, loot) para fora do navegador.
