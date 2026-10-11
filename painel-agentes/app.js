import { criarSimulador } from './sim.js';

// ---------------------------------------------------------------------------
// Mundo: 480x288 pixels lógicos. Duas fileiras de três salas e um corredor.
// ---------------------------------------------------------------------------
const W = 480, H = 288;
const CORREDOR_Y = 144; // linha central do corredor (y 128..160)

const SALAS = {
  biblioteca:  { x: 0,   y: 0,   topo: true,  nome: 'Biblioteca',  papel: 'pesquisa',      cor: '#79b8ff', piso: ['#3b2a22', '#33241d'], parede: '#2c3a52', mesa: 'leitura' },
  comando:     { x: 160, y: 0,   topo: true,  nome: 'Comando',     papel: 'orquestrador',  cor: '#f3b94d', piso: ['#1d2a44', '#1a2640'], parede: '#24304a', mesa: 'monitor' },
  oficina:     { x: 320, y: 0,   topo: true,  nome: 'Oficina',     papel: 'código',        cor: '#c29bff', piso: ['#2b3140', '#272c3a'], parede: '#2f2a48', mesa: 'monitor' },
  laboratorio: { x: 0,   y: 160, topo: false, nome: 'Laboratório', papel: 'testes',        cor: '#74d39a', piso: ['#26413d', '#213a36'], parede: '#1f3a3a', mesa: 'bancada' },
  copa:        { x: 160, y: 160, topo: false, nome: 'Copa',        papel: 'quem terminou', cor: '#ebe5d6', piso: ['#4a3826', '#433220'], parede: '#3a2c2a', mesa: null },
  revisao:     { x: 320, y: 160, topo: false, nome: 'Revisão',     papel: 'revisão',       cor: '#ff9e7a', piso: ['#2c3b2a', '#273525'], parede: '#2d3a2a', mesa: 'monitor' },
};
for (const [id, s] of Object.entries(SALAS)) {
  s.id = id;
  s.cx = s.x + 80;
  s.porta = s.topo ? { x: s.cx, y: s.y + 118 } : { x: s.cx, y: s.y + 32 };
  s.lugares = [];
}

// Lugares de trabalho (o boneco fica ao sul da mesa, de costas para nós).
for (const s of Object.values(SALAS)) {
  if (s.id === 'comando') {
    s.lugares.push({ x: s.cx, y: s.y + 62, mesa: 'console' });
    s.lugares.push({ x: s.x + 36, y: s.y + 102, mesa: 'monitor' });
    s.lugares.push({ x: s.x + 124, y: s.y + 102, mesa: 'monitor' });
  } else if (s.id === 'copa') {
    for (const [dx, dy] of [[36, 66], [58, 70], [102, 70], [124, 66], [42, 104], [80, 110], [118, 104]]) {
      s.lugares.push({ x: s.x + dx, y: s.y + dy, mesa: null });
    }
  } else {
    for (const dy of [58, 100]) for (const dx of [36, 124]) {
      s.lugares.push({ x: s.x + dx, y: s.y + dy, mesa: s.mesa });
    }
  }
  for (const l of s.lugares) { l.sala = s.id; l.ocupante = null; }
}

const salaDoPonto = (x, y) => {
  if (y > 128 && y < 160) return null;
  const col = Math.min(2, Math.max(0, Math.floor(x / 160)));
  const lin = y < 128 ? 0 : 1;
  return Object.values(SALAS).find((s) => s.x === col * 160 && s.y === lin * 160) || null;
};

// ---------------------------------------------------------------------------
// Papéis e ferramentas
// ---------------------------------------------------------------------------
const NOMES_TIPO = {
  orquestrador: 'Orquestrador', 'general-purpose': 'Geral', Explore: 'Explorador', Plan: 'Planejador',
};
function salaCasa(tipo) {
  const t = tipo.toLowerCase();
  if (t === 'orquestrador') return 'comando';
  if (/pesquis|research|explor|busca|search|plan/.test(t)) return 'biblioteca';
  if (/test|qa|verif/.test(t)) return 'laboratorio';
  if (/revis|review|critic|audit/.test(t)) return 'revisao';
  if (/program|code|codig|dev|engin|implement/.test(t)) return 'oficina';
  return null; // genérico: a sala acompanha a ferramenta
}
const LEITURA = new Set(['Read', 'Grep', 'Glob', 'LS', 'WebFetch', 'WebSearch', 'NotebookRead']);
const ESCRITA = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit']);
const ehTeste = (f, d = '') => f === 'Bash' && /\b(test|tests|jest|vitest|pytest|mocha|spec|cargo test|go test)\b/i.test(d);

