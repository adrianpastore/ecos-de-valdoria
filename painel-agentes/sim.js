// Simulador de agentes. Gera os mesmos eventos que o servidor produz a partir
// dos hooks reais, então o painel não sabe (nem precisa saber) a diferença.
// Funciona no navegador e no Node (importado por simulador.mjs).

const TAREFAS = [
  {
    pedido: 'Adicionar login com Google ao app',
    tema: 'auth',
    equipe: [
      ['pesquisador', 'Mapear fluxo OAuth atual'],
      ['programador', 'Implementar rota de callback'],
      ['testador', 'Cobrir login com testes'],
      ['revisor', 'Revisar segurança do login'],
    ],
  },
  {
    pedido: 'Corrigir lentidão na página de relatórios',
    tema: 'relatorios',
    equipe: [
      ['pesquisador', 'Achar consultas lentas'],
      ['programador', 'Adicionar cache e índice'],
      ['testador', 'Medir antes e depois'],
    ],
  },
  {
    pedido: 'Escrever a documentação da API de pedidos',
    tema: 'pedidos',
    equipe: [
      ['Explore', 'Levantar endpoints de pedidos'],
      ['general-purpose', 'Redigir exemplos de uso'],
      ['revisor', 'Revisar clareza do texto'],
    ],
  },
  {
    pedido: 'Migrar o banco de dados para Postgres 17',
    tema: 'banco',
    equipe: [
      ['pesquisador', 'Checar incompatibilidades'],
      ['programador', 'Atualizar migrações'],
      ['programador', 'Ajustar consultas antigas'],
      ['testador', 'Rodar suíte de integração'],
      ['revisor', 'Revisar plano de rollback'],
    ],
  },
];

const ARQUIVOS = {
  auth: ['src/auth/login.ts', 'src/auth/session.ts', 'src/routes/oauth.ts', 'src/config/env.ts', 'tests/auth.test.ts'],
  relatorios: ['src/reports/query.ts', 'src/reports/page.tsx', 'src/db/indexes.sql', 'src/cache/redis.ts', 'tests/reports.test.ts'],
  pedidos: ['src/api/orders.ts', 'src/api/schemas.ts', 'docs/api/pedidos.md', 'src/api/errors.ts', 'tests/orders.test.ts'],
  banco: ['db/migrations/0042_pg17.sql', 'src/db/client.ts', 'src/db/legacy.ts', 'docker-compose.yml', 'tests/db.int.test.ts'],
};

const BUSCAS = {
  auth: ['oauth google node', 'passport-google-oauth20 PKCE'],
  relatorios: ['postgres explain analyze', 'redis cache invalidation'],
  pedidos: ['openapi 3.1 exemplos', 'boas práticas docs REST'],
  banco: ['postgres 17 release notes', 'pg_upgrade checklist'],
};

const sorteio = (lista) => lista[Math.floor(Math.random() * lista.length)];
const entre = (a, b) => a + Math.random() * (b - a);

function roteiro(tipo, tema) {
  const arq = ARQUIVOS[tema];
  const teste = arq[arq.length - 1];
  const nome = (p) => p.split('/').pop();
  switch (tipo) {
    case 'pesquisador':
    case 'Explore':
      return [
        ['Glob', 'src/**/*.ts'],
        ['Grep', `"${tema}"`],
        ['Read', nome(arq[0])],
        ['Read', nome(arq[1])],
        ['WebSearch', sorteio(BUSCAS[tema])],
        ['WebFetch', 'docs.oficiais.dev'],
        ['Read', nome(arq[2])],
      ];
    case 'programador':
      return [
        ['Read', nome(arq[0])],
        ['Edit', nome(arq[0])],
        ['Edit', nome(arq[2])],
        ['Write', nome(arq[3])],
        ['Bash', 'npm run build'],
      ];
    case 'testador':
      return [
        ['Read', nome(teste)],
        ['Write', nome(teste)],
        ['Bash', `npm test -- ${tema}`, { falhaChance: 0.5 }],
      ];
    case 'revisor':
      return [
        ['Bash', 'git diff --stat'],
        ['Read', nome(arq[0])],
        ['Grep', '"TODO|FIXME"'],
        ['Read', nome(arq[2])],
      ];
    default: // general-purpose: muda de sala conforme a ferramenta
      return [
        ['Grep', `"${tema}"`],
        ['Read', nome(arq[1])],
        ['Write', nome(arq[2])],
        ['Edit', nome(arq[2])],
        ['Bash', `npm test -- ${tema}`],
      ];
  }
}

