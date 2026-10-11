// Hook do Claude Code: manda cada passo da sessão para o painel de agentes.
// Ligado em .claude/settings.json; funciona no computador e nas sessões na nuvem.
// Grava o evento já resumido (nome de arquivo, comando curto) numa tabela do Supabase;
// o painel publicado (painel-agentes/index.html) lê de lá em tempo real.
// Nunca atrapalha a sessão: qualquer falha é ignorada e o hook sai em até ~2 s.
import { readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { normalizar } from './normalizar.mjs';

const cfg = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));

let corpo = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { corpo += c; });
process.stdin.on('end', async () => {
  try {
    const ev = normalizar(JSON.parse(corpo));
    if (ev) {
      const url = `${cfg.supabaseUrl}/rest/v1/painel_eventos`;
      const cab = { apikey: cfg.chave, Authorization: `Bearer ${cfg.chave}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' };
      const dados = JSON.stringify({
        sessao: ev.sessao.slice(0, 40), agente_id: ev.agente.id.slice(0, 80), agente_tipo: ev.agente.tipo.slice(0, 60),
        evento: ev.evento, ferramenta: ev.ferramenta?.slice(0, 60) || null, detalhe: ev.detalhe?.slice(0, 160) || null,
      });
      // Nas sessões na nuvem a internet passa por um proxy (HTTPS_PROXY), e o fetch do Node
      // não usa proxy sozinho: lá o envio vai pelo curl, que usa.
      if (process.env.HTTPS_PROXY || process.env.https_proxy) await viaCurl(url, cab, dados);
      else await fetch(url, { method: 'POST', headers: cab, body: dados, signal: AbortSignal.timeout(1500) });
    }
  } catch {
    // sem rede ou painel fora do ar: segue a vida
  }
  process.exit(0);
});

function viaCurl(url, cab, dados) {
  const args = ['-sS', '-m', '2', '-X', 'POST', url, '--data-binary', '@-'];
  for (const [k, v] of Object.entries(cab)) args.push('-H', `${k}: ${v}`);
  return new Promise((ok) => { execFile('curl', args, () => ok()).stdin.end(dados); });
}