function estadoDaFerramenta(f, d) {
  if (f === 'Agent' || f === 'Task') return 'delegando';
  if (LEITURA.has(f)) return 'lendo';
  if (ehTeste(f, d)) return 'testando';
  if (f === 'TodoWrite') return 'pensando';
  return 'digitando';
}
function salaParaFerramenta(a, f, d) {
  const casa = salaCasa(a.tipo);
  if (casa) return casa;
  if (LEITURA.has(f)) return 'biblioteca';
  if (ehTeste(f, d)) return 'laboratorio';
  return 'oficina';
}
function frase(f, d = '') {
  const m = {
    Read: `lendo ${d}`, Grep: `buscando ${d}`, Glob: `listando ${d}`, LS: `listando ${d}`,
    Edit: `editando ${d}`, MultiEdit: `editando ${d}`, Write: `escrevendo ${d}`,
    Bash: `$ ${d}`, WebSearch: `pesquisando ${d}`, WebFetch: `abrindo ${d}`,
    Agent: `delegando: ${d}`, Task: `delegando: ${d}`, TodoWrite: `planejando ${d}`,
  };
  return (m[f] ?? `${f} ${d}`).trim();
}

// ---------------------------------------------------------------------------
// Agentes
// ---------------------------------------------------------------------------
const PALETAS = {
  camisa: ['#e05d5d', '#4f8fe6', '#5fbf7a', '#e0a33c', '#a66be0', '#3cb8b0', '#e07bb4', '#7a86a8'],
  cabelo: ['#2a1c14', '#5a3a1e', '#c7923e', '#1a1a1a', '#8a2f1f', '#d9d2c5', '#3d2b55'],
  pele: ['#f1c9a0', '#d9a273', '#a86b45', '#7a4a2c', '#f6d6b8'],
  calca: ['#2b3550', '#3a2f2a', '#2f3a33', '#41364f'],
};
const hash = (s) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

const agentes = new Map();
let criados = 0;
const camada = document.getElementById('camada');
let relogio = 0; // segundos de mundo

function nomeExibicao(agente) {
  const base = NOMES_TIPO[agente.tipo] ?? (agente.tipo.charAt(0).toUpperCase() + agente.tipo.slice(1));
  const iguais = [...agentes.values()].filter((a) => a.base === base).length;
  return { base, nome: iguais ? `${base} ${iguais + 1}` : base };
}

function obterAgente(ref, instantaneo = false) {
  let a = agentes.get(ref.id);
  if (a) return a;
  const h = hash(ref.id);
  const { base, nome } = nomeExibicao(ref);
  const principal = ref.tipo === 'orquestrador';
  a = {
    id: ref.id, tipo: ref.tipo, base, nome, principal,
    cor: {
      camisa: principal ? '#f3b94d' : PALETAS.camisa[criados++ % PALETAS.camisa.length],
      cabelo: PALETAS.cabelo[(h >> 3) % PALETAS.cabelo.length],
      pele: PALETAS.pele[(h >> 6) % PALETAS.pele.length],
      calca: PALETAS.calca[(h >> 9) % PALETAS.calca.length],
    },
    x: SALAS.comando.cx, y: SALAS.comando.y + 104, rota: [], dir: 's',
    estado: 'pensando', detalhe: '', lugar: null, chamadas: 0,
    fimEm: null, erroAte: 0, removerEm: null,
  };
  agentes.set(a.id, a);
  a.el = document.createElement('div');
  a.el.className = 'boneco';
  a.el.innerHTML = '<span class="balao"></span><span class="nome"></span>';
  a.el.querySelector('.nome').textContent = a.nome;
  camada.appendChild(a.el);
  if (principal) irPara(a, 'comando', true);
  else if (instantaneo) irPara(a, salaCasa(a.tipo) ?? 'oficina', true);
  return a;
}

function irPara(a, salaId, instantaneo = false) {
  if (a.lugar && a.lugar.sala === salaId) return;
  const sala = SALAS[salaId];
  let lugar = sala.lugares.find((l) => !l.ocupante);
  if (!lugar) { // sala lotada: fica em pé num canto livre
    lugar = { sala: salaId, x: sala.x + 24 + Math.random() * 112, y: sala.y + (sala.topo ? 74 : 80) + Math.random() * 30, mesa: null, extra: true };
  }
  if (a.lugar) a.lugar.ocupante = null;
  lugar.ocupante = a;
  a.lugar = lugar;
  if (instantaneo) { a.x = lugar.x; a.y = lugar.y; a.rota = []; return; }
  a.rota = rota(a, lugar);
}

function rota(a, destino) {
  const pts = [];
  const origem = salaDoPonto(a.x, a.y);
  const alvo = SALAS[destino.sala];
  if (origem !== alvo) {
    if (origem) {
      pts.push({ x: origem.cx, y: a.y }, origem.porta, { x: origem.cx, y: CORREDOR_Y });
    } else {
      pts.push({ x: a.x, y: CORREDOR_Y });
    }
    pts.push({ x: alvo.cx, y: CORREDOR_Y }, alvo.porta);
  } else {
    pts.push({ x: alvo.cx, y: a.y });
  }
  pts.push({ x: alvo.cx, y: destino.y }, { x: destino.x, y: destino.y });
  return pts;
}