class Parada extends Error {}

export function criarSimulador(emitir) {
  let pausado = false;
  let velocidade = 1;
  let parado = false;
  let contador = 0;
  const principal = { id: 'principal-sim', tipo: 'orquestrador' };

  const dormir = async (ms) => {
    let resta = ms;
    while (resta > 0) {
      if (parado) throw new Parada();
      await new Promise((r) => setTimeout(r, 50));
      if (!pausado) resta -= 50 * velocidade;
    }
  };

  const ev = (agente, evento, extra = {}) =>
    emitir({ ts: Date.now(), sessao: 'sim', agente, evento, ...extra });

  async function ferramenta(agente, nome, detalhe, opcoes = {}) {
    ev(agente, 'ferramenta', { ferramenta: nome, detalhe });
    await dormir(entre(1400, 3600));
    if (opcoes.falhaChance && Math.random() < opcoes.falhaChance) {
      ev(agente, 'erro', { ferramenta: nome, detalhe: '2 testes falharam' });
      return false;
    }
    ev(agente, 'ferramenta_fim', { ferramenta: nome, detalhe });
    await dormir(entre(500, 1400));
    return true;
  }

  async function subagente(tipo, descricao, tema) {
    const agente = { id: `sim-${tipo}-${++contador}`, tipo };
    ev(agente, 'inicio', { detalhe: descricao });
    await dormir(entre(2500, 4000)); // tempo de caminhar até a sala
    for (const [nome, detalhe, opcoes] of roteiro(tipo, tema)) {
      const ok = await ferramenta(agente, nome, detalhe, opcoes);
      if (!ok) {
        // teste quebrou: corrige e roda de novo
        await dormir(1500);
        await ferramenta(agente, 'Read', ARQUIVOS[tema][0].split('/').pop());
        await ferramenta(agente, 'Edit', ARQUIVOS[tema][0].split('/').pop());
        await ferramenta(agente, 'Bash', `npm test -- ${tema}`);
      }
    }
    ev(agente, 'fim', { detalhe: 'entregou o resultado' });
  }

  async function tarefa(t) {
    ev(principal, 'pedido', { detalhe: t.pedido });
    await dormir(1500);
    await ferramenta(principal, 'Read', 'README.md');
    await ferramenta(principal, 'Glob', 'src/**');
    await ferramenta(principal, 'TodoWrite', `${t.equipe.length} subtarefas`);
    const trabalhos = [];
    for (const [tipo, descricao] of t.equipe) {
      ev(principal, 'ferramenta', { ferramenta: 'Agent', detalhe: descricao });
      trabalhos.push(
        subagente(tipo, descricao, t.tema).then(() =>
          ev(principal, 'ferramenta_fim', { ferramenta: 'Agent', detalhe: descricao }),
        ),
      );
      await dormir(entre(700, 1300));
    }
    await Promise.all(trabalhos);
    await dormir(1000);
    await ferramenta(principal, 'Bash', 'git diff --stat');
    ev(principal, 'fim', { detalhe: 'tarefa concluída' });
  }

  async function rodar() {
    let i = 0;
    try {
      while (!parado) {
        await tarefa(TAREFAS[i % TAREFAS.length]);
        i++;
        await dormir(6000);
      }
    } catch (e) {
      if (!(e instanceof Parada)) throw e;
    }
  }

  rodar();

  return {
    pausar(valor) { pausado = valor; },
    get pausado() { return pausado; },
    definirVelocidade(v) { velocidade = v; },
    parar() { parado = true; },
  };
}
