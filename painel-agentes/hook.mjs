// Hook do Claude Code: manda cada passo da sessão para o painel de agentes.
// Ligado em .claude/settings.json; funciona no computador e nas sessões na nuvem.
// Grava o evento já resumido (nome de arquivo, comando curto) numa tabela do Supabase;
// o painel publicado (painel-agentes/index.html) lê de lá em tempo real.
// Nunca atrapalha a sessão: qualquer falha é ignorada e o hook sai em até ~1,5 s.
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { normalizar } from './normalizar.mjs';

// Na nuvem a internet só passa pelo proxy (HTTPS_PROXY), e o fetch do Node ignora
// o proxy a menos que NODE_USE_ENV_PROXY=1. Sem isso nenhum evento chegava ao painel.
// Então o hook se roda de novo com essa variável; no computador (sem proxy) nada muda.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const filho = spawn(process.execPath, ['--no-warnings', ...process.argv.slice(1)], {
    env: { ...process.env, NODE_USE_ENV_PROXY: '1' }, stdio: ['pipe', 'ignore', 'ignore'],
  });
  process.stdin.pipe(filho.stdin);
  filho.on('exit', () => process.exit(0));
  filho.on('error', () => process.exit(0));
} else {

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));

let corpo = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { corpo += c; });
process.stdin.on('end', async () => {
  try {
    const ev = normalizar(JSON.parse(corpo));
    if (ev) {
      await fetch(`${cfg.supabaseUrl}/rest/v1/painel_eventos`, {
        method: 'POST',
        headers: { apikey: cfg.chave, Authorization: `Bearer ${cfg.chave}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({
          sessao: ev.sessao.slice(0, 40), agente_id: ev.agente.id.slice(0, 80), agente_tipo: ev.agente.tipo.slice(0, 60),
          evento: ev.evento, ferramenta: ev.ferramenta?.slice(0, 60) || null, detalhe: ev.detalhe?.slice(0, 160) || null,
        }),
        signal: AbortSignal.timeout(1500),
      });
    }
  } catch {
    // sem rede ou painel fora do ar: segue a vida
  }
  process.exit(0);
});
}