function remover(a) {
  if (a.lugar) a.lugar.ocupante = null;
  a.el.style.opacity = '0';
  setTimeout(() => a.el.remove(), 900);
  agentes.delete(a.id);
  atualizarEquipe();
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
function aplicar(ev, instantaneo = false, anotar = !instantaneo) {
  const a = obterAgente(ev.agente, instantaneo);
  a.ultimo = relogio;
  a.fimEm = null;
  switch (ev.evento) {
    case 'pedido':
      a.estado = 'pensando'; a.detalhe = 'nova tarefa!';
      definirTarefa(ev.detalhe);
      break;
    case 'inicio':
      a.estado = 'pensando'; a.detalhe = ev.detalhe || 'começando';
      a.removerEm = null;
      irPara(a, salaCasa(a.tipo) ?? 'oficina', instantaneo);
      break;
    case 'ferramenta':
      a.chamadas++;
      a.estado = estadoDaFerramenta(ev.ferramenta, ev.detalhe);
      a.detalhe = frase(ev.ferramenta, ev.detalhe);
      a.removerEm = null;
      irPara(a, a.principal ? 'comando' : salaParaFerramenta(a, ev.ferramenta, ev.detalhe), instantaneo);
      break;
    case 'ferramenta_fim':
      a.fimEm = relogio + 0.8;
      break;
    case 'erro':
      a.estado = 'erro'; a.detalhe = `falhou: ${ev.detalhe || ev.ferramenta || ''}`.trim();
      a.erroAte = relogio + 2.5;
      break;
    case 'fim':
      if (a.principal) {
        a.estado = 'ocioso'; a.detalhe = 'tarefa concluída ✓';
        definirTarefa(null);
      } else {
        a.estado = 'pronto'; a.detalhe = 'pronto ✓';
        irPara(a, 'copa', instantaneo);
        a.removerEm = relogio + 30;
      }
      break;
  }
  if (anotar) registrar(ev, a);
  atualizarEquipe();
}

function definirTarefa(texto) {
  const el = document.getElementById('tarefa');
  if (texto) { el.innerHTML = 'Tarefa: <b></b>'; el.querySelector('b').textContent = texto; }
  else el.textContent = 'Sem tarefa no momento';
}

const registroEl = document.getElementById('registro');
function registrar(ev, a) {
  document.getElementById('registro-vazio').hidden = true;
  const li = document.createElement('li');
  const hora = new Date(ev.ts || Date.now()).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const textos = {
    pedido: `recebeu: ${ev.detalhe}`,
    inicio: `entrou: ${ev.detalhe || a.tipo}`,
    ferramenta: frase(ev.ferramenta, ev.detalhe),
    ferramenta_fim: null,
    erro: `falhou em ${ev.ferramenta || 'ferramenta'}: ${ev.detalhe || ''}`,
    fim: a.principal ? 'concluiu a tarefa' : 'terminou e foi para a copa',
  };
  const t = textos[ev.evento];
  if (!t) return;
  li.innerHTML = '<time></time><span class="txt"><b class="ag"></b> </span>';
  li.querySelector('time').textContent = hora;
  const ag = li.querySelector('.ag');
  ag.textContent = a.nome;
  ag.style.color = a.cor.camisa;
  li.querySelector('.txt').append(t);
  registroEl.prepend(li);
  while (registroEl.children.length > 80) registroEl.lastChild.remove();
}

const equipeEl = document.getElementById('equipe');
function atualizarEquipe() {
  const lista = [...agentes.values()].sort((a, b) => (b.principal - a.principal) || a.nome.localeCompare(b.nome));
  document.getElementById('contagem').textContent = lista.length;
  document.getElementById('equipe-vazia').hidden = lista.length > 0;
  equipeEl.replaceChildren(...lista.map((a) => {
    const li = document.createElement('li');
    li.innerHTML = '<span class="cor"></span><span class="quem"></span><span class="pilula"></span><span class="onde"></span>';
    li.querySelector('.cor').style.background = a.cor.camisa;
    li.querySelector('.quem').textContent = a.nome;
    const e = estadoVisivel(a);
    const p = li.querySelector('.pilula'); p.textContent = e; p.dataset.e = e;
    li.querySelector('.onde').textContent = `${SALAS[a.lugar?.sala]?.nome ?? '—'} · ${a.chamadas} ações`;
    return li;
  }));
}
const estadoVisivel = (a) => (a.rota.length ? 'andando' : a.estado);

// ---------------------------------------------------------------------------
// Desenho: cenário estático num canvas separado, pintado uma vez.
// ---------------------------------------------------------------------------
const canvas = document.getElementById('mundo');
const ctx = canvas.getContext('2d');
const fundo = document.createElement('canvas');
fundo.width = W; fundo.height = H;

const r = (c, x, y, w, h, cor) => { c.fillStyle = cor; c.fillRect(Math.round(x), Math.round(y), w, h); };

function pintarFundo() {
  const c = fundo.getContext('2d');
  // corredor
  r(c, 0, 128, W, 32, '#151b29');
  for (let x = 0; x < W; x += 8) r(c, x, 128 + ((x / 8) % 2) * 2, 8, 1, '#1b2232');
  r(c, 0, 139, W, 10, '#3a2433');
  for (let x = 2; x < W; x += 6) r(c, x, 143, 3, 1, '#4d3044');
  for (const px of [6, 150, 168, 312, 330, 470]) planta(c, px, 152);

  for (const s of Object.values(SALAS)) {
    // piso xadrez
    for (let y = s.y; y < s.y + 128; y += 8) for (let x = s.x; x < s.x + 160; x += 8) {
      r(c, x, y, 8, 8, s.piso[((x + y) / 8) % 2]);
    }
    // parede do fundo com rodapé
    r(c, s.x, s.y, 160, 26, s.parede);
    r(c, s.x, s.y, 160, 2, '#0b0f19');
    for (let x = s.x; x < s.x + 160; x += 10) r(c, x, s.y + 2, 1, 22, 'rgba(0,0,0,.12)');
    r(c, s.x, s.y + 24, 160, 3, '#0f1420');
    // paredes laterais
    r(c, s.x, s.y, 3, 128, '#0b0f19');
    r(c, s.x + 157, s.y, 3, 128, '#0b0f19');
    // porta
    if (s.topo) {
      r(c, s.x, s.y + 125, 160, 3, '#0b0f19');
      r(c, s.cx - 12, s.y + 125, 24, 3, s.piso[0]);
    } else {
      r(c, s.cx - 11, s.y + 2, 22, 23, '#080b12');
      r(c, s.cx - 12, s.y + 1, 24, 2, '#5a4a3a');
      r(c, s.cx - 11, s.y + 24, 22, 3, s.piso[0]);
      r(c, s.x, s.y + 125, 160, 3, '#0b0f19');
    }
    decorar(c, s);
    for (const l of s.lugares) mesa(c, l);
  }
}

function planta(c, x, y) {
  r(c, x - 3, y - 2, 6, 5, '#6b4a33');
  r(c, x - 4, y - 8, 3, 5, '#3f8a4f'); r(c, x + 1, y - 9, 3, 6, '#4fa35f'); r(c, x - 1, y - 11, 2, 8, '#3f8a4f');
}

function decorar(c, s) {
  const { x, y } = s;
  if (s.id === 'biblioteca') {
    for (let i = 0; i < 4; i++) {
      const bx = x + 8 + i * 37;
      if (bx > s.cx - 16 && bx < s.cx + 8) continue;
      r(c, bx, y + 3, 30, 22, '#4a3222');
      for (let prat = 0; prat < 3; prat++) {
        r(c, bx + 1, y + 10 + prat * 7, 28, 1, '#2a1c12');
        for (let k = 0; k < 7; k++) {
          const cores = ['#c0504d', '#4f81bd', '#9bbb59', '#e8c547', '#8064a2', '#d98b4a'];
          r(c, bx + 2 + k * 4, y + 4 + prat * 7, 3, 6, cores[(k + prat + i) % cores.length]);
        }
      }
    }
    r(c, x + 8, y + 112, 40, 8, '#5b2f3a'); // tapete
  }
  if (s.id === 'comando') {
    // telão
    r(c, x + 30, y + 3, 100, 20, '#0a0e18');
    r(c, x + 32, y + 5, 96, 16, '#10233a');
    r(c, x + 34, y + 7, 30, 2, '#f3b94d');
    for (let i = 0; i < 4; i++) r(c, x + 34, y + 11 + i * 2, 20 + ((i * 13) % 40), 1, '#3c6e9a');
  }
  if (s.id === 'oficina') {
    r(c, x + 12, y + 4, 34, 16, '#9ecbff'); r(c, x + 12, y + 4, 34, 16, 'rgba(14,19,32,.55)');
    r(c, x + 28, y + 4, 2, 16, '#2f2a48'); r(c, x + 12, y + 11, 34, 2, '#2f2a48');
    r(c, x + 114, y + 5, 14, 18, '#c29bff'); r(c, x + 116, y + 8, 10, 2, '#2f2a48'); r(c, x + 116, y + 12, 7, 2, '#2f2a48');
    planta(c, x + 148, y + 40);
  }
  if (s.id === 'laboratorio') {
    for (let i = 0; i < 2; i++) {
      const bx = x + 12 + i * 106;
      r(c, bx, y + 6, 32, 18, '#2c4d4a');
      r(c, bx, y + 14, 32, 1, '#1a2e2c');
      for (let k = 0; k < 5; k++) frasco(c, bx + 3 + k * 6, y + 13, ['#74d39a', '#79b8ff', '#ff7a6b', '#f3b94d'][(k + i) % 4]);
    }
    r(c, x + 70, y + 110, 20, 8, '#e8e8e8'); r(c, x + 72, y + 112, 16, 4, '#d0402f'); // kit de emergência
  }
  if (s.id === 'copa') {
    // cafeteira e balcão
    r(c, x + 10, y + 4, 44, 20, '#5a4030'); r(c, x + 10, y + 4, 44, 3, '#7a5a40');
    r(c, x + 14, y + 8, 10, 14, '#2a2a2a'); r(c, x + 16, y + 10, 6, 3, '#d0402f');
    r(c, x + 120, y + 3, 26, 22, '#d9dde3'); r(c, x + 120, y + 13, 26, 1, '#9aa2ad'); r(c, x + 142, y + 6, 2, 5, '#9aa2ad');
    // sofá
    r(c, x + 26, y + 112, 108, 12, '#6b3b5a'); r(c, x + 26, y + 108, 108, 5, '#874a72');
    r(c, x + 22, y + 108, 6, 16, '#5a2f4c'); r(c, x + 132, y + 108, 6, 16, '#5a2f4c');
    // mesinha
    r(c, x + 64, y + 78, 32, 12, '#7a5a40'); r(c, x + 64, y + 90, 32, 3, '#5a4030');
    r(c, x + 72, y + 80, 4, 3, '#ffffff'); r(c, x + 84, y + 81, 4, 3, '#ffffff');
    planta(c, x + 148, y + 50); planta(c, x + 12, y + 50);
  }
  if (s.id === 'revisao') {
    r(c, x + 24, y + 3, 64, 20, '#e8e6df'); r(c, x + 24, y + 3, 64, 1, '#9aa2ad');
    r(c, x + 28, y + 7, 26, 1, '#d0402f'); r(c, x + 28, y + 10, 40, 1, '#4f81bd'); r(c, x + 28, y + 13, 18, 1, '#4f81bd');
    r(c, x + 60, y + 15, 10, 1, '#5fbf7a'); r(c, x + 72, y + 6, 10, 10, 'rgba(95,191,122,.45)');
    r(c, x + 112, y + 6, 22, 16, '#e0a33c'); r(c, x + 114, y + 8, 18, 12, '#f3d27a');
  }
}

function frasco(c, x, y, cor) {
  r(c, x + 1, y - 5, 2, 2, '#cfe7ea'); r(c, x, y - 3, 4, 4, '#cfe7ea'); r(c, x, y - 1, 4, 2, cor);
}

function mesa(c, l) {
  const { x, y } = l;
  if (!l.mesa) return;
  if (l.mesa === 'console') {
    r(c, x - 26, y - 17, 52, 8, '#3a4660'); r(c, x - 26, y - 9, 52, 4, '#252e42');
    for (const dx of [-20, -6, 8]) { r(c, x + dx - 1, y - 30, 14, 12, '#0a0e18'); r(c, x + dx, y - 29, 12, 9, '#10233a'); }
    r(c, x - 22, y - 15, 10, 2, '#f3b94d'); r(c, x + 12, y - 15, 10, 2, '#79b8ff');
    return;
  }
  const tampo = l.mesa === 'bancada' ? '#c9d3d6' : '#8a6a4a';
  const frente = l.mesa === 'bancada' ? '#7f8c90' : '#5f4630';
  r(c, x - 15, y - 16, 30, 7, tampo);
  r(c, x - 15, y - 9, 30, 4, frente);
  r(c, x - 15, y - 5, 2, 3, frente); r(c, x + 13, y - 5, 2, 3, frente);
  if (l.mesa === 'monitor') {
    r(c, x - 7, y - 27, 14, 11, '#0a0e18'); r(c, x - 6, y - 26, 12, 8, '#16203a');
    r(c, x - 1, y - 17, 2, 2, '#0a0e18');
  }
  if (l.mesa === 'leitura') {
    r(c, x + 8, y - 22, 2, 6, '#2a2a2a'); r(c, x + 6, y - 24, 7, 3, '#e8c547'); // abajur
    r(c, x - 11, y - 15, 8, 4, '#4f81bd');
  }
  if (l.mesa === 'bancada') {
    frasco(c, x - 12, y - 15, '#74d39a'); frasco(c, x + 8, y - 15, '#79b8ff');
    r(c, x - 3, y - 22, 6, 6, '#3a4660'); r(c, x - 2, y - 21, 4, 2, '#1a2e2c');
  }
}

// ---------------------------------------------------------------------------
// Desenho dinâmico
// ---------------------------------------------------------------------------
const sentado = (a) => !a.rota.length && a.lugar && a.lugar.mesa && Math.abs(a.x - a.lugar.x) < 1 && Math.abs(a.y - a.lugar.y) < 1;

function desenharMesaViva(a, t) {
  const l = a.lugar;
  if (!sentado(a)) return;
  const { x, y } = l;
  const e = a.estado;
  if (l.mesa === 'monitor' || l.mesa === 'console') {
    const telas = l.mesa === 'console' ? [-20, -6, 8].map((dx) => [x + dx, y - 29, 12, 9]) : [[x - 6, y - 26, 12, 8]];
    for (const [tx, ty, tw, th] of telas) {
      r(ctx, tx, ty, tw, th, e === 'erro' ? '#4a1a1a' : '#173a5c');
      if (['digitando', 'delegando', 'testando', 'lendo'].includes(e)) {
        const rolagem = Math.floor(t * 4);
        for (let i = 0; i < 3; i++) {
          const w = 3 + ((i * 7 + rolagem * 3 + tx) % (tw - 4));
          r(ctx, tx + 1, ty + 1 + i * 2.5, w, 1, ['#74d39a', '#79b8ff', '#f3b94d'][(i + rolagem) % 3]);
        }
      } else {
        r(ctx, tx + 1, ty + 1, 4, 1, '#3c6e9a');
      }
    }
  }
  if (l.mesa === 'leitura' && e === 'lendo') {
    r(ctx, x - 7, y - 15, 6, 5, '#f5f0e2'); r(ctx, x - 1, y - 15, 6, 5, '#ebe5d6');
    if (Math.floor(t * 1.5) % 2) r(ctx, x - 1, y - 15, 1, 5, '#b9b2a3');
    r(ctx, x + 6, y - 21, 7, 4, 'rgba(243,185,77,.35)');
  }
  if (l.mesa === 'bancada') {
    if (e === 'testando' || e === 'digitando') {
      for (let i = 0; i < 3; i++) {
        const fase = (t * 1.6 + i * 0.33) % 1;
        r(ctx, x - 11 + i, y - 20 - fase * 8, 1, 1, '#b8f5cf');
        r(ctx, x + 9 - i, y - 20 - ((fase + 0.5) % 1) * 8, 1, 1, '#cfe6ff');
      }
    }
    const luz = e === 'erro' ? '#ff7a6b' : e === 'testando' ? (Math.floor(t * 3) % 2 ? '#f3b94d' : '#3a4660') : '#74d39a';
    r(ctx, x - 2, y - 21, 4, 2, luz);
  }
}

function desenharBoneco(a, t) {
  const x = Math.round(a.x), y = Math.round(a.y);
  const andando = a.rota.length > 0;
  const { pele, cabelo, camisa, calca } = a.cor;
  const deCostas = sentado(a) ? a.estado !== 'pronto' && a.estado !== 'ocioso' : a.dir === 'n';
  const passo = andando ? Math.floor(t * 8) % 2 : 0;
  const yb = y - (andando ? passo : 0);

  // sombra
  r(ctx, x - 4, y, 8, 1, 'rgba(0,0,0,.35)');
  // pernas
  if (andando) {
    r(ctx, x - 3, yb - 4, 2, 4 - passo, calca); r(ctx, x + 1, yb - 4, 2, 3 + passo, calca);
    r(ctx, x - 3, yb - passo, 2, 1, '#1a1a1a'); r(ctx, x + 1, yb - 1 + passo, 2, 1, '#1a1a1a');
  } else {
    r(ctx, x - 3, yb - 4, 2, 4, calca); r(ctx, x + 1, yb - 4, 2, 4, calca);
    r(ctx, x - 3, yb - 1, 2, 1, '#1a1a1a'); r(ctx, x + 1, yb - 1, 2, 1, '#1a1a1a');
  }
  // tronco
  r(ctx, x - 3, yb - 9, 6, 5, camisa);
  r(ctx, x - 3, yb - 5, 6, 1, 'rgba(0,0,0,.25)');
  // braços
  let bEsq = 0, bDir = 0;
  if (sentado(a) && a.estado === 'digitando') { bEsq = Math.floor(t * 10) % 2; bDir = 1 - bEsq; }
  if (sentado(a) && a.estado === 'delegando') { bEsq = Math.floor(t * 3) % 2 ? 2 : 0; }
  if (sentado(a) && a.estado === 'testando') { bDir = Math.floor(t * 2) % 2 ? 2 : 0; }
  if (andando) { bEsq = passo; bDir = 1 - passo; }
  r(ctx, x - 4, yb - 9 - bEsq, 1, 4, camisa); r(ctx, x - 4, yb - 5 - bEsq, 1, 1, pele);
  r(ctx, x + 3, yb - 9 - bDir, 1, 4, camisa); r(ctx, x + 3, yb - 5 - bDir, 1, 1, pele);
  // caneca na copa
  if (a.estado === 'pronto' && !andando) { r(ctx, x + 4, yb - 7, 2, 3, '#ffffff'); r(ctx, x + 6, yb - 6, 1, 1, '#ffffff'); }
  // cabeça
  r(ctx, x - 3, yb - 15, 6, 6, pele);
  r(ctx, x - 3, yb - 16, 6, 2, cabelo);
  if (deCostas) {
    r(ctx, x - 3, yb - 15, 6, 5, cabelo);
  } else {
    r(ctx, x - 3, yb - 15, 1, 3, cabelo); r(ctx, x + 2, yb - 15, 1, 2, cabelo);
    const pisca = Math.floor(t * 0.7 + hash(a.id) % 7) % 9 === 0 && (t * 7) % 1 < 0.3;
    const off = a.dir === 'w' ? -1 : a.dir === 'e' ? 1 : 0;
    if (!pisca) { r(ctx, x - 2 + off, yb - 12, 1, 1, '#1a1a22'); r(ctx, x + 1 + off, yb - 12, 1, 1, '#1a1a22'); }
  }
  if (a.principal) { r(ctx, x - 2, yb - 17, 4, 1, '#f3b94d'); r(ctx, x - 2, yb - 18, 1, 1, '#f3b94d'); r(ctx, x + 1, yb - 18, 1, 1, '#f3b94d'); }
  // sinal de erro
  if (a.erroAte > relogio && Math.floor(t * 4) % 2) { r(ctx, x - 1, yb - 25, 2, 4, '#ff7a6b'); r(ctx, x - 1, yb - 20, 2, 1, '#ff7a6b'); }
}

function desenharEtiqueta(a) {
  const e = estadoVisivel(a);
  a.el.style.left = `${(a.x / W) * 100}%`;
  a.el.style.top = `${((a.y - 18) / H) * 100}%`;
  // perto das bordas o balão encosta para dentro em vez de ser cortado
  const ancora = a.x < 70 ? 15 : a.x > W - 70 ? 85 : 50;
  if (a.ancora !== ancora) { a.ancora = ancora; a.el.style.transform = `translate(-${ancora}%, -100%)`; a.el.style.alignItems = ancora === 15 ? 'flex-start' : ancora === 85 ? 'flex-end' : 'center'; }
  a.el.dataset.estado = e;
  const balao = e === 'pensando' ? (a.detalhe && a.detalhe !== '…' && relogio - a.ultimo < 2.5 ? a.detalhe : '…')
    : e === 'andando' && a.estado !== 'pronto' ? '' : e === 'ocioso' && relogio - a.ultimo > 8 ? '' : a.detalhe;
  const b = a.el.firstChild;
  if (b.textContent !== balao) b.textContent = balao;
}

// ---------------------------------------------------------------------------
// Laço principal
// ---------------------------------------------------------------------------
const VELOCIDADE_PASSO = 46; // pixels por segundo
let velocidadeMundo = 1;
let pausado = false;
let ultimoQuadro = performance.now();

function quadro(agora) {
  const dt = Math.min(0.1, (agora - ultimoQuadro) / 1000);
  ultimoQuadro = agora;
  if (!pausado) relogio += dt * velocidadeMundo;
  const t = relogio;

  for (const a of [...agentes.values()]) {
    if (a.rota.length && !pausado) {
      let passo = VELOCIDADE_PASSO * velocidadeMundo * dt;
      while (passo > 0 && a.rota.length) {
        const alvo = a.rota[0];
        const dx = alvo.x - a.x, dy = alvo.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.01) a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : (dy > 0 ? 's' : 'n');
        if (dist <= passo) { a.x = alvo.x; a.y = alvo.y; a.rota.shift(); passo -= dist; }
        else { a.x += (dx / dist) * passo; a.y += (dy / dist) * passo; passo = 0; }
      }
      if (!a.rota.length) { a.dir = 's'; atualizarEquipe(); }
    }
    if (a.fimEm && relogio > a.fimEm && a.estado !== 'erro') { a.estado = 'pensando'; a.detalhe = '…'; a.fimEm = null; atualizarEquipe(); }
    // se o fim de uma ferramenta se perder, depois de um tempo parado o agente volta a pensar
    if (['digitando', 'lendo', 'testando'].includes(a.estado) && relogio - a.ultimo > 20) { a.estado = 'pensando'; a.detalhe = '…'; atualizarEquipe(); }
    if (a.estado === 'erro' && a.erroAte < relogio - 1.5 && a.fimEm) { a.estado = 'pensando'; a.fimEm = null; }
    if (a.removerEm && relogio > a.removerEm) remover(a);
  }

  ctx.drawImage(fundo, 0, 0);
  const ordem = [...agentes.values()].sort((p, q) => p.y - q.y);
  for (const a of ordem) desenharMesaViva(a, t);
  for (const a of ordem) desenharBoneco(a, t);
  for (const a of ordem) desenharEtiqueta(a);
  requestAnimationFrame(quadro);
}

