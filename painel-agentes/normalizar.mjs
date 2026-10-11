// Converte a entrada bruta de um hook do Claude (Claude Code ou Agent SDK)
// no evento simples que o painel entende:
//   { ts, sessao, agente: { id, tipo }, evento, ferramenta?, detalhe? }
// evento: pedido | inicio | ferramenta | ferramenta_fim | erro | fim

const nomeArquivo = (p) => String(p).split(/[\\/]/).filter(Boolean).pop() ?? '';
const corta = (s, n) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

export function resumirEntrada(ferramenta, entrada = {}) {
  if (!entrada || typeof entrada !== 'object') return '';
  if (ferramenta === 'Agent' || ferramenta === 'Task') return corta(entrada.description ?? entrada.subagent_type ?? '', 48);
  if (entrada.file_path || entrada.notebook_path) return nomeArquivo(entrada.file_path ?? entrada.notebook_path);
  if (entrada.command) return corta(entrada.command, 48);
  if (entrada.pattern) return corta(`"${entrada.pattern}"`, 40);
  if (entrada.url) { try { return new URL(entrada.url).hostname; } catch { return corta(entrada.url, 40); } }
  if (entrada.query) return corta(entrada.query, 40);
  if (entrada.path) return nomeArquivo(entrada.path);
  if (Array.isArray(entrada.todos)) return `${entrada.todos.length} itens`;
  return '';
}

const nomeFerramenta = (n = '') => (n.startsWith('mcp__') ? `mcp:${n.split('__').pop()}` : n);

export function normalizar(h) {
  if (!h || typeof h !== 'object' || !h.hook_event_name) return null;
  const sessao = String(h.session_id ?? 'local').slice(0, 8);
  const agente = h.agent_id
    ? { id: String(h.agent_id), tipo: h.agent_type || 'subagente' }
    : { id: `principal-${sessao}`, tipo: 'orquestrador' };
  const base = { ts: Date.now(), sessao, agente };
  const ferramenta = nomeFerramenta(h.tool_name);
  switch (h.hook_event_name) {
    case 'UserPromptSubmit':
      return { ...base, evento: 'pedido', detalhe: corta(h.prompt, 120) };
    case 'SubagentStart':
      return { ...base, evento: 'inicio', detalhe: '' };
    case 'PreToolUse':
      return { ...base, evento: 'ferramenta', ferramenta, detalhe: resumirEntrada(h.tool_name, h.tool_input) };
    case 'PostToolUse':
      return { ...base, evento: 'ferramenta_fim', ferramenta, detalhe: resumirEntrada(h.tool_name, h.tool_input) };
    case 'PostToolUseFailure':
      return { ...base, evento: 'erro', ferramenta, detalhe: corta(h.error, 60) };
    case 'SubagentStop':
      return { ...base, evento: 'fim' };
    case 'Stop':
      return h.agent_id ? null : { ...base, evento: 'fim' };
    default:
      return null;
  }
}
