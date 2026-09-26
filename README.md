# ⚔️ Ecos de Valdoria

RPG leve de navegador em pixel art, inspirado em MMOs clássicos como Ragnarok Online, Perfect World e World of Warcraft. Explore mapas ligados por portais, derrote monstros e chefes MVP, saqueie baús e evolua seu herói por árvores de habilidades e especializações.

## Como jogar

- **Online:** abra o endereço do GitHub Pages do repositório (veja "Publicar" abaixo).
- **No computador:** baixe o projeto e abra o `index.html` no navegador. Não precisa instalar nada.

O progresso é salvo automaticamente no navegador de cada jogador.

### Controles

| Ação | Teclado | Toque / mouse |
|---|---|---|
| Andar | WASD ou setas | Clique ou toque no chão |
| Atacar | Espaço (alvo mais próximo) | Clique no monstro |
| Habilidades | 1 a 6 | Barra inferior |
| Poções | Q (vida) e R (mana) | Barra inferior |
| Interagir (baús, mercador, mentora) | E | Clique no objeto |
| Bolsa / Árvore de habilidades | I / T | Botões 🎒 e 🌟 |
| Trocar de alvo / Fechar janelas | Tab / Esc | — |

## Conteúdo

- **3 classes e 9 especializações:** Mago (Bruxo, Necromante, Druida), Guerreiro (Paladino, Berserker, Cavaleiro) e Arqueira (Caçadora, Patrulheira, Assassina), com provas no nível 10 e promoção no nível 25.
- **Mundo em mapas:** Vila de Valdor, Floresta Verdejante, Pântano Sombrio, Ruínas Esquecidas, Covil do Wyrm, Estrada do Sul, Aldeia de Pinheiral e as Encostas de Pinheiral 01 a 07.
- **Chefes MVP:** Wyrm Carmesim, Mestre das Máscaras, Grande Totem Ancião e Raposa Anciã de Nove Caudas.
- **Equipamentos visíveis no personagem**, com 5 raridades (comum a lendário).

## Estrutura do projeto

Os scripts são carregados **em ordem** pelo `index.html` e compartilham o mesmo escopo. Um arquivo pode usar o que foi definido nos anteriores.

| Arquivo | O que tem |
|---|---|
| `index.html` | Estrutura da página e da interface |
| `css/estilo.css` | Visual da interface (tema claro e escuro) |
| `js/01-nucleo-sprites-e-mundo.js` | Utilidades, sprites em pixel art, lista de mapas e gerador de terreno |
| `js/02-jogador-monstros-e-combate.js` | Classes, itens, monstros, combate, baús, loot e save |
| `js/03-habilidades-e-especializacoes.js` | Sistema de habilidades, árvores do Mago, aliados e provas |
| `js/04-arvore-e-mentora.js` | Janelas da árvore de habilidades e da Mestra Elara |
| `js/05-boneco-em-camadas.js` | Equipamentos visíveis no personagem |
| `js/06-guerreiro.js` | Árvore do Guerreiro |
| `js/07-arqueira.js` | Árvore da Arqueira |
| `js/08-mapas-e-portais.js` | Troca de mapas, portais e tela de carregamento |
| `js/09-regiao-pinheiral.js` | Pinheiral, Encostas e monstros com comportamentos especiais |
| `js/10-chefes-mvp.js` | Chefes MVP e suas mecânicas |
| `js/99-interface-e-inicio.js` | Renderização, interface, controles e inicialização (sempre por último) |

Para adicionar um sistema novo, crie um arquivo com número entre 10 e 99 e inclua a tag `<script>` no `index.html`, antes do `99-interface-e-inicio.js`.

## Publicar no GitHub Pages

1. No repositório, abra **Settings → Pages**.
2. Em **Build and deployment**, escolha **Deploy from a branch**, a branch `main` e a pasta `/ (root)`, e salve.
3. Em um ou dois minutos, o jogo fica disponível em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

## Próximos passos

- [ ] Caverna de Pinheiral: três andares escuros, com o chefe Senhor dos Ossos
- [ ] Exportar/importar save (para levar o progresso entre navegadores)
- [ ] Presença compartilhada: ver amigos no mesmo mapa e conversar
- [ ] Multiplayer com servidor: grupo, loot compartilhado e contas