function placas() {
  for (const s of Object.values(SALAS)) {
    const p = document.createElement('div');
    p.className = 'placa';
    p.style.setProperty('--cor', s.cor);
    // canto de baixo da sala, longe das mesas; na copa fica à direita do sofá
    p.style.bottom = `${((H - (s.y + 124)) / H) * 100}%`;
    if (s.id === 'copa') p.style.right = `${((W - (s.x + 156)) / W) * 100}%`;
    else p.style.left = `${((s.x + 5) / W) * 100}%`;
    p.textContent = s.nome;
    const sm = document.createElement('small'); sm.textContent = s.papel; p.appendChild(sm);
    camada.appendChild(p);
  }
}

// ---------------------------------------------------------------------------
// Fonte dos eventos: servidor ao vivo (SSE) ou simulação embutida
// ---------------------------------------------------------------------------
const modoEl = document.getElementById('modo');
const modoTxt = document.getElementById('modo-txt');
function definirModo(m, txt) { modoEl.dataset.modo = m; modoTxt.textContent = txt; }

function iniciarSimulacao() {
  definirModo('sim', 'Simulação');
  document.getElementById('controles').hidden = false;
  const sim = criarSimulador((ev) => aplicar(ev));
  const btnPausa = document.getElementById('btn-pausa');
  const btnVel = document.getElementById('btn-vel');
  btnPausa.addEventListener('click', () => {
    pausado = !pausado; sim.pausar(pausado);
    btnPausa.textContent = pausado ? 'Continuar' : 'Pausar';
  });
  const vels = [1, 2, 4];
  btnVel.addEventListener('click', () => {
    velocidadeMundo = vels[(vels.indexOf(velocidadeMundo) + 1) % vels.length];
    sim.definirVelocidade(velocidadeMundo);
    btnVel.textContent = `${velocidadeMundo}x`;
  });
}

