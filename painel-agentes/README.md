# Painel de agentes

Um escritório em pixel art onde cada sessão do Claude Code que mexe neste repositório vira um boneco: o agente principal fica no Comando, e cada subagente anda até a sala do seu papel (Biblioteca, Oficina, Laboratório, Revisão) e vai para a Copa quando termina. Não faz parte do jogo: o `index.html` do jogo não carrega nada daqui.

**Ver o painel:** https://adrianpastore.github.io/ecos-de-valdoria/painel-agentes/ (com `?sim` mostra uma simulação).

## Como funciona

1. `.claude/settings.json` (na raiz do repositório) liga os hooks do Claude Code a `painel-agentes/hook.mjs`.
2. O hook resume cada passo (`normalizar.mjs`: qual agente, qual ferramenta, nome do arquivo ou um comando curto) e grava na tabela `painel_eventos` do Supabase (projeto **estoque**). O conteúdo dos arquivos nunca é enviado.
3. O painel lê os eventos dos últimos 20 minutos e escuta os novos em tempo real. A tabela guarda 2 dias e se limpa sozinha.

`config.json` tem o endereço do Supabase e a chave **pública** (a mesma que qualquer site com Supabase expõe). Ela só permite gravar eventos e ler os do último dia.

## Sessões na nuvem

As sessões na nuvem só alcançam sites liberados. No ambiente de nuvem do projeto, libere o domínio `iyfsupibgfeeykmeykvc.supabase.co` (ou `*.supabase.co`) em **Allowed domains**; sem isso o hook falha em silêncio e nada aparece.

## Desligar

Apague o bloco `hooks` de `.claude/settings.json`. Para desligar só no seu computador, ponha `"disableAllHooks": true` em `.claude/settings.local.json`.