function iniciarAoVivo() {
  let aberto = false;
  let es;
  try { es = new EventSource('events'); } catch { iniciarSimulacao(); return; }
  const desistir = setTimeout(() => { if (!aberto) { es.close(); iniciarSimulacao(); } }, 2500);
  es.onopen = () => { aberto = true; clearTimeout(desistir); definirModo('vivo', 'Ao vivo'); };
  es.onerror = () => {
    if (!aberto) { clearTimeout(desistir); es.close(); iniciarSimulacao(); }
    else definirModo('conectando', 'reconectando…');
  };
  es.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.tipo === 'estado') {
      for (const { ultimo } of msg.agentes) aplicar(ultimo, true);
      if (msg.tarefa) definirTarefa(msg.tarefa);
    } else if (msg.tipo === 'evento') {
      if (modoEl.dataset.modo !== 'vivo') definirModo('vivo', 'Ao vivo');
      aplicar(msg.evento);
    }
  };
}

pintarFundo();
placas();
requestAnimationFrame(quadro);
// Modo nuvem: as sessões do Claude Code (inclusive na nuvem) gravam os eventos numa tabela do
// Supabase, e o painel publicado lê as últimas e escuta as novas em tempo real.
// O endereço e a chave pública vêm do config.json ao lado desta página.
const linhaParaEvento = (l) => ({
  ts: Date.parse(l.criado_em), sessao: l.sessao, agente: { id: l.agente_id, tipo: l.agente_tipo },
  evento: l.evento, ferramenta: l.ferramenta ?? undefined, detalhe: l.detalhe ?? undefined,
});

function carregarScript(src) {
  return new Promise((ok, falha) => {
    const s = document.createElement('script');
    s.src = src; s.onload = ok; s.onerror = falha;
    document.head.appendChild(s);
  });
}

function aplicarDaNuvem(ev) {
  const antigo = Date.now() - ev.ts > 5000; // o que já tinha acontecido: põe todo mundo no lugar sem caminhar
  if (antigo && ev.evento === 'fim' && ev.agente.tipo !== 'orquestrador') {
    const a = agentes.get(ev.agente.id);
    if (a) remover(a);
    return;
  }
  aplicar(ev, antigo, true);
}

async function iniciarNuvem(cfg) {
  definirModo('conectando', 'conectando…');
  try {
    await carregarScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js');
  } catch {
    definirModo('conectando', 'sem conexão'); return;
  }
  const db = window.supabase.createClient(cfg.supabaseUrl, cfg.chave);
  const desde = new Date(Date.now() - 20 * 60_000).toISOString();
  const { data } = await db.from('painel_eventos').select('*').gt('criado_em', desde).order('id').limit(800);
  for (const l of data ?? []) aplicarDaNuvem(linhaParaEvento(l));
  db.channel('painel').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'painel_eventos' },
    (m) => aplicarDaNuvem(linhaParaEvento(m.new)))
    .subscribe((st) => {
      if (st === 'SUBSCRIBED') definirModo('vivo', 'Ao vivo · nuvem');
      else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT' || st === 'CLOSED') definirModo('conectando', 'reconectando…');
    });
}

async function iniciar() {
  const q = new URLSearchParams(location.search);
  if (q.has('sim') || location.protocol === 'file:') return iniciarSimulacao();
  if (!q.has('local')) {
    try {
      const cfg = await (await fetch('config.json', { cache: 'no-cache' })).json();
      if (cfg.supabaseUrl && cfg.chave) return iniciarNuvem(cfg);
    } catch { /* sem config.json: painel local */ }
  }
  iniciarAoVivo();
}
iniciar();
